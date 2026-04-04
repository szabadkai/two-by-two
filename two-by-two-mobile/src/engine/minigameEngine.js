/**
 * Minigame Engine
 * Maps minigame scores (0.0-1.0) to stat effects.
 * Handles difficulty scaling based on current stat levels.
 */

import { ACTIVITIES, PDAY_ACTIVITIES } from '../data/activities'

// Which minigame type each activity uses (mobile touch-native versions)
export const ACTIVITY_MINIGAME_MAP = {
  study_language: 'flashcards',
  teach_lesson: 'concern',
  street_contact: 'dialogue',
  companion_study: 'memory',
  service_project: 'service',
  english_class: 'wordpick',
  personal_study: 'scripture',
  member_visit: 'dialogue',
  // P-Day activities
  pday_study: 'flashcards',
  letters_home: 'scripture',
  explore_city: null,
  laundry: null,
  shopping: null,
  sports: null,
  companion_activity: 'memory',
  // Visit investigator
  visit_investigator: 'concern',
  // Shopping activities
  buy_food: null,
  buy_peanut_butter: null,
  buy_books: null,
  buy_clothes: null,
}

/**
 * Get difficulty level (0-4) based on relevant stat
 */
export function getDifficulty(activityId, stats) {
  const statMap = {
    study_language: 'language',
    pday_study: 'language',
    teach_lesson: 'skills',
    street_contact: 'skills',
    companion_study: 'skills',
    service_project: 'skills',
    english_class: 'skills',
    personal_study: 'spirit',
    member_visit: 'language',
    letters_home: 'spirit',
    companion_activity: 'skills',
  }

  const stat = statMap[activityId] || 'skills'
  const value = stats[stat] || 0

  if (value < 20) return 0
  if (value < 40) return 1
  if (value < 60) return 2
  if (value < 80) return 3
  return 4
}

/**
 * Scale activity effects by minigame score.
 * Score 1.0 = max range, 0.0 = min range (or slightly negative for total failure).
 * Score < 0.2 = "fumble" — effects can go negative.
 */
export function scaleEffects(activityId, score, isPDay = false) {
  const pool = isPDay ? PDAY_ACTIVITIES : ACTIVITIES
  const activity = pool[activityId]
  if (!activity) return { effects: {}, rapportDelta: 0 }

  const effects = {}

  for (const [stat, [min, max]] of Object.entries(activity.effects)) {
    if (score < 0.2) {
      // Fumble: negative effect
      effects[stat] = Math.round(min - Math.abs(max) * 0.5)
    } else {
      // Interpolate between min and max based on score
      effects[stat] = Math.round(min + (max - min) * score)
    }
  }

  // Rapport effect
  let rapportDelta = 0
  if (activity.rapportEffect) {
    const [rMin, rMax] = activity.rapportEffect
    rapportDelta = Math.round(rMin + (rMax - rMin) * score)
  }

  return { effects, rapportDelta, special: activity.special }
}

/**
 * Get minigame duration in seconds based on difficulty
 */
export function getMinigameDuration(difficulty) {
  // Higher difficulty = slightly less time
  return Math.max(10, 20 - difficulty * 2)
}
