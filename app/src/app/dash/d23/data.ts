// DATUM — 건축사무소 프로젝트·시공 관제 대시보드
// 결정론적 더미 데이터 (Math.random / Date.now 미사용, hydration 안전)

export type Phase = "설계" | "인허가" | "시공" | "준공";
export type PermitStatus = "접수전" | "심의중" | "보완요청" | "승인";
export type ZoneStatus = "완료" | "진행중" | "대기" | "이슈";
export type Severity = "높음" | "중간" | "낮음";
export type MaterialStatus = "발주완료" | "배송중" | "지연" | "입고완료";

export interface Zone {
  id: string;
  zoneKey: string;
  label: string;
  status: ZoneStatus;
  area: number;
  colStart: number;
  colSpan: number;
  rowStart: number;
  rowSpan: number;
}

export interface ProcessPhase {
  name: string;
  percent: number;
}

export interface Revision {
  rev: string;
  date: string;
  note: string;
}

export interface Issue {
  id: string;
  zoneKey: string;
  title: string;
  severity: Severity;
  date: string;
  assignee: string;
}

export interface Material {
  id: string;
  item: string;
  qty: number;
  unit: string;
  status: MaterialStatus;
  dueDate: string;
}

export interface Project {
  id: string;
  code: string;
  name: string;
  phase: Phase;
  location: string;
  permit: PermitStatus;
  scale: string;
  drawnBy: string;
  checkedBy: string;
  date: string;
  sheetNo: string;
  gridSpan: string;
  zones: Zone[];
  processPhases: ProcessPhase[];
  revisions: Revision[];
  issues: Issue[];
  materials: Material[];
}

const ZONE_TEMPLATE = [
  { key: "z1", label: "로비", colStart: 1, colSpan: 2, rowStart: 1, rowSpan: 2, baseArea: 84 },
  { key: "z2", label: "사무공간 A", colStart: 3, colSpan: 3, rowStart: 1, rowSpan: 2, baseArea: 156 },
  { key: "z3", label: "코어", colStart: 6, colSpan: 1, rowStart: 1, rowSpan: 4, baseArea: 42 },
  { key: "z4", label: "사무공간 B", colStart: 1, colSpan: 3, rowStart: 3, rowSpan: 2, baseArea: 132 },
  { key: "z5", label: "기계실", colStart: 4, colSpan: 1, rowStart: 3, rowSpan: 2, baseArea: 28 },
  { key: "z6", label: "테라스", colStart: 5, colSpan: 1, rowStart: 3, rowSpan: 2, baseArea: 36 },
] as const;

const STATUS_CYCLE: ZoneStatus[] = ["완료", "진행중", "대기", "이슈"];
const AREA_FACTORS = [0.8, 1, 1.2, 0.9, 1.1, 1];

function buildZones(idx: number, hasIssue: boolean): Zone[] {
  return ZONE_TEMPLATE.map((t, i) => {
    const status = hasIssue && i === 0 ? "이슈" : STATUS_CYCLE[(idx + i) % STATUS_CYCLE.length];
    const factor = AREA_FACTORS[(idx + i) % AREA_FACTORS.length];
    const area = Math.round(t.baseArea * factor);
    return {
      id: `${t.key}-p${idx}`,
      zoneKey: t.key,
      label: t.label,
      status,
      area,
      colStart: t.colStart,
      colSpan: t.colSpan,
      rowStart: t.rowStart,
      rowSpan: t.rowSpan,
    };
  });
}

const PHASE_NAMES = ["기초공사", "골조공사", "마감공사", "준공/인도"];

function buildPhases(phase: Phase, idx: number): ProcessPhase[] {
  let raw: number[];
  switch (phase) {
    case "설계":
      raw = [15 + (idx % 3) * 5, 0, 0, 0];
      break;
    case "인허가":
      raw = [60 + (idx % 4) * 5, 10 + (idx % 3) * 5, 0, 0];
      break;
    case "시공":
      raw = [100, 70 + (idx % 3) * 10, 20 + (idx % 4) * 10, 0];
      break;
    case "준공":
      raw = [100, 100, 100, 90 + (idx % 2) * 10];
      break;
  }
  return PHASE_NAMES.map((name, i) => ({ name, percent: Math.min(100, raw[i]) }));
}

const REV_NOTES = [
  "최초 인허가 도서 발행",
  "구조 변경 반영",
  "마감재 스펙 변경",
  "현장 실측 반영 수정",
];
const REV_LETTERS = ["A", "B", "C", "D"];
const REV_DATES = ["25.11.02", "25.12.14", "26.02.20", "26.04.08", "26.05.19", "26.06.24"];

function buildRevisions(idx: number, count: number): Revision[] {
  return Array.from({ length: count }, (_, i) => ({
    rev: REV_LETTERS[i % REV_LETTERS.length],
    date: REV_DATES[(idx + i) % REV_DATES.length],
    note: REV_NOTES[(idx + i) % REV_NOTES.length],
  }));
}

const ISSUE_POOL: { title: string; severity: Severity; zoneKey: string }[] = [
  { title: "방수 시공 하자 발견", severity: "높음", zoneKey: "z4" },
  { title: "전기 배선 계획 변경 필요", severity: "중간", zoneKey: "z3" },
  { title: "외벽 마감재 색상 협의중", severity: "낮음", zoneKey: "z2" },
  { title: "주차장 경사로 구배 재검토", severity: "중간", zoneKey: "z6" },
  { title: "기계실 환기 덕트 간섭", severity: "높음", zoneKey: "z5" },
  { title: "로비 천장고 인허가 조건 미달", severity: "높음", zoneKey: "z1" },
];
const ASSIGNEES = ["김도윤", "이서연", "박지훈", "최민아"];
const ISSUE_DATES = ["07.02", "07.05", "07.08", "07.10", "06.28", "06.30"];

function buildIssues(idx: number, count: number): Issue[] {
  return Array.from({ length: count }, (_, i) => {
    const p = ISSUE_POOL[(idx + i) % ISSUE_POOL.length];
    return {
      id: `iss-${idx}-${i}`,
      zoneKey: p.zoneKey,
      title: p.title,
      severity: p.severity,
      date: ISSUE_DATES[(idx + i) % ISSUE_DATES.length],
      assignee: ASSIGNEES[(idx + i) % ASSIGNEES.length],
    };
  });
}

const MATERIAL_POOL: { item: string; unit: string; base: number }[] = [
  { item: "커튼월 유닛", unit: "EA", base: 24 },
  { item: "철근 D22", unit: "TON", base: 18 },
  { item: "레미콘 25-24-150", unit: "㎥", base: 60 },
  { item: "단열재 압출법보온판", unit: "롤", base: 32 },
  { item: "엘리베이터 카", unit: "대", base: 2 },
  { item: "루버 알루미늄", unit: "m", base: 140 },
];
const MATERIAL_STATUS_CYCLE: MaterialStatus[] = ["발주완료", "배송중", "지연", "입고완료"];
const MATERIAL_DATES = ["07.14", "07.18", "07.22", "07.28", "08.02", "08.09"];

function buildMaterials(idx: number, count: number): Material[] {
  return Array.from({ length: count }, (_, i) => {
    const p = MATERIAL_POOL[(idx + i) % MATERIAL_POOL.length];
    return {
      id: `mat-${idx}-${i}`,
      item: p.item,
      qty: p.base + ((idx * 3 + i * 5) % 40),
      unit: p.unit,
      status: MATERIAL_STATUS_CYCLE[(idx + i) % MATERIAL_STATUS_CYCLE.length],
      dueDate: MATERIAL_DATES[(idx + i) % MATERIAL_DATES.length],
    };
  });
}

interface ProjectSeed {
  code: string;
  name: string;
  phase: Phase;
  location: string;
  permit: PermitStatus;
  scale: string;
  gridSpan: string;
  issueCount: number;
  materialCount: number;
  revCount: number;
}

const SEEDS: ProjectSeed[] = [
  { code: "24-014", name: "한남동 복합주거", phase: "시공", location: "서울 용산구 한남동", permit: "승인", scale: "1:200", gridSpan: "24,000", issueCount: 3, materialCount: 4, revCount: 3 },
  { code: "24-021", name: "성수 리버뷰 오피스", phase: "인허가", location: "서울 성동구 성수동", permit: "심의중", scale: "1:150", gridSpan: "18,600", issueCount: 1, materialCount: 3, revCount: 2 },
  { code: "23-098", name: "제주 스테이 리조트", phase: "준공", location: "제주 서귀포시", permit: "승인", scale: "1:250", gridSpan: "31,200", issueCount: 0, materialCount: 2, revCount: 4 },
  { code: "24-033", name: "판교 테크센터 증축", phase: "설계", location: "경기 성남시 판교", permit: "접수전", scale: "1:200", gridSpan: "21,000", issueCount: 2, materialCount: 2, revCount: 1 },
  { code: "24-007", name: "을지로 근생시설", phase: "시공", location: "서울 중구 을지로", permit: "승인", scale: "1:100", gridSpan: "12,800", issueCount: 5, materialCount: 4, revCount: 3 },
  { code: "24-041", name: "송도 데이터센터", phase: "인허가", location: "인천 연수구 송도", permit: "보완요청", scale: "1:300", gridSpan: "42,000", issueCount: 4, materialCount: 3, revCount: 2 },
  { code: "23-112", name: "가평 전원주택 단지", phase: "준공", location: "경기 가평군", permit: "승인", scale: "1:200", gridSpan: "16,400", issueCount: 0, materialCount: 2, revCount: 4 },
  { code: "24-019", name: "여의도 금융센터 리모델링", phase: "시공", location: "서울 영등포구 여의도", permit: "승인", scale: "1:150", gridSpan: "27,600", issueCount: 2, materialCount: 3, revCount: 3 },
];

const DRAWERS = ["JYP", "SHK", "MJL", "DWK"];
const CHECKERS = ["정다은", "오세훈", "정다은", "오세훈"];
const ISSUE_DATES_TITLE = ["26.06.18", "26.06.24", "26.05.30", "26.06.12", "26.06.29", "26.06.05", "26.05.22", "26.06.15"];

export const PROJECTS: Project[] = SEEDS.map((s, idx) => ({
  id: s.code,
  code: s.code,
  name: s.name,
  phase: s.phase,
  location: s.location,
  permit: s.permit,
  scale: s.scale,
  drawnBy: DRAWERS[idx % DRAWERS.length],
  checkedBy: CHECKERS[idx % CHECKERS.length],
  date: ISSUE_DATES_TITLE[idx % ISSUE_DATES_TITLE.length],
  sheetNo: `A-${100 + idx}`,
  gridSpan: s.gridSpan,
  zones: buildZones(idx, s.issueCount > 0),
  processPhases: buildPhases(s.phase, idx),
  revisions: buildRevisions(idx, s.revCount),
  issues: buildIssues(idx, s.issueCount),
  materials: buildMaterials(idx, s.materialCount),
}));

export const PHASE_FILTERS: ("전체" | Phase)[] = ["전체", "설계", "인허가", "시공", "준공"];

export const GRID_LETTERS = ["A", "B", "C", "D", "E", "F"];
