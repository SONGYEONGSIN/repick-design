// Static content for the Northline "About" page. Nothing here is computed at runtime — every
// figure, date and label is a hardcoded literal so the route stays hydration-deterministic
// (no Math.random / Date.now / new Date anywhere in this route).

export type ProcessStep = {
  id: string;
  index: number;
  title: string;
  summary: string;
  story: string;
};

export const processSteps: ProcessStep[] = [
  {
    id: "source",
    index: 0,
    title: "Source",
    summary:
      "We scout and shortlist independent manufacturers against a buyer's category, volume and certification needs.",
    story:
      "Sourcing starts with a brief, not a browse. A buyer tells us the category, target unit cost, minimum order quantity and any certifications the finished good must carry. Our sourcing team cross-references that brief against a standing roster of manufacturers already on the platform and, where the roster has a gap, opens outreach to new facilities in the relevant region. Every shortlist that comes back is capped at five candidates, deliberately short, so the buyer is comparing real options rather than drowning in near-duplicates.",
  },
  {
    id: "verify",
    index: 1,
    title: "Verify",
    summary:
      "Independent auditors inspect facilities, review certifications and test production samples before a supplier is listed.",
    story:
      "Verification is the step buyers actually pay us for. A third-party auditor — never someone on Northline's payroll — visits the facility in person, checks labor and safety conditions against local law, confirms the certifications on file are current and not just scanned once at onboarding, and pulls a production sample for independent lab testing. A supplier that fails any one of those three checks does not get listed, full stop, and existing suppliers are re-audited on a fixed eighteen-month cycle rather than only at intake.",
  },
  {
    id: "match",
    index: 2,
    title: "Match",
    summary:
      "Buyers review verified supplier profiles side by side and lock in terms, pricing and production capacity.",
    story:
      "Once a shortlist clears verification, the buyer sees full profiles side by side: audit summary, sample test results, current capacity, lead time and landed-cost estimate. There is no bidding war and no hidden supplier fee — pricing is negotiated directly between buyer and manufacturer, and Northline's cut is a flat platform fee disclosed up front. A match is only considered locked once both sides have signed the same production terms sheet.",
  },
  {
    id: "ship",
    index: 3,
    title: "Ship",
    summary:
      "We coordinate logistics, customs paperwork and delivery tracking through to the buyer's dock.",
    story:
      "Shipping is where most sourcing relationships quietly fall apart, so it is the step we instrumented first. Every order gets a logistics coordinator, a single customs document checklist shared with both sides, and a tracking link that updates from factory gate to buyer dock rather than stopping at the port. If a shipment is running late, the buyer hears it from us before the ship date passes, not after.",
  },
];

export type ImpactStat = {
  label: string;
  value: string;
};

export const impactStats: ImpactStat[] = [
  { label: "Verified manufacturers", value: "4,200+" },
  { label: "Countries audited", value: "68" },
  { label: "Facility audits completed", value: "190,000+" },
  { label: "On-time delivery rate", value: "99.3%" },
];

export const partnerLogos: string[] = [
  "GRANFIELD",
  "OSPREY RETAIL",
  "COOPER & VANE",
  "TIDEWORKS",
  "HALCYON GOODS",
  "HARLOW MARKET",
  "REDSTONE MFG",
  "PORTAGE & CO",
];
