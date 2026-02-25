import { db } from '../config/firebase';
import { doc, setDoc, deleteDoc, collection, query, where, getDocs, orderBy, getDoc, serverTimestamp, limit } from 'firebase/firestore';

/**
 * Updates the public profile for a user.
 * If isPublic is false, it deletes the public profile document.
 */
export const updatePublicProfile = async (uid: string, profileData: any, isPublic: boolean) => {
  if (!uid) return;
  const profileRef = doc(db, 'users', uid, 'profile', 'public');
  
  if (isPublic) {
    await setDoc(profileRef, {
      ...profileData,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } else {
    try {
      await deleteDoc(profileRef);
    } catch (_) {
      // ignore if doesn't exist
    }
  }
};

/**
 * Search for users by their exact display name (case sensitive for now).
 * Requires a query on the public profiles index.
 */
export const searchUsers = async (searchQuery: string) => {
  if (!searchQuery || searchQuery.trim() === '') return [];
  try {
    // Note: Firestore doesn't support native partial text search easily without third-party tools.
    // For this prototype, we'll do an exact match or prefix match using string limits.
    const usersRef = collection(db, 'users');
    // We are querying the 'profile/public' docs. Since they are subcollections, we'd need a collectionGroup query 
    // but for simplicity let's find users where displayName >= searchQuery
    // A better structure for searching is a top-level `public_profiles` collection.
    // Given our schema `users/{uid}/profile/public`, we use collectionGroup:
    const publicProfilesRef = collection(db, 'public_profiles'); // We will mirror it here for easy searching
    
    // As a workaround if collectionGroup is complex to secure, we'll assume we mirror public profiles to a top-level `public_profiles`
    const q = query(
      publicProfilesRef, 
      where('displayName', '>=', searchQuery),
      where('displayName', '<=', searchQuery + '\uf8ff'),
      limit(20)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
  } catch (error) {
    console.warn("Search failed:", error);
    return [];
  }
};

export const fetchCommunityExercises = async () => {
  try {
    const q = query(
      collection(db, 'community_exercises'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.warn("Failed to fetch community exercises:", error);
    return [];
  }
};

export const publishExercise = async (uid: string, creatorName: string, exercise: any) => {
  if (!uid) return;
  const docRef = doc(db, 'community_exercises', exercise.id);
  await setDoc(docRef, {
    ...exercise,
    createdByUid: uid,
    creatorName: creatorName || 'Anonymous Player',
    downloads: 0,
    createdAt: serverTimestamp()
  });
};

export const followUser = async (currentUid: string, currentName: string, targetUid: string, targetName: string) => {
  if (!currentUid || !targetUid || currentUid === targetUid) return;
  
  // Add to my following list
  await setDoc(doc(db, 'users', currentUid, 'following', targetUid), {
    uid: targetUid,
    displayName: targetName,
    followedAt: serverTimestamp()
  });

  // Add to their followers list
  await setDoc(doc(db, 'users', targetUid, 'followers', currentUid), {
    uid: currentUid,
    displayName: currentName,
    followedAt: serverTimestamp()
  });
};

export const unfollowUser = async (currentUid: string, targetUid: string) => {
  if (!currentUid || !targetUid) return;
  try {
    await deleteDoc(doc(db, 'users', currentUid, 'following', targetUid));
    await deleteDoc(doc(db, 'users', targetUid, 'followers', currentUid));
  } catch (e) {
    console.error(e);
  }
};
