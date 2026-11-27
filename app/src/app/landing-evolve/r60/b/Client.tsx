"use client";

import { useState } from "react";
import { ClosingCta } from "./ClosingCta";
import { Hero } from "./Hero";
import { ProductPreview } from "./ProductPreview";
import { Reveal } from "./Reveal";
import { SocialProof } from "./SocialProof";
import { BG, BORDER } from "./tokens";
import type { DeviceType } from "./tree";
import { ValueSplit } from "./ValueSplit";

/**
 * Single source of truth for the Triage Tree's three input axes (`deviceType`, `conditionId`,
 * `urgent`) — lifted to the page root so the Hero's device, the Value Split's full mirror and
 * lookup table, and the closing CTA all read the SAME path instead of maintaining independent
 * copies that could drift apart. Defaults to a non-trivial resolved path (phone, weak battery)
 * rather than an empty tree, so the hero fold always shows a real verdict on first load.
 */
export default function Client() {
  const [deviceType, setDeviceType] = useState<DeviceType | null>("phone");
  const [conditionId, setConditionId] = useState<string | null>("weak");
  const [urgent, setUrgent] = useState<boolean>(false);

  const onSetDevice = (d: DeviceType) => {
    setDeviceType((prev) => {
      if (prev !== d) setConditionId(null);
      return d;
    });
  };
  const onSetCondition = (c: string) => setConditionId(c);
  const onClearCondition = () => setConditionId(null);
  const onClearDevice = () => {
    setDeviceType(null);
    setConditionId(null);
  };
  const onToggleUrgent = () => setUrgent((prev) => !prev);

  return (
    <main className="min-h-dvh" style={{ backgroundColor: BG }}>
      <Hero
        deviceType={deviceType}
        conditionId={conditionId}
        urgent={urgent}
        onSetDevice={onSetDevice}
        onSetCondition={onSetCondition}
        onClearCondition={onClearCondition}
        onClearDevice={onClearDevice}
        onToggleUrgent={onToggleUrgent}
      />

      <div style={{ borderTop: `1px solid ${BORDER}` }}>
        <Reveal>
          <ProductPreview />
        </Reveal>
      </div>

      <div style={{ borderTop: `1px solid ${BORDER}` }}>
        <Reveal>
          <ValueSplit
            deviceType={deviceType}
            conditionId={conditionId}
            urgent={urgent}
            onSetDevice={onSetDevice}
            onSetCondition={onSetCondition}
            onClearCondition={onClearCondition}
            onClearDevice={onClearDevice}
            onToggleUrgent={onToggleUrgent}
          />
        </Reveal>
      </div>

      <div style={{ borderTop: `1px solid ${BORDER}` }}>
        <Reveal>
          <SocialProof />
        </Reveal>
      </div>

      <div style={{ borderTop: `1px solid ${BORDER}` }}>
        <Reveal>
          <ClosingCta deviceType={deviceType} conditionId={conditionId} urgent={urgent} />
        </Reveal>
      </div>
    </main>
  );
}
