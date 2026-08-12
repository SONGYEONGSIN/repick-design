import type { ReactNode } from "react";

import { SCHEDULED, type AccountId, type Bi, type Scheduled } from "./data";

/* --------------------------------------------------------------- helpers */

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function scheduledFor(account: AccountId): Scheduled[] {
  return SCHEDULED.filter((s) => s.account === account).sort((a, b) => b.day - a.day);
}

export function sumCents(rows: readonly { cents: number }[]): number {
  let total = 0;
  for (const row of rows) total += row.cents;
  return total;
}

/* ------------------------------------------------------------ shell copy */

export const SHELL = {
  navBanking: { en: "Banking", ko: "뱅킹" },
  navManage: { en: "Manage", ko: "관리" },
  navOverview: { en: "Overview", ko: "개요" },
  navMovements: { en: "Movements", ko: "입출금" },
  navScheduled: { en: "Scheduled", ko: "예정 이체" },
  navCards: { en: "Cards", ko: "카드" },
  navInvoices: { en: "Invoices", ko: "청구" },
  navReports: { en: "Reports", ko: "리포트" },
  navSettings: { en: "Settings", ko: "설정" },
  navDemoNote: { en: "Not wired in this demo", ko: "이 데모에서는 동작하지 않습니다" },
  mainMenu: { en: "Main menu", ko: "주 메뉴" },
  openMenu: { en: "Open menu", ko: "메뉴 열기" },
  closeMenu: { en: "Close menu", ko: "메뉴 닫기" },
  switchAccount: { en: "Switch account", ko: "계좌 전환" },
  search: { en: "Search", ko: "검색" },
  searchHint: { en: "Search accounts and periods", ko: "계좌·기간 검색" },
  searchLabel: { en: "Search query", ko: "검색어" },
  jumpTo: { en: "Jump to", ko: "바로 가기" },
  jumpEmpty: { en: "Nothing matched.", ko: "일치하는 항목이 없습니다." },
  closeSearch: { en: "Close search", ko: "검색 닫기" },
  notifications: { en: "Notifications", ko: "알림" },
  userName: { en: "Maren Okafor", ko: "마렌 오카포르" },
  userRole: { en: "Finance lead", ko: "재무 담당" },
  userAvatar: { en: "Maren Okafor avatar", ko: "마렌 오카포르 아바타" },
  keyFigures: { en: "Key figures", ko: "핵심 지표" },
  langEnName: { en: "English", ko: "영어" },
  langKoName: { en: "Korean", ko: "한국어" },
  headDate: { en: "Date", ko: "날짜" },
  headParty: { en: "Counterparty", ko: "거래처" },
  headAmount: { en: "Amount", ko: "금액" },
  tableCaption: {
    en: "Movements for the selected account and window. Use the column buttons to sort.",
    ko: "선택한 계좌와 기간의 거래 목록입니다. 열 버튼으로 정렬합니다.",
  },
  showing: { en: "Showing", ko: "표시 중" },
  chartHint: {
    en: "Point at or focus a column for that window",
    ko: "열에 포인터를 올리거나 포커스하면 해당 구간이 보입니다",
  },
  chartWindow: { en: "Whole period", ko: "전체 기간" },
  breakdownNote: { en: "Top movers in this window", ko: "이 기간의 상위 항목" },
  netNote: { en: "change vs previous window", ko: "직전 기간 대비 변화" },
  balanceNote: { en: "scheduled to leave", ko: "출금 예정" },
  footer: {
    en: "Static demo data, anchored to July 31, 2026. Amounts in USD.",
    ko: "2026년 7월 31일 기준 정적 데모 데이터. 금액 단위는 USD.",
  },
  asOf: { en: "As of Jul 31, 2026", ko: "2026.7.31 기준" },
} satisfies Record<string, Bi>;

export const NOTIFICATIONS: readonly { id: string; title: Bi; time: Bi }[] = [
  {
    id: "nt-1",
    title: {
      en: "Pinecrest Media charge flagged for review",
      ko: "파인크레스트 미디어 결제가 확인 대상으로 표시됨",
    },
    time: { en: "2 hours ago", ko: "2시간 전" },
  },
  {
    id: "nt-2",
    title: {
      en: "Invoice 2288 from Milbrook Interiors is still clearing",
      ko: "밀브룩 인테리어 청구서 2288 정산 진행 중",
    },
    time: { en: "Yesterday", ko: "어제" },
  },
  {
    id: "nt-3",
    title: {
      en: "Payroll funding transfer scheduled for Aug 6",
      ko: "8월 6일 급여 자금 이체 예정",
    },
    time: { en: "2 days ago", ko: "이틀 전" },
  },
];

/* ---------------------------------------------------------------- panels */

export function Panel({
  title,
  meta,
  action,
  children,
  className,
  bodyClassName,
}: {
  title: string;
  meta?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      className={cn(
        "flex min-w-0 flex-col rounded-xl border border-zinc-200 bg-white",
        className,
      )}
    >
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-zinc-100 px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold tracking-tight text-zinc-900">{title}</h2>
          {meta ? <p className="mt-0.5 truncate text-xs text-zinc-600">{meta}</p> : null}
        </div>
        {action ? <div className="min-w-0 shrink-0">{action}</div> : null}
      </div>
      <div className={cn("min-w-0 flex-1", bodyClassName ?? "p-4 sm:p-5")}>{children}</div>
    </section>
  );
}

/* ------------------------------------------------------- segmented group */

export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  size = "md",
}: {
  label: string;
  value: T;
  options: readonly { id: T; label: string }[];
  onChange: (next: T) => void;
  size?: "md" | "sm";
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        "inline-flex items-center rounded-lg border border-zinc-200 bg-zinc-100 p-1",
        size === "md" ? "h-11" : "h-9",
      )}
    >
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.id)}
            className={cn(
              "rounded-md font-medium transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-1",
              size === "md" ? "h-9 px-3 text-[13px]" : "h-7 px-2.5 text-xs",
              active
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-600 hover:text-zinc-900",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
