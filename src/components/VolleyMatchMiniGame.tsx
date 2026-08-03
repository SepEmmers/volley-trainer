import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated, Easing, Dimensions } from 'react-native';
import Svg, { Circle, Path, Line, Rect, G, Text as SvgText } from 'react-native-svg';
import { Trophy, Zap, Shield, Sparkles, X, Play, RefreshCw, CheckCircle2 } from 'lucide-react-native';
import { useAppStore } from '../store/useAppStore';
import { ALL_ITEMS, RARITIES } from '../engine/items';
import { useTranslation } from '../i18n/useTranslation';

const { width: SCREEN_W } = Dimensions.get('window');

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function VolleyMatchMiniGame({ visible, onClose }: Props) {
  const { equipped, spikes, awardSpikes } = useAppStore();
  const { language } = useTranslation();

  // Compute overall team score based on equipped items
  const equippedPlayers = equipped?.players || [];
  const playerItems = equippedPlayers.map((id: string) => ALL_ITEMS.find((it: any) => it.id === id));
  
  let teamPower = 40;
  playerItems.forEach((p: any) => {
    if (!p) return;
    if (p.rarity === 'common') teamPower += 5;
    if (p.rarity === 'rare') teamPower += 10;
    if (p.rarity === 'epic') teamPower += 18;
    if (p.rarity === 'legendary') teamPower += 30;
    if (p.rarity === 'mythic') teamPower += 50;
  });

  const [oppLevel, setOppLevel] = useState<'club' | 'pro' | 'world'>('club');
  const oppPower = oppLevel === 'club' ? 50 : oppLevel === 'pro' ? 75 : 110;

  const [gameState, setGameState] = useState<'idle' | 'serve' | 'set' | 'spike' | 'rally_anim' | 'point_scored' | 'match_over'>('idle');
  const [playerScore, setPlayerScore] = useState(0);
  const [oppScore, setOppScore] = useState(0);
  const [currentRallyResult, setCurrentRallyResult] = useState<string | null>(null);

  const meterAnim = useRef(new Animated.Value(0)).current;
  const ballYAnim = useRef(new Animated.Value(0)).current;
  const ballXAnim = useRef(new Animated.Value(0)).current;

  const startRallyMeter = () => {
    meterAnim.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(meterAnim, { toValue: 1, duration: 800, useNativeDriver: false }),
        Animated.timing(meterAnim, { toValue: 0, duration: 800, useNativeDriver: false }),
      ])
    ).start();
  };

  const handleStartMatch = () => {
    setPlayerScore(0);
    setOppScore(0);
    setGameState('serve');
    startRallyMeter();
  };

  const handleActionTap = () => {
    meterAnim.stopAnimation((meterVal) => {
      const isTimingGood = meterVal > 0.45 && meterVal < 0.85;
      const powerDiff = teamPower - oppPower;
      const winChance = isTimingGood ? 0.75 + (powerDiff / 200) : 0.25 + (powerDiff / 200);

      const isWon = Math.random() < winChance;

      setGameState('rally_anim');

      Animated.parallel([
        Animated.timing(ballXAnim, { toValue: isWon ? 180 : -60, duration: 1000, useNativeDriver: true }),
        Animated.sequence([
          Animated.timing(ballYAnim, { toValue: -80, duration: 500, useNativeDriver: true }),
          Animated.timing(ballYAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        ])
      ]).start(() => {
        if (isWon) {
          const newPScore = playerScore + 1;
          setPlayerScore(newPScore);
          setCurrentRallyResult(language === 'nl' ? '💥 GEWELDIGE SPIKE! PUNT!' : '💥 MONSTER SPIKE! POINT!');
          if (newPScore >= 3) {
            setGameState('match_over');
            const reward = oppLevel === 'club' ? 80 : oppLevel === 'pro' ? 150 : 300;
            awardSpikes(reward);
          } else {
            setGameState('point_scored');
          }
        } else {
          const newOScore = oppScore + 1;
          setOppScore(newOScore);
          setCurrentRallyResult(language === 'nl' ? '❌ BLOK GEHINDERD! PUNT TEGENSTANDER' : '❌ BLOCKED! OPPONENT POINT');
          if (newOScore >= 3) {
            setGameState('match_over');
          } else {
            setGameState('point_scored');
          }
        }
      });
    });
  };

  const nextRally = () => {
    ballXAnim.setValue(0);
    ballYAnim.setValue(0);
    setCurrentRallyResult(null);
    if (gameState === 'serve') setGameState('set');
    else if (gameState === 'set') setGameState('spike');
    else setGameState('serve');
    startRallyMeter();
  };

  if (!visible) return null;

  const isMatchWon = playerScore >= 3;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: '#ffffff', borderTopLeftRadius: 36, borderTopRightRadius: 36, padding: 24, maxHeight: '92%', alignItems: 'center' }}>
          
          {/* Header */}
          <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Trophy color="#FF5A00" size={26} />
              <Text style={{ fontSize: 20, fontWeight: '900', color: '#0F172A' }}>{language === 'nl' ? 'Volleybal Match Arena' : 'Volleyball Match Arena'}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={{ padding: 8, backgroundColor: '#F1F5F9', borderRadius: 999 }}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Team Power Badge */}
          <View style={{ width: '100%', backgroundColor: '#0F172A', borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 40, height: 40, backgroundColor: 'rgba(255,90,0,0.2)', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={22} color="#FF5A00" />
              </View>
              <View>
                <Text style={{ color: 'white', fontWeight: '800', fontSize: 16 }}>{language === 'nl' ? 'Jouw Team Power' : 'Your Team Power'}</Text>
                <Text style={{ color: '#94A3B8', fontSize: 12, fontWeight: '600' }}>{equippedPlayers.length}/6 {language === 'nl' ? 'Spelers Opgesteld' : 'Players Fielded'}</Text>
              </View>
            </View>
            <View style={{ backgroundColor: '#FF5A00', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 }}>
              <Text style={{ color: 'white', fontWeight: '900', fontSize: 18 }}>{teamPower} OVR</Text>
            </View>
          </View>

          {gameState === 'idle' && (
            <View style={{ width: '100%', alignItems: 'center' }}>
              <Text style={{ color: '#64748B', fontWeight: '500', fontSize: 14, textAlign: 'center', marginBottom: 16 }}>
                {language === 'nl' ? 'Kies je tegenstander en speel een 3-punts rally match met jouw opgestelde team!' : 'Choose your opponent and play a 3-point spike rally match with your squad!'}
              </Text>

              {/* Opponent Selection */}
              <View style={{ width: '100%', gap: 10, marginBottom: 24 }}>
                {[
                  { key: 'club', name: language === 'nl' ? '🥉 Lokale Club Amateurs' : '🥉 Local Club Amateurs', ovr: 50, reward: '+80 Spikes' },
                  { key: 'pro', name: language === 'nl' ? '🥈 Eredivisie Profs' : '🥈 National League Pros', ovr: 75, reward: '+150 Spikes' },
                  { key: 'world', name: language === 'nl' ? '🥇 Wereldkampioenen' : '🥇 World Champions', ovr: 110, reward: '+300 Spikes' },
                ].map((opp) => (
                  <TouchableOpacity
                    key={opp.key}
                    onPress={() => setOppLevel(opp.key as any)}
                    style={{
                      padding: 16, borderRadius: 20, borderWidth: 2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                      borderColor: oppLevel === opp.key ? '#FF5A00' : '#E2E8F0',
                      backgroundColor: oppLevel === opp.key ? 'rgba(255,90,0,0.05)' : '#F8FAFC'
                    }}
                  >
                    <View>
                      <Text style={{ fontWeight: '800', color: '#0F172A', fontSize: 16 }}>{opp.name}</Text>
                      <Text style={{ color: '#FF5A00', fontWeight: '700', fontSize: 12, marginTop: 2 }}>{language === 'nl' ? 'Beloning' : 'Reward'}: {opp.reward}</Text>
                    </View>
                    <View style={{ backgroundColor: '#E2E8F0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }}>
                      <Text style={{ fontWeight: '900', color: '#334155', fontSize: 14 }}>{opp.ovr} OVR</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity onPress={handleStartMatch} style={{ width: '100%', backgroundColor: '#FF5A00', paddingVertical: 18, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                <Play fill="#ffffff" color="#ffffff" size={20} />
                <Text style={{ color: 'white', fontWeight: '900', fontSize: 18 }}>{language === 'nl' ? 'START MATCH' : 'START MATCH'}</Text>
              </TouchableOpacity>
            </View>
          )}

          {(gameState === 'serve' || gameState === 'set' || gameState === 'spike' || gameState === 'rally_anim' || gameState === 'point_scored') && (
            <View style={{ width: '100%', alignItems: 'center' }}>
              
              {/* Scoreboard */}
              <View style={{ width: '100%', backgroundColor: '#F1F5F9', borderRadius: 20, padding: 16, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0' }}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>{language === 'nl' ? 'JOUW TEAM' : 'YOUR SQUAD'}</Text>
                  <Text style={{ fontSize: 36, fontWeight: '900', color: '#FF5A00' }}>{playerScore}</Text>
                </View>
                <Text style={{ fontSize: 24, fontWeight: '900', color: '#CBD5E1' }}>VS</Text>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>{language === 'nl' ? 'TEGENSTANDER' : 'OPPONENT'}</Text>
                  <Text style={{ fontSize: 36, fontWeight: '900', color: '#1E3A8A' }}>{oppScore}</Text>
                </View>
              </View>

              {/* Match Court Animation Area */}
              <View style={{ width: '100%', height: 160, backgroundColor: '#0F172A', borderRadius: 24, alignItems: 'center', marginBottom: 16, position: 'relative', overflow: 'hidden', borderWidth: 2, borderColor: '#1E293B', justifyContent: 'center' }}>
                <View style={{ position: 'absolute', height: '100%', width: 3, backgroundColor: 'rgba(255,255,255,0.4)', left: '50%' }} />
                
                <Animated.View
                  style={{
                    transform: [
                      { translateX: ballXAnim },
                      { translateY: ballYAnim }
                    ]
                  }}
                  className="w-10 h-10 bg-brand-orange rounded-full items-center justify-center shadow-lg border-2 border-white"
                >
                  <Text style={{ fontSize: 22 }}>🏐</Text>
                </Animated.View>

                {currentRallyResult && (
                  <View style={{ position: 'absolute', backgroundColor: 'rgba(0,0,0,0.85)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }}>
                    <Text style={{ color: 'white', fontWeight: '900', fontSize: 14, textAlign: 'center' }}>{currentRallyResult}</Text>
                  </View>
                )}
              </View>

              {gameState === 'point_scored' ? (
                <TouchableOpacity onPress={nextRally} style={{ width: '100%', backgroundColor: '#FF5A00', paddingVertical: 18, borderRadius: 20, alignItems: 'center' }}>
                  <Text style={{ color: 'white', fontWeight: '900', fontSize: 18 }}>{language === 'nl' ? 'VOLGENDE RALLY' : 'NEXT RALLY'}</Text>
                </TouchableOpacity>
              ) : (
                <View style={{ width: '100%', alignItems: 'center' }}>
                  <Text style={{ fontSize: 11, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                    {gameState === 'serve' ? (language === 'nl' ? '⚡ TAP OP HET JUISTE MOMENT VOOR DE OPSLAG' : '⚡ TAP ON GREEN ZONE FOR PERFECT SERVE')
                     : gameState === 'set' ? (language === 'nl' ? '🎯 TIMING VOOR SLIMME PASS' : '🎯 TIMING FOR SETTER PASS')
                     : (language === 'nl' ? '💥 KIEZEN VOOR SLAM SPIKE!' : '💥 TIMING FOR MONSTER SPIKE!')}
                  </Text>

                  {/* Timing Bar */}
                  <View style={{ width: '100%', height: 24, backgroundColor: '#E2E8F0', borderRadius: 12, overflow: 'hidden', marginBottom: 16, position: 'relative', borderWidth: 1, borderColor: '#CBD5E1' }}>
                    <View style={{ position: 'absolute', height: '100%', width: '33%', backgroundColor: '#10B981', left: '50%', marginLeft: -30, opacity: 0.8 }} />
                    <Animated.View
                      style={{
                        position: 'absolute', height: '100%', width: 16, backgroundColor: '#FF5A00', borderRadius: 8, borderWidth: 1.5, borderColor: '#ffffff',
                        left: meterAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', '90%']
                        })
                      }}
                    />
                  </View>

                  <TouchableOpacity onPress={handleActionTap} style={{ width: '100%', backgroundColor: '#FF5A00', paddingVertical: 18, borderRadius: 20, alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontWeight: '900', fontSize: 20, textTransform: 'uppercase' }}>
                      {gameState === 'serve' ? (language === 'nl' ? 'OPSLAG!' : 'SERVE!')
                       : gameState === 'set' ? (language === 'nl' ? 'PASS!' : 'SET!')
                       : (language === 'nl' ? 'SPIKE! 💥' : 'SPIKE! 💥')}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

            </View>
          )}

          {gameState === 'match_over' && (
            <View style={{ width: '100%', alignItems: 'center' }}>
              <Text style={{ fontSize: 54, marginBottom: 8 }}>{isMatchWon ? '🏆' : '💔'}</Text>
              <Text style={{ fontSize: 28, fontWeight: '900', color: '#0F172A', textAlign: 'center', marginBottom: 4 }}>
                {isMatchWon ? (language === 'nl' ? 'GEWONNEN!' : 'VICTORY!') : (language === 'nl' ? 'NIPPER VERLOREN' : 'DEFEAT')}
              </Text>
              <Text style={{ color: '#64748B', fontWeight: '500', fontSize: 14, textAlign: 'center', marginBottom: 24 }}>
                {isMatchWon 
                  ? (language === 'nl' ? `Gefeliciteerd! Je hebt de match gewonnen en Spikes verdiend!` : `Awesome job! You won the match and claimed your bonus Spikes!`)
                  : (language === 'nl' ? 'Goede strijd! Upgrade je team met kisten om sterker terug te komen.' : 'Great effort! Upgrade your squad with chests to come back stronger.')}
              </Text>

              <TouchableOpacity onPress={() => setGameState('idle')} style={{ width: '100%', backgroundColor: '#FF5A00', paddingVertical: 18, borderRadius: 20, alignItems: 'center' }}>
                <Text style={{ color: 'white', fontWeight: '900', fontSize: 18 }}>{language === 'nl' ? 'SPELEN OPNIEUW' : 'PLAY AGAIN'}</Text>
              </TouchableOpacity>
            </View>
          )}

        </View>
      </View>
    </Modal>
  );
}
