import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Trophy, Zap, CheckCircle2, Award, Sparkles, X } from 'lucide-react-native';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from '../i18n/useTranslation';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function DailyQuestsModal({ visible, onClose }: Props) {
  const { stats, spikes, awardSpikes } = useAppStore();
  const { language } = useTranslation();

  const [claimedQuests, setClaimedQuests] = React.useState<string[]>([]);

  const quests = [
    {
      id: 'quest_workout',
      title: language === 'nl' ? 'Voltooi 1 Training op het Veld' : 'Complete 1 Court Workout',
      reward: 100,
      progress: Math.min(1, stats.sessionsCompleted),
      total: 1,
      icon: Zap,
    },
    {
      id: 'quest_streak',
      title: language === 'nl' ? 'Behaal een 3-Dagen Streak' : 'Reach a 3-Day Workout Streak',
      reward: 200,
      progress: Math.min(3, stats.streak),
      total: 3,
      icon: Trophy,
    },
    {
      id: 'quest_match',
      title: language === 'nl' ? 'Speel 1 Volleybal Match in de Arena' : 'Play 1 Match in Volleyball Arena',
      reward: 120,
      progress: 1, // Ready to claim
      total: 1,
      icon: Award,
    },
  ];

  const handleClaim = (questId: string, reward: number) => {
    if (claimedQuests.includes(questId)) return;
    awardSpikes(reward);
    setClaimedQuests([...claimedQuests, questId]);
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: '#ffffff', borderTopLeftRadius: 36, borderTopRightRadius: 36, padding: 24, maxHeight: '80%' }}>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 44, height: 44, backgroundColor: 'rgba(255,90,0,0.15)', borderRadius: 14, alignItems: 'center', justifyContent: 'center' }}>
                <Trophy color="#FF5A00" size={24} />
              </View>
              <View>
                <Text style={{ fontSize: 20, fontWeight: '900', color: '#0F172A' }}>
                  {language === 'nl' ? 'Dagelijkse Volleybal Quests' : 'Daily Volleyball Quests'}
                </Text>
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#64748B' }}>
                  {language === 'nl' ? 'Verdien extra Spikes voor kisten & upgrades' : 'Earn extra Spikes for chests & upgrades'}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={{ padding: 8, backgroundColor: '#F1F5F9', borderRadius: 999 }}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={{ gap: 12 }}>
            {quests.map((q) => {
              const isDone = q.progress >= q.total;
              const isClaimed = claimedQuests.includes(q.id);

              return (
                <View key={q.id} style={{ backgroundColor: '#F8FAFC', borderWidth: 2, borderColor: '#E2E8F0', borderRadius: 20, padding: 16, marginBottom: 12 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                      <q.icon size={20} color="#FF5A00" />
                      <Text style={{ fontWeight: '800', fontSize: 15, color: '#0F172A', flex: 1 }}>{q.title}</Text>
                    </View>
                    <View style={{ backgroundColor: 'rgba(255,90,0,0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 }}>
                      <Text style={{ color: '#FF5A00', fontWeight: '900', fontSize: 12 }}>+{q.reward} Spikes</Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#94A3B8' }}>{q.progress}/{q.total} {language === 'nl' ? 'Voltooid' : 'Completed'}</Text>
                    
                    <TouchableOpacity
                      disabled={!isDone || isClaimed}
                      onPress={() => handleClaim(q.id, q.reward)}
                      style={{
                        backgroundColor: isClaimed ? '#94A3B8' : isDone ? '#FF5A00' : '#CBD5E1',
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      {isClaimed ? (
                        <>
                          <CheckCircle2 color="#ffffff" size={14} />
                          <Text style={{ color: 'white', fontWeight: '900', fontSize: 12 }}>{language === 'nl' ? 'Geclaimd' : 'Claimed'}</Text>
                        </>
                      ) : (
                        <Text style={{ color: 'white', fontWeight: '900', fontSize: 12 }}>
                          {isDone ? (language === 'nl' ? 'Claim Beloning' : 'Claim Reward') : (language === 'nl' ? 'Bezig' : 'In Progress')}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </ScrollView>

        </View>
      </View>
    </Modal>
  );
}
