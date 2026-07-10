// HADAL — Subsea Fleet Console
// 결정론적 더미 데이터 (Math.random / Date.now 미사용 — 하이드레이션 안전)

export type VehicleStatus = "active" | "standby" | "maintenance";

export interface Vehicle {
  id: string;
  name: string;
  className: string;
  status: VehicleStatus;
}

export const VEHICLES: Vehicle[] = [
  { id: "abyss-walker", name: "ABYSS WALKER", className: "Class-5 HROV", status: "active" },
  { id: "triton-4", name: "TRITON-4", className: "Class-3 ROV", status: "standby" },
  { id: "nereid-2", name: "NEREID-2", className: "Class-2 ROV", status: "standby" },
  { id: "halcyon-9", name: "HALCYON-9", className: "Class-3 ROV", status: "maintenance" },
];

export interface DepthPoint {
  t: number; // 경과 분
  d: number; // 수심 m
}

export type ContactType = "biological" | "geological" | "anthropogenic" | "sample-site";

export interface SonarContact {
  angle: number; // deg 0-360
  range: number; // m, 0-400
  type: ContactType;
  label: string;
}

export type DiveStatus = "complete" | "in-progress" | "aborted";

export interface DiveTelemetry {
  pressure: number; // bar
  temp: number; // C
  battery: number; // %
  o2: number; // %
  heading: number; // deg
  thrusterLoad: number; // %
}

export interface Sample {
  id: string;
  diveId: string;
  tag: "Sediment" | "Rock" | "Fauna" | "Water";
  label: string;
  depth: number;
  qty: string;
}

export interface Dive {
  id: string;
  vehicleId: string;
  date: string;
  site: string;
  objective: string;
  pilot: string;
  maxDepth: number;
  durationLabel: string;
  durationMin: number;
  sampleCount: number;
  status: DiveStatus;
  note: string;
  depthProfile: DepthPoint[];
  sonarContacts: SonarContact[];
  telemetry: DiveTelemetry;
  sparklines: {
    depth: number[];
    pressure: number[];
    battery: number[];
    thruster: number[];
  };
}

export const DIVES: Dive[] = [
  {
    id: "DV-0511",
    vehicleId: "abyss-walker",
    date: "2026-07-11",
    site: "Mariana Trench — Sirena Deep",
    objective: "초고압 환경 극한생물 채집 및 열수구 온도 매핑",
    pilot: "R. Okafor",
    maxDepth: 5210,
    durationLabel: "6h 05m · 진행 중",
    durationMin: 365,
    sampleCount: 9,
    status: "in-progress",
    note: "열수구 온도 이상 감지 — 안전 반경 확보 후 관측 지속 중",
    depthProfile: [
      { t: 0, d: 0 },
      { t: 40, d: 1450 },
      { t: 110, d: 3200 },
      { t: 210, d: 4680 },
      { t: 320, d: 5180 },
      { t: 365, d: 5210 },
    ],
    sonarContacts: [
      { angle: 15, range: 95, type: "geological", label: "열수 분출공 클러스터" },
      { angle: 95, range: 230, type: "biological", label: "튜브웜 군락" },
      { angle: 190, range: 180, type: "sample-site", label: "채집 지점 M-3" },
      { angle: 305, range: 310, type: "anthropogenic", label: "심해 케이블 잔해" },
    ],
    telemetry: { pressure: 522.1, temp: 1.4, battery: 52, o2: 74, heading: 87, thrusterLoad: 81 },
    sparklines: {
      depth: [0, 180, 520, 890, 1450, 2100, 2800, 3450, 4020, 4680, 5020, 5210],
      pressure: [1, 19, 53, 90, 146, 211, 281, 346, 403, 469, 503, 522],
      battery: [98, 95, 91, 88, 84, 80, 75, 70, 64, 59, 55, 52],
      thruster: [40, 52, 61, 58, 70, 65, 73, 69, 77, 80, 78, 81],
    },
  },
  {
    id: "DV-0417",
    vehicleId: "triton-4",
    date: "2026-07-09",
    site: "Kaikōura Canyon — Site 7",
    objective: "벤틱 생물 군집 조사 및 퇴적물 코어 채취",
    pilot: "J. Alvarez",
    maxDepth: 3820,
    durationLabel: "4h 12m",
    durationMin: 252,
    sampleCount: 6,
    status: "complete",
    note: "코어 3점 및 열수 유체 샘플 회수 완료",
    depthProfile: [
      { t: 0, d: 0 },
      { t: 20, d: 850 },
      { t: 55, d: 2100 },
      { t: 95, d: 3820 },
      { t: 180, d: 3820 },
      { t: 230, d: 1200 },
      { t: 252, d: 0 },
    ],
    sonarContacts: [
      { angle: 30, range: 110, type: "geological", label: "해저 능선 노두" },
      { angle: 140, range: 260, type: "biological", label: "게 군집" },
      { angle: 250, range: 340, type: "sample-site", label: "코어 채취 지점 A" },
    ],
    telemetry: { pressure: 383.4, temp: 3.2, battery: 78, o2: 91, heading: 214, thrusterLoad: 0 },
    sparklines: {
      depth: [0, 85, 210, 320, 382, 382, 382, 382, 300, 180, 60, 0],
      pressure: [1, 10, 22, 33, 39, 39, 39, 39, 31, 19, 7, 1],
      battery: [100, 96, 92, 89, 85, 82, 80, 79, 78, 78, 78, 78],
      thruster: [20, 55, 62, 58, 30, 15, 10, 8, 25, 40, 10, 0],
    },
  },
  {
    id: "DV-0418",
    vehicleId: "triton-4",
    date: "2026-07-10",
    site: "Kaikōura Canyon — Site 9",
    objective: "해저 통신 케이블 경로 점검",
    pilot: "J. Alvarez",
    maxDepth: 2960,
    durationLabel: "2h 40m",
    durationMin: 160,
    sampleCount: 2,
    status: "complete",
    note: "3구간 절연 손상 의심 지점 표기, 정밀 점검 요청",
    depthProfile: [
      { t: 0, d: 0 },
      { t: 25, d: 1400 },
      { t: 70, d: 2960 },
      { t: 130, d: 2960 },
      { t: 160, d: 0 },
    ],
    sonarContacts: [
      { angle: 60, range: 150, type: "anthropogenic", label: "통신 케이블 라인" },
      { angle: 200, range: 90, type: "geological", label: "침식 단구" },
    ],
    telemetry: { pressure: 297.0, temp: 3.8, battery: 64, o2: 85, heading: 178, thrusterLoad: 0 },
    sparklines: {
      depth: [0, 320, 780, 1400, 2100, 2700, 2960, 2960, 2000, 900, 200, 0],
      pressure: [1, 32, 78, 140, 210, 270, 296, 296, 200, 90, 20, 1],
      battery: [100, 94, 88, 82, 77, 72, 68, 66, 64, 64, 64, 64],
      thruster: [15, 45, 50, 48, 52, 40, 20, 10, 30, 35, 15, 0],
    },
  },
  {
    id: "DV-0512",
    vehicleId: "abyss-walker",
    date: "2026-07-06",
    site: "Mariana Trench — Challenger Deep 접근로",
    objective: "심해 착저 지형 3D 매핑",
    pilot: "R. Okafor",
    maxDepth: 4980,
    durationLabel: "7h 50m",
    durationMin: 470,
    sampleCount: 4,
    status: "complete",
    note: "착저 지형 매핑 데이터 회수, 후속 다이브 M-3 지점 확정",
    depthProfile: [
      { t: 0, d: 0 },
      { t: 60, d: 2200 },
      { t: 160, d: 3900 },
      { t: 260, d: 4980 },
      { t: 380, d: 4980 },
      { t: 470, d: 0 },
    ],
    sonarContacts: [
      { angle: 80, range: 270, type: "geological", label: "해구 사면 균열" },
      { angle: 220, range: 150, type: "biological", label: "해삼 군집" },
    ],
    telemetry: { pressure: 499.1, temp: 1.1, battery: 41, o2: 60, heading: 302, thrusterLoad: 0 },
    sparklines: {
      depth: [0, 400, 1100, 2200, 3100, 3900, 4500, 4980, 4980, 3500, 1200, 0],
      pressure: [1, 41, 111, 221, 311, 391, 451, 499, 499, 351, 121, 1],
      battery: [100, 90, 80, 72, 63, 55, 48, 44, 41, 41, 41, 41],
      thruster: [30, 60, 68, 72, 75, 70, 65, 55, 20, 10, 5, 0],
    },
  },
  {
    id: "DV-0388",
    vehicleId: "triton-4",
    date: "2026-07-03",
    site: "Kaikōura Canyon — Site 4",
    objective: "퇴적물 코어 채취",
    pilot: "J. Alvarez",
    maxDepth: 1140,
    durationLabel: "0h 48m · 중단",
    durationMin: 48,
    sampleCount: 0,
    status: "aborted",
    note: "추진기 3번 과부하 경보로 임무 중단 및 긴급 회수",
    depthProfile: [
      { t: 0, d: 0 },
      { t: 20, d: 640 },
      { t: 38, d: 1140 },
      { t: 48, d: 0 },
    ],
    sonarContacts: [{ angle: 170, range: 80, type: "geological", label: "급경사 사면" }],
    telemetry: { pressure: 115.0, temp: 4.6, battery: 69, o2: 88, heading: 340, thrusterLoad: 0 },
    sparklines: {
      depth: [0, 180, 420, 640, 900, 1140, 1140, 900, 500, 200, 0, 0],
      pressure: [1, 19, 43, 65, 91, 115, 115, 91, 51, 21, 1, 1],
      battery: [100, 96, 92, 88, 84, 80, 76, 74, 72, 70, 69, 69],
      thruster: [25, 55, 60, 72, 88, 95, 20, 10, 5, 0, 0, 0],
    },
  },
  {
    id: "DV-0293",
    vehicleId: "nereid-2",
    date: "2026-06-28",
    site: "Monterey Shelf Transect",
    objective: "천해 저서 서식지 기초 조사",
    pilot: "M. Sato",
    maxDepth: 420,
    durationLabel: "1h 15m",
    durationMin: 75,
    sampleCount: 3,
    status: "complete",
    note: "해조 군락 경계 GPS 기록 완료",
    depthProfile: [
      { t: 0, d: 0 },
      { t: 15, d: 180 },
      { t: 40, d: 420 },
      { t: 60, d: 420 },
      { t: 75, d: 0 },
    ],
    sonarContacts: [
      { angle: 45, range: 60, type: "biological", label: "해조 군락" },
      { angle: 300, range: 100, type: "sample-site", label: "채집 지점 N-1" },
    ],
    telemetry: { pressure: 43.0, temp: 9.7, battery: 88, o2: 96, heading: 112, thrusterLoad: 0 },
    sparklines: {
      depth: [0, 60, 140, 220, 310, 380, 420, 420, 300, 140, 40, 0],
      pressure: [1, 7, 15, 23, 31, 38, 42, 42, 31, 15, 5, 1],
      battery: [100, 98, 96, 94, 92, 90, 89, 88, 88, 88, 88, 88],
      thruster: [10, 30, 35, 38, 40, 35, 20, 10, 15, 20, 5, 0],
    },
  },
  {
    id: "DV-0201",
    vehicleId: "halcyon-9",
    date: "2026-06-14",
    site: "Offshore Test Range — Bay Trials",
    objective: "신형 조명 모듈 현장 검증",
    pilot: "K. Lindgren",
    maxDepth: 210,
    durationLabel: "0h 55m",
    durationMin: 55,
    sampleCount: 0,
    status: "complete",
    note: "조명 모듈 색온도 검증 완료, 정비 도크 복귀",
    depthProfile: [
      { t: 0, d: 0 },
      { t: 15, d: 120 },
      { t: 30, d: 210 },
      { t: 45, d: 120 },
      { t: 55, d: 0 },
    ],
    sonarContacts: [{ angle: 120, range: 40, type: "anthropogenic", label: "테스트 부표 앵커" }],
    telemetry: { pressure: 22.0, temp: 11.3, battery: 95, o2: 99, heading: 20, thrusterLoad: 0 },
    sparklines: {
      depth: [0, 40, 90, 150, 190, 210, 210, 150, 90, 40, 10, 0],
      pressure: [1, 5, 10, 16, 20, 22, 22, 16, 10, 5, 2, 1],
      battery: [100, 99, 98, 97, 96, 96, 95, 95, 95, 95, 95, 95],
      thruster: [8, 20, 25, 28, 22, 15, 10, 8, 10, 12, 5, 0],
    },
  },
];

export const SAMPLES: Sample[] = [
  { id: "M-3-01", diveId: "DV-0511", tag: "Fauna", label: "튜브웜 군체", depth: 5205, qty: "—" },
  { id: "M-3-02", diveId: "DV-0511", tag: "Fauna", label: "단각류 표본", depth: 5198, qty: "—" },
  { id: "M-3-03", diveId: "DV-0511", tag: "Water", label: "열수 유체", depth: 5202, qty: "0.4 L" },
  { id: "M-3-04", diveId: "DV-0511", tag: "Rock", label: "황화물 침전물", depth: 5190, qty: "0.9 kg" },
  { id: "M-3-05", diveId: "DV-0511", tag: "Sediment", label: "코어 A", depth: 5210, qty: "1.3 kg" },
  { id: "M-3-06", diveId: "DV-0511", tag: "Sediment", label: "코어 B", depth: 5210, qty: "1.2 kg" },
  { id: "M-3-07", diveId: "DV-0511", tag: "Water", label: "배경수 CTD", depth: 4800, qty: "2.0 L" },
  { id: "M-3-08", diveId: "DV-0511", tag: "Fauna", label: "새우류 표본", depth: 5150, qty: "—" },
  { id: "M-3-09", diveId: "DV-0511", tag: "Rock", label: "현무암편", depth: 5195, qty: "0.6 kg" },

  { id: "A-01", diveId: "DV-0417", tag: "Sediment", label: "퇴적물 코어", depth: 3822, qty: "1.2 kg" },
  { id: "A-02", diveId: "DV-0417", tag: "Rock", label: "현무암 파편", depth: 3810, qty: "0.8 kg" },
  { id: "A-03", diveId: "DV-0417", tag: "Fauna", label: "단각류 표본", depth: 3790, qty: "—" },
  { id: "A-04", diveId: "DV-0417", tag: "Water", label: "CTD 캐스트", depth: 3820, qty: "2.0 L" },
  { id: "A-05", diveId: "DV-0417", tag: "Water", label: "열수 유체", depth: 3805, qty: "0.5 L" },
  { id: "A-06", diveId: "DV-0417", tag: "Sediment", label: "퇴적물 코어 B", depth: 3822, qty: "1.1 kg" },

  { id: "B-01", diveId: "DV-0418", tag: "Rock", label: "케이블 인근 암편", depth: 2960, qty: "0.4 kg" },
  { id: "B-02", diveId: "DV-0418", tag: "Water", label: "누유 의심 수질", depth: 2960, qty: "1.5 L" },

  { id: "C-01", diveId: "DV-0512", tag: "Sediment", label: "착저 코어", depth: 4980, qty: "1.0 kg" },
  { id: "C-02", diveId: "DV-0512", tag: "Fauna", label: "해삼 표본", depth: 4900, qty: "—" },
  { id: "C-03", diveId: "DV-0512", tag: "Rock", label: "사면 균열 암편", depth: 4950, qty: "0.7 kg" },
  { id: "C-04", diveId: "DV-0512", tag: "Water", label: "CTD 캐스트", depth: 4980, qty: "2.2 L" },

  { id: "N-01", diveId: "DV-0293", tag: "Fauna", label: "해조 부착생물", depth: 420, qty: "—" },
  { id: "N-02", diveId: "DV-0293", tag: "Sediment", label: "천해 퇴적물", depth: 400, qty: "0.6 kg" },
  { id: "N-03", diveId: "DV-0293", tag: "Water", label: "CTD 캐스트", depth: 410, qty: "1.0 L" },
];

export type LogLevel = "INFO" | "WARN" | "CRIT";

export interface LogLine {
  vehicleId: string;
  time: string;
  level: LogLevel;
  msg: string;
}

export const LOG_LINES: LogLine[] = [
  { vehicleId: "abyss-walker", time: "01:12:04", level: "INFO", msg: "하강 시작 — 목표 수심 5,200 m" },
  { vehicleId: "abyss-walker", time: "02:47:31", level: "INFO", msg: "열수구 클러스터 M-3 시야 확보" },
  { vehicleId: "abyss-walker", time: "04:03:12", level: "WARN", msg: "외부 온도 센서 2 판독값 변동 ±0.3°C" },
  { vehicleId: "abyss-walker", time: "05:21:55", level: "CRIT", msg: "열수구 온도 급상승 감지 — 87.2°C" },
  { vehicleId: "abyss-walker", time: "05:22:40", level: "INFO", msg: "안전 반경 12 m 확보, 관측 지속" },
  { vehicleId: "abyss-walker", time: "06:05:09", level: "INFO", msg: "현재 심도 5,210 m 유지 중" },

  { vehicleId: "triton-4", time: "07-10 08:14", level: "INFO", msg: "DV-0418 임무 개시" },
  { vehicleId: "triton-4", time: "07-10 10:02", level: "WARN", msg: "추진기 1번 부하율 78% 초과" },
  { vehicleId: "triton-4", time: "07-10 10:54", level: "INFO", msg: "DV-0418 임무 완료, 도크 복귀" },

  { vehicleId: "nereid-2", time: "06-28 09:00", level: "INFO", msg: "DV-0293 임무 완료" },
  { vehicleId: "nereid-2", time: "07-05 00:00", level: "INFO", msg: "정기 점검 통과, 대기 상태 전환" },

  { vehicleId: "halcyon-9", time: "06-14 14:40", level: "INFO", msg: "DV-0201 현장 검증 완료" },
  { vehicleId: "halcyon-9", time: "06-16 09:00", level: "WARN", msg: "추진기 베어링 마모 감지" },
  { vehicleId: "halcyon-9", time: "06-17 08:00", level: "INFO", msg: "정비 도크 입고, 부품 교체 대기" },
];

export const OCEAN_ZONES = [
  { min: 0, max: 200, label: "EPIPELAGIC" },
  { min: 200, max: 1000, label: "MESOPELAGIC" },
  { min: 1000, max: 4000, label: "BATHYPELAGIC" },
  { min: 4000, max: 6000, label: "ABYSSOPELAGIC" },
] as const;

export const DEPTH_SCALE_MAX = 6000;

export const r2 = (n: number): number => Math.round(n * 100) / 100;

export const CONTACT_TYPE_LABEL: Record<ContactType, string> = {
  biological: "생물",
  geological: "지질",
  anthropogenic: "인공물",
  "sample-site": "채집지",
};

export const STATUS_LABEL: Record<DiveStatus, string> = {
  complete: "완료",
  "in-progress": "진행 중",
  aborted: "중단",
};

export const VEHICLE_STATUS_LABEL: Record<VehicleStatus, string> = {
  active: "가동 중",
  standby: "대기",
  maintenance: "정비 중",
};
