/**
 * Map Enhancer
 * Dynamically injects NPCs (investigators, members) into static map definitions
 * based on current game state.
 */

import { MEMBERS } from '../data/members'

// Chapel seats — each has a walkable neighbor via the center aisle (x=3) or side aisles
const CHURCH_INVESTIGATOR_SEATS = [
  { x: 2, y: 2 },  // left pew row 1 — aisle at (3,2)
  { x: 4, y: 2 },  // right pew row 1 — aisle at (3,2)
  { x: 2, y: 3 },  // left pew row 2 — aisle at (3,3)
  { x: 4, y: 3 },  // right pew row 2 — aisle at (3,3)
]

// Classroom / back seats for ward members
const CHURCH_MEMBER_SEATS = [
  { x: 9, y: 2 },   // classroom chair row 1
  { x: 11, y: 2 },  // classroom chair row 1
  { x: 2, y: 4 },   // left pew row 3 — aisle at (3,4)
]

const STREET_SIDEWALK_POSITIONS = [
  { x: 4, y: 7 },
  { x: 13, y: 7 },
  { x: 16, y: 7 },
  { x: 24, y: 7 },
]

export function getEnhancedMap(mapDef, investigators) {
  if (!mapDef) return mapDef

  const activeInvestigators = (investigators || []).filter(
    (inv) => inv.isActive && inv.stage < 7
  )

  if (mapDef.id === 'church') {
    const investigatorSpawns = activeInvestigators
      .slice(0, CHURCH_INVESTIGATOR_SEATS.length)
      .map((inv, i) => ({
        ...CHURCH_INVESTIGATOR_SEATS[i],
        type: 'investigator',
        name: inv.name,
        investigatorId: inv.id,
      }))

    // Place up to 3 ward members in remaining seats
    const memberSpawns = MEMBERS
      .slice(0, CHURCH_MEMBER_SEATS.length)
      .map((m, i) => ({
        ...CHURCH_MEMBER_SEATS[i],
        type: 'member',
        name: m.name,
        memberId: m.id,
      }))

    return {
      ...mapDef,
      npcSpawns: [...(mapDef.npcSpawns || []), ...investigatorSpawns, ...memberSpawns],
    }
  }

  if (mapDef.id === 'street') {
    const investigatorSpawns = activeInvestigators
      .slice(0, STREET_SIDEWALK_POSITIONS.length)
      .map((inv, i) => ({
        ...STREET_SIDEWALK_POSITIONS[i],
        type: 'investigator',
        investigatorId: inv.id,
        name: inv.name,
      }))

    return {
      ...mapDef,
      npcSpawns: [...(mapDef.npcSpawns || []), ...investigatorSpawns],
    }
  }

  return mapDef
}
