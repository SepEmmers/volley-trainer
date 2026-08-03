import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, Modal,
  Animated, Easing, Dimensions
} from 'react-native';
import { useAppStore } from '../../src/store/useAppStore';
import { openChest, CHEST_PRICE } from '../../src/engine/chestEngine';
import { ALL_ITEMS, RARITIES, PLAYER_ITEMS, BALL_ITEMS, COURT_ITEMS, HALL_ITEMS, JERSEY_ITEMS } from '../../src/engine/items';
import { useTranslation } from '../../src/i18n/useTranslation';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path, G, Line, Ellipse, Rect, Text as SvgText } from 'react-native-svg';
import { Package, Star, Lock, Trophy, Zap, X, CheckCircle2, Play, Award, Sparkles } from 'lucide-react-native';
import VolleyMatchMiniGame from '../../src/components/VolleyMatchMiniGame';
import DailyQuestsModal from '../../src/components/DailyQuestsModal';

const { width: SCREEN_W } = Dimensions.get('window');

// ─── Volleyball SVG Icon ──────────────────────────────────────────────────────
const VolleyballIcon = ({ size = 32, color = '#FF5A00' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10" />
    <Path d="M12 2a15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0 4 10" />
    <Path d="M2 12h20" />
  </Svg>
);

// ─── Volleyball Court SVG ──────────────────────────────────────────────────────
const CourtSvg = ({ courtColor = '#4F7942', lineColor = '#ffffff', equipped }: { courtColor?: string; lineColor?: string; equipped: any }) => {
  const W = SCREEN_W - 48;
  const H = W * 0.62;
  const padX = W * 0.06;
  const padY = H * 0.08;
  const cW = W - padX * 2;
  const cH = H - padY * 2;

  // Player positions: back row 3, front row 3
  const playerPositions = [
    { x: padX + cW * 0.15, y: padY + cH * 0.25 },
    { x: padX + cW * 0.5,  y: padY + cH * 0.2  },
    { x: padX + cW * 0.85, y: padY + cH * 0.25 },
    { x: padX + cW * 0.15, y: padY + cH * 0.7  },
    { x: padX + cW * 0.5,  y: padY + cH * 0.75 },
    { x: padX + cW * 0.85, y: padY + cH * 0.7  },
  ];

  const equippedPlayers = equipped?.players || [];

  return (
    <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {/* Court background */}
      <Rect x={padX} y={padY} width={cW} height={cH} fill={courtColor} rx={4} />
      {/* Court outline */}
      <Rect x={padX} y={padY} width={cW} height={cH} fill="none" stroke={lineColor} strokeWidth={2} rx={4} />
      {/* Net (horizontal center line) */}
      <Line x1={padX} y1={padY + cH / 2} x2={padX + cW} y2={padY + cH / 2} stroke={lineColor} strokeWidth={3} />
      {/* Center line (vertical) */}
      <Line x1={padX + cW / 2} y1={padY} x2={padX + cW / 2} y2={padY + cH} stroke={lineColor} strokeWidth={1} strokeDasharray="4,4" opacity={0.5} />
      {/* Attack lines */}
      <Line x1={padX} y1={padY + cH * 0.35} x2={padX + cW} y2={padY + cH * 0.35} stroke={lineColor} strokeWidth={1} opacity={0.6} />
      <Line x1={padX} y1={padY + cH * 0.65} x2={padX + cW} y2={padY + cH * 0.65} stroke={lineColor} strokeWidth={1} opacity={0.6} />

      {/* Player spots */}
      {playerPositions.map((pos, i) => {
        const pId = equippedPlayers[i];
        const pItem = pId ? ALL_ITEMS.find((it: any) => it.id === pId) : null;
        const rColor = pItem ? RARITIES[pItem.rarity as keyof typeof RARITIES]?.color || '#FF5A00' : lineColor;
        return (
          <G key={i}>
            <Circle cx={pos.x} cy={pos.y} r={14} fill={pItem ? rColor + '33' : 'rgba(255,255,255,0.12)'} stroke={pItem ? rColor : lineColor} strokeWidth={2} />
            {pItem ? (
              <SvgText x={pos.x} y={pos.y + 5} textAnchor="middle" fontSize={14} fill={lineColor}>{pItem.emoji}</SvgText>
            ) : (
              <SvgText x={pos.x} y={pos.y + 5} textAnchor="middle" fontSize={11} fill={lineColor} opacity={0.5}>{i + 1}</SvgText>
            )}
          </G>
        );
      })}
    </Svg>
  );
};

// ─── Animated Volleyball Chest SVG ────────────────────────────────────────────
const VolleyballChest = ({ isOpening, scale }: { isOpening: boolean; scale: Animated.Value | 1 }) => (
  <Animated.View style={scale !== 1 ? { transform: [{ scale }] } : undefined}>
    <Svg width={180} height={160} viewBox="0 0 180 160">
      <G>
        <Path d="M 20 80 L 20 140 Q 20 155 35 155 L 145 155 Q 160 155 160 140 L 160 80 Z"
          fill="#1E3A8A" stroke="#0F2563" strokeWidth="2" />
        <Path d={isOpening ? "M 18 80 Q 18 30 90 28 Q 162 30 162 80 Z" : "M 18 80 Q 18 50 90 48 Q 162 50 162 80 Z"}
          fill="#FF5A00" stroke="#CC4800" strokeWidth="2" />
        <Circle cx="90" cy="62" r="18" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.9" />
        <Path d="M 90 44 Q 98 62 90 80" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.9" />
        <Path d="M 90 44 Q 82 62 90 80" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.9" />
        <Line x1="72" y1="62" x2="108" y2="62" stroke="#ffffff" strokeWidth="1.5" opacity="0.9" />
        <Path d="M 78 80 L 78 96 Q 78 102 90 102 Q 102 102 102 96 L 102 80 Z"
          fill={isOpening ? '#10B981' : '#FFD700'} stroke="#000" strokeWidth="1" />
        <Circle cx="90" cy="90" r="5" fill={isOpening ? '#fff' : '#CC9900'} />
        <Line x1="35" y1="110" x2="145" y2="110" stroke="#2D58C4" strokeWidth="3" opacity="0.5" />
        <Line x1="35" y1="125" x2="145" y2="125" stroke="#2D58C4" strokeWidth="3" opacity="0.5" />
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

// ─── Category Tab ─────────────────────────────────────────────────────────────
const ALL_CATEGORIES = [
  { id: 'all', label: { nl: 'Alles', en: 'All' }, items: ALL_ITEMS },
  { id: 'player', label: { nl: 'Spelers', en: 'Players' }, items: PLAYER_ITEMS },
  { id: 'ball', label: { nl: 'Ballen', en: 'Balls' }, items: BALL_ITEMS },
  { id: 'court', label: { nl: 'Veld', en: 'Court' }, items: COURT_ITEMS },
  { id: 'hall', label: { nl: 'Zaal', en: 'Hall' }, items: HALL_ITEMS },
  { id: 'jersey', label: { nl: 'Tenue', en: 'Jersey' }, items: JERSEY_ITEMS },
];

// Equip slot definitions (non-player)
const EQUIP_SLOTS = [
  { key: 'ball',   emoji: '🏐', label: { nl: 'Bal', en: 'Ball' },       items: BALL_ITEMS   },
  { key: 'jersey', emoji: '👕', label: { nl: 'Tenue', en: 'Jersey' },   items: JERSEY_ITEMS },
  { key: 'court',  emoji: '🟩', label: { nl: 'Veld', en: 'Court' },     items: COURT_ITEMS  },
  { key: 'hall',   emoji: '🏟️', label: { nl: 'Zaal', en: 'Hall' },     items: HALL_ITEMS   },
];

// ─── Equip Slot Button ─────────────────────────────────────────────────────────
const EquipSlotButton = ({
  slotKey, label, emoji, items, equipped, inventory, language, onPress,
}: {
  slotKey: string; label: any; emoji: string; items: any[]; equipped: any;
  inventory: string[]; language: string; onPress: () => void;
}) => {
  const equippedId = equipped?.[slotKey];
  const equippedItem = equippedId ? items.find((i: any) => i.id === equippedId) : null;
  const ownedInCategory = items.filter(i => inventory.includes(i.id));
  const hasOwned = ownedInCategory.length > 0;
  const r = equippedItem ? RARITIES[equippedItem.rarity as keyof typeof RARITIES] : null;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!hasOwned}
      style={{
        flex: 1,
        minWidth: '22%',
        margin: 4,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: equippedItem ? (r?.color || '#FF5A00') : '#E2E8F0',
        backgroundColor: equippedItem ? (r?.color || '#FF5A00') + '11' : '#F8FAFC',
        padding: 10,
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 22, marginBottom: 4 }}>{equippedItem ? equippedItem.emoji : emoji}</Text>
      <Text style={{ fontSize: 9, fontWeight: '800', color: equippedItem ? (r?.color || '#FF5A00') : '#94A3B8', textTransform: 'uppercase', textAlign: 'center' }}>
        {equippedItem
          ? (equippedItem.name?.[language] || equippedItem.name?.nl)
          : (label[language as 'nl' | 'en'] || label.nl)}
      </Text>
      {!hasOwned && (
        <Lock size={10} color="#CBD5E1" style={{ marginTop: 2 }} />
      )}
    </TouchableOpacity>
  );
};

// ─── Item Picker Modal ─────────────────────────────────────────────────────────
const ItemPickerModal = ({
  visible, slotKey, items, inventory, equipped, language, onEquip, onClose
}: {
  visible: boolean; slotKey: string | null; items: any[]; inventory: string[];
  equipped: any; language: string; onEquip: (id: string, cat: string) => void; onClose: () => void;
}) => {
  const ownedItems = items.filter(i => inventory.includes(i.id));
  if (!slotKey) return null;
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: '#ffffff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, maxHeight: '70%' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: '900', color: '#0F172A' }}>
              {language === 'nl' ? 'Kies Item' : 'Choose Item'}
            </Text>
            <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
              <X size={24} color="#64748B" />
            </TouchableOpacity>
          </View>
          {ownedItems.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <Lock size={32} color="#CBD5E1" />
              <Text style={{ color: '#94A3B8', fontWeight: '600', marginTop: 12, textAlign: 'center' }}>
                {language === 'nl' ? 'Geen items in deze categorie. Open kisten om items te verdienen!' : 'No items in this category. Open chests to earn items!'}
              </Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {ownedItems.map((item: any) => {
                  const r = RARITIES[item.rarity as keyof typeof RARITIES];
                  const isEquipped = equipped?.[slotKey] === item.id ||
                    (slotKey === 'player' && equipped?.players?.includes(item.id));
                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => { onEquip(item.id, slotKey); onClose(); }}
                      style={{
                        width: (SCREEN_W - 80) / 3,
                        borderRadius: 16,
                        borderWidth: 2.5,
                        borderColor: isEquipped ? r?.color : '#E2E8F0',
                        backgroundColor: isEquipped ? r?.color + '15' : '#F8FAFC',
                        padding: 12,
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ fontSize: 28, marginBottom: 4 }}>{item.emoji}</Text>
                      <Text numberOfLines={1} style={{ fontSize: 10, fontWeight: '800', color: r?.color, textAlign: 'center', textTransform: 'uppercase' }}>
                        {item.name?.[language] || item.name?.nl}
                      </Text>
                      {isEquipped && (
                        <View style={{ position: 'absolute', top: 6, right: 6 }}>
                          <CheckCircle2 size={14} color={r?.color} />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function TeamScreen() {
  const spikes = useAppStore(state => state.spikes);
  const inventory = useAppStore(state => state.inventory);
  const equipped = useAppStore(state => state.equipped);
  const spendSpikes = useAppStore(state => state.spendSpikes);
  const awardSpikes = useAppStore(state => state.awardSpikes);
  const addToInventory = useAppStore(state => state.addToInventory);
  const equipItem = useAppStore(state => state.equipItem);
  const { language } = useTranslation();

  const [activeTab, setActiveTab] = useState<'chest' | 'field' | 'collection'>('chest');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isOpeningChest, setIsOpeningChest] = useState(false);
  const [resultItem, setResultItem] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [pickerSlot, setPickerSlot] = useState<string | null>(null);
  const [pickerItems, setPickerItems] = useState<any[]>([]);
  const [showPicker, setShowPicker] = useState(false);

  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showQuestsModal, setShowQuestsModal] = useState(false);

  // Chest Unboxing States
  const [chestModalVisible, setChestModalVisible] = useState(false);
  const [unboxingPhase, setUnboxingPhase] = useState<'idle' | 'shaking' | 'teasing' | 'revealed'>('idle');
  
  // Animations inside Modal
  const modalShakeAnim = useRef(new Animated.Value(0)).current;
  const modalScaleAnim = useRef(new Animated.Value(1)).current;
  const modalGlowAnim = useRef(new Animated.Value(0)).current;
  const itemSpringAnim = useRef(new Animated.Value(0)).current; // 0 to 1 for the massive pop-in
  const flashOpacityAnim = useRef(new Animated.Value(0)).current; // Massive white flash

  const canOpen = spikes >= CHEST_PRICE;
  const ownedSet = new Set(inventory);

  const handleOpenChestClick = () => {
    if (!canOpen || chestModalVisible) return;
    setResultItem(null);
    setUnboxingPhase('shaking');
    setChestModalVisible(true);
    itemSpringAnim.setValue(0);
    flashOpacityAnim.setValue(0);
    modalScaleAnim.setValue(1);

    // 1. Initial aggressive shake and scale up
    Animated.parallel([
       Animated.sequence([
         Animated.timing(modalShakeAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
         Animated.timing(modalShakeAnim, { toValue: -1, duration: 100, useNativeDriver: true }),
         Animated.timing(modalShakeAnim, { toValue: 1.5, duration: 100, useNativeDriver: true }),
         Animated.timing(modalShakeAnim, { toValue: -1.5, duration: 100, useNativeDriver: true }),
         Animated.timing(modalShakeAnim, { toValue: 2, duration: 80, useNativeDriver: true }),
         Animated.timing(modalShakeAnim, { toValue: -2, duration: 80, useNativeDriver: true }),
         Animated.timing(modalShakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
       ]),
       Animated.timing(modalScaleAnim, { toValue: 1.3, duration: 600, easing: Easing.out(Easing.ease), useNativeDriver: true })
    ]).start(() => {
       // Roll the item mechanically behind the scenes
       const result = openChest(inventory);
       setResultItem((result as any).item);
       setIsDuplicate((result as any).isDuplicate);
       spendSpikes(CHEST_PRICE);
       
       if ((result as any).isNew) {
         addToInventory((result as any).item.id);
       } else {
         awardSpikes((result as any).duplicateSpikes);
       }

       // 2. Tease the exact rarity color with a massive glowing aura
       setUnboxingPhase('teasing');
       Animated.loop(
         Animated.sequence([
           Animated.timing(modalGlowAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
           Animated.timing(modalGlowAnim, { toValue: 0.5, duration: 800, useNativeDriver: true })
         ])
       ).start();
    });
  };

  const handleTeaseTap = () => {
    if (unboxingPhase !== 'teasing' || !resultItem) return;
    setUnboxingPhase('revealed');
    modalGlowAnim.stopAnimation();

    const isHighRarity = ['epic', 'legendary', 'mythic'].includes(resultItem.rarity);

    // If epic or higher, flash the screen white
    if (isHighRarity) {
       Animated.sequence([
         Animated.timing(flashOpacityAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
         Animated.timing(flashOpacityAnim, { toValue: 0, duration: 800, useNativeDriver: true })
       ]).start();
    }

    // Spring the item massively
    Animated.spring(itemSpringAnim, {
       toValue: 1,
       tension: 40,
       friction: 5,
       useNativeDriver: true
    }).start();
  };

  const closeChestModal = () => {
    setChestModalVisible(false);
    setUnboxingPhase('idle');
  };

  const openEquipPicker = (slotKey: string, items: any[]) => {
    setPickerSlot(slotKey);
    setPickerItems(items);
    setShowPicker(true);
  };

  const shakeInterpolate = modalShakeAnim.interpolate({
    inputRange: [-2, 0, 2],
    outputRange: ['-12deg', '0deg', '12deg'],
  });

  const rarity = resultItem ? RARITIES[resultItem.rarity as keyof typeof RARITIES] : null;

  // Derive the tease color heavily depending on rarity rank
  const teaseColor = rarity ? rarity.color : '#FFFFFF';
  const teaseGlow = modalGlowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const itemScale = itemSpringAnim.interpolate({ inputRange: [0, 1], outputRange: [0.1, 1] });

  const ownedCount = inventory.filter((id: string) => ALL_ITEMS.find((i: any) => i.id === id)).length;
  const activeItems = ALL_CATEGORIES.find(c => c.id === activeCategory)?.items || ALL_ITEMS;

  // Court color from equipped court/hall
  const equippedCourt = equipped?.court ? COURT_ITEMS.find((i: any) => i.id === equipped.court) : null;
  const courtColors: Record<string, string> = {
    court_grass: '#4F7942', court_sand: '#C2A06B', court_indoor: '#1E3A8A',
    court_red_clay: '#B94A48', court_night: '#0F172A', court_rainbow: '#6D28D9', court_ice: '#BAE6FD',
  };
  const courtBgColor = equippedCourt ? (courtColors[equippedCourt.id] || '#4F7942') : '#4F7942';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>

      {/* Item Picker Modal */}
      <ItemPickerModal
        visible={showPicker}
        slotKey={pickerSlot}
        items={pickerItems}
        inventory={inventory}
        equipped={equipped}
        language={language}
        onEquip={(id, cat) => equipItem(id, cat)}
        onClose={() => setShowPicker(false)}
      />

      {/* Chest Unboxing Modal */}
      <Modal visible={chestModalVisible} transparent animationType="fade" onRequestClose={closeChestModal}>
        <View style={{ flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.95)', justifyContent: 'center', alignItems: 'center' }}>
           {/* Step 1 & 2: Shaking Chest & Teasing Glow */}
           {(unboxingPhase === 'shaking' || unboxingPhase === 'teasing') && (
             <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
               {/* Massive Glow Aura */}
               <Animated.View style={{
                  position: 'absolute',
                  width: 300, height: 300, borderRadius: 150,
                  backgroundColor: unboxingPhase === 'teasing' ? teaseColor : '#FF5A00',
                  opacity: unboxingPhase === 'teasing' ? teaseGlow : 0,
                  transform: [{ scale: 2 }]
               }} />

               {/* Shaking Chest */}
               <Animated.View style={{ transform: [{ rotate: shakeInterpolate }, { scale: modalScaleAnim }] }}>
                 <VolleyballChest isOpening={unboxingPhase === 'teasing'} scale={1} />
               </Animated.View>

               {/* Tap to Reveal Prompt */}
               {unboxingPhase === 'teasing' && (
                 <Animated.View style={{ position: 'absolute', bottom: 100, opacity: teaseGlow }}>
                    <TouchableOpacity onPress={handleTeaseTap} style={{ backgroundColor: '#ffffff', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 30, shadowColor: teaseColor, shadowOpacity: 0.8, shadowRadius: 20, shadowOffset: { width:0, height:0 } }}>
                       <Text style={{ color: '#0F172A', fontSize: 22, fontWeight: '900', letterSpacing: 2 }}>
                         {language === 'nl' ? 'TIK OM TE ONTHULLEN!' : 'TAP TO REVEAL!'}
                       </Text>
                    </TouchableOpacity>
                 </Animated.View>
               )}
             </View>
           )}

           {/* Step 3: Massive Reveal Flash & Spring */}
           {unboxingPhase === 'revealed' && resultItem && (
             <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <Animated.View style={{
                   position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                   backgroundColor: '#ffffff', opacity: flashOpacityAnim, zIndex: 10
                }} />
                <Animated.View style={{
                   alignItems: 'center',
                   transform: [{ scale: itemScale }],
                   zIndex: 20
                }}>
                   <Text style={{ fontSize: 16, fontWeight: '900', color: teaseColor, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 20, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: {width: 0, height: 2}, textShadowRadius: 4 }}>
                     {isDuplicate ? (language === 'nl' ? 'DUPLICAAT (+30)' : 'DUPLICATE (+30)') : (language === 'nl' ? 'NIEUW GEWONNEN!' : 'NEW UNLOCK!')}
                   </Text>
                   <View style={{ width: 220, height: 220, borderRadius: 110, backgroundColor: teaseColor + '33', borderWidth: 8, borderColor: teaseColor, alignItems: 'center', justifyContent: 'center', shadowColor: teaseColor, shadowRadius: 40, shadowOpacity: 1, shadowOffset: {width:0, height:0} }}>
                     <Text style={{ fontSize: 100 }}>{resultItem.emoji}</Text>
                   </View>
                   <Text style={{ fontSize: 36, fontWeight: '900', color: '#ffffff', marginTop: 24, textAlign: 'center', textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: {width: 0, height: 2}, textShadowRadius: 8 }}>
                     {resultItem.name?.[language] || resultItem.name?.nl}
                   </Text>
                   <View style={{ marginTop: 12 }}><RarityBadge rarity={resultItem.rarity} language={language} /></View>
                   <Text style={{ fontSize: 16, color: '#CBD5E1', marginTop: 16, textAlign: 'center', paddingHorizontal: 40, lineHeight: 24 }}>
                     {resultItem.desc?.[language] || resultItem.desc?.nl}
                   </Text>

                   <TouchableOpacity onPress={closeChestModal} style={{ marginTop: 60, backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 40, paddingVertical: 16, borderRadius: 30, borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)' }}>
                     <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '800' }}>
                       {language === 'nl' ? 'DOORGAAN' : 'CONTINUE'}
                     </Text>
                   </TouchableOpacity>
                </Animated.View>
             </View>
           )}
        </View>
      </Modal>

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
                <Text style={{ color: '#93C5FD', fontSize: 9, fontWeight: '700', textTransform: 'uppercase' }}>SPIKES</Text>
                <Text style={{ color: '#ffffff', fontSize: 22, fontWeight: '900' }}>{spikes}</Text>
              </View>
            </View>
          </View>

          {/* Match Arena & Daily Quests Action Buttons */}
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
            <TouchableOpacity
              onPress={() => setShowMatchModal(true)}
              style={{ flex: 1, backgroundColor: '#FF5A00', borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, shadowColor: '#FF5A00', shadowOpacity: 0.4, shadowRadius: 8 }}
            >
              <Play fill="#ffffff" color="#ffffff" size={18} />
              <Text style={{ color: 'white', fontWeight: '900', fontSize: 14 }}>
                {language === 'nl' ? 'MATCH ARENA' : 'MATCH ARENA'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowQuestsModal(true)}
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', gap: 6 }}
            >
              <Award color="#FFD700" size={18} />
              <Text style={{ color: 'white', fontWeight: '900', fontSize: 13 }}>
                {language === 'nl' ? 'QUESTS' : 'QUESTS'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
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

          {/* Main Tabs */}
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
            {[
              { id: 'chest' as const,      label: language === 'nl' ? '📦 Kist'        : '📦 Chest'      },
              { id: 'field' as const,      label: language === 'nl' ? '🏟 Opstelling'  : '🏟 Lineup'     },
              { id: 'collection' as const, label: language === 'nl' ? '⭐ Collectie'   : '⭐ Collection' },
            ].map(tab => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  borderRadius: 14,
                  alignItems: 'center',
                  backgroundColor: activeTab === tab.id ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.08)',
                  borderWidth: activeTab === tab.id ? 1.5 : 0,
                  borderColor: 'rgba(255,255,255,0.35)',
                }}
              >
                <Text style={{ color: activeTab === tab.id ? '#ffffff' : '#93C5FD', fontWeight: '800', fontSize: 12 }}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── TAB: CHEST ───────────────────────────────────────────────────────── */}
        {activeTab === 'chest' && (
          <View>
            <View style={{ marginHorizontal: 20, marginTop: 20, borderRadius: 28, backgroundColor: '#ffffff', borderWidth: 2, borderColor: canOpen ? '#FF5A00' : '#E2E8F0', overflow: 'hidden', shadowColor: '#FF5A00', shadowOffset: { width: 0, height: 4 }, shadowOpacity: canOpen ? 0.15 : 0, shadowRadius: 16, elevation: canOpen ? 8 : 2 }}>
              <View style={{ padding: 24, alignItems: 'center' }}>
                <Text style={{ fontSize: 12, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>
                  {language === 'nl' ? 'Volleybal Kist' : 'Volleyball Chest'}
                </Text>
                <VolleyballChest isOpening={false} scale={1} />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFF7F0', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8, marginTop: 4, marginBottom: 16, borderWidth: 1.5, borderColor: '#FFD4B3' }}>
                  <VolleyballIcon size={16} color="#FF5A00" />
                  <Text style={{ fontSize: 15, fontWeight: '900', color: '#FF5A00' }}>{CHEST_PRICE} Spikes</Text>
                </View>
                <TouchableOpacity
                  onPress={handleOpenChestClick}
                  disabled={!canOpen}
                  style={{ width: '100%', backgroundColor: canOpen ? '#FF5A00' : '#E2E8F0', borderRadius: 18, paddingVertical: 18, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 }}
                >
                  <VolleyballIcon size={22} color={canOpen ? '#ffffff' : '#94A3B8'} />
                  <Text style={{ color: canOpen ? '#ffffff' : '#94A3B8', fontWeight: '900', fontSize: 18 }}>
                    {language === 'nl' ? 'Open Kist' : 'Open Chest'}
                  </Text>
                </TouchableOpacity>
                {!canOpen && (
                  <Text style={{ color: '#94A3B8', fontSize: 13, fontWeight: '600', marginTop: 10, textAlign: 'center' }}>
                    {language === 'nl' ? `Nog ${CHEST_PRICE - spikes} Spikes nodig. Voltooi trainingen!` : `Need ${CHEST_PRICE - spikes} more Spikes. Complete workouts!`}
                  </Text>
                )}
              </View>
            </View>

            {/* Spike info */}
            <View style={{ marginHorizontal: 20, marginTop: 12, backgroundColor: '#F0FDF4', borderRadius: 16, padding: 14, borderWidth: 1.5, borderColor: '#86EFAC', flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Zap size={20} color="#10B981" />
              <Text style={{ flex: 1, fontSize: 13, color: '#065F46', fontWeight: '600', lineHeight: 20 }}>
                {language === 'nl' ? `Verdien 50 🏐 Spikes per voltooide training. Nog ${Math.max(0, CHEST_PRICE - spikes)} Spikes tot je volgende kist!` : `Earn 50 🏐 Spikes per completed workout. ${Math.max(0, CHEST_PRICE - spikes)} Spikes until your next chest!`}
              </Text>
            </View>
          </View>
        )}

        {/* ── TAB: FIELD / OPSTELLING ───────────────────────────────────────────── */}
        {activeTab === 'field' && (
          <View style={{ paddingHorizontal: 24, paddingTop: 20 }}>

            {/* Court SVG */}
            <Text style={{ fontSize: 13, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>
              {language === 'nl' ? 'Jouw Opstelling' : 'Your Lineup'}
            </Text>
            <View style={{ borderRadius: 20, overflow: 'hidden', borderWidth: 2, borderColor: '#E2E8F0', marginBottom: 16 }}>
              <CourtSvg courtColor={courtBgColor} equipped={equipped} />
            </View>

            {/* Player slots hint */}
            <Text style={{ fontSize: 12, color: '#64748B', fontWeight: '600', textAlign: 'center', marginBottom: 16 }}>
              {language === 'nl' ? '👆 Tik op een positie hieronder om je spelers te kiezen' : '👆 Tap a position below to choose your players'}
            </Text>

            {/* 6 Player slots */}
            <Text style={{ fontSize: 13, fontWeight: '800', color: '#0F172A', marginBottom: 10 }}>
              {language === 'nl' ? '👥 Spelers (max 6)' : '👥 Players (max 6)'}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20, marginHorizontal: -4 }}>
              {Array.from({ length: 6 }).map((_, i) => {
                const pId = equipped?.players?.[i];
                const pItem = pId ? PLAYER_ITEMS.find((p: any) => p.id === pId) : null;
                const r = pItem ? RARITIES[pItem.rarity as keyof typeof RARITIES] : null;
                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() => openEquipPicker('player', PLAYER_ITEMS)}
                    style={{
                      width: (SCREEN_W - 80) / 3,
                      margin: 4,
                      borderRadius: 16,
                      borderWidth: 2,
                      borderColor: pItem ? (r?.color || '#FF5A00') : '#E2E8F0',
                      backgroundColor: pItem ? (r?.color || '#FF5A00') + '11' : '#F8FAFC',
                      padding: 12,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 28, marginBottom: 4 }}>{pItem ? pItem.emoji : '➕'}</Text>
                    <Text numberOfLines={1} style={{ fontSize: 10, fontWeight: '800', color: pItem ? (r?.color || '#FF5A00') : '#CBD5E1', textTransform: 'uppercase', textAlign: 'center' }}>
                      {pItem ? (pItem.name?.[language as 'nl' | 'en'] || pItem.name?.nl) : `Positie ${i + 1}`}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Skin slots */}
            <Text style={{ fontSize: 13, fontWeight: '800', color: '#0F172A', marginBottom: 10 }}>
              {language === 'nl' ? '🎨 Uitrusting' : '🎨 Equipment'}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4, marginBottom: 24 }}>
              {EQUIP_SLOTS.map(slot => (
                <EquipSlotButton
                  key={slot.key}
                  slotKey={slot.key}
                  label={slot.label}
                  emoji={slot.emoji}
                  items={slot.items}
                  equipped={equipped}
                  inventory={inventory}
                  language={language}
                  onPress={() => openEquipPicker(slot.key, slot.items)}
                />
              ))}
            </View>

            {/* Tip if nothing equipped */}
            {(equipped?.players?.length || 0) === 0 && (
              <View style={{ backgroundColor: '#FFF7F0', borderRadius: 16, padding: 16, borderWidth: 1.5, borderColor: '#FFD4B3', flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
                <Text style={{ fontSize: 20 }}>💡</Text>
                <Text style={{ flex: 1, fontSize: 13, color: '#92400E', fontWeight: '600', lineHeight: 20 }}>
                  {language === 'nl'
                    ? 'Open kisten om spelers en skins te verdienen, en equip ze hier om jouw unieke team te bouwen!'
                    : 'Open chests to earn players and skins, then equip them here to build your unique team!'}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* ── TAB: COLLECTION ──────────────────────────────────────────────────── */}
        {activeTab === 'collection' && (
          <View style={{ marginTop: 24, paddingHorizontal: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: '900', color: '#0F172A', marginBottom: 12 }}>
              {language === 'nl' ? '📦 Collectie' : '📦 Collection'}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
              {ALL_CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setActiveCategory(cat.id)}
                  style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, marginRight: 8, backgroundColor: activeCategory === cat.id ? '#1E3A8A' : '#F1F5F9' }}
                >
                  <Text style={{ color: activeCategory === cat.id ? '#ffffff' : '#64748B', fontWeight: '800', fontSize: 13 }}>
                    {cat.label[language as 'nl' | 'en'] || cat.label.nl}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 }}>
              {activeItems.map((item: any) => {
                const owned = ownedSet.has(item.id);
                const r = RARITIES[item.rarity as keyof typeof RARITIES] || RARITIES.common;
                return (
                  <View
                    key={item.id}
                    style={{ width: (SCREEN_W - 56) / 3, aspectRatio: 0.85, borderRadius: 16, borderWidth: 2, borderColor: owned ? r.color : '#E2E8F0', backgroundColor: owned ? r.color + '11' : '#F8FAFC', alignItems: 'center', justifyContent: 'center', padding: 8, margin: 4 }}
                  >
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
              })}
            </View>
          </View>
        )}

      </ScrollView>

      {/* Volley Match Mini-Game Modal */}
      <VolleyMatchMiniGame
        visible={showMatchModal}
        onClose={() => setShowMatchModal(false)}
      />

      {/* Daily Quests Modal */}
      <DailyQuestsModal
        visible={showQuestsModal}
        onClose={() => setShowQuestsModal(false)}
      />

    </SafeAreaView>
  );
}
