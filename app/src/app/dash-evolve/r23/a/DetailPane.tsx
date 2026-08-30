"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Wallet,
  Clock,
  TriangleAlert,
  Star,
  ShieldCheck,
  ImageIcon,
  RefreshCcw,
  Ban,
  MessagesSquare,
  HelpCircle,
  Check,
  CalendarClock,
} from "lucide-react";
import {
  type DisputeCase,
  STATUS_META,
  VERDICT_META,
  formatKrw,
  formatSla,
  formatDateTime,
  buildTimeline,
} from "./data";
import { Card, Badge, Tabs, ProgressBar, cx, FOCUS_LIGHT } from "./ui";
import { ConfidenceGauge } from "./ConfidenceGauge";
import { Timeline } from "./Timeline";

type TabKey = "overview" | "timeline" | "evidence";

/**
 * Selection propagation, mode A — the "pin".
 *
 * `client.tsx` renders `<DetailPane key={selectedCase.id} c={selectedCase} />`. Keying on the case id
 * means a rail-row click doesn't patch this tree in place — it unmounts the previous case's DetailPane and mounts a
 * fresh one, which is a deliberate, partial recompute: every piece of state that lives *inside*
 * DetailPane (active tab, the resolution-panel choice) resets to its default the moment the pin
 * changes case, exactly as if the analyst opened a new case fresh. What this does NOT do, on
 * purpose: the KPI strip in client.tsx never receives `selectedCase` as a prop at all, so pinning a
 * case never recomputes the queue-wide aggregates — a single case's status has no business changing
 * the team's SLA-at-risk count. Contrast with the ephemeral hover tooltips in ConfidenceGauge.tsx and
 * Timeline.tsx (mode B), which touch no state outside their own component and leave nothing pinned.
 */
export function DetailPane({ c }: { c: DisputeCase }) {
  const [tab, setTab] = useState<TabKey>("overview");
  const meta = STATUS_META[c.status];
  const verdict = VERDICT_META[c.verdict];
  const overdue = c.slaHoursRemaining !== null && c.slaHoursRemaining < 0;

  return (
    <Card padded={false} className="flex min-h-[560px] flex-col overflow-hidden">
      <header className="border-b border-zinc-200 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-medium tabular-nums text-zinc-500">
              {c.id} · {c.category}
            </p>
            <h2 className="mt-1 text-[18px] font-semibold tracking-tight text-zinc-900">{c.itemTitle}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <Badge tone={meta.tone}>{meta.label}</Badge>
              <Badge tone="neutral">{c.claimType}</Badge>
              {c.slaHoursRemaining !== null && (
                <Badge tone={overdue ? "red" : "neutral"} icon={overdue ? <TriangleAlert className="h-3 w-3" /> : <Clock className="h-3 w-3" />}>
                  {formatSla(c.slaHoursRemaining)}
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">Claim amount</p>
            <p className="mt-0.5 flex items-center justify-end gap-1 text-[20px] font-semibold tabular-nums text-zinc-900">
              <Wallet className="h-4 w-4 text-zinc-400" />
              {formatKrw(c.amountKrw)}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <Tabs
            active={tab}
            onChange={setTab}
            tabs={[
              { value: "overview", label: "Overview" },
              { value: "timeline", label: "Timeline" },
              { value: "evidence", label: `Evidence (${c.evidenceCount + 1})` },
            ]}
          />
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        {tab === "overview" && <Overview c={c} verdictLabel={verdict.label} />}
        {tab === "timeline" && <Timeline events={buildTimeline(c)} />}
        {tab === "evidence" && <Evidence c={c} />}
      </div>
    </Card>
  );
}

function Overview({ c, verdictLabel }: { c: DisputeCase; verdictLabel: string }) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div className="min-w-0 space-y-5 lg:col-span-2">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ClaimCard title="Buyer claim" name={c.buyer.name} text={c.buyerClaimText} empty="No claim text on file." />
          <ClaimCard title="Seller response" name={c.seller.name} text={c.sellerResponseText} empty="Awaiting seller response." />
        </div>

        <Card className="min-w-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-amber-700" />
            <p className="text-[13px] font-semibold text-zinc-900">AI re-grade assessment</p>
          </div>
          <p className="mt-1 text-[12px] text-zinc-500">
            Original listing grade was <span className="font-medium text-zinc-700">{c.listingGrade.label} ({c.listingGrade.score}/100)</span>.
          </p>
          <div className="mt-4">
            <ConfidenceGauge confidence={c.aiRegradeConfidence} verdictLabel={verdictLabel} trend={c.confidenceTrend} />
          </div>
        </Card>

        <ResolutionPanel c={c} />
      </div>

      <aside className="min-w-0 space-y-4">
        <Card>
          <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">Parties</p>
          <div className="mt-3 space-y-3">
            <PartyRow person={c.buyer} />
            <PartyRow person={c.seller} />
          </div>
        </Card>

        <Card>
          <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">Listing reference</p>
          <div className="relative mt-2 aspect-[4/3] w-full overflow-hidden rounded-lg bg-zinc-100">
            <Image
              src={`https://images.unsplash.com/photo-${c.photoId}?auto=format&fit=crop&w=480&q=75`}
              alt={c.photoAlt}
              fill
              sizes="(min-width: 1536px) 260px, 320px"
              className="object-cover"
            />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[12px] text-zinc-500">Grade at listing</span>
            <Badge tone="neutral">
              {c.listingGrade.label} · {c.listingGrade.score}
            </Badge>
          </div>
          <div className="mt-2">
            <ProgressBar value={c.listingGrade.score} tone="zinc" label={`Listing grade score, ${c.listingGrade.score} out of 100`} />
          </div>
        </Card>

        <Card>
          <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">Case meta</p>
          <dl className="mt-2 space-y-2 text-[12px]">
            <div className="flex items-center justify-between gap-2">
              <dt className="flex items-center gap-1.5 text-zinc-500">
                <CalendarClock className="h-3.5 w-3.5" /> Opened
              </dt>
              <dd className="tabular-nums whitespace-nowrap text-zinc-700">{formatDateTime(c.openedAt)}</dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className="text-zinc-500">Last activity</dt>
              <dd className="tabular-nums whitespace-nowrap text-zinc-700">{formatDateTime(c.lastActivityAt)}</dd>
            </div>
            {c.resolvedAt && (
              <div className="flex items-center justify-between gap-2">
                <dt className="text-zinc-500">Resolved</dt>
                <dd className="tabular-nums whitespace-nowrap text-zinc-700">{formatDateTime(c.resolvedAt)}</dd>
              </div>
            )}
          </dl>
          {c.resolutionNote && <p className="mt-3 rounded-lg bg-zinc-50 p-2.5 text-[12px] leading-relaxed text-zinc-600">{c.resolutionNote}</p>}
        </Card>
      </aside>
    </div>
  );
}

function ClaimCard({ title, name, text, empty }: { title: string; name: string; text: string; empty: string }) {
  return (
    <Card className="min-w-0">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">{title}</p>
        <MessagesSquare className="h-3.5 w-3.5 text-zinc-400" />
      </div>
      <p className="mt-1 text-[12px] font-medium text-zinc-700">{name}</p>
      <p className={cx("mt-2 text-[13px] leading-relaxed", text ? "text-zinc-800" : "text-zinc-500 italic")}>{text || empty}</p>
    </Card>
  );
}

function PartyRow({ person }: { person: DisputeCase["buyer"] }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-zinc-100">
        <Image src={`https://images.unsplash.com/photo-${person.avatarId}?w=64&h=64&fit=crop&crop=faces`} alt="" fill sizes="32px" className="object-cover" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium text-zinc-900">{person.name}</p>
        <p className="text-[11px] text-zinc-500">
          {person.role} · {person.orders} orders · since {person.memberSince}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1 text-[12px] tabular-nums text-zinc-600">
        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
        {person.rating.toFixed(1)}
      </div>
    </div>
  );
}

function Evidence({ c }: { c: DisputeCase }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">Listing photo</p>
      <div className="relative mt-2 aspect-[16/9] w-full max-w-sm overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
        <Image
          src={`https://images.unsplash.com/photo-${c.photoId}?auto=format&fit=crop&w=640&q=75`}
          alt={c.photoAlt}
          fill
          sizes="384px"
          className="object-cover"
        />
        <span className="absolute bottom-2 left-2 rounded-md border border-zinc-200 bg-white/95 px-2 py-0.5 text-[11px] font-medium text-zinc-700 shadow-sm">
          Captured at intake · {c.listingGrade.label}
        </span>
      </div>

      <p className="mt-5 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
        Buyer-submitted evidence ({c.evidenceCount})
      </p>
      <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: c.evidenceCount }).map((_, i) => (
          <div key={i} className="relative aspect-square overflow-hidden rounded-xl border border-dashed border-zinc-300 bg-zinc-50">
            <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-zinc-500">
              <ImageIcon className="h-5 w-5" />
              <span className="text-[10px] font-medium uppercase tracking-wide">Photo {i + 1}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type ResolutionChoice = "refund_buyer" | "uphold_seller" | "more_evidence";

const RESOLUTION_OPTIONS: { value: ResolutionChoice; label: string; detail: string; icon: typeof RefreshCcw }[] = [
  { value: "refund_buyer", label: "Refund buyer", detail: "Return the claim amount to the buyer.", icon: RefreshCcw },
  { value: "uphold_seller", label: "Uphold seller", detail: "Deny the claim; release funds to the seller.", icon: Ban },
  { value: "more_evidence", label: "Request more evidence", detail: "Hold the case open and message both parties.", icon: HelpCircle },
];

function ResolutionPanel({ c }: { c: DisputeCase }) {
  const resolved = c.status === "resolved_buyer" || c.status === "resolved_seller";
  const [choice, setChoice] = useState<ResolutionChoice | null>(
    resolved ? (c.status === "resolved_buyer" ? "refund_buyer" : "uphold_seller") : null,
  );

  return (
    <Card>
      <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">Resolution</p>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {RESOLUTION_OPTIONS.map((opt) => {
          const active = choice === opt.value;
          const Icon = opt.icon;
          return (
            <button
              key={opt.value}
              type="button"
              disabled={resolved}
              aria-pressed={active}
              onClick={() => setChoice(opt.value)}
              className={cx(
                "rounded-lg border p-3 text-left transition-colors motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-60",
                active ? "border-amber-300 bg-amber-50" : "border-zinc-200 bg-white hover:bg-zinc-50",
                FOCUS_LIGHT,
              )}
            >
              <div className="flex items-center justify-between">
                <Icon className={cx("h-4 w-4", active ? "text-amber-700" : "text-zinc-400")} />
                {active && <Check className="h-3.5 w-3.5 text-amber-700" strokeWidth={2.5} />}
              </div>
              <p className={cx("mt-2 text-[12.5px] font-medium", active ? "text-amber-900" : "text-zinc-800")}>{opt.label}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-zinc-500">{opt.detail}</p>
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="text-[11px] text-zinc-500">
          {resolved ? c.resolutionNote ?? "This case is closed." : choice ? "Ready to confirm." : "Choose a resolution to continue."}
        </p>
        <button
          type="button"
          disabled={resolved || !choice}
          className={cx(
            "rounded-lg bg-amber-700 px-3.5 py-2 text-[12.5px] font-medium text-white transition-colors motion-reduce:transition-none hover:bg-amber-800 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-600",
            FOCUS_LIGHT,
          )}
        >
          {resolved ? "Case closed" : "Confirm resolution"}
        </button>
      </div>
    </Card>
  );
}
