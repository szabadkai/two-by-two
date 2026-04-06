import { useRef, useEffect, useCallback, useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { MAPS } from '../data/maps'
import {
  getCameraOffset,
  canvasToTile,
  renderMap,
  renderCharacter,
  renderTapTarget,
  renderPrompt,
  isWalkable,
  getInteractionAt,
  MOBILE_SCALED_TILE,
} from '../engine/mapEngine'
import { getEnhancedMap } from '../engine/mapEnhancer'
import { findPath, findTapTarget } from '../engine/pathfinding'

const WALK_SPEED = 6 // tiles per second
const COMPANION_FOLLOW_DISTANCE = 1.5

function getDirection(fromX, fromY, toX, toY) {
  const dx = toX - fromX
  const dy = toY - fromY
  if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? 'right' : 'left'
  return dy > 0 ? 'down' : 'up'
}

function getTimeOfDay(slot) {
  if (slot === 'morning') return 'morning'
  if (slot === 'afternoon') return 'afternoon'
  return 'evening'
}

export default function GameCanvas({ activeSlot, onInteraction }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const animRef = useRef(null)
  const stateRef = useRef({
    playerX: 5,
    playerY: 5,
    companionX: 4,
    companionY: 5,
    direction: 'down',
    companionDir: 'down',
    path: [],
    pathIndex: 0,
    walkProgress: 0,
    frame: 0,
    isWalking: false,
    tapTarget: null,
    pendingInteraction: null,
    companionPath: [],
    companionPathIndex: 0,
    companionWalkProgress: 0,
    canvasW: 360,
    canvasH: 400,
  })
  const [prompt, setPrompt] = useState(null) // { text, interaction }

  const mapId = useGameStore((s) => s.mapId)
  const investigators = useGameStore((s) => s.investigators)
  const enterMap = useGameStore((s) => s.enterMap)

  // Get enhanced map with NPCs
  const getMap = useCallback(() => {
    const baseDef = MAPS[mapId]
    if (!baseDef) return MAPS.apartment
    return getEnhancedMap(baseDef, investigators)
  }, [mapId, investigators])

  // Resize canvas to fill container
  const resizeCanvas = useCallback(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const rect = container.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    const w = Math.floor(rect.width)
    const h = Math.floor(rect.height)

    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`

    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)

    stateRef.current.canvasW = w
    stateRef.current.canvasH = h
  }, [])

  // Initialize player position when map changes
  useEffect(() => {
    const map = getMap()
    const st = stateRef.current
    st.playerX = map.playerStart.x
    st.playerY = map.playerStart.y
    st.companionX = map.companionStart.x
    st.companionY = map.companionStart.y
    st.direction = 'down'
    st.companionDir = 'down'
    st.path = []
    st.isWalking = false
    st.tapTarget = null
    st.pendingInteraction = null
    setPrompt(null)
  }, [mapId, getMap])

  // Handle tap on canvas
  const handleTap = useCallback((e) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const touchX = (e.clientX || e.changedTouches?.[0]?.clientX) - rect.left
    const touchY = (e.clientY || e.changedTouches?.[0]?.clientY) - rect.top

    const st = stateRef.current
    const map = getMap()
    const camera = getCameraOffset(map, st.playerX, st.playerY, st.canvasW, st.canvasH)
    const tile = canvasToTile(touchX, touchY, camera)

    // If prompt is showing and user taps, trigger the interaction
    if (prompt) {
      onInteraction(prompt.interaction)
      setPrompt(null)
      return
    }

    const target = findTapTarget(map, tile.x, tile.y, Math.round(st.playerX), Math.round(st.playerY))
    if (!target) return

    // Check if it's a door — handle map transitions
    if (target.interaction?.type === 'door') {
      // Walk to door then transition
      const path = findPath(map, Math.round(st.playerX), Math.round(st.playerY), target.walkTo.x, target.walkTo.y)
      st.path = path
      st.pathIndex = 0
      st.walkProgress = 0
      st.isWalking = path.length > 0
      st.pendingInteraction = target.interaction
      st.tapTarget = target.walkTo
      setPrompt(null)
      return
    }

    // Path to walkTo tile
    const path = findPath(map, Math.round(st.playerX), Math.round(st.playerY), target.walkTo.x, target.walkTo.y)
    if (path.length === 0 && target.interaction) {
      // Already adjacent — show prompt immediately
      setPrompt({ text: target.interaction.prompt || target.interaction.label, interaction: target.interaction })
      return
    }

    st.path = path
    st.pathIndex = 0
    st.walkProgress = 0
    st.isWalking = path.length > 0
    st.pendingInteraction = target.interaction
    st.tapTarget = target.walkTo
    setPrompt(null)
  }, [getMap, prompt, onInteraction])

  // Animation loop
  useEffect(() => {
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    let lastTime = 0

    const tick = (timestamp) => {
      const dt = lastTime ? (timestamp - lastTime) / 1000 : 0
      lastTime = timestamp

      const st = stateRef.current
      const map = getMap()
      const canvas = canvasRef.current
      if (!canvas) { animRef.current = requestAnimationFrame(tick); return }

      const ctx = canvas.getContext('2d')
      const dpr = window.devicePixelRatio || 1

      ctx.save()
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Update walk animation
      if (st.isWalking && st.path.length > 0 && st.pathIndex < st.path.length) {
        st.walkProgress += dt * WALK_SPEED
        const step = st.path[st.pathIndex]

        if (st.walkProgress >= 1) {
          st.playerX = step.x
          st.playerY = step.y
          st.walkProgress = 0
          st.pathIndex++
          st.frame++

          if (st.pathIndex >= st.path.length) {
            // Arrived at destination
            st.isWalking = false
            st.path = []
            st.tapTarget = null

            if (st.pendingInteraction) {
              if (st.pendingInteraction.type === 'door') {
                // Map transition
                enterMap(st.pendingInteraction.target)
                st.pendingInteraction = null
              } else {
                setPrompt({
                  text: st.pendingInteraction.prompt || st.pendingInteraction.label,
                  interaction: st.pendingInteraction,
                })
                st.pendingInteraction = null
              }
            }
          } else {
            st.direction = getDirection(st.playerX, st.playerY, st.path[st.pathIndex].x, st.path[st.pathIndex].y)
          }
        } else {
          // Interpolate position
          const prevX = st.pathIndex === 0
            ? (st.path.length > 0 ? st.path[0].x - (st.path[0].x - st.playerX) : st.playerX)
            : st.path[st.pathIndex - 1].x
          const prevY = st.pathIndex === 0
            ? (st.path.length > 0 ? st.path[0].y - (st.path[0].y - st.playerY) : st.playerY)
            : st.path[st.pathIndex - 1].y
          st.direction = getDirection(prevX, prevY, step.x, step.y)
        }
      }

      // Companion follows player (simple: walk toward player if too far)
      const distToPlayer = Math.abs(st.companionX - st.playerX) + Math.abs(st.companionY - st.playerY)
      if (distToPlayer > COMPANION_FOLLOW_DISTANCE && !st.isWalking) {
        // Snap companion to adjacent tile
        const cx = Math.round(st.companionX)
        const cy = Math.round(st.companionY)
        const px = Math.round(st.playerX)
        const py = Math.round(st.playerY)
        const cPath = findPath(map, cx, cy, px, py)
        if (cPath.length > 1) {
          st.companionX = cPath[0].x
          st.companionY = cPath[0].y
          st.companionDir = getDirection(cx, cy, cPath[0].x, cPath[0].y)
        } else if (cPath.length === 1) {
          // Don't move on top of player — stay put
        }
      } else if (st.isWalking && st.path.length > 1 && st.pathIndex > 0) {
        // Follow player's trail
        const trailPos = st.path[Math.max(0, st.pathIndex - 2)]
        if (trailPos && isWalkable(map, trailPos.x, trailPos.y)) {
          st.companionDir = getDirection(st.companionX, st.companionY, trailPos.x, trailPos.y)
          st.companionX = trailPos.x
          st.companionY = trailPos.y
        }
      }

      // Get interpolated player position for smooth rendering
      let renderPX = st.playerX
      let renderPY = st.playerY
      if (st.isWalking && st.pathIndex < st.path.length) {
        const step = st.path[st.pathIndex]
        const prevX = st.pathIndex === 0 ? st.playerX : st.path[st.pathIndex - 1].x
        const prevY = st.pathIndex === 0 ? st.playerY : st.path[st.pathIndex - 1].y
        renderPX = prevX + (step.x - prevX) * st.walkProgress
        renderPY = prevY + (step.y - prevY) * st.walkProgress
      }

      const camera = getCameraOffset(map, renderPX, renderPY, st.canvasW, st.canvasH)
      const timeOfDay = getTimeOfDay(activeSlot)

      // Render
      renderMap(ctx, map, camera, st.canvasW, st.canvasH, timeOfDay)

      // Draw NPCs
      if (map.npcSpawns) {
        for (const npc of map.npcSpawns) {
          const npcType = npc.type === 'investigator' ? 'investigator'
            : npc.type === 'shopper' ? 'npc_female'
            : npc.type === 'member' ? 'npc_female'
            : 'npc_male'
          renderCharacter(ctx, camera, npc.x, npc.y, 'down', npcType, 0)
        }
      }

      // Draw companion
      renderCharacter(ctx, camera, st.companionX, st.companionY, st.companionDir, 'companion', st.frame)

      // Draw player
      renderCharacter(ctx, camera, renderPX, renderPY, st.direction, 'player', st.frame)

      // Draw tap target
      if (st.tapTarget && st.isWalking) {
        renderTapTarget(ctx, camera, st.tapTarget.x, st.tapTarget.y)
      }

      // Draw prompt
      if (prompt) {
        renderPrompt(ctx, camera, Math.round(st.playerX), Math.round(st.playerY), prompt.text, st.canvasW)
      }

      ctx.restore()
      animRef.current = requestAnimationFrame(tick)
    }

    animRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [getMap, resizeCanvas, activeSlot, prompt])

  return (
    <div
      ref={containerRef}
      className="game-canvas-container"
      style={{ flex: 1, overflow: 'hidden', position: 'relative' }}
    >
      <canvas
        ref={canvasRef}
        className="game-canvas"
        onClick={handleTap}
        style={{
          display: 'block',
          imageRendering: 'pixelated',
          touchAction: 'none',
        }}
      />
      {prompt && (
        <div className="canvas-tap-hint">
          Tap to {prompt.interaction?.label || 'interact'}
        </div>
      )}
    </div>
  )
}
