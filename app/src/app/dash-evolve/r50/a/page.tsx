"use client";

import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "./Sidebar";
import { MobileDrawer } from "./MobileDrawer";
import { Topbar } from "./Topbar";
import { QueueRail, type Segment } from "./QueueRail";
import { DetailPane } from "./DetailPane";
import { CommandPalette } from "./CommandPalette";
import { NewReleaseDialog, type NewReleaseInput } from "./NewReleaseDialog";
import { NAV_ITEMS, type NavId } from "./Nav";
import { RELEASES, type Release, releaseRiskScore, releaseTier } from "./data";

// First-paint default must never be an empty "select something" state — pick the highest-risk
// pending release, computed once from the same data the rest of the page reads.
const DEFAULT_SELECTED_ID = RELEASES.filter((r) => r.status === "pending").reduce((best, r) =>
  releaseRiskScore(r) > releaseRiskScore(best) ? r : best
).id;

export default function Page() {
  const [releases, setReleases] = useState<Release[]>(RELEASES);
  const [segment, setSegment] = useState<Segment>("pending");
  const [selectedId, setSelectedId] = useState(DEFAULT_SELECTED_ID);
  const [activeNav, setActiveNav] = useState<NavId>("releases");
  const [mobileView, setMobileView] = useState<"list" | "detail">("list");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [newReleaseOpen, setNewReleaseOpen] = useState(false);
  const [newCounter, setNewCounter] = useState(0);

  useEffect(() => {
    function onKey(ev: KeyboardEvent) {
      if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === "k") {
        ev.preventDefault();
        if (!newReleaseOpen) setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [newReleaseOpen]);

  const selectedRelease = useMemo(
    () => releases.find((r) => r.id === selectedId) ?? releases[0],
    [releases, selectedId]
  );

  const pendingCount = useMemo(() => releases.filter((r) => r.status === "pending").length, [releases]);
  const approvedCount = useMemo(() => releases.filter((r) => r.status === "approved").length, [releases]);
  const criticalCount = useMemo(
    () => releases.filter((r) => r.status === "pending" && releaseTier(r) === "Critical").length,
    [releases]
  );

  // Click-to-select is the ONE axis that persists and drives the whole detail pane. Hovering a
  // bubble or a table row (inside DetailPane) is a separate, ephemeral axis scoped only there.
  function handleSelect(id: string) {
    setSelectedId(id);
    setMobileView("detail");
  }

  function handleSegmentChange(seg: Segment) {
    setSegment(seg);
    const list = releases.filter((r) => r.status === seg);
    if (list.length === 0) return;
    if (!list.some((r) => r.id === selectedId)) {
      const top =
        seg === "pending" ? list.reduce((best, r) => (releaseRiskScore(r) > releaseRiskScore(best) ? r : best)) : list[0];
      setSelectedId(top.id);
    }
  }

  function handleJump(id: string) {
    const r = releases.find((x) => x.id === id);
    if (!r) return;
    setSegment(r.status);
    setSelectedId(id);
    setMobileView("detail");
  }

  function handleApprove(id: string) {
    setReleases((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "approved" as const, approvedBy: "You", approvedAt: "Just now" } : r))
    );
    setSegment("approved");
  }

  function handleRequestChanges(id: string, note: string) {
    setReleases((prev) => prev.map((r) => (r.id === id ? { ...r, changeNote: note } : r)));
  }

  function handleCreate(input: NewReleaseInput) {
    const id = `rel-new-${newCounter}`;
    const newRelease: Release = {
      id,
      version: `v0.${newCounter + 1}.0`,
      title: input.title,
      env: input.env,
      requestedBy: { name: "You", initials: "YS" },
      requestedAt: "Just now",
      status: "pending",
      services: [{ id: `${id}-svc`, ...input.service }],
    };
    setReleases((prev) => [newRelease, ...prev]);
    setNewCounter((c) => c + 1);
    setSegment("pending");
    setSelectedId(id);
  }

  const navLabel = NAV_ITEMS.find((n) => n.id === activeNav)?.label ?? "";

  return (
    <div className="flex h-screen bg-zinc-50 text-zinc-900">
      <Sidebar active={activeNav} onNavigate={setActiveNav} />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Topbar
          onOpenPalette={() => setPaletteOpen(true)}
          onOpenNewRelease={() => setNewReleaseOpen(true)}
          onOpenDrawer={() => setDrawerOpen(true)}
          pendingCount={pendingCount}
          criticalCount={criticalCount}
        />

        <main className="flex min-h-0 flex-1 overflow-hidden">
          {activeNav === "releases" ? (
            <div className="flex min-h-0 w-full flex-1">
              <div className={`${mobileView === "list" ? "flex" : "hidden"} min-h-0 w-full sm:flex sm:w-auto`}>
                <QueueRail
                  releases={releases}
                  segment={segment}
                  onSegmentChange={handleSegmentChange}
                  selectedId={selectedId}
                  onSelect={handleSelect}
                  pendingCount={pendingCount}
                  approvedCount={approvedCount}
                />
              </div>
              <div className={`${mobileView === "detail" ? "block" : "hidden"} min-h-0 min-w-0 flex-1 overflow-y-auto bg-zinc-50 sm:block`}>
                <DetailPane
                  release={selectedRelease}
                  onApprove={handleApprove}
                  onRequestChanges={handleRequestChanges}
                  onBack={() => setMobileView("list")}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center p-10">
              <div className="max-w-sm text-center">
                <h1 className="text-lg font-semibold text-zinc-900">{navLabel}</h1>
                <p className="mt-1 text-sm font-normal text-zinc-600">
                  This section isn&apos;t wired up in this preview — the release queue and approval detail are the focus here.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} active={activeNav} onNavigate={setActiveNav} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} releases={releases} onJump={handleJump} />
      <NewReleaseDialog open={newReleaseOpen} onClose={() => setNewReleaseOpen(false)} onCreate={handleCreate} />
    </div>
  );
}
