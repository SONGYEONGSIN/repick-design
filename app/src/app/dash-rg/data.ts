import {
  AppWindow,
  ArrowLeftRight,
  Banknote,
  Building2,
  CheckCircle2,
  CreditCard,
  Download,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Landmark,
  Megaphone,
  PieChart,
  PiggyBank,
  Plane,
  Percent,
  Receipt,
  Server,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  type LucideIcon,
} from "lucide-react";

/* ---------------------------------------------------------------------- */
/* 브랜드 & 워크스페이스                                                     */
/* ---------------------------------------------------------------------- */

export const BRAND = {
  name: "Ridge",
  wordmark: "Ridge",
  tagline: "스타트업을 위한 자금 관리 플랫폼",
};

export type Workspace = { id: string; name: string; plan: string };

export const WORKSPACES: Workspace[] = [
  { id: "ws-nimbus", name: "Nimbus Labs 주식회사", plan: "비즈니스 플랜" },
  { id: "ws-sandbox", name: "Nimbus Labs — 샌드박스", plan: "테스트 워크스페이스" },
  { id: "ws-aperture", name: "Studio Aperture (개인)", plan: "프리랜서 플랜" },
];

export type Person = { id: string; name: string; role: string; avatarId: string };

export const PEOPLE: Record<string, Person> = {
  doyoon: { id: "doyoon", name: "김도윤", role: "공동창업자 · Finance", avatarId: "1500648767791-00dcc994a43e" },
  seoyeon: { id: "seoyeon", name: "박서연", role: "오퍼레이션 매니저", avatarId: "1494790108377-be9c29b29330" },
  haneul: { id: "haneul", name: "이하늘", role: "People & Culture", avatarId: "1472099645785-5658abf4ff4e" },
  minjun: { id: "minjun", name: "최민준", role: "재무 담당", avatarId: "1519085360753-af0119f7cbe7" },
};

export const CURRENT_USER = PEOPLE.doyoon;

export function unsplashAvatar(id: string, size = 96): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=faces&w=${size}&h=${size}&q=80`;
}

/* ---------------------------------------------------------------------- */
/* 내비게이션                                                               */
/* ---------------------------------------------------------------------- */

export type NavItem = {
  id: string;
  label: string;
  href: string;
  Icon: LucideIcon;
  badge?: number;
  disabled?: boolean;
};
export type NavSection = { id: string; title: string; items: NavItem[] };

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "workspace",
    title: "워크스페이스",
    items: [
      { id: "overview", label: "개요", href: "#top", Icon: LayoutDashboard },
      { id: "transactions", label: "거래 내역", href: "#transactions", Icon: ArrowLeftRight },
      { id: "accounts", label: "계좌", href: "#accounts", Icon: Landmark },
      { id: "budgets", label: "예산", href: "#budgets", Icon: PieChart },
      { id: "invoices", label: "청구서", href: "#invoices", Icon: Receipt, badge: 2 },
      { id: "team", label: "팀", href: "#", Icon: Users, disabled: true },
    ],
  },
  {
    id: "admin",
    title: "관리",
    items: [
      { id: "reports", label: "리포트", href: "#", Icon: FileText, disabled: true },
      { id: "settings", label: "설정", href: "#", Icon: Settings, disabled: true },
      { id: "help", label: "도움말", href: "#", Icon: HelpCircle, disabled: true },
    ],
  },
];

/* ---------------------------------------------------------------------- */
/* 기간 & KPI 스탯                                                          */
/* ---------------------------------------------------------------------- */

export type PeriodId = "7" | "30" | "90";
export const PERIODS: { id: PeriodId; label: string }[] = [
  { id: "7", label: "7일" },
  { id: "30", label: "30일" },
  { id: "90", label: "90일" },
];

export type Direction = "up" | "down" | "flat";
export type Tone = "positive" | "negative" | "neutral";

export type KpiStat = {
  id: string;
  label: string;
  value: number;
  deltaLabel: string;
  direction: Direction;
  tone: Tone;
  Icon: LucideIcon;
  spark: number[];
};

export const KPI_STATS: Record<PeriodId, KpiStat[]> = {
  "7": [
    {
      id: "balance",
      label: "총 잔고",
      value: 428_760_000,
      deltaLabel: "+2.1% 지난 7일",
      direction: "up",
      tone: "positive",
      Icon: Landmark,
      spark: [415, 417, 416, 420, 423, 426, 428],
    },
    {
      id: "income",
      label: "수입",
      value: 86_240_000,
      deltaLabel: "+12.4% 전주 대비",
      direction: "up",
      tone: "positive",
      Icon: Banknote,
      spark: [10, 11, 10, 13, 15, 13, 13],
    },
    {
      id: "expense",
      label: "지출",
      value: 54_110_000,
      deltaLabel: "-4.8% 전주 대비",
      direction: "down",
      tone: "positive",
      Icon: CreditCard,
      spark: [8, 8, 7, 9, 10, 8, 7],
    },
    {
      id: "netflow",
      label: "순 현금흐름",
      value: 32_130_000,
      deltaLabel: "+18.9% 전주 대비",
      direction: "up",
      tone: "positive",
      Icon: ArrowLeftRight,
      spark: [2, 3, 3, 4, 5, 5, 6],
    },
  ],
  "30": [
    {
      id: "balance",
      label: "총 잔고",
      value: 428_760_000,
      deltaLabel: "+6.4% 지난 30일",
      direction: "up",
      tone: "positive",
      Icon: Landmark,
      spark: [392, 398, 405, 411, 418, 423, 428],
    },
    {
      id: "income",
      label: "수입",
      value: 341_600_000,
      deltaLabel: "+8.7% 전월 대비",
      direction: "up",
      tone: "positive",
      Icon: Banknote,
      spark: [72, 76, 82, 85, 88, 90, 91],
    },
    {
      id: "expense",
      label: "지출",
      value: 236_850_000,
      deltaLabel: "+3.2% 전월 대비",
      direction: "up",
      tone: "negative",
      Icon: CreditCard,
      spark: [54, 55, 58, 57, 60, 61, 62],
    },
    {
      id: "netflow",
      label: "순 현금흐름",
      value: 104_750_000,
      deltaLabel: "-5.6% 전월 대비",
      direction: "down",
      tone: "negative",
      Icon: ArrowLeftRight,
      spark: [22, 24, 23, 21, 19, 18, 17],
    },
  ],
  "90": [
    {
      id: "balance",
      label: "총 잔고",
      value: 428_760_000,
      deltaLabel: "+14.2% 지난 90일",
      direction: "up",
      tone: "positive",
      Icon: Landmark,
      spark: [340, 360, 375, 390, 405, 418, 428],
    },
    {
      id: "income",
      label: "수입",
      value: 968_400_000,
      deltaLabel: "+21.3% 전분기 대비",
      direction: "up",
      tone: "positive",
      Icon: Banknote,
      spark: [140, 152, 161, 170, 178, 185, 192],
    },
    {
      id: "expense",
      label: "지출",
      value: 702_300_000,
      deltaLabel: "+9.1% 전분기 대비",
      direction: "up",
      tone: "negative",
      Icon: CreditCard,
      spark: [98, 102, 108, 112, 118, 124, 129],
    },
    {
      id: "netflow",
      label: "순 현금흐름",
      value: 266_100_000,
      deltaLabel: "+6.8% 전분기 대비",
      direction: "up",
      tone: "positive",
      Icon: ArrowLeftRight,
      spark: [38, 42, 41, 45, 48, 50, 53],
    },
  ],
};

/* ---------------------------------------------------------------------- */
/* 현금흐름 차트                                                            */
/* ---------------------------------------------------------------------- */

export type CashflowPoint = { label: string; income: number; expense: number };

export const CASHFLOW: Record<PeriodId, CashflowPoint[]> = {
  "7": [
    { label: "월", income: 10_200_000, expense: 6_800_000 },
    { label: "화", income: 11_400_000, expense: 7_200_000 },
    { label: "수", income: 9_800_000, expense: 6_100_000 },
    { label: "목", income: 13_500_000, expense: 8_400_000 },
    { label: "금", income: 15_200_000, expense: 9_800_000 },
    { label: "토", income: 12_800_000, expense: 7_900_000 },
    { label: "일", income: 13_340_000, expense: 7_910_000 },
  ],
  "30": [
    { label: "1주차", income: 76_400_000, expense: 54_200_000 },
    { label: "2주차", income: 82_100_000, expense: 58_900_000 },
    { label: "3주차", income: 91_300_000, expense: 61_300_000 },
    { label: "4주차", income: 91_800_000, expense: 62_450_000 },
  ],
  "90": [
    { label: "5월", income: 298_400_000, expense: 221_800_000 },
    { label: "6월", income: 312_600_000, expense: 233_900_000 },
    { label: "7월", income: 357_400_000, expense: 246_600_000 },
  ],
};

/* ---------------------------------------------------------------------- */
/* 계좌                                                                    */
/* ---------------------------------------------------------------------- */

export type Account = {
  id: string;
  name: string;
  note: string;
  type: string;
  mask: string;
  balance: number;
  Icon: LucideIcon;
};

export const ACCOUNTS: Account[] = [
  { id: "acc-checking", name: "Ridge 체크 계좌", note: "운영 자금", type: "체크", mask: "4821", balance: 214_380_000, Icon: Landmark },
  { id: "acc-savings", name: "Ridge 세이빙 계좌", note: "예비 자금", type: "세이빙", mask: "0933", balance: 96_450_000, Icon: PiggyBank },
  { id: "acc-reserve", name: "성장자금 계좌", note: "투자 유치금", type: "리저브", mask: "2290", balance: 110_200_000, Icon: Building2 },
  { id: "acc-tax", name: "세금 예치 계좌", note: "원천징수 · 부가세", type: "세금", mask: "5502", balance: 18_900_000, Icon: ShieldCheck },
  { id: "acc-card", name: "법인카드 (Amex Business)", note: "이번 달 사용액", type: "카드", mask: "7710", balance: -11_170_000, Icon: CreditCard },
];

export const TOTAL_BALANCE = ACCOUNTS.reduce((sum, a) => sum + a.balance, 0);

/* ---------------------------------------------------------------------- */
/* 예산                                                                    */
/* ---------------------------------------------------------------------- */

export type Budget = { id: string; label: string; spent: number; total: number; Icon: LucideIcon };

export const BUDGETS: Budget[] = [
  { id: "b-payroll", label: "인건비 & 급여", spent: 182_400_000, total: 200_000_000, Icon: Users },
  { id: "b-marketing", label: "마케팅", spent: 34_200_000, total: 60_000_000, Icon: Megaphone },
  { id: "b-saas", label: "SaaS 구독료", spent: 18_900_000, total: 20_000_000, Icon: AppWindow },
  { id: "b-office", label: "오피스 & 운영", spent: 12_650_000, total: 25_000_000, Icon: Building2 },
  { id: "b-travel", label: "출장 & 접대비", spent: 9_800_000, total: 8_000_000, Icon: Plane },
];

export function budgetTone(spent: number, total: number): Tone {
  const pct = (spent / total) * 100;
  if (pct > 100) return "negative";
  if (pct >= 80) return "neutral";
  return "positive";
}

/* ---------------------------------------------------------------------- */
/* 거래 내역                                                                */
/* ---------------------------------------------------------------------- */

export type TxStatus = "완료" | "대기" | "거절";

export type Transaction = {
  id: string;
  merchant: string;
  category: string;
  account: string;
  date: Date;
  amount: number;
  status: TxStatus;
  Icon: LucideIcon;
};

export const TRANSACTIONS: Transaction[] = [
  { id: "t1", merchant: "(주)브라이트커머스 대금", category: "매출", account: "체크 ****4821", date: new Date(Date.UTC(2026, 6, 9)), amount: 42_000_000, status: "완료", Icon: Banknote },
  { id: "t2", merchant: "Amazon Web Services", category: "인프라", account: "카드 ****7710", date: new Date(Date.UTC(2026, 6, 8)), amount: -3_420_000, status: "완료", Icon: Server },
  { id: "t3", merchant: "Notion Labs Inc.", category: "소프트웨어", account: "카드 ****7710", date: new Date(Date.UTC(2026, 6, 7)), amount: -186_000, status: "완료", Icon: AppWindow },
  { id: "t4", merchant: "7월 정기 급여", category: "급여", account: "체크 ****4821", date: new Date(Date.UTC(2026, 6, 5)), amount: -182_400_000, status: "완료", Icon: Users },
  { id: "t5", merchant: "메타 광고 (Meta Ads)", category: "마케팅", account: "카드 ****7710", date: new Date(Date.UTC(2026, 6, 4)), amount: -6_800_000, status: "대기", Icon: Megaphone },
  { id: "t6", merchant: "WeWork 강남", category: "사무실", account: "체크 ****4821", date: new Date(Date.UTC(2026, 6, 3)), amount: -9_500_000, status: "완료", Icon: Building2 },
  { id: "t7", merchant: "(주)클라우드나인 대금", category: "매출", account: "체크 ****4821", date: new Date(Date.UTC(2026, 6, 2)), amount: 18_600_000, status: "완료", Icon: Banknote },
  { id: "t8", merchant: "원천징수세 납부", category: "세금", account: "세금 ****5502", date: new Date(Date.UTC(2026, 5, 30)), amount: -14_200_000, status: "완료", Icon: Landmark },
  { id: "t9", merchant: "대한항공 (출장)", category: "여행", account: "카드 ****7710", date: new Date(Date.UTC(2026, 5, 29)), amount: -1_240_000, status: "완료", Icon: Plane },
  { id: "t10", merchant: "토스페이먼츠 수수료", category: "수수료", account: "체크 ****4821", date: new Date(Date.UTC(2026, 5, 28)), amount: -412_000, status: "완료", Icon: Percent },
  { id: "t11", merchant: "Google Workspace", category: "소프트웨어", account: "카드 ****7710", date: new Date(Date.UTC(2026, 5, 27)), amount: -540_000, status: "거절", Icon: AppWindow },
  { id: "t12", merchant: "(주)테라피움 대금 입금", category: "매출", account: "체크 ****4821", date: new Date(Date.UTC(2026, 5, 25)), amount: 26_300_000, status: "완료", Icon: Banknote },
];

export const TX_CATEGORIES = ["전체", ...Array.from(new Set(TRANSACTIONS.map((t) => t.category)))];

/* ---------------------------------------------------------------------- */
/* 최근 활동                                                                */
/* ---------------------------------------------------------------------- */

export type ActivityItem = {
  id: string;
  personId: keyof typeof PEOPLE;
  text: string;
  timeLabel: string;
  Icon: LucideIcon;
};

export const ACTIVITY: ActivityItem[] = [
  { id: "a1", personId: "doyoon", text: "송장 #1042 (AWS) 결제를 승인했어요", timeLabel: "3시간 전", Icon: CheckCircle2 },
  { id: "a2", personId: "seoyeon", text: "마케팅 예산 한도를 6,000만원으로 조정했어요", timeLabel: "어제", Icon: SlidersHorizontal },
  { id: "a3", personId: "haneul", text: "이지훈님을 팀 워크스페이스에 초대했어요", timeLabel: "2일 전", Icon: Users },
  { id: "a4", personId: "minjun", text: "출장 카드 사용 내역에 확인 메모를 남겼어요", timeLabel: "3일 전", Icon: FileText },
  { id: "a5", personId: "doyoon", text: "성장자금 계좌를 새로 연결했어요", timeLabel: "5일 전", Icon: Landmark },
  { id: "a6", personId: "seoyeon", text: "6월 현금흐름 리포트를 내보냈어요", timeLabel: "1주 전", Icon: Download },
];

/* ---------------------------------------------------------------------- */
/* 다가오는 청구서                                                          */
/* ---------------------------------------------------------------------- */

export type InvoiceStatus = "예정" | "임박" | "연체";

export type UpcomingInvoice = {
  id: string;
  vendor: string;
  amount: number;
  dueLabel: string;
  status: InvoiceStatus;
  Icon: LucideIcon;
};

export const UPCOMING_INVOICES: UpcomingInvoice[] = [
  { id: "i1", vendor: "프리랜서 디자인 대금 · 스튜디오 아페르", amount: 4_800_000, dueLabel: "7월 8일 · 연체", status: "연체", Icon: Banknote },
  { id: "i2", vendor: "WeWork 강남 임대료", amount: 9_500_000, dueLabel: "7월 12일 · 임박", status: "임박", Icon: Building2 },
  { id: "i3", vendor: "AWS 인프라 이용료", amount: 3_420_000, dueLabel: "7월 15일 예정", status: "예정", Icon: Server },
  { id: "i4", vendor: "Notion Business", amount: 540_000, dueLabel: "7월 20일 예정", status: "예정", Icon: AppWindow },
  { id: "i5", vendor: "부가가치세 예정 신고", amount: 22_600_000, dueLabel: "7월 25일 예정", status: "예정", Icon: Landmark },
];
