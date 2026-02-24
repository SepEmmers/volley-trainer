import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, Modal, Animated,
  Easing, Dimensions, Linking
} from 'react-native';
import Svg, { Circle, Path, Line, Rect, Ellipse, G } from 'react-native-svg';
import { PlayCircle } from 'lucide-react-native';
import { useTranslation } from '../i18n/useTranslation';

const { height: SCREEN_H, width: SCREEN_W } = Dimensions.get('window');

// ─── SVG Illustrations ────────────────────────────────────────────────────────
// Each illustration uses stick-figure style anatomy to show proper form.

const ImpactBadge = ({ level, label }: { level: string; label: string }) => {
  const colors: Record<string, { bg: string; text: string; dot: string }> = {
    low: { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
    medium: { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },
    high: { bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' },
  };
  const c = colors[level] || colors['low'];
  return (
    <View style={{ backgroundColor: c.bg, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c.dot }} />
      <Text style={{ color: c.text, fontWeight: '800', fontSize: 12 }}>{label}</Text>
    </View>
  );
};

// Jump illustration: shows 3 phases – wind up, peak, landing
const JumpIllustration = () => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', paddingHorizontal: 16 }}>
    {/* Phase 1: Crouch */}
    <View style={{ alignItems: 'center' }}>
      <Svg width={64} height={80} viewBox="0 0 64 80">
        {/* Head */}
        <Circle cx="32" cy="12" r="9" fill="none" stroke="#1E3A8A" strokeWidth="2.5" />
        {/* Torso */}
        <Line x1="32" y1="21" x2="32" y2="48" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Arms out */}
        <Line x1="32" y1="30" x2="12" y2="44" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
        <Line x1="32" y1="30" x2="52" y2="44" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Crouched legs */}
        <Line x1="32" y1="48" x2="18" y2="62" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
        <Line x1="18" y1="62" x2="12" y2="76" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
        <Line x1="32" y1="48" x2="46" y2="62" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
        <Line x1="46" y1="62" x2="52" y2="76" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
      </Svg>
      <Text style={{ fontSize: 10, color: '#64748b', fontWeight: '700', marginTop: 4 }}>Aanloop</Text>
    </View>

    {/* Phase 2: Peak jump */}
    <View style={{ alignItems: 'center', marginBottom: 24 }}>
      <Svg width={64} height={80} viewBox="0 0 64 80">
        <Circle cx="32" cy="10" r="9" fill="none" stroke="#FF5A00" strokeWidth="2.5" />
        <Line x1="32" y1="19" x2="32" y2="46" stroke="#FF5A00" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Arms raised */}
        <Line x1="32" y1="28" x2="10" y2="16" stroke="#FF5A00" strokeWidth="2.5" strokeLinecap="round"/>
        <Line x1="32" y1="28" x2="54" y2="16" stroke="#FF5A00" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Extended legs */}
        <Line x1="32" y1="46" x2="22" y2="64" stroke="#FF5A00" strokeWidth="2.5" strokeLinecap="round"/>
        <Line x1="22" y1="64" x2="20" y2="78" stroke="#FF5A00" strokeWidth="2.5" strokeLinecap="round"/>
        <Line x1="32" y1="46" x2="42" y2="64" stroke="#FF5A00" strokeWidth="2.5" strokeLinecap="round"/>
        <Line x1="42" y1="64" x2="44" y2="78" stroke="#FF5A00" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Arrow up */}
        <Path d="M 53 45 L 53 30 L 50 34 M 53 30 L 56 34" stroke="#FF5A00" strokeWidth="2" strokeLinecap="round" fill="none"/>
      </Svg>
      <Text style={{ fontSize: 10, color: '#FF5A00', fontWeight: '800', marginTop: 4 }}>Piek</Text>
    </View>

    {/* Phase 3: Landing */}
    <View style={{ alignItems: 'center' }}>
      <Svg width={64} height={80} viewBox="0 0 64 80">
        <Circle cx="32" cy="18" r="9" fill="none" stroke="#1E3A8A" strokeWidth="2.5" />
        <Line x1="32" y1="27" x2="32" y2="50" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
        <Line x1="32" y1="35" x2="14" y2="44" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
        <Line x1="32" y1="35" x2="50" y2="44" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Bent landing legs */}
        <Line x1="32" y1="50" x2="20" y2="62" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
        <Line x1="20" y1="62" x2="16" y2="76" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
        <Line x1="32" y1="50" x2="44" y2="62" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
        <Line x1="44" y1="62" x2="48" y2="76" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Ground line */}
        <Line x1="8" y1="77" x2="56" y2="77" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
      </Svg>
      <Text style={{ fontSize: 10, color: '#64748b', fontWeight: '700', marginTop: 4 }}>Landing</Text>
    </View>
  </View>
);

// Squat illustration: shows depth, knee tracking, spine angle
const SquatIllustration = () => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', paddingHorizontal: 16 }}>
    {/* Standing */}
    <View style={{ alignItems: 'center' }}>
      <Svg width={60} height={90} viewBox="0 0 60 90">
        <Circle cx="30" cy="10" r="8" fill="none" stroke="#1E3A8A" strokeWidth="2.5" />
        <Line x1="30" y1="18" x2="30" y2="50" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
        <Line x1="30" y1="30" x2="14" y2="42" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
        <Line x1="30" y1="30" x2="46" y2="42" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
        <Line x1="30" y1="50" x2="22" y2="70" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
        <Line x1="22" y1="70" x2="20" y2="85" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
        <Line x1="30" y1="50" x2="38" y2="70" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
        <Line x1="38" y1="70" x2="40" y2="85" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
        <Line x1="10" y1="86" x2="50" y2="86" stroke="#94a3b8" strokeWidth="2"/>
      </Svg>
      <Text style={{ fontSize: 10, color: '#64748b', fontWeight: '700', marginTop: 4 }}>Start</Text>
    </View>

    {/* Deep squat */}
    <View style={{ alignItems: 'center', marginBottom: 16 }}>
      <Svg width={60} height={90} viewBox="0 0 60 90">
        <Circle cx="30" cy="30" r="8" fill="none" stroke="#FF5A00" strokeWidth="2.5" />
        {/* Torso leaning slightly */}
        <Line x1="30" y1="38" x2="28" y2="60" stroke="#FF5A00" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Arms forward for balance */}
        <Line x1="29" y1="46" x2="8" y2="40" stroke="#FF5A00" strokeWidth="2.5" strokeLinecap="round"/>
        <Line x1="29" y1="46" x2="50" y2="40" stroke="#FF5A00" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Deep bent legs */}
        <Line x1="28" y1="60" x2="12" y2="72" stroke="#FF5A00" strokeWidth="2.5" strokeLinecap="round"/>
        <Line x1="12" y1="72" x2="10" y2="85" stroke="#FF5A00" strokeWidth="2.5" strokeLinecap="round"/>
        <Line x1="28" y1="60" x2="44" y2="72" stroke="#FF5A00" strokeWidth="2.5" strokeLinecap="round"/>
        <Line x1="44" y1="72" x2="46" y2="85" stroke="#FF5A00" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Knee alignment arrow */}
        <Path d="M 14 58 L 9 72" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3,2" strokeLinecap="round"/>
        <Line x1="10" y1="86" x2="50" y2="86" stroke="#94a3b8" strokeWidth="2"/>
      </Svg>
      <Text style={{ fontSize: 10, color: '#FF5A00', fontWeight: '800', marginTop: 4 }}>Diep</Text>
    </View>

    {/* Side view showing spine */}
    <View style={{ alignItems: 'center' }}>
      <Svg width={60} height={90} viewBox="0 0 60 90">
        <Text style={{ fontSize: 9, position: 'absolute', color: '#94a3b8' }}>Zij</Text>
        <Circle cx="36" cy="28" r="8" fill="none" stroke="#1E3A8A" strokeWidth="2.5" />
        {/* Torso side view */}
        <Path d="M 36 36 Q 32 50 30 62" stroke="#1E3A8A" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {/* One leg side */}
        <Line x1="30" y1="62" x2="18" y2="74" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
        <Line x1="18" y1="74" x2="16" y2="85" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Spine neutral label */}
        <Path d="M 42 30 L 49 50" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3,2" strokeLinecap="round"/>
        <Line x1="6" y1="86" x2="54" y2="86" stroke="#94a3b8" strokeWidth="2"/>
      </Svg>
      <Text style={{ fontSize: 10, color: '#64748b', fontWeight: '700', marginTop: 4 }}>Zij-aanzicht</Text>
    </View>
  </View>
);

// Shoulder illustration: shows scapular retraction, arm path
const ShoulderIllustration = () => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 16 }}>
    {/* Scapular retraction */}
    <View style={{ alignItems: 'center' }}>
      <Svg width={70} height={90} viewBox="0 0 70 90">
        <Circle cx="35" cy="12" r="9" fill="none" stroke="#1E3A8A" strokeWidth="2.5" />
        <Line x1="35" y1="21" x2="35" y2="52" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Shoulder blades pulled back */}
        <Path d="M 35 32 Q 16 28 10 38" stroke="#FF5A00" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <Path d="M 35 32 Q 54 28 60 38" stroke="#FF5A00" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {/* Arrows showing retraction */}
        <Path d="M 22 26 L 28 30" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
        <Path d="M 48 26 L 42 30" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
        <Line x1="35" y1="52" x2="24" y2="72" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
        <Line x1="24" y1="72" x2="22" y2="86" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
        <Line x1="35" y1="52" x2="46" y2="72" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
        <Line x1="46" y1="72" x2="48" y2="86" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
      </Svg>
      <Text style={{ fontSize: 10, color: '#64748b', fontWeight: '700', marginTop: 4 }}>Schouderblad</Text>
    </View>

    {/* Arm press arc */}
    <View style={{ alignItems: 'center' }}>
      <Svg width={70} height={90} viewBox="0 0 70 90">
        <Circle cx="35" cy="14" r="9" fill="none" stroke="#1E3A8A" strokeWidth="2.5" />
        <Line x1="35" y1="23" x2="35" y2="52" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Arms raised overhead */}
        <Line x1="35" y1="34" x2="12" y2="12" stroke="#FF5A00" strokeWidth="2.5" strokeLinecap="round"/>
        <Line x1="35" y1="34" x2="58" y2="12" stroke="#FF5A00" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Dumbbells */}
        <Circle cx="10" cy="10" r="4" fill="#FF5A00" opacity={0.7}/>
        <Circle cx="60" cy="10" r="4" fill="#FF5A00" opacity={0.7}/>
        {/* Arc path */}
        <Path d="M 14 34 Q 12 22 11 10" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3,2" fill="none"/>
        <Path d="M 56 34 Q 58 22 59 10" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3,2" fill="none"/>
        <Line x1="35" y1="52" x2="24" y2="72" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
        <Line x1="24" y1="72" x2="22" y2="86" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
        <Line x1="35" y1="52" x2="46" y2="72" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
        <Line x1="46" y1="72" x2="48" y2="86" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
      </Svg>
      <Text style={{ fontSize: 10, color: '#FF5A00', fontWeight: '800', marginTop: 4 }}>Armbaan</Text>
    </View>
  </View>
);

// Core illustration: shows neutral spine, anti-extension position
const CoreIllustration = () => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 16 }}>
    {/* Plank top view */}
    <View style={{ alignItems: 'center' }}>
      <Svg width={100} height={70} viewBox="0 0 100 70">
        {/* Body horizontal */}
        <Circle cx="15" cy="35" r="8" fill="none" stroke="#1E3A8A" strokeWidth="2.5" />
        <Line x1="23" y1="35" x2="72" y2="35" stroke="#1E3A8A" strokeWidth="3.5" strokeLinecap="round"/>
        {/* Forearms */}
        <Line x1="35" y1="35" x2="28" y2="52" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
        <Line x1="48" y1="35" x2="41" y2="52" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Feet */}
        <Line x1="72" y1="35" x2="80" y2="22" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
        <Line x1="72" y1="35" x2="80" y2="48" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Straight line indicator */}
        <Path d="M 8 14 L 85 14" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4,3"/>
        <Path d="M 8 56 L 85 56" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4,3"/>
      </Svg>
      <Text style={{ fontSize: 10, color: '#64748b', fontWeight: '700', marginTop: 4 }}>Plankpositie</Text>
    </View>

    {/* Anti-extension diagram */}
    <View style={{ alignItems: 'center' }}>
      <Svg width={80} height={70} viewBox="0 0 80 70">
        {/* Body supine (dead bug) */}
        <Circle cx="40" cy="12" r="8" fill="none" stroke="#1E3A8A" strokeWidth="2.5"/>
        <Line x1="40" y1="20" x2="40" y2="46" stroke="#1E3A8A" strokeWidth="3" strokeLinecap="round"/>
        {/* Arms up */}
        <Line x1="40" y1="30" x2="18" y2="18" stroke="#FF5A00" strokeWidth="2.5" strokeLinecap="round"/>
        <Line x1="40" y1="30" x2="62" y2="18" stroke="#FF5A00" strokeWidth="2.5" strokeLinecap="round"/>
        {/* One leg extended, one bent */}
        <Line x1="40" y1="46" x2="26" y2="58" stroke="#FF5A00" strokeWidth="2.5" strokeLinecap="round"/>
        <Line x1="26" y1="58" x2="18" y2="66" stroke="#FF5A00" strokeWidth="2.5" strokeLinecap="round"/>
        <Line x1="40" y1="46" x2="56" y2="52" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
        <Line x1="56" y1="52" x2="66" y2="46" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Ground */}
        <Line x1="4" y1="67" x2="76" y2="67" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3,2"/>
      </Svg>
      <Text style={{ fontSize: 10, color: '#FF5A00', fontWeight: '800', marginTop: 4 }}>Dead Bug</Text>
    </View>
  </View>
);

const IllustrationMap = {
  JumpSvg: JumpIllustration,
  SquatSvg: SquatIllustration,
  ShoulderSvg: ShoulderIllustration,
  CoreSvg: CoreIllustration,
};

// ─── Main Modal Component ─────────────────────────────────────────────────────

export default function ExerciseDetailModal({ exercise, visible, onClose }: {
  exercise: any;
  visible: boolean;
  onClose: () => void;
}) {
  const { t, getExerciseTrans } = useTranslation();
  const slideAnim = useRef(new Animated.Value(SCREEN_H)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_H,
        duration: 250,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!exercise) return null;

  const name = getExerciseTrans(exercise, 'name');
  const purpose = getExerciseTrans(exercise, 'purpose');
  const execution = getExerciseTrans(exercise, 'execution');

  const Illustration = (IllustrationMap as Record<string, () => React.ReactElement>)[exercise.visual] || JumpIllustration;

  const impactLabel = t(`modal.impactLabels.${exercise.impact || 'low'}`);
  const categoryLabel = t(`categories.${exercise.category}`);

  return (
    <Modal transparent animationType="none" visible={visible} onRequestClose={onClose}>
      {/* Backdrop */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
      />

      {/* Slide-up Panel */}
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: SCREEN_H * 0.88,
          backgroundColor: '#ffffff',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          transform: [{ translateY: slideAnim }],
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.18,
          shadowRadius: 16,
          elevation: 20,
        }}
      >
        {/* Drag Handle */}
        <View style={{ alignItems: 'center', paddingTop: 12, marginBottom: 4 }}>
          <View style={{ width: 40, height: 4, backgroundColor: '#CBD5E1', borderRadius: 2 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Header */}
          <View style={{ paddingHorizontal: 24, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <View style={{ backgroundColor: '#FFF7F0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 8 }}>
                <Text style={{ color: '#FF5A00', fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 }}>
                  {categoryLabel}
                </Text>
              </View>
              <Text style={{ fontSize: 22, fontWeight: '900', color: '#0F172A', lineHeight: 28 }}>{name}</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={{ backgroundColor: '#F1F5F9', borderRadius: 20, padding: 10, marginTop: 4 }}
            >
              <Text style={{ fontSize: 16, color: '#64748b', fontWeight: '800' }}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Illustration */}
          <View style={{
            marginHorizontal: 16,
            backgroundColor: '#F8FAFC',
            borderRadius: 20,
            paddingVertical: 24,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: '#E2E8F0',
          }}>
            <Illustration />
          </View>

          {/* Purpose */}
          <View style={{ paddingHorizontal: 24, marginBottom: 20 }}>
            <Text style={{ fontSize: 11, fontWeight: '800', color: '#1E3A8A', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>
              {t('modal.purpose')}
            </Text>
            <Text style={{ fontSize: 15, color: '#334155', lineHeight: 24, fontWeight: '500' }}>
              {purpose}
            </Text>
          </View>

          {/* Execution */}
          <View style={{ paddingHorizontal: 24, marginBottom: 20, backgroundColor: '#F0F9FF', marginHorizontal: 16, borderRadius: 16, paddingVertical: 16, borderWidth: 1, borderColor: '#BAE6FD' }}>
            <Text style={{ fontSize: 11, fontWeight: '800', color: '#0369A1', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>
              {t('modal.execution')}
            </Text>
            <Text style={{ fontSize: 15, color: '#1E40AF', lineHeight: 24, fontWeight: '500' }}>
              {execution}
            </Text>
          </View>

          {/* Muscles */}
          {exercise.muscles && exercise.muscles.length > 0 && (
            <View style={{ paddingHorizontal: 24, marginBottom: 20 }}>
              <Text style={{ fontSize: 11, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>
                {t('modal.muscles')}
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {exercise.muscles.map((m: string, i: number) => (
                  <View key={i} style={{ backgroundColor: '#F1F5F9', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#E2E8F0' }}>
                    <Text style={{ color: '#475569', fontSize: 13, fontWeight: '700' }}>{m}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Impact Level */}
          <View style={{ paddingHorizontal: 24, marginBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Text style={{ fontSize: 11, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1.5 }}>
              {t('modal.impactLevel')}:
            </Text>
            <ImpactBadge level={exercise.impact || 'low'} label={impactLabel} />
          </View>

          {/* Watch Video Button */}
          {exercise.videoUrl && (
            <View style={{ paddingHorizontal: 24, paddingBottom: 8 }}>
              <TouchableOpacity
                onPress={() => Linking.openURL(exercise.videoUrl)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  backgroundColor: '#FF5A00',
                  borderRadius: 18,
                  paddingVertical: 16,
                  shadowColor: '#FF5A00',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
                  elevation: 8,
                }}
              >
                <PlayCircle size={22} color="#ffffff" />
                <Text style={{ color: '#ffffff', fontWeight: '900', fontSize: 17, letterSpacing: 0.5 }}>
                  {t('modal.watchVideo')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}
