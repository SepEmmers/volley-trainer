import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogIn, CloudOff, Trophy } from 'lucide-react-native';
import { signInWithGoogle, signInAnonymously } from '../src/services/authService';
import { useAuthStore } from '../src/store/useAuthStore';
import { downloadFromCloud, mergeCloudWithLocal } from '../src/services/syncService';
import { useAppStore } from '../src/store/useAppStore';

export default function LoginScreen() {
  const setUser = useAuthStore((s) => s.setUser);
  const hydrateFromCloud = useAppStore((s) => s.hydrateFromCloud);
  const isOnboarded = useAppStore((s) => s.isOnboarded);
  const [loading, setLoading] = useState<'google' | 'anon' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGoogle = async () => {
    setLoading('google');
    setError(null);
    try {
      const fbUser = await signInWithGoogle();
      setUser({
        uid: fbUser.uid,
        displayName: fbUser.displayName,
        email: fbUser.email,
        photoURL: fbUser.photoURL,
        isAnonymous: false,
      });
      const cloud = await downloadFromCloud(fbUser.uid);
      if (cloud) {
        const local = useAppStore.getState();
        const merged = mergeCloudWithLocal(cloud as any, local as any);
        hydrateFromCloud(merged);
      }
      router.replace(isOnboarded ? '/(tabs)' : '/(onboarding)/profile');
    } catch (e: any) {
      setError(e.message ?? 'Sign-in failed. Try again.');
    } finally {
      setLoading(null);
    }
  };

  const handleAnonymous = async () => {
    setLoading('anon');
    setError(null);
    try {
      const fbUser = await signInAnonymously();
      setUser({
        uid: fbUser.uid,
        displayName: null,
        email: null,
        photoURL: null,
        isAnonymous: true,
      });
      router.replace(isOnboarded ? '/(tabs)' : '/(onboarding)/profile');
    } catch (e: any) {
      setError(e.message ?? 'Could not start session. Try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      <View style={{ flex: 1, paddingHorizontal: 28, justifyContent: 'center' }}>

        {/* Logo / Branding */}
        <View style={{ alignItems: 'center', marginBottom: 56 }}>
          <View
            style={{
              width: 88,
              height: 88,
              borderRadius: 28,
              backgroundColor: '#FF5A00',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
              shadowColor: '#FF5A00',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.35,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            <Trophy size={44} color="#fff" />
          </View>
          <Text
            style={{
              fontSize: 34,
              fontWeight: '900',
              color: '#0F172A',
              letterSpacing: -1,
              marginBottom: 8,
            }}
          >
            CourtReady
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: '#64748B',
              fontWeight: '600',
              textAlign: 'center',
              lineHeight: 24,
            }}
          >
            Jouw volleybal trainingsplan,{'\n'}overal en op elk apparaat.
          </Text>
        </View>

        {/* Sign-in buttons */}
        <View style={{ gap: 14 }}>
          {/* Google button */}
          <TouchableOpacity
            onPress={handleGoogle}
            disabled={!!loading}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              backgroundColor: loading === 'google' ? '#E2E8F0' : '#FF5A00',
              borderRadius: 20,
              paddingVertical: 18,
              shadowColor: '#FF5A00',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: loading ? 0 : 0.3,
              shadowRadius: 14,
              elevation: loading ? 0 : 8,
            }}
          >
            {loading === 'google' ? (
              <ActivityIndicator color="#FF5A00" />
            ) : (
              <>
                {/* Google "G" logo */}
                <View
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 13,
                    backgroundColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: '900', color: '#4285F4' }}>
                    G
                  </Text>
                </View>
                <Text style={{ color: '#fff', fontSize: 17, fontWeight: '900' }}>
                  Inloggen met Google
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              marginVertical: 4,
            }}
          >
            <View style={{ flex: 1, height: 1.5, backgroundColor: '#E2E8F0' }} />
            <Text
              style={{
                fontSize: 11,
                fontWeight: '900',
                color: '#94A3B8',
                textTransform: 'uppercase',
                letterSpacing: 1.5,
              }}
            >
              of
            </Text>
            <View style={{ flex: 1, height: 1.5, backgroundColor: '#E2E8F0' }} />
          </View>

          {/* Anonymous button */}
          <TouchableOpacity
            onPress={handleAnonymous}
            disabled={!!loading}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              backgroundColor: '#F1F5F9',
              borderRadius: 20,
              paddingVertical: 16,
              borderWidth: 1.5,
              borderColor: '#E2E8F0',
            }}
          >
            {loading === 'anon' ? (
              <ActivityIndicator color="#64748B" />
            ) : (
              <>
                <CloudOff size={20} color="#64748B" />
                <Text style={{ color: '#475569', fontSize: 16, fontWeight: '700' }}>
                  Doorgaan zonder account
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Error */}
        {error && (
          <View
            style={{
              marginTop: 20,
              backgroundColor: '#FEF2F2',
              borderRadius: 14,
              padding: 14,
              borderWidth: 1,
              borderColor: '#FECACA',
            }}
          >
            <Text style={{ color: '#DC2626', fontSize: 13, fontWeight: '600', textAlign: 'center' }}>
              {error}
            </Text>
          </View>
        )}

        {/* Privacy note */}
        <Text
          style={{
            fontSize: 12,
            color: '#94A3B8',
            textAlign: 'center',
            marginTop: 32,
            lineHeight: 18,
          }}
        >
          Door in te loggen synchroniseer je jouw voortgang automatisch via Google Firebase.
        </Text>
      </View>
    </SafeAreaView>
  );
}
