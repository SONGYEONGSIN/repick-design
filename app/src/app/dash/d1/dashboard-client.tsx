"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowUp,
  ArrowUpDown,
  ArrowUpRight,
  Bell,
  BellOff,
  Building2,
  Check,
  CircleDollarSign,
  Coins,
  Info,
  Landmark,
  LayoutDashboard,
  Layers,
  ListOrdered,
  Menu,
  Power,
  Radar as RadarIcon,
  Search,
  Settings,
  TriangleAlert,
  X,
} from "lucide-react";

/* ----------------------------------------------------------------------- *
 * 유틸리티
 * ----------------------------------------------------------------------- */

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

const krw = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "KRW",
  maximumFractionDigits: 0,
});

const krwCompact = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "KRW",
  notation: "compact",
  maximumFractionDigits: 1,
});

const pctFormatter = new Intl.NumberFormat("ko-KR", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  signDisplay: "exceptZero",
});

function formatPct(value: number): string {
  return pctFormatter.format(value / 100);
}

const SNAPSHOT_DATE = new Date("2026-07-10T09:41:00+09:00");
const SNAPSHOT_LABEL = new Intl.DateTimeFormat("ko-KR", {
  dateStyle: "medium",
  timeStyle: "short",
}).format(SNAPSHOT_DATE);

/**
 * 결정론적 시계열 생성기 — Math.random/Date.now를 쓰지 않아
 * 서버·클라이언트 렌더 결과가 항상 동일하다(hydration mismatch 방지).
 */
function buildCurve(n: number, end: number, seed: number): number[] {
  const points: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const trend = end * t;
    const amp = Math.max(Math.abs(end) * 0.35, 1.2);
    const noise =
      Math.sin(i * 1.7 + seed) * amp * (1 - t * 0.4) +
      Math.cos(i * 0.9 + seed * 2.1) * amp * 0.4;
    points.push(trend + noise);
  }
  points[0] = Math.cos(seed) * 0.6;
  points[n - 1] = end;
  return points;
}

function toChartGeometry(values: number[], width: number, height: number, padY = 12) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const stepX = width / (values.length - 1);
  const coords = values.map((v, i) => {
    const x = i * stepX;
    const y = height - padY - ((v - min) / span) * (height - padY * 2);
    return [x, y] as const;
  });
  const linePath = coords
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");
  const areaPath = `${linePath} L${coords[coords.length - 1][0].toFixed(2)},${height} L0,${height} Z`;
  return { coords, linePath, areaPath, min, max };
}

/* ----------------------------------------------------------------------- *
 * 데이터 모델 (정적 스냅샷 — 가짜 실시간 조작 없음)
 * ----------------------------------------------------------------------- */

type AssetClass = "국내주식" | "해외주식" | "암호자산" | "현금성" | "대체투자";

const ASSET_CLASS_ORDER: AssetClass[] = [
  "국내주식",
  "해외주식",
  "암호자산",
  "현금성",
  "대체투자",
];

const ASSET_CLASS_STYLE: Record<
  AssetClass,
  { dot: string; text: string; fill: string; icon: typeof Landmark }
> = {
  국내주식: { dot: "bg-amber-400", text: "text-amber-400", fill: "fill-amber-400", icon: Landmark },
  해외주식: { dot: "bg-sky-400", text: "text-sky-400", fill: "fill-sky-400", icon: Building2 },
  암호자산: { dot: "bg-violet-400", text: "text-violet-400", fill: "fill-violet-400", icon: Coins },
  현금성: { dot: "bg-emerald-400", text: "text-emerald-400", fill: "fill-emerald-400", icon: CircleDollarSign },
  대체투자: { dot: "bg-orange-400", text: "text-orange-400", fill: "fill-orange-400", icon: Layers },
};

interface Position {
  id: string;
  name: string;
  ticker: string;
  assetClass: AssetClass;
  qtyLabel: string;
  avgPrice: number | null;
  price: number | null;
  value: number;
  pnlPct: number | null;
  pnlAmt: number | null;
}

const POSITIONS: Position[] = [
  {
    id: "005930",
    name: "삼성전자",
    ticker: "005930",
    assetClass: "국내주식",
    qtyLabel: "850주",
    avgPrice: 68_200,
    price: 71_900,
    value: 61_115_000,
    pnlPct: 5.4,
    pnlAmt: 3_145_000,
  },
  {
    id: "000660",
    name: "SK하이닉스",
    ticker: "000660",
    assetClass: "국내주식",
    qtyLabel: "320주",
    avgPrice: 178_500,
    price: 192_300,
    value: 61_536_000,
    pnlPct: 7.7,
    pnlAmt: 4_417_600,
  },
  {
    id: "035720",
    name: "카카오",
    ticker: "035720",
    assetClass: "국내주식",
    qtyLabel: "610주",
    avgPrice: 41_200,
    price: 38_150,
    value: 23_271_500,
    pnlPct: -7.4,
    pnlAmt: -1_860_500,
  },
  {
    id: "NVDA",
    name: "NVIDIA",
    ticker: "NVDA",
    assetClass: "해외주식",
    qtyLabel: "45주",
    avgPrice: 812_400,
    price: 1_041_600,
    value: 46_872_000,
    pnlPct: 28.2,
    pnlAmt: 10_314_000,
  },
  {
    id: "AAPL",
    name: "Apple",
    ticker: "AAPL",
    assetClass: "해외주식",
    qtyLabel: "120주",
    avgPrice: 231_800,
    price: 248_900,
    value: 29_868_000,
    pnlPct: 7.4,
    pnlAmt: 2_052_000,
  },
  {
    id: "BTC",
    name: "비트코인",
    ticker: "BTC",
    assetClass: "암호자산",
    qtyLabel: "1.84개",
    avgPrice: 58_200_000,
    price: 92_400_000,
    value: 170_016_000,
    pnlPct: 58.8,
    pnlAmt: 62_928_000,
  },
  {
    id: "ETH",
    name: "이더리움",
    ticker: "ETH",
    assetClass: "암호자산",
    qtyLabel: "22.4개",
    avgPrice: 3_120_000,
    price: 4_380_000,
    value: 98_112_000,
    pnlPct: 40.4,
    pnlAmt: 28_224_000,
  },
  {
    id: "MMF",
    name: "MMF·파킹형 예금",
    ticker: "CASH",
    assetClass: "현금성",
    qtyLabel: "—",
    avgPrice: null,
    price: null,
    value: 89_450_000,
    pnlPct: null,
    pnlAmt: null,
  },
  {
    id: "REIT",
    name: "강남 오피스텔 리츠",
    ticker: "REIT",
    assetClass: "대체투자",
    qtyLabel: "지분 4.2%",
    avgPrice: null,
    price: null,
    value: 142_300_000,
    pnlPct: 3.1,
    pnlAmt: 4_281_300,
  },
];

type PositionWithWeight = Position & { weight: number };

const TOTAL_NAV = POSITIONS.reduce((sum, p) => sum + p.value, 0);
const DAY_CHANGE_AMT = 10_330_000;
const DAY_CHANGE_PCT = (DAY_CHANGE_AMT / TOTAL_NAV) * 100;

const ASSET_CLASS_EXPOSURE: { assetClass: AssetClass; value: number; weight: number }[] =
  ASSET_CLASS_ORDER.map((assetClass) => {
    const value = POSITIONS.filter((p) => p.assetClass === assetClass).reduce(
      (sum, p) => sum + p.value,
      0,
    );
    return { assetClass, value, weight: (value / TOTAL_NAV) * 100 };
  });

const RADAR_MAX = 40;

type RangeKey = "1D" | "1W" | "1M" | "1Y";
const RANGE_LABELS: Record<RangeKey, string> = {
  "1D": "1일",
  "1W": "1주",
  "1M": "1개월",
  "1Y": "1년",
};
const CURVES: Record<RangeKey, number[]> = {
  "1D": buildCurve(24, DAY_CHANGE_PCT, 3),
  "1W": buildCurve(7, 3.2, 7),
  "1M": buildCurve(30, 8.7, 11),
  "1Y": buildCurve(12, 24.6, 17),
};

const CORRELATION_MATRIX: number[][] = [
  [1.0, 0.62, 0.34, -0.18, 0.21],
  [0.62, 1.0, 0.48, -0.22, 0.15],
  [0.34, 0.48, 1.0, -0.41, 0.09],
  [-0.18, -0.22, -0.41, 1.0, 0.12],
  [0.21, 0.15, 0.09, 0.12, 1.0],
];

interface TickerItem {
  symbol: string;
  value: string;
  change: number;
}
const TICKER_ITEMS: TickerItem[] = [
  { symbol: "KOSPI", value: "2,614.32", change: 0.84 },
  { symbol: "KOSDAQ", value: "812.45", change: -0.32 },
  { symbol: "USD/KRW", value: "1,342.50", change: 0.15 },
  { symbol: "BTC/KRW", value: "92,400,000", change: 3.21 },
  { symbol: "ETH/KRW", value: "4,380,000", change: 2.14 },
  { symbol: "S&P500", value: "5,842.10", change: 0.42 },
  { symbol: "국고채10년", value: "3.28%", change: -0.02 },
  { symbol: "WTI", value: "78.42", change: 1.08 },
];

type Severity = "critical" | "warning" | "info";
interface AlertItem {
  id: string;
  severity: Severity;
  message: string;
  time: string;
}
const INITIAL_ALERTS: AlertItem[] = [
  {
    id: "a1",
    severity: "critical",
    message: "암호자산 비중 37.2%로 리스크 한도(35%) 초과",
    time: "3분 전",
  },
  {
    id: "a2",
    severity: "warning",
    message: "BTC 24시간 변동성 +12.4%p 급등 감지",
    time: "18분 전",
  },
  {
    id: "a3",
    severity: "warning",
    message: "국내주식 집중도 상승 — 3개 종목이 비중 20.1% 차지",
    time: "41분 전",
  },
  { id: "a4", severity: "info", message: "SK하이닉스 실적 발표 D-2", time: "1시간 전" },
  {
    id: "a5",
    severity: "info",
    message: "배당금 입금 완료 — 삼성전자 1,062,500원",
    time: "2시간 전",
  },
  { id: "a6", severity: "info", message: "월간 리밸런싱 리포트 준비 완료", time: "5시간 전" },
];

const SEVERITY_STYLE: Record<
  Severity,
  { label: string; text: string; border: string; bg: string; icon: typeof TriangleAlert }
> = {
  critical: {
    label: "긴급",
    text: "text-rose-400",
    border: "border-rose-400/30",
    bg: "bg-rose-400/10",
    icon: TriangleAlert,
  },
  warning: {
    label: "주의",
    text: "text-amber-400",
    border: "border-amber-400/30",
    bg: "bg-amber-400/10",
    icon: TriangleAlert,
  },
  info: {
    label: "정보",
    text: "text-sky-400",
    border: "border-sky-400/30",
    bg: "bg-sky-400/10",
    icon: Info,
  },
};

type SortKey = "value" | "pnlPct" | "weight";
const SORT_LABEL: Record<SortKey, string> = {
  value: "평가금액",
  pnlPct: "손익률",
  weight: "비중",
};

function heatClass(v: number): string {
  if (v >= 0.5) return "bg-rose-500 text-zinc-950";
  if (v >= 0.25) return "bg-rose-500/55 text-zinc-50";
  if (v >= 0.05) return "bg-rose-500/20 text-rose-200";
  if (v > -0.05) return "bg-zinc-800/80 text-zinc-300";
  if (v > -0.25) return "bg-emerald-500/20 text-emerald-200";
  if (v > -0.5) return "bg-emerald-500/55 text-zinc-50";
  return "bg-emerald-500 text-zinc-950";
}

const NAV_ITEMS: { id: string; label: string; icon: typeof LayoutDashboard; href?: string }[] = [
  { id: "overview", label: "개요", icon: LayoutDashboard, href: "#overview" },
  { id: "positions", label: "포지션", icon: Layers, href: "#positions" },
  { id: "risk", label: "리스크 레이더", icon: RadarIcon, href: "#risk" },
  { id: "signals", label: "신호", icon: Bell, href: "#signals" },
  { id: "reports", label: "리포트", icon: ListOrdered },
  { id: "settings", label: "설정", icon: Settings },
];

/* ----------------------------------------------------------------------- *
 * 하위 컴포넌트
 * ----------------------------------------------------------------------- */

function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const { linePath, areaPath } = toChartGeometry(data, 64, 22, 3);
  const changeLabel = positive ? "상승" : "하락";
  return (
    <svg
      viewBox="0 0 64 22"
      className="h-6 w-16 shrink-0"
      role="img"
      aria-label={`최근 추이 ${changeLabel}`}
    >
      <path d={areaPath} className={positive ? "fill-emerald-400/15" : "fill-rose-400/15"} />
      <path
        d={linePath}
        fill="none"
        className={positive ? "stroke-emerald-400" : "stroke-rose-400"}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeroChart({ range, values }: { range: RangeKey; values: number[] }) {
  const width = 640;
  const height = 220;
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const { coords, linePath, areaPath, min, max } = useMemo(
    () => toChartGeometry(values, width, height),
    [values],
  );

  const end = values[values.length - 1];
  const positive = end >= 0;

  function updateFromClientX(clientX: number) {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    const idx = Math.round(ratio * (values.length - 1));
    setHoverIndex(idx);
  }

  const hovered = hoverIndex !== null ? coords[hoverIndex] : null;
  const hoveredValue = hoverIndex !== null ? values[hoverIndex] : null;

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="h-56 w-full touch-none"
        preserveAspectRatio="none"
        aria-hidden="true"
        onMouseMove={(e) => updateFromClientX(e.clientX)}
        onMouseLeave={() => setHoverIndex(null)}
        onTouchMove={(e) => e.touches[0] && updateFromClientX(e.touches[0].clientX)}
        onTouchEnd={() => setHoverIndex(null)}
      >
        {[0.2, 0.4, 0.6, 0.8].map((f) => (
          <line
            key={f}
            x1={0}
            x2={width}
            y1={height * f}
            y2={height * f}
            className="stroke-zinc-800/70"
            strokeWidth={1}
          />
        ))}
        <path d={areaPath} className={positive ? "fill-emerald-400/10" : "fill-rose-400/10"} />
        <path
          d={linePath}
          fill="none"
          className={positive ? "stroke-emerald-400" : "stroke-rose-400"}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {hovered && (
          <g>
            <line
              x1={hovered[0]}
              x2={hovered[0]}
              y1={0}
              y2={height}
              className="stroke-zinc-600"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            <circle
              cx={hovered[0]}
              cy={hovered[1]}
              r={4}
              className={positive ? "fill-emerald-300" : "fill-rose-300"}
            />
          </g>
        )}
      </svg>

      {hovered && hoveredValue !== null && (
        <div
          className="pointer-events-none absolute top-2 -translate-x-1/2 rounded-md border border-zinc-700 bg-zinc-900/95 px-2.5 py-1.5 text-xs font-mono text-zinc-100 shadow-lg shadow-black/40"
          style={{ left: `${(hovered[0] / width) * 100}%` }}
        >
          {formatPct(hoveredValue)}
        </div>
      )}

      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-400">
        <span>
          {RANGE_LABELS[range]} 수익률{" "}
          <strong className={cx("font-mono font-semibold", positive ? "text-emerald-400" : "text-rose-400")}>
            {formatPct(end)}
          </strong>
        </span>
        <span>
          최고 <strong className="font-mono text-zinc-200">{formatPct(max)}</strong>
        </span>
        <span>
          최저 <strong className="font-mono text-zinc-200">{formatPct(min)}</strong>
        </span>
      </p>
    </div>
  );
}

function RadarChart({
  data,
  activeClass,
}: {
  data: { assetClass: AssetClass; weight: number }[];
  activeClass: AssetClass | "all";
}) {
  const size = 260;
  const center = size / 2;
  const maxR = 96;
  const n = data.length;

  const axisPoint = (i: number, r: number) => {
    const angle = -Math.PI / 2 + i * ((2 * Math.PI) / n);
    return [center + r * Math.cos(angle), center + r * Math.sin(angle)] as const;
  };

  const polygonPoints = data
    .map((d, i) => axisPoint(i, (Math.min(d.weight, RADAR_MAX) / RADAR_MAX) * maxR))
    .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");

  const summary = data
    .map((d) => `${d.assetClass} ${d.weight.toFixed(1)}%`)
    .join(", ");

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="mx-auto h-64 w-64"
      role="img"
      aria-label={`자산군별 비중 — ${summary}`}
    >
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <circle
          key={f}
          cx={center}
          cy={center}
          r={maxR * f}
          fill="none"
          className="stroke-zinc-800"
          strokeWidth={1}
        />
      ))}
      {data.map((_, i) => {
        const [x, y] = axisPoint(i, maxR);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={x}
            y2={y}
            className="stroke-zinc-800"
            strokeWidth={1}
          />
        );
      })}
      <polygon
        points={polygonPoints}
        className="fill-sky-400/15 stroke-sky-400"
        strokeWidth={1.75}
        strokeLinejoin="round"
      />
      {data.map((d, i) => {
        const r = (Math.min(d.weight, RADAR_MAX) / RADAR_MAX) * maxR;
        const [x, y] = axisPoint(i, r);
        const isActive = activeClass === "all" || activeClass === d.assetClass;
        return (
          <circle
            key={d.assetClass}
            cx={x}
            cy={y}
            r={isActive ? 4.5 : 3}
            className={cx(ASSET_CLASS_STYLE[d.assetClass].fill, !isActive && "opacity-30")}
          />
        );
      })}
      {data.map((d, i) => {
        const [x, y] = axisPoint(i, maxR + 20);
        return (
          <text
            key={d.assetClass}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-zinc-500 text-[9px] font-medium"
          >
            {d.assetClass}
          </text>
        );
      })}
    </svg>
  );
}

function AllocationBar({ data }: { data: { assetClass: AssetClass; weight: number }[] }) {
  return (
    <div className="space-y-2">
      <div
        className="flex h-3 w-full overflow-hidden rounded-full bg-zinc-800"
        role="img"
        aria-label={`자산 배분 — ${data.map((d) => `${d.assetClass} ${d.weight.toFixed(1)}%`).join(", ")}`}
      >
        {data.map((d) => (
          <div
            key={d.assetClass}
            className={cx(ASSET_CLASS_STYLE[d.assetClass].dot, "h-full first:rounded-l-full last:rounded-r-full")}
            style={{ width: `${d.weight}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function CorrelationHeatmap() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] border-separate border-spacing-1 text-center text-xs">
        <caption className="sr-only">자산군 간 상관계수 매트릭스, -1에서 1 사이 값</caption>
        <thead>
          <tr>
            <th scope="col" className="w-20" />
            {ASSET_CLASS_ORDER.map((c) => (
              <th key={c} scope="col" className="pb-1 font-medium text-zinc-400">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ASSET_CLASS_ORDER.map((rowClass, r) => (
            <tr key={rowClass}>
              <th scope="row" className="pr-2 text-right font-medium text-zinc-400">
                {rowClass}
              </th>
              {ASSET_CLASS_ORDER.map((_, c) => {
                const v = CORRELATION_MATRIX[r][c];
                return (
                  <td key={c} className="p-0">
                    <div
                      className={cx(
                        "flex h-10 w-full items-center justify-center rounded-md font-mono text-[11px] font-semibold tabular-nums",
                        heatClass(v),
                      )}
                    >
                      {v.toFixed(2)}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ----------------------------------------------------------------------- *
 * 메인 컴포넌트
 * ----------------------------------------------------------------------- */

export default function DashboardClient() {
  const [navOpen, setNavOpen] = useState(false);
  const [range, setRange] = useState<RangeKey>("1D");
  const [activeClass, setActiveClass] = useState<AssetClass | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("value");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [riskOff, setRiskOff] = useState(false);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [liveMessage, setLiveMessage] = useState("");
  const navToggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!navOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setNavOpen(false);
        navToggleRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [navOpen]);

  const visiblePositions: PositionWithWeight[] = useMemo(() => {
    const filtered =
      activeClass === "all" ? POSITIONS : POSITIONS.filter((p) => p.assetClass === activeClass);
    const withWeight: PositionWithWeight[] = filtered.map((p) => ({
      ...p,
      weight: (p.value / TOTAL_NAV) * 100,
    }));
    const sorted = [...withWeight].sort((a, b) => {
      const av = sortKey === "pnlPct" ? a.pnlPct ?? -Infinity : a[sortKey];
      const bv = sortKey === "pnlPct" ? b.pnlPct ?? -Infinity : b[sortKey];
      return sortDir === "asc" ? av - bv : bv - av;
    });
    return sorted;
  }, [activeClass, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setLiveMessage(`${SORT_LABEL[key]} 기준으로 정렬되었습니다`);
  }

  function dismissAlert(alert: AlertItem) {
    setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
    setLiveMessage(`신호를 확인 처리했습니다: ${alert.message}`);
  }

  function toggleRiskOff() {
    setRiskOff((prev) => {
      const next = !prev;
      setLiveMessage(
        next
          ? "리스크 오프 모드가 활성화되었습니다. 신규 매수 주문이 차단됩니다."
          : "리스크 오프 모드가 해제되었습니다.",
      );
      return next;
    });
  }

  return (
    <div style={{ colorScheme: "dark" }} className="flex min-h-dvh bg-zinc-950 text-zinc-100">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-amber-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-zinc-950"
      >
        본문으로 건너뛰기
      </a>

      <div aria-live="polite" className="sr-only">
        {liveMessage}
      </div>

      {navOpen && (
        <button
          type="button"
          aria-label="메뉴 닫기"
          onClick={() => setNavOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
        />
      )}

      {/* 사이드바 */}
      <nav
        aria-label="주 메뉴"
        className={cx(
          "fixed inset-y-0 left-0 z-50 flex w-72 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950 transition-transform duration-200 motion-reduce:transition-none lg:static lg:z-auto lg:translate-x-0",
          navOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between gap-2 px-5 py-5">
          <div className="flex items-center gap-2.5">
            <svg viewBox="0 0 24 24" className="h-7 w-7 shrink-0 fill-amber-400" aria-hidden="true">
              <path d="M12 1.5 L17 9 L17 20 L7 20 L7 9 Z" />
            </svg>
            <div>
              <p className="font-display text-xl leading-none tracking-wide text-zinc-50">OBELISK</p>
              <p className="mt-1 text-[10px] font-medium tracking-[0.2em] text-zinc-500">CAPITAL OS</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setNavOpen(false)}
            className="flex size-11 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 lg:hidden"
            aria-label="메뉴 닫기"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mx-4 mb-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3.5 py-3">
          <p className="text-[11px] font-medium text-zinc-500">워크스페이스</p>
          <p className="mt-0.5 truncate text-sm font-semibold text-zinc-100">정온 패밀리오피스</p>
        </div>

        <ul className="flex-1 space-y-1 px-3 py-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === "overview";
            if (!item.href) {
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    title="곧 제공될 기능입니다"
                    className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600"
                  >
                    <Icon className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
                    {item.label}
                    <span className="ml-auto rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] text-zinc-600">
                      준비중
                    </span>
                  </button>
                </li>
              );
            }
            return (
              <li key={item.id}>
                <a
                  href={item.href}
                  onClick={() => setNavOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={cx(
                    "flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400",
                    isActive
                      ? "bg-amber-400/10 text-amber-300"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100",
                  )}
                >
                  <Icon className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
                  {item.label}
                  {item.id === "signals" && alerts.length > 0 && (
                    <span className="ml-auto min-w-5 rounded-full bg-rose-500 px-1.5 py-0.5 text-center text-[10px] font-semibold text-zinc-950">
                      {alerts.length}
                    </span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="border-t border-zinc-800 px-4 py-4">
          <div className="flex items-center gap-3">
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-400 text-sm font-semibold text-zinc-950"
              aria-hidden="true"
            >
              김도
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-zinc-100">김도윤</p>
              <p className="truncate text-xs text-zinc-500">포트폴리오 매니저</p>
            </div>
          </div>
        </div>
      </nav>

      {/* 메인 컬럼 */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
            <button
              ref={navToggleRef}
              type="button"
              onClick={() => setNavOpen(true)}
              className="flex size-11 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 lg:hidden"
              aria-label="메뉴 열기"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>

            <label htmlFor="global-search" className="sr-only">
              종목, 신호, 리포트 검색
            </label>
            <div className="relative hidden min-w-0 flex-1 max-w-xs sm:block">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                aria-hidden="true"
              />
              <input
                id="global-search"
                type="search"
                autoComplete="off"
                placeholder="종목, 신호, 리포트 검색"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/70 py-2 pl-9 pr-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              />
            </div>

            <div className="hidden flex-1 overflow-hidden md:block" aria-label="주요 지표 시세">
              <div className="flex w-max animate-[obelisk-ticker_32s_linear_infinite] gap-6 motion-reduce:animate-none motion-reduce:overflow-x-auto">
                {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
                  <span
                    key={`${t.symbol}-${i}`}
                    className="flex shrink-0 items-center gap-1.5 font-mono text-xs"
                    aria-hidden={i >= TICKER_ITEMS.length ? "true" : undefined}
                  >
                    <span className="text-zinc-500">{t.symbol}</span>
                    <span className="text-zinc-200">{t.value}</span>
                    <span className={t.change >= 0 ? "text-emerald-400" : "text-rose-400"}>
                      {t.change >= 0 ? "+" : ""}
                      {t.change.toFixed(2)}%
                    </span>
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={toggleRiskOff}
              aria-pressed={riskOff}
              className={cx(
                "ml-auto flex min-h-11 shrink-0 items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400",
                riskOff
                  ? "border-rose-500 bg-rose-500 text-zinc-950"
                  : "border-zinc-700 text-zinc-300 hover:border-rose-400/60 hover:text-rose-300",
              )}
            >
              <Power className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">{riskOff ? "리스크 오프 활성" : "리스크 오프"}</span>
            </button>
          </div>

          {riskOff && (
            <div
              role="status"
              className="flex items-center gap-2 border-t border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-medium text-rose-300 sm:px-6"
            >
              <TriangleAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
              리스크 오프 모드 활성화 — 신규 매수 주문이 차단됩니다.
              <button
                type="button"
                onClick={toggleRiskOff}
                className="ml-auto min-h-8 rounded-md px-2 py-1 font-semibold underline underline-offset-2 hover:text-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
              >
                해제
              </button>
            </div>
          )}
        </header>

        <main id="main" className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div>
              <h1 className="font-display text-3xl text-zinc-50 sm:text-4xl">포트폴리오 개요</h1>
              <p className="mt-1 text-sm text-zinc-500">
                정온 패밀리오피스 · 기준시각 {SNAPSHOT_LABEL}
              </p>
            </div>

            {/* 개요: NAV + 히어로 차트 + 레이더 */}
            <section id="overview" aria-labelledby="overview-heading" className="scroll-mt-24">
              <h2 id="overview-heading" className="sr-only">
                자산 현황 개요
              </h2>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 lg:col-span-2">
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium text-zinc-500">총 순자산가치 (NAV)</p>
                      <p className="mt-1 font-display text-4xl text-zinc-50 sm:text-5xl">
                        {krw.format(TOTAL_NAV)}
                      </p>
                      <p className="mt-2 flex items-center gap-1.5 text-sm font-medium">
                        {DAY_CHANGE_AMT >= 0 ? (
                          <ArrowUpRight className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-rose-400" aria-hidden="true" />
                        )}
                        <span className={DAY_CHANGE_AMT >= 0 ? "text-emerald-400" : "text-rose-400"}>
                          {krw.format(DAY_CHANGE_AMT)} ({formatPct(DAY_CHANGE_PCT)})
                        </span>
                        <span className="text-zinc-500">전일 대비</span>
                      </p>
                    </div>

                    <fieldset className="flex items-center gap-1 rounded-lg border border-zinc-800 p-1">
                      <legend className="sr-only">차트 기간 선택</legend>
                      {(Object.keys(RANGE_LABELS) as RangeKey[]).map((key) => (
                        <button
                          key={key}
                          type="button"
                          aria-pressed={range === key}
                          onClick={() => setRange(key)}
                          className={cx(
                            "min-h-9 rounded-md px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400",
                            range === key
                              ? "bg-amber-400 text-zinc-950"
                              : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100",
                          )}
                        >
                          {key}
                        </button>
                      ))}
                    </fieldset>
                  </div>

                  <div className="mt-5">
                    <HeroChart range={range} values={CURVES[range]} />
                  </div>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-zinc-500">자산군 리스크 레이더</p>
                    <RadarIcon className="h-4 w-4 text-zinc-600" aria-hidden="true" />
                  </div>
                  <RadarChart data={ASSET_CLASS_EXPOSURE} activeClass={activeClass} />
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-medium text-zinc-500">자산 배분 (클릭하여 포지션 필터링)</p>
                  {activeClass !== "all" && (
                    <button
                      type="button"
                      onClick={() => setActiveClass("all")}
                      className="min-h-8 rounded-md px-2.5 text-xs font-medium text-amber-300 underline underline-offset-2 hover:text-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    >
                      필터 초기화
                    </button>
                  )}
                </div>
                <div className="mt-3">
                  <AllocationBar data={ASSET_CLASS_EXPOSURE} />
                </div>
                <fieldset className="mt-4 flex flex-wrap gap-2">
                  <legend className="sr-only">자산군 필터</legend>
                  {ASSET_CLASS_EXPOSURE.map((d) => {
                    const style = ASSET_CLASS_STYLE[d.assetClass];
                    const Icon = style.icon;
                    const isActive = activeClass === d.assetClass;
                    return (
                      <button
                        key={d.assetClass}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => setActiveClass(isActive ? "all" : d.assetClass)}
                        className={cx(
                          "flex min-h-9 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400",
                          isActive
                            ? "border-zinc-600 bg-zinc-800 text-zinc-50"
                            : "border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200",
                        )}
                      >
                        <span className={cx("h-2 w-2 rounded-full", style.dot)} aria-hidden="true" />
                        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                        {d.assetClass}
                        <span className="font-mono text-zinc-500">{d.weight.toFixed(1)}%</span>
                      </button>
                    );
                  })}
                </fieldset>
              </div>
            </section>

            {/* 포지션 테이블 */}
            <section id="positions" aria-labelledby="positions-heading" className="scroll-mt-24">
              <div className="flex items-center justify-between">
                <h2 id="positions-heading" className="text-lg font-semibold text-zinc-100">
                  보유 포지션
                </h2>
                <p className="text-xs text-zinc-500">{visiblePositions.length}개 종목</p>
              </div>

              <div className="mt-3 overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/50">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 text-xs text-zinc-500">
                      <th scope="col" className="px-4 py-3 font-medium">
                        종목
                      </th>
                      <th scope="col" className="px-4 py-3 font-medium">
                        보유수량
                      </th>
                      <th scope="col" className="px-4 py-3 font-medium">
                        평균단가
                      </th>
                      <th scope="col" className="px-4 py-3 font-medium">
                        현재가
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 font-medium"
                        aria-sort={
                          sortKey === "value" ? (sortDir === "asc" ? "ascending" : "descending") : "none"
                        }
                      >
                        <button
                          type="button"
                          onClick={() => handleSort("value")}
                          className="flex min-h-9 items-center gap-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                        >
                          평가금액
                          {sortKey === "value" ? (
                            sortDir === "asc" ? (
                              <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                            ) : (
                              <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                            )
                          ) : (
                            <ArrowUpDown className="h-3.5 w-3.5 text-zinc-600" aria-hidden="true" />
                          )}
                        </button>
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 font-medium"
                        aria-sort={
                          sortKey === "pnlPct" ? (sortDir === "asc" ? "ascending" : "descending") : "none"
                        }
                      >
                        <button
                          type="button"
                          onClick={() => handleSort("pnlPct")}
                          className="flex min-h-9 items-center gap-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                        >
                          손익
                          {sortKey === "pnlPct" ? (
                            sortDir === "asc" ? (
                              <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                            ) : (
                              <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                            )
                          ) : (
                            <ArrowUpDown className="h-3.5 w-3.5 text-zinc-600" aria-hidden="true" />
                          )}
                        </button>
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 font-medium"
                        aria-sort={
                          sortKey === "weight" ? (sortDir === "asc" ? "ascending" : "descending") : "none"
                        }
                      >
                        <button
                          type="button"
                          onClick={() => handleSort("weight")}
                          className="flex min-h-9 items-center gap-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                        >
                          비중
                          {sortKey === "weight" ? (
                            sortDir === "asc" ? (
                              <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                            ) : (
                              <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                            )
                          ) : (
                            <ArrowUpDown className="h-3.5 w-3.5 text-zinc-600" aria-hidden="true" />
                          )}
                        </button>
                      </th>
                      <th scope="col" className="px-4 py-3 font-medium">
                        추이
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/70">
                    {visiblePositions.map((p) => {
                      const style = ASSET_CLASS_STYLE[p.assetClass];
                      const positive = (p.pnlPct ?? 0) >= 0;
                      return (
                        <tr key={p.id} className="hover:bg-zinc-900/60">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <span className={cx("h-2 w-2 shrink-0 rounded-full", style.dot)} aria-hidden="true" />
                              <div className="min-w-0">
                                <p className="truncate font-medium text-zinc-100">{p.name}</p>
                                <p className="text-xs text-zinc-500">
                                  {p.ticker} · {p.assetClass}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-zinc-300">{p.qtyLabel}</td>
                          <td className="px-4 py-3 font-mono text-xs text-zinc-300">
                            {p.avgPrice ? krw.format(p.avgPrice) : "—"}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-zinc-300">
                            {p.price ? krw.format(p.price) : "—"}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-zinc-100">{krwCompact.format(p.value)}</td>
                          <td className="px-4 py-3">
                            {p.pnlPct === null ? (
                              <span className="text-xs text-zinc-500">—</span>
                            ) : (
                              <span
                                className={cx(
                                  "inline-flex items-center gap-1 font-mono text-xs font-semibold",
                                  positive ? "text-emerald-400" : "text-rose-400",
                                )}
                              >
                                {positive ? (
                                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                                ) : (
                                  <ArrowDownRight className="h-3.5 w-3.5" aria-hidden="true" />
                                )}
                                {formatPct(p.pnlPct)}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-zinc-300">
                            {p.weight.toFixed(1)}%
                          </td>
                          <td className="px-4 py-3">
                            <Sparkline
                              data={buildCurve(7, p.pnlPct ?? 0, p.id.charCodeAt(0))}
                              positive={positive}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 신호 + 상관관계 */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
              <section
                id="signals"
                aria-labelledby="signals-heading"
                className="scroll-mt-24 lg:col-span-2"
              >
                <h2 id="signals-heading" className="text-lg font-semibold text-zinc-100">
                  리스크 신호
                </h2>
                <ul className="mt-3 space-y-2">
                  {alerts.length === 0 && (
                    <li className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 px-4 py-10 text-center">
                      <BellOff className="h-6 w-6 text-zinc-600" aria-hidden="true" />
                      <p className="text-sm font-medium text-zinc-300">모든 신호를 확인했습니다</p>
                      <p className="text-xs text-zinc-500">새로운 리스크 신호가 발생하면 여기에 표시됩니다.</p>
                    </li>
                  )}
                  {alerts.map((alert) => {
                    const style = SEVERITY_STYLE[alert.severity];
                    const Icon = style.icon;
                    return (
                      <li
                        key={alert.id}
                        className={cx("flex items-start gap-3 rounded-xl border px-3.5 py-3", style.border, style.bg)}
                      >
                        <Icon className={cx("mt-0.5 h-4 w-4 shrink-0", style.text)} aria-hidden="true" />
                        <div className="min-w-0 flex-1">
                          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide">
                            <span className={style.text}>{style.label}</span>
                            <span className="text-zinc-500">{alert.time}</span>
                          </p>
                          <p className="mt-0.5 text-sm text-zinc-200">{alert.message}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => dismissAlert(alert)}
                          aria-label={`신호 확인 처리: ${alert.message}`}
                          className="flex size-9 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-800 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                        >
                          <Check className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>

              <section
                id="correlation"
                aria-labelledby="correlation-heading"
                className="scroll-mt-24 lg:col-span-3"
              >
                <h2 id="correlation-heading" className="text-lg font-semibold text-zinc-100">
                  자산군 상관관계
                </h2>
                <p className="mt-1 text-xs text-zinc-500">
                  1에 가까울수록 동반 등락, -1에 가까울수록 분산 효과가 큽니다.
                </p>
                <div className="mt-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
                  <CorrelationHeatmap />
                </div>
              </section>
            </div>

            <footer className="border-t border-zinc-800 pt-6 pb-2 text-xs text-zinc-600">
              OBELISK Capital OS · 본 화면의 수치는 시연을 위한 정적 스냅샷이며 실제 계좌 정보가 아닙니다.
            </footer>
          </div>
        </main>
      </div>

      <style>{`
        @keyframes obelisk-ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
