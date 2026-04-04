// Market Hall interior (Nagyvásárcsarnok-inspired) - 15x10 tiles
// Contains: food vendor, peanut butter stall, book vendor, clothing vendor

export const market = {
  id: 'market',
  name: 'Great Market Hall',
  width: 15,
  height: 10,
  playerStart: { x: 7, y: 8 },
  companionStart: { x: 6, y: 8 },

  // Ground layer
  ground: [
    //0   1   2   3   4   5   6   7   8   9  10  11  12  13  14
    [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10], // 0  north wall
    [10,  1,  1,  1, 10,  1,  1,  1,  1,  1, 10,  1,  1,  1, 10], // 1  stalls
    [10,  1,  1,  1, 10,  1,  1,  1,  1,  1, 10,  1,  1,  1, 10], // 2
    [10,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, 10], // 3  aisle
    [10,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, 10], // 4  aisle
    [10,  1,  1,  1, 10,  1,  1,  1,  1,  1, 10,  1,  1,  1, 10], // 5  stalls
    [10,  1,  1,  1, 10,  1,  1,  1,  1,  1, 10,  1,  1,  1, 10], // 6
    [10,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, 10], // 7  aisle
    [10,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, 10], // 8  entrance area
    [10, 10, 10, 10, 10, 10, 10, 30, 10, 10, 10, 10, 10, 10, 10], // 9  south wall, door at (7,9)
  ],

  // Object layer
  objects: [
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0, 26, 26,  0,  0, 26, 26, 26, 26,  0,  0, 26, 26,  0,  0], // counters (stalls)
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0, 26, 26,  0,  0, 26, 26, 26, 26,  0,  0, 26, 26,  0,  0], // counters (stalls)
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
  ],

  npcSpawns: [
    { x: 3, y: 3, type: 'shopper' },
    { x: 9, y: 4, type: 'shopper' },
    { x: 6, y: 7, type: 'shopper' },
    { x: 12, y: 7, type: 'shopper' },
  ],

  interactions: [
    // Door back to street
    {
      x: 7, y: 9,
      type: 'door',
      target: 'street',
      targetPos: { x: 8, y: 3 },
      label: 'Exit Market',
      prompt: 'Go back outside?',
    },
    // Food vendor (northwest stall)
    {
      x: 2, y: 1,
      type: 'activity',
      activity: 'buy_food',
      label: 'Food Vendor',
      prompt: 'Buy some groceries? Fresh peppers, kolbász, and túró rudi.',
    },
    // Peanut butter stall (north center stall)
    {
      x: 7, y: 1,
      type: 'activity',
      activity: 'buy_peanut_butter',
      label: 'Import Foods',
      prompt: 'They have American peanut butter! It costs a fortune, but...',
    },
    // Book vendor (southwest stall)
    {
      x: 2, y: 5,
      type: 'activity',
      activity: 'buy_books',
      label: 'Book Vendor',
      prompt: 'Browse the books? Hungarian phrasebooks and scriptures available.',
    },
    // Clothing vendor (southeast stall)
    {
      x: 12, y: 5,
      type: 'activity',
      activity: 'buy_clothes',
      label: 'Clothing Vendor',
      prompt: 'Need a new white shirt? Yours is looking a bit worn.',
    },
  ],
}
