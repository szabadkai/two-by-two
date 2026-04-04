// Városliget (City Park) — 14x10 tiles
// Open green area for P-Day activities
// Activities: sports, companion_activity, explore_city

export const park = {
  id: 'park',
  name: 'Városliget Park',
  width: 14,
  height: 10,
  playerStart: { x: 7, y: 8 },
  companionStart: { x: 6, y: 8 },

  ground: [
    //0   1   2   3   4   5   6   7   8   9  10  11  12  13
    [ 4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4], // 0
    [ 4,  4,  4,  4,  5,  5,  5,  5,  5,  5,  4,  4,  4,  4], // 1  path
    [ 4,  4,  4,  5,  4,  4,  4,  4,  4,  4,  5,  4,  4,  4], // 2
    [ 4,  4,  5,  4,  4,  3,  3,  3,  3,  4,  4,  5,  4,  4], // 3  court
    [ 4,  5,  4,  4,  3,  3,  3,  3,  3,  3,  4,  4,  5,  4], // 4
    [ 4,  5,  4,  4,  3,  3,  3,  3,  3,  3,  4,  4,  5,  4], // 5
    [ 4,  4,  5,  4,  4,  4,  4,  4,  4,  4,  4,  5,  4,  4], // 6
    [ 4,  4,  4,  5,  5,  4,  4,  4,  4,  5,  5,  4,  4,  4], // 7  path
    [ 4,  4,  4,  4,  4,  5,  5,  5,  5,  4,  4,  4,  4,  4], // 8  entrance
    [ 4,  4,  4,  4,  4,  5, 30,  5,  5,  4,  4,  4,  4,  4], // 9  gate at (6,9)
  ],

  objects: (() => {
    const o = Array.from({ length: 10 }, () => Array(14).fill(0))
    // Trees around perimeter
    o[0][1] = 40; o[0][4] = 40; o[0][9] = 40; o[0][12] = 40
    o[1][0] = 40; o[1][12] = 40
    o[2][0] = 40; o[2][13] = 40
    o[6][0] = 40; o[6][13] = 40
    o[7][0] = 40; o[7][12] = 40
    o[8][1] = 40; o[8][12] = 40
    // Benches
    o[1][6] = 44; o[1][7] = 44
    o[7][3] = 44; o[7][10] = 44
    return o
  })(),

  interactions: [
    // Gate back to street
    {
      x: 6, y: 9,
      type: 'door',
      target: 'street',
      targetPos: { x: 20, y: 8 },
      label: 'Back to Street',
      prompt: 'Leave the park?',
    },
    // Basketball/foci court
    {
      x: 6, y: 4,
      type: 'activity',
      activity: 'sports',
      label: 'Play Sports',
      prompt: 'Join the pickup game? The Hungarians play rough.',
    },
    // Bench — companion outing
    {
      x: 1, y: 6,
      type: 'activity',
      activity: 'companion_activity',
      label: 'Companion Outing',
      prompt: 'Sit with your companion and just talk for a while?',
    },
    // Path loop — explore city
    {
      x: 10, y: 2,
      type: 'activity',
      activity: 'explore_city',
      label: 'Explore the Park',
      prompt: 'Wander through Városliget. The castle is beautiful this time of year.',
    },
    // Bench — personal study
    {
      x: 7, y: 7,
      type: 'activity',
      activity: 'personal_study',
      label: 'Study on a Bench',
      prompt: 'Open your scriptures under the trees?',
    },
  ],

  npcSpawns: [
    { x: 4, y: 5, type: 'stranger' },
    { x: 9, y: 3, type: 'stranger' },
    { x: 3, y: 7, type: 'stranger' },
  ],
}
