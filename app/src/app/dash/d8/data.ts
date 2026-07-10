/**
 * BEEACON — 도시 양봉 네트워크 관제 더미 데이터
 *
 * 결정론적으로 생성한다 (Math.random / Date.now 미사용) — 서버 렌더와
 * 클라이언트 하이드레이션이 동일한 값을 계산해야 하이드레이션 불일치가
 * 나지 않는다.
 */

export type HiveStatus = "healthy" | "warning" | "danger" | "offline";

export interface WeightPoint {
  label: string;
  value: number;
}

export interface TrafficBucket {
  label: string;
  in: number;
  out: number;
}

export interface Hive {
  id: string;
  no: number;
  name: string;
  district: string;
  status: HiveStatus;
  issue: string | null;
  temp: number | null;
  humidity: number | null;
  weightKg: number;
  weightDeltaKg: number;
  forageBearingDeg: number;
  forageConfidence: number;
  forageDistanceKm: number;
  weight24h: WeightPoint[];
  weight7d: WeightPoint[];
  weight30d: WeightPoint[];
  traffic: TrafficBucket[];
  lastSeen: string;
}

export const DISTRICTS = ["성수", "한남", "합정", "연남", "을지로"] as const;

export const TIME_RANGES = [
  { key: "24h", label: "24시간" },
  { key: "7d", label: "7일" },
  { key: "30d", label: "30일" },
] as const;

export type TimeRangeKey = (typeof TIME_RANGES)[number]["key"];

export const STATUS_META: Record<
  HiveStatus,
  { label: string; badgeBg: string; badgeText: string; hexBg: string; hexText: string }
> = {
  healthy: {
    label: "정상",
    badgeBg: "bg-[#D8F0DD]",
    badgeText: "text-[#176A34]",
    hexBg: "bg-[#3FA65A]",
    hexText: "text-[#241233]",
  },
  warning: {
    label: "주의",
    badgeBg: "bg-[#FFEFC7]",
    badgeText: "text-[#7A4E00]",
    hexBg: "bg-[#FFB627]",
    hexText: "text-[#241233]",
  },
  danger: {
    label: "위험",
    badgeBg: "bg-[#FFE1E8]",
    badgeText: "text-[#B0223A]",
    hexBg: "bg-[#FF5D8F]",
    hexText: "text-[#241233]",
  },
  offline: {
    label: "오프라인",
    badgeBg: "bg-[#EDEAE2]",
    badgeText: "text-[#4A4458]",
    hexBg: "bg-[#C9C2D6]",
    hexText: "text-[#241233]",
  },
};

/* --------------------------------------------------------------- */
/* 결정론적 PRNG — 문자열 시드 기반, 서버/클라이언트 동일 출력 보장 */
/* --------------------------------------------------------------- */

function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let t = seed;
  return function rng() {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const STATUS_OVERRIDES: Record<number, { status: HiveStatus; issue: string }> = {
  7: { status: "danger", issue: "응애(바로아) 감염 의심 — 즉시 점검 필요" },
  18: { status: "danger", issue: "벌통 내부 39.2°C 급상승 — 환기 확인" },
  3: { status: "warning", issue: "일벌 유입량 전일 대비 -32%" },
  11: { status: "warning", issue: "내부 습도 낮음 (41%)" },
  15: { status: "warning", issue: "센서 배터리 18% 남음" },
  21: { status: "warning", issue: "꿀 저장량 5일째 정체" },
  24: { status: "warning", issue: "센서 응답 지연 (12분)" },
  25: { status: "offline", issue: "통신 두절 — 마지막 신호 6시간 전" },
};

const D7_TICKS = ["-6일", "-5일", "-4일", "-3일", "-2일", "-1일", "오늘"];

function buildWeight24h(rng: () => number, base: number, drift: number): WeightPoint[] {
  const points: WeightPoint[] = [];
  for (let i = 0; i < 24; i++) {
    const forageCurve = Math.sin(((i - 6) / 24) * Math.PI * 2) * 0.35;
    const noise = (rng() - 0.5) * 0.12;
    const value = base - 0.5 + (i / 23) * drift * 0.15 + forageCurve + noise;
    points.push({
      label: i % 4 === 0 ? `${String(i).padStart(2, "0")}시` : "",
      value: Math.round(value * 100) / 100,
    });
  }
  return points;
}

function buildWeight7d(rng: () => number, base: number, drift: number): WeightPoint[] {
  const points: WeightPoint[] = [];
  for (let i = 0; i < 7; i++) {
    const noise = (rng() - 0.5) * 0.4;
    const value = base - drift + (i / 6) * drift * 1.6 + noise;
    points.push({ label: D7_TICKS[i], value: Math.round(value * 100) / 100 });
  }
  points[6] = { label: "오늘", value: base };
  return points;
}

function buildWeight30d(rng: () => number, base: number, drift: number): WeightPoint[] {
  const points: WeightPoint[] = [];
  for (let i = 0; i < 30; i++) {
    const noise = (rng() - 0.5) * 0.9;
    const seasonal = Math.sin((i / 30) * Math.PI) * 1.4;
    const value = base - drift * 2.2 + (i / 29) * drift * 3.2 + seasonal + noise;
    points.push({
      label: i % 6 === 0 ? `-${29 - i}일` : i === 29 ? "오늘" : "",
      value: Math.round(value * 100) / 100,
    });
  }
  points[29] = { ...points[29], label: "오늘", value: base };
  return points;
}

function buildTraffic(rng: () => number, intensity: number): TrafficBucket[] {
  const labels = ["00", "02", "04", "06", "08", "10", "12", "14", "16", "18", "20", "22"];
  return labels.map((label, i) => {
    const curve = Math.max(0, Math.sin(((i - 1) / 12) * Math.PI));
    const inCount = Math.round(curve * intensity * (0.85 + rng() * 0.3));
    const outCount = Math.round(curve * intensity * (0.75 + rng() * 0.3));
    return { label: `${label}시`, in: inCount, out: outCount };
  });
}

function generateHive(no: number): Hive {
  const id = `H${String(no).padStart(2, "0")}`;
  const rng = mulberry32(hashSeed(id));
  const override = STATUS_OVERRIDES[no];
  const status: HiveStatus = override?.status ?? "healthy";
  const district = DISTRICTS[no % DISTRICTS.length];

  const isOffline = status === "offline";
  const isDanger = status === "danger";
  const isWarning = status === "warning";

  const baseTemp = 34.4 + (rng() - 0.5) * 1.4;
  const temp = isOffline ? null : isDanger ? 38.6 + rng() * 1.2 : isWarning ? 33.0 + rng() * 1.6 : baseTemp;
  const humidity = isOffline ? null : isWarning ? 40 + rng() * 6 : 55 + rng() * 9;

  const baseWeight = 21 + rng() * 18;
  const drift = isDanger ? -(1.1 + rng() * 0.9) : isWarning ? 0.1 + rng() * 0.3 : 1.4 + rng() * 1.6;
  const weightKg = Math.round((baseWeight + (isDanger ? -drift : drift * 0.6)) * 10) / 10;
  const weightDeltaKg = Math.round(drift * (isDanger ? -1 : 1) * 10) / 10;

  const intensity = isOffline ? 0 : isDanger ? 18 : isWarning ? 34 : 58 + rng() * 30;

  return {
    id,
    no,
    name: `${no}호기`,
    district,
    status,
    issue: override?.issue ?? null,
    temp: temp === null ? null : Math.round(temp * 10) / 10,
    humidity: humidity === null ? null : Math.round(humidity),
    weightKg,
    weightDeltaKg,
    forageBearingDeg: Math.round(rng() * 360),
    forageConfidence: Math.round((0.42 + rng() * 0.5) * 100) / 100,
    forageDistanceKm: Math.round((0.6 + rng() * 2.1) * 10) / 10,
    weight24h: buildWeight24h(rng, weightKg, weightDeltaKg),
    weight7d: buildWeight7d(rng, weightKg, weightDeltaKg),
    weight30d: buildWeight30d(rng, weightKg, weightDeltaKg),
    traffic: buildTraffic(rng, intensity),
    lastSeen: isOffline ? "6시간 전" : "방금 전",
  };
}

export const HIVES: Hive[] = Array.from({ length: 26 }, (_, i) => generateHive(i + 1));

export function getWeightSeries(hive: Hive, range: TimeRangeKey): WeightPoint[] {
  if (range === "24h") return hive.weight24h;
  if (range === "7d") return hive.weight7d;
  return hive.weight30d;
}

/* --------------------------------------------------------------- */
/* 네트워크 집계                                                    */
/* --------------------------------------------------------------- */

export function computeNetworkStats(hives: Hive[]) {
  const total = hives.length;
  const active = hives.filter((h) => h.status !== "offline").length;
  const dangerCount = hives.filter((h) => h.status === "danger").length;
  const warningCount = hives.filter((h) => h.status === "warning").length;
  const onlineHives = hives.filter((h) => h.temp !== null);
  const avgTemp = onlineHives.reduce((sum, h) => sum + (h.temp ?? 0), 0) / onlineHives.length;
  const honeyDeltaTotal = hives.reduce((sum, h) => sum + h.weightDeltaKg, 0);
  return {
    total,
    active,
    dangerCount,
    warningCount,
    avgTemp: Math.round(avgTemp * 10) / 10,
    honeyDeltaTotal: Math.round(honeyDeltaTotal * 10) / 10,
  };
}

export const NETWORK_BUZZ_SCORE = 87;

export interface AlertItem {
  id: string;
  hiveId: string;
  hiveName: string;
  severity: "danger" | "warning";
  message: string;
  time: string;
}

export const ALERTS: AlertItem[] = [
  {
    id: "a1",
    hiveId: "H07",
    hiveName: "7호기",
    severity: "danger",
    message: "응애(바로아) 감염 의심 패턴 감지 — 현장 점검 요청됨",
    time: "12분 전",
  },
  {
    id: "a2",
    hiveId: "H18",
    hiveName: "18호기",
    severity: "danger",
    message: "벌통 내부 온도 39.2°C까지 급상승, 환기구 확인 필요",
    time: "27분 전",
  },
  {
    id: "a3",
    hiveId: "H03",
    hiveName: "3호기",
    severity: "warning",
    message: "일벌 유입량이 전일 대비 32% 감소",
    time: "1시간 전",
  },
  {
    id: "a4",
    hiveId: "H25",
    hiveName: "25호기",
    severity: "warning",
    message: "통신 두절 — 마지막 신호 6시간 전 (합정)",
    time: "2시간 전",
  },
  {
    id: "a5",
    hiveId: "H15",
    hiveName: "15호기",
    severity: "warning",
    message: "센서 배터리 18% — 교체 방문 예약 권장",
    time: "3시간 전",
  },
];

export interface DistrictStat {
  district: string;
  pollinationIndex: number;
  hiveCount: number;
}

export const DISTRICT_LEADERBOARD: DistrictStat[] = DISTRICTS.map((district, i) => {
  const hives = HIVES.filter((h) => h.district === district);
  const rng = mulberry32(hashSeed(`district-${district}`));
  const activityBonus = hives.filter((h) => h.status === "healthy").length * 3;
  const pollinationIndex = Math.min(99, Math.round(48 + activityBonus + rng() * 14 - i));
  return { district, pollinationIndex, hiveCount: hives.length };
}).sort((a, b) => b.pollinationIndex - a.pollinationIndex);
