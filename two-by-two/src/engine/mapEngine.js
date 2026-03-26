import { TILES, TILE_DECORATIONS, TILE_SIZE, TILE_SCALE, SCALED_TILE, VIEW_COLS, VIEW_ROWS, CANVAS_WIDTH, CANVAS_HEIGHT } from '../data/tiles'
import { MAPS } from '../data/maps/index'

/**
 * Core map rendering and collision engine
 */

// Time-of-day lighting overlays
const TIME_TINTS = {
  morning: { color: 'rgba(200, 180, 120, 0.08)', sky: '#2a2820' },
  afternoon: { color: 'rgba(180, 160, 100, 0.04)', sky: '#252320' },
  evening: { color: 'rgba(40, 30, 80, 0.2)', sky: '#1a1520' },
}

/**
 * Get tile at position (checks objects layer first, then ground)
 */
export function getTileAt(map, x, y, layer = 'ground') {
  if (x < 0 || y < 0 || x >= map.width || y >= map.height) {
    return TILES[10] // wall for out of bounds
  }
  const tileId = map[layer][y][x]
  return TILES[tileId] || TILES[0]
}

/**
 * Check if a position is walkable (not solid)
 */
export function isWalkable(map, x, y) {
  if (x < 0 || y < 0 || x >= map.width || y >= map.height) return false

  const groundTile = TILES[map.ground[y][x]]
  const objectTile = map.objects[y][x] ? TILES[map.objects[y][x]] : null

  if (groundTile?.solid) return false
  if (objectTile?.solid) return false

  // NPCs block movement (so you walk up to them, not through them)
  if (map.npcSpawns) {
    const npcBlocking = map.npcSpawns.some(n => n.x === x && n.y === y)
    if (npcBlocking) return false
  }

  return true
}

/**
 * Find interaction at tile position (checks both static interactions and NPC spawns)
 */
export function getInteractionAt(map, x, y) {
  // Check static interactions first
  const staticInteraction = map.interactions.find(i => i.x === x && i.y === y)
  if (staticInteraction) return staticInteraction

  // Check NPC spawns — strangers on the street are interactable for contacting
  if (map.npcSpawns) {
    const npc = map.npcSpawns.find(n => n.x === x && n.y === y)
    if (npc) {
      return {
        x: npc.x,
        y: npc.y,
        type: 'activity',
        activity: 'street_contact',
        label: 'Talk to Stranger',
        prompt: 'Approach this person?',
      }
    }
  }

  return null
}

/**
 * Find interaction adjacent to player (in the direction they face)
 */
export function getAdjacentInteraction(map, playerX, playerY, direction) {
  const offsets = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  }
  const offset = offsets[direction]
  const checkX = playerX + offset.x
  const checkY = playerY + offset.y
  return getInteractionAt(map, checkX, checkY)
}

/**
 * Calculate camera offset to center on player
 */
export function getCameraOffset(map, playerX, playerY) {
  // Target: center player in viewport
  let camX = playerX * SCALED_TILE - (CANVAS_WIDTH / 2) + (SCALED_TILE / 2)
  let camY = playerY * SCALED_TILE - (CANVAS_HEIGHT / 2) + (SCALED_TILE / 2)

  // Clamp camera to map bounds
  const maxCamX = map.width * SCALED_TILE - CANVAS_WIDTH
  const maxCamY = map.height * SCALED_TILE - CANVAS_HEIGHT

  camX = Math.max(0, Math.min(camX, maxCamX))
  camY = Math.max(0, Math.min(camY, maxCamY))

  // If map is smaller than viewport, center it
  if (map.width * SCALED_TILE < CANVAS_WIDTH) {
    camX = -(CANVAS_WIDTH - map.width * SCALED_TILE) / 2
  }
  if (map.height * SCALED_TILE < CANVAS_HEIGHT) {
    camY = -(CANVAS_HEIGHT - map.height * SCALED_TILE) / 2
  }

  return { x: camX, y: camY }
}

/**
 * Render the map to a canvas context
 */
export function renderMap(ctx, map, camera, timeOfDay = 'morning') {
  const s = TILE_SCALE

  // Clear canvas
  ctx.fillStyle = '#0e0c0a'
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  // Calculate visible tile range
  const startCol = Math.max(0, Math.floor(camera.x / SCALED_TILE))
  const startRow = Math.max(0, Math.floor(camera.y / SCALED_TILE))
  const endCol = Math.min(map.width, startCol + VIEW_COLS + 2)
  const endRow = Math.min(map.height, startRow + VIEW_ROWS + 2)

  // Draw ground layer
  for (let y = startRow; y < endRow; y++) {
    for (let x = startCol; x < endCol; x++) {
      const tileId = map.ground[y][x]
      const tile = TILES[tileId]
      if (!tile) continue

      const screenX = x * SCALED_TILE - camera.x
      const screenY = y * SCALED_TILE - camera.y

      // Base tile color
      ctx.fillStyle = tile.color
      ctx.fillRect(screenX, screenY, SCALED_TILE, SCALED_TILE)

      // Add subtle variation for natural tiles
      if (tile.name === 'grass') {
        // Random grass blades
        ctx.fillStyle = '#354525'
        for (let i = 0; i < 3; i++) {
          const gx = screenX + ((x * 7 + y * 13 + i * 5) % 14) * s
          const gy = screenY + ((x * 11 + y * 3 + i * 7) % 12) * s
          ctx.fillRect(gx, gy, s, 2 * s)
        }
      } else if (tile.name === 'cobblestone') {
        // Subtle stone pattern
        ctx.fillStyle = '#3e3830'
        const cx = ((x + y) % 3) * 5
        ctx.fillRect(screenX + cx * s, screenY + 3 * s, 6 * s, 1)
        ctx.fillRect(screenX + (cx + 8) * s, screenY + 10 * s, 5 * s, 1)
      } else if (tile.name === 'water') {
        // Animated-ish water shimmer
        ctx.fillStyle = '#1a3050'
        const wx = ((x * 3 + y * 7) % 8) * s
        ctx.fillRect(screenX + wx, screenY + 6 * s, 8 * s, 2 * s)
      }

      // Draw tile decorations
      const decoFn = TILE_DECORATIONS[tile.name]
      if (decoFn) {
        decoFn(ctx, screenX, screenY, s)
      }
    }
  }

  // Draw object layer
  for (let y = startRow; y < endRow; y++) {
    for (let x = startCol; x < endCol; x++) {
      const objId = map.objects[y][x]
      if (!objId) continue

      const tile = TILES[objId]
      if (!tile) continue

      const screenX = x * SCALED_TILE - camera.x
      const screenY = y * SCALED_TILE - camera.y

      ctx.fillStyle = tile.color
      ctx.fillRect(screenX, screenY, SCALED_TILE, SCALED_TILE)

      // Draw decoration overlay
      const decoFn = TILE_DECORATIONS[tile.name]
      if (decoFn) {
        decoFn(ctx, screenX, screenY, s)
      }
    }
  }

  // Draw interaction indicators (subtle glow on interactable tiles)
  for (const interaction of map.interactions) {
    const screenX = interaction.x * SCALED_TILE - camera.x
    const screenY = interaction.y * SCALED_TILE - camera.y

    // Only draw if visible
    if (screenX < -SCALED_TILE || screenX > CANVAS_WIDTH ||
        screenY < -SCALED_TILE || screenY > CANVAS_HEIGHT) continue

    // Subtle pulsing highlight
    ctx.fillStyle = 'rgba(196, 121, 60, 0.15)'
    ctx.fillRect(screenX + 1, screenY + 1, SCALED_TILE - 2, SCALED_TILE - 2)
  }

  // Apply time-of-day tint
  const tint = TIME_TINTS[timeOfDay]
  if (tint) {
    ctx.fillStyle = tint.color
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  }
}

/**
 * Render a character sprite (placeholder pixel art)
 */
export function renderCharacter(ctx, camera, x, y, direction, type = 'player', frame = 0) {
  const s = TILE_SCALE
  const screenX = x * SCALED_TILE - camera.x
  const screenY = y * SCALED_TILE - camera.y

  // Don't render if off screen
  if (screenX < -SCALED_TILE || screenX > CANVAS_WIDTH ||
      screenY < -SCALED_TILE || screenY > CANVAS_HEIGHT) return

  const colors = {
    player: { shirt: '#e8ddd0', pants: '#2a2a2a', skin: '#d4a574', hair: '#3a2a1a', tie: '#2a3a6a' },
    companion: { shirt: '#e8ddd0', pants: '#2a2a2a', skin: '#c49a6c', hair: '#5a3a1a', tie: '#6a2a2a' },
    npc_male: { shirt: '#4a5a6a', pants: '#3a3a4a', skin: '#d4a574', hair: '#3a3a3a' },
    npc_female: { shirt: '#6a4a5a', pants: '#3a3a4a', skin: '#d4a574', hair: '#5a3a2a' },
    investigator: { shirt: '#5a6a4a', pants: '#3a3a3a', skin: '#c49a6c', hair: '#3a2a1a' },
  }

  const c = colors[type] || colors.npc_male

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.2)'
  ctx.fillRect(screenX + 3 * s, screenY + 14 * s, 10 * s, 2 * s)

  // Body (shirt)
  ctx.fillStyle = c.shirt
  ctx.fillRect(screenX + 4 * s, screenY + 7 * s, 8 * s, 5 * s)

  // Tie (missionaries)
  if (c.tie) {
    ctx.fillStyle = c.tie
    ctx.fillRect(screenX + 7 * s, screenY + 7 * s, 2 * s, 4 * s)
  }

  // Pants
  ctx.fillStyle = c.pants
  ctx.fillRect(screenX + 4 * s, screenY + 12 * s, 3 * s, 3 * s)
  ctx.fillRect(screenX + 9 * s, screenY + 12 * s, 3 * s, 3 * s)

  // Walk animation offset
  const walkOffset = frame % 2 === 1 ? s : 0

  // Legs (walk animation)
  if (frame % 4 < 2) {
    ctx.fillRect(screenX + 5 * s, screenY + 14 * s, 2 * s, 2 * s)
    ctx.fillRect(screenX + 9 * s, screenY + 13 * s, 2 * s, 2 * s)
  } else {
    ctx.fillRect(screenX + 5 * s, screenY + 13 * s, 2 * s, 2 * s)
    ctx.fillRect(screenX + 9 * s, screenY + 14 * s, 2 * s, 2 * s)
  }

  // Head
  ctx.fillStyle = c.skin
  ctx.fillRect(screenX + 5 * s, screenY + 2 * s, 6 * s, 5 * s)

  // Hair
  ctx.fillStyle = c.hair
  ctx.fillRect(screenX + 5 * s, screenY + 1 * s, 6 * s, 2 * s)

  // Eyes (direction-based)
  ctx.fillStyle = '#1a1a1a'
  if (direction === 'left') {
    ctx.fillRect(screenX + 5 * s, screenY + 4 * s, s, s)
  } else if (direction === 'right') {
    ctx.fillRect(screenX + 10 * s, screenY + 4 * s, s, s)
  } else if (direction === 'up') {
    // Back of head, no eyes
  } else {
    // Facing down (default)
    ctx.fillRect(screenX + 6 * s, screenY + 4 * s, s, s)
    ctx.fillRect(screenX + 9 * s, screenY + 4 * s, s, s)
  }

  // Name tag (missionaries only)
  if (type === 'player' || type === 'companion') {
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(screenX + 4 * s, screenY + 7 * s, 3 * s, 2 * s)
    ctx.fillStyle = '#e8ddd0'
    ctx.fillRect(screenX + 4.5 * s, screenY + 7.5 * s, 2 * s, 1 * s)
  }
}

/**
 * Render interaction prompt above player
 */
export function renderPrompt(ctx, camera, playerX, playerY, text) {
  const screenX = playerX * SCALED_TILE - camera.x
  const screenY = playerY * SCALED_TILE - camera.y

  const s = TILE_SCALE
  const padding = 4 * s
  const fontSize = 4 * s

  ctx.font = `${fontSize}px "Silkscreen", monospace`
  const textWidth = ctx.measureText(text).width
  const boxWidth = textWidth + padding * 2
  const boxHeight = fontSize + padding * 2
  const boxX = screenX + (SCALED_TILE / 2) - (boxWidth / 2)
  const boxY = screenY - boxHeight - 4 * s

  // Background
  ctx.fillStyle = 'rgba(26, 23, 20, 0.92)'
  ctx.fillRect(boxX, boxY, boxWidth, boxHeight)

  // Border
  ctx.strokeStyle = '#c4793c'
  ctx.lineWidth = 1
  ctx.strokeRect(boxX, boxY, boxWidth, boxHeight)

  // Text
  ctx.fillStyle = '#e8ddd0'
  ctx.fillText(text, boxX + padding, boxY + padding + fontSize * 0.8)

  // "Space" hint
  ctx.font = `${3 * s}px "Silkscreen", monospace`
  ctx.fillStyle = '#9a8e80'
  const hint = '[SPACE]'
  const hintWidth = ctx.measureText(hint).width
  ctx.fillText(hint, boxX + boxWidth / 2 - hintWidth / 2, boxY + boxHeight + 3 * s)
}
