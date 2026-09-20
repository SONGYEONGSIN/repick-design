"use client";

import { Home } from "lucide-react";
import { useState } from "react";
import BreakdownList from "./BreakdownList";
import { formatPct, formatUSD, nodeById, nodeAtPath, pctOfTotal, REVENUE_TREE, type RevNode } from "./data";
import Sunburst from "./Sunburst";
import { FOCUS, TEXT_AUX, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";

/**
 * Revenue mix: sunburst (dominant, at-a-glance shape) + the mandatory indented-list
 * fallback + breadcrumb, all three sharing one drill-down state. This state is local
 * to this panel only — see LedgerFeed / LedgerlineClient for the note on why the
 * central feed does *not* read from it.
 */
export default function RevenueBreakdown() {
  const [focusPath, setFocusPath] = useState<string[]>([]);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [selectedLeafId, setSelectedLeafId] = useState<string | null>(null);

  const visibleRoot = nodeAtPath(focusPath);

  function activate(node: RevNode) {
    if (node.children && node.children.length > 0) {
      setFocusPath(node.path);
      setSelectedLeafId(null);
    } else {
      setSelectedLeafId((prev) => (prev === node.id ? null : node.id));
    }
  }

  function zoomOut() {
    setFocusPath((p) => p.slice(0, -1));
    setSelectedLeafId(null);
  }

  const crumbs: { id: string; label: string }[] = [{ id: "root", label: "All merchants" }, ...focusPath.map((id) => ({ id, label: nodeById(id)?.label ?? id }))];

  const selectedLeaf = selectedLeafId ? nodeById(selectedLeafId) : null;

  return (
    <div>
      <nav aria-label="Revenue mix drill-down path" className="mb-3 overflow-x-auto">
        <ol className="flex min-w-max items-center gap-1 text-[12px]">
          {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <li key={crumb.id} className="flex items-center gap-1">
                {i > 0 ? <span aria-hidden="true" className={TEXT_AUX}>/</span> : null}
                {isLast ? (
                  <span className={cx("inline-flex min-h-7 items-center rounded-md px-1.5 font-semibold", TEXT_PRIMARY)} aria-current="location">
                    {i === 0 ? (
                      <span className="inline-flex items-center gap-1">
                        <Home size={12} aria-hidden="true" />
                        {crumb.label}
                      </span>
                    ) : (
                      crumb.label
                    )}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setFocusPath(crumb.id === "root" ? [] : nodeById(crumb.id)?.path ?? []);
                      setSelectedLeafId(null);
                    }}
                    className={cx("inline-flex min-h-7 items-center rounded-md px-1.5 font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900", TRANSITION, FOCUS)}
                  >
                    {i === 0 ? (
                      <span className="inline-flex items-center gap-1">
                        <Home size={12} aria-hidden="true" />
                        {crumb.label}
                      </span>
                    ) : (
                      crumb.label
                    )}
                  </button>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <Sunburst visibleRoot={visibleRoot} hoverId={hoverId} onHover={setHoverId} onActivate={activate} canZoomOut={focusPath.length > 0} onZoomOut={zoomOut} />

      {selectedLeaf ? (
        <p className={cx("mt-2 rounded-lg border border-violet-200 bg-violet-50 px-2.5 py-1.5 text-[11.5px] font-medium text-violet-700")}>
          {`Selected — ${selectedLeaf.label}: ${formatUSD(selectedLeaf.value)} (${formatPct(pctOfTotal(selectedLeaf.value))} of total). It's a leaf of the hierarchy, so there's nowhere further to drill.`}
        </p>
      ) : null}

      <div className="mt-4 border-t border-zinc-200 pt-3">
        <p className={cx("mb-1.5 text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>Full breakdown</p>
        <BreakdownList root={REVENUE_TREE} focusPath={focusPath} hoverId={hoverId} onHover={setHoverId} onActivate={activate} />
      </div>
    </div>
  );
}
