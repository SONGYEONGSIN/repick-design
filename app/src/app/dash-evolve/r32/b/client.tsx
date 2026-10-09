"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import {
  Bell,
  Building2,
  ChevronDown,
  Download,
  Grid3x3,
  LayoutGrid,
  LogOut,
  Menu,
  Search,
  Settings,
  Ticket as TicketIcon,
  User,
  Users,
  X,
} from "lucide-react";
import {
  CATEGORIES,
  CATEGORY_BY_ID,
  compositionFor,
  formatAvgAge,
  ticketsForCategory,
  waffleSequence,
  type Category,
  type CategoryId,
  type CompositionSlice,
  type Ticket,
  type WindowDays,
} from "./data";
import WaffleGrid from "./waffle-grid";
import Legend from "./legend";
import SlideOver from "./slide-over";
import CommandPalette from "./command-palette";
import { cx, useDismissable, SegmentedControl } from "./ui";

const NAV = [
  { label: "Overview", icon: LayoutGrid, active: false },
  { label: "Triage", icon: Grid3x3, active: true },
  { label: "Tickets", icon: TicketIcon, active: false },
  { label: "Team", icon: Users, active: false },
  { label: "Settings", icon: Settings, active: false },
];

const WORKSPACES = ["repick Support", "repick Trust & Safety"];

// Default pin: whichever category holds the largest share of the default (30-day) window,
// computed once at module scope from the same deterministic data every render reads.
const DEFAULT_PINNED: CategoryId = compositionFor(30).reduce((best, s) => (s.pct > best.pct ? s : best)).categoryId;

export default function Census() {
  const [windowDays, setWindowDays] = useState<WindowDays>(30);
  const [pinnedId, setPinnedId] = useState<CategoryId | null>(DEFAULT_PINNED);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [workspace, setWorkspace] = useState(WORKSPACES[0]);

  const searchBtnRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);

  const slices = useMemo(() => compositionFor(windowDays), [windowDays]);
  const sequence = useMemo(() => waffleSequence(windowDays), [windowDays]);
  const totalTickets = useMemo(() => slices.reduce((sum, s) => sum + s.count, 0), [slices]);
  const windowLabel = windowDays === 7 ? "last 7 days" : "last 30 days";

  const pinnedCategory = pinnedId ? CATEGORY_BY_ID[pinnedId] : null;
  const pinnedSlice = pinnedId ? slices.find((s) => s.categoryId === pinnedId) ?? null : null;
  const pinnedTickets = useMemo(
    () => (pinnedId ? ticketsForCategory(pinnedId, windowDays) : []),
    [pinnedId, windowDays]
  );

  const pin = useCallback((id: CategoryId) => {
    lastTriggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setPinnedId(id);
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const clearSelection = useCallback(() => {
    setPinnedId(null);
    setDrawerOpen(false);
  }, []);

  // Return focus to whatever opened the drawer once it closes, instead of stranding
  // keyboard users behind the overlay that just disappeared.
  useEffect(() => {
    if (!drawerOpen && lastTriggerRef.current && document.contains(lastTriggerRef.current)) {
      lastTriggerRef.current.focus();
    }
  }, [drawerOpen]);

  // Global ⌘K / Ctrl+K to open the command palette from anywhere on the page.
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

  return (
    <div className="flex min-h-dvh w-full bg-zinc-50 font-sans text-zinc-900">
      <Sidebar workspace={workspace} setWorkspace={setWorkspace} mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          searchBtnRef={searchBtnRef}
          onOpenPalette={() => setPaletteOpen(true)}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />

        <main className="mx-auto flex w-full max-w-[1760px] flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1
                className="text-[26px] font-semibold leading-tight tracking-tight text-zinc-900 sm:text-[30px]"
                style={{ fontFamily: "var(--font-display-wide)" }}
              >
                Support ticket triage
              </h1>
              <p className="mt-1 text-[13px] text-zinc-600">
                <span className="font-semibold tabular-nums text-zinc-900">{totalTickets}</span> open tickets across{" "}
                {CATEGORIES.length} categories, {windowLabel}.
              </p>
            </div>
            <SegmentedControl
              label="Ticket window"
              value={String(windowDays) as "7" | "30"}
              onChange={(v) => setWindowDays(Number(v) as WindowDays)}
              options={[
                { value: "7", label: "Last 7d" },
                { value: "30", label: "Last 30d" },
              ]}
            />
          </div>

          <SelectionSummary
            category={pinnedCategory}
            slice={pinnedSlice}
            tickets={pinnedTickets}
            windowLabel={windowLabel}
            onReopen={() => pinnedId && setDrawerOpen(true)}
            onClear={clearSelection}
          />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
            <section aria-labelledby="composition-heading" className="min-w-0 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6 lg:col-span-8">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 id="composition-heading" className="text-[15px] font-semibold text-zinc-900">
                  Backlog composition
                </h2>
                <p className="text-[12px] text-zinc-500">Each cell = 1% of the open backlog. Hover or Tab a cell for its exact share.</p>
              </div>
              <div className="mx-auto mt-4 w-full max-w-[560px]">
                <WaffleGrid sequence={sequence} slices={slices} windowDays={windowDays} pinnedId={pinnedId} onPin={pin} />
              </div>
            </section>

            <section aria-labelledby="categories-heading" className="min-w-0 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5 lg:col-span-4">
              <h2 id="categories-heading" className="text-[15px] font-semibold text-zinc-900">
                Categories
              </h2>
              <p className="mt-0.5 text-[12px] text-zinc-500">Select a category to pin it and open its tickets.</p>
              <div className="mt-3">
                <Legend slices={slices} pinnedId={pinnedId} onPin={pin} />
              </div>
            </section>
          </div>
        </main>
      </div>

      <SlideOver
        open={drawerOpen}
        onClose={closeDrawer}
        category={pinnedCategory}
        slice={pinnedSlice}
        tickets={pinnedTickets}
        windowLabel={windowLabel}
      />
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        slices={slices}
        onSelectCategory={pin}
        triggerRef={searchBtnRef}
      />
    </div>
  );
}

function SelectionSummary({
  category,
  slice,
  tickets,
  windowLabel,
  onReopen,
  onClear,
}: {
  category: Category | null;
  slice: CompositionSlice | null;
  tickets: Ticket[];
  windowLabel: string;
  onReopen: () => void;
  onClear: () => void;
}) {
  if (!category || !slice) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-dashed border-zinc-300 bg-white px-4 py-3 text-[13px] text-zinc-500">
        No category selected — click a cell in the grid, a category below, or press{" "}
        <kbd className="rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[11px] font-medium text-zinc-600">{"⌘"}K</kbd>.
      </div>
    );
  }
  const Icon = category.icon;
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
      <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: category.color }}>
        <Icon className={cx("h-4 w-4", category.iconInk === "dark" ? "text-zinc-900/80" : "text-white/95")} />
      </span>
      <p className="min-w-0 flex-1 text-[13px] text-zinc-700">
        <span className="text-zinc-500">Showing:</span> <span className="font-semibold text-zinc-900">{category.name}</span>{" "}
        <span className="text-zinc-500">{"·"}</span> <span className="tabular-nums font-medium text-zinc-900">{slice.count} tickets</span>{" "}
        <span className="text-zinc-500">{"·"}</span> <span className="tabular-nums">avg age {formatAvgAge(tickets)}</span>{" "}
        <span className="text-zinc-500">{"·"}</span> <span className="tabular-nums">{slice.pct}% of {windowLabel} backlog</span>
      </p>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onReopen}
          className="rounded-md border border-zinc-200 px-2.5 py-1.5 text-[12px] font-medium text-zinc-700 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1450b0]"
        >
          Open tickets
        </button>
        <button
          type="button"
          onClick={onClear}
          className="rounded-md px-2.5 py-1.5 text-[12px] font-medium text-zinc-500 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1450b0]"
        >
          Clear
        </button>
      </div>
    </div>
  );
}


function Sidebar({
  workspace,
  setWorkspace,
  mobileOpen,
  onCloseMobile,
}: {
  workspace: string;
  setWorkspace: (w: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  return (
    <>
      <aside className="hidden w-64 shrink-0 flex-col border-r border-zinc-200 bg-white p-4 lg:flex">
        <SidebarContent workspace={workspace} setWorkspace={setWorkspace} />
      </aside>

      <div className={cx("fixed inset-0 z-40 lg:hidden", mobileOpen ? "pointer-events-auto" : "pointer-events-none")} aria-hidden={!mobileOpen} inert={!mobileOpen}>
        <div onClick={onCloseMobile} className={cx("absolute inset-0 bg-zinc-900/30 transition-opacity duration-200 motion-reduce:transition-none", mobileOpen ? "opacity-100" : "opacity-0")} />
        <div
          className={cx(
            "absolute inset-y-0 left-0 flex h-full w-72 max-w-[85vw] flex-col border-r border-zinc-200 bg-white p-4 shadow-2xl transition-transform duration-200 motion-reduce:transition-none",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="mb-2 flex justify-end">
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Close navigation"
              className="flex h-9 w-9 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1450b0]"
            >
              <X aria-hidden className="h-4 w-4" />
            </button>
          </div>
          <SidebarContent workspace={workspace} setWorkspace={setWorkspace} />
        </div>
      </div>
    </>
  );
}

function SidebarContent({ workspace, setWorkspace }: { workspace: string; setWorkspace: (w: string) => void }) {
  const [wsOpen, setWsOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const wsRef = useDismissable<HTMLDivElement>(wsOpen, () => setWsOpen(false));
  const userRef = useDismissable<HTMLDivElement>(userOpen, () => setUserOpen(false));

  return (
    <>
      <div className="flex items-center gap-2 px-1">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-md bg-[#1450b0] text-[13px] font-semibold text-white"
          style={{ fontFamily: "var(--font-display-wide)" }}
        >
          r
        </span>
        <span className="text-[15px] font-semibold text-zinc-900" style={{ fontFamily: "var(--font-display-wide)" }}>
          repick
        </span>
      </div>

      <div ref={wsRef} className="relative mt-4">
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={wsOpen}
          onClick={() => setWsOpen((o) => !o)}
          className="flex w-full items-center gap-2 rounded-lg border border-zinc-200 px-2.5 py-2 text-left hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1450b0]"
        >
          <Building2 aria-hidden className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
          <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-zinc-800">{workspace}</span>
          <ChevronDown aria-hidden className={cx("h-3.5 w-3.5 shrink-0 text-zinc-500 transition-transform", wsOpen && "rotate-180")} />
        </button>
        {wsOpen && (
          <div role="menu" className="absolute left-0 right-0 z-30 mt-1 rounded-lg border border-zinc-200 bg-white p-1 shadow-lg">
            {WORKSPACES.map((w) => (
              <button
                key={w}
                type="button"
                role="menuitemradio"
                aria-checked={w === workspace}
                onClick={() => {
                  setWorkspace(w);
                  setWsOpen(false);
                }}
                className={cx(
                  "flex w-full items-center rounded-md px-2.5 py-1.5 text-left text-[12.5px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1450b0]",
                  w === workspace ? "bg-[#1450b0]/5 font-medium text-[#1450b0]" : "text-zinc-700 hover:bg-zinc-50"
                )}
              >
                {w}
              </button>
            ))}
          </div>
        )}
      </div>

      <nav aria-label="Primary" className="mt-6 flex flex-col gap-0.5">
        {NAV.map((item) => (
          <div
            key={item.label}
            aria-current={item.active ? "page" : undefined}
            className={cx(
              "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium",
              item.active ? "bg-[#1450b0]/8 text-[#1450b0]" : "text-zinc-600"
            )}
          >
            <item.icon aria-hidden className="h-4 w-4" />
            {item.label}
          </div>
        ))}
      </nav>

      <div ref={userRef} className="relative mt-auto">
        {userOpen && (
          <div role="menu" className="absolute bottom-full left-0 right-0 z-30 mb-1 rounded-lg border border-zinc-200 bg-white p-1 shadow-lg">
            {[
              { label: "Profile", icon: User },
              { label: "Preferences", icon: Settings },
              { label: "Sign out", icon: LogOut },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                onClick={() => setUserOpen(false)}
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[12.5px] text-zinc-700 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1450b0]"
              >
                <item.icon aria-hidden className="h-3.5 w-3.5 text-zinc-500" />
                {item.label}
              </button>
            ))}
          </div>
        )}
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={userOpen}
          onClick={() => setUserOpen((o) => !o)}
          className="flex w-full items-center gap-2 rounded-lg border border-zinc-200 px-2.5 py-2 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1450b0]"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[11px] font-semibold text-zinc-700">JK</span>
          <span className="min-w-0 flex-1 text-left">
            <span className="block truncate text-[12px] font-medium text-zinc-900">Jae Kim</span>
            <span className="block truncate text-[11px] text-zinc-500">Support ops lead</span>
          </span>
          <ChevronDown aria-hidden className={cx("h-3.5 w-3.5 shrink-0 text-zinc-500 transition-transform", userOpen && "rotate-180")} />
        </button>
      </div>
    </>
  );
}

function Topbar({
  searchBtnRef,
  onOpenPalette,
  onOpenMobileNav,
}: {
  searchBtnRef: RefObject<HTMLButtonElement | null>;
  onOpenPalette: () => void;
  onOpenMobileNav: () => void;
}) {
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useDismissable<HTMLDivElement>(avatarOpen, () => setAvatarOpen(false));

  return (
    <header className="flex items-center gap-3 border-b border-zinc-200 bg-white px-4 py-2.5 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1450b0] lg:hidden"
      >
        <Menu aria-hidden className="h-4 w-4" />
      </button>

      <button
        ref={searchBtnRef}
        type="button"
        onClick={onOpenPalette}
        className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-[13px] text-zinc-500 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1450b0] sm:max-w-xs"
      >
        <Search aria-hidden className="h-4 w-4 shrink-0" />
        <span className="flex-1 truncate text-left">Search categories, tickets…</span>
        <kbd className="hidden shrink-0 rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 sm:inline">
          {"⌘"}K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          className="hidden h-11 items-center gap-1.5 rounded-lg bg-[#1450b0] px-3.5 text-[13px] font-medium text-white hover:bg-[#123f91] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1450b0] sm:flex"
        >
          <Download aria-hidden className="h-3.5 w-3.5" />
          Export snapshot
        </button>
        <button
          type="button"
          aria-label="Notifications, 3 unread"
          className="relative flex h-11 w-11 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1450b0]"
        >
          <Bell aria-hidden className="h-4 w-4" />
          <span aria-hidden className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
        </button>

        <div ref={avatarRef} className="relative">
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={avatarOpen}
            aria-label="Account menu"
            onClick={() => setAvatarOpen((o) => !o)}
            className="flex h-11 items-center gap-1.5 rounded-lg px-1.5 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1450b0]"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-200 text-[11px] font-semibold text-zinc-700">JK</span>
            <ChevronDown aria-hidden className={cx("h-3.5 w-3.5 text-zinc-500 transition-transform", avatarOpen && "rotate-180")} />
          </button>
          {avatarOpen && (
            <div role="menu" className="absolute right-0 z-30 mt-1 w-44 rounded-lg border border-zinc-200 bg-white p-1 shadow-lg">
              {[
                { label: "Profile", icon: User },
                { label: "Preferences", icon: Settings },
                { label: "Sign out", icon: LogOut },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  role="menuitem"
                  onClick={() => setAvatarOpen(false)}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[12.5px] text-zinc-700 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1450b0]"
                >
                  <item.icon aria-hidden className="h-3.5 w-3.5 text-zinc-500" />
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
