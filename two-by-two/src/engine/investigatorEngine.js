import { INVESTIGATOR_BASE_PROGRESSION, WARMTH_DECAY_PER_WEEK } from '../data/constants'

export function getInvestigatorForTeaching(investigators) {
  const active = investigators.filter((i) => i.isActive && i.stage < 7)
  if (active.length === 0) return null
  return active.reduce((best, inv) =>
    inv.warmth > best.warmth ? inv : best
  )
}

export function advanceInvestigator(state) {
  const investigator = getInvestigatorForTeaching(state.investigators)
  if (!investigator) {
    return { investigator: null, result: 'no_active', text: 'No active investigators to teach.' }
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

    return {
      investigator: { ...investigator, stage: newStage },
      result: baptized ? 'baptized' : 'advanced',
      text: baptized
        ? `${investigator.name} was baptized! A golden day on the Danube.`
        : `${investigator.name} progressed to the next stage!`,
    }
  }

  return {
    investigator: { ...investigator, warmth: Math.max(0, investigator.warmth - 1) },
    result: 'failed',
    text: `${investigator.name} wasn't ready to move forward. They seem a little less engaged.`,
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
