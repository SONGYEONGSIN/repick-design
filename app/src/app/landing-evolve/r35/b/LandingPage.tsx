"use client";

import { useState } from "react";
import { getListing, type ListingId } from "./data";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { ValueSplit } from "./ValueSplit";
import { SocialProof } from "./SocialProof";
import { ClosingCta } from "./ClosingCta";

export function LandingPage() {
  // Lifted duel state: selected here so the SAME selection drives the hero
  // device, the value-split summary sentence, and the closing CTA's button
  // label — the manipulated state survives all the way to the close.
  const [aId, setAId] = useState<ListingId>("sneaker");
  const [bId, setBId] = useState<ListingId>("camera");

  function handleSelectA(id: ListingId) {
    if (id === bId) setBId(aId);
    setAId(id);
  }

  function handleSelectB(id: ListingId) {
    if (id === aId) setAId(bId);
    setBId(id);
  }

  function handleAddToDuel(id: ListingId) {
    if (id === aId || id === bId) return;
    setBId(id);
  }

  const a = getListing(aId);
  const b = getListing(bId);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-rose-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content">
        <Hero
          aId={aId}
          bId={bId}
          a={a}
          b={b}
          onSelectA={handleSelectA}
          onSelectB={handleSelectB}
          onAddToDuel={handleAddToDuel}
        />
        <ValueSplit a={a} b={b} />
        <SocialProof />
        <ClosingCta a={a} b={b} />
      </main>
    </>
  );
}
