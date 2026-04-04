// Óbuda district — 14×10 tiles
// Roman ruins mixed with panel blocks. Easy difficulty.

export const district_obuda = {
  id: 'district_obuda',
  name: 'Óbuda',
  width: 14,
  height: 10,
  playerStart: { x: 1, y: 8 },
  companionStart: { x: 2, y: 8 },

  ground: [
    // Row 0: building tops
    [52,52,52,52, 0, 0,52,52,52, 0, 0,52,52,52],
    // Row 1: building faces
    [50,51,50,50, 0, 0,50,51,50, 0, 0,50,51,50],
    // Row 2: building base with doors
    [50,30,50,50, 0, 0,50,30,50, 0, 0,50,30,50],
    // Row 3: sidewalk
    [ 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    // Row 4: cobblestone road
    [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    // Row 5: road with tram tracks
    [29,29,29,29,29,29,29,29,29,29,29,29,29,29],
    // Row 6: cobblestone road
    [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    // Row 7: sidewalk south
    [ 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    // Row 8: south sidewalk / entry area
    [ 5,33, 5, 5, 4, 4, 5, 5, 5, 4, 4, 5, 5, 5],
    // Row 9: park / ruins
    [ 4, 4, 4, 2, 2, 4, 4, 4, 4, 4, 2, 2, 4, 4],
  ],

  objects: (() => {
    const o = Array.from({ length: 10 }, () => Array(14).fill(0))
    o[9][3] = 12  // stone wall ruin
    o[9][4] = 12  // stone wall ruin
    o[9][10] = 12 // stone wall ruin
    o[9][11] = 12 // stone wall ruin
    o[8][5] = 40  // tree
    o[8][10] = 40 // tree
    o[7][6] = 44  // bench
    return o
  })(),

  interactions: [
    // Tram stop (exit point)
    {
      x: 1, y: 8,
      type: 'tram_return',
      label: 'Tram Stop',
      prompt: 'Take the tram back?',
    },
    // Door 1 — left building
    {
      x: 1, y: 2,
      type: 'tracting_door',
      doorIndex: 0,
      label: 'Knock on Door',
      prompt: 'Ring the bell at this apartment?',
    },
    // Door 2 — center building
    {
      x: 7, y: 2,
      type: 'tracting_door',
      doorIndex: 1,
      label: 'Knock on Door',
      prompt: 'Try this apartment?',
    },
    // Door 3 — right building
    {
      x: 12, y: 2,
      type: 'tracting_door',
      doorIndex: 2,
      label: 'Knock on Door',
      prompt: 'Knock here?',
    },
    // Door 4 — south side (hidden in the ruins area, bonus)
    {
      x: 4, y: 9,
      type: 'tracting_door',
      doorIndex: 3,
      label: 'Approach person by ruins',
      prompt: 'Someone\'s sitting by the Roman ruins. Talk to them?',
    },
  ],

  npcSpawns: [
    { x: 5, y: 3, type: 'stranger' },
    { x: 10, y: 7, type: 'stranger' },
  ],
}
