import type { AngleId } from "./data";

/**
 * Meridian Exchange draws its own lens illustration instead of photographing a fictional SKU:
 * one deterministic SVG front-element view and one mount-side view, both driven by a `wear`
 * level so the Certified column visibly changes with the selected condition grade while the
 * New column always renders `wear="none"`. No trigonometry is used for coordinates — every
 * position below is a fixed literal, and the mount contacts use hand-placed points rather than
 * a computed arc, so hydration never disagrees on a rounded sine/cosine value.
 */

type Wear = "none" | "faint" | "light" | "moderate";

const BARREL = "#3F3F46"; // zinc-700 — shared barrel color across both columns
const BARREL_DARK = "#27272A";
const GLASS_RING = "#0369A1"; // sky-700 accent, echoed in the coating reflection only

const WEAR_MARKS: Record<Wear, { x: number; y: number; len: number; opacity: number }[]> = {
  none: [],
  faint: [{ x: 168, y: 92, len: 10, opacity: 0.28 }],
  light: [
    { x: 168, y: 92, len: 10, opacity: 0.4 },
    { x: 120, y: 150, len: 14, opacity: 0.32 },
  ],
  moderate: [
    { x: 168, y: 92, len: 12, opacity: 0.5 },
    { x: 120, y: 150, len: 16, opacity: 0.44 },
    { x: 210, y: 140, len: 9, opacity: 0.38 },
    { x: 96, y: 100, len: 11, opacity: 0.34 },
  ],
};

// Mount contact points — hand-placed, not derived from an angle computation.
const MOUNT_CONTACTS: { x: number; y: number }[] = [
  { x: 150, y: 58 },
  { x: 196, y: 72 },
  { x: 222, y: 110 },
  { x: 216, y: 156 },
  { x: 180, y: 184 },
  { x: 128, y: 184 },
  { x: 90, y: 156 },
  { x: 84, y: 110 },
  { x: 108, y: 72 },
];

function FrontView({ wear, titleId }: { wear: Wear; titleId: string }) {
  return (
    <svg viewBox="0 0 300 220" className="h-full w-full" role="img" aria-labelledby={titleId}>
      <title id={titleId}>Front element view of the Meridian FE 35mm lens</title>
      <rect x="0" y="0" width="300" height="220" fill="#F1F5F9" />
      <ellipse cx="150" cy="188" rx="92" ry="10" fill="#000000" opacity="0.08" />
      <circle cx="150" cy="108" r="86" fill={BARREL} stroke="#00000030" strokeWidth="1.5" />
      <circle cx="150" cy="108" r="86" fill="none" stroke="#FFFFFF" strokeOpacity="0.06" strokeWidth="10" />
      <circle cx="150" cy="108" r="66" fill={BARREL_DARK} />
      <circle cx="150" cy="108" r="52" fill="#0F172A" />
      <circle cx="150" cy="108" r="52" fill="none" stroke={GLASS_RING} strokeWidth="2" opacity="0.55" />
      <circle cx="150" cy="108" r="38" fill="#1E293B" />
      <circle cx="134" cy="92" r="14" fill="#FFFFFF" opacity="0.14" />
      {/* focus ring knurling — twelve fixed marks, rotated by a constant 30° step */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
        <rect key={i} x="148.5" y="20" width="3" height="10" fill="#00000022" transform={`rotate(${i * 30} 150 108)`} />
      ))}
      {WEAR_MARKS[wear].map((m, i) => (
        <line
          key={i}
          x1={m.x}
          y1={m.y}
          x2={m.x + m.len}
          y2={m.y + 3}
          stroke="#F8FAFC"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity={m.opacity}
        />
      ))}
    </svg>
  );
}

function MountView({ wear, titleId }: { wear: Wear; titleId: string }) {
  return (
    <svg viewBox="0 0 300 220" className="h-full w-full" role="img" aria-labelledby={titleId}>
      <title id={titleId}>Mount-side view of the Meridian FE 35mm lens, showing the electronic contacts</title>
      <rect x="0" y="0" width="300" height="220" fill="#F1F5F9" />
      <ellipse cx="150" cy="188" rx="92" ry="10" fill="#000000" opacity="0.08" />
      <circle cx="150" cy="120" r="82" fill="#D4D4D8" stroke="#00000030" strokeWidth="1.5" />
      <circle cx="150" cy="120" r="82" fill="none" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="6" />
      <circle cx="150" cy="120" r="58" fill="#A1A1AA" />
      <circle cx="150" cy="120" r="58" fill="none" stroke="#71717A" strokeWidth="1" />
      <circle cx="150" cy="120" r="30" fill="#18181B" />
      {MOUNT_CONTACTS.map((c, i) => (
        <rect key={i} x={c.x - 4} y={c.y - 3} width="8" height="6" rx="1.5" fill="#FDE68A" stroke="#00000030" />
      ))}
      {/* mounting index mark */}
      <rect x="146" y="34" width="8" height="14" rx="1.5" fill="#DC2626" />
      {WEAR_MARKS[wear].map((m, i) => (
        <line
          key={i}
          x1={m.x - 40}
          y1={m.y + 30}
          x2={m.x - 40 + m.len}
          y2={m.y + 33}
          stroke="#3F3F46"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity={m.opacity}
        />
      ))}
    </svg>
  );
}

export default function LensArt({
  angle,
  wear,
  titleId,
}: {
  angle: AngleId;
  wear: Wear;
  titleId: string;
}) {
  return angle === "front" ? <FrontView wear={wear} titleId={titleId} /> : <MountView wear={wear} titleId={titleId} />;
}
