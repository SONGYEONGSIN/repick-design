"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { X } from "lucide-react";
import {
  CATEGORIES,
  DEFAULT_FINDING_ID,
  FINDINGS,
  PERIODS,
  WORKSPACES,
  buildWaffleCells,
  categoryTotals,
  type CategoryId,
} from "./lib/data";
import { Sidebar, SidebarContent, type SectionId } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { WaffleChart } from "./components/WaffleChart";
import { CategoryBreakdown } from "./components/CategoryBreakdown";
import { FindingDetailCard } from "./components/FindingDetailCard";
import { KanbanBoard } from "./components/KanbanBoard";
import { FindingsTable } from "./components/FindingsTable";
import { CommandPalette, type PaletteCommand } from "./components/CommandPalette";
import { NewFindingModal } from "./components/NewFindingModal";
import { SegmentedControl, FOCUS_RING } from "./components/ui";

type PeriodId = (typeof PERIODS)[number]["id"];

function scrollToRef(ref: RefObject<HTMLDivElement | null>) {
  if (!ref.current) return;
  const reduceMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  ref.current.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
}

export default function Page() {
  const [periodId, setPeriodId] = useState<PeriodId>("q3");
  // Two independently-scoped pins: neither resets the other, and each drives exactly one card.
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("ac");
  const [selectedFindingId, setSelectedFindingId] = useState<string>(DEFAULT_FINDING_ID);

  const [activeSection, setActiveSection] = useState<SectionId>("overview");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [newFindingOpen, setNewFindingOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [workspace, setWorkspace] = useState(WORKSPACES[0]);

  const overviewRef = useRef<HTMLDivElement | null>(null);
  const controlsRef = useRef<HTMLDivElement | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);
  const findingsRef = useRef<HTMLDivElement | null>(null);

  const sectionRefs: Partial<Record<SectionId, RefObject<HTMLDivElement | null>>> = {
    overview: overviewRef,
    controls: controlsRef,
    board: boardRef,
    findings: findingsRef,
  };

  function handleNavigate(id: SectionId) {
    setActiveSection(id);
    setDrawerOpen(false);
    const ref = sectionRefs[id];
    if (ref) scrollToRef(ref);
  }

  const period = useMemo(() => PERIODS.find((p) => p.id === periodId)!, [periodId]);
  const cells = useMemo(() => buildWaffleCells(period), [period]);
  const totals = useMemo(() => categoryTotals(period), [period]);
  const applicable = totals.compliant + totals.atRisk + totals.nonCompliant;
  const rate = Math.round((totals.compliant / applicable) * 100);

  const selectedCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory)!;
  const selectedCategoryCounts = period.byCategory[selectedCategory];

  const selectedFinding = FINDINGS.find((f) => f.id === selectedFindingId) ?? FINDINGS[0];
  const selectedFindingCategoryName =
    CATEGORIES.find((c) => c.id === selectedFinding.category)?.name ?? selectedFinding.category;

  // ⌘K / Ctrl+K opens the palette globally; Escape closes whichever overlay is open.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      } else if (e.key === "Escape") {
        if (drawerOpen) setDrawerOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen]);

  const commands: PaletteCommand[] = useMemo(
    () => [
      { id: "nav-overview", label: "Go to Overview", hint: "Section", run: () => handleNavigate("overview") },
      { id: "nav-board", label: "Go to Audit Board", hint: "Section", run: () => handleNavigate("board") },
      { id: "nav-controls", label: "Go to Controls", hint: "Section", run: () => handleNavigate("controls") },
      { id: "nav-findings", label: "Go to Findings Register", hint: "Section", run: () => handleNavigate("findings") },
      {
        id: "period-q3",
        label: "Set period: This Quarter",
        hint: "Q3 FY26",
        run: () => setPeriodId("q3"),
      },
      {
        id: "period-q2",
        label: "Set period: Last Quarter",
        hint: "Q2 FY26",
        run: () => setPeriodId("q2"),
      },
      { id: "period-fy", label: "Set period: Full Year", hint: "FY26 YTD", run: () => setPeriodId("fy") },
      { id: "new-finding", label: "Log a new finding", hint: "Action", run: () => setNewFindingOpen(true) },
      {
        id: "switch-workspace",
        label: `Switch workspace to ${WORKSPACES.find((w) => w !== workspace) ?? workspace}`,
        hint: "Workspace",
        run: () => setWorkspace((w) => WORKSPACES.find((x) => x !== w) ?? w),
      },
    ],
    // handleNavigate closes over state set above; re-created each render is fine for a palette list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [workspace],
  );

  return (
    <div className="flex min-h-dvh min-w-0 bg-zinc-950 text-zinc-50">
      <Sidebar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        workspace={workspace}
        workspaceOpen={workspaceOpen}
        onToggleWorkspace={() => setWorkspaceOpen((v) => !v)}
        onSelectWorkspace={(w) => {
          setWorkspace(w);
          setWorkspaceOpen(false);
        }}
      />

      {drawerOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button type="button" tabIndex={-1} aria-label="Close navigation menu" onClick={() => setDrawerOpen(false)} className="fixed inset-0 bg-black/60" />
          <div className="relative z-10 flex h-full w-72 max-w-[85vw] border-r border-white/10 bg-zinc-950">
            <SidebarContent
              activeSection={activeSection}
              onNavigate={handleNavigate}
              workspace={workspace}
              workspaceOpen={workspaceOpen}
              onToggleWorkspace={() => setWorkspaceOpen((v) => !v)}
              onSelectWorkspace={(w) => {
                setWorkspace(w);
                setWorkspaceOpen(false);
              }}
            />
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close navigation menu"
              className={`absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-50 ${FOCUS_RING}`}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onOpenDrawer={() => setDrawerOpen(true)}
          onOpenPalette={() => setPaletteOpen(true)}
          onOpenNewFinding={() => setNewFindingOpen(true)}
        />

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto flex max-w-[2000px] min-w-0 flex-col gap-6">
            <div ref={overviewRef} className="flex min-w-0 scroll-mt-20 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <h1 className="text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">
                  Audit Command Center
                </h1>
                <p className="mt-1 text-sm text-zinc-400">{workspace} · SOC 2 Type II program</p>
              </div>
              <SegmentedControl
                ariaLabel="Reporting period"
                value={periodId}
                onChange={setPeriodId}
                options={[
                  { value: "q3", label: "This Quarter" },
                  { value: "q2", label: "Last Quarter" },
                  { value: "fy", label: "Full Year" },
                ]}
              />
            </div>

            <div ref={controlsRef} className="grid min-w-0 scroll-mt-20 grid-cols-12 gap-6">
              <div className="col-span-12 min-w-0 lg:col-span-5">
                <WaffleChart
                  period={period}
                  cells={cells}
                  totals={totals}
                  rate={rate}
                  categories={CATEGORIES}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              </div>
              <div className="col-span-12 min-w-0 sm:col-span-6 lg:col-span-3">
                <CategoryBreakdown
                  category={selectedCategoryObj}
                  counts={selectedCategoryCounts}
                  periodShortLabel={period.shortLabel}
                />
              </div>
              <div className="col-span-12 min-w-0 sm:col-span-6 lg:col-span-4">
                <FindingDetailCard finding={selectedFinding} categoryName={selectedFindingCategoryName} />
              </div>
            </div>

            <div ref={boardRef} className="min-w-0 scroll-mt-20">
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <h2 className="text-sm font-semibold text-zinc-50">Audit Board</h2>
                <p className="text-xs text-zinc-400">{FINDINGS.length} open and closed findings · click a card to pin it above</p>
              </div>
              <KanbanBoard selectedFindingId={selectedFindingId} onSelectFinding={setSelectedFindingId} />
            </div>

            <div ref={findingsRef} className="min-w-0 scroll-mt-20">
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <h2 className="text-sm font-semibold text-zinc-50">Findings Register</h2>
                <p className="text-xs text-zinc-400">Sortable · click any column header</p>
              </div>
              <FindingsTable />
            </div>
          </div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} commands={commands} />
      <NewFindingModal open={newFindingOpen} onClose={() => setNewFindingOpen(false)} />
    </div>
  );
}
