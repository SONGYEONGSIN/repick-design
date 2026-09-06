"use client";

import { AlertCircle, Circle, MousePointerClick } from "lucide-react";
import Image from "next/image";
import {
  HERO_DATA,
  METHOD_LABEL,
  SELLER_BY_ID,
  SETTLEMENT_RUN_BY_ID,
  computeFee,
  currency,
  formatDate,
  isWithinPeriod,
  narrowestPeriodFor,
  type Period,
  type RunStatus,
} from "./data";
import { NUM, TEXT_MUTED, TEXT_PRIMARY, TRANSITION, FOCUS, cx } from "./tokens";
import { Card, CardHead, StatusBadge } from "./ui";

const PERIOD_LABEL: Record<Period, string> = { week: "week", month: "month", quarter: "quarter" };

type Tone = "done" | "current" | "pending" | "issue";
type Step = { label: string; tone: Tone };

const TIMELINE_BY_STATUS: Record<RunStatus, Step[]> = {
  paid: [
    { label: "Initiated", tone: "done" },
    { label: "Processing", tone: "done" },
    { label: "Settled to seller", tone: "done" },
  ],
  processing: [
    { label: "Initiated", tone: "done" },
    { label: "Processing", tone: "current" },
    { label: "Settled to seller", tone: "pending" },
  ],
  held: [
    { label: "Initiated", tone: "done" },
    { label: "Processing", tone: "done" },
    { label: "Held for review", tone: "issue" },
  ],
  failed: [
    { label: "Initiated", tone: "done" },
    { label: "Processing", tone: "done" },
    { label: "Failed", tone: "issue" },
  ],
};

const TONE_STYLE: Record<Tone, string> = {
  done: "border-green-200 bg-green-50 text-green-700",
  current: "border-blue-200 bg-blue-50 text-blue-700",
  pending: "border-zinc-300 bg-white text-zinc-500",
  issue: "border-red-200 bg-red-50 text-red-700",
};

export default function RunDetailPanel({ pinnedRunId, period, onChangePeriod }: { pinnedRunId: string | null; period: Period; onChangePeriod: (p: Period) => void }) {
  const run = pinnedRunId ? SETTLEMENT_RUN_BY_ID[pinnedRunId] : null;

  if (!run) {
    return (
      <Card className="flex h-full min-h-[280px] flex-col items-center justify-center text-center">
        <span className="grid h-10 w-10 place-items-center rounded-full border border-zinc-200 bg-zinc-50">
          <MousePointerClick size={17} aria-hidden="true" className={TEXT_MUTED} />
        </span>
        <h2 className={cx("mt-3 text-sm font-semibold tracking-tight", TEXT_PRIMARY)}>No run pinned</h2>
        <p className={cx("mt-1.5 max-w-[15rem] text-xs font-normal leading-relaxed", TEXT_MUTED)}>
          Pin a settlement run from the table to inspect its fee breakdown and status timeline here. Hovering a seller name instead shows a quick, non-persistent preview.
        </p>
      </Card>
    );
  }

  const seller = SELLER_BY_ID[run.sellerId];
  const fee = computeFee(run.amount, run.method);
  const net = run.amount - fee;
  const inSelectedPeriod = isWithinPeriod(run.dateIso, period);
  const narrowest = narrowestPeriodFor(run.dateIso);
  const steps = TIMELINE_BY_STATUS[run.status];

  return (
    <Card>
      <CardHead title="Run detail" hint="Pinned from the table — stays put until you pin another row or unpin this one." />

      <div className="mt-4 flex items-center gap-2.5">
        <Image
          src={`https://images.unsplash.com/photo-${seller.avatarId}?w=64&h=64&fit=crop&crop=faces`}
          alt=""
          width={32}
          height={32}
          className="h-8 w-8 shrink-0 rounded-full bg-zinc-200 object-cover"
        />
        <div className="min-w-0">
          <p className={cx("truncate text-sm font-semibold", TEXT_PRIMARY)}>{seller.name}</p>
          <p className={cx("truncate text-xs font-normal", TEXT_MUTED)}>{seller.region}</p>
        </div>
        <span className={cx("ml-auto truncate font-mono text-[12px] font-medium", TEXT_MUTED)}>{run.id}</span>
      </div>

      {!inSelectedPeriod ? (
        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2.5">
          <AlertCircle size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-orange-700" />
          <div className="min-w-0">
            <p className="text-xs font-medium leading-relaxed text-orange-900">
              {`Pinned — out of sync. This run settled ${formatDate(run.dateIso)}, outside the selected ${PERIOD_LABEL[period]} window (${HERO_DATA[period].rangeLabel}). It isn't reflected in the hero number or chart above.`}
            </p>
            {narrowest ? (
              <button
                type="button"
                onClick={() => onChangePeriod(narrowest)}
                className={cx("mt-2 rounded-lg border border-orange-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-orange-800", TRANSITION, FOCUS, "hover:bg-orange-100")}
              >
                {`Switch to ${PERIOD_LABEL[narrowest]} view`}
              </button>
            ) : (
              <p className="mt-1 text-[11px] font-normal text-orange-800">Predates the tracked reporting window (quarter starts Jun 15, 2026).</p>
            )}
          </div>
        </div>
      ) : null}

      <dl className="mt-4 grid grid-cols-2 gap-y-3 border-t border-zinc-100 pt-4">
        <div>
          <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED)}>Status</dt>
          <dd className="mt-1">
            <StatusBadge status={run.status} />
          </dd>
        </div>
        <div>
          <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED)}>Date</dt>
          <dd className={cx("mt-1 text-sm font-medium", NUM, TEXT_PRIMARY)}>{formatDate(run.dateIso)}</dd>
        </div>
        <div>
          <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED)}>Method</dt>
          <dd className={cx("mt-1 text-sm font-medium", TEXT_PRIMARY)}>{METHOD_LABEL[run.method]}</dd>
        </div>
        <div>
          <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED)}>Gross amount</dt>
          <dd className={cx("mt-1 text-sm font-medium", NUM, TEXT_PRIMARY)}>{currency(run.amount)}</dd>
        </div>
        <div>
          <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED)}>Processing fee</dt>
          <dd className={cx("mt-1 text-sm font-medium", NUM, TEXT_PRIMARY)}>{currency(fee)}</dd>
        </div>
        <div>
          <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED)}>Net to seller</dt>
          <dd className={cx("mt-1 text-sm font-semibold", NUM, TEXT_PRIMARY)}>{currency(net)}</dd>
        </div>
      </dl>

      <div className="mt-5 border-t border-zinc-100 pt-4">
        <p className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED)}>Timeline</p>
        <ol className="mt-2.5 space-y-2">
          {steps.map((step) => (
            <li key={step.label} className="flex items-center gap-2.5">
              <span className={cx("grid h-5 w-5 shrink-0 place-items-center rounded-full border", TONE_STYLE[step.tone])}>
                <Circle size={7} aria-hidden="true" fill="currentColor" />
              </span>
              <span className={cx("text-[13px] font-normal", step.tone === "pending" ? TEXT_MUTED : TEXT_PRIMARY)}>{step.label}</span>
            </li>
          ))}
        </ol>
      </div>
    </Card>
  );
}
