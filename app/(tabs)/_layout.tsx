import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Activity, LayoutDashboard, Play, UserCircle, Users, Globe } from 'lucide-react-native';
import { useAppStore } from '../../src/store/useAppStore';

/**
 * Custom tab bar icon wrapper – shows a filled pill behind the icon when active.
 */
function TabIcon({
  icon: Icon,
  color,
  focused,
}: {
  icon: React.ComponentType<{ size: number; color: string; strokeWidth: number }>;
  color: string;
  focused: boolean;
}) {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: 46,
        height: 32,
        borderRadius: 16,
        backgroundColor: focused ? '#FF5A001A' : 'transparent',
      }}
    >
      <Icon size={22} color={color} strokeWidth={focused ? 2.5 : 1.8} />
    </View>
  );
}

export default function TabLayout() {
  const mode = useAppStore((state) => state.mode);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,           // ← icons only, no labels
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e2e8f0',
          paddingHorizontal: 4,
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
          elevation: 16,
          shadowColor: '#1E3A8A',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
        },
        tabBarActiveTintColor: '#FF5A00',
        tabBarInactiveTintColor: '#94a3b8',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Courtside',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={LayoutDashboard} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: 'Drills',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={Play} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="telemetry"
        options={{
          title: 'Telemetry',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={Activity} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={UserCircle} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="team"
        options={{
          href: mode === 'fun' ? undefined : null,
          title: 'Team',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={Users} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          href: null,
          title: 'Community',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={Globe} color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
