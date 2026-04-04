// Zugló district — 14×10 tiles
// Leafy residential streets With family homes. Easy difficulty.

export const district_zuglo = {
  id: 'district_zuglo',
  name: 'Zugló',
  width: 14,
  height: 10,
  playerStart: { x: 0, y: 4 },
  companionStart: { x: 0, y: 5 },

  ground: [
    // Row 0: gardens / fences
    [ 4, 4,14, 4, 4, 4,14, 4, 4, 4,14, 4, 4, 4],
    // Row 1: small houses
    [10, 1,30, 4,10, 1,30, 4,10, 1,30, 4, 4, 4],
    // Row 2: yards
    [ 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    // Row 3: sidewalk north
    [ 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    // Row 4: quiet road
    [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    // Row 5: quiet road
    [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    // Row 6: sidewalk south
    [ 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    // Row 7: south houses
    [ 4, 4, 4,10, 1,30, 4, 4, 4, 4, 4, 4, 4, 4],
    // Row 8: gardens
    [ 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    // Row 9: back fence / tram
    [14,14,14, 4,33, 4,14,14,14, 4, 4, 4, 4, 4],
  ],

  objects: (() => {
    const o = Array.from({ length: 10 }, () => Array(14).fill(0))
    // Trees everywhere — it's Zugló
    o[0][1] = 40; o[0][5] = 40; o[0][9] = 40; o[0][13] = 40
    o[2][3] = 42; o[2][7] = 42; o[2][11] = 42 // flowers in gardens
    o[8][1] = 40; o[8][6] = 40; o[8][10] = 40
    o[6][12] = 44 // bench
    return o
  })(),

  interactions: [
    // Tram return
    {
      x: 4, y: 9,
      type: 'tram_return',
      label: 'Tram Stop',
      prompt: 'Take tram 69 back?',
    },
    // Door 1 — house with garden
    {
      x: 2, y: 1,
      type: 'tracting_door',
      doorIndex: 0,
      label: 'Family Home',
      prompt: 'Open the garden gate and knock?',
    },
    // Door 2
    {
      x: 6, y: 1,
      type: 'tracting_door',
      doorIndex: 1,
      label: 'House with Roses',
      prompt: 'Ring the doorbell? A dog is barking inside.',
    },
    // Door 3
    {
      x: 10, y: 1,
      type: 'tracting_door',
      doorIndex: 2,
      label: 'Corner House',
      prompt: 'Try the corner house?',
    },
  ],

  npcSpawns: [
    { x: 7, y: 4, type: 'stranger' },
    { x: 3, y: 6, type: 'stranger' },
  ],
}
