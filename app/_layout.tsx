import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import 'react-native-reanimated';
import '../global.css';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});
import { useColorScheme } from '@/hooks/use-color-scheme';
import { subscribeToAuthState } from '../src/services/authService';
import { downloadFromCloud, mergeCloudWithLocal } from '../src/services/syncService';
import { useAuthStore } from '../src/store/useAuthStore';
import { useAppStore } from '../src/store/useAppStore';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);
  const hydrateFromCloud = useAppStore((s) => s.hydrateFromCloud);

  const [hasHydrated, setHasHydrated] = useState(() => useAppStore.persist.hasHydrated());

  useEffect(() => {
    const unsub = useAppStore.persist.onFinishHydration(() => setHasHydrated(true));
    return () => unsub();
  }, []);

  useEffect(() => {
    // Wait for AsyncStorage to be fully loaded into Zustand state
    // before making routing decisions or merging local with cloud.
    if (!hasHydrated) return;

    const unsubscribe = subscribeToAuthState(async (fbUser) => {
      if (fbUser) {
        setUser({
          uid: fbUser.uid,
          displayName: fbUser.displayName,
          email: fbUser.email,
          photoURL: fbUser.photoURL,
          isAnonymous: fbUser.isAnonymous,
        });

        // For signed-in (non-anon) users, pull cloud data then decide route
        let isOnboarded = useAppStore.getState().isOnboarded;

        if (!fbUser.isAnonymous) {
          try {
            const cloud = await downloadFromCloud(fbUser.uid);
            if (cloud) {
              const local = useAppStore.getState();
              const merged = mergeCloudWithLocal(cloud as any, local as any);
              hydrateFromCloud(merged);
              // Read onboarded from the merged data — not from the store which
              // may not have applied the set() yet when we evaluate the route.
              isOnboarded = !!(merged as any).isOnboarded;
            }
          } catch (_) {
            // Offline – use local data, isOnboarded already set above
          }
        }

        router.replace(isOnboarded ? '/(tabs)' : '/(onboarding)/profile');
      } else {
        clearUser();
        router.replace('/login' as any);
      }
    });
    return unsubscribe;
  }, [hasHydrated]);


  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1, backgroundColor: Platform.OS === 'web' ? '#0F172A' : '#ffffff', alignItems: 'center' }}>
        <View style={{ flex: 1, width: '100%', maxWidth: Platform.OS === 'web' ? 500 : '100%', backgroundColor: '#ffffff', overflow: 'hidden', boxShadow: Platform.OS === 'web' ? '0px 0px 40px rgba(0,0,0,0.5)' : 'none' }}>
          <Stack>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
            <Stack.Screen name="(modals)/manage-exercises" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="(modals)/settings-profile" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="(modals)/settings-account" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="(modals)/settings-privacy" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="(modals)/settings-preferences" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
        </View>
      </View>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
