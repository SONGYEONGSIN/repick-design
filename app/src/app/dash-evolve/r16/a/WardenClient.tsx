"use client";

import { useEffect, useMemo, useState } from "react";
import { findings as SEED_FINDINGS, SEVERITY_ORDER, STAGE_ORDER, TODAY_ISO, type Finding, type Severity, type Stage } from "./data";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Toolbar } from "./Toolbar";
import { StatStrip } from "./StatStrip";
import { Board } from "./Board";
import { DetailDrawer } from "./DetailDrawer";
import { CommandPalette } from "./CommandPalette";

export function WardenClient() {
  const [findingsState, setFindingsState] = useState<Finding[]>(SEED_FINDINGS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [activeSeverities, setActiveSeverities] = useState<Set<Severity>>(new Set(SEVERITY_ORDER));
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function moveStage(id: string, direction: 1 | -1) {
    setFindingsState((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;
        const idx = STAGE_ORDER.indexOf(f.stage);
        const nextIdx = idx + direction;
        if (nextIdx < 0 || nextIdx >= STAGE_ORDER.length) return f;
        const nextStage = STAGE_ORDER[nextIdx];
        return { ...f, stage: nextStage, resolvedISO: nextStage === "resolved" ? TODAY_ISO : undefined };
      })
    );
  }

  function toggleSeverity(sev: Severity) {
    setActiveSeverities((prev) => {
      const next = new Set(prev);
      if (next.has(sev)) {
        // Never allow an empty filter set — that would silently hide the whole board with no
        // visible cause. Toggling the last active chip resets to "all" instead.
        if (next.size === 1) return new Set(SEVERITY_ORDER);
        next.delete(sev);
      } else {
        next.add(sev);
      }
      return next;
    });
  }

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    return findingsState.filter((f) => {
      if (!activeSeverities.has(f.severity)) return false;
      if (!q) return true;
      return (
        f.id.toLowerCase().includes(q) ||
        f.title.toLowerCase().includes(q) ||
        f.asset.toLowerCase().includes(q) ||
        (f.cve ?? "").toLowerCase().includes(q)
      );
    });
  }, [findingsState, activeSeverities, q]);

  const grouped = useMemo(() => {
    const g = Object.fromEntries(STAGE_ORDER.map((s) => [s, [] as Finding[]])) as Record<Stage, Finding[]>;
    for (const f of filtered) g[f.stage].push(f);
    return g;
  }, [filtered]);

  const selectedFinding = findingsState.find((f) => f.id === selectedId) ?? null;

  return (
    <div className="flex min-h-dvh bg-zinc-50 lg:h-dvh lg:overflow-hidden">
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col lg:overflow-hidden">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileMenu={() => setMobileNavOpen(true)} />

        <main id="main-content" className="flex min-w-0 flex-1 flex-col gap-4 px-4 py-4 sm:px-6 lg:min-h-0 lg:overflow-hidden">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <h1
                className="text-xl font-semibold tracking-tight text-zinc-900"
                style={{ fontFamily: "var(--font-display-mono)" }}
              >
                Remediation Queue
              </h1>
              <p className="mt-0.5 text-sm text-zinc-500">Northwind Security · findings tracked from discovery to resolution</p>
            </div>
          </div>

          <Toolbar
            query={query}
            onQueryChange={setQuery}
            activeSeverities={activeSeverities}
            onToggleSeverity={toggleSeverity}
            onClear={() => {
              setQuery("");
              setActiveSeverities(new Set(SEVERITY_ORDER));
            }}
            resultCount={filtered.length}
            totalCount={findingsState.length}
          />

          <StatStrip findings={findingsState} todayISO={TODAY_ISO} />

          <div className="min-w-0 flex-1 lg:min-h-0">
            <Board
              grouped={grouped}
              selectedId={selectedId}
              onOpen={setSelectedId}
              onAdvance={(id) => moveStage(id, 1)}
              todayISO={TODAY_ISO}
            />
          </div>
        </main>
      </div>

      <DetailDrawer
        finding={selectedFinding}
        onClose={() => setSelectedId(null)}
        onAdvance={(id) => moveStage(id, 1)}
        onRetreat={(id) => moveStage(id, -1)}
        todayISO={TODAY_ISO}
      />

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onSelectFinding={setSelectedId} />
    </div>
  );
}
