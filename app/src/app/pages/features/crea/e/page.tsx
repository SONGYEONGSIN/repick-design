"use client";

import { useEffect, useRef, useState, type ReactElement, type CSSProperties } from "react";

type ChapterId = "hero" | "learn" | "match" | "verify" | "alert" | "close";

interface Chapter {
  id: ChapterId;
  navLabel: string;
  featureTag: string;
  featureTitle: string;
  featureDesc: string;
}

const CHAPTERS: Chapter[] = [
  { id: "hero", navLabel: "시작", featureTag: "", featureTitle: "", featureDesc: "" },
  {
    id: "learn",
    navLabel: "취향 학습",
    featureTag: "① 취향 학습",
    featureTitle: "말하지 않아도 알아채는 취향",
    featureDesc: "찜·클릭·구매 데이터를 쌓아 말로 설명하기 어려운 취향까지 읽어냅니다.",
  },
  {
    id: "match",
    navLabel: "AI 매칭",
    featureTag: "② AI 매칭",
    featureTitle: "수만 벌 중에서 당신 앞으로",
    featureDesc: "수만 개의 매물 중 취향 프로필과 가장 가까운 상품을 실시간으로 골라냅니다.",
  },
  {
    id: "verify",
    navLabel: "신뢰 검증",
    featureTag: "③ 신뢰 검증",
    featureTitle: "대충 팔리지 않도록",
    featureDesc: "상태 등급, 시세 대비 가격, 판매자 이력을 교차 검증해 안심하고 살 수 있게 만듭니다.",
  },
  {
    id: "alert",
    navLabel: "실시간 알림",
    featureTag: "④ 실시간 알림",
    featureTitle: "그 순간, 바로 진동",
    featureDesc: "가격 하락과 신규 매칭을 놓치지 않도록 그 순간 바로 알려드립니다.",
  },
  { id: "close", navLabel: "도착", featureTag: "", featureTitle: "", featureDesc: "" },
];

const HEAT_DOTS = [
  0.15, 0.85, 0.3, 0.55, 0.2, 0.65, 0.4, 0.9, 0.25, 0.6, 0.35, 0.75, 0.5, 0.2,
  0.8, 0.45, 0.7, 0.15, 0.6, 0.3, 0.95, 0.4, 0.25, 0.55, 0.1, 0.5, 0.35, 0.8,
  0.2, 0.65, 0.45, 0.3, 0.9, 0.15, 0.7, 0.4,
];

const MATCH_BARS = [0.3, 0.5, 0.25, 0.6, 0.4, 0.7, 1, 0.35, 0.55, 0.2, 0.45, 0.3];
const MATCH_HIGHLIGHT = 6;

function TasteVisual() {
  return (
    <div
      className="grid grid-cols-6 gap-1.5 rounded-xl border border-[color:var(--e-line)] bg-[color:var(--e-surface)] p-4"
      aria-hidden="true"
    >
      {HEAT_DOTS.map((v, i) => (
        <span
          key={i}
          className="e-fade-dot aspect-square rounded-full bg-[color:var(--e-accent)]"
          style={{ opacity: v, animationDelay: `${(i % 12) * 60}ms` }}
        />
      ))}
    </div>
  );
}

function MatchVisual() {
  return (
    <div
      className="flex items-end gap-1.5 rounded-xl border border-[color:var(--e-line)] bg-[color:var(--e-surface)] p-4"
      style={{ height: "9.5rem" }}
      aria-hidden="true"
    >
      {MATCH_BARS.map((h, i) => {
        const isHit = i === MATCH_HIGHLIGHT;
        return (
          <span
            key={i}
            className={`relative flex-1 rounded-t-sm ${
              isHit ? "e-pulse-bar bg-[color:var(--e-accent)]" : "bg-[color:var(--e-line)]"
            }`}
            style={{ height: `${h * 100}%`, opacity: isHit ? 1 : 0.5 }}
          >
            {isHit && (
              <span className="e-ping-ring absolute -inset-x-2 -top-2 h-2 rounded-full border border-[color:var(--e-accent)]" />
            )}
          </span>
        );
      })}
    </div>
  );
}

function VerifyVisual() {
  const gauges: { label: string; value: number; note: string }[] = [
    { label: "상태 등급", value: 0.86, note: "A-" },
    { label: "시세 적정성", value: 0.72, note: "적정" },
    { label: "판매자 신뢰", value: 0.94, note: "우수" },
  ];
  return (
    <div
      className="flex flex-col gap-3 rounded-xl border border-[color:var(--e-line)] bg-[color:var(--e-surface)] p-4"
      aria-hidden="true"
    >
      {gauges.map((g) => (
        <div key={g.label} className="flex items-center gap-3">
          <span className="w-20 shrink-0 text-xs text-[color:var(--e-sub)]">{g.label}</span>
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[color:var(--e-line)]">
            <span
              className="e-grow-bar block h-full rounded-full bg-[color:var(--e-accent)]"
              style={{ "--e-w": `${g.value * 100}%` } as CSSProperties}
            />
          </span>
          <span className="w-8 shrink-0 text-right text-xs font-medium text-[color:var(--e-ink)]">
            {g.note}
          </span>
        </div>
      ))}
    </div>
  );
}

function AlertVisual() {
  return (
    <div
      className="flex items-center gap-4 rounded-xl border border-[color:var(--e-line)] bg-[color:var(--e-surface)] p-4"
      aria-hidden="true"
    >
      <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[color:var(--e-accent)]/10 text-2xl">
        <span className="e-bell-ping absolute inset-0 rounded-full border border-[color:var(--e-accent)]" />
        🔔
      </span>
      <div className="flex flex-col">
        <span className="text-xs text-[color:var(--e-sub)]">찜한 상품 가격 하락</span>
        <span className="text-sm font-semibold text-[color:var(--e-accent)]">
          198,000원 → 168,000원 <span aria-hidden="true">↓</span>
        </span>
      </div>
    </div>
  );
}

const VISUALS: Partial<Record<ChapterId, () => ReactElement>> = {
  learn: TasteVisual,
  match: MatchVisual,
  verify: VerifyVisual,
  alert: AlertVisual,
};

const NARRATIVES: Partial<Record<ChapterId, string>> = {
  learn:
    "나는 몰랐다. 내가 태어나기도 전부터, 어떤 사람이 나와 닮은 옷들을 조용히 찜하고 있었다는 걸.\n\n그는 브라운 계열을 유독 오래 들여다봤고, 오버사이즈 핏에서 스크롤을 멈췄고, 힙색보다 크로스백을 더 많이 눌렀다.\n\n누구도 시키지 않았는데, repick은 그 사소한 손짓들을 전부 기억하고 있었다.",
  match:
    "어느 날, 나는 위탁 창고 구석에서 사진 몇 장으로 남겨졌다.\n\n그 순간 나는 수만 벌의 옷 중 하나였다 — 특별할 것 없는, 흔한 브라운 레더 자켓.\n\n그런데 repick의 AI는 몇 초 만에 나를 그 사람 앞에 데려다 놓았다. 마치 '이 사람이 찾던 게 이거였구나' 하듯이.",
  verify:
    "하지만 매칭됐다고 끝이 아니었다. 무언가가 나를 아주 꼼꼼히 들여다봤다.\n\n소매 끝 마모는 몇 퍼센트인지, 이 가격이 같은 등급의 다른 자켓들과 비교해 합리적인지, 나를 판 사람은 이전에도 약속을 지켰는지.\n\n나는 처음으로, 그냥 팔리는 물건이 아니라 검증받는 물건이 됐다.",
  alert:
    "검증을 통과한 다음날, 내 가격이 조금 내려갔다. 아주 잠깐, 3만원.\n\n그 순간 그 사람의 휴대폰이 울렸다. '찜한 상품의 가격이 내렸어요.'\n\n나는 그제서야 알았다. 이 모든 여정이 결국 그 진동 한 번을 위한 것이었다는 걸.",
};

export default function Landing() {
  const [active, setActive] = useState<ChapterId>("hero");
  const [progress, setProgress] = useState(0);
  const sectionRefs = useRef<Partial<Record<ChapterId, HTMLElement | null>>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-chapter") as ChapterId | null;
            if (id) setActive(id);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        setProgress(max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const setRef = (id: ChapterId) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  const scrollTo = (id: ChapterId) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className="e-root relative w-full overflow-x-hidden"
      style={
        {
          "--e-bg": "#f6f1ea",
          "--e-ink": "#2b2118",
          "--e-sub": "#7a6a58",
          "--e-line": "#ddd0bf",
          "--e-surface": "#fffdfa",
          "--e-accent": "#a85c32",
          "--e-accent-ink": "#fff8f0",
          "--e-dark": "#211a14",
        } as CSSProperties
      }
    >
      <style>{`
        .e-root { background: var(--e-bg); color: var(--e-ink); font-family: var(--font-geist-sans, ui-sans-serif), system-ui, sans-serif; }
        .e-serif { font-family: Georgia, "Noto Serif KR", "Nanum Myeongjo", serif; }
        .e-progress-track { position: fixed; top: 0; left: 0; right: 0; height: 3px; z-index: 50; background: transparent; }
        .e-progress-bar { height: 100%; background: var(--e-accent); transform-origin: left; transition: transform 60ms linear; }
        @keyframes e-fade-dot-kf { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }
        .e-fade-dot { animation: e-fade-dot-kf 3.2s ease-in-out infinite; }
        @keyframes e-pulse-bar-kf { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.25); } }
        .e-pulse-bar { animation: e-pulse-bar-kf 1.8s ease-in-out infinite; }
        @keyframes e-ping-ring-kf { 0% { opacity: .9; transform: scaleX(0.4); } 100% { opacity: 0; transform: scaleX(1.4); } }
        .e-ping-ring { animation: e-ping-ring-kf 1.6s ease-out infinite; }
        @keyframes e-grow-bar-kf { from { width: 0; } to { width: var(--e-w); } }
        .e-grow-bar { width: var(--e-w); animation: e-grow-bar-kf 1.4s ease-out; }
        @keyframes e-bell-ping-kf { 0% { opacity: .8; transform: scale(0.8); } 100% { opacity: 0; transform: scale(1.6); } }
        .e-bell-ping { animation: e-bell-ping-kf 1.8s ease-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .e-fade-dot, .e-pulse-bar, .e-ping-ring, .e-grow-bar, .e-bell-ping { animation: none !important; transition: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      <div className="e-progress-track" aria-hidden="true">
        <div className="e-progress-bar" style={{ transform: `scaleX(${progress})` }} />
      </div>

      <header className="fixed top-3 left-1/2 z-40 -translate-x-1/2">
        <a
          href="#top"
          className="e-serif rounded-full border border-[color:var(--e-line)] bg-[color:var(--e-surface)]/90 px-4 py-1.5 text-sm font-semibold tracking-wide text-[color:var(--e-ink)] shadow-sm backdrop-blur focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--e-accent)]"
        >
          repick
        </a>
      </header>

      <nav
        aria-label="스토리 진행"
        className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 md:flex"
      >
        {CHAPTERS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => scrollTo(c.id)}
            aria-current={active === c.id ? "step" : undefined}
            aria-label={c.navLabel}
            className="group flex items-center gap-2 focus:outline-none"
          >
            <span
              className={`whitespace-nowrap text-xs transition-opacity ${
                active === c.id
                  ? "opacity-100 text-[color:var(--e-ink)] font-medium"
                  : "opacity-0 group-hover:opacity-70 group-focus-visible:opacity-100 text-[color:var(--e-sub)]"
              }`}
            >
              {c.navLabel}
            </span>
            <span
              className={`h-2.5 w-2.5 rounded-full border transition-all ${
                active === c.id
                  ? "border-[color:var(--e-accent)] bg-[color:var(--e-accent)] scale-125"
                  : "border-[color:var(--e-line)] bg-transparent group-hover:border-[color:var(--e-accent)]"
              }`}
            />
          </button>
        ))}
      </nav>

      <main id="top">
        {/* HERO */}
        <section
          ref={setRef("hero")}
          data-chapter="hero"
          aria-labelledby="e-hero-title"
          className="relative flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-24 text-center"
        >
          <p className="e-serif text-sm uppercase tracking-[0.3em] text-[color:var(--e-sub)]">
            repick story · 01
          </p>
          <h1
            id="e-hero-title"
            className="e-serif max-w-3xl text-4xl leading-tight font-bold sm:text-5xl md:text-6xl"
          >
            이 가죽자켓이
            <br />
            당신에게 오기까지
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-[color:var(--e-sub)] sm:text-lg">
            3년째 팔리지 않던 자켓 한 벌이 어떻게 한 사람의 옷장에 도착했는지 —
            <br className="hidden sm:block" />
            repick 안에서 실제로 일어나는 네 번의 순간을 따라가봅니다.
          </p>
          <button
            type="button"
            onClick={() => scrollTo("learn")}
            className="mt-4 flex flex-col items-center gap-2 text-xs text-[color:var(--e-sub)] transition-colors hover:text-[color:var(--e-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--e-accent)] rounded"
          >
            <span>이야기 시작하기</span>
            <span className="text-lg" aria-hidden="true">
              ↓
            </span>
          </button>
        </section>

        {/* CHAPTERS */}
        {CHAPTERS.filter((c) => c.id !== "hero" && c.id !== "close").map((chapter, idx) => {
          const Visual = VISUALS[chapter.id];
          const isDark = idx % 2 === 1;
          return (
            <section
              key={chapter.id}
              ref={setRef(chapter.id)}
              data-chapter={chapter.id}
              aria-labelledby={`e-${chapter.id}-title`}
              className="relative flex min-h-screen items-center px-6 py-20"
              style={{
                background: isDark ? "var(--e-dark)" : "var(--e-bg)",
                color: isDark ? "var(--e-accent-ink)" : "var(--e-ink)",
              }}
            >
              <div className="mx-auto grid w-full max-w-5xl gap-10 md:grid-cols-[1.2fr_1fr] md:items-center md:gap-16">
                <div>
                  <p
                    className="e-serif mb-4 text-sm uppercase tracking-[0.25em]"
                    style={{ color: isDark ? "#c99b78" : "var(--e-sub)" }}
                  >
                    repick story · {String(idx + 2).padStart(2, "0")}
                  </p>
                  <h2 id={`e-${chapter.id}-title`} className="e-serif mb-6 text-2xl font-bold sm:text-3xl">
                    {chapter.featureTitle}
                  </h2>
                  <p className="whitespace-pre-line text-base leading-loose sm:text-lg" style={{ opacity: 0.92 }}>
                    {NARRATIVES[chapter.id]}
                  </p>
                </div>

                <div
                  className="flex flex-col gap-4 rounded-2xl border p-5"
                  style={{
                    borderColor: isDark ? "rgba(255,255,255,0.14)" : "var(--e-line)",
                    background: isDark ? "rgba(255,255,255,0.04)" : "var(--e-surface)",
                  }}
                >
                  <span
                    className="w-fit rounded-full px-3 py-1 text-xs font-semibold"
                    style={{
                      background: "var(--e-accent)",
                      color: "var(--e-accent-ink)",
                    }}
                  >
                    {chapter.featureTag}
                  </span>
                  {Visual ? <Visual /> : null}
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: isDark ? "#e7d9c9" : "var(--e-sub)" }}
                  >
                    {chapter.featureDesc}
                  </p>
                </div>
              </div>
            </section>
          );
        })}

        {/* CLOSING */}
        <section
          ref={setRef("close")}
          data-chapter="close"
          aria-labelledby="e-close-title"
          className="relative flex min-h-screen flex-col items-center justify-center gap-10 px-6 py-24 text-center"
          style={{ background: "var(--e-bg)" }}
        >
          <div className="max-w-2xl">
            <p className="e-serif mb-4 text-sm uppercase tracking-[0.3em] text-[color:var(--e-sub)]">
              repick story · 06
            </p>
            <h2 id="e-close-title" className="e-serif mb-6 text-3xl font-bold sm:text-4xl">
              그렇게 나는 3년 만에
              <br />
              진짜 내 옷장을 찾았다
            </h2>
            <p className="text-base leading-relaxed text-[color:var(--e-sub)] sm:text-lg">
              지금 이 순간에도, 당신과 닮은 물건 하나가 어딘가에서
              <br className="hidden sm:block" />
              같은 네 번의 순간을 지나 당신에게 오고 있습니다.
            </p>
          </div>

          <div className="grid w-full max-w-3xl grid-cols-2 gap-3 text-left sm:grid-cols-4">
            {CHAPTERS.filter((c) => c.featureTag).map((c) => (
              <div
                key={c.id}
                className="rounded-xl border border-[color:var(--e-line)] bg-[color:var(--e-surface)] p-3"
              >
                <p className="text-xs font-semibold text-[color:var(--e-accent)]">{c.featureTag}</p>
                <p className="mt-1 text-xs leading-snug text-[color:var(--e-sub)]">{c.featureTitle}</p>
              </div>
            ))}
          </div>

          <a
            href="#top"
            className="rounded-full px-8 py-3 text-sm font-semibold shadow-sm transition-transform hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--e-accent)]"
            style={{ background: "var(--e-accent)", color: "var(--e-accent-ink)" }}
          >
            내 취향과 닮은 물건 보러가기
          </a>
        </section>
      </main>
    </div>
  );
}
