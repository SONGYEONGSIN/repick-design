// native/src/evolve/r28/c/data.ts — auto-native-r28 candidate c.
//
// Deterministic dummy data + the reconciliation math for a single, already-closed
// shipping-protection claim. Every figure the screen shows (the hero "Approved
// Coverage" number, the per-finding covered amount, the covered subtotal and the
// deductible line) is derived from this one record by the functions below — none
// of it is a separately hand-typed string that merely happens to match.

export type CoverageFindingRuling = "covered" | "partial" | "excluded";

export type CoverageFinding = {
  id: string;
  findingLabel: string;
  causeLabel: string;
  assessedValue: number; // adjuster's estimated repair/replacement cost, USD
  coverageRate: number; // 0..1 — fraction of assessedValue the policy pays
  ruling: CoverageFindingRuling;
  rulingNote: string;
};

export type ShippingProtectionClaim = {
  claimId: string;
  trackingNumber: string;
  carrierName: string;
  filedOnLabel: string;
  resolvedOnLabel: string;
  outcome: "approved" | "partial" | "denied";
  outcomeHeadline: string;
  itemTitle: string;
  itemCategoryLabel: string;
  declaredValue: number;
  deductible: number;
  findings: CoverageFinding[];
  resolutionNote: string;
  payoutMethodLabel: string;
  emailOnFile: string;
  reviewDeskLabel: string;
};

export const CLAIM: ShippingProtectionClaim = {
  claimId: "SPC-20394-7",
  trackingNumber: "GP48217733US",
  carrierName: "GlobalPost Express",
  filedOnLabel: "Sep 14, 2026",
  resolvedOnLabel: "Sep 22, 2026",
  outcome: "partial",
  outcomeHeadline: "Partially Approved",
  itemTitle: "Vintage Leica M6 Camera Body",
  itemCategoryLabel: "Electronics · Cameras",
  declaredValue: 1850,
  deductible: 75,
  findings: [
    {
      id: "find-viewfinder",
      findingLabel: "Shattered viewfinder housing",
      causeLabel: "Transit impact",
      assessedValue: 420,
      coverageRate: 1,
      ruling: "covered",
      rulingNote: "Matches the intake damage photos filed with the claim.",
    },
    {
      id: "find-mount",
      findingLabel: "Lens mount misalignment",
      causeLabel: "Transit impact",
      assessedValue: 260,
      coverageRate: 1,
      ruling: "covered",
      rulingNote: "Consistent with the drop-pattern denting on the outer box.",
    },
    {
      id: "find-shutter",
      findingLabel: "Shutter curtain tension marks",
      causeLabel: "Transit impact (minor)",
      assessedValue: 140,
      coverageRate: 0.5,
      ruling: "partial",
      rulingNote: "Function confirmed intact — rated cosmetic-only at 50%.",
    },
    {
      id: "find-seals",
      findingLabel: "Light seal foam deterioration",
      causeLabel: "Pre-existing wear",
      assessedValue: 90,
      coverageRate: 0,
      ruling: "excluded",
      rulingNote: "Assessed as pre-existing wear, not shipping damage.",
    },
  ],
  resolutionNote:
    "Two findings were fully covered and one was covered at half rate as cosmetic-only transit damage. One finding was excluded as pre-existing wear unrelated to shipping. The standard deductible was then applied to the covered subtotal.",
  payoutMethodLabel: "Refund to original payment method ending •• 4482",
  emailOnFile: "j***n@example.com",
  reviewDeskLabel: "Loss & Damage Review Desk",
};

export const SUPPORT_CONTACT = {
  phoneLabel: "1-800-555-0148",
  emailLabel: "claims-support@repick.example",
  hoursLabel: "Mon–Fri, 8am–7pm ET",
};

/** Rounded dollar amount this one finding pays out, before any deductible. */
export function findingCoveredAmount(finding: CoverageFinding): number {
  return Math.round(finding.assessedValue * finding.coverageRate);
}

/** Sum of every finding's covered amount — the subtotal before the deductible. */
export function sumCoveredSubtotal(claim: ShippingProtectionClaim): number {
  return claim.findings.reduce(
    (total, finding) => total + findingCoveredAmount(finding),
    0,
  );
}

/**
 * The single source of truth for the headline figure: covered subtotal minus
 * the deductible, floored at zero. The breakdown list on screen renders the
 * same per-finding amounts this sums, so the hero number and the itemization
 * underneath it can never drift apart.
 */
export function computeApprovedAmount(claim: ShippingProtectionClaim): number {
  return Math.max(0, sumCoveredSubtotal(claim) - claim.deductible);
}

export function formatUsd(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}
