import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAppStore } from '../../src/store/useAppStore';
import { Activity, Zap, Trash2, TrendingUp, Medal, Shield, HeartPulse, Sparkles } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EXERCISES } from '../../src/engine/exercises';
import { router } from 'expo-router';
import { useTranslation } from '../../src/i18n/useTranslation';

interface LogEntry {
  date: string;
  weight: number | string;
}

export default function TelemetryScreen() {
  const { stats, weightLogs, profile, wipeData } = useAppStore();
  const { language } = useTranslation();
  
  const trackedKeys = Object.keys(weightLogs);

  // Knee Health & Resilience Score Calculation
  const isKneeFocus = profile.goal === 'knee_rehab' || profile.history?.includes('jumper_knee');
  const kneeScore = Math.min(100, 60 + (stats.sessionsCompleted * 4) + (stats.streak * 2));

  const handleWipe = () => {
    Alert.alert(
      language === 'nl' ? 'Reset Atletenprofiel' : 'Reset Athlete Profile',
      language === 'nl' ? 'Weet je zeker dat je alle profielgegevens en prestatielogs wilt wissen?' : 'Are you sure you want to delete all profile data and performance logs?',
      [
        { text: language === 'nl' ? 'Annuleren' : 'Cancel', style: 'cancel' },
        { 
          text: language === 'nl' ? 'Wissen' : 'Wipe Profile', 
          style: 'destructive',
          onPress: () => {
            wipeData();
            router.replace('/(onboarding)/profile');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-brand-white">
      <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        
        <View className="flex-row justify-between items-center mb-6">
          <View className="flex-row items-center gap-2">
            <TrendingUp size={28} color="#1E3A8A" />
            <Text className="text-3xl font-extrabold text-brand-dark tracking-tight">{language === 'nl' ? 'Prestaties' : 'Performance'}</Text>
          </View>
          <TouchableOpacity onPress={handleWipe} className="p-2.5 bg-red-50 rounded-xl shadow-sm border border-red-100">
            <Trash2 size={18} color="#ef4444" />
          </TouchableOpacity>
        </View>

        {/* Knee Health & Resilience Card */}
        <View className="bg-indigo-900 rounded-3xl p-6 mb-6 shadow-xl relative overflow-hidden">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-2">
              <Shield color="#818cf8" size={22} />
              <Text className="text-indigo-200 font-bold text-xs uppercase tracking-widest">{language === 'nl' ? 'Knie-Herstel & Resilience Index' : 'Knee Resilience Index'}</Text>
            </View>
            <View className="bg-indigo-700/60 px-3 py-1 rounded-full border border-indigo-400/30">
              <Text className="text-white font-black text-xs">{isKneeFocus ? (language === 'nl' ? 'Revalidatie Actief' : 'Rehab Active') : (language === 'nl' ? 'Optimaal' : 'Optimal')}</Text>
            </View>
          </View>

          <View className="flex-row items-baseline gap-2 mb-3">
            <Text className="text-5xl font-black text-white">{kneeScore}</Text>
            <Text className="text-indigo-300 font-bold text-lg">/ 100</Text>
          </View>

          <View className="w-full bg-indigo-950/80 h-3 rounded-full overflow-hidden mb-4 border border-indigo-700/50">
            <View style={{ width: `${kneeScore}%` }} className="h-full bg-indigo-400 rounded-full" />
          </View>

          <Text className="text-indigo-200 text-xs font-medium leading-relaxed">
            {language === 'nl' 
              ? 'Gebaseerd op VMO activatie, excentrische quadriceps belasting en sprong landing demping.'
              : 'Calculated from VMO activation, eccentric quad deceleration, and landing absorption.'}
          </Text>
        </View>

        {/* Global Stats */}
        <View className="flex-row gap-4 mb-8">
          <View className="flex-1 bg-white border border-slate-200 p-5 rounded-3xl items-center shadow-md shadow-brand-blue/5">
            <View className="p-3 bg-brand-orange/10 rounded-2xl mb-3">
              <Medal color="#FF5A00" size={26} />
            </View>
            <Text className="text-4xl font-black text-brand-dark tracking-tight">{stats.sessionsCompleted}</Text>
            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1 text-center">{language === 'nl' ? 'Sessies Voltooid' : 'Court Sessions'}</Text>
          </View>
          <View className="flex-1 bg-white border border-slate-200 p-5 rounded-3xl items-center shadow-md shadow-brand-blue/5">
            <View className="p-3 bg-brand-blue/10 rounded-2xl mb-3">
               <Zap color="#1E3A8A" size={26} />
            </View>
            <Text className="text-4xl font-black text-brand-dark tracking-tight">{trackedKeys.length}</Text>
            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1 text-center">{language === 'nl' ? 'Drills Geregistreerd' : 'Drills Logged'}</Text>
          </View>
        </View>

        {trackedKeys.length === 0 ? (
          <View className="bg-slate-50 border border-slate-200 rounded-3xl p-10 items-center justify-center">
            <View className="w-16 h-16 bg-white rounded-full items-center justify-center shadow-sm mb-4">
               <Activity color="#94a3b8" size={32} />
            </View>
            <Text className="text-slate-500 font-medium text-center">{language === 'nl' ? 'Nog geen prestatiegegevens geregistreerd. Voltooi een training op het veld om statistieken op te bouwen.' : 'No performance data recorded yet. Hit the court and complete some drills to build your stats.'}</Text>
          </View>
        ) : (
          <View className="space-y-4">
            <View className="flex-row items-center gap-2 mb-2">
               <View className="w-1.5 h-6 bg-brand-orange rounded-full" />
               <Text className="text-sm font-bold text-brand-dark uppercase tracking-widest">{language === 'nl' ? 'Kracht & Output Progressie' : 'Strength Output'}</Text>
            </View>
            
            {trackedKeys.map((exId: string) => {
              const exName = EXERCISES[exId as keyof typeof EXERCISES]?.name || "Exercise";
              const logs: LogEntry[] = weightLogs[exId] || [];
              const currentMax = Math.max(...logs.map((l: LogEntry) => parseFloat(l.weight as string) || 0));
              const estimated1RM = Math.round(currentMax * 1.12);

              return (
                <View key={exId} className="bg-white border border-slate-200 shadow-sm shadow-slate-200/50 rounded-3xl p-5 mb-4">
                  <View className="flex-row justify-between items-start mb-6">
                    <Text className="font-bold text-brand-dark text-base flex-1 mr-4">{exName}</Text>
                    <View className="items-end bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                      <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Est. 1RM</Text>
                      <Text className="font-black text-brand-orange text-sm mt-0.5">{estimated1RM} {profile.units === 'metric' ? 'kg' : 'lb'}</Text>
                    </View>
                  </View>
                  
                  {/* Progress Bar Chart */}
                  <View className="flex-row items-end h-24 w-full border-b-2 border-slate-100 pb-0">
                    {logs.slice(-10).map((log: LogEntry, i: number) => {
                      const weightVal = parseFloat(log.weight as string) || 0;
                      const ht = currentMax > 0 ? (weightVal / currentMax) * 100 : 5;
                      return (
                        <View key={i} className="flex-1 h-full justify-end mx-1 items-center">
                          <View 
                            className="w-full bg-brand-blue rounded-t-md opacity-90" 
                            style={{ height: `${Math.max(ht, 12)}%` }} 
                          />
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

