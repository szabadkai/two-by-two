import { isWalkable, getInteractionAt } from './mapEngine'

/**
 * A* Pathfinding for tile-based grid maps.
 * Returns array of {x, y} steps from start to goal (exclusive of start).
 * Returns empty array if no path found.
 */

function heuristic(ax, ay, bx, by) {
  return Math.abs(ax - bx) + Math.abs(ay - by)
}

function key(x, y) {
  return `${x},${y}`
}

/**
 * Find shortest path from (sx,sy) to (gx,gy) on the given map.
 * If goal tile is not walkable (solid, NPC, etc.), paths to an adjacent walkable tile.
 * @param {Object} map - map definition with ground, objects, npcSpawns
 * @param {number} sx - start x
 * @param {number} sy - start y
 * @param {number} gx - goal x
 * @param {number} gy - goal y
 * @returns {Array<{x: number, y: number}>} path steps (excludes start position)
 */
export function findPath(map, sx, sy, gx, gy) {
  // If tapping the tile you're already on, no path
  if (sx === gx && sy === gy) return []

  // If goal is not walkable, find nearest walkable neighbor of goal
  let goalX = gx
  let goalY = gy
  if (!isWalkable(map, gx, gy)) {
    const neighbors = [
      { x: gx, y: gy - 1 },
      { x: gx, y: gy + 1 },
      { x: gx - 1, y: gy },
      { x: gx + 1, y: gy },
    ]
    let best = null
    let bestDist = Infinity
    for (const n of neighbors) {
      if (isWalkable(map, n.x, n.y)) {
        const d = heuristic(sx, sy, n.x, n.y)
        if (d < bestDist) {
          bestDist = d
          best = n
        }
      }
    }
    if (!best) return [] // completely surrounded, no path
    goalX = best.x
    goalY = best.y
    if (sx === goalX && sy === goalY) return [] // already adjacent
  }

  // A* search
  const open = new Map() // key -> {x, y, g, f, parent}
  const closed = new Set()

  const startKey = key(sx, sy)
  const startNode = { x: sx, y: sy, g: 0, f: heuristic(sx, sy, goalX, goalY), parent: null }
  open.set(startKey, startNode)

  const dirs = [
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
  ]

  let iterations = 0
  const maxIterations = 500 // prevent hanging on very large maps

  while (open.size > 0 && iterations < maxIterations) {
    iterations++

    // Find node with lowest f cost
    let current = null
    let currentKey = null
    for (const [k, node] of open) {
      if (!current || node.f < current.f) {
        current = node
        currentKey = k
      }
    }

    if (!current) break

    // Goal reached
    if (current.x === goalX && current.y === goalY) {
      const path = []
      let node = current
      while (node.parent) {
        path.unshift({ x: node.x, y: node.y })
        node = node.parent
      }
      return path
    }

    open.delete(currentKey)
    closed.add(currentKey)

    // Explore neighbors
    for (const dir of dirs) {
      const nx = current.x + dir.x
      const ny = current.y + dir.y
      const nk = key(nx, ny)

      if (closed.has(nk)) continue
      if (!isWalkable(map, nx, ny) && !(nx === goalX && ny === goalY)) continue

      const g = current.g + 1
      const existing = open.get(nk)

      if (!existing || g < existing.g) {
        const f = g + heuristic(nx, ny, goalX, goalY)
        open.set(nk, { x: nx, y: ny, g, f, parent: current })
      }
    }
  }

  return [] // no path found
}

/**
 * Find what the player would interact with at or adjacent to a tile.
 * Used when tapping on the map to determine the action.
 * Returns { interaction, walkTo } or null.
 */
export function findTapTarget(map, tapX, tapY, playerX, playerY) {
  // Direct tap on an interaction tile
  const directInteraction = getInteractionAt(map, tapX, tapY)
  if (directInteraction) {
    // If the tile itself is walkable (like a door), walk to it
    if (isWalkable(map, tapX, tapY)) {
      return { interaction: directInteraction, walkTo: { x: tapX, y: tapY } }
    }
    // Otherwise walk to an adjacent tile
    const neighbors = [
      { x: tapX, y: tapY + 1 }, // prefer below (player looks up at object)
      { x: tapX, y: tapY - 1 },
      { x: tapX - 1, y: tapY },
      { x: tapX + 1, y: tapY },
    ]
    let best = null
    let bestDist = Infinity
    for (const n of neighbors) {
      if (isWalkable(map, n.x, n.y)) {
        const d = heuristic(playerX, playerY, n.x, n.y)
        if (d < bestDist) {
          bestDist = d
          best = n
        }
      }
    }
    if (best) {
      return { interaction: directInteraction, walkTo: best }
    }
    return null
  }

  // Tap on a walkable tile with no interaction — just walk there
  if (isWalkable(map, tapX, tapY)) {
    return { interaction: null, walkTo: { x: tapX, y: tapY } }
  }

  return null
}
