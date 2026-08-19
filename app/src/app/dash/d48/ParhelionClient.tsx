"use client";

import { useEffect, useState } from "react";
import ComparePicker from "./ComparePicker";
import ComparisonTable from "./ComparisonTable";
import CommandPalette from "./CommandPalette";
import RegionPanel from "./RegionPanel";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import type { MetricId, RegionId } from "./data";
import { REGION_BY_ID } from "./data";
import { APP_BG, cx } from "./tokens";

const DEFAULT_A: RegionId = "ashfield";
const DEFAULT_B: RegionId = "cinder-bay";

export default function ParhelionClient() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [regionAId, setRegionAId] = useState<RegionId>(DEFAULT_A);
  const [regionBId, setRegionBId] = useState<RegionId>(DEFAULT_B);
  const [focusMetric, setFocusMetric] = useState<MetricId>("latency");
  /** Shared crosshair index — hovering or focusing either panel's chart moves both, so the same
   *  hour reads on both sides of the comparison at once. Null = no active crosshair. */
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

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

  const regionA = REGION_BY_ID[regionAId];
  const regionB = REGION_BY_ID[regionBId];

  function selectPair(a: RegionId, b: RegionId) {
    setRegionAId(a);
    setRegionBId(b);
  }

  function swap() {
    setRegionAId(regionBId);
    setRegionBId(regionAId);
  }

  /** Palette search can name any region for slot A — if it matches the current slot B, swap B to
   *  the previous A instead of letting both slots collapse onto the same region. */
  function selectRegionA(id: RegionId) {
    if (id === regionBId) {
      setRegionBId(regionAId);
    }
    setRegionAId(id);
  }

  return (
    <div className={cx("flex min-h-dvh", APP_BG)}>
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          <ComparePicker
            regionA={regionA}
            regionB={regionB}
            onChangeA={setRegionAId}
            onChangeB={setRegionBId}
            onSwap={swap}
            focusMetric={focusMetric}
            onChangeFocusMetric={setFocusMetric}
          />

          <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2">
            <RegionPanel slot="a" region={regionA} focusMetric={focusMetric} activeIndex={hoverIndex} onActiveIndexChange={setHoverIndex} />
            <RegionPanel slot="b" region={regionB} focusMetric={focusMetric} activeIndex={hoverIndex} onActiveIndexChange={setHoverIndex} />
          </div>

          <ComparisonTable regionA={regionA} regionB={regionB} />
        </main>
      </div>

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} onSelectPair={selectPair} onSelectRegionA={selectRegionA} /> : null}
    </div>
  );
}
