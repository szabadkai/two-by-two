/**
 * Investigator Generator
 * Dynamically creates new investigators from templates.
 * Triggered by street contacting and English class activities.
 */

import {
  HUNGARIAN_FIRST_NAMES_MALE,
  HUNGARIAN_FIRST_NAMES_FEMALE,
  HUNGARIAN_SURNAMES,
  INVESTIGATOR_TEMPLATES,
} from '../data/investigatorTemplates'

const MAX_INVESTIGATORS = 4

// Track used names to avoid duplicates
let usedNames = new Set()

/**
 * Generate a unique Hungarian name
 */
function generateName(existingInvestigators) {
  const isFemale = Math.random() < 0.5
  const firstNames = isFemale ? HUNGARIAN_FIRST_NAMES_FEMALE : HUNGARIAN_FIRST_NAMES_MALE
  const existingNames = new Set(existingInvestigators.map(i => i.name))

  // Try up to 20 times to get a unique name
  for (let attempt = 0; attempt < 20; attempt++) {
    const surname = HUNGARIAN_SURNAMES[Math.floor(Math.random() * HUNGARIAN_SURNAMES.length)]
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    // Hungarian name order: surname first
    const fullName = `${surname} ${firstName}`

    if (!existingNames.has(fullName) && !usedNames.has(fullName)) {
      usedNames.add(fullName)
      return fullName
    }
  }

  // Fallback: just pick something
  const surname = HUNGARIAN_SURNAMES[Math.floor(Math.random() * HUNGARIAN_SURNAMES.length)]
  const firstName = (isFemale ? HUNGARIAN_FIRST_NAMES_FEMALE : HUNGARIAN_FIRST_NAMES_MALE)[
    Math.floor(Math.random() * firstNames.length)
  ]
  return `${surname} ${firstName}`
}

/**
 * Generate a unique ID from a name
 */
function generateId(name) {
  return name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/\s+/g, '_')
    + '_' + Math.random().toString(36).slice(2, 6)
}

/**
 * Pick a template based on source type
 */
function pickTemplate(source) {
  const eligible = INVESTIGATOR_TEMPLATES.filter(t => t.sources.includes(source))
  if (eligible.length === 0) return INVESTIGATOR_TEMPLATES[0]
  return eligible[Math.floor(Math.random() * eligible.length)]
}

/**
 * Try to generate a new investigator.
 * Returns null if at max capacity or roll fails.
 *
 * @param {string} source - 'street' | 'english' | 'member_referral'
 * @param {object[]} existingInvestigators - current investigator list
 * @param {object} stats - player stats (affects chance)
 * @returns {object|null} - new investigator or null
 */
export function tryGenerateInvestigator(source, existingInvestigators, stats) {
  const activeCount = existingInvestigators.filter(i => i.isActive).length

  // Can't exceed max
  if (activeCount >= MAX_INVESTIGATORS) return null

  // Base chance depends on source
  const baseChance = {
    street: 0.25,
    english: 0.20,
    member_referral: 0.40,
  }[source] || 0.15

  // Language and skills boost the chance
  const skillBonus = (stats.skills || 0) / 500   // max +0.2
  const langBonus = (stats.language || 0) / 500   // max +0.2
  const chance = Math.min(0.7, baseChance + skillBonus + langBonus)

  if (Math.random() > chance) return null

  // Generate!
  const template = pickTemplate(source)
  const name = generateName(existingInvestigators)
  const warmth = template.warmthRange[0] +
    Math.floor(Math.random() * (template.warmthRange[1] - template.warmthRange[0] + 1))

  // Pick 2-3 objections from the pool
  const shuffled = [...template.objectionPool].sort(() => Math.random() - 0.5)
  const objections = shuffled.slice(0, 2 + Math.floor(Math.random() * 2))

  // Pick a description
  const description = template.descriptions[Math.floor(Math.random() * template.descriptions.length)]

  return {
    id: generateId(name),
    name,
    personality: template.personality,
    stage: 0,
    warmth,
    weeksSinceContact: 0,
    objections,
    isActive: true,
    description,
    progressionBonus: template.progressionBonus,
    generated: true, // flag to distinguish from starting investigators
  }
}

/**
 * Check if a new investigator should be generated after an activity.
 * Called from resolveDay when relevant activities are performed.
 */
export function checkNewInvestigator(activityId, investigators, stats) {
  const sourceMap = {
    street_contact: 'street',
    english_class: 'english',
    member_visit: 'member_referral',
  }

  const source = sourceMap[activityId]
  if (!source) return null

  return tryGenerateInvestigator(source, investigators, stats)
}

/**
 * Reset used names (for new game)
 */
export function resetNamePool() {
  usedNames = new Set()
}
