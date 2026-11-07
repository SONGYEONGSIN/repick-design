"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Bell, Command, Download, LogOut, Menu, Search, Settings, User } from "lucide-react";
import { AGENTS, TICKETS, avatarUrl, teamName, ticketStatus } from "./data";
import { ACCENT, CONTROL_HEIGHT, FOCUS_RING, TEXT } from "./tokens";
import { Popover, PopoverItem, VisuallyHidden } from "./ui";

const NOTICES = [
  { id: "n1", text: "Trust & Safety breached SLA on 2 tickets this window." },
  { id: "n2", text: "Technical team cleared its backlog of escalations under 10h." },
  { id: "n3", text: "Billing's median resolution time improved versus last window." },
];

function downloadCsv() {
  const header = "id,team,subject,customer,status,hours\n";
  const rows = TICKETS.map((t) => {
    const hours = t.kind === "resolved" ? t.resolutionHours : t.elapsedHours;
    const subject = t.subject.replace(/"/g, "'");
    return `${t.id},${teamName(t.team)},"${subject}",${t.customer},${ticketStatus(t)},${hours}`;
  }).join("\n");
  const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "ticket-resolution-health.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function Topbar({ onOpenPalette, onOpenMobileNav }: { onOpenPalette: () => void; onOpenMobileNav: () => void }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifRead, setNotifRead] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const notifAnchor = useRef<HTMLButtonElement>(null);
  const userAnchor = useRef<HTMLButtonElement>(null);
  const agent = AGENTS[0];

  return (
    <header className="flex h-16 items-center gap-4 border-b border-white/10 bg-zinc-950/95 px-4 backdrop-blur sm:px-6">
      <button
        id="topbar-mobile-nav-trigger"
        type="button"
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
        className={`flex ${CONTROL_HEIGHT} w-11 items-center justify-center rounded-lg ${TEXT.muted} hover:bg-white/5 lg:hidden ${FOCUS_RING}`}
      >
        <Menu aria-hidden="true" className="h-5 w-5" />
      </button>

      <button
        id="topbar-search-trigger"
        type="button"
        onClick={onOpenPalette}
        className={`flex ${CONTROL_HEIGHT} flex-1 max-w-sm items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.02] px-3.5 text-sm ${TEXT.muted} hover:border-white/20 sm:flex-initial ${FOCUS_RING}`}
      >
        <Search aria-hidden="true" className="h-4 w-4 shrink-0" />
        <span className="flex-1 text-left">Search tickets, teams…</span>
        <kbd className="hidden items-center gap-0.5 rounded border border-white/10 px-1.5 py-0.5 text-[10px] sm:inline-flex">
          <Command aria-hidden="true" className="h-2.5 w-2.5" />K
        </kbd>
      </button>

      <div className="flex-1" />

      <button
        type="button"
        onClick={downloadCsv}
        className={`hidden ${CONTROL_HEIGHT} items-center gap-2 rounded-lg px-3.5 text-sm font-medium ${ACCENT.fill} ${ACCENT.onFill} ${ACCENT.fillHover} sm:inline-flex ${FOCUS_RING}`}
      >
        <Download aria-hidden="true" className="h-4 w-4" />
        Export CSV
      </button>

      <div className="relative">
        <button
          ref={notifAnchor}
          type="button"
          aria-haspopup="menu"
          aria-expanded={notifOpen}
          onClick={() => {
            setNotifOpen((o) => !o);
            setNotifRead(true);
          }}
          className={`relative flex ${CONTROL_HEIGHT} w-11 items-center justify-center rounded-lg ${TEXT.muted} hover:bg-white/5 ${FOCUS_RING}`}
        >
          <Bell aria-hidden="true" className="h-4 w-4" />
          {!notifRead ? <span aria-hidden="true" className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-emerald-400" /> : null}
          <VisuallyHidden>Notifications{!notifRead ? ", unread" : ""}</VisuallyHidden>
        </button>
        <Popover open={notifOpen} onClose={() => setNotifOpen(false)} anchorRef={notifAnchor} label="Notifications">
          <p className={`px-3 py-2 text-xs font-medium ${TEXT.muted}`}>Recent notices</p>
          {NOTICES.map((n) => (
            <p key={n.id} className={`px-3 py-2 text-sm ${TEXT.secondary}`}>
              {n.text}
            </p>
          ))}
        </Popover>
      </div>

      <div className="relative">
        <button
          ref={userAnchor}
          type="button"
          aria-haspopup="menu"
          aria-expanded={userOpen}
          onClick={() => setUserOpen((o) => !o)}
          className={`flex ${CONTROL_HEIGHT} items-center gap-2 rounded-lg px-1.5 hover:bg-white/5 ${FOCUS_RING}`}
        >
          <Image src={avatarUrl(agent.id)} alt={agent.name} width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
          <VisuallyHidden>Account menu for {agent.name}</VisuallyHidden>
        </button>
        <Popover open={userOpen} onClose={() => setUserOpen(false)} anchorRef={userAnchor} label="Account menu">
          <PopoverItem icon={User} onClick={() => setUserOpen(false)}>View profile</PopoverItem>
          <PopoverItem icon={Settings} onClick={() => setUserOpen(false)}>Preferences</PopoverItem>
          <PopoverItem icon={LogOut} onClick={() => setUserOpen(false)}>Sign out</PopoverItem>
        </Popover>
      </div>
    </header>
  );
}
