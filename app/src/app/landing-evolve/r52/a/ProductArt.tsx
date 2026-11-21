import type { ReactElement } from "react";
import type { Category } from "./data";
import { ACCENT_HEX } from "./tokens";

// Generated SVG product art -- solid flat geometric fills, deliberately not thin-line/outline
// "blueprint" schematic drawing (that look is explicitly penalized by this repo's anti-slop list).
// Every coordinate below is a hardcoded literal; nothing is computed from Math.sin/cos at runtime,
// so there is no hydration-mismatch risk and no rounding rule to apply.

const PANEL = "#15151C";
const SHAPE_MUTED = "#3A3A46";
const SHAPE_LIGHT = "#6B6B78";

function SneakerArt() {
  return (
    <svg viewBox="0 0 160 160" className="h-full w-full" role="presentation" aria-hidden="true">
      <rect width="160" height="160" fill={PANEL} />
      <path d="M28 108 L60 92 L108 96 L136 112 L132 128 L30 128 Z" fill={SHAPE_LIGHT} />
      <path d="M60 92 L108 96 L104 110 L58 108 Z" fill={SHAPE_MUTED} />
      <rect x="30" y="124" width="102" height="8" rx="4" fill={ACCENT_HEX} />
    </svg>
  );
}

function WatchArt() {
  return (
    <svg viewBox="0 0 160 160" className="h-full w-full" role="presentation" aria-hidden="true">
      <rect width="160" height="160" fill={PANEL} />
      <rect x="68" y="20" width="24" height="34" rx="4" fill={SHAPE_MUTED} />
      <rect x="68" y="106" width="24" height="34" rx="4" fill={SHAPE_MUTED} />
      <circle cx="80" cy="80" r="38" fill={SHAPE_LIGHT} />
      <circle cx="80" cy="80" r="28" fill={PANEL} />
      <rect x="78" y="58" width="4" height="24" rx="2" fill={ACCENT_HEX} />
    </svg>
  );
}

function JacketArt() {
  return (
    <svg viewBox="0 0 160 160" className="h-full w-full" role="presentation" aria-hidden="true">
      <rect width="160" height="160" fill={PANEL} />
      <path d="M46 40 L64 28 L96 28 L114 40 L118 120 L42 120 Z" fill={SHAPE_LIGHT} />
      <path d="M46 40 L28 72 L38 84 L52 56 Z" fill={SHAPE_MUTED} />
      <path d="M114 40 L132 72 L122 84 L108 56 Z" fill={SHAPE_MUTED} />
      <rect x="77" y="28" width="6" height="92" fill={PANEL} />
      <circle cx="80" cy="50" r="3" fill={ACCENT_HEX} />
    </svg>
  );
}

function CameraArt() {
  return (
    <svg viewBox="0 0 160 160" className="h-full w-full" role="presentation" aria-hidden="true">
      <rect width="160" height="160" fill={PANEL} />
      <rect x="32" y="56" width="96" height="60" rx="8" fill={SHAPE_LIGHT} />
      <rect x="58" y="44" width="30" height="14" rx="3" fill={SHAPE_MUTED} />
      <circle cx="80" cy="86" r="22" fill={PANEL} />
      <circle cx="80" cy="86" r="14" fill={ACCENT_HEX} />
    </svg>
  );
}

function BagArt() {
  return (
    <svg viewBox="0 0 160 160" className="h-full w-full" role="presentation" aria-hidden="true">
      <rect width="160" height="160" fill={PANEL} />
      <path
        d="M58 50 C58 34 102 34 102 50"
        fill="none"
        stroke={SHAPE_LIGHT}
        strokeWidth="8"
        strokeLinecap="round"
      />
      <rect x="36" y="50" width="88" height="70" rx="10" fill={SHAPE_LIGHT} />
      <rect x="36" y="78" width="88" height="10" fill={SHAPE_MUTED} />
      <rect x="74" y="78" width="12" height="10" fill={ACCENT_HEX} />
    </svg>
  );
}

function LampArt() {
  return (
    <svg viewBox="0 0 160 160" className="h-full w-full" role="presentation" aria-hidden="true">
      <rect width="160" height="160" fill={PANEL} />
      <path d="M56 42 L104 42 L118 84 L42 84 Z" fill={SHAPE_LIGHT} />
      <rect x="77" y="84" width="6" height="40" fill={SHAPE_MUTED} />
      <rect x="54" y="124" width="52" height="8" rx="4" fill={SHAPE_MUTED} />
      <circle cx="80" cy="63" r="6" fill={ACCENT_HEX} />
    </svg>
  );
}

const ART: Record<Category, () => ReactElement> = {
  sneaker: SneakerArt,
  watch: WatchArt,
  jacket: JacketArt,
  camera: CameraArt,
  bag: BagArt,
  lamp: LampArt,
};

export function ProductArt({ category }: { category: Category }) {
  const Art = ART[category];
  return (
    <div
      className="aspect-[4/3] w-full overflow-hidden rounded-xl"
      style={{ backgroundColor: PANEL }}
    >
      <Art />
    </div>
  );
}
