"use client";

import { Activity, Pin, PinOff, ShieldAlert } from "lucide-react";
import Image from "next/image";
import { accountAvatar, accountById, API_LATENCY_P95_MS, EVENTS, formatUSD, PAYOUT_BACKLOG_CLEARED_PCT } from "./data";
import { ACCENT_TEXT, BORDER, FOCUS, HOVER_BG, NUM, TEXT_AUX, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Card, CardHead, ProgressBar, Sparkline } from "./ui";

/**
 * Left auxiliary panel. `PinnedAccountRollup` is the *only* thing on the page that
 * reads `pinnedAccountId` — pinning a row in the ledger feed recomputes this one
 * card and nothing else (the feed table keeps every row, unfiltered; the sunburst
 * and its list are on a completely separate drill-down state). That narrow blast
 * radius is the point: it's a scoped "pin", not a shared master-detail selection
 * threaded through every sibling widget on the page.
 */
export function PinnedAccountRollup({ accountId, onClear }: { accountId: string | null; onClear: () => void }) {
  const account = accountId ? accountById(accountId) : null;

  if (!account) {
    return (
      <Card>
        <CardHead title="Pinned account" Icon={Pin} />
        <div className={cx("mt-3 flex flex-col items-center gap-2 rounded-xl border border-dashed px-3 py-6 text-center", BORDER)}>
          <Pin size={18} aria-hidden="true" className={TEXT_AUX} />
          <p className={cx("text-xs font-normal leading-relaxed", TEXT_AUX)}>Pin an account from the ledger feed to see its rollup here.</p>
        </div>
      </Card>
    );
  }

  const accountEvents = EVENTS.filter((e) => e.accountId === account.id);
  const totalVolume = accountEvents.reduce((sum, e) => sum + e.amount, 0);
  const openDisputes = accountEvents.filter((e) => e.type === "dispute" && e.status === "opened").length;

  return (
    <Card>
      <CardHead
        title="Pinned account"
        Icon={Pin}
        action={
          <button type="button" onClick={onClear} aria-label={`Unpin ${account.name}`} className={cx("grid h-8 w-8 place-items-center rounded-lg", TEXT_AUX, HOVER_BG, TRANSITION, FOCUS)}>
            <PinOff size={14} aria-hidden="true" />
          </button>
        }
      />
      <div className="mt-3 flex items-center gap-2.5">
        <Image
          src={`https://images.unsplash.com/photo-${accountAvatar(account.id)}?w=64&h=64&fit=crop&crop=faces`}
          alt=""
          width={32}
          height={32}
          className="h-8 w-8 shrink-0 rounded-full bg-zinc-100 object-cover"
        />
        <div className="min-w-0">
          <p className={cx("truncate text-sm font-semibold", TEXT_PRIMARY)}>{account.name}</p>
          <p className={cx("truncate text-[11px] font-normal", TEXT_AUX)}>{`${account.region} · ${account.channel} · ${account.tier}`}</p>
        </div>
      </div>

      <dl className="mt-3.5 grid grid-cols-2 gap-x-3 gap-y-3">
        <div>
          <dt className={cx("text-[10.5px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>Volume in feed</dt>
          <dd className={cx("mt-0.5 text-lg font-semibold leading-none", NUM, TEXT_PRIMARY)}>{formatUSD(totalVolume)}</dd>
        </div>
        <div>
          <dt className={cx("text-[10.5px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>Events shown</dt>
          <dd className={cx("mt-0.5 text-lg font-semibold leading-none", NUM, TEXT_PRIMARY)}>{accountEvents.length}</dd>
        </div>
        <div className="col-span-2">
          <dt className="flex items-center gap-1">
            <ShieldAlert size={12} aria-hidden="true" className={openDisputes > 0 ? "text-rose-600" : TEXT_AUX} />
            <span className={cx("text-[10.5px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>Open disputes</span>
          </dt>
          <dd className={cx("mt-0.5 text-lg font-semibold leading-none", NUM, openDisputes > 0 ? "text-rose-600" : TEXT_PRIMARY)}>{openDisputes}</dd>
        </div>
      </dl>
    </Card>
  );
}

export function PlatformHealthCard() {
  const latest = API_LATENCY_P95_MS[API_LATENCY_P95_MS.length - 1];
  return (
    <Card>
      <CardHead title="Platform health" Icon={Activity} hint="Unrelated to any selection on this page — always the same numbers." />
      <div className="mt-3.5 space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <p className={cx("text-[10.5px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>Payout backlog cleared</p>
            <p className={cx("text-xs font-semibold", NUM, ACCENT_TEXT)}>{`${PAYOUT_BACKLOG_CLEARED_PCT}%`}</p>
          </div>
          <div className="mt-1.5">
            <ProgressBar pct={PAYOUT_BACKLOG_CLEARED_PCT} label="Payout backlog cleared" />
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className={cx("text-[10.5px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>API latency, p95</p>
            <p className={cx("mt-0.5 text-lg font-semibold leading-none", NUM, TEXT_PRIMARY)}>{`${latest}ms`}</p>
          </div>
          <Sparkline values={API_LATENCY_P95_MS} ariaLabel={`API p95 latency over the last 7 days, currently ${latest} milliseconds`} />
        </div>
      </div>
    </Card>
  );
}
