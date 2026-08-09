import type { ReactNode } from 'react'

import type { AssetId, MisuseKind } from './data'

type Tone = { ink: string; accent: string }

const TILE_BLUE = '#1D4ED8'

/** The 48x48 symbol: two posts, a halyard run behind them, a knot at the crossing. */
function MarkGlyph({ ink, accent }: Tone) {
  return (
    <>
      <path d="M12 35L36 13" stroke={accent} strokeWidth="6" strokeLinecap="round" />
      <rect x="6" y="5" width="6" height="38" rx="1.5" fill={ink} />
      <rect x="36" y="5" width="6" height="38" rx="1.5" fill={ink} />
      <circle cx="24" cy="24" r="4.5" fill={ink} />
    </>
  )
}

/** Primary lockup contents in a 300x56 coordinate space. */
function LockupInner({ ink, accent }: Tone) {
  return (
    <>
      <g transform="translate(0 4)">
        <MarkGlyph ink={ink} accent={accent} />
      </g>
      <text
        x="72"
        y="38"
        textLength="228"
        lengthAdjust="spacingAndGlyphs"
        fontSize="30"
        fill={ink}
        className="font-medium"
        style={{ fontFamily: 'var(--font-display-wide)' }}
      >
        HALYARD
      </text>
    </>
  )
}

function PrimaryLockup({ ink, accent, width }: Tone & { width: number }) {
  return (
    <svg width={width} height={Math.round((width * 56) / 300)} viewBox="0 0 300 56" aria-hidden="true">
      <LockupInner ink={ink} accent={accent} />
    </svg>
  )
}

function StackedLockup({ ink, accent, width }: Tone & { width: number }) {
  return (
    <svg width={width} height={Math.round((width * 124) / 200)} viewBox="0 0 200 124" aria-hidden="true">
      <g transform="translate(76 0)">
        <MarkGlyph ink={ink} accent={accent} />
      </g>
      <text
        x="100"
        y="112"
        textAnchor="middle"
        textLength="184"
        lengthAdjust="spacingAndGlyphs"
        fontSize="26"
        fill={ink}
        className="font-medium"
        style={{ fontFamily: 'var(--font-display-wide)' }}
      >
        HALYARD
      </text>
    </svg>
  )
}

function WordmarkArt({ ink, width }: { ink: string; width: number }) {
  return (
    <svg width={width} height={Math.round((width * 44) / 240)} viewBox="0 0 240 44" aria-hidden="true">
      <text
        x="0"
        y="34"
        textLength="236"
        lengthAdjust="spacingAndGlyphs"
        fontSize="34"
        fill={ink}
        className="font-medium"
        style={{ fontFamily: 'var(--font-display-wide)' }}
      >
        HALYARD
      </text>
    </svg>
  )
}

function SymbolArt({ ink, accent, width }: Tone & { width: number }) {
  return (
    <svg width={width} height={width} viewBox="0 0 48 48" aria-hidden="true">
      <MarkGlyph ink={ink} accent={accent} />
    </svg>
  )
}

function AppIconArt({ width }: { width: number }) {
  return (
    <svg width={width} height={width} viewBox="0 0 112 112" aria-hidden="true">
      <rect x="0" y="0" width="112" height="112" rx="26" fill={TILE_BLUE} />
      <g transform="translate(32 32)">
        <MarkGlyph ink="#FFFFFF" accent="#BFDBFE" />
      </g>
    </svg>
  )
}

function MonogramArt({ ink, accent, width }: Tone & { width: number }) {
  return (
    <svg width={width} height={width} viewBox="0 0 96 96" aria-hidden="true">
      <rect x="2" y="2" width="92" height="92" rx="12" fill="none" stroke={ink} strokeWidth="3" />
      <path d="M26 72L70 24" stroke={accent} strokeWidth="5" strokeLinecap="round" />
      <text
        x="48"
        y="67"
        textAnchor="middle"
        fontSize="52"
        fill={ink}
        className="font-semibold"
        style={{ fontFamily: 'var(--font-display-wide)' }}
      >
        H
      </text>
    </svg>
  )
}

export function AssetArt({
  id,
  ink,
  accent,
  width,
  label,
}: {
  id: AssetId
  ink: string
  accent: string
  width: number
  label: string
}) {
  return (
    <span role="img" aria-label={label} className="block">
      {pickArt(id, ink, accent, width)}
    </span>
  )
}

function pickArt(id: AssetId, ink: string, accent: string, width: number): ReactNode {
  switch (id) {
    case 'lockup-primary':
      return <PrimaryLockup ink={ink} accent={accent} width={width} />
    case 'lockup-stacked':
      return <StackedLockup ink={ink} accent={accent} width={width} />
    case 'wordmark':
      return <WordmarkArt ink={ink} width={width} />
    case 'symbol':
      return <SymbolArt ink={ink} accent={accent} width={width} />
    case 'app-icon':
      return <AppIconArt width={width} />
    case 'monogram':
      return <MonogramArt ink={ink} accent={accent} width={width} />
    default:
      return null
  }
}

const DEMO_INK = '#0B0F14'
const DEMO_ACCENT = '#1D4ED8'

export function MisuseArt({ kind }: { kind: MisuseKind }) {
  return (
    <svg viewBox="0 0 240 96" className="h-auto w-full" aria-hidden="true">
      {pickMisuse(kind)}
    </svg>
  )
}

function pickMisuse(kind: MisuseKind): ReactNode {
  switch (kind) {
    case 'stretch':
      return (
        <g transform="translate(22 34) scale(0.65 0.4)">
          <LockupInner ink={DEMO_INK} accent={DEMO_ACCENT} />
        </g>
      )
    case 'recolour':
      return (
        <g transform="translate(96 24)">
          <MarkGlyph ink="#15803D" accent="#EA580C" />
        </g>
      )
    case 'lowcontrast':
      return (
        <>
          <rect x="16" y="6" width="208" height="84" rx="10" fill={DEMO_ACCENT} />
          <g transform="translate(96 24)">
            <MarkGlyph ink={DEMO_INK} accent="#1E3A8A" />
          </g>
        </>
      )
    case 'rotate':
      return (
        <g transform="translate(30 74) rotate(-16) scale(0.62)">
          <LockupInner ink={DEMO_INK} accent={DEMO_ACCENT} />
        </g>
      )
    case 'retype':
      return (
        <text
          x="120"
          y="60"
          textAnchor="middle"
          textLength="196"
          lengthAdjust="spacingAndGlyphs"
          fontSize="30"
          fill={DEMO_INK}
          className="font-normal"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          HALYARD
        </text>
      )
    case 'crowd':
      return (
        <>
          <rect x="0" y="0" width="58" height="96" rx="4" fill="#E4E4E7" />
          <g transform="translate(60 24)">
            <MarkGlyph ink={DEMO_INK} accent={DEMO_ACCENT} />
          </g>
          <rect x="112" y="10" width="4" height="76" rx="2" fill={DEMO_INK} />
          <rect x="128" y="34" width="96" height="6" rx="3" fill="#D4D4D8" />
          <rect x="128" y="52" width="70" height="6" rx="3" fill="#D4D4D8" />
        </>
      )
    default:
      return null
  }
}
