"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, CirclePlus, Grid3x3, KeyRound, RotateCcw, Table2 } from "lucide-react";
import { Sidebar, MobileSidebarDrawer } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandPalette, type PaletteCommand } from "./CommandPalette";
import { KeyRail, type SortMode, type StatusFilter } from "./KeyRail";
import { KeyOverview } from "./KeyOverview";
import { Heatmap } from "./Heatmap";
import { UsageTable } from "./UsageTable";
import { Card, SegmentedControl } from "./ui";
import { KEYS, keyById, type ApiKey } from "./data";

type View = "heatmap" | "table";

const VIEW_OPTIONS: { value: View; label: string }[] = [
  { value: "heatmap", label: "Heatmap" },
  { value: "table", label: "Table" },
];

/**
 * Macro layout is a two-region master-detail: a fixed-width key rail (`lg:w-80 lg:shrink-0`) and a
 * `flex-1 min-w-0` detail pane dominated by the heatmap — never a third region. The detail pane has
 * no separate `max-w` cap: it is a plain flex-1 fill, so at 1920px its right edge already lands
 * inside the `lg:px-8` (32px) page padding without guessing a max-width number.
 *
 * The selection fan-out uses two independently-scoped axes, on two different widget clusters, that
 * never touch each other:
 *
 * 1. `pinnedKeyId` — set only by clicking/activating a row in the key rail (or a palette command).
 *    It drives which key's data the Key overview card AND the heatmap/table below render — both
 *    read the one key object this picks, nothing more.
 * 2. The heatmap's own hovered-cell state (declared inside `<Heatmap>`, see its file) — set only by
 *    hovering or keyboard-focusing a grid cell. It feeds nothing but that component's own crosshair
 *    dimming and its shared `aria-live` readout. It never reaches `pinnedKeyId`, the rail, or the Key
 *    overview card, and `pinnedKeyId` never reaches it either.
 *
 * `view` (heatmap vs. table) is a third, independent toggle — it swaps which component renders the
 * same pinned key's data, untouched by either selection above.
 */
export function WeirClient() {
  const [extraKeys, setExtraKeys] = useState<ApiKey[]>([]);
  const keys = useMemo(() => [...KEYS, ...extraKeys], [extraKeys]);

  const [pinnedKeyId, setPinnedKeyId] = useState<string>("checkout");
  const [view, setView] = useState<View>("heatmap");

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("usage");

  // Mobile-only pushed navigation: the rail and detail pane are two full-width screens below `lg`,
  // never squashed side by side. Selecting a key pushes into "detail"; the back button returns to
  // "list". At `lg` and up this state is inert — both panes are always shown via `lg:block`.
  const [mobileScreen, setMobileScreen] = useState<"list" | "detail">("list");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function selectKey(key: ApiKey) {
    setPinnedKeyId(key.id);
    setMobileScreen("detail");
  }

  function createKey() {
    const n = extraKeys.length + 1;
    const newKey: ApiKey = {
      id: `new-key-${n}`,
      name: `New API key ${n}`,
      environment: "staging",
      owner: "Unassigned",
      secretPreview: "sk_test_•••• 0000",
      quotaCeiling: 10_000,
      scope: ["customers-list", "accounts-list", "balance-get"],
      matrix: [new Array(24).fill(0), new Array(24).fill(0), new Array(24).fill(0)],
    };
    setExtraKeys((prev) => [...prev, newKey]);
    setPinnedKeyId(newKey.id);
    setMobileScreen("detail");
  }

  const pinnedKey = keyById(pinnedKeyId, keys) ?? keys[0];

  const commands: PaletteCommand[] = [
    ...keys.map((key) => ({
      id: `key-${key.id}`,
      group: "Open key",
      label: key.name,
      hint: `${key.owner} team`,
      icon: KeyRound,
      run: () => selectKey(key),
    })),
    {
      id: "view-heatmap",
      group: "Usage view",
      label: "Show hourly heatmap",
      hint: "View",
      icon: Grid3x3,
      run: () => setView("heatmap"),
    },
    {
      id: "view-table",
      group: "Usage view",
      label: "Show usage table",
      hint: "View",
      icon: Table2,
      run: () => setView("table"),
    },
    {
      id: "create-key",
      group: "API keys",
      label: "Create a new API key",
      hint: "Staging, zero usage",
      icon: CirclePlus,
      run: createKey,
    },
    {
      id: "clear-filters",
      group: "API keys",
      label: "Clear search & filters",
      hint: "Reset rail",
      icon: RotateCcw,
      run: () => {
        setQuery("");
        setStatusFilter("all");
        setSortMode("usage");
      },
    },
  ];

  return (
    <div className="flex min-h-screen w-full min-w-0 bg-white text-zinc-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-xl focus:bg-emerald-700 focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-emerald-900"
      >
        Skip to main content
      </a>

      <Sidebar />
      <MobileSidebarDrawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Topbar
          onOpenPalette={() => setPaletteOpen(true)}
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onCreateKey={createKey}
        />

        <main id="main-content" className="flex min-w-0 flex-1 flex-col lg:flex-row">
          <div
            className={`min-w-0 border-zinc-200 lg:w-80 lg:shrink-0 lg:border-r ${
              mobileScreen === "detail" ? "hidden lg:block" : "block"
            }`}
          >
            <KeyRail
              keys={keys}
              query={query}
              onQueryChange={setQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              sortMode={sortMode}
              onSortModeChange={setSortMode}
              pinnedId={pinnedKey.id}
              onSelect={selectKey}
            />
          </div>

          <div className={`min-w-0 flex-1 bg-zinc-50/50 ${mobileScreen === "list" ? "hidden lg:block" : "block"}`}>
            <div className="flex min-w-0 flex-col gap-4 p-4 sm:p-6 lg:p-8">
              <button
                type="button"
                onClick={() => setMobileScreen("list")}
                className={`flex h-9 w-fit items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 lg:hidden`}
              >
                <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
                Back to keys
              </button>

              <KeyOverview apiKey={pinnedKey} />

              <Card>
                <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900">Hourly request volume</h3>
                    <p className="text-xs font-normal text-zinc-600">
                      Today, by endpoint — {pinnedKey.scope.length} endpoint{pinnedKey.scope.length === 1 ? "" : "s"} in scope
                    </p>
                  </div>
                  <SegmentedControl label="Usage view" options={VIEW_OPTIONS} value={view} onChange={setView} />
                </div>

                <div className="mt-4">
                  {view === "heatmap" ? <Heatmap key={pinnedKey.id} apiKey={pinnedKey} /> : <UsageTable apiKey={pinnedKey} />}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} commands={commands} />
    </div>
  );
}
