import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, Modal, Animated,
  Easing, Dimensions, Linking, Image
} from 'react-native';
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

const IllustrationMap = {
  JumpSvg: require('../../assets/images/exercises/jump.png'),
  SquatSvg: require('../../assets/images/exercises/squat.png'),
  ShoulderSvg: require('../../assets/images/exercises/shoulder.png'),
  CoreSvg: require('../../assets/images/exercises/core.png'),
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

  const illustrationSource = (IllustrationMap as Record<string, any>)[exercise.visual] || IllustrationMap.JumpSvg;

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
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Image 
              source={illustrationSource} 
              style={{ width: '100%', height: 200 }} 
              resizeMode="contain" 
            />
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
