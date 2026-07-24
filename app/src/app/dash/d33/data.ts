/**
 * Keel — 영업 파이프라인 워크스페이스 더미 데이터.
 * 전부 결정론적 정적 리터럴 — 난수·현재시각 기반 동적 생성 금지.
 * "오늘" 앵커(TODAY_ISO)는 실제 시스템 시각과 무관한 픽션 데이터셋 기준점이다.
 * 집계값(총 파이프라인·가중 예측·컬럼 합계 등)은 이 배열에서 런타임 계산되어
 * 항상 정합이 맞는다(하드코딩된 합계 없음).
 */

export const TODAY_ISO = "2026-07-15";

export type Stage = "lead" | "qualify" | "proposal" | "negotiation";
export type Health = "healthy" | "at_risk" | "stalled";
export type Period = "quarter" | "prev_quarter" | "year";

export interface Owner {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
}

export interface Deal {
  id: string;
  company: string;
  title: string;
  amount: number; // KRW
  ownerId: string;
  stage: Stage;
  probability: number; // 0–100
  daysInStage: number;
  closeDate: string; // ISO YYYY-MM-DD
  health: Health;
  tags: string[];
  isNew?: boolean;
}

export const CURRENT_USER_ID = "u5";

const AV = (id: string) =>
  `https://images.unsplash.com/${id}?q=80&w=200&auto=format&fit=facearea&facepad=2.5`;

export const owners: Owner[] = [
  { id: "u1", name: "정유진", role: "엔터프라이즈 AE", avatarUrl: AV("photo-1472099645785-5658abf4ff4e") },
  { id: "u2", name: "김도현", role: "어카운트 이그제큐티브", avatarUrl: AV("photo-1500648767791-00dcc994a43e") },
  { id: "u3", name: "이서연", role: "세일즈 디벨롭먼트", avatarUrl: AV("photo-1519244703995-f4e0f30006d5") },
  { id: "u4", name: "박준호", role: "어카운트 이그제큐티브", avatarUrl: AV("photo-1544005313-94ddf0286df2") },
  { id: "u5", name: "최지우", role: "세일즈 리드", avatarUrl: AV("photo-1607746882042-944635dfe10e") },
  { id: "u6", name: "한소희", role: "어카운트 이그제큐티브", avatarUrl: AV("photo-1633332755192-727a05c4013d") },
];

const ownerMap = new Map(owners.map((o) => [o.id, o]));
export function getOwner(id: string): Owner {
  const o = ownerMap.get(id);
  if (!o) throw new Error(`unknown owner: ${id}`);
  return o;
}

export const STAGE_ORDER: Stage[] = ["lead", "qualify", "proposal", "negotiation"];

export const stageMeta: Record<
  Stage,
  { label: string; dotClass: string; accentClass: string; description: string }
> = {
  lead: { label: "리드", dotClass: "bg-zinc-400", accentClass: "bg-zinc-300", description: "신규 인입" },
  qualify: { label: "상담중", dotClass: "bg-sky-500", accentClass: "bg-sky-400", description: "검증·미팅" },
  proposal: { label: "제안", dotClass: "bg-violet-500", accentClass: "bg-violet-400", description: "견적 발송" },
  negotiation: { label: "협상", dotClass: "bg-teal-500", accentClass: "bg-teal-400", description: "계약 마무리" },
};

export const healthMeta: Record<
  Health,
  { label: string; badgeClass: string; barClass: string }
> = {
  healthy: {
    label: "순항",
    badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
    barClass: "bg-emerald-500",
  },
  at_risk: {
    label: "주의",
    badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
    barClass: "bg-amber-500",
  },
  stalled: {
    label: "정체",
    badgeClass: "border-rose-200 bg-rose-50 text-rose-700",
    barClass: "bg-rose-500",
  },
};

export const deals: Deal[] = [
  // 리드
  { id: "d01", company: "넥사테크", title: "전사 CRM 도입", amount: 48_000_000, ownerId: "u3", stage: "lead", probability: 20, daysInStage: 3, closeDate: "2026-09-30", health: "healthy", tags: ["인바운드"], isNew: true },
  { id: "d02", company: "다온에너지", title: "데이터 파이프라인", amount: 120_000_000, ownerId: "u2", stage: "lead", probability: 15, daysInStage: 9, closeDate: "2026-10-15", health: "at_risk", tags: ["엔터프라이즈"] },
  { id: "d03", company: "브릭워크스", title: "보안 모듈", amount: 26_000_000, ownerId: "u4", stage: "lead", probability: 25, daysInStage: 2, closeDate: "2026-08-28", health: "healthy", tags: ["인바운드"], isNew: true },
  { id: "d04", company: "노바폼", title: "팀 플랜", amount: 9_600_000, ownerId: "u1", stage: "lead", probability: 18, daysInStage: 21, closeDate: "2026-09-12", health: "stalled", tags: ["셀프서브"] },

  // 상담중
  { id: "d05", company: "그린모빌리티", title: "물류 최적화 스위트", amount: 84_000_000, ownerId: "u1", stage: "qualify", probability: 40, daysInStage: 6, closeDate: "2026-08-20", health: "healthy", tags: ["엔터프라이즈"] },
  { id: "d06", company: "링크헬스케어", title: "규정 준수 애드온", amount: 52_000_000, ownerId: "u3", stage: "qualify", probability: 35, daysInStage: 12, closeDate: "2026-09-05", health: "at_risk", tags: ["규제"] },
  { id: "d07", company: "픽셀커머스", title: "성장 플랜 확장", amount: 31_000_000, ownerId: "u4", stage: "qualify", probability: 45, daysInStage: 4, closeDate: "2026-08-14", health: "healthy", tags: ["인바운드"] },
  { id: "d08", company: "세림바이오", title: "분석 애드온", amount: 18_500_000, ownerId: "u2", stage: "qualify", probability: 30, daysInStage: 8, closeDate: "2026-08-30", health: "healthy", tags: [] },

  // 제안
  { id: "d09", company: "아틀라스물류", title: "전사 라이선스", amount: 156_000_000, ownerId: "u5", stage: "proposal", probability: 60, daysInStage: 5, closeDate: "2026-08-08", health: "healthy", tags: ["엔터프라이즈"] },
  { id: "d10", company: "코어페이먼츠", title: "결제 연동 패키지", amount: 72_000_000, ownerId: "u2", stage: "proposal", probability: 65, daysInStage: 15, closeDate: "2026-07-31", health: "at_risk", tags: ["우선"] },
  { id: "d11", company: "하버클라우드", title: "인프라 번들", amount: 64_000_000, ownerId: "u1", stage: "proposal", probability: 55, daysInStage: 7, closeDate: "2026-08-22", health: "healthy", tags: [] },
  { id: "d12", company: "카이로스AI", title: "모델 호스팅", amount: 38_000_000, ownerId: "u3", stage: "proposal", probability: 70, daysInStage: 3, closeDate: "2026-07-28", health: "healthy", tags: ["인바운드"] },

  // 협상
  { id: "d13", company: "밀레니엄리테일", title: "옴니채널 플랫폼", amount: 198_000_000, ownerId: "u5", stage: "negotiation", probability: 85, daysInStage: 4, closeDate: "2026-07-22", health: "healthy", tags: ["엔터프라이즈"] },
  { id: "d14", company: "세븐브릿지", title: "애널리틱스 스위트", amount: 44_000_000, ownerId: "u4", stage: "negotiation", probability: 80, daysInStage: 6, closeDate: "2026-07-18", health: "healthy", tags: [] },
  { id: "d15", company: "델타뱅크", title: "보안 감사 패키지", amount: 90_000_000, ownerId: "u1", stage: "negotiation", probability: 75, daysInStage: 11, closeDate: "2026-07-25", health: "at_risk", tags: ["규제"] },
  { id: "d16", company: "오르빗스튜디오", title: "크리에이터 플랜", amount: 22_000_000, ownerId: "u3", stage: "negotiation", probability: 90, daysInStage: 2, closeDate: "2026-07-19", health: "healthy", tags: ["인바운드"] },
];

export const periodMeta: Record<Period, { label: string; short: string }> = {
  quarter: { label: "이번 분기", short: "이번 분기" },
  prev_quarter: { label: "지난 분기", short: "지난 분기" },
  year: { label: "연간", short: "연간" },
};

/** 마감(성사/실패) 성과 — 기간 토글로 전환. */
export const closedByPeriod: Record<Period, { wonAmount: number; wonCount: number; lostCount: number }> = {
  quarter: { wonAmount: 312_000_000, wonCount: 7, lostCount: 3 },
  prev_quarter: { wonAmount: 268_000_000, wonCount: 6, lostCount: 4 },
  year: { wonAmount: 1_040_000_000, wonCount: 24, lostCount: 11 },
};

/** 가중 예측 추이(단위: 억원) — 기간 토글로 데이터셋 전환, 크로스헤어 차트에서 사용. */
export const trendByPeriod: Record<Period, { unit: string; points: { label: string; value: number }[] }> = {
  quarter: {
    unit: "억",
    points: [
      { label: "1주", value: 3.9 },
      { label: "2주", value: 4.2 },
      { label: "3주", value: 4.0 },
      { label: "4주", value: 4.6 },
      { label: "5주", value: 5.1 },
      { label: "6주", value: 4.8 },
      { label: "7주", value: 5.4 },
      { label: "8주", value: 5.9 },
      { label: "9주", value: 5.6 },
      { label: "10주", value: 6.2 },
      { label: "11주", value: 6.5 },
      { label: "12주", value: 6.1 },
    ],
  },
  prev_quarter: {
    unit: "억",
    points: [
      { label: "1주", value: 2.8 },
      { label: "2주", value: 3.1 },
      { label: "3주", value: 3.0 },
      { label: "4주", value: 3.5 },
      { label: "5주", value: 3.3 },
      { label: "6주", value: 3.9 },
      { label: "7주", value: 4.1 },
      { label: "8주", value: 3.8 },
      { label: "9주", value: 4.4 },
      { label: "10주", value: 4.7 },
      { label: "11주", value: 4.5 },
      { label: "12주", value: 5.0 },
    ],
  },
  year: {
    unit: "억",
    points: [
      { label: "1월", value: 2.2 },
      { label: "2월", value: 2.9 },
      { label: "3월", value: 3.4 },
      { label: "4월", value: 3.1 },
      { label: "5월", value: 3.8 },
      { label: "6월", value: 4.3 },
      { label: "7월", value: 4.0 },
      { label: "8월", value: 4.9 },
      { label: "9월", value: 5.3 },
      { label: "10월", value: 5.8 },
      { label: "11월", value: 6.2 },
      { label: "12월", value: 6.7 },
    ],
  },
};
