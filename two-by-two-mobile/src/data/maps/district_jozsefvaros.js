// Józsefváros (VIII district) — 14×10 tiles
// Diverse, lively, sometimes rough. Hard difficulty.

export const district_jozsefvaros = {
  id: 'district_jozsefvaros',
  name: 'Józsefváros',
  width: 14,
  height: 10,
  playerStart: { x: 0, y: 6 },
  companionStart: { x: 1, y: 6 },

  ground: [
    // Row 0: building tops
    [52,52,52, 0,52,52,52,52,52, 0,52,52,52,52],
    // Row 1: building faces — diverse, colorful
    [50,51,50, 0,53,51,50,50,51, 0,50,51,53,50],
    // Row 2: doors
    [50,30,50, 0,53,30,50,50,30, 0,50,30,53,50],
    // Row 3: sidewalk
    [ 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    // Row 4: market / road
    [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    // Row 5: road
    [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    // Row 6: sidewalk south
    [ 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    // Row 7: south buildings
    [50,50,30,50, 0, 0, 5, 5, 0, 0,50,30,50,50],
    // Row 8: courtyard
    [ 5, 5, 5, 5, 5, 5, 5,33, 5, 5, 5, 5, 5, 5],
    // Row 9: back alley
    [ 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  ],

  objects: (() => {
    const o = Array.from({ length: 10 }, () => Array(14).fill(0))
    o[3][3] = 44  // bench
    o[6][6] = 44  // bench
    o[6][13] = 41 // bush
    o[3][9] = 40  // tree
    return o
  })(),

  interactions: [
    // Bus stop return
    {
      x: 7, y: 8,
      type: 'tram_return',
      label: 'Bus Stop — Baross utca',
      prompt: 'Catch the bus back?',
    },
    // Door 1
    {
      x: 1, y: 2,
      type: 'tracting_door',
      doorIndex: 0,
      label: 'Crumbling Stairwell',
      prompt: 'Brave this stairwell?',
    },
    // Door 2
    {
      x: 5, y: 2,
      type: 'tracting_door',
      doorIndex: 1,
      label: 'Above the Shop',
      prompt: 'Ring the bell above the shop?',
    },
    // Door 3
    {
      x: 8, y: 2,
      type: 'tracting_door',
      doorIndex: 2,
      label: 'Painted Door',
      prompt: 'Knock on the bright green door?',
    },
    // Door 4
    {
      x: 11, y: 2,
      type: 'tracting_door',
      doorIndex: 3,
      label: 'Top Floor Flat',
      prompt: 'Climb to the top floor?',
    },
  ],

  npcSpawns: [
    { x: 3, y: 4, type: 'stranger' },
    { x: 7, y: 3, type: 'stranger' },
    { x: 11, y: 6, type: 'stranger' },
  ],
}
