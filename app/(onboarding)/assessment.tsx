import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useAppStore } from '../../src/store/useAppStore';
import { AlertCircle, CheckCircle2, Footprints, Target, Activity, ShieldPlus } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect, Line } from 'react-native-svg';

// Custom SVG illustrations for the assessment types to make it feel premium
const SquatSvg = () => (
  <Svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FF5A00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="7" r="4" />
    <Path d="M12 11v6" />
    <Path d="M12 17l-4 4" />
    <Path d="M12 17l4 4" />
    <Path d="M8 11h8" />
    <Line x1="4" y1="21" x2="20" y2="21" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2" />
  </Svg>
);

const ShoulderSvg = () => (
  <Svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1E3A8A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="5" r="3" />
    <Path d="M12 8v8" />
    <Path d="M12 16l-3 5" />
    <Path d="M12 16l3 5" />
    <Path d="M12 8l4 6" />
    <Path d="M12 8l-4 3" />
    <Circle cx="16" cy="14" r="2" fill="#1E3A8A" />
  </Svg>
);

const BalanceSvg = () => (
  <Svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="5" r="3" />
    <Path d="M12 8v9" />
    <Path d="M12 17l4 4" />
    <Path d="M12 13l-4-3" />
    <Path d="M12 8h4" />
    <Line x1="12" y1="21" x2="20" y2="21" stroke="#cbd5e1" strokeWidth="1" />
  </Svg>
);


export default function AssessmentScreen() {
  const profile = useAppStore(state => state.profile);
  const [currentTest, setCurrentTest] = useState(0);
  const [flags, setFlags] = useState<string[]>([]);

  const TESTS = [
    {
      id: 'ohsa',
      title: 'Overhead Squat',
      illustration: SquatSvg,
      desc: 'Perform a deep bodyweight squat with arms overhead. We are checking for ankle dorsiflexion and hip mobility limits.',
      flag: 'jumper_knee'
    },
    {
      id: 'apley',
      title: "Shoulder Mobility",
      illustration: ShoulderSvg,
      desc: 'Reach one hand behind your head and the other behind your lower back. Checking internal and external rotation for spiking health.',
      flag: 'shoulder_pain'
    },
    {
      id: 'balance',
      title: 'Single-Leg Balance',
      illustration: BalanceSvg,
      desc: 'Stand on one leg with a slight knee bend. Ensure your knee does not cave inward (valgus collapse).',
      flag: null
    }
  ];

  const handleResult = (passed: boolean) => {
    if (!passed && TESTS[currentTest].flag) {
      setFlags([...flags, TESTS[currentTest].flag]);
    }
    
    if (currentTest < TESTS.length - 1) {
      setCurrentTest(c => c + 1);
    } else {
      // Finished all tests
      const updatedProfile = { ...profile, history: [...new Set([...profile.history, ...flags])] };
      useAppStore.setState({ profile: updatedProfile });
      router.push('/(onboarding)/generating');
    }
  };

  const test = TESTS[currentTest];
  const Illustration = test.illustration;

  return (
    <SafeAreaView className="flex-1 bg-brand-white">
      <View className="p-6 flex-1 justify-center max-w-lg mx-auto w-full">
        
        {/* Progress Bar Header */}
        <View className="flex-row items-center gap-2 mb-8 justify-center">
            {TESTS.map((t, idx) => (
                <View 
                    key={t.id} 
                    className={`h-2 flex-1 rounded-full transition-all duration-300 ${idx <= currentTest ? 'bg-brand-blue' : 'bg-slate-200'}`} 
                />
            ))}
        </View>

        <View className="items-center mb-8 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 relative overflow-hidden">
          {/* Subtle background graphic */}
          <View className="absolute -right-8 -bottom-8 opacity-5">
             <ShieldPlus size={160} color="#1E3A8A" />
          </View>

          <View className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 bg-slate-50 border border-slate-100`}>
            {<Illustration />}
          </View>

          <View className="bg-slate-100 px-3 py-1 bg-brand-blue/10 rounded-full border border-brand-blue/20 mb-4">
            <Text className="text-brand-blue font-bold text-xs uppercase tracking-widest">Assessment {currentTest + 1} of {TESTS.length}</Text>
          </View>

          <Text className="text-3xl font-black text-brand-dark text-center mb-3 tracking-tight">{test.title}</Text>
          <Text className="text-slate-500 font-medium text-center text-base leading-relaxed px-2">{test.desc}</Text>
        </View>

        <View className="bg-white border-2 border-slate-200 rounded-3xl p-6 mb-8 shadow-sm">
          <Text className="text-brand-dark font-black text-lg text-center mb-6">Did you feel any pain or severe restriction?</Text>
          
          <View className="flex-row gap-4">
             <TouchableOpacity 
                onPress={() => handleResult(false)}
                className="flex-1 bg-red-50 border border-red-100 hover:bg-red-100 py-6 rounded-2xl items-center justify-center transition-colors shadow-sm"
              >
                <View className="w-10 h-10 rounded-full bg-red-100 items-center justify-center mb-3">
                  <AlertCircle color="#ef4444" size={24} />
                </View>
                <Text className="text-red-600 font-bold text-base">Yes, Restricted</Text>
             </TouchableOpacity>

             <TouchableOpacity 
                onPress={() => handleResult(true)}
                className="flex-1 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 py-6 rounded-2xl items-center justify-center transition-colors shadow-sm"
              >
                <View className="w-10 h-10 rounded-full bg-emerald-100 items-center justify-center mb-3">
                  <CheckCircle2 color="#10b981" size={24} />
                </View>
                <Text className="text-emerald-600 font-bold text-base">No, Feels Great</Text>
             </TouchableOpacity>
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
}
