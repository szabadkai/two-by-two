import { useRef, useEffect, useCallback, useState, useMemo } from 'react'
import { useGameStore } from '../store/gameStore'
import { MAPS, STARTING_MAP } from '../data/maps/index'
import { getEnhancedMap } from '../engine/mapEnhancer'
import { CANVAS_WIDTH, CANVAS_HEIGHT, SCALED_TILE } from '../data/tiles'
import {
  renderMap,
  renderCharacter,
  renderPrompt,
  isWalkable,
  getAdjacentInteraction,
  getInteractionAt,
  getCameraOffset,
} from '../engine/mapEngine'

const MOVE_COOLDOWN = 150 // ms between moves (tile-based movement)
const LERP_SPEED = 0.18 // visual interpolation speed (0-1, higher = snappier)

export default function GameCanvas({ timeOfDay, onInteraction }) {
  const canvasRef = useRef(null)
  const keysRef = useRef(new Set())
  const lastMoveRef = useRef(0)
  const frameRef = useRef(0)
  const animFrameRef = useRef(0)

  // Map state (local to canvas, not in zustand for performance)
  const [mapId, setMapId] = useState(STARTING_MAP)
  const [playerPos, setPlayerPos] = useState(() => {
    const map = MAPS[STARTING_MAP]
    return { x: map.playerStart.x, y: map.playerStart.y }
  })
  const [companionPos, setCompanionPos] = useState(() => {
    const map = MAPS[STARTING_MAP]
    return { x: map.companionStart.x, y: map.companionStart.y }
  })
  const [direction, setDirection] = useState('down')
  const [companionDir, setCompanionDir] = useState('down')
  const [walkFrame, setWalkFrame] = useState(0)
  const [activePrompt, setActivePrompt] = useState(null)

  // Smooth visual positions (fractional tile coords for interpolation)
  const visualPlayerRef = useRef({ x: MAPS[STARTING_MAP].playerStart.x, y: MAPS[STARTING_MAP].playerStart.y })
  const visualCompanionRef = useRef({ x: MAPS[STARTING_MAP].companionStart.x, y: MAPS[STARTING_MAP].companionStart.y })

  // Companion movement history (for following)
  const companionTrailRef = useRef([])

  const investigators = useGameStore((s) => s.investigators)
  const enhancedMap = useMemo(() => getEnhancedMap(MAPS[mapId], investigators), [mapId, investigators])
  const enhancedMapRef = useRef(enhancedMap)
  enhancedMapRef.current = enhancedMap

  // Handle map transition
  const changeMap = useCallback((targetMapId, targetPos) => {
    const targetMap = MAPS[targetMapId]
    if (!targetMap) return

    setMapId(targetMapId)
    setPlayerPos(targetPos)
    setCompanionPos({
      x: targetPos.x - 1,
      y: targetPos.y,
    })
    // Snap visual positions on map change (no interpolation)
    visualPlayerRef.current = { x: targetPos.x, y: targetPos.y }
    visualCompanionRef.current = { x: targetPos.x - 1, y: targetPos.y }
    companionTrailRef.current = []
    setActivePrompt(null)
  }, [])

  // Handle interaction
  const handleInteraction = useCallback((interaction) => {
    if (!interaction) return

    if (interaction.type === 'door') {
      changeMap(interaction.target, interaction.targetPos)
      return
    }

    // Pass interaction up to the game screen
    if (onInteraction) {
      onInteraction(interaction)
    }
  }, [changeMap, onInteraction])

  // Input handling — skip when a modal/minigame overlay is active
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't steal keys when an input/textarea/select is focused (use activeElement — more reliable than e.target)
      const focused = document.activeElement
      if (focused) {
        const tag = focused.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      }
      // Don't steal keys when any overlay is open (minigame, modal, etc.)
      if (document.querySelector('[data-overlay]')) return

      const key = e.key.toLowerCase()
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd', ' ', 'enter'].includes(key)) {
        e.preventDefault()
        keysRef.current.add(key)
      }
    }
    const handleKeyUp = (e) => {
      keysRef.current.delete(e.key.toLowerCase())
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false

    let running = true

    const gameLoop = (timestamp) => {
      if (!running) return

      const currentMap = enhancedMapRef.current
      if (!currentMap) { animFrameRef.current = requestAnimationFrame(gameLoop); return }

      const keys = keysRef.current

      // --- MOVEMENT ---
      const now = timestamp
      if (now - lastMoveRef.current > MOVE_COOLDOWN) {
        let dx = 0, dy = 0
        let newDir = direction

        if (keys.has('arrowup') || keys.has('w')) { dy = -1; newDir = 'up' }
        else if (keys.has('arrowdown') || keys.has('s')) { dy = 1; newDir = 'down' }
        else if (keys.has('arrowleft') || keys.has('a')) { dx = -1; newDir = 'left' }
        else if (keys.has('arrowright') || keys.has('d')) { dx = 1; newDir = 'right' }

        if (dx !== 0 || dy !== 0) {
          const newX = playerPos.x + dx
          const newY = playerPos.y + dy

          setDirection(newDir)

          if (isWalkable(currentMap, newX, newY)) {
            // Check if stepping on a door tile (auto-transition)
            const interaction = getInteractionAt(currentMap, newX, newY)
            if (interaction && interaction.type === 'door') {
              // Store old position for companion
              companionTrailRef.current.push({ x: playerPos.x, y: playerPos.y })
              setPlayerPos({ x: newX, y: newY })
              // Auto-enter doors
              changeMap(interaction.target, interaction.targetPos)
              lastMoveRef.current = now
              animFrameRef.current = requestAnimationFrame(gameLoop)
              return
            }

            // Move companion toward old player position
            companionTrailRef.current.push({ x: playerPos.x, y: playerPos.y })
            if (companionTrailRef.current.length > 2) {
              const nextCompPos = companionTrailRef.current.shift()
              if (isWalkable(currentMap, nextCompPos.x, nextCompPos.y)) {
                // Calculate companion direction
                const cdx = nextCompPos.x - companionPos.x
                const cdy = nextCompPos.y - companionPos.y
                if (cdx > 0) setCompanionDir('right')
                else if (cdx < 0) setCompanionDir('left')
                else if (cdy > 0) setCompanionDir('down')
                else if (cdy < 0) setCompanionDir('up')

                setCompanionPos(nextCompPos)
              }
            }

            setPlayerPos({ x: newX, y: newY })
            setWalkFrame(f => f + 1)
          }

          lastMoveRef.current = now
        }

        // --- INTERACTION CHECK ---
        if (keys.has(' ') || keys.has('enter')) {
          keys.delete(' ')
          keys.delete('enter')

          const interaction = getAdjacentInteraction(currentMap, playerPos.x, playerPos.y, direction)
          if (interaction) {
            handleInteraction(interaction)
          } else {
            // Only check current tile if no adjacent interaction found
            const standingInteraction = getInteractionAt(currentMap, playerPos.x, playerPos.y)
            if (standingInteraction && standingInteraction.type !== 'door') {
              handleInteraction(standingInteraction)
            }
          }
        }
      }

      // --- CHECK FOR NEARBY INTERACTION (for prompt display) ---
      const nearbyInteraction = getAdjacentInteraction(currentMap, playerPos.x, playerPos.y, direction)
      setActivePrompt(nearbyInteraction)

      // --- SMOOTH VISUAL INTERPOLATION ---
      const vp = visualPlayerRef.current
      const vc = visualCompanionRef.current
      vp.x += (playerPos.x - vp.x) * LERP_SPEED
      vp.y += (playerPos.y - vp.y) * LERP_SPEED
      vc.x += (companionPos.x - vc.x) * LERP_SPEED
      vc.y += (companionPos.y - vc.y) * LERP_SPEED
      // Snap if very close (avoid endless micro-movement)
      if (Math.abs(playerPos.x - vp.x) < 0.01) vp.x = playerPos.x
      if (Math.abs(playerPos.y - vp.y) < 0.01) vp.y = playerPos.y
      if (Math.abs(companionPos.x - vc.x) < 0.01) vc.x = companionPos.x
      if (Math.abs(companionPos.y - vc.y) < 0.01) vc.y = companionPos.y

      // --- RENDER ---
      const camera = getCameraOffset(currentMap, vp.x, vp.y)

      // Draw map
      renderMap(ctx, currentMap, camera, timeOfDay)

      // Draw companion (behind player)
      renderCharacter(ctx, camera, vc.x, vc.y, companionDir, 'companion', walkFrame)

      // Draw NPCs (from map npcSpawns)
      if (currentMap.npcSpawns) {
        currentMap.npcSpawns.forEach((npc, i) => {
          if (npc.type === 'investigator') {
            renderCharacter(ctx, camera, npc.x, npc.y, 'down', 'investigator', 0)
          } else {
            renderCharacter(ctx, camera, npc.x, npc.y, 'down', i % 2 === 0 ? 'npc_male' : 'npc_female', 0)
          }
        })
      }

      // Draw player (on top)
      renderCharacter(ctx, camera, vp.x, vp.y, direction, 'player', walkFrame)

      // Draw interaction prompt
      if (nearbyInteraction) {
        renderPrompt(ctx, camera, playerPos.x, playerPos.y, nearbyInteraction.label)
      }

      // Draw map name
      ctx.font = `${12}px "Silkscreen", monospace`
      ctx.fillStyle = 'rgba(232, 221, 208, 0.4)'
      ctx.fillText(currentMap.name, 8, 16)

      frameRef.current++
      animFrameRef.current = requestAnimationFrame(gameLoop)
    }

    animFrameRef.current = requestAnimationFrame(gameLoop)

    return () => {
      running = false
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [mapId, playerPos, companionPos, direction, companionDir, walkFrame, timeOfDay, handleInteraction, changeMap])

  // Reset position when map changes externally
  const resetToMap = useCallback((newMapId) => {
    const newMap = MAPS[newMapId]
    if (newMap) {
      setMapId(newMapId)
      setPlayerPos(newMap.playerStart)
      setCompanionPos(newMap.companionStart)
      visualPlayerRef.current = { ...newMap.playerStart }
      visualCompanionRef.current = { ...newMap.companionStart }
      companionTrailRef.current = []
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      style={{
        width: '100%',
        maxWidth: `${CANVAS_WIDTH}px`,
        imageRendering: 'pixelated',
        border: '2px solid var(--border)',
        borderRadius: '2px',
        display: 'block',
        margin: '0 auto',
        background: '#0e0c0a',
      }}
      tabIndex={0}
    />
  )
}
