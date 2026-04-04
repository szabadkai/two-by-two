// Angyalföld district — 14×10 tiles
// Wide communist boulevards, identical tower blocks. Medium difficulty.

export const district_angyalfold = {
  id: 'district_angyalfold',
  name: 'Angyalföld',
  width: 14,
  height: 10,
  playerStart: { x: 7, y: 6 },
  companionStart: { x: 8, y: 6 },

  ground: [
    // Row 0: tower block tops
    [52,52,52,52,52,52,52,52,52,52,52,52,52,52],
    // Row 1: identical panel faces
    [50,51,50,51,50,51,50,50,51,50,51,50,51,50],
    // Row 2: doors — many staircases
    [50,30,50,30,50,30, 0, 0,50,30,50,30,50,30],
    // Row 3: sidewalk
    [ 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    // Row 4: wide boulevard
    [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    // Row 5: boulevard continued
    [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    // Row 6: sidewalk south
    [ 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    // Row 7: south panel block
    [52,52,52,52,52, 0, 0, 0, 0,52,52,52,52,52],
    // Row 8: south block faces
    [50,51,30,51,50, 0, 0,33, 0,50,51,30,51,50],
    // Row 9: south base
    [50,50,50,50,50, 4, 4, 4, 4,50,50,50,50,50],
  ],

  objects: (() => {
    const o = Array.from({ length: 10 }, () => Array(14).fill(0))
    o[3][6] = 44  // bench
    o[3][7] = 44  // bench
    o[6][3] = 44  // bench
    o[6][10] = 44 // bench
    o[9][5] = 40  // tree
    o[9][8] = 40  // tree
    return o
  })(),

  interactions: [
    // Tram return
    {
      x: 7, y: 8,
      type: 'tram_return',
      label: 'Lehel tér — Tram Stop',
      prompt: 'Take tram 14 back?',
    },
    // Door 1
    {
      x: 1, y: 2,
      type: 'tracting_door',
      doorIndex: 0,
      label: 'Tower Block A — 3rd Floor',
      prompt: 'Take the elevator (if it works) to the 3rd floor?',
    },
    // Door 2
    {
      x: 3, y: 2,
      type: 'tracting_door',
      doorIndex: 1,
      label: 'Tower Block A — 7th Floor',
      prompt: 'Climb to the 7th floor?',
    },
    // Door 3
    {
      x: 5, y: 2,
      type: 'tracting_door',
      doorIndex: 2,
      label: 'Tower Block B — Ground Floor',
      prompt: 'Try the ground floor flat?',
    },
    // Door 4
    {
      x: 9, y: 2,
      type: 'tracting_door',
      doorIndex: 3,
      label: 'Tower Block C — 5th Floor',
      prompt: 'Buzz the 5th floor?',
    },
    // Door 5
    {
      x: 11, y: 2,
      type: 'tracting_door',
      doorIndex: 4,
      label: 'Tower Block C — 9th Floor',
      prompt: 'The elevator smells. Stairs?',
    },
  ],

  npcSpawns: [
    { x: 4, y: 4, type: 'stranger' },
    { x: 10, y: 5, type: 'stranger' },
  ],
}
