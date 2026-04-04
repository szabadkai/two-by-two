// Apartment interior - 12x10 tiles
// Player starts here each morning
// Contains: desk (study), bed, door to street

export const apartment = {
  id: 'apartment',
  name: 'Your Apartment',
  width: 12,
  height: 10,
  playerStart: { x: 5, y: 5 },
  companionStart: { x: 4, y: 5 },

  // Ground layer
  ground: [
    //0   1   2   3   4   5   6   7   8   9  10  11
    [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10], // 0
    [10,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, 10], // 1
    [10,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, 10], // 2
    [10,  1,  1,  7,  7,  1,  1,  1,  1,  1,  1, 10], // 3
    [10,  1,  1,  7,  7,  1,  1,  1,  1,  1,  1, 10], // 4
    [10,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, 10], // 5
    [10,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, 10], // 6
    [10,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, 10], // 7
    [10, 10, 10, 10, 10, 30, 10, 10, 10, 10, 10, 10], // 8 - door at (5,8)
    [ 0,  0,  0,  0,  0,  5,  0,  0,  0,  0,  0,  0], // 9 - outside step
  ],

  // Object layer (0 = empty)
  objects: [
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0, 20,  0,  0,  0,  0,  0,  0,  0, 22,  0,  0], // desk at (1,1), bookshelf at (9,1)
    [ 0, 24,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0], // chair at (1,2)
    [ 0,  0,  0,  0,  0,  0,  0,  0, 21, 21,  0,  0], // bed at (8-9,3)
    [ 0,  0,  0,  0,  0,  0,  0,  0, 21, 21,  0,  0], // bed continues
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0, 25, 26,  0,  0,  0], // stove(7,6), counter(8,6)
    [ 0, 23,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0], // table at (1,7)
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
  ],

  // Interactive spots
  interactions: [
    {
      x: 1, y: 1,
      type: 'activity',
      activity: 'study_language',
      label: 'Study Hungarian',
      prompt: 'Study at your desk?',
    },
    {
      x: 1, y: 2,
      type: 'activity',
      activity: 'personal_study',
      label: 'Personal Study',
      prompt: 'Scripture study at your desk?',
    },
    {
      x: 9, y: 1,
      type: 'activity',
      activity: 'companion_study',
      label: 'Companion Study',
      prompt: 'Study with your companion?',
    },
    {
      x: 8, y: 3,
      type: 'rest',
      label: 'Rest',
      prompt: 'Take a nap? (Skip time slot)',
    },
    {
      x: 7, y: 6,
      type: 'activity',
      activity: 'laundry',
      label: 'Do Laundry',
      prompt: 'Run the washing machine? It makes concerning noises.',
    },
    {
      x: 5, y: 8,
      type: 'door',
      target: 'street',
      targetPos: { x: 15, y: 2 },
      label: 'Go Outside',
      prompt: 'Head out to the street?',
    },
  ],
}
