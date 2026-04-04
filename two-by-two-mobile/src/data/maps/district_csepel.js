// Csepel district — 14×10 tiles
// Island district, isolated, former steelworkers. Hard difficulty.

export const district_csepel = {
  id: 'district_csepel',
  name: 'Csepel',
  width: 14,
  height: 10,
  playerStart: { x: 1, y: 6 },
  companionStart: { x: 2, y: 6 },

  ground: [
    // Row 0: industrial skyline
    [52,52,52, 0, 0,52,52,52,52, 0, 0, 0,43,43],
    // Row 1: building faces
    [11,51,11, 0, 0,50,51,50,50, 0, 0, 0,43,43],
    // Row 2: doors
    [11,30,11, 5, 5,50,30,50,30, 5, 5, 5, 5, 5],
    // Row 3: sidewalk
    [ 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    // Row 4: road
    [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    // Row 5: road
    [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    // Row 6: sidewalk south
    [ 5,33, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    // Row 7: south buildings
    [50,50,30,50, 0, 0, 4, 4, 4, 0,50,30,50,50],
    // Row 8: empty lot / river
    [ 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    // Row 9: Danube
    [43,43,43,43,43,43,43,43,43,43,43,43,43,43],
  ],

  objects: (() => {
    const o = Array.from({ length: 10 }, () => Array(14).fill(0))
    o[3][4] = 44  // bench
    o[8][3] = 40  // tree
    o[8][7] = 40  // tree
    o[8][11] = 44 // bench by the river
    return o
  })(),

  interactions: [
    // HÉV return
    {
      x: 1, y: 6,
      type: 'tram_return',
      label: 'HÉV Station',
      prompt: 'Take the HÉV back to Pest?',
    },
    // Door 1
    {
      x: 1, y: 2,
      type: 'tracting_door',
      doorIndex: 0,
      label: 'Steelworkers\' Housing',
      prompt: 'Knock on the heavy iron door?',
    },
    // Door 2
    {
      x: 6, y: 2,
      type: 'tracting_door',
      doorIndex: 1,
      label: 'Block 4 — Staircase B',
      prompt: 'Try this staircase?',
    },
    // Door 3
    {
      x: 8, y: 2,
      type: 'tracting_door',
      doorIndex: 2,
      label: 'Block 4 — Staircase D',
      prompt: 'Ring the bell?',
    },
    // Door 4
    {
      x: 2, y: 7,
      type: 'tracting_door',
      doorIndex: 3,
      label: 'River Street House',
      prompt: 'Try the house near the Danube?',
    },
  ],

  npcSpawns: [
    { x: 5, y: 4, type: 'stranger' },
    { x: 10, y: 3, type: 'stranger' },
  ],
}
