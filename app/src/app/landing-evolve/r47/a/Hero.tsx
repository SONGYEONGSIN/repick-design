"use client";

import { COLORS, EYEBROW, FOCUS_RING } from "./tokens";
import { type SpeedId, type DerivedSpeed } from "./data";
import SpeedToggle from "./SpeedToggle";
import TransitPath from "./TransitPath";

export default function Hero({
  speedId,
  derived,
  onChangeSpeed,
}: {
  speedId: SpeedId;
  derived: DerivedSpeed;
  onChangeSpeed: (id: SpeedId) => void;
}) {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: COLORS.bg }}>
      <div className="mx-auto max-w-[1280px] px-4 pb-8 pt-8 sm:px-6 sm:pb-10 sm:pt-10 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          <div className="min-w-0 lg:col-span-7">
            <p className={EYEBROW} style={{ color: COLORS.accentStrong }}>
              AI-verified resale
            </p>

            <h1
              className="mt-3 max-w-[16ch] font-extrabold leading-[1.05] tracking-[-0.02em]"
              style={{
                color: COLORS.fg,
                fontFamily: "var(--font-display-grotesk)",
                fontSize: "clamp(2.25rem, 4.6vw, 3.25rem)",
              }}
            >
              Every sale moves on a path you can see.
            </h1>

            {/* Subhead container width is computed, not guessed: Pretendard's mixed glyph advance
                is 0.44em, so chars-per-line = width / (0.44 * font-size). At 18px targeting ~70
                characters, width = 70 * 0.44 * 18 = 554.4px -> 555px. */}
            <p
              className="mt-4 max-w-[555px] text-[18px] font-normal leading-[1.6]"
              style={{ color: COLORS.muted }}
            >
              Seller, verification hub, buyer — one route. Change the shipping speed and every ETA
              and cost along it recomputes live.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className={EYEBROW} style={{ color: COLORS.muted, letterSpacing: "0.16em" }}>
                Shipping speed
              </span>
              <SpeedToggle value={speedId} onChange={onChangeSpeed} />
            </div>

            <div className="mt-4">
              <TransitPath derived={derived} />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-5">
              <a
                href="#preview"
                className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 ${FOCUS_RING}`}
                style={{ backgroundColor: COLORS.accent }}
              >
                List your first item
              </a>
              <p className="text-[13px] font-normal leading-[1.5]" style={{ color: COLORS.muted }}>
                {derived.label} shipping: arrives in{" "}
                <span className="font-semibold tabular-nums" style={{ color: COLORS.fg }}>
                  {derived.totalLabel}
                </span>{" "}
                for{" "}
                <span className="font-semibold tabular-nums" style={{ color: COLORS.fg }}>
                  {derived.costLabel}
                </span>
                .
              </p>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-5">
            <div
              className="flex h-full flex-col justify-center rounded-2xl border p-6"
              style={{ borderColor: COLORS.line, backgroundColor: COLORS.bgTint }}
            >
              <p className={EYEBROW} style={{ color: COLORS.accentStrong }}>
                Verification hub, right now
              </p>
              <p
                className="mt-3 text-[40px] font-extrabold leading-none tabular-nums"
                style={{ color: COLORS.fg, fontFamily: "var(--font-display-grotesk)" }}
              >
                {derived.hubProcessingLabel}
              </p>
              <p className="mt-1 text-[13px] font-normal leading-[1.5]" style={{ color: COLORS.mutedOnTint }}>
                average time to authenticate, grade and photograph an item at {derived.label.toLowerCase()} speed —
                a 40-point check against reference listings before it ships on.
              </p>
              <dl className="mt-5 grid grid-cols-2 gap-4 border-t pt-4" style={{ borderColor: COLORS.line }}>
                <div className="min-w-0">
                  <dt className="text-[12px] font-semibold uppercase tracking-[0.12em]" style={{ color: COLORS.mutedOnTint }}>
                    Hub fee
                  </dt>
                  <dd className="mt-1 text-[18px] font-extrabold tabular-nums" style={{ color: COLORS.fg, fontFamily: "var(--font-display-grotesk)" }}>
                    ${derived.legCost[1]}
                  </dd>
                </div>
                <div className="min-w-0">
                  <dt className="text-[12px] font-semibold uppercase tracking-[0.12em]" style={{ color: COLORS.mutedOnTint }}>
                    Total route
                  </dt>
                  <dd className="mt-1 text-[18px] font-extrabold tabular-nums" style={{ color: COLORS.fg, fontFamily: "var(--font-display-grotesk)" }}>
                    {derived.totalLabel}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
