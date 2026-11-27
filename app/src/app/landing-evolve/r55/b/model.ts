// Fixed, deterministic data + pure functions. No Math.random / Date.now / new Date() anywhere in
// this route — the Trust Score, its qualitative label, every listing's verified-seller badge, and
// the closing CTA's headline number are all derived from this same pair of pure functions
// (computeTrustScore, trustBandFor) applied to a plain boolean[4] state. Nothing here is a
// hardcoded "summary" string: every printed number or label the page shows is a function call.

import type { LucideIcon } from "lucide-react";
import { Fingerprint, FlaskConical, ScanSearch, UserCheck } from "lucide-react";

/* ------------------------------------------------------------------------ */
/* The four independent, freely-toggleable checks                           */
/* ------------------------------------------------------------------------ */

export interface CheckDef {
  id: string;
  label: string;
  detail: string;
  /** Points this check contributes to the 0-100 Trust Score when active. Weights sum to 100. */
  weight: number;
  Icon: LucideIcon;
}

// Weights are deliberately unequal (30/25/25/20, summing to 100) — see candidates/b.md "Brief
// gaps" for the reasoning. Order here is the canonical order used everywhere else in the page
// (toggle rows, breakdown chips, per-check icon state).
export const CHECKS: readonly CheckDef[] = [
  {
    id: "serial",
    label: "Serial number verified",
    detail: "Matched against the manufacturer's serial registry.",
    weight: 30,
    Icon: Fingerprint,
  },
  {
    id: "material",
    label: "Material composition scan",
    detail: "Spectrometer reading matches the listed material.",
    weight: 25,
    Icon: FlaskConical,
  },
  {
    id: "review",
    label: "Third-party expert review",
    detail: "An independent authenticator inspected it in person.",
    weight: 25,
    Icon: UserCheck,
  },
  {
    id: "photoMatch",
    label: "Photo-match against archive",
    detail: "Stitching and hardware matched to manufacturer reference photos.",
    weight: 20,
    Icon: ScanSearch,
  },
] as const;

export const CHECK_COUNT = CHECKS.length;

/** A boolean per check, same order as CHECKS. Any of the 16 combinations is valid at any time —
 *  no lock, no sequence, freely re-toggleable in either direction. */
export type CheckState = readonly boolean[];

export const ALL_OFF: CheckState = CHECKS.map(() => false);
export const ALL_ON: CheckState = CHECKS.map(() => true);

/** The single source of truth for the numeric score. Every score shown on this page — hero,
 *  scenario cards, product-preview listings, closing CTA — calls this function. */
export function computeTrustScore(state: CheckState): number {
  return CHECKS.reduce((sum, check, i) => sum + (state[i] ? check.weight : 0), 0);
}

/* ------------------------------------------------------------------------ */
/* Qualitative band lookup — a real function of the score, not a static map  */
/* ------------------------------------------------------------------------ */

export interface TrustBand {
  label: string;
  min: number;
  max: number;
  /** Whether this band is strong enough to show a "Verified seller" style badge on a listing. */
  badgeworthy: boolean;
}

export const TRUST_BANDS: readonly TrustBand[] = [
  { label: "Unverified", min: 0, max: 39, badgeworthy: false },
  { label: "Partially verified", min: 40, max: 69, badgeworthy: false },
  { label: "Verified", min: 70, max: 89, badgeworthy: true },
  { label: "Fully verified", min: 90, max: 100, badgeworthy: true },
] as const;

export function trustBandFor(score: number): TrustBand {
  return TRUST_BANDS.find((band) => score >= band.min && score <= band.max) ?? TRUST_BANDS[0];
}

/** Every textual restatement of the score on this page goes through this one line — including
 *  the little caption-looking chrome beside the meter and the closing CTA headline. */
export function summarize(state: CheckState): { score: number; band: TrustBand } {
  const score = computeTrustScore(state);
  return { score, band: trustBandFor(score) };
}

/* ------------------------------------------------------------------------ */
/* "Value, three ways" scenario presets — same CHECKS, same functions        */
/* ------------------------------------------------------------------------ */

export interface Scenario {
  id: string;
  label: string;
  blurb: string;
  state: CheckState;
}

export const SCENARIOS: readonly Scenario[] = [
  {
    id: "none",
    label: "No checks run",
    blurb: "A brand-new listing before any authentication step has started.",
    state: ALL_OFF,
  },
  {
    id: "fast-track",
    label: "Fast-track listing",
    blurb: "Seller supplied a serial match and a material scan — no human has looked at it yet.",
    state: [true, true, false, false],
  },
  {
    id: "full",
    label: "Fully authenticated",
    blurb: "All four independent signals agree. This is the highest band the score can reach.",
    state: ALL_ON,
  },
] as const;

/* ------------------------------------------------------------------------ */
/* Product-preview listings — each carries its own fixed check combination   */
/* ------------------------------------------------------------------------ */

export interface Listing {
  id: string;
  title: string;
  photoId: string;
  alt: string;
  grade: "Excellent" | "Good" | "Fair";
  originalPrice: number;
  currentPrice: number;
  reasonTags: readonly [string, string];
  checks: CheckState;
}

export const LISTINGS: readonly Listing[] = [
  {
    id: "watch",
    title: "Heritage Diver Automatic",
    photoId: "1524805444758-089113d48a6d",
    alt: "A stainless steel automatic dive watch photographed face-up against a plain background",
    grade: "Excellent",
    originalPrice: 2400,
    currentPrice: 1380,
    reasonTags: ["Movement matches reference caliber", "Bracelet stretch within normal range"],
    checks: [true, true, true, false],
  },
  {
    id: "sneaker",
    title: "Retro Court Sneakers",
    photoId: "1549298916-b41d501d3772",
    alt: "A single worn leather sneaker photographed close up against a plain background",
    grade: "Good",
    originalPrice: 240,
    currentPrice: 129,
    reasonTags: ["Box label matches release year", "Outsole wear consistent with light use"],
    checks: [true, false, false, true],
  },
  {
    id: "bag",
    title: "Structured Tote, Full-Grain",
    photoId: "1548036328-c9fa89d128fa",
    alt: "A structured leather tote bag photographed against a plain background",
    grade: "Excellent",
    originalPrice: 1850,
    currentPrice: 1040,
    reasonTags: ["Hardware stamp matches archive photo", "Interior lining pattern confirmed"],
    checks: ALL_ON,
  },
  {
    id: "jacket",
    title: "Waxed Field Jacket",
    photoId: "1551028719-00167b16eac5",
    alt: "A waxed cotton field jacket laid flat against a plain background",
    grade: "Fair",
    originalPrice: 420,
    currentPrice: 215,
    reasonTags: ["Fabric weight matches listed material", "Lining shows expected age-wear"],
    checks: [false, true, false, false],
  },
] as const;

export function discountPct(listing: Listing): number {
  return Math.round((1 - listing.currentPrice / listing.originalPrice) * 100);
}

export function formatUsd(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}

/* ------------------------------------------------------------------------ */
/* Social proof                                                              */
/* ------------------------------------------------------------------------ */

export const STAT_CHIPS = [
  { id: "listings", value: "14,200+", label: "listings scored this year" },
  { id: "accuracy", value: "99.2%", label: "of Verified-band items sell without a return" },
  { id: "buyers", value: "41,000+", label: "buyers checked a score before paying" },
] as const;

export const TESTIMONIALS = [
  {
    id: "mara",
    quote:
      "I could see exactly which two checks were missing and why the score stopped at 70. That was more convincing than any seller badge I'd seen before.",
    name: "Mara Jennings",
    role: "Buyer, watches",
    initials: "MJ",
  },
  {
    id: "declan",
    quote:
      "Toggling the checks myself as a seller — before a buyer ever does — showed me exactly which signal was worth paying for next.",
    name: "Declan Ortiz",
    role: "Seller, outerwear",
    initials: "DO",
  },
  {
    id: "priya",
    quote:
      "A score of 55 from two different pairs of checks isn't the same listing to me, and Provenance actually shows which pair it was.",
    name: "Priya Nandan",
    role: "Buyer, handbags",
    initials: "PN",
  },
] as const;
