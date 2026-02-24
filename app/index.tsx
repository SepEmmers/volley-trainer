import { Redirect } from 'expo-router';
import { useAppStore } from '../src/store/useAppStore';

export default function Index() {
  const isOnboarded = useAppStore((state) => state.isOnboarded);

  if (isOnboarded) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(onboarding)/profile" />;
}
