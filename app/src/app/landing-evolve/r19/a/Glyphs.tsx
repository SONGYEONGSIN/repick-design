// Generative, flat solid-fill exhibit illustrations — no photography, no line-art/blueprint
// schematics (every shape below is either filled or drawn with a thick round-capped stroke so it
// reads as a solid mark, never a thin technical outline). Every coordinate is a hand-picked
// integer literal, nothing computed at runtime (no trig, no Math.*), so there is nothing here that
// can hydration-mismatch between server and client. All four are purely decorative: `aria-hidden`
// + `role="presentation"`, no `<text>` nodes — the real information each one illustrates (grade,
// inspection points) is carried by real HTML text beside it, never inside the SVG.

import { COLOR } from "./tokens";

const common = {
  "aria-hidden": true as const,
  role: "presentation" as const,
  viewBox: "0 0 400 300",
  preserveAspectRatio: "xMidYMid meet",
};

export function ChairGlyph({ className }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <ellipse cx="200" cy="256" rx="72" ry="9" fill={COLOR.ink} opacity="0.14" />
      <rect x="194" y="196" width="12" height="56" fill={COLOR.ink} />
      <rect x="118" y="176" width="164" height="34" rx="16" fill={COLOR.ink} />
      <ellipse cx="108" cy="172" rx="17" ry="10" fill={COLOR.ink} />
      <ellipse cx="292" cy="172" rx="17" ry="10" fill={COLOR.ink} />
      <ellipse cx="200" cy="128" rx="86" ry="62" fill={COLOR.ink} />
      <ellipse cx="200" cy="118" rx="58" ry="38" fill={COLOR.bg} opacity="0.16" />
      <ellipse cx="200" cy="58" rx="52" ry="32" fill={COLOR.ink} />
      <circle cx="164" cy="106" r="5" fill={COLOR.accent} />
      <circle cx="238" cy="188" r="5" fill={COLOR.accent} />
    </svg>
  );
}

export function WatchGlyph({ className }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <rect x="172" y="18" width="56" height="66" rx="10" fill={COLOR.ink} />
      <rect x="172" y="216" width="56" height="66" rx="10" fill={COLOR.ink} />
      <rect x="270" y="142" width="14" height="16" rx="3" fill={COLOR.ink} />
      <circle cx="200" cy="150" r="76" fill={COLOR.ink} />
      <circle cx="200" cy="150" r="58" fill={COLOR.bg} />
      <rect x="196" y="104" width="8" height="48" rx="4" fill={COLOR.ink} />
      <rect x="200" y="147" width="38" height="7" rx="3.5" fill={COLOR.ink} />
      <circle cx="200" cy="150" r="6" fill={COLOR.accent} />
      <circle cx="200" cy="104" r="4" fill={COLOR.accent} />
    </svg>
  );
}

export function BikeGlyph({ className }: { className?: string }) {
  const stroke = { stroke: COLOR.ink, strokeWidth: 12, strokeLinecap: "round" as const, fill: "none" };
  return (
    <svg {...common} className={className}>
      <circle cx="96" cy="214" r="54" fill="none" stroke={COLOR.ink} strokeWidth="14" />
      <circle cx="304" cy="214" r="54" fill="none" stroke={COLOR.ink} strokeWidth="14" />
      <path d="M170 214 L96 214" {...stroke} />
      <path d="M170 214 L150 112" {...stroke} />
      <path d="M150 112 L96 214" {...stroke} />
      <path d="M150 112 L250 112" {...stroke} />
      <path d="M250 112 L170 214" {...stroke} />
      <path d="M250 112 L304 214" {...stroke} />
      <path d="M250 112 L250 82" {...stroke} />
      <rect x="234" y="72" width="46" height="10" rx="5" fill={COLOR.ink} />
      <ellipse cx="150" cy="98" rx="22" ry="8" fill={COLOR.ink} />
      <circle cx="96" cy="214" r="6" fill={COLOR.accent} />
      <circle cx="304" cy="214" r="6" fill={COLOR.accent} />
    </svg>
  );
}

export function RugGlyph({ className }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <rect x="40" y="42" width="320" height="216" rx="6" fill={COLOR.ink} />
      <rect x="66" y="68" width="268" height="164" rx="3" fill={COLOR.bg} />
      <rect x="94" y="96" width="212" height="108" fill="none" stroke={COLOR.accent} strokeWidth="6" />
      <polygon points="200,120 240,150 200,180 160,150" fill={COLOR.ink} />
      <circle cx="94" cy="96" r="5" fill={COLOR.accent} />
      <circle cx="306" cy="204" r="5" fill={COLOR.accent} />
    </svg>
  );
}
