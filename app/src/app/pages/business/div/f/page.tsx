type Segment = { value: number; color: string; label: string };

function conicGradient(segments: Segment[]): string {
  const total = segments.reduce((sum, seg) => sum + seg.value, 0);
  let acc = 0;
  const stops = segments.map((seg) => {
    const start = (acc / total) * 360;
    acc += seg.value;
    const end = (acc / total) * 360;
    return `${seg.color} ${start}deg ${end}deg`;
  });
  return `conic-gradient(${stops.join(", ")})`;
}

function Donut({
  segments,
  size = 132,
  holeRatio = 0.6,
  centerValue,
  centerLabel,
  holeColor = "#0c131b",
}: {
  segments: Segment[];
  size?: number;
  holeRatio?: number;
  centerValue?: string;
  centerLabel?: string;
  holeColor?: string;
}) {
  const holeInset = (size * (1 - holeRatio)) / 2;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: conicGradient(segments) }}
        aria-hidden="true"
      />
      <div
        className="absolute flex flex-col items-center justify-center rounded-full text-center"
        style={{ inset: holeInset, background: holeColor }}
      >
        {centerValue ? (
          <span className="font-mono text-xl font-bold text-white">{centerValue}</span>
        ) : null}
        {centerLabel ? (
          <span className="mt-0.5 px-2 text-[10px] leading-tight text-white/50">
            {centerLabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values);
  return (
    <div className="flex h-9 items-end gap-[3px]" aria-hidden="true">
      {values.map((v, i) => (
        <div
          key={i}
          className="w-1.5 rounded-t-sm"
          style={{ height: `${Math.max((v / max) * 100, 8)}%`, backgroundColor: color }}
        />
      ))}
    </div>
  );
}

type CompareRow = {
  label: string;
  unit: string;
  max: number;
  general: number;
  repick: number;
};

function BarCompareRow({ row }: { row: CompareRow }) {
  const generalPct = Math.min((row.general / row.max) * 100, 100);
  const repickPct = Math.min((row.repick / row.max) * 100, 100);
  return (
    <div className="border-b border-white/10 py-5 last:border-b-0">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-white">{row.label}</h3>
        <span className="font-mono text-xs text-white/40">
          x{(row.repick / row.general >= 1
            ? (row.repick / row.general).toFixed(1)
            : (row.general / row.repick).toFixed(1))}
        </span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="w-16 shrink-0 text-[11px] text-white/40">일반 판매</span>
          <div className="h-3 flex-1 rounded-full bg-white/[0.06]">
            <div
              className="h-3 rounded-full bg-slate-500"
              style={{ width: `${generalPct}%` }}
            />
          </div>
          <span className="w-14 shrink-0 text-right font-mono text-xs text-white/60">
            {row.general}
            {row.unit}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-16 shrink-0 text-[11px] font-medium text-cyan-300">repick</span>
          <div className="h-3 flex-1 rounded-full bg-white/[0.06]">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-300"
              style={{ width: `${repickPct}%` }}
            />
          </div>
          <span className="w-14 shrink-0 text-right font-mono text-xs font-bold text-cyan-300">
            {row.repick}
            {row.unit}
          </span>
        </div>
      </div>
    </div>
  );
}

function FlowStep({
  index,
  title,
  desc,
  stat,
  color,
  last,
}: {
  index: string;
  title: string;
  desc: string;
  stat: string;
  color: string;
  last?: boolean;
}) {
  return (
    <div className="relative flex flex-1 flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-md font-mono text-xs font-bold text-[#0b0f14]"
          style={{ backgroundColor: color }}
        >
          {index}
        </span>
        <span className="font-mono text-sm font-bold" style={{ color }}>
          {stat}
        </span>
      </div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="text-xs leading-relaxed text-white/50">{desc}</p>
      {!last ? (
        <span
          className="pointer-events-none absolute top-1/2 -right-4 hidden -translate-y-1/2 font-mono text-lg text-white/20 md:block"
          aria-hidden="true"
        >
          →
        </span>
      ) : null}
    </div>
  );
}

const kpis = [
  { label: "재고 회전율", value: "+38%", sub: "도입 후 3개월 평균", color: "#22d3ee", spark: [30, 42, 38, 55, 61, 74, 82] },
  { label: "평균 판매 기간", value: "6.4일", sub: "12.1일 → 6.4일", color: "#fbbf24", spark: [82, 74, 68, 55, 47, 38, 30] },
  { label: "반품율", value: "-61%", sub: "품질 검증 자동화 효과", color: "#34d399", spark: [70, 62, 58, 44, 36, 24, 18] },
  { label: "셀러 순이익", value: "+24%", sub: "수수료·인건비 절감분 포함", color: "#e879f9", spark: [24, 30, 33, 41, 52, 60, 71] },
];

const compareRows: CompareRow[] = [
  { label: "재고 소진 기간", unit: "일", max: 45, general: 45, repick: 18 },
  { label: "매칭 성사율", unit: "%", max: 100, general: 34, repick: 82 },
  { label: "평균 마진율", unit: "%", max: 30, general: 12, repick: 27 },
  { label: "반품 처리 시간", unit: "일", max: 6, general: 5.2, repick: 1.1 },
];

const categorySegments: Segment[] = [
  { value: 42, color: "#22d3ee", label: "의류" },
  { value: 27, color: "#fbbf24", label: "잡화" },
  { value: 18, color: "#e879f9", label: "가전" },
  { value: 13, color: "#34d399", label: "기타" },
];

const miniDonuts = [
  { value: 82, label: "AI 매칭 성사율", color: "#22d3ee" },
  { value: 68, label: "재구매율", color: "#fbbf24" },
  { value: 94, label: "셀러 만족도", color: "#34d399" },
];

const months = ["도입", "M1", "M2", "M3", "M4", "M5"];
const repickPoints = "10,88 66,72 122,63 178,47 234,31 290,16";
const baselinePoints = "10,88 66,85 122,82 178,79 234,76 290,72";
const repickAreaPoints = "10,88 66,72 122,63 178,47 234,31 290,16 290,110 10,110";

const flowSteps = [
  { index: "01", title: "재고 등록", desc: "사진·상태·희망가를 업로드하면 즉시 분석 큐에 등록됩니다.", stat: "3분", color: "#22d3ee" },
  { index: "02", title: "AI 분석", desc: "상태·시세·수요 데이터를 교차 스캔해 적정가를 산출합니다.", stat: "2.3초", color: "#fbbf24" },
  { index: "03", title: "자동 매칭", desc: "수요 프로필과 실시간 매칭, 최적 구매자에게 우선 노출됩니다.", stat: "평균 1.8일", color: "#e879f9" },
  { index: "04", title: "판매·정산", desc: "결제부터 정산까지 자동화, 대시보드에서 바로 확인합니다.", stat: "T+2 정산", color: "#34d399" },
];

const logos = ["VINTAGE HAUS", "리클로젯", "무브온 셀렉트", "세컨라이프", "리커머스랩", "오늘의 순환"];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#080b10] font-sans text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#080b10]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-bold tracking-tight text-white">repick</span>
            <span className="rounded border border-cyan-400/40 bg-cyan-400/10 px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-widest text-cyan-300">
              BUSINESS
            </span>
          </div>
          <nav className="hidden items-center gap-8 text-sm text-white/60 md:flex" aria-label="주요 메뉴">
            <a href="#metrics" className="rounded-sm hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400">
              성과 지표
            </a>
            <a href="#flow" className="rounded-sm hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400">
              매칭 프로세스
            </a>
            <a href="#partners" className="rounded-sm hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400">
              파트너사
            </a>
          </nav>
          <a
            href="#demo"
            className="rounded-md bg-cyan-400 px-4 py-2 font-mono text-xs font-bold text-[#080b10] transition-colors hover:bg-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
          >
            데모 요청
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10 px-6 py-16 md:py-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 md:grid-cols-2">
          <div>
            <p className="mb-4 font-mono text-xs font-bold tracking-[0.2em] text-cyan-300">
              REPICK FOR BUSINESS · 데이터로 증명하는 재고 순환
            </p>
            <h1 className="text-4xl leading-[1.1] font-bold tracking-tight text-white md:text-6xl">
              안 팔리는 재고,
              <br />
              <span className="text-cyan-300">숫자가</span> 답을 압니다
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/55">
              repick의 AI 매칭 엔진은 셀러의 유휴 재고를 실시간 수요와 연결합니다. 재고 회전율,
              매칭 성사율, 반품율까지 모든 지표를 대시보드 하나로 증명합니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#demo"
                className="rounded-md bg-cyan-400 px-6 py-3 text-sm font-bold text-[#080b10] transition-colors hover:bg-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
              >
                무료 데모 신청
              </a>
              <a
                href="#metrics"
                className="rounded-md border border-white/20 px-6 py-3 text-sm font-medium text-white/80 transition-colors hover:border-white/40 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
              >
                성과 리포트 보기
              </a>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-6">
              <div>
                <dt className="text-[11px] text-white/40">재고소진 기간</dt>
                <dd className="font-mono text-xl font-bold text-cyan-300">-60%</dd>
              </div>
              <div>
                <dt className="text-[11px] text-white/40">매칭 성사율</dt>
                <dd className="font-mono text-xl font-bold text-amber-300">82%</dd>
              </div>
              <div>
                <dt className="text-[11px] text-white/40">파트너 셀러</dt>
                <dd className="font-mono text-xl font-bold text-fuchsia-300">800+</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_60px_-15px_rgba(34,211,238,0.25)]">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-xs font-medium text-white/50">실시간 매칭 현황</span>
              <span className="flex items-center gap-1.5 text-[11px] text-emerald-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                LIVE
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Donut
                segments={[
                  { value: 82, color: "#22d3ee", label: "성사" },
                  { value: 18, color: "rgba(255,255,255,0.08)", label: "대기" },
                ]}
                centerValue="82%"
                centerLabel="매칭 성사율"
                size={140}
              />
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-white/60">
                    <span className="h-2 w-2 rounded-full bg-cyan-400" /> 매칭 완료
                  </span>
                  <span className="font-mono font-bold text-white">1,842건</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-white/60">
                    <span className="h-2 w-2 rounded-full bg-white/20" /> 매칭 대기
                  </span>
                  <span className="font-mono font-bold text-white">404건</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-white/60">
                    <span className="h-2 w-2 rounded-full bg-amber-300" /> 평균 처리
                  </span>
                  <span className="font-mono font-bold text-white">1.8일</span>
                </div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-5">
              {kpis.slice(0, 3).map((k) => (
                <div key={k.label} className="rounded-lg bg-white/[0.03] p-3">
                  <p className="truncate text-[10px] text-white/40">{k.label}</p>
                  <p className="mt-1 font-mono text-sm font-bold" style={{ color: k.color }}>
                    {k.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* KPI strip */}
      <section id="metrics" className="border-b border-white/10 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-lg">
            <p className="mb-2 font-mono text-xs font-bold tracking-[0.2em] text-white/40">
              PROVEN BY DATA
            </p>
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              도입 3개월, 숫자로 확인하세요
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {kpis.map((k) => (
              <div
                key={k.label}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
              >
                <p className="text-xs text-white/45">{k.label}</p>
                <p className="mt-2 font-mono text-3xl font-bold" style={{ color: k.color }}>
                  {k.value}
                </p>
                <p className="mt-1 text-[11px] text-white/35">{k.sub}</p>
                <div className="mt-4">
                  <Sparkline values={k.spark} color={k.color} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bar comparison */}
      <section className="border-b border-white/10 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 max-w-lg">
            <p className="mb-2 font-mono text-xs font-bold tracking-[0.2em] text-white/40">
              HEAD TO HEAD
            </p>
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              일반 판매 대비 압도적 차이
            </h2>
            <p className="mt-2 text-sm text-white/50">
              동일 재고를 기준으로 일반 판매 채널과 repick 매칭을 비교했습니다.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] px-6">
            {compareRows.map((row) => (
              <BarCompareRow key={row.label} row={row} />
            ))}
          </div>
        </div>
      </section>

      {/* Donuts + line chart */}
      <section className="border-b border-white/10 px-6 py-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-lg font-bold text-white">카테고리별 재고 회전 기여도</h2>
            <p className="mt-1 text-xs text-white/45">최근 90일 매칭 완료 건 기준</p>
            <div className="mt-6 flex flex-wrap items-center gap-8">
              <Donut
                segments={categorySegments}
                size={150}
                centerValue="4,120"
                centerLabel="총 매칭 건"
                holeColor="#0e1420"
              />
              <ul className="flex-1 space-y-2.5">
                {categorySegments.map((s) => (
                  <li key={s.label} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-white/65">
                      <span
                        className="h-2.5 w-2.5 rounded-sm"
                        style={{ backgroundColor: s.color }}
                      />
                      {s.label}
                    </span>
                    <span className="font-mono font-bold text-white">{s.value}%</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
              {miniDonuts.map((m) => (
                <div key={m.label} className="flex flex-col items-center gap-2">
                  <Donut
                    segments={[
                      { value: m.value, color: m.color, label: m.label },
                      { value: 100 - m.value, color: "rgba(255,255,255,0.08)", label: "" },
                    ]}
                    size={76}
                    holeRatio={0.62}
                    centerValue={`${m.value}%`}
                    holeColor="#0e1420"
                  />
                  <span className="text-center text-[10px] leading-tight text-white/45">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-lg font-bold text-white">6개월 매출 성장 추이</h2>
            <p className="mt-1 text-xs text-white/45">repick 도입 셀러 vs 미도입 셀러 평균</p>
            <div className="mt-6 flex items-center gap-5 text-xs">
              <span className="flex items-center gap-2 text-white/60">
                <span className="h-0.5 w-4 bg-cyan-400" /> 도입 셀러
              </span>
              <span className="flex items-center gap-2 text-white/40">
                <span className="h-0.5 w-4 bg-white/25" /> 미도입 평균
              </span>
            </div>
            <svg
              viewBox="0 0 300 120"
              className="mt-4 h-48 w-full"
              role="img"
              aria-label="repick 도입 셀러의 6개월 매출 성장 추이가 미도입 셀러 대비 뚜렷하게 높음을 보여주는 선 그래프"
            >
              <defs>
                <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[30, 50, 70, 90, 110].map((y) => (
                <line key={y} x1="10" y1={y} x2="290" y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              ))}
              <polygon points={repickAreaPoints} fill="url(#areaFill)" />
              <polyline
                points={baselinePoints}
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2"
                strokeDasharray="4 3"
              />
              <polyline points={repickPoints} fill="none" stroke="#22d3ee" strokeWidth="2.5" />
              {repickPoints.split(" ").map((p) => {
                const [x, y] = p.split(",");
                return <circle key={p} cx={x} cy={y} r="3.5" fill="#22d3ee" />;
              })}
            </svg>
            <div className="mt-1 flex justify-between font-mono text-[10px] text-white/35">
              {months.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
              <div>
                <p className="text-[11px] text-white/40">도입 셀러 매출 성장</p>
                <p className="font-mono text-2xl font-bold text-cyan-300">+327%</p>
              </div>
              <div>
                <p className="text-[11px] text-white/40">미도입 대비 격차</p>
                <p className="font-mono text-2xl font-bold text-white">4.2x</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flow */}
      <section id="flow" className="border-b border-white/10 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-lg">
            <p className="mb-2 font-mono text-xs font-bold tracking-[0.2em] text-white/40">
              END TO END
            </p>
            <h2 className="text-2xl font-bold text-white md:text-3xl">AI 매칭 프로세스</h2>
            <p className="mt-2 text-sm text-white/50">
              등록부터 정산까지, 셀러가 손댈 일은 사진 업로드 하나뿐입니다.
            </p>
          </div>
          <div className="flex flex-col gap-6 md:flex-row">
            {flowSteps.map((s, i) => (
              <FlowStep key={s.index} {...s} last={i === flowSteps.length - 1} />
            ))}
          </div>
        </div>
      </section>

      {/* Partner logos */}
      <section id="partners" className="border-b border-white/10 px-6 py-14">
        <div className="mx-auto max-w-6xl text-center">
          <p className="mb-8 text-xs font-medium tracking-wide text-white/40">
            이미 800+ 셀러 브랜드가 repick과 함께 재고를 순환시키고 있습니다
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {logos.map((logo) => (
              <span
                key={logo}
                className="rounded-md border border-white/10 px-4 py-2 font-mono text-xs tracking-wide text-white/35"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA / demo form */}
      <section id="demo" className="px-6 py-20">
        <div className="mx-auto grid max-w-5xl gap-10 rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-white/[0.03] to-fuchsia-500/10 p-8 md:grid-cols-2 md:p-12">
          <div>
            <p className="mb-3 font-mono text-xs font-bold tracking-[0.2em] text-cyan-300">
              START NOW
            </p>
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              지금 시작하면
              <br />첫 달 매칭 수수료 <span className="text-cyan-300">0원</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/55">
              14일 안에 재고 회전율 변화를 데이터로 확인하지 못하면 전액 환불해 드립니다. 데모 신청
              후 담당 매니저가 24시간 내 연락드립니다.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-white/10 p-3">
                <dt className="text-[11px] text-white/40">평균 온보딩</dt>
                <dd className="font-mono text-lg font-bold text-white">3일</dd>
              </div>
              <div className="rounded-lg border border-white/10 p-3">
                <dt className="text-[11px] text-white/40">계약 만족도</dt>
                <dd className="font-mono text-lg font-bold text-white">4.8/5</dd>
              </div>
            </dl>
          </div>
          <form className="flex flex-col gap-4 rounded-xl bg-[#0b0f14] p-6">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="company" className="text-xs font-medium text-white/60">
                회사명
              </label>
              <input
                id="company"
                name="company"
                type="text"
                placeholder="repick 주식회사"
                className="rounded-md border border-white/15 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-medium text-white/60">
                담당자 이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="manager@company.com"
                className="rounded-md border border-white/15 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="volume" className="text-xs font-medium text-white/60">
                월 평균 재고 규모
              </label>
              <select
                id="volume"
                name="volume"
                className="rounded-md border border-white/15 bg-white/[0.03] px-3 py-2.5 text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                defaultValue=""
              >
                <option value="" disabled>
                  선택해 주세요
                </option>
                <option value="s">100건 미만</option>
                <option value="m">100 ~ 1,000건</option>
                <option value="l">1,000건 이상</option>
              </select>
            </div>
            <button
              type="submit"
              className="mt-2 rounded-md bg-cyan-400 px-5 py-3 text-sm font-bold text-[#080b10] transition-colors hover:bg-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
            >
              데모 요청하기
            </button>
          </form>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-xs text-white/35 md:flex-row">
          <span className="font-mono">repick BUSINESS</span>
          <span>© 2026 repick. 데이터로 순환을 증명합니다.</span>
        </div>
      </footer>
    </div>
  );
}
