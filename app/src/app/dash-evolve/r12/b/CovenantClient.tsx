"use client";

import { useEffect, useState } from "react";
import CommandPalette from "./CommandPalette";
import ContractDetail from "./ContractDetail";
import ContractList from "./ContractList";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { CLIENT_ENTITY, CONTRACTS, DEFAULT_SORT_DIR, STATUS_ORDER, TOTAL_EXPIRING, type ContractStatus, type DetailView, type SortDir, type SortKey } from "./data";
import { CARD, TEXT_CAPTION, TEXT_PRIMARY, cx } from "./tokens";

const DEFAULT_SELECTED_ID = "c-corvid-msa";

export default function CovenantClient() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const [selectedId, setSelectedId] = useState<string>(DEFAULT_SELECTED_ID);
  const [view, setView] = useState<DetailView>("clause");

  const [activeStatuses, setActiveStatuses] = useState<ContractStatus[]>(STATUS_ORDER);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("risk");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

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

  function handleToggleStatus(status: ContractStatus) {
    setActiveStatuses((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]));
  }

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(DEFAULT_SORT_DIR[key]);
    }
  }

  function handleSelectFromPalette(id: string) {
    setSelectedId(id);
    setActiveStatuses(STATUS_ORDER);
    setSearchQuery("");
    setPaletteOpen(false);
  }

  function handleFilterCounterpartyFromPalette(name: string) {
    setSearchQuery(name);
    setActiveStatuses(STATUS_ORDER);
    setPaletteOpen(false);
  }

  const selectedContract = CONTRACTS.find((c) => c.id === selectedId) ?? CONTRACTS[0];

  return (
    <div className={cx("flex h-dvh min-h-dvh overflow-hidden", "bg-white dark:bg-zinc-950", TEXT_PRIMARY)}>
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
          <div className="mx-auto flex max-w-[1800px] flex-col gap-4 p-4 sm:p-6">
            <header>
              <h1 className={cx("text-xl font-semibold tracking-tight sm:text-2xl", TEXT_PRIMARY)}>Contracts</h1>
              <p className={cx("mt-0.5 text-sm", TEXT_CAPTION)}>
                {CLIENT_ENTITY} &middot; {CONTRACTS.length} contracts tracked &middot; {TOTAL_EXPIRING} expiring within 12 months
              </p>
            </header>

            <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
              <div className={cx(CARD, "min-w-0 shrink-0 p-4 sm:p-5 lg:w-[420px] xl:w-[460px]")}>
                <ContractList
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  activeStatuses={activeStatuses}
                  onToggleStatus={handleToggleStatus}
                  searchQuery={searchQuery}
                  onSearchQueryChange={setSearchQuery}
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSort={handleSort}
                />
              </div>

              <div className={cx(CARD, "min-w-0 flex-1 p-4 sm:p-5")}>
                <ContractDetail contract={selectedContract} view={view} onViewChange={setView} />
              </div>
            </div>
          </div>
        </main>
      </div>

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} onSelectContract={handleSelectFromPalette} onFilterCounterparty={handleFilterCounterpartyFromPalette} /> : null}
    </div>
  );
}
