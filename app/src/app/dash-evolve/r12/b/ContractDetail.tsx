"use client";

import { Building2, CalendarClock, FileDiff, Info, RefreshCw, Wallet } from "lucide-react";
import type { ReactNode } from "react";
import { STATUS_META, currencyFormatter, formatEffectiveDate, formatExpiry, type Contract, type DetailView } from "./data";
import { BORDER, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, TONE, cx } from "./tokens";
import { Badge, CardHeader, RiskBadge, Segmented } from "./ui";

export default function ContractDetail({ contract, view, onViewChange }: { contract: Contract; view: DetailView; onViewChange: (v: DetailView) => void }) {
  const statusMeta = STATUS_META[contract.status];

  return (
    <section aria-labelledby="contract-detail-heading" className="flex min-w-0 flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 id="contract-detail-heading" className={cx("text-lg font-semibold tracking-tight sm:text-xl", TEXT_PRIMARY)}>
            {contract.counterparty}
          </h2>
          <p className={cx("mt-0.5 text-sm", TEXT_CAPTION)}>{contract.contractType}</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <Badge tone={TONE[statusMeta.tone]}>{statusMeta.label}</Badge>
          <RiskBadge score={contract.riskScore} size={32} />
        </div>
      </div>

      <div className={cx("rounded-xl border p-4", BORDER, "bg-zinc-50/70 dark:bg-white/[0.02]")}>
        <CardHeader as="h3" titleId="contract-metadata-heading" title="Contract details" Icon={Info} />
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 md:grid-cols-3">
          <MetaItem Icon={Building2} label="Parties">
            {contract.parties.map((p) => (
              <span key={p} className="block truncate">
                {p}
              </span>
            ))}
          </MetaItem>
          <MetaItem Icon={CalendarClock} label="Effective date">
            {formatEffectiveDate(contract.effectiveDate)}
          </MetaItem>
          <MetaItem Icon={Wallet} label="Contract value">
            {contract.value === 0 ? "No fee (NDA)" : currencyFormatter.format(contract.value)}
          </MetaItem>
          <MetaItem Icon={RefreshCw} label="Renewal term">
            {contract.renewalTerm}
          </MetaItem>
          <MetaItem Icon={CalendarClock} label="Days to expiry">
            {formatExpiry(contract.daysToExpiry)}
          </MetaItem>
        </dl>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented
          label="Detail view"
          value={view}
          onChange={onViewChange}
          options={[
            { value: "clause", label: "Clause risk" },
            { value: "redline", label: "Redline" },
          ]}
        />
        <p className={cx("text-xs", TEXT_CAPTION)}>{view === "clause" ? `${contract.clauses.length} clauses reviewed` : "Version-over-version markup"}</p>
      </div>

      {view === "clause" ? <ClauseRiskView contract={contract} /> : <RedlineView contract={contract} />}
    </section>
  );
}

function MetaItem({ Icon, label, children }: { Icon: typeof Building2; label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-1">
        <Icon size={12} aria-hidden="true" className={TEXT_CAPTION} />
        <span className={cx("text-[11px] font-semibold uppercase tracking-wider", TEXT_CAPTION)}>{label}</span>
      </dt>
      <dd className={cx("mt-0.5 text-sm font-medium leading-snug", TEXT_PRIMARY)}>{children}</dd>
    </div>
  );
}

function ClauseRiskView({ contract }: { contract: Contract }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 id="clause-risk-heading" className={cx("text-sm font-semibold tracking-tight", TEXT_PRIMARY)}>
        Clause risk breakdown
      </h3>
      <ul aria-labelledby="clause-risk-heading" className="flex flex-col gap-2">
        {contract.clauses.map((clause) => (
          <li key={clause.name} className={cx("flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3", BORDER)}>
            <div className="min-w-0 flex-1">
              <p className={cx("text-sm font-medium", TEXT_PRIMARY)}>{clause.name}</p>
              <p className={cx("mt-0.5 text-xs leading-snug", TEXT_SECONDARY)}>{clause.note}</p>
            </div>
            <RiskBadge score={clause.score} size={30} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function RedlineView({ contract }: { contract: Contract }) {
  if (!contract.redline) {
    return (
      <div className="flex flex-col gap-3">
        <h3 id="redline-heading" className={cx("text-sm font-semibold tracking-tight", TEXT_PRIMARY)}>
          Redline comparison
        </h3>
        <div className={cx("flex items-start gap-2.5 rounded-xl border p-4", BORDER, "bg-zinc-50/70 dark:bg-white/[0.02]")}>
          <Info size={16} aria-hidden="true" className={cx("mt-0.5 shrink-0", TEXT_CAPTION)} />
          <p className={cx("text-sm leading-relaxed", TEXT_SECONDARY)}>{contract.redlineEmptyNote}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 id="redline-heading" className={cx("text-sm font-semibold tracking-tight", TEXT_PRIMARY)}>
          Redline comparison
        </h3>
        <div className={cx("flex items-center gap-3 text-xs", TEXT_CAPTION)}>
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-sm bg-emerald-200 ring-1 ring-emerald-500 dark:bg-emerald-500/25" />
            Added
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-sm bg-rose-200 ring-1 ring-rose-500 dark:bg-rose-500/25" />
            Removed
          </span>
        </div>
      </div>

      {contract.redline.map((clause) => (
        <div key={clause.clauseName} className={cx("rounded-xl border p-4", BORDER)}>
          <h4 className={cx("mb-2 flex items-center gap-1.5 text-sm font-semibold", TEXT_PRIMARY)}>
            <FileDiff size={14} aria-hidden="true" className={TEXT_CAPTION} />
            {clause.clauseName}
          </h4>
          <p className={cx("text-sm leading-relaxed", TEXT_SECONDARY)}>
            {clause.segments.map((seg, i) => {
              if (seg.type === "ins") {
                return (
                  <ins key={i} className="rounded px-0.5 bg-emerald-100 text-emerald-900 no-underline dark:bg-emerald-500/20 dark:text-emerald-200">
                    {seg.text}
                  </ins>
                );
              }
              if (seg.type === "del") {
                return (
                  <del key={i} className="rounded px-0.5 bg-rose-100 text-rose-900 dark:bg-rose-500/20 dark:text-rose-200">
                    {seg.text}
                  </del>
                );
              }
              return <span key={i}>{seg.text}</span>;
            })}
          </p>
        </div>
      ))}
    </div>
  );
}
