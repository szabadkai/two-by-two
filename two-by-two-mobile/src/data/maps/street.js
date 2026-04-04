// Street / Neighborhood - 30x20 tiles
// Main overworld area connecting all locations
// Contains: apartment door, church door, member homes, tram stop, park area

export const street = {
  id: 'street',
  name: 'Ferencváros',
  width: 30,
  height: 20,
  playerStart: { x: 15, y: 3 },
  companionStart: { x: 14, y: 3 },

  // Ground layer
  // Legend: 3=cobblestone road, 5=sidewalk, 4=grass, 40=tree, 50-54=buildings
  ground: [
    // Row 0: Building tops
    [52,52,52,52,52,52, 0, 0,52,52,52,52,52,52,52,52,52,52, 0, 0,52,52,52,52,52,54,54,54,54,54],
    // Row 1: Building faces
    [50,51,50,50,51,50, 0, 0,50,51,50,50,50,51,50,50,51,50, 0, 0,50,50,51,50,50,54,51,54,51,54],
    // Row 2: Building base with doors
    [50,50,30,50,50,50, 0, 0,53,50,50,50,32,50,50,30,50,50, 0, 0,50,50,30,50,50,54,54,31,54,54],
    // Row 3: Sidewalk
    [ 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    // Row 4: Road
    [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    // Row 5: Road with tram tracks
    [29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29],
    // Row 6: Road
    [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    // Row 7: Sidewalk south
    [ 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    // Row 8: Tram stop area + park entrance
    [ 5, 5,33, 5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4],
    // Row 9: Park / open area
    [ 5, 5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 30, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    // Row 10:
    [ 5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    // Row 11: Park with bench
    [ 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    // Row 12:
    [ 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    // Row 13: Danube bank
    [ 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    // Row 14: Danube
    [43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43],
    // Row 15:
    [43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43],
    // Row 16:
    [43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43],
    // Row 17:
    [43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43],
    // Row 18:
    [43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43],
    // Row 19:
    [43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43],
  ],

  // Object layer
  objects: (() => {
    const o = Array.from({ length: 20 }, () => Array(30).fill(0))
    // Trees in park
    o[9][7] = 40; o[9][11] = 40; o[10][5] = 40; o[10][9] = 40
    o[11][7] = 40; o[11][13] = 40; o[12][6] = 40; o[12][10] = 40
    // Trees on south side
    o[9][22] = 40; o[10][25] = 40; o[11][23] = 40; o[12][27] = 40
    // Benches
    o[11][9] = 44; o[13][8] = 44; o[13][14] = 44; o[13][22] = 44
    // Bushes near buildings
    o[8][6] = 41; o[8][19] = 41
    return o
  })(),

  // Interactive spots
  interactions: [
    // Apartment door (back inside)
    {
      x: 15, y: 2,
      type: 'door',
      target: 'apartment',
      targetPos: { x: 5, y: 7 },
      label: 'Your Apartment',
      prompt: 'Go back inside?',
    },
    // Church door
    {
      x: 27, y: 2,
      type: 'door',
      target: 'church',
      targetPos: { x: 5, y: 8 },
      label: 'Church Building',
      prompt: 'Enter the church?',
    },
    // Member home (Kovács apartment) — door
    {
      x: 12, y: 2,
      type: 'door',
      target: 'member_home',
      targetPos: { x: 4, y: 5 },
      label: 'Kovács Apartment',
      prompt: 'Visit the Kovács family?',
    },
    // Market entrance
    {
      x: 8, y: 2,
      type: 'door',
      target: 'market',
      targetPos: { x: 7, y: 8 },
      label: 'Great Market Hall',
      prompt: 'Enter the market?',
    },
    // Tram stop
    {
      x: 2, y: 8,
      type: 'tram',
      label: 'Tram Stop',
      prompt: 'Take the tram somewhere?',
    },
    // Park bench (rest / letters home on P-Day)
    {
      x: 9, y: 11,
      type: 'activity',
      activity: 'personal_study',
      label: 'Sit on Bench',
      prompt: 'Sit and study by the Danube?',
    },
    // Danube bank bench
    {
      x: 14, y: 13,
      type: 'activity',
      activity: 'explore_city',
      label: 'Danube Promenade',
      prompt: 'Walk along the Danube?',
      pdayOnly: true,
    },
    // Another apartment door (for contacting)
    {
      x: 2, y: 2,
      type: 'activity',
      activity: 'street_contact',
      label: 'Knock Doors',
      prompt: 'Go door-to-door contacting?',
    },
    // Internet Café
    {
      x: 22, y: 2,
      type: 'door',
      target: 'internet_cafe',
      targetPos: { x: 5, y: 5 },
      label: 'Internet Café',
      prompt: 'Drop in for email and cheap coffee?',
    },
    // Park gate
    {
      x: 20, y: 9,
      type: 'door',
      target: 'park',
      targetPos: { x: 7, y: 8 },
      label: 'Városliget Park',
      prompt: 'Head into the park?',
    },
  ],

  // NPC spawn points (filled dynamically based on game state)
  npcSpawns: [
    { x: 5, y: 7, type: 'stranger' },
    { x: 10, y: 7, type: 'stranger' },
    { x: 18, y: 3, type: 'stranger' },
    { x: 22, y: 7, type: 'stranger' },
    { x: 8, y: 10, type: 'stranger' },
  ],
}
