"use client";

import { FileCheck2, ScanEye as ScanEyeIcon, Users } from "lucide-react";
import { Reveal } from "./Reveal";
import { STAGES, VALUE_COLUMNS } from "./data";
import { ACCENT, BODY, BORDER, INK, MUTED, MUTED_STRONG, SURFACE } from "./tokens";

const ICONS = [FileCheck2, ScanEyeIcon, Users];

export function ValueSplit({ activeIndex }: { activeIndex: number }) {
  const stage = STAGES[activeIndex];

  return (
    <section className="border-b px-6 py-20 sm:px-10 lg:px-16" style={{ borderColor: BORDER, backgroundColor: "#FFFFFF" }}>
      <div className="mx-auto max-w-[1280px]">
        <p className="text-[11px] font-semibold uppercase" style={{ letterSpacing: "0.28em", color: MUTED }}>
          Fig. 03 — Why a record beats a claim
        </p>
        <h2
          className="mt-4 max-w-[640px]"
          style={{ fontFamily: "var(--font-display-mono)", fontWeight: 800, letterSpacing: "-0.02em", fontSize: "clamp(1.5rem, 1.1vw + 1.3rem, 2.25rem)", color: INK }}
        >
          Nothing here is claimed. It&rsquo;s logged.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {VALUE_COLUMNS.map((col, i) => {
            const Icon = ICONS[i];
            return (
              <Reveal key={col.label} delay={i * 0.08} className="min-w-0">
                <Icon className="h-5 w-5" style={{ color: ACCENT }} aria-hidden="true" />
                <p className="mt-4 text-[11px] font-semibold uppercase" style={{ letterSpacing: "0.12em", color: MUTED }}>
                  {col.label}
                </p>
                <p className="mt-2 max-w-[300px] text-[15px] font-normal leading-[1.6]" style={{ color: BODY }}>
                  {col.body}
                </p>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-14 flex items-center gap-3 rounded-xl border px-5 py-4" style={{ borderColor: BORDER, backgroundColor: SURFACE }}>
          <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: ACCENT }} aria-hidden="true" />
          <p className="text-[13px] font-normal" style={{ color: MUTED_STRONG }}>
            You&rsquo;re currently viewing <strong style={{ color: INK, fontWeight: 600 }}>{stage.label}</strong> — scroll back to
            the hero at any time and every number on this page will follow the stage you leave selected.
          </p>
        </div>
      </div>
    </section>
  );
}
