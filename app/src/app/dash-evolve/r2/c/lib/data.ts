// Relay — 캠페인 빌더 더미 데이터 (전부 하드코딩, 결정론적)

export interface AudienceSegment {
  id: string;
  name: string;
  shortName: string;
  description: string;
  size: number;
}

export const SEGMENTS: AudienceSegment[] = [
  {
    id: "all-active",
    name: "전체 활성 고객",
    shortName: "전체 활성",
    description: "최근 90일 내 로그인한 유·무료 사용자 전체",
    size: 12480,
  },
  {
    id: "trial",
    name: "체험 중인 사용자",
    shortName: "체험 중",
    description: "14일 무료 체험을 진행 중인 사용자",
    size: 3210,
  },
  {
    id: "at-risk",
    name: "이탈 위험 고객",
    shortName: "이탈 위험",
    description: "최근 30일 사용량이 50% 이상 감소",
    size: 1875,
  },
  {
    id: "vip",
    name: "VIP 고객",
    shortName: "VIP",
    description: "연간 플랜 가입 + 상위 10% 사용량",
    size: 640,
  },
  {
    id: "dormant",
    name: "휴면 고객 (90일 이상)",
    shortName: "휴면",
    description: "90일 이상 미접속한 과거 활성 사용자",
    size: 5320,
  },
];

export type SendType = "scheduled" | "now";
export type PreviewDevice = "desktop" | "mobile";
export type SetupTab = "audience" | "content" | "schedule";

export interface CampaignDraft {
  segmentId: string;
  fromName: string;
  fromEmail: string;
  subject: string;
  preheader: string;
  bodyHeading: string;
  bodyText: string;
  ctaLabel: string;
  ctaUrl: string;
  sendType: SendType;
  date: string;
  time: string;
  timezone: string;
}

export const DEFAULT_DRAFT: CampaignDraft = {
  segmentId: "all-active",
  fromName: "Relay 팀",
  fromEmail: "hello@relay.app",
  subject: "7월 신규 기능: 자동화 리포트가 도착했습니다",
  preheader: "이제 매주 리포트를 자동으로 받아보세요",
  bodyHeading: "자동화 리포트, 이제 기본 제공입니다",
  bodyText:
    "매주 월요일 아침, 지난주 캠페인 성과를 요약한 리포트가 자동으로 받은편지함에 도착합니다. 별도 설정 없이 워크스페이스 설정에서 켜기만 하면 됩니다.",
  ctaLabel: "리포트 살펴보기",
  ctaUrl: "relay.app/reports",
  sendType: "scheduled",
  date: "2026-07-22",
  time: "09:00",
  timezone: "Asia/Seoul (UTC+09:00)",
};

export type CampaignStatus = "sent" | "scheduled" | "draft";

export interface CampaignHistoryRow {
  id: string;
  name: string;
  segmentId: string;
  date: string;
  recipients: number;
  openRate: number | null;
  clickRate: number | null;
  status: CampaignStatus;
}

export const CAMPAIGN_HISTORY: CampaignHistoryRow[] = [
  {
    id: "camp-01",
    name: "6월 프로덕트 업데이트",
    segmentId: "vip",
    date: "2026-06-02",
    recipients: 640,
    openRate: 68.4,
    clickRate: 24.1,
    status: "sent",
  },
  {
    id: "camp-02",
    name: "이탈 방지 캠페인",
    segmentId: "at-risk",
    date: "2026-06-10",
    recipients: 1875,
    openRate: 41.2,
    clickRate: 9.8,
    status: "sent",
  },
  {
    id: "camp-03",
    name: "체험 종료 리마인더",
    segmentId: "trial",
    date: "2026-06-18",
    recipients: 3210,
    openRate: 55.7,
    clickRate: 18.3,
    status: "sent",
  },
  {
    id: "camp-04",
    name: "여름 프로모션",
    segmentId: "all-active",
    date: "2026-06-25",
    recipients: 12480,
    openRate: 38.9,
    clickRate: 11.4,
    status: "sent",
  },
  {
    id: "camp-05",
    name: "휴면 고객 재활성화",
    segmentId: "dormant",
    date: "2026-07-01",
    recipients: 5320,
    openRate: 22.6,
    clickRate: 4.2,
    status: "sent",
  },
  {
    id: "camp-06",
    name: "신규 기능 티저",
    segmentId: "all-active",
    date: "2026-07-08",
    recipients: 12480,
    openRate: 44.3,
    clickRate: 13.7,
    status: "sent",
  },
  {
    id: "camp-07",
    name: "7월 웨비나 초대",
    segmentId: "vip",
    date: "2026-07-12",
    recipients: 640,
    openRate: 71.2,
    clickRate: 29.5,
    status: "sent",
  },
  {
    id: "camp-08",
    name: "자동화 리포트 런칭",
    segmentId: "all-active",
    date: "2026-07-22",
    recipients: 12480,
    openRate: null,
    clickRate: null,
    status: "scheduled",
  },
];

/** 발송 완료된 캠페인만 시간순 추이 차트에 사용 (미발송 예약분 제외) */
export const SENT_HISTORY = CAMPAIGN_HISTORY.filter((row) => row.status === "sent");

export function segmentById(id: string): AudienceSegment {
  return SEGMENTS.find((s) => s.id === id) ?? SEGMENTS[0];
}
