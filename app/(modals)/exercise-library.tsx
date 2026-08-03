import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Search, Dumbbell, Activity, Shield, Zap } from 'lucide-react-native';
import { EXERCISES, EXERCISE_CATEGORIES } from '../../src/engine/exercises';
import ExerciseDetailModal from '../../src/components/ExerciseDetailModal';
import { useTranslation } from '../../src/i18n/useTranslation';

export default function ExerciseLibraryScreen() {
  const { t, language } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);

  // Group exercises by category
  const categories = Object.keys(EXERCISE_CATEGORIES);
  const allExercises = Object.values(EXERCISES);

  const filteredExercises = allExercises.filter((ex: any) => {
    const matchesSearch = 
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory ? ex.category === selectedCategory : true;

    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (catId: string, color: string) => {
    switch (catId) {
      case 'vertical_jump': return <Zap size={16} color={color} />;
      case 'attacking_mechanics': return <Dumbbell size={16} color={color} />;
      case 'lateral_agility': return <Activity size={16} color={color} />;
      case 'shoulder_prehab':
      case 'knee_ankle_stability': return <Shield size={16} color={color} />;
      default: return <Activity size={16} color={color} />;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="px-5 py-4 bg-white border-b border-slate-200 flex-row items-center justify-between">
         <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
           <ChevronLeft size={24} color="#0F172A" />
         </TouchableOpacity>
         <View className="flex-row items-center gap-2">
           <Text className="text-xl font-black text-slate-800">
             {language === 'nl' ? 'Oefeningen Bibliotheek' : 'Exercise Library'}
           </Text>
         </View>
         <View className="w-8" />
      </View>

      {/* Search and Filter */}
      <View className="bg-white px-5 py-4 border-b border-slate-200">
        <View className="flex-row items-center bg-slate-100 rounded-xl px-4 py-3 mb-4">
          <Search size={20} color="#94A3B8" />
          <TextInput 
            placeholder={language === 'nl' ? 'Zoek oefeningen...' : 'Search exercises...'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-3 text-base text-brand-dark"
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          <TouchableOpacity 
             onPress={() => setSelectedCategory(null)}
             className={`px-4 py-2 rounded-full mr-2 border border-slate-200 ${!selectedCategory ? 'bg-brand-dark' : 'bg-white'}`}
          >
            <Text className={`font-bold ${!selectedCategory ? 'text-white' : 'text-slate-600'}`}>
              {language === 'nl' ? 'Alles' : 'All'}
            </Text>
          </TouchableOpacity>
          {categories.map((catKey) => {
            const catInfo = EXERCISE_CATEGORIES[catKey as keyof typeof EXERCISE_CATEGORIES];
            const isSelected = selectedCategory === catKey;
            return (
              <TouchableOpacity 
                key={catKey}
                onPress={() => setSelectedCategory(catKey)}
                className={`px-4 py-2 rounded-full mr-2 border ${isSelected ? catInfo.border + ' bg-slate-100' : 'border-slate-200 bg-white'}`}
                style={{ backgroundColor: isSelected ? '#F1F5F9' : '#FFFFFF' }}
              >
                <Text className={`font-bold ${isSelected ? catInfo.color : 'text-slate-600'}`}>{catInfo.label}</Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>

      {/* Exercise List */}
      <ScrollView className="flex-1 px-5 pt-4 pb-10">
        {filteredExercises.length === 0 ? (
          <View className="items-center justify-center py-10">
            <Text className="text-slate-400 font-bold">{language === 'nl' ? 'Geen oefeningen gevonden.' : 'No exercises found.'}</Text>
          </View>
        ) : (
          filteredExercises.map((ex: any) => {
            const catInfo = EXERCISE_CATEGORIES[ex.category as keyof typeof EXERCISE_CATEGORIES];
            // Extract colors safely
            const colorClassMatch = catInfo?.color?.match(/text-([a-z]+)-(\d+)/);
            const hexColor = colorClassMatch ? 
              (colorClassMatch[1] === 'orange' ? '#FF5A00' :
               colorClassMatch[1] === 'blue' ? '#3B82F6' :
               colorClassMatch[1] === 'red' ? '#EF4444' :
               colorClassMatch[1] === 'yellow' ? '#EAB308' :
               colorClassMatch[1] === 'teal' ? '#14B8A6' : '#94A3B8') : '#94A3B8';

            return (
              <TouchableOpacity
                key={ex.id}
                onPress={() => setSelectedExercise(ex)}
                className="bg-white rounded-2xl p-4 mb-4 border border-slate-200 shadow-sm"
              >
                <View className="flex-row items-center gap-2 mb-2">
                  <View className={`p-1 rounded-md bg-slate-100`}>
                    {getCategoryIcon(ex.category, hexColor)}
                  </View>
                  <Text style={{ color: hexColor }} className="text-xs font-bold uppercase tracking-widest leading-tight">
                    {catInfo?.label || t('categories.' + ex.category)}
                  </Text>
                </View>
                <Text className="text-lg font-black text-brand-dark mb-1">{t(`exercises.${ex.id}.name`) !== `exercises.${ex.id}.name` ? t(`exercises.${ex.id}.name`) : ex.name}</Text>
                <Text className="text-sm text-slate-500 font-medium line-clamp-2">
                  {t(`exercises.${ex.id}.purpose`) !== `exercises.${ex.id}.purpose` ? t(`exercises.${ex.id}.purpose`) : ex.purpose}
                </Text>

                <View className="flex-row items-center gap-3 mt-3">
                  <View className="bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                     <Text className="text-slate-500 font-bold text-xs uppercase">{ex.equipment === 'bodyweight' ? 'BW' : ex.equipment}</Text>
                  </View>
                  <View className="bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                     <Text className="text-slate-500 font-bold text-xs capitalize">{ex.impact} Impact</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Exercise Detail Modal */}
      <ExerciseDetailModal
        exercise={selectedExercise}
        visible={!!selectedExercise}
        onClose={() => setSelectedExercise(null)}
      />

    </SafeAreaView>
  );
}
