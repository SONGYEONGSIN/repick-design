// Fieldset — CRM 딜 파이프라인 더미 데이터 (전부 하드코딩, 결정론적)

export type StageId = "new" | "qualifying" | "proposal" | "negotiation" | "won";

export interface Stage {
  id: StageId;
  label: string;
  description: string;
}

export const STAGES: Stage[] = [
  { id: "new", label: "신규 리드", description: "아직 접촉하지 않은 인바운드/아웃바운드 리드" },
  { id: "qualifying", label: "요건 확인", description: "예산·권한·필요·일정을 확인하는 단계" },
  { id: "proposal", label: "제안 발송", description: "가격 제안서·데모를 전달한 단계" },
  { id: "negotiation", label: "협상 중", description: "조건·계약서를 조율하는 단계" },
  { id: "won", label: "계약 완료", description: "계약이 체결되어 종료된 딜" },
];

export function stageById(id: StageId): Stage {
  return STAGES.find((s) => s.id === id) ?? STAGES[0];
}

export interface Owner {
  id: string;
  name: string;
  initials: string;
  photo: string;
  email: string;
}

export const OWNERS: Owner[] = [
  {
    id: "rep-1",
    name: "김도윤",
    initials: "김",
    photo: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=64&h=64&fit=crop&crop=faces",
    email: "dowoon@fieldset.io",
  },
  {
    id: "rep-2",
    name: "이서연",
    initials: "이",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=64&h=64&fit=crop&crop=faces",
    email: "seoyeon@fieldset.io",
  },
  {
    id: "rep-3",
    name: "박지훈",
    initials: "박",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=faces",
    email: "jihoon@fieldset.io",
  },
  {
    id: "rep-4",
    name: "최유나",
    initials: "최",
    photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=64&h=64&fit=crop&crop=faces",
    email: "yuna@fieldset.io",
  },
  {
    id: "rep-5",
    name: "정민재",
    initials: "정",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=64&h=64&fit=crop&crop=faces",
    email: "minjae@fieldset.io",
  },
];

export function ownerById(id: string): Owner {
  return OWNERS.find((o) => o.id === id) ?? OWNERS[0];
}

export type Priority = "high" | "medium" | "low";

export interface Deal {
  id: string;
  company: string;
  contact: string;
  ownerId: string;
  stage: StageId;
  value: number;
  probability: number;
  closeDate: string;
  lastActivityDate: string;
  lastActivityLabel: string;
  priority: Priority;
  nextStep: string;
  source: string;
}

export const DEALS: Deal[] = [
  // ── 신규 리드 ──────────────────────────────────────────────
  {
    id: "deal-01",
    company: "노바로직스",
    contact: "강태민",
    ownerId: "rep-1",
    stage: "new",
    value: 42_000_000,
    probability: 15,
    closeDate: "2026-08-20",
    lastActivityDate: "2026-07-10",
    lastActivityLabel: "웹사이트 문의 폼 제출",
    priority: "medium",
    nextStep: "담당자 배정 후 첫 통화 예약",
    source: "웹사이트 문의",
  },
  {
    id: "deal-02",
    company: "브릭웍스 스튜디오",
    contact: "오세훈",
    ownerId: "rep-3",
    stage: "new",
    value: 18_500_000,
    probability: 10,
    closeDate: "2026-08-05",
    lastActivityDate: "2026-07-12",
    lastActivityLabel: "제품 데모 요청",
    priority: "low",
    nextStep: "데모 일정 조율 이메일 발송",
    source: "제품 데모 요청",
  },
  {
    id: "deal-03",
    company: "파인트리 클리닉",
    contact: "한소영",
    ownerId: "rep-2",
    stage: "new",
    value: 9_800_000,
    probability: 20,
    closeDate: "2026-08-28",
    lastActivityDate: "2026-07-08",
    lastActivityLabel: "가격 문의 이메일",
    priority: "low",
    nextStep: "가격표 회신",
    source: "리퍼럴",
  },
  {
    id: "deal-04",
    company: "헬리오스 에너지",
    contact: "문상혁",
    ownerId: "rep-4",
    stage: "new",
    value: 95_000_000,
    probability: 20,
    closeDate: "2026-09-10",
    lastActivityDate: "2026-07-11",
    lastActivityLabel: "인바운드 콜 접수",
    priority: "high",
    nextStep: "니즈 파악 콜 예약",
    source: "인바운드 콜",
  },
  {
    id: "deal-05",
    company: "실버라인 제조",
    contact: "배윤경",
    ownerId: "rep-5",
    stage: "new",
    value: 27_300_000,
    probability: 15,
    closeDate: "2026-08-15",
    lastActivityDate: "2026-07-09",
    lastActivityLabel: "전시회 명함 스캔",
    priority: "medium",
    nextStep: "팔로업 이메일 발송",
    source: "전시회",
  },
  {
    id: "deal-06",
    company: "그린필드 농업",
    contact: "신재훈",
    ownerId: "rep-1",
    stage: "new",
    value: 14_200_000,
    probability: 10,
    closeDate: "2026-09-01",
    lastActivityDate: "2026-07-13",
    lastActivityLabel: "무료 체험 신청",
    priority: "low",
    nextStep: "체험 온보딩 안내",
    source: "무료 체험",
  },

  // ── 요건 확인 ──────────────────────────────────────────────
  {
    id: "deal-07",
    company: "코발트 파이낸스",
    contact: "윤지호",
    ownerId: "rep-2",
    stage: "qualifying",
    value: 68_000_000,
    probability: 35,
    closeDate: "2026-08-12",
    lastActivityDate: "2026-07-07",
    lastActivityLabel: "요건 확인 콜 완료",
    priority: "high",
    nextStep: "예산 승인권자 미팅 요청",
    source: "아웃바운드",
  },
  {
    id: "deal-08",
    company: "트레일마크 아웃도어",
    contact: "정하은",
    ownerId: "rep-3",
    stage: "qualifying",
    value: 21_000_000,
    probability: 30,
    closeDate: "2026-08-22",
    lastActivityDate: "2026-07-05",
    lastActivityLabel: "예산 규모 확인 중",
    priority: "medium",
    nextStep: "예산 범위 재확인",
    source: "웹사이트 문의",
  },
  {
    id: "deal-09",
    company: "문라이트 미디어",
    contact: "임수빈",
    ownerId: "rep-4",
    stage: "qualifying",
    value: 33_500_000,
    probability: 40,
    closeDate: "2026-08-01",
    lastActivityDate: "2026-07-06",
    lastActivityLabel: "이해관계자 파악",
    priority: "medium",
    nextStep: "의사결정권자 소개 요청",
    source: "리퍼럴",
  },
  {
    id: "deal-10",
    company: "아틀라스 물류",
    contact: "조현우",
    ownerId: "rep-1",
    stage: "qualifying",
    value: 54_000_000,
    probability: 25,
    closeDate: "2026-08-30",
    lastActivityDate: "2026-07-04",
    lastActivityLabel: "경쟁사 비교 요청",
    priority: "high",
    nextStep: "경쟁사 비교표 전달",
    source: "아웃바운드",
  },
  {
    id: "deal-11",
    company: "페블스톤 리테일",
    contact: "남지원",
    ownerId: "rep-5",
    stage: "qualifying",
    value: 16_800_000,
    probability: 35,
    closeDate: "2026-08-18",
    lastActivityDate: "2026-07-03",
    lastActivityLabel: "니즈 인터뷰 진행",
    priority: "low",
    nextStep: "인터뷰 후속 자료 발송",
    source: "제품 데모 요청",
  },

  // ── 제안 발송 ──────────────────────────────────────────────
  {
    id: "deal-12",
    company: "오키드 헬스케어",
    contact: "서동균",
    ownerId: "rep-2",
    stage: "proposal",
    value: 88_000_000,
    probability: 55,
    closeDate: "2026-07-30",
    lastActivityDate: "2026-07-11",
    lastActivityLabel: "제안서 발송 완료",
    priority: "high",
    nextStep: "제안서 검토 콜 예약",
    source: "아웃바운드",
  },
  {
    id: "deal-13",
    company: "브라이트웨이브 통신",
    contact: "백서진",
    ownerId: "rep-3",
    stage: "proposal",
    value: 47_500_000,
    probability: 50,
    closeDate: "2026-08-04",
    lastActivityDate: "2026-07-09",
    lastActivityLabel: "가격 제안서 검토 중",
    priority: "medium",
    nextStep: "가격 반영 회신 대기",
    source: "리퍼럴",
  },
  {
    id: "deal-14",
    company: "시더포인트 부동산",
    contact: "유하람",
    ownerId: "rep-4",
    stage: "proposal",
    value: 39_000_000,
    probability: 45,
    closeDate: "2026-08-10",
    lastActivityDate: "2026-07-10",
    lastActivityLabel: "이해관계자 재검토 요청",
    priority: "medium",
    nextStep: "추가 이해관계자 미팅",
    source: "웹사이트 문의",
  },
  {
    id: "deal-15",
    company: "퀀텀리프 소프트웨어",
    contact: "강민서",
    ownerId: "rep-1",
    stage: "proposal",
    value: 132_000_000,
    probability: 60,
    closeDate: "2026-07-28",
    lastActivityDate: "2026-07-12",
    lastActivityLabel: "기술 검증(POC) 진행 중",
    priority: "high",
    nextStep: "POC 결과 리뷰 미팅",
    source: "아웃바운드",
  },
  {
    id: "deal-16",
    company: "하버뷰 호텔그룹",
    contact: "이도현",
    ownerId: "rep-5",
    stage: "proposal",
    value: 25_600_000,
    probability: 45,
    closeDate: "2026-08-06",
    lastActivityDate: "2026-07-02",
    lastActivityLabel: "제안서 회신 대기",
    priority: "low",
    nextStep: "회신 리마인드 이메일",
    source: "전시회",
  },

  // ── 협상 중 ────────────────────────────────────────────────
  {
    id: "deal-17",
    company: "골든게이트 캐피탈",
    contact: "최윤서",
    ownerId: "rep-2",
    stage: "negotiation",
    value: 156_000_000,
    probability: 75,
    closeDate: "2026-07-24",
    lastActivityDate: "2026-07-13",
    lastActivityLabel: "계약서 법무 검토 중",
    priority: "high",
    nextStep: "법무팀 조항 회신 대기",
    source: "아웃바운드",
  },
  {
    id: "deal-18",
    company: "스파클 뷰티",
    contact: "정하늘",
    ownerId: "rep-3",
    stage: "negotiation",
    value: 22_400_000,
    probability: 70,
    closeDate: "2026-07-22",
    lastActivityDate: "2026-07-12",
    lastActivityLabel: "할인율 협상 중",
    priority: "medium",
    nextStep: "최종 할인율 확정",
    source: "리퍼럴",
  },
  {
    id: "deal-19",
    company: "리버베드 건설",
    contact: "한지민",
    ownerId: "rep-4",
    stage: "negotiation",
    value: 61_000_000,
    probability: 65,
    closeDate: "2026-08-02",
    lastActivityDate: "2026-07-11",
    lastActivityLabel: "예산 승인 대기",
    priority: "high",
    nextStep: "예산 승인 결과 확인",
    source: "웹사이트 문의",
  },
  {
    id: "deal-20",
    company: "노스스타 항공",
    contact: "김하윤",
    ownerId: "rep-1",
    stage: "negotiation",
    value: 210_000_000,
    probability: 80,
    closeDate: "2026-07-21",
    lastActivityDate: "2026-07-14",
    lastActivityLabel: "최종 결재 라인 확인 중",
    priority: "high",
    nextStep: "결재 완료 여부 확인 콜",
    source: "아웃바운드",
  },
  {
    id: "deal-21",
    company: "크림슨 리테일",
    contact: "오지훈",
    ownerId: "rep-5",
    stage: "negotiation",
    value: 34_800_000,
    probability: 65,
    closeDate: "2026-07-26",
    lastActivityDate: "2026-07-10",
    lastActivityLabel: "구매팀 최종 미팅 예정",
    priority: "medium",
    nextStep: "구매팀 미팅 준비",
    source: "제품 데모 요청",
  },

  // ── 계약 완료 ──────────────────────────────────────────────
  {
    id: "deal-22",
    company: "팔콘엣지 보안",
    contact: "박서준",
    ownerId: "rep-2",
    stage: "won",
    value: 72_000_000,
    probability: 100,
    closeDate: "2026-07-02",
    lastActivityDate: "2026-07-02",
    lastActivityLabel: "계약 체결 완료",
    priority: "medium",
    nextStep: "온보딩 킥오프 예약",
    source: "아웃바운드",
  },
  {
    id: "deal-23",
    company: "메이플리프 교육",
    contact: "안유진",
    ownerId: "rep-3",
    stage: "won",
    value: 19_500_000,
    probability: 100,
    closeDate: "2026-06-18",
    lastActivityDate: "2026-06-18",
    lastActivityLabel: "계약 체결 완료",
    priority: "low",
    nextStep: "온보딩 킥오프 완료",
    source: "리퍼럴",
  },
  {
    id: "deal-24",
    company: "선더볼트 스포츠",
    contact: "홍성민",
    ownerId: "rep-4",
    stage: "won",
    value: 45_000_000,
    probability: 100,
    closeDate: "2026-06-25",
    lastActivityDate: "2026-06-25",
    lastActivityLabel: "계약 체결 완료",
    priority: "medium",
    nextStep: "온보딩 킥오프 완료",
    source: "웹사이트 문의",
  },
  {
    id: "deal-25",
    company: "인디고레인 출판",
    contact: "노은채",
    ownerId: "rep-1",
    stage: "won",
    value: 12_300_000,
    probability: 100,
    closeDate: "2026-05-30",
    lastActivityDate: "2026-05-30",
    lastActivityLabel: "계약 체결 완료",
    priority: "low",
    nextStep: "1차 정기 점검 예약",
    source: "무료 체험",
  },
];

export function dealById(id: string): Deal | undefined {
  return DEALS.find((d) => d.id === id);
}

// ── 파생 통계 (부분합=총합 정합을 위해 데이터에서 직접 계산) ──────
export const OPEN_DEALS = DEALS.filter((d) => d.stage !== "won");
export const WON_DEALS = DEALS.filter((d) => d.stage === "won");

export const PIPELINE_VALUE = OPEN_DEALS.reduce((sum, d) => sum + d.value, 0);
export const AVG_DEAL_SIZE = Math.round(PIPELINE_VALUE / OPEN_DEALS.length);
export const CLOSING_THIS_MONTH = OPEN_DEALS.filter((d) => d.closeDate.startsWith("2026-07")).length;
export const WIN_RATE = Math.round((WON_DEALS.length / DEALS.length) * 1000) / 10;

/** 최근 6개월 파이프라인 총가치 추이 (백만원 단위, 스파크라인용 결정론적 더미) */
export const PIPELINE_TREND: { month: string; value: number }[] = [
  { month: "2월", value: 420 },
  { month: "3월", value: 455 },
  { month: "4월", value: 470 },
  { month: "5월", value: 512 },
  { month: "6월", value: 585 },
  { month: "7월", value: 631 },
];

export interface ActivityEntry {
  date: string;
  label: string;
  detail: string;
}

/** 딜 상세 드로어용 활동 로그 */
export function activityLogFor(deal: Deal): ActivityEntry[] {
  const closeEntry: ActivityEntry =
    deal.stage === "won"
      ? { date: deal.closeDate, label: "계약 체결", detail: "계약서 서명 완료, 온보딩 단계로 전환" }
      : { date: deal.closeDate, label: "마감 예정일", detail: `${stageById(deal.stage).label} 단계 기준 예상 마감` };
  return [
    { date: deal.lastActivityDate, label: deal.lastActivityLabel, detail: deal.nextStep },
    closeEntry,
    { date: deal.lastActivityDate, label: "유입 경로", detail: `${deal.source}를 통해 파이프라인에 등록` },
  ];
}
