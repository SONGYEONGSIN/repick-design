"use client";

import { Radio, ShieldAlert, Users, XOctagon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ActorTable from "./ActorTable";
import CommandPalette from "./CommandPalette";
import EventInspector from "./EventInspector";
import EventStream from "./EventStream";
import FilterBar from "./FilterBar";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { EVENTS, actorById, formatInt, type AuditEvent } from "./data";
import { APP_BG, BORDER, NUM, SURFACE_INSET, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, cx, type EventCategory, type Severity } from "./tokens";
import { Card, CardHead, Eyebrow } from "./ui";

export default function RedoubtClient() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // --- Stream filters: a partial recompute. Changing any of these only re-derives `filteredEvents`
  // below, which feeds the four summary cards and the EventStream list. Nothing else on the page
  // reads this state — the Actor Risk Index table is intentionally out of its reach.
  const [query, setQuery] = useState("");
  const [activeSeverities, setActiveSeverities] = useState<Severity[]>([]);
  const [activeCategories, setActiveCategories] = useState<EventCategory[]>([]);
  const [activeActors, setActiveActors] = useState<string[]>([]);

  // --- Ephemeral inspector: which event (if any) is open in the drawer. This never feeds back into
  // the filters above, the stream's own item order, or the Actor Risk Index — closing it, or opening
  // a different event, changes nothing else on the page.
  const [inspectorEvent, setInspectorEvent] = useState<AuditEvent | null>(null);

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

  function toggleSeverity(s: Severity) {
    setActiveSeverities((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));
  }
  function toggleCategory(c: EventCategory) {
    setActiveCategories((cur) => (cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]));
  }
  function toggleActor(id: string) {
    setActiveActors((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }
  function clearAllFilters() {
    setQuery("");
    setActiveSeverities([]);
    setActiveCategories([]);
    setActiveActors([]);
  }

  const q = query.trim().toLowerCase();
  const filteredEvents = useMemo(
    () =>
      EVENTS.filter((e) => {
        if (activeSeverities.length > 0 && !activeSeverities.includes(e.severity)) return false;
        if (activeCategories.length > 0 && !activeCategories.includes(e.category)) return false;
        if (activeActors.length > 0 && !activeActors.includes(e.actorId)) return false;
        if (q !== "" && !e.summary.toLowerCase().includes(q) && !e.resource.toLowerCase().includes(q) && !actorById(e.actorId).name.toLowerCase().includes(q)) return false;
        return true;
      }),
    [q, activeSeverities, activeCategories, activeActors],
  );

  const hasFilters = query !== "" || activeSeverities.length > 0 || activeCategories.length > 0 || activeActors.length > 0;

  const criticalHighCount = filteredEvents.filter((e) => e.severity === "critical" || e.severity === "high").length;
  const notSuccessCount = filteredEvents.filter((e) => e.outcome !== "success").length;
  const uniqueActorCount = new Set(filteredEvents.map((e) => e.actorId)).size;

  const relatedForInspector = inspectorEvent ? (inspectorEvent.relatedIds ?? []).map((id) => EVENTS.find((e) => e.id === id)).filter((e): e is AuditEvent => Boolean(e)) : [];

  return (
    <div className={cx("flex min-h-dvh overflow-x-hidden", APP_BG, TEXT_PRIMARY)}>
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0 max-w-3xl">
              <Eyebrow mono>{`Security audit · ${formatInt(EVENTS.length)} events logged`}</Eyebrow>
              <h1 className={cx("mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]", TEXT_PRIMARY)}>Event stream</h1>
              <p className={cx("mt-1.5 text-sm font-normal leading-relaxed", TEXT_AUX)}>
                Filtering by actor, type, or severity only re-scopes the stream below and its summary counts. Opening an event never changes
                anything else — the inspector drawer and the Actor Risk Index panel each keep their own state.
              </p>
            </div>
          </div>

          <h2 className="sr-only font-medium">Stream summary</h2>
          <dl className="mt-4 grid grid-cols-12 gap-3">
            <div className={cx("col-span-12 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", BORDER, SURFACE_INSET)}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>Events in view</dt>
              <dd className="mt-1.5">
                <span className={cx("flex items-center gap-1.5 text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>
                  <Radio size={17} aria-hidden="true" className={TEXT_AUX} />
                  {formatInt(filteredEvents.length)}
                </span>
                <span className={cx("mt-2 block text-[11px] font-normal", TEXT_AUX)}>{hasFilters ? `of ${formatInt(EVENTS.length)} total` : "last 44 hours"}</span>
              </dd>
            </div>

            <div className={cx("col-span-12 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", criticalHighCount > 0 ? "border-rose-800/60 bg-rose-950/20" : cx(BORDER, SURFACE_INSET))}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", criticalHighCount > 0 ? "text-rose-300" : TEXT_AUX)}>Critical + high</dt>
              <dd className="mt-1.5">
                <span className={cx("flex items-center gap-1.5 text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>
                  <ShieldAlert size={17} aria-hidden="true" className={criticalHighCount > 0 ? "text-rose-400" : TEXT_AUX} />
                  {formatInt(criticalHighCount)}
                </span>
                <span className={cx("mt-2 block text-[11px] font-normal", criticalHighCount > 0 ? "text-rose-300" : TEXT_AUX)}>in the current view</span>
              </dd>
            </div>

            <div className={cx("col-span-12 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", BORDER, SURFACE_INSET)}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>Failed / blocked</dt>
              <dd className="mt-1.5">
                <span className={cx("flex items-center gap-1.5 text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>
                  <XOctagon size={17} aria-hidden="true" className={TEXT_AUX} />
                  {formatInt(notSuccessCount)}
                </span>
                <span className={cx("mt-2 block text-[11px] font-normal", TEXT_AUX)}>non-success outcomes</span>
              </dd>
            </div>

            <div className={cx("col-span-12 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", BORDER, SURFACE_INSET)}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>Unique actors</dt>
              <dd className="mt-1.5">
                <span className={cx("flex items-center gap-1.5 text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>
                  <Users size={17} aria-hidden="true" className={TEXT_AUX} />
                  {formatInt(uniqueActorCount)}
                </span>
                <span className={cx("mt-2 block text-[11px] font-normal", TEXT_AUX)}>touched the current view</span>
              </dd>
            </div>
          </dl>

          <div className="mt-4 grid grid-cols-12 gap-4">
            <div className="col-span-12 min-w-0 xl:col-span-8">
              <Card>
                <CardHead title="Live event stream" hint="Most recent first. Click any row, or press Enter on it, to open the full inspector." />
                <div className="mt-3">
                  <FilterBar
                    query={query}
                    onQueryChange={setQuery}
                    activeSeverities={activeSeverities}
                    onToggleSeverity={toggleSeverity}
                    activeCategories={activeCategories}
                    onToggleCategory={toggleCategory}
                    activeActors={activeActors}
                    onToggleActor={toggleActor}
                    onClearAll={clearAllFilters}
                    hasFilters={hasFilters}
                  />
                </div>
                <div className="mt-4">
                  <EventStream events={filteredEvents} totalCount={EVENTS.length} onOpenEvent={setInspectorEvent} onClearFilters={clearAllFilters} filtered={hasFilters} />
                </div>
              </Card>
            </div>

            <div className="col-span-12 min-w-0 xl:col-span-4">
              <Card>
                <ActorTable />
              </Card>
            </div>
          </div>

          <p className={cx("mt-4 text-[11px] font-normal", TEXT_MUTED)}>Retention: audit events are kept for 180 days and exported monthly to cold storage.</p>
        </main>
      </div>

      {paletteOpen ? (
        <CommandPalette
          onClose={() => setPaletteOpen(false)}
          onOpenEvent={(ev) => setInspectorEvent(ev)}
          onFilterActor={(id) => setActiveActors((cur) => (cur.includes(id) ? cur : [...cur, id]))}
        />
      ) : null}

      {inspectorEvent ? (
        <EventInspector
          event={inspectorEvent}
          onClose={() => setInspectorEvent(null)}
          onOpenRelated={(id) => {
            const next = EVENTS.find((e) => e.id === id);
            if (next) setInspectorEvent(next);
          }}
          related={relatedForInspector}
        />
      ) : null}
    </div>
  );
}
