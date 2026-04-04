// Church building interior - 15x12 tiles
// Contains: chapel, classroom, bishop's office

export const church = {
  id: 'church',
  name: 'Church Building',
  width: 15,
  height: 12,
  playerStart: { x: 5, y: 9 },
  companionStart: { x: 4, y: 9 },

  // Ground layer
  ground: [
    //0   1   2   3   4   5   6   7   8   9  10  11  12  13  14
    [13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13], // 0
    [13,  6,  6,  6,  6,  6,  6, 13,  6,  6,  6,  6,  6,  6, 13], // 1  chapel | classroom
    [13,  6,  6,  6,  6,  6,  6, 13,  6,  6,  6,  6,  6,  6, 13], // 2
    [13,  6,  6,  6,  6,  6,  6, 13,  6,  6,  6,  6,  6,  6, 13], // 3
    [13,  6,  6,  6,  6,  6,  6, 13,  6,  6,  6,  6,  6,  6, 13], // 4
    [13,  6,  6,  6,  6,  6,  6,  6,  6,  6,  6,  6,  6,  6, 13], // 5  hallway opens
    [13,  6,  6,  6,  6,  6,  6, 13,  6,  6,  6,  6,  6,  6, 13], // 6
    [13,  6,  6,  6,  6,  6,  6, 13, 13, 13, 13,  6,  6, 13, 13], // 7  bishop's office wall
    [13,  6,  6,  6,  6,  6,  6,  6,  6,  6, 13,  7,  7, 13, 13], // 8
    [13,  6,  6,  6,  6,  6,  6,  6,  6,  6, 13,  7,  7, 13, 13], // 9  bishop's office
    [13, 13, 13, 13, 13, 30, 13, 13, 13, 13, 13, 13, 13, 13, 13], // 10 - door at (5,10)
    [ 0,  0,  0,  0,  0,  5,  0,  0,  0,  0,  0,  0,  0,  0,  0], // 11 - outside
  ],

  // Object layer
  objects: [
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0, 28,  0,  0,  0,  0, 23,  0,  0,  0,  0,  0,  0], // pulpit(3,1), table(8,1)
    [ 0, 27, 27,  0, 27, 27,  0,  0, 24, 24, 24, 24,  0,  0,  0], // pews, chairs
    [ 0, 27, 27,  0, 27, 27,  0,  0, 24, 24, 24, 24,  0,  0,  0],
    [ 0, 27, 27,  0, 27, 27,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 20,  0,  0,  0], // desk in bishop's office
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 24,  0,  0,  0], // chair
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
  ],

  interactions: [
    // Door back to street
    {
      x: 5, y: 10,
      type: 'door',
      target: 'street',
      targetPos: { x: 27, y: 3 },
      label: 'Exit Church',
      prompt: 'Go back outside?',
    },
    // Pulpit - teaching
    {
      x: 3, y: 1,
      type: 'activity',
      activity: 'teach_lesson',
      label: 'Teach at Pulpit',
      prompt: 'Teach your investigator here?',
    },
    // Classroom area
    {
      x: 8, y: 1,
      type: 'activity',
      activity: 'english_class',
      label: 'English Class',
      prompt: 'Teach the English class?',
    },
    // Service project (cleaning)
    {
      x: 3, y: 6,
      type: 'activity',
      activity: 'service_project',
      label: 'Clean Chapel',
      prompt: 'Help clean the chapel?',
    },
    // Bishop's office
    {
      x: 11, y: 8,
      type: 'bishop',
      label: 'Bishop\'s Office',
      prompt: 'The bishop is in. Want to talk?',
    },
  ],
}
