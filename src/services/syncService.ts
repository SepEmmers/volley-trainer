import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

/** Keys from the app store we want to persist to Firestore. */
const SYNC_KEYS = [
  'isOnboarded',
  'profile',
  'stats',
  'workoutPhases',
  'weightLogs',
  'workoutHistory',
  'language',
  'mode',
  'spikes',
  'inventory',
  'chest_opens',
  'equipped',
] as const;

type SyncableState = Partial<Record<(typeof SYNC_KEYS)[number], unknown>>;

/**
 * Upload the relevant parts of the Zustand store to Firestore.
 * Silently fails if offline (Firestore queues the write automatically).
 */
export async function uploadToCloud(
  uid: string,
  storeState: SyncableState,
): Promise<void> {
  const payload: SyncableState & { updatedAt: unknown } = {
    updatedAt: serverTimestamp(),
  };
  SYNC_KEYS.forEach((key) => {
    if (key in storeState) payload[key] = storeState[key];
  });
  await setDoc(doc(db, 'users', uid, 'data', 'state'), payload, {
    merge: true,
  });
}

/**
 * Download the user's stored state from Firestore.
 * Returns null if no data exists yet.
 */
export async function downloadFromCloud(
  uid: string,
): Promise<SyncableState | null> {
  const snap = await getDoc(doc(db, 'users', uid, 'data', 'state'));
  if (!snap.exists()) return null;
  return snap.data() as SyncableState;
}

/**
 * Merge cloud and local state.
 * Strategy:
 * - "Settings" (profile, language, mode) always come from the cloud — the user
 *   intentionally saved them there from another device.
 * - "Progress" (sessions, weight logs, history, spikes …) comes from whichever
 *   side has more completed sessions, since users can train offline.
 * - If the cloud has a newer `updatedAt` timestamp, it wins for settings regardless.
 */
export function mergeCloudWithLocal(
  cloud: SyncableState,
  local: SyncableState,
): SyncableState {
  const cloudSessions =
    (cloud.stats as { sessionsCompleted?: number } | undefined)
      ?.sessionsCompleted ?? 0;
  const localSessions =
    (local.stats as { sessionsCompleted?: number } | undefined)
      ?.sessionsCompleted ?? 0;

  // Determine which side owns "progress" data
  const progressBase = cloudSessions >= localSessions
    ? { ...local, ...cloud }   // cloud progress is ahead or equal → trust cloud
    : { ...cloud, ...local };  // local progress is strictly ahead → keep local progress

  // Settings fields should ALWAYS come from cloud when cloud has them,
  // because the user explicitly saved them on another device.
  const settingsFromCloud: SyncableState = {};
  const settingsKeys = ['profile', 'language', 'mode', 'isOnboarded'] as const;
  settingsKeys.forEach((key) => {
    if (key in cloud && cloud[key] !== undefined) {
      (settingsFromCloud as any)[key] = cloud[key];
    }
  });

  return { ...progressBase, ...settingsFromCloud };
}
