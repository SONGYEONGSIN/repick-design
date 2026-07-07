"use client";

import { useState } from "react";

const BG = "#0B0B16";
const CARD = "#15142A";

type LevelId = "free" | "pro" | "biz";

type Level = {
  id: LevelId;
  levelLabel: string;
  rank: string;
  name: string;
  icon: string;
  price: string;
  unit: string;
  tagline: string;
  signature: string;
  accent: string;
  popular?: boolean;
  xp: number;
  abilities: string[];
  preview: string[] | null;
  cta: string;
};

const LEVELS: Level[] = [
  {
    id: "free",
    levelLabel: "LV.01",
    rank: "탐색가",
    name: "Free",
    icon: "🔍",
    price: "₩0",
    unit: "평생 무료",
    tagline: "AI 취향 스캔으로 리커머스 세계에 입장하는 단계",
    signature: "취향 스캔으로 감을 잡는 시작 단계",
    accent: "#34D9B4",
    xp: 33,
    abilities: [
      "AI 취향 스캔 시작",
      "주간 추천 퀘스트 수신",
      "찜 목록 인벤토리",
      "커뮤니티 리뷰 열람",
    ],
    preview: ["무제한 실시간 매칭", "가격 하락 즉시 알림"],
    cta: "Lv.1 무료로 시작하기",
  },
  {
    id: "pro",
    levelLabel: "LV.02",
    rank: "매칭 마스터",
    name: "Pro",
    icon: "⚡",
    price: "₩9,900",
    unit: "/ 월",
    tagline: "실시간 매칭으로 득템 확률을 최대치로 끌어올리는 단계",
    signature: "실시간 매칭으로 득템 확률 최대화",
    accent: "#FFC542",
    popular: true,
    xp: 66,
    abilities: [
      "무제한 실시간 매칭",
      "가격 하락 즉시 알림",
      "가격 추적 레이더",
      "판매자 신뢰도 상세 스캔",
      "광고 없는 클린 모드",
    ],
    preview: ["셀러 전용 대시보드", "API 연동 오픈"],
    cta: "Lv.2로 레벨업하기",
  },
  {
    id: "biz",
    levelLabel: "LV.03",
    rank: "길드 마스터",
    name: "Business",
    icon: "👑",
    price: "문의",
    unit: "맞춤 견적",
    tagline: "팀 전체가 API로 연결되는 리커머스 길드의 정점",
    signature: "팀 전체가 API로 연결되는 최종 단계",
    accent: "#FF5DA2",
    xp: 100,
    abilities: [
      "팀 시트 무제한 초대",
      "셀러 전용 대시보드",
      "API 연동 오픈",
      "전담 매니저 배정",
      "SLA 보장",
    ],
    preview: null,
    cta: "길드 마스터 문의하기",
  },
];

type StatRow = { label: string; free: number; pro: number; biz: number };

const STATS: StatRow[] = [
  { label: "매칭 속도", free: 2, pro: 5, biz: 5 },
  { label: "AI 추천 정밀도", free: 2, pro: 4, biz: 5 },
  { label: "알림 반응 속도", free: 1, pro: 5, biz: 5 },
  { label: "신뢰도 스캔 깊이", free: 2, pro: 4, biz: 5 },
  { label: "팀 동시 접속", free: 1, pro: 1, biz: 5 },
  { label: "API 확장성", free: 0, pro: 0, biz: 5 },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "레벨업(업그레이드)하면 이전 데이터가 사라지나요?",
    a: "아니요. 찜 목록 인벤토리와 취향 스캔 데이터는 그대로 유지되고, 업그레이드 즉시 다음 레벨의 능력이 열려요.",
  },
  {
    q: "레벨다운(해지)도 가능한가요?",
    a: "네, 언제든 가능합니다. 해지해도 결제 주기가 끝날 때까지는 Lv.2 능력을 계속 사용할 수 있어요.",
  },
  {
    q: "Lv.3 길드 마스터는 어떻게 산정되나요?",
    a: "팀 규모와 필요한 API 호출량에 따라 맞춤 견적을 드려요. 아래 버튼으로 문의하시면 담당자가 안내해드립니다.",
  },
];

function Pips({ filled, color }: { filled: number; color: string }) {
  return (
    <div
      role="img"
      aria-label={`5단계 중 ${filled}단계`}
      className="flex items-center gap-1"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="h-2.5 w-2.5 rounded-full"
          style={{
            backgroundColor: i < filled ? color : "rgba(255,255,255,0.14)",
          }}
        />
      ))}
    </div>
  );
}

export default function Landing() {
  const [selected, setSelected] = useState<LevelId>("pro");
  const level = LEVELS.find((l) => l.id === selected) ?? LEVELS[1];

  return (
    <div
      className="min-h-screen font-sans text-white"
      style={{ backgroundColor: BG }}
    >
      {/* faint scanline / grid texture, decorative */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6 md:px-10">
        <a
          href="#top"
          className="flex items-center gap-2 rounded-md text-lg font-black tracking-tight focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B16]"
        >
          <span
            aria-hidden="true"
            className="flex h-7 w-7 items-center justify-center rounded-lg border-2 text-xs font-black"
            style={{ borderColor: "#FFC542", color: "#FFC542" }}
          >
            R
          </span>
          repick
        </a>
        <a
          href="#levels"
          className="rounded-full border-2 px-4 py-2 text-xs font-black tracking-widest text-[#0B0B16] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B16] sm:text-sm"
          style={{ backgroundColor: "#FFC542", borderColor: "#FFC542" }}
        >
          레벨업 시작 ↓
        </a>
      </header>

      <main>
        {/* Hero */}
        <section
          id="top"
          className="relative mx-auto max-w-4xl px-6 pb-16 pt-10 text-center md:px-10 md:pb-24 md:pt-16"
        >
          <p
            className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-1 font-mono text-[11px] uppercase tracking-[0.2em]"
            style={{ borderColor: "rgba(255,255,255,0.2)", color: "#8B8AA3" }}
          >
            🎮 game mode pricing
          </p>
          <h1 className="mx-auto max-w-2xl text-4xl font-black leading-[1.15] tracking-tight sm:text-5xl md:text-6xl">
            요금제가 아니라
            <br />
            <span style={{ color: "#FFC542" }}>레벨업</span>입니다
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base text-white/60 md:text-lg">
            AI 취향 스캔으로 시작해서, 팀 전체를 연결하는 길드 마스터까지 —
            능력을 하나씩 해금하며 성장하세요.
          </p>

          {/* mini journey preview */}
          <div className="mx-auto mt-10 flex max-w-md items-center justify-between gap-2">
            {LEVELS.map((l, i) => (
              <div key={l.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-1">
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm"
                    style={{ borderColor: l.accent, backgroundColor: BG }}
                  >
                    {l.icon}
                  </span>
                  <span
                    className="font-mono text-[10px] tracking-widest"
                    style={{ color: l.accent }}
                  >
                    {l.levelLabel}
                  </span>
                </div>
                {i < LEVELS.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="mx-1 h-0.5 flex-1 border-t-2 border-dashed"
                    style={{ borderColor: "rgba(255,255,255,0.2)" }}
                  />
                ) : null}
              </div>
            ))}
          </div>
        </section>

        {/* Level selector + character card */}
        <section id="levels" className="relative px-6 pb-20 md:px-10">
          <h2 className="mx-auto mb-8 max-w-md text-center text-2xl font-black md:text-3xl">
            당신의 레벨을 선택하세요
          </h2>

          <div
            role="tablist"
            aria-label="요금제 레벨 선택"
            className="mx-auto mb-8 flex max-w-xl gap-3"
          >
            {LEVELS.map((l) => {
              const isActive = l.id === selected;
              return (
                <button
                  key={l.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelected(l.id)}
                  className="flex flex-1 flex-col items-center gap-1 rounded-2xl border-2 px-3 py-3 text-center transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B16]"
                  style={{
                    borderColor: isActive ? l.accent : "rgba(255,255,255,0.15)",
                    backgroundColor: isActive ? `${l.accent}1f` : "transparent",
                  }}
                >
                  <span
                    className="font-mono text-[10px] tracking-widest"
                    style={{ color: isActive ? l.accent : "#8B8AA3" }}
                  >
                    {l.levelLabel}
                  </span>
                  <span className="text-sm font-black text-white">{l.name}</span>
                </button>
              );
            })}
          </div>

          <div
            className="mx-auto max-w-xl rounded-3xl border-2 p-6 md:p-8"
            style={{
              borderColor: level.accent,
              backgroundColor: CARD,
              boxShadow: `0 0 50px -12px ${level.accent}80`,
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl border-2 text-2xl"
                  style={{ borderColor: level.accent, backgroundColor: BG }}
                >
                  {level.icon}
                </span>
                <div>
                  <p
                    className="font-mono text-xs tracking-widest"
                    style={{ color: level.accent }}
                  >
                    {level.levelLabel}
                  </p>
                  <h3 className="text-xl font-black leading-tight md:text-2xl">
                    {level.rank}
                    <span className="ml-2 text-sm font-normal text-white/50">
                      · {level.name}
                    </span>
                  </h3>
                </div>
              </div>
              {level.popular ? (
                <span
                  className="flex-none rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest"
                  style={{ borderColor: level.accent, color: level.accent }}
                >
                  ★ 인기
                </span>
              ) : null}
            </div>

            <p className="mt-5 flex items-baseline gap-2">
              <span className="text-4xl font-black">{level.price}</span>
              <span className="text-sm text-white/50">{level.unit}</span>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              {level.tagline}
            </p>

            <div className="mt-6">
              <div className="mb-1 flex items-center justify-between font-mono text-[11px] text-white/50">
                <span>성장 게이지</span>
                <span>{level.xp}%</span>
              </div>
              <div
                role="progressbar"
                aria-valuenow={level.xp}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${level.name} 성장 게이지 ${level.xp}퍼센트`}
                className="h-2.5 w-full overflow-hidden rounded-full bg-white/10"
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${level.xp}%`, backgroundColor: level.accent }}
                />
              </div>
            </div>

            <ul className="mt-6 flex flex-col gap-2.5 text-sm">
              {level.abilities.map((a) => (
                <li key={a} className="flex items-start gap-2.5">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full text-[10px] font-black"
                    style={{ backgroundColor: level.accent, color: BG }}
                  >
                    ✓
                  </span>
                  <span className="text-white/85">{a}</span>
                </li>
              ))}
            </ul>

            {level.preview ? (
              <div className="mt-6 rounded-xl border border-dashed border-white/20 p-4">
                <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-white/40">
                  🔒 다음 레벨에서 해금
                </p>
                <ul className="flex flex-col gap-1.5 text-sm text-white/50">
                  {level.preview.map((p) => (
                    <li key={p}>🔒 {p}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div
                className="mt-6 rounded-xl border p-4 text-center text-sm font-bold"
                style={{ borderColor: level.accent, color: level.accent }}
              >
                👑 MAX LEVEL — 모든 능력 해금 완료
              </div>
            )}

            <a
              href="#faq"
              className="mt-8 block rounded-full px-5 py-3 text-center text-sm font-black transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B16]"
              style={{ backgroundColor: level.accent, color: BG }}
            >
              {level.cta}
            </a>
          </div>
        </section>

        {/* Roadmap */}
        <section className="px-6 pb-20 md:px-10">
          <h2 className="mx-auto mb-10 max-w-md text-center text-2xl font-black md:text-3xl">
            레벨업 로드맵
          </h2>
          <div className="relative mx-auto flex max-w-4xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
            <div
              aria-hidden="true"
              className="absolute left-8 top-8 hidden h-0.5 border-t-2 border-dashed border-white/15 md:block md:right-8"
            />
            {LEVELS.map((l) => (
              <div
                key={l.id}
                className="relative z-10 flex flex-1 flex-col items-center gap-2 text-center"
              >
                <span
                  aria-hidden="true"
                  className="flex h-16 w-16 items-center justify-center rounded-full border-2 text-2xl"
                  style={{ borderColor: l.accent, backgroundColor: BG }}
                >
                  {l.icon}
                </span>
                <p
                  className="font-mono text-xs tracking-widest"
                  style={{ color: l.accent }}
                >
                  {l.levelLabel}
                </p>
                <h3 className="text-base font-black">
                  {l.rank}
                  <span className="ml-1 font-normal text-white/50">
                    · {l.name}
                  </span>
                </h3>
                <p className="max-w-[190px] text-sm text-white/55">
                  {l.signature}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Stat comparison */}
        <section className="px-6 pb-20 md:px-10">
          <h2 className="mx-auto mb-8 max-w-md text-center text-2xl font-black md:text-3xl">
            능력치 비교
          </h2>
          <div
            className="mx-auto max-w-3xl overflow-x-auto rounded-3xl border-2 border-white/15"
            style={{ backgroundColor: CARD }}
          >
            <table className="w-full min-w-[520px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/15">
                  <th scope="col" className="p-4 font-black text-white/70">
                    능력치
                  </th>
                  {LEVELS.map((l) => (
                    <th key={l.id} scope="col" className="p-4">
                      <span
                        className="font-mono text-[10px] tracking-widest"
                        style={{ color: l.accent }}
                      >
                        {l.levelLabel}
                      </span>
                      <br />
                      <span className="text-sm font-black">{l.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {STATS.map((row, idx) => (
                  <tr
                    key={row.label}
                    className={`border-b border-white/5 ${
                      idx % 2 === 1 ? "bg-white/[0.03]" : ""
                    }`}
                  >
                    <th scope="row" className="p-4 font-bold text-white/80">
                      {row.label}
                    </th>
                    <td className="p-4">
                      <Pips filled={row.free} color={LEVELS[0].accent} />
                    </td>
                    <td className="p-4">
                      <Pips filled={row.pro} color={LEVELS[1].accent} />
                    </td>
                    <td className="p-4">
                      <Pips filled={row.biz} color={LEVELS[2].accent} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="px-6 pb-20 md:px-10">
          <h2 className="mx-auto mb-6 max-w-md text-center text-2xl font-black md:text-3xl">
            퀘스트 Q&amp;A
          </h2>
          <div className="mx-auto flex max-w-xl flex-col gap-4">
            {FAQS.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border-2 border-white/15 p-5 [&::-webkit-details-marker]:hidden"
                style={{ backgroundColor: CARD }}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-md text-base font-bold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B16]">
                  {item.q}
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 flex-none items-center justify-center rounded-full border-2 text-lg font-black transition-transform group-open:rotate-45"
                    style={{ borderColor: "#FFC542", color: "#FFC542" }}
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section
          className="relative mx-4 mb-16 overflow-hidden rounded-[2.5rem] border-2 px-6 py-16 text-center md:mx-10 md:py-20"
          style={{ borderColor: "#FFC542", backgroundColor: CARD }}
        >
          <h2 className="mx-auto max-w-xl text-3xl font-black leading-tight md:text-4xl">
            지금 Lv.1부터 시작하고
            <br className="md:hidden" /> 리커머스 세계를 레벨업하세요
          </h2>
          <p className="mx-auto mt-4 max-w-md text-white/60">
            카드 등록 없이 무료로 시작할 수 있어요.
          </p>
          <a
            href="#levels"
            className="mt-8 inline-block rounded-full px-8 py-3 text-base font-black text-[#0B0B16] transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B16]"
            style={{ backgroundColor: "#FFC542" }}
          >
            무료로 레벨업 시작하기
          </a>
        </section>
      </main>

      <footer className="px-6 pb-10 text-center text-xs text-white/35 md:px-10">
        © 2026 repick. 취향을 아는 AI 리커머스.
      </footer>
    </div>
  );
}
