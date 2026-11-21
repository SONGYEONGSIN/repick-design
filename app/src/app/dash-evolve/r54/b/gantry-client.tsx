"use client";

import { Search, ShieldAlert, ShieldCheck, TriangleAlert, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Board from "./board";
import CommandPalette from "./command-palette";
import { BRAND, DEPLOYMENTS, type Deployment, type RiskLevel, type StageId } from "./data";
import DetailModal from "./detail-modal";
import FunnelChart from "./funnel-chart";
import Sidebar from "./sidebar";
import { BORDER, FOCUS_RING, FOCUS_WITHIN, NUM, RISK_TONE, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import Topbar from "./topbar";

const RISK_FILTERS: { id: RiskLevel; label: string; Icon: typeof ShieldCheck }[] = [
  { id: "low", label: "Low", Icon: ShieldCheck },
  { id: "medium", label: "Medium", Icon: TriangleAlert },
  { id: "high", label: "High", Icon: ShieldAlert },
];

const ALL_RISKS = new Set<RiskLevel>(["low", "medium", "high"]);

export default function GantryClient() {
  const [deployments, setDeployments] = useState<Deployment[]>(DEPLOYMENTS);
  const [query, setQuery] = useState("");
  const [activeRisks, setActiveRisks] = useState<Set<RiskLevel>>(ALL_RISKS);
  const [watchedIds, setWatchedIds] = useState<Set<string>>(new Set(["dep-13", "dep-16"]));
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [openCardId, setOpenCardId] = useState<string | null>(null);

  const paletteTriggerRef = useRef<HTMLButtonElement>(null);
  const cardTriggerRef = useRef<HTMLElement | null>(null);

  /* Focus restoration follows a previous-open-tracking ("wasOpenRef") pattern so it only fires on a
     genuine open→closed transition, never on initial mount — a plain `if (open) {...} else {
     focus() }` effect would incorrectly call focus() the moment this component first mounts with
     the palette/modal already closed. */
  const wasPaletteOpenRef = useRef(false);
  useEffect(() => {
    if (paletteOpen) {
      wasPaletteOpenRef.current = true;
    } else if (wasPaletteOpenRef.current) {
      wasPaletteOpenRef.current = false;
      paletteTriggerRef.current?.focus();
    }
  }, [paletteOpen]);

  const prevOpenCardRef = useRef<string | null>(null);
  useEffect(() => {
    if (openCardId) {
      prevOpenCardRef.current = openCardId;
    } else if (prevOpenCardRef.current) {
      prevOpenCardRef.current = null;
      cardTriggerRef.current?.focus();
    }
  }, [openCardId]);

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

  const handleMove = useCallback((id: string, stage: StageId) => {
    setDeployments((prev) => prev.map((d) => (d.id === id ? { ...d, stage } : d)));
  }, []);

  const handleToggleWatch = useCallback((id: string) => {
    setWatchedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleToggleChecklistItem = useCallback((id: string, index: number) => {
    setDeployments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, checklist: d.checklist.map((c, i) => (i === index ? { ...c, done: !c.done } : c)) } : d)),
    );
  }, []);

  const handleToggleRisk = useCallback((risk: RiskLevel) => {
    setActiveRisks((prev) => {
      const next = new Set(prev);
      if (next.has(risk)) next.delete(risk);
      else next.add(risk);
      return next;
    });
  }, []);

  function handleOpenCard(id: string, trigger: HTMLElement) {
    cardTriggerRef.current = trigger;
    setOpenCardId(id);
  }

  function handleSelectFromPalette(d: Deployment, trigger: HTMLElement) {
    setPaletteOpen(false);
    cardTriggerRef.current = trigger;
    setOpenCardId(d.id);
  }

  const q = query.trim().toLowerCase();
  const filteredDeployments = useMemo(() => {
    return deployments.filter((d) => {
      if (!activeRisks.has(d.riskLevel)) return false;
      if (q === "") return true;
      return (
        d.modelName.toLowerCase().includes(q) ||
        d.owner.name.toLowerCase().includes(q) ||
        d.team.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [deployments, activeRisks, q]);

  const openDeployment = openCardId ? deployments.find((d) => d.id === openCardId) ?? null : null;

  return (
    <div className="flex h-dvh min-h-dvh overflow-hidden bg-zinc-950 text-zinc-50">
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar ref={paletteTriggerRef} onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
          <div className="flex w-full flex-col gap-4 p-4 sm:p-6">
            <header className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-[26px]" style={{ fontFamily: "var(--font-display-wide)" }}>
                Deployments
              </h1>
              <p className={cx("text-sm", TEXT_CAPTION)}>
                {BRAND.name} &middot; {BRAND.tagline}
              </p>
            </header>

            <FunnelChart />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className={cx("flex h-11 w-full items-center gap-2 rounded-lg border px-3 sm:max-w-sm", BORDER, "bg-zinc-900", FOCUS_WITHIN)}>
                <Search size={15} aria-hidden="true" className={cx("shrink-0", TEXT_CAPTION)} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filter by model, owner, team or tag…"
                  aria-label="Filter deployments"
                  className={cx("h-full flex-1 bg-transparent text-sm outline-none", TEXT_PRIMARY, "placeholder:text-zinc-400")}
                />
                {query !== "" ? (
                  <button type="button" onClick={() => setQuery("")} aria-label="Clear filter" className={cx("grid h-6 w-6 shrink-0 place-items-center rounded-md", TEXT_CAPTION, "hover:bg-white/10", TRANSITION, FOCUS_RING)}>
                    <X size={13} aria-hidden="true" />
                  </button>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by risk level">
                {RISK_FILTERS.map(({ id, label, Icon }) => {
                  const tone = RISK_TONE[id];
                  const active = activeRisks.has(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => handleToggleRisk(id)}
                      className={cx(
                        "flex h-9 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium",
                        TRANSITION,
                        FOCUS_RING,
                        active ? cx(tone.text, tone.bg, tone.border) : cx(BORDER, "bg-transparent text-zinc-400 line-through decoration-zinc-400"),
                      )}
                    >
                      <Icon size={12} aria-hidden="true" />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <p className={cx("text-xs", TEXT_CAPTION)} aria-live="polite">
              Showing <span className={cx(NUM, "font-semibold text-zinc-50")}>{filteredDeployments.length}</span> of{" "}
              <span className={NUM}>{deployments.length}</span> deployments
            </p>

            <Board deployments={filteredDeployments} onMove={handleMove} onOpenCard={handleOpenCard} watchedIds={watchedIds} onToggleWatch={handleToggleWatch} />
          </div>
        </main>
      </div>

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} onSelectDeployment={handleSelectFromPalette} /> : null}

      {openDeployment ? (
        <DetailModal
          deployment={openDeployment}
          onClose={() => setOpenCardId(null)}
          onMove={handleMove}
          watched={watchedIds.has(openDeployment.id)}
          onToggleWatch={handleToggleWatch}
          onToggleChecklistItem={handleToggleChecklistItem}
        />
      ) : null}
    </div>
  );
}
