// ─── VolleyTrain Collectible Items Catalog ─────────────────────────────────
// All items that can be obtained by opening Volleybal Kisten (Volleyball Chests).
// Rarity weights: Common 60%, Rare 25%, Epic 12%, Legendary 3%

export const RARITIES = {
  common:     { id: 'common',     label: { nl: 'Gewoon',       en: 'Common'      }, color: '#94A3B8', glow: '#CBD5E1', weight: 60 },
  rare:       { id: 'rare',       label: { nl: 'Zeldzaam',     en: 'Rare'        }, color: '#3B82F6', glow: '#93C5FD', weight: 25 },
  epic:       { id: 'epic',       label: { nl: 'Episch',       en: 'Epic'        }, color: '#8B5CF6', glow: '#C4B5FD', weight: 12 },
  legendary:  { id: 'legendary',  label: { nl: 'Legendarisch', en: 'Legendary'   }, color: '#F59E0B', glow: '#FCD34D', weight: 3  },
};

// ─── PLAYERS ──────────────────────────────────────────────────────────────────
// Each player has a position, jersey number, and emoji avatar
export const PLAYER_ITEMS = [
  // Common
  { id: 'p_libero_standard',    category: 'player', rarity: 'common',    emoji: '🧤', name: { nl: 'De Libero',     en: 'The Libero'       }, desc: { nl: 'Verdedigingsspecialist', en: 'Defense specialist' }, number: 1 },
  { id: 'p_setter_standard',    category: 'player', rarity: 'common',    emoji: '🤝', name: { nl: 'De Setter',     en: 'The Setter'        }, desc: { nl: 'Spelverdeler',           en: 'Playmaker'          }, number: 2 },
  { id: 'p_outside_standard',   category: 'player', rarity: 'common',    emoji: '💪', name: { nl: 'De Hoekspeler', en: 'The Outside Hitter' }, desc: { nl: 'Aanvaller van buiten',   en: 'Outside attacker'   }, number: 7 },
  { id: 'p_middle_standard',    category: 'player', rarity: 'common',    emoji: '🏛️', name: { nl: 'De Middenspeler', en: 'The Middle Blocker' }, desc: { nl: 'Blokspecialist',        en: 'Block specialist'   }, number: 4 },
  // Rare
  { id: 'p_opposite_rare',      category: 'player', rarity: 'rare',      emoji: '🎯', name: { nl: 'De Diagonaal',  en: 'The Opposite'      }, desc: { nl: 'Krachtige aanvaller',   en: 'Powerful attacker'  }, number: 9 },
  { id: 'p_setter_rare',        category: 'player', rarity: 'rare',      emoji: '🧠', name: { nl: 'De Tacticus',   en: 'The Tactician'     }, desc: { nl: 'Slimste setter',         en: 'Smartest setter'    }, number: 5 },
  { id: 'p_libero_rare',        category: 'player', rarity: 'rare',      emoji: '⚡', name: { nl: 'Vliegende Dig', en: 'Flying Dig'        }, desc: { nl: 'Lightningsnelle libero', en: 'Lightning libero'   }, number: 11 },
  // Epic
  { id: 'p_ace_epic',           category: 'player', rarity: 'epic',      emoji: '🌟', name: { nl: 'Het Ster-Talent', en: 'The Star Talent'  }, desc: { nl: 'Topspeler van de regio', en: 'Regional top player' }, number: 10 },
  { id: 'p_captain_epic',       category: 'player', rarity: 'epic',      emoji: '🏆', name: { nl: 'De Kapitein',   en: 'The Captain'       }, desc: { nl: 'Leider met ervaring',   en: 'Experienced leader' }, number: 3 },
  // Legendary
  { id: 'p_legend_legendary',   category: 'player', rarity: 'legendary', emoji: '👑', name: { nl: 'De Legende',    en: 'The Legend'        }, desc: { nl: 'Onsterfelijke volleybalspeler', en: 'Immortal volleyball player' }, number: 99 },
  { id: 'p_mvp_legendary',      category: 'player', rarity: 'legendary', emoji: '💎', name: { nl: 'De MVP',         en: 'The MVP'           }, desc: { nl: 'Meest Waardevolle Speler', en: 'Most Valuable Player' }, number: 77 },
];

// ─── BALL SKINS ────────────────────────────────────────────────────────────────
export const BALL_ITEMS = [
  // Common
  { id: 'ball_classic',         category: 'ball', rarity: 'common',    emoji: '🏐', name: { nl: 'Klassieke Bal',    en: 'Classic Ball'     }, desc: { nl: 'De standaard trainingsbal', en: 'Standard training ball' } },
  { id: 'ball_beach',           category: 'ball', rarity: 'common',    emoji: '🌊', name: { nl: 'Strandbal',         en: 'Beach Ball'        }, desc: { nl: 'Zand op je vingers', en: 'Sand on your fingers' } },
  // Rare
  { id: 'ball_flame',           category: 'ball', rarity: 'rare',      emoji: '🔥', name: { nl: 'Vuurbal',           en: 'Flame Ball'        }, desc: { nl: 'Spik \'em heet', en: 'Spike it hot' } },
  { id: 'ball_ice',             category: 'ball', rarity: 'rare',      emoji: '❄️', name: { nl: 'IJsbal',            en: 'Ice Ball'          }, desc: { nl: 'Bevriezend snel', en: 'Freezing fast' } },
  { id: 'ball_neon',            category: 'ball', rarity: 'rare',      emoji: '💚', name: { nl: 'Neonbal',           en: 'Neon Ball'         }, desc: { nl: 'Gloeit in het donker', en: 'Glows in the dark' } },
  // Epic
  { id: 'ball_galaxy',          category: 'ball', rarity: 'epic',      emoji: '🌌', name: { nl: 'Melkwegbal',        en: 'Galaxy Ball'       }, desc: { nl: 'Direct uit de kosmos', en: 'Straight from the cosmos' } },
  { id: 'ball_lightning',       category: 'ball', rarity: 'epic',      emoji: '⚡', name: { nl: 'Bliksembal',        en: 'Lightning Ball'    }, desc: { nl: 'Snelste serve ooit', en: 'Fastest serve ever' } },
  // Legendary
  { id: 'ball_gold',            category: 'ball', rarity: 'legendary', emoji: '✨', name: { nl: 'Gouden Bal',        en: 'Golden Ball'       }, desc: { nl: 'Puur goud, puur klasse', en: 'Pure gold, pure class' } },
  { id: 'ball_rainbow',         category: 'ball', rarity: 'legendary', emoji: '🌈', name: { nl: 'Regenboogbal',      en: 'Rainbow Ball'      }, desc: { nl: 'Elke kleur van de zege', en: 'Every color of victory' } },
];

// ─── COURT SKINS ───────────────────────────────────────────────────────────────
export const COURT_ITEMS = [
  // Common
  { id: 'court_standard',       category: 'court', rarity: 'common',    emoji: '📐', name: { nl: 'Standaard Veld',   en: 'Standard Court'   }, desc: { nl: 'Klassiek houten veld', en: 'Classic wooden court' } },
  { id: 'court_outdoor',        category: 'court', rarity: 'common',    emoji: '🌿', name: { nl: 'Buitenbaan',        en: 'Outdoor Court'     }, desc: { nl: 'Spelen in de buitenlucht', en: 'Playing in the open air' } },
  // Rare
  { id: 'court_beach',          category: 'court', rarity: 'rare',      emoji: '🏖️', name: { nl: 'Strandveld',        en: 'Beach Court'       }, desc: { nl: 'Zand tussen de lijnen', en: 'Sand between the lines' } },
  { id: 'court_night',          category: 'court', rarity: 'rare',      emoji: '🌙', name: { nl: 'Nachtveld',          en: 'Night Court'       }, desc: { nl: 'Spelen onder de sterren', en: 'Playing under the stars' } },
  // Epic
  { id: 'court_led',            category: 'court', rarity: 'epic',      emoji: '💡', name: { nl: 'LED Veld',           en: 'LED Court'         }, desc: { nl: 'Gloeiende lijnen', en: 'Glowing lines' } },
  { id: 'court_checkerboard',   category: 'court', rarity: 'epic',      emoji: '♟️', name: { nl: 'Schaakbordveld',     en: 'Checkerboard Court' }, desc: { nl: 'Schaken met de tegenstander', en: 'Chess with the opponent' } },
  // Legendary
  { id: 'court_olympic',        category: 'court', rarity: 'legendary', emoji: '🏅', name: { nl: 'Olympisch Veld',     en: 'Olympic Court'     }, desc: { nl: 'Spelen voor het goud', en: 'Playing for the gold' } },
  { id: 'court_holographic',    category: 'court', rarity: 'legendary', emoji: '🔮', name: { nl: 'Holografisch Veld',  en: 'Holographic Court' }, desc: { nl: 'Echt futuristisch', en: 'Truly futuristic' } },
];

// ─── HALL SKINS ────────────────────────────────────────────────────────────────
export const HALL_ITEMS = [
  // Common
  { id: 'hall_club',            category: 'hall', rarity: 'common',    emoji: '🏫', name: { nl: 'Clubzaal',           en: 'Club Hall'         }, desc: { nl: 'Cozy lokale sporthal', en: 'Cosy local sports hall' } },
  { id: 'hall_school',          category: 'hall', rarity: 'common',    emoji: '📚', name: { nl: 'Schoolzaal',          en: 'School Gym'        }, desc: { nl: 'Klassieke gymzaal',    en: 'Classic gym hall' } },
  // Rare
  { id: 'hall_arena',           category: 'hall', rarity: 'rare',      emoji: '🏟️', name: { nl: 'Arena',              en: 'Arena'             }, desc: { nl: 'Met 5000 fans',         en: 'With 5000 fans' } },
  { id: 'hall_beach_dome',      category: 'hall', rarity: 'rare',      emoji: '⛺', name: { nl: 'Strand Dome',         en: 'Beach Dome'        }, desc: { nl: 'Koepel op het strand',  en: 'Dome on the beach' } },
  // Epic
  { id: 'hall_neon',            category: 'hall', rarity: 'epic',      emoji: '🌃', name: { nl: 'Neon Arena',          en: 'Neon Arena'        }, desc: { nl: 'Purple neon verlichting', en: 'Purple neon lighting' } },
  { id: 'hall_volcano',         category: 'hall', rarity: 'epic',      emoji: '🌋', name: { nl: 'Vulkaan Arena',       en: 'Volcano Arena'     }, desc: { nl: 'Heet als lava', en: 'Hot as lava' } },
  // Legendary
  { id: 'hall_olympic',         category: 'hall', rarity: 'legendary', emoji: '🎖️', name: { nl: 'Olympisch Stadion',   en: 'Olympic Stadium'   }, desc: { nl: 'Elke match voelt als de finale', en: 'Every match feels like the final' } },
  { id: 'hall_space',           category: 'hall', rarity: 'legendary', emoji: '🚀', name: { nl: 'Ruimtestation',        en: 'Space Station'     }, desc: { nl: 'Zero-gravity volleybal', en: 'Zero-gravity volleyball' } },
];

// ─── JERSEY SKINS ──────────────────────────────────────────────────────────────
export const JERSEY_ITEMS = [
  // Common
  { id: 'jersey_white',         category: 'jersey', rarity: 'common',   emoji: '⬜', name: { nl: 'Wit Tenue',          en: 'White Kit'         }, desc: { nl: 'Klassiek en clean',     en: 'Classic and clean' } },
  { id: 'jersey_blue',          category: 'jersey', rarity: 'common',   emoji: '🟦', name: { nl: 'Blauw Tenue',         en: 'Blue Kit'          }, desc: { nl: 'Koningsblauw',          en: 'Royal blue' } },
  { id: 'jersey_orange',        category: 'jersey', rarity: 'common',   emoji: '🟧', name: { nl: 'Oranje Tenue',        en: 'Orange Kit'        }, desc: { nl: 'Trots Nederlands',      en: 'Proudly Dutch' } },
  // Rare
  { id: 'jersey_camo',          category: 'jersey', rarity: 'rare',     emoji: '🌿', name: { nl: 'Camouflage Tenue',    en: 'Camo Kit'          }, desc: { nl: 'Je ziet ze niet aankomen', en: 'They won\'t see you coming' } },
  { id: 'jersey_stripes',       category: 'jersey', rarity: 'rare',     emoji: '〰️', name: { nl: 'Gestreept Tenue',      en: 'Striped Kit'       }, desc: { nl: 'Klassieke strepen',     en: 'Classic stripes' } },
  // Epic
  { id: 'jersey_galaxy',        category: 'jersey', rarity: 'epic',     emoji: '🌌', name: { nl: 'Melkweg Tenue',       en: 'Galaxy Kit'        }, desc: { nl: 'Sterrenstelsel print',  en: 'Galaxy print' } },
  { id: 'jersey_flame',         category: 'jersey', rarity: 'epic',     emoji: '🔥', name: { nl: 'Vuur Tenue',          en: 'Flame Kit'         }, desc: { nl: 'Spelers staan in brand', en: 'Players are on fire' } },
  // Legendary
  { id: 'jersey_gold',          category: 'jersey', rarity: 'legendary',emoji: '✨', name: { nl: 'Goud Tenue',          en: 'Gold Kit'          }, desc: { nl: 'Winnaar op het oog',    en: 'Winner at first sight' } },
  { id: 'jersey_rainbow',       category: 'jersey', rarity: 'legendary',emoji: '🌈', name: { nl: 'Regenboog Tenue',     en: 'Rainbow Kit'       }, desc: { nl: 'Alle kleuren van de overwinning', en: 'All the colors of victory' } },
];

// ─── Combined Catalog ──────────────────────────────────────────────────────────
export const ALL_ITEMS = [
  ...PLAYER_ITEMS,
  ...BALL_ITEMS,
  ...COURT_ITEMS,
  ...HALL_ITEMS,
  ...JERSEY_ITEMS,
];

export const getItemById = (id) => ALL_ITEMS.find(item => item.id === id);
