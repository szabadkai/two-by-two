// Kőbánya district — 14×10 tiles
// Working class, old brewery area. Hard difficulty.

export const district_kobanya = {
  id: 'district_kobanya',
  name: 'Kőbánya',
  width: 14,
  height: 10,
  playerStart: { x: 7, y: 7 },
  companionStart: { x: 6, y: 7 },

  ground: [
    // Row 0: factory/warehouse roofs
    [52,52,52,52,52, 0, 0, 0, 0,52,52,52,52,52],
    // Row 1: building faces
    [11,11,11,51,11, 0, 0, 0, 0,11,51,11,11,11],
    // Row 2: base with doors
    [11,30,11,11,30, 0, 0, 0, 0,11,30,11,30,11],
    // Row 3: sidewalk
    [ 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    // Row 4: road
    [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    // Row 5: road
    [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    // Row 6: sidewalk south
    [ 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    // Row 7: south sidewalk / shops
    [53,30,53, 5, 5, 5, 5, 5, 5, 5, 5,53,30,53],
    // Row 8: alley
    [ 3, 3, 3, 3, 3, 3,33, 3, 3, 3, 3, 3, 3, 3],
    // Row 9: empty lot
    [ 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  ],

  objects: (() => {
    const o = Array.from({ length: 10 }, () => Array(14).fill(0))
    o[3][6] = 44  // bench
    o[6][3] = 44  // bench
    o[9][2] = 40  // tree
    o[9][8] = 40  // tree
    o[9][12] = 41 // bush
    return o
  })(),

  interactions: [
    // Bus stop (return)
    {
      x: 6, y: 8,
      type: 'tram_return',
      label: 'Bus Stop',
      prompt: 'Take the bus back to Ferencváros?',
    },
    // Door 1 — brick building
    {
      x: 1, y: 2,
      type: 'tracting_door',
      doorIndex: 0,
      label: 'Brick Apartment',
      prompt: 'Knock on the heavy door?',
    },
    // Door 2
    {
      x: 4, y: 2,
      type: 'tracting_door',
      doorIndex: 1,
      label: 'Factory Worker Housing',
      prompt: 'Ring the buzzer?',
    },
    // Door 3
    {
      x: 10, y: 2,
      type: 'tracting_door',
      doorIndex: 2,
      label: 'Old Brewery Flats',
      prompt: 'Try the converted brewery flats?',
    },
    // Door 4
    {
      x: 13, y: 2,
      type: 'tracting_door',
      doorIndex: 3,
      label: 'Corner Building',
      prompt: 'Knock here?',
    },
    // Door 5 — shop
    {
      x: 1, y: 7,
      type: 'tracting_door',
      doorIndex: 4,
      label: 'Small Shop',
      prompt: 'Talk to the shopkeeper?',
    },
  ],

  npcSpawns: [
    { x: 3, y: 4, type: 'stranger' },
    { x: 10, y: 5, type: 'stranger' },
    { x: 8, y: 3, type: 'stranger' },
  ],
}
