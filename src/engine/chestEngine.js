// ─── VolleyTrain Chest Engine ─────────────────────────────────────────────────
// Handles the loot chest mechanics: rarity rolling, item selection, duplicate handling.

import { ALL_ITEMS, RARITIES } from './items';

// Cost to open one Volleybal Kist
export const CHEST_PRICE = 150;

// Duplicate item reward in Spikes
export const DUPLICATE_SPIKES = 30;

/**
 * Weighted random rarity roll.
 * Returns a rarity id string: 'common' | 'rare' | 'epic' | 'legendary'
 */
function rollRarity() {
  const totalWeight = Object.values(RARITIES).reduce((sum, r) => sum + r.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const rarity of Object.values(RARITIES)) {
    roll -= rarity.weight;
    if (roll <= 0) return rarity.id;
  }
  return 'common';
}

/**
 * Opens a chest and returns the result.
 * @param {string[]} inventory - Array of item IDs the user already owns
 * @returns {{ item: object, isNew: boolean, isDuplicate: boolean, duplicateSpikes: number }}
 */
export function openChest(inventory = []) {
  const rarity = rollRarity();

  // Get all items of this rarity
  const rarityPool = ALL_ITEMS.filter(item => item.rarity === rarity);

  if (rarityPool.length === 0) {
    // Fallback to common
    const commonPool = ALL_ITEMS.filter(item => item.rarity === 'common');
    const item = commonPool[Math.floor(Math.random() * commonPool.length)];
    return { item, isNew: !inventory.includes(item.id), isDuplicate: inventory.includes(item.id), duplicateSpikes: DUPLICATE_SPIKES };
  }

  // Pick a random item from the rarity pool
  const item = rarityPool[Math.floor(Math.random() * rarityPool.length)];
  const isDuplicate = inventory.includes(item.id);
  const isNew = !isDuplicate;

  return {
    item,
    isNew,
    isDuplicate,
    duplicateSpikes: isDuplicate ? DUPLICATE_SPIKES : 0,
  };
}

/**
 * Calculate Spikes earned after completing a workout session.
 * Base: 50 spikes. Bonus for completing all sets with no skips.
 */
export const WORKOUT_SPIKE_REWARD = 50;
export const BONUS_SPIKE_REWARD = 25; // if all exercises completed (not awarded currently — reserved for future)
