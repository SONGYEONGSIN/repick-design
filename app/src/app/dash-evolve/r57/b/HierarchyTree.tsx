"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
  COST_CENTERS,
  costCenterSpendAt,
  formatCurrency,
  formatPercent,
  orgSharePct,
  type PeriodMode,
  serviceSpendAt,
  topMoverAt,
} from "./data";
import { BORDER, FOCUS, NUM, TEAM_RAMP, TEXT_AUX, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";

/**
 * The sunburst's REQUIRED fallback: every node the chart draws, as a collapsible indented list,
 * each with its name and its exact share of org spend — reachable with Tab/Enter/Space alone,
 * no mouse and no hover needed. Focusing (not just clicking) a row sets the same `activeId` the
 * chart's own hover sets, so a keyboard user gets the identical ephemeral detail a mouse user
 * gets by hovering a wedge.
 */
export default function HierarchyTree({ period, activeId, onActivate }: { period: PeriodMode; activeId: string | null; onActivate: (id: string | null) => void }) {
  // Seeded once from the initial period's top mover so the list opens non-empty; never reset by
  // a later period toggle — that would need an effect watching `period`, which is the exact
  // set-state-in-effect pattern this route avoids. Expansion afterward is purely user-driven.
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => ({ [topMoverAt("this").center.id]: true }));

  function toggle(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="max-h-[420px] overflow-y-auto pr-1 [scrollbar-width:thin]">
      <ul className="flex flex-col gap-0.5">
        {COST_CENTERS.map((center, centerIndex) => {
          const spend = costCenterSpendAt(center, period);
          const pct = orgSharePct(spend, period);
          const isOpen = !!expanded[center.id];
          const groupId = `tree-group-${center.id}`;
          const swatch = TEAM_RAMP[centerIndex % TEAM_RAMP.length];
          return (
            <li key={center.id}>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={groupId}
                onFocus={() => onActivate(center.id)}
                onClick={() => {
                  toggle(center.id);
                  onActivate(center.id);
                }}
                className={cx(
                  "flex min-h-11 w-full min-w-0 items-center gap-2 rounded-lg px-2 py-1.5 text-left",
                  TRANSITION,
                  FOCUS,
                  activeId === center.id ? "bg-white/10" : "hover:bg-white/5",
                )}
              >
                {isOpen ? <ChevronDown size={14} aria-hidden="true" className={cx("shrink-0", TEXT_AUX)} /> : <ChevronRight size={14} aria-hidden="true" className={cx("shrink-0", TEXT_AUX)} />}
                <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: swatch }} />
                <center.Icon size={14} aria-hidden="true" className={cx("shrink-0", TEXT_AUX)} />
                <span className={cx("min-w-0 flex-1 truncate text-sm font-medium", TEXT_PRIMARY)}>{center.name}</span>
                <span className={cx("shrink-0 whitespace-nowrap text-xs font-medium", NUM, TEXT_AUX)}>
                  {formatCurrency(spend)} · {formatPercent(pct)}
                </span>
              </button>

              {isOpen ? (
                <ul id={groupId} role="group" className={cx("mt-0.5 ml-5 flex flex-col gap-0.5 border-l pl-3", BORDER)}>
                  {center.services.map((service) => {
                    const sSpend = serviceSpendAt(service, period);
                    const sPct = orgSharePct(sSpend, period);
                    return (
                      <li key={service.id}>
                        <button
                          type="button"
                          onFocus={() => onActivate(service.id)}
                          onClick={() => onActivate(activeId === service.id ? center.id : service.id)}
                          className={cx(
                            "flex min-h-10 w-full min-w-0 items-center gap-2 rounded-lg px-2 py-1.5 text-left",
                            TRANSITION,
                            FOCUS,
                            activeId === service.id ? "bg-white/10" : "hover:bg-white/5",
                          )}
                        >
                          <service.Icon size={13} aria-hidden="true" className={cx("shrink-0", TEXT_AUX)} />
                          <span className={cx("min-w-0 flex-1 truncate text-[13px] font-normal", TEXT_PRIMARY)}>{service.name}</span>
                          <span className={cx("shrink-0 whitespace-nowrap text-xs font-normal", NUM, TEXT_AUX)}>
                            {formatCurrency(sSpend)} · {formatPercent(sPct)}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
