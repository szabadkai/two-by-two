/**
 * Tracting Engine
 * Handles district selection, door encounter generation, and resolution.
 */

import { pickRandomDistrict, DISTRICTS } from '../data/districts'
import { rollDoorEncounter } from '../data/doorEncounters'
import { tryGenerateInvestigator } from './investigatorGenerator'
import { STAT_CAPS } from '../data/constants'

function clampStat(name, value) {
  const cap = STAT_CAPS[name]
  if (!cap) return value
  return Math.max(cap.min, Math.min(cap.max, value))
}

/**
 * Select a district for today's tracting, avoiding recent visits.
 * @param {string[]} recentDistricts
 * @returns {object} district definition
 */
export function selectDistrict(recentDistricts = []) {
  return pickRandomDistrict(recentDistricts)
}

/**
 * Generate door encounters for a district.
 * @param {object} district - district definition
 * @returns {object[]} array of encounters, one per door
 */
export function generateDoorEncounters(district) {
  const count = district.doorCount || 4
  const encounters = []
  for (let i = 0; i < count; i++) {
    encounters.push({
      doorIndex: i,
      encounter: rollDoorEncounter(district.difficulty),
      resolved: false,
      result: null,
    })
  }
  return encounters
}

/**
 * Resolve a single door encounter choice.
 * @param {object} doorEntry - { doorIndex, encounter, resolved, result }
 * @param {number} choiceIndex - which choice the player picked
 * @param {object} stats - player's current stats
 * @param {object[]} investigators - current investigator list
 * @returns {object} { outcome, text, statDeltas, newContact, contact }
 */
export function resolveDoorKnock(doorEntry, choiceIndex, stats, investigators) {
  const { encounter } = doorEntry

  // Auto-resolve encounters (neutral — no choices needed)
  if (encounter.autoResolve) {
    return {
      outcome: 'neutral',
      text: encounter.result.text,
      statDeltas: encounter.result.effects || {},
      newContact: null,
    }
  }

  const choice = encounter.choices[choiceIndex]
  if (!choice) return null

  // Calculate success chance (modified by stat check)
  let chance = choice.successChance
  if (choice.statCheck && stats[choice.statCheck] !== undefined) {
    chance += (stats[choice.statCheck] / 100) * 0.25
  }
  chance = Math.max(0.05, Math.min(0.95, chance))

  const isSuccess = Math.random() < chance
  const result = isSuccess ? choice.resultGood : choice.resultBad

  // Compute stat deltas
  const statDeltas = result.effects || {}

  // Check if this creates a new investigator contact
  let newContact = null
  if (result.contact) {
    newContact = tryGenerateInvestigator('street', investigators, stats)
  }

  return {
    outcome: isSuccess ? 'good' : 'bad',
    text: result.text,
    statDeltas,
    newContact,
  }
}

/**
 * Apply stat deltas from a door encounter to the current stats.
 * @param {object} stats - current stats
 * @param {object} statDeltas - { stat: delta }
 * @returns {object} new stats
 */
export function applyDoorStatDeltas(stats, statDeltas) {
  const newStats = { ...stats }
  for (const [stat, delta] of Object.entries(statDeltas)) {
    if (newStats[stat] !== undefined) {
      newStats[stat] = clampStat(stat, newStats[stat] + delta)
    }
  }
  return newStats
}

/**
 * Summarize results of a completed tracting session.
 * @param {object[]} doorResults - array of resolved door entries
 * @param {string} districtName
 * @returns {object} { doorsKnocked, contactsMade, totalStatDeltas, summaryText }
 */
export function summarizeTracting(doorResults, districtName) {
  let doorsKnocked = 0
  let contactsMade = 0
  const totalStatDeltas = {}

  for (const dr of doorResults) {
    if (!dr.resolved) continue
    doorsKnocked++
    if (dr.result?.newContact) contactsMade++
    if (dr.result?.statDeltas) {
      for (const [stat, delta] of Object.entries(dr.result.statDeltas)) {
        totalStatDeltas[stat] = (totalStatDeltas[stat] || 0) + delta
      }
    }
  }

  let summaryText
  if (contactsMade >= 2) {
    summaryText = `A blessed day in ${districtName}. ${contactsMade} new contacts from ${doorsKnocked} doors. The Lord is preparing people.`
  } else if (contactsMade === 1) {
    summaryText = `One new contact in ${districtName}. ${doorsKnocked} doors knocked. Every door is a seed planted.`
  } else if (doorsKnocked >= 3) {
    summaryText = `${doorsKnocked} doors in ${districtName}. No contacts today, but you showed up. That counts.`
  } else {
    summaryText = `A quick trip to ${districtName}. Not much happened, but effort is everything.`
  }

  return { doorsKnocked, contactsMade, totalStatDeltas, summaryText }
}

/**
 * Compute Sunday meeting attendance from investigators.
 * Investigators with stage >= 3 and warmth >= 6 have a chance.
 * @param {object[]} investigators
 * @param {string[]} churchInvites - IDs of investigators invited via phone this week
 * @returns {{ attendees: object[], spiritBonus: number, notifications: string[] }}
 */
export function resolveSundayMeeting(investigators, churchInvites = []) {
  const attendees = []
  const notifications = []
  let spiritBonus = 0

  const active = investigators.filter((i) => i.isActive && i.stage >= 3 && i.stage < 7)

  for (const inv of active) {
    // Chance = base 0.2 + warmth bonus + stage bonus + invite bonus
    const inviteBonus = churchInvites.includes(inv.id) ? 0.2 : 0
    const chance = Math.min(0.95, 0.2 + (inv.warmth / 10) * 0.3 + (inv.stage / 7) * 0.2 + inviteBonus)
    if (Math.random() < chance) {
      attendees.push(inv)
      spiritBonus += 2
      notifications.push(`${inv.name} came to church!`)
    }
  }

  if (attendees.length === 0 && active.length > 0) {
    notifications.push('Empty pews today. Keep going, Elder.')
  } else if (active.length === 0) {
    notifications.push('No investigators ready for church yet.')
  }

  // Update warmth for attendees
  const updatedInvestigators = investigators.map((inv) => {
    const attended = attendees.find((a) => a.id === inv.id)
    if (attended) {
      return { ...inv, warmth: Math.min(10, inv.warmth + 1) }
    }
    return inv
  })

  return { attendees, spiritBonus, notifications, updatedInvestigators }
}
