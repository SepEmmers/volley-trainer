import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Linking } from 'react-native';
import { ChevronDown, ChevronUp, CheckCircle2, PlayCircle, Info, Flame, Shield, Activity } from 'lucide-react-native';
import { useTranslation } from '../i18n/useTranslation';

// ─── Icons per category ────────────────────────────────────────────────────────
const IconMap: Record<string, any> = {
  warmup: Flame,
  cooldown: Shield,
  stretching: Activity,
};

const CategoryColors: Record<string, { accent: string; bg: string; text: string }> = {
  warmup: { accent: '#FF5A00', bg: '#FFF7F0', text: '#FF5A00' },
  cooldown: { accent: '#1E3A8A', bg: '#EFF6FF', text: '#1E3A8A' },
  stretching: { accent: '#10B981', bg: '#F0FDF4', text: '#10B981' },
};

// ─── Individual Routine Item ───────────────────────────────────────────────────

function RoutineItem({
  item,
  language,
  checked,
  onToggle,
}: {
  item: any;
  language: string;
  checked: boolean;
  onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const name = item.name?.[language] || item.name?.en || '';
  const reps = item.reps?.[language] || item.reps?.en || '';
  const instructions = item.instructions?.[language] || item.instructions?.en || '';
  const category = item.category || 'warmup';
  const colors = CategoryColors[category] || CategoryColors.warmup;

  return (
    <View
      style={{
        marginBottom: 10,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: checked ? colors.accent : '#E2E8F0',
        backgroundColor: checked ? colors.bg : '#FAFAFA',
        overflow: 'hidden',
      }}
    >
      {/* Main row */}
      <TouchableOpacity
        onPress={onToggle}
        style={{ flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 }}
        activeOpacity={0.7}
      >
        {/* Check bubble */}
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            borderWidth: 2,
            borderColor: checked ? colors.accent : '#CBD5E1',
            backgroundColor: checked ? colors.accent : 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {checked && <CheckCircle2 size={18} color="#ffffff" />}
        </View>

        {/* Text */}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: '800',
              color: checked ? '#94A3B8' : '#0F172A',
              textDecorationLine: checked ? 'line-through' : 'none',
            }}
          >
            {name}
          </Text>
          <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '600', marginTop: 2 }}>
            {reps}
          </Text>
        </View>

        {/* Expand button */}
        <TouchableOpacity
          onPress={() => setExpanded(!expanded)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            backgroundColor: '#F1F5F9',
            paddingHorizontal: 8,
            paddingVertical: 6,
            borderRadius: 8,
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Info size={14} color="#64748b" />
          {expanded ? <ChevronUp size={14} color="#64748b" /> : <ChevronDown size={14} color="#64748b" />}
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Expanded instructions */}
      {expanded && (
        <View
          style={{
            paddingHorizontal: 16,
            paddingBottom: 16,
            borderTopWidth: 1,
            borderTopColor: '#F1F5F9',
          }}
        >
          <Text
            style={{ fontSize: 13, color: '#475569', lineHeight: 20, fontWeight: '500', marginBottom: 12 }}
          >
            {instructions}
          </Text>

          {/* Muscles */}
          {item.muscles && item.muscles.length > 0 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
              {item.muscles.map((m: string, i: number) => (
                <View
                  key={i}
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderWidth: 1,
                    borderColor: '#E2E8F0',
                    borderRadius: 12,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                  }}
                >
                  <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '700' }}>{m}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Video link */}
          {item.videoUrl && (
            <TouchableOpacity
              onPress={() => Linking.openURL(item.videoUrl)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                backgroundColor: colors.bg,
                borderWidth: 1.5,
                borderColor: colors.accent,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 10,
                alignSelf: 'flex-start',
              }}
            >
              <PlayCircle size={16} color={colors.accent} />
              <Text style={{ fontSize: 13, fontWeight: '800', color: colors.accent }}>
                {language === 'nl' ? 'Bekijk Video' : 'Watch Video'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

// ─── Routine Block Component ───────────────────────────────────────────────────

export default function RoutineBlock({
  title,
  subtitle,
  items,
  category,
  defaultExpanded = false,
}: {
  title: string;
  subtitle?: string;
  items: any[];
  category: 'warmup' | 'cooldown' | 'stretching';
  defaultExpanded?: boolean;
}) {
  const { language } = useTranslation();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const colors = CategoryColors[category] || CategoryColors.warmup;
  const CategoryIcon = IconMap[category] || Flame;
  const completedCount = checkedItems.size;
  const totalCount = items.length;

  return (
    <View
      style={{
        marginHorizontal: 0,
        marginBottom: 16,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: expanded ? colors.accent : '#E2E8F0',
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      {/* Header */}
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 18,
          gap: 14,
          backgroundColor: expanded ? colors.bg : '#FAFAFA',
        }}
        activeOpacity={0.8}
      >
        {/* Category icon */}
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            backgroundColor: expanded ? colors.accent : '#F1F5F9',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CategoryIcon size={22} color={expanded ? '#ffffff' : '#94A3B8'} />
        </View>

        {/* Title + progress */}
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 17, fontWeight: '900', color: '#0F172A' }}>{title}</Text>
            {subtitle && (
              <View
                style={{
                  backgroundColor: '#F1F5F9',
                  borderRadius: 8,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                }}
              >
                <Text style={{ fontSize: 10, color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase' }}>
                  {subtitle}
                </Text>
              </View>
            )}
          </View>
          {/* Mini progress bar */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <View style={{ flex: 1, height: 4, backgroundColor: '#F1F5F9', borderRadius: 2, overflow: 'hidden' }}>
              <View
                style={{
                  width: `${(completedCount / totalCount) * 100}%`,
                  height: '100%',
                  backgroundColor: colors.accent,
                  borderRadius: 2,
                }}
              />
            </View>
            <Text style={{ fontSize: 11, color: '#94A3B8', fontWeight: '700' }}>
              {completedCount}/{totalCount}
            </Text>
          </View>
        </View>

        {/* Chevron */}
        {expanded ? (
          <ChevronUp size={20} color={colors.accent} />
        ) : (
          <ChevronDown size={20} color="#94A3B8" />
        )}
      </TouchableOpacity>

      {/* Items */}
      {expanded && (
        <View style={{ padding: 16, paddingTop: 8 }}>
          {items.map((item) => (
            <RoutineItem
              key={item.id}
              item={item}
              language={language}
              checked={checkedItems.has(item.id)}
              onToggle={() => toggleItem(item.id)}
            />
          ))}
        </View>
      )}
    </View>
  );
}
