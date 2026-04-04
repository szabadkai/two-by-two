// Budafok district — 14×10 tiles
// Hilly, wine cellars, quiet streets. Medium difficulty.

export const district_budafok = {
  id: 'district_budafok',
  name: 'Budafok',
  width: 14,
  height: 10,
  playerStart: { x: 7, y: 8 },
  companionStart: { x: 6, y: 8 },

  ground: [
    // Row 0: hillside
    [ 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    // Row 1: upper houses (hilltop)
    [ 4,10, 1,30, 4, 4, 4, 4, 4, 4,10, 1,30, 4],
    // Row 2: gardens/slope
    [ 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    // Row 3: stone path down the hill
    [ 2, 2, 2, 2, 5, 5, 5, 5, 5, 5, 2, 2, 2, 2],
    // Row 4: main road level
    [ 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    // Row 5: road
    [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    // Row 6: sidewalk south
    [ 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    // Row 7: lower houses / wine cellars
    [12,12,30,12, 4, 4, 4, 4, 4, 4,12,12,30,12],
    // Row 8: path
    [ 5, 5, 5, 5, 5, 5, 5,33, 5, 5, 5, 5, 5, 5],
    // Row 9: vineyard / garden
    [ 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  ],

  objects: (() => {
    const o = Array.from({ length: 10 }, () => Array(14).fill(0))
    // Trees on hill
    o[0][0] = 40; o[0][5] = 40; o[0][8] = 40; o[0][13] = 40
    o[2][2] = 42; o[2][6] = 42; o[2][11] = 42 // flowers
    // Vineyard posts
    o[9][2] = 41; o[9][5] = 41; o[9][8] = 41; o[9][11] = 41
    o[4][7] = 44 // bench on the main road
    return o
  })(),

  interactions: [
    // Bus stop return
    {
      x: 7, y: 8,
      type: 'tram_return',
      label: 'Bus Stop — Budafok',
      prompt: 'Take bus 33 back to Pest?',
    },
    // Door 1 — hilltop house
    {
      x: 3, y: 1,
      type: 'tracting_door',
      doorIndex: 0,
      label: 'Hilltop Cottage',
      prompt: 'Climb up and knock?',
    },
    // Door 2 — hilltop house
    {
      x: 12, y: 1,
      type: 'tracting_door',
      doorIndex: 1,
      label: 'House with a View',
      prompt: 'Try the house overlooking the valley?',
    },
    // Door 3 — wine cellar
    {
      x: 2, y: 7,
      type: 'tracting_door',
      doorIndex: 2,
      label: 'Wine Cellar Entrance',
      prompt: 'Knock on the cellar door? You smell oak barrels.',
    },
  ],

  npcSpawns: [
    { x: 6, y: 5, type: 'stranger' },
    { x: 11, y: 4, type: 'stranger' },
  ],
}
