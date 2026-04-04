/**
 * Pixel-art icons rendered as SVG from bitmap grids.
 * '#' = filled pixel, '.' = empty. Each row is one line.
 */

function parseGrid(str) {
  const rows = str.trim().split('\n').map(r => r.trim())
  const h = rows.length
  const w = Math.max(...rows.map(r => r.length))
  const rects = []
  for (let y = 0; y < h; y++)
    for (let x = 0; x < rows[y].length; x++)
      if (rows[y][x] === '#') rects.push([x, y])
  return { w, h, rects }
}

const ICONS = {
  // Smartphone shape: screen + button
  phone: parseGrid(`
    .######.
    #......#
    #......#
    #.####.#
    #.#..#.#
    #.####.#
    #.####.#
    #.#..#.#
    #.####.#
    #......#
    #..##..#
    .######.
  `),
  // Open book with pages & text lines
  book: parseGrid(`
    .####.####.
    #....#....#
    #.##.#.##.#
    #....#....#
    #.##.#.##.#
    #....#....#
    #.##.#.##.#
    .##########
  `),
}

export default function PixelIcon({ name, size = 24, color = 'currentColor' }) {
  const icon = ICONS[name]
  if (!icon) return null

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${icon.w} ${icon.h}`}
      shapeRendering="crispEdges"
      style={{ imageRendering: 'pixelated' }}
      aria-hidden="true"
    >
      {icon.rects.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width={1} height={1} fill={color} />
      ))}
    </svg>
  )
}
