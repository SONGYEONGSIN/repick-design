import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import { Leaf } from "lucide-react";
import "./theme.css";
import VitalsGrid from "./VitalsGrid";
import GrowthCurve from "./GrowthCurve.client";
import LineageTree from "./LineageTree";
import ZonesAndTrays from "./ZonesAndTrays";
import FieldNotes from "./FieldNotes.client";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: "LINEAGE — 재배 및 교배 기록부",
  description: "희귀 원예종 육종가를 위한 온실 관제와 교배 계보 기록 대시보드.",
};

const TOC = [
  { href: "#plate-1", roman: "I", en: "Environment Vitals", ko: "생육 환경" },
  { href: "#plate-2", roman: "II", en: "Growth Curve", ko: "생장 곡선" },
  { href: "#plate-3", roman: "III", en: "Breeding Lineage", ko: "교배 계보" },
  { href: "#plate-4", roman: "IV", en: "Greenhouse Zones", ko: "온실 구역" },
  { href: "#plate-5", roman: "V", en: "Field Notes", ko: "관찰 기록" },
];

function PlateHeader({ roman, en, ko, id }: { roman: string; en: string; ko: string; id: string }) {
  return (
    <div className="mb-6">
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--lin-sepia)]">Plate {roman}</p>
      <h2 id={id} className="plate-serif mt-1 text-2xl italic text-[var(--lin-ink)] sm:text-3xl">
        {en}
      </h2>
      <p className="mt-0.5 text-sm text-[var(--lin-ink-muted)]">{ko}</p>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className={`${fraunces.variable} lineage lin-paper min-h-screen`}>
      <a
        href="#main-content"
        className="lin-focus sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-[var(--lin-sage-deep)] focus:px-4 focus:py-2 focus:text-sm focus:text-[var(--lin-card)]"
      >
        본문으로 건너뛰기
      </a>

      <header className="border-b border-[var(--lin-border-strong)] bg-[var(--lin-bg-rail)]">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-4 py-6 sm:px-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[var(--lin-sage-deep)]">
              <Leaf aria-hidden="true" className="h-5 w-5" />
              <span className="text-xs uppercase tracking-[0.3em]">Marsh &amp; Kew Conservatory</span>
            </div>
            <h1 className="mt-2">
              <span className="plate-serif block text-4xl italic leading-none text-[var(--lin-ink)] sm:text-5xl">
                LINEAGE
              </span>
              <span className="mt-2 block text-xs uppercase tracking-[0.25em] text-[var(--lin-ink-muted)] sm:text-sm">
                Propagation &amp; Breeding Ledger · 재배 및 교배 기록부
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right text-xs leading-relaxed text-[var(--lin-ink-muted)]">
              <p>Vol. IV · No. 27</p>
              <p>2026 Summer Cycle</p>
            </div>
            <div className="flex items-center gap-2 border-l border-[var(--lin-border-strong)] pl-4">
              <span
                aria-hidden="true"
                className="plate-serif flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--lin-sepia)] text-sm italic text-[var(--lin-sage-deep)]"
              >
                JO
              </span>
              <span className="text-xs leading-tight text-[var(--lin-ink-muted)]">
                J. Okafor
                <span className="block">Propagator</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-8 lg:grid lg:grid-cols-[220px_1fr] lg:gap-12 lg:py-12">
        <nav aria-label="플레이트 목차" className="mb-8 lg:sticky lg:top-8 lg:mb-0 lg:h-fit lg:self-start">
          <ul className="lin-scroll-x flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:border-l lg:border-[var(--lin-border-strong)] lg:pb-0">
            {TOC.map((item) => (
              <li key={item.href} className="shrink-0 lg:shrink">
                <a
                  href={item.href}
                  className="lin-focus block whitespace-nowrap border border-[var(--lin-border-strong)] bg-[var(--lin-card)] px-3 py-2 text-sm text-[var(--lin-ink)] hover:border-[var(--lin-sage-deep)] hover:text-[var(--lin-sage-deep)] lg:-ml-px lg:whitespace-normal lg:border-l-2 lg:border-y-0 lg:border-r-0 lg:bg-transparent lg:px-4 lg:py-2"
                >
                  <span className="text-[var(--lin-sepia)]">{item.roman}.</span>{" "}
                  <span className="plate-serif italic">{item.en}</span>
                  <span className="block text-xs text-[var(--lin-ink-muted)]">{item.ko}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <main id="main-content" className="flex min-w-0 flex-col gap-14">
          <section aria-labelledby="plate-1-heading" id="plate-1" className="reveal scroll-mt-8">
            <PlateHeader id="plate-1-heading" roman="I" en="Environment Vitals" ko="생육 환경 지표" />
            <p className="mb-6 text-sm text-[var(--lin-ink-muted)]">Zone C — Cloud Forest House · 06:00 판독값</p>
            <VitalsGrid />
          </section>

          <section aria-labelledby="plate-2-heading" id="plate-2" className="reveal scroll-mt-8">
            <PlateHeader id="plate-2-heading" roman="II" en="Growth Curve" ko="생장 곡선" />
            <div className="lin-plate-frame">
              <div className="lin-plate-frame-inner p-5 sm:p-8">
                <GrowthCurve />
              </div>
            </div>
          </section>

          <section aria-labelledby="plate-3-heading" id="plate-3" className="reveal scroll-mt-8">
            <PlateHeader id="plate-3-heading" roman="III" en="Breeding Lineage" ko="교배 계보" />
            <div className="lin-plate-frame">
              <div className="lin-plate-frame-inner p-5 sm:p-8">
                <LineageTree />
              </div>
            </div>
          </section>

          <section aria-labelledby="plate-4-heading" id="plate-4" className="reveal scroll-mt-8">
            <PlateHeader id="plate-4-heading" roman="IV" en="Greenhouse Zones" ko="온실 구역" />
            <ZonesAndTrays />
          </section>

          <section aria-labelledby="plate-5-heading" id="plate-5" className="reveal scroll-mt-8">
            <PlateHeader id="plate-5-heading" roman="V" en="Field Notes" ko="관찰 기록" />
            <FieldNotes />
          </section>
        </main>
      </div>

      <footer className="border-t border-[var(--lin-border-strong)] bg-[var(--lin-bg-rail)] py-6">
        <p className="plate-serif mx-auto max-w-[1400px] px-4 text-center text-xs italic text-[var(--lin-ink-muted)] sm:px-8">
          LINEAGE Field Ledger — Marsh &amp; Kew Conservatory, Vol. IV No. 27
        </p>
      </footer>
    </div>
  );
}
