"use client";

import { COLORS, EYEBROW, FOCUS_RING } from "./tokens";
import type { DerivedSpeed } from "./data";

export default function ClosingCTA({ derived }: { derived: DerivedSpeed }) {
  return (
    <section className="border-t" style={{ borderColor: COLORS.line, backgroundColor: COLORS.bgTint }}>
      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <div className="min-w-0 lg:col-span-8">
            <p className={EYEBROW} style={{ color: COLORS.accentStrong }}>
              Ready when you are
            </p>
            <h2
              className="mt-3 max-w-[18ch] text-[32px] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[44px]"
              style={{ color: COLORS.fg, fontFamily: "var(--font-display-grotesk)" }}
            >
              List it once. Watch it move.
            </h2>
            <p className="mt-4 max-w-[492px] text-[16px] font-normal leading-[1.6]" style={{ color: COLORS.mutedOnTint }}>
              Keep{" "}
              <span className="font-semibold" style={{ color: COLORS.fg }}>
                {derived.label}
              </span>{" "}
              shipping selected and your next sale follows the same route above — hub-verified and
              delivered in{" "}
              <span className="font-semibold tabular-nums" style={{ color: COLORS.fg }}>
                {derived.totalLabel}
              </span>{" "}
              for{" "}
              <span className="font-semibold tabular-nums" style={{ color: COLORS.fg }}>
                {derived.costLabel}
              </span>
              . Switch speeds any time — the quote above updates with it.
            </p>
          </div>

          <div className="min-w-0 lg:col-span-4 lg:text-right">
            <a
              href="#preview"
              className={`inline-flex items-center justify-center rounded-full px-6 py-3.5 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 ${FOCUS_RING}`}
              style={{ backgroundColor: COLORS.accent }}
            >
              List your first item
            </a>
            <p className="mt-3 text-[13px] font-normal" style={{ color: COLORS.mutedOnTint }}>
              No listing fee. Payout clears when verification does.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
