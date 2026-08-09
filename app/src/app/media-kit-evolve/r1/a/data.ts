export type SurfaceId = 'paper' | 'mist' | 'haze' | 'signal' | 'ink'

export type AssetId = 'lockup-primary' | 'lockup-stacked' | 'wordmark' | 'symbol' | 'app-icon' | 'monogram'

export type MisuseKind = 'stretch' | 'recolour' | 'lowcontrast' | 'rotate' | 'retype' | 'crowd'

export type Surface = {
  id: SurfaceId
  name: string
  hex: string
  tone: 'light' | 'dark'
  ink: string
  accent: string
  role: string
}

export type Asset = {
  id: AssetId
  code: string
  name: string
  file: string
  formats: string[]
  minWidth: string
  clearSpace: string
  approved: SurfaceId[]
  useFor: string
  fallback: string
  width: number
}

export const SURFACE_ORDER: SurfaceId[] = ['paper', 'mist', 'haze', 'signal', 'ink']

export const SURFACE_BY_ID: Record<SurfaceId, Surface> = {
  paper: {
    id: 'paper',
    name: 'Paper White',
    hex: '#FFFFFF',
    tone: 'light',
    ink: '#0B0F14',
    accent: '#1D4ED8',
    role: 'Default surface for print, documents and light interfaces.',
  },
  mist: {
    id: 'mist',
    name: 'Mist Grey',
    hex: '#F4F4F5',
    tone: 'light',
    ink: '#0B0F14',
    accent: '#1D4ED8',
    role: 'Secondary surface for cards, press sheets and stationery.',
  },
  haze: {
    id: 'haze',
    name: 'Haze Blue',
    hex: '#DBEAFE',
    tone: 'light',
    ink: '#0B0F14',
    accent: '#1D4ED8',
    role: 'Tinted surface for editorial pull-quotes and section breaks.',
  },
  signal: {
    id: 'signal',
    name: 'Signal Blue',
    hex: '#1D4ED8',
    tone: 'dark',
    ink: '#FFFFFF',
    accent: '#BFDBFE',
    role: 'The brand surface. Reversed artwork only, never positive art.',
  },
  ink: {
    id: 'ink',
    name: 'Ink Black',
    hex: '#0B0F14',
    tone: 'dark',
    ink: '#FFFFFF',
    accent: '#60A5FA',
    role: 'Dark surface for video end-cards, trade stands and dark interfaces.',
  },
}

export const INK_ONLY = {
  name: 'Deep Blue',
  hex: '#1E3A8A',
  role: 'Rules, links and emphasised figures on light surfaces. Never a background, never inside the mark.',
}

export const ASSET_ORDER: AssetId[] = [
  'lockup-primary',
  'lockup-stacked',
  'wordmark',
  'symbol',
  'app-icon',
  'monogram',
]

export const ASSET_BY_ID: Record<AssetId, Asset> = {
  'lockup-primary': {
    id: 'lockup-primary',
    code: 'A-01',
    name: 'Primary lockup',
    file: 'halyard-lockup-primary.svg',
    formats: ['SVG', 'PNG 2x', 'PDF', 'EPS'],
    minWidth: '120 px / 32 mm',
    clearSpace: 'One post width on all four sides',
    approved: ['paper', 'mist', 'haze', 'signal', 'ink'],
    useFor: 'The default. Press releases, partner sites, slide title cards, vehicle livery.',
    fallback: '',
    width: 300,
  },
  'lockup-stacked': {
    id: 'lockup-stacked',
    code: 'A-02',
    name: 'Stacked lockup',
    file: 'halyard-lockup-stacked.svg',
    formats: ['SVG', 'PNG 2x', 'PDF'],
    minWidth: '88 px / 24 mm',
    clearSpace: 'One post width on all four sides',
    approved: ['paper', 'mist', 'ink'],
    useFor: 'Square-ish placements: event boards, sponsor walls, avatars above 256 px.',
    fallback: 'On tinted or blue surfaces use the primary lockup, which holds its shape at low contrast.',
    width: 200,
  },
  wordmark: {
    id: 'wordmark',
    code: 'A-03',
    name: 'Wordmark',
    file: 'halyard-wordmark.svg',
    formats: ['SVG', 'PNG 2x', 'PDF', 'EPS'],
    minWidth: '96 px / 26 mm',
    clearSpace: 'One cap height on all four sides',
    approved: ['paper', 'mist', 'haze', 'signal', 'ink'],
    useFor: 'Where the symbol already appears nearby, or below 24 px of height.',
    fallback: '',
    width: 240,
  },
  symbol: {
    id: 'symbol',
    code: 'A-04',
    name: 'Symbol',
    file: 'halyard-symbol.svg',
    formats: ['SVG', 'PNG 2x', 'ICO'],
    minWidth: '16 px / 6 mm',
    clearSpace: 'Half a post width on all four sides',
    approved: ['paper', 'mist', 'haze', 'signal', 'ink'],
    useFor: 'Favicons, badges, stamped hardware, and any placement under 96 px.',
    fallback: '',
    width: 112,
  },
  'app-icon': {
    id: 'app-icon',
    code: 'A-05',
    name: 'App icon',
    file: 'halyard-app-icon.svg',
    formats: ['SVG', 'PNG 1024', 'ICNS'],
    minWidth: '44 px',
    clearSpace: 'None. The tile is the clear space',
    approved: ['paper', 'mist', 'ink'],
    useFor: 'Store listings and launcher tiles only. Never as an inline logo in running layout.',
    fallback: 'The tile carries its own Signal Blue field, so it disappears on blue and fights a tint. Use the symbol.',
    width: 132,
  },
  monogram: {
    id: 'monogram',
    code: 'A-06',
    name: 'Monogram',
    file: 'halyard-monogram.svg',
    formats: ['SVG', 'PNG 2x', 'DXF'],
    minWidth: '24 px / 8 mm',
    clearSpace: 'One stroke width outside the keyline',
    approved: ['paper', 'mist', 'signal', 'ink'],
    useFor: 'Repeat patterns, embossing, engraved hardware and single-character marks.',
    fallback: 'The keyline is too fine to hold on Haze Blue. Use the symbol at the same size instead.',
    width: 112,
  },
}

export const MISUSES: { id: string; kind: MisuseKind; title: string; rule: string }[] = [
  {
    id: 'm-stretch',
    kind: 'stretch',
    title: 'Distorted lockup',
    rule: 'Never scale on one axis to make the lockup fit a box. Scale proportionally and change the box instead.',
  },
  {
    id: 'm-recolour',
    kind: 'recolour',
    title: 'Recoloured mark',
    rule: 'The symbol carries two colours and they are fixed. It does not take a campaign palette, a gradient or a sponsor colour.',
  },
  {
    id: 'm-lowcontrast',
    kind: 'lowcontrast',
    title: 'Positive art on Signal Blue',
    rule: 'The dark mark on the brand blue loses the halyard line entirely. Reversed artwork ships for exactly this surface.',
  },
  {
    id: 'm-rotate',
    kind: 'rotate',
    title: 'Rotated lockup',
    rule: 'The lockup sits on the baseline at zero degrees in every placement, including spine text and vertical banners.',
  },
  {
    id: 'm-retype',
    kind: 'retype',
    title: 'Re-typeset wordmark',
    rule: 'The wordmark is drawn artwork with fixed letterfitting. Setting the name live in a substitute face is not the wordmark.',
  },
  {
    id: 'm-crowd',
    kind: 'crowd',
    title: 'Crowded mark',
    rule: 'Keep one post width between the mark and any rule, edge, caption or neighbouring logo. Nothing enters that band.',
  },
]
