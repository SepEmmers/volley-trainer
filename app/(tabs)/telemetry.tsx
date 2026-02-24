import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAppStore } from '../../src/store/useAppStore';
import { Activity, Zap, Trash2, TrendingUp, Medal } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EXERCISES } from '../../src/engine/exercises';
import { router } from 'expo-router';

export default function TelemetryScreen() {
  const { stats, weightLogs, profile, wipeData } = useAppStore();
  
  const trackedKeys = Object.keys(weightLogs);

  const handleWipe = () => {
    Alert.alert(
      "Reset Athlete Profile",
      "Are you sure you want to delete all profile data and performance logs? This action is irreversible.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Wipe Profile", 
          style: "destructive",
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
      <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        <View className="flex-row justify-between items-center mb-8">
          <View className="flex-row items-center gap-2">
            <TrendingUp size={28} color="#1E3A8A" />
            <Text className="text-3xl font-extrabold text-brand-dark tracking-tight">Performance</Text>
          </View>
          <TouchableOpacity onPress={handleWipe} className="p-2.5 bg-red-50 rounded-xl shadow-sm border border-red-100">
            <Trash2 size={18} color="#ef4444" />
          </TouchableOpacity>
        </View>

        {/* Global Stats */}
        <View className="flex-row gap-4 mb-8">
          <View className="flex-1 bg-white border border-slate-200 p-5 rounded-3xl items-center shadow-md shadow-brand-blue/5">
            <View className="p-3 bg-brand-orange/10 rounded-2xl mb-3">
              <Medal color="#FF5A00" size={26} />
            </View>
            <Text className="text-4xl font-black text-brand-dark tracking-tight">{stats.sessionsCompleted}</Text>
            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1 text-center">Court Sessions</Text>
          </View>
          <View className="flex-1 bg-white border border-slate-200 p-5 rounded-3xl items-center shadow-md shadow-brand-blue/5">
            <View className="p-3 bg-brand-blue/10 rounded-2xl mb-3">
               <Zap color="#1E3A8A" size={26} />
            </View>
            <Text className="text-4xl font-black text-brand-dark tracking-tight">{trackedKeys.length}</Text>
            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1 text-center">Drills Logged</Text>
          </View>
        </View>

        {trackedKeys.length === 0 ? (
          <View className="bg-slate-50 border border-slate-200 rounded-3xl p-10 items-center justify-center">
            <View className="w-16 h-16 bg-white rounded-full items-center justify-center shadow-sm mb-4">
               <Activity color="#94a3b8" size={32} />
            </View>
            <Text className="text-slate-500 font-medium text-center">No performance data recorded yet. Hit the court and complete some drills to build your stats.</Text>
          </View>
        ) : (
          <View className="space-y-4">
            <View className="flex-row items-center gap-2 mb-2">
               <View className="w-1.5 h-6 bg-brand-orange rounded-full" />
               <Text className="text-sm font-bold text-brand-dark uppercase tracking-widest">Strength Output</Text>
            </View>
            
            {trackedKeys.map((exId: string) => {
              const exName = EXERCISES[exId as keyof typeof EXERCISES]?.name || "Unknown Exercise";
              const logs = weightLogs[exId];
              const currentMax = Math.max(...logs.map((l: any) => parseFloat(l.weight) || 0));

              return (
                <View key={exId} className="bg-white border border-slate-200 shadow-sm shadow-slate-200/50 rounded-3xl p-5 mb-4">
                  <View className="flex-row justify-between items-start mb-6">
                    <Text className="font-bold text-brand-dark text-base flex-1 mr-4">{exName}</Text>
                    <View className="items-end bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                      <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Personal Record</Text>
                      <Text className="font-black text-brand-orange text-sm mt-0.5">{currentMax} {profile.units === 'metric' ? 'kg' : 'lb'}</Text>
                    </View>
                  </View>
                  
                  {/* Fake Bar Chart */}
                  <View className="flex-row items-end h-20 w-full border-b-2 border-slate-100 pb-0">
                    {logs.slice(-10).map((log: any, i: number) => {
                      const ht = currentMax > 0 ? ((parseFloat(log.weight) || 0) / currentMax) * 100 : 5;
                      return (
                        <View key={i} className="flex-1 h-full justify-end mx-1 relative group">
                          {/* Pseudo tooltip could go here, omitting for pure native limits */}
                          <View 
                            className="w-full bg-brand-blue rounded-t-md opacity-90" 
                            style={{ height: `${Math.max(ht, 10)}%` }} 
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
