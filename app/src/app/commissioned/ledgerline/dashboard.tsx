"use client";

import { useMemo, useState } from "react";

import {
  ACCOUNTS,
  BASELINE,
  CATEGORY,
  METHOD,
  PERIODS,
  STATUS,
  accountOf,
  dateFull,
  formatMoney,
  periodOf,
  totalsOf,
  txnsFor,
  type AccountId,
  type Lang,
  type PeriodId,
  type StatusKey,
  type StreamFilter,
  type Txn,
} from "./data";
import { SHELL, STATUS_ORDER } from "./shell";
import Sidebar from "./sidebar";
import Topbar from "./topbar";
import HeroBand from "./hero-band";
import CashFlow from "./cash-flow";
import AccountCards from "./account-cards";
import Activity from "./activity";
import CardsPanel from "./cards-panel";

export type SortKey = "party" | "amount" | "status" | "method";
export type SortState = { key: SortKey; dir: "asc" | "desc" } | null;
export type Grain = "grouped" | "daily";

function matches(row: Txn, query: string): boolean {
  if (query === "") return true;
  const haystack = [row.party.en, row.party.ko, row.memo.en, row.memo.ko, row.ref].join(" ");
  return haystack.toLowerCase().includes(query);
}

function csvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export default function LedgerlineDashboard() {
  const [lang, setLang] = useState<Lang>("en");
  const [period, setPeriod] = useState<PeriodId>("30d");
  const [account, setAccount] = useState<AccountId>("operating");
  const [stream, setStream] = useState<StreamFilter>("all");
  const [status, setStatus] = useState<StatusKey | "all">("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortState>(null);
  const [grain, setGrain] = useState<Grain>("grouped");
  const [compact, setCompact] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const selected = accountOf(account);
  const span = periodOf(period);
  const baseline = BASELINE[account][period];

  const rows = useMemo(() => txnsFor(account, period), [account, period]);
  const totals = useMemo(() => totalsOf(rows), [rows]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const picked = rows.filter(
      (row) =>
        (stream === "all" || row.dir === stream) &&
        (status === "all" || row.status === status) &&
        matches(row, q),
    );
    picked.sort((a, b) => (a.day === b.day ? (a.id < b.id ? -1 : 1) : a.day - b.day));
    if (sort) {
      const flip = sort.dir === "asc" ? 1 : -1;
      picked.sort((a, b) => {
        if (sort.key === "amount") return (a.cents - b.cents) * flip;
        if (sort.key === "status") return (STATUS_ORDER[a.status] - STATUS_ORDER[b.status]) * flip;
        const left = sort.key === "party" ? a.party[lang] : METHOD[a.method][lang];
        const right = sort.key === "party" ? b.party[lang] : METHOD[b.method][lang];
        return left < right ? -flip : left > right ? flip : 0;
      });
    }
    return picked;
  }, [rows, stream, status, query, sort, lang]);

  const csv = useMemo(() => {
    const lines = [
      ["date", "party", "category", "direction", "amount_usd", "status", "method", "reference"]
        .map(csvCell)
        .join(","),
    ];
    for (const row of visible) {
      lines.push(
        [
          dateFull(row.day, "en"),
          row.party.en,
          CATEGORY[row.cat].en,
          row.dir === "in" ? "in" : "out",
          formatMoney(row.cents).replace("$", ""),
          STATUS[row.status].en,
          METHOD[row.method].en,
          row.ref,
        ]
          .map(csvCell)
          .join(","),
      );
    }
    return lines.join("\n");
  }, [visible]);

  const toggleSort = (key: SortKey) => {
    setSort((current) =>
      current && current.key === key
        ? current.dir === "desc"
          ? { key, dir: "asc" }
          : null
        : { key, dir: "desc" },
    );
  };

  return (
    <div
      lang={lang}
      style={{ fontFamily: "var(--font-sans)" }}
      className="min-h-dvh bg-zinc-50 text-zinc-900"
    >
      <a
        href="#overview"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 focus-visible:rounded-xl focus-visible:bg-teal-900 focus-visible:px-4 focus-visible:py-3 focus-visible:text-sm focus-visible:text-white"
      >
        {SHELL.skip[lang]}
      </a>

      <div className="flex flex-col lg:flex-row">
        <Sidebar
          lang={lang}
          onLang={setLang}
          account={account}
          onAccount={setAccount}
          accounts={ACCOUNTS}
          compact={compact}
          onCompact={setCompact}
          helpOpen={helpOpen}
          onHelp={setHelpOpen}
        />

        <main className="min-w-0 flex-1 px-4 py-5 md:px-6 md:py-6">
          {/* 본문 폭 캡을 두지 않는다. 처음 1440, 다음 1760으로 두 번 좁혔는데 두 번 다 사용자
              화면에서 좌우가 비었다 — 1760 도 2200px 부터 벌어진다(2560 에서 272px 씩). 캡을
              세우는 순간 "얼마가 초광폭인가"를 추측하게 되고, 그 추측이 두 번 틀렸다. 같은 주문의
              2차판(/commissioned/ledgerline-d30)이 캡 없이 전 폭에서 좌우 24px 로 꽉 차고
              사용자가 그것을 기준으로 지목했으므로, 캡 대신 패딩만 둔다. */}
          <div className="flex w-full flex-col gap-4">
            <Topbar
              lang={lang}
              period={period}
              onPeriod={setPeriod}
              query={query}
              onQuery={setQuery}
              csv={csv}
              account={account}
              rangeStart={dateFull(span.days - 1, lang)}
              rangeEnd={dateFull(0, lang)}
              periods={PERIODS}
            />

            <HeroBand
              lang={lang}
              account={selected}
              period={period}
              totals={totals}
              baseline={baseline}
              stream={stream}
              onStream={setStream}
            />

            <CashFlow
              lang={lang}
              rows={rows}
              period={period}
              totals={totals}
              baseline={baseline}
              stream={stream}
              grain={grain}
              onGrain={setGrain}
            />

            <AccountCards
              lang={lang}
              accounts={ACCOUNTS}
              selected={account}
              onSelect={setAccount}
              period={period}
              compact={compact}
            />

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
              <Activity
                lang={lang}
                rows={visible}
                totals={totals}
                status={status}
                onStatus={setStatus}
                sort={sort}
                onSort={toggleSort}
                compact={compact}
              />
              <CardsPanel
                lang={lang}
                accounts={ACCOUNTS}
                selected={account}
                onSelect={setAccount}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
