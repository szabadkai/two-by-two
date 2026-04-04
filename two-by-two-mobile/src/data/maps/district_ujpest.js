// Újpest district — 14×10 tiles
// Industrial north. Grey panel buildings. Medium difficulty.

export const district_ujpest = {
  id: 'district_ujpest',
  name: 'Újpest',
  width: 14,
  height: 10,
  playerStart: { x: 7, y: 8 },
  companionStart: { x: 6, y: 8 },

  ground: [
    // Row 0: panel block tops (tall buildings)
    [52,52,52,52,52,52, 0,52,52,52,52,52,52,52],
    // Row 1: panel faces
    [50,51,50,51,50,50, 0,50,50,51,50,51,50,50],
    // Row 2: panel base with doors
    [50,50,30,50,50,30, 0,50,30,50,50,30,50,50],
    // Row 3: sidewalk
    [ 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    // Row 4: wide boulevard
    [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    // Row 5: boulevard continued
    [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    // Row 6: sidewalk south
    [ 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    // Row 7: south buildings
    [50,51,30,50,50, 0, 0, 0, 0,50,50,30,51,50],
    // Row 8: sidewalk near metro
    [ 5, 5, 5, 5, 5, 5,33, 5, 5, 5, 5, 5, 5, 5],
    // Row 9: grass strip
    [ 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  ],

  objects: (() => {
    const o = Array.from({ length: 10 }, () => Array(14).fill(0))
    o[3][0] = 44  // bench
    o[3][13] = 44 // bench
    o[6][4] = 44  // bench
    o[9][2] = 40  // tree
    o[9][7] = 40  // tree
    o[9][11] = 40 // tree
    return o
  })(),

  interactions: [
    // Metro/Tram return
    {
      x: 6, y: 8,
      type: 'tram_return',
      label: 'Metro Station',
      prompt: 'Take the metro back?',
    },
    // Door 1
    {
      x: 2, y: 2,
      type: 'tracting_door',
      doorIndex: 0,
      label: 'Panel Block — Staircase A',
      prompt: 'Ring the intercom at Staircase A?',
    },
    // Door 2
    {
      x: 5, y: 2,
      type: 'tracting_door',
      doorIndex: 1,
      label: 'Panel Block — Staircase B',
      prompt: 'Try Staircase B?',
    },
    // Door 3
    {
      x: 8, y: 2,
      type: 'tracting_door',
      doorIndex: 2,
      label: 'Panel Block — Staircase C',
      prompt: 'Buzz Staircase C?',
    },
    // Door 4
    {
      x: 11, y: 2,
      type: 'tracting_door',
      doorIndex: 3,
      label: 'Panel Block — Staircase D',
      prompt: 'Try Staircase D?',
    },
    // Door 5 — south side
    {
      x: 2, y: 7,
      type: 'tracting_door',
      doorIndex: 4,
      label: 'Ground Floor Apartment',
      prompt: 'Knock on this ground-floor door?',
    },
  ],

  npcSpawns: [
    { x: 4, y: 4, type: 'stranger' },
    { x: 9, y: 6, type: 'stranger' },
    { x: 12, y: 4, type: 'stranger' },
  ],
}
