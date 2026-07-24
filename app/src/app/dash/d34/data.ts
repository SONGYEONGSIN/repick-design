/**
 * Pulse — 고객 지원 SLA 운영 콘솔 더미 데이터.
 * 전부 결정론적 정적 리터럴(Math.random/Date.now/new Date() 금지).
 * 채널·부분합 수치는 상위 합계와 정합되도록 직접 검산해 하드코딩했고,
 * 채널별 파생 수치(평균 응답시간·스파크라인 등)는 CHANNEL_META.factor를 곱한
 * 순수 함수로 런타임 계산되어 항상 정합이 맞는다(카드/유틸 코드 참고).
 * "현재 대기열·에스컬레이션·에이전트 현황"은 실시간 스냅샷 성격이라
 * 기간(24h/7d/30d) 토글과 무관하게 고정이며, 채널 필터로만 좁혀진다.
 */

import type {
  Agent,
  Channel,
  CoverageShift,
  EscalationTicket,
  Period,
  PeriodStat,
  Priority,
  QueueTicket,
} from "./types";

export const PRODUCT_NAME = "Pulse";
export const WORKSPACE_NAME = "Northwind 리테일";

export const CHANNELS: Channel[] = ["email", "chat", "phone", "social"];

export const CHANNEL_META: Record<
  Channel,
  { label: string; short: string; factor: number; dotClass: string; textClass: string }
> = {
  email: { label: "이메일", short: "메일", factor: 1.35, dotClass: "bg-indigo-400", textClass: "text-indigo-300" },
  chat: { label: "채팅", short: "채팅", factor: 0.45, dotClass: "bg-emerald-400", textClass: "text-emerald-300" },
  phone: { label: "전화", short: "전화", factor: 1.05, dotClass: "bg-amber-400", textClass: "text-amber-300" },
  social: { label: "소셜", short: "소셜", factor: 1.6, dotClass: "bg-violet-400", textClass: "text-violet-300" },
};

export const PRIORITY_META: Record<
  Priority,
  { label: string; badgeClass: string; dotClass: string; rank: number }
> = {
  urgent: { label: "긴급", badgeClass: "border-rose-400/30 bg-rose-500/10 text-rose-300", dotClass: "bg-rose-400", rank: 3 },
  high: { label: "높음", badgeClass: "border-amber-400/30 bg-amber-500/10 text-amber-300", dotClass: "bg-amber-400", rank: 2 },
  normal: { label: "보통", badgeClass: "border-sky-400/30 bg-sky-500/10 text-sky-300", dotClass: "bg-sky-400", rank: 1 },
  low: { label: "낮음", badgeClass: "border-zinc-400/30 bg-zinc-500/10 text-zinc-400", dotClass: "bg-zinc-500", rank: 0 },
};

export const STATUS_META: Record<
  Agent["status"],
  { label: string; dotClass: string; textClass: string }
> = {
  available: { label: "여유", dotClass: "bg-emerald-400", textClass: "text-emerald-300" },
  busy: { label: "응대중", dotClass: "bg-amber-400", textClass: "text-amber-300" },
  away: { label: "자리비움", dotClass: "bg-zinc-400", textClass: "text-zinc-400" },
  offline: { label: "오프라인", dotClass: "bg-zinc-600", textClass: "text-zinc-400" },
};

export const PERIODS: Period[] = ["24h", "7d", "30d"];

/* ── 기간별 집계(히어로 + 트렌드) ─────────────────────────────── */

export const PERIOD_STATS: Record<Period, PeriodStat> = {
  "24h": {
    label: "지난 24시간",
    shortLabel: "24시간",
    totalHandled: 428,
    channelHandled: { email: 152, chat: 186, phone: 61, social: 29 },
    avgResponseSeconds: 252,
    resolutionRatePct: 91,
    sparkline: [312, 298, 276, 245, 238, 260, 271, 252],
    sparklineLabels: ["00시", "03시", "06시", "09시", "12시", "15시", "18시", "21시"],
    slaByPriority: [
      { priority: "urgent", within: 38, atRisk: 4, breached: 2 },
      { priority: "high", within: 130, atRisk: 10, breached: 4 },
      { priority: "normal", within: 172, atRisk: 14, breached: 6 },
      { priority: "low", within: 44, atRisk: 3, breached: 1 },
    ],
    automationDeflectionPct: 34,
    automationSparkline: [29, 31, 30, 33, 32, 35, 33, 34],
    csatScore: 4.6,
    csatSparkline: [4.5, 4.5, 4.6, 4.4, 4.6, 4.7, 4.6, 4.6],
  },
  "7d": {
    label: "지난 7일",
    shortLabel: "7일",
    totalHandled: 2878,
    channelHandled: { email: 1024, chat: 1247, phone: 402, social: 205 },
    avgResponseSeconds: 267,
    resolutionRatePct: 89,
    sparkline: [289, 276, 270, 281, 258, 247, 267],
    sparklineLabels: ["월", "화", "수", "목", "금", "토", "일"],
    slaByPriority: [
      { priority: "urgent", within: 255, atRisk: 22, breached: 11 },
      { priority: "high", within: 880, atRisk: 64, breached: 24 },
      { priority: "normal", within: 1150, atRisk: 92, breached: 38 },
      { priority: "low", within: 320, atRisk: 18, breached: 4 },
    ],
    automationDeflectionPct: 31,
    automationSparkline: [27, 28, 30, 29, 31, 32, 31],
    csatScore: 4.5,
    csatSparkline: [4.4, 4.5, 4.5, 4.3, 4.5, 4.6, 4.5],
  },
  "30d": {
    label: "지난 30일",
    shortLabel: "30일",
    totalHandled: 11830,
    channelHandled: { email: 4180, chat: 5120, phone: 1640, social: 890 },
    avgResponseSeconds: 274,
    resolutionRatePct: 87,
    sparkline: [301, 295, 288, 279, 270, 265, 258, 268, 271, 274],
    sparklineLabels: ["1주차", "", "2주차", "", "3주차", "", "4주차", "", "", "현재"],
    slaByPriority: [
      { priority: "urgent", within: 1050, atRisk: 88, breached: 42 },
      { priority: "high", within: 3620, atRisk: 260, breached: 100 },
      { priority: "normal", within: 4720, atRisk: 380, breached: 150 },
      { priority: "low", within: 1340, atRisk: 70, breached: 10 },
    ],
    automationDeflectionPct: 29,
    automationSparkline: [24, 25, 26, 27, 28, 27, 28, 29, 28, 29],
    csatScore: 4.4,
    csatSparkline: [4.3, 4.3, 4.4, 4.3, 4.4, 4.5, 4.4, 4.4, 4.5, 4.4],
  },
};

/** 채널별 파생값 — factor를 곱한 순수 함수(런타임 계산, 하드코딩 없음). */
export function channelAvgResponseSeconds(period: Period, channel: Channel): number {
  return Math.round(PERIOD_STATS[period].avgResponseSeconds * CHANNEL_META[channel].factor);
}

export function channelSparkline(period: Period, channel: Channel): number[] {
  const factor = CHANNEL_META[channel].factor;
  return PERIOD_STATS[period].sparkline.map((v) => Math.round(v * factor));
}

/* ── 실시간 스냅샷: 대기열 ────────────────────────────────────── */

export const QUEUE_TICKETS: QueueTicket[] = [
  { id: "TCK-4821", subject: "결제 실패 - 카드사 거절 오류", channel: "email", waitMinutes: 142, priority: "high", requester: "이하윤" },
  { id: "TCK-4822", subject: "실시간 채팅 연결 끊김 반복", channel: "chat", waitMinutes: 6, priority: "urgent", requester: "정우성" },
  { id: "TCK-4823", subject: "API 키 재발급 요청", channel: "email", waitMinutes: 58, priority: "normal", requester: "김나윤" },
  { id: "TCK-4824", subject: "SSO 연동 후 로그인 무한 루프", channel: "chat", waitMinutes: 14, priority: "urgent", requester: "박서준" },
  { id: "TCK-4825", subject: "인보이스 PDF 다운로드 오류", channel: "email", waitMinutes: 203, priority: "low", requester: "최윤아" },
  { id: "TCK-4826", subject: "환불 처리 지연 문의", channel: "phone", waitMinutes: 22, priority: "high", requester: "한지원" },
  { id: "TCK-4827", subject: "웹훅 재전송 반복 실패", channel: "chat", waitMinutes: 9, priority: "normal", requester: "오세훈" },
  { id: "TCK-4828", subject: "대량 CSV 임포트 중단", channel: "email", waitMinutes: 167, priority: "normal", requester: "장미란" },
  { id: "TCK-4829", subject: "SNS 연동 계정 인증 오류", channel: "social", waitMinutes: 41, priority: "low", requester: "윤도현" },
  { id: "TCK-4830", subject: "커스텀 도메인 SSL 만료 임박", channel: "phone", waitMinutes: 33, priority: "high", requester: "서지혜" },
];

export const ESCALATION_TICKETS: EscalationTicket[] = [
  { id: "ESC-118", subject: "결제 게이트웨이 연동 장애 확산", channel: "phone", reason: "3건 연쇄 발생, 이탈 위험", assigneeId: "a1", ageMinutes: 74, priority: "urgent" },
  { id: "ESC-119", subject: "엔터프라이즈 고객 SLA 위반 임박", channel: "email", reason: "응답 대기 3시간 초과", assigneeId: "a5", ageMinutes: 188, priority: "urgent" },
  { id: "ESC-120", subject: "SNS 바이럴 부정 리뷰 대응", channel: "social", reason: "팔로워 급증 계정 공개 불만", assigneeId: "a6", ageMinutes: 52, priority: "high" },
  { id: "ESC-121", subject: "환불 정책 예외 승인 필요", channel: "chat", reason: "매니저 승인 대기", assigneeId: "a3", ageMinutes: 31, priority: "high" },
  { id: "ESC-122", subject: "고객 데이터 유실 의심 신고", channel: "email", reason: "백업 복구 확인 필요", assigneeId: "a1", ageMinutes: 96, priority: "urgent" },
  { id: "ESC-123", subject: "계약 해지 위협 - VIP 고객", channel: "phone", reason: "갱신 담당자 에스컬레이션", assigneeId: "a4", ageMinutes: 15, priority: "high" },
];

export const AGENTS: Agent[] = [
  { id: "a1", name: "김도윤", team: "CS 1팀", primaryChannel: "email", activeTickets: 7, capacity: 10, status: "busy", csat: 4.6 },
  { id: "a2", name: "이서준", team: "CS 1팀", primaryChannel: "chat", activeTickets: 12, capacity: 12, status: "busy", csat: 4.4 },
  { id: "a3", name: "박하은", team: "CS 2팀", primaryChannel: "chat", activeTickets: 5, capacity: 12, status: "available", csat: 4.8 },
  { id: "a4", name: "최민준", team: "CS 2팀", primaryChannel: "phone", activeTickets: 4, capacity: 8, status: "available", csat: 4.5 },
  { id: "a5", name: "정지호", team: "CS 1팀", primaryChannel: "email", activeTickets: 9, capacity: 10, status: "busy", csat: 4.3 },
  { id: "a6", name: "강수아", team: "소셜대응팀", primaryChannel: "social", activeTickets: 3, capacity: 8, status: "available", csat: 4.7 },
  { id: "a7", name: "윤태양", team: "CS 2팀", primaryChannel: "phone", activeTickets: 8, capacity: 8, status: "busy", csat: 4.2 },
  { id: "a8", name: "오세영", team: "CS 1팀", primaryChannel: "chat", activeTickets: 2, capacity: 12, status: "away", csat: 4.6 },
  { id: "a9", name: "한지민", team: "소셜대응팀", primaryChannel: "social", activeTickets: 6, capacity: 8, status: "available", csat: 4.5 },
  { id: "a10", name: "배유진", team: "CS 2팀", primaryChannel: "email", activeTickets: 0, capacity: 10, status: "offline", csat: 4.4 },
];

const agentMap = new Map(AGENTS.map((a) => [a.id, a]));
export function getAgent(id: string): Agent {
  const agent = agentMap.get(id);
  if (!agent) throw new Error(`unknown agent: ${id}`);
  return agent;
}

export const COVERAGE: CoverageShift[] = [
  { shift: "오전", hours: "09:00–15:00", agents: 6, utilizationPct: 72 },
  { shift: "오후", hours: "15:00–21:00", agents: 7, utilizationPct: 88 },
  { shift: "야간", hours: "21:00–09:00", agents: 3, utilizationPct: 54 },
];

export const CHANNEL_FILTERS: { value: "all" | Channel; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "email", label: "이메일" },
  { value: "chat", label: "채팅" },
  { value: "phone", label: "전화" },
  { value: "social", label: "소셜" },
];
