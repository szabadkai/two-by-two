// Church building interior - 15x12 tiles
// Contains: chapel with center aisle, classroom, bishop's office (accessible)
//
// Layout: Pew rows with walkable aisle down the center (x=3) and sides (x=1, x=6).
// NPCs sit on chairs (non-solid tile 24) so the player can stand next to any of them.
// Bishop's office has a door opening at (10, 8) so the player can walk in.

export const church = {
  id: 'church',
  name: 'Church Building',
  width: 15,
  height: 12,
  playerStart: { x: 3, y: 9 },
  companionStart: { x: 3, y: 8 },

  // Ground layer
  ground: [
    //0   1   2   3   4   5   6   7   8   9  10  11  12  13  14
    [13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13], // 0  north wall
    [13,  6,  6,  6,  6,  6,  6, 13,  6,  6,  6,  6,  6,  6, 13], // 1  pulpit | classroom table
    [13,  6,  6,  6,  6,  6,  6, 13,  6,  6,  6,  6,  6,  6, 13], // 2  pew row 1
    [13,  6,  6,  6,  6,  6,  6, 13,  6,  6,  6,  6,  6,  6, 13], // 3  pew row 2
    [13,  6,  6,  6,  6,  6,  6, 13,  6,  6,  6,  6,  6,  6, 13], // 4  pew row 3
    [13,  6,  6,  6,  6,  6,  6,  6,  6,  6,  6,  6,  6,  6, 13], // 5  hallway opens (wall gap at x=7)
    [13,  6,  6,  6,  6,  6,  6, 13,  6,  6,  6,  6,  6,  6, 13], // 6  back chapel
    [13,  6,  6,  6,  6,  6,  6, 13, 13, 13, 13,  6,  6, 13, 13], // 7  bishop's office north wall
    [13,  6,  6,  6,  6,  6,  6,  6,  6,  6,  6,  7,  7, 13, 13], // 8  office door at (10,8) — wall removed
    [13,  6,  6,  6,  6,  6,  6,  6,  6,  6,  6,  7,  7, 13, 13], // 9  bishop's office south
    [13, 13, 13, 13, 13, 30, 13, 13, 13, 13, 13, 13, 13, 13, 13], // 10 exit door at (5,10)
    [ 0,  0,  0,  0,  0,  5,  0,  0,  0,  0,  0,  0,  0,  0,  0], // 11 outside
  ],

  // Object layer — pews (27, solid) flank the aisle; NPC seats use chairs (24, non-solid)
  objects: [
    //0   1   2   3   4   5   6   7   8   9  10  11  12  13  14
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0, 28,  0,  0,  0,  0, 23,  0,  0,  0,  0,  0,  0], // pulpit(3,1) table(8,1)
    [ 0, 27,  0,  0,  0, 27,  0,  0, 24, 24, 24, 24,  0,  0,  0], // pew row 1 – seats at (2,2) (4,2) open
    [ 0, 27,  0,  0,  0, 27,  0,  0, 24, 24, 24, 24,  0,  0,  0], // pew row 2 – seats at (2,3) (4,3) open
    [ 0, 27,  0,  0,  0, 27,  0,  0,  0,  0,  0,  0,  0,  0,  0], // pew row 3 – seats at (2,4) (4,4) open
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 20,  0,  0,  0], // bishop's desk (11,8)
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 24,  0,  0], // bishop's chair (12,9)
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
    // Bishop's office — desk interaction
    {
      x: 11, y: 8,
      type: 'bishop',
      label: 'Bishop\'s Office',
      prompt: 'The bishop is in. Want to talk?',
    },
  ],
}
