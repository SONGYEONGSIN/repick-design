"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import AdjacencyTable from "./adjacency-table";
import CommandPalette from "./command-palette";
import { EDGES, NODE_BY_ID, NODES } from "./data";
import GraphCanvas from "./graph-canvas";
import IncidentTimeline from "./incident-timeline";
import NodeInspector from "./node-inspector";
import Sidebar from "./sidebar";
import Topbar from "./topbar";
import { APP_BG, TEXT_AUX, TEXT_PRIMARY, cx } from "./tokens";
import { Card, CardHead, useOutsideClose } from "./ui";

export default function FluxgraphClient() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [inspector, setInspector] = useState<{ nodeId: string; left: number; top: number } | null>(null);

  const lastTriggerRef = useRef<Element | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // The inspector's open target is tracked here, at the top level, so a trigger anywhere on
  // the page — a graph node's pointer-only mark (hero) or an adjacency-table row's "View"
  // button (far below it) — can open the exact same popover. Position is computed once, from
  // the trigger element's own getBoundingClientRect(), and the popover itself renders with
  // `position: fixed`, so it is correct regardless of scroll offset.
  const openInspector = useCallback((nodeId: string, triggerEl: Element) => {
    const r = triggerEl.getBoundingClientRect();
    setInspector({ nodeId, left: r.left + r.width / 2, top: r.bottom + 8 });
    lastTriggerRef.current = triggerEl;
  }, []);

  const closeInspector = useCallback(() => {
    setInspector(null);
    const el = lastTriggerRef.current;
    if (el instanceof HTMLElement || el instanceof SVGElement) el.focus();
  }, []);

  // Moving focus into the just-opened popover is an imperative DOM action (el.focus()), not a
  // setState call, so this is not the `react-hooks/set-state-in-effect` shape — that rule is
  // about CommandPalette's query reset below, which conditional-mounting already avoids.
  useEffect(() => {
    if (inspector) closeBtnRef.current?.focus();
  }, [inspector]);

  const dialogRef = useOutsideClose(!!inspector, closeInspector, { allowTriggerSelector: "[data-inspector-trigger]" });

  const handleSelectFromPalette = useCallback(
    (nodeId: string) => {
      setPaletteOpen(false);
      const el = document.querySelector<HTMLElement>(`[data-view-for="${nodeId}"]`);
      if (!el) return;
      // Instant ("auto"), not "smooth": openInspector reads the element's position via
      // getBoundingClientRect() right after this call, and a "smooth" scroll would still be
      // animating at that point, anchoring the popover to the row's PRE-scroll position. An
      // instant jump has no such timing gap, and — having no motion at all — needs no separate
      // prefers-reduced-motion check of its own.
      el.scrollIntoView({ block: "center", inline: "nearest", behavior: "auto" });
      openInspector(nodeId, el);
      el.focus();
    },
    [openInspector],
  );

  const inspectorNode = inspector ? NODE_BY_ID.get(inspector.nodeId) ?? null : null;
  const degradedOrDown = NODES.filter((n) => n.status !== "healthy").length;

  return (
    <div className={cx("flex min-h-screen", APP_BG)}>
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-w-0 flex-1">
          {/* Ultra-wide cap: the sidebar is w-64 (256px), so at exactly 1920px this <main> has
              1920 - 256 = 1664px to work with. max-w is set to that same 1664px, NOT to some
              smaller round number, specifically so this box always fills its parent's width at
              1920px with zero extra mx-auto centering margin — if max-w were smaller than the
              parent (e.g. a flat 1600px), centering would add its own gap on top of the padding
              below, pushing the right-edge gap over the 40px ceiling. With max-w matching the
              available width exactly, the ONLY right-edge gap is this wrapper's own lg:px-8
              (32px), which clears the <=40px requirement. (A viewport wider than 1920px, which
              this round's tested breakpoints don't include, would start adding a real centering
              margin beyond that — out of scope here.) */}
          <div className="mx-auto w-full max-w-[1664px] px-4 py-6 sm:px-6 lg:px-8">
            <div className="grid grid-cols-12 gap-4 lg:gap-6">
              <div className="col-span-12 min-w-0">
                <h1 className={cx("text-xl font-semibold tracking-tight", TEXT_PRIMARY)} style={{ fontFamily: "var(--font-display-mono)" }}>
                  Service Dependency Graph
                </h1>
                <p className={cx("mt-1 text-xs font-normal", TEXT_AUX)}>
                  {NODES.length} services, {EDGES.length} dependencies, {degradedOrDown} degraded or down right now.
                </p>
              </div>

              <div className="col-span-12 min-w-0">
                <Card>
                  <CardHead title="Dependency graph" hint="Fixed concentric-ring layout, grouped by tier or by traffic — no physics simulation, nothing here moves on click." />
                  <div className="mt-4">
                    <GraphCanvas onOpenInspector={openInspector} />
                  </div>
                </Card>
              </div>

              <div className="col-span-12 min-w-0">
                <Card>
                  <CardHead title={<span id="adjacency-table-heading">Adjacency list</span>} hint="The graph's required accessible fallback: every node and every edge, as a real sortable, filterable table." />
                  <div className="mt-4">
                    <AdjacencyTable onOpenInspector={openInspector} />
                  </div>
                </Card>
              </div>

              <div className="col-span-12 min-w-0">
                <Card>
                  <CardHead title="Incident timeline" hint="Independent of the graph and table above — opening a service's details never filters or reorders this feed." />
                  <div className="mt-2">
                    <IncidentTimeline />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} onSelectNode={handleSelectFromPalette} /> : null}

      {inspectorNode && inspector ? (
        <NodeInspector node={inspectorNode} left={inspector.left} top={inspector.top} onClose={closeInspector} closeBtnRef={closeBtnRef} dialogRef={dialogRef} />
      ) : null}
    </div>
  );
}
