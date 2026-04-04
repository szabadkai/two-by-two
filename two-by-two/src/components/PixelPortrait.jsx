import { useEffect, useRef, memo } from 'react'

/**
 * Renders a pixel art face on a small canvas.
 * @param {string[][]} data - 2D array of hex color strings (null = transparent)
 * @param {number} size - Display width in pixels
 */
const PixelPortrait = memo(function PixelPortrait({ data, size = 40 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !data?.length) return
    const cols = data[0].length
    const rows = data.length
    const px = Math.max(1, Math.round(size / cols))
    canvas.width = cols * px
    canvas.height = rows * px
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const c = data[y]?.[x]
        if (c) {
          ctx.fillStyle = c
          ctx.fillRect(x * px, y * px, px, px)
        }
      }
    }
  }, [data, size])

  if (!data?.length) return null
  const cols = data[0].length
  const rows = data.length

  return (
    <canvas
      ref={canvasRef}
      style={{
        imageRendering: 'pixelated',
        width: `${size}px`,
        height: `${Math.round(size * (rows / cols))}px`,
      }}
    />
  )
})

export default PixelPortrait
