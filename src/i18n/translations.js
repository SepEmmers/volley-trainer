// VolleyTrain i18n Translation Dictionary
// Default language: nl (Dutch)

export const translations = {

  // ─── DUTCH (Default) ─────────────────────────────────────────────────────
  nl: {
    // Tab Labels
    tabs: {
      home: 'Home',
      workout: 'Training',
      stats: 'Statistieken',
      profile: 'Profiel',
    },

    // Dashboard (index.tsx)
    dashboard: {
      brand: 'Courtside',
      greeting: (name) => `Hallo, ${name || 'Atleet'}.`,
      focus: 'TRAININGSFOCUS',
      nextDrill: 'Volgende Oefening',
      phase: (id) => `Fase ${id}`,
      hitCourt: 'Naar het Veld',
      sessions: 'Sessies',
      movements: 'Bewegingen',
      mobilityLabel: 'Mobiliteit',
      wellnessLabel: 'Conditie Leeftijd',
      aiCoach: 'AI Coach Analyse',
      activityLog: 'Activiteitenlog',
      daysPerWeek: (d) => `${d}d/wk`,
      minutesPerDay: (m) => `${m}m`,
      goalLabels: {
        vertical: 'Max Spronghoogte',
        injury: 'Blessurepreventie',
        agility: 'Veldbewegelijkheid',
      },
      aiMessages: {
        novice: 'Als beginner, focus op motorische controle en peesoefeningen. Haast je niet met de herhalingen.',
        advanced: 'Gevorderd profiel actief. Focus op maximale explosieve kracht in de concentrische fase van elke herhaling.',
        intermediate: 'Gemiddeld niveau bevestigd. Prioriteit bij techniek, maar verhoog de intensiteit bij plyometrics.',
        goalSuffix: (goal) => ` Jouw doel is ${goal}.`,
        shoulderWarning: ' Wees voorzichtig bij schouderoefeningen.',
      },
    },

    // Workout Screen
    workout: {
      header: 'Huidige Sessie',
      phase: (id) => `Fase ${id} Oefeningen`,
      setsReps: (sets, reps) => `${sets} Sets × ${reps}`,
      newDrillTitle: 'Nieuwe Oefening Gedetecteerd',
      newDrillBody: (name, reps) => `Je hebt ${name} nog nooit gelogd. Laten we je begingewicht bepalen voor ${reps} herhalingen.`,
      skipCalibrate: 'Sla Kalibratie Over',
      setBaseline: 'Stel Begingewicht In',
      logLoad: (unit) => `Gewicht Loggen (${unit})`,
      returnLocker: 'Terug naar Kleedkamer',
      restTitle: 'Rusttijd',
      restSubtitle: 'Herstelfase',
      assessmentPrompt: 'Voltooi eerst de Atletenbeoordeling voordat je naar het veld gaat.',
    },

    // Profile / Settings Screen
    profile: {
      header: 'Instellingen',
      title: 'Atletenprofiel',
      save: 'Opslaan',
      displayName: 'Weergavenaam',
      baseMetrics: 'Basismetrieken',
      age: 'Leeftijd',
      height: 'Lengte',
      weight: 'Gewicht',
      units: 'Eenheden',
      metric: 'Metrisch',
      imperial: 'Imperiaal',
      trainingFocus: 'Primaire Trainingsfocus',
      trainingFocusOptions: {
        vertical: 'Max Spronghoogte',
        injury: 'Blessurepreventie',
        agility: 'Veldbeweglichheid',
      },
      experience: 'Trainingservaring',
      levels: {
        novice: 'Beginner',
        intermediate: 'Gemiddeld',
        advanced: 'Gevorderd',
      },
      schedule: 'Trainingsschema',
      daysPerWeek: 'Dagen / Week',
      timePerSession: 'Tijd / Sessie',
      language: 'Taal',
      saved: 'Profiel Bijgewerkt',
      savedMsg: 'Je trainingsparameters zijn opgeslagen.',
    },

    // Telemetry / Stats Screen
    telemetry: {
      header: 'Prestaties',
      title: 'Statistieken',
      sessions: 'Sessies',
      phase: 'Fase',
      volume: 'Volume',
      maxLoad: 'Max Gewicht',
      reset: 'Profiel Resetten',
      resetConfirm: 'Weet je zeker dat je alle data wilt wissen?',
      resetYes: 'Ja, Wis Alles',
      resetNo: 'Annuleren',
    },

    // Onboarding
    onboarding: {
      step: (current, total) => `STAP ${current}/${total}`,
      step1Title: 'Maak je\nAtletenprofiel aan.',
      step2Title: 'Voer je\nBasismetrieken in.',
      step3Title: 'Stel je\nTrainingsparameters in.',
      displayNameLabel: 'Weergavenaam / Alias',
      displayNamePlaceholder: 'bijv. Volleybal Fenomeen',
      unitsLabel: 'Eenheidssysteem',
      equipmentLabel: 'Beschikbare Uitrusting',
      bodyweightOnly: 'Alleen Lichaamsgewicht',
      dumbbellsAccess: 'Dumbbells Beschikbaar',
      primaryFocusLabel: 'Primaire Focus',
      experienceLabel: 'Trainingservaring',
      daysPerWeekLabel: 'Dagen / Week',
      timePerSessionLabel: 'Tijd / Sessie',
      back: 'Terug',
      continue: 'Doorgaan',
      startAssessment: 'Start Beoordeling',
      focusOptions: {
        vertical: { label: 'Max Spronghoogte', desc: 'Focus op explosiviteit en hoogte' },
        injury: { label: 'Blessurepreventie', desc: 'Gewrichtsbestendigheid en levensduurt' },
        agility: { label: 'Veldbewegelijkheid', desc: 'Laterale snelheid en reactie' },
      },
    },

    // Exercise Detail Modal
    modal: {
      purpose: 'Doel',
      execution: 'Uitvoering',
      muscles: 'Spieren',
      impactLevel: 'Belastingsniveau',
      impactLabels: { low: 'Laag', medium: 'Gemiddeld', high: 'Hoog' },
      close: 'Sluiten',
      watchVideo: 'Bekijk Video',
    },

    // Routines (Warmup / Cooldown / Stretching)
    routine: {
      warmup: 'Warmoefeningen',
      cooldown: 'Afkoeling & Stretching',
      stretching: 'Mobilisatie',
      optional: 'Optioneel',
      tapToExpand: 'Tik om uit te vouwen',
    },

    // Exercise Category Labels
    categories: {
      vertical_jump: 'Spronghoogte',
      attacking_mechanics: 'Aanvalskracht',
      lateral_agility: 'Laterale Behendigheid',
      shoulder_prehab: 'Schouder Preventie',
      knee_ankle_stability: 'Knie & Enkel Stabiliteit',
    },

    // ─── Exercise Translations (keyed by exercise ID) ───────────────────────
    exercises: {
      goblet_squat: {
        name: 'Dumbbell Goblet Squat',
        purpose: 'Aufbau van basiskracht in de benen, betere heupbeweeglijkheid en correcte squattechniek voor het springen.',
        execution: 'Houd een dumbbell verticaal voor de borst. Zak neer totdat de dijen parallel aan de vloer zijn. Druk explosief omhoog via de hielen.',
      },
      bulgarian_split_squat: {
        name: 'Bulgaarse Split Squat',
        purpose: 'Corrigeert krachtsverschillen tussen beide benen; zware nadruk op stabilisatie op één been en evenwicht.',
        execution: 'Zet je achterbeen op een stoel of kist. Houd dumbbells zijwaarts. Zak neer totdat de voorste dij parallel aan de grond is.',
      },
      rdl: {
        name: 'Dumbbell Romanian Deadlift (RDL)',
        purpose: 'Versterkt de achterste ketenspieren voor explosieve heupextensie tijdens de sprong en afremming bij de landing.',
        execution: 'Scharnieren bij de heupen met licht gebogen knieën, dumbbells langs de schenen naar beneden. Knijp de bilspieren samen om terug omhoog te komen.',
      },
      dumbbell_squat_jump: {
        name: 'Dumbbell Squat Jumps',
        purpose: 'Combineert kracht en explosieve kracht; verbetert de snelheid van krachtsontwikkeling onder lichte weerstand.',
        execution: 'Houd lichte dumbbells zijwaarts. Maak een snelle kwart squat en spring verticaal omhoog. Land zacht, absorbeer de kracht en reset direct.',
      },
      approach_box_jump: {
        name: 'Aanloopsprongen op Kist',
        purpose: 'De meest sportspecifieke springtraining. Kopieert de exacte aanloopbeweging en armzwaai timing van volleybal.',
        execution: 'Doe een klassieke 3-staps volleybaalaanloop (Links-Rechts-Links voor rechtse spikers) en spring op een kist van 30-50 cm. Stap voorzichtig naar beneden.',
      },
      tuck_jumps: {
        name: 'Tuck Jumps',
        purpose: 'Verbetert reactieve springkracht en traint snelle heupbuiging, essentieel voor hang time in de lucht.',
        execution: 'Spring verticaal omhoog en trek de knieën snel naar de borst. Land zacht en spring direct door met minimaal grondcontact.',
      },
      single_leg_calf_raise: {
        name: 'Eénbeens Kuitspieroefening',
        purpose: 'Verhoogt de plantaire kracht in de enkel voor de kritische laatste duwfase van het verticale springen.',
        execution: 'Houd een dumbbell vast, sta op één been op een verhoogde rand. Laat de hiel zakken, druk dan maximaal omhoog op de tenen.',
      },
      dumbbell_shoulder_press: {
        name: 'Dumbbell Schouderpers',
        purpose: 'Bouwt basissterkte in de schouder voor stabiele spikaanvallen en blokkeren.',
        execution: 'Zit of sta met een actieve core. Duw dumbbells van schouderhoogte naar volledig gestrekte armen boven het hoofd. Controleer de neerwaartse beweging.',
      },
      explosive_pushups: {
        name: 'Explosieve Push-Ups',
        purpose: 'Ontwikkelt snelle spiervezels in borst en schouder voor hoge armzwaaisnelheid.',
        execution: 'Laat de borst naar de vloer zakken, druk dan met maximale kracht omhoog zodat de handen van de vloer komen.',
      },
      bent_over_rows: {
        name: 'Voorovergebogen Dumbbell Roeien',
        purpose: 'Biedt essentieel tegengewicht aan spikaanvallen; vertraagt de armzwaai veilig en stabiliseert het schouderblad.',
        execution: 'Knik voorover met een platte, neutrale rug. Trek dumbbells naar de heupholte en knijp de schouderbladen stevig samen.',
      },
      dead_bug: {
        name: 'Dead Bug',
        purpose: 'Verbetert anti-extensie kernstabiliteit en voorkomt gevaarlijke hyperextensie van de onderrug tijdens de spikaanval.',
        execution: 'Lig op je rug met armen en benen omhoog. Laat de tegenovergestelde arm en het been langzaam naar de vloer zakken zonder de onderrug te laten buigen.',
      },
      forearm_plank: {
        name: 'Onderarm Plank',
        purpose: 'Bouwt isometrisch kernuithoudingsvermogen voor betere krachtsoverdracht van onderlichaam naar slaande arm.',
        execution: 'Steun op onderarmen en tenen, houd een rechte lijn van hoofd tot hielen. Adem rustig door.',
      },
      skater_jumps: {
        name: 'Schaatsersprongen',
        purpose: 'Toptraining voor laterale kracht, heupstabiliteit en remmingskracht op één been.',
        execution: 'Spring zijwaarts van het rechter naar het linkerbeen, land diep in een gedeeltelijke squat. Stabiliseer even, spring dan terug.',
      },
      lateral_hurdle_hops: {
        name: 'Laterale Hordesprongen',
        purpose: 'Traint extreem snelle grondcontacttijden en verandering van richting.',
        execution: 'Zet kleine obstakels op een rij. Houd voeten samen en stuit zo snel mogelijk lateraal over de obstakels zonder balans te verliezen.',
      },
      t_cone_drill: {
        name: 'T-Kegel Behendigheidsdrill',
        purpose: 'Oefent snelle overgangen tussen sprinten, defensief schuiffelen en achteruitlopen.',
        execution: 'Sprint 10m naar de middelste kegel, schuifel 5m links, 10m rechts, 5m links terug naar midden, dan achterwaarts naar de start.',
      },
      block_jump_shuffle: {
        name: 'Bloksprong naar Lateraal Schuifelen',
        purpose: 'Kopieert perfect de bewegingsvereisten van een middenblokkeerder langs het net tijdens een rally.',
        execution: 'Doe een maximale verticale bloksprong. Land direct en schuifel twee stappen naar rechts, spring dan opnieuw. Herhaal naar links.',
      },
      side_lying_external_rotation: {
        name: 'Zijliggend Externe Rotatie',
        purpose: 'Isoleert en versterkt de externe schouderdraaiende spieren om spikbewegingen te compenseren en impingement te voorkomen.',
        execution: 'Lig op zijde. Houd werkelleboog tegen de ribben op 90 graden. Roteer de dumbbell gecontroleerd omhoog naar het plafond.',
      },
      side_lying_flexion: {
        name: 'Zijliggend Schouderflexie',
        purpose: 'Versterkt de rotatorenmanchet via een veilige bewegingsboog, bouwt uithoudingsvermogen in de stabilisators op.',
        execution: 'Lig op zijde. Houd de arm volledig gestrekt en til de dumbbell in een boog voor het lichaam omhoog.',
      },
      prone_ytw: {
        name: 'Prone Y-T-W Heffingen',
        purpose: 'Vestigt cruciale schouderblad terugtrekking en -neerdrukking, corrigeert de stand van aanvallers.',
        execution: 'Lig op je buik. Hef gestrekte armen in een "Y" vorm, knijp de bladen samen. Herhaal voor "T" en "W" armposities.',
      },
      pushup_plus: {
        name: 'Push-Up Plus',
        purpose: 'Voorkomt schouderbladvleugeling; essentieel voor gezonde opwaartse rotatie van het schouderblad tijdens overhead bewegingen.',
        execution: 'Beweeg omhoog naar de bovenpositie van een pushup. Duw de vloer verder weg, actief de bovenrug afrondend om de schouderbladen uit elkaar te spreiden.',
      },
      full_can_raise: {
        name: 'Full Can Heffing (Supraspinatus)',
        purpose: 'Activeert de bovenste rotatorenmanchetspier die armontvoering initieert en de bovenarmkop centreert.',
        execution: 'Sta rechtop. Hef dumbbells zijwaarts onder een hoek van 45 graden (in het scapulaire vlak) met duimen omhoog, stop op schouderhoogte.',
      },
      single_leg_rdl: {
        name: 'Eénbeens RDL',
        purpose: 'Ontwikkelt enorme excentrische kniebuiger kracht voor snelle afremming en daagt enkel proprioceptie uit.',
        execution: 'Sta op één been. Knik bij de heup, strek het vrije been achteruit als tegengewicht. Houd een platte rug. Knijp bilspieren samen om terug te komen.',
      },
      single_leg_wall_sit: {
        name: 'Eénbeens Muurzit',
        purpose: 'Isometrische belasting van de kniepees; klinisch bewezen effectief voor het behandelen en voorkomen van springerkniepijn.',
        execution: 'Zit tegen een muur met heupen en knieën beide op 90 graden. Strek één been recht vooruit. Houd de isometrische positie.',
      },
      glute_bridges: {
        name: 'Bilbrug',
        purpose: 'Isoleert bilspieractivering, zorgt ervoor dat de heupen de landingskrachten opvangen in plaats van de kwetsbare knieën.',
        execution: 'Lig op je rug met gebogen knieën en voeten plat op de grond. Leg een dumbbell op het bekken indien gewenst. Druk heupen via de hielen omhoog.',
      },
      broad_jump_stabilize: {
        name: 'Versprongstabilisatie',
        purpose: 'Leert krachtabsorptie en versterkt correcte drievoudige-flexie landingsmechanica om valgusinstorting te voorkomen.',
        execution: 'Spring horizontaal voorwaarts. Land zacht met heupen naar achteren. Bevriezer de landingspositie 2 volle seconden, knieën mogen niet naar binnen zakken.',
      },
      ankle_sup_pro: {
        name: 'Enkel Supinatie en Pronatie',
        purpose: 'Versterkt de laterale en mediale enkelligamenten, verhoogt drastisch de weerstand tegen verstuikingen.',
        execution: 'Sta op blote voeten. Rol langzaam naar buiten op de buitenranden van de voeten (supinatie), dan naar binnen op de binnenranden (pronatie).',
      },
      barbell_back_squat: {
        name: 'Barbell Back Squat',
        purpose: 'Bouwt fundamentele structurele kracht op die vereist is voor maximale explosiviteit en verticale verplaatsing.',
        execution: 'Sta met voeten iets wijder dan schouderbreedte. Zak met de heupen naar achteren alsof je op een stoel gaat zitten. Druk explosief omhoog.',
      },
      split_squat_jumps: {
        name: 'Split Squat Sprongen',
        purpose: 'Vereist hoge unilaterale stabilisatie bij de landing, bootst uit balans geraakte veldreddingen na.',
        execution: 'Begin in een lunge (uitvalspas). Spring explosief omhoog en wissel in de lucht van been. Land zachtjes en herhaal direct.',
      },
      seated_box_jumps: {
        name: 'Zittende Kistsprongen',
        purpose: 'Ontwikkelt pure, opstartende verticale kracht vanuit een statische positie, zonder neerwaarts momentum of elastische energie.',
        execution: 'Zit op een kist. Spring explosief omhoog op een hogere kist recht voor je. Stap voorzichtig naar beneden.',
      },
      broad_jumps: {
        name: 'Verspringen (Broad Jumps)',
        purpose: 'Ontwikkelt horizontale krachtsapplicatie, mechanisch essentieel om de voorwaartse asnelheid van de aanloop om te zetten in verticale lift.',
        execution: 'Voer opeenvolgende maximale voorwaartse sprongen uit. Focus op explosieve heupextensie en een stabiele landing.',
      },
      jump_rope_intervals: {
        name: 'Touwtjespringen Intervallen',
        purpose: 'Bouwt uithoudingsvermogen in snelle spiervezels en versterkt enkelstijfheid die nodig is voor krachtsoverdracht bij grote sprongen.',
        execution: 'Repetitief springen met lage amplitude. Houd de enkels stijf en kaats snel terug vanaf de bal van de voet.',
      },
      lateral_scissor_steps: {
        name: 'Laterale Schaarpassen',
        purpose: 'Verbetert voetsnelheid, laterale neuromusculaire reactietijd en stijfheid van ondrbeen.',
        execution: 'Sluit zijdelings aan bij bv. een loopladder. Kruis-stap elke voet snel in en uit terwijl je zijwaarts beweegt. Blijf op de ballen van je voeten.',
      },
      court_speed_drill: {
        name: 'Veldsnelheid (5-Kegels)',
        purpose: 'Ontwikkelt sportspecifiek ruimtelijk inzicht en dwingt optimale net-gerichte verdedigingstechnieken af.',
        execution: 'Sprint, schuifel of loop achteruit van het midden naar elke hoek in een willekeurig patroon. Houd altijd je torso recht naar het net.',
      },
      visual_command_chopping: {
        name: 'Visuele Commando Dribbel',
        purpose: 'Richt zich exclusief op het alactisch energiesysteem en maximaliseert cognitieve verwerkingssnelheid zonder vermoeidheid.',
        execution: 'Dribbel snel ter plaatse (voeten trippelen). Reageer op visuele signalen (armen omhoog = sprint, omlaag = achteruit). Maximaal 8-10 seconden.',
      },
      partner_drop_drill: {
        name: 'Partner Val Reflex',
        purpose: 'Verkleint de reactietijd en forceert snellere neurale prikkels voor verdedigend graven (diggen).',
        execution: 'Neem een lage defensieve houding aan. Een partner laat willekeurig een bal vallen. Laat je zwaartepunt snel zakken om hem te vangen voor de tweede bots.',
      },
      wall_dig_reaction: {
        name: 'Muur Dig Reactie',
        purpose: 'Daagt de visuele tracking uit van een onvoorspelbare rebound voor betere verdedigende passes.',
        execution: 'Een partner slaat van achter jou een bal tegen een muur. Volg visueel de terugslag en voer een technisch correcte dig uit.',
      },
      lateral_pattern_hops: {
        name: 'Laterale & Patroon Sprongetjes',
        purpose: 'Bouwt multi-planaire enkelstijfheid en laterale explosieve capaciteit op.',
        execution: 'Spring zo snel en stijf mogelijk zijwaarts, van voor naar achteren en schuin in de hoeken.',
      },
      med_ball_rotational_throws: {
        name: 'Med Ball Rotatieworpen',
        purpose: 'Overbelast expliciet de rotatiemechanica en dwarskracht vereist voor het slaan (spiken).',
        execution: 'Sta loodrecht op een stevige muur. Roteer explosief door de heupen en torso om de medicijnbal tegen de muur te werpen.',
      },
      half_kneeling_landmine_press: {
        name: 'Halfknielende Landmine Pers',
        purpose: 'Ontwikkelt unilaterale perskracht boven het hoofd terwijl de core maximaal moet stabiliseren om zijwaartse valing te vermijden.',
        execution: 'Kniel op één been. Druk de halter (of dumbbell) voorwaarts en omhoog vanaf de schouder. Controleer de terugweg.',
      },
      dumbbell_pullovers: {
        name: 'Dumbbell Pullovers',
        purpose: 'Bouwt de lattisimus dorsi, de belangrijkste snelheidsspier van de neerwaartse armzwaai.',
        execution: 'Lig loodrecht over een bankje. Laat een dumbbell met licht gebogen ellebogen achter het hoofd zakken, en trek hem agressief terug over de borst.',
      },
      cable_thoracic_rotational_row: {
        name: 'Thoracale Rotatie Roeien',
        purpose: 'Versterkt de trekkende mechanismen van de achterkant, cruciaal voor de snelle armterugtrekking (cocking).',
        execution: 'Trek een weerstandsband (of kabel) schuin over het lichaam terwijl je actief de borstwervelkolom roteert. Knijp de schouderbladen samen.',
      },
      strict_planks: {
        name: 'Strikte Planken',
        purpose: 'Anti-extensie mechanisme. Door de bilspieren te spannen ontstaat een achterwaartse bekkenkanteling, wat de wervelkolom veilig vergrendelt.',
        execution: 'Steun op onderarmen en tenen. Span de billen en buikspieren hard samen. Houd de positie vast zonder door te zakken in je rug.',
      },
      stability_ball_stir_the_pot: {
        name: 'Stir the Pot (Dynamische Plank)',
        purpose: 'Dynamische anti-extensie. Weerstaat de neiging van de heupen om zijwaarts te zwaaien of te zakken tijdens armbewegingen.',
        execution: 'Leg je onderarmen op een fitnessbal in plankpositie. Draai kleine, gecontroleerde cirkels met de ellebogen terwijl de core muurvast blijft.',
      },
      russian_twists: {
        name: 'Russian Twists',
        purpose: 'Conditioneert de interne en externe schuine buikspieren voor de repetitieve rotatiebelasting bij het slaan.',
        execution: 'Balanceer op je zitbotjes met een lichte leuning naar achteren en een aangespannen core. Roteer de romp van zij naar zij.',
      },
      bird_dogs: {
        name: 'Bird Dogs (Vogellhonden)',
        purpose: 'Bouwt diepe spinale stabilisatorkracht op via anti-rotatie en activering van de achterste keten.',
        execution: 'Ga op handen en knieën. Strek gelijktijdig de tegenovergestelde arm en been evenwijdig aan de vloer zonder de heupen over te hellen.',
      },
      serratus_wall_slides: {
        name: 'Serratus Muur Slides',
        purpose: 'Verplichte activering van de serratus anterior om opwaartse rotatie van het schouderblad te garanderen en impingement te voorkomen.',
        execution: 'Sta met het gezicht naar een muur, onderarmen ertegen. Druk de armen in de muur (rekken over de borstkast) en glijd ze langzaam omhoog.',
      },
      floor_angels: {
        name: 'Vloer Engelen (Floor Angels)',
        purpose: 'Deactiveert de overactieve borstspieren, waardoor uitstekende isolatie van de schouderbladstabilisatoren (prehab) mogelijk wordt.',
        execution: 'Ligt op je rug, armen in een "L"-vorm op de grond. Glijd de armen naar boven het hoofd zonder de polsen of ellebogen los te maken van de vloer.',
      },
      diagonal_shoulder_walks: {
        name: 'Diagonale Schouder Wandeling',
        purpose: 'Versterkt de serratus in functionele synergie met de voorste schouderkoppen en rotatorenmanchet.',
        execution: 'Sta rechtop met lichte dumbbells diagonaal aan de zijkant geduwd. Til ze zonder veel zwaai langzaam op tot schouderhoogte.',
      },
      pendulum_swings: {
        name: 'Pendel Zwaaien',
        purpose: 'Fase 1 Rehab: Behoudt de gewrichtsruimte en bevordert bloedtoevoer (genezing) zonder een zware spiercontractie.',
        execution: 'Buig voorover en laat de geblesseerde arm compleet slap hangen. Gebruik de rompstam om kleine draaibewegingen in de arm te forceren.',
      },
      cane_assisted_rom: {
        name: 'Stok Geassisteerde ROM',
        purpose: 'Fase 1 Rehab: Herstelt passief de verloren bewegingsvrijheid in het gewricht op veilige wijze.',
        execution: 'Lig op de rug en houd een lichte stok vast. Gebruik je ongeschonden arm om zachtjes je geblesseerde arm over of naast je hoofd te duwen.',
      },
      band_internal_rotation: {
        name: 'Dynamische Interne Rotatie (Elastiek)',
        purpose: 'Isoleert en versterkt de interne schouderrotatoren (in waaiervorm) voor gebalanceerde gewrichtsstabiliteit.',
        execution: 'Bind een weerstandsband op ellebooghoogte. Houd de elleboog tegen de ribben vastgespeld en haal de band binnenwaarts over de maag.',
      },
      shoulder_decelerators: {
        name: 'Schouder Decelerators (Excentrisch)',
        purpose: 'Traint het bindweefsel wezenlijk om de massieve afremmingskrachten ontketend na een aanval feilloos te absorberen.',
        execution: 'Lig zijdelings en laat een zware dumbbell excentrisch in externe rotatie langzaam wegzakken tegen een pijnlijke langzame (5 sec) tel.',
      },
      side_plank_external_rotation: {
        name: 'Zijplank met Externe Rotatie',
        purpose: 'Fase 3 Rehab: Belast de core drastisch en dwingt de rotatorenmanchet zich in te spannen onder hoge systemische spanning.',
        execution: 'Neem een volledige zijplank-positie aan. Roteer met de vrije arm (mbv een band/gewicht) gecontroleerd naar buiten terwijl de kern stijf blijft.',
      },
      ankle_alphabet: {
        name: 'Enkel Alfabet',
        purpose: 'Fase 1 Enkel Rehab: Behoudt optimale gewrichtsmobiliteit en werkt als een spierpomp om zwellingen binnen het ligament op te ruimen.',
        execution: 'Zit met het verstuikte been omhoog. Traceer de volledige vorm van alle ABC letters in de lucht door exclusief te sturen met je grote teen.',
      },
      towel_scrunches: {
        name: 'Handdoek Grijpen',
        purpose: 'Versterkt de spiertjes aan de onderkant van de voetboog; cruciaal voor proprioceptie herstel na inversietrauma\'s.',
        execution: 'Zit op blote voeten en gebruik de tenen om een platte handdoek in de rimpels te grijpen over een gladde ondergrond (trek hem naar je toe).',
      },
      seated_calf_stretches: {
        name: 'Zittende Pees & Kuitrekkingen',
        purpose: 'Zorgt voor plastische deformatie (verlenging) van dikke kuitweefsels om het dorsaalflexiebereik veilig te herstellen.',
        execution: 'Zit op de grond met knieën en benen volledig gestrekt, sla een handdoekleis om de bal van je voet en trek hevig voor 15 tot 30 seconden achtereen.',
      },
      four_way_band_ankle: {
        name: '4-Benade Band Enkelkracht',
        purpose: 'Fase 2 Enkel Rehab: Bouwt isotonisch uithoudingsvermogen op in alle passieve stabiliserende structuren en botbanden.',
        execution: 'Veranker een kleine rekband rond je tenenvoet; lever hierin tegendruk door 4 kanten uit te drukken (rugwaarts optillen, strekken, inwaarts, uitwaarts).',
      },
      balance_progression: {
        name: 'Balans Progressie (Proprioceptie)',
        purpose: 'Fase 3 Enkel Rehab: Herscholt beschadigde zenuwcellen in het enkelkapsel om voetposities terug aan te wijzen, ter voorkoming van toekomstige snelle omslagen.',
        execution: 'Strikte 1-benige standen. Sluit ogen als het je te handig wordt. Ga gradueel nadien over in wankelere bodems of activeer plotse hand/arm klappen.',
      },
      single_leg_knee_extension_isometrics: {
        name: '1-Benige Knie Extensie Isometrie',
        purpose: 'Stage 1 Patellaere Tendinopathie: Langdurige zware isometrie veroorzaakt immense verdovende zenuweffecten direct in de knie en stilt peesontsteking snel.',
        execution: 'Trek zittend een stevig verankerde elastiek voorwaarts, houd hiervoor je knie vast tussen de 30 ten 60 hoekgraden gefixeerd. Ontspan nimmer over de tijd duur.',
      },
    },
  },

  // ─── ENGLISH ──────────────────────────────────────────────────────────────
  en: {
    tabs: {
      home: 'Home',
      workout: 'Workout',
      stats: 'Stats',
      profile: 'Profile',
    },

    dashboard: {
      brand: 'Courtside',
      greeting: (name) => `Hello, ${name || 'Athlete'}.`,
      focus: 'TRAINING FOCUS',
      nextDrill: 'Next Drill',
      phase: (id) => `Phase ${id}`,
      hitCourt: 'Hit The Court',
      sessions: 'Sessions',
      movements: 'Movements',
      mobilityLabel: 'Mobility',
      wellnessLabel: 'Wellness Age',
      aiCoach: 'AI Coach Analysis',
      activityLog: 'Activity Log',
      daysPerWeek: (d) => `${d}d/wk`,
      minutesPerDay: (m) => `${m}m`,
      goalLabels: {
        vertical: 'Max Vertical Jump',
        injury: 'Injury Prevention',
        agility: 'Court Agility',
      },
      aiMessages: {
        novice: 'As a novice, focus on motor control and tendon stiffness. Don\'t rush the reps.',
        advanced: 'Advanced profile active. Focus on maximum explosive intent on the concentric phase of every rep.',
        intermediate: 'Intermediate load verified. Prioritize form but begin pushing the intensity on plyometrics.',
        goalSuffix: (goal) => ` Your target is ${goal}.`,
        shoulderWarning: ' Proceed with caution on upper body exercises.',
      },
    },

    workout: {
      header: 'Current Session',
      phase: (id) => `Phase ${id} Drills`,
      setsReps: (sets, reps) => `${sets} Sets × ${reps}`,
      newDrillTitle: 'New Drill Detected',
      newDrillBody: (name, reps) => `You have never logged ${name}. Let's find your baseline weight for ${reps} reps.`,
      skipCalibrate: 'Skip Calibrate',
      setBaseline: 'Set Baseline',
      logLoad: (unit) => `Log Load (${unit})`,
      returnLocker: 'Return to Locker Room',
      restTitle: 'Rest Session',
      restSubtitle: 'Recovery Phase',
      assessmentPrompt: 'You must complete the Athlete Assessment before hitting the court.',
    },

    profile: {
      header: 'Settings',
      title: 'Athlete Profile',
      save: 'Save',
      displayName: 'Display Name',
      baseMetrics: 'Base Metrics',
      age: 'Age',
      height: 'Height',
      weight: 'Weight',
      units: 'Units',
      metric: 'Metric',
      imperial: 'Imperial',
      trainingFocus: 'Training Primary Focus',
      trainingFocusOptions: {
        vertical: 'Max Vertical Jump',
        injury: 'Injury Prehabilitation',
        agility: 'Court Agility',
      },
      experience: 'Training Experience',
      levels: {
        novice: 'Novice',
        intermediate: 'Intermediate',
        advanced: 'Advanced',
      },
      schedule: 'Training Schedule',
      daysPerWeek: 'Days / Week',
      timePerSession: 'Time / Session',
      language: 'Language',
      saved: 'Profile Updated',
      savedMsg: 'Your training parameters have been saved.',
    },

    telemetry: {
      header: 'Performance',
      title: 'Statistics',
      sessions: 'Sessions',
      phase: 'Phase',
      volume: 'Volume',
      maxLoad: 'Max Load',
      reset: 'Reset Profile',
      resetConfirm: 'Are you sure you want to wipe all data?',
      resetYes: 'Yes, Wipe All',
      resetNo: 'Cancel',
    },

    onboarding: {
      step: (current, total) => `STEP ${current}/${total}`,
      step1Title: 'Initialize your\nAthlete Profile.',
      step2Title: 'Input Base\nMetrics.',
      step3Title: 'Set Training\nParameters.',
      displayNameLabel: 'Display Name / Alias',
      displayNamePlaceholder: 'e.g. Volleyball Phenom',
      unitsLabel: 'System Units',
      equipmentLabel: 'Equipment Available',
      bodyweightOnly: 'Bodyweight Only',
      dumbbellsAccess: 'Dumbbells Access',
      primaryFocusLabel: 'Primary Focus',
      experienceLabel: 'Training Experience',
      daysPerWeekLabel: 'Days / Week',
      timePerSessionLabel: 'Time / Session',
      back: 'Back',
      continue: 'Continue',
      startAssessment: 'Start Assessment',
      focusOptions: {
        vertical: { label: 'Max Vertical Jump', desc: 'Prioritize explosiveness and height' },
        injury: { label: 'Injury Prehabilitation', desc: 'Joint resilience and longevity' },
        agility: { label: 'Court Agility', desc: 'Lateral quickness and reaction' },
      },
    },

    modal: {
      purpose: 'Purpose',
      execution: 'Execution',
      muscles: 'Muscles',
      impactLevel: 'Impact Level',
      impactLabels: { low: 'Low', medium: 'Medium', high: 'High' },
      close: 'Close',
      watchVideo: 'Watch Video',
    },

    // Routines (Warmup / Cooldown / Stretching)
    routine: {
      warmup: 'Warm-Up',
      cooldown: 'Cooldown & Stretching',
      stretching: 'Mobility Work',
      optional: 'Optional',
      tapToExpand: 'Tap to expand',
    },

    categories: {
      vertical_jump: 'Vertical Jump Power',
      attacking_mechanics: 'Attacking Power',
      lateral_agility: 'Lateral Agility',
      shoulder_prehab: 'Shoulder Prehab',
      knee_ankle_stability: 'Knee & Ankle Resilience',
    },

    // English exercise names/text match the existing exercises.js fields directly
    exercises: {}, // falls back to exercises.js values
  },
};
