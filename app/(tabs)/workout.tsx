import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Dimensions, Modal } from 'react-native';
import { useAppStore } from '../../src/store/useAppStore';
import { CheckCircle2, ChevronRight, Activity, Zap, Minus, Plus, Dumbbell, Shield, ArrowUpRight, HelpCircle, RefreshCw, Trophy, Sparkles, X, Volume2 } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EXERCISES, EXERCISE_CATEGORIES } from '../../src/engine/exercises';
import { JumpSvg, SquatSvg, ShoulderSvg, CoreSvg, GenericAthleteSvg } from '../../src/components/AnimatedExerciseSvgs';
import ExerciseDetailModal from '../../src/components/ExerciseDetailModal';
import RoutineBlock from '../../src/components/RoutineBlock';
import { WARMUP_ROUTINE, COOLDOWN_ROUTINE, STRETCHING_ROUTINE } from '../../src/engine/routines';
import { useTranslation } from '../../src/i18n/useTranslation';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const playCompletionChime = () => {
  try {
    if (typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch (e) {}
};

export default function WorkoutScreen() {
  const { profile, stats, workoutPhases, finishWorkout, weightLogs, workoutHistory } = useAppStore();
  const { t, language } = useTranslation();

  // Check if today's workout is already done
  const today = new Date();
  const todayYmd = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  const todayDone = (workoutHistory || []).includes(todayYmd);

  const [sessionStartTime] = useState<number>(Date.now());
  const [extraMode, setExtraMode] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [swapTarget, setSwapTarget] = useState<any>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  
  const currentPhase = workoutPhases.find((p: any) => p.id === stats.currentPhaseId);
  const phaseExercises = currentPhase?.exercises || [];

  const [completedSets, setCompletedSets] = useState<Record<string, number[]>>({});
  const [currentWeights, setCurrentWeights] = useState<Record<string, number | string>>({});
  const [calibrated, setCalibrated] = useState<string[]>([]);
  const [painRatings, setPainRatings] = useState<Record<string, number>>({});

  const [activeRest, setActiveRest] = useState<number | null>(null);
  const [restOverlayVisible, setRestOverlayVisible] = useState(false);
  const [activeIsoTimer, setActiveIsoTimer] = useState<{ exId: string, setNum: number, timeLeft: number } | null>(null);

  const isPhaseA = currentPhase?.id === 'A';
  const isPhaseB = currentPhase?.id === 'B';
  const phaseColor = isPhaseA ? '#FF5A00' : isPhaseB ? '#1E3A8A' : '#FBBF24';

  useEffect(() => {
    const prefilled: Record<string, number | string> = {};
    phaseExercises.forEach((ex: any) => {
      if (ex.trackable && weightLogs[ex.id]?.length > 0) {
        prefilled[ex.id] = weightLogs[ex.id][weightLogs[ex.id].length - 1].weight;
      } else {
        prefilled[ex.id] = 0;
      }
    });

    const alreadyCalibrated = phaseExercises.filter((e: any) => !e.trackable || (prefilled[e.id] as number) > 0).map((e: any) => e.id);
  const [adminTapCount, setAdminTapCount] = useState(0);
  const [showAdminToast, setShowAdminToast] = useState(false);

  const getDynamicSets = (baseSets: number) => {
    if (profile.level === 'novice') return Math.max(1, baseSets - 1);
    if (profile.level === 'advanced') return baseSets + 1;
    return baseSets;
  };

  const autoCompleteAll = () => {
    const allSets: Record<string, number[]> = {};
    phaseExercises.forEach((ex: any) => {
      const totalSets = getDynamicSets(ex.sets);
      allSets[ex.id] = Array.from({ length: totalSets }, (_, i) => i + 1);
    });
    setCompletedSets(allSets);
    setShowAdminToast(true);
    setTimeout(() => setShowAdminToast(false), 3000);
  };

  // Expose admin cheatcodes on window & keyboard shortcuts (Shift+D or `)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).autoCompleteWorkout = autoCompleteAll;
      (window as any).autoFinishWorkout = autoCompleteAll;
      (window as any).cheatAddSpikes = (amount: number = 1000) => {
        useAppStore.getState().awardSpikes(amount);
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === '`' || (e.shiftKey && (e.key === 'D' || e.key === 'd'))) {
          autoCompleteAll();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [phaseExercises, profile.level]);

  const handleHeaderTap = () => {
    if (adminTapCount + 1 >= 3) {
      setAdminTapCount(0);
      autoCompleteAll();
    } else {
      setAdminTapCount(prev => prev + 1);
      setTimeout(() => setAdminTapCount(0), 2000);
    }
  };

  const toggleSet = (exId: string, setIndex: number, isTimed: boolean = false, duration: number = 30) => {
    const current = completedSets[exId] || [];
    const isDone = current.includes(setIndex);
    
    if (isTimed && !isDone) {
      if (activeIsoTimer?.exId === exId && activeIsoTimer?.setNum === setIndex) {
         setActiveIsoTimer(null);
      } else {
         setActiveIsoTimer({ exId, setNum: setIndex, timeLeft: duration });
      }
      return; 
    }

    let newSets;
    if (isDone) {
      newSets = current.filter(i => i !== setIndex);
    } else {
      newSets = [...current, setIndex];
      setActiveRest(60); 
      setRestOverlayVisible(true);
    }
    
    setCompletedSets({ ...completedSets, [exId]: newSets });
  };

  // Rest Timer countdown
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (activeRest !== null && activeRest > 0 && restOverlayVisible) {
      interval = setInterval(() => {
        setActiveRest(prev => {
          if (prev !== null && prev === 1) {
            playCompletionChime();
          }
          return (prev !== null && prev > 0 ? prev - 1 : 0);
        });
      }, 1000);
    } else if (activeRest === 0) {
      setRestOverlayVisible(false);
    }
    return () => clearInterval(interval);
  }, [activeRest, restOverlayVisible]);

  // Active ISO Timer
  useEffect(() => {
    let isoInterval: ReturnType<typeof setInterval>;
    if (activeIsoTimer && activeIsoTimer.timeLeft > 0) {
      isoInterval = setInterval(() => {
        setActiveIsoTimer(prev => {
          if (!prev) return null;
          if (prev.timeLeft <= 1) {
             playCompletionChime();
             const current = completedSets[prev.exId] || [];
             setCompletedSets({ ...completedSets, [prev.exId]: [...current, prev.setNum] });
             setActiveRest(60); 
             setRestOverlayVisible(true);
             return null;
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(isoInterval);
  }, [activeIsoTimer, completedSets]);

  const adjustWeight = (id: string, amount: number) => {
    setCurrentWeights(prev => ({
      ...prev,
      [id]: Math.max(0, (parseFloat(prev[id] as string) || 0) + amount)
    }));
  };

  const isExerciseComplete = (ex: any) => {
    const totalSets = getDynamicSets(ex.sets);
    return (completedSets[ex.id]?.length || 0) === totalSets;
  };

  const totalExercisesDone = phaseExercises.filter(isExerciseComplete).length;
  const allDone = totalExercisesDone === phaseExercises.length && phaseExercises.length > 0;

  // Exercise Swap logic
  const handleSwap = (oldExId: string, newEx: any) => {
    const updatedExercises = phaseExercises.map((e: any) => e.id === oldExId ? newEx : e);
    const updatedPhases = workoutPhases.map((p: any) => p.id === currentPhase.id ? { ...p, exercises: updatedExercises } : p);
    useAppStore.setState({ workoutPhases: updatedPhases });
    setSwapTarget(null);
  };

  const handleFinish = () => {
    if (!allDone) return;
    setShowCelebration(true);
  };

  const confirmFinish = () => {
    finishWorkout(currentWeights);
    setCompletedSets({});
    setShowCelebration(false);
    router.push('/(tabs)/telemetry');
  };

  if (phaseExercises.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center p-6">
        <View className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 items-center">
          <Activity size={48} color="#94a3b8" className="mb-4" />
          <Text className="text-slate-500 font-medium text-center text-lg">{t('workout.assessmentPrompt')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Get replacement options for swap
  const swapOptions = swapTarget ? Object.values(EXERCISES).filter(e => e.id !== swapTarget.id && (e.category === swapTarget.category || e.category === 'knee_revalidation' || e.category === 'shoulder_prehab')).slice(0, 6) : [];

  return (
    <SafeAreaView className="flex-1 bg-brand-white">
      
      {/* Sticky Progress Header */}
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={handleHeaderTap}
        className="pt-4 px-6 pb-5 border-b border-slate-200 bg-white/95 shadow-sm z-10"
      >
        <View className="flex-row justify-between items-center mb-4">
          <View>
             <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t('workout.header')}</Text>
             <Text className="text-2xl font-black text-brand-dark tracking-tight">{t('workout.phase')(currentPhase.id)}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            {showAdminToast && (
              <View style={{ backgroundColor: '#F59E0B', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                <Text style={{ color: '#ffffff', fontSize: 10, fontWeight: '900', letterSpacing: 0.5 }}>⚡ DEBUG: AUTO-DONE</Text>
              </View>
            )}
            <View className="bg-slate-100 px-3 py-1.5 rounded-full">
              <Text style={{ color: phaseColor }} className="text-sm font-bold">{totalExercisesDone}/{phaseExercises.length}</Text>
            </View>
          </View>
        </View>
        <View className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <View 
            style={{ width: `${(totalExercisesDone / Math.max(1, phaseExercises.length)) * 100}%`, backgroundColor: phaseColor }} 
            className="h-full rounded-full transition-all duration-500" 
          />
        </View>
      </TouchableOpacity>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Today-done completion banner */}
        {todayDone && !extraMode && (
          <View style={{ backgroundColor: '#F0FDF4', borderRadius: 20, padding: 20, marginBottom: 20, borderWidth: 2, borderColor: '#86EFAC', alignItems: 'center' }}>
            <Text style={{ fontSize: 36, marginBottom: 8 }}>🏆</Text>
            <Text style={{ fontSize: 20, fontWeight: '900', color: '#15803D', marginBottom: 4 }}>
              {language === 'nl' ? 'Training Compleet!' : 'Workout Complete!'}
            </Text>
            <Text style={{ fontSize: 14, color: '#166534', fontWeight: '600', textAlign: 'center', marginBottom: 16 }}>
              {language === 'nl' ? 'Je hebt vandaag al getraind. Goed bezig! 💪' : "You've already trained today. Great work! 💪"}
            </Text>
            <TouchableOpacity
              onPress={() => setExtraMode(true)}
              style={{ backgroundColor: '#1E3A8A', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', gap: 8 }}
            >
              <Dumbbell size={18} color="#ffffff" />
              <Text style={{ color: '#ffffff', fontWeight: '900', fontSize: 16 }}>
                {language === 'nl' ? 'Extra Oefenen' : 'Extra Practice'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Extra mode banner */}
        {todayDone && extraMode && (
          <View style={{ backgroundColor: '#EFF6FF', borderRadius: 16, padding: 14, marginBottom: 16, borderWidth: 1.5, borderColor: '#BFDBFE', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ color: '#1E3A8A', fontWeight: '800', fontSize: 14 }}>
              {language === 'nl' ? '💪 Extra Oefensessie' : '💪 Bonus Practice Session'}
            </Text>
            <TouchableOpacity onPress={() => setExtraMode(false)} style={{ padding: 4 }}>
              <Text style={{ color: '#3B82F6', fontSize: 13, fontWeight: '700' }}>✕ Stop</Text>
            </TouchableOpacity>
          </View>
        )}

        {(!todayDone || extraMode) && (
          <>
        {/* Warmup Block */}
        <RoutineBlock
          title={t('routine.warmup')}
          subtitle={t('routine.optional')}
          items={WARMUP_ROUTINE}
          category="warmup"
          defaultExpanded={true}
        />

        {phaseExercises.map((ex: any) => {
          const totalDynamicSets = getDynamicSets(ex.sets);
          const isDone = isExerciseComplete(ex);
          
          let IconComponent: any = GenericAthleteSvg;
          if (ex.visual === 'JumpSvg') IconComponent = JumpSvg;
          if (ex.visual === 'SquatSvg') IconComponent = SquatSvg;
          if (ex.visual === 'ShoulderSvg') IconComponent = ShoulderSvg;
          if (ex.visual === 'CoreSvg') IconComponent = CoreSvg;

          let iconBg = 'bg-brand-blue/10';
          let textColor = 'text-brand-blue';
          let iconColor = '#1E3A8A';

           if (ex.category === 'knee_revalidation') {
             iconBg = 'bg-indigo-500/10';
             textColor = 'text-indigo-600';
             iconColor = '#6366F1';
           } else if (ex.category === 'power' || ex.category === 'vertical_jump') {
             iconBg = 'bg-brand-orange/10';
             textColor = 'text-brand-orange';
             iconColor = '#FF5A00';
           }

          return (
            <View key={ex.id} className={`mb-5 rounded-3xl border transition-all duration-300 ${isDone ? 'border-brand-blue opacity-70 bg-brand-blue/5' : 'border-slate-200 bg-white shadow-md shadow-brand-blue/5'}`}>
              
              {/* Exercise Header & Details */}
              <View className="p-5 flex-row items-center gap-4">
                <View className="flex-1">
                  <View className="flex-row gap-2 items-center justify-between mb-2">
                    <View className={`px-2.5 py-1 flex-row items-center gap-1.5 rounded-lg ${iconBg}`}>
                       <IconComponent size={16} color={iconColor} />
                       <Text className={`text-[10px] font-bold uppercase tracking-widest ${textColor}`}>{EXERCISE_CATEGORIES[ex.category as keyof typeof EXERCISE_CATEGORIES]?.label || ex.category.replace('_', ' ')}</Text>
                    </View>

                    {/* Exercise Swap Trigger */}
                    <TouchableOpacity onPress={() => setSwapTarget(ex)} className="flex-row items-center gap-1 bg-slate-100 px-2 py-1 rounded-md">
                      <RefreshCw size={12} color="#64748b" />
                      <Text className="text-[10px] font-bold text-slate-500 uppercase">{language === 'nl' ? 'Wissel' : 'Swap'}</Text>
                    </TouchableOpacity>
                  </View>

                  <Text className={`font-bold text-xl leading-tight mb-2 ${isDone ? 'text-slate-400 line-through' : 'text-brand-dark'}`}>{ex.name}</Text>
                  
                  <View className="flex-row items-center gap-3 mt-1">
                    <View className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">
                      <Text className="text-slate-500 font-bold text-sm tracking-wide">{t('workout.setsReps')(totalDynamicSets, ex.reps)}</Text>
                    </View>
                    {ex.equipment === 'dumbbells' && (
                       <View className="flex-row items-center gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-xl">
                         <Dumbbell size={14} color="#64748b" />
                         <Text className="text-slate-500 font-bold text-xs uppercase">DB</Text>
                       </View>
                    )}
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setSelectedExercise(ex)}
                className="p-2 bg-slate-50 border border-slate-200 rounded-full hover:bg-slate-100"
              >
                <HelpCircle size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>

              {/* Per-Set Tracking Bubbles */}
              <View className="px-5 pb-5 flex-row gap-2">
                {Array.from({ length: totalDynamicSets }).map((_, idx) => {
                  const setNum = idx + 1;
                  const setCompleted = (completedSets[ex.id] || []).includes(setNum);
                  const isTimed = ex.name.toLowerCase().includes('sit') || ex.name.toLowerCase().includes('plank') || ex.name.toLowerCase().includes('hold') || !!ex.duration;
                  const duration = ex.duration || parseInt(ex.reps) || 30;
                  const isActiveTimer = activeIsoTimer?.exId === ex.id && activeIsoTimer?.setNum === setNum;

                  return (
                    <TouchableOpacity
                      key={`set-${ex.id}-${setNum}`}
                      onPress={() => toggleSet(ex.id, setNum, isTimed, duration)}
                      className={`flex-1 py-3 rounded-xl border-2 items-center justify-center transition-all ${
                        setCompleted 
                          ? 'bg-brand-orange border-brand-orange shadow-sm' 
                          : isActiveTimer
                          ? 'bg-red-50 border-red-500 shadow-sm'
                          : 'bg-slate-50 border-slate-200 hover:border-brand-orange hover:bg-orange-50'
                      }`}
                    >
                      {setCompleted ? (
                        <CheckCircle2 color="#ffffff" size={18} />
                      ) : isActiveTimer ? (
                        <Text className="font-black text-red-500 text-sm tracking-tighter">{activeIsoTimer.timeLeft}s</Text>
                      ) : (
                        <Text className="font-bold text-slate-400 text-sm">{isTimed ? 'Start' : setNum}</Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Knee Comfort & Pain Rating Scale */}
              {ex.category === 'knee_revalidation' && (
                <View className="px-5 pb-4 border-t border-slate-100 pt-3">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{language === 'nl' ? 'Knie-Pijn / Discomfort (0 - 10)' : 'Knee Discomfort Rating (0 - 10)'}</Text>
                    <Text className="font-extrabold text-xs text-indigo-600">{painRatings[ex.id] !== undefined ? `${painRatings[ex.id]}/10` : (language === 'nl' ? 'Niet beoordeeld' : 'Not rated')}</Text>
                  </View>
                  <View className="flex-row justify-between gap-1">
                    {[0, 2, 4, 6, 8, 10].map(rating => (
                      <TouchableOpacity
                        key={rating}
                        onPress={() => setPainRatings({ ...painRatings, [ex.id]: rating })}
                        className={`flex-1 py-1.5 rounded-lg items-center border ${
                          painRatings[ex.id] === rating 
                            ? rating > 3 ? 'bg-red-500 border-red-600 text-white' : 'bg-indigo-600 border-indigo-700 text-white' 
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <Text className={`font-bold text-xs ${painRatings[ex.id] === rating ? 'text-white' : 'text-slate-500'}`}>{rating}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {painRatings[ex.id] !== undefined && painRatings[ex.id] > 3 && (
                    <View className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl flex-row items-center gap-2">
                      <Shield color="#d97706" size={16} />
                      <Text className="text-amber-800 text-xs font-semibold flex-1">
                        {language === 'nl' 
                          ? '💡 Pijn > 3: Verminder de buigingshoek (bijv. 60° → 30°) of stap over op een rustigere isometrische hold.' 
                          : '💡 Pain > 3: Reduce knee flexion angle (e.g. 60° → 30°) or switch to a lighter isometric hold.'}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {/* Weight Tracking */}
              {ex.trackable && !isDone && (
                <View className="border-t border-slate-100 bg-slate-50/50 p-5 rounded-b-3xl">
                   {!calibrated.includes(ex.id) ? (
                      <View style={{ gap: 10 }}>
                        <Text style={{ textAlign: 'center', fontWeight: '900', fontSize: 16, color: '#0F172A', marginBottom: 2 }}>{t('workout.newDrillTitle')}</Text>
                        <Text style={{ textAlign: 'center', fontWeight: '500', fontSize: 13, color: '#64748B', marginBottom: 6 }}>{t('workout.newDrillBody')(ex.name, ex.reps)}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 14, borderWidth: 2, borderColor: '#FF5A00', overflow: 'hidden' }}>
                          <TextInput
                            value={currentWeights[ex.id]?.toString() || ''}
                            onChangeText={v => setCurrentWeights({...currentWeights, [ex.id]: v})}
                            placeholder="0"
                            keyboardType="numeric"
                            style={{ flex: 1, textAlign: 'center', color: '#FF5A00', fontWeight: '900', fontSize: 28, paddingVertical: 14 }}
                          />
                          <View style={{ backgroundColor: '#FFF7F0', paddingHorizontal: 16, paddingVertical: 14, borderLeftWidth: 1.5, borderLeftColor: '#FFD4B3' }}>
                            <Text style={{ color: '#FF5A00', fontWeight: '700', fontSize: 14 }}>{profile.units === 'metric' ? 'kg' : 'lb'}</Text>
                          </View>
                        </View>
                        <TouchableOpacity
                          onPress={() => setCalibrated([...calibrated, ex.id])}
                          disabled={!currentWeights[ex.id]}
                          style={{ backgroundColor: currentWeights[ex.id] ? '#FF5A00' : '#E2E8F0', borderRadius: 14, paddingVertical: 16, alignItems: 'center' }}
                        >
                          <Text style={{ color: currentWeights[ex.id] ? '#ffffff' : '#94A3B8', fontWeight: '900', fontSize: 16 }}>{t('workout.setBaseline')}</Text>
                        </TouchableOpacity>
                      </View>
                   ) : (
                    <View className="flex-row items-center justify-between">
                      <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{t('workout.logLoad')(profile.units === 'metric' ? 'kg' : 'lb')}</Text>
                      
                      <View className="flex-row items-center bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
                        <TouchableOpacity onPress={() => adjustWeight(ex.id, -2.5)} className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg">
                          <Minus size={18} color="#64748b" />
                        </TouchableOpacity>
                        
                        <TextInput 
                          value={currentWeights[ex.id]?.toString() || '0'}
                          onChangeText={t => setCurrentWeights({...currentWeights, [ex.id]: t})}
                          keyboardType="numeric"
                          className="w-16 text-center text-brand-dark font-black text-xl p-0"
                        />
                        
                        <TouchableOpacity onPress={() => adjustWeight(ex.id, 2.5)} className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg">
                          <Plus size={18} color="#64748b" />
                        </TouchableOpacity>
                      </View>
                    </View>
                   )}
                </View>
              )}
            </View>
          );
        })}

        <RoutineBlock title={t('routine.cooldown')} subtitle={t('routine.optional')} items={COOLDOWN_ROUTINE} category="cooldown" />
        <RoutineBlock title={t('routine.stretching')} subtitle={t('routine.optional')} items={STRETCHING_ROUTINE} category="stretching" />
          </>
        )}

        {/* Finish Button */}
        <TouchableOpacity
          disabled={!allDone}
          onPress={handleFinish}
          style={{
            width: '100%',
            backgroundColor: allDone ? '#FF5A00' : '#E2E8F0',
            opacity: allDone ? 1 : 0.6,
            borderRadius: 18,
            paddingVertical: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginTop: 16,
            marginBottom: 32,
          }}
        >
          <Text style={{ color: allDone ? '#ffffff' : '#94A3B8', fontWeight: '900', fontSize: 18, letterSpacing: 0.3 }}>
            {t('workout.returnLocker')}
          </Text>
          <ChevronRight color={allDone ? '#ffffff' : '#94A3B8'} size={22} strokeWidth={3} />
        </TouchableOpacity>
      </ScrollView>

      {/* Floating Rest Timer Overlay with Controls */}
      {restOverlayVisible && activeRest !== null && (
        <View className="absolute bottom-24 self-center bg-brand-dark px-6 py-4 rounded-3xl shadow-2xl flex-row items-center justify-between shadow-brand-dark/50" style={{ width: width * 0.9 }}>
           <View className="flex-row items-center gap-3">
             <Activity color="#FF5A00" size={24} />
             <View>
                <Text className="text-white font-black text-lg leading-tight">Rest Period</Text>
                <Text className="text-slate-400 font-bold text-xs uppercase">Recovery Phase</Text>
             </View>
           </View>

           <View className="flex-row items-center gap-2">
             <TouchableOpacity onPress={() => setActiveRest(r => Math.max(0, (r || 0) - 15))} className="px-2.5 py-1.5 bg-white/10 rounded-lg">
               <Text className="text-white font-bold text-xs">-15s</Text>
             </TouchableOpacity>
             <View className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
               <Text className="text-brand-orange font-black text-xl">{activeRest}s</Text>
             </View>
             <TouchableOpacity onPress={() => setActiveRest(r => (r || 0) + 15)} className="px-2.5 py-1.5 bg-white/10 rounded-lg">
               <Text className="text-white font-bold text-xs">+15s</Text>
             </TouchableOpacity>
             <TouchableOpacity onPress={() => setRestOverlayVisible(false)} className="px-2.5 py-1.5 bg-brand-orange rounded-lg ml-1">
               <Text className="text-white font-bold text-xs">{language === 'nl' ? 'Skip' : 'Skip'}</Text>
             </TouchableOpacity>
           </View>
        </View>
      )}

      {/* Exercise Swap Modal */}
      <Modal visible={!!swapTarget} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[36px] p-6 max-h-[80%]">
            <View className="flex-row justify-between items-center mb-4">
              <View>
                <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest">{language === 'nl' ? 'Oefening Wisselen' : 'Swap Exercise'}</Text>
                <Text className="text-xl font-black text-brand-dark">{swapTarget?.name}</Text>
              </View>
              <TouchableOpacity onPress={() => setSwapTarget(null)} className="p-2 bg-slate-100 rounded-full">
                <X size={20} color="#64748b" />
              </TouchableOpacity>
            </View>
            <Text className="text-slate-500 text-sm mb-4 font-medium">{language === 'nl' ? 'Kies een alternatieve oefening met vergelijkbare spiergroep focus:' : 'Choose a target-equivalent alternative exercise:'}</Text>
            <ScrollView showsVerticalScrollIndicator={false} className="space-y-3">
              {swapOptions.map((opt: any) => (
                <TouchableOpacity key={opt.id} onPress={() => handleSwap(swapTarget.id, opt)} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex-row items-center justify-between mb-2">
                  <View className="flex-1 mr-3">
                    <Text className="font-bold text-brand-dark text-base">{opt.name}</Text>
                    <Text className="text-slate-400 text-xs mt-0.5">{opt.purpose}</Text>
                  </View>
                  <View className="bg-brand-orange/10 px-3 py-1.5 rounded-xl">
                    <Text className="text-brand-orange font-bold text-xs">{language === 'nl' ? 'Selecteer' : 'Select'}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Celebration Summary Modal */}
      <Modal visible={showCelebration} transparent animationType="fade">
        <View className="flex-1 bg-black/60 items-center justify-center p-6">
          <View className="bg-white w-full max-w-md rounded-[36px] p-8 items-center border border-slate-100 shadow-2xl">
            <View className="w-20 h-20 bg-brand-orange/10 rounded-full items-center justify-center mb-4">
              <Trophy size={44} color="#FF5A00" />
            </View>

            <Text className="text-3xl font-black text-brand-dark text-center mb-1">{language === 'nl' ? 'Sessie Voltooid!' : 'Session Complete!'}</Text>
            <Text className="text-slate-500 font-medium text-center text-sm mb-6">{language === 'nl' ? 'Super werk op het veld! Je knieën en spieren worden elke dag sterker.' : 'Awesome work on the court! Your knees and muscles get stronger every day.'}</Text>

            <View className="flex-row gap-3 w-full mb-6">
              <View className="flex-1 bg-slate-50 border border-slate-200 p-4 rounded-2xl items-center">
                <Sparkles size={20} color="#FF5A00" />
                <Text className="text-2xl font-black text-brand-dark mt-1">+{useAppStore.getState().mode === 'fun' ? 100 : 50}</Text>
                <Text className="text-[10px] font-bold text-slate-400 uppercase">Spikes</Text>
              </View>
              <View className="flex-1 bg-slate-50 border border-slate-200 p-4 rounded-2xl items-center">
                <Zap size={20} color="#1E3A8A" />
                <Text className="text-2xl font-black text-brand-dark mt-1">{stats.streak + 1}</Text>
                <Text className="text-[10px] font-bold text-slate-400 uppercase">Streak</Text>
              </View>
            </View>

            <TouchableOpacity onPress={confirmFinish} className="w-full bg-brand-orange py-4 rounded-2xl items-center justify-center shadow-lg shadow-brand-orange/30">
              <Text className="text-white font-bold text-lg">{language === 'nl' ? 'Naar Statistieken' : 'View Performance'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ExerciseDetailModal
        exercise={selectedExercise}
        visible={!!selectedExercise}
        onClose={() => setSelectedExercise(null)}
      />

    </SafeAreaView>
  );
}

