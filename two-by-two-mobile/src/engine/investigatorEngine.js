import { INVESTIGATOR_BASE_PROGRESSION, WARMTH_DECAY_PER_WEEK } from '../data/constants'
import { STAGE_OBJECTIONS } from '../data/investigatorTemplates'

export function getInvestigatorForTeaching(investigators) {
  const active = investigators.filter((i) => i.isActive && i.stage < 7)
  if (active.length === 0) return null
  return active.reduce((best, inv) =>
    inv.warmth > best.warmth ? inv : best
  )
}

export function advanceInvestigator(state, targetId = null) {
  let investigator
  if (targetId) {
    investigator = state.investigators.find((i) => i.id === targetId && i.isActive && i.stage < 7) || null
  } else {
    investigator = getInvestigatorForTeaching(state.investigators)
  }
  if (!investigator) {
    return { investigator: null, result: 'no_active', text: 'No active investigators to teach.' }
  }

  // Apply warmth bonus for targeted visit (cap at 10)
  if (targetId) {
    investigator = { ...investigator, warmth: Math.min(10, investigator.warmth + 1) }
  }

  const { skills, language } = state.stats
  const chance = Math.min(
    0.9,
    INVESTIGATOR_BASE_PROGRESSION
      + (skills / 100) * 0.2
      + (language / 100) * 0.2
      + investigator.progressionBonus
  )

  const success = Math.random() < chance

  if (success) {
    const newStage = investigator.stage + 1
    const baptized = newStage >= 7

    // Check if the new stage triggers an objection
    const objection = checkStageObjection(newStage, investigator)

    return {
      investigator: { ...investigator, stage: newStage },
      result: baptized ? 'baptized' : 'advanced',
      text: baptized
        ? `${investigator.name} was baptized! A golden day on the Danube.`
        : `${investigator.name} progressed to the next stage!`,
      objection, // may be null
    }
  }

  return {
    investigator: { ...investigator, warmth: Math.max(0, investigator.warmth - 1) },
    result: 'failed',
    text: `${investigator.name} wasn't ready to move forward. They seem a little less engaged.`,
    objection: null,
  }
}

/**
 * Check if advancing to this stage triggers an objection event.
 * Objections happen at stages 2, 4, and 6.
 */
export function checkStageObjection(newStage, investigator) {
  const stageData = STAGE_OBJECTIONS[newStage]
  if (!stageData) return null

  // 70% chance of objection at trigger stages
  if (Math.random() > 0.7) return null

  const scenario = stageData.scenarios[Math.floor(Math.random() * stageData.scenarios.length)]
  return {
    trigger: stageData.trigger,
    text: scenario.text,
    options: scenario.options,
    investigatorId: investigator.id,
  }
}

/**
 * Apply objection resolution to an investigator.
 */
export function resolveObjection(investigator, effect) {
  const newWarmth = Math.max(0, Math.min(10, investigator.warmth + (effect.warmthDelta || 0)))

  // If advance is false, roll back the stage
  let newStage = investigator.stage
  if (!effect.advance) {
    newStage = Math.max(0, investigator.stage - 1)
  }

  return {
    ...investigator,
    warmth: newWarmth,
    stage: newStage,
  }
}

export function weeklyInvestigatorDecay(investigators) {
  const notifications = []
  const updated = investigators.map((inv) => {
    if (!inv.isActive || inv.stage >= 7) return inv

    const newWarmth = inv.warmth - WARMTH_DECAY_PER_WEEK
    if (newWarmth <= 0) {
      notifications.push(`${inv.name} has gone silent. They stopped answering the door.`)
      return { ...inv, warmth: 0, isActive: false }
    }

    return {
      ...inv,
      warmth: newWarmth,
      weeksSinceContact: inv.weeksSinceContact + 1,
    }
  })

  return { investigators: updated, notifications }
}
