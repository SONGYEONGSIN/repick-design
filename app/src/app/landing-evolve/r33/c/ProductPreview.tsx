"use client";

import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import Reveal from "./Reveal";
import { PRODUCTS } from "./data";
import { ACCENT_TINT, BORDER_SOFT, MUTED, PANEL_BG } from "./theme";

export default function ProductPreview() {
  return (
    <section id="preview" className="relative" style={{ contain: "layout" }}>
      <div className="mx-auto w-full max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Reveal>
          <h2
            className="max-w-[20em] text-3xl font-extrabold tracking-[-0.02em] text-white sm:text-4xl"
            style={{ fontFamily: "var(--font-display-mono)" }}
          >
            Every card shows its receipts.
          </h2>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mt-3 max-w-[32em] text-base leading-[1.6]" style={{ color: MUTED }}>
            Match percentage, condition grade, seller verification and the gap against retail —
            read directly off each listing. None of it is hidden behind a hover.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((item, i) => {
            const discountPct = Math.round(
              ((item.retailPrice - item.listedPrice) / item.retailPrice) * 100,
            );
            return (
              <Reveal key={item.id} delay={i * 0.05}>
                <article
                  className="flex h-full flex-col overflow-hidden rounded-2xl border"
                  style={{ borderColor: BORDER_SOFT, backgroundColor: PANEL_BG }}
                >
                  <div
                    className="relative aspect-[4/5] w-full"
                    style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                  >
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-4">
                    <div>
                      <p className="truncate text-sm font-semibold text-white">{item.title}</p>
                      <p className="truncate text-xs" style={{ color: MUTED }}>
                        {item.brand}
                      </p>
                    </div>

                    <div className="mt-auto grid grid-cols-2 gap-1.5 text-xs">
                      <span
                        className="rounded-md border px-2 py-1 font-semibold tabular-nums text-white"
                        style={{ borderColor: BORDER_SOFT }}
                      >
                        {item.matchPercent}% match
                      </span>
                      <span
                        className="rounded-md border px-2 py-1 font-semibold tabular-nums text-white"
                        style={{ borderColor: BORDER_SOFT }}
                      >
                        Grade {item.conditionGrade}
                      </span>
                      <span
                        className="flex items-center gap-1 rounded-md border px-2 py-1 font-semibold text-white"
                        style={{ borderColor: BORDER_SOFT }}
                      >
                        <ShieldCheck aria-hidden="true" className="h-3 w-3" style={{ color: ACCENT_TINT }} />
                        Verified
                      </span>
                      <span
                        className="rounded-md border px-2 py-1 font-semibold tabular-nums text-white"
                        style={{ borderColor: BORDER_SOFT }}
                      >
                        ${item.listedPrice}
                        <span style={{ color: ACCENT_TINT }}> -{discountPct}%</span>
                      </span>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
