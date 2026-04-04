/**
 * Pixel art portrait data for companions and investigators.
 * Each face is a 10x10 grid rendered via PixelPortrait.
 */

// ── Palettes ────────────────────────────────────────────────

const SKIN = {
  light:  { s: '#E8C8A8', d: '#C8A080', n: '#C09878', b: '#D8A090' },
  medium: { s: '#D0A880', d: '#B08860', n: '#A88050', b: '#C89878' },
  tan:    { s: '#C09068', d: '#A07848', n: '#987040', b: '#B88868' },
  dark:   { s: '#907058', d: '#785840', n: '#704830', b: '#886858' },
}

const HAIR = {
  brown:  { h: '#4A3020', H: '#5C3C28' },
  black:  { h: '#201810', H: '#383028' },
  blond:  { h: '#C0A058', H: '#D0B068' },
  red:    { h: '#884830', H: '#A06040' },
  gray:   { h: '#787068', H: '#908880' },
  lbrown: { h: '#6B5030', H: '#7D6238' },
}

const BASE = {
  '.': null,
  w: '#E8E0D8',
  p: '#1A1008',
  m: '#C07060',
  g: '#606870',
}

const SHIRT_WHITE = { c: '#D8D0C8' }

const SHIRTS = [
  { c: '#5874A0' },
  { c: '#708868' },
  { c: '#A07060' },
  { c: '#8868A0' },
  { c: '#C0A040' },
  { c: '#C86858' },
  { c: '#607880' },
  { c: '#A08060' },
]

// ── Helpers ─────────────────────────────────────────────────

function build(grid, skinKey, hairKey, shirt) {
  const pal = { ...BASE, ...SKIN[skinKey], ...HAIR[hairKey], ...(shirt || SHIRT_WHITE) }
  return grid.map(row => [...row].map(ch => pal[ch] || null))
}

function hash(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0
  return Math.abs(h)
}

// ── Companion Faces ─────────────────────────────────────────
// . transparent  h/H hair  s skin  d shadow  n nose
// w eye-white  p pupil  m mouth  b blush  c shirt  g glasses

const C = {
  thompson: { // Greenie — young, wide-eyed, short brown hair
    g: [
      '..hhhhhh..',
      '.hhhhhhhh.',
      '.hssssssh.',
      '.ssssssss.',
      '.swpsswps.',
      '.ssssssss.',
      '..ssnnss..',
      '..smmmms..',
      '...ssss...',
      '..cccccc..',
    ], s: 'light', h: 'brown' },

  nagy: { // Convert — bushy black hair, tan skin, blush, gentle
    g: [
      '..hhhhhh..',
      'hhhhhhhhhh',
      'hhsssssshh',
      '.ssssssss.',
      '.swpsswps.',
      '.sbssssbs.',
      '..ssnnss..',
      '...mmmm...',
      '...ssss...',
      '..cccccc..',
    ], s: 'tan', h: 'black' },

  wright: { // Trunky — receding gray hair, bags under eyes, frown
    g: [
      '..........',
      '.hhsssshh.',
      '.ssssssss.',
      '.ssssssss.',
      '.swpsswps.',
      '.sdssssds.',
      '..ssnnss..',
      '..mmmmmm..',
      '...ssss...',
      '..cccccc..',
    ], s: 'light', h: 'gray' },

  park: { // Zone Leader — neat black hair, medium skin, firm jaw
    g: [
      '..hhhhhh..',
      '.hhhhhhhh.',
      'hhsssssshh',
      '.ssssssss.',
      '.swpsswps.',
      '.ssssssss.',
      '..ssnnss..',
      '...mmmm...',
      '..ssssss..',
      '..cccccc..',
    ], s: 'medium', h: 'black' },

  jensen: { // Gamer — messy blond hair, big grin
    g: [
      '.hhh..hhh.',
      '.hhhhhhhh.',
      'hhsssssshh',
      '.ssssssss.',
      '.swpsswps.',
      '.ssssssss.',
      '..ssnnss..',
      '.smmmmmms.',
      '...ssss...',
      '..cccccc..',
    ], s: 'light', h: 'blond' },

  mortensen: { // True Believer — slicked dark hair, intense, wide jaw
    g: [
      'hhhhhhhhhh',
      'hhhhhhhhhh',
      '.hssssssh.',
      '.ssssssss.',
      '.swpsswps.',
      '.ssssssss.',
      '..ssnnss..',
      '..smmmms..',
      '..ssssss..',
      '..cccccc..',
    ], s: 'light', h: 'black' },

  kimball: { // Homesick Kid — light brown hair, small sad mouth
    g: [
      '..hhhhhh..',
      '.hhhhhhhh.',
      '.hssssssh.',
      '.ssssssss.',
      '.swpsswps.',
      '.ssssssss.',
      '..ssnnss..',
      '...smms...',
      '...ssss...',
      '..cccccc..',
    ], s: 'light', h: 'lbrown' },
}

// ── Investigator Templates ──────────────────────────────────

const I = {
  seeker: [ // curious, open
    '..hhhhhh..', '.hhhhhhhh.', '.hssssssh.', '.ssssssss.',
    '.swpsswps.', '.ssssssss.', '..ssnnss..', '...mmmm...',
    '...ssss...', '..cccccc..',
  ],
  skeptic: [ // furrowed brow, stern
    '..hhhhhh..', '.hhhhhhhh.', 'hhsssssshh', '.dssssssd.',
    '.swpsswps.', '.ssssssss.', '..ssnnss..', '..mmmmmm..',
    '...ssss...', '..cccccc..',
  ],
  lonely: [ // gentle, blush, small mouth
    '..hhhhhh..', '.hhhhhhhh.', '.hssssssh.', '.ssssssss.',
    '.swpsswps.', '.sbssssbs.', '..ssnnss..', '...smms...',
    '...ssss...', '..cccccc..',
  ],
  english_student: [ // neat, studious
    '..hhhhhh..', '.hhhhhhhh.', '.hssssssh.', '.ssssssss.',
    '.swpsswps.', '.ssssssss.', '..ssnnss..', '..smmmms..',
    '...ssss...', '..cccccc..',
  ],
  rebel: [ // messy hair, wide jaw, flat mouth
    '.hhh..hhh.', 'hhhhhhhhhh', 'hhsssssshh', '.ssssssss.',
    '.swpsswps.', '.ssssssss.', '..ssnnss..', '..mmmmmm..',
    '..ssssss..', '..cccccc..',
  ],
  referral: [ // friendly, blush, big smile
    '..hhhhhh..', '.hhhhhhhh.', '.hssssssh.', '.ssssssss.',
    '.swpsswps.', '.sbssssbs.', '..ssnnss..', '.smmmmmms.',
    '...ssss...', '..cccccc..',
  ],
  intellectual: [ // glasses (gray eye-whites)
    '..hhhhhh..', '.hhhhhhhh.', '.hssssssh.', '.ssssssss.',
    '.sgpssgps.', '.ssssssss.', '..ssnnss..', '...mmmm...',
    '...ssss...', '..cccccc..',
  ],
  golden: [ // warm, blush, kind smile
    '..hhhhhh..', '.hhhhhhhh.', '.hssssssh.', '.ssssssss.',
    '.swpsswps.', '.sbssssbs.', '..ssnnss..', '..smmmms..',
    '...ssss...', '..cccccc..',
  ],
}

const PKEY = {
  'The Seeker': 'seeker',
  'The Skeptic': 'skeptic',
  'The Lonely': 'lonely',
  'English Student': 'english_student',
  'The Rebel': 'rebel',
  'The Referral': 'referral',
  'The Intellectual': 'intellectual',
  'The Golden': 'golden',
}

const SK = ['light', 'medium', 'tan', 'dark']
const HK = ['brown', 'black', 'blond', 'red', 'lbrown']

// ── Public API ──────────────────────────────────────────────

export function getCompanionPortrait(companion) {
  const id = companion.id || companion.name?.split(' ').pop()?.toLowerCase()
  const def = C[id] || C.thompson
  return build(def.g, def.s, def.h)
}

export function getInvestigatorPortrait(investigator) {
  const key = PKEY[investigator.personality] || 'seeker'
  const grid = I[key]
  const h = hash(investigator.name || 'x')
  return build(grid, SK[h % 4], HK[(h >> 3) % 5], SHIRTS[(h >> 6) % SHIRTS.length])
}
