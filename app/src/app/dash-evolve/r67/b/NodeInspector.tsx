"use client";

import Image from "next/image";
import { AlertTriangle, ArrowDownRight, ArrowUpRight, Building2 } from "lucide-react";
import {
  AVG_RISK_SCORE,
  NODE_BY_ID,
  RISK_BAND_LABEL,
  TIER_LABEL,
  isConcentrationRisk,
  isSupplierNode,
  neighborsOf,
  ownerOf,
  riskBand,
  spendIncomingTo,
  spendOutgoingFrom,
  usd,
  type GraphNodeData,
} from "./data";
import { FOCUS_RING_INSET } from "./focus";
import { ProgressBar, RiskBadge, TierBadge } from "./ui";

export function NodeInspector({ pinnedId, onPin }: { pinnedId: string; onPin: (id: string) => void }) {
  const node = NODE_BY_ID.get(pinnedId);
  if (!node) return null;

  const supplier = isSupplierNode(node) ? node : null;
  const band = supplier ? riskBand(supplier.riskScore) : null;
  const owner = supplier ? ownerOf(supplier.ownerId) : null;
  const concentrated = isConcentrationRisk(node.id);
  const { upstream, downstream } = neighborsOf(node.id);

  let spendLine: string | null = null;
  if (node.tier === "site") spendLine = `${usd(spendOutgoingFrom(node.id))} committed annually across its direct suppliers.`;
  else if (node.tier === "tier1") spendLine = `${usd(spendIncomingTo(node.id))} received annually from sites it serves.`;

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4">
      <div className="flex min-w-0 items-start justify-between gap-2">
        <div className="min-w-0">
          <span className="whitespace-nowrap rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] font-normal text-zinc-400">
            {node.code}
          </span>
          <h3 className="mt-1.5 truncate text-base font-semibold text-zinc-50">{node.name}</h3>
          <p className="mt-0.5 truncate text-sm font-normal text-zinc-400">
            {node.category} &middot; {node.country}
          </p>
        </div>
        <TierBadge label={TIER_LABEL[node.tier]} />
      </div>

      {concentrated && (
        <div className="flex items-start gap-2 rounded-lg border border-dashed border-orange-400/40 bg-orange-400/10 px-3 py-2.5">
          <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-orange-300" />
          <p className="text-xs font-normal text-orange-200">
            Concentration risk — 2 or more tier-1 vendors depend on this sub-supplier. A disruption here propagates to
            multiple direct suppliers at once.
          </p>
        </div>
      )}

      {band && supplier && (
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.08em] text-zinc-400">Risk score</span>
            <span className="flex items-center gap-1.5 tabular-nums text-zinc-50">
              <span className="font-semibold">{supplier.riskScore}</span>
              <span className="font-normal text-zinc-400">/ 100</span>
            </span>
          </div>
          <div className="mt-1.5">
            <ProgressBar value={supplier.riskScore} label={`Risk score ${supplier.riskScore} of 100`} />
          </div>
          <div className="mt-1.5">
            <RiskBadge band={band} label={`${RISK_BAND_LABEL[band]} risk band`} />
          </div>
          <p className="mt-1.5 text-xs font-normal text-zinc-400">
            Network average: <span className="tabular-nums text-zinc-300">{AVG_RISK_SCORE}</span>/100
          </p>
        </div>
      )}

      {spendLine && <p className="text-sm font-normal text-zinc-300">{spendLine}</p>}
      {node.tier === "tier2" && (
        <p className="text-sm font-normal text-zinc-400">No direct spend — this is a sub-tier sourcing dependency, not a billed relationship.</p>
      )}

      <div className="flex min-w-0 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5">
        {owner ? (
          <>
            <Image
              src={`https://images.unsplash.com/photo-${owner.photoId}?q=80&w=96&auto=format&fit=crop`}
              alt={`Portrait of ${owner.name}`}
              width={28}
              height={28}
              className="size-7 shrink-0 rounded-full object-cover"
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-zinc-100">{owner.name}</span>
              <span className="block truncate text-xs font-normal text-zinc-400">{owner.role}</span>
            </span>
          </>
        ) : (
          <>
            <Building2 aria-hidden="true" className="size-6 shrink-0 text-zinc-400" />
            <span className="text-sm font-normal text-zinc-300">Internal site — no external owner</span>
          </>
        )}
      </div>

      <div className="min-w-0">
        <h4 className="text-xs font-medium uppercase tracking-[0.08em] text-zinc-400">Connections</h4>
        <ConnectionGroup icon={ArrowUpRight} title="Upstream (depends on)" nodes={upstream} onPin={onPin} />
        <ConnectionGroup icon={ArrowDownRight} title="Downstream (depended on by)" nodes={downstream} onPin={onPin} />
        {upstream.length === 0 && downstream.length === 0 && (
          <p className="mt-2 text-sm font-normal text-zinc-400">No recorded connections.</p>
        )}
      </div>
    </div>
  );
}

function ConnectionGroup({
  icon: Icon,
  title,
  nodes,
  onPin,
}: {
  icon: typeof ArrowUpRight;
  title: string;
  nodes: GraphNodeData[];
  onPin: (id: string) => void;
}) {
  if (nodes.length === 0) return null;
  return (
    <div className="mt-2">
      <p className="flex items-center gap-1.5 text-[11px] font-normal text-zinc-400">
        <Icon aria-hidden="true" className="size-3 shrink-0" />
        {title} &middot; {nodes.length}
      </p>
      <ul className="mt-1.5 flex flex-wrap gap-1.5">
        {nodes.map((n) => (
          <li key={n.id} className="min-w-0">
            <button
              type="button"
              onClick={() => onPin(n.id)}
              className={`${FOCUS_RING_INSET} flex max-w-full items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs font-normal text-zinc-300 hover:bg-white/10 hover:text-zinc-50`}
            >
              <span className="shrink-0 font-mono text-[10px] text-zinc-400">{n.code}</span>
              <span className="min-w-0 truncate">{n.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
