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
export const WARMTH_DECAY_PER_WEEK = 2
export const RAPPORT_EFFECT_SCALE = 0.1

export const TRUNKY_THRESHOLD = 30
export const TRUNKY_MULTIPLIER = 0.7
export const ON_FIRE_THRESHOLD = 90
export const ON_FIRE_MULTIPLIER = 1.15

export const WEEKS_PER_TRANSFER = 6

export const MONTHLY_STIPEND = 45000

// --- Difficulty & Consequences ---

// Daily spirit drain (homesickness) — base value, modified by companion rapport
export const DAILY_SPIRIT_DRAIN = 2

// Rapport above this threshold reduces spirit drain by 1
export const RAPPORT_SPIRIT_RELIEF_THRESHOLD = 7

// Language decay per week if no language activity was done
export const LANGUAGE_DECAY_PER_WEEK = 1

// Weekly mandatory expenses
export const WEEKLY_FOOD_COST = 3000
export const WEEKLY_TRANSIT_COST = 2000

// Warnings & failure
export const MAX_WARNINGS = 3
export const SPIRIT_CRISIS_THRESHOLD = 0
export const COMPANION_REPORT_OBEDIENCE_THRESHOLD = 40
export const COMPANION_REPORT_RAPPORT_THRESHOLD = 4
export const COMPANION_REPORT_CHANCE = 0.3
export const OBEDIENCE_REPORT_PENALTY = 20

// Mandatory activity trigger thresholds
export const MANDATORY_ACTIVITY_CHANCE = 0.25  // 25% chance per day of a mandatory task
export const COMPANION_DEMAND_RAPPORT_THRESHOLD = 3
export const COMPANION_DEMAND_RAPPORT_PENALTY = 3

// Member visit request expiry
export const MEMBER_REQUEST_CHANCE = 0.15
export const MEMBER_REQUEST_SPIRIT_PENALTY = 3

// Phone / Contact List
export const MAX_CALLS_PER_DAY = 2
export const CALL_WARMTH_BOOST = 1
export const CHURCH_INVITE_ATTENDANCE_BONUS = 0.2
