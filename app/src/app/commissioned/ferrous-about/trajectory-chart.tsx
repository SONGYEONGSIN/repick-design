import { DISPLAY, MILESTONES, VIEW, formatValue, pillar, trajectory, type PillarId } from "./data";

/**
 * The selected measure, drawn across the six milestones below it.
 *
 * Generated geometry rather than an image: the path string is arithmetic over the same
 * `MILESTONES` array the record section reads, so the curve cannot describe a history the prose
 * contradicts. Straight segments, not a spline — a smoothed curve would invent readings between
 * milestones that were never taken.
 *
 * The scale is per-series and unlabelled on purpose. This is a shape, not a gauge: the numbers it is
 * made of are printed in full beneath every milestone and, for a screen reader, in the table below.
 */
export default function TrajectoryChart({ selected }: { selected: PillarId }) {
  const p = pillar(selected);
  const { points, line, area, baseline } = trajectory(selected);
  const first = points[0];
  const last = points[points.length - 1];

  return (
    <figure className="relative m-0 rounded-2xl border border-stone-200 bg-white p-4 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="text-sm font-medium text-stone-900">{p.label}</h3>
        <p className="text-xs font-normal text-stone-600 tabular-nums">
          {first.year} &rarr; {last.year}
        </p>
      </div>

      <p className="mt-1 max-w-2xl text-sm leading-relaxed font-normal text-stone-600">{p.meaning}</p>

      <svg
        viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
        role="img"
        aria-label={`${p.label}, plotted at six milestones. ${first.year}: ${formatValue(p, first.value)}. ${
          last.year
        }: ${formatValue(p, last.value)}. Every reading is listed in the table that follows.`}
        className="mt-4 h-auto w-full"
      >
        <line x1={VIEW.padX} y1={baseline} x2={VIEW.w - VIEW.padX} y2={baseline} stroke="#e7e5e4" strokeWidth="1" />
        <path d={area} fill="#4d7c0f" fillOpacity="0.08" />
        <path d={line} fill="none" stroke="#4d7c0f" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((point) => (
          <circle
            key={point.year}
            cx={point.x}
            cy={point.y}
            r={point.year === last.year ? 5 : 3.5}
            fill={point.year === last.year ? "#4d7c0f" : "#ffffff"}
            stroke="#4d7c0f"
            strokeWidth="2"
          />
        ))}
      </svg>

      <div className="mt-2 flex items-baseline justify-between text-xs font-normal text-stone-600 tabular-nums">
        <span style={DISPLAY}>
          {first.year} &middot; {formatValue(p, first.value)}
        </span>
        <span className="font-medium text-stone-900" style={DISPLAY}>
          {last.year} &middot; {formatValue(p, last.value)}
        </span>
      </div>

      <table className="sr-only">
        <caption>{p.label} at each milestone year</caption>
        <thead>
          <tr>
            <th scope="col">Year</th>
            <th scope="col">{p.label}</th>
          </tr>
        </thead>
        <tbody>
          {MILESTONES.map((m) => (
            <tr key={m.year}>
              <th scope="row">{m.year}</th>
              <td>{formatValue(p, m.readings[selected])}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <figcaption className="mt-4 border-t border-stone-200 pt-4 text-sm leading-relaxed font-normal text-stone-600">
        {p.reading}
      </figcaption>
    </figure>
  );
}
