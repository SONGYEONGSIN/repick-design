import type { Metadata } from "next";
import { Noto_Serif_KR } from "next/font/google";
import { Eye, TriangleAlert } from "lucide-react";
import { MobileNav } from "./mobile-nav";
import { BenchInteractive } from "./bench-interactive";
import styles from "./d13.module.css";

const notoSerifKr = Noto_Serif_KR({
  variable: "--font-noto-serif",
  weight: ["300", "500"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "벤치 개요 — NOTA",
  description: "NOTA 조향 아틀리에 포뮬레이션 인텔리전스 대시보드",
};

const NAV_ITEMS = [
  { label: "벤치", href: "/dash/d13", current: true },
  { label: "포뮬러", current: false },
  { label: "원료", current: false },
  { label: "숙성실", current: false },
  { label: "품질관제", current: false },
  { label: "아카이브", current: false },
];

const KPIS = [
  { label: "진행 중인 포뮬러", value: "24", unit: "개" },
  { label: "숙성 중인 배치", value: "9", unit: "건" },
  { label: "저재고 원료", value: "3", unit: "종" },
  { label: "품질 합격률", value: "96.4", unit: "%" },
];

interface Material {
  name: string;
  origin: string;
  stock: number;
  price: number;
  status: "정상" | "저재고" | "관찰";
}

const MATERIALS: Material[] = [
  { name: "다마스크 로즈 앱솔루트", origin: "불가리아 · 카잔루크", stock: 68, price: 612000, status: "정상" },
  { name: "마다가스카르 바닐라 앱솔루트", origin: "마다가스카르", stock: 14, price: 498000, status: "저재고" },
  { name: "베티버 오일", origin: "코트디부아르", stock: 52, price: 284000, status: "정상" },
  { name: "화이트 머스크 (합성)", origin: "스위스 · 지보단", stock: 81, price: 96000, status: "정상" },
  { name: "베르가못 오일", origin: "이탈리아 · 시칠리아", stock: 9, price: 154000, status: "저재고" },
  { name: "마이소르 샌달우드 오일", origin: "인도 · 마이소르", stock: 37, price: 890000, status: "관찰" },
];

const priceFmt = new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 });

export default function Dashboard() {
  return (
    <div className={`${styles.scope} ${notoSerifKr.variable} min-h-screen bg-[var(--bone)] text-[var(--ink)]`}>

      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-[var(--ink)] focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:text-[var(--cream)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]"
      >
        본문으로 건너뛰기
      </a>

      <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--bone)]/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between gap-4 px-6 md:px-10">
          <div className="flex items-baseline gap-2">
            <span className="font-[family-name:var(--font-display)] text-2xl italic tracking-tight text-[var(--ink)]">
              NOTA
            </span>
            <span className="hidden text-xs uppercase tracking-[0.25em] text-[var(--ink-soft)] sm:inline">
              Formulation Atelier
            </span>
          </div>

          <nav aria-label="주요" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {NAV_ITEMS.map((item) =>
                item.current ? (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      aria-current="page"
                      className="inline-flex min-h-11 items-center rounded-full bg-[var(--ink)] px-4 py-2 text-sm text-[var(--cream)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]"
                    >
                      {item.label}
                    </a>
                  </li>
                ) : (
                  <li key={item.label}>
                    <span className="inline-flex min-h-11 cursor-default items-center gap-1.5 px-4 py-2 text-sm text-[var(--ink-soft)]">
                      {item.label}
                      <span className="text-[10px] uppercase tracking-widest text-[var(--ink-soft)]">준비중</span>
                    </span>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-[var(--ink-soft)] sm:inline">아틀리에 노르드</span>
            <span
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--cream)] text-sm font-medium text-[var(--ink)]"
            >
              AN
            </span>
            <MobileNav items={NAV_ITEMS} />
          </div>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-[1400px] px-6 py-14 md:px-10 md:py-20">
        <div className="max-w-2xl scroll-mt-24">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--ink-soft)]">2026년 7월 11일 토요일 · 정상 가동</p>
          <h1 className="mt-3 font-[family-name:var(--font-noto-serif)] text-4xl font-light tracking-tight text-[var(--ink)] sm:text-5xl">
            벤치 개요
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-[var(--ink-soft)]">
            오늘 아틀리에에서 진행 중인 포뮬러, 숙성 배치, 원료 재고를 한눈에 확인하세요.
          </p>
        </div>

        <section aria-label="핵심 지표" className="mt-12 scroll-mt-24">
          <h2 className="text-xs font-medium uppercase tracking-[0.25em] text-[var(--ink-soft)]">핵심 지표</h2>
          <dl className="mt-5 flex flex-wrap border-t border-[var(--line)]">
            {KPIS.map((kpi, i) => (
              <div
                key={kpi.label}
                className={`min-w-[45%] flex-1 border-b border-[var(--line)] py-6 pr-6 sm:min-w-[22%] ${
                  i !== 0 ? "sm:border-l sm:pl-6" : ""
                }`}
              >
                <dt className="text-sm text-[var(--ink-soft)]">{kpi.label}</dt>
                <dd className="mt-1 font-[family-name:var(--font-noto-serif)] text-4xl font-light tabular-nums text-[var(--ink)]">
                  {kpi.value}
                  <span className="ml-1 text-lg text-[var(--ink-soft)]">{kpi.unit}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="mt-20">
          <BenchInteractive />
        </div>

        <section aria-labelledby="materials-heading" className="mt-20 scroll-mt-24">
          <h2 id="materials-heading" className="text-xs font-medium uppercase tracking-[0.25em] text-[var(--ink-soft)]">
            원료 재고
          </h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <caption className="mb-3 text-left text-xs text-[var(--ink-soft)]">
                원료별 재고 비율과 단가 (kg당)
              </caption>
              <thead>
                <tr className="border-b border-[var(--line)] text-xs uppercase tracking-[0.15em] text-[var(--ink-soft)]">
                  <th scope="col" className="py-3 font-medium">원료</th>
                  <th scope="col" className="py-3 font-medium">원산지</th>
                  <th scope="col" className="py-3 font-medium">재고</th>
                  <th scope="col" className="py-3 font-medium">단가</th>
                  <th scope="col" className="py-3 font-medium">상태</th>
                </tr>
              </thead>
              <tbody>
                {MATERIALS.map((m) => (
                  <tr key={m.name} className="border-b border-[var(--line)]">
                    <th scope="row" className="py-4 pr-4 font-normal text-[var(--ink)]">{m.name}</th>
                    <td className="py-4 pr-4 text-[var(--ink-soft)]">{m.origin}</td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2">
                        <div aria-hidden="true" className="h-[3px] w-24 rounded-full bg-[var(--line)]">
                          <div className="h-full rounded-full bg-[var(--ink)]" style={{ width: `${m.stock}%` }} />
                        </div>
                        <span className="tabular-nums text-[var(--ink)]">{m.stock}%</span>
                      </div>
                    </td>
                    <td className="py-4 pr-4 tabular-nums text-[var(--ink)]">{priceFmt.format(m.price)}</td>
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-sm ${
                          m.status === "저재고" ? "font-medium text-[var(--gold-deep)]" : "text-[var(--ink-soft)]"
                        }`}
                      >
                        {m.status === "저재고" ? (
                          <TriangleAlert aria-hidden="true" className="h-4 w-4" />
                        ) : m.status === "관찰" ? (
                          <Eye aria-hidden="true" className="h-4 w-4" />
                        ) : null}
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="mt-24 border-t border-[var(--line)] pt-6 text-xs text-[var(--ink-soft)]">
          NOTA — 조향 하우스를 위한 포뮬레이션 인텔리전스. 아틀리에 노르드 워크스페이스.
        </footer>
      </main>
    </div>
  );
}
