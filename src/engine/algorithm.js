import { EXERCISES } from './exercises';

/**
 * Builds a customized workout phase based on user constraints and the research paper guidelines.
 * 
 * @param {Object} profile - The user profile containing:
 *  - goal: 'vertical', 'injury', 'agility'
 *  - equipment: 'bodyweight' or 'dumbbells'
 *  - history: array of strings e.g. ['jumper_knee', 'shoulder_pain']
 * @returns {Array} An array of workout phases (A, B, C) filled with exercise objects.
 */
export const generateProgram = (profile, customItems = []) => {
  const { goal, equipment, history = [] } = profile;
  const hasDumbbells = equipment === 'dumbbells';
  const hasKneePain = history.includes('jumper_knee');
  const hasShoulderPain = history.includes('shoulder_pain');
  const hasBackPain = history.includes('back_pain');

  // Active injuries list for filtering custom items
  const activeInjuries = [];
  if (hasKneePain) activeInjuries.push('knee');
  if (hasShoulderPain) activeInjuries.push('shoulder');
  if (hasBackPain) activeInjuries.push('back');

  // Helper to filter exercises based on equipment constrains
  const filterEq = (exList) => exList.filter(ex => 
    hasDumbbells ? true : ex.equipment === 'bodyweight'
  );

  // Helper to filter impact based on injuries
  const filterImpact = (exList, joint) => {
    return exList.filter(ex => {
      // If knee pain, remove high impact lower body 
      if (joint === 'knee' && hasKneePain && ex.impact === 'high') return false;
      // If shoulder pain, remove heavy overhead pressing
      if (joint === 'shoulder' && hasShoulderPain && ex.id === 'dumbbell_shoulder_press') return false;
      return true;
    });
  };

  const getExercises = (categoryList) => {
    // Map IDs back to full objects
    return categoryList.map(id => EXERCISES[id]).filter(Boolean);
  };

  // Filter custom items based on safety and equipment constraints
  const getFilteredCustomItems = (type, cGoal, phaseCategory = null) => {
    return customItems.filter(item => {
      // Handle custom rehab exercises
      if (item.type === 'rehab') {
        // Only include rehab exercises if the user has that specific active injury 
        // AND their goal is either 'all' or 'injury'
        if ((item.goal !== 'all' && item.goal !== 'injury') || goal !== 'injury') return false;
        if (!item.target_injury || !activeInjuries.includes(item.target_injury)) return false;
        
        // Map rehab to phases: knee/back -> Phase A (Structural), shoulder -> Phase B (Upper)
        const expectedPhase = item.target_injury === 'shoulder' ? 'core' : 'performance';
        if (phaseCategory && expectedPhase !== phaseCategory) return false;
        
        return true;
      }

      // Handle standard workouts/warmups/cooldowns
      if (item.type !== type) return false;
      if (phaseCategory && item.category !== phaseCategory) return false;
      if (item.goal !== 'all' && item.goal !== cGoal) return false;
      if (!hasDumbbells && item.equipment !== 'bodyweight') return false;
      
      // Safety check: if user has injuries, standard items must be explicitly safe for ALL active injuries
      if (activeInjuries.length > 0) {
        const isSafe = activeInjuries.every(inj => item.safeFor?.includes(inj));
        if (!isSafe) return false;
      }
      
      return true;
    });
  };

  // Extract custom warmups and cooldowns
  const customWarmups = getFilteredCustomItems('warmup', goal);
  const customCooldowns = getFilteredCustomItems('cooldown', goal);

  // Phase A: Explosive / Strength / Lower Body Rehab (Goal Correlated)
  let phaseA = [];
  if (goal === 'knee_rehab' || (goal === 'injury' && hasKneePain)) {
    // Dedicated Knee Revalidation Phase 1: Activation, Motor Control & VMO
    phaseA = filterEq(getExercises([
      'vmo_wall_sit_ball', 'clamshell_60_90', 'glute_bridge_band', 'side_lying_hip_abduction',
      'quadruped_hip_ext_knee_flexed', 'single_leg_knee_extension_isometrics'
    ]));
  } else if (goal === 'vertical') {
    // Advanced jump mechanics
    phaseA = filterImpact(filterEq(getExercises([
      'approach_box_jump', 'tuck_jumps', 'dumbbell_squat_jump', 'goblet_squat', 'single_leg_calf_raise',
      'barbell_back_squat', 'split_squat_jumps', 'seated_box_jumps', 'broad_jumps', 'jump_rope_intervals'
    ])), 'knee');
    if (hasKneePain && !phaseA.find(e => e.id === 'single_leg_rdl')) {
        phaseA.push(EXERCISES['single_leg_rdl']);
    }
  } else if (goal === 'agility') {
    // Multi-directional agility drills
    phaseA = filterImpact(filterEq(getExercises([
      'skater_jumps', 'lateral_hurdle_hops', 't_cone_drill', 'block_jump_shuffle',
      'lateral_scissor_steps', 'court_speed_drill', 'visual_command_chopping', 'partner_drop_drill', 'wall_dig_reaction', 'lateral_pattern_hops'
    ])), 'knee');
  } else {
    // Injury focus as primary goal - build targeted lower body rehab
    if (hasKneePain) {
      phaseA = filterEq(getExercises(['vmo_wall_sit_ball', 'clamshell_60_90', 'glute_bridge_band', 'single_leg_wall_sit', 'single_leg_knee_extension_isometrics']));
    } else {
      // General lower body structural integrity
      phaseA = filterEq(getExercises(['single_leg_wall_sit', 'single_leg_rdl', 'glute_bridges', 'single_leg_calf_raise']));
    }
  }

  // Phase B: Unilateral Strength & Eccentric Control OR Upper Body
  let phaseB = [];
  if (goal === 'knee_rehab' || (goal === 'injury' && hasKneePain)) {
    // Dedicated Knee Revalidation Phase 2: Unilateral Strength & Eccentric Deceleration
    phaseB = filterEq(getExercises([
      'single_leg_squat_box_tap', 'single_leg_rdl', 'lateral_monster_walks', 'forward_step_down', 'bulgarian_split_squat'
    ]));
  } else if (goal === 'injury' && hasShoulderPain) {
    // Shoulder Rotator Cuff/Scapula specific rehab
    phaseB = filterEq(getExercises([
      'blackburns_iytw', 'wall_slides_protraction', 'side_lying_external_rotation', 'banded_pallof_press',
      'prone_ytw', 'dead_bug', 'forearm_plank', 'side_plank_external_rotation'
    ]));
  } else {
    // Standard upper body & core + advanced attacking mechanics and rigid core drills
    phaseB = filterImpact(filterEq(getExercises([
      'explosive_pushups', 'dumbbell_shoulder_press', 'bent_over_rows', 'dead_bug', 'forearm_plank',
      'med_ball_rotational_throws', 'half_kneeling_landmine_press', 'dumbbell_pullovers', 'cable_thoracic_rotational_row',
      'strict_planks', 'stability_ball_stir_the_pot', 'russian_twists', 'bird_dogs'
    ])), 'shoulder');
    
    if (hasShoulderPain && !phaseB.find(e => e.id === 'blackburns_iytw')) {
        phaseB.push(EXERCISES['blackburns_iytw']);
    }
  }

  // Phase C: Proprioception, Soft Landing & Prehab (Research Guidelines)
  let phaseC = [];
  if (goal === 'knee_rehab' || (goal === 'injury' && hasKneePain)) {
    // Dedicated Knee Revalidation Phase 3: Proprioception, Deceleration & Soft Landing
    phaseC = filterEq(getExercises([
      'y_balance_reaches', 'bosu_single_leg_balance', 'perturbation_catch', 'single_leg_hop_stick',
      'drop_jump_soft_landing', 'forward_approach_deceleration'
    ]));
  } else {
    phaseC = filterEq(getExercises([
      'side_lying_flexion', 'pushup_plus', 'full_can_raise', 'ankle_sup_pro', 'broad_jump_stabilize',
      'serratus_wall_slides', 'floor_angels', 'diagonal_shoulder_walks',
      'ankle_alphabet', 'towel_scrunches', 'seated_calf_stretches', 'four_way_band_ankle', 'balance_progression'
    ]));
  }

  // Add custom workout items (including matched custom rehab items) to their respective phases
  phaseA = [...phaseA, ...getFilteredCustomItems('workout', goal, 'performance')];
  phaseB = [...phaseB, ...getFilteredCustomItems('workout', goal, 'core')];
  phaseC = [...phaseC, ...getFilteredCustomItems('workout', goal, 'prehab')];

  const phases = [];

  // If there are custom warmups, add a Warmup phase at the start
  if (customWarmups.length > 0) {
    phases.push({
      id: 'WARMUP',
      title: 'Warmup & Activation',
      type: 'warmup',
      exercises: customWarmups.slice(0, 3)
    });
  }

  const phaseATitle = (goal === 'knee_rehab' || (goal === 'injury' && hasKneePain)) ? 'Knee Phase 1: VMO & Activation' : goal === 'vertical' ? 'Power Phase: Vertical' : goal === 'agility' ? 'Resilience Phase: Agility' : 'Rehab Phase: Structural';
  const phaseBTitle = (goal === 'knee_rehab' || (goal === 'injury' && hasKneePain)) ? 'Knee Phase 2: Unilateral Strength' : 'Stability Phase: Upper & Core';
  const phaseCTitle = (goal === 'knee_rehab' || (goal === 'injury' && hasKneePain)) ? 'Knee Phase 3: Proprioception & Deceleration' : 'Prehabilitation & Joint Health';

  phases.push(
    {
      id: 'A',
      title: phaseATitle,
      type: 'performance',
      exercises: phaseA.slice(0, 4) // Keep to 4 exercises for time constraints
    },
    {
      id: 'B',
      title: phaseBTitle,
      type: 'core',
      exercises: phaseB.slice(0, 4)
    },
    {
      id: 'C',
      title: phaseCTitle,
      type: 'prehab',
      exercises: phaseC.slice(0, 4)
    }
  );

  // If there are custom cooldowns, add a Cooldown phase at the end
  if (customCooldowns.length > 0) {
    phases.push({
      id: 'COOLDOWN',
      title: 'Cool-down & Flexibility',
      type: 'cooldown',
      exercises: customCooldowns.slice(0, 3)
    });
  }

  return phases;
};

/**
 * Computes an optimal automatic training schedule based on desired volume and existing match days.
 * 
 * @param {number} daysPerWeek - Desired number of workouts per week
 * @param {Array} matchDays - Array of days (1-7) where user has matches or volleyball training
 * @returns {Object} Optimized schedule dict e.g. { '1': 'workout', '2': 'rest', ... }
 */
export const computeAutoSchedule = (daysPerWeek = 3, matchDays = []) => {
  const schedule = { '1': 'rest', '2': 'rest', '3': 'rest', '4': 'rest', '5': 'rest', '6': 'rest', '7': 'rest' };
  
  const mDays = (matchDays || []).map(Number);
  mDays.forEach(day => {
    if (day >= 1 && day <= 7) schedule[day.toString()] = 'match';
  });

  const availableDays = [1, 2, 3, 4, 5, 6, 7].filter(d => !mDays.includes(d));
  const workoutsToAssign = Math.min(daysPerWeek, availableDays.length);

  if (workoutsToAssign <= 0) return schedule;

  const combinations = [];
  const getSubsets = (arr, k, start, result) => {
    if (result.length === k) {
      combinations.push([...result]);
      return;
    }
    for (let i = start; i < arr.length; i++) {
        result.push(arr[i]);
        getSubsets(arr, k, i + 1, result);
        result.pop();
    }
  };
  getSubsets(availableDays, workoutsToAssign, 0, []);

  let bestScore = -Infinity;
  let bestCombo = null;

  combinations.forEach(combo => {
     let score = 0;
     const allActive = [...mDays, ...combo].sort((a,b) => a-b);
     
     let minGap = 7;
     let gapSum = 0;
     const gaps = [];
     for(let i = 0; i < allActive.length; i++) {
         const nextIdx = (i + 1) % allActive.length;
         let gap = allActive[nextIdx] - allActive[i];
         if (gap <= 0) gap += 7; // wrap around
         const restDays = gap - 1;
         gaps.push(restDays);
         if (restDays < minGap) minGap = restDays;
         gapSum += restDays;
     }

     let penaltyForWeekends = 0;
     combo.forEach(c => {
        if (c === 6 || c === 7) penaltyForWeekends += 0.5;
     });

     score += minGap * 100;
     
     const avgGap = gapSum / gaps.length;
     let variance = 0;
     gaps.forEach(g => variance += Math.pow(g - avgGap, 2));
     score -= variance * 10;
     score -= penaltyForWeekends;

     // Prefer classical Mon/Wed/Fri defaults if tie
     if (combo.includes(1)) score += 0.1;
     if (combo.includes(3)) score += 0.1;
     if (combo.includes(5)) score += 0.1;

     if (score > bestScore) {
       bestScore = score;
       bestCombo = combo;
     }
  });

  if (bestCombo) {
     bestCombo.forEach(d => {
       schedule[d.toString()] = 'workout';
     });
  }

  return schedule;
};
