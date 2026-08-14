"use client";

import { useCallback, useEffect, useState } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { Hero } from "./hero";
import { BentoGrid, type ExpandableCardId } from "./bento-grid";
import { CommandPalette } from "./command-palette";
import { PRODUCT_NAME } from "./data";
import type { ChannelFilter, Period } from "./types";

const CARD_DOM_ID: Record<ExpandableCardId, string> = {
  queue: "channel-queue-card",
  agents: "agent-workload-card",
  escalations: "escalations-card",
};

export function PulseDashboard() {
  const [period, setPeriod] = useState<Period>("7d");
  const [channel, setChannel] = useState<ChannelFilter>("all");
  const [expanded, setExpanded] = useState<Record<ExpandableCardId, boolean>>({
    queue: false,
    agents: false,
    escalations: false,
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const toggleCard = useCallback((id: ExpandableCardId) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const expandAndReveal = useCallback((id: string) => {
    if (id !== "queue" && id !== "agents" && id !== "escalations") return;
    setExpanded((prev) => ({ ...prev, [id]: true }));
    window.requestAnimationFrame(() => {
      const el = document.getElementById(CARD_DOM_ID[id]);
      if (!el) return;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Sidebar mobileOpen={mobileSidebarOpen} onCloseMobile={() => setMobileSidebarOpen(false)} />

      <div className="lg:pl-60">
        <Topbar
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />

        <main id="overview" className="mx-auto w-full max-w-[1680px] px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">SLA operations overview</h1>
            <p className="mt-1 text-[13px] text-zinc-400">
              {PRODUCT_NAME} customer support console — monitor channel queues and agent workload in real time, and
              compare SLA trends with the period toggle.
            </p>
          </div>

          <div className="space-y-6">
            <Hero period={period} channel={channel} onPeriodChange={setPeriod} onChannelChange={setChannel} />
            <BentoGrid period={period} channel={channel} expanded={expanded} onToggle={toggleCard} />
          </div>
        </main>
      </div>

      <CommandPalette
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSetPeriod={setPeriod}
        onSetChannel={setChannel}
        onExpandCard={expandAndReveal}
      />
    </div>
  );
}
