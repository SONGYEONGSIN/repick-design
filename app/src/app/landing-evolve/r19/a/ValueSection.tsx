"use client";

import { Handshake, ScanSearch, Store } from "lucide-react";
import { Folio } from "./ui";
import { COLOR, DISPLAY_FONT, TRACK, W } from "./tokens";
import { RIGOR_LEVELS, WINDOWS, type RigorId, type Verdict, type WindowId } from "./data";
import Reveal from "./Reveal";

export default function ValueSection({
  rigorId,
  windowId,
  verdict,
}: {
  rigorId: RigorId;
  windowId: WindowId;
  verdict: Verdict;
}) {
  const rigor = RIGOR_LEVELS.find((r) => r.id === rigorId) ?? RIGOR_LEVELS[1];
  const win = WINDOWS.find((w) => w.id === windowId) ?? WINDOWS[1];

  const columns = [
    {
      icon: Handshake,
      title: "For the buyer",
      stats: [
        { label: "Confidence", value: `${verdict.confidence}%` },
        { label: "Recommended offer", value: `$${verdict.recommendedPrice.toLocaleString("en-US")}` },
      ],
      body: `Reviewed against ${verdict.compsCount} comparable sales from the last ${win.days} days before this number was shown to you.`,
    },
    {
      icon: Store,
      title: "For the seller",
      stats: [
        { label: "Turnaround", value: `${verdict.turnaroundDays} day${verdict.turnaroundDays === 1 ? "" : "s"}` },
        { label: "Checks passed", value: `${verdict.checksPassed}/${verdict.checksTotal}` },
      ],
      body: `At ${rigor.short.toLowerCase()} rigor, your listing clears with a documented case file — not just a grade on a page.`,
    },
    {
      icon: ScanSearch,
      title: "For the matching engine",
      stats: [
        { label: "Match confidence", value: `${verdict.confidence}%` },
        { label: "Below replacement", value: `${verdict.discountPercent}%` },
      ],
      body: `The same evidence that clears the case also ranks it for buyers whose saved searches look like this one.`,
    },
  ];

  return (
    <section id="value" className="mx-auto max-w-[1600px] px-5 sm:px-8 py-14 sm:py-20">
      <Reveal>
        <div className="flex items-start justify-between gap-4">
          <div className="max-w-[620px]">
            <h2
              className={`${W.heavy} text-[clamp(1.9rem,1.3rem+2vw,3rem)] leading-[1.02]`}
              style={{ color: COLOR.ink, letterSpacing: "-0.02em", fontFamily: DISPLAY_FONT }}
            >
              One case file, three ways to read it.
            </h2>
            <p className={`${W.body} mt-4 text-[15px] leading-[1.6] max-w-[440px]`} style={{ color: COLOR.ink }}>
              At {rigor.label.toLowerCase()} over a {win.short} window, here is what Case File
              2291 means to each side of the trade — right now, with the assumptions you set in
              the dossier above.
            </p>
          </div>
          <Folio n={4} of={6} />
        </div>
      </Reveal>

      <div className="mt-9 grid grid-cols-1 sm:grid-cols-3 gap-5">
        {columns.map((col, i) => (
          <Reveal key={col.title} delay={i * 0.06} className="min-w-0">
            <div
              className="h-full min-w-0 rounded-lg p-5"
              style={{ background: COLOR.surface, border: `1px solid ${COLOR.ink}1F` }}
            >
              <col.icon className="size-5 shrink-0" style={{ color: COLOR.accentDark }} aria-hidden="true" />
              <h3 className={`${W.label} mt-3 text-[16px]`} style={{ color: COLOR.ink }}>
                {col.title}
              </h3>
              <div className="mt-4 flex flex-col gap-3">
                {col.stats.map((s) => (
                  <div key={s.label} className="flex items-baseline justify-between gap-3">
                    <span
                      className={`${W.body} text-[12px]`}
                      style={{ color: COLOR.mutedOnSurf, letterSpacing: TRACK.caption }}
                    >
                      {s.label}
                    </span>
                    <span className={`${W.heavy} tabular-nums text-[18px]`} style={{ color: COLOR.ink }}>
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
              <p className={`${W.body} mt-4 text-[13px] leading-[1.6]`} style={{ color: COLOR.mutedOnSurf }}>
                {col.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
