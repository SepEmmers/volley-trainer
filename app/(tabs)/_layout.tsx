import { Tabs } from 'expo-router';
import React from 'react';
import { Activity, LayoutDashboard, Play, UserCircle, Users } from 'lucide-react-native';
import { useAppStore } from '../../src/store/useAppStore';

export default function TabLayout() {
  const mode = useAppStore(state => state.mode);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff', // brand-white
          borderTopColor: '#e2e8f0', // slate-200
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
          elevation: 10,
          shadowColor: '#1E3A8A',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
        tabBarActiveTintColor: '#FF5A00', // brand-orange
        tabBarInactiveTintColor: '#94a3b8', // slate-400
        tabBarLabelStyle: {
          fontWeight: 'bold',
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Courtside',
          tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} strokeWidth={color === '#FF5A00' ? 2.5 : 2} />,
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: 'Drills',
          tabBarIcon: ({ color }) => <Play size={24} color={color} strokeWidth={color === '#FF5A00' ? 2.5 : 2} />,
        }}
      />
      <Tabs.Screen
        name="telemetry"
        options={{
          title: 'Telemetry',
          tabBarIcon: ({ color }) => <Activity size={24} color={color} strokeWidth={color === '#FF5A00' ? 2.5 : 2} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <UserCircle size={24} color={color} strokeWidth={color === '#FF5A00' ? 2.5 : 2} />,
        }}
      />
      <Tabs.Screen
        name="team"
        options={{
          href: mode === 'fun' ? undefined : null,
          title: 'Team',
          tabBarIcon: ({ color }) => <Users size={24} color={color} strokeWidth={color === '#FF5A00' ? 2.5 : 2} />,
        }}
      />
    </Tabs>
  );
}
