// Deterministic, network-free "generative art" thumbnails. No photos, no
// raster images, no random hosts — just hand-authored SVG with every
// coordinate written to at most 2 decimal places (hydration-mismatch safe
// by construction, since nothing is computed at render time).

export type ThumbVariant = "jacket" | "watch" | "sneaker" | "camera";

const BASE = "#15151b";
const LINE = "rgba(244,63,94,0.16)";
const LINE_SOFT = "rgba(244,63,94,0.08)";
const EDGE = "rgba(255,255,255,0.06)";

function JacketArt() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true" focusable="false">
      <rect width="400" height="300" fill={BASE} />
      <path d="M0 210.5 L400 148.25" stroke={LINE} strokeWidth="1.5" />
      <path d="M0 240.75 L400 182.5" stroke={LINE_SOFT} strokeWidth="1.5" />
      <path d="M0 268.2 L400 214.9" stroke={LINE_SOFT} strokeWidth="1.5" />
      <circle cx="312.4" cy="78.6" r="46.25" fill="none" stroke={LINE} strokeWidth="1.5" />
      <circle cx="312.4" cy="78.6" r="78.9" fill="none" stroke={LINE_SOFT} strokeWidth="1" />
      <rect x="0" y="0" width="400" height="300" fill="none" stroke={EDGE} />
    </svg>
  );
}

function WatchArt() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true" focusable="false">
      <rect width="400" height="300" fill={BASE} />
      <circle cx="200" cy="150" r="64.35" fill="none" stroke={LINE} strokeWidth="1.5" />
      <circle cx="200" cy="150" r="92.1" fill="none" stroke={LINE_SOFT} strokeWidth="1" />
      <line x1="200" y1="150" x2="200" y2="99.4" stroke={LINE} strokeWidth="1.5" />
      <line x1="200" y1="150" x2="233.75" y2="150" stroke={LINE} strokeWidth="1.5" />
      <path d="M0 40.6 L400 18.9" stroke={LINE_SOFT} strokeWidth="1" />
      <rect x="0" y="0" width="400" height="300" fill="none" stroke={EDGE} />
    </svg>
  );
}

function SneakerArt() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true" focusable="false">
      <rect width="400" height="300" fill={BASE} />
      <path d="M-20 60.3 L420 118.75" stroke={LINE} strokeWidth="1.5" />
      <path d="M-20 92.6 L420 151.1" stroke={LINE_SOFT} strokeWidth="1.5" />
      <path d="M-20 124.9 L420 183.45" stroke={LINE_SOFT} strokeWidth="1" />
      <circle cx="88.5" cy="226.8" r="30.15" fill="none" stroke={LINE} strokeWidth="1.5" />
      <rect x="0" y="0" width="400" height="300" fill="none" stroke={EDGE} />
    </svg>
  );
}

function CameraArt() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true" focusable="false">
      <rect width="400" height="300" fill={BASE} />
      <rect x="54.2" y="86.4" width="291.6" height="18.1" fill="none" stroke={LINE_SOFT} strokeWidth="1" />
      <circle cx="200" cy="162.5" r="58.75" fill="none" stroke={LINE} strokeWidth="1.5" />
      <circle cx="200" cy="162.5" r="36.4" fill="none" stroke={LINE} strokeWidth="1" />
      <circle cx="200" cy="162.5" r="86.1" fill="none" stroke={LINE_SOFT} strokeWidth="1" />
      <rect x="0" y="0" width="400" height="300" fill="none" stroke={EDGE} />
    </svg>
  );
}

export function ThumbArt({ variant }: { variant: ThumbVariant }) {
  switch (variant) {
    case "jacket":
      return <JacketArt />;
    case "watch":
      return <WatchArt />;
    case "sneaker":
      return <SneakerArt />;
    case "camera":
      return <CameraArt />;
  }
}
