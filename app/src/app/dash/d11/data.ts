// 옹기(ONGGI) — 발효 배양 관제 더미 데이터. 전부 정적 스냅샷(결정론적),
// Math.random / Date.now 미사용. 실제 서비스라면 배치·센서 API 응답.

export type VesselType = "된장" | "고추장" | "간장" | "막걸리";
export type VesselStatus = "정상" | "주의" | "점검필요" | "출고대기";
export type Grade = "특" | "상" | "중" | "하";
export type Zone = "A" | "B" | "C";
export type TrendMetric = "brix" | "temp" | "ph";

export interface Vessel {
  id: string;
  name: string;
  type: VesselType;
  zone: Zone;
  daysAged: number;
  targetDays: number;
  temp: number;
  humidity: number;
  ph: number;
  brix: number;
  grade: Grade;
  status: VesselStatus;
  lastChecked: string;
  brixTrend: number[];
  tempTrend: number[];
  phTrend: number[];
}

export const TREND_LABELS = ["6주 전", "5주 전", "4주 전", "3주 전", "2주 전", "이번 주"];

export const VESSELS: Vessel[] = [
  {
    id: "V01",
    name: "1호 된장독",
    type: "된장",
    zone: "A",
    daysAged: 187,
    targetDays: 365,
    temp: 16.2,
    humidity: 62,
    ph: 5.1,
    brix: 9.4,
    grade: "상",
    status: "정상",
    lastChecked: "07/03",
    brixTrend: [8.0, 8.3, 8.7, 9.0, 9.2, 9.4],
    tempTrend: [15.8, 16.0, 16.4, 16.1, 16.3, 16.2],
    phTrend: [5.6, 5.5, 5.4, 5.3, 5.2, 5.1],
  },
  {
    id: "V02",
    name: "2호 된장독",
    type: "된장",
    zone: "A",
    daysAged: 340,
    targetDays: 365,
    temp: 15.8,
    humidity: 60,
    ph: 5.3,
    brix: 11.2,
    grade: "특",
    status: "정상",
    lastChecked: "07/06",
    brixTrend: [9.6, 10.0, 10.4, 10.7, 11.0, 11.2],
    tempTrend: [15.4, 15.6, 15.9, 15.7, 15.9, 15.8],
    phTrend: [5.8, 5.7, 5.6, 5.5, 5.4, 5.3],
  },
  {
    id: "V03",
    name: "3호 고추장독",
    type: "고추장",
    zone: "A",
    daysAged: 95,
    targetDays: 180,
    temp: 18.4,
    humidity: 58,
    ph: 4.6,
    brix: 22.1,
    grade: "상",
    status: "정상",
    lastChecked: "07/02",
    brixTrend: [18.8, 19.6, 20.3, 21.0, 21.6, 22.1],
    tempTrend: [17.9, 18.1, 18.6, 18.3, 18.5, 18.4],
    phTrend: [5.1, 5.0, 4.9, 4.8, 4.7, 4.6],
  },
  {
    id: "V04",
    name: "4호 고추장독",
    type: "고추장",
    zone: "B",
    daysAged: 172,
    targetDays: 180,
    temp: 19.1,
    humidity: 55,
    ph: 4.4,
    brix: 24.8,
    grade: "특",
    status: "주의",
    lastChecked: "07/08",
    brixTrend: [21.5, 22.3, 23.0, 23.6, 24.2, 24.8],
    tempTrend: [18.3, 18.6, 18.9, 19.3, 19.0, 19.1],
    phTrend: [4.9, 4.8, 4.7, 4.6, 4.5, 4.4],
  },
  {
    id: "V05",
    name: "5호 간장독",
    type: "간장",
    zone: "B",
    daysAged: 410,
    targetDays: 730,
    temp: 14.5,
    humidity: 64,
    ph: 5.0,
    brix: 6.2,
    grade: "상",
    status: "정상",
    lastChecked: "06/28",
    brixTrend: [5.0, 5.3, 5.6, 5.8, 6.0, 6.2],
    tempTrend: [14.1, 14.2, 14.4, 14.3, 14.5, 14.5],
    phTrend: [5.4, 5.3, 5.2, 5.1, 5.05, 5.0],
  },
  {
    id: "V06",
    name: "6호 간장독",
    type: "간장",
    zone: "B",
    daysAged: 58,
    targetDays: 730,
    temp: 14.9,
    humidity: 66,
    ph: 5.4,
    brix: 3.1,
    grade: "중",
    status: "정상",
    lastChecked: "07/05",
    brixTrend: [2.0, 2.3, 2.6, 2.8, 2.9, 3.1],
    tempTrend: [14.5, 14.6, 14.8, 14.7, 14.9, 14.9],
    phTrend: [5.8, 5.7, 5.6, 5.5, 5.45, 5.4],
  },
  {
    id: "V07",
    name: "7호 막걸리독",
    type: "막걸리",
    zone: "C",
    daysAged: 4,
    targetDays: 7,
    temp: 22.6,
    humidity: 70,
    ph: 3.9,
    brix: 14.5,
    grade: "상",
    status: "정상",
    lastChecked: "07/10",
    brixTrend: [18.2, 17.0, 16.1, 15.4, 14.9, 14.5],
    tempTrend: [21.8, 22.4, 23.0, 22.8, 22.7, 22.6],
    phTrend: [4.4, 4.2, 4.1, 4.0, 3.95, 3.9],
  },
  {
    id: "V08",
    name: "8호 막걸리독",
    type: "막걸리",
    zone: "C",
    daysAged: 2,
    targetDays: 7,
    temp: 23.1,
    humidity: 71,
    ph: 4.1,
    brix: 17.8,
    grade: "상",
    status: "정상",
    lastChecked: "07/10",
    brixTrend: [19.5, 19.0, 18.6, 18.3, 18.0, 17.8],
    tempTrend: [22.4, 22.9, 23.3, 23.0, 23.2, 23.1],
    phTrend: [4.5, 4.4, 4.3, 4.2, 4.15, 4.1],
  },
  {
    id: "V09",
    name: "9호 고추장독",
    type: "고추장",
    zone: "A",
    daysAged: 205,
    targetDays: 180,
    temp: 20.3,
    humidity: 52,
    ph: 4.2,
    brix: 26.4,
    grade: "특",
    status: "점검필요",
    lastChecked: "07/07",
    brixTrend: [24.0, 24.8, 25.4, 25.9, 26.1, 26.4],
    tempTrend: [19.6, 19.9, 20.2, 20.5, 20.1, 20.3],
    phTrend: [4.6, 4.5, 4.4, 4.3, 4.25, 4.2],
  },
  {
    id: "V10",
    name: "10호 된장독",
    type: "된장",
    zone: "C",
    daysAged: 12,
    targetDays: 365,
    temp: 16.0,
    humidity: 63,
    ph: 6.1,
    brix: 4.2,
    grade: "하",
    status: "정상",
    lastChecked: "07/04",
    brixTrend: [3.0, 3.3, 3.6, 3.8, 4.0, 4.2],
    tempTrend: [15.6, 15.8, 16.1, 15.9, 16.0, 16.0],
    phTrend: [6.4, 6.3, 6.3, 6.2, 6.15, 6.1],
  },
  {
    id: "V11",
    name: "11호 간장독",
    type: "간장",
    zone: "B",
    daysAged: 730,
    targetDays: 730,
    temp: 14.2,
    humidity: 61,
    ph: 4.9,
    brix: 7.8,
    grade: "특",
    status: "출고대기",
    lastChecked: "07/09",
    brixTrend: [7.0, 7.2, 7.4, 7.6, 7.7, 7.8],
    tempTrend: [13.9, 14.0, 14.3, 14.1, 14.2, 14.2],
    phTrend: [5.1, 5.05, 5.0, 4.95, 4.92, 4.9],
  },
  {
    id: "V12",
    name: "12호 막걸리독",
    type: "막걸리",
    zone: "C",
    daysAged: 6,
    targetDays: 7,
    temp: 22.0,
    humidity: 69,
    ph: 3.8,
    brix: 13.2,
    grade: "특",
    status: "정상",
    lastChecked: "07/10",
    brixTrend: [17.0, 16.0, 15.2, 14.5, 13.8, 13.2],
    tempTrend: [21.5, 21.8, 22.2, 21.9, 22.1, 22.0],
    phTrend: [4.3, 4.2, 4.1, 4.0, 3.9, 3.8],
  },
];

export const STATUS_META: Record<
  VesselStatus,
  { label: string; bg: string; fg: string }
> = {
  정상: { label: "정상", bg: "bg-[#55632F]", fg: "text-[#F6EEDD]" },
  주의: { label: "주의", bg: "bg-[#C48A1E]", fg: "text-[#2B1B10]" },
  점검필요: { label: "점검필요", bg: "bg-[#B14A2A]", fg: "text-[#F6EEDD]" },
  출고대기: { label: "출고대기", bg: "bg-[#6B4226]", fg: "text-[#F6EEDD]" },
};

// SVG 도형(rect/line/circle) fill·stroke 속성용 — CSS 인라인 스타일이 아닌
// SVG 프레젠테이션 속성으로만 사용한다.
export const STATUS_HEX: Record<VesselStatus, string> = {
  정상: "#55632F",
  주의: "#C48A1E",
  점검필요: "#B14A2A",
  출고대기: "#6B4226",
};

export const TYPE_META: Record<
  VesselType,
  { label: string; accent: string; chipBg: string }
> = {
  된장: { label: "된장", accent: "#8C6A2F", chipBg: "bg-[#8C6A2F]/15" },
  고추장: { label: "고추장", accent: "#B14A2A", chipBg: "bg-[#B14A2A]/15" },
  간장: { label: "간장", accent: "#4A3423", chipBg: "bg-[#4A3423]/15" },
  막걸리: { label: "막걸리", accent: "#C48A1E", chipBg: "bg-[#C48A1E]/18" },
};

export interface Task {
  id: string;
  label: string;
  vesselId: string | null;
  done: boolean;
}

export const INITIAL_TASKS: Task[] = [
  { id: "T1", label: "4호 고추장독 온도 상한 점검", vesselId: "V04", done: false },
  { id: "T2", label: "9호 고추장독 즉시 개봉 검사", vesselId: "V09", done: false },
  { id: "T3", label: "11호 간장독 병입 준비", vesselId: "V11", done: false },
  { id: "T4", label: "7호 막걸리독 여과 예약", vesselId: "V07", done: true },
  { id: "T5", label: "A구역 뚜껑 점검 (우천 대비)", vesselId: null, done: false },
];

export interface QualityLogEntry {
  id: string;
  date: string;
  vesselName: string;
  inspector: string;
  grade: Grade;
  note: string;
}

export const QUALITY_LOG: QualityLogEntry[] = [
  { id: "Q1", date: "07/09", vesselName: "11호 간장독", inspector: "김순자", grade: "특", note: "염도·색택 모두 기준 이상, 병입 승인" },
  { id: "Q2", date: "07/08", vesselName: "4호 고추장독", inspector: "박덕수", grade: "특", note: "온도 상한 근접, 그늘 이동 권고" },
  { id: "Q3", date: "07/07", vesselName: "9호 고추장독", inspector: "이만근", grade: "특", note: "숙성 기간 초과, 조기 출고 검토" },
  { id: "Q4", date: "07/06", vesselName: "2호 된장독", inspector: "최영자", grade: "특", note: "메주 향 짙고 균질, 상태 양호" },
  { id: "Q5", date: "07/05", vesselName: "6호 간장독", inspector: "정갑수", grade: "중", note: "초기 숙성 단계, 정기 관찰 지속" },
  { id: "Q6", date: "07/04", vesselName: "10호 된장독", inspector: "김순자", grade: "하", note: "염도 낮음, 소금 보충 필요" },
];

export interface ShippingItem {
  id: string;
  batchCode: string;
  vesselId: string;
  vesselName: string;
  etaLabel: string;
  progress: number;
  status: VesselStatus;
}

export const SHIPPING_QUEUE: ShippingItem[] = [
  { id: "S1", batchCode: "해담-간장-11B", vesselId: "V11", vesselName: "11호 간장독", etaLabel: "즉시 출고 가능", progress: 100, status: "출고대기" },
  { id: "S2", batchCode: "해담-고추장-09B", vesselId: "V09", vesselName: "9호 고추장독", etaLabel: "금주 내 출고 검토", progress: 100, status: "점검필요" },
  { id: "S3", batchCode: "해담-고추장-04B", vesselId: "V04", vesselName: "4호 고추장독", etaLabel: "8일 후 예정", progress: 96, status: "주의" },
  { id: "S4", batchCode: "해담-된장-02B", vesselId: "V02", vesselName: "2호 된장독", etaLabel: "25일 후 예정", progress: 93, status: "정상" },
];

export function progressPct(v: Vessel): number {
  return Math.min(100, Math.round((v.daysAged / v.targetDays) * 100));
}

export function gradeCounts(vessels: Vessel[]): Record<Grade, number> {
  const counts: Record<Grade, number> = { 특: 0, 상: 0, 중: 0, 하: 0 };
  for (const v of vessels) counts[v.grade] += 1;
  return counts;
}

export function summarize(vessels: Vessel[]) {
  const total = vessels.length;
  const avgProgress = Math.round(
    vessels.reduce((sum, v) => sum + progressPct(v), 0) / total,
  );
  const eliteCount = vessels.filter((v) => v.grade === "특").length;
  const eliteRatio = Math.round((eliteCount / total) * 100);
  return { total, avgProgress, eliteRatio };
}

export const TREND_METRIC_META: Record<
  TrendMetric,
  { label: string; unit: string; color: string; key: "brixTrend" | "tempTrend" | "phTrend" }
> = {
  brix: { label: "당도", unit: "°Bx", color: "#B14A2A", key: "brixTrend" },
  temp: { label: "온도", unit: "°C", color: "#55632F", key: "tempTrend" },
  ph: { label: "산도", unit: "pH", color: "#6B4226", key: "phTrend" },
};
