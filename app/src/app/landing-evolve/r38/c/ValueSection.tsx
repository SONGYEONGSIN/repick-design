import Reveal from "./Reveal";
import { Eyebrow, GhostNumeral } from "./ui";
import { AVG_TURNAROUND, REJECTION_RATE } from "./data";
import { CONTAINER, ACCENT_DEEP, INK, MUTED_ON_PAGE } from "./theme";

/**
 * Three-way split fed directly by the scrub device: the first column is
 * the exact same `trustTotal(playhead)` value shown in the Hero and the
 * Closing CTA — labeled LIVE against two FIXED catalog-wide facts, so the
 * manipulation's effect is legible as it propagates down the page.
 */
export default function ValueSection({ trustRounded }: { trustRounded: number }) {
  return (
    <section className="border-b border-zinc-200 py-16 lg:py-24">
      <div className={CONTAINER}>
        <div className="flex items-start gap-4">
          <GhostNumeral>02</GhostNumeral>
          <div>
            <Eyebrow>WHAT THE LEDGER IS WORTH</Eyebrow>
            <h2 className="mt-3 text-[clamp(1.5rem,1.2rem+1vw,2.25rem)] font-extrabold leading-tight" style={{ color: INK }}>
              One number moves. Two never do.
            </h2>
          </div>
        </div>

        <Reveal className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Stat label="Trust traced so far" tag="LIVE" value={`${trustRounded}%`}>
            Pulled straight from the ledger above — move the scrubber, this number moves with it.
          </Stat>
          <Stat label="Average grading turnaround" tag="FIXED" value={AVG_TURNAROUND}>
            From intake to sold, across the last 90 days of closed listings.
          </Stat>
          <Stat label="Listings rejected before sale" tag="FIXED" value={REJECTION_RATE}>
            Flagged by AI grading or the authenticity check, never listed to a buyer.
          </Stat>
        </Reveal>
      </div>
    </section>
  );
}

function Stat({
  label,
  tag,
  value,
  children,
}: {
  label: string;
  tag: "LIVE" | "FIXED";
  value: string;
  children: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold" style={{ color: INK }}>
          {label}
        </p>
        <span
          className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-[0.12em]"
          style={
            tag === "LIVE"
              ? { backgroundColor: "rgba(14,116,144,0.12)", color: ACCENT_DEEP }
              : { backgroundColor: "#F4F4F5", color: "#52525B" }
          }
        >
          {tag}
        </span>
      </div>
      <p className="mt-3 font-mono text-[clamp(2.25rem,5vw,3rem)] font-extrabold tabular-nums" style={{ color: INK }}>
        {value}
      </p>
      <p className="mt-2 text-sm font-normal leading-[1.6]" style={{ color: MUTED_ON_PAGE }}>
        {children}
      </p>
    </div>
  );
}
