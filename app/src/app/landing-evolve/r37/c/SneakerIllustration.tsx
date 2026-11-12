import { HOTSPOTS } from "./hotspots";

const VIEW_W = 640;
const VIEW_H = 400;

/**
 * Hand-built flat/geometric sneaker illustration — no photo, no line-art
 * blueprint decoration, just filled shapes on a 640×400 (8:5) canvas.
 * Purely presentational: it draws the shoe and, for any hotspot id in
 * `found`, a small permanent checkmark badge at that hotspot's fixed
 * coordinate. The same component is rendered twice by `MagnifierDevice`
 * (once as the base layer, once scaled up inside the lens' clip-path), so
 * geometry lives in exactly one place.
 */
export default function SneakerIllustration({ found }: { found: ReadonlySet<string> }) {
  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className="h-full w-full"
      role="img"
      aria-label="Side profile illustration of a sneaker used to demonstrate the authenticity scan"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* sole band */}
      <path
        d="M70,330 C70,310 90,298 130,298 L520,298 C560,298 582,312 586,332
           C588,352 566,362 530,362 L112,362 C84,362 70,350 70,330 Z"
        fill="#27272A"
        stroke="#3F3F46"
        strokeWidth="2"
      />
      {/* sole tread lines (sole-wear zone) */}
      {[160, 205, 250, 295, 340, 385, 430].map((x) => (
        <line key={x} x1={x} y1={318} x2={x - 14} y2={348} stroke="#52525B" strokeWidth="4" strokeLinecap="round" />
      ))}

      {/* upper body */}
      <path
        d="M120,300 C110,230 120,160 160,120 C190,95 230,85 270,88
           C300,90 310,110 330,115 C370,122 420,110 460,130
           C500,150 530,180 545,215 C558,245 560,275 545,298 Z"
        fill="#3F3F46"
        stroke="#52525B"
        strokeWidth="2"
      />

      {/* toe stitching (dashed seam near the toe cap) */}
      <path
        d="M470,292 C495,280 520,268 540,252"
        fill="none"
        stroke="#A1A1AA"
        strokeWidth="2.5"
        strokeDasharray="6 6"
        strokeLinecap="round"
      />

      {/* heel serial tag */}
      <rect x="94" y="150" width="42" height="56" rx="8" fill="#18181B" stroke="#52525B" strokeWidth="2" />
      <line x1="102" y1="166" x2="128" y2="166" stroke="#A1A1AA" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="102" y1="178" x2="128" y2="178" stroke="#A1A1AA" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="102" y1="190" x2="120" y2="190" stroke="#A1A1AA" strokeWidth="2.5" strokeLinecap="round" />

      {/* tongue */}
      <rect x="255" y="118" width="72" height="128" rx="18" fill="#52525B" stroke="#71717A" strokeWidth="2" />

      {/* eyelets + laces */}
      {[135, 163, 191, 219].map((y, i) => (
        <g key={y}>
          <circle cx={268} cy={y} r="6" fill="#18181B" stroke="#A1A1AA" strokeWidth="2" />
          <circle cx={314} cy={y} r="6" fill="#18181B" stroke="#A1A1AA" strokeWidth="2" />
          {i < 3 && (
            <line x1={274} y1={y} x2={308} y2={y + 28} stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" />
          )}
          {i < 3 && (
            <line x1={308} y1={y} x2={274} y2={y + 28} stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" />
          )}
        </g>
      ))}

      {/* logo stamp (swoosh) */}
      <path
        d="M352,232 C392,206 432,190 482,196 C462,208 420,224 386,248 C374,254 360,246 352,232 Z"
        fill="#34D399"
      />

      {/* fixed, low-emphasis markers for hotspots not yet found — affordance only */}
      {HOTSPOTS.filter((h) => !found.has(h.id)).map((h) => (
        <circle
          key={h.id}
          cx={(h.xPct / 100) * VIEW_W}
          cy={(h.yPct / 100) * VIEW_H}
          r="7"
          fill="none"
          stroke="#71717A"
          strokeWidth="2"
          strokeDasharray="3 4"
          opacity="0.85"
        />
      ))}

      {/* permanent checkmark badges for found hotspots */}
      {HOTSPOTS.filter((h) => found.has(h.id)).map((h) => {
        const cx = (h.xPct / 100) * VIEW_W;
        const cy = (h.yPct / 100) * VIEW_H;
        return (
          <g key={h.id}>
            <circle cx={cx} cy={cy} r="12" fill="#047857" stroke="#34D399" strokeWidth="2" />
            <path
              d={`M${cx - 5},${cy} l3.5,4 l6.5,-7.5`}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        );
      })}
    </svg>
  );
}
