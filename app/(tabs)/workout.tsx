import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Dimensions, Animated, Easing } from 'react-native';
import { useAppStore } from '../../src/store/useAppStore';
import { CheckCircle2, ChevronRight, Activity, Zap, Minus, Plus, Dumbbell, Shield, ArrowUpRight, HelpCircle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EXERCISE_CATEGORIES } from '../../src/engine/exercises';
import { JumpSvg, SquatSvg, ShoulderSvg, CoreSvg, GenericAthleteSvg } from '../../src/components/AnimatedExerciseSvgs';
import ExerciseDetailModal from '../../src/components/ExerciseDetailModal';
import RoutineBlock from '../../src/components/RoutineBlock';
import { WARMUP_ROUTINE, COOLDOWN_ROUTINE, STRETCHING_ROUTINE } from '../../src/engine/routines';
import { useTranslation } from '../../src/i18n/useTranslation';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function WorkoutScreen() {
  const { profile, stats, workoutPhases, finishWorkout, weightLogs } = useAppStore();
  const { t } = useTranslation();

  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  
  const currentPhase = workoutPhases.find((p: any) => p.id === stats.currentPhaseId);
  const phaseExercises = currentPhase?.exercises || [];

  const [completedSets, setCompletedSets] = useState<Record<string, number[]>>({}); // ex.id -> [1, 2, 3]
  const [currentWeights, setCurrentWeights] = useState<Record<string, number | string>>({});
  const [calibrated, setCalibrated] = useState<string[]>([]);

  const [activeRest, setActiveRest] = useState<number | null>(null);
  const [restOverlayVisible, setRestOverlayVisible] = useState(false);
  const [activeIsoTimer, setActiveIsoTimer] = useState<{ exId: string, setNum: number, timeLeft: number } | null>(null);

  const isPhaseA = currentPhase?.id === 'A';
  const isPhaseB = currentPhase?.id === 'B';
  const phaseColor = isPhaseA ? '#FF5A00' : isPhaseB ? '#1E3A8A' : '#FBBF24'; // brand-orange, brand-blue, brand-yellow

  // Prefill weights based on history
  useEffect(() => {
    const prefilled: Record<string, number | string> = {};
    phaseExercises.forEach((ex: any) => {
      if (ex.trackable && weightLogs[ex.id]?.length > 0) {
        prefilled[ex.id] = weightLogs[ex.id][weightLogs[ex.id].length - 1].weight;
      } else {
        prefilled[ex.id] = 0; // default 0 implies it needs initial testing
      }
    });

    const alreadyCalibrated = phaseExercises.filter((e: any) => !e.trackable || (prefilled[e.id] as number) > 0).map((e: any) => e.id);
    setCalibrated(alreadyCalibrated);
    setCurrentWeights(prefilled);
  }, [stats.currentPhaseId]);

  const getDynamicSets = (baseSets: number) => {
    if (profile.level === 'novice') return Math.max(1, baseSets - 1);
    if (profile.level === 'advanced') return baseSets + 1;
    return baseSets;
  };

  const toggleSet = (exId: string, setIndex: number, isTimed: boolean = false, duration: number = 30) => {
    const current = completedSets[exId] || [];
    const isDone = current.includes(setIndex);
    
    // If it's a timed exercise and it's not done, start the active ISO timer instead of instantly marking complete
    if (isTimed && !isDone) {
      if (activeIsoTimer?.exId === exId && activeIsoTimer?.setNum === setIndex) {
         // Stop timer manually
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
      // Trigger Rest Timer
      setActiveRest(60); 
      setRestOverlayVisible(true);
    }
    
    setCompletedSets({ ...completedSets, [exId]: newSets });
  };

  // Rest Timer countdown logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (activeRest !== null && activeRest > 0 && restOverlayVisible) {
      interval = setInterval(() => {
        setActiveRest(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (activeRest === 0) {
      setRestOverlayVisible(false);
    }
    return () => clearInterval(interval);
  }, [activeRest, restOverlayVisible]);

  // Active ISO Timer logic
  useEffect(() => {
    let isoInterval: ReturnType<typeof setInterval>;
    if (activeIsoTimer && activeIsoTimer.timeLeft > 0) {
      isoInterval = setInterval(() => {
        setActiveIsoTimer(prev => {
          if (!prev) return null;
          if (prev.timeLeft <= 1) {
             // Timer finished! Mark set as complete
             const current = completedSets[prev.exId] || [];
             setCompletedSets({ ...completedSets, [prev.exId]: [...current, prev.setNum] });
             
             // Trigger Rest Timer
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

  const handleFinish = () => {
    finishWorkout(currentWeights);
    setCompletedSets({});
    router.push('/(tabs)/telemetry');
  };

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

  return (
    <SafeAreaView className="flex-1 bg-brand-white">
      
      {/* Sticky Progress Header */}
      <View className="pt-4 px-6 pb-5 border-b border-slate-200 bg-white/95 shadow-sm z-10">
        <View className="flex-row justify-between items-center mb-4">
          <View>
             <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t('workout.header')}</Text>
             <Text className="text-2xl font-black text-brand-dark tracking-tight">{t('workout.phase')(currentPhase.id)}</Text>
          </View>
          <View className="bg-slate-100 px-3 py-1.5 rounded-full">
            <Text style={{ color: phaseColor }} className="text-sm font-bold">{totalExercisesDone}/{phaseExercises.length}</Text>
          </View>
        </View>
        <View className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <View 
            style={{ width: `${(totalExercisesDone / Math.max(1, phaseExercises.length)) * 100}%`, backgroundColor: phaseColor }} 
            className="h-full rounded-full transition-all duration-500" 
          />
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

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

           if (ex.category === 'power') {
             iconBg = 'bg-brand-orange/10';
             textColor = 'text-brand-orange';
             iconColor = '#FF5A00';
           } else if (ex.category.includes('injury')) {
             iconBg = 'bg-emerald-500/10';
             textColor = 'text-emerald-500';
             iconColor = '#10B981';
           }

          return (
            <View key={ex.id} className={`mb-5 rounded-3xl border transition-all duration-300 ${isDone ? 'border-brand-blue opacity-70 bg-brand-blue/5' : 'border-slate-200 bg-white shadow-md shadow-brand-blue/5'}`}>
              
              {/* Exercise Header & Details */}
              <View className="p-5 flex-row items-center gap-4">
                <View className="flex-1">
                  <View className="flex-row gap-2 items-center mb-2">
                    <View className={`px-2.5 py-1 flex-row items-center gap-1.5 rounded-lg ${iconBg}`}>
                       <IconComponent size={16} color={iconColor} />
                       <Text className={`text-[10px] font-bold uppercase tracking-widest ${textColor}`}>{ex.category.replace('_', ' ')}</Text>
                    </View>
                  </View>
                  <Text className={`font-bold text-xl leading-tight mb-2 ${isDone ? 'text-slate-400 line-through' : 'text-brand-dark'}`}>{t(`exercises.${ex.id}.name`) !== `exercises.${ex.id}.name` ? t(`exercises.${ex.id}.name`) : ex.name}</Text>
                  
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

              {/* ? Help Button */}
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
                  
                  // Detect isometric/timed from name or static duration setting
                  const isTimed = ex.name.toLowerCase().includes('wall sit') || ex.name.toLowerCase().includes('plank') || !!ex.duration;
                  const duration = ex.duration || parseInt(ex.reps) || 30; // fallback parsing

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

              {/* Weight Tracking & Calibration */}
              {ex.trackable && !isDone && (
                <View className="border-t border-slate-100 bg-slate-50/50 p-5 rounded-b-3xl">
                   {!calibrated.includes(ex.id) ? (
                      <View className="items-center justify-center p-2 mb-2">
                        <Text className="text-brand-dark font-black text-center text-lg mb-2">{t('workout.newDrillTitle')}</Text>
                        <Text className="text-slate-500 font-medium text-center text-sm mb-4">{t('workout.newDrillBody')(ex.name, ex.reps)}</Text>
                        <View className="flex-row items-center gap-3">
                           <TouchableOpacity onPress={() => setCalibrated([...calibrated, ex.id])} className="px-4 py-3 bg-white border border-slate-200 rounded-xl flex-1 items-center">
                              <Text className="text-slate-500 font-bold">{t('workout.skipCalibrate')}</Text>
                           </TouchableOpacity>
                           <View className="flex-row items-center bg-white rounded-xl border border-brand-orange shadow-sm flex-1">
                              <TextInput 
                                value={currentWeights[ex.id]?.toString() || ''}
                                onChangeText={t => setCurrentWeights({...currentWeights, [ex.id]: t})}
                                placeholder="0"
                                keyboardType="numeric"
                                className="flex-1 text-center text-brand-orange font-black text-xl p-3"
                              />
                               <View className="bg-brand-orange/10 px-2 py-3 rounded-r-xl border-l border-brand-orange/20 h-full justify-center">
                                  <Text className="text-brand-orange font-bold text-xs uppercase">{profile.units === 'metric' ? 'kg' : 'lb'}</Text>
                               </View>
                           </View>
                           <TouchableOpacity 
                               onPress={() => setCalibrated([...calibrated, ex.id])}
                               disabled={!currentWeights[ex.id]} 
                               className={`px-4 py-3 rounded-xl flex-1 items-center ${currentWeights[ex.id] ? 'bg-brand-orange' : 'bg-slate-200'}`}
                            >
                               <Text className="text-white font-bold">{t('workout.setBaseline')}</Text>
                           </TouchableOpacity>
                        </View>
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

        {/* Cooldown Block */}
        <RoutineBlock
          title={t('routine.cooldown')}
          subtitle={t('routine.optional')}
          items={COOLDOWN_ROUTINE}
          category="cooldown"
        />

        {/* Stretching Block */}
        <RoutineBlock
          title={t('routine.stretching')}
          subtitle={t('routine.optional')}
          items={STRETCHING_ROUTINE}
          category="stretching"
        />

        {allDone && (
          <TouchableOpacity 
            onPress={handleFinish}
            className="w-full bg-brand-orange py-5 rounded-2xl flex-row items-center justify-center gap-2 mt-4 mb-8 shadow-xl shadow-brand-orange/30 transition-transform active:scale-95"
          >
            <Text className="text-white font-black text-xl tracking-tight">{t('workout.returnLocker')}</Text>
            <ChevronRight color="#ffffff" size={24} strokeWidth={3} />
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Floating Rest Timer Overlay */}
      {restOverlayVisible && activeRest !== null && (
        <View className="absolute bottom-24 self-center bg-brand-dark px-6 py-4 rounded-full shadow-2xl flex-row items-center justify-between shadow-brand-dark/50" style={{ width: width * 0.85 }}>
           <View className="flex-row items-center gap-3">
             <Activity color="#FF5A00" size={24} />
             <View>
                <Text className="text-white font-black text-xl leading-tight">Rest Session</Text>
                <Text className="text-slate-400 font-bold text-xs uppercase tracking-widest">Recovery Phase</Text>
             </View>
           </View>
           <View className="bg-white/10 px-4 py-2 rounded-xl border border-white/20">
             <Text className="text-brand-orange font-black text-2xl">{activeRest}s</Text>
           </View>
           <TouchableOpacity onPress={() => setRestOverlayVisible(false)} className="absolute -top-3 -right-3 bg-slate-800 rounded-full p-2 border border-slate-700">
             <CheckCircle2 color="#94a3b8" size={16} />
           </TouchableOpacity>
        </View>
      )}
      {/* Exercise Detail Modal */}
      <ExerciseDetailModal
        exercise={selectedExercise}
        visible={!!selectedExercise}
        onClose={() => setSelectedExercise(null)}
      />

    </SafeAreaView>
  );
}
