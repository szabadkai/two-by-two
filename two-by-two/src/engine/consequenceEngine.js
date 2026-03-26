import {
  MAX_WARNINGS,
  SPIRIT_CRISIS_THRESHOLD,
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
