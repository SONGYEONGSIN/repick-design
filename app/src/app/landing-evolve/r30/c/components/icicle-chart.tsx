import {
  SIGNALS,
  computeLeafRatios,
  computeOverall,
  computeShares,
  type Weights,
} from "./data";
import { Caption } from "./ui";

const ROOT_FILL = "#71717A"; // zinc-500, 4.06:1 on #0B0B0F — neutral "output" row, not a signal.

/**
 * The AI-match-driver icicle / partition chart.
 *
 * Three stacked horizontal rows, one per hierarchy level:
 *   1. Overall — a single full-width node, the final match score.
 *   2. Signal  — three branches (condition / brand & style / price), each
 *      sized by `raw score × its slider weight`, normalized to fill the row.
 *   3. Detail  — two leaves per branch, sized by a FIXED ratio of their own
 *      raw scores, scaled to their parent branch's current width.
 *
 * The colored rectangles are purely decorative (`aria-hidden`): the legend
 * beneath them is the real, always-visible text source for every number,
 * so no information here depends on color alone.
 */
export function IcicleChart({ weights }: { weights: Weights }) {
  const overall = computeOverall(weights);
  const shares = computeShares(weights);
  const leafRatios = computeLeafRatios();

  return (
    <div>
      <p className="sr-only" aria-live="polite">
        {`Overall match ${overall} percent.`}
      </p>

      <div aria-hidden="true" className="space-y-[6px]">
        <Row label="Overall">
          <div
            className="h-14 rounded-[3px] motion-reduce:transition-none transition-[width] duration-300 sm:h-16"
            style={{ width: "100%", backgroundColor: ROOT_FILL }}
          />
        </Row>

        <Row label="Signal">
          <div className="flex h-12 gap-[3px] sm:h-14">
            {SIGNALS.map((signal) => (
              <div
                key={signal.id}
                className="h-full min-w-0 rounded-[3px] motion-reduce:transition-none transition-[width] duration-300"
                style={{ width: `${shares[signal.id]}%`, backgroundColor: signal.fill }}
              />
            ))}
          </div>
        </Row>

        <Row label="Detail">
          <div className="flex h-9 gap-[3px] sm:h-10">
            {SIGNALS.map((signal) =>
              signal.leaves.map((leaf) => (
                <div
                  key={leaf.id}
                  className="h-full min-w-0 rounded-[3px] opacity-70 motion-reduce:transition-none transition-[width] duration-300"
                  style={{
                    width: `${shares[signal.id] * leafRatios[leaf.id]}%`,
                    backgroundColor: signal.fill,
                  }}
                />
              )),
            )}
          </div>
        </Row>
      </div>

      <p className="mt-4 text-sm text-zinc-400">
        Overall AI match right now:{" "}
        <span className="font-bold tabular-nums tracking-[0.12em] text-white">{overall}%</span>
      </p>

      <dl className="mt-6 grid gap-6 border-t border-white/10 pt-6 sm:grid-cols-3">
        {SIGNALS.map((signal) => (
          <div key={signal.id} className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: signal.fill }}
              />
              <dt className="text-sm font-semibold text-zinc-100">{signal.label}</dt>
            </div>
            <dd className="mt-1 text-[13px] text-zinc-400">
              {shares[signal.id]}% of this score · raw signal {signal.raw}/100
            </dd>
            <dd>
              <ul className="mt-2 space-y-1">
                {signal.leaves.map((leaf) => (
                  <li key={leaf.id} className="text-[13px] leading-[1.5] text-zinc-400">
                    <span className="text-zinc-300">{leaf.label}</span> — {leaf.raw}/100
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <Caption className="w-[52px] shrink-0 sm:w-16">{label}</Caption>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
