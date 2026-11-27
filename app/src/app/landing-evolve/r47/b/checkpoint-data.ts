// Fixed checkpoint definitions for the featured listing's verification run. Four checks, in a
// fixed order, each carrying its own AI baseline score — this is the data the Checkpoint Deck,
// the live tally, the value section and the closing CTA all read from, through the pure
// functions in checkpoint-math.ts. Nothing here is random; the AI baseline scores are fixed
// editorial numbers, not computed from anything, so the page renders identically every time
// until a visitor actually confirms or flags a card.

import { Fingerprint, ScanLine, ShieldCheck, Zap, type LucideIcon } from "lucide-react";

export type CheckpointId = "condition" | "authenticity" | "damage" | "functional";
export type CheckpointStatus = "pending" | "confirmed" | "flagged";

export interface CheckpointDef {
  id: CheckpointId;
  label: string;
  Icon: LucideIcon;
  baseScore: number; // the AI's own estimate, 0–100, before any human touches the card
  summary: string; // short, front-face line
  detail: string; // longer, back-face line revealed by the card flip
}

export const CHECKPOINTS: CheckpointDef[] = [
  {
    id: "condition",
    label: "Condition Check",
    Icon: ShieldCheck,
    baseScore: 88,
    summary: "Body and LCD graded under macro photography.",
    detail:
      "Housing, hot shoe and LCD inspected under macro photography for marks, dust ingress and body deformation. No structural flex detected at either grip edge.",
  },
  {
    id: "authenticity",
    label: "Authenticity Check",
    Icon: Fingerprint,
    baseScore: 94,
    summary: "Serial matched against the maker's registry.",
    detail:
      "Serial number cross-matched against Sony's production registry; firmware signature confirms an unmodified, non-grey-market unit built for this region.",
  },
  {
    id: "damage",
    label: "Damage Check",
    Icon: ScanLine,
    baseScore: 81,
    summary: "Sensor and mount scanned for wear.",
    detail:
      "Sensor mapped for dust and micro-scratches at f/16; lens mount checked for play or misalignment against three reference lenses. One faint mark noted inside the viewfinder.",
  },
  {
    id: "functional",
    label: "Functional Test",
    Icon: Zap,
    baseScore: 90,
    summary: "Shutter, AF and buffer tested live.",
    detail:
      "Shutter actuation count read directly from firmware; autofocus tracking, burst buffer depth and both card slots tested live against a moving target.",
  },
];

// Default statuses: condition and authenticity already confirmed, damage and functional still
// pending — exactly 2 of 4, never the full set and never zero. This is the hard rule from the
// brief: the deck must show a real, non-trivial partial trust score and price-range tally at
// first paint, not a blank or fully-resolved state. A reset returns to this exact object, never
// to an empty one.
export const DEFAULT_STATUSES: Record<CheckpointId, CheckpointStatus> = {
  condition: "confirmed",
  authenticity: "confirmed",
  damage: "pending",
  functional: "pending",
};

export const FEATURED_LISTING = {
  title: "Sony a7 IV Body",
  listingCode: "Listing #SA74-0092",
  seller: "Verified seller · 340 sales",
  photoId: "1495121605193-b116b5b09a56",
  alt: "Sony a7 IV mirrorless camera body, the featured listing currently running through the Checkpoint Deck",
};
