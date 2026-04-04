// Internet Café — 10x7 tiles
// Very 2004 Budapest: CRT monitors, slow DSL, cheap coffee
// Activities: letters_home, pday_study

export const internet_cafe = {
  id: 'internet_cafe',
  name: 'Internet Café',
  width: 10,
  height: 7,
  playerStart: { x: 5, y: 5 },
  companionStart: { x: 4, y: 5 },

  ground: [
    //0   1   2   3   4   5   6   7   8   9
    [10, 10, 10, 10, 10, 10, 10, 10, 10, 10], // 0
    [10,  1,  1,  1,  1,  1,  1,  1,  1, 10], // 1
    [10,  1,  1,  1,  1,  1,  1,  1,  1, 10], // 2
    [10,  1,  1,  1,  1,  1,  1,  1,  1, 10], // 3
    [10,  1,  1,  1,  1,  1,  1,  1,  1, 10], // 4
    [10,  1,  1,  1,  1,  1,  1,  1,  1, 10], // 5
    [10, 10, 10, 10, 10, 30, 10, 10, 10, 10], // 6  door at (5,6)
  ],

  objects: [
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0, 20, 20,  0,  0,  0,  0, 20, 20,  0], // desks (computers) along walls
    [ 0, 24, 24,  0,  0,  0,  0, 24, 24,  0], // chairs
    [ 0,  0,  0,  0, 26,  0,  0,  0,  0,  0], // counter (coffee bar)
    [ 0, 20, 20,  0,  0,  0,  0, 20, 20,  0], // more desks
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
  ],

  interactions: [
    // Front door
    {
      x: 5, y: 6,
      type: 'door',
      target: 'street',
      targetPos: { x: 22, y: 3 },
      label: 'Go Outside',
      prompt: 'Leave the café?',
    },
    // Computer — write letters home
    {
      x: 1, y: 1,
      type: 'activity',
      activity: 'letters_home',
      label: 'Write Home',
      prompt: 'Email home? 200 Ft for 30 minutes of dial-up.',
    },
    // Another computer — extra study
    {
      x: 7, y: 1,
      type: 'activity',
      activity: 'pday_study',
      label: 'Study Online',
      prompt: 'Look up Hungarian grammar resources?',
    },
    // Coffee counter
    {
      x: 4, y: 3,
      type: 'activity',
      activity: 'buy_food',
      label: 'Buy Coffee',
      prompt: 'A kávé for 150 Ft? Cheap fuel.',
    },
  ],

  npcSpawns: [
    { x: 3, y: 3, type: 'stranger' },
    { x: 6, y: 5, type: 'stranger' },
  ],
}
