import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAppStore } from '../../src/store/useAppStore';
import { User, Ruler, Weight, Shield, Target, Zap, CheckCircle2, Save, Globe } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from '../../src/i18n/useTranslation';

export default function ProfileSettingsScreen() {
  const profile = useAppStore(state => state.profile);
  const language = useAppStore(state => state.language);
  const setLanguage = useAppStore(state => state.setLanguage);
  const { t } = useTranslation();
  const [data, setData] = useState(profile);
  const [isDirty, setIsDirty] = useState(false);

  const handleUpdate = (updates: any) => {
    setData({ ...data, ...updates });
    setIsDirty(true);
  };

  const saveProfile = () => {
    useAppStore.setState({ profile: data });
    setIsDirty(false);
    Alert.alert(t('profile.saved'), t('profile.savedMsg'));
  };

  return (
    <SafeAreaView className="flex-1 bg-brand-white">
      <View className="pt-4 px-6 pb-5 border-b border-slate-200 bg-white/95 shadow-sm z-10 flex-row justify-between items-center">
        <View>
             <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t('profile.header')}</Text>
             <Text className="text-2xl font-black text-brand-dark tracking-tight">{t('profile.title')}</Text>
        </View>
        {isDirty && (
          <TouchableOpacity onPress={saveProfile} className="bg-brand-orange px-4 py-2 rounded-xl flex-row items-center gap-2 shadow-sm">
             <Save size={16} color="#ffffff" />
             <Text className="text-white font-bold text-sm">{t('profile.save')}</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
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
                    className="flex-1 text-2xl font-black text-brand-dark p-0"
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
                    className="flex-1 text-2xl font-black text-brand-dark p-0"
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

      </ScrollView>
    </SafeAreaView>
  );
}
