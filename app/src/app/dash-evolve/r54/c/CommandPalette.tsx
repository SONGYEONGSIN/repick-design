"use client";

import { FileText, Search, Tag, X } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { COST_TYPE_META, COST_TYPE_ORDER, DEPARTMENT_META, DEPARTMENT_ORDER, LINE_ITEMS } from "./data";
import type { CostTypeId, DepartmentId } from "./data";
import { formatCurrency } from "./format";
import { BORDER, FOCUS, HOVER_BG, PANEL_BG, TEXT_AUX, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Eyebrow } from "./ui";

type Entry =
  | { kind: "department"; id: DepartmentId; title: string; meta: string; Icon: typeof Tag }
  | { kind: "costType"; id: CostTypeId; title: string; meta: string; Icon: typeof Tag }
  | { kind: "lineItem"; id: string; title: string; meta: string; departmentId: DepartmentId; Icon: typeof Tag };

export default function CommandPalette({
  open,
  onClose,
  query,
  onQueryChange,
  onSelectDepartment,
  onSelectCostType,
}: {
  open: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (q: string) => void;
  onSelectDepartment: (id: DepartmentId) => void;
  onSelectCostType: (id: CostTypeId) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const entries: Entry[] = useMemo(() => {
    const departments: Entry[] = DEPARTMENT_ORDER.map((id) => ({ kind: "department", id, title: DEPARTMENT_META[id].name, meta: "Department", Icon: DEPARTMENT_META[id].icon }));
    const costTypes: Entry[] = COST_TYPE_ORDER.map((id) => ({ kind: "costType", id, title: COST_TYPE_META[id].name, meta: "Cost type", Icon: COST_TYPE_META[id].icon }));
    const lineItems: Entry[] = LINE_ITEMS.map((li) => ({
      kind: "lineItem",
      id: li.id,
      title: li.description,
      meta: `${DEPARTMENT_META[li.departmentId].name} · ${formatCurrency(li.amount)}`,
      departmentId: li.departmentId,
      Icon: FileText,
    }));
    return [...departments, ...costTypes, ...lineItems];
  }, []);

  const q = query.trim().toLowerCase();
  const results = useMemo(() => entries.filter((e) => q === "" || e.title.toLowerCase().includes(q)).slice(0, 8), [entries, q]);

  if (!open) return null;

  function handleSelect(entry: Entry) {
    if (entry.kind === "department") onSelectDepartment(entry.id);
    else if (entry.kind === "costType") onSelectCostType(entry.id);
    else onSelectDepartment(entry.departmentId);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-900/50 px-4 pt-20 sm:pt-24" role="presentation" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label="Command palette" onClick={(e) => e.stopPropagation()} className={cx("w-full max-w-xl rounded-2xl border shadow-2xl shadow-zinc-900/20", BORDER, PANEL_BG)}>
        <div className={cx("flex items-center gap-2.5 border-b px-3 py-2", BORDER)}>
          <Search size={16} aria-hidden="true" className={cx("shrink-0", TEXT_AUX)} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            type="text"
            placeholder="Search departments, cost types, budget items…"
            aria-label="Search departments, cost types, budget items"
            className={cx("h-9 min-w-0 flex-1 rounded-md bg-transparent px-1 text-sm font-normal", TEXT_PRIMARY, "placeholder:text-zinc-400", FOCUS)}
          />
          <button type="button" onClick={onClose} className={cx("grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm font-medium", HOVER_BG, TRANSITION, FOCUS)}>
            <X size={15} aria-hidden="true" className={TEXT_AUX} />
            <span className="sr-only">Close command palette</span>
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2 [scrollbar-width:thin]">
          {results.length === 0 ? <p className={cx("px-2.5 py-6 text-center text-sm font-normal", TEXT_AUX)}>Nothing matches that.</p> : null}
          {results.length > 0 ? (
            <div>
              <div className="px-2.5 py-1">
                <Eyebrow>Results</Eyebrow>
              </div>
              {results.map((e) => (
                <button
                  key={`${e.kind}-${e.id}`}
                  type="button"
                  onClick={() => handleSelect(e)}
                  className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium", TEXT_PRIMARY, HOVER_BG, TRANSITION, FOCUS)}
                >
                  <e.Icon size={15} aria-hidden="true" className={cx("shrink-0", TEXT_AUX)} />
                  <span className="min-w-0 flex-1 truncate">
                    <span className="text-[13px]">{e.title}</span>
                    <span className={cx("ml-2 text-[11px] font-normal", TEXT_AUX)}>{e.meta}</span>
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
