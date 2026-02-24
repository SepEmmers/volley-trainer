import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, Modal,
  Animated, Easing, Dimensions
} from 'react-native';
import { useAppStore } from '../../src/store/useAppStore';
import { openChest, CHEST_PRICE } from '../../src/engine/chestEngine';
import { ALL_ITEMS, RARITIES, PLAYER_ITEMS, BALL_ITEMS, COURT_ITEMS, HALL_ITEMS, JERSEY_ITEMS } from '../../src/engine/items';
import { useTranslation } from '../../src/i18n/useTranslation';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path, G, Line, Ellipse } from 'react-native-svg';
import { Package, Star, Lock, Trophy, Zap } from 'lucide-react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// ─── Volleyball SVG Icon ──────────────────────────────────────────────────────
const VolleyballIcon = ({ size = 32, color = '#FF5A00' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10" />
    <Path d="M12 2a15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0 4 10" />
    <Path d="M2 12h20" />
  </Svg>
);

// ─── Animated Volleyball Chest SVG ────────────────────────────────────────────
const VolleyballChest = ({ isOpening, scale }: { isOpening: boolean; scale: Animated.Value }) => (
  <Animated.View style={{ transform: [{ scale }] }}>
    <Svg width={180} height={160} viewBox="0 0 180 160">
      {/* Chest Body */}
      <G>
        {/* Bottom body */}
        <Path d="M 20 80 L 20 140 Q 20 155 35 155 L 145 155 Q 160 155 160 140 L 160 80 Z"
          fill="#1E3A8A" stroke="#0F2563" strokeWidth="2" />
        {/* Lid */}
        <Path d={isOpening ? "M 18 80 Q 18 30 90 28 Q 162 30 162 80 Z" : "M 18 80 Q 18 50 90 48 Q 162 50 162 80 Z"}
          fill="#FF5A00" stroke="#CC4800" strokeWidth="2" />
        {/* Volleyball on lid */}
        <Circle cx="90" cy="62" r="18" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.9" />
        <Path d="M 90 44 Q 98 62 90 80" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.9" />
        <Path d="M 90 44 Q 82 62 90 80" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.9" />
        <Line x1="72" y1="62" x2="108" y2="62" stroke="#ffffff" strokeWidth="1.5" opacity="0.9" />
        {/* Lock/clasp */}
        <Path d="M 78 80 L 78 96 Q 78 102 90 102 Q 102 102 102 96 L 102 80 Z"
          fill={isOpening ? '#10B981' : '#FFD700'} stroke="#000" strokeWidth="1" />
        <Circle cx="90" cy="90" r="5" fill={isOpening ? '#fff' : '#CC9900'} />
        {/* Decorative stripes */}
        <Line x1="35" y1="110" x2="145" y2="110" stroke="#2D58C4" strokeWidth="3" opacity="0.5" />
        <Line x1="35" y1="125" x2="145" y2="125" stroke="#2D58C4" strokeWidth="3" opacity="0.5" />
        {/* Hinges */}
        <Ellipse cx="35" cy="80" rx="6" ry="4" fill="#FFD700" />
        <Ellipse cx="145" cy="80" rx="6" ry="4" fill="#FFD700" />
      </G>
    </Svg>
  </Animated.View>
);

// ─── Rarity Badge ─────────────────────────────────────────────────────────────
const RarityBadge = ({ rarity, language }: { rarity: string; language: string }) => {
  const r = RARITIES[rarity as keyof typeof RARITIES] || RARITIES.common;
  return (
    <View style={{ backgroundColor: r.color + '22', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1.5, borderColor: r.color }}>
      <Text style={{ color: r.color, fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {r.label[language as 'nl' | 'en'] || r.label.nl}
      </Text>
    </View>
  );
};

// ─── Collectible Item Card ────────────────────────────────────────────────────
const ItemCard = ({ item, owned, language }: { item: any; owned: boolean; language: string }) => {
  const r = RARITIES[item.rarity as keyof typeof RARITIES] || RARITIES.common;
  return (
    <View style={{
      width: (SCREEN_W - 56) / 3,
      aspectRatio: 0.85,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: owned ? r.color : '#E2E8F0',
      backgroundColor: owned ? r.color + '11' : '#F8FAFC',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 8,
      margin: 4,
    }}>
      {owned ? (
        <>
          <Text style={{ fontSize: 28, marginBottom: 4 }}>{item.emoji}</Text>
          <Text numberOfLines={1} style={{ fontSize: 9, fontWeight: '800', color: r.color, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.3 }}>
            {item.name?.[language] || item.name?.nl}
          </Text>
        </>
      ) : (
        <>
          <Lock size={20} color="#CBD5E1" />
          <Text style={{ fontSize: 9, fontWeight: '700', color: '#CBD5E1', marginTop: 6, textAlign: 'center' }}>???</Text>
        </>
      )}
    </View>
  );
};

// ─── Category Tab ─────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all', label: { nl: 'Alles', en: 'All' }, items: ALL_ITEMS },
  { id: 'player', label: { nl: 'Spelers', en: 'Players' }, items: PLAYER_ITEMS },
  { id: 'ball', label: { nl: 'Ballen', en: 'Balls' }, items: BALL_ITEMS },
  { id: 'court', label: { nl: 'Veld', en: 'Court' }, items: COURT_ITEMS },
  { id: 'hall', label: { nl: 'Zaal', en: 'Hall' }, items: HALL_ITEMS },
  { id: 'jersey', label: { nl: 'Tenue', en: 'Jersey' }, items: JERSEY_ITEMS },
];

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function TeamScreen() {
  const spikes = useAppStore(state => state.spikes);
  const inventory = useAppStore(state => state.inventory);
  const spendSpikes = useAppStore(state => state.spendSpikes);
  const awardSpikes = useAppStore(state => state.awardSpikes);
  const addToInventory = useAppStore(state => state.addToInventory);
  const { language } = useTranslation();

  const [activeCategory, setActiveCategory] = useState('all');
  const [isOpeningChest, setIsOpeningChest] = useState(false);
  const [resultItem, setResultItem] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);

  // Chest animations
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const resultSlide = useRef(new Animated.Value(300)).current;

  const canOpen = spikes >= CHEST_PRICE;
  const ownedSet = new Set(inventory);

  const handleOpenChest = async () => {
    if (!canOpen || isOpeningChest) return;
    setIsOpeningChest(true);
    setShowResult(false);

    // Phase 1: Shake animation
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -1, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 1.5, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -1.5, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();

    // Phase 2: Scale pulse + glow
    setTimeout(() => {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, { toValue: 1.2, duration: 200, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 0.95, duration: 150, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        ]),
      ]).start();
    }, 600);

    // Phase 3: Roll result and show it
    setTimeout(() => {
      const result = openChest(inventory);
      setResultItem(result.item);
      setIsDuplicate(result.isDuplicate);

      // Deduct cost and add to inventory
      spendSpikes(CHEST_PRICE);
      if (result.isNew) {
        addToInventory(result.item.id);
      } else {
        awardSpikes(result.duplicateSpikes);
      }

      // Slide in result card
      resultSlide.setValue(300);
      Animated.timing(resultSlide, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }).start();

      setShowResult(true);
      setIsOpeningChest(false);
    }, 1200);
  };

  const shakeInterpolate = shakeAnim.interpolate({
    inputRange: [-1.5, 0, 1.5],
    outputRange: ['-8deg', '0deg', '8deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.6],
  });

  const activeItems = CATEGORIES.find(c => c.id === activeCategory)?.items || ALL_ITEMS;
  const ownedCount = inventory.filter(id => ALL_ITEMS.find(i => i.id === id)).length;
  const rarity = resultItem ? RARITIES[resultItem.rarity as keyof typeof RARITIES] : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Header */}
        <View style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16, backgroundColor: '#1E3A8A' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View>
              <Text style={{ color: '#93C5FD', fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                {language === 'nl' ? 'Mijn Team' : 'My Team'}
              </Text>
              <Text style={{ color: '#ffffff', fontSize: 26, fontWeight: '900', marginTop: 2 }}>
                {language === 'nl' ? 'Volleybal Club' : 'Volleyball Club'}
              </Text>
            </View>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <VolleyballIcon size={20} color="#FF5A00" />
              <View>
                <Text style={{ color: '#93C5FD', fontSize: 9, fontWeight: '700', textTransform: 'uppercase' }}>
                  SPIKES
                </Text>
                <Text style={{ color: '#ffffff', fontSize: 22, fontWeight: '900' }}>{spikes}</Text>
              </View>
            </View>
          </View>

          {/* Stats Row */}
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
            <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: 12, alignItems: 'center' }}>
              <Trophy size={18} color="#FFD700" />
              <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '900', marginTop: 4 }}>{ownedCount}</Text>
              <Text style={{ color: '#93C5FD', fontSize: 10, fontWeight: '700' }}>{language === 'nl' ? 'Verzameld' : 'Collected'}</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: 12, alignItems: 'center' }}>
              <Star size={18} color="#C4B5FD" />
              <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '900', marginTop: 4 }}>{ALL_ITEMS.length}</Text>
              <Text style={{ color: '#93C5FD', fontSize: 10, fontWeight: '700' }}>{language === 'nl' ? 'Totaal' : 'Total'}</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: 12, alignItems: 'center' }}>
              <Package size={18} color="#86EFAC" />
              <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '900', marginTop: 4 }}>{Math.floor(spikes / CHEST_PRICE)}</Text>
              <Text style={{ color: '#93C5FD', fontSize: 10, fontWeight: '700' }}>{language === 'nl' ? 'Kisten' : 'Chests'}</Text>
            </View>
          </View>
        </View>

        {/* Chest Opening Section */}
        <View style={{ marginHorizontal: 20, marginTop: 20, borderRadius: 28, backgroundColor: '#ffffff', borderWidth: 2, borderColor: canOpen ? '#FF5A00' : '#E2E8F0', overflow: 'hidden', shadowColor: '#FF5A00', shadowOffset: { width: 0, height: 4 }, shadowOpacity: canOpen ? 0.15 : 0, shadowRadius: 16, elevation: canOpen ? 8 : 2 }}>

          <View style={{ padding: 24, alignItems: 'center' }}>
            <Text style={{ fontSize: 12, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>
              {language === 'nl' ? 'Volleybal Kist' : 'Volleyball Chest'}
            </Text>

            {/* Glow Layer */}
            <Animated.View style={{ position: 'absolute', top: 40, width: 200, height: 200, borderRadius: 100, backgroundColor: canOpen ? '#FF5A00' : '#CBD5E1', opacity: glowOpacity, transform: [{ scale: 1.5 }] }} />

            {/* Chest */}
            <Animated.View style={{ transform: [{ rotate: shakeInterpolate }] }}>
              <VolleyballChest isOpening={isOpeningChest} scale={scaleAnim} />
            </Animated.View>

            {/* Cost badge */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFF7F0', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8, marginTop: 4, marginBottom: 16, borderWidth: 1.5, borderColor: '#FFD4B3' }}>
              <VolleyballIcon size={16} color="#FF5A00" />
              <Text style={{ fontSize: 15, fontWeight: '900', color: '#FF5A00' }}>{CHEST_PRICE} Spikes</Text>
            </View>

            {/* Open Button */}
            <TouchableOpacity
              onPress={handleOpenChest}
              disabled={!canOpen || isOpeningChest}
              style={{
                width: '100%',
                backgroundColor: canOpen ? '#FF5A00' : '#E2E8F0',
                borderRadius: 18,
                paddingVertical: 18,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 10,
                shadowColor: '#FF5A00',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: canOpen ? 0.4 : 0,
                shadowRadius: 12,
                elevation: canOpen ? 6 : 0,
              }}
            >
              <VolleyballIcon size={22} color={canOpen ? '#ffffff' : '#94A3B8'} />
              <Text style={{ color: canOpen ? '#ffffff' : '#94A3B8', fontWeight: '900', fontSize: 18, letterSpacing: 0.5 }}>
                {isOpeningChest
                  ? (language === 'nl' ? 'Openen...' : 'Opening...')
                  : (language === 'nl' ? 'Open Kist' : 'Open Chest')}
              </Text>
            </TouchableOpacity>

            {!canOpen && (
              <Text style={{ color: '#94A3B8', fontSize: 13, fontWeight: '600', marginTop: 10, textAlign: 'center' }}>
                {language === 'nl'
                  ? `Nog ${CHEST_PRICE - spikes} Spikes nodig. Voltooi trainingen om te verdienen!`
                  : `Need ${CHEST_PRICE - spikes} more Spikes. Complete workouts to earn!`}
              </Text>
            )}
          </View>

          {/* Result reveal after opening */}
          {showResult && resultItem && rarity && (
            <Animated.View
              style={{
                borderTopWidth: 2,
                borderTopColor: rarity.color,
                backgroundColor: rarity.color + '11',
                padding: 20,
                alignItems: 'center',
                transform: [{ translateY: resultSlide }],
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: '800', color: rarity.color, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>
                {isDuplicate
                  ? (language === 'nl' ? '🎊 Duplicaat (+30 Spikes)' : '🎊 Duplicate (+30 Spikes)')
                  : (language === 'nl' ? '🎉 Nieuw Item!' : '🎉 New Item!')}
              </Text>
              <Text style={{ fontSize: 52, marginBottom: 8 }}>{resultItem.emoji}</Text>
              <Text style={{ fontSize: 20, fontWeight: '900', color: '#0F172A', marginBottom: 6 }}>
                {resultItem.name?.[language] || resultItem.name?.nl}
              </Text>
              <RarityBadge rarity={resultItem.rarity} language={language} />
              <Text style={{ fontSize: 13, color: '#64748B', marginTop: 8, textAlign: 'center', fontWeight: '500' }}>
                {resultItem.desc?.[language] || resultItem.desc?.nl}
              </Text>
            </Animated.View>
          )}
        </View>

        {/* Spike Info */}
        <View style={{ marginHorizontal: 20, marginTop: 12, backgroundColor: '#F0FDF4', borderRadius: 16, padding: 14, borderWidth: 1.5, borderColor: '#86EFAC', flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Zap size={20} color="#10B981" />
          <Text style={{ flex: 1, fontSize: 13, color: '#065F46', fontWeight: '600', lineHeight: 20 }}>
            {language === 'nl'
              ? `Verdien 50 🏐 Spikes per voltooide training. Nog ${Math.max(0, CHEST_PRICE - spikes)} Spikes tot je volgende kist!`
              : `Earn 50 🏐 Spikes per completed workout. ${Math.max(0, CHEST_PRICE - spikes)} Spikes until your next chest!`}
          </Text>
        </View>

        {/* Collection */}
        <View style={{ marginTop: 24, paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '900', color: '#0F172A', marginBottom: 12 }}>
            {language === 'nl' ? '📦 Collectie' : '📦 Collection'}
          </Text>

          {/* Category Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setActiveCategory(cat.id)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 12,
                  marginRight: 8,
                  backgroundColor: activeCategory === cat.id ? '#1E3A8A' : '#F1F5F9',
                }}
              >
                <Text style={{ color: activeCategory === cat.id ? '#ffffff' : '#64748B', fontWeight: '800', fontSize: 13 }}>
                  {cat.label[language as 'nl' | 'en'] || cat.label.nl}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Items Grid */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 }}>
            {activeItems.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                owned={ownedSet.has(item.id)}
                language={language}
              />
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
