/**
 * Budapest districts for tracting.
 * Each day you take the tram to a random district, knock doors, face challenges.
 */

export const DISTRICTS = [
  {
    id: 'obuda',
    name: 'Óbuda',
    mapId: 'district_obuda',
    description: 'Ancient Roman ruins peek between communist-era panel blocks. Old women watch from balconies. A dog barks somewhere above.',
    difficulty: 'easy',
    doorCount: 4,
    flavor: 'roman_blocks',
    arrivalText: 'The tram rattles across the Árpád bridge into Óbuda. Grey tower blocks line the boulevard.',
  },
  {
    id: 'ujpest',
    name: 'Újpest',
    mapId: 'district_ujpest',
    description: 'Industrial north. The air smells like the Danube and factory smoke. Panel buildings stretch in every direction.',
    difficulty: 'medium',
    doorCount: 5,
    flavor: 'industrial',
    arrivalText: 'Metro line 3 drops you in Újpest. The escalator is broken. It is always broken.',
  },
  {
    id: 'zuglo',
    name: 'Zugló',
    mapId: 'district_zuglo',
    description: 'Leafy residential streets. Family homes with gardens. Quieter than most of Budapest. Dogs behind every gate.',
    difficulty: 'easy',
    doorCount: 3,
    flavor: 'residential',
    arrivalText: 'Tram 69 winds through Zugló\'s tree-lined streets. Modest houses with iron fences and rose bushes.',
  },
  {
    id: 'kobanya',
    name: 'Kőbánya',
    mapId: 'district_kobanya',
    description: 'Working-class. The old Dreher brewery looms nearby. People here work hard and don\'t have time for salesmen — or missionaries.',
    difficulty: 'hard',
    doorCount: 5,
    flavor: 'working_class',
    arrivalText: 'The X district. Graffiti on every wall. Laundry hangs between buildings. Someone eyes your name tag.',
  },
  {
    id: 'jozsefvaros',
    name: 'Józsefváros',
    mapId: 'district_jozsefvaros',
    description: 'The VIII district. Diverse, lively, sometimes rough. Roma families, students, elderly holdouts from another era.',
    difficulty: 'hard',
    doorCount: 4,
    flavor: 'diverse',
    arrivalText: 'You step off the bus on Baross utca. Music leaks from open windows. A man sells roasted chestnuts on the corner.',
  },
  {
    id: 'angyalfold',
    name: 'Angyalföld',
    mapId: 'district_angyalfold',
    description: 'Wide communist boulevards. Identical tower blocks in every direction. Finding the right staircase is half the battle.',
    difficulty: 'medium',
    doorCount: 5,
    flavor: 'panel_blocks',
    arrivalText: 'Tram 14 ends at Lehel tér. Concrete towers rise like monoliths. Every building looks the same.',
  },
  {
    id: 'csepel',
    name: 'Csepel',
    mapId: 'district_csepel',
    description: 'The island district. Isolated and proud. Former steelworkers\' paradise. People here are direct — they\'ll tell you exactly what they think.',
    difficulty: 'hard',
    doorCount: 4,
    flavor: 'island',
    arrivalText: 'HÉV train south across the bridge to Csepel. You feel the city fall away. This is its own world.',
  },
  {
    id: 'budafok',
    name: 'Budafok',
    mapId: 'district_budafok',
    description: 'Hilly streets. Old wine cellars under limestone. Quiet, conservative, suspicious of change. But kind once you\'re let in.',
    difficulty: 'medium',
    doorCount: 3,
    flavor: 'hilly',
    arrivalText: 'Bus 33 climbs into the Buda hills. Budafok is sleepy. A cat watches you from a stone wall.',
  },
]

/**
 * Pick a random district, avoiding recently visited ones.
 * @param {string[]} recentDistricts - IDs of recently visited districts (last 2-3)
 * @returns {object} district definition
 */
export function pickRandomDistrict(recentDistricts = []) {
  const eligible = DISTRICTS.filter((d) => !recentDistricts.includes(d.id))
  if (eligible.length === 0) return DISTRICTS[Math.floor(Math.random() * DISTRICTS.length)]
  return eligible[Math.floor(Math.random() * eligible.length)]
}
