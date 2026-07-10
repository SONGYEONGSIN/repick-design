/**
 * VELA — Deep-Space Ops 더미 데이터.
 * 전부 정적 스냅샷(결정론적 값)이다. Math.random / Date.now 미사용.
 * 스냅샷 기준 시각은 문자열 상수로 고정 — "실시간인 척" 하지 않는다.
 */

export const SNAPSHOT_LABEL = "스냅샷 기준 2026-07-11 03:41 UTC";

export type SpacecraftStatus = "nominal" | "degraded" | "critical" | "dormant";
export type Band = "X" | "Ka" | "S";
export type OrbitRing = 1 | 2 | 3 | 4;

export interface Spacecraft {
  id: string;
  name: string;
  mission: string;
  status: SpacecraftStatus;
  band: Band;
  distanceAu: number;
  signalDbm: number;
  signalTrend: number[];
  lastContactHrsAgo: number;
  nextWindowHrsIn: number;
  ring: OrbitRing;
  angleDeg: number;
  inContact: boolean;
}

export const SPACECRAFT: Spacecraft[] = [
  {
    id: "auriga-3",
    name: "AURIGA-3",
    mission: "화성 전이궤도 중계",
    status: "nominal",
    band: "Ka",
    distanceAu: 0.62,
    signalDbm: -77,
    signalTrend: [-77, -74, -72, -72, -73, -75, -78, -81, -83, -84, -83, -81],
    lastContactHrsAgo: 0.1,
    nextWindowHrsIn: 0,
    ring: 3,
    angleDeg: 25,
    inContact: true,
  },
  {
    id: "pallas-scout",
    name: "PALLAS SCOUT",
    mission: "소행성대 근접비행",
    status: "nominal",
    band: "X",
    distanceAu: 2.8,
    signalDbm: -93,
    signalTrend: [-93, -92, -92, -93, -94, -95, -97, -98, -99, -100, -100, -99],
    lastContactHrsAgo: 4.2,
    nextWindowHrsIn: 4,
    ring: 4,
    angleDeg: 100,
    inContact: false,
  },
  {
    id: "helios-relay-1",
    name: "HELIOS RELAY-1",
    mission: "태양권 감시 중계",
    status: "degraded",
    band: "Ka",
    distanceAu: 1.02,
    signalDbm: -95,
    signalTrend: [-95, -98, -103, -107, -109, -108, -105, -100, -96, -93, -93, -96],
    lastContactHrsAgo: 1.5,
    nextWindowHrsIn: 9,
    ring: 3,
    angleDeg: 200,
    inContact: false,
  },
  {
    id: "nereid-probe",
    name: "NEREID PROBE",
    mission: "해왕성 플라이바이 준비",
    status: "dormant",
    band: "X",
    distanceAu: 29.4,
    signalDbm: -117,
    signalTrend: [-117, -116, -115, -115, -115, -115, -116, -116, -117, -118, -119, -120],
    lastContactHrsAgo: 58,
    nextWindowHrsIn: 36,
    ring: 4,
    angleDeg: 260,
    inContact: false,
  },
  {
    id: "icarus-vii",
    name: "ICARUS-VII",
    mission: "지구 근접 소행성 관측",
    status: "nominal",
    band: "S",
    distanceAu: 0.08,
    signalDbm: -59,
    signalTrend: [-59, -61, -64, -67, -69, -68, -65, -62, -60, -59, -61, -64],
    lastContactHrsAgo: 0.8,
    nextWindowHrsIn: 6,
    ring: 1,
    angleDeg: 320,
    inContact: false,
  },
  {
    id: "tessera-12",
    name: "TESSERA-12",
    mission: "큐브샛 군집 노드 12",
    status: "critical",
    band: "S",
    distanceAu: 0.003,
    signalDbm: -108,
    signalTrend: [-108, -101, -100, -106, -114, -119, -116, -108, -100, -100, -106, -114],
    lastContactHrsAgo: 0.05,
    nextWindowHrsIn: 0,
    ring: 1,
    angleDeg: 60,
    inContact: true,
  },
  {
    id: "borealis-lander",
    name: "BOREALIS LANDER",
    mission: "달 남극 착륙선 중계",
    status: "nominal",
    band: "Ka",
    distanceAu: 0.0026,
    signalDbm: -69,
    signalTrend: [-69, -71, -73, -74, -75, -75, -74, -72, -70, -68, -67, -67],
    lastContactHrsAgo: 0.3,
    nextWindowHrsIn: 1,
    ring: 2,
    angleDeg: 150,
    inContact: true,
  },
  {
    id: "voyage-echo",
    name: "VOYAGE ECHO",
    mission: "성간공간 관측 임무",
    status: "dormant",
    band: "X",
    distanceAu: 42.1,
    signalDbm: -122,
    signalTrend: [-122, -122, -122, -122, -123, -123, -124, -124, -125, -125, -125, -126],
    lastContactHrsAgo: 140,
    nextWindowHrsIn: 48,
    ring: 4,
    angleDeg: 340,
    inContact: false,
  },
];

export type AntennaStatus = "online" | "maintenance" | "offline";

export interface AntennaSite {
  id: string;
  name: string;
  location: string;
  diameterM: number;
  status: AntennaStatus;
  utilizationPct: number;
}

export const ANTENNAS: AntennaSite[] = [
  { id: "atacama", name: "ATACAMA ARRAY", location: "칠레 아타카마", diameterM: 34, status: "online", utilizationPct: 82 },
  { id: "karoo", name: "KAROO DEEP FIELD", location: "남아공 카루", diameterM: 40, status: "online", utilizationPct: 67 },
  { id: "svalbard", name: "SVALBARD RELAY", location: "노르웨이 스발바르", diameterM: 18, status: "maintenance", utilizationPct: 12 },
  { id: "woomera", name: "WOOMERA STATION", location: "호주 우메라", diameterM: 70, status: "online", utilizationPct: 91 },
];

export type Priority = "critical" | "standard" | "low";

export interface ContactWindow {
  id: string;
  antennaId: string;
  spacecraftId: string;
  startHour: number;
  durationHr: number;
  band: Band;
  priority: Priority;
}

export const CONTACT_WINDOWS: ContactWindow[] = [
  { id: "cw1", antennaId: "atacama", spacecraftId: "auriga-3", startHour: 0, durationHr: 2.5, band: "Ka", priority: "critical" },
  { id: "cw2", antennaId: "woomera", spacecraftId: "tessera-12", startHour: 0.5, durationHr: 1, band: "S", priority: "critical" },
  { id: "cw3", antennaId: "karoo", spacecraftId: "borealis-lander", startHour: 1, durationHr: 3, band: "Ka", priority: "standard" },
  { id: "cw4", antennaId: "atacama", spacecraftId: "pallas-scout", startHour: 4, durationHr: 2, band: "X", priority: "standard" },
  { id: "cw5", antennaId: "woomera", spacecraftId: "icarus-vii", startHour: 6, durationHr: 1.5, band: "S", priority: "standard" },
  { id: "cw6", antennaId: "karoo", spacecraftId: "helios-relay-1", startHour: 9, durationHr: 4, band: "Ka", priority: "standard" },
  { id: "cw7", antennaId: "atacama", spacecraftId: "helios-relay-1", startHour: 26, durationHr: 2, band: "Ka", priority: "standard" },
  { id: "cw8", antennaId: "svalbard", spacecraftId: "nereid-probe", startHour: 36, durationHr: 3, band: "X", priority: "low" },
  { id: "cw9", antennaId: "woomera", spacecraftId: "voyage-echo", startHour: 48, durationHr: 5, band: "X", priority: "low" },
  { id: "cw10", antennaId: "karoo", spacecraftId: "auriga-3", startHour: 52, durationHr: 2, band: "Ka", priority: "critical" },
  { id: "cw11", antennaId: "atacama", spacecraftId: "tessera-12", startHour: 70, durationHr: 1, band: "S", priority: "standard" },
  { id: "cw12", antennaId: "woomera", spacecraftId: "pallas-scout", startHour: 96, durationHr: 2.5, band: "X", priority: "standard" },
  { id: "cw13", antennaId: "karoo", spacecraftId: "icarus-vii", startHour: 120, durationHr: 1.5, band: "S", priority: "low" },
  { id: "cw14", antennaId: "atacama", spacecraftId: "borealis-lander", startHour: 150, durationHr: 3, band: "Ka", priority: "standard" },
];

export type TimeRangeKey = "24h" | "72h" | "7d";

export const TIME_RANGES: { key: TimeRangeKey; label: string; hours: number }[] = [
  { key: "24h", label: "24시간", hours: 24 },
  { key: "72h", label: "72시간", hours: 72 },
  { key: "7d", label: "7일", hours: 168 },
];

/* ---------------------------------------------------------------------- */
/* 우주 기상                                                                */
/* ---------------------------------------------------------------------- */

export const SOLAR_WIND_SPEED_KMS = 524;
export const SOLAR_WIND_MIN = 300;
export const SOLAR_WIND_MAX = 750;
export const KP_INDEX_NOW = 5;
export const KP_SERIES_24H = [5, 5, 4, 4, 2, 1, 3, 5];
export const RADIATION_RISK: "낮음" | "보통" | "높음" = "보통";
export const STORM_WATCH = {
  active: true,
  message: "지자기 소폭풍 경보 — Kp 5 도달. Ka-대역 링크 여유도 저하 가능, X-대역 전환 권장.",
};

export const WIND_FORECAST: Record<TimeRangeKey, number[]> = {
  "24h": [525, 563, 574, 561, 536, 514, 502, 497, 488, 466, 428, 386, 356, 351, 377, 423, 471, 507, 523, 524, 523, 529, 543, 555],
  "72h": [605, 585, 532, 495, 482, 459, 403, 342, 330, 387, 478, 540, 552, 542, 547, 561, 543, 472, 380, 330, 351, 409, 455, 472],
  "7d": [567, 499, 458, 443, 424, 378, 322, 300, 343, 437, 530, 577, 572, 549, 540, 545, 530, 469, 377, 303, 291, 343, 419, 472, 492, 504, 537, 587],
};

/* ---------------------------------------------------------------------- */
/* 관측 대기열 (심우주 관측 타겟)                                              */
/* ---------------------------------------------------------------------- */

export type TargetStatus = "대기" | "관측중" | "완료";

export interface ObservationTarget {
  id: string;
  name: string;
  priorityRank: number;
  distanceLy: number;
  instrument: "분광기" | "적외선 카메라" | "편광계";
  queuedHrs: number;
  status: TargetStatus;
}

export const OBSERVATION_TARGETS: ObservationTarget[] = [
  { id: "trappist-1e", name: "TRAPPIST-1e", priorityRank: 1, distanceLy: 40.7, instrument: "분광기", queuedHrs: 6, status: "대기" },
  { id: "k2-18b", name: "K2-18 b", priorityRank: 2, distanceLy: 124, instrument: "적외선 카메라", queuedHrs: 18, status: "대기" },
  { id: "proxima-b", name: "Proxima Centauri b", priorityRank: 3, distanceLy: 4.2, instrument: "편광계", queuedHrs: 2, status: "관측중" },
  { id: "toi-700d", name: "TOI-700 d", priorityRank: 4, distanceLy: 101.4, instrument: "분광기", queuedHrs: 30, status: "대기" },
  { id: "55-cancri-e", name: "55 Cancri e", priorityRank: 5, distanceLy: 41, instrument: "적외선 카메라", queuedHrs: 44, status: "대기" },
  { id: "hd209458b", name: "HD 209458 b", priorityRank: 6, distanceLy: 159, instrument: "분광기", queuedHrs: 55, status: "완료" },
];

/* ---------------------------------------------------------------------- */
/* 헬퍼                                                                     */
/* ---------------------------------------------------------------------- */

export function formatHours(h: number): string {
  if (h <= 0) return "지금 접속 중";
  if (h < 1) return `${Math.round(h * 60)}분 후`;
  const whole = Math.floor(h);
  const min = Math.round((h - whole) * 60);
  return min > 0 ? `${whole}시간 ${min}분 후` : `${whole}시간 후`;
}

export function formatAgo(h: number): string {
  if (h < 1) return `${Math.round(h * 60)}분 전`;
  if (h < 24) return `${h.toFixed(1)}시간 전`;
  return `${Math.round(h / 24)}일 전`;
}

export function computeFleetSummary(list: Spacecraft[]) {
  const active = list.filter((s) => s.status !== "dormant").length;
  const nominal = list.filter((s) => s.status === "nominal").length;
  const avgSignal = Math.round(list.reduce((sum, s) => sum + s.signalDbm, 0) / list.length);
  const nextWindow = Math.min(...list.filter((s) => s.nextWindowHrsIn > 0).map((s) => s.nextWindowHrsIn));
  return { active, total: list.length, nominal, avgSignal, nextWindow };
}

export function computeAntennaUptime(list: AntennaSite[]): number {
  const online = list.filter((a) => a.status === "online").length;
  return Math.round((online / list.length) * 1000) / 10;
}
