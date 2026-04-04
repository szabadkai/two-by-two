// Tile size in source pixels (rendered at TILE_SCALE)
export const TILE_SIZE = 16
export const TILE_SCALE = 3
export const SCALED_TILE = TILE_SIZE * TILE_SCALE // 48px on screen

// Viewport dimensions in tiles
export const VIEW_COLS = 15
export const VIEW_ROWS = 10
export const CANVAS_WIDTH = VIEW_COLS * SCALED_TILE  // 720
export const CANVAS_HEIGHT = VIEW_ROWS * SCALED_TILE // 480

// Tile types
export const TILES = {
  // Floors
  0: { name: 'void', color: '#0e0c0a', solid: false },
  1: { name: 'wood_floor', color: '#3d2f1e', solid: false },
  2: { name: 'stone_floor', color: '#4a4035', solid: false },
  3: { name: 'cobblestone', color: '#3a352e', solid: false },
  4: { name: 'grass', color: '#2a3520', solid: false },
  5: { name: 'sidewalk', color: '#4a4540', solid: false },
  6: { name: 'church_floor', color: '#352a20', solid: false },
  7: { name: 'rug', color: '#5a2020', solid: false },

  // Walls
  10: { name: 'wall', color: '#2a2520', solid: true },
  11: { name: 'brick_wall', color: '#5a3025', solid: true },
  12: { name: 'stone_wall', color: '#4a4540', solid: true },
  13: { name: 'church_wall', color: '#3a3530', solid: true },
  14: { name: 'fence', color: '#4a3520', solid: true },

  // Furniture & Objects
  20: { name: 'desk', color: '#5a4530', solid: true },
  21: { name: 'bed', color: '#2a3050', solid: true },
  22: { name: 'bookshelf', color: '#4a3520', solid: true },
  23: { name: 'table', color: '#5a4030', solid: true },
  24: { name: 'chair', color: '#4a3525', solid: false },
  25: { name: 'stove', color: '#3a3a3a', solid: true },
  26: { name: 'counter', color: '#4a4035', solid: true },
  27: { name: 'pew', color: '#4a3520', solid: true },
  28: { name: 'pulpit', color: '#5a4530', solid: true },
  29: { name: 'tram_track', color: '#555555', solid: false },

  // Interactive / Special
  30: { name: 'door', color: '#6a4a20', solid: false, interaction: 'door' },
  31: { name: 'door_church', color: '#5a4a30', solid: false, interaction: 'door' },
  32: { name: 'door_member', color: '#6a5030', solid: false, interaction: 'door' },
  33: { name: 'tram_stop', color: '#c4793c', solid: false, interaction: 'tram' },

  // Nature
  40: { name: 'tree', color: '#1a3010', solid: true },
  41: { name: 'bush', color: '#2a4015', solid: true },
  42: { name: 'flower', color: '#6a3040', solid: false },
  43: { name: 'water', color: '#1a2540', solid: true },
  44: { name: 'bench', color: '#5a4530', solid: true },

  // Buildings (exterior faces)
  50: { name: 'building_wall', color: '#5a5040', solid: true },
  51: { name: 'building_window', color: '#2a3550', solid: true },
  52: { name: 'building_roof', color: '#4a2520', solid: true },
  53: { name: 'shop_front', color: '#4a4535', solid: true },
  54: { name: 'church_exterior', color: '#5a5548', solid: true },
}

// Tile decoration overlays (drawn on top of base tile)
export const TILE_DECORATIONS = {
  desk: (ctx, x, y, s) => {
    // Draw a book on the desk
    ctx.fillStyle = '#8a7050'
    ctx.fillRect(x + 3 * s, y + 4 * s, 10 * s, 8 * s)
    ctx.fillStyle = '#e8ddd0'
    ctx.fillRect(x + 4 * s, y + 5 * s, 8 * s, 6 * s)
  },
  bed: (ctx, x, y, s) => {
    // Pillow
    ctx.fillStyle = '#e8ddd0'
    ctx.fillRect(x + 2 * s, y + 2 * s, 5 * s, 4 * s)
    // Blanket
    ctx.fillStyle = '#3a4060'
    ctx.fillRect(x + 2 * s, y + 7 * s, 12 * s, 7 * s)
  },
  bookshelf: (ctx, x, y, s) => {
    // Book spines
    const colors = ['#8a3030', '#3a5a3a', '#3a3a6a', '#6a5a3a']
    colors.forEach((c, i) => {
      ctx.fillStyle = c
      ctx.fillRect(x + (2 + i * 3) * s, y + 2 * s, 2 * s, 12 * s)
    })
  },
  tram_stop: (ctx, x, y, s) => {
    // Sign post
    ctx.fillStyle = '#888'
    ctx.fillRect(x + 7 * s, y + 0, 2 * s, 12 * s)
    // Sign
    ctx.fillStyle = '#c4793c'
    ctx.fillRect(x + 3 * s, y + 1 * s, 10 * s, 5 * s)
    ctx.fillStyle = '#1a1714'
    ctx.font = `${3 * s}px monospace`
    ctx.fillText('4', x + 7 * s, y + 5 * s)
  },
  door: (ctx, x, y, s) => {
    // Door frame
    ctx.fillStyle = '#5a3a15'
    ctx.fillRect(x + 3 * s, y + 0, 10 * s, 16 * s)
    // Door handle
    ctx.fillStyle = '#c4793c'
    ctx.fillRect(x + 10 * s, y + 8 * s, 2 * s, 2 * s)
  },
  bench: (ctx, x, y, s) => {
    // Bench seat
    ctx.fillStyle = '#6a5535'
    ctx.fillRect(x + 1 * s, y + 6 * s, 14 * s, 3 * s)
    // Legs
    ctx.fillStyle = '#3a2a15'
    ctx.fillRect(x + 2 * s, y + 9 * s, 2 * s, 5 * s)
    ctx.fillRect(x + 12 * s, y + 9 * s, 2 * s, 5 * s)
  },
  tree: (ctx, x, y, s) => {
    // Trunk
    ctx.fillStyle = '#4a3015'
    ctx.fillRect(x + 6 * s, y + 9 * s, 4 * s, 7 * s)
    // Canopy
    ctx.fillStyle = '#2a5018'
    ctx.fillRect(x + 2 * s, y + 1 * s, 12 * s, 10 * s)
    ctx.fillStyle = '#1a4010'
    ctx.fillRect(x + 4 * s, y + 3 * s, 8 * s, 6 * s)
  },
}
