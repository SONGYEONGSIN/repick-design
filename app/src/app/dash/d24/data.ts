// ASPECT — CTC 관제 콘솔: 결정론적 더미 데이터 + 도메인 계산 헬퍼
// Math.random / Date.now 미사용 — 서버/클라이언트 하이드레이션 안전.

export type Aspect = "clear" | "caution" | "stop" | "restrict";
export type DelayLevel = "onTime" | "minor" | "major";
export type Direction = "up" | "down";
export type Category = "IC" | "RE" | "FR";

export interface Station {
  id: string;
  name: string;
  km: number;
}

export interface Waypoint {
  t: number; // 06:00 기준 경과 분
  km: number;
}

export interface Train {
  id: string;
  category: Category;
  direction: Direction;
  delayMin: number;
  nextStationId: string;
  etaMin: number;
  origin: string;
  destination: string;
  waypoints: Waypoint[];
}

export const LINE_NAME = "MERIDIAN SUBDIVISION";
export const LINE_KM = 84.3;
export const WINDOW_MIN = 240; // 06:00–10:00
export const NOW_T = 102; // 07:42 스냅샷

export const STATIONS: Station[] = [
  { id: "AUG", name: "Augustine Jct.", km: 0 },
  { id: "BEL", name: "Belfry", km: 11.4 },
  { id: "CAI", name: "Cairngate", km: 26.8 },
  { id: "DUN", name: "Dunmore", km: 41.2 },
  { id: "ELD", name: "Eldridge", km: 58.5 },
  { id: "FAL", name: "Falkirk Yard", km: 71.0 },
  { id: "GRA", name: "Granby Central", km: 84.3 },
];

export const TRAINS: Train[] = [
  {
    id: "IC 204",
    category: "IC",
    direction: "up",
    delayMin: 0,
    nextStationId: "GRA",
    etaMin: 1,
    origin: "AUG",
    destination: "GRA",
    waypoints: [
      { t: 48, km: 0 },
      { t: 55, km: 0 },
      { t: 74, km: 26.8 },
      { t: 75, km: 26.8 },
      { t: 93, km: 58.5 },
      { t: 94, km: 58.5 },
      { t: 103, km: 84.3 },
      { t: 112, km: 84.3 },
    ],
  },
  {
    id: "IC 209",
    category: "IC",
    direction: "down",
    delayMin: 0,
    nextStationId: "FAL",
    etaMin: 20,
    origin: "GRA",
    destination: "AUG",
    waypoints: [
      { t: 95, km: 84.3 },
      { t: 108, km: 84.3 },
      { t: 122, km: 71.0 },
      { t: 123, km: 71.0 },
      { t: 145, km: 58.5 },
      { t: 146, km: 58.5 },
      { t: 170, km: 41.2 },
      { t: 171, km: 41.2 },
      { t: 195, km: 26.8 },
      { t: 196, km: 26.8 },
      { t: 220, km: 11.4 },
      { t: 221, km: 11.4 },
      { t: 240, km: 0 },
    ],
  },
  {
    id: "RE 118",
    category: "RE",
    direction: "up",
    delayMin: 3,
    nextStationId: "CAI",
    etaMin: 16,
    origin: "AUG",
    destination: "GRA",
    waypoints: [
      { t: 52, km: 0 },
      { t: 60, km: 0 },
      { t: 85, km: 11.4 },
      { t: 87, km: 11.4 },
      { t: 118, km: 26.8 },
      { t: 120, km: 26.8 },
      { t: 150, km: 41.2 },
      { t: 151, km: 41.2 },
      { t: 175, km: 58.5 },
      { t: 176, km: 58.5 },
      { t: 195, km: 71.0 },
      { t: 197, km: 71.0 },
      { t: 220, km: 84.3 },
    ],
  },
  {
    id: "FR 3390",
    category: "FR",
    direction: "up",
    delayMin: 12,
    nextStationId: "DUN",
    etaMin: 38,
    origin: "AUG",
    destination: "GRA",
    waypoints: [
      { t: 10, km: 0 },
      { t: 25, km: 0 },
      { t: 55, km: 11.4 },
      { t: 95, km: 26.8 },
      { t: 140, km: 41.2 },
      { t: 175, km: 58.5 },
      { t: 210, km: 71.0 },
      { t: 238, km: 80.5 },
    ],
  },
  {
    id: "FR 3402",
    category: "FR",
    direction: "down",
    delayMin: 0,
    nextStationId: "ELD",
    etaMin: 13,
    origin: "GRA",
    destination: "AUG",
    waypoints: [
      { t: 60, km: 84.3 },
      { t: 70, km: 84.3 },
      { t: 90, km: 71.0 },
      { t: 115, km: 58.5 },
      { t: 140, km: 41.2 },
      { t: 165, km: 26.8 },
      { t: 190, km: 11.4 },
      { t: 215, km: 0 },
    ],
  },
  {
    id: "RE 121",
    category: "RE",
    direction: "down",
    delayMin: 0,
    nextStationId: "DUN",
    etaMin: 23,
    origin: "GRA",
    destination: "AUG",
    waypoints: [
      { t: 45, km: 84.3 },
      { t: 50, km: 84.3 },
      { t: 75, km: 71.0 },
      { t: 76, km: 71.0 },
      { t: 95, km: 58.5 },
      { t: 97, km: 58.5 },
      { t: 125, km: 41.2 },
      { t: 126, km: 41.2 },
      { t: 150, km: 26.8 },
      { t: 151, km: 26.8 },
      { t: 175, km: 11.4 },
      { t: 176, km: 11.4 },
      { t: 195, km: 0 },
    ],
  },
  {
    id: "IC 212",
    category: "IC",
    direction: "up",
    delayMin: 6,
    nextStationId: "DUN",
    etaMin: 33,
    origin: "AUG",
    destination: "GRA",
    waypoints: [
      { t: 58, km: 0 },
      { t: 65, km: 0 },
      { t: 95, km: 26.8 },
      { t: 115, km: 26.8 },
      { t: 135, km: 41.2 },
      { t: 158, km: 58.5 },
      { t: 178, km: 71.0 },
      { t: 198, km: 84.3 },
    ],
  },
];

export interface TurnbackRow {
  arriving: string;
  arrivalClock: string;
  track: string;
  dwellMin: number;
  departing: string;
  departureClock: string;
  status: "완료" | "진행예정" | "지연영향";
}

export const TURNBACKS: TurnbackRow[] = [
  { arriving: "IC 204", arrivalClock: "07:43", track: "GRA 2번선", dwellMin: 15, departing: "IC 205", departureClock: "07:58", status: "진행예정" },
  { arriving: "RE 121", arrivalClock: "07:15", track: "AUG 1번선", dwellMin: 10, departing: "RE 128", departureClock: "07:25", status: "완료" },
  { arriving: "RE 118", arrivalClock: "08:20", track: "GRA 4번선", dwellMin: 12, departing: "RE 123", departureClock: "08:32", status: "진행예정" },
  { arriving: "FR 3390", arrivalClock: "09:15", track: "GRA 측선 6", dwellMin: 40, departing: "FR 3391", departureClock: "09:55", status: "지연영향" },
  { arriving: "IC 209", arrivalClock: "10:00", track: "AUG 3번선", dwellMin: 18, departing: "IC 214", departureClock: "10:18", status: "진행예정" },
];

export interface DelayStep {
  actor: string;
  description: string;
  severity: DelayLevel;
}

export const DELAY_CHAIN: DelayStep[] = [
  { actor: "FR 3390", description: "CAI–DUN 구간 서행 진입 · 근본 원인, 지연 +12분", severity: "major" },
  { actor: "CAI 신호기", description: "정지현시(적색) 전환 — 후속 열차 진입 차단", severity: "major" },
  { actor: "IC 212", description: "CAI 대기 발생 · 연쇄 파급 1, 지연 +6분", severity: "minor" },
  { actor: "RE 118", description: "BEL 접근경계(주의) 현시로 감속 · 연쇄 파급 2, 지연 +3분", severity: "minor" },
];

export interface Kpi {
  label: string;
  value: string;
  delta?: string;
  deltaDir?: "up" | "down" | "flat";
  caption: string;
}

export const KPIS: Kpi[] = [
  { label: "정시율", value: "88.2%", delta: "+1.4%p", deltaDir: "up", caption: "00:00 이후 누계" },
  { label: "평균 지연", value: "2.7분", delta: "-0.4분", deltaDir: "down", caption: "편성당 평균" },
  { label: "운행 열차", value: "7편성", delta: "±0", deltaDir: "flat", caption: "본선 재선 기준" },
  { label: "폐색 점유율", value: "83%", delta: "+17%p", deltaDir: "up", caption: "6개 구간 중 5개 점유" },
  { label: "최대 지연", value: "12분", caption: "FR 3390 · 파급 2건" },
];

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function lerpRange(value: number, inMax: number, outMin: number, outMax: number): number {
  return round2(outMin + (value / inMax) * (outMax - outMin));
}

// 같은 좌표축 상에서 항목끼리 겹치지 않도록 레인(row/column)을 배정한다.
// (라벨이 촘촘히 몰릴 때 겹침 방지 — 열차 3편성이 인접 구간에 몰리는 경우 등)
export function packLanes<T>(items: T[], getPos: (item: T) => number, minGap: number): Map<T, number> {
  const sorted = [...items].sort((a, b) => getPos(a) - getPos(b));
  const laneLast: number[] = [];
  const result = new Map<T, number>();
  for (const item of sorted) {
    const pos = getPos(item);
    let lane = laneLast.findIndex((last) => pos - last >= minGap);
    if (lane === -1) {
      lane = laneLast.length;
      laneLast.push(pos);
    } else {
      laneLast[lane] = pos;
    }
    result.set(item, lane);
  }
  return result;
}

export function xPct(km: number): number {
  return round2((km / LINE_KM) * 100);
}

export function tPct(t: number): number {
  return round2((t / WINDOW_MIN) * 100);
}

export function formatClock(t: number): string {
  const total = 360 + t; // 06:00 기준
  const hh = Math.floor(total / 60) % 24;
  const mm = total % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export function interpolateKm(waypoints: Waypoint[], t: number): number {
  if (t <= waypoints[0].t) return waypoints[0].km;
  const last = waypoints[waypoints.length - 1];
  if (t >= last.t) return last.km;
  for (let i = 0; i < waypoints.length - 1; i++) {
    const a = waypoints[i];
    const b = waypoints[i + 1];
    if (t >= a.t && t <= b.t) {
      if (b.t === a.t) return a.km;
      const f = (t - a.t) / (b.t - a.t);
      return round2(a.km + f * (b.km - a.km));
    }
  }
  return last.km;
}

export type Location =
  | { type: "station"; stationId: string }
  | { type: "block"; fromId: string; toId: string; blockIndex: number };

export function locateKm(km: number): Location {
  for (const s of STATIONS) {
    if (Math.abs(s.km - km) < 0.05) {
      return { type: "station", stationId: s.id };
    }
  }
  for (let i = 0; i < STATIONS.length - 1; i++) {
    if (km > STATIONS[i].km && km < STATIONS[i + 1].km) {
      return { type: "block", fromId: STATIONS[i].id, toId: STATIONS[i + 1].id, blockIndex: i };
    }
  }
  return { type: "station", stationId: STATIONS[0].id };
}

export function speedAt(train: Train, t: number): number {
  const wp = train.waypoints;
  for (let i = 0; i < wp.length - 1; i++) {
    const a = wp[i];
    const b = wp[i + 1];
    if (t >= a.t && t <= b.t) {
      if (b.km === a.km || b.t === a.t) return 0;
      return Math.round((Math.abs(b.km - a.km) / (b.t - a.t)) * 60);
    }
  }
  return 0;
}

export function delayLevel(min: number): DelayLevel {
  if (min <= 0) return "onTime";
  if (min <= 7) return "minor";
  return "major";
}

export function delayLabel(min: number): string {
  return min <= 0 ? "정시" : `+${min}분 지연`;
}

// 폐색(구간) 점유 여부: blocks[i] = STATIONS[i]–STATIONS[i+1] 구간
export function computeBlockOccupancy(t: number): boolean[] {
  const occ = new Array(STATIONS.length - 1).fill(false) as boolean[];
  for (const train of TRAINS) {
    const km = interpolateKm(train.waypoints, t);
    const loc = locateKm(km);
    if (loc.type === "block") occ[loc.blockIndex] = true;
  }
  return occ;
}

export interface SignalState {
  stationId: string;
  aspect: Aspect;
  note: string;
}

// FAL(Falkirk Yard)는 입환(구내 이동) 중이라 폐색 상태와 무관하게 제한현시(lunar)로 오버라이드된다.
const YARD_OVERRIDE_STATION = "FAL";

export function computeSignals(t: number): SignalState[] {
  const occ = computeBlockOccupancy(t);
  const signals: SignalState[] = [];
  for (let i = 0; i < STATIONS.length; i++) {
    const station = STATIONS[i];
    if (i === STATIONS.length - 1) {
      signals.push({ stationId: station.id, aspect: "clear", note: "종착 승강장 진행 가능" });
      continue;
    }
    if (station.id === YARD_OVERRIDE_STATION) {
      signals.push({
        stationId: station.id,
        aspect: "restrict",
        note: "입환 진행 — 폐색 상태와 무관한 제한현시",
      });
      continue;
    }
    if (occ[i]) {
      const blocked = TRAINS.find((tr) => {
        const loc = locateKm(interpolateKm(tr.waypoints, t));
        return loc.type === "block" && loc.blockIndex === i;
      });
      signals.push({
        stationId: station.id,
        aspect: "stop",
        note: `${station.id}–${STATIONS[i + 1].id} 구간 점유${blocked ? ` (${blocked.id})` : ""}`,
      });
    } else if (occ[i + 1]) {
      signals.push({
        stationId: station.id,
        aspect: "caution",
        note: `다음 신호 ${STATIONS[i + 1].id} 정지 — 접근경계`,
      });
    } else {
      signals.push({ stationId: station.id, aspect: "clear", note: "진행 — 전방 구간 개통" });
    }
  }
  return signals;
}

export interface TrainSnapshot {
  train: Train;
  km: number;
  location: Location;
  speedKmh: number;
  level: DelayLevel;
}

export function getSnapshot(t: number): TrainSnapshot[] {
  return TRAINS.map((train) => {
    const km = interpolateKm(train.waypoints, t);
    return {
      train,
      km,
      location: locateKm(km),
      speedKmh: speedAt(train, t),
      level: delayLevel(train.delayMin),
    };
  });
}

export function stationName(id: string): string {
  return STATIONS.find((s) => s.id === id)?.name ?? id;
}

export function scheduledGhost(train: Train): Waypoint[] | null {
  if (train.delayMin <= 0) return null;
  return train.waypoints.map((w) => ({ t: round2(w.t - train.delayMin), km: w.km }));
}

export function locationLabel(train: Train, t: number): string {
  const km = interpolateKm(train.waypoints, t);
  const loc = locateKm(km);
  if (loc.type === "station") {
    return `${stationName(loc.stationId)} 정차`;
  }
  return `${loc.fromId}–${loc.toId} 구간 · km ${km.toFixed(1)}`;
}

export const ASPECT_LABEL: Record<Aspect, string> = {
  clear: "진행(녹색)",
  caution: "경계(주황)",
  stop: "정지(적색)",
  restrict: "제한(청백)",
};

export const CATEGORY_LABEL: Record<Category, string> = {
  IC: "특급",
  RE: "일반",
  FR: "화물",
};
