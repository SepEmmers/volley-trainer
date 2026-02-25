import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, Easing, Platform } from 'react-native';
import { useAppStore } from '../../src/store/useAppStore';
import { Trophy, Activity, Calendar, Clock, Play, RefreshCw, BarChart3, Medal, ArrowUpRight, HeartPulse, Zap } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Svg, { Circle, Path } from 'react-native-svg';
import { useTranslation } from '../../src/i18n/useTranslation';

const BouncingVolleyball = () => {
  const translateY = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -10,
          duration: 1000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ translateY }] }}>
      <Svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF5A00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="12" cy="12" r="10" />
        <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10" />
        <Path d="M12 2a15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0 4 10" />
        <Path d="M2 12h20" />
      </Svg>
    </Animated.View>
  );
};

export default function DashboardScreen() {
  const { profile, stats, workoutPhases, workoutHistory } = useAppStore();
  const { t, language } = useTranslation();
  const [showInstallBanner, setShowInstallBanner] = useState(true);
  const [showInstallSteps, setShowInstallSteps] = useState(false);

  const currentPhase = workoutPhases.find((p: any) => p.id === stats.currentPhaseId);

  const injuryCount = profile.history?.length || 0;
  const mobility = 95 - (injuryCount * 15);
  const wellness = parseInt(profile.age) + (injuryCount * 2) - (profile.equipment === 'dumbbells' ? 1 : 0);

  // Calendar logic
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  // Dynamic values based on goal
  const GoalIcon = profile.goal === 'vertical' ? ArrowUpRight : profile.goal === 'injury' ? Activity : Trophy;
  const goalLabel = t(`dashboard.goalLabels.${profile.goal || 'vertical'}`);
  const goalColor = '#FF5A00';
  const goalBg = 'bg-brand-orange/10';

  return (
    <SafeAreaView className="flex-1 bg-brand-white">
      <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View className="mb-6 flex-row justify-between items-end">
          <View>
             <View className="flex-row items-center gap-2 mb-1">
              <Trophy size={14} color="#1E3A8A" />
              <Text className="text-brand-blue font-bold text-sm tracking-widest uppercase">{t('dashboard.brand')}</Text>
            </View>
            <Text className="text-4xl font-extrabold text-brand-dark tracking-tight">{t('dashboard.greeting')(profile.name)}</Text>
          </View>
          <View className="pb-2">
            <BouncingVolleyball />
          </View>
        </View>

        {/* Personalized Directive Card */}
        <View className="bg-brand-blue rounded-3xl p-6 mb-8 overflow-hidden relative shadow-lg shadow-brand-blue/30">
          <View className="absolute -right-8 -top-8 opacity-10">
            <Svg width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <Circle cx="12" cy="12" r="10" />
              <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10" />
              <Path d="M12 2a15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0 4 10" />
              <Path d="M2 12h20" />
            </Svg>
          </View>
          <Text className="text-xs font-bold text-brand-blue-300 text-white/70 uppercase tracking-widest mb-3">{t('dashboard.focus')}</Text>
          <View className="flex-row items-center gap-4">
            <View className={`p-4 rounded-2xl bg-white/10`}>
              <GoalIcon size={28} color="#ffffff" />
            </View>
            <View>
              <Text className="text-white font-bold text-xl leading-tight">{goalLabel}</Text>
              <View className="flex-row gap-4 mt-2">
                <View className="flex-row items-center gap-1.5">
                  <Calendar size={14} color="#CBD5E1" />
                  <Text className="text-slate-300 text-sm font-medium">{t('dashboard.daysPerWeek')(profile.daysPerWeek)}</Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <Clock size={14} color="#CBD5E1" />
                  <Text className="text-slate-300 text-sm font-medium">{t('dashboard.minutesPerDay')(profile.timePerDay)}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Next Workout Card */}
        <View className="mb-8">
          <View className="flex-row items-center gap-2 mb-4">
            <Play size={16} color="#334155" fill="#334155" />
            <Text className="text-sm font-bold text-brand-gray uppercase tracking-widest">{t('dashboard.nextDrill')}</Text>
          </View>

          <View className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50">
            <View className="p-6 border-b border-slate-100">
              <View className="flex-row items-center justify-between mb-3">
                 <View className="flex-row items-center gap-2">
                  <View className="w-2 h-2 rounded-full bg-brand-orange" />
               <Text className="text-brand-orange font-bold text-xs uppercase tracking-widest">{t('dashboard.phase')(currentPhase?.id || 'A')}</Text>
                 </View>
                 <Text className="text-slate-400 font-medium text-xs">{currentPhase?.exercises?.length || 0} {t('dashboard.exercisesAbbr')} • {profile.timePerDay}m</Text>
              </View>
              <Text className="text-2xl font-bold text-brand-dark mb-1">{currentPhase?.title || t('dashboard.unknownPhase')}</Text>
            </View>
            <View className="p-4 bg-slate-50">
              <TouchableOpacity onPress={() => router.push('/(tabs)/workout')} className="w-full bg-brand-orange py-4 rounded-2xl flex-row items-center justify-center gap-2 shadow-md shadow-brand-orange/30">
                <Text className="text-white font-bold text-lg">{t('dashboard.hitCourt')}</Text>
                <ArrowUpRight size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Quick Stats Summary */}
        <View className="flex-row gap-4 mb-10">
          <View className="flex-1 bg-white border border-slate-200 p-5 rounded-3xl items-start shadow-sm shadow-slate-200/50">
            <View className="p-2.5 bg-brand-orange/10 rounded-xl mb-3">
              <Medal color="#FF5A00" size={22} />
            </View>
            <Text className="text-3xl font-black text-brand-dark tracking-tight">{stats.sessionsCompleted}</Text>
            <Text className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">{t('dashboard.sessions')}</Text>
          </View>
          <View className="flex-1 bg-white border border-slate-200 p-5 rounded-3xl items-start shadow-sm shadow-slate-200/50">
             <View className="p-2.5 bg-brand-blue/10 rounded-xl mb-3">
              <BarChart3 color="#1E3A8A" size={22} />
            </View>
            <Text className="text-3xl font-black text-brand-dark tracking-tight">{Object.keys(useAppStore(s => s.weightLogs)).length}</Text>
            <Text className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">{t('dashboard.movements')}</Text>
          </View>
        </View>

        {/* Install on Phone Banner */}
        {showInstallBanner && (
          <View style={{ backgroundColor: '#1E3A8A', borderRadius: 20, padding: 16, marginBottom: 20, borderWidth: 1.5, borderColor: '#2D58C4' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <Text style={{ color: '#ffffff', fontWeight: '900', fontSize: 15 }}>📱 {language === 'nl' ? 'Voeg toe aan je scherm' : 'Add to Home Screen'}</Text>
              <TouchableOpacity onPress={() => setShowInstallBanner(false)} style={{ padding: 4 }}>
                <Text style={{ color: '#93C5FD', fontSize: 16, fontWeight: '700' }}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={{ color: '#93C5FD', fontSize: 13, fontWeight: '600', marginBottom: 12, lineHeight: 18 }}>
              {language === 'nl' ? 'Gebruik de app als een echte app op je gsm — geen browser, volledig scherm!' : 'Use the app like a real app on your phone — no browser, full screen!'}
            </Text>
            <TouchableOpacity
              onPress={() => setShowInstallSteps(!showInstallSteps)}
              style={{ backgroundColor: '#FF5A00', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <Text style={{ color: '#ffffff', fontWeight: '900', fontSize: 14 }}>
                {showInstallSteps ? (language === 'nl' ? '▲ Verberg stappen' : '▲ Hide steps') : (language === 'nl' ? '▼ Toon installatie-stappen' : '▼ Show install steps')}
              </Text>
            </TouchableOpacity>

            {showInstallSteps && (
              <View style={{ marginTop: 16, gap: 12 }}>
                {/* iOS */}
                <View style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: 14 }}>
                  <Text style={{ color: '#ffffff', fontWeight: '900', fontSize: 13, marginBottom: 8 }}>🍎 iPhone / iPad (Safari)</Text>
                  {[
                    language === 'nl' ? '1. Open de app in Safari' : '1. Open the app in Safari',
                    language === 'nl' ? '2. Tik op het "Deel" icoon (□↑) onderaan' : '2. Tap the "Share" icon (□↑) at the bottom',
                    language === 'nl' ? '3. Scroll naar beneden → "Zet op beginscherm"' : '3. Scroll down → "Add to Home Screen"',
                    language === 'nl' ? '4. Tik op "Voeg toe" rechts bovenaan' : '4. Tap "Add" top right',
                  ].map((step, i) => (
                    <Text key={i} style={{ color: '#93C5FD', fontSize: 12, fontWeight: '600', marginBottom: 4 }}>{step}</Text>
                  ))}
                </View>
                {/* Android */}
                <View style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: 14 }}>
                  <Text style={{ color: '#ffffff', fontWeight: '900', fontSize: 13, marginBottom: 8 }}>🤖 Android (Chrome)</Text>
                  {[
                    language === 'nl' ? '1. Open de app in Chrome' : '1. Open the app in Chrome',
                    language === 'nl' ? '2. Tik op de drie puntjes (⋮) rechtsboven' : '2. Tap the three dots (⋮) top right',
                    language === 'nl' ? '3. Tik op "Toevoegen aan startscherm"' : '3. Tap "Add to Home Screen"',
                    language === 'nl' ? '4. Tik op "Toevoegen" in het popup' : '4. Tap "Add" in the popup',
                  ].map((step, i) => (
                    <Text key={i} style={{ color: '#93C5FD', fontSize: 12, fontWeight: '600', marginBottom: 4 }}>{step}</Text>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        {/* Workout Calendar */}
        <View style={{ marginBottom: 32 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Calendar size={16} color="#334155" />
            <Text className="text-sm font-bold text-brand-gray uppercase tracking-widest">
              {language === 'nl' ? 'Trainingskalender' : 'Workout Calendar'}
            </Text>
          </View>
          <View style={{ backgroundColor: '#ffffff', borderRadius: 24, padding: 20, borderWidth: 1.5, borderColor: '#E2E8F0', shadowColor: '#1E3A8A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10 }}>
            {/* Month header */}
            <Text style={{ textAlign: 'center', fontWeight: '900', fontSize: 16, color: '#0F172A', marginBottom: 12 }}>
              {new Date(year, month).toLocaleDateString(language === 'nl' ? 'nl-NL' : 'en-US', { month: 'long', year: 'numeric' })}
            </Text>
            {/* Weekday labels */}
            <View style={{ flexDirection: 'row', marginBottom: 6 }}>
              {(language === 'nl' ? ['M','D','W','D','V','Z','Z'] : ['M','T','W','T','F','S','S']).map((d, i) => (
                <Text key={i} style={{ flex: 1, textAlign: 'center', fontSize: 11, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase' }}>{d}</Text>
              ))}
            </View>
            {/* Day grid */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {days.map((d, i) => {
                if (!d) return <View key={`e${i}`} style={{ width: `${100/7}%`, aspectRatio: 1 }} />;
                const dStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
                const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                const isWorkout = (workoutHistory || []).includes(dStr);
                return (
                  <View key={d} style={{ width: `${100/7}%`, aspectRatio: 1, alignItems: 'center', justifyContent: 'center', padding: 2 }}>
                    <View style={{
                      width: '80%', aspectRatio: 1, borderRadius: 100, alignItems: 'center', justifyContent: 'center',
                      backgroundColor: isToday ? '#1E3A8A' : isWorkout ? '#FFF7F0' : 'transparent',
                      borderWidth: isToday ? 0 : isWorkout ? 1.5 : 0,
                      borderColor: isWorkout && !isToday ? '#FF5A00' : 'transparent',
                    }}>
                      <Text style={{ fontSize: 13, fontWeight: isToday || isWorkout ? '900' : '500', color: isToday ? '#ffffff' : isWorkout ? '#FF5A00' : '#64748B' }}>{d}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
            {/* Legend */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#1E3A8A' }} />
                <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600' }}>{language === 'nl' ? 'Vandaag' : 'Today'}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#FFF7F0', borderWidth: 1.5, borderColor: '#FF5A00' }} />
                <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600' }}>{language === 'nl' ? 'Getraind' : 'Trained'}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Zap size={12} color="#FF5A00" />
                <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600' }}>{workoutHistory?.length || 0} {language === 'nl' ? 'sessies' : 'sessions'}</Text>
              </View>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
