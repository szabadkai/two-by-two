import { TILES, TILE_DECORATIONS, TILE_SIZE } from '../data/tiles'

/**
 * Mobile Map Engine
 * Adapts the prototype's canvas renderer for portrait phone viewport.
 * Key differences:
 * - Dynamic viewport sizing (fills available space)
 * - Scale factor configurable (2.5x default → 40px tiles)
 * - devicePixelRatio support for retina
 * - Tap-friendly interaction highlights
 * - No keyboard prompt rendering
 */

// Mobile-optimized constants
export const MOBILE_TILE_SCALE = 2.5
export const MOBILE_SCALED_TILE = TILE_SIZE * MOBILE_TILE_SCALE // 40px

// Time-of-day lighting overlays
const TIME_TINTS = {
  morning: { color: 'rgba(200, 180, 120, 0.08)' },
  afternoon: { color: 'rgba(180, 160, 100, 0.04)' },
  evening: { color: 'rgba(40, 30, 80, 0.2)' },
}

/**
 * Get tile at position
 */
export function getTileAt(map, x, y, layer = 'ground') {
  if (x < 0 || y < 0 || x >= map.width || y >= map.height) {
    return TILES[10]
  }
  const tileId = map[layer][y][x]
  return TILES[tileId] || TILES[0]
}

/**
 * Check if a position is walkable
 */
export function isWalkable(map, x, y) {
  if (x < 0 || y < 0 || x >= map.width || y >= map.height) return false
  const groundTile = TILES[map.ground[y][x]]
  const objectTile = map.objects[y][x] ? TILES[map.objects[y][x]] : null
  if (groundTile?.solid) return false
  if (objectTile?.solid) return false
  if (map.npcSpawns) {
    if (map.npcSpawns.some((n) => n.x === x && n.y === y)) return false
  }
  return true
}

/**
 * Find interaction at tile position
 */
export function getInteractionAt(map, x, y) {
  const staticInteraction = map.interactions.find((i) => i.x === x && i.y === y)
  if (staticInteraction) return staticInteraction

  if (map.npcSpawns) {
    const npc = map.npcSpawns.find((n) => n.x === x && n.y === y)
    if (npc) {
      if (npc.type === 'investigator') {
        return {
          x: npc.x, y: npc.y,
          type: 'activity', activity: 'visit_investigator',
          investigatorId: npc.investigatorId,
          label: 'Visit ' + npc.name,
          prompt: 'Teach ' + npc.name + '?',
        }
      }
      if (npc.type === 'member') {
        return {
          x: npc.x, y: npc.y,
          type: 'member',
          memberId: npc.memberId,
          label: npc.name,
          prompt: 'Talk to ' + npc.name + '?',
        }
      }
      return {
        x: npc.x, y: npc.y,
        type: 'activity',
        activity: 'street_contact',
        label: npc.type === 'shopper' ? 'Talk to Shopper' : 'Talk to Stranger',
        prompt: 'Approach this person?',
      }
    }
  }
  return null
}

/**
 * Get interaction adjacent to a tile (for arriving next to an interactable)
 */
export function getAdjacentInteractions(map, x, y) {
  const offsets = [
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
  ]
  const results = []
  for (const off of offsets) {
    const ix = x + off.x
    const iy = y + off.y
    const interaction = getInteractionAt(map, ix, iy)
    if (interaction) results.push(interaction)
  }
  return results
}

/**
 * Calculate camera offset centered on player, clamped to map bounds.
 * canvasW/canvasH are the actual canvas pixel dimensions.
 */
export function getCameraOffset(map, playerX, playerY, canvasW, canvasH) {
  const st = MOBILE_SCALED_TILE
  let camX = playerX * st - canvasW / 2 + st / 2
  let camY = playerY * st - canvasH / 2 + st / 2

  const maxCamX = map.width * st - canvasW
  const maxCamY = map.height * st - canvasH

  camX = Math.max(0, Math.min(camX, maxCamX))
  camY = Math.max(0, Math.min(camY, maxCamY))

  if (map.width * st < canvasW) camX = -(canvasW - map.width * st) / 2
  if (map.height * st < canvasH) camY = -(canvasH - map.height * st) / 2

  return { x: camX, y: camY }
}

/**
 * Convert canvas touch coordinates to tile coordinates
 */
export function canvasToTile(touchX, touchY, camera) {
  const st = MOBILE_SCALED_TILE
  return {
    x: Math.floor((touchX + camera.x) / st),
    y: Math.floor((touchY + camera.y) / st),
  }
}

/**
 * Get tile ID at a position, clamping to map edges for out-of-bounds.
 * Repeats edge tiles instead of showing black void.
 */
function getEdgeClampedTileId(map, x, y, layer = 'ground') {
  const cx = Math.max(0, Math.min(x, map.width - 1))
  const cy = Math.max(0, Math.min(y, map.height - 1))
  return map[layer][cy][cx]
}

/**
 * Render the map
 */
export function renderMap(ctx, map, camera, canvasW, canvasH, timeOfDay = 'morning') {
  const s = MOBILE_TILE_SCALE
  const st = MOBILE_SCALED_TILE

  ctx.fillStyle = '#0e0c0a'
  ctx.fillRect(0, 0, canvasW, canvasH)

  // Render range extends beyond map bounds — edge tiles fill the viewport
  const startCol = Math.floor(camera.x / st)
  const startRow = Math.floor(camera.y / st)
  const endCol = startCol + Math.ceil(canvasW / st) + 2
  const endRow = startRow + Math.ceil(canvasH / st) + 2

  // Ground layer — edge-clamped so no black borders appear
  for (let y = startRow; y < endRow; y++) {
    for (let x = startCol; x < endCol; x++) {
      const tileId = getEdgeClampedTileId(map, x, y, 'ground')
      const tile = TILES[tileId]
      if (!tile) continue

      const sx = x * st - camera.x
      const sy = y * st - camera.y

      ctx.fillStyle = tile.color
      ctx.fillRect(sx, sy, st, st)

      // Clamped coords for deterministic decoration seeding
      const px = Math.max(0, Math.min(x, map.width - 1))
      const py = Math.max(0, Math.min(y, map.height - 1))

      if (tile.name === 'grass') {
        ctx.fillStyle = '#354525'
        for (let i = 0; i < 3; i++) {
          const gx = sx + ((px * 7 + py * 13 + i * 5) % 14) * s
          const gy = sy + ((px * 11 + py * 3 + i * 7) % 12) * s
          ctx.fillRect(gx, gy, s, 2 * s)
        }
      } else if (tile.name === 'cobblestone') {
        ctx.fillStyle = '#3e3830'
        const cx = ((px + py) % 3) * 5
        ctx.fillRect(sx + cx * s, sy + 3 * s, 6 * s, 1)
        ctx.fillRect(sx + (cx + 8) * s, sy + 10 * s, 5 * s, 1)
      } else if (tile.name === 'water') {
        ctx.fillStyle = '#1a3050'
        const wx = ((px * 3 + py * 7) % 8) * s
        ctx.fillRect(sx + wx, sy + 6 * s, 8 * s, 2 * s)
      }

      const decoFn = TILE_DECORATIONS[tile.name]
      if (decoFn) decoFn(ctx, sx, sy, s)
    }
  }

  // Object layer — only within actual map bounds (don't clone objects to edges)
  const objStartCol = Math.max(0, Math.floor(camera.x / st))
  const objStartRow = Math.max(0, Math.floor(camera.y / st))
  const objEndCol = Math.min(map.width, objStartCol + Math.ceil(canvasW / st) + 2)
  const objEndRow = Math.min(map.height, objStartRow + Math.ceil(canvasH / st) + 2)

  for (let y = objStartRow; y < objEndRow; y++) {
    for (let x = objStartCol; x < objEndCol; x++) {
      const objId = map.objects[y][x]
      if (!objId) continue
      const tile = TILES[objId]
      if (!tile) continue

      const sx = x * st - camera.x
      const sy = y * st - camera.y

      ctx.fillStyle = tile.color
      ctx.fillRect(sx, sy, st, st)

      const decoFn = TILE_DECORATIONS[tile.name]
      if (decoFn) decoFn(ctx, sx, sy, s)
    }
  }

  // Interaction highlights (tappable glow)
  for (const interaction of map.interactions) {
    if (interaction.type === 'door') continue // doors are subtle
    const sx = interaction.x * st - camera.x
    const sy = interaction.y * st - camera.y
    if (sx < -st || sx > canvasW || sy < -st || sy > canvasH) continue
    ctx.fillStyle = 'rgba(196, 121, 60, 0.2)'
    ctx.fillRect(sx + 1, sy + 1, st - 2, st - 2)
    // tiny dot indicator
    ctx.fillStyle = 'rgba(196, 121, 60, 0.6)'
    ctx.beginPath()
    ctx.arc(sx + st - 6, sy + 6, 3, 0, Math.PI * 2)
    ctx.fill()
  }

  // NPC highlight (tappable)
  if (map.npcSpawns) {
    for (const npc of map.npcSpawns) {
      const sx = npc.x * st - camera.x
      const sy = npc.y * st - camera.y
      if (sx < -st || sx > canvasW || sy < -st || sy > canvasH) continue
      ctx.fillStyle = 'rgba(196, 121, 60, 0.12)'
      ctx.fillRect(sx, sy, st, st)
    }
  }

  // Time-of-day tint
  const tint = TIME_TINTS[timeOfDay]
  if (tint) {
    ctx.fillStyle = tint.color
    ctx.fillRect(0, 0, canvasW, canvasH)
  }
}

/**
 * Render a character sprite
 */
export function renderCharacter(ctx, camera, x, y, direction, type = 'player', frame = 0) {
  const s = MOBILE_TILE_SCALE
  const st = MOBILE_SCALED_TILE
  const sx = x * st - camera.x
  const sy = y * st - camera.y

  if (sx < -st || sx > 9999 || sy < -st || sy > 9999) return

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
  ctx.fillRect(sx + 3 * s, sy + 14 * s, 10 * s, 2 * s)

  // Body
  ctx.fillStyle = c.shirt
  ctx.fillRect(sx + 4 * s, sy + 7 * s, 8 * s, 5 * s)

  // Tie
  if (c.tie) {
    ctx.fillStyle = c.tie
    ctx.fillRect(sx + 7 * s, sy + 7 * s, 2 * s, 4 * s)
  }

  // Pants
  ctx.fillStyle = c.pants
  ctx.fillRect(sx + 4 * s, sy + 12 * s, 3 * s, 3 * s)
  ctx.fillRect(sx + 9 * s, sy + 12 * s, 3 * s, 3 * s)

  // Legs (walk animation)
  if (frame % 4 < 2) {
    ctx.fillRect(sx + 5 * s, sy + 14 * s, 2 * s, 2 * s)
    ctx.fillRect(sx + 9 * s, sy + 13 * s, 2 * s, 2 * s)
  } else {
    ctx.fillRect(sx + 5 * s, sy + 13 * s, 2 * s, 2 * s)
    ctx.fillRect(sx + 9 * s, sy + 14 * s, 2 * s, 2 * s)
  }

  // Head
  ctx.fillStyle = c.skin
  ctx.fillRect(sx + 5 * s, sy + 2 * s, 6 * s, 5 * s)

  // Hair
  ctx.fillStyle = c.hair
  ctx.fillRect(sx + 5 * s, sy + 1 * s, 6 * s, 2 * s)

  // Eyes
  ctx.fillStyle = '#1a1a1a'
  if (direction === 'left') {
    ctx.fillRect(sx + 5 * s, sy + 4 * s, s, s)
  } else if (direction === 'right') {
    ctx.fillRect(sx + 10 * s, sy + 4 * s, s, s)
  } else if (direction !== 'up') {
    ctx.fillRect(sx + 6 * s, sy + 4 * s, s, s)
    ctx.fillRect(sx + 9 * s, sy + 4 * s, s, s)
  }

  // Name tag (missionaries)
  if (type === 'player' || type === 'companion') {
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(sx + 4 * s, sy + 7 * s, 3 * s, 2 * s)
    ctx.fillStyle = '#e8ddd0'
    ctx.fillRect(sx + 4.5 * s, sy + 7.5 * s, 2 * s, 1 * s)
  }
}

/**
 * Render tap target indicator (shows where the player will walk to)
 */
export function renderTapTarget(ctx, camera, tileX, tileY) {
  const st = MOBILE_SCALED_TILE
  const sx = tileX * st - camera.x
  const sy = tileY * st - camera.y

  ctx.strokeStyle = 'rgba(196, 121, 60, 0.6)'
  ctx.lineWidth = 2
  ctx.strokeRect(sx + 2, sy + 2, st - 4, st - 4)
}

/**
 * Render interaction prompt as a floating label on canvas
 */
export function renderPrompt(ctx, camera, tileX, tileY, text, canvasW) {
  const s = MOBILE_TILE_SCALE
  const st = MOBILE_SCALED_TILE
  const sx = tileX * st - camera.x
  const sy = tileY * st - camera.y

  const fontSize = Math.round(3.5 * s)
  const padding = 3 * s

  ctx.font = `${fontSize}px "Silkscreen", monospace`
  const textWidth = ctx.measureText(text).width
  const boxWidth = textWidth + padding * 2
  const boxHeight = fontSize + padding * 2
  let boxX = sx + st / 2 - boxWidth / 2
  const boxY = sy - boxHeight - 3 * s

  // Clamp to screen edges
  boxX = Math.max(4, Math.min(boxX, canvasW - boxWidth - 4))

  ctx.fillStyle = 'rgba(26, 23, 20, 0.94)'
  ctx.fillRect(boxX, boxY, boxWidth, boxHeight)
  ctx.strokeStyle = '#c4793c'
  ctx.lineWidth = 1
  ctx.strokeRect(boxX, boxY, boxWidth, boxHeight)
  ctx.fillStyle = '#e8ddd0'
  ctx.fillText(text, boxX + padding, boxY + padding + fontSize * 0.8)

  // Tap hint
  ctx.font = `${Math.round(2.5 * s)}px "Silkscreen", monospace`
  ctx.fillStyle = '#9a8e80'
  const hint = '[TAP]'
  const hintW = ctx.measureText(hint).width
  ctx.fillText(hint, boxX + boxWidth / 2 - hintW / 2, boxY + boxHeight + 2.5 * s)
}
