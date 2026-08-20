import { AXES, RADAR, SPOKES, polygonPoints, axisPoint, AMBER_INK, cx, NUM } from "./data";

/**
 * One listing's 5-axis radar. Two polygons share the grid: the listing's own profile (pale) and the
 * buyer's ideal (amber). The amber shape is a pure function of the chip/weight state, so it redraws
 * on every manipulation; where it sits *inside* the listing shape is the visual match, and the
 * centred number is the exact overlap area `matchPercent` computed. All coordinates come from
 * `axisPoint`, rounded to 2 decimals — no trig runs here. SVG text is not counted toward the route's
 * font-weight budget, so the numeral face is free to be heavier without adding a fourth weight.
 *
 * Not a control and not interactive on its own; `aria-hidden` because the card's proof row already
 * states the same match%, grade and axes in real text next to it.
 */
export default function Radar({
  listingValues,
  idealValues,
  match,
  className,
}: {
  listingValues: number[];
  idealValues: number[];
  match: number;
  className?: string;
}) {
  return (
    <svg
      viewBox={`0 0 ${RADAR.size} ${RADAR.size}`}
      className={cx("h-full w-full", className)}
      aria-hidden
    >
      {/* faint grid: outer pentagon + a mid ring + five spokes */}
      <polygon
        points={polygonPoints([100, 100, 100, 100, 100])}
        fill="none"
        stroke="#ffffff"
        strokeOpacity={0.1}
        strokeWidth={1}
      />
      <polygon
        points={polygonPoints([50, 50, 50, 50, 50])}
        fill="none"
        stroke="#ffffff"
        strokeOpacity={0.06}
        strokeWidth={1}
      />
      {SPOKES.map(([x, y], k) => (
        <line
          key={AXES[k].id}
          x1={RADAR.cx}
          y1={RADAR.cy}
          x2={x}
          y2={y}
          stroke="#ffffff"
          strokeOpacity={0.08}
          strokeWidth={1}
        />
      ))}

      {/* listing polygon — pale, the item's own shape */}
      <polygon
        points={polygonPoints(listingValues)}
        fill="#e4e4e7"
        fillOpacity={0.08}
        stroke="#d4d4d8"
        strokeOpacity={0.55}
        strokeWidth={1}
        strokeLinejoin="round"
      />

      {/* ideal polygon — amber, what the buyer asked for; brightens on card hover/focus */}
      <polygon
        points={polygonPoints(idealValues)}
        fill={AMBER_INK}
        stroke={AMBER_INK}
        strokeWidth={1.5}
        strokeLinejoin="round"
        className="[fill-opacity:0.18] transition-[fill-opacity] duration-200 group-hover:[fill-opacity:0.32] group-focus-within:[fill-opacity:0.32] motion-reduce:transition-none"
      />

      {/* ideal vertices */}
      {idealValues.map((v, k) => {
        const [x, y] = axisPoint(k, v);
        return <circle key={AXES[k].id} cx={x} cy={y} r={1.7} fill={AMBER_INK} />;
      })}

      {/* centred match reading (SVG text — not counted in the weight budget) */}
      <text
        x={RADAR.cx}
        y={RADAR.cy - 3}
        textAnchor="middle"
        className={NUM}
        fill="#fbbf24"
        style={{ fontWeight: 800, fontSize: "26px" }}
      >
        {match}
      </text>
      <text
        x={RADAR.cx}
        y={RADAR.cy + 12}
        textAnchor="middle"
        fill="#fbbf24"
        style={{ fontWeight: 600, fontSize: "8px", letterSpacing: "0.14em" }}
      >
        % MATCH
      </text>
    </svg>
  );
}
