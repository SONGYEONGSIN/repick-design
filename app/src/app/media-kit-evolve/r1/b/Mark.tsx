import type { Rendering } from './data';

export function Mark({ size = 64 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className="block shrink-0"
    >
      <rect x="3" y="3" width="58" height="58" rx="16" stroke="currentColor" strokeWidth="3" />
      <path d="M22 16V48" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <path
        d="M22 19h13a9 9 0 0 1 0 18H22"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M33 37 46 48" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

function Hatch({ uid }: { uid: string }) {
  const id = `hatch-${uid}`;
  return (
    <svg aria-hidden="true" className="absolute inset-0 h-full w-full text-zinc-700">
      <defs>
        <pattern id={id} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="14" stroke="currentColor" strokeWidth="7" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

export function Specimen({ r, uid, markSize = 56 }: { r: Rendering; uid: string; markSize?: number }) {
  return (
    <div className={`absolute inset-0 flex ${r.plate}`}>
      {r.pattern ? <Hatch uid={uid} /> : null}
      {r.crowd ? (
        <span className="relative text-sm font-normal text-zinc-300">Annual report</span>
      ) : null}
      <div
        className={`relative flex items-center gap-4 ${r.ink} ${r.effect ?? ''}`}
        style={r.transform ? { transform: r.transform } : undefined}
      >
        <Mark size={markSize} />
        {r.markOnly ? null : (
          <span
            className={`whitespace-nowrap text-3xl font-bold tracking-tight ${r.wordInk ?? ''}`}
            style={{
              fontFamily: 'var(--font-display-mono)',
              transform: r.wordScale ? `scale(${r.wordScale})` : undefined,
            }}
          >
            repick
          </span>
        )}
      </div>
      {r.crowd ? (
        <span className="relative text-sm font-normal tabular-nums text-zinc-300">Q4 2026</span>
      ) : null}
    </div>
  );
}
