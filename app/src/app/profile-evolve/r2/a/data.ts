// Deterministic content only — no Math.random, no Date.now, no `new Date()`. Every date on the page
// is a fixed display string paired with a hand-assigned numeric sort key (YYYYMM), so "Newest first"
// and "Oldest first" sorting never touches the Date constructor.

export type Severity = "critical" | "high" | "medium" | "low";
export type ScopeType = "Smart Contract" | "Bridge" | "L2 Rollup" | "Wallet Infrastructure" | "Oracle Feed";
export type Outcome = "Resolved" | "Monitoring" | "Disclosed";

export interface FindingCounts {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface CaseEntry {
  id: string;
  title: string;
  client: string;
  scope: ScopeType;
  dateLabel: string;
  sortKey: number;
  outcome: Outcome;
  summary: string;
  findings: FindingCounts;
}

const SEVERITY_RANK: Severity[] = ["critical", "high", "medium", "low"];

/** Highest-severity finding present in a case, derived from real counts — never hand-duplicated. */
export function topSeverity(findings: FindingCounts): Severity {
  for (const level of SEVERITY_RANK) {
    if (findings[level] > 0) return level;
  }
  return "low";
}

export function totalFindings(findings: FindingCounts): number {
  return findings.critical + findings.high + findings.medium + findings.low;
}

export const PROFILE = {
  name: "Imogen Castellane",
  title: "Independent Protocol Security Auditor",
  practice: "Keel & Ballast Audits",
  location: "Lisbon, Portugal",
  remoteNote: "Remote engagements worldwide",
  availability: "Booking new engagements for Q4 2026",
  memberSince: "2019",
  bio: "I review smart contracts, bridges, and rollup infrastructure before they hold real value — line-by-line, with a written report a non-auditor engineering team can act on. Every finding below is logged the day it closes, not batched at quarter end.",
  methodology: [
    "Manual review first — static analyzers run second, as a net, not the primary tool.",
    "Every finding gets a reproduction script before it's reported.",
    "Fix verification is a separate, re-billed pass — never rubber-stamped from the same review.",
  ],
};

export const STATS = {
  rating: 4.9,
  ratingCount: 96,
  engagementsCompleted: 128,
  vulnerabilitiesResolved: 341,
  activeSince: "2019",
};

export const SCOPE_TYPES: ScopeType[] = ["Smart Contract", "Bridge", "L2 Rollup", "Wallet Infrastructure", "Oracle Feed"];

export const TRACK_RECORD: { scope: ScopeType; engagements: number; criticalFindings: number }[] = [
  { scope: "Smart Contract", engagements: 52, criticalFindings: 61 },
  { scope: "Bridge", engagements: 24, criticalFindings: 38 },
  { scope: "L2 Rollup", engagements: 21, criticalFindings: 45 },
  { scope: "Wallet Infrastructure", engagements: 16, criticalFindings: 12 },
  { scope: "Oracle Feed", engagements: 15, criticalFindings: 8 },
];

export const CASES: CaseEntry[] = [
  {
    id: "c10",
    title: "Yield Aggregator Vault Review",
    client: "DeFi Lending Protocol — NDA client",
    scope: "Smart Contract",
    dateLabel: "Mar 2026",
    sortKey: 202603,
    outcome: "Resolved",
    summary:
      "Full review of the vault's share-price accounting ahead of a strategy migration. A rounding path in the withdrawal queue could have let a late withdrawer capture value from users still queued.",
    findings: { critical: 1, high: 2, medium: 3, low: 4 },
  },
  {
    id: "c9",
    title: "Cross-Chain Settlement Bridge Audit",
    client: "Cross-chain Bridge — NDA client",
    scope: "Bridge",
    dateLabel: "Jan 2026",
    sortKey: 202601,
    outcome: "Monitoring",
    summary:
      "Reviewed the relayer's message-replay guard across three chains. One high-severity finding is fixed in a staged contract; monitoring the mainnet rollout before final close-out.",
    findings: { critical: 0, high: 1, medium: 2, low: 2 },
  },
  {
    id: "c8",
    title: "Price Oracle Aggregation Review",
    client: "Perp Exchange — NDA client",
    scope: "Oracle Feed",
    dateLabel: "Nov 2025",
    sortKey: 202511,
    outcome: "Resolved",
    summary:
      "Checked the median-of-five aggregator against feed-outage and stale-price scenarios. A medium-severity gap in the staleness window was closed before mainnet launch.",
    findings: { critical: 0, high: 0, medium: 1, low: 3 },
  },
  {
    id: "c7",
    title: "Multisig Wallet Firmware Review",
    client: "Custody Provider — NDA client",
    scope: "Wallet Infrastructure",
    dateLabel: "Aug 2025",
    sortKey: 202508,
    outcome: "Resolved",
    summary: "Firmware-level review of the signing path for a hardware-backed multisig. No severity above low.",
    findings: { critical: 0, high: 0, medium: 0, low: 2 },
  },
  {
    id: "c6",
    title: "Optimistic Rollup Fraud-Proof Audit",
    client: "L2 Rollup Team — NDA client",
    scope: "L2 Rollup",
    dateLabel: "Jun 2025",
    sortKey: 202506,
    outcome: "Disclosed",
    summary:
      "Audited the fraud-proof window and challenge-bond accounting. Two critical findings — a bond-slashing bypass and a challenge-window desync — were disclosed publicly after a 90-day coordinated fix window.",
    findings: { critical: 2, high: 1, medium: 1, low: 1 },
  },
  {
    id: "c5",
    title: "Lending Pool V2 Upgrade Review",
    client: "DeFi Lending Protocol — NDA client",
    scope: "Smart Contract",
    dateLabel: "Mar 2025",
    sortKey: 202503,
    outcome: "Resolved",
    summary: "Diff review of the interest-rate model upgrade against the audited V1 baseline.",
    findings: { critical: 0, high: 2, medium: 2, low: 3 },
  },
  {
    id: "c4",
    title: "Token Wrapper Bridge Review",
    client: "Wrapped-Asset Issuer — NDA client",
    scope: "Bridge",
    dateLabel: "Dec 2024",
    sortKey: 202412,
    outcome: "Resolved",
    summary: "Reviewed the lock-and-mint invariant across the wrapper's pause and emergency-withdraw paths.",
    findings: { critical: 0, high: 0, medium: 2, low: 1 },
  },
  {
    id: "c3",
    title: "Volatility Index Oracle Audit",
    client: "Options Protocol — NDA client",
    scope: "Oracle Feed",
    dateLabel: "Sep 2024",
    sortKey: 202409,
    outcome: "Resolved",
    summary: "Reviewed the on-chain volatility index calculation for manipulation resistance around expiry.",
    findings: { critical: 0, high: 0, medium: 0, low: 1 },
  },
  {
    id: "c2",
    title: "Hardware Wallet Signing Path Review",
    client: "Custody Provider — NDA client",
    scope: "Wallet Infrastructure",
    dateLabel: "Apr 2024",
    sortKey: 202404,
    outcome: "Resolved",
    summary: "Reviewed the transaction-display and signing confirmation path for blind-signing risk.",
    findings: { critical: 0, high: 1, medium: 1, low: 2 },
  },
  {
    id: "c1",
    title: "ZK-Rollup Circuit Constraint Audit",
    client: "L2 Rollup Team — NDA client",
    scope: "L2 Rollup",
    dateLabel: "Jan 2024",
    sortKey: 202401,
    outcome: "Resolved",
    summary: "Reviewed the withdrawal circuit's under-constrained signal, which could have allowed a forged proof.",
    findings: { critical: 1, high: 0, medium: 1, low: 1 },
  },
];

export function formatCount(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}
