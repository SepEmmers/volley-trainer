import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useSocialStore } from '../../src/store/useSocialStore';
import { useAppStore } from '../../src/store/useAppStore';
import { searchUsers, followUser, unfollowUser, fetchCommunityExercises } from '../../src/services/socialService';
import { Search, UserPlus, UserMinus, Download, Shield, Eye, Flame, Globe } from 'lucide-react-native';
import { useTranslation } from '../../src/i18n/useTranslation';

export default function CommunityTabScreen() {
  const { t, language } = useTranslation();
  const authUser = useAuthStore(s => s.user);
  const profile = useAppStore(s => s.profile);
  
  const following = useSocialStore(s => s.following);
  const toggleFollowLocally = useSocialStore(s => s.toggleFollow);
  const downloadCommunityExercise = useSocialStore(s => s.downloadCommunityExercise);
  const downloadedExercises = useSocialStore(s => s.downloadedExercises);

  const [activeTab, setActiveTab] = useState<'users' | 'exercises'>('exercises');
  const [searchQ, setSearchQ] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [communityExercises, setCommunityExercises] = useState<any[]>([]);
  const [isLoadingEx, setIsLoadingEx] = useState(true);

  useEffect(() => {
    if (activeTab === 'exercises') {
      loadExercises();
    }
  }, [activeTab]);

  const loadExercises = async () => {
    setIsLoadingEx(true);
    const ex = await fetchCommunityExercises();
    setCommunityExercises(ex);
    setIsLoadingEx(false);
  };

  const handleSearchUsers = async () => {
    if (!searchQ.trim()) return;
    setIsSearching(true);
    const users = await searchUsers(searchQ.trim());
    setSearchResults(users.filter(u => u.uid !== authUser?.uid));
    setIsSearching(false);
  };

  const handleToggleFollow = async (targetUid: string, targetName: string) => {
    if (!authUser || authUser.isAnonymous) {
      Alert.alert('Login Required', 'You must log in to follow users.');
      return;
    }
    const isFollowing = following.includes(targetUid);
    
    // Optimistic UI update
    toggleFollowLocally(targetUid);
    
    try {
      if (isFollowing) {
        await unfollowUser(authUser.uid, targetUid);
      } else {
        await followUser(authUser.uid, profile.name || authUser.displayName, targetUid, targetName);
      }
    } catch (e) {
      // Revert if failed
      toggleFollowLocally(targetUid);
      Alert.alert('Error', 'Could not update follow status.');
    }
  };

  const handleDownload = (exercise: any) => {
    if (downloadedExercises.find((ex: any) => ex.id === exercise.id)) {
      Alert.alert('Info', 'You already downloaded this exercise.');
      return;
    }
    downloadCommunityExercise(exercise);
    Alert.alert('Success', `${exercise.name} added to your exercises!`);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="px-6 pt-4 pb-2 bg-white">
        <View className="flex-row items-center gap-2 mb-4">
          <Text className="text-3xl font-black text-brand-dark tracking-tight">
            {language === 'nl' ? 'Community' : 'Community'}
          </Text>
          <View className="bg-brand-orange/10 px-2 py-0.5 rounded-md self-center">
            <Text className="text-brand-orange font-black text-[10px] tracking-widest leading-none mt-0.5">BETA</Text>
          </View>
        </View>
        
        {/* Tabs */}
        <View className="flex-row bg-slate-100 p-1 rounded-2xl border border-slate-200 mb-2">
           <TouchableOpacity 
             onPress={() => setActiveTab('exercises')}
             className={`flex-1 py-3 items-center rounded-xl ${activeTab === 'exercises' ? 'bg-white shadow-sm' : ''}`}
           >
             <Text className={`font-bold ${activeTab === 'exercises' ? 'text-brand-orange' : 'text-slate-500'}`}>Oefeningen</Text>
           </TouchableOpacity>
           <TouchableOpacity 
             onPress={() => setActiveTab('users')}
             className={`flex-1 py-3 items-center rounded-xl ${activeTab === 'users' ? 'bg-brand-blue shadow-sm' : ''}`}
           >
             <Text className={`font-bold flex-row items-center gap-2 ${activeTab === 'users' ? 'text-white' : 'text-slate-500'}`}>Spelers</Text>
           </TouchableOpacity>
        </View>

        <Text className="text-xs text-slate-400 font-bold text-center mt-1 mb-2">
          {language === 'nl' ? 'De online functies zijn nog in ontwikkeling.' : 'Online features are currently in active development.'}
        </Text>
      </View>

      <ScrollView className="flex-1 pt-4" contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* ── EXERCISES TAB ── */}
        {activeTab === 'exercises' && (
          <View className="px-5">
            <View className="flex-row items-center justify-between mb-4 mt-2">
              <Text className="font-bold text-slate-500 uppercase tracking-widest text-xs">Recent Gepubliceerd</Text>
              <TouchableOpacity onPress={loadExercises} className="p-2 bg-slate-200 rounded-full">
                <Globe size={14} color="#64748B" />
              </TouchableOpacity>
            </View>

            {isLoadingEx ? (
              <ActivityIndicator size="large" color="#FF5A00" className="mt-10" />
            ) : communityExercises.length === 0 ? (
              <Text className="text-center text-slate-500 font-bold mt-10">Geen oefeningen gevonden.</Text>
             ) : (
               communityExercises.map((ex: any) => {
                 const isDownloaded = downloadedExercises.some((d: any) => d.id === ex.id);
                 return (
                   <View key={ex.id} className="bg-white p-5 rounded-2xl border border-slate-200 mb-4 shadow-sm">
                     <View className="flex-row justify-between items-start mb-2">
                       <View className="flex-1 pr-4">
                         <Text className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">Door {ex.creatorName}</Text>
                         <Text className="text-xl font-black text-brand-dark mb-1">{ex.name}</Text>
                         <Text className="text-sm font-bold text-brand-orange mb-2 uppercase tracking-wide">{ex.type}</Text>
                         {ex.description ? <Text className="text-sm text-slate-600 mb-3">{ex.description}</Text> : null}
                         
                         {ex.safeFor && ex.safeFor.length > 0 && (
                           <View className="flex-row flex-wrap gap-2 mb-2">
                             {ex.safeFor.map((sf: string) => (
                               <View key={sf} className="bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200 flex-row items-center gap-1">
                                 <Shield size={10} color="#10B981" />
                                 <Text className="text-xs font-bold text-emerald-700 capitalize">{sf} safe</Text>
                               </View>
                             ))}
                           </View>
                         )}
                       </View>
                     </View>
                     <TouchableOpacity 
                       onPress={() => handleDownload(ex)}
                       disabled={isDownloaded}
                       className={`mt-2 py-3 rounded-xl flex-row items-center justify-center gap-2 ${isDownloaded ? 'bg-slate-100' : 'bg-brand-blue'}`}
                     >
                       <Download size={18} color={isDownloaded ? '#94A3B8' : '#fff'} />
                       <Text className={`font-bold ${isDownloaded ? 'text-slate-400' : 'text-white'}`}>
                         {isDownloaded ? 'Gedownload' : 'Download Oefening'}
                       </Text>
                     </TouchableOpacity>
                   </View>
                 );
               })
             )}
          </View>
        )}

        {/* ── USERS TAB ── */}
        {activeTab === 'users' && (
          <View className="px-5">
            <View className="flex-row items-center bg-white border-2 border-slate-200 rounded-2xl px-4 py-1 mb-6 focus-within:border-brand-blue">
               <Search size={20} color="#94A3B8" />
               <TextInput 
                 value={searchQ} onChangeText={setSearchQ}
                 onSubmitEditing={handleSearchUsers}
                 placeholder="Zoek spelers op naam..."
                 className="flex-1 py-4 px-3 text-base font-bold text-brand-dark"
                 returnKeyType="search"
               />
               <TouchableOpacity onPress={handleSearchUsers} className="bg-brand-blue px-4 py-2 rounded-xl">
                 <Text className="text-white font-bold text-xs uppercase tracking-wider">Zoek</Text>
               </TouchableOpacity>
            </View>

            {isSearching ? (
              <ActivityIndicator size="large" color="#1E3A8A" className="mt-10" />
            ) : searchResults.length === 0 && searchQ.length > 0 ? (
              <Text className="text-center text-slate-500 font-bold mt-10">Geen publieke profielen gevonden.</Text>
            ) : (
              searchResults.map((user: any) => {
                const isFollowing = following.includes(user.uid);
                return (
                  <View key={user.uid} className="bg-white p-4 rounded-2xl border border-slate-200 mb-3 flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                      <View className="w-12 h-12 rounded-full bg-slate-100 items-center justify-center border-2 border-slate-200">
                        <Text className="text-xl font-bold text-slate-400">{(user.displayName || 'S')[0].toUpperCase()}</Text>
                      </View>
                      <View>
                        <Text className="text-base font-black text-brand-dark">{user.displayName}</Text>
                        <Text className="text-xs font-bold text-brand-orange uppercase">{user.level}</Text>
                      </View>
                    </View>
                    <TouchableOpacity 
                      onPress={() => handleToggleFollow(user.uid, user.displayName)}
                      className={`p-3 rounded-full ${isFollowing ? 'bg-slate-100 border border-slate-200' : 'bg-brand-blue'}`}
                    >
                      {isFollowing ? <UserMinus size={20} color="#64748B" /> : <UserPlus size={20} color="#fff" />}
                    </TouchableOpacity>
                  </View>
                );
              })
            )}

            {!searchQ && following.length > 0 && (
              <View className="mt-6">
                <Text className="font-bold text-slate-500 uppercase tracking-widest text-xs mb-4">Mijn Vrienden ({following.length})</Text>
                {/* Note: In a full app you'd fetch the actual profiles of the following list from Firestore. 
                    For this prototype, we're just showing the IDs/search results. */}
                <View className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                   <Text className="text-blue-700 font-bold text-center text-sm">Gebruik de zoekbalk om meer spelers te vinden en te volgen!</Text>
                </View>
              </View>
            )}

          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
