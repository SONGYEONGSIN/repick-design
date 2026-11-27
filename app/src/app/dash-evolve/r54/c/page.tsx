"use client";

import { AlertTriangle, Scale, Wallet } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CommandPalette from "./CommandPalette";
import DetailPanel from "./DetailPanel";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Treemap from "./Treemap";
import {
  DEPARTMENT_ORDER,
  GROUPINGS,
  QUARTERS,
  classifySeverity,
  companyHeadcount,
  companyTarget,
  companyTotal,
  flaggedLineItemCount,
  variancePct,
} from "./data";
import type { CostTypeId, DepartmentId, Grouping, Quarter } from "./data";
import { formatCount, formatCurrency, formatSignedPercent } from "./format";
import { APP_BG, CARD, NUM, SEVERITY_BADGE, SEVERITY_LABEL, TEXT_AUX, TEXT_PRIMARY, cx } from "./tokens";
import { Delta, Segmented } from "./ui";

export default function Page() {
  const [grouping, setGrouping] = useState<Grouping>("department");
  const [quarter, setQuarter] = useState<Quarter>("q4-2026");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<DepartmentId>("engineering");
  const [selectedCostTypeId, setSelectedCostTypeId] = useState<CostTypeId>("salary-benefits");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const paletteButtonRef = useRef<HTMLButtonElement>(null);
  const wasPaletteOpenRef = useRef(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Restore focus to the palette's trigger only on a genuine open -> closed transition, never on
  // initial mount (a plain `if (open) {...} else { focus() }` effect would incorrectly fire once
  // when the component first renders with `paletteOpen === false`).
  useEffect(() => {
    if (wasPaletteOpenRef.current && !paletteOpen) {
      paletteButtonRef.current?.focus();
    }
    wasPaletteOpenRef.current = paletteOpen;
  }, [paletteOpen]);

  function closePalette() {
    setPaletteOpen(false);
    setPaletteQuery("");
  }

  function handleTreemapSelect(id: string, kind: Grouping) {
    if (kind === "department") setSelectedDepartmentId(id as DepartmentId);
    else setSelectedCostTypeId(id as CostTypeId);
  }

  const total = companyTotal(quarter);
  const otherQuarter: Quarter = quarter === "q4-2026" ? "q3-2026" : "q4-2026";
  const otherTotal = companyTotal(otherQuarter);
  const totalDeltaPct = ((total - otherTotal) / otherTotal) * 100;

  const target = companyTarget(grouping);
  const variance = variancePct(total, target);
  const otherVariance = variancePct(otherTotal, target);
  const severity = classifySeverity(variance);

  const headcount = companyHeadcount();
  const flaggedCount = flaggedLineItemCount();

  const quarterLabel = QUARTERS.find((q) => q.value === quarter)?.label ?? "";
  const otherQuarterLabel = QUARTERS.find((q) => q.value === otherQuarter)?.label ?? "";

  return (
    <div className={cx("flex h-screen overflow-hidden", APP_BG, TEXT_PRIMARY)}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-rose-700 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg"
      >
        Skip to main content
      </a>

      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenMobileNav={() => setMobileNavOpen(true)} onOpenPalette={() => setPaletteOpen(true)} paletteButtonRef={paletteButtonRef} />

        <main id="main-content" className={cx("min-h-0 flex-1 overflow-y-auto", APP_BG)}>
          <div className="mx-auto w-full max-w-[1760px] px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className={cx("text-xl font-semibold", TEXT_PRIMARY)} style={{ fontFamily: "var(--font-display-grotesk)" }}>
                  Headcount &amp; Budget Allocation
                </h1>
                <p className={cx("mt-0.5 max-w-xl text-sm font-normal", TEXT_AUX)}>
                  Quarterly spend across {formatCount(DEPARTMENT_ORDER.length)} departments, sliced by department or by cost type — {quarterLabel}.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Segmented ariaLabel="Group treemap by" options={GROUPINGS} value={grouping} onChange={setGrouping} />
                <Segmented ariaLabel="Quarter" options={QUARTERS} value={quarter} onChange={setQuarter} />
              </div>
            </div>

            <section aria-label="Key metrics" className={cx(CARD, "mt-5 flex flex-wrap divide-zinc-200 p-0 sm:divide-x")}>
              <div className="flex min-w-[220px] flex-1 items-start gap-3 p-4">
                <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-zinc-200 bg-zinc-100">
                  <Wallet size={16} className="text-zinc-700" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className={cx("text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>Total spend</p>
                  <p className={cx("text-xl font-semibold", NUM, TEXT_PRIMARY)}>{formatCurrency(total)}</p>
                  <span className="mt-0.5 flex items-center gap-1.5">
                    <Delta value={totalDeltaPct} />
                    <span className={cx("text-xs font-normal", TEXT_AUX)}>vs {otherQuarterLabel}</span>
                  </span>
                </div>
              </div>

              <div className="flex min-w-[220px] flex-1 items-start gap-3 p-4">
                <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-zinc-200 bg-zinc-100">
                  <Scale size={16} className="text-zinc-700" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className={cx("text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>Budget variance</p>
                  <p className={cx("text-xl font-semibold", NUM, TEXT_PRIMARY)}>{formatSignedPercent(variance)}</p>
                  <span className={cx("mt-0.5 inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-medium", SEVERITY_BADGE[severity])}>
                    {SEVERITY_LABEL[severity]} · was {formatSignedPercent(otherVariance)}
                  </span>
                </div>
              </div>

              <div className="flex min-w-[220px] flex-1 items-start gap-3 p-4">
                <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-zinc-200 bg-zinc-100">
                  <AlertTriangle size={16} className="text-zinc-700" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className={cx("text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>Flagged line items</p>
                  <p className={cx("text-xl font-semibold", NUM, TEXT_PRIMARY)}>{formatCount(flaggedCount)}</p>
                  <span className={cx("text-xs font-normal", TEXT_AUX)}>{formatCount(headcount)} headcount company-wide</span>
                </div>
              </div>
            </section>

            <Card as="section" ariaLabelledBy="treemap-heading" className="mt-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 id="treemap-heading" className={cx("text-sm font-semibold", TEXT_PRIMARY)}>
                  Allocation Treemap
                </h2>
                <p className={cx("text-xs font-normal", TEXT_AUX)}>Area = share of spend. Label and value are always shown as text on every tile.</p>
              </div>
              <div className="mt-3">
                <Treemap grouping={grouping} quarter={quarter} selectedId={grouping === "department" ? selectedDepartmentId : selectedCostTypeId} onSelect={handleTreemapSelect} />
              </div>
            </Card>

            <Card className="mt-5">
              <DetailPanel grouping={grouping} quarter={quarter} selectedDepartmentId={selectedDepartmentId} selectedCostTypeId={selectedCostTypeId} />
            </Card>
          </div>
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={closePalette}
        query={paletteQuery}
        onQueryChange={setPaletteQuery}
        onSelectDepartment={(id) => {
          setGrouping("department");
          setSelectedDepartmentId(id);
        }}
        onSelectCostType={(id) => {
          setGrouping("costType");
          setSelectedCostTypeId(id);
        }}
      />
    </div>
  );
}

function Card({
  children,
  className,
  as = "div",
  ariaLabelledBy,
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section";
  ariaLabelledBy?: string;
}) {
  const Tag = as;
  return (
    <Tag className={cx(CARD, "p-4 sm:p-5", className)} {...(ariaLabelledBy ? { "aria-labelledby": ariaLabelledBy } : {})}>
      {children}
    </Tag>
  );
}
