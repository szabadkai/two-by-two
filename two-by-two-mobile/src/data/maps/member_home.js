// Member home (Kovács apartment) — 8x7 tiles
// Cozy Budapest flat with kitchen, living room

export const member_home = {
  id: 'member_home',
  name: 'Kovács Apartment',
  width: 8,
  height: 7,
  playerStart: { x: 4, y: 5 },
  companionStart: { x: 3, y: 5 },

  ground: [
    //0   1   2   3   4   5   6   7
    [10, 10, 10, 10, 10, 10, 10, 10], // 0
    [10,  7,  7,  7, 10,  1,  1, 10], // 1  kitchen | living room
    [10,  7,  7,  7, 10,  1,  1, 10], // 2
    [10,  1,  1,  1,  1,  1,  1, 10], // 3  hallway
    [10,  1,  1,  1,  1,  1,  1, 10], // 4
    [10,  1,  1,  1,  1,  1,  1, 10], // 5
    [10, 10, 10, 10, 30, 10, 10, 10], // 6  door at (4,6)
  ],

  objects: [
    [ 0,  0,  0,  0,  0,  0,  0,  0],
    [ 0, 25, 26,  0,  0, 23,  0,  0], // stove(1,1), counter(2,1), table(5,1)
    [ 0,  0,  0,  0,  0, 24, 24,  0], // chairs(5-6,2)
    [ 0,  0,  0,  0,  0,  0,  0,  0],
    [ 0, 22,  0,  0,  0,  0, 22,  0], // bookshelves(1,4), (6,4)
    [ 0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0],
  ],

  interactions: [
    // Front door
    {
      x: 4, y: 6,
      type: 'door',
      target: 'street',
      targetPos: { x: 12, y: 3 },
      label: 'Go Outside',
      prompt: 'Leave the Kovács apartment?',
    },
    // Kitchen table — member visit activity
    {
      x: 5, y: 1,
      type: 'activity',
      activity: 'member_visit',
      label: 'Eat with Kovács Family',
      prompt: 'Sister Kovács insists you sit. Something smells amazing.',
    },
    // Bookshelf — companion study
    {
      x: 1, y: 4,
      type: 'activity',
      activity: 'companion_study',
      label: 'Study Together',
      prompt: 'Study with your companion at the Kovács place?',
    },
  ],

  npcSpawns: [
    { x: 2, y: 2, type: 'npc_female', name: 'Sister Kovács' },
  ],
}
