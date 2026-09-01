"use client";

import { useState } from "react";

import ClosingCta from "./ClosingCta";
import Hero from "./Hero";
import ProductPreview from "./ProductPreview";
import SocialProof from "./SocialProof";
import ValueSplit from "./ValueSplit";
import { DEFAULT_ACTIVE, LISTINGS, type Active, type CategoryId } from "./data";
import { FOCUS_RING } from "./ui";

const monoFont = { fontFamily: "var(--font-display-mono)" };

export default function AssayLanding() {
  const [active, setActive] = useState<Active>(DEFAULT_ACTIVE);
  const [selectedId, setSelectedId] = useState<string>(LISTINGS[0].id);

  const toggle = (id: CategoryId) => {
    setActive((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      const anyOn = Object.values(next).some(Boolean);
      return anyOn ? next : prev;
    });
  };

  return (
    <main className="min-h-screen bg-[#0B0B0F] text-white">
      <SiteHeader />
      <Hero active={active} onToggle={toggle} selectedId={selectedId} onSelect={setSelectedId} />
      <ProductPreview active={active} selectedId={selectedId} onSelect={setSelectedId} />
      <ValueSplit active={active} />
      <SocialProof />
      <ClosingCta active={active} />
    </main>
  );
}

function SiteHeader() {
  return (
    <header className="border-b border-zinc-800/80 px-6 py-5 sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between">
        <span className="text-[15px] font-extrabold tracking-tight text-white" style={monoFont}>
          ASSAY
        </span>
        <a
          href="#pipeline"
          className={`rounded-full border border-zinc-700 px-4 py-2 text-[13px] font-semibold text-zinc-100 transition-colors hover:border-amber-700 hover:text-white ${FOCUS_RING}`}
        >
          See the pipeline
        </a>
      </div>
    </header>
  );
}
