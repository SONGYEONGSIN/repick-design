"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Network,
  PlayCircle,
  Settings,
  ShieldAlert,
  Truck,
  Wallet,
  X,
} from "lucide-react";
import { ALL_NODES } from "./data";
import { FOCUS_RING, FOCUS_RING_INSET } from "./focus";
import { ACCENT_SOLID } from "./ui";

type NavKey = "overview" | "suppliers" | "alerts" | "spend" | "settings";

const NAV_ITEMS: Array<{ key: NavKey; label: string; icon: typeof LayoutDashboard }> = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "suppliers", label: "Suppliers", icon: Truck },
  { key: "alerts", label: "Risk alerts", icon: ShieldAlert },
  { key: "spend", label: "Spend", icon: Wallet },
  { key: "settings", label: "Settings", icon: Settings },
];

const WORKSPACES = ["Aurora Electronics — Production", "Aurora Electronics — Sandbox"];

const NOTIFICATIONS = [
  { id: "n1", text: "Greywick Mining Co. (T2-20) risk score rose to 85 — now Critical band.", time: "4m ago" },
  { id: "n2", text: "Sumitera Rare Earths (T2-03) flagged as a concentration risk for 2 tier-1 vendors.", time: "34m ago" },
  { id: "n3", text: "Kestrel Battery Labs (T1-12) annual spend crossed $3.4M.", time: "1h ago" },
];

const SCAN_SCOPES = ["Full network", "Tier-1 vendors only", "Tier-2 sub-suppliers only"] as const;

export default function AppShell({
  activeNav,
  onNavChange,
  onOpenSearch,
  children,
}: {
  activeNav: NavKey;
  onNavChange: (key: NavKey) => void;
  onOpenSearch: () => void;
  children: React.ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [workspace, setWorkspace] = useState(WORKSPACES[0]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unread, setUnread] = useState(NOTIFICATIONS.length);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [signedOut, setSignedOut] = useState(false);
  const [scanModalOpen, setScanModalOpen] = useState(false);
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
            <span className="flex size-8 items-center justify-center rounded-md bg-violet-400/15 text-violet-300">
              <Network aria-hidden="true" className="size-4.5" />
            </span>
            <span style={{ fontFamily: "var(--font-display-mono)" }} className="text-base font-semibold text-zinc-50">
              Tendril
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
                      w === workspace ? "bg-violet-400/15 text-violet-200" : "text-zinc-200 hover:bg-white/10"
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
                      onNavChange(item.key);
                      setDrawerOpen(false);
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium ${FOCUS_RING} ${
                      active ? "bg-violet-400/15 text-violet-200" : "text-zinc-300 hover:bg-white/10 hover:text-zinc-100"
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
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-violet-400/20 text-xs font-semibold text-violet-200">
              PN
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-zinc-100">Priya Nair</span>
              <span className="block truncate text-xs font-normal text-zinc-400">Head of procurement</span>
            </span>
            <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-zinc-400" />
          </button>
          {avatarMenuOpen && (
            <div role="menu" aria-label="Account menu" className="absolute inset-x-3 bottom-full z-10 mb-1 overflow-hidden rounded-md border border-white/10 bg-zinc-900 shadow-xl">
              <div className="border-b border-white/10 px-3 py-2.5">
                <p className="truncate text-sm font-medium text-zinc-100">Priya Nair</p>
                <p className="truncate text-xs font-normal text-zinc-400">priya.nair@aurora-electronics.example</p>
              </div>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setAvatarMenuOpen(false);
                  setSignedOut(true);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-normal text-zinc-200 hover:bg-white/10 ${FOCUS_RING_INSET}`}
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
            <Network aria-hidden="true" className="size-4 shrink-0" />
            <span className="truncate">Jump to a node…</span>
            <kbd className="ml-auto hidden shrink-0 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-normal text-zinc-400 sm:inline">
              &#8984;K
            </kbd>
          </button>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setScanModalOpen(true)}
              className={`${ACCENT_SOLID} flex h-11 items-center gap-1.5 rounded-md px-3.5 text-sm font-medium ${FOCUS_RING}`}
            >
              <PlayCircle aria-hidden="true" className="size-4 shrink-0" />
              <span className="sr-only sm:not-sr-only">Run risk scan</span>
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
                  <span aria-hidden="true" className="absolute right-2 top-2 flex size-4 items-center justify-center rounded-full bg-violet-500 text-[10px] font-semibold tabular-nums text-white">
                    {unread}
                  </span>
                )}
                <span className="sr-only">{unread > 0 ? `${unread} unread notifications` : "Notifications"}</span>
              </button>
              {notifOpen && (
                <div role="menu" aria-label="Notifications" className="absolute right-0 top-full z-20 mt-2 w-80 overflow-hidden rounded-md border border-white/10 bg-zinc-900 shadow-xl">
                  <p className="border-b border-white/10 px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-zinc-400">
                    Notifications
                  </p>
                  <ul className="max-h-72 overflow-y-auto">
                    {NOTIFICATIONS.map((n) => (
                      <li key={n.id} className="border-b border-white/5 px-3 py-2.5 last:border-b-0">
                        <p className="text-sm font-normal text-zinc-200">{n.text}</p>
                        <p className="mt-0.5 text-xs font-normal text-zinc-400">{n.time}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto">
          {activeNav === "overview" ? children : <StubPanel navKey={activeNav} onBack={() => onNavChange("overview")} />}
        </main>
      </div>

      {scanModalOpen && (
        <RunScanModal
          onClose={() => setScanModalOpen(false)}
          onRun={(vendorName, scope) => {
            setScanModalOpen(false);
            setToast(`Risk scan queued for ${vendorName} — scope: ${scope}.`);
          }}
        />
      )}

      {toast && (
        <div role="status" aria-live="polite" className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-md border border-violet-400/30 bg-zinc-900 px-4 py-2.5 text-sm font-normal text-zinc-100 shadow-xl">
          {toast}
        </div>
      )}

      {signedOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 px-4">
          <div className="w-full max-w-sm rounded-xl border border-white/10 bg-zinc-900 p-6 text-center shadow-2xl">
            <p className="text-base font-semibold text-zinc-50">You&apos;ve been signed out</p>
            <p className="mt-1.5 text-sm font-normal text-zinc-400">Sign back in to resume monitoring {workspace}.</p>
            <button
              type="button"
              onClick={() => setSignedOut(false)}
              className={`${ACCENT_SOLID} mt-4 h-11 w-full rounded-md text-sm font-medium ${FOCUS_RING}`}
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
  const copy: Record<Exclude<NavKey, "overview">, { title: string; body: string; icon: typeof Truck }> = {
    suppliers: {
      title: "Suppliers",
      body: "The full vendor directory and onboarding workflow live here. From Overview, pin any node in the network graph to inspect its profile in the node inspector.",
      icon: Truck,
    },
    alerts: {
      title: "Risk alerts",
      body: "Alert rules for risk-score and concentration-risk changes are managed here. Recent events also surface in the Overview notification bell above.",
      icon: ShieldAlert,
    },
    spend: {
      title: "Spend",
      body: "Full spend analytics across every category and site live here, built on the same figures as the Overview category strip.",
      icon: Wallet,
    },
    settings: {
      title: "Settings",
      body: "Workspace, risk-threshold and notification preferences for Tendril are managed here.",
      icon: Settings,
    },
  };
  const { title, body, icon: Icon } = copy[navKey as Exclude<NavKey, "overview">];

  return (
    <div className="flex h-full items-center justify-center overflow-y-auto p-6">
      <div className="max-w-sm text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-violet-400/15 text-violet-300">
          <Icon aria-hidden="true" className="size-6" />
        </span>
        <h1 className="mt-4 text-lg font-semibold text-zinc-50">{title}</h1>
        <p className="mt-2 text-sm font-normal text-zinc-400">{body}</p>
        <button type="button" onClick={onBack} className={`mt-5 h-11 rounded-md border border-white/10 px-4 text-sm font-medium text-zinc-200 hover:bg-white/10 ${FOCUS_RING}`}>
          Back to Overview
        </button>
      </div>
    </div>
  );
}

function RunScanModal({ onClose, onRun }: { onClose: () => void; onRun: (vendorName: string, scope: string) => void }) {
  const suppliers = ALL_NODES.filter((n) => n.tier !== "site");
  const [vendorId, setVendorId] = useState(suppliers[0].id);
  const [scope, setScope] = useState<(typeof SCAN_SCOPES)[number]>(SCAN_SCOPES[0]);
  const firstFieldRef = useRef<HTMLSelectElement>(null);

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
      <div role="dialog" aria-modal="true" aria-labelledby="scan-modal-title" className="w-full max-w-sm rounded-xl border border-white/10 bg-zinc-900 p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 id="scan-modal-title" className="text-base font-semibold text-zinc-50">
            Run risk scan
          </h2>
          <button type="button" aria-label="Close dialog" onClick={onClose} className={`flex size-8 items-center justify-center rounded-md text-zinc-400 hover:bg-white/10 ${FOCUS_RING}`}>
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>

        <form
          className="mt-4 flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            const vendor = suppliers.find((s) => s.id === vendorId);
            onRun(vendor?.name ?? "Unknown vendor", scope);
          }}
        >
          <div>
            <label htmlFor="scan-vendor" className="mb-1 block text-xs font-medium text-zinc-400">
              Starting vendor
            </label>
            <select
              ref={firstFieldRef}
              id="scan-vendor"
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              className={`h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm font-normal text-zinc-100 ${FOCUS_RING}`}
            >
              {suppliers.map((s) => (
                <option key={s.id} value={s.id} className="bg-zinc-900">
                  {s.code} — {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="scan-scope" className="mb-1 block text-xs font-medium text-zinc-400">
              Scope
            </label>
            <select
              id="scan-scope"
              value={scope}
              onChange={(e) => setScope(e.target.value as (typeof SCAN_SCOPES)[number])}
              className={`h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm font-normal text-zinc-100 ${FOCUS_RING}`}
            >
              {SCAN_SCOPES.map((s) => (
                <option key={s} className="bg-zinc-900">
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-1 flex justify-end gap-2">
            <button type="button" onClick={onClose} className={`h-10 rounded-md border border-white/10 px-3.5 text-sm font-medium text-zinc-300 hover:bg-white/10 ${FOCUS_RING}`}>
              Cancel
            </button>
            <button type="submit" className={`${ACCENT_SOLID} h-10 rounded-md px-3.5 text-sm font-medium ${FOCUS_RING}`}>
              Queue scan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
