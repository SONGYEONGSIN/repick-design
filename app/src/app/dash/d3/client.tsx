"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { JetBrains_Mono } from "next/font/google";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  LayoutGrid,
  Map as MapIcon,
  Menu,
  PackageSearch,
  Settings,
  Truck,
  X,
} from "lucide-react";
import "./d3.css";

const mono = JetBrains_Mono({
  variable: "--d3-font-mono",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

/* ---------------------------------------------------------------------------
 * Reduced-motion detection — matchMedia + useSyncExternalStore directly
 * (framer-motion's own hook can miss the OS setting in some environments).
 * Server snapshot defaults to `false`; every animated element also has a
 * CSS `prefers-reduced-motion` fallback in d3.css, so motion is disabled
 * even if this hook were ever wrong, and nothing ever gets stuck invisible.
 * ------------------------------------------------------------------------- */
function subscribe(callback: () => void) {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}
function getSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function getServerSnapshot() {
  return false;
}
function useReducedMotionSafe() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/* ---------------------------------------------------------------------------
 * Domain types
 * ------------------------------------------------------------------------- */
type HubStatus = "nominal" | "watch" | "critical";
type ManifestStatus = "in_transit" | "delayed" | "delivered" | "scheduled";
type Severity = "critical" | "warning" | "info";
type RegionId = "na" | "eu" | "apac";

interface Hub {
  id: string;
  code: string;
  name: string;
  x: number;
  y: number;
  status: HubStatus;
  load: number;
}
interface Edge {
  from: string;
  to: string;
  status: HubStatus;
}
interface Kpi {
  key: string;
  label: string;
  value: string;
  delta: string;
  dir: "up" | "down";
  favorable: boolean;
  trend: number[];
}
interface FleetSlice {
  key: string;
  label: string;
  value: number;
  color: string;
}
interface ThroughputEntry {
  hubId: string;
  volume: number;
  onTime: number;
}
interface ManifestRow {
  id: string;
  origin: string;
  destination: string;
  carrier: string;
  eta: string;
  status: ManifestStatus;
  progress: number;
}
interface ExceptionEntry {
  id: string;
  severity: Severity;
  message: string;
  hub: string;
  time: string;
}
interface RegionData {
  id: RegionId;
  label: string;
  asOf: string;
  kpis: Kpi[];
  hubs: Hub[];
  edges: Edge[];
  fleet: FleetSlice[];
  throughput: ThroughputEntry[];
  manifests: ManifestRow[];
  exceptions: ExceptionEntry[];
}

/* ---------------------------------------------------------------------------
 * Dummy data — static snapshot, three operating regions
 * ------------------------------------------------------------------------- */
const REGIONS: Record<RegionId, RegionData> = {
  na: {
    id: "na",
    label: "북미 동부",
    asOf: "07:42 UTC · 2026-07-10",
    kpis: [
      { key: "routes", label: "가동 노선", value: "128", delta: "+6", dir: "up", favorable: true, trend: [110, 114, 118, 121, 124, 126, 128] },
      { key: "onTime", label: "정시 도착률", value: "94.2%", delta: "+1.3%p", dir: "up", favorable: true, trend: [91.0, 91.8, 92.4, 93.0, 93.5, 93.9, 94.2] },
      { key: "transit", label: "이동중 화물", value: "342", delta: "-18", dir: "down", favorable: true, trend: [402, 388, 376, 365, 358, 350, 342] },
      { key: "exceptions", label: "활성 예외", value: "7", delta: "+2", dir: "up", favorable: false, trend: [3, 4, 3, 5, 4, 6, 7] },
      { key: "dwell", label: "평균 체류시간", value: "26분", delta: "-4분", dir: "down", favorable: true, trend: [34, 32, 31, 30, 29, 27, 26] },
    ],
    hubs: [
      { id: "atl", code: "ATL", name: "애틀랜타 허브", x: 28, y: 42, status: "nominal", load: 72 },
      { id: "ord", code: "ORD", name: "시카고 허브", x: 50, y: 16, status: "nominal", load: 58 },
      { id: "jfk", code: "JFK", name: "뉴욕 허브", x: 82, y: 24, status: "watch", load: 88 },
      { id: "dfw", code: "DFW", name: "댈러스 허브", x: 18, y: 30, status: "nominal", load: 64 },
      { id: "mia", code: "MIA", name: "마이애미 허브", x: 46, y: 52, status: "critical", load: 95 },
    ],
    edges: [
      { from: "atl", to: "ord", status: "nominal" },
      { from: "ord", to: "jfk", status: "watch" },
      { from: "atl", to: "dfw", status: "nominal" },
      { from: "dfw", to: "mia", status: "critical" },
      { from: "ord", to: "mia", status: "watch" },
      { from: "jfk", to: "mia", status: "critical" },
    ],
    fleet: [
      { key: "moving", label: "이동중", value: 186, color: "var(--d3-nominal)" },
      { key: "loading", label: "적재중", value: 28, color: "var(--d3-accent)" },
      { key: "idle", label: "대기", value: 42, color: "var(--d3-info)" },
      { key: "maintenance", label: "정비중", value: 11, color: "var(--d3-alt)" },
      { key: "offline", label: "오프라인", value: 5, color: "var(--d3-text-faint)" },
    ],
    throughput: [
      { hubId: "atl", volume: 412, onTime: 96 },
      { hubId: "ord", volume: 388, onTime: 91 },
      { hubId: "jfk", volume: 356, onTime: 84 },
      { hubId: "dfw", volume: 298, onTime: 95 },
      { hubId: "mia", volume: 274, onTime: 78 },
    ],
    manifests: [
      { id: "MF-88213", origin: "ATL", destination: "JFK", carrier: "유니온 프레이트", eta: "14:20", status: "in_transit", progress: 62 },
      { id: "MF-88214", origin: "ORD", destination: "MIA", carrier: "콜드라인 익스프레스", eta: "09:05", status: "delayed", progress: 38 },
      { id: "MF-88215", origin: "DFW", destination: "ORD", carrier: "유니온 프레이트", eta: "07:40 도착", status: "delivered", progress: 100 },
      { id: "MF-88216", origin: "JFK", destination: "ATL", carrier: "메리디안 카고", eta: "18:50", status: "in_transit", progress: 21 },
      { id: "MF-88217", origin: "MIA", destination: "DFW", carrier: "콜드라인 익스프레스", eta: "11:30", status: "delayed", progress: 55 },
      { id: "MF-88218", origin: "ATL", destination: "ORD", carrier: "유니온 프레이트", eta: "22:10", status: "scheduled", progress: 0 },
      { id: "MF-88219", origin: "ORD", destination: "JFK", carrier: "메리디안 카고", eta: "06:15 도착", status: "delivered", progress: 100 },
    ],
    exceptions: [
      { id: "ex-1", severity: "critical", message: "냉장 컨테이너 온도 이탈 (+6°C)", hub: "MIA", time: "07:12" },
      { id: "ex-2", severity: "critical", message: "경로 지연 — 교통 통제 구간 발생", hub: "DFW → MIA", time: "06:58" },
      { id: "ex-3", severity: "warning", message: "허브 처리량 임계치 근접 (88%)", hub: "JFK", time: "06:40" },
      { id: "ex-4", severity: "warning", message: "적재 대기 시간 초과", hub: "ORD → JFK", time: "06:22" },
      { id: "ex-5", severity: "info", message: "신규 매니페스트 12건 접수", hub: "ATL", time: "06:05" },
    ],
  },
  eu: {
    id: "eu",
    label: "유럽 서부",
    asOf: "06:15 UTC · 2026-07-10",
    kpis: [
      { key: "routes", label: "가동 노선", value: "96", delta: "-3", dir: "down", favorable: false, trend: [104, 102, 101, 99, 98, 97, 96] },
      { key: "onTime", label: "정시 도착률", value: "89.6%", delta: "-2.1%p", dir: "down", favorable: false, trend: [93.8, 93.0, 92.1, 91.4, 90.6, 90.0, 89.6] },
      { key: "transit", label: "이동중 화물", value: "265", delta: "+12", dir: "up", favorable: false, trend: [228, 236, 241, 248, 253, 259, 265] },
      { key: "exceptions", label: "활성 예외", value: "9", delta: "+4", dir: "up", favorable: false, trend: [3, 4, 5, 6, 7, 8, 9] },
      { key: "dwell", label: "평균 체류시간", value: "33분", delta: "+5분", dir: "up", favorable: false, trend: [24, 26, 28, 29, 30, 31, 33] },
    ],
    hubs: [
      { id: "lhr", code: "LHR", name: "런던 허브", x: 20, y: 20, status: "nominal", load: 61 },
      { id: "cdg", code: "CDG", name: "파리 허브", x: 30, y: 34, status: "nominal", load: 55 },
      { id: "fra", code: "FRA", name: "프랑크푸르트 허브", x: 52, y: 18, status: "critical", load: 91 },
      { id: "ams", code: "AMS", name: "암스테르담 허브", x: 42, y: 10, status: "watch", load: 77 },
      { id: "mad", code: "MAD", name: "마드리드 허브", x: 24, y: 50, status: "nominal", load: 48 },
    ],
    edges: [
      { from: "lhr", to: "cdg", status: "nominal" },
      { from: "cdg", to: "fra", status: "critical" },
      { from: "ams", to: "fra", status: "watch" },
      { from: "lhr", to: "ams", status: "nominal" },
      { from: "cdg", to: "mad", status: "nominal" },
      { from: "fra", to: "mad", status: "watch" },
    ],
    fleet: [
      { key: "moving", label: "이동중", value: 134, color: "var(--d3-nominal)" },
      { key: "loading", label: "적재중", value: 19, color: "var(--d3-accent)" },
      { key: "idle", label: "대기", value: 38, color: "var(--d3-info)" },
      { key: "maintenance", label: "정비중", value: 14, color: "var(--d3-alt)" },
      { key: "offline", label: "오프라인", value: 9, color: "var(--d3-text-faint)" },
    ],
    throughput: [
      { hubId: "lhr", volume: 301, onTime: 93 },
      { hubId: "cdg", volume: 276, onTime: 90 },
      { hubId: "fra", volume: 244, onTime: 71 },
      { hubId: "ams", volume: 259, onTime: 85 },
      { hubId: "mad", volume: 198, onTime: 96 },
    ],
    manifests: [
      { id: "MF-77102", origin: "LHR", destination: "FRA", carrier: "실크로드 로지스틱스", eta: "13:10", status: "in_transit", progress: 47 },
      { id: "MF-77103", origin: "CDG", destination: "MAD", carrier: "유니온 프레이트", eta: "08:45", status: "delayed", progress: 33 },
      { id: "MF-77104", origin: "AMS", destination: "LHR", carrier: "메리디안 카고", eta: "06:30 도착", status: "delivered", progress: 100 },
      { id: "MF-77105", origin: "FRA", destination: "CDG", carrier: "콜드라인 익스프레스", eta: "17:20", status: "in_transit", progress: 18 },
      { id: "MF-77106", origin: "MAD", destination: "AMS", carrier: "실크로드 로지스틱스", eta: "10:50", status: "delayed", progress: 61 },
      { id: "MF-77107", origin: "LHR", destination: "MAD", carrier: "유니온 프레이트", eta: "21:00", status: "scheduled", progress: 0 },
      { id: "MF-77108", origin: "CDG", destination: "FRA", carrier: "메리디안 카고", eta: "05:55 도착", status: "delivered", progress: 100 },
    ],
    exceptions: [
      { id: "ex-1", severity: "critical", message: "허브 셧다운 — 폭풍 경보로 활주로 폐쇄", hub: "FRA", time: "05:52" },
      { id: "ex-2", severity: "warning", message: "경로 중단 — 대체 경로 재계산 중", hub: "CDG → FRA", time: "05:40" },
      { id: "ex-3", severity: "warning", message: "허브 처리량 임계치 근접 (77%)", hub: "AMS", time: "05:20" },
      { id: "ex-4", severity: "warning", message: "적재 대기 시간 초과", hub: "FRA → MAD", time: "05:05" },
      { id: "ex-5", severity: "info", message: "신규 매니페스트 9건 접수", hub: "LHR", time: "04:50" },
    ],
  },
  apac: {
    id: "apac",
    label: "아시아태평양",
    asOf: "08:50 UTC · 2026-07-10",
    kpis: [
      { key: "routes", label: "가동 노선", value: "142", delta: "+11", dir: "up", favorable: true, trend: [118, 122, 127, 131, 135, 138, 142] },
      { key: "onTime", label: "정시 도착률", value: "91.8%", delta: "+0.4%p", dir: "up", favorable: true, trend: [90.5, 90.8, 91.0, 91.2, 91.4, 91.6, 91.8] },
      { key: "transit", label: "이동중 화물", value: "401", delta: "+26", dir: "up", favorable: false, trend: [340, 355, 367, 378, 386, 393, 401] },
      { key: "exceptions", label: "활성 예외", value: "6", delta: "-1", dir: "down", favorable: true, trend: [9, 8, 8, 7, 7, 6, 6] },
      { key: "dwell", label: "평균 체류시간", value: "22분", delta: "-2분", dir: "down", favorable: true, trend: [27, 26, 25, 24, 23, 23, 22] },
    ],
    hubs: [
      { id: "icn", code: "ICN", name: "서울 허브", x: 66, y: 10, status: "nominal", load: 59 },
      { id: "nrt", code: "NRT", name: "도쿄 허브", x: 78, y: 14, status: "nominal", load: 68 },
      { id: "hkg", code: "HKG", name: "홍콩 허브", x: 58, y: 30, status: "critical", load: 93 },
      { id: "sin", code: "SIN", name: "싱가포르 허브", x: 48, y: 46, status: "watch", load: 81 },
      { id: "syd", code: "SYD", name: "시드니 허브", x: 74, y: 54, status: "nominal", load: 52 },
    ],
    edges: [
      { from: "icn", to: "nrt", status: "nominal" },
      { from: "nrt", to: "hkg", status: "watch" },
      { from: "icn", to: "hkg", status: "nominal" },
      { from: "hkg", to: "sin", status: "critical" },
      { from: "sin", to: "syd", status: "watch" },
      { from: "hkg", to: "syd", status: "watch" },
    ],
    fleet: [
      { key: "moving", label: "이동중", value: 201, color: "var(--d3-nominal)" },
      { key: "loading", label: "적재중", value: 31, color: "var(--d3-accent)" },
      { key: "idle", label: "대기", value: 35, color: "var(--d3-info)" },
      { key: "maintenance", label: "정비중", value: 8, color: "var(--d3-alt)" },
      { key: "offline", label: "오프라인", value: 4, color: "var(--d3-text-faint)" },
    ],
    throughput: [
      { hubId: "icn", volume: 334, onTime: 94 },
      { hubId: "nrt", volume: 352, onTime: 92 },
      { hubId: "hkg", volume: 298, onTime: 68 },
      { hubId: "sin", volume: 311, onTime: 83 },
      { hubId: "syd", volume: 226, onTime: 95 },
    ],
    manifests: [
      { id: "MF-65011", origin: "ICN", destination: "NRT", carrier: "실크로드 로지스틱스", eta: "15:40", status: "in_transit", progress: 58 },
      { id: "MF-65012", origin: "SIN", destination: "HKG", carrier: "콜드라인 익스프레스", eta: "07:15", status: "delayed", progress: 42 },
      { id: "MF-65013", origin: "HKG", destination: "SYD", carrier: "유니온 프레이트", eta: "06:00 도착", status: "delivered", progress: 100 },
      { id: "MF-65014", origin: "NRT", destination: "ICN", carrier: "메리디안 카고", eta: "19:30", status: "in_transit", progress: 27 },
      { id: "MF-65015", origin: "SYD", destination: "SIN", carrier: "실크로드 로지스틱스", eta: "12:10", status: "delayed", progress: 49 },
      { id: "MF-65016", origin: "ICN", destination: "HKG", carrier: "유니온 프레이트", eta: "23:05", status: "scheduled", progress: 0 },
      { id: "MF-65017", origin: "SIN", destination: "NRT", carrier: "콜드라인 익스프레스", eta: "05:20 도착", status: "delivered", progress: 100 },
    ],
    exceptions: [
      { id: "ex-1", severity: "critical", message: "통관 지연 — 평균 대기 4.2시간", hub: "HKG", time: "08:30" },
      { id: "ex-2", severity: "warning", message: "경로 정체 — 우회 경로 적용", hub: "HKG → SIN", time: "08:12" },
      { id: "ex-3", severity: "warning", message: "허브 처리량 임계치 근접 (81%)", hub: "SIN", time: "07:55" },
      { id: "ex-4", severity: "warning", message: "기상 지연 — 30분 지연 예상", hub: "NRT → HKG", time: "07:40" },
      { id: "ex-5", severity: "info", message: "신규 매니페스트 15건 접수", hub: "ICN", time: "07:20" },
    ],
  },
};

const REGION_OPTIONS: { value: RegionId; label: string }[] = [
  { value: "na", label: "북미 동부" },
  { value: "eu", label: "유럽 서부" },
  { value: "apac", label: "아시아태평양" },
];

const MANIFEST_FILTER_OPTIONS: { value: ManifestStatus | "all"; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "in_transit", label: "이동중" },
  { value: "delayed", label: "지연" },
  { value: "delivered", label: "완료" },
];

const THROUGHPUT_METRIC_OPTIONS: { value: "volume" | "onTime"; label: string }[] = [
  { value: "volume", label: "물량" },
  { value: "onTime", label: "정시율" },
];

const NAV_ITEMS = [
  { id: "command", label: "커맨드 덱", icon: LayoutGrid, current: true },
  { id: "routes", label: "경로 & 지도", icon: MapIcon, current: false },
  { id: "fleet", label: "차량", icon: Truck, current: false },
  { id: "manifests", label: "매니페스트", icon: PackageSearch, current: false },
  { id: "exceptions", label: "예외", icon: AlertTriangle, current: false },
  { id: "reports", label: "리포트", icon: BarChart3, current: false },
  { id: "settings", label: "설정", icon: Settings, current: false },
] as const;

/* ---------------------------------------------------------------------------
 * Small helpers
 * ------------------------------------------------------------------------- */
function statusColor(status: HubStatus): string {
  if (status === "nominal") return "var(--d3-nominal)";
  if (status === "watch") return "var(--d3-watch)";
  return "var(--d3-critical)";
}
function statusLabel(status: HubStatus): string {
  if (status === "nominal") return "정상";
  if (status === "watch") return "주의";
  return "위험";
}
function severityLabel(severity: Severity): string {
  if (severity === "critical") return "위험";
  if (severity === "warning") return "주의";
  return "안내";
}
function severityTextClass(severity: Severity): string {
  if (severity === "critical") return "text-[var(--d3-critical)]";
  if (severity === "warning") return "text-[var(--d3-watch)]";
  return "text-[var(--d3-text-faint)]";
}
function severityBorderClass(severity: Severity): string {
  if (severity === "critical") return "border-l-[var(--d3-critical)]";
  if (severity === "warning") return "border-l-[var(--d3-watch)]";
  return "border-l-[var(--d3-text-faint)]";
}

const MANIFEST_BADGE: Record<
  ManifestStatus,
  { bg: string; text: string; dot: string; label: string }
> = {
  in_transit: { bg: "bg-[var(--d3-info-soft)]", text: "text-[var(--d3-info)]", dot: "bg-[var(--d3-info)]", label: "이동중" },
  delayed: { bg: "bg-[var(--d3-critical-soft)]", text: "text-[var(--d3-critical)]", dot: "bg-[var(--d3-critical)]", label: "지연" },
  delivered: { bg: "bg-[var(--d3-nominal-soft)]", text: "text-[var(--d3-nominal)]", dot: "bg-[var(--d3-nominal)]", label: "완료" },
  scheduled: { bg: "bg-[var(--d3-panel-alt)]", text: "text-[var(--d3-text-muted)]", dot: "bg-[var(--d3-text-faint)]", label: "예정" },
};

/* ---------------------------------------------------------------------------
 * Presentational primitives
 * ------------------------------------------------------------------------- */
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 64;
  const h = 22;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 3) - 1.5;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      aria-hidden="true"
      focusable="false"
      className="shrink-0 overflow-visible"
    >
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Donut({ segments }: { segments: FleetSlice[] }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  const arcs = segments.reduce<{ pct: number; offset: number }[]>((acc, seg) => {
    const cumulative = acc.reduce((sum, a) => sum + a.pct, 0);
    const pct = (seg.value / total) * 100;
    acc.push({ pct, offset: 100 - cumulative });
    return acc;
  }, []);
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true" focusable="false" className="h-full w-full -rotate-90">
      <circle cx={18} cy={18} r={15.9155} fill="none" stroke="var(--d3-border)" strokeWidth={3.4} />
      {segments.map((seg, i) => {
        const { pct, offset } = arcs[i];
        return (
          <circle
            key={seg.key}
            cx={18}
            cy={18}
            r={15.9155}
            fill="none"
            stroke={seg.color}
            strokeWidth={3.4}
            strokeDasharray={`${pct} ${100 - pct}`}
            strokeDashoffset={offset}
            strokeLinecap="butt"
          />
        );
      })}
    </svg>
  );
}

function SegmentedControl<T extends string>({
  ariaLabel,
  options,
  value,
  onChange,
}: {
  ariaLabel: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex flex-wrap items-center gap-1 rounded-lg border border-[var(--d3-border)] bg-[var(--d3-panel-alt)] p-1"
    >
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            className={`d3-mono min-h-11 rounded-md px-3 text-xs font-medium uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--d3-accent)] ${
              selected
                ? "bg-[var(--d3-accent-soft)] text-[var(--d3-accent)]"
                : "text-[var(--d3-text-muted)] hover:text-[var(--d3-text)]"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function StatusBadge({ status }: { status: ManifestStatus }) {
  const s = MANIFEST_BADGE[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${s.bg} ${s.text}`}>
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

/* ---------------------------------------------------------------------------
 * Main dashboard
 * ------------------------------------------------------------------------- */
export default function DashboardClient() {
  const reduced = useReducedMotionSafe();
  const [regionId, setRegionId] = useState<RegionId>("na");
  const [selectedHubId, setSelectedHubId] = useState<string>("atl");
  const [manifestFilter, setManifestFilter] = useState<ManifestStatus | "all">("all");
  const [throughputMetric, setThroughputMetric] = useState<"volume" | "onTime">("volume");
  const [navOpen, setNavOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const region = REGIONS[regionId];
  const hubsById = useMemo(() => {
    const map: Record<string, Hub> = {};
    for (const hub of region.hubs) map[hub.id] = hub;
    return map;
  }, [region]);

  // Reset hub selection whenever the region changes. Adjusting state during
  // render (React's documented pattern) instead of an effect avoids the
  // extra commit an effect-triggered setState would otherwise cause.
  const [syncedRegionId, setSyncedRegionId] = useState<RegionId>(regionId);
  if (syncedRegionId !== regionId) {
    setSyncedRegionId(regionId);
    setSelectedHubId(region.hubs[0]?.id ?? "");
  }

  useEffect(() => {
    if (!navOpen) return;
    closeButtonRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setNavOpen(false);
        hamburgerRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [navOpen]);

  const selectedHub = selectedHubId ? hubsById[selectedHubId] : undefined;
  const connectedEdges = selectedHub
    ? region.edges.filter((e) => e.from === selectedHub.id || e.to === selectedHub.id)
    : [];

  const filteredManifests = region.manifests.filter(
    (m) => manifestFilter === "all" || m.status === manifestFilter
  );

  const maxVolume = Math.max(...region.throughput.map((t) => t.volume));
  const fleetTotal = region.fleet.reduce((sum, f) => sum + f.value, 0);

  const criticalExceptionCount = region.exceptions.filter((e) => e.severity === "critical").length;
  const pill =
    criticalExceptionCount >= 2
      ? { label: `긴급 대응 ${criticalExceptionCount}건`, color: "var(--d3-critical)" }
      : criticalExceptionCount === 1 || region.exceptions.some((e) => e.severity === "warning")
        ? { label: "주의 관찰 중", color: "var(--d3-watch)" }
        : { label: "정상 가동", color: "var(--d3-nominal)" };

  return (
    <div className={`${mono.variable} d3-root d3-grid-bg relative min-h-dvh font-sans text-[var(--d3-text)]`}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-[var(--d3-accent)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-black"
      >
        본문으로 건너뛰기
      </a>

      <div className="relative z-10 flex min-h-dvh">
        {navOpen && (
          <button
            type="button"
            onClick={() => setNavOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          >
            <span className="sr-only">메뉴 닫기</span>
          </button>
        )}

        {/* Sidebar */}
        <aside
          id="d3-sidebar"
          className={`d3-drawer fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[var(--d3-border)] bg-[var(--d3-panel)] lg:static lg:z-auto lg:translate-x-0 ${
            navOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between gap-3 border-b border-[var(--d3-border)] px-5 py-5">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--d3-accent-soft)] font-mono text-sm font-bold text-[var(--d3-accent)]"
              >
                M/
              </span>
              <div>
                <p className="d3-mono text-sm font-semibold tracking-[0.1em] text-[var(--d3-text)]">MANIFEST</p>
                <p className="d3-mono text-[11px] tracking-wide text-[var(--d3-text-faint)]">OPS CONTROL</p>
              </div>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setNavOpen(false)}
              className="flex h-11 w-11 items-center justify-center rounded-md text-[var(--d3-text-muted)] hover:text-[var(--d3-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--d3-accent)] lg:hidden"
            >
              <X aria-hidden="true" className="h-5 w-5" />
              <span className="sr-only">메뉴 닫기</span>
            </button>
          </div>

          <nav aria-label="주 메뉴" className="flex-1 overflow-y-auto px-3 py-4">
            <ul className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      disabled={!item.current}
                      aria-current={item.current ? "page" : undefined}
                      className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--d3-accent)] disabled:cursor-not-allowed ${
                        item.current
                          ? "bg-[var(--d3-accent-soft)] text-[var(--d3-accent)]"
                          : "text-[var(--d3-text-faint)] hover:text-[var(--d3-text-muted)]"
                      }`}
                    >
                      <Icon aria-hidden="true" focusable="false" className="h-5 w-5 shrink-0" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {!item.current && (
                        <span className="d3-mono text-[10px] tracking-wide text-[var(--d3-text-faint)]">SOON</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-[var(--d3-border)] px-5 py-4">
            <p className="d3-mono text-[11px] text-[var(--d3-text-faint)]">BUILD 4.2.1 · 스냅샷 데모</p>
          </div>
        </aside>

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-[var(--d3-border)] bg-[var(--d3-panel)]/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
            <button
              ref={hamburgerRef}
              type="button"
              onClick={() => setNavOpen(true)}
              aria-expanded={navOpen}
              aria-controls="d3-sidebar"
              className="flex h-11 w-11 items-center justify-center rounded-md text-[var(--d3-text-muted)] hover:text-[var(--d3-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--d3-accent)] lg:hidden"
            >
              <Menu aria-hidden="true" className="h-5 w-5" />
              <span className="sr-only">메뉴 열기</span>
            </button>

            <span aria-hidden="true" className="d3-mono text-sm font-semibold tracking-[0.1em] text-[var(--d3-accent)] lg:hidden">
              M/
            </span>

            <div className="min-w-0 flex-1 overflow-x-auto">
              <SegmentedControl ariaLabel="리전 선택" options={REGION_OPTIONS} value={regionId} onChange={setRegionId} />
            </div>

            <div
              className="hidden shrink-0 items-center gap-2 rounded-full border border-[var(--d3-border)] px-3 py-1.5 sm:flex"
              style={{ borderColor: "var(--d3-border)" }}
            >
              <span aria-hidden="true" className="d3-live-dot h-2 w-2 rounded-full" style={{ background: pill.color }} />
              <span className="d3-mono text-xs text-[var(--d3-text-muted)]">{pill.label}</span>
            </div>

            <button
              type="button"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--d3-accent-soft)] font-mono text-sm font-semibold text-[var(--d3-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--d3-accent)]"
              aria-label="계정 메뉴, 오하늘 운영 매니저"
            >
              오하
            </button>
          </header>

          <main id="main-content" className="flex-1 space-y-6 px-4 py-6 sm:px-6 lg:space-y-8 lg:px-8 lg:py-8">
            <div className="space-y-1">
              <h1 className="text-xl font-semibold text-[var(--d3-text)] sm:text-2xl">커맨드 덱</h1>
              <p className="text-sm text-[var(--d3-text-muted)]">
                {region.label} · 스냅샷 기준 <span className="d3-mono">{region.asOf}</span>
              </p>
            </div>

            {/* KPI ticker */}
            <section aria-labelledby="kpi-heading">
              <h2 id="kpi-heading" className="sr-only">핵심 지표</h2>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {region.kpis.map((kpi) => (
                  <li
                    key={kpi.key}
                    className="rounded-xl border border-[var(--d3-border)] bg-[var(--d3-panel)] p-4"
                  >
                    <p className="d3-mono text-[11px] uppercase tracking-[0.08em] text-[var(--d3-text-faint)]">
                      {kpi.label}
                    </p>
                    <div className="mt-2 flex items-end justify-between gap-2">
                      <p className="d3-mono text-2xl font-semibold text-[var(--d3-text)]">{kpi.value}</p>
                      <Sparkline
                        data={kpi.trend}
                        color={kpi.favorable ? "var(--d3-nominal)" : "var(--d3-critical)"}
                      />
                    </div>
                    <p
                      className={`mt-1.5 flex items-center gap-1 d3-mono text-xs ${
                        kpi.favorable ? "text-[var(--d3-nominal)]" : "text-[var(--d3-critical)]"
                      }`}
                    >
                      {kpi.dir === "up" ? (
                        <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowDownRight aria-hidden="true" className="h-3.5 w-3.5" />
                      )}
                      <span>{kpi.delta}</span>
                      <span className="text-[var(--d3-text-faint)]">전주 대비</span>
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            {/* Network + Exceptions */}
            <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
              <section
                aria-labelledby="network-heading"
                className="rounded-xl border border-[var(--d3-border)] bg-[var(--d3-panel)] p-4 sm:p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 id="network-heading" className="d3-mono text-sm font-semibold uppercase tracking-[0.08em]">
                    허브 네트워크
                  </h2>
                  <p className="d3-mono text-[11px] text-[var(--d3-text-faint)]">
                    허브 {region.hubs.length}개 · 경로 {region.edges.length}개
                  </p>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-[1.3fr_1fr]">
                  <div className="relative min-h-[220px] overflow-hidden rounded-lg border border-[var(--d3-border)] bg-[var(--d3-panel-alt)]">
                    <svg viewBox="0 0 100 60" aria-hidden="true" focusable="false" className="h-full w-full">
                      {region.edges.map((edge) => {
                        const a = hubsById[edge.from];
                        const b = hubsById[edge.to];
                        if (!a || !b) return null;
                        const touchesSelected = selectedHub && (edge.from === selectedHub.id || edge.to === selectedHub.id);
                        return (
                          <line
                            key={`${edge.from}-${edge.to}`}
                            x1={a.x}
                            y1={a.y}
                            x2={b.x}
                            y2={b.y}
                            stroke={statusColor(edge.status)}
                            strokeWidth={touchesSelected ? 1 : 0.55}
                            opacity={touchesSelected ? 1 : 0.55}
                            className={reduced ? "" : "d3-route-line"}
                          />
                        );
                      })}
                      {region.hubs.map((hub) => (
                        <g key={hub.id}>
                          {selectedHubId === hub.id && (
                            <circle cx={hub.x} cy={hub.y} r={4.6} fill="none" stroke="var(--d3-accent)" strokeWidth={0.5} />
                          )}
                          <circle
                            cx={hub.x}
                            cy={hub.y}
                            r={selectedHubId === hub.id ? 3 : 2.2}
                            fill={statusColor(hub.status)}
                            className={!reduced && hub.status !== "nominal" ? "d3-hub-pulse" : ""}
                          />
                        </g>
                      ))}
                    </svg>
                  </div>

                  <ul className="space-y-1.5">
                    {region.hubs.map((hub) => (
                      <li key={hub.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedHubId(hub.id)}
                          aria-pressed={selectedHubId === hub.id}
                          className={`flex min-h-11 w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--d3-accent)] ${
                            selectedHubId === hub.id
                              ? "border-[var(--d3-accent)] bg-[var(--d3-accent-soft)]"
                              : "border-[var(--d3-border)] bg-[var(--d3-panel-alt)] hover:border-[var(--d3-border-strong)]"
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                            style={{ background: statusColor(hub.status) }}
                          />
                          <span className="min-w-0 flex-1">
                            <span className="d3-mono block text-xs font-semibold text-[var(--d3-text)]">{hub.code}</span>
                            <span className="block truncate text-[11px] text-[var(--d3-text-faint)]">
                              {hub.name} · {statusLabel(hub.status)}
                            </span>
                          </span>
                          <span className="d3-mono text-xs text-[var(--d3-text-muted)]">{hub.load}%</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {selectedHub && (
                  <div className="mt-4 rounded-lg border border-[var(--d3-border)] bg-[var(--d3-panel-alt)] p-3 sm:p-4" aria-live="polite">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-medium text-[var(--d3-text)]">
                        {selectedHub.code} · {selectedHub.name}
                      </p>
                      <span
                        className="d3-mono text-xs font-semibold"
                        style={{ color: statusColor(selectedHub.status) }}
                      >
                        {statusLabel(selectedHub.status)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--d3-panel)]">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${selectedHub.load}%`, background: statusColor(selectedHub.status) }}
                        />
                      </div>
                      <span className="d3-mono text-xs text-[var(--d3-text-muted)]">처리율 {selectedHub.load}%</span>
                    </div>
                    {connectedEdges.length > 0 && (
                      <p className="mt-2 text-xs text-[var(--d3-text-faint)]">
                        연결 경로:{" "}
                        {connectedEdges
                          .map((e) => {
                            const other = e.from === selectedHub.id ? e.to : e.from;
                            return `${hubsById[other]?.code ?? other}(${statusLabel(e.status)})`;
                          })
                          .join(", ")}
                      </p>
                    )}
                  </div>
                )}
              </section>

              <section
                aria-labelledby="exceptions-heading"
                className="flex flex-col rounded-xl border border-[var(--d3-border)] bg-[var(--d3-panel)] p-4 sm:p-5"
              >
                <div className="flex items-center justify-between gap-2">
                  <h2 id="exceptions-heading" className="d3-mono text-sm font-semibold uppercase tracking-[0.08em]">
                    예외 로그
                  </h2>
                  <span className="d3-mono text-[11px] text-[var(--d3-text-faint)]">최근 {region.exceptions.length}건</span>
                </div>
                <ul className="mt-3 max-h-96 space-y-2 overflow-y-auto pr-1">
                  {region.exceptions.map((ex) => (
                    <li
                      key={ex.id}
                      className={`rounded-lg border-l-2 bg-[var(--d3-panel-alt)] p-3 ${severityBorderClass(ex.severity)}`}
                    >
                      <div className="flex items-center gap-2">
                        <AlertTriangle aria-hidden="true" className={`h-3.5 w-3.5 shrink-0 ${severityTextClass(ex.severity)}`} />
                        <span className={`d3-mono text-[11px] font-semibold uppercase tracking-wide ${severityTextClass(ex.severity)}`}>
                          {severityLabel(ex.severity)}
                        </span>
                        <span className="d3-mono ml-auto shrink-0 text-[11px] text-[var(--d3-text-faint)]">{ex.time}</span>
                      </div>
                      <p className="mt-1 text-sm text-[var(--d3-text)]">{ex.message}</p>
                      <p className="d3-mono mt-0.5 text-[11px] text-[var(--d3-text-faint)]">{ex.hub}</p>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Throughput + Fleet */}
            <div className="grid gap-6 lg:grid-cols-2">
              <section
                aria-labelledby="throughput-heading"
                className="rounded-xl border border-[var(--d3-border)] bg-[var(--d3-panel)] p-4 sm:p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 id="throughput-heading" className="d3-mono text-sm font-semibold uppercase tracking-[0.08em]">
                    허브별 처리량
                  </h2>
                  <SegmentedControl
                    ariaLabel="처리량 지표 선택"
                    options={THROUGHPUT_METRIC_OPTIONS}
                    value={throughputMetric}
                    onChange={setThroughputMetric}
                  />
                </div>
                <ul className="mt-6 flex h-40 items-end justify-between gap-2 sm:gap-4">
                  {region.throughput.map((t) => {
                    const hub = hubsById[t.hubId];
                    const raw = throughputMetric === "volume" ? t.volume : t.onTime;
                    const max = throughputMetric === "volume" ? maxVolume : 100;
                    const pct = Math.max(4, Math.round((raw / max) * 100));
                    return (
                      <li key={t.hubId} className="flex flex-1 flex-col items-center gap-2">
                        <span className="d3-mono text-xs text-[var(--d3-text-muted)]">
                          {throughputMetric === "volume" ? raw : `${raw}%`}
                        </span>
                        <div className="flex h-28 w-full max-w-10 items-end overflow-hidden rounded-t-md border border-[var(--d3-border)] bg-[var(--d3-panel-alt)]">
                          <div
                            className="w-full rounded-t-sm bg-[var(--d3-accent)]"
                            style={{ height: `${pct}%` }}
                          />
                        </div>
                        <span className="d3-mono text-[11px] text-[var(--d3-text-faint)]">{hub?.code}</span>
                      </li>
                    );
                  })}
                </ul>
              </section>

              <section
                aria-labelledby="fleet-heading"
                className="rounded-xl border border-[var(--d3-border)] bg-[var(--d3-panel)] p-4 sm:p-5"
              >
                <h2 id="fleet-heading" className="d3-mono text-sm font-semibold uppercase tracking-[0.08em]">
                  차량 상태
                </h2>
                <div className="mt-4 flex flex-col items-center gap-5 sm:flex-row">
                  <div className="relative h-36 w-36 shrink-0">
                    <Donut segments={region.fleet} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="d3-mono text-2xl font-semibold text-[var(--d3-text)]">{fleetTotal}</span>
                      <span className="d3-mono text-[10px] text-[var(--d3-text-faint)]">가동 차량</span>
                    </div>
                  </div>
                  <ul className="w-full flex-1 space-y-2">
                    {region.fleet.map((f) => (
                      <li key={f.key} className="flex items-center gap-2.5 text-sm">
                        <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: f.color }} />
                        <span className="flex-1 text-[var(--d3-text)]">{f.label}</span>
                        <span className="d3-mono text-[var(--d3-text-muted)]">{f.value}대</span>
                        <span className="d3-mono w-10 text-right text-[var(--d3-text-faint)]">
                          {Math.round((f.value / fleetTotal) * 100)}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </div>

            {/* Manifests table */}
            <section
              aria-labelledby="manifests-heading"
              className="rounded-xl border border-[var(--d3-border)] bg-[var(--d3-panel)] p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 id="manifests-heading" className="d3-mono text-sm font-semibold uppercase tracking-[0.08em]">
                  활성 매니페스트
                </h2>
                <SegmentedControl
                  ariaLabel="매니페스트 상태 필터"
                  options={MANIFEST_FILTER_OPTIONS}
                  value={manifestFilter}
                  onChange={setManifestFilter}
                />
              </div>
              <p aria-live="polite" className="sr-only">
                {filteredManifests.length}건 표시 중
              </p>

              {filteredManifests.length > 0 ? (
                <div
                  role="region"
                  aria-label="매니페스트 표, 좌우로 스크롤 가능"
                  tabIndex={0}
                  className="mt-4 overflow-x-auto rounded-lg border border-[var(--d3-border)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--d3-accent)]"
                >
                  <table className="w-full min-w-[720px] border-collapse text-sm">
                    <caption className="sr-only">활성 매니페스트 목록, 상태별로 필터링 가능</caption>
                    <thead>
                      <tr className="border-b border-[var(--d3-border)] bg-[var(--d3-panel-alt)] text-left">
                        <th scope="col" className="d3-mono px-3 py-2.5 text-[11px] uppercase tracking-wide text-[var(--d3-text-faint)]">ID</th>
                        <th scope="col" className="d3-mono px-3 py-2.5 text-[11px] uppercase tracking-wide text-[var(--d3-text-faint)]">경로</th>
                        <th scope="col" className="d3-mono px-3 py-2.5 text-[11px] uppercase tracking-wide text-[var(--d3-text-faint)]">운송사</th>
                        <th scope="col" className="d3-mono px-3 py-2.5 text-[11px] uppercase tracking-wide text-[var(--d3-text-faint)]">도착예정</th>
                        <th scope="col" className="d3-mono px-3 py-2.5 text-[11px] uppercase tracking-wide text-[var(--d3-text-faint)]">상태</th>
                        <th scope="col" className="d3-mono px-3 py-2.5 text-[11px] uppercase tracking-wide text-[var(--d3-text-faint)]">진행률</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredManifests.map((m) => (
                        <tr key={m.id} className="border-b border-[var(--d3-border)] last:border-0">
                          <td className="d3-mono px-3 py-2.5 text-xs text-[var(--d3-text-muted)]">{m.id}</td>
                          <td className="d3-mono px-3 py-2.5 text-xs text-[var(--d3-text)]">{m.origin} → {m.destination}</td>
                          <td className="px-3 py-2.5 text-[var(--d3-text)]">{m.carrier}</td>
                          <td className="d3-mono px-3 py-2.5 text-xs text-[var(--d3-text-muted)]">{m.eta}</td>
                          <td className="px-3 py-2.5"><StatusBadge status={m.status} /></td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[var(--d3-panel-alt)]">
                                <div className="h-full rounded-full bg-[var(--d3-accent)]" style={{ width: `${m.progress}%` }} />
                              </div>
                              <span className="d3-mono text-xs text-[var(--d3-text-muted)]">{m.progress}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="mt-4 text-sm text-[var(--d3-text-muted)]">해당 상태의 매니페스트가 없습니다.</p>
              )}
            </section>
          </main>

          <footer className="border-t border-[var(--d3-border)] px-4 py-6 sm:px-6 lg:px-8">
            <p className="d3-mono text-xs text-[var(--d3-text-faint)]">MANIFEST OPS © 2026 · 데모 데이터 스냅샷</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
