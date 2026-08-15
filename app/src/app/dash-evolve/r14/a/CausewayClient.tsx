"use client";

import { useEffect, useState } from "react";
import CommandPalette from "./CommandPalette";
import { TICKET_BY_ID, TICKETS } from "./data";
import type { PeriodId } from "./data";
import DetailPane from "./DetailPane";
import Sidebar from "./Sidebar";
import { APP_BG, BORDER, cx } from "./tokens";
import Topbar from "./Topbar";
import TicketRail from "./TicketRail";

const DEFAULT_TICKET_ID = "HB-1024";

export default function CausewayClient() {
  const [selectedTicketId, setSelectedTicketId] = useState(DEFAULT_TICKET_ID);
  const [period, setPeriod] = useState<PeriodId>("8w");
  const [accountFilter, setAccountFilter] = useState<string | null>(null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const ticket = TICKET_BY_ID[selectedTicketId] ?? TICKETS[0];

  function selectTicket(id: string) {
    setSelectedTicketId(id);
    setMobileDetailOpen(true);
    setPaletteOpen(false);
  }

  function filterAccount(name: string) {
    setAccountFilter(name);
    setMobileDetailOpen(false);
    setPaletteOpen(false);
  }

  return (
    <div className={cx("flex h-dvh min-h-dvh overflow-hidden", APP_BG)}>
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <div id="main-content" className="flex min-h-0 flex-1 overflow-hidden">
          <div className={cx("shrink-0 overflow-hidden border-r lg:block lg:w-[380px]", BORDER, mobileDetailOpen ? "hidden" : "block w-full")}>
            <TicketRail selectedTicketId={selectedTicketId} onSelectTicket={selectTicket} accountFilter={accountFilter} onClearAccountFilter={() => setAccountFilter(null)} />
          </div>

          <div className={cx("min-w-0 flex-1 overflow-y-auto [scrollbar-width:thin]", mobileDetailOpen ? "block" : "hidden lg:block")}>
            <DetailPane ticket={ticket} period={period} onPeriodChange={setPeriod} onSelectTicket={selectTicket} onFilterAccount={filterAccount} onBackToList={() => setMobileDetailOpen(false)} />
          </div>
        </div>
      </div>

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} onSelectTicket={selectTicket} onFilterAccount={filterAccount} /> : null}
    </div>
  );
}
