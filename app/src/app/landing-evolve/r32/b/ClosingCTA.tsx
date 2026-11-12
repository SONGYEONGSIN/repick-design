import { ArrowRight } from "lucide-react";
import { categoryInfo, getTopCompanion, type CategoryId } from "./data";
import Reveal from "./Reveal";

interface ClosingCTAProps {
  selected: CategoryId;
}

export default function ClosingCTA({ selected }: ClosingCTAProps) {
  const info = categoryInfo(selected);
  const { companion, n } = getTopCompanion(selected);
  const labelLower = info.label.toLowerCase();
  const companionLower = companion.label.toLowerCase();

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <Reveal className="rounded-3xl border border-zinc-200 bg-zinc-50 p-8 sm:p-12">
          <div className="max-w-[40rem]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-700">
              Start selling
            </p>
            <h2
              className="mt-4 text-zinc-900"
              style={{
                fontFamily: "var(--font-display-mono)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                lineHeight: 1.08,
                fontSize: "clamp(1.875rem, 1.5rem + 1.6vw, 2.75rem)",
              }}
            >
              List your {labelLower} with a price already shaped by demand.
            </h2>
            <p className="mt-4 max-w-[31rem] text-base leading-relaxed text-zinc-600">
              <span className="font-semibold tabular-nums text-zinc-900">{n}</span>{" "}
              of 10 {companionLower} buyers also shop {labelLower} within 30 days.
              Your listing opens already matched to them, graded, and priced against
              real resale data &mdash; not a guess.
            </p>
            <a
              href="#listings"
              className={[
                "mt-8 inline-flex items-center gap-2 rounded-full bg-rose-600 px-6 py-3",
                "text-sm font-semibold text-white transition-colors hover:bg-rose-700",
                "focus-visible:outline-2 focus-visible:outline-rose-600 focus-visible:outline-offset-2",
              ].join(" ")}
            >
              List your {labelLower} &mdash; {n}/10 buy {companionLower} too
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
