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
  if (goal === 'vertical') {
    // Added advanced jump mechanics
    phaseA = filterImpact(filterEq(getExercises([
      'approach_box_jump', 'tuck_jumps', 'dumbbell_squat_jump', 'goblet_squat', 'single_leg_calf_raise',
      'barbell_back_squat', 'split_squat_jumps', 'seated_box_jumps', 'broad_jumps', 'jump_rope_intervals'
    ])), 'knee');
    if (hasKneePain && !phaseA.find(e => e.id === 'single_leg_rdl')) {
        phaseA.push(EXERCISES['single_leg_rdl']);
    }
  } else if (goal === 'agility') {
    // Added multi-directional agility drills
    phaseA = filterImpact(filterEq(getExercises([
      'skater_jumps', 'lateral_hurdle_hops', 't_cone_drill', 'block_jump_shuffle',
      'lateral_scissor_steps', 'court_speed_drill', 'visual_command_chopping', 'partner_drop_drill', 'wall_dig_reaction', 'lateral_pattern_hops'
    ])), 'knee');
  } else {
    // Injury focus as primary goal - build targeted lower body rehab
    if (hasKneePain) {
      // Patellar tendon specific rehab + new isometric
      phaseA = filterEq(getExercises(['spanish_squats', 'decline_eccentric_squat', 'single_leg_wall_sit', 'glute_bridges', 'single_leg_knee_extension_isometrics']));
    } else {
      // General lower body structural integrity
      phaseA = filterEq(getExercises(['single_leg_wall_sit', 'single_leg_rdl', 'glute_bridges', 'single_leg_calf_raise']));
    }
  }

  // Phase B: Upper Body & Core / Upper Body Rehab
  let phaseB = [];
  if (goal === 'injury' && hasShoulderPain) {
    // Shoulder Rotator Cuff/Scapula specific rehab + comprehensive new protocols
    phaseB = filterEq(getExercises([
      'wall_slides', 'band_external_rotation', 'prone_ytw', 'dead_bug', 'forearm_plank',
      'pendulum_swings', 'cane_assisted_rom', 'band_internal_rotation', 'shoulder_decelerators', 'side_plank_external_rotation'
    ]));
  } else {
    // Standard upper body & core + new advanced attacking mechanics and rigid core drills
    phaseB = filterImpact(filterEq(getExercises([
      'explosive_pushups', 'dumbbell_shoulder_press', 'bent_over_rows', 'dead_bug', 'forearm_plank',
      'med_ball_rotational_throws', 'half_kneeling_landmine_press', 'dumbbell_pullovers', 'cable_thoracic_rotational_row',
      'strict_planks', 'stability_ball_stir_the_pot', 'russian_twists', 'bird_dogs'
    ])), 'shoulder');
    
    if (hasShoulderPain && !phaseB.find(e => e.id === 'prone_ytw')) {
        phaseB.push(EXERCISES['prone_ytw']);
    }
  }

  // Phase C: Prehabilitation & Resilience (Always included for all athletes per research)
  // Expanded with comprehensive serratus anterior activation and ankle proprioception
  let phaseC = filterEq(getExercises([
    'side_lying_flexion', 'pushup_plus', 'full_can_raise', 'ankle_sup_pro', 'broad_jump_stabilize',
    'serratus_wall_slides', 'floor_angels', 'diagonal_shoulder_walks',
    'ankle_alphabet', 'towel_scrunches', 'seated_calf_stretches', 'four_way_band_ankle', 'balance_progression'
  ]));

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

  phases.push(
    {
      id: 'A',
      title: goal === 'vertical' ? 'Power Phase: Vertical' : goal === 'agility' ? 'Resilience Phase: Agility' : 'Rehab Phase: Structural',
      type: 'performance',
      exercises: phaseA.slice(0, 4) // Keep to 4 exercises for time constraints
    },
    {
      id: 'B',
      title: 'Stability Phase: Upper & Core',
      type: 'core',
      exercises: phaseB.slice(0, 4)
    },
    {
      id: 'C',
      title: 'Prehabilitation & Joint Health',
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
