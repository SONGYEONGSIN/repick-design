"use client";

import { useCallback, useEffect, useState } from "react";
import type { CampaignDraft, PreviewDevice, SetupTab } from "../lib/data";
import { DEFAULT_DRAFT } from "../lib/data";
import CommandPalette, { type Command } from "./CommandPalette";
import HistoryTable from "./HistoryTable";
import PreviewPanel from "./PreviewPanel";
import SetupRail from "./SetupRail";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import TrendChart from "./TrendChart";
import { Card } from "./ui";

const COMMANDS: Command[] = [
  { id: "tab-audience", label: "대상 탭으로 이동", hint: "세그먼트 선택" },
  { id: "tab-content", label: "콘텐츠 탭으로 이동", hint: "제목·본문 편집" },
  { id: "tab-schedule", label: "일정 탭으로 이동", hint: "발송 시각 설정" },
  { id: "goto-history", label: "발송 이력으로 이동", hint: "오픈율·클릭율" },
  { id: "reset-draft", label: "캠페인 초안 초기화", hint: "기본값으로 되돌리기" },
];

export default function DashboardClient() {
  const [draft, setDraft] = useState<CampaignDraft>(DEFAULT_DRAFT);
  const [activeTab, setActiveTab] = useState<SetupTab>("audience");
  const [device, setDevice] = useState<PreviewDevice>("desktop");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const patchDraft = useCallback((patch: Partial<CampaignDraft>) => {
    setDraft((d) => ({ ...d, ...patch }));
  }, []);

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
    if (id === "tab-audience") setActiveTab("audience");
    else if (id === "tab-content") setActiveTab("content");
    else if (id === "tab-schedule") setActiveTab("schedule");
    else if (id === "reset-draft") setDraft(DEFAULT_DRAFT);
    else if (id === "goto-history") {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document
        .getElementById("history-section")
        ?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setSidebarOpen(true)} onSearchClick={() => setPaletteOpen(true)} />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[1680px] flex-col gap-6">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-zinc-900">새 캠페인 만들기</h1>
              <p className="mt-1 text-sm text-zinc-500">
                좌측에서 대상·콘텐츠·일정을 편집하면 우측 미리보기에 즉시 반영됩니다.
              </p>
            </div>

            <div className="flex flex-col items-start gap-6 lg:flex-row">
              <SetupRail draft={draft} onPatch={patchDraft} activeTab={activeTab} onTabChange={setActiveTab} />
              <PreviewPanel draft={draft} device={device} onDeviceChange={setDevice} />
            </div>

            <section id="history-section" aria-labelledby="history-heading" className="scroll-mt-24">
              <Card className="flex flex-col gap-5 p-4 sm:p-5">
                <div>
                  <h2 id="history-heading" className="text-sm font-semibold text-zinc-900">
                    발송 이력
                  </h2>
                  <p className="mt-0.5 text-xs text-zinc-500">최근 캠페인 발송 추이와 상세 기록입니다.</p>
                </div>
                <TrendChart />
                <HistoryTable />
              </Card>
            </section>
          </div>
        </main>
      </div>

      {paletteOpen ? (
        <CommandPalette onClose={() => setPaletteOpen(false)} commands={COMMANDS} onRun={runCommand} />
      ) : null}
    </div>
  );
}
