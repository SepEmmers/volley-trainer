import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useAppStore } from '../../src/store/useAppStore';
import { signOut, linkAnonymousToGoogle } from '../../src/services/authService';
import { uploadToCloud } from '../../src/services/syncService';
import { LogOut, CloudOff, Cloud, Link, ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from '../../src/i18n/useTranslation';

export default function SettingsAccountScreen() {
  const { t, language } = useTranslation();
  const authUser = useAuthStore(s => s.user);
  const clearUser = useAuthStore(s => s.clearUser);
  const [linkingGoogle, setLinkingGoogle] = useState(false);

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
      <View className="pt-4 px-6 pb-5 border-b border-slate-200 bg-white shadow-sm flex-row items-center gap-4">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <ArrowLeft color="#0F172A" size={24} />
        </TouchableOpacity>
        <Text className="text-2xl font-black text-brand-dark tracking-tight">
          {language === 'nl' ? 'Account & Sync' : 'Account & Sync'}
        </Text>
      </View>

      <View className="flex-1 px-6 pt-6">
        <View style={{ backgroundColor: 'white', borderWidth: 2, borderColor: '#E2E8F0', borderRadius: 24, padding: 20, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8 }}>
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
      </View>
    </SafeAreaView>
  );
}
