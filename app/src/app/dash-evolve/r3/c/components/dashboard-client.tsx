"use client";

import { useCallback, useEffect, useState } from "react";
import { dealById } from "../lib/data";
import CommandPalette, { type Command } from "./CommandPalette";
import DealsGrid from "./DealsGrid";
import DetailDrawer from "./DetailDrawer";
import Sidebar from "./Sidebar";
import StatStrip from "./StatStrip";
import Topbar from "./Topbar";

const COMMANDS: Command[] = [
  { id: "open-deal-deal-20", label: "노스스타 항공 딜 열기", hint: "협상 중 · 최우선" },
  { id: "open-deal-deal-17", label: "골든게이트 캐피탈 딜 열기", hint: "협상 중" },
  { id: "open-deal-deal-15", label: "퀀텀리프 소프트웨어 딜 열기", hint: "제안 발송" },
  { id: "goto-grid", label: "딜 파이프라인 그리드로 이동", hint: "전체 목록" },
];

export default function DashboardClient() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const runCommand = useCallback((id: string) => {
    setPaletteOpen(false);
    if (id.startsWith("open-deal-")) {
      setSelectedDealId(id.replace("open-deal-", ""));
    } else if (id === "goto-grid") {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document
        .getElementById("deals-grid-section")
        ?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }
  }, []);

  const selectedDeal = selectedDealId ? dealById(selectedDealId) : undefined;

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setSidebarOpen(true)} onSearchClick={() => setPaletteOpen(true)} />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto flex min-w-0 max-w-[1680px] flex-col gap-5">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-zinc-900">딜 파이프라인</h1>
              <p className="mt-1 text-sm text-zinc-500">
                전체 세일즈 파이프라인을 상태별로 확인하고, 행을 눌러 딜 상세를 바로 검토하세요.
              </p>
            </div>

            <StatStrip />

            <div id="deals-grid-section" className="scroll-mt-24">
              <DealsGrid onOpenDeal={setSelectedDealId} selectedDealId={selectedDealId} />
            </div>
          </div>
        </main>
      </div>

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} commands={COMMANDS} onRun={runCommand} /> : null}
      {selectedDeal ? <DetailDrawer deal={selectedDeal} onClose={() => setSelectedDealId(null)} /> : null}
    </div>
  );
}
