// SEAL — 지식재산 관제탑: 결정론적 더미 데이터 (정적 스냅샷, Math.random/Date.now 미사용)

export type AssetTab = "all" | "patent" | "trademark" | "litigation";

export const TAB_LABELS: Record<AssetTab, string> = {
  all: "전체 현황",
  patent: "특허",
  trademark: "상표",
  litigation: "소송",
};

export interface TabKpi {
  primaryValue: number;
  primaryUnit: string;
  primaryLabel: string;
  primaryTrend: number[];
  dueValue: number;
  dueUnit: string;
  dueLabel: string;
  dueTrend: number[];
  riskIndex: number;
  riskLabel: "양호" | "주의" | "위험" | "심각";
  valuationValue: number;
  valuationUnit: string;
  valuationLabel: string;
  valuationTrend: number[];
}

export const KPI_BY_TAB: Record<AssetTab, TabKpi> = {
  all: {
    primaryValue: 204,
    primaryUnit: "건",
    primaryLabel: "총 관리 자산",
    primaryTrend: [180, 185, 190, 195, 198, 204],
    dueValue: 18,
    dueUnit: "건",
    dueLabel: "이번 분기 갱신·응답 기한",
    dueTrend: [12, 14, 15, 16, 17, 18],
    riskIndex: 62,
    riskLabel: "주의",
    valuationValue: 842,
    valuationUnit: "억원",
    valuationLabel: "포트폴리오 평가액",
    valuationTrend: [760, 780, 800, 815, 830, 842],
  },
  patent: {
    primaryValue: 128,
    primaryUnit: "건",
    primaryLabel: "보유 특허",
    primaryTrend: [110, 115, 118, 122, 125, 128],
    dueValue: 11,
    dueUnit: "건",
    dueLabel: "이번 분기 갱신 기한",
    dueTrend: [7, 8, 9, 9, 10, 11],
    riskIndex: 71,
    riskLabel: "위험",
    valuationValue: 614,
    valuationUnit: "억원",
    valuationLabel: "특허 자산 평가액",
    valuationTrend: [540, 560, 580, 595, 605, 614],
  },
  trademark: {
    primaryValue: 64,
    primaryUnit: "건",
    primaryLabel: "보유 상표",
    primaryTrend: [55, 57, 59, 61, 62, 64],
    dueValue: 5,
    dueUnit: "건",
    dueLabel: "이번 분기 갱신 기한",
    dueTrend: [3, 3, 4, 4, 5, 5],
    riskIndex: 38,
    riskLabel: "양호",
    valuationValue: 158,
    valuationUnit: "억원",
    valuationLabel: "상표 자산 평가액",
    valuationTrend: [130, 138, 145, 150, 154, 158],
  },
  litigation: {
    primaryValue: 12,
    primaryUnit: "건",
    primaryLabel: "진행 중 소송",
    primaryTrend: [9, 10, 10, 11, 11, 12],
    dueValue: 4,
    dueUnit: "건",
    dueLabel: "응답 기한 임박",
    dueTrend: [2, 2, 3, 3, 4, 4],
    riskIndex: 89,
    riskLabel: "심각",
    valuationValue: 69,
    valuationUnit: "억원",
    valuationLabel: "잠재 손해 노출액",
    valuationTrend: [40, 48, 55, 60, 65, 69],
  },
};

export const MONTH_LABELS = [
  "1월", "2월", "3월", "4월", "5월", "6월",
  "7월", "8월", "9월", "10월", "11월", "12월",
];

export const MONTHLY_DEADLINES_BY_TAB: Record<AssetTab, number[]> = {
  all: [4, 6, 5, 8, 10, 7, 9, 12, 11, 8, 6, 5],
  patent: [3, 4, 3, 5, 7, 5, 6, 8, 7, 6, 4, 3],
  trademark: [1, 2, 2, 2, 3, 2, 2, 3, 3, 2, 2, 1],
  litigation: [0, 1, 1, 2, 1, 1, 1, 3, 2, 1, 1, 0],
};

export const JURISDICTION_RISK_BY_TAB: Record<
  AssetTab,
  { code: string; name: string; value: number }[]
> = {
  all: [
    { code: "KR", name: "대한민국", value: 42 },
    { code: "US", name: "미국", value: 68 },
    { code: "EU", name: "유럽연합", value: 55 },
    { code: "CN", name: "중국", value: 74 },
    { code: "JP", name: "일본", value: 30 },
  ],
  patent: [
    { code: "KR", name: "대한민국", value: 48 },
    { code: "US", name: "미국", value: 75 },
    { code: "EU", name: "유럽연합", value: 60 },
    { code: "CN", name: "중국", value: 80 },
    { code: "JP", name: "일본", value: 35 },
  ],
  trademark: [
    { code: "KR", name: "대한민국", value: 25 },
    { code: "US", name: "미국", value: 40 },
    { code: "EU", name: "유럽연합", value: 35 },
    { code: "CN", name: "중국", value: 65 },
    { code: "JP", name: "일본", value: 20 },
  ],
  litigation: [
    { code: "KR", name: "대한민국", value: 70 },
    { code: "US", name: "미국", value: 90 },
    { code: "EU", name: "유럽연합", value: 50 },
    { code: "CN", name: "중국", value: 85 },
    { code: "JP", name: "일본", value: 40 },
  ],
};

export const COMPOSITION = [
  { label: "특허", value: 128, color: "gold" as const },
  { label: "상표", value: 64, color: "emerald" as const },
  { label: "저작권", value: 9, color: "slate" as const },
  { label: "영업비밀", value: 3, color: "risk" as const },
];

export type RiskLevel = "낮음" | "보통" | "높음" | "심각";
export type RowType = "특허" | "상표" | "소송";

export interface DocketRow {
  id: string;
  name: string;
  type: RowType;
  jurisdiction: string;
  status: string;
  dueMonth: number;
  dueDate: string;
  attorney: string;
  risk: RiskLevel;
}

export const DOCKET_ROWS: DocketRow[] = [
  { id: "AUR-2291", name: "스마트 배터리 열관리 시스템", type: "특허", jurisdiction: "KR", status: "등록", dueMonth: 8, dueDate: "08.14", attorney: "이서연", risk: "보통" },
  { id: "AUR-1187", name: "접이식 디스플레이 힌지 구조", type: "특허", jurisdiction: "US", status: "심사중", dueMonth: 9, dueDate: "09.02", attorney: "박도현", risk: "높음" },
  { id: "AUR-0456", name: "냉각수 순환 제어 알고리즘", type: "특허", jurisdiction: "EU", status: "이의신청", dueMonth: 8, dueDate: "08.28", attorney: "최윤아", risk: "심각" },
  { id: "TM-0114", name: "VELOR 브랜드 워드마크", type: "상표", jurisdiction: "KR", status: "등록", dueMonth: 10, dueDate: "10.05", attorney: "이서연", risk: "낮음" },
  { id: "TM-0098", name: "노바킷 로고", type: "상표", jurisdiction: "CN", status: "출원", dueMonth: 7, dueDate: "07.30", attorney: "정하람", risk: "보통" },
  { id: "TM-0071", name: "AERIS 슬로건", type: "상표", jurisdiction: "JP", status: "등록", dueMonth: 11, dueDate: "11.18", attorney: "박도현", risk: "낮음" },
  { id: "LIT-2026-014", name: "특허침해 손해배상 청구", type: "소송", jurisdiction: "KR", status: "진행중", dueMonth: 8, dueDate: "08.07", attorney: "최윤아", risk: "심각" },
  { id: "LIT-2026-009", name: "상표권 이의신청 심판", type: "소송", jurisdiction: "KR", status: "선고대기", dueMonth: 8, dueDate: "08.21", attorney: "정하람", risk: "높음" },
  { id: "AUR-3312", name: "태양광 패널 방열 코팅", type: "특허", jurisdiction: "KR", status: "등록", dueMonth: 12, dueDate: "12.03", attorney: "이서연", risk: "낮음" },
  { id: "LIT-2026-021", name: "영업비밀 침해금지 가처분", type: "소송", jurisdiction: "US", status: "진행중", dueMonth: 7, dueDate: "07.25", attorney: "최윤아", risk: "심각" },
];

export const RISK_STYLE: Record<RiskLevel, string> = {
  낮음: "낮음 · 안정",
  보통: "보통 · 관찰",
  높음: "높음 · 대응 필요",
  심각: "심각 · 즉시 대응",
};
