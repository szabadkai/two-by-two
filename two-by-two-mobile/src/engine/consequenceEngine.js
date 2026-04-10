import {
  MAX_WARNINGS,
  SPIRIT_CRISIS_THRESHOLD,
  OBEDIENCE_TIER_EXEMPLARY,
  OBEDIENCE_TIER_COMFORTABLE,
  OBEDIENCE_TIER_WARNING,
  OBEDIENCE_TIER_DANGER,
  COMPANION_REPORT_OBEDIENCE_THRESHOLD,
  COMPANION_REPORT_RAPPORT_THRESHOLD,
  COMPANION_REPORT_CHANCE,
  OBEDIENCE_REPORT_PENALTY,
  WEEKLY_FOOD_COST,
  WEEKLY_TRANSIT_COST,
  LANGUAGE_DECAY_PER_WEEK,
  MANDATORY_ACTIVITY_CHANCE,
  COMPANION_DEMAND_RAPPORT_THRESHOLD,
  MEMBER_REQUEST_CHANCE,
} from '../data/constants'

/**
 * Check for spirit crisis (spirit drops to 0 or below)
 * Returns a forced crisis event or null
 */
export function checkSpiritCrisis(stats) {
  if (stats.spirit <= SPIRIT_CRISIS_THRESHOLD) {
    return {
      id: 'spirit_crisis',
      title: 'Breaking Point',
      description: 'You can\'t get out of bed. The weight of six thousand miles, a language you can\'t speak, and doors that won\'t open has finally crushed something inside you. Elder Thompson finds you staring at the ceiling at 9 AM.',
      forced: true,
      choices: [
        {
          label: 'Call the mission president',
          resultGood: {
            text: 'President Kovács listens quietly. "Elder, this is normal. More normal than you think." He arranges a day off and a visit from the mission doctor. You feel heard.',
            effects: { spirit: 15, obedience: 2 },
          },
          resultBad: {
            text: 'President Kovács is concerned but busy. "Pray about it, Elder." You hang up feeling more alone than before. But at least someone knows.',
            effects: { spirit: 5, obedience: 1 },
          },
          successChance: 0.5,
        },
        {
          label: 'Push through alone',
          resultGood: {
            text: 'You drag yourself through the motions. By afternoon, a stranger on the street says "Szép napot!" with a genuine smile. Something small cracks open. You cry in the bathroom. It helps.',
            effects: { spirit: 8 },
          },
          resultBad: {
            text: 'The day is a blur. You go through motions without meaning. Elder Thompson tries to help but you snap at him. Everything feels grey. This continues for days.',
            effects: { spirit: 3 },
            rapportEffect: -2,
          },
          successChance: 0.3,
        },
      ],
    }
  }
  return null
}

/**
 * Check if companion reports you for low obedience
 * Returns { reported, warning } or null
 */
export function checkCompanionReport(stats, companion) {
  if (
    stats.obedience < COMPANION_REPORT_OBEDIENCE_THRESHOLD &&
    companion.rapport < COMPANION_REPORT_RAPPORT_THRESHOLD &&
    Math.random() < COMPANION_REPORT_CHANCE
  ) {
    return {
      reported: true,
      obediencePenalty: OBEDIENCE_REPORT_PENALTY,
      text: `${companion.name} reported your behavior to the Zone Leader. You've received an official warning.`,
    }
  }
  return null
}

/**
 * Evaluate weekly obedience tier and return consequences/rewards.
 * Returns null if nothing noteworthy, or an object with text + effects.
 */
export function checkObedienceTier(stats) {
  const ob = stats.obedience

  // Exemplary (90+): chance of special blessing
  if (ob >= OBEDIENCE_TIER_EXEMPLARY) {
    if (Math.random() < 0.25) {
      const blessings = [
        { text: 'The mission president praised your dedication in zone conference. Your example lifts everyone.', effects: { spirit: 3 } },
        { text: 'A member tells you they were inspired by your obedience. "You remind me why I joined the church."', effects: { spirit: 4 } },
        { text: 'An investigator who had been cold suddenly reaches out — they felt something different about you.', effects: { spirit: 2 } },
        { text: 'District Leader calls: "President wants you to train the new missionaries. He trusts you."', effects: { spirit: 2, skills: 2 } },
      ]
      return blessings[Math.floor(Math.random() * blessings.length)]
    }
    return null
  }

  // Comfortable (60-89): safe, occasional mild reminders
  if (ob >= OBEDIENCE_TIER_COMFORTABLE) {
    if (Math.random() < 0.1) {
      const prods = [
        { text: 'Zone Leader mentions your area in the weekly call. "Keep it tight, Elders."', effects: {} },
        { text: 'Companion gives you a look when you sleep past 6:30. Nothing said, but noted.', effects: {} },
      ]
      return prods[Math.floor(Math.random() * prods.length)]
    }
    return null
  }

  // Warning zone (40-59): zone leader scrutiny
  if (ob >= OBEDIENCE_TIER_WARNING) {
    if (Math.random() < 0.3) {
      const warnings = [
        { text: 'Zone Leader calls: "I need your daily planner by tonight. Something feels off in your area."', effects: { spirit: -2 } },
        { text: 'A surprise check-in from the Assistants. They ask pointed questions about your schedule.', effects: { spirit: -1, obedience: 1 } },
        { text: 'Your district leader pulls you aside after meeting. "I\'m worried about you, Elder. Talk to me."', effects: { spirit: -1 } },
      ]
      return warnings[Math.floor(Math.random() * warnings.length)]
    }
    return null
  }

  // Danger zone (20-39): companion reports, restrictions
  if (ob >= OBEDIENCE_TIER_DANGER) {
    if (Math.random() < 0.5) {
      const consequences = [
        { text: 'Zone Leader restricts your area. No more "exploring" — scheduled visits only until further notice.', effects: { spirit: -3, obedience: 2 } },
        { text: 'Mission president schedules a phone interview. His voice is calm but concerned. "Tell me what\'s happening, Elder."', effects: { spirit: -2, obedience: 3 } },
        { text: 'Your companion refuses to go along with the plan. "I\'m not losing my mission because of you."', effects: { spirit: -2 }, rapportEffect: -2 },
      ]
      return consequences[Math.floor(Math.random() * consequences.length)]
    }
    return null
  }

  // Critical (<20): transfer threat
  if (Math.random() < 0.7) {
    const critical = [
      { text: 'Emergency call from the mission president. "Elder, I need to see you in my office. This week." This is serious.', effects: { spirit: -5, obedience: 5 }, warning: true },
      { text: 'Your companion called the Assistants. They\'re sending the Zone Leaders to "help" your area. Everyone knows what that means.', effects: { spirit: -4, obedience: 3 }, rapportEffect: -3, warning: true },
    ]
    return critical[Math.floor(Math.random() * critical.length)]
  }
  return null
}

/**
 * Check if budget debt triggers a warning
 */
export function checkBudgetDebt(stats, debtWeeks) {
  if (stats.budget < 0) {
    if (debtWeeks >= 2) {
      return {
        warning: true,
        text: 'The mission office called about your negative balance. "This is unacceptable, Elder." You\'ve received a warning.',
      }
    }
    return {
      warning: false,
      text: 'Your budget is in the red. The mission office will notice if this continues.',
    }
  }
  return null
}

/**
 * Check if game is over due to warnings
 */
export function checkSentHome(warnings) {
  return warnings >= MAX_WARNINGS
}

/**
 * Apply weekly mandatory expenses (food + transit)
 */
export function applyWeeklyExpenses(budget) {
  const totalExpense = WEEKLY_FOOD_COST + WEEKLY_TRANSIT_COST
  return {
    newBudget: budget - totalExpense,
    expense: totalExpense,
  }
}

/**
 * Apply weekly language decay if no language activity was done
 */
export function applyLanguageDecay(language, didStudyLanguage) {
  if (!didStudyLanguage) {
    return Math.max(0, language - LANGUAGE_DECAY_PER_WEEK)
  }
  return language
}

/**
 * Generate a mandatory activity demand for the day.
 * Returns null or a demand object.
 */
export function rollMandatoryActivity(state) {
  const demands = []

  // Companion demand: if rapport is low, companion wants attention
  if (state.companion.rapport < COMPANION_DEMAND_RAPPORT_THRESHOLD) {
    demands.push({
      type: 'companion_demand',
      label: 'Companion Needs Talk',
      description: `${state.companion.name} is upset and needs to talk. Refusing will damage your relationship further.`,
      slot: 'morning', // takes your morning slot
      effects: { spirit: [0, 1] },
      rapportEffect: [1, 2],
      refuseConsequence: { rapportDelta: -3 },
    })
  }

  // Zone Leader / Mission President assigns a task
  if (Math.random() < MANDATORY_ACTIVITY_CHANCE) {
    const tasks = [
      {
        type: 'zone_assignment',
        label: 'Zone Meeting',
        description: 'The Zone Leader called an emergency meeting. You must attend.',
        slot: 'morning',
        effects: { obedience: [1, 2], skills: [0, 1] },
        refuseConsequence: { obedienceDelta: -5 },
      },
      {
        type: 'area_cleaning',
        label: 'Church Cleaning',
        description: 'It\'s your companionship\'s turn to clean the church building.',
        slot: 'afternoon',
        effects: { obedience: [1, 2], spirit: [-1, 0] },
        rapportEffect: [0, 1],
        refuseConsequence: { obedienceDelta: -3 },
      },
      {
        type: 'president_call',
        label: 'President\'s Phone Call',
        description: 'President Kovács wants a check-in call. You should take it seriously.',
        slot: 'evening',
        effects: { obedience: [1, 3], spirit: [-1, 1] },
        refuseConsequence: { obedienceDelta: -8 },
      },
    ]
    demands.push(tasks[Math.floor(Math.random() * tasks.length)])
  }

  // Member visit request
  if (Math.random() < MEMBER_REQUEST_CHANCE) {
    demands.push({
      type: 'member_request',
      label: 'Member Needs Help',
      description: 'Sister Kovács called — she needs help moving furniture. Ignoring her will weigh on your conscience.',
      slot: 'afternoon',
      effects: { spirit: [1, 2], obedience: [0, 1], language: [0, 1] },
      refuseConsequence: { spiritDelta: -3 },
    })
  }

  // Return the highest priority demand (only one per day)
  if (demands.length === 0) return null
  // Companion demands take priority, then random from the rest
  const companionDemand = demands.find(d => d.type === 'companion_demand')
  if (companionDemand) return companionDemand
  return demands[Math.floor(Math.random() * demands.length)]
}
