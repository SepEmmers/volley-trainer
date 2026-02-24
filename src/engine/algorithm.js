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
export const generateProgram = (profile) => {
  const { goal, equipment, history = [] } = profile;
  const hasDumbbells = equipment === 'dumbbells';
  const hasKneePain = history.includes('jumper_knee');
  const hasShoulderPain = history.includes('shoulder_pain');

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

  // Phase A: Explosive / Strength (Goal Correlated)
  let phaseA = [];
  if (goal === 'vertical') {
    phaseA = filterImpact(filterEq(getExercises([
      'approach_box_jump', 'tuck_jumps', 'dumbbell_squat_jump', 'goblet_squat', 'single_leg_calf_raise'
    ])), 'knee');
    // If knee pain was flagged and bilateral high impact was removed, ensure we add single leg RDL
    if (hasKneePain && !phaseA.find(e => e.id === 'single_leg_rdl')) {
        phaseA.push(EXERCISES['single_leg_rdl']);
    }
  } else if (goal === 'agility') {
    phaseA = filterImpact(filterEq(getExercises([
      'skater_jumps', 'lateral_hurdle_hops', 't_cone_drill', 'block_jump_shuffle'
    ])), 'knee');
  } else {
    // Injury focus as primary goal
    phaseA = filterEq(getExercises([
      'single_leg_wall_sit', 'side_lying_external_rotation', 'single_leg_rdl', 'glute_bridges', 'prone_ytw'
    ]));
  }

  // Phase B: Upper Body & Core
  let phaseB = filterImpact(filterEq(getExercises([
    'explosive_pushups', 'dumbbell_shoulder_press', 'bent_over_rows', 'dead_bug', 'forearm_plank'
  ])), 'shoulder');
  
  // If shoulder pain was flagged, ensure we add more pulling/prehab
  if (hasShoulderPain && !phaseB.find(e => e.id === 'prone_ytw')) {
      phaseB.push(EXERCISES['prone_ytw']);
  }

  // Phase C: Prehabilitation & Resilience (Always included for all athletes per research)
  let phaseC = filterEq(getExercises([
    'side_lying_flexion', 'pushup_plus', 'full_can_raise', 'ankle_sup_pro', 'broad_jump_stabilize'
  ]));

  return [
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
  ];
};
