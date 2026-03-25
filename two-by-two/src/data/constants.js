export const INITIAL_STATS = {
  language: 8,
  spirit: 75,
  skills: 10,
  obedience: 80,
  budget: 45000,
}

export const STAT_CAPS = {
  language: { min: 0, max: 100 },
  spirit: { min: 0, max: 100 },
  skills: { min: 0, max: 100 },
  obedience: { min: 0, max: 100 },
  budget: { min: -20000, max: 100000 },
}

export const STAT_LABELS = {
  language: 'Language',
  spirit: 'Spirit',
  skills: 'Skills',
  obedience: 'Obedience',
  budget: 'Budget',
  rapport: 'Rapport',
}

export const TOTAL_WEEKS = 104
export const DAYS_PER_WEEK = 7
export const DAY_NAMES = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat', 'P-Day']
export const DAY_NAMES_EN = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'P-Day']
export const TIME_SLOTS = ['morning', 'afternoon', 'evening']
export const TIME_SLOT_LABELS = { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening' }

export const EVENT_CHANCE = 0.3
export const INVESTIGATOR_BASE_PROGRESSION = 0.3
export const WARMTH_DECAY_PER_WEEK = 1
export const RAPPORT_EFFECT_SCALE = 0.1

export const TRUNKY_THRESHOLD = 30
export const TRUNKY_MULTIPLIER = 0.7
export const ON_FIRE_THRESHOLD = 90
export const ON_FIRE_MULTIPLIER = 1.15

export const WEEKS_PER_TRANSFER = 6

export const MONTHLY_STIPEND = 45000
