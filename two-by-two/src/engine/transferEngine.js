/**
 * Transfer Engine
 * Handles companion transfers, leadership promotions, and president interviews.
 */

import { getTransferCompanion } from '../data/companions'
import { WEEKS_PER_TRANSFER } from '../data/constants'

// Leadership tiers
export const LEADERSHIP_TIERS = ['missionary', 'district_leader', 'zone_leader', 'ap']
export const LEADERSHIP_LABELS = {
  missionary: 'Missionary',
  district_leader: 'District Leader',
  zone_leader: 'Zone Leader',
  ap: 'Assistant to the President',
}

/**
 * Check if this week is a transfer week
 */
export function isTransferWeek(week) {
  return week > 1 && week % WEEKS_PER_TRANSFER === 0
}

/**
 * Get the transfer number (1-indexed)
 */
export function getTransferNumber(week) {
  return Math.ceil(week / WEEKS_PER_TRANSFER)
}

/**
 * Calculate promotion eligibility
 * Based on baptisms, obedience, and relationship with mission president
 */
export function calculatePromotion(state) {
  const { leadership, baptisms, stats, warnings } = state
  const currentTier = LEADERSHIP_TIERS.indexOf(leadership || 'missionary')

  // Can't promote if max tier or have warnings
  if (currentTier >= LEADERSHIP_TIERS.length - 1) return null
  if (warnings >= 2) return null

  // Promotion score
  let score = 0
  score += baptisms * 15          // baptisms are king
  score += stats.obedience * 0.3  // obedience matters
  score += stats.skills * 0.2     // teaching ability
  score += stats.language * 0.1   // language helps
  score -= warnings * 30          // warnings hurt badly

  // Thresholds for each tier
  const thresholds = {
    0: 25,   // missionary → DL
    1: 55,   // DL → ZL
    2: 90,   // ZL → AP
  }

  const threshold = thresholds[currentTier]
  if (!threshold) return null

  if (score >= threshold) {
    return LEADERSHIP_TIERS[currentTier + 1]
  }

  return null
}

/**
 * Generate president interview dialogue choices
 */
export function getPresidentInterview(state) {
  const { warnings, stats, leadership, baptisms, companion } = state

  // Different interview types based on context
  if (warnings > 0) {
    return {
      type: 'warning',
      text: `Elder, I've received some concerning reports. You have ${warnings} warning${warnings > 1 ? 's' : ''}. I need to know — are you fully committed to this work?`,
      choices: [
        {
          text: 'I recommit myself, President. I\'ll do better.',
          effects: { obedience: 5, spirit: 3 },
          rapportDelta: 0,
          response: 'Good. I believe you. The Lord needs you here, Elder. Don\'t let Him down.',
        },
        {
          text: 'It\'s been harder than I expected, but I\'m trying.',
          effects: { spirit: 5 },
          rapportDelta: 0,
          response: 'I know it\'s hard. Every missionary struggles. Come talk to me before things get worse.',
        },
        {
          text: 'I think the rules are too strict for the real world.',
          effects: { obedience: -10, spirit: 2 },
          rapportDelta: 0,
          response: 'Elder... the rules exist for a reason. I\'m going to keep my eye on you.',
        },
      ],
    }
  }

  // Promotion interview
  const promotion = calculatePromotion(state)
  if (promotion) {
    return {
      type: 'promotion',
      promotion,
      text: `Elder, I've been watching your progress. Your ${baptisms > 0 ? 'baptisms and ' : ''}dedication hasn't gone unnoticed. I'd like to call you as ${LEADERSHIP_LABELS[promotion]}.`,
      choices: [
        {
          text: 'I\'d be honored, President. I\'ll serve my best.',
          effects: { obedience: 3, spirit: 5 },
          rapportDelta: 0,
          acceptPromotion: true,
          response: 'Excellent. The zone needs strong leadership. I know you\'ll rise to it.',
        },
        {
          text: 'I\'m grateful, but I want to focus on teaching.',
          effects: { spirit: 3 },
          rapportDelta: 0,
          acceptPromotion: false,
          response: 'I respect that, Elder. Not everyone needs a title to lead. Keep doing great work.',
        },
      ],
    }
  }

  // Standard check-in
  const spiritLow = stats.spirit < 40
  const doing_well = stats.obedience > 60 && stats.spirit > 60

  if (spiritLow) {
    return {
      type: 'checkin',
      text: 'How are you really doing, Elder? And I mean really. I can tell something\'s weighing on you.',
      choices: [
        {
          text: 'I\'m struggling with homesickness, President.',
          effects: { spirit: 8 },
          rapportDelta: 0,
          response: 'That\'s completely normal. The Lord called you here because He trusts you. Lean on Him.',
        },
        {
          text: 'I\'m fine, President. Just tired.',
          effects: { spirit: 2 },
          rapportDelta: 0,
          response: 'If you say so. But my door is always open. Don\'t carry this alone.',
        },
        {
          text: 'I\'m not sure I want to be here anymore.',
          effects: { spirit: 5, obedience: -5 },
          rapportDelta: 0,
          response: 'I appreciate your honesty. Let\'s talk again next week. Don\'t make any decisions yet.',
        },
      ],
    }
  }

  if (doing_well) {
    return {
      type: 'checkin',
      text: `Good to see you, Elder. I've heard great things about your work in the zone. Keep it up. Anything you need from me?`,
      choices: [
        {
          text: 'We could use more investigators in our area.',
          effects: { skills: 2 },
          rapportDelta: 0,
          response: 'I\'ll see what I can do. Keep contacting — the Lord will provide.',
        },
        {
          text: 'Thank you, President. We\'re doing our best.',
          effects: { spirit: 3, obedience: 2 },
          rapportDelta: 0,
          response: 'I can tell. Your companion speaks highly of you. That matters.',
        },
      ],
    }
  }

  // Default
  return {
    type: 'checkin',
    text: 'How is the work going, Elder? Tell me about your companionship.',
    choices: [
      {
        text: 'We\'re working hard. Lots of lessons this transfer.',
        effects: { obedience: 2, spirit: 2 },
        rapportDelta: 0,
        response: 'Good. Stay focused and the blessings will come.',
      },
      {
        text: 'It\'s been a challenging transfer, but I\'m learning a lot.',
        effects: { spirit: 4 },
        rapportDelta: 0,
        response: 'The hard transfers are the ones you grow the most from. Trust the process.',
      },
    ],
  }
}

/**
 * Generate the full transfer data for a given week
 */
export function generateTransfer(state) {
  const { companion, week, companionHistory = [] } = state

  // Get new companion
  const newCompanion = getTransferCompanion(week, [...companionHistory, companion.id])

  // Get interview
  const interview = getPresidentInterview(state)

  return {
    departingCompanion: companion,
    newCompanion,
    interview,
    transferNumber: getTransferNumber(week),
  }
}
