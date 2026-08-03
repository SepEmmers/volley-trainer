import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { router } from 'expo-router';
import { useAppStore } from '../../src/store/useAppStore';
import { Globe, CheckCircle2, ArrowLeft, Bell } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from '../../src/i18n/useTranslation';

export default function SettingsPreferencesScreen() {
  const { t, language } = useTranslation();
  const setLanguage = useAppStore(state => state.setLanguage);
  const mode = useAppStore(state => state.mode);
  const setMode = useAppStore(state => state.setMode);
  const notifications = useAppStore(state => state.notifications);
  const toggleWorkoutReminders = useAppStore(state => state.toggleWorkoutReminders);
  const toggleStreakReminders = useAppStore(state => state.toggleStreakReminders);

  return (
    <SafeAreaView className="flex-1 bg-brand-white">
      <View className="pt-4 px-6 pb-5 border-b border-slate-200 bg-white shadow-sm flex-row items-center gap-4 z-10">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <ArrowLeft color="#0F172A" size={24} />
        </TouchableOpacity>
        <Text className="text-2xl font-black text-brand-dark tracking-tight">
           {language === 'nl' ? 'App Voorkeuren' : 'App Preferences'}
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
         {/* Language Toggle */}
         <View className="bg-white border-2 border-slate-200 rounded-3xl p-6 mb-6 shadow-sm">
            <View className="flex-row items-center gap-2 mb-4">
              <Globe size={16} color="#64748b" />
              <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('profile.language')}</Text>
            </View>
            <View className="flex-row bg-slate-100 rounded-2xl p-1.5 border border-slate-200">
               <TouchableOpacity 
                 onPress={() => setLanguage('nl')} 
                 className={`flex-1 py-3 rounded-xl items-center transition-colors ${language === 'nl' ? 'bg-white shadow-sm border border-slate-200' : ''}`}
               >
                 <Text className={`font-bold ${language === 'nl' ? 'text-brand-orange' : 'text-slate-400'}`}>🇳🇱  Nederlands</Text>
               </TouchableOpacity>
               <TouchableOpacity 
                 onPress={() => setLanguage('en')} 
                 className={`flex-1 py-3 rounded-xl items-center transition-colors ${language === 'en' ? 'bg-white shadow-sm border border-slate-200' : ''}`}
               >
                 <Text className={`font-bold ${language === 'en' ? 'text-brand-orange' : 'text-slate-400'}`}>🇬🇧  English</Text>
               </TouchableOpacity>
            </View>
        </View>

        {/* Notifications */}
        <View className="bg-white border-2 border-slate-200 rounded-3xl p-6 mb-6 shadow-sm">
            <View className="flex-row items-center gap-2 mb-4">
              <Bell size={16} color="#64748b" />
              <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {language === 'nl' ? 'Notificaties' : 'Notifications'}
              </Text>
            </View>
            <View className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
               <View className="flex-row items-center justify-between p-4 border-b border-slate-200">
                 <View className="flex-1 pr-4">
                   <Text className="font-bold text-brand-dark mb-1">
                     {language === 'nl' ? 'Dagelijkse Herinnering' : 'Daily Reminder'}
                   </Text>
                   <Text className="text-xs text-slate-500">
                     {language === 'nl' ? 'Krijg elke dag om 20:00 een herinnering om te trainen.' : 'Get a reminder to workout every day at 20:00.'}
                   </Text>
                 </View>
                 <Switch 
                   value={notifications?.workoutRemindersEnabled} 
                   onValueChange={toggleWorkoutReminders}
                   trackColor={{ false: '#CBD5E1', true: '#FFB84D' }}
                   thumbColor={notifications?.workoutRemindersEnabled ? '#FF5A00' : '#f4f3f4'}
                 />
               </View>
               <View className="flex-row items-center justify-between p-4">
                 <View className="flex-1 pr-4">
                   <Text className="font-bold text-brand-dark mb-1">
                     {language === 'nl' ? 'Streak Meldingen' : 'Streak Milestones'}
                   </Text>
                   <Text className="text-xs text-slate-500">
                     {language === 'nl' ? 'Krijg een melding wanneer je een nieuwe streak mijlpaal bereikt.' : 'Get notified when you reach a new streak milestone.'}
                   </Text>
                 </View>
                 <Switch 
                   value={notifications?.streakRemindersEnabled} 
                   onValueChange={toggleStreakReminders}
                   trackColor={{ false: '#CBD5E1', true: '#FFB84D' }}
                   thumbColor={notifications?.streakRemindersEnabled ? '#FF5A00' : '#f4f3f4'}
                 />
               </View>
            </View>
        </View>

        {/* Mode Toggle */}
        <View style={{ backgroundColor: 'white', borderWidth: 2, borderColor: '#E2E8F0', borderRadius: 24, padding: 24, marginBottom: 24, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8 }}>
          <Text style={{ fontSize: 11, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16 }}>
             {language === 'nl' ? 'Ervaringsstijl' : 'Experience Mode'}
          </Text>
          <View style={{ gap: 12 }}>
            <TouchableOpacity
              onPress={() => setMode('serious')}
              style={{ borderRadius: 16, borderWidth: 2, borderColor: mode === 'serious' ? '#1E3A8A' : '#E2E8F0', backgroundColor: mode === 'serious' ? '#EFF6FF' : '#FAFAFA', padding: 16, flexDirection: 'row', alignItems: 'center', gap: 16 }}
            >
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: mode === 'serious' ? '#DBEAFE' : '#F1F5F9', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 24 }}>🏆</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                  <Text style={{ fontSize: 16, fontWeight: '900', color: mode === 'serious' ? '#1E3A8A' : '#64748B' }}>
                    {language === 'nl' ? 'Serieus' : 'Serious'}
                  </Text>
                  {mode === 'serious' && <CheckCircle2 color="#1E3A8A" size={18} />}
                </View>
                <Text style={{ fontSize: 13, fontWeight: '600', color: mode === 'serious' ? '#60A5FA' : '#94A3B8', lineHeight: 18 }}>
                  {language === 'nl' ? 'Pure focus op trainingsdata, atletische groei en progressie.' : 'Pure focus on workout data, athletic growth and progression.'}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setMode('fun')}
              style={{ borderRadius: 16, borderWidth: 2, borderColor: mode === 'fun' ? '#FF5A00' : '#E2E8F0', backgroundColor: mode === 'fun' ? '#FFF7F0' : '#FAFAFA', padding: 16, flexDirection: 'row', alignItems: 'center', gap: 16 }}
            >
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: mode === 'fun' ? '#FFEDD5' : '#F1F5F9', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 24 }}>🎮</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                  <Text style={{ fontSize: 16, fontWeight: '900', color: mode === 'fun' ? '#FF5A00' : '#64748B' }}>
                    {language === 'nl' ? 'Plezier' : 'Fun'}
                  </Text>
                  {mode === 'fun' && <CheckCircle2 color="#FF5A00" size={18} />}
                </View>
                <Text style={{ fontSize: 13, fontWeight: '600', color: mode === 'fun' ? '#FCA5A5' : '#94A3B8', lineHeight: 18 }}>
                  {language === 'nl' ? 'Verdien virtuele Spikes, ontgrendel items en speel in het Team.' : 'Earn virtual Spikes, unlock items and play in the Team mode.'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
