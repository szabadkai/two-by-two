/**
 * Map Enhancer
 * Dynamically injects NPCs (investigators, etc.) into static map definitions
 * based on current game state.
 */

const CHURCH_PEW_SEATS = [
  { x: 3, y: 2 },
  { x: 3, y: 3 },
  { x: 3, y: 4 },
  { x: 5, y: 4 },
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
      .slice(0, CHURCH_PEW_SEATS.length)
      .map((inv, i) => ({
        ...CHURCH_PEW_SEATS[i],
        type: 'investigator',
        name: inv.name,
        investigatorId: inv.id,
      }))

    return {
      ...mapDef,
      npcSpawns: [...(mapDef.npcSpawns || []), ...investigatorSpawns],
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
