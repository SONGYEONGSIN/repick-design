// 60HZ — 계통 급전 콘솔: 결정론적 더미 데이터
// Math.random / Date.now 사용 금지 (하이드레이션 안전). 모든 값은 고정 상수.

export type GenType = "solar" | "wind" | "nuclear" | "lng" | "ess";
export type BusId = "A" | "B";
export type BreakerState = "closed" | "open";
export type LoadTier = "normal" | "elevated" | "overload";
export type FreqStatus = "normal" | "caution" | "alarm";
export type Severity = "info" | "warning" | "alarm";

export interface GenSource {
  id: string;
  name: string;
  shortName: string;
  tag: string;
  type: GenType;
  capacityMW: number;
  bus: BusId;
}

export interface Substation {
  id: string;
  name: string;
  shortName: string;
  tag: string;
  voltage: string;
  capacityMW: number;
  bus: BusId;
}

export interface SnapshotGenState {
  genId: string;
  outputMW: number; // 음수 = ESS 충전(계통에서 흡수)
  breaker: BreakerState;
}

export interface SnapshotSubState {
  subId: string;
  loadMW: number;
}

export interface Snapshot {
  id: string;
  hour: number;
  label: string;
  timeLabel: string;
  asOf: string;
  frequencyHz: number;
  freqStatus: FreqStatus;
  reservePct: number;
  essSocPct: number;
  essFlowMW: number; // 양수 = 방전(공급), 음수 = 충전(흡수)
  essCapacityMWh: number;
  freqTrendMHz: number[];
  gens: SnapshotGenState[];
  subs: SnapshotSubState[];
}

export interface EventLogEntry {
  id: string;
  time: string;
  severity: Severity;
  message: string;
}

// ---------------------------------------------------------------------------
// 발전원 / 변전소 토폴로지 (계통도 구조는 스냅샷 간 고정, 상태값만 변동)
// ---------------------------------------------------------------------------

export const GEN_SOURCES: GenSource[] = [
  { id: "gen-pv1", name: "서부 태양광 1단지", shortName: "서부태양광", tag: "PV1", type: "solar", capacityMW: 180, bus: "A" },
  { id: "gen-wd1", name: "동해 해상풍력", shortName: "동해풍력", tag: "WD1", type: "wind", capacityMW: 220, bus: "A" },
  { id: "gen-lng1", name: "인천 LNG 복합화력", shortName: "인천LNG", tag: "LN1", type: "lng", capacityMW: 420, bus: "A" },
  { id: "gen-ess1", name: "중앙 ESS 스테이션", shortName: "중앙ESS", tag: "ESS", type: "ess", capacityMW: 120, bus: "A" },
  { id: "gen-pv2", name: "남부 태양광 2단지", shortName: "남부태양광", tag: "PV2", type: "solar", capacityMW: 140, bus: "B" },
  { id: "gen-nu1", name: "고리 원자력 3호기", shortName: "고리원전3호", tag: "NU1", type: "nuclear", capacityMW: 950, bus: "B" },
  { id: "gen-lng2", name: "평택 LNG 복합화력", shortName: "평택LNG", tag: "LN2", type: "lng", capacityMW: 380, bus: "B" },
];

export const SUBSTATIONS: Substation[] = [
  { id: "sub-il", name: "일산변전소", shortName: "일산", tag: "IL", voltage: "154kV", capacityMW: 300, bus: "A" },
  { id: "sub-gs", name: "강서변전소", shortName: "강서", tag: "GS", voltage: "154kV", capacityMW: 380, bus: "A" },
  { id: "sub-yd", name: "영등포변전소", shortName: "영등포", tag: "YD", voltage: "154kV", capacityMW: 340, bus: "A" },
  { id: "sub-sw", name: "수원변전소", shortName: "수원", tag: "SW", voltage: "154kV", capacityMW: 360, bus: "B" },
  { id: "sub-bp", name: "분당변전소", shortName: "분당", tag: "BP", voltage: "154kV", capacityMW: 430, bus: "B" },
  { id: "sub-ic", name: "인천변전소", shortName: "인천", tag: "IC", voltage: "154kV", capacityMW: 400, bus: "B" },
];

export const ESS_CAPACITY_MWH = 480;

// ---------------------------------------------------------------------------
// 스냅샷 3종 — 하루 중 세 시점의 급전 상태 (심야 저부하 / 오전 태양피크 / 저녁피크)
// ---------------------------------------------------------------------------

export const SNAPSHOTS: Snapshot[] = [
  {
    id: "snap-night",
    hour: 3,
    label: "심야 저부하",
    timeLabel: "03:00",
    asOf: "2026-07-04 03:00:00 KST",
    frequencyHz: 60.021,
    freqStatus: "normal",
    reservePct: 18.4,
    essSocPct: 42,
    essFlowMW: -60,
    essCapacityMWh: ESS_CAPACITY_MWH,
    freqTrendMHz: [6, 7, 9, 8, 11, 13, 12, 15, 17, 16, 19, 21],
    gens: [
      { genId: "gen-pv1", outputMW: 0, breaker: "closed" },
      { genId: "gen-wd1", outputMW: 150, breaker: "closed" },
      { genId: "gen-lng1", outputMW: 80, breaker: "closed" },
      { genId: "gen-ess1", outputMW: -60, breaker: "closed" },
      { genId: "gen-pv2", outputMW: 0, breaker: "closed" },
      { genId: "gen-nu1", outputMW: 900, breaker: "closed" },
      { genId: "gen-lng2", outputMW: 0, breaker: "open" },
    ],
    subs: [
      { subId: "sub-il", loadMW: 130 },
      { subId: "sub-gs", loadMW: 190 },
      { subId: "sub-yd", loadMW: 150 },
      { subId: "sub-sw", loadMW: 180 },
      { subId: "sub-bp", loadMW: 210 },
      { subId: "sub-ic", loadMW: 190 },
    ],
  },
  {
    id: "snap-solar",
    hour: 13,
    label: "오전 태양 피크",
    timeLabel: "13:00",
    asOf: "2026-07-04 13:00:00 KST",
    frequencyHz: 60.004,
    freqStatus: "normal",
    reservePct: 9.8,
    essSocPct: 58,
    essFlowMW: -40,
    essCapacityMWh: ESS_CAPACITY_MWH,
    freqTrendMHz: [2, 3, 1, 4, 3, 5, 4, 6, 5, 7, 6, 4],
    gens: [
      { genId: "gen-pv1", outputMW: 165, breaker: "closed" },
      { genId: "gen-wd1", outputMW: 90, breaker: "closed" },
      { genId: "gen-lng1", outputMW: 150, breaker: "closed" },
      { genId: "gen-ess1", outputMW: -40, breaker: "closed" },
      { genId: "gen-pv2", outputMW: 128, breaker: "closed" },
      { genId: "gen-nu1", outputMW: 930, breaker: "closed" },
      { genId: "gen-lng2", outputMW: 120, breaker: "closed" },
    ],
    subs: [
      { subId: "sub-il", loadMW: 190 },
      { subId: "sub-gs", loadMW: 260 },
      { subId: "sub-yd", loadMW: 240 },
      { subId: "sub-sw", loadMW: 260 },
      { subId: "sub-bp", loadMW: 300 },
      { subId: "sub-ic", loadMW: 258 },
    ],
  },
  {
    id: "snap-peak",
    hour: 19,
    label: "저녁 피크",
    timeLabel: "19:00",
    asOf: "2026-07-04 19:00:00 KST",
    frequencyHz: 59.912,
    freqStatus: "caution",
    reservePct: 4.1,
    essSocPct: 31,
    essFlowMW: 95,
    essCapacityMWh: ESS_CAPACITY_MWH,
    freqTrendMHz: [-5, -10, -18, -24, -33, -41, -52, -61, -70, -78, -84, -88],
    gens: [
      { genId: "gen-pv1", outputMW: 20, breaker: "closed" },
      { genId: "gen-wd1", outputMW: 130, breaker: "closed" },
      { genId: "gen-lng1", outputMW: 410, breaker: "closed" },
      { genId: "gen-ess1", outputMW: 95, breaker: "closed" },
      { genId: "gen-pv2", outputMW: 15, breaker: "closed" },
      { genId: "gen-nu1", outputMW: 945, breaker: "closed" },
      { genId: "gen-lng2", outputMW: 365, breaker: "closed" },
    ],
    subs: [
      { subId: "sub-il", loadMW: 250 },
      { subId: "sub-gs", loadMW: 330 },
      { subId: "sub-yd", loadMW: 300 },
      { subId: "sub-sw", loadMW: 340 },
      { subId: "sub-bp", loadMW: 380 },
      { subId: "sub-ic", loadMW: 332 },
    ],
  },
];

export const EVENTS: EventLogEntry[] = [
  { id: "ev-1", time: "19:02", severity: "alarm", message: "수원변전소 부하율 94.4% 도달 — 과부하 주의보 발령" },
  { id: "ev-2", time: "19:00", severity: "warning", message: "계통주파수 59.912Hz — 하한 대역 근접, 예비력 4.1%" },
  { id: "ev-3", time: "18:45", severity: "info", message: "중앙 ESS 스테이션 방전 모드 전환 (+95MW)" },
  { id: "ev-4", time: "17:30", severity: "info", message: "평택 LNG 복합화력 출력 증발, 저녁 피크 대비 증출" },
  { id: "ev-5", time: "13:00", severity: "info", message: "재생에너지 비중 30% 도달 — 오전 태양광 최대출력" },
  { id: "ev-6", time: "03:40", severity: "info", message: "중앙 ESS 스테이션 충전 모드 시작 — 심야 잉여전력 흡수" },
  { id: "ev-7", time: "03:00", severity: "info", message: "평택 LNG 2호기 정지 — 심야 경부하 대응 (모선B)" },
];

// ---------------------------------------------------------------------------
// 일일 수급 패턴 (참고용 24시간 곡선 — 스냅샷 3종과 별개의 대표 패턴)
// ---------------------------------------------------------------------------

export const DAILY_DEMAND_MW: number[] = [
  1010, 980, 1010, 1050, 1090, 1150, 1260, 1380, 1470, 1520, 1560, 1590,
  1560, 1508, 1540, 1600, 1700, 1820, 1900, 1932, 1890, 1780, 1560, 1250,
];

const DAILY_RENEWABLE_PCT: number[] = [
  6, 5, 5, 6, 7, 8, 10, 14, 19, 23, 26, 28, 29, 28, 26, 22, 17, 11, 7, 6, 6, 6, 6, 6,
];

const DAILY_NUCLEAR_PCT: number[] = [
  86, 88, 87, 85, 82, 79, 73, 66, 62, 60, 58, 57, 58, 60, 59, 57, 53, 50, 48, 48, 49, 51, 57, 70,
];

export interface DailyPoint {
  hour: number;
  demandMW: number;
  renewableMW: number;
  nuclearMW: number;
  thermalMW: number;
}

export function buildDailyMix(): DailyPoint[] {
  return DAILY_DEMAND_MW.map((demandMW, hour) => {
    const renewableMW = Math.round((demandMW * DAILY_RENEWABLE_PCT[hour]) / 100);
    const nuclearMW = Math.round((demandMW * DAILY_NUCLEAR_PCT[hour]) / 100);
    const thermalMW = demandMW - renewableMW - nuclearMW;
    return { hour, demandMW, renewableMW, nuclearMW, thermalMW };
  });
}

// ---------------------------------------------------------------------------
// 헬퍼
// ---------------------------------------------------------------------------

export const mwFormatter = new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 });
export const hzFormatter = new Intl.NumberFormat("ko-KR", {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
});
export const pctFormatter = new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 1 });
export const mwhFormatter = new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 });

export function getGenSource(id: string): GenSource | undefined {
  return GEN_SOURCES.find((g) => g.id === id);
}

export function getSubstation(id: string): Substation | undefined {
  return SUBSTATIONS.find((s) => s.id === id);
}

export function loadTier(ratioPct: number): LoadTier {
  if (ratioPct >= 90) return "overload";
  if (ratioPct >= 70) return "elevated";
  return "normal";
}

export const LOAD_TIER_LABEL: Record<LoadTier, string> = {
  normal: "정상",
  elevated: "주의",
  overload: "과부하",
};

export const GEN_TYPE_LABEL: Record<GenType, string> = {
  solar: "태양광",
  wind: "풍력",
  nuclear: "원자력",
  lng: "LNG",
  ess: "ESS",
};

// 급전 우선순위(한계비용 기준 merit order) — 낮을수록 먼저 급전
export const MERIT_ORDER: Record<GenType, number> = {
  nuclear: 1,
  wind: 2,
  solar: 3,
  lng: 4,
  ess: 5,
};

export const FREQ_STATUS_LABEL: Record<FreqStatus, string> = {
  normal: "정상",
  caution: "주의",
  alarm: "경보",
};

export const SEVERITY_LABEL: Record<Severity, string> = {
  info: "정보",
  warning: "경고",
  alarm: "경보",
};
