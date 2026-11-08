"use client";

import { ListOrdered, RefreshCw, ShieldCheck } from "lucide-react";
import Reveal from "./Reveal";
import { GHOST, INK, MEASURE_16, MUTED } from "./tokens";

const ITEMS = [
  {
    Icon: ListOrdered,
    title: "You set the order",
    body: "Five criteria, one ranking. Drag or use the arrow buttons — there's no hidden default weighting underneath it.",
  },
  {
    Icon: RefreshCw,
    title: "Every score recalculates",
    body: "The same linear weight curve that scores the ladder scores every listing, instantly, with no separate lookup table to fall out of sync.",
  },
  {
    Icon: ShieldCheck,
    title: "Verified before it's shown",
    body: "Condition grading and seller verification happen before a listing is ranked, not after a buyer asks.",
  },
];

export default function ValueSplit() {
  return (
    <section className="relative px-4 py-16 sm:px-6 lg:px-8" style={{ backgroundColor: "#FAFAFA" }}>
      <div className="mx-auto max-w-6xl">
        <div className="relative flex items-end gap-4">
          <span
            aria-hidden="true"
            className="pointer-events-none select-none shrink-0 font-semibold"
            style={{ color: GHOST, fontSize: "clamp(2.25rem, 6vw, 4rem)", lineHeight: 1, letterSpacing: "0.04em" }}
          >
            03
          </span>
          <Reveal>
            <h2 className="text-[clamp(1.75rem,3.6vw,2.5rem)] font-extrabold" style={{ fontFamily: "var(--font-display-wide)", color: INK, letterSpacing: "-0.02em" }}>
              One ranking, three guarantees
            </h2>
          </Reveal>
        </div>
        <p className="mt-3 font-normal leading-[1.6]" style={{ color: MUTED, maxWidth: MEASURE_16, fontSize: "16px" }}>
          The ranking you build above is the only input repick&apos;s matching needs.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {ITEMS.map(({ Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 0.08}>
              <div className="rounded-2xl bg-white p-5" style={{ border: "1px solid #E4E4E7" }}>
                <Icon className="h-5 w-5" style={{ color: "#A21CAF" }} aria-hidden="true" />
                <p className="mt-3 text-[16px] font-extrabold" style={{ color: INK }}>
                  {title}
                </p>
                <p className="mt-1.5 text-[14px] font-normal leading-[1.6]" style={{ color: MUTED }}>
                  {body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
