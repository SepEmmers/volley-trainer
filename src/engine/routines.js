// ─── Volleyball Training Routines ────────────────────────────────────────────
// Static warmup, cooldown, and stretching routines designed for volleyball athletes.
// Each exercise has NL/EN translations, a video reference, and timing info.

export const WARMUP_ROUTINE = [
  {
    id: 'warmup_high_knees',
    category: 'warmup',
    name: { en: 'High Knees', nl: 'Hoeknielift' },
    reps: { en: '30 seconds', nl: '30 seconden' },
    instructions: {
      en: 'Jog in place, driving your knees up to hip height with each step. Pump your arms in rhythm. Keep your core tight and land on the balls of your feet.',
      nl: 'Hol op de plaats en breng je knieën tot heuphoogte bij elke stap. Beweeg je armen mee in het ritme. Houd je core gespannen en land op de ballen van je voeten.',
    },
    muscles: ['Hip Flexors', 'Calves', 'Core'],
    videoUrl: 'https://www.youtube.com/watch?v=D9X2CKo_yDo',
    duration: 30,
    icon: 'flame',
  },
  {
    id: 'warmup_hip_circles',
    category: 'warmup',
    name: { en: 'Hip Circles', nl: 'Heup Rotaties' },
    reps: { en: '10 each direction', nl: '10 per richting' },
    instructions: {
      en: 'Stand with feet shoulder-width apart and hands on your hips. Make large, controlled circular movements with your hips — 10 clockwise, then 10 counterclockwise. Keep your upper body still.',
      nl: 'Sta met voeten op schouderbreedte en handen op de heupen. Maak grote, gecontroleerde cirkelbewegingen met je heupen — 10 met de klok mee, dan 10 tegen de klok. Houd je bovenlichaam stil.',
    },
    muscles: ['Hip Flexors', 'Glutes', 'Lower Back'],
    videoUrl: 'https://www.youtube.com/watch?v=_1UXf82JGF4',
    duration: 40,
    icon: 'rotate-cw',
  },
  {
    id: 'warmup_arm_swings',
    category: 'warmup',
    name: { en: 'Arm Cross Swings', nl: 'Arm Kruislingse Zwaai' },
    reps: { en: '20 swings', nl: '20 keer' },
    instructions: {
      en: 'Stand tall, extend both arms out to the sides. Swing them across your body so they cross in front of your chest, alternating which arm is on top. Gradually increase the range of motion with each swing.',
      nl: 'Sta rechtop, strek beide armen zijwaarts. Zwaai ze voor je borst langs zodat ze kruisen, wissel af welke arm bovenop ligt. Vergroot geleidelijk het bewegingsbereik met elke zwaai.',
    },
    muscles: ['Anterior Deltoid', 'Pectorals', 'Rotator Cuff'],
    videoUrl: 'https://www.youtube.com/watch?v=d_wBzH8DMIM',
    duration: 30,
    icon: 'zap',
  },
  {
    id: 'warmup_leg_swings',
    category: 'warmup',
    name: { en: 'Leg Swings', nl: 'Beenzwaai' },
    reps: { en: '15 each leg', nl: '15 per been' },
    instructions: {
      en: 'Hold a wall for support. Swing one leg forward and back like a pendulum, gradually increasing height. After 15 reps, swing the same leg side-to-side. Switch legs.',
      nl: 'Houd een muur voor steun. Zwaai één been voor- en achterwaarts als een slinger, vergroot geleidelijk de hoogte. Doe na 15 herhalingen datzelfde been zijwaarts. Wissel been.',
    },
    muscles: ['Hamstrings', 'Hip Flexors', 'Adductors'],
    videoUrl: 'https://www.youtube.com/watch?v=RFdOJWB9KyM',
    duration: 45,
    icon: 'activity',
  },
  {
    id: 'warmup_ankle_rolls',
    category: 'warmup',
    name: { en: 'Ankle Rolls', nl: 'Enkels Rollen' },
    reps: { en: '10 each direction, each ankle', nl: '10 per richting, per enkel' },
    instructions: {
      en: 'Lift one foot off the floor. Rotate your ankle in slow, full circles — 10 clockwise, then 10 counterclockwise. Switch feet. This primes the ankle joints critical for jump-landing mechanics.',
      nl: 'Til één voet van de vloer. Draai je enkel in langzame, volledige cirkels — 10 met de klok mee, dan 10 ertegen. Wissel voeten. Dit bereidt de enkels voor op spring- en landingsbewegingen.',
    },
    muscles: ['Peroneals', 'Ankle Stabilizers'],
    videoUrl: 'https://www.youtube.com/watch?v=ixKWLxCAbmc',
    duration: 30,
    icon: 'shield',
  },
];

export const COOLDOWN_ROUTINE = [
  {
    id: 'cool_quad_stretch',
    category: 'cooldown',
    name: { en: 'Standing Quad Stretch', nl: 'Staande Quadriceps Rek' },
    reps: { en: 'Hold 30s each leg', nl: 'Vasthouden 30s per been' },
    instructions: {
      en: 'Stand on one leg, bend the other knee and hold your foot behind you. Keep your knees together and stand tall. Hold for 30 seconds. Switch sides.',
      nl: 'Sta op één been, buig de andere knie en houd je voet achter je vast. Houd knieën bij elkaar en sta rechtop. Houd 30 seconden vast. Wissel.',
    },
    muscles: ['Quadriceps', 'Hip Flexors'],
    videoUrl: 'https://www.youtube.com/watch?v=d_1n-Km70BY',
    duration: 60,
    icon: 'minus',
  },
  {
    id: 'cool_hip_flexor',
    category: 'cooldown',
    name: { en: 'Kneeling Hip Flexor Stretch', nl: 'Knielende Heupbuiger Rek' },
    reps: { en: 'Hold 30s each side', nl: 'Vasthouden 30s per kant' },
    instructions: {
      en: 'Kneel on one knee with the other foot forward. Gently push your hips forward until you feel a stretch in the front of your rear hip. Keep your torso upright. Hold for 30 seconds, then switch.',
      nl: 'Knie op één knie met de andere voet vooruit. Druk je heupen voorzichtig naar voren totdat je een rek voelt in de voorzijde van je achterse heup. Houd romp rechtop. Houd 30 seconden, wissel.',
    },
    muscles: ['Hip Flexors', 'Psoas'],
    videoUrl: 'https://www.youtube.com/watch?v=YQmpO61Y2J8',
    duration: 60,
    icon: 'minus',
  },
  {
    id: 'cool_hamstring',
    category: 'cooldown',
    name: { en: 'Seated Hamstring Stretch', nl: 'Gezeten Hamstring Rek' },
    reps: { en: 'Hold 30s each leg', nl: 'Vasthouden 30s per been' },
    instructions: {
      en: 'Sit on the floor with one leg extended and one bent. Reach forward toward your toes on the extended leg, keeping your back flat. Hold for 30 seconds. Switch sides.',
      nl: 'Zit op de vloer met één been gestrekt en één gebogen. Reik naar voren richting je tenen van het gestrekte been, houd rug recht. Houd 30 seconden. Wissel.',
    },
    muscles: ['Hamstrings', 'Lower Back'],
    videoUrl: 'https://www.youtube.com/watch?v=8Tm4YUFrNQQ',
    duration: 60,
    icon: 'minus',
  },
  {
    id: 'cool_shoulder_cross',
    category: 'cooldown',
    name: { en: 'Cross-Body Shoulder Stretch', nl: 'Schouderkruising Rek' },
    reps: { en: 'Hold 30s each arm', nl: 'Vasthouden 30s per arm' },
    instructions: {
      en: 'Bring one arm across your chest. Use your other hand to gently press the arm closer to your body. Keep your shoulder relaxed and down. Hold for 30 seconds. Switch arms.',
      nl: 'Breng één arm over je borst. Gebruik je andere hand om de arm voorzichtig dichter naar je lichaam te drukken. Houd je schouder ontspannen en omlaag. Houd 30 seconden. Wissel.',
    },
    muscles: ['Posterior Deltoid', 'Rotator Cuff'],
    videoUrl: 'https://www.youtube.com/watch?v=3bRZr8OevlA',
    duration: 60,
    icon: 'shield',
  },
  {
    id: 'cool_thoracic',
    category: 'cooldown',
    name: { en: 'Thoracic Rotation (Thread the Needle)', nl: 'Borstwervel Rotatie (Draad de Naald)' },
    reps: { en: '10 reps each side', nl: '10 herhalingen per kant' },
    instructions: {
      en: 'Start on all fours. Slide one hand under your body and rotate your thoracic spine, reaching as far as you can to the opposite side. Return slowly. Do 10 reps, then switch arms.',
      nl: 'Begin op handen en knieën. Schuif één hand onder je lichaam en roteer je borstwervelkolom, reik zo ver als je kunt naar de andere kant. Keer langzaam terug. Doe 10 herhalingen, wissel.',
    },
    muscles: ['Thoracic Spine', 'Rotator Cuff', 'Lats'],
    videoUrl: 'https://www.youtube.com/watch?v=JcjMcKS1Zx8',
    duration: 45,
    icon: 'rotate-cw',
  },
];

export const STRETCHING_ROUTINE = [
  {
    id: 'stretch_pigeon',
    category: 'stretching',
    name: { en: 'Pigeon Pose Hip Opener', nl: 'Duifhouding Heupopener' },
    reps: { en: 'Hold 45s each side', nl: 'Vasthouden 45s per kant' },
    instructions: {
      en: 'From all fours, slide one knee forward at an angle. Extend the opposite leg straight behind. Lower your hips toward the floor. Hold. This deeply opens the hip external rotators — critical for court movement.',
      nl: 'Begin op handen en knieën, schuif één knie schuin naar voren. Strek het andere been recht achterwaarts. Laat je heupen naar de vloer zakken. Houd vast. Dit opent de heup externe rotatoren — essentieel voor veldbewegingen.',
    },
    muscles: ['Glutes', 'Piriformis', 'Hip External Rotators'],
    videoUrl: 'https://www.youtube.com/watch?v=I3KHaHhZLDs',
    duration: 90,
    icon: 'heart',
  },
  {
    id: 'stretch_calf_achilles',
    category: 'stretching',
    name: { en: 'Calf & Achilles Stretch', nl: 'Kuit & Achillespees Rek' },
    reps: { en: 'Hold 30s each position each leg', nl: 'Vasthouden 30s per positie per been' },
    instructions: {
      en: 'Stand near a wall. Place one foot back with the heel on the floor — straight knee for calf, then bent knee for Achilles. Hold each for 30 seconds. This prevents the most common volleyball overuse injury.',
      nl: 'Sta bij een muur. Zet één voet naar achteren met de hiel op de grond — rechte knie voor kuit, gebogen knie voor Achillespees. Houd elk 30 seconden. Dit voorkomt de meest voorkomende overbelasting bij volleybal.',
    },
    muscles: ['Gastrocnemius', 'Soleus', 'Achilles Tendon'],
    videoUrl: 'https://www.youtube.com/watch?v=l4ZMwHO3FRo',
    duration: 120,
    icon: 'shield',
  },
  {
    id: 'stretch_doorway_chest',
    category: 'stretching',
    name: { en: 'Doorway Chest Stretch', nl: 'Deuropening Borst Stretch' },
    reps: { en: 'Hold 30s, 3 sets', nl: 'Vasthouden 30s, 3 sets' },
    instructions: {
      en: 'Stand in a doorway. Place forearms on the door frame at 90 degrees. Step forward slowly until you feel a stretch across your chest and anterior shoulder. Hold. Essential for spike mechanics and shoulder health.',
      nl: 'Sta in een deuropening. Zet onderarmen op het kozijn op 90 graden. Stap langzaam naar voren tot je een rek voelt over je borst en voorzijde schouder. Houd vast. Essentieel voor spiktechniek en schoudersgezondheid.',
    },
    muscles: ['Pectorals', 'Anterior Deltoid', 'Biceps'],
    videoUrl: 'https://www.youtube.com/watch?v=sOBJ27F3kzA',
    duration: 90,
    icon: 'activity',
  },
];
