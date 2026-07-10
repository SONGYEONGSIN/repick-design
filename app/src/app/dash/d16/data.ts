// LINEAGE — deterministic dummy data (no Math.random / Date.now).
// All figures are invented static snapshots for a fictional plant-breeding SaaS.

export type Trend = "up" | "down" | "flat";

export interface VitalStat {
  id: string;
  label: string;
  labelKo: string;
  unit: string;
  value: string;
  delta: string;
  trend: Trend;
  spark: number[];
  note: string;
}

export const vitals: VitalStat[] = [
  {
    id: "temp",
    label: "Air Temperature",
    labelKo: "기온",
    unit: "°C",
    value: "21.4",
    delta: "−0.6 vs 어제",
    trend: "down",
    spark: [19.8, 20.1, 20.5, 20.9, 21.6, 22.0, 21.8, 21.2, 20.9, 21.1, 21.6, 21.4],
    note: "권장 범위 18–24°C",
  },
  {
    id: "humidity",
    label: "Relative Humidity",
    labelKo: "상대습도",
    unit: "%",
    value: "78",
    delta: "+3 vs 어제",
    trend: "up",
    spark: [71, 73, 74, 76, 79, 81, 80, 77, 75, 76, 78, 78],
    note: "목표 범위 70–85%",
  },
  {
    id: "vpd",
    label: "Vapor Pressure Deficit",
    labelKo: "수증기압차",
    unit: "kPa",
    value: "0.62",
    delta: "안정",
    trend: "flat",
    spark: [0.51, 0.55, 0.58, 0.6, 0.66, 0.7, 0.68, 0.64, 0.6, 0.58, 0.6, 0.62],
    note: "이상 범위 0.4–0.8 kPa",
  },
  {
    id: "dli",
    label: "Daily Light Integral",
    labelKo: "일일광적산량",
    unit: "mol·m⁻²·d⁻¹",
    value: "6.8",
    delta: "+0.4 vs 어제",
    trend: "up",
    spark: [5.9, 6.0, 6.2, 6.4, 6.9, 7.2, 7.0, 6.6, 6.3, 6.5, 6.7, 6.8],
    note: "차광막 45% 가동 중",
  },
  {
    id: "ec",
    label: "Substrate EC",
    labelKo: "배지 전기전도도",
    unit: "mS/cm",
    value: "1.1",
    delta: "안정",
    trend: "flat",
    spark: [1.0, 1.05, 1.1, 1.08, 1.12, 1.15, 1.13, 1.1, 1.09, 1.1, 1.11, 1.1],
    note: "배양토: 수태 4 : 펄라이트 1",
  },
  {
    id: "ph",
    label: "Substrate pH",
    labelKo: "배지 산도",
    unit: "pH",
    value: "5.8",
    delta: "−0.1 vs 어제",
    trend: "down",
    spark: [6.0, 5.95, 5.9, 5.92, 5.88, 5.85, 5.82, 5.8, 5.79, 5.81, 5.8, 5.8],
    note: "목표 5.5–6.2",
  },
];

export type GrowthPeriod = "week" | "month" | "season";

export interface GrowthDataset {
  labels: string[];
  values: number[];
  unit: string;
}

export const growthDatasets: Record<GrowthPeriod, GrowthDataset> = {
  week: {
    labels: ["월", "화", "수", "목", "금", "토", "일"],
    values: [14.2, 14.3, 14.5, 14.6, 14.8, 14.9, 15.1],
    unit: "cm",
  },
  month: {
    labels: ["1주", "2주", "3주", "4주"],
    values: [12.6, 13.4, 14.2, 15.1],
    unit: "cm",
  },
  season: {
    labels: ["2월", "3월", "4월", "5월", "6월", "7월"],
    values: [7.8, 9.0, 10.4, 11.9, 13.4, 15.1],
    unit: "cm",
  },
};

export const growthSummary: Record<GrowthPeriod, string> = {
  week:
    "지난 7일간 포충낭 길이가 14.2cm에서 15.1cm로 증가 — 하루 평균 0.13cm 성장, 계절 평균 대비 순조롭습니다.",
  month:
    "지난 4주간 12.6cm → 15.1cm, 주당 평균 0.83cm 성장 — 종 기준선(0.6cm/주)을 상회하는 속도입니다.",
  season:
    "2월 이후 6개월간 7.8cm → 15.1cm, 총 7.3cm 성장 — 우기 진입 이후 광량 증가와 함께 성장률이 가속되었습니다.",
};

export const featuredCultivar = {
  name: "Nepenthes veitchii ‘Candy Dreams’",
  accession: "NV-0142",
  zone: "Zone C · Cloud Forest House",
};

export interface LineageNode {
  id: string;
  name: string;
  accession: string;
  role: string;
}

export const lineageParents: LineageNode[] = [
  { id: "p1", name: "Hoya carnosa ‘Krimson Queen’", accession: "HC-021", role: "모본 · Seed parent" },
  { id: "p2", name: "Hoya latifolia", accession: "HL-004", role: "부본 · Pollen parent" },
];

export const lineageF1: LineageNode = {
  id: "f1",
  name: "Hoya × ‘Marsh Ember’",
  accession: "HM-114",
  role: "F1 교배종 · registered 2025-11-20",
};

export const lineageF2: LineageNode[] = [
  { id: "f2a", name: "Line 114-A ‘Ember Dawn’", accession: "HM-114A", role: "F2 선발 · 우수 개체" },
  { id: "f2b", name: "Line 114-B (미명명)", accession: "HM-114B", role: "F2 선발 · 명명 대기" },
];

export const lineageTimeline =
  "수분 2025-03-14 · 종자 결실 2025-04-02 · 첫 개화 2025-11-20";

export type ZoneStatus = "optimal" | "watch" | "alert";

export interface Zone {
  id: string;
  name: string;
  focus: string;
  count: number;
  temp: string;
  humidity: string;
  status: ZoneStatus;
  note: string;
}

export const zones: Zone[] = [
  {
    id: "zone-a",
    name: "Zone A",
    focus: "Tropical Aroid House",
    count: 142,
    temp: "26.1°C",
    humidity: "82%",
    status: "optimal",
    note: "정상 범위",
  },
  {
    id: "zone-b",
    name: "Zone B",
    focus: "Alpine & Bulb House",
    count: 58,
    temp: "14.3°C",
    humidity: "55%",
    status: "optimal",
    note: "정상 범위",
  },
  {
    id: "zone-c",
    name: "Zone C",
    focus: "Cloud Forest House",
    count: 96,
    temp: "21.4°C",
    humidity: "78%",
    status: "watch",
    note: "습도 하강 추세 — 가습기 점검 예정",
  },
  {
    id: "zone-d",
    name: "Zone D",
    focus: "Propagation Nursery",
    count: 210,
    temp: "24.0°C",
    humidity: "88%",
    status: "alert",
    note: "난방기 고장 티켓 #482 접수됨",
  },
];

export interface Tray {
  id: string;
  label: string;
  cross: string;
  sown: string;
  rate: number;
}

export const trays: Tray[] = [
  { id: "t07", label: "Tray 07", cross: "Passiflora incarnata × edulis", sown: "2026-06-02 파종", rate: 68 },
  { id: "t11", label: "Tray 11", cross: "Begonia boliviensis (종자)", sown: "2026-06-18 파종", rate: 22 },
  { id: "t12", label: "Tray 12", cross: "Nepenthes veitchii (자매 교배)", sown: "2026-05-20 파종", rate: 91 },
  { id: "t15", label: "Tray 15", cross: "Hoya ‘Marsh Ember’ F2 종자", sown: "2026-06-29 파종", rate: 4 },
];

export type NoteTag = "new-growth" | "flowering" | "alert" | "dormant";

export interface FieldNote {
  id: string;
  date: string;
  zone: string;
  specimen: string;
  tag: NoteTag;
  text: string;
}

export const fieldNotes: FieldNote[] = [
  {
    id: "n1",
    date: "2026-07-10",
    zone: "Zone C",
    specimen: "Nepenthes veitchii ‘Candy Dreams’",
    tag: "new-growth",
    text: "이번 시즌 두 번째 포충낭이 완전히 형성됨, 15.1cm — 페리스톰 발색이 왕성함.",
  },
  {
    id: "n2",
    date: "2026-07-09",
    zone: "Zone A",
    specimen: "Anthurium warocqueanum",
    tag: "flowering",
    text: "육수화서가 올라오기 시작 — 14개월 만의 첫 개화. 금요일 인공 수분 예정.",
  },
  {
    id: "n3",
    date: "2026-07-08",
    zone: "Zone D",
    specimen: "Hoya ‘Marsh Ember’ F2",
    tag: "alert",
    text: "묘목 2개체에서 모잘록병 의심 증상 — 트레이 15 구석 격리, 통풍량 증가 조치.",
  },
  {
    id: "n4",
    date: "2026-07-07",
    zone: "Zone B",
    specimen: "Sarracenia ‘Adrian Slack’",
    tag: "dormant",
    text: "계절성 휴면기 진입, 예상대로 잎이 마르기 시작 — 관수량 축소 시작.",
  },
  {
    id: "n5",
    date: "2026-07-05",
    zone: "Zone C",
    specimen: "Nepenthes veitchii ‘Candy Dreams’",
    tag: "new-growth",
    text: "새 잎이 펼쳐지며 덩굴손 형성 중 — 3주 내 세 번째 포충낭 예상.",
  },
  {
    id: "n6",
    date: "2026-07-03",
    zone: "Zone A",
    specimen: "Philodendron gloriosum",
    tag: "flowering",
    text: "성숙 개체에서 예상치 못한 불염포 발달 — 컬렉션 사상 최초 기록.",
  },
  {
    id: "n7",
    date: "2026-07-01",
    zone: "Zone D",
    specimen: "Passiflora incarnata × edulis (Tray 07)",
    tag: "new-growth",
    text: "발아율이 꾸준히 상승 중, 떡잎 상태 균일하고 건강함.",
  },
  {
    id: "n8",
    date: "2026-06-28",
    zone: "Zone B",
    specimen: "Begonia boliviensis (Tray 11)",
    tag: "alert",
    text: "발아 속도 저조 — 배지 수분과 층적처리 기록 재점검 중.",
  },
];

export const noteFilters: { id: "all" | NoteTag; label: string; labelKo: string }[] = [
  { id: "all", label: "All", labelKo: "전체" },
  { id: "flowering", label: "Flowering", labelKo: "개화" },
  { id: "new-growth", label: "New Growth", labelKo: "신초" },
  { id: "alert", label: "Alert", labelKo: "경고" },
  { id: "dormant", label: "Dormant", labelKo: "휴면" },
];
