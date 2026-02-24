import React, { useEffect, useState } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { router } from 'expo-router';
import { useAppStore } from '../../src/store/useAppStore';
import { Dumbbell, Shield, Trophy } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

const BouncingBall = () => {
    const translateY = new Animated.Value(0);
    const rotate = new Animated.Value(0);
  
    useEffect(() => {
      Animated.loop(
        Animated.parallel([
           Animated.sequence([
            Animated.timing(translateY, {
              toValue: -40,
              duration: 600,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: 0,
              duration: 500,
              easing: Easing.in(Easing.cubic),
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(rotate, {
              toValue: 1,
              duration: 2200,
              easing: Easing.linear,
              useNativeDriver: true,
          })
        ])
      ).start();
    }, []);

    const spin = rotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });
  
    return (
      <Animated.View style={{ transform: [{ translateY }, { rotate: spin }] }}>
        <Svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#FF5A00" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <Circle cx="12" cy="12" r="10" />
          <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10" />
          <Path d="M12 2a15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0 4 10" />
          <Path d="M2 12h20" />
        </Svg>
      </Animated.View>
    );
  };

export default function GeneratingScreen() {
  const [logs, setLogs] = useState<{text: string, icon: any}[]>([]);
  const profile = useAppStore(state => state.profile);
  const completeOnboarding = useAppStore(state => state.completeOnboarding);
  
  // Fake Athletic Playbook Generation Animation
  useEffect(() => {
    const sequence = [
      { text: 'Analyzing biomechanics...', icon: Dumbbell },
      { text: `Optimizing for ${profile.goal.replace('_', ' ')}...`, icon: Trophy },
      { text: `Structuring ${profile.daysPerWeek} day microcycle...`, icon: Dumbbell },
      { text: `Applying injury prevention protocols...`, icon: Shield },
      { text: 'Playbook Ready.', icon: Trophy }
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < sequence.length) {
        setLogs(prev => [...prev, sequence[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          // Finalize onboarding and push to tabs
          completeOnboarding(profile);
          router.replace('/(tabs)');
        }, 1200);
      }
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-brand-white items-center justify-center p-8">
      <View className="items-center mb-16 mt-12 bg-slate-50 border border-slate-100 p-12 rounded-[50px] shadow-sm">
        <BouncingBall />
        <Text className="text-3xl font-black text-brand-dark mt-10 tracking-tight text-center">Building Your{'\n'}Playbook</Text>
      </View>
      
      <View className="w-full max-w-sm h-[250px]">
        {logs.map((log, index) => {
           const Icon = log.icon;
           const isLast = index === logs.length - 1;
           return (
            <View key={index} className="flex-row items-center gap-4 mb-4">
                <View className={`w-8 h-8 rounded-full items-center justify-center ${isLast ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                    <Icon size={14} color={isLast ? '#ffffff' : '#94a3b8'} />
                </View>
                <Text 
                    className={`font-bold text-base ${isLast ? 'text-emerald-500' : 'text-slate-500'}`}
                >
                    {log.text}
                </Text>
            </View>
           )
        })}
      </View>
    </SafeAreaView>
  );
}
