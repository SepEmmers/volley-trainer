import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useAppStore } from '../../src/store/useAppStore';
import { useSocialStore } from '../../src/store/useSocialStore';
import { updatePublicProfile } from '../../src/services/socialService';
import { Users, Calendar, TrendingUp, Archive, FileEdit, ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from '../../src/i18n/useTranslation';

export default function SettingsPrivacyScreen() {
  const { language } = useTranslation();
  const authUser = useAuthStore(s => s.user);
  const isPublicProfile = useSocialStore(s => s.isPublicProfile);
  const setIsPublicProfile = useSocialStore(s => s.setIsPublicProfile);
  const publicProfileOptions = useSocialStore(s => s.publicProfileOptions || { showCalendar: false, showProgress: false, showCollection: false, showTeam: false });
  const setPublicProfileOption = useSocialStore(s => s.setPublicProfileOption);

  const handleTogglePublic = async () => {
    const newVal = !isPublicProfile;
    setIsPublicProfile(newVal);
    if (authUser && !authUser.isAnonymous) {
      try {
        const state = useAppStore.getState();
        const options = useSocialStore.getState().publicProfileOptions || {};
        await updatePublicProfile(authUser.uid, {
            displayName: state.profile.name || authUser.displayName,
            photoURL: authUser.photoURL,
            level: state.profile.level,
            ...(options.showCalendar ? { workoutHistory: state.workoutHistory } : {}),
            ...(options.showProgress ? { stats: state.stats } : {}),
            ...(options.showCollection ? { inventory: state.inventory } : {}),
            ...(options.showTeam ? { team: state.equipped?.players || [] } : {})
        }, newVal);
      } catch (_) {}
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-brand-white">
      <View className="pt-4 px-6 pb-5 border-b border-slate-200 bg-white shadow-sm flex-row items-center gap-4 z-10">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <ArrowLeft color="#0F172A" size={24} />
        </TouchableOpacity>
        <Text className="text-2xl font-black text-brand-dark tracking-tight">
          {language === 'nl' ? 'Privacy & Extra' : 'Privacy & Extras'}
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Privacy & Social */}
        <View style={{ backgroundColor: 'white', borderWidth: 2, borderColor: '#E2E8F0', borderRadius: 24, padding: 24, marginBottom: 40, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8 }}>
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

          {/* Optional Profile Toggles */}
          {isPublicProfile && (
            <View style={{ paddingLeft: 16, paddingTop: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 16, gap: 16 }}>
              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => setPublicProfileOption('showCalendar', !publicProfileOptions.showCalendar)}
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Calendar size={18} color="#64748B" />
                  <Text style={{ fontSize: 15, color: '#334155', fontWeight: '700' }}>
                    {language === 'nl' ? 'Toon Kalender' : 'Show Calendar'}
                  </Text>
                </View>
                <View style={{ width: 44, height: 24, borderRadius: 12, backgroundColor: publicProfileOptions.showCalendar ? '#3B82F6' : '#E2E8F0', padding: 2, justifyContent: 'center', alignItems: publicProfileOptions.showCalendar ? 'flex-end' : 'flex-start' }}>
                  <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'white' }} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => setPublicProfileOption('showProgress', !publicProfileOptions.showProgress)}
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <TrendingUp size={18} color="#64748B" />
                  <Text style={{ fontSize: 15, color: '#334155', fontWeight: '700' }}>
                    {language === 'nl' ? 'Toon Progressie (Stats)' : 'Show Progress (Stats)'}
                  </Text>
                </View>
                <View style={{ width: 44, height: 24, borderRadius: 12, backgroundColor: publicProfileOptions.showProgress ? '#3B82F6' : '#E2E8F0', padding: 2, justifyContent: 'center', alignItems: publicProfileOptions.showProgress ? 'flex-end' : 'flex-start' }}>
                  <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'white' }} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => setPublicProfileOption('showCollection', !publicProfileOptions.showCollection)}
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Archive size={18} color="#64748B" />
                  <Text style={{ fontSize: 15, color: '#334155', fontWeight: '700' }}>
                    {language === 'nl' ? 'Toon Collectie (Items)' : 'Show Collection (Items)'}
                  </Text>
                </View>
                <View style={{ width: 44, height: 24, borderRadius: 12, backgroundColor: publicProfileOptions.showCollection ? '#3B82F6' : '#E2E8F0', padding: 2, justifyContent: 'center', alignItems: publicProfileOptions.showCollection ? 'flex-end' : 'flex-start' }}>
                  <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'white' }} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => setPublicProfileOption('showTeam', !publicProfileOptions.showTeam)}
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Users size={18} color="#64748B" />
                  <Text style={{ fontSize: 15, color: '#334155', fontWeight: '700' }}>
                    {language === 'nl' ? 'Toon Team (Spelers)' : 'Show Team (Players)'}
                  </Text>
                </View>
                <View style={{ width: 44, height: 24, borderRadius: 12, backgroundColor: publicProfileOptions.showTeam ? '#3B82F6' : '#E2E8F0', padding: 2, justifyContent: 'center', alignItems: publicProfileOptions.showTeam ? 'flex-end' : 'flex-start' }}>
                  <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'white' }} />
                </View>
              </TouchableOpacity>

              <Text style={{ fontSize: 12, color: '#94A3B8', marginTop: 4, paddingRight: 16 }}>
                {language === 'nl' ? 'Je wijzigingen worden automatisch gesynchroniseerd.' : 'Your changes are synced automatically.'}
              </Text>
            </View>
          )}

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
