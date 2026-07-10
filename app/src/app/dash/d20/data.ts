// 데일리즈(DAILIES) — 렌더팜 & 샷 파이프라인 관제 데스크
// 결정론적 더미 데이터. Math.random / Date.now 사용 금지.

export type ShotStatus = "approved" | "rendering" | "review" | "queued" | "error";

export interface Shot {
  code: string;
  start: number;
  end: number;
  frames: number;
  status: ShotStatus;
  artist?: string;
  node?: string;
  progress?: number;
  priority?: "low" | "standard" | "high";
  note?: string;
}

export const SEQUENCE_START = 1001;
export const SEQUENCE_END = 2600;
export const SEQUENCE_TOTAL_FRAMES = SEQUENCE_END - SEQUENCE_START + 1; // 1600

export const SHOTS: Shot[] = [
  { code: "SQ040_010", start: 1001, end: 1144, frames: 144, status: "approved", artist: "박서연" },
  { code: "SQ040_020", start: 1145, end: 1309, frames: 165, status: "approved", artist: "박서연" },
  { code: "SQ040_030", start: 1310, end: 1489, frames: 180, status: "review", artist: "최유진" },
  { code: "SQ040_040", start: 1490, end: 1551, frames: 62, status: "rendering", node: "farm-07", progress: 63 },
  { code: "SQ040_050", start: 1552, end: 1719, frames: 168, status: "rendering", node: "farm-12", progress: 22 },
  { code: "SQ040_060", start: 1720, end: 1801, frames: 82, status: "queued", priority: "high" },
  { code: "SQ040_070", start: 1802, end: 1974, frames: 173, status: "queued", priority: "standard" },
  { code: "SQ040_080", start: 1975, end: 2099, frames: 125, status: "error", node: "farm-03", note: "OOM · 96GB 초과" },
  { code: "SQ040_090", start: 2100, end: 2239, frames: 140, status: "queued", priority: "standard" },
  { code: "SQ040_100", start: 2240, end: 2299, frames: 60, status: "approved", artist: "김태민" },
  { code: "SQ040_110", start: 2300, end: 2454, frames: 155, status: "review", artist: "한소이" },
  { code: "SQ040_120", start: 2455, end: 2600, frames: 146, status: "queued", priority: "low" },
];

export function shotPosition(shot: Shot): { leftPct: number; widthPct: number } {
  const left = ((shot.start - SEQUENCE_START) / SEQUENCE_TOTAL_FRAMES) * 100;
  const width = (shot.frames / SEQUENCE_TOTAL_FRAMES) * 100;
  return { leftPct: left, widthPct: width };
}

export interface RenderJob {
  id: string;
  shot: string;
  node: string;
  gpu: string;
  progress: number | null;
  status: "running" | "queued" | "error";
  eta: string;
  priority: "low" | "standard" | "high";
  note?: string;
}

export const RENDER_JOBS: RenderJob[] = [
  { id: "RF-88231", shot: "SQ040_040", node: "farm-07", gpu: "RTX 6000 Ada ×2", progress: 63, status: "running", eta: "00:11:42", priority: "standard" },
  { id: "RF-88232", shot: "SQ040_050", node: "farm-12", gpu: "RTX 6000 Ada ×2", progress: 22, status: "running", eta: "00:38:05", priority: "standard" },
  { id: "RF-88240", shot: "SQ040_060", node: "farm-04", gpu: "RTX 6000 Ada ×4", progress: 0, status: "queued", eta: "대기 중", priority: "high" },
  { id: "RF-88180", shot: "SQ031_030", node: "farm-15", gpu: "RTX A6000 ×2", progress: 91, status: "running", eta: "00:03:20", priority: "standard" },
  { id: "RF-88075", shot: "SQ028_070", node: "farm-03", gpu: "RTX 6000 Ada ×2", progress: null, status: "error", eta: "—", priority: "standard", note: "OOM · 96GB 초과" },
  { id: "RF-88301", shot: "SQ040_090", node: "대기열", gpu: "미배정", progress: 0, status: "queued", eta: "대기 중", priority: "low" },
];

export interface NodeLoad {
  id: string;
  load: number;
}

export const NODE_LOADS: NodeLoad[] = [
  { id: "farm-01", load: 34 },
  { id: "farm-02", load: 88 },
  { id: "farm-03", load: 12 },
  { id: "farm-04", load: 95 },
  { id: "farm-05", load: 61 },
  { id: "farm-06", load: 45 },
  { id: "farm-07", load: 78 },
  { id: "farm-08", load: 69 },
];

export type ReviewStatus = "approved" | "rejected" | "reviewing" | "pending";

export interface ReviewItem {
  tc: string;
  shot: string;
  version: string;
  reviewer: string;
  note: string;
  status: ReviewStatus;
}

export const REVIEW_ITEMS: ReviewItem[] = [
  { tc: "01:01:58:03", shot: "SQ040_010", version: "v021", reviewer: "정하늘", note: "파이널 승인.", status: "approved" },
  { tc: "01:02:14:08", shot: "SQ040_030", version: "v012", reviewer: "이도현", note: "아이스 크랙 파티클 타이밍 확인 요청.", status: "reviewing" },
  { tc: "01:02:41:20", shot: "SQ040_110", version: "v005", reviewer: "정하늘", note: "라이팅 톤 승인, 컴프 진행.", status: "approved" },
  { tc: "01:02:55:17", shot: "SQ040_100", version: "v009", reviewer: "정하늘", note: "컬러그레이드 승인.", status: "approved" },
  { tc: "01:03:02:11", shot: "SQ031_030", version: "v018", reviewer: "이도현", note: "카메라 셰이크 과함 — 리테이크 요청.", status: "rejected" },
  { tc: "01:03:30:00", shot: "SQ040_050", version: "v002", reviewer: "이도현", note: "렌더 완료 대기 중.", status: "pending" },
];

export const KPI = {
  gpuLoad: { value: 78, unit: "%", label: "GPU 클러스터 부하", context: "임계치 85% 미만 유지" },
  queueDepth: { value: 42, capacity: 60, unit: "건", label: "렌더 큐 대기", context: "정원 60건 중" },
  framesToday: { value: 18240, target: 24000, unit: "fr", label: "오늘 렌더 프레임", context: "목표 24,000fr 중" },
  approvedToday: { value: 9, total: 14, unit: "샷", label: "오늘 승인 샷", context: "총 14샷 중" },
};

export const SLATE = {
  production: "AURORA DRIFT",
  episode: "EP.106",
  sequence: "SQ040_ICECAVE",
  director: "정하늘",
  supervisor: "이도현",
  status: "CONFORM 진행중",
  roll: "A014",
  date: "2026.03.14",
};

export const WORKSPACE = "노스라이트 VFX";
export const CURRENT_USER = { name: "이도현", role: "VFX 슈퍼바이저", initials: "이도" };
