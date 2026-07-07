"use client";

import { useMemo, useState } from "react";

const OLD = "#64748B";
const OLD_SOFT = "#94A3B8";
const NEW = "#00B36B";
const NEW_SOFT = "#D9FBEA";

const OLD_POINTS = [
  { icon: "📋", text: "엑셀로 재고를 일일이 수기 입력" },
  { icon: "🎲", text: "가격은 담당자 감으로 책정" },
  { icon: "🗓️", text: "평균 84일 동안 창고에 잠들어 있음" },
  { icon: "📉", text: "시즌 지나면 원가의 32%까지 손해" },
];

const NEW_POINTS = [
  { icon: "📊", text: "AI가 실시간으로 재고 상태를 스캔" },
  { icon: "🎯", text: "시세 데이터 기반 자동 가격 책정" },
  { icon: "🚀", text: "평균 19일이면 구매자에게 매칭" },
  { icon: "🛡️", text: "적정가 매칭으로 손실률 7%대 방어" },
];

const LOGOS = ["프렌치몰", "리클로젯", "세컨드무브", "그린수거", "루프마켓", "다시입다"];

type MetricRowData = {
  id: string;
  icon: string;
  label: string;
  oldValue: number;
  newValue: number;
  max: number;
  unit: string;
  oldDesc: string;
  newDesc: string;
};

const METRIC_ROWS: MetricRowData[] = [
  {
    id: "time",
    icon: "⏱️",
    label: "등록·가격책정 처리시간",
    oldValue: 18,
    newValue: 3,
    max: 20,
    unit: "분/건",
    oldDesc: "엑셀 수기 등록에 상태 확인, 시세 조사까지 건당 18분이 소요돼요.",
    newDesc: "AI가 상태를 스캔하고 시세를 계산해 3분이면 등록이 끝나요.",
  },
  {
    id: "days",
    icon: "📦",
    label: "재고 소진까지 걸리는 기간",
    oldValue: 84,
    newValue: 19,
    max: 90,
    unit: "일",
    oldDesc: "적당한 구매자를 기다리며 창고에 84일 넘게 잠들어 있어요.",
    newDesc: "구매 의사가 높은 고객에게 바로 매칭돼 19일이면 소진돼요.",
  },
  {
    id: "reach",
    icon: "📡",
    label: "잠재 구매자 도달 규모",
    oldValue: 1200,
    newValue: 48000,
    max: 50000,
    unit: "명",
    oldDesc: "자체 채널 팔로워 1,200명에게만 노출돼요.",
    newDesc: "repick 사용자 4만 8천 명 중 취향이 맞는 고객에게 노출돼요.",
  },
  {
    id: "loss",
    icon: "📉",
    label: "재고 손실률(땡처리 포함)",
    oldValue: 32,
    newValue: 7,
    max: 35,
    unit: "%",
    oldDesc: "시즌이 지나면 원가의 32%까지 손해 보고 정리해요.",
    newDesc: "적정가 매칭으로 손실률을 7%대까지 방어해요.",
  },
  {
    id: "match",
    icon: "🎯",
    label: "AI 매칭 정확도",
    oldValue: 11,
    newValue: 91,
    max: 100,
    unit: "%",
    oldDesc: "담당자 감으로 추천해 성사율이 11% 안팎이에요.",
    newDesc: "구매 이력·취향 데이터를 학습한 AI가 91% 정확도로 추천해요.",
  },
];

const AVG_PRICE = 42000;
const OLD_LOSS_RATE = 0.32;
const NEW_LOSS_RATE = 0.07;
const OLD_MIN_PER_ITEM = 18;
const NEW_MIN_PER_ITEM = 3;

function won(n: number) {
  return `${Math.round(n).toLocaleString("ko-KR")}원`;
}

function MetricRow({
  row,
  active,
  onToggle,
}: {
  row: MetricRowData;
  active: boolean;
  onToggle: () => void;
}) {
  const value = active ? row.newValue : row.oldValue;
  const pct = Math.min(100, (value / row.max) * 100);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span aria-hidden="true" className="text-2xl">
            {row.icon}
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-500">{row.label}</p>
            <p
              className="mt-0.5 text-2xl font-black tabular-nums transition-colors duration-500 sm:text-3xl"
              style={{ color: active ? NEW : OLD }}
            >
              {value.toLocaleString("ko-KR")}
              <span className="ml-1 text-sm font-semibold text-slate-400">
                {row.unit}
              </span>
            </p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={active}
          aria-label={`${row.label} — 현재 ${
            active ? "repick Business" : "기존 방식"
          } 표시 중, 전환하려면 클릭`}
          onClick={onToggle}
          className="flex flex-none items-center gap-1 rounded-full border-2 p-1 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
          style={{
            borderColor: active ? NEW : "#CBD5E1",
            backgroundColor: active ? NEW_SOFT : "#F1F5F9",
          }}
        >
          <span
            className="rounded-full px-3 py-1.5 text-xs font-bold transition-colors"
            style={{ color: active ? "#94A3B8" : "#334155" }}
          >
            기존
          </span>
          <span
            className="rounded-full px-3 py-1.5 text-xs font-bold text-white transition-colors"
            style={{ backgroundColor: active ? NEW : "#CBD5E1" }}
          >
            repick
          </span>
        </button>
      </div>

      <div
        className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-100"
        role="img"
        aria-label={`${row.label} 값 ${value.toLocaleString("ko-KR")}${row.unit}, 최대 ${row.max}${row.unit} 대비 ${Math.round(pct)}%`}
      >
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: active ? NEW : OLD_SOFT }}
        />
      </div>

      <p className="mt-3 text-sm leading-relaxed text-slate-500">
        {active ? row.newDesc : row.oldDesc}
      </p>
    </div>
  );
}

export default function Landing() {
  const [pos, setPos] = useState(55);
  const [active, setActive] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(METRIC_ROWS.map((r) => [r.id, false]))
  );
  const [monthlyStock, setMonthlyStock] = useState(400);

  const toggleRow = (id: string) =>
    setActive((prev) => ({ ...prev, [id]: !prev[id] }));

  const setAll = (val: boolean) =>
    setActive(Object.fromEntries(METRIC_ROWS.map((r) => [r.id, val])));

  const calc = useMemo(() => {
    const oldLoss = monthlyStock * AVG_PRICE * OLD_LOSS_RATE;
    const newLoss = monthlyStock * AVG_PRICE * NEW_LOSS_RATE;
    const oldHours = Math.round((monthlyStock * OLD_MIN_PER_ITEM) / 60);
    const newHours = Math.round((monthlyStock * NEW_MIN_PER_ITEM) / 60);
    return {
      oldLoss,
      newLoss,
      savedAmount: oldLoss - newLoss,
      oldHours,
      newHours,
      savedHours: oldHours - newHours,
    };
  }, [monthlyStock]);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <style>{`
        @keyframes marquee-x { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .marquee-track { animation: marquee-x 24s linear infinite; }
      `}</style>

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-black text-white"
              style={{ backgroundColor: NEW }}
            >
              r
            </span>
            <span className="text-lg font-black tracking-tight">
              repick <span style={{ color: NEW }}>Business</span>
            </span>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
            <a
              href="#compare"
              className="rounded-md hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              비교하기
            </a>
            <a
              href="#metrics"
              className="rounded-md hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              낙차 데이터
            </a>
            <a
              href="#calculator"
              className="rounded-md hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              ROI 계산기
            </a>
            <a
              href="#demo"
              className="rounded-md hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              문의
            </a>
          </nav>
          <a
            href="#demo"
            className="rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
            style={{ backgroundColor: NEW }}
          >
            데모 신청
          </a>
        </div>
      </header>

      <main>
        {/* HERO — drag comparator */}
        <section id="compare" className="mx-auto max-w-6xl px-4 pt-14 pb-16 sm:px-6 md:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-bold tracking-wide text-slate-500">
              기존 방식 vs repick Business
            </span>
            <h1 className="mt-6 text-4xl leading-[1.15] font-black tracking-tight sm:text-5xl md:text-6xl">
              같은 재고,{" "}
              <span style={{ color: NEW }}>다른 속도로</span> 팔립니다
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              슬라이더를 드래그해서 기존 방식과 repick Business의 차이를 직접
              비교해 보세요.
            </p>
          </div>

          <div className="relative mx-auto mt-10 h-[460px] w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/60 sm:h-[420px]">
            {/* base panel: 기존 방식 */}
            <div className="absolute inset-0 flex flex-col justify-center gap-5 bg-slate-100 px-6 py-10 sm:px-10">
              <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                기존 방식
              </p>
              <ul className="flex flex-col gap-4">
                {OLD_POINTS.map((p) => (
                  <li key={p.text} className="flex items-start gap-3">
                    <span aria-hidden="true" className="text-xl grayscale">
                      {p.icon}
                    </span>
                    <span className="text-sm leading-snug font-semibold text-slate-600 sm:text-base">
                      {p.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* overlay panel: repick Business, clipped to the right of the divider */}
            <div
              className="absolute inset-0 flex flex-col justify-center gap-5 px-6 py-10 text-white sm:px-10"
              style={{ backgroundColor: "#0B2419", clipPath: `inset(0 0 0 ${pos}%)` }}
            >
              <p
                className="text-xs font-bold tracking-widest uppercase"
                style={{ color: NEW }}
              >
                repick Business
              </p>
              <ul className="flex flex-col gap-4">
                {NEW_POINTS.map((p) => (
                  <li key={p.text} className="flex items-start gap-3">
                    <span aria-hidden="true" className="text-xl">
                      {p.icon}
                    </span>
                    <span className="text-sm leading-snug font-semibold text-white/90 sm:text-base">
                      {p.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* accessible drag control (native range, visually hidden, full hit area) */}
            <input
              type="range"
              min={12}
              max={88}
              step={1}
              value={pos}
              onChange={(e) => setPos(Number(e.target.value))}
              aria-label="기존 방식과 repick Business 비교 슬라이더"
              className="absolute inset-0 z-30 m-0 h-full w-full cursor-ew-resize appearance-none bg-transparent p-0 opacity-0"
            />

            {/* visual divider handle, decorative */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 bottom-0 z-20 flex -translate-x-1/2 items-center"
              style={{ left: `${pos}%` }}
            >
              <span className="h-full w-1 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)]" />
              <span
                className="absolute flex h-11 w-11 items-center justify-center rounded-full border-2 bg-white text-base font-black shadow-lg"
                style={{ borderColor: NEW, color: NEW }}
              >
                ⇔
              </span>
            </div>
          </div>

          <p className="mx-auto mt-4 max-w-md text-center text-sm text-slate-500">
            왼쪽은 기존 방식, 오른쪽은 repick Business — 드래그하거나 슬라이더에
            초점을 맞춘 뒤 화살표 키로도 비교할 수 있어요.
          </p>
        </section>

        {/* LOGO STRIP */}
        <section className="border-y border-slate-200 bg-slate-50 py-9">
          <p className="mb-5 text-center text-sm font-semibold text-slate-500">
            이미 다양한 셀러가 repick Business와 함께 재고를 순환시키고 있습니다
          </p>
          <div
            className="overflow-hidden"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
              maskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            }}
          >
            <div className="marquee-track flex w-max items-center gap-16">
              {[...LOGOS, ...LOGOS].map((logo, i) => (
                <span
                  key={`${logo}-${i}`}
                  className="text-xl font-black tracking-widest text-slate-300 uppercase"
                >
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* METRIC TOGGLES */}
        <section id="metrics" className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              항목별로 눌러서{" "}
              <span style={{ color: NEW }}>낙차를 확인</span>하세요
            </h2>
            <p className="mt-4 text-slate-600">
              각 지표의 스위치를 켜면 기존 방식 숫자가 repick Business 숫자로
              바뀌는 걸 그대로 느낄 수 있어요.
            </p>
          </div>

          <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setAll(false)}
              className="rounded-full border-2 border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition-colors hover:border-slate-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
            >
              전체 기존 방식으로
            </button>
            <button
              type="button"
              onClick={() => setAll(true)}
              className="rounded-full px-4 py-2 text-xs font-bold text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
              style={{ backgroundColor: NEW }}
            >
              전체 repick으로 전환
            </button>
          </div>

          <div className="mt-8 flex flex-col gap-4">
            {METRIC_ROWS.map((row) => (
              <MetricRow
                key={row.id}
                row={row}
                active={active[row.id]}
                onToggle={() => toggleRow(row.id)}
              />
            ))}
          </div>
        </section>

        {/* ROI CALCULATOR */}
        <section id="calculator" className="border-t border-slate-200 bg-slate-50 py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                우리 매장이면 얼마나 달라질까요?
              </h2>
              <p className="mt-4 text-slate-600">
                한 달에 처리하는 재고 수량을 옮겨서 예상 손실액과 처리 시간을
                비교해 보세요.
              </p>
            </div>

            <div className="mx-auto mt-10 max-w-xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
              <label
                htmlFor="monthly-stock"
                className="flex items-center justify-between text-sm font-semibold text-slate-600"
              >
                <span>월 처리 재고 수량</span>
                <span className="text-base font-black text-slate-900 tabular-nums">
                  {monthlyStock.toLocaleString("ko-KR")}개
                </span>
              </label>
              <input
                id="monthly-stock"
                type="range"
                min={50}
                max={2000}
                step={50}
                value={monthlyStock}
                onChange={(e) => setMonthlyStock(Number(e.target.value))}
                style={{ accentColor: NEW }}
                className="mt-3 w-full cursor-ew-resize"
              />

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-100 p-5">
                  <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                    기존 방식
                  </p>
                  <p className="mt-2 text-2xl font-black text-slate-700 tabular-nums">
                    {won(calc.oldLoss)}
                  </p>
                  <p className="text-xs text-slate-500">예상 재고 손실액 / 월</p>
                  <p className="mt-3 text-lg font-bold text-slate-600 tabular-nums">
                    {calc.oldHours.toLocaleString("ko-KR")}시간
                  </p>
                  <p className="text-xs text-slate-500">등록·가격책정 처리시간 / 월</p>
                </div>
                <div
                  className="rounded-2xl p-5"
                  style={{ backgroundColor: NEW_SOFT }}
                >
                  <p
                    className="text-xs font-bold tracking-widest uppercase"
                    style={{ color: NEW }}
                  >
                    repick Business
                  </p>
                  <p className="mt-2 text-2xl font-black tabular-nums" style={{ color: "#065F3F" }}>
                    {won(calc.newLoss)}
                  </p>
                  <p className="text-xs text-slate-600">예상 재고 손실액 / 월</p>
                  <p className="mt-3 text-lg font-bold tabular-nums" style={{ color: "#065F3F" }}>
                    {calc.newHours.toLocaleString("ko-KR")}시간
                  </p>
                  <p className="text-xs text-slate-600">등록·가격책정 처리시간 / 월</p>
                </div>
              </div>

              <div
                className="mt-6 rounded-2xl border-2 p-5 text-center"
                style={{ borderColor: NEW, backgroundColor: "#F0FDF7" }}
              >
                <p className="text-sm font-semibold text-slate-600">
                  매달 예상 절감 효과
                </p>
                <p className="mt-1 text-3xl font-black tabular-nums" style={{ color: NEW }}>
                  {won(calc.savedAmount)}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  + 처리 시간 {calc.savedHours.toLocaleString("ko-KR")}시간 절약
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIAL */}
        <section id="story" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <div
            className="relative overflow-hidden rounded-[2.5rem] p-10 text-white shadow-2xl md:p-16"
            style={{ backgroundColor: "#0B2419" }}
          >
            <p
              aria-hidden="true"
              className="absolute -top-4 left-8 text-8xl font-black opacity-10"
            >
              &ldquo;
            </p>
            <p className="relative text-2xl leading-snug font-bold md:text-3xl">
              예전엔 안 팔리는 재고를 어떻게든 싸게 넘기는 게 최선이었어요.
              repick으로 바꾸고 나서는 같은 재고가 3배 빠르게, 제값 받고
              나갑니다.
            </p>
            <div className="relative mt-8 flex items-center gap-3">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-black"
                style={{ backgroundColor: NEW, color: "#0B2419" }}
              >
                하
              </span>
              <div>
                <p className="text-sm font-bold">김하늘 대표</p>
                <p className="text-xs font-semibold text-white/70">세컨드무브</p>
              </div>
            </div>
          </div>
        </section>

        {/* DEMO REQUEST */}
        <section id="demo" className="border-t border-slate-200 bg-slate-50 py-24">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                지금 바로 데모를 요청하세요
              </h2>
              <p className="mt-4 max-w-md text-slate-600">
                영업일 기준 1일 이내에 담당 매니저가 연락드립니다. 팀 규모와
                상관없이 무료로 체험해 보실 수 있어요.
              </p>
              <ul className="mt-8 flex flex-col gap-3 text-sm font-semibold text-slate-600">
                <li className="flex items-center gap-2">
                  <span style={{ color: NEW }}>✓</span> 카드 등록 없이 무료 체험
                </li>
                <li className="flex items-center gap-2">
                  <span style={{ color: NEW }}>✓</span> 기존 시스템과 원클릭 연동
                </li>
                <li className="flex items-center gap-2">
                  <span style={{ color: NEW }}>✓</span> 전담 매니저 1:1 온보딩
                </li>
              </ul>
            </div>

            <form className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="company" className="text-sm font-semibold text-slate-700">
                    회사명
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    required
                    placeholder="예: 세컨드무브"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-400 focus-visible:ring-4 focus-visible:ring-emerald-200 focus-visible:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-sm font-semibold text-slate-700">
                    담당자 이메일
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="name@company.com"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-400 focus-visible:ring-4 focus-visible:ring-emerald-200 focus-visible:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="team-size" className="text-sm font-semibold text-slate-700">
                    월 처리 재고 규모
                  </label>
                  <select
                    id="team-size"
                    name="team-size"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus-visible:ring-4 focus-visible:ring-emerald-200 focus-visible:outline-none"
                    defaultValue="100-500"
                  >
                    <option value="~100">100개 미만</option>
                    <option value="100-500">100~500개</option>
                    <option value="500-2000">500~2,000개</option>
                    <option value="2000+">2,000개 이상</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-sm font-semibold text-slate-700">
                    문의 내용
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    placeholder="현재 재고 처리 방식이나 궁금하신 점을 알려주세요"
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-400 focus-visible:ring-4 focus-visible:ring-emerald-200 focus-visible:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-2 w-full rounded-full px-8 py-4 text-base font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
                  style={{ backgroundColor: NEW }}
                >
                  데모 요청 보내기
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 sm:flex-row sm:justify-between sm:px-6">
          <div className="flex items-center gap-2">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-black text-white"
              style={{ backgroundColor: NEW }}
            >
              r
            </span>
            <span className="text-sm font-black text-slate-700">repick Business</span>
          </div>
          <nav className="flex gap-6 text-sm font-semibold text-slate-500">
            <a
              href="#"
              className="rounded-md hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              개인정보처리방침
            </a>
            <a
              href="#"
              className="rounded-md hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              이용약관
            </a>
            <a
              href="#demo"
              className="rounded-md hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              문의하기
            </a>
          </nav>
        </div>
        <p className="mt-6 text-center text-xs font-medium text-slate-400">
          © 2026 repick. 같은 재고, 다른 속도로 팔립니다.
        </p>
      </footer>
    </div>
  );
}
