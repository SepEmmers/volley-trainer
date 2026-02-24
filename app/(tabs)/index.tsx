import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, Easing } from 'react-native';
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
  const { t } = useTranslation();

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

      </ScrollView>
    </SafeAreaView>
  );
}
