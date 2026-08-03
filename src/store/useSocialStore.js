import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types inside comments for JS/doc reference
/**
 * CustomItem
 * @property {string} id - UUID
 * @property {string} type - 'warmup', 'workout', 'cooldown'
 * @property {string} name 
 * @property {string} description
 * @property {string} category - 'performance' | 'core' | 'prehab' (if workout)
 * @property {string} goal - 'vertical' | 'agility' | 'injury' | 'all'
 * @property {string} equipment - 'bodyweight' | 'dumbbells' | 'bands'
 * @property {string[]} safeFor - e.g. ['knee', 'shoulder', 'back']
 * @property {string|null} videoUrl 
 * @property {string} impact - 'low' | 'high'
 * @property {string} createdByUid 
 * @property {string} creatorName 
 */

export const useSocialStore = create(
  persist(
    (set, get) => ({
      isPublicProfile: false,
      publicProfileOptions: { showCalendar: false, showProgress: false, showCollection: false, showTeam: false },
      following: [],            // Array of UIDs user follows
      customExercises: [],      // Array of CustomItems created locally
      downloadedExercises: [],  // Array of CustomItems downloaded from community

      setIsPublicProfile: (isPublic) => set({ isPublicProfile: isPublic }),
      setPublicProfileOption: (key, value) => set(state => ({
        publicProfileOptions: { ...state.publicProfileOptions, [key]: value }
      })),
      
      toggleFollow: (uid) => set((state) => {
        const currentlyFollowing = state.following.includes(uid);
        return {
          following: currentlyFollowing 
            ? state.following.filter(id => id !== uid)
            : [...state.following, uid]
        };
      }),

      addCustomExercise: (item) => set((state) => ({
        customExercises: [...state.customExercises, item]
      })),

      updateCustomExercise: (item) => set((state) => ({
        customExercises: state.customExercises.map(i => i.id === item.id ? item : i)
      })),

      deleteCustomExercise: (id) => set((state) => ({
        customExercises: state.customExercises.filter(i => i.id !== id)
      })),

      downloadCommunityExercise: (item) => set((state) => {
        if (state.downloadedExercises.find(i => i.id === item.id)) return state;
        return {
          downloadedExercises: [...state.downloadedExercises, item]
        };
      }),

      removeDownloadedExercise: (id) => set((state) => ({
        downloadedExercises: state.downloadedExercises.filter(i => i.id !== id)
      })),
      
      // Wipe state when user logs out or wipes data
      clearSocialState: () => set({
        isPublicProfile: false,
        publicProfileOptions: { showCalendar: false, showProgress: false, showCollection: false, showTeam: false },
        following: [],
        customExercises: [],
        downloadedExercises: [],
      })
    }),
    {
      name: 'volleybuild-social',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
