import type { BreakdownRow } from "./payout-math";
import { ACCENT, ACCENT_LIGHT, ACCENT_TINT } from "./theme";

const SEGMENT_COLOR: Record<string, string> = {
  electronics: ACCENT, // sky-500
  fashion: ACCENT_LIGHT, // sky-300
  home: ACCENT_TINT, // sky-700
};

interface StackedBarProps {
  rows: BreakdownRow[];
  totalPayout: number;
}

/**
 * Horizontal stacked bar for the category mix — the share of the running
 * payout total each category contributes. Purely derived from `rows`, so
 * it redraws deterministically every time a stepper changes a count; no
 * state of its own.
 *
 * Color is never the only signal: every segment is bounded by a visible
 * white divider (so adjacent same-family sky shades stay distinguishable
 * regardless of their contrast against the page background) and the
 * legend below pairs each swatch with its category name and percentage in
 * running text.
 *
 * Segment widths are set directly (no animated transition): the motion
 * budget on this route's `transform`/`opacity`-only rule is spent on the
 * scroll-reveal entrance (via the `Reveal` this component is nested
 * inside) rather than on animating a layout-affecting `width` value on
 * every stepper click.
 */
export default function StackedBar({ rows, totalPayout }: StackedBarProps) {
  const active = rows.filter((row) => row.count > 0 && row.payout > 0);

  if (totalPayout <= 0 || active.length === 0) {
    return (
      <div>
        <div className="h-3 w-full overflow-hidden rounded-full border border-zinc-200 bg-zinc-100" />
        <p className="mt-3 text-sm text-zinc-600">
          Set at least one counter above zero to see your category mix here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div
        role="img"
        aria-label={`Payout mix: ${active
          .map((row) => `${row.label} ${row.sharePct}%`)
          .join(", ")}`}
        className="flex h-3 w-full overflow-hidden rounded-full border border-zinc-200"
      >
        {active.map((row, i) => (
          <div
            key={row.id}
            className={i < active.length - 1 ? "h-full border-r-2 border-white" : "h-full"}
            style={{ backgroundColor: SEGMENT_COLOR[row.id], width: `${row.sharePct}%` }}
          />
        ))}
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
        {active.map((row) => (
          <li key={row.id} className="flex items-center gap-2 text-sm text-zinc-700">
            <span
              aria-hidden="true"
              className="h-4 w-4 shrink-0 rounded-sm border border-zinc-300"
              style={{ backgroundColor: SEGMENT_COLOR[row.id] }}
            />
            <span className="font-bold text-zinc-950">{row.label}</span>
            <span className="tabular-nums text-zinc-600">{row.sharePct}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
