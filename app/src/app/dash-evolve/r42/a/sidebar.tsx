"use client";

import { useEffect, useRef, useState } from "react";
import { Building2, CandlestickChart, Check, ChevronsUpDown, FileText, Layers, Receipt, Settings, Star, X } from "lucide-react";
import { INSTRUMENTS, formatPrice, getTickerStats } from "./data";
import { Avatar, ChangeBadge, FOCUS_RING, Sparkline } from "./ui";

const NAV_ITEMS = [
  { label: "Markets", icon: CandlestickChart, active: true },
  { label: "Positions", icon: Layers, active: false },
  { label: "Orders", icon: Receipt, active: false },
  { label: "Reports", icon: FileText, active: false },
];

const DESKS = ["Prop Desk — Alpha", "Prop Desk — Meridian"];

function WorkspaceSwitcher() {
  const [open, setOpen] = useState(false);
  const [deskIndex, setDeskIndex] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative mt-4">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex h-11 w-full items-center gap-2 rounded-lg border border-white/10 px-3 text-left font-medium text-sm text-zinc-50 hover:bg-white/5 ${FOCUS_RING}`}
      >
        <Building2 className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate">{DESKS[deskIndex]}</span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
      </button>
      {open ? (
        <div className="absolute left-0 top-12 z-30 w-full rounded-xl border border-white/10 bg-zinc-900 p-1.5 shadow-xl">
          {DESKS.map((desk, i) => (
            <button
              key={desk}
              type="button"
              onClick={() => {
                setDeskIndex(i);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left font-normal text-sm text-zinc-300 hover:bg-white/5 ${FOCUS_RING}`}
            >
              <span className="min-w-0 flex-1 truncate">{desk}</span>
              {i === deskIndex ? <Check className="h-4 w-4 shrink-0 text-violet-400" aria-hidden="true" /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function BrandAndNav() {
  return (
    <div>
      <div className="flex items-center gap-2.5 px-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-violet-400">
          <CandlestickChart className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold text-lg leading-tight text-zinc-50 [font-family:var(--font-display-wide)]">Fathom</p>
          <p className="truncate font-normal text-xs text-zinc-400">Markets Desk</p>
        </div>
      </div>

      <WorkspaceSwitcher />

      <nav className="mt-4" aria-label="Primary">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <button
                type="button"
                aria-current={item.active ? "page" : undefined}
                className={`flex h-10 w-full items-center gap-2.5 rounded-lg px-3 font-medium text-sm motion-safe:transition-colors ${FOCUS_RING} ${
                  item.active ? "bg-violet-500/15 text-violet-400" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-50"
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

function WatchlistRail({
  pinnedId,
  onPin,
}: {
  pinnedId: string;
  onPin: (id: string) => void;
}) {
  // The pin is the only thing that changes the main pane (chart, header, trades table) — it is
  // explicit and persistent. Hovering or keyboard-focusing a row is purely ephemeral: it reveals
  // a one-line OHLC preview inline, under that row only, and touches no other widget. The preview
  // is also suppressed for the already-pinned row, since the main pane already shows that
  // instrument in full — showing it twice would be a redundant, not an independent, consequence.
  const [previewId, setPreviewId] = useState<string | null>(null);

  return (
    <div className="mt-5">
      <div className="flex items-center gap-1.5 px-2">
        <Star className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
        <p className="font-semibold text-[11px] uppercase tracking-[0.08em] text-zinc-400">Watchlist</p>
      </div>
      <ul className="mt-2 space-y-0.5">
        {INSTRUMENTS.map((inst) => {
          const stats = getTickerStats(inst);
          const isPinned = inst.id === pinnedId;
          const isUp = stats.changePct >= 0;
          const showPreview = previewId === inst.id && !isPinned;
          return (
            <li key={inst.id}>
              <button
                type="button"
                aria-current={isPinned ? "true" : undefined}
                onClick={() => onPin(inst.id)}
                onMouseEnter={() => setPreviewId(inst.id)}
                onMouseLeave={() => setPreviewId((id) => (id === inst.id ? null : id))}
                onFocus={() => setPreviewId(inst.id)}
                onBlur={() => setPreviewId((id) => (id === inst.id ? null : id))}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left motion-safe:transition-colors ${FOCUS_RING} ${
                  isPinned ? "bg-violet-500/10" : "hover:bg-white/5"
                }`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-sm text-zinc-50">{inst.symbol}</span>
                  <span className="block truncate font-normal text-xs text-zinc-400">{inst.name}</span>
                </span>
                <Sparkline values={stats.closes} up={isUp} />
                <span className="w-20 shrink-0 text-right">
                  <span className="block font-medium text-xs tabular-nums text-zinc-50">
                    {inst.decimals === 4 ? stats.lastPrice.toFixed(4) : stats.lastPrice.toFixed(2)}
                  </span>
                  <ChangeBadge value={stats.changePct} />
                </span>
              </button>
              {showPreview ? (
                <p className="mt-0.5 px-3 font-normal text-[11px] tabular-nums text-zinc-400">
                  24h preview — O {formatPrice(stats.openPrice, inst.decimals)} · H {formatPrice(stats.highPrice, inst.decimals)} · L{" "}
                  {formatPrice(stats.lowPrice, inst.decimals)}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function UserFooter() {
  return (
    <div className="mt-auto flex items-center gap-2.5 border-t border-white/10 px-2 pt-4">
      <Avatar name="Jordan Myles" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-sm text-zinc-50">Jordan Myles</p>
        <p className="truncate font-normal text-xs text-zinc-400">Senior Trader</p>
      </div>
      <button
        type="button"
        aria-label="Account settings"
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-50 ${FOCUS_RING}`}
      >
        <Settings className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export function SidebarContent({ pinnedId, onPin }: { pinnedId: string; onPin: (id: string) => void }) {
  return (
    <div className="flex h-full flex-col px-3 py-4">
      <BrandAndNav />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <WatchlistRail pinnedId={pinnedId} onPin={onPin} />
      </div>
      <UserFooter />
    </div>
  );
}

export function DesktopSidebar({ pinnedId, onPin }: { pinnedId: string; onPin: (id: string) => void }) {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-zinc-900 lg:flex">
      <SidebarContent pinnedId={pinnedId} onPin={onPin} />
    </aside>
  );
}

export function MobileSidebarDrawer({
  open,
  onClose,
  pinnedId,
  onPin,
}: {
  open: boolean;
  onClose: () => void;
  pinnedId: string;
  onPin: (id: string) => void;
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
      <button type="button" aria-label="Close navigation" onClick={onClose} className={`absolute inset-0 bg-zinc-950/70 ${FOCUS_RING}`} />
      <div className="relative flex h-full w-80 max-w-[85vw] flex-col bg-zinc-900 motion-safe:animate-[rise_200ms_ease-out]">
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-3">
          <p className="font-semibold text-sm text-zinc-50">Menu</p>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 ${FOCUS_RING}`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <SidebarContent
            pinnedId={pinnedId}
            onPin={(id) => {
              onPin(id);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}
