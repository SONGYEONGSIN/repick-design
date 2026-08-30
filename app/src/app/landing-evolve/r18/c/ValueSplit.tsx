import { ArrowLeftRight, Gauge as GaugeIcon, ScanSearch } from "lucide-react";
import { Reveal } from "./Reveal";
import { ACCENT, ACCENT_BRIGHT } from "./Hero";

const COLUMNS = [
  {
    icon: ScanSearch,
    label: "For buyers",
    body: "Re-weight toward the factor you actually care about — authenticity, condition, price — and the score moves in front of you, on the exact listing you're looking at.",
  },
  {
    icon: ArrowLeftRight,
    label: "For sellers",
    body: "The same four factors decide every buyer's score. Improve the one dragging your listing down and the composite moves in the same session, not next week.",
  },
  {
    icon: GaugeIcon,
    label: "For the score itself",
    body: "Nothing is hidden behind the number. Every sub-bar is a visible, re-orderable share of the composite — drag a weight in the hero and confirm it yourself.",
  },
];

export function ValueSplit() {
  return (
    <section className="border-b border-[#1C1C22] bg-[#0B0B0F] px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[1280px]">
        <p className="text-[11px] font-semibold uppercase text-[#A1A1AA]" style={{ letterSpacing: "0.28em" }}>
          Fig. 03 — Why re-weighting
        </p>
        <h2
          className="mt-4 max-w-[640px] text-white"
          style={{ fontFamily: "var(--font-display-grotesk)", fontWeight: 800, letterSpacing: "-0.02em", fontSize: "clamp(1.75rem, 1.4vw + 1.5rem, 2.75rem)" }}
        >
          Moving a weight is the whole feature.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {COLUMNS.map((col, i) => (
            <Reveal key={col.label} delay={i * 0.08}>
              <col.icon className="h-5 w-5" style={{ color: ACCENT }} aria-hidden="true" />
              <p className="mt-4 text-[11px] font-semibold uppercase text-[#71717A]" style={{ letterSpacing: "0.12em" }}>
                {col.label}
              </p>
              <p className="mt-2 max-w-[300px] text-[15px] font-normal leading-[1.6] text-[#A1A1AA]">{col.body}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-14 flex items-center gap-3 rounded-xl border border-[#1C1C22] bg-[#111116] px-5 py-4">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: ACCENT_BRIGHT }} aria-hidden="true" />
          <p className="text-[13px] font-normal text-[#A1A1AA]">
            Scroll back to the hero at any time — the weights you left there are still set, and the score at
            the close of this page is computed from them.
          </p>
        </div>
      </div>
    </section>
  );
}
