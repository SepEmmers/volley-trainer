import {
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously as firebaseSignInAnonymously,
  linkWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { auth } from '../config/firebase';

const googleProvider = new GoogleAuthProvider();

/** Sign in with Google via browser popup. */
export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

/** Sign in anonymously (works everywhere, including Expo Go). */
export async function signInAnonymously(): Promise<User> {
  const result = await firebaseSignInAnonymously(auth);
  return result.user;
}

/**
 * Upgrade an anonymous session to a Google account.
 * Preserves all cloud data already written under the anonymous UID.
 */
export async function linkAnonymousToGoogle(): Promise<User> {
  const current = auth.currentUser;
  if (!current) throw new Error('No current user to link');
  const result = await linkWithPopup(current, googleProvider);
  return result.user;
}

/** Sign out from Firebase. */
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

/** Subscribe to auth state changes. Returns the unsubscribe function. */
export function subscribeToAuthState(
  callback: (user: User | null) => void,
): () => void {
  return onAuthStateChanged(auth, callback);
}
