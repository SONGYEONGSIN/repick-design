"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AuditTable from "./AuditTable";
import CommandPalette from "./CommandPalette";
import type { Decision } from "./DetailPanel";
import DetailPanel from "./DetailPanel";
import FeedColumn from "./FeedColumn";
import QueueSummaryRail from "./QueueSummaryRail";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import {
  CATEGORY_META,
  type Category,
  COUNT_FMT,
  DEFAULT_SELECTED_ID,
  type QueueScope,
  REPORTS,
  type Report,
  type SortKey,
  formatRelative,
  formatSla,
  inScope,
  sortReports,
} from "./data";
import { TEXT_AUX, TEXT_PRIMARY, cx, displayMonoStyle } from "./tokens";
import { Eyebrow } from "./ui";

function applyDecision(report: Report, decisions: Record<string, Decision>): Report {
  const d = decisions[report.id];
  return d ? { ...report, status: d.status } : report;
}

function toCsv(rows: Report[]): string {
  const header = ["ID", "Category", "Severity", "Status", "Content type", "Reporter type", "Actor", "Reported", "SLA"];
  const lines = rows.map((r) =>
    [r.id, CATEGORY_META[r.category].label, r.severity, r.status, r.contentType, r.reporterType, r.actorName, formatRelative(r.receivedMinutesAgo), formatSla(r)]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(","),
  );
  return [header.join(","), ...lines].join("\n");
}

export default function SiftlineClient() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileView, setMobileView] = useState<"feed" | "detail">("feed");

  const [queueScope, setQueueScope] = useState<QueueScope>("all");
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("newest");

  // The ONE axis that persists and drives the detail panel. Category filter, scope and search below
  // are a separate, independently-scoped axis that drives only the feed list and its own counters —
  // neither axis ever resets or reads the other (see QueueSummaryRail / FeedColumn / DetailPanel).
  const [selectedId, setSelectedId] = useState(DEFAULT_SELECTED_ID);
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    setMobileView("detail");
  }, []);

  const handleDecide = useCallback(
    (id: string, decision: Decision) => {
      setDecisions((prev) => ({ ...prev, [id]: decision }));
    },
    [],
  );

  const handleUndo = useCallback((id: string) => {
    setDecisions((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const q = query.trim().toLowerCase();
  const scopeFiltered = useMemo(() => REPORTS.filter((r) => inScope(r, queueScope)), [queueScope]);

  const visibleReports = useMemo(() => {
    const filtered = scopeFiltered.filter((r) => {
      if (activeCategory !== "all" && r.category !== activeCategory) return false;
      if (q === "") return true;
      return r.title.toLowerCase().includes(q) || r.actorName.toLowerCase().includes(q);
    });
    return sortReports(filtered, sortKey).map((r) => applyDecision(r, decisions));
  }, [scopeFiltered, activeCategory, q, sortKey, decisions]);

  const selectedReport = useMemo(() => {
    const base = REPORTS.find((r) => r.id === selectedId) ?? REPORTS[0];
    return applyDecision(base, decisions);
  }, [selectedId, decisions]);

  const handleExport = useCallback(() => {
    const csv = toCsv(visibleReports);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `siftline-review-queue-${queueScope}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [visibleReports, queueScope]);

  return (
    <div className="flex min-h-dvh bg-white text-zinc-900">
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} onExport={handleExport} />

        <main id="main-content" className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          <div className="min-w-0">
            <Eyebrow>Trust &amp; Safety · Fieldgood Marketplace</Eyebrow>
            <h1 className={cx("mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]", TEXT_PRIMARY)} style={displayMonoStyle}>
              Review queue
            </h1>
            <p className={cx("mt-1.5 max-w-2xl text-sm font-normal leading-relaxed", TEXT_AUX)}>
              {`Every flagged listing, message, profile, review and comment reported by a buyer, a partner or the automated classifier, with ${COUNT_FMT.format(REPORTS.length)} reports open or resolved in the current window.`}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-12 gap-4">
            <div className={cx(mobileView === "detail" ? "hidden" : "flex", "lg:flex", "col-span-12 min-w-0 flex-col lg:col-span-3 lg:h-[720px]")}>
              <QueueSummaryRail activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
            </div>

            <div className={cx(mobileView === "detail" ? "hidden" : "flex", "lg:flex", "col-span-12 min-w-0 flex-col lg:col-span-6 lg:h-[720px]")}>
              <FeedColumn
                reports={visibleReports}
                totalCount={REPORTS.length}
                selectedId={selectedId}
                onSelect={handleSelect}
                scope={queueScope}
                onScopeChange={setQueueScope}
                sort={sortKey}
                onSortChange={setSortKey}
                query={query}
                onQueryChange={setQuery}
              />
            </div>

            <div className={cx(mobileView === "detail" ? "flex" : "hidden", "lg:flex", "col-span-12 min-w-0 flex-col lg:col-span-3 lg:h-[720px]")}>
              <DetailPanel
                report={selectedReport}
                decision={decisions[selectedReport.id] ?? null}
                onDecide={(d) => handleDecide(selectedReport.id, d)}
                onUndo={() => handleUndo(selectedReport.id)}
                onSelectReport={handleSelect}
                onBack={() => setMobileView("feed")}
              />
            </div>
          </div>

          <div className="mt-4">
            <AuditTable />
          </div>
        </main>
      </div>

      {paletteOpen ? (
        <CommandPalette onClose={() => setPaletteOpen(false)} onSetScope={setQueueScope} onSetCategory={setActiveCategory} onSelectReport={handleSelect} />
      ) : null}
    </div>
  );
}
