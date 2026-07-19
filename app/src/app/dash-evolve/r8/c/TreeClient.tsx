"use client";

import { AlertTriangle, Gauge, UserPlus2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import CommandPalette from "./CommandPalette";
import DetailDrawer from "./DetailDrawer";
import OrgTreeCanvas, { type MetricMode } from "./OrgTreeCanvas";
import RosterTable from "./RosterTable";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { formatCount, NODE_MAP, NODES, ROOT_ID, STATUS_META } from "./data";
import { BORDER, NUM, TEXT_CAPTION, TEXT_PRIMARY, cx } from "./tokens";
import { Card, CardHeader, EyebrowLabel, SegmentedControl } from "./ui";

const METRIC_OPTIONS: { id: MetricMode; label: string }[] = [
  { id: "utilization", label: "가동률" },
  { id: "headcount", label: "헤드카운트" },
];

const company = NODE_MAP[ROOT_ID];
const atRiskCount = NODES.filter((n) => n.id !== ROOT_ID && n.status !== "healthy").length;

function InlineStat({ Icon, label, value, valueClass }: { Icon: typeof Users; label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
        <Icon size={14} aria-hidden="true" className={TEXT_CAPTION} />
      </span>
      <div className="min-w-0">
        <EyebrowLabel>{label}</EyebrowLabel>
        <p className={cx("text-sm font-semibold leading-tight", NUM, valueClass ?? TEXT_PRIMARY)}>{value}</p>
      </div>
    </div>
  );
}

export default function TreeClient() {
  const [selectedId, setSelectedId] = useState<string | null>("platform-eng");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [metricMode, setMetricMode] = useState<MetricMode>("utilization");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

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

  function handleSelect(id: string) {
    setSelectedId(id);
    setDrawerOpen(true);
  }

  const selectedNode = selectedId ? (NODE_MAP[selectedId] ?? null) : null;

  return (
    <div className={cx("flex h-dvh min-h-dvh overflow-hidden", "bg-zinc-50 dark:bg-zinc-950", TEXT_PRIMARY)}>
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
          <div className="mx-auto flex max-w-[1600px] flex-col gap-4 p-4 sm:p-6">
            <header className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className={cx("text-xl font-semibold tracking-tight sm:text-2xl", TEXT_PRIMARY)}>조직도 &amp; 캐파시티</h1>
                <p className={cx("mt-0.5 text-sm", TEXT_CAPTION)}>Solace Systems · People Analytics 워크스페이스</p>
              </div>
            </header>

            <Card className="min-w-0" padded={false}>
              <div className="p-4 sm:p-5">
                <CardHeader
                  title="보고 구조"
                  titleId="org-tree-heading"
                  description="노드 = 부문/팀. 카드 색과 막대는 선택한 지표를 즉시 읽을 수 있게 인코딩합니다. 클릭하면 상세 패널과 로스터가 동기화됩니다."
                  action={<SegmentedControl ariaLabel="트리 지표 보기" options={METRIC_OPTIONS} value={metricMode} onChange={setMetricMode} />}
                />

                <div className="mt-4 flex flex-wrap items-center gap-x-7 gap-y-3">
                  <InlineStat Icon={Users} label="전체 헤드카운트" value={`${formatCount(company.headcount)}명`} />
                  <span aria-hidden="true" className={cx("hidden h-8 w-px sm:block", "bg-zinc-200 dark:bg-zinc-800")} />
                  <InlineStat Icon={Gauge} label="평균 가동률" value={`${company.utilization}%`} />
                  <span aria-hidden="true" className={cx("hidden h-8 w-px sm:block", "bg-zinc-200 dark:bg-zinc-800")} />
                  <InlineStat Icon={AlertTriangle} label="주의·과부하 팀" value={`${atRiskCount}개`} valueClass={atRiskCount > 0 ? "text-amber-700 dark:text-amber-300" : undefined} />
                  <span aria-hidden="true" className={cx("hidden h-8 w-px sm:block", "bg-zinc-200 dark:bg-zinc-800")} />
                  <InlineStat Icon={UserPlus2} label="채용 요청" value={`${company.openReqs}건`} />

                  <div className="ml-auto flex flex-wrap items-center gap-3">
                    {(["healthy", "at-risk", "overloaded"] as const).map((s) => {
                      const m = STATUS_META[s];
                      return (
                        <span key={s} className={cx("inline-flex items-center gap-1.5 text-xs font-medium", m.text)}>
                          <span aria-hidden="true" className={cx("h-2 w-2 rounded-full", m.dot)} />
                          {m.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className={cx("border-t p-4 sm:p-6", BORDER)} role="group" aria-labelledby="org-tree-heading">
                <OrgTreeCanvas metricMode={metricMode} selectedId={selectedId} onSelect={handleSelect} />
              </div>
            </Card>

            <RosterTable selectedId={selectedId} onSelect={handleSelect} />
          </div>
        </main>
      </div>

      <DetailDrawer node={selectedNode} open={drawerOpen} onClose={() => setDrawerOpen(false)} onSelect={handleSelect} />

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} onSelectNode={handleSelect} /> : null}
    </div>
  );
}
