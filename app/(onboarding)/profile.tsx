import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { router } from 'expo-router';
import { useAppStore } from '../../src/store/useAppStore';
import { User, Ruler, Weight, Target, Shield, Zap, ChevronRight, Activity, ArrowUpRight, Trophy, Gamepad2, BarChart2 } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { useTranslation } from '../../src/i18n/useTranslation';

export default function ProfileScreen() {
  const profile = useAppStore(state => state.profile);
  const setMode = useAppStore(state => state.setMode);
  const { t } = useTranslation();
  const [data, setData] = useState(profile);
  const [step, setStep] = useState(1);
  const [selectedMode, setSelectedMode] = useState<'serious' | 'fun'>('serious');

  const TOTAL_STEPS = 4;

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(s => s + 1);
    } else {
      // Save mode and profile then navigate to assessment
      setMode(selectedMode);
      useAppStore.setState({ profile: data });
      router.push('/(onboarding)/assessment');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-brand-white relative">
      <View className="absolute -top-32 -left-32 opacity-5 pointer-events-none">
         <Svg width="400" height="400" viewBox="0 0 24 24" fill="none" stroke="#1E3A8A" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round">
            <Circle cx="12" cy="12" r="10" />
            <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10" />
            <Path d="M12 2a15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0 4 10" />
            <Path d="M2 12h20" />
          </Svg>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
      <View className="px-6 pt-6 pb-4 flex-1">
        <View className="flex-row justify-between items-center mb-8">
          <View className="flex-row items-center gap-2">
            <Trophy color="#FF5A00" size={26} />
            <Text className="text-2xl font-black text-brand-dark tracking-tight">CourtReady</Text>
          </View>
          <View className="bg-slate-100 px-3 py-1 bg-brand-blue/10 rounded-full border border-brand-blue/20">
             <Text className="text-brand-blue font-bold text-xs">STEP {step}/{TOTAL_STEPS}</Text>
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {step === 1 && (
            <View className="space-y-6">
              <Text className="text-4xl font-black text-brand-dark leading-tight tracking-tight mt-4">Initialize your{'\n'}Athlete Profile.</Text>
              
              <View className="mt-8">
                <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Display Name / Alias</Text>
                <TextInput 
                  value={data.name}
                  onChangeText={(t) => setData({...data, name: t})}
                  placeholder="e.g. Volleyball Phenom"
                  placeholderTextColor="#94a3b8"
                  className="w-full bg-white border-2 border-slate-200 rounded-2xl p-5 text-brand-dark text-lg font-medium shadow-sm focus:border-brand-orange"
                />
              </View>

              <View className="mt-6">
                <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">System Units</Text>
                <View className="flex-row bg-slate-100 rounded-2xl p-1.5 border border-slate-200">
                  <TouchableOpacity onPress={() => setData({...data, units: 'metric'})} className={`flex-1 py-4 rounded-xl items-center transition-colors ${data.units === 'metric' ? 'bg-white shadow-sm border border-slate-200' : ''}`}>
                    <Text className={`font-bold ${data.units === 'metric' ? 'text-brand-blue' : 'text-slate-400'}`}>Metric (kg/cm)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setData({...data, units: 'imperial'})} className={`flex-1 py-4 rounded-xl items-center transition-colors ${data.units === 'imperial' ? 'bg-white shadow-sm border border-slate-200' : ''}`}>
                    <Text className={`font-bold ${data.units === 'imperial' ? 'text-brand-blue' : 'text-slate-400'}`}>Imperial (lbs/in)</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {step === 2 && (
            <View className="space-y-6">
              <Text className="text-4xl font-black text-brand-dark leading-tight tracking-tight mt-4">Input Base{'\n'}Metrics.</Text>
              <View className="flex-row gap-4 mt-8">
                <View className="flex-1 bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm">
                  <View className="flex-row items-center gap-2 mb-4">
                    <User size={16} color="#64748b" />
                    <Text className="text-xs font-bold text-slate-500 uppercase tracking-widest">Age</Text>
                  </View>
                  <View className="flex-row items-baseline gap-1 border-b-2 border-slate-100 pb-2">
                    <TextInput 
                      value={data.age?.toString() || '25'}
                      onChangeText={(t) => setData({...data, age: parseInt(t) || 0})}
                      keyboardType="numeric"
                      className="text-4xl font-black text-brand-dark p-0 min-w-[70px]"
                    />
                  </View>
                </View>
                <View className="flex-1" />
              </View>

              <View className="flex-row gap-4 mt-4">
                <View className="flex-1 bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm">
                  <View className="flex-row items-center gap-2 mb-4">
                    <Ruler size={16} color="#64748b" />
                    <Text className="text-xs font-bold text-slate-500 uppercase tracking-widest">Height</Text>
                  </View>
                  <View className="flex-row items-baseline gap-1 border-b-2 border-slate-100 pb-2">
                    <TextInput 
                      value={data.height.toString()}
                      onChangeText={(t) => setData({...data, height: parseInt(t) || 0})}
                      keyboardType="numeric"
                      className="text-4xl font-black text-brand-dark p-0 min-w-[70px]"
                    />
                    <Text className="text-slate-400 font-bold">{data.units === 'metric' ? 'cm' : 'in'}</Text>
                  </View>
                </View>

                <View className="flex-1 bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm">
                  <View className="flex-row items-center gap-2 mb-4">
                    <Weight size={16} color="#64748b" />
                    <Text className="text-xs font-bold text-slate-500 uppercase tracking-widest">Weight</Text>
                  </View>
                  <View className="flex-row items-baseline gap-1 border-b-2 border-slate-100 pb-2">
                    <TextInput 
                      value={data.weight.toString()}
                      onChangeText={(t) => setData({...data, weight: parseInt(t) || 0})}
                      keyboardType="numeric"
                      className="text-4xl font-black text-brand-dark p-0 min-w-[70px]"
                    />
                    <Text className="text-slate-400 font-bold">{data.units === 'metric' ? 'kg' : 'lbs'}</Text>
                  </View>
                </View>
              </View>

               <View className="mt-8">
                <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Equipment Available</Text>
                <View className="flex-row bg-slate-100 rounded-2xl p-1.5 border border-slate-200">
                  <TouchableOpacity onPress={() => setData({...data, equipment: 'bodyweight'})} className={`flex-1 py-4 rounded-xl items-center transition-colors ${data.equipment === 'bodyweight' ? 'bg-white shadow-sm border border-slate-200' : ''}`}>
                    <Text className={`font-bold ${data.equipment === 'bodyweight' ? 'text-brand-orange' : 'text-slate-400'}`}>Bodyweight Only</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setData({...data, equipment: 'dumbbells'})} className={`flex-1 py-4 rounded-xl items-center transition-colors ${data.equipment === 'dumbbells' ? 'bg-white shadow-sm border border-slate-200' : ''}`}>
                    <Text className={`font-bold ${data.equipment === 'dumbbells' ? 'text-brand-orange' : 'text-slate-400'}`}>Dumbbells Access</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {step === 3 && (
            <View className="space-y-6 pb-12">
              <Text className="text-4xl font-black text-brand-dark leading-tight tracking-tight mt-4">Set Training{'\n'}Parameters.</Text>
              
              <View className="mt-8">
                <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Primary Focus</Text>
                <View className="space-y-3">
                  {[
                    { id: 'vertical', icon: ArrowUpRight, label: 'Max Vertical Jump', desc: 'Prioritize explosiveness and height', bg: 'bg-brand-orange/10', color: '#FF5A00' },
                    { id: 'injury', icon: Shield, label: 'Injury Prehabilitation', desc: 'Joint resilience and longevity', bg: 'bg-emerald-500/10', color: '#10b981' },
                    { id: 'agility', icon: Target, label: 'Court Agility', desc: 'Lateral quickness and reaction', bg: 'bg-brand-blue/10', color: '#1E3A8A' }
                  ].map(g => (
                    <TouchableOpacity 
                      key={g.id} 
                      onPress={() => setData({...data, goal: g.id})} 
                      className={`flex-row items-center p-5 rounded-3xl border-2 transition-all ${data.goal === g.id ? `border-[${g.color}] bg-white shadow-md` : 'bg-slate-50 border-slate-200'}`}
                      style={{ marginBottom: 12, borderColor: data.goal === g.id ? g.color : '#e2e8f0' }}
                    >
                      <View className={`p-3 rounded-2xl ${g.bg}`}>
                        <g.icon color={g.color} size={28} />
                      </View>
                      <View className="ml-5 flex-1">
                        <Text className={`font-black text-lg ${data.goal === g.id ? 'text-brand-dark' : 'text-slate-500'}`}>{g.label}</Text>
                        <Text className={`text-sm mt-0.5 font-medium ${data.goal === g.id ? 'text-slate-500' : 'text-slate-400'}`}>{g.desc}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View className="mt-6">
                <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Training Experience</Text>
                <View className="flex-row bg-slate-100 rounded-2xl p-1.5 border border-slate-200">
                  {['novice', 'intermediate', 'advanced'].map(lvl => (
                    <TouchableOpacity 
                      key={lvl} 
                      onPress={() => setData({...data, level: lvl})} 
                      className={`flex-1 py-4 rounded-xl items-center transition-colors ${data.level === lvl ? 'bg-white shadow-sm border border-slate-200' : ''}`}
                    >
                      <Text className={`font-bold capitalize ${data.level === lvl ? 'text-brand-orange' : 'text-slate-400'}`}>{lvl}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View className="flex-row gap-4 mt-6">
                <View className="flex-1">
                  <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Days / Week</Text>
                  <View className="bg-slate-100 rounded-2xl p-1.5 border border-slate-200">
                    {[2, 3, 4].map(d => (
                       <TouchableOpacity key={d} onPress={() => setData({...data, daysPerWeek: d})} className={`py-3 rounded-xl transition-colors ${data.daysPerWeek === d ? 'bg-white shadow-sm border border-slate-200' : ''}`}>
                          <Text className={`text-center font-bold ${data.daysPerWeek === d ? 'text-brand-blue' : 'text-slate-400'}`}>{d} Days</Text>
                       </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Time / Session</Text>
                  <View className="bg-slate-100 rounded-2xl p-1.5 border border-slate-200">
                    {[30, 45, 60].map(m => (
                       <TouchableOpacity key={m} onPress={() => setData({...data, timePerDay: m})} className={`py-3 rounded-xl transition-colors ${data.timePerDay === m ? 'bg-white shadow-sm border border-slate-200' : ''}`}>
                          <Text className={`text-center font-bold ${data.timePerDay === m ? 'text-brand-blue' : 'text-slate-400'}`}>{m} Min</Text>
                       </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

            </View>
          )}

          {/* Step 4: Mode Selection */}
          {step === 4 && (
            <View style={{ gap: 20 }}>
              <Text className="text-4xl font-black text-brand-dark leading-tight tracking-tight mt-4">
                Kies jouw{'\n'}Ervaringsstijl.
              </Text>
              <Text className="text-slate-500 font-medium text-lg">
                Je kunt dit later altijd wisselen in je profiel.
              </Text>

              {/* Serious Mode Card */}
              <TouchableOpacity
                onPress={() => setSelectedMode('serious')}
                style={{
                  borderRadius: 24,
                  borderWidth: 2.5,
                  borderColor: selectedMode === 'serious' ? '#1E3A8A' : '#E2E8F0',
                  backgroundColor: selectedMode === 'serious' ? '#EFF6FF' : '#FAFAFA',
                  padding: 24,
                  marginTop: 8,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                  <View style={{ backgroundColor: selectedMode === 'serious' ? '#1E3A8A' : '#F1F5F9', borderRadius: 16, padding: 12 }}>
                    <BarChart2 size={28} color={selectedMode === 'serious' ? '#ffffff' : '#94A3B8'} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 20, fontWeight: '900', color: '#0F172A', marginBottom: 2 }}>🏆 Serieus</Text>
                    <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '600' }}>Prestatie & Analyse</Text>
                  </View>
                  {selectedMode === 'serious' && (
                    <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#1E3A8A', alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ color: 'white', fontSize: 14, fontWeight: '900' }}>✓</Text>
                    </View>
                  )}
                </View>
                <Text style={{ fontSize: 14, color: '#475569', lineHeight: 22, fontWeight: '500' }}>
                  Focust op trainingsstatistieken, voortgang en AI-coaching. Geen spelletjes — alleen resultaten.
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                  {['📊 Statistieken', '🤖 AI Coach', '📅 Kalender', '💪 Progressie'].map(t => (
                    <View key={t} style={{ backgroundColor: '#DBEAFE', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
                      <Text style={{ fontSize: 11, color: '#1E40AF', fontWeight: '700' }}>{t}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>

              {/* OF Divider */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ flex: 1, height: 1.5, backgroundColor: '#E2E8F0' }} />
                <Text style={{ fontSize: 12, fontWeight: '900', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1.5 }}>OF</Text>
                <View style={{ flex: 1, height: 1.5, backgroundColor: '#E2E8F0' }} />
              </View>

              {/* Fun Mode Card */}
              <TouchableOpacity
                onPress={() => setSelectedMode('fun')}
                style={{
                  borderRadius: 24,
                  borderWidth: 2.5,
                  borderColor: selectedMode === 'fun' ? '#FF5A00' : '#E2E8F0',
                  backgroundColor: selectedMode === 'fun' ? '#FFF7F0' : '#FAFAFA',
                  padding: 24,
                }}
              >
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                  <View style={{ backgroundColor: selectedMode === 'fun' ? '#FF5A00' : '#F1F5F9', borderRadius: 16, padding: 12 }}>
                    <Gamepad2 size={28} color={selectedMode === 'fun' ? '#ffffff' : '#94A3B8'} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 20, fontWeight: '900', color: '#0F172A', marginBottom: 2 }}>🎮 Plezier</Text>
                    <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '600' }}>Alles + Team Builder</Text>
                  </View>
                  {selectedMode === 'fun' && (
                    <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#FF5A00', alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ color: 'white', fontSize: 14, fontWeight: '900' }}>✓</Text>
                    </View>
                  )}
                </View>

                {/* ✅ Includes Serieus banner */}
                <View style={{ backgroundColor: '#F0FDF4', borderRadius: 12, borderWidth: 1.5, borderColor: '#86EFAC', padding: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Text style={{ fontSize: 16 }}>✅</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: '900', color: '#166534' }}>Bevat alles van Serieus</Text>
                    <Text style={{ fontSize: 11, color: '#15803D', fontWeight: '600', marginTop: 1 }}>Statistieken · AI Coach · Kalender · Progressie</Text>
                  </View>
                </View>

                <Text style={{ fontSize: 14, color: '#475569', lineHeight: 22, fontWeight: '500' }}>
                  Plus: verdien Spikes 🏐 door te trainen en open Volleybal Kisten om spelers, veld-skins en meer te verzamelen!
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                  {['🏐 Spikes Valuta', '📦 Volleybal Kisten', '👥 Team Bouwen', '✨ Zeldzame Items'].map(tag => (
                    <View key={tag} style={{ backgroundColor: '#FEE2E2', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
                      <Text style={{ fontSize: 11, color: '#991B1B', fontWeight: '700' }}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            </View>
          )}

        </ScrollView>
        <View className="flex-row gap-4 pt-4 mt-4 border-t border-slate-200 bg-brand-white">
          {step > 1 && (
            <TouchableOpacity onPress={() => setStep(s => s - 1)} className="px-6 py-5 rounded-2xl bg-slate-100 items-center justify-center border border-slate-200 hover:bg-slate-200">
              <Text className="font-bold text-slate-500">Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            onPress={handleNext}
            disabled={step === 1 && !data.name}
            className={`flex-1 flex-row items-center justify-center bg-brand-orange py-5 rounded-2xl shadow-lg shadow-brand-orange/30 transition-transform active:scale-95 ${(step === 1 && !data.name) ? 'opacity-50' : ''}`}
          >
            <Text className="text-white font-black mr-2 text-lg">{step < TOTAL_STEPS ? 'Continue' : 'Start Assessment'}</Text>
            <ChevronRight color="#ffffff" size={24} strokeWidth={3} />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', gap: 12, paddingTop: 16, paddingBottom: 8, marginTop: 8, borderTopWidth: 1, borderTopColor: '#E2E8F0', backgroundColor: '#FAFAFA' }}>
          {step > 1 && (
            <TouchableOpacity
              onPress={() => setStep(s => s - 1)}
              style={{ paddingHorizontal: 24, paddingVertical: 18, borderRadius: 20, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#E2E8F0', minWidth: 90 }}
            >
              <Text style={{ fontWeight: '800', color: '#64748B', fontSize: 15 }}>← Terug</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handleNext}
            disabled={step === 1 && !data.name}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: (step === 1 && !data.name) ? '#E2E8F0' : '#FF5A00',
              paddingVertical: 18,
              borderRadius: 20,
              gap: 8,
              shadowColor: '#FF5A00',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: (step === 1 && !data.name) ? 0 : 0.3,
              shadowRadius: 10,
              elevation: (step === 1 && !data.name) ? 0 : 6,
            }}
          >
            <Text style={{ color: (step === 1 && !data.name) ? '#94A3B8' : '#ffffff', fontWeight: '900', fontSize: 17 }}>
              {step < TOTAL_STEPS ? 'Volgende →' : '🎯 Start Assessment'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
