"use client";

import { useEffect } from "react";
import { Building2, CandlestickChart, ChevronsUpDown, FileText, Layers, Receipt, Settings, Star, X } from "lucide-react";
import { INSTRUMENTS, getTickerStats } from "./data";
import { Avatar, ChangeBadge, FOCUS_RING, Sparkline } from "./ui";

const NAV_ITEMS = [
  { label: "Markets", icon: CandlestickChart, active: true },
  { label: "Positions", icon: Layers, active: false },
  { label: "Orders", icon: Receipt, active: false },
  { label: "Reports", icon: FileText, active: false },
];

function BrandAndNav() {
  return (
    <div>
      <div className="flex items-center gap-2.5 px-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
          <CandlestickChart className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold text-lg leading-tight text-zinc-900 [font-family:var(--font-display-wide)]">Fathom</p>
          <p className="truncate font-normal text-xs text-zinc-500">Markets Desk</p>
        </div>
      </div>

      <button
        type="button"
        className={`mt-4 flex h-11 w-full items-center gap-2 rounded-lg border border-zinc-200 px-3 text-left font-medium text-sm text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
      >
        <Building2 className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate">Prop Desk — Alpha</span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
      </button>

      <nav className="mt-4" aria-label="Primary">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <button
                type="button"
                aria-current={item.active ? "page" : undefined}
                className={`flex h-10 w-full items-center gap-2.5 rounded-lg px-3 font-medium text-sm motion-safe:transition-colors ${FOCUS_RING} ${
                  item.active ? "bg-emerald-50 text-emerald-700" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

function WatchlistRail({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  return (
    <div className="mt-5">
      <div className="flex items-center gap-1.5 px-2">
        <Star className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
        <p className="font-semibold text-[11px] uppercase tracking-[0.08em] text-zinc-500">Watchlist</p>
      </div>
      <ul className="mt-2 space-y-0.5">
        {INSTRUMENTS.map((inst) => {
          const stats = getTickerStats(inst);
          const isActive = inst.id === selectedId;
          const isUp = stats.changePct >= 0;
          return (
            <li key={inst.id}>
              <button
                type="button"
                aria-current={isActive ? "true" : undefined}
                onClick={() => onSelect(inst.id)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left motion-safe:transition-colors ${FOCUS_RING} ${
                  isActive ? "bg-zinc-100" : "hover:bg-zinc-50"
                }`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-sm text-zinc-900">{inst.symbol}</span>
                  <span className="block truncate font-normal text-xs text-zinc-600">{inst.name}</span>
                </span>
                <Sparkline values={stats.closes} up={isUp} />
                <span className="w-16 shrink-0 text-right">
                  <span className="block font-medium text-xs tabular-nums text-zinc-900">
                    {inst.decimals === 4 ? stats.lastPrice.toFixed(4) : stats.lastPrice.toFixed(2)}
                  </span>
                  <ChangeBadge value={stats.changePct} />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function UserFooter() {
  return (
    <div className="mt-auto flex items-center gap-2.5 border-t border-zinc-200 px-2 pt-4">
      <Avatar name="Jordan Myles" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-sm text-zinc-900">Jordan Myles</p>
        <p className="truncate font-normal text-xs text-zinc-500">Senior Trader</p>
      </div>
      <button type="button" aria-label="Account settings" className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 ${FOCUS_RING}`}>
        <Settings className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export function SidebarContent({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  return (
    <div className="flex h-full flex-col px-3 py-4">
      <BrandAndNav />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <WatchlistRail selectedId={selectedId} onSelect={onSelect} />
      </div>
      <UserFooter />
    </div>
  );
}

export function DesktopSidebar({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-zinc-200 bg-white lg:flex">
      <SidebarContent selectedId={selectedId} onSelect={onSelect} />
    </aside>
  );
}

export function MobileSidebarDrawer({
  open,
  onClose,
  selectedId,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <button type="button" aria-label="Close navigation" onClick={onClose} className="absolute inset-0 bg-zinc-950/40" />
      <div className="relative flex h-full w-80 max-w-[85vw] flex-col bg-white motion-safe:animate-[rise_200ms_ease-out]">
        <div className="flex items-center justify-between border-b border-zinc-200 px-3 py-3">
          <p className="font-semibold text-sm text-zinc-900">Menu</p>
          <button type="button" aria-label="Close navigation" onClick={onClose} className={`flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 ${FOCUS_RING}`}>
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <SidebarContent
            selectedId={selectedId}
            onSelect={(id) => {
              onSelect(id);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}
