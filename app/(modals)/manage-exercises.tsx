import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSocialStore } from '../../src/store/useSocialStore';
import { useAppStore } from '../../src/store/useAppStore';
import { useAuthStore } from '../../src/store/useAuthStore';
import { publishExercise } from '../../src/services/socialService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Plus, Globe, Trash2, Shield, Video } from 'lucide-react-native';
import { useTranslation } from '../../src/i18n/useTranslation';

// Helper to generate a random 8-char ID
const generateId = () => Math.random().toString(36).substring(2, 10);

export default function ManageExercisesScreen() {
  const customExercises = useSocialStore((s: any) => s.customExercises);
  const downloadedExercises = useSocialStore((s: any) => s.downloadedExercises);
  const addCustomExercise = useSocialStore((s: any) => s.addCustomExercise);
  const deleteCustomExercise = useSocialStore((s: any) => s.deleteCustomExercise);
  const removeDownloadedExercise = useSocialStore((s: any) => s.removeDownloadedExercise);
  
  const authUser = useAuthStore((s: any) => s.user);
  const profile = useAppStore((s: any) => s.profile);
  const { t, language } = useTranslation();

  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<'my' | 'downloaded'>('my');

  // Form State
  const [fType, setFType] = useState('workout'); // warmup, workout, cooldown, rehab
  const [fName, setFName] = useState('');
  const [fDesc, setFDesc] = useState('');
  const [fCat, setFCat] = useState('performance'); // performance, core, prehab
  const [fGoal, setFGoal] = useState('all');       // vertical, agility, injury, all
  const [fEquip, setFEquip] = useState('bodyweight'); // bodyweight, dumbbells
  const [fVideo, setFVideo] = useState('');
  const [fSafeFor, setFSafeFor] = useState<string[]>([]); // knee, shoulder, back
  
  // Advanced Form State (Sets, Reps, Timers, Rehab target)
  const [fSets, setFSets] = useState('3');
  const [fReps, setFReps] = useState('10');
  const [fDuration, setFDuration] = useState(''); // seconds
  const [fTargetInjury, setFTargetInjury] = useState(''); // jumper_knee, shoulder_pain, etc
  
  const handleSave = () => {
    if (!fName.trim()) {
       Alert.alert('Error', language === 'nl' ? 'Naam is verplicht' : 'Name is required');
       return;
    }
    const newItem = {
      id: `custom_${generateId()}`,
      type: fType,
      name: fName.trim(),
      description: fDesc.trim(),
      category: fType === 'workout' ? fCat : null,
      goal: fType === 'rehab' ? 'injury' : fGoal,
      equipment: fEquip,
      safeFor: fSafeFor,
      videoUrl: fVideo.trim() || null,
      impact: 'low', // default
      createdByUid: authUser?.uid || 'local',
      creatorName: profile.name || authUser?.displayName || 'Anonymous',
      
      // Advanced fields
      sets: fSets.trim() || null,
      reps: fReps.trim() || null,
      duration: parseInt(fDuration) || null,
      target_injury: fType === 'rehab' ? fTargetInjury : null,
    };
    addCustomExercise(newItem);
    setIsCreating(false);
    resetForm();
  };

  const resetForm = () => {
    setFType('workout');
    setFName(''); setFDesc(''); setFCat('performance'); setFGoal('all');
    setFEquip('bodyweight'); setFVideo(''); setFSafeFor([]);
  };

  const toggleSafeFor = (bodyPart: string) => {
    setFSafeFor(prev => prev.includes(bodyPart) ? prev.filter(p => p !== bodyPart) : [...prev, bodyPart]);
  };

  const handlePublish = async (item: any) => {
    if (!authUser || authUser.isAnonymous) {
      Alert.alert('Login Required', language === 'nl' ? 'Log in met Google om te publiceren.' : 'Log in with Google to publish.');
      return;
    }
    try {
      await publishExercise(authUser.uid, profile.name || authUser.displayName, item);
      Alert.alert('Published! 🌍', language === 'nl' ? 'Je oefening is nu zichtbaar voor anderen.' : 'Your exercise is now visible to others.');
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="px-5 py-4 bg-white border-b border-slate-200 flex-row items-center justify-between">
         <TouchableOpacity onPress={() => isCreating ? setIsCreating(false) : router.back()} className="p-2 -ml-2">
           <ChevronLeft size={24} color="#0F172A" />
         </TouchableOpacity>
         <View className="flex-row items-center gap-2">
           <Text className="text-xl font-black text-slate-800">
             {isCreating ? (language === 'nl' ? 'Nieuwe Oefening' : 'New Exercise') : (language === 'nl' ? 'Beheer Oefeningen' : 'Manage Exercises')}
           </Text>
           <View className="bg-brand-orange/10 px-2 py-0.5 rounded-md">
             <Text className="text-brand-orange font-black text-[10px] tracking-widest leading-none mt-0.5">BETA</Text>
           </View>
         </View>
         <View className="w-8" />
      </View>

      {isCreating ? (
        <ScrollView className="flex-1 px-5 pt-6 pb-20">
          
          <Text className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{language === 'nl' ? 'Type' : 'Type'}</Text>
          <View className="flex-row bg-slate-200 rounded-xl p-1 mb-6 flex-wrap">
             {['warmup', 'workout', 'cooldown', 'rehab'].map(t => (
               <TouchableOpacity 
                 key={t} onPress={() => setFType(t)}
                 className={`py-3 px-4 min-w-[80px] items-center rounded-lg ${fType === t ? 'bg-white shadow-sm' : ''}`}
               >
                 <Text className={`font-bold capitalize ${fType === t ? 'text-brand-dark' : 'text-slate-500'}`}>{t}</Text>
               </TouchableOpacity>
             ))}
          </View>

          <Text className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{language === 'nl' ? 'Naam' : 'Name'}</Text>
          <TextInput 
            value={fName} onChangeText={setFName}
            placeholder={language === 'nl' ? 'Bijv. Explosieve Squats' : 'E.g. Explosive Squats'}
            className="bg-white border-2 border-slate-200 rounded-xl px-4 py-4 text-lg font-bold text-brand-dark mb-6 focus:border-brand-orange"
          />

          <Text className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{language === 'nl' ? 'Beschrijving' : 'Description'}</Text>
          <TextInput 
            value={fDesc} onChangeText={setFDesc} multiline numberOfLines={3}
            placeholder={language === 'nl' ? 'Instructies...' : 'Instructions...'}
            className="bg-white border-2 border-slate-200 rounded-xl px-4 py-4 text-base font-medium text-slate-700 mb-6 focus:border-brand-orange"
            style={{ minHeight: 100, textAlignVertical: 'top' }}
          />

          <View className="flex-row gap-4 mb-6">
            <View className="flex-1">
              <Text className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{language === 'nl' ? 'Sets' : 'Sets'}</Text>
              <TextInput 
                value={fSets} onChangeText={setFSets}
                placeholder="3"
                className="bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-base text-brand-dark focus:border-brand-orange"
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{language === 'nl' ? 'Reps' : 'Reps'}</Text>
              <TextInput 
                value={fReps} onChangeText={setFReps}
                placeholder="10"
                className="bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-base text-brand-dark focus:border-brand-orange"
              />
            </View>
          </View>

          <Text className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{language === 'nl' ? 'Duur (Optioneel)' : 'Duration (Optional)'}</Text>
          <View className="flex-row items-center mb-6 gap-3">
             <TextInput 
                value={fDuration} onChangeText={setFDuration}
                keyboardType="numeric"
                placeholder="0"
                className="flex-1 bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-base text-brand-dark focus:border-brand-orange"
              />
              <Text className="text-sm font-bold text-slate-400">sec</Text>
          </View>

          {fType === 'workout' && (
            <>
              <Text className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{language === 'nl' ? 'Fase Categorie' : 'Phase Category'}</Text>
              <View className="flex-row gap-2 mb-6 flex-wrap">
                {['performance', 'core', 'prehab'].map(c => (
                  <TouchableOpacity 
                    key={c} onPress={() => setFCat(c)}
                    className={`px-4 py-3 rounded-xl border-2 ${fCat === c ? 'bg-blue-50 border-blue-500' : 'bg-white border-slate-200'}`}
                  >
                    <Text className={`font-bold capitalize ${fCat === c ? 'text-blue-600' : 'text-slate-600'}`}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {fType === 'rehab' && (
            <>
              <Text className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{language === 'nl' ? 'Doel Blessure' : 'Target Injury'}</Text>
              <Text className="text-xs text-slate-400 mb-3">{language === 'nl' ? 'Welke blessure behandelt deze oefening?' : 'Which injury does this exercise treat?'}</Text>
              <View className="flex-row gap-2 mb-6 flex-wrap">
                {[
                  { id: 'jumper_knee', label: language === 'nl' ? 'Knie' : "Knee" },
                  { id: 'shoulder_pain', label: language === 'nl' ? 'Schouder' : 'Shoulder' },
                  { id: 'back_pain', label: language === 'nl' ? 'Rug' : 'Back' }
                ].map(inj => (
                  <TouchableOpacity 
                    key={inj.id} onPress={() => setFTargetInjury(inj.id)}
                    className={`px-4 py-3 rounded-xl border-2 ${fTargetInjury === inj.id ? 'bg-red-50 border-red-500' : 'bg-white border-slate-200'}`}
                  >
                    <Text className={`font-bold capitalize ${fTargetInjury === inj.id ? 'text-red-700' : 'text-slate-600'}`}>{inj.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          <Text className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{language === 'nl' ? 'Veilig Voor (Blessures)' : 'Safe For (Injuries)'}</Text>
          <Text className="text-xs text-slate-400 mb-3">{language === 'nl' ? 'Selecteer blessures waarbij deze oefening VEILIG is om uit te voeren.' : 'Select injuries where this movement is SAFE to perform.'}</Text>
          <View className="flex-row gap-2 flex-wrap mb-6">
            {['knee', 'shoulder', 'back'].map(bp => {
               const isSafe = fSafeFor.includes(bp);
               return (
                 <TouchableOpacity 
                   key={bp} onPress={() => toggleSafeFor(bp)}
                   className={`flex-row items-center gap-2 px-4 py-3 rounded-xl border-2 ${isSafe ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-slate-200'}`}
                 >
                   <Shield size={16} color={isSafe ? '#10B981' : '#94A3B8'} />
                   <Text className={`font-bold capitalize ${isSafe ? 'text-emerald-700' : 'text-slate-600'}`}>{bp}</Text>
                 </TouchableOpacity>
               );
            })}
          </View>

          <Text className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{language === 'nl' ? 'Video Link (Optioneel)' : 'Video Link (Optional)'}</Text>
          <View className="flex-row items-center bg-white border-2 border-slate-200 rounded-xl px-4 mb-8 focus-within:border-brand-orange">
             <Video size={20} color="#94A3B8" />
             <TextInput 
               value={fVideo} onChangeText={setFVideo}
               placeholder="https://youtube.com/..."
               autoCapitalize="none"
               className="flex-1 py-4 px-3 text-base font-medium text-brand-dark"
             />
          </View>

          <TouchableOpacity onPress={handleSave} className="bg-brand-orange py-4 rounded-2xl items-center shadow-sm mb-12">
            <Text className="text-white font-black text-lg">{language === 'nl' ? 'Oefening Opslaan' : 'Save Exercise'}</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <View className="flex-1">
          {/* Tabs */}
          <View className="flex-row border-b border-slate-200 bg-white">
            <TouchableOpacity onPress={() => setActiveTab('my')} className={`flex-1 py-4 items-center border-b-2 ${activeTab === 'my' ? 'border-brand-orange' : 'border-transparent'}`}>
              <Text className={`font-bold ${activeTab === 'my' ? 'text-brand-orange' : 'text-slate-500'}`}>{language === 'nl' ? 'Mijn Oefeningen' : 'My Exercises'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab('downloaded')} className={`flex-1 py-4 items-center border-b-2 ${activeTab === 'downloaded' ? 'border-brand-orange' : 'border-transparent'}`}>
              <Text className={`font-bold ${activeTab === 'downloaded' ? 'text-brand-orange' : 'text-slate-500'}`}>{language === 'nl' ? 'Gedownload' : 'Downloaded'}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 px-5 pt-6">
            {(activeTab === 'my' ? customExercises : downloadedExercises).length === 0 ? (
               <View className="items-center justify-center py-12">
                 <Text className="text-slate-400 font-bold mb-2">
                   {language === 'nl' ? 'Geen oefeningen gevonden.' : 'No exercises found.'}
                 </Text>
               </View>
            ) : (
               (activeTab === 'my' ? customExercises : downloadedExercises).map((item: any) => (
                 <View key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 mb-4 shadow-sm">
                   <View className="flex-row justify-between items-start mb-2">
                     <View className="flex-1 pr-4">
                       <Text className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">{item.type} • {item.equipment}</Text>
                       <Text className="text-xl font-black text-brand-dark mb-2">{item.name}</Text>
                       {item.description ? <Text className="text-sm text-slate-600">{item.description}</Text> : null}
                     </View>
                   </View>
                   
                   <View className="mt-4 pt-4 border-t border-slate-100 flex-row justify-end items-center gap-3">
                     {activeTab === 'my' && (
                       <TouchableOpacity onPress={() => handlePublish(item)} className="px-4 py-2 bg-blue-50 rounded-lg flex-row items-center gap-2">
                         <Globe size={16} color="#3B82F6" />
                         <Text className="text-blue-600 font-bold text-sm">Publiceren</Text>
                       </TouchableOpacity>
                     )}
                     <TouchableOpacity 
                       onPress={() => activeTab === 'my' ? deleteCustomExercise(item.id) : removeDownloadedExercise(item.id)} 
                       className="p-2 bg-red-50 rounded-lg"
                     >
                       <Trash2 size={20} color="#EF4444" />
                     </TouchableOpacity>
                   </View>
                 </View>
               ))
            )}
           
          </ScrollView>

          {activeTab === 'my' && (
            <View className="p-5 bg-white border-t border-slate-200">
               <TouchableOpacity onPress={() => setIsCreating(true)} className="bg-brand-orange py-4 rounded-2xl items-center flex-row justify-center gap-2">
                 <Plus size={24} color="white" />
                 <Text className="text-white font-black text-lg">{language === 'nl' ? 'Maak Oefening' : 'Create Exercise'}</Text>
               </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}
