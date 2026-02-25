import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { router } from 'expo-router';
import { useAppStore } from '../../src/store/useAppStore';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useSocialStore } from '../../src/store/useSocialStore';
import { signOut, linkAnonymousToGoogle } from '../../src/services/authService';
import { uploadToCloud } from '../../src/services/syncService';
import { updatePublicProfile } from '../../src/services/socialService';
import { User, Ruler, Weight, Shield, Target, Zap, CheckCircle2, Save, Globe, LogOut, CloudOff, Cloud, Link, FileEdit, Users } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from '../../src/i18n/useTranslation';

export default function ProfileSettingsScreen() {
  const profile = useAppStore(state => state.profile);
  const language = useAppStore(state => state.language);
  const setLanguage = useAppStore(state => state.setLanguage);
  const mode = useAppStore(state => state.mode);
  const setMode = useAppStore(state => state.setMode);
  const { t } = useTranslation();
  const [data, setData] = useState(profile);
  const [isDirty, setIsDirty] = useState(false);

  const authUser = useAuthStore(s => s.user);
  const clearUser = useAuthStore(s => s.clearUser);
  const [linkingGoogle, setLinkingGoogle] = useState(false);

  const isPublicProfile = useSocialStore(s => s.isPublicProfile);
  const setIsPublicProfile = useSocialStore(s => s.setIsPublicProfile);

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
          await updatePublicProfile(authUser.uid, {
            displayName: data.name || authUser.displayName,
            photoURL: authUser.photoURL,
            level: data.level,
            equipped: state.equipped,
            stats: state.stats
          }, true);
        }
      } catch (_) {}
    }
    Alert.alert(t('profile.saved'), t('profile.savedMsg'));
  };

  const handleTogglePublic = async () => {
    const newVal = !isPublicProfile;
    setIsPublicProfile(newVal);
    if (authUser && !authUser.isAnonymous) {
      try {
        const state = useAppStore.getState();
        await updatePublicProfile(authUser.uid, {
            displayName: data.name || authUser.displayName,
            photoURL: authUser.photoURL,
            level: data.level,
            equipped: state.equipped,
            stats: state.stats
        }, newVal);
      } catch (_) {}
    }
  };

  const toggleInjury = (injuryId: string) => {
    const current = data.history || [];
    const newHistory = current.includes(injuryId) 
      ? current.filter((id: any) => id !== injuryId)
      : [...current, injuryId];
    handleUpdate({ history: newHistory });
  };

  const handleSignOut = async () => {
    Alert.alert(
      language === 'nl' ? 'Uitloggen?' : 'Sign out?',
      language === 'nl'
        ? 'Je lokale data blijft bewaard.'
        : 'Your local data will be kept.',
      [
        { text: language === 'nl' ? 'Annuleren' : 'Cancel', style: 'cancel' },
        {
          text: language === 'nl' ? 'Uitloggen' : 'Sign out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            clearUser();
            router.replace('/login' as any);
          },
        },
      ],
    );
  };

  const handleLinkGoogle = async () => {
    setLinkingGoogle(true);
    try {
      const linked = await linkAnonymousToGoogle();
      useAuthStore.getState().setUser({
        uid: linked.uid,
        displayName: linked.displayName,
        email: linked.email,
        photoURL: linked.photoURL,
        isAnonymous: false,
      });
      // Upload current local data to cloud under new uid
      await uploadToCloud(linked.uid, useAppStore.getState());
      Alert.alert(
        language === 'nl' ? 'Account gekoppeld! ☁️' : 'Account linked! ☁️',
        language === 'nl'
          ? 'Je voortgang wordt nu automatisch gesynchroniseerd.'
          : 'Your progress is now synced automatically.',
      );
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Could not link account.');
    } finally {
      setLinkingGoogle(false);
    }
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

        {/* ── Account Card ── */}
        <View style={{ backgroundColor: 'white', borderWidth: 2, borderColor: '#E2E8F0', borderRadius: 24, padding: 20, marginBottom: 24, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8 }}>
          <Text style={{ fontSize: 11, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 14 }}>
            {language === 'nl' ? 'Account & Sync' : 'Account & Sync'}
          </Text>

          {authUser && !authUser.isAnonymous ? (
            // Signed in with Google
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              {authUser.photoURL ? (
                <Image
                  source={{ uri: authUser.photoURL }}
                  style={{ width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: '#FF5A00' }}
                />
              ) : (
                <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: '#FF5A00', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: 'white', fontSize: 20, fontWeight: '900' }}>
                    {(authUser.displayName ?? 'U')[0].toUpperCase()}
                  </Text>
                </View>
              )}
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <Cloud size={13} color="#10B981" />
                  <Text style={{ fontSize: 11, fontWeight: '800', color: '#10B981', textTransform: 'uppercase', letterSpacing: 1 }}>
                    {language === 'nl' ? 'Gesynchroniseerd' : 'Synced'}
                  </Text>
                </View>
                <Text style={{ fontSize: 16, fontWeight: '900', color: '#0F172A', marginBottom: 1 }}>
                  {authUser.displayName ?? 'Google User'}
                </Text>
                {authUser.email && (
                  <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '600' }}>
                    {authUser.email}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                onPress={handleSignOut}
                style={{ padding: 10, borderRadius: 14, backgroundColor: '#FEF2F2', borderWidth: 1.5, borderColor: '#FECACA' }}
              >
                <LogOut size={18} color="#DC2626" />
              </TouchableOpacity>
            </View>
          ) : (
            // Anonymous / not signed in
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' }}>
                  <CloudOff size={22} color="#94A3B8" />
                </View>
                <View>
                  <Text style={{ fontSize: 15, fontWeight: '900', color: '#475569', marginBottom: 1 }}>
                    {language === 'nl' ? 'Niet gesynchroniseerd' : 'Not synced'}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '600' }}>
                    {language === 'nl' ? 'Alleen lokaal opgeslagen' : 'Saved locally only'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={handleLinkGoogle}
                disabled={linkingGoogle}
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: linkingGoogle ? '#E2E8F0' : '#FF5A00', borderRadius: 16, paddingVertical: 14 }}
              >
                <Link size={18} color="#fff" />
                <Text style={{ color: '#fff', fontWeight: '900', fontSize: 15 }}>
                  {linkingGoogle
                    ? (language === 'nl' ? 'Verbinden...' : 'Connecting...')
                    : (language === 'nl' ? 'Koppel Google Account' : 'Connect Google Account')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
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

        {/* Privacy & Social */}
        <View style={{ backgroundColor: 'white', borderWidth: 2, borderColor: '#E2E8F0', borderRadius: 24, padding: 24, marginBottom: 40, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8 }}>
          <Text style={{ fontSize: 11, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16 }}>
             {language === 'nl' ? 'Privacy & Extra' : 'Privacy & Extras'}
          </Text>

          <TouchableOpacity 
            onPress={handleTogglePublic}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Users size={20} color={isPublicProfile ? '#10B981' : '#94A3B8'} />
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <Text style={{ fontSize: 16, fontWeight: '800', color: '#0F172A' }}>
                    {language === 'nl' ? 'Publiek Profiel' : 'Public Profile'}
                  </Text>
                  <View style={{ backgroundColor: '#FF5A001A', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                    <Text style={{ color: '#FF5A00', fontSize: 9, fontWeight: '900', letterSpacing: 0.5 }}>BETA</Text>
                  </View>
                </View>
                <Text style={{ fontSize: 12, color: '#64748B', fontWeight: '500' }}>
                  {language === 'nl' ? 'Laat vrienden je statistieken zien' : 'Let friends see your stats'}
                </Text>
              </View>
            </View>
            <View style={{ width: 50, height: 28, borderRadius: 14, backgroundColor: isPublicProfile ? '#10B981' : '#E2E8F0', padding: 2, justifyContent: 'center', alignItems: isPublicProfile ? 'flex-end' : 'flex-start' }}>
               <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: 'white' }} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('/(modals)/manage-exercises' as any)}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, marginTop: 4 }}
          >
             <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
               <FileEdit size={20} color="#3B82F6" />
               <View>
                 <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                   <Text style={{ fontSize: 16, fontWeight: '800', color: '#0F172A' }}>
                     {language === 'nl' ? 'Eigen Oefeningen' : 'Custom Exercises'}
                   </Text>
                   <View style={{ backgroundColor: '#FF5A001A', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                     <Text style={{ color: '#FF5A00', fontSize: 9, fontWeight: '900', letterSpacing: 0.5 }}>BETA</Text>
                   </View>
                 </View>
                 <Text style={{ fontSize: 12, color: '#64748B', fontWeight: '500' }}>
                   {language === 'nl' ? 'Maak en beheer je oefeningen' : 'Create & manage your exercises'}
                 </Text>
               </View>
             </View>
             <Text style={{ fontSize: 20, color: '#CBD5E1', fontWeight: '900' }}>›</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
