import type { AccountId, Bi, Lang, Period, StatusKey } from "./data";

/* Shell-only strings. Ledger vocabulary still comes from data.ts (UI/CATEGORY/METHOD/STATUS). */
export const SHELL = {
  skip: { en: "Skip to the balance", ko: "잔액으로 건너뛰기" },
  navGeneral: { en: "General", ko: "일반" },
  navOverview: { en: "Overview", ko: "개요" },
  navCashflow: { en: "Cash flow", ko: "현금 흐름" },
  navActivity: { en: "Activity", ko: "거래 내역" },
  navCards: { en: "Cards", ko: "카드" },
  searchLabel: { en: "Search movements", ko: "이동 내역 검색" },
  searchPlaceholder: { en: "Search party or reference", ko: "거래처 또는 참조번호" },
  clear: { en: "Clear search", ko: "검색어 지우기" },
  range: { en: "Date range", ko: "조회 구간" },
  exportLabel: { en: "Export", ko: "내보내기" },
  exportHint: { en: "Export the visible movements as CSV", ko: "표시 중인 이동 내역 CSV 내보내기" },
  allMovement: { en: "All movement", ko: "전체 이동" },
  cashFlow: { en: "Cash flow", ko: "현금 흐름" },
  grain: { en: "Chart grain", ko: "차트 단위" },
  grouped: { en: "Grouped", ko: "구간" },
  daily: { en: "Daily", ko: "일별" },
  accountsHeading: { en: "Accounts", ko: "계좌" },
  recentActivity: { en: "Recent activity", ko: "최근 이동" },
  statusAll: { en: "All statuses", ko: "전체 상태" },
  colType: { en: "Type", ko: "유형" },
  colAmount: { en: "Amount", ko: "금액" },
  shareIn: { en: "of in", ko: "입금 중" },
  shareOut: { en: "of out", ko: "출금 중" },
  sortBy: { en: "Sort by", ko: "정렬 기준" },
  tableCaption: {
    en: "Movements in the selected window, newest first unless a column is sorted.",
    ko: "선택한 기간의 이동 내역이며, 열 정렬 전에는 최신순입니다.",
  },
  myCards: { en: "My cards", ko: "내 카드" },
  cardHolderRole: { en: "Treasury lead", ko: "자금 담당" },
  otherAccounts: { en: "Other accounts", ko: "다른 계좌" },
  switchTo: { en: "Show card for", ko: "카드 보기" },
  vsPrefix: { en: "vs.", ko: "직전 기간" },
  vsSuffix: { en: "last period", ko: "대비" },
  netThis: { en: "net this period", ko: "이번 기간 순이동" },
  compactRows: { en: "Compact rows", ko: "행 좁게" },
  help: { en: "Help", ko: "도움말" },
  helpNote: {
    en: "Figures are illustrative. Every window is measured back from 31 Jul 2026, in USD.",
    ko: "수치는 예시입니다. 모든 기간은 2026년 7월 31일 기준이며 통화는 USD입니다.",
  },
  langEn: { en: "English (EN)", ko: "영어 (EN)" },
  langKo: { en: "Korean (KO)", ko: "한국어 (KO)" },
  chartSummary: { en: "Bar chart of money in above the line and money out below it.", ko: "기준선 위는 입금, 아래는 출금인 막대 차트입니다." },
  highestIn: { en: "Highest money in", ko: "최대 입금" },
  highestOut: { en: "Highest money out", ko: "최대 출금" },
  holderName: { en: "Dana Whitlock", ko: "다나 휘틀록" },
} satisfies Record<string, Bi>;

export const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

export const FOCUS_DARK =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-900";

export const CARD = "rounded-2xl border border-zinc-200 bg-white";

/** Hand rolled compact money, no Intl. */
export function compactMoney(cents: number): string {
  const dollars = Math.abs(Math.round(cents / 100));
  if (dollars >= 1000000) return `$${(Math.round(dollars / 100000) / 10).toFixed(1)}M`;
  if (dollars >= 1000) return `$${(Math.round(dollars / 100) / 10).toFixed(1)}K`;
  return `$${dollars}`;
}

export function periodOption(p: Period, lang: Lang): string {
  return lang === "ko" ? `지난 ${p.days}일` : `Last ${p.days} days`;
}

export const STATUS_ORDER: Record<StatusKey, number> = { settled: 0, pending: 1, review: 2 };

export const STATUS_TONE: Record<StatusKey, string> = {
  settled: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  review: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

export type Trend = "up" | "down" | "flat";

export function trendOf(current: number, previous: number): Trend {
  if (current > previous) return "up";
  if (current < previous) return "down";
  return "flat";
}

export const TREND_TEXT: Record<Trend, string> = {
  up: "text-emerald-700",
  down: "text-rose-600",
  flat: "text-zinc-600",
};

export const TREND_TEXT_DARK: Record<Trend, string> = {
  up: "text-emerald-300",
  down: "text-rose-300",
  flat: "text-teal-100",
};

export const ACCOUNT_ORDER: readonly AccountId[] = ["operating", "payroll", "reserve"];
