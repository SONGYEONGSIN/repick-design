"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";

// 업계 평균 가정치 — repick Business 도입 셀러 실측 평균 기반
const BASELINE_TURNOVER = 2.1; // 회/월 (도입 전 업계 평균)
const IMPROVEMENT_MULTIPLIER = 1.62; // repick 도입 셀러 평균 회전율 개선 배율 (+62%)
const STORAGE_COST_RATE = 0.08; // 월 재고자산 대비 보관비용 비율 가정
const STORAGE_SAVING_RATE = 0.24; // repick 도입 시 보관비용 절감률 가정

const UNITS_MIN = 10;
const UNITS_MAX = 20000;
const PRICE_MIN = 1000;
const PRICE_MAX = 300000;

function won(n: number) {
  return `${Math.round(n).toLocaleString("ko-KR")}원`;
}

function clamp(n: number, min: number, max: number) {
  if (Number.isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
}

// 슬라이더/입력값이 바뀔 때 결과 숫자가 원장(ledger)처럼 재계산되며 흘러가는 느낌을 주는 카운트업 훅
function useCountUp(target: number, duration = 350) {
  const [display, setDisplay] = useState(target);
  const fromRef = useRef(target);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    const start = performance.now();
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = from + (target - from) * eased;
      setDisplay(next);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return display;
}

const partners = [
  "패션 리세일 스튜디오",
  "가전 리퍼브 파트너",
  "명품 컨시어지 그룹",
  "라이프스타일 셀러 연합",
  "종합 리커머스 유통사",
  "프리미엄 아울렛 파트너",
];

const tools = [
  {
    title: "AI 매칭 판매",
    desc: "재고를 등록하면 구매 의도가 높은 사용자에게 자동으로 우선 노출되어 판매 사이클이 짧아집니다.",
  },
  {
    title: "실시간 재고 대시보드",
    desc: "SKU별 회전 속도, 가격 탄력도, 체화 위험 재고를 한 화면에서 확인하고 바로 조치할 수 있습니다.",
  },
  {
    title: "API 연동",
    desc: "기존 ERP·판매 채널과 연동해 재고 수량과 가격을 별도 관리 없이 동기화합니다.",
  },
];

const proofStats = [
  { label: "평균 회전율 개선", value: "+62%" },
  { label: "평균 매출 증가", value: "+38%" },
  { label: "평균 보관비용 절감", value: "-24%" },
];

export default function Landing() {
  const [monthlyUnits, setMonthlyUnits] = useState(500);
  const [avgPrice, setAvgPrice] = useState(45000);

  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const inventoryValue = monthlyUnits * avgPrice;
  const improvedTurnover = BASELINE_TURNOVER * IMPROVEMENT_MULTIPLIER;
  const additionalRevenue = inventoryValue * (IMPROVEMENT_MULTIPLIER - 1);
  const monthlyStorageCost = inventoryValue * STORAGE_COST_RATE;
  const storageSaving = monthlyStorageCost * STORAGE_SAVING_RATE;
  const annualImpact = (additionalRevenue + storageSaving) * 12;

  const turnoverDisplay = useCountUp(improvedTurnover);
  const revenueDisplay = useCountUp(additionalRevenue);
  const savingDisplay = useCountUp(storageSaving);
  const annualDisplay = useCountUp(annualImpact);

  function handleUnitsChange(e: ChangeEvent<HTMLInputElement>) {
    setMonthlyUnits(clamp(Number(e.target.value), UNITS_MIN, UNITS_MAX));
  }

  function handlePriceChange(e: ChangeEvent<HTMLInputElement>) {
    setAvgPrice(clamp(Number(e.target.value), PRICE_MIN, PRICE_MAX));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-[#08110d] font-sans text-[#eef7f1]">
      <a
        href="#demo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-[#6ffcb2] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[#08110d]"
      >
        데모 요청으로 건너뛰기
      </a>

      <header className="sticky top-0 z-20 border-b border-[#1e2b23] bg-[#08110d]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="font-mono text-sm tracking-[0.3em] text-[#6ffcb2]">
            REPICK BUSINESS
          </span>
          <a
            href="#demo"
            className="rounded-md border border-[#6ffcb2]/40 px-4 py-2 text-sm font-medium text-[#6ffcb2] transition-colors duration-150 hover:bg-[#6ffcb2]/10 focus:outline-none focus:ring-2 focus:ring-[#6ffcb2] focus:ring-offset-2 focus:ring-offset-[#08110d]"
          >
            데모 요청
          </a>
        </div>
      </header>

      <main>
        {/* 히어로 + ROI 계산기 */}
        <section
          className="relative overflow-hidden border-b border-[#1e2b23] px-6 py-16 md:py-24"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(111,252,178,0.05) 0px, rgba(111,252,178,0.05) 1px, transparent 1px, transparent 40px)",
          }}
        >
          <div className="relative mx-auto max-w-6xl">
            <p className="font-mono text-xs tracking-[0.3em] text-[#6ffcb2]">
              INVENTORY ROI SIMULATOR
            </p>
            <h1 className="mt-4 max-w-3xl text-3xl leading-tight font-bold text-[#eef7f1] md:text-5xl">
              재고는 감이 아니라 숫자로 움직입니다
            </h1>
            <p className="mt-4 max-w-2xl text-base text-[#93a89c] md:text-lg">
              월 재고량과 평균 단가만 입력하면, repick Business 도입 시 예상되는
              회전율 개선과 매출 효과를 지금 바로 계산해 드립니다.
            </p>

            <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
              {/* 입력 패널 */}
              <div className="rounded-lg border border-[#1e2b23] bg-[#101a15] p-6">
                <h2 className="text-sm font-medium text-[#eef7f1]">
                  우리 재고 조건 입력
                </h2>

                <div className="mt-6 flex flex-col gap-6">
                  <div>
                    <div className="flex items-baseline justify-between">
                      <label
                        htmlFor="units-input"
                        className="text-sm text-[#93a89c]"
                      >
                        월 판매 재고량
                      </label>
                      <div className="flex items-baseline gap-1">
                        <input
                          id="units-input"
                          type="number"
                          min={UNITS_MIN}
                          max={UNITS_MAX}
                          value={monthlyUnits}
                          onChange={handleUnitsChange}
                          className="w-24 rounded-md border border-[#1e2b23] bg-[#08110d] px-2 py-1 text-right font-mono text-sm text-[#eef7f1] focus:outline-none focus:ring-2 focus:ring-[#6ffcb2]"
                        />
                        <span className="text-xs text-[#5c7267]">개/월</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={UNITS_MIN}
                      max={UNITS_MAX}
                      step={10}
                      value={monthlyUnits}
                      onChange={handleUnitsChange}
                      aria-label="월 판매 재고량 슬라이더"
                      className="mt-3 w-full focus:outline-none focus:ring-2 focus:ring-[#6ffcb2]"
                      style={{ accentColor: "#6ffcb2" }}
                    />
                  </div>

                  <div>
                    <div className="flex items-baseline justify-between">
                      <label
                        htmlFor="price-input"
                        className="text-sm text-[#93a89c]"
                      >
                        평균 판매 단가
                      </label>
                      <div className="flex items-baseline gap-1">
                        <input
                          id="price-input"
                          type="number"
                          min={PRICE_MIN}
                          max={PRICE_MAX}
                          step={1000}
                          value={avgPrice}
                          onChange={handlePriceChange}
                          className="w-28 rounded-md border border-[#1e2b23] bg-[#08110d] px-2 py-1 text-right font-mono text-sm text-[#eef7f1] focus:outline-none focus:ring-2 focus:ring-[#6ffcb2]"
                        />
                        <span className="text-xs text-[#5c7267]">원</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={PRICE_MIN}
                      max={PRICE_MAX}
                      step={1000}
                      value={avgPrice}
                      onChange={handlePriceChange}
                      aria-label="평균 판매 단가 슬라이더"
                      className="mt-3 w-full focus:outline-none focus:ring-2 focus:ring-[#6ffcb2]"
                      style={{ accentColor: "#6ffcb2" }}
                    />
                  </div>
                </div>

                <p className="mt-8 border-t border-[#1e2b23] pt-4 text-xs text-[#5c7267]">
                  가정: 업계 평균 재고 회전율 {BASELINE_TURNOVER.toFixed(1)}회/월,
                  repick 도입 셀러 평균 회전율 개선율 62%, 보관비용은 재고자산의
                  8%로 계산, 도입 후 보관비용 24% 절감 기준.
                </p>
              </div>

              {/* 결과 원장(ledger) */}
              <div className="rounded-lg border border-[#1e2b23] bg-[#0d1712] p-6">
                <p className="font-mono text-xs tracking-[0.3em] text-[#5c7267]">
                  EXPECTED IMPACT
                </p>
                <dl className="mt-4 flex flex-col divide-y divide-[#1e2b23]">
                  <div className="flex items-baseline justify-between py-4">
                    <dt className="text-sm text-[#93a89c]">재고 회전율</dt>
                    <dd className="font-mono text-lg text-[#eef7f1]">
                      {BASELINE_TURNOVER.toFixed(1)}회 →{" "}
                      <span className="text-[#6ffcb2]">
                        {turnoverDisplay.toFixed(1)}회
                      </span>
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between py-4">
                    <dt className="text-sm text-[#93a89c]">
                      예상 추가 매출 (월)
                    </dt>
                    <dd className="font-mono text-lg text-[#6ffcb2]">
                      +{won(revenueDisplay)}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between py-4">
                    <dt className="text-sm text-[#93a89c]">
                      보관비용 절감 (월)
                    </dt>
                    <dd className="font-mono text-lg text-[#ffb454]">
                      -{won(savingDisplay)}
                    </dd>
                  </div>
                </dl>

                <div className="mt-2 rounded-md border border-[#6ffcb2]/30 bg-[#6ffcb2]/5 p-4">
                  <p className="text-xs text-[#93a89c]">연간 예상 효과</p>
                  <p className="mt-1 font-mono text-3xl font-bold text-[#6ffcb2] md:text-4xl">
                    {won(annualDisplay)}
                  </p>
                </div>

                <a
                  href="#demo"
                  className="mt-6 flex w-full items-center justify-center rounded-md bg-[#6ffcb2] px-4 py-3 text-sm font-medium text-[#08110d] transition-colors duration-150 hover:bg-[#8bffc3] focus:outline-none focus:ring-2 focus:ring-[#6ffcb2] focus:ring-offset-2 focus:ring-offset-[#0d1712]"
                >
                  이 결과로 데모 요청하기
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 파트너 스트립 */}
        <section className="border-b border-[#1e2b23] bg-[#0d1712] px-6 py-8">
          <div className="mx-auto max-w-6xl">
            <p className="text-center text-xs tracking-[0.2em] text-[#5c7267]">
              이미 재고를 회전시키고 있는 파트너
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {partners.map((p) => (
                <span
                  key={p}
                  className="font-mono text-sm text-[#93a89c]/70"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 셀러 도구 */}
        <section className="border-b border-[#1e2b23] px-6 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold text-[#eef7f1] md:text-3xl">
              회전율을 실제로 움직이는 도구
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {tools.map((t) => (
                <div
                  key={t.title}
                  className="rounded-lg border border-[#1e2b23] bg-[#101a15] p-6"
                >
                  <h3 className="text-base font-semibold text-[#6ffcb2]">
                    {t.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#93a89c]">
                    {t.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 숫자로 증명된 효과 */}
        <section className="border-b border-[#1e2b23] bg-[#0d1712] px-6 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold text-[#eef7f1] md:text-3xl">
              숫자로 증명된 효과
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {proofStats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-lg border border-[#1e2b23] bg-[#08110d] p-6 text-center"
                >
                  <p className="font-mono text-4xl font-bold text-[#6ffcb2]">
                    {s.value}
                  </p>
                  <p className="mt-2 text-sm text-[#93a89c]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 데모 요청 */}
        <section id="demo" className="px-6 py-16 md:py-24">
          <div className="mx-auto max-w-2xl rounded-lg border border-[#1e2b23] bg-[#101a15] p-8">
            <h2 className="text-2xl font-bold text-[#eef7f1]">
              우리 재고로 직접 계산해 보고 싶다면
            </h2>
            <p className="mt-2 text-sm text-[#93a89c]">
              담당자가 회사 데이터 기준 상세 리포트를 들고 연락드립니다.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="company-input" className="text-sm text-[#93a89c]">
                  회사명
                </label>
                <input
                  id="company-input"
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="rounded-md border border-[#1e2b23] bg-[#08110d] px-3 py-2 text-sm text-[#eef7f1] focus:outline-none focus:ring-2 focus:ring-[#6ffcb2]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="name-input" className="text-sm text-[#93a89c]">
                  담당자명
                </label>
                <input
                  id="name-input"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-md border border-[#1e2b23] bg-[#08110d] px-3 py-2 text-sm text-[#eef7f1] focus:outline-none focus:ring-2 focus:ring-[#6ffcb2]"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label htmlFor="email-input" className="text-sm text-[#93a89c]">
                    이메일
                  </label>
                  <input
                    id="email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-md border border-[#1e2b23] bg-[#08110d] px-3 py-2 text-sm text-[#eef7f1] focus:outline-none focus:ring-2 focus:ring-[#6ffcb2]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="phone-input" className="text-sm text-[#93a89c]">
                    연락처
                  </label>
                  <input
                    id="phone-input"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="rounded-md border border-[#1e2b23] bg-[#08110d] px-3 py-2 text-sm text-[#eef7f1] focus:outline-none focus:ring-2 focus:ring-[#6ffcb2]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 rounded-md bg-[#6ffcb2] px-4 py-3 text-sm font-medium text-[#08110d] transition-colors duration-150 hover:bg-[#8bffc3] focus:outline-none focus:ring-2 focus:ring-[#6ffcb2] focus:ring-offset-2 focus:ring-offset-[#101a15]"
              >
                데모 요청 보내기
              </button>

              <p role="status" aria-live="polite" className="min-h-5 text-sm text-[#6ffcb2]">
                {submitted &&
                  "요청이 접수되었습니다. 담당자가 곧 연락드립니다."}
              </p>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#1e2b23] px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-xs text-[#5c7267] md:flex-row">
          <span>© 2026 repick Business</span>
          <span>재고를 숫자로 증명하는 가장 빠른 방법</span>
        </div>
      </footer>
    </div>
  );
}
