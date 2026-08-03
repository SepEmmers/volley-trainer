import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useAppStore } from '../../src/store/useAppStore';
import { User, Settings, Shield, Globe, ChevronRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from '../../src/i18n/useTranslation';

export default function ProfileScreen() {
  const { t, language } = useTranslation();
  const authUser = useAuthStore(s => s.user);
  const profile = useAppStore(state => state.profile);

  const menuItems = [
    {
      id: 'profile',
      icon: Settings,
      title: language === 'nl' ? 'Atletenprofiel' : 'Athlete Profile',
      subtitle: language === 'nl' ? 'Lichaamsbouw, ervaringsniveau & doelen' : 'Metrics, experience & goals',
      color: '#F59E0B',
      bg: '#FEF3C7',
      route: '/(modals)/settings-profile'
    },
    {
      id: 'preferences',
      icon: Globe,
      title: language === 'nl' ? 'App Voorkeuren' : 'App Preferences',
      subtitle: language === 'nl' ? 'Taal & ervaringsstijl (Serious/Fun)' : 'Language & experience mode (Serious/Fun)',
      color: '#8B5CF6',
      bg: '#F3E8FF',
      route: '/(modals)/settings-preferences'
    },
    {
      id: 'privacy',
      icon: Shield,
      title: language === 'nl' ? 'Privacy & Extra' : 'Privacy & Extras',
      subtitle: language === 'nl' ? 'Eigen oefeningen & instellingen' : 'Custom exercises & settings',
      color: '#10B981',
      bg: '#D1FAE5',
      route: '/(modals)/settings-privacy'
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-brand-white">
      <View className="pt-4 px-6 pb-5 border-b border-slate-200 bg-white shadow-sm z-10">
        <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t('profile.header')}</Text>
        <Text className="text-2xl font-black text-brand-dark tracking-tight">{t('profile.title')}</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* User Stats Summary Block */}
        <View style={{ backgroundColor: 'white', borderWidth: 2, borderColor: '#E2E8F0', borderRadius: 24, padding: 20, marginBottom: 24, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
           {authUser?.photoURL ? (
              <Image
                source={{ uri: authUser.photoURL }}
                style={{ width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: '#FF5A00' }}
              />
            ) : (
              <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#FF5A00', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: 'white', fontSize: 24, fontWeight: '900' }}>
                  {(profile.name || authUser?.displayName || 'U')[0].toUpperCase()}
                </Text>
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 20, fontWeight: '900', color: '#0F172A', marginBottom: 2 }}>
                {profile.name || authUser?.displayName || (language === 'nl' ? 'Atleet' : 'Athlete')}
              </Text>
              <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '600', textTransform: 'capitalize' }}>
                {t(`profile.levels.${profile.level}`)} • {profile.goal}
              </Text>
            </View>
        </View>

        {/* Menu Items */}
        <View style={{ gap: 12 }}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => router.push(item.route as any)}
              style={{ backgroundColor: 'white', borderWidth: 2, borderColor: '#E2E8F0', borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 16 }}
            >
              <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: item.bg, alignItems: 'center', justifyContent: 'center' }}>
                 <item.icon color={item.color} size={24} />
              </View>
              <View style={{ flex: 1 }}>
                 <Text style={{ fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 2 }}>{item.title}</Text>
                 <Text style={{ fontSize: 12, fontWeight: '500', color: '#64748B' }}>{item.subtitle}</Text>
              </View>
              <ChevronRight color="#CBD5E1" size={20} />
            </TouchableOpacity>
          ))}

          {/* Redo Onboarding / Re-Generate Program Button */}
          <TouchableOpacity
            onPress={() => router.push('/(onboarding)/profile')}
            style={{ backgroundColor: '#FF5A00', borderRadius: 20, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 8 }}
          >
            <Text style={{ color: 'white', fontWeight: '900', fontSize: 16 }}>
              🔄 {language === 'nl' ? 'Onboarding Herdoen / Programma Opnieuw Genereren' : 'Redo Onboarding & Re-Generate Program'}
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
