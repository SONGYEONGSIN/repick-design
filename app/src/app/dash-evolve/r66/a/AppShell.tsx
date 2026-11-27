"use client";

import { useEffect, useRef, useState } from "react";
import {
  Activity,
  Bell,
  ChevronDown,
  Globe,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  Siren,
  X,
  Zap,
} from "lucide-react";
import { REGIONS } from "./data";
import { FOCUS_RING, FOCUS_RING_INSET } from "./components/focus";

type NavKey = "overview" | "regions" | "forecasts" | "alerts" | "settings";

const NAV_ITEMS: Array<{ key: NavKey; label: string; icon: typeof LayoutDashboard }> = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "regions", label: "Regions", icon: Globe },
  { key: "forecasts", label: "Forecasts", icon: Activity },
  { key: "alerts", label: "Alerts", icon: Siren },
  { key: "settings", label: "Settings", icon: Settings },
];

const WORKSPACES = ["US Interconnect — Primary ISO", "US Interconnect — Staging ISO"];

const NOTIFICATIONS = [
  { id: "n1", text: "Atlantic Seaboard reserve margin fell to 3.1%, below the 5% floor.", time: "4m ago" },
  { id: "n2", text: "Gulf Coast storage state of charge recovered above 40%.", time: "34m ago" },
  { id: "n3", text: "Desert Southwest curtailed 612 MW of solar on a transmission constraint.", time: "26m ago" },
];

export default function AppShell({
  onOpenSearch,
  children,
}: {
  onOpenSearch: () => void;
  children: React.ReactNode;
}) {
  const [activeNav, setActiveNav] = useState<NavKey>("overview");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [workspace, setWorkspace] = useState(WORKSPACES[0]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unread, setUnread] = useState(NOTIFICATIONS.length);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [signedOut, setSignedOut] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(id);
  }, [toast]);

  return (
    <div className="flex h-dvh overflow-hidden bg-zinc-950 text-zinc-100">
      {drawerOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={() => setDrawerOpen(false)}
          className="fixed inset-0 z-30 bg-zinc-950/70 lg:hidden"
        />
      )}

      <aside
        id="mobile-nav"
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-white/10 bg-zinc-950 transition-transform duration-200 motion-reduce:transition-none lg:static lg:z-auto lg:translate-x-0 lg:transition-none ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-4">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-md bg-indigo-400/15 text-indigo-300">
              <Zap aria-hidden="true" className="size-4.5" />
            </span>
            <span style={{ fontFamily: "var(--font-display-wide)" }} className="text-base font-semibold text-zinc-50">
              Gridwell
            </span>
          </div>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setDrawerOpen(false)}
            className={`flex size-9 items-center justify-center rounded-md text-zinc-400 hover:bg-white/10 lg:hidden ${FOCUS_RING}`}
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>

        <div className="relative shrink-0 border-b border-white/10 p-3">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={workspaceMenuOpen}
            onClick={() => setWorkspaceMenuOpen((v) => !v)}
            className={`flex h-11 w-full items-center justify-between gap-2 rounded-md border border-white/10 bg-white/5 px-3 text-left text-sm text-zinc-200 hover:bg-white/10 ${FOCUS_RING}`}
          >
            <span className="truncate">{workspace}</span>
            <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-zinc-400" />
          </button>
          {workspaceMenuOpen && (
            <ul role="listbox" aria-label="Workspaces" className="absolute left-3 right-3 top-full z-10 mt-1 overflow-hidden rounded-md border border-white/10 bg-zinc-900 shadow-xl">
              {WORKSPACES.map((w) => (
                <li key={w}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={w === workspace}
                    onClick={() => {
                      setWorkspace(w);
                      setWorkspaceMenuOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-sm ${FOCUS_RING_INSET} ${
                      w === workspace ? "bg-indigo-400/15 text-indigo-200" : "text-zinc-200 hover:bg-white/10"
                    }`}
                  >
                    {w}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-label="Primary" className="min-h-0 flex-1 overflow-y-auto p-3">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = item.key === activeNav;
              return (
                <li key={item.key}>
                  <button
                    type="button"
                    aria-current={active ? "page" : undefined}
                    onClick={() => {
                      setActiveNav(item.key);
                      setDrawerOpen(false);
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium ${FOCUS_RING} ${
                      active ? "bg-indigo-400/15 text-indigo-200" : "text-zinc-300 hover:bg-white/10 hover:text-zinc-100"
                    }`}
                  >
                    <Icon aria-hidden="true" className="size-4.5 shrink-0" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="relative shrink-0 border-t border-white/10 p-3">
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={avatarMenuOpen}
            onClick={() => setAvatarMenuOpen((v) => !v)}
            className={`flex h-12 w-full items-center gap-2.5 rounded-md px-2 text-left hover:bg-white/5 ${FOCUS_RING}`}
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-400/20 text-xs font-semibold text-indigo-200">
              PN
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-zinc-100">Priya Natarajan</span>
              <span className="block truncate text-xs text-zinc-400">Grid balancing operator</span>
            </span>
            <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-zinc-400" />
          </button>
          {avatarMenuOpen && (
            <div role="menu" aria-label="Account menu" className="absolute inset-x-3 bottom-full z-10 mb-1 overflow-hidden rounded-md border border-white/10 bg-zinc-900 shadow-xl">
              <div className="border-b border-white/10 px-3 py-2.5">
                <p className="truncate text-sm font-medium text-zinc-100">Priya Natarajan</p>
                <p className="truncate text-xs text-zinc-400">priya.natarajan@gridwell.example</p>
              </div>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setAvatarMenuOpen(false);
                  setSignedOut(true);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-zinc-200 hover:bg-white/10 ${FOCUS_RING_INSET}`}
              >
                <LogOut aria-hidden="true" className="size-4 text-zinc-400" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-white/10 bg-zinc-950 px-4">
          <button
            type="button"
            aria-label="Open navigation"
            aria-expanded={drawerOpen}
            aria-controls="mobile-nav"
            onClick={() => setDrawerOpen(true)}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-zinc-300 hover:bg-white/10 lg:hidden ${FOCUS_RING}`}
          >
            <Menu aria-hidden="true" className="size-5" />
          </button>

          <button
            type="button"
            onClick={onOpenSearch}
            className={`flex h-11 min-w-0 flex-1 items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 text-sm text-zinc-400 hover:bg-white/10 sm:max-w-xs ${FOCUS_RING}`}
          >
            <Search aria-hidden="true" className="size-4 shrink-0" />
            <span className="truncate">Search regions</span>
            <kbd className="ml-auto hidden shrink-0 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-zinc-400 sm:inline">
              &#8984;K
            </kbd>
          </button>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setOrderModalOpen(true)}
              className={`flex h-11 items-center gap-1.5 rounded-md bg-indigo-400 px-3.5 text-sm font-medium text-zinc-950 hover:bg-indigo-300 ${FOCUS_RING}`}
            >
              <Plus aria-hidden="true" className="size-4 shrink-0" />
              <span className="sr-only sm:not-sr-only">New balancing order</span>
            </button>

            <div className="relative">
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={notifOpen}
                onClick={() => {
                  setNotifOpen((v) => !v);
                  if (!notifOpen) setUnread(0);
                }}
                className={`relative flex h-11 w-11 items-center justify-center rounded-md text-zinc-300 hover:bg-white/10 ${FOCUS_RING}`}
              >
                <Bell aria-hidden="true" className="size-4.5" />
                {unread > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute right-2 top-2 flex size-4 items-center justify-center rounded-full bg-indigo-400 text-[10px] font-semibold tabular-nums text-zinc-950"
                  >
                    {unread}
                  </span>
                )}
                <span className="sr-only">{unread > 0 ? `${unread} unread notifications` : "Notifications"}</span>
              </button>
              {notifOpen && (
                <div role="menu" aria-label="Notifications" className="absolute right-0 top-full z-20 mt-2 w-80 overflow-hidden rounded-md border border-white/10 bg-zinc-900 shadow-xl">
                  <p className="border-b border-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    Notifications
                  </p>
                  <ul className="max-h-72 overflow-y-auto">
                    {NOTIFICATIONS.map((n) => (
                      <li key={n.id} className="border-b border-white/5 px-3 py-2.5 last:border-b-0">
                        <p className="text-sm text-zinc-200">{n.text}</p>
                        <p className="mt-0.5 text-xs text-zinc-400">{n.time}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto lg:overflow-hidden">
          {activeNav === "overview" ? children : <StubPanel navKey={activeNav} onBack={() => setActiveNav("overview")} />}
        </main>
      </div>

      {orderModalOpen && (
        <NewOrderModal
          onClose={() => setOrderModalOpen(false)}
          onCreate={(name, regionId, priority) => {
            const region = REGIONS.find((r) => r.id === regionId);
            setOrderModalOpen(false);
            setToast(`Balancing order "${name}" (${priority}) created for ${region?.name ?? regionId}.`);
          }}
        />
      )}

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-md border border-indigo-400/30 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 shadow-xl"
        >
          {toast}
        </div>
      )}

      {signedOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 px-4">
          <div className="w-full max-w-sm rounded-xl border border-white/10 bg-zinc-900 p-6 text-center shadow-2xl">
            <p className="text-base font-semibold text-zinc-50">You&apos;ve been signed out</p>
            <p className="mt-1.5 text-sm text-zinc-400">Sign back in to resume monitoring {workspace}.</p>
            <button
              type="button"
              onClick={() => setSignedOut(false)}
              className={`mt-4 h-11 w-full rounded-md bg-indigo-400 text-sm font-medium text-zinc-950 hover:bg-indigo-300 ${FOCUS_RING}`}
            >
              Sign back in
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StubPanel({ navKey, onBack }: { navKey: NavKey; onBack: () => void }) {
  const copy: Record<Exclude<NavKey, "overview">, { title: string; body: string; icon: typeof Globe }> = {
    regions: {
      title: "Regions",
      body: "The full region directory and interconnect topology live here. From Overview, pin a region in the left rail to inspect its snapshot in the right-hand panel.",
      icon: Globe,
    },
    forecasts: {
      title: "Forecasts",
      body: "Day-ahead and intraday load and renewable output forecasts are managed here, feeding the generation-mix chart on Overview.",
      icon: Activity,
    },
    alerts: {
      title: "Alerts",
      body: "Alert rules and routing policies for balancing events are managed here. Recent events also appear in the Overview event feed and the notification bell above.",
      icon: Siren,
    },
    settings: {
      title: "Settings",
      body: "Workspace, interconnect and notification preferences for Gridwell are managed here.",
      icon: Settings,
    },
  };
  const { title, body, icon: Icon } = copy[navKey as Exclude<NavKey, "overview">];

  return (
    <div className="flex h-full items-center justify-center overflow-y-auto p-6">
      <div className="max-w-sm text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-indigo-400/15 text-indigo-300">
          <Icon aria-hidden="true" className="size-6" />
        </span>
        <h1 className="mt-4 text-lg font-semibold text-zinc-50">{title}</h1>
        <p className="mt-2 text-sm text-zinc-400">{body}</p>
        <button
          type="button"
          onClick={onBack}
          className={`mt-5 h-11 rounded-md border border-white/10 px-4 text-sm font-medium text-zinc-200 hover:bg-white/10 ${FOCUS_RING}`}
        >
          Back to Overview
        </button>
      </div>
    </div>
  );
}

function NewOrderModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (name: string, regionId: string, priority: "Standard" | "Expedited") => void;
}) {
  const [name, setName] = useState("");
  const [regionId, setRegionId] = useState(REGIONS[0].id);
  const [priority, setPriority] = useState<"Standard" | "Expedited">("Standard");
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstFieldRef.current?.focus();
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={handleKeyDown}
    >
      <div role="dialog" aria-modal="true" aria-labelledby="order-modal-title" className="w-full max-w-sm rounded-xl border border-white/10 bg-zinc-900 p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 id="order-modal-title" className="text-base font-semibold text-zinc-50">
            New balancing order
          </h2>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className={`flex size-8 items-center justify-center rounded-md text-zinc-400 hover:bg-white/10 ${FOCUS_RING}`}
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>

        <form
          className="mt-4 flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            onCreate(name.trim() || "Untitled order", regionId, priority);
          }}
        >
          <div>
            <label htmlFor="order-name" className="mb-1 block text-xs font-medium text-zinc-400">
              Order name
            </label>
            <input
              ref={firstFieldRef}
              id="order-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Evening ramp support"
              className={`h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm text-zinc-100 placeholder:text-zinc-400 ${FOCUS_RING}`}
            />
          </div>
          <div>
            <label htmlFor="order-region" className="mb-1 block text-xs font-medium text-zinc-400">
              Region
            </label>
            <select
              id="order-region"
              value={regionId}
              onChange={(e) => setRegionId(e.target.value)}
              className={`h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm text-zinc-100 ${FOCUS_RING}`}
            >
              {REGIONS.map((r) => (
                <option key={r.id} value={r.id} className="bg-zinc-900">
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="order-priority" className="mb-1 block text-xs font-medium text-zinc-400">
              Priority
            </label>
            <select
              id="order-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as "Standard" | "Expedited")}
              className={`h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm text-zinc-100 ${FOCUS_RING}`}
            >
              <option className="bg-zinc-900">Standard</option>
              <option className="bg-zinc-900">Expedited</option>
            </select>
          </div>
          <div className="mt-1 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`h-10 rounded-md border border-white/10 px-3.5 text-sm font-medium text-zinc-300 hover:bg-white/10 ${FOCUS_RING}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`h-10 rounded-md bg-indigo-400 px-3.5 text-sm font-medium text-zinc-950 hover:bg-indigo-300 ${FOCUS_RING}`}
            >
              Create order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
