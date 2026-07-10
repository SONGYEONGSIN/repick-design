// APRON — 지상운영 관제판 더미 데이터
// 결정론적 정적 스냅샷(Math.random / Date.now 미사용). 실제 항공사·편명이 아닌 가상 데이터.

export type FlightStatus = "BOARDING" | "DELAYED" | "DEPARTED" | "SCHEDULED";
export type Terminal = "T1" | "T2";

export interface Flight {
  std: string; // 출발 예정 시각 HH:MM
  flt: string; // 편명
  destCode: string; // 목적지 공항 코드
  destName: string; // 목적지 도시
  gate: string;
  terminal: Terminal;
  aircraft: string;
  status: FlightStatus;
  delayMin: number; // DELAYED일 때만 의미, 그 외 0
}

// 가상 항공사: QN(퀀텀에어) · HZ(호라이즌윙) · PL(폴라리스항공) · VT(버텍스에어)
export const flights: Flight[] = [
  { std: "06:20", flt: "QN205", destCode: "NRT", destName: "도쿄", gate: "101", terminal: "T1", aircraft: "B738", status: "DEPARTED", delayMin: 0 },
  { std: "06:45", flt: "HZ118", destCode: "TPE", destName: "타이베이", gate: "230", terminal: "T2", aircraft: "A321", status: "DEPARTED", delayMin: 0 },
  { std: "07:10", flt: "PL742", destCode: "HKG", destName: "홍콩", gate: "103", terminal: "T1", aircraft: "B77W", status: "DEPARTED", delayMin: 0 },
  { std: "07:35", flt: "VT330", destCode: "BKK", destName: "방콕", gate: "232", terminal: "T2", aircraft: "A333", status: "BOARDING", delayMin: 0 },
  { std: "07:50", flt: "QN411", destCode: "CTS", destName: "삿포로", gate: "105", terminal: "T1", aircraft: "B738", status: "BOARDING", delayMin: 0 },
  { std: "08:05", flt: "HZ227", destCode: "SIN", destName: "싱가포르", gate: "234", terminal: "T2", aircraft: "A359", status: "DELAYED", delayMin: 25 },
  { std: "08:15", flt: "PL809", destCode: "FUK", destName: "후쿠오카", gate: "107", terminal: "T1", aircraft: "B738", status: "SCHEDULED", delayMin: 0 },
  { std: "08:30", flt: "VT144", destCode: "HAN", destName: "하노이", gate: "236", terminal: "T2", aircraft: "A321", status: "DELAYED", delayMin: 40 },
  { std: "08:40", flt: "QN560", destCode: "LAX", destName: "로스앤젤레스", gate: "109", terminal: "T1", aircraft: "B77W", status: "BOARDING", delayMin: 0 },
  { std: "08:55", flt: "HZ302", destCode: "SFO", destName: "샌프란시스코", gate: "238", terminal: "T2", aircraft: "B789", status: "SCHEDULED", delayMin: 0 },
  { std: "09:10", flt: "PL118", destCode: "CDG", destName: "파리", gate: "111", terminal: "T1", aircraft: "A359", status: "SCHEDULED", delayMin: 0 },
  { std: "09:20", flt: "VT275", destCode: "SYD", destName: "시드니", gate: "240", terminal: "T2", aircraft: "A333", status: "DELAYED", delayMin: 15 },
  { std: "09:35", flt: "QN633", destCode: "DXB", destName: "두바이", gate: "113", terminal: "T1", aircraft: "B77W", status: "SCHEDULED", delayMin: 0 },
  { std: "09:50", flt: "HZ190", destCode: "LHR", destName: "런던", gate: "242", terminal: "T2", aircraft: "B789", status: "SCHEDULED", delayMin: 0 },
  { std: "10:05", flt: "PL450", destCode: "JFK", destName: "뉴욕", gate: "115", terminal: "T1", aircraft: "A359", status: "SCHEDULED", delayMin: 0 },
  { std: "10:15", flt: "VT501", destCode: "TPE", destName: "타이베이", gate: "244", terminal: "T2", aircraft: "A321", status: "SCHEDULED", delayMin: 0 },
];

export type GateState = "OCCUPIED" | "CLEANING" | "BOARDING" | "VACANT";

export interface Gate {
  id: string;
  terminal: Terminal;
  state: GateState;
  flt?: string;
}

export const gates: Gate[] = [
  { id: "101", terminal: "T1", state: "VACANT" },
  { id: "103", terminal: "T1", state: "CLEANING" },
  { id: "105", terminal: "T1", state: "BOARDING", flt: "QN411" },
  { id: "107", terminal: "T1", state: "VACANT" },
  { id: "109", terminal: "T1", state: "BOARDING", flt: "QN560" },
  { id: "111", terminal: "T1", state: "OCCUPIED", flt: "PL118" },
  { id: "113", terminal: "T1", state: "VACANT" },
  { id: "115", terminal: "T1", state: "OCCUPIED", flt: "PL450" },
  { id: "230", terminal: "T2", state: "VACANT" },
  { id: "232", terminal: "T2", state: "BOARDING", flt: "VT330" },
  { id: "234", terminal: "T2", state: "OCCUPIED", flt: "HZ227" },
  { id: "236", terminal: "T2", state: "OCCUPIED", flt: "VT144" },
  { id: "238", terminal: "T2", state: "CLEANING" },
  { id: "240", terminal: "T2", state: "OCCUPIED", flt: "VT275" },
  { id: "242", terminal: "T2", state: "VACANT" },
  { id: "244", terminal: "T2", state: "VACANT" },
];

export interface TurnaroundStage {
  label: string;
  pct: number;
}

export interface TurnaroundFlight {
  flt: string;
  gate: string;
  stages: TurnaroundStage[]; // 4 stages
}

export const turnarounds: TurnaroundFlight[] = [
  {
    flt: "QN411",
    gate: "105",
    stages: [
      { label: "급유", pct: 100 },
      { label: "기내식", pct: 80 },
      { label: "청소", pct: 100 },
      { label: "수하물", pct: 55 },
    ],
  },
  {
    flt: "HZ227",
    gate: "234",
    stages: [
      { label: "급유", pct: 60 },
      { label: "기내식", pct: 30 },
      { label: "청소", pct: 100 },
      { label: "수하물", pct: 20 },
    ],
  },
  {
    flt: "VT144",
    gate: "236",
    stages: [
      { label: "급유", pct: 100 },
      { label: "기내식", pct: 100 },
      { label: "청소", pct: 45 },
      { label: "수하물", pct: 10 },
    ],
  },
  {
    flt: "VT275",
    gate: "240",
    stages: [
      { label: "급유", pct: 40 },
      { label: "기내식", pct: 0 },
      { label: "청소", pct: 20 },
      { label: "수하물", pct: 0 },
    ],
  },
];

export interface DelayReason {
  reason: string;
  count: number;
}

export const delayReasons: DelayReason[] = [
  { reason: "항공기 접속 지연", count: 9 },
  { reason: "지상조업 지연", count: 7 },
  { reason: "기상", count: 5 },
  { reason: "정비", count: 3 },
  { reason: "승객 지연", count: 2 },
];
