const CYAN = "#00fff2";
const MAGENTA = "#ff2ee6";
const AMBER = "#ffb800";
const VOID = "#050608";

type FeatureModule = {
  id: string;
  code: string;
  title: string;
  headline: string;
  desc: string;
  accent: string;
  stat: string;
  statLabel: string;
  visual: "wave" | "radar" | "hex" | "ping";
};

const MODULES: FeatureModule[] = [
  {
    id: "01",
    code: "MOD_01 :: PREF.LEARN",
    title: "취향 학습",
    headline: "당신의 클릭 하나까지 데이터가 된다",
    desc: "찜한 매물, 머문 시간, 반복 검색어까지 실시간 스캔하여 취향 벡터를 갱신합니다.",
    accent: CYAN,
    stat: "98.4%",
    statLabel: "SIGNAL ACCURACY",
    visual: "wave",
  },
  {
    id: "02",
    code: "MOD_02 :: AI.MATCH",
    title: "AI 매칭",
    headline: "수만 개 매물 중 단 하나를 조준한다",
    desc: "전국 리커머스 매물을 초당 스캔하며 취향 벡터와 가장 근접한 좌표를 포착합니다.",
    accent: MAGENTA,
    stat: "0.3s",
    statLabel: "SCAN LATENCY",
    visual: "radar",
  },
  {
    id: "03",
    code: "MOD_03 :: TRUST.VERIFY",
    title: "신뢰 검증",
    headline: "상태 · 가격 · 판매자, 3중 방어선",
    desc: "이미지 판독, 시세 대조, 판매자 이력 검증을 통과한 매물에만 인증 마크를 발급합니다.",
    accent: AMBER,
    stat: "3-LAYER",
    statLabel: "VERIFY PROTOCOL",
    visual: "hex",
  },
  {
    id: "04",
    code: "MOD_04 :: RT.ALERT",
    title: "실시간 알림",
    headline: "가격이 흔들리는 순간 즉시 통지",
    desc: "가격 하락, 신규 매칭, 재고 변동을 감지하는 즉시 신호를 당신 손끝으로 쏩니다.",
    accent: CYAN,
    stat: "<1s",
    statLabel: "PUSH DELAY",
    visual: "ping",
  },
];

function CornerBrackets({ color }: { color: string }) {
  const base =
    "absolute h-3 w-3 border-[color:var(--bc)] sm:h-4 sm:w-4";
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ ["--bc" as string]: color }}>
      <span className={`${base} left-0 top-0 border-l-2 border-t-2`} />
      <span className={`${base} right-0 top-0 border-r-2 border-t-2`} />
      <span className={`${base} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${base} bottom-0 right-0 border-b-2 border-r-2`} />
    </div>
  );
}

function WaveVisual({ color }: { color: string }) {
  const heights = [30, 55, 40, 80, 50, 65, 35, 90, 45, 60];
  return (
    <div className="flex h-16 items-end gap-1" aria-hidden="true">
      {heights.map((h, i) => (
        <span
          key={i}
          className="hud-bar w-2 flex-none"
          style={{
            height: `${h}%`,
            backgroundColor: color,
            animationDelay: `${i * 0.09}s`,
          }}
        />
      ))}
    </div>
  );
}

function RadarVisual({ color }: { color: string }) {
  return (
    <div className="relative flex h-16 w-16 items-center justify-center" aria-hidden="true">
      <div
        className="absolute h-16 w-16 rounded-full border"
        style={{ borderColor: `${color}55` }}
      />
      <div
        className="absolute h-10 w-10 rounded-full border"
        style={{ borderColor: `${color}55` }}
      />
      <div
        className="hud-radar-sweep absolute h-16 w-16 rounded-full"
        style={{
          background: `conic-gradient(from 0deg, ${color}, transparent 35%)`,
        }}
      />
      <div className="absolute h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
    </div>
  );
}

function HexVisual({ color }: { color: string }) {
  return (
    <div className="relative flex h-16 w-16 items-center justify-center" aria-hidden="true">
      <div
        className="h-14 w-14 [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]"
        style={{ backgroundColor: `${color}22`, border: `2px solid ${color}` }}
      />
      <span className="absolute font-mono text-lg font-black" style={{ color }}>
        ✓
      </span>
    </div>
  );
}

function PingVisual({ color }: { color: string }) {
  return (
    <div className="relative flex h-16 w-16 items-center justify-center" aria-hidden="true">
      <span className="hud-ping absolute h-4 w-4 rounded-full" style={{ backgroundColor: color }} />
      <span
        className="hud-ping-ring absolute h-4 w-4 rounded-full border"
        style={{ borderColor: color }}
      />
      <span
        className="hud-ping-ring absolute h-4 w-4 rounded-full border"
        style={{ borderColor: color, animationDelay: "0.6s" }}
      />
    </div>
  );
}

function ModuleVisual({ kind, color }: { kind: FeatureModule["visual"]; color: string }) {
  if (kind === "wave") return <WaveVisual color={color} />;
  if (kind === "radar") return <RadarVisual color={color} />;
  if (kind === "hex") return <HexVisual color={color} />;
  return <PingVisual color={color} />;
}

export default function Landing() {
  return (
    <div className="hud-page min-h-screen overflow-x-hidden font-mono text-[13px]" style={{ backgroundColor: VOID, color: "#c8f8ff" }}>
      <style>{`
        .hud-page {
          --scan-speed: 6s;
        }
        .hud-scanlines::before {
          content: "";
          position: fixed;
          inset: 0;
          z-index: 40;
          pointer-events: none;
          background-image: repeating-linear-gradient(
            to bottom,
            rgba(0, 255, 242, 0.035) 0px,
            rgba(0, 255, 242, 0.035) 1px,
            transparent 2px,
            transparent 4px
          );
          mix-blend-mode: screen;
        }
        .hud-scanlines::after {
          content: "";
          position: fixed;
          left: 0;
          right: 0;
          height: 120px;
          top: -120px;
          z-index: 41;
          pointer-events: none;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(0, 255, 242, 0.06),
            transparent
          );
          animation: hud-sweep var(--scan-speed) linear infinite;
        }
        @keyframes hud-sweep {
          0% { transform: translateY(0); }
          100% { transform: translateY(calc(100vh + 120px)); }
        }
        .hud-grid-bg {
          background-image:
            linear-gradient(rgba(0, 255, 242, 0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 242, 0.07) 1px, transparent 1px);
          background-size: 42px 42px;
        }
        .hud-glitch {
          position: relative;
          display: inline-block;
        }
        .hud-glitch::before,
        .hud-glitch::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          opacity: 0.75;
        }
        .hud-glitch::before {
          color: ${MAGENTA};
          clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
          animation: hud-glitch-a 3.4s infinite linear;
        }
        .hud-glitch::after {
          color: ${CYAN};
          clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
          animation: hud-glitch-b 4.1s infinite linear;
        }
        @keyframes hud-glitch-a {
          0%, 88%, 100% { transform: translate(0, 0); opacity: 0; }
          89% { transform: translate(-3px, -1px); opacity: 0.8; }
          91% { transform: translate(3px, 1px); opacity: 0.8; }
          93% { transform: translate(-2px, 0); opacity: 0; }
        }
        @keyframes hud-glitch-b {
          0%, 90%, 100% { transform: translate(0, 0); opacity: 0; }
          91% { transform: translate(3px, 1px); opacity: 0.8; }
          94% { transform: translate(-3px, -1px); opacity: 0.8; }
          96% { transform: translate(2px, 0); opacity: 0; }
        }
        .hud-bar {
          animation: hud-bar-pulse 1.8s ease-in-out infinite;
          transform-origin: bottom;
        }
        @keyframes hud-bar-pulse {
          0%, 100% { transform: scaleY(0.7); opacity: 0.65; }
          50% { transform: scaleY(1); opacity: 1; }
        }
        .hud-radar-sweep {
          animation: hud-spin 2.4s linear infinite;
        }
        @keyframes hud-spin {
          to { transform: rotate(360deg); }
        }
        .hud-ping {
          animation: hud-ping-dot 2s ease-in-out infinite;
        }
        @keyframes hud-ping-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .hud-ping-ring {
          animation: hud-ping-ring 2s cubic-bezier(0, 0.4, 0.6, 1) infinite;
        }
        @keyframes hud-ping-ring {
          0% { transform: scale(1); opacity: 0.9; }
          100% { transform: scale(3.2); opacity: 0; }
        }
        .hud-blink {
          animation: hud-blink 1.4s steps(2, jump-none) infinite;
        }
        @keyframes hud-blink {
          50% { opacity: 0.25; }
        }
        .hud-panel {
          clip-path: polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px));
        }
        .hud-panel-sm {
          clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
        }
        .hud-btn:hover .hud-btn-fill {
          transform: scaleX(1);
        }
        .hud-btn-fill {
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s ease-out;
        }
        .hud-btn-label {
          transition: color 0.25s ease-out;
        }
        .hud-btn-magenta .hud-btn-label { color: ${MAGENTA}; }
        .hud-btn-magenta:hover .hud-btn-label { color: ${VOID}; }
        .hud-btn-cyan .hud-btn-label { color: ${CYAN}; }
        .hud-btn-cyan:hover .hud-btn-label { color: ${VOID}; }
      `}</style>

      <div className="hud-scanlines">
        {/* fixed grid backdrop */}
        <div aria-hidden="true" className="hud-grid-bg pointer-events-none fixed inset-0 -z-10 opacity-60" />
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10"
          style={{
            background: `radial-gradient(ellipse at 20% 0%, ${CYAN}14 0%, transparent 55%), radial-gradient(ellipse at 85% 100%, ${MAGENTA}14 0%, transparent 55%)`,
          }}
        />

        {/* header */}
        <header className="relative z-10 flex items-center justify-between border-b px-5 py-4 sm:px-8" style={{ borderColor: `${CYAN}33` }}>
          <a
            href="#top"
            className="flex items-center gap-2 rounded text-sm font-black uppercase tracking-[0.3em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{ color: CYAN, ["--tw-ring-color" as string]: CYAN, ["--tw-ring-offset-color" as string]: VOID }}
          >
            <span aria-hidden="true" className="inline-block h-2 w-2" style={{ backgroundColor: CYAN, boxShadow: `0 0 8px ${CYAN}` }} />
            RE:PICK
          </a>
          <a
            href="#modules"
            className="hud-btn hud-btn-magenta relative overflow-hidden border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              borderColor: MAGENTA,
              ["--tw-ring-color" as string]: MAGENTA,
              ["--tw-ring-offset-color" as string]: VOID,
            }}
          >
            <span className="hud-btn-fill absolute inset-0 -z-10" style={{ backgroundColor: MAGENTA }} />
            <span className="hud-btn-label relative">SYSTEM_ACCESS &gt;&gt;</span>
          </a>
        </header>

        <main>
          {/* hero */}
          <section id="top" className="relative overflow-hidden px-5 pb-16 pt-14 sm:px-8 sm:pt-20">
            <p className="mb-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.4em]" style={{ color: `${CYAN}bb` }}>
              <span className="hud-blink inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: CYAN }} />
              BOOT_SEQUENCE // FEATURE_OVERVIEW.EXE
            </p>

            <h1
              data-text="FEATURE MATRIX"
              className="hud-glitch text-4xl font-black uppercase leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
              style={{ color: "#eafcff" }}
            >
              FEATURE MATRIX
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-relaxed sm:text-base" style={{ color: "#9be8f0cc" }}>
              4개의 코어 모듈이 당신의 취향을 스캔하고, 매물을 조준하고, 신뢰를 검증하고, 신호를 쏩니다.
              <span style={{ color: CYAN }}> repick</span>은 리커머스를 위한 전투 등급 HUD입니다.
            </p>

            {/* mini readout strip */}
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-px overflow-hidden border" style={{ borderColor: `${CYAN}33`, backgroundColor: `${CYAN}33` }}>
              {[
                { l: "ACTIVE MODULES", v: "04" },
                { l: "MATCH RATE", v: "91.2%" },
                { l: "UPTIME", v: "99.98%" },
              ].map((s) => (
                <div key={s.l} className="px-4 py-3" style={{ backgroundColor: VOID }}>
                  <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: `${CYAN}88` }}>
                    {s.l}
                  </p>
                  <p className="mt-1 text-lg font-black" style={{ color: CYAN }}>
                    {s.v}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* modules grid */}
          <section id="modules" className="relative px-5 pb-20 sm:px-8">
            <div className="mb-8 flex items-center gap-3">
              <span className="h-px flex-1" style={{ backgroundColor: `${CYAN}33` }} />
              <h2 className="text-[11px] uppercase tracking-[0.4em]" style={{ color: `${CYAN}99` }}>
                CORE_MODULES // 04
              </h2>
              <span className="h-px flex-1" style={{ backgroundColor: `${CYAN}33` }} />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {MODULES.map((m) => (
                <article
                  key={m.id}
                  className="hud-panel relative border p-6"
                  style={{
                    borderColor: `${m.accent}55`,
                    backgroundImage: `linear-gradient(160deg, ${m.accent}12 0%, transparent 55%)`,
                  }}
                >
                  <CornerBrackets color={m.accent} />

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em]" style={{ color: `${m.accent}aa` }}>
                        {m.code}
                      </p>
                      <h3 className="mt-2 text-xl font-black sm:text-2xl" style={{ color: "#eafcff" }}>
                        {m.title}
                      </h3>
                    </div>
                    <span
                      className="hud-panel-sm flex h-11 w-11 flex-none items-center justify-center border text-sm font-black"
                      style={{ borderColor: m.accent, color: m.accent }}
                      aria-hidden="true"
                    >
                      {m.id}
                    </span>
                  </div>

                  <p className="mt-4 text-sm font-bold leading-snug" style={{ color: "#dff9ff" }}>
                    {m.headline}
                  </p>
                  <p className="mt-2 text-[13px] leading-relaxed" style={{ color: "#a7d8e0aa" }}>
                    {m.desc}
                  </p>

                  <div className="mt-6 flex items-end justify-between gap-4 border-t pt-5" style={{ borderColor: `${m.accent}2a` }}>
                    <ModuleVisual kind={m.visual} color={m.accent} />
                    <div className="text-right">
                      <p className="text-2xl font-black leading-none" style={{ color: m.accent }}>
                        {m.stat}
                      </p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.2em]" style={{ color: `${m.accent}88` }}>
                        {m.statLabel}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* final CTA */}
          <section className="relative px-5 pb-20 sm:px-8">
            <div
              className="hud-panel relative overflow-hidden border px-6 py-14 text-center sm:px-10"
              style={{
                borderColor: `${MAGENTA}55`,
                backgroundImage: `radial-gradient(ellipse at 50% 0%, ${MAGENTA}1a 0%, transparent 60%)`,
              }}
            >
              <CornerBrackets color={MAGENTA} />
              <p className="text-[11px] uppercase tracking-[0.4em]" style={{ color: `${MAGENTA}aa` }}>
                READY // INITIATE_SEQUENCE
              </p>
              <p className="mx-auto mt-4 max-w-lg text-2xl font-black leading-tight sm:text-3xl" style={{ color: "#eafcff" }}>
                지금 접속해서 4개 모듈을 전부 가동하세요
              </p>
              <p className="mx-auto mt-3 max-w-md text-sm" style={{ color: "#c9a7de99" }}>
                가입은 3초, 첫 매칭 신호는 즉시 도착합니다.
              </p>
              <a
                href="#top"
                className="hud-btn hud-btn-cyan relative mt-8 inline-block overflow-hidden border px-8 py-3 text-sm font-black uppercase tracking-[0.25em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  borderColor: CYAN,
                  ["--tw-ring-color" as string]: CYAN,
                  ["--tw-ring-offset-color" as string]: VOID,
                }}
              >
                <span className="hud-btn-fill absolute inset-0 -z-10" style={{ backgroundColor: CYAN }} />
                <span className="hud-btn-label relative">START_MATCHING()</span>
              </a>
            </div>
          </section>
        </main>

        <footer className="relative z-10 border-t px-5 py-6 text-center text-[10px] uppercase tracking-[0.2em]" style={{ borderColor: `${CYAN}22`, color: `${CYAN}55` }}>
          © 2026 RE:PICK — AI RECOMMERCE HUD SYSTEM // ALL RIGHTS RESERVED
        </footer>
      </div>
    </div>
  );
}
