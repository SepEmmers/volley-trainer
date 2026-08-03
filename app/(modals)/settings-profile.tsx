import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useAppStore } from '../../src/store/useAppStore';
import { useAuthStore } from '../../src/store/useAuthStore';
import { uploadToCloud } from '../../src/services/syncService';
import { updatePublicProfile } from '../../src/services/socialService';
import { useSocialStore } from '../../src/store/useSocialStore';
import { Ruler, Weight, Shield, Target, Zap, CheckCircle2, Save, ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from '../../src/i18n/useTranslation';

export default function SettingsProfileScreen() {
  const { t, language } = useTranslation();
  const profile = useAppStore(state => state.profile);
  const [data, setData] = useState(profile);
  const [isDirty, setIsDirty] = useState(false);
  const authUser = useAuthStore(s => s.user);
  const isPublicProfile = useSocialStore(s => s.isPublicProfile);

  const handleUpdate = (updates: any) => {
    setData({ ...data, ...updates });
    setIsDirty(true);
  };

  const saveProfile = async () => {
    useAppStore.setState({ profile: data });
    setIsDirty(false);
    
    // Sync to cloud if signed in
    if (authUser && !authUser.isAnonymous) {
      const state = useAppStore.getState();
      try {
        await uploadToCloud(authUser.uid, { ...state, profile: data });
        // Sync public profile if enabled
        if (isPublicProfile) {
          const options = useSocialStore.getState().publicProfileOptions || {};
          await updatePublicProfile(authUser.uid, {
            displayName: data.name || authUser.displayName,
            photoURL: authUser.photoURL,
            level: data.level,
            streak: state.stats?.streak || 0,
            spikes: state.spikes || 0,
            ...(options.showCalendar ? { workoutHistory: state.workoutHistory } : {}),
            ...(options.showProgress ? { stats: state.stats } : {}),
            ...(options.showCollection ? { inventory: state.inventory } : {}),
            ...(options.showTeam ? { team: state.equipped?.players || [] } : {})
          }, true);
        }
      } catch (_) {}
    }
    Alert.alert(t('profile.saved'), t('profile.savedMsg'));
  };

  const toggleInjury = (injuryId: string) => {
    const current = data.history || [];
    const newHistory = current.includes(injuryId) 
      ? current.filter((id: any) => id !== injuryId)
      : [...current, injuryId];
    handleUpdate({ history: newHistory });
  };

  return (
    <SafeAreaView className="flex-1 bg-brand-white">
      <View className="pt-4 px-6 pb-5 border-b border-slate-200 bg-white shadow-sm flex-row justify-between items-center z-10">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => {
            if (isDirty) {
              Alert.alert(
                language === 'nl' ? 'Niet opgeslagen wijzigingen' : 'Unsaved changes',
                language === 'nl' ? 'Weet je zeker dat je wilt vertrekken zonder op te slaan?' : 'Are you sure you want to leave without saving?',
                [
                  { text: language === 'nl' ? 'Annuleren' : 'Cancel', style: 'cancel' },
                  { text: 'OK', onPress: () => router.back() }
                ]
              );
            } else {
              router.back();
            }
          }} className="p-2 -ml-2">
            <ArrowLeft color="#0F172A" size={24} />
          </TouchableOpacity>
          <Text className="text-2xl font-black text-brand-dark tracking-tight">
            {language === 'nl' ? 'Atletenprofiel' : 'Athlete Profile'}
          </Text>
        </View>
        {isDirty && (
          <TouchableOpacity onPress={saveProfile} className="bg-brand-orange px-4 py-2 rounded-xl flex-row items-center gap-2 shadow-sm">
             <Save size={16} color="#ffffff" />
             <Text className="text-white font-bold text-sm">{t('profile.save')}</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
         {/* Display Name */}
         <View className="bg-white border-2 border-slate-200 rounded-3xl p-6 mb-6 shadow-sm">
           <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{t('profile.displayName')}</Text>
           <TextInput 
              value={data.name}
              onChangeText={(tx) => handleUpdate({ name: tx })}
              placeholder={language === 'nl' ? 'bijv. Volleybal Fenomeen' : 'e.g. Volleyball Phenom'}
              placeholderTextColor="#94a3b8"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-brand-dark text-lg font-bold focus:border-brand-orange"
            />
         </View>

         {/* Base Metrics */}
         <View className="bg-white border-2 border-slate-200 rounded-3xl p-6 mb-6 shadow-sm">
           <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{t('profile.baseMetrics')}</Text>
           <View className="flex-row gap-4 mb-4">
             <View className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-4">
               <Text className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t('profile.age')}</Text>
               <TextInput 
                 value={data.age?.toString() || '25'}
                 onChangeText={(tx) => handleUpdate({ age: parseInt(tx) || 0 })}
                 keyboardType="numeric"
                 className="w-full text-2xl font-black text-brand-dark p-0 border-b-2 border-slate-200"
               />
             </View>
             <View className="flex-[2]" />
           </View>
           <View className="flex-row gap-4 mb-4">
              <View className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <View className="flex-row items-center gap-2 mb-2">
                  <Ruler size={14} color="#64748b" />
                  <Text className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('profile.height')}</Text>
                </View>
                <View className="flex-row items-baseline gap-1 border-b-2 border-slate-200 pb-1">
                  <TextInput 
                    value={data.height.toString()}
                    onChangeText={(tx) => handleUpdate({ height: parseInt(tx) || 0 })}
                    keyboardType="numeric"
                    className="text-2xl font-black text-brand-dark p-0 min-w-[60px]"
                  />
                  <Text className="text-slate-400 font-bold">{data.units === 'metric' ? 'cm' : 'in'}</Text>
                </View>
              </View>
              <View className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <View className="flex-row items-center gap-2 mb-2">
                  <Weight size={14} color="#64748b" />
                  <Text className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('profile.weight')}</Text>
                </View>
                <View className="flex-row items-baseline gap-1 border-b-2 border-slate-200 pb-1">
                  <TextInput 
                    value={data.weight.toString()}
                    onChangeText={(tx) => handleUpdate({ weight: parseInt(tx) || 0 })}
                    keyboardType="numeric"
                    className="text-2xl font-black text-brand-dark p-0 min-w-[60px]"
                  />
                  <Text className="text-slate-400 font-bold">{data.units === 'metric' ? 'kg' : 'lbs'}</Text>
                </View>
              </View>
           </View>

           <View className="flex-row bg-slate-100 rounded-2xl p-1.5 border border-slate-200">
              <TouchableOpacity onPress={() => handleUpdate({ units: 'metric' })} className={`flex-1 py-3 rounded-xl items-center transition-colors ${data.units === 'metric' ? 'bg-white shadow-sm border border-slate-200' : ''}`}>
                <Text className={`font-bold ${data.units === 'metric' ? 'text-brand-blue' : 'text-slate-400'}`}>{t('profile.metric')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleUpdate({ units: 'imperial' })} className={`flex-1 py-3 rounded-xl items-center transition-colors ${data.units === 'imperial' ? 'bg-white shadow-sm border border-slate-200' : ''}`}>
                <Text className={`font-bold ${data.units === 'imperial' ? 'text-brand-blue' : 'text-slate-400'}`}>{t('profile.imperial')}</Text>
              </TouchableOpacity>
            </View>
         </View>

         {/* Training Focus */}
         <View className="bg-white border-2 border-slate-200 rounded-3xl p-6 mb-6 shadow-sm">
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{t('profile.trainingFocus')}</Text>
            <View className="space-y-3">
              {[
                { id: 'vertical', icon: Zap, label: t('profile.trainingFocusOptions.vertical'), color: '#FF5A00', bg: 'bg-brand-orange/10' },
                { id: 'injury', icon: Shield, label: t('profile.trainingFocusOptions.injury'), color: '#10B981', bg: 'bg-emerald-500/10' },
                { id: 'agility', icon: Target, label: t('profile.trainingFocusOptions.agility'), color: '#1E3A8A', bg: 'bg-brand-blue/10' }
              ].map(g => (
                <TouchableOpacity 
                  key={g.id} 
                  onPress={() => handleUpdate({ goal: g.id })} 
                  className={`flex-row items-center p-4 rounded-2xl border-2 transition-all ${data.goal === g.id ? `border-[${g.color}] bg-slate-50` : 'border-slate-100 bg-white'}`}
                  style={{ marginBottom: 10, borderColor: data.goal === g.id ? g.color : '#f1f5f9' }}
                >
                  <View className={`p-2 rounded-xl ${g.bg}`}>
                     <g.icon color={g.color} size={20} />
                  </View>
                  <Text className={`ml-4 font-bold flex-1 text-lg ${data.goal === g.id ? 'text-brand-dark' : 'text-slate-500'}`}>{g.label}</Text>
                  {data.goal === g.id && <CheckCircle2 color={g.color} size={20} />}
                </TouchableOpacity>
              ))}
            </View>
         </View>

         {/* Active Injuries */}
         <View className="bg-white border-2 border-slate-200 rounded-3xl p-6 mb-6 shadow-sm">
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              {language === 'nl' ? 'Actieve Blessures' : 'Active Injuries'}
            </Text>
            <Text className="text-sm text-slate-500 mb-4 font-bold">
              {language === 'nl' ? 'Selecteer blessures waar je momenteel last van hebt voor aangepaste schema\'s.' : 'Select injuries you currently suffer from for adapted routines.'}
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {[
                { id: 'jumper_knee', label: language === 'nl' ? 'Springersknie' : "Jumper's Knee" },
                { id: 'shoulder_pain', label: language === 'nl' ? 'Schouderpijn' : 'Shoulder Pain' },
                { id: 'back_pain', label: language === 'nl' ? 'Rugpijn' : 'Back Pain' }
              ].map(inj => {
                const isActive = (data.history || []).includes(inj.id);
                return (
                  <TouchableOpacity
                    key={inj.id}
                    onPress={() => toggleInjury(inj.id)}
                    className={`px-4 py-2.5 rounded-full border-2 flex-row items-center gap-2 ${isActive ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}
                  >
                    <View className={`w-3 h-3 rounded-full ${isActive ? 'bg-red-500' : 'bg-slate-300'}`} />
                    <Text className={`font-bold ${isActive ? 'text-red-700' : 'text-slate-600'}`}>{inj.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
         </View>

         {/* Experience */}
         <View className="bg-white border-2 border-slate-200 rounded-3xl p-6 mb-6 shadow-sm">
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{t('profile.experience')}</Text>
            <View className="flex-row bg-slate-100 rounded-2xl p-1.5 border border-slate-200">
               {(['novice', 'intermediate', 'advanced'] as const).map(lvl => (
                 <TouchableOpacity 
                   key={lvl} 
                   onPress={() => handleUpdate({ level: lvl })} 
                   className={`flex-1 py-3 rounded-xl items-center transition-colors ${data.level === lvl ? 'bg-white shadow-sm border border-slate-200' : ''}`}
                 >
                   <Text className={`font-bold capitalize ${data.level === lvl ? 'text-brand-orange' : 'text-slate-400'}`}>{t(`profile.levels.${lvl}`)}</Text>
                 </TouchableOpacity>
               ))}
             </View>
         </View>

         {/* Schedule */}
         <View className="bg-white border-2 border-slate-200 rounded-3xl p-6 mb-6 shadow-sm">
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{t('profile.schedule')}</Text>
            
            {/* Auto vs Manual Toggle */}
            <View className="flex-row bg-slate-100 rounded-2xl p-1.5 border border-slate-200 mb-4">
              <TouchableOpacity 
                onPress={() => handleUpdate({ schedule: 'auto' })} 
                className={`flex-1 py-3 rounded-xl items-center transition-colors ${data.schedule === 'auto' || !data.schedule ? 'bg-white shadow-sm border border-slate-200' : ''}`}
              >
                <Text className={`font-bold ${data.schedule === 'auto' || !data.schedule ? 'text-brand-orange' : 'text-slate-400'}`}>{t('profile.scheduleAuto')}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => handleUpdate({ schedule: typeof data.schedule === 'object' ? data.schedule : { '1': 'workout', '2': 'rest', '3': 'workout', '4': 'rest', '5': 'workout', '6': 'match', '7': 'rest' } })} 
                className={`flex-1 py-3 rounded-xl items-center transition-colors ${typeof data.schedule === 'object' ? 'bg-white shadow-sm border border-slate-200' : ''}`}
              >
                <Text className={`font-bold ${typeof data.schedule === 'object' ? 'text-brand-orange' : 'text-slate-400'}`}>{t('profile.scheduleManual')}</Text>
              </TouchableOpacity>
            </View>

            {/* Auto Configurator */}
            {(data.schedule === 'auto' || !data.schedule) && (
              <View className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-4">
                <Text className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">{t('profile.workoutsPerWeek') || 'Workouts Per Week'}</Text>
                <View className="flex-row bg-white rounded-xl p-1 border border-slate-200 mb-5">
                  {[2, 3, 4].map(num => (
                    <TouchableOpacity 
                      key={num} 
                      onPress={() => handleUpdate({ daysPerWeek: num })} 
                      className={`flex-1 py-2.5 rounded-lg items-center transition-colors ${data.daysPerWeek === num ? 'bg-brand-blue shadow-sm' : ''}`}
                    >
                      <Text className={`font-bold ${data.daysPerWeek === num ? 'text-white' : 'text-slate-400'}`}>{num} {t('profile.days') || 'Days'}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">{t('profile.matchDaysIntro') || 'Volleyball / Match Days'}</Text>
                <View className="flex-row justify-between">
                  {[1, 2, 3, 4, 5, 6, 7].map(day => {
                     const dayLabels = t('profile.scheduleDayLabels') || ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
                     const isMatch = (data.matchDays || []).includes(day);
                     return (
                       <TouchableOpacity 
                         key={day} 
                         onPress={() => {
                           const newMatches = isMatch 
                             ? (data.matchDays || []).filter((d: number) => d !== day)
                             : [...(data.matchDays || []), day];
                           handleUpdate({ matchDays: newMatches });
                         }}
                         className={`w-10 h-10 rounded-full items-center justify-center border-2 ${isMatch ? 'bg-brand-blue/10 border-brand-blue' : 'bg-white border-slate-200'}`}
                       >
                         <Text className={`font-bold text-xs ${isMatch ? 'text-brand-blue' : 'text-slate-400'}`}>{dayLabels[day - 1]}</Text>
                       </TouchableOpacity>
                     );
                  })}
                </View>
              </View>
            )}

            {/* Specific Days Selector */}
            {typeof data.schedule === 'object' && (
              <View className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-4">
                <Text className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center mb-4">{t('profile.scheduleSelect')}</Text>
                {[1, 2, 3, 4, 5, 6, 7].map(day => {
                   const currentType = data.schedule[day.toString()];
                   const toggleType = () => {
                      const nextType = currentType === 'workout' ? 'rest' : currentType === 'rest' ? 'match' : 'workout';
                      handleUpdate({ schedule: { ...data.schedule, [day.toString()]: nextType } });
                   };
                   const dayLabels = t('profile.scheduleDayLabels') || ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
                   return (
                     <View key={day} className="flex-row items-center justify-between mb-2">
                       <Text className="font-bold text-brand-dark w-12">{dayLabels[day - 1] || day}</Text>
                       <TouchableOpacity 
                         onPress={toggleType}
                         className={`flex-1 flex-row items-center justify-center py-2.5 rounded-xl border-2 ${
                           currentType === 'workout' ? 'bg-brand-orange/10 border-brand-orange' :
                           currentType === 'match' ? 'bg-brand-blue/10 border-brand-blue' :
                           'bg-white border-slate-200'
                         }`}
                       >
                         <Text className={`font-bold text-xs ${
                           currentType === 'workout' ? 'text-brand-orange' :
                           currentType === 'match' ? 'text-brand-blue' :
                           'text-slate-400'
                         }`}>
                           {currentType === 'workout' ? t('profile.scheduleDayTypes.workout') : currentType === 'match' ? t('profile.scheduleDayTypes.match') : t('profile.scheduleDayTypes.rest')}
                         </Text>
                       </TouchableOpacity>
                     </View>
                   );
                })}
              </View>
            )}

            <View className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <Text className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t('profile.timePerSession')}</Text>
              <View className="flex-row items-baseline gap-1 border-b-2 border-slate-200 pb-1">
                <TextInput 
                  value={data.timePerDay?.toString() || '45'}
                  onChangeText={(tx) => handleUpdate({ timePerDay: parseInt(tx) || 45 })}
                  keyboardType="numeric"
                  className="text-2xl font-black text-brand-dark p-0 min-w-[40px]"
                />
                <Text className="text-slate-400 font-bold">min</Text>
              </View>
            </View>
         </View>

      </ScrollView>
    </SafeAreaView>
  );
}
