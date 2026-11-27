/**
 * Deterministic demo data for the Support Ticket Resolution Health console.
 *
 * No Math.random / Date.now / new Date() anywhere. All "time ago" values are plain minute
 * offsets from a fixed reference instant (REFERENCE_NOW_MS); format.ts turns those into
 * Intl.RelativeTimeFormat strings and Intl.DateTimeFormat strings purely from numbers.
 *
 * TICKETS is the single source of truth. Every derived number shown anywhere on the page
 * (box-plot five-number summaries, per-team median/breach counts, KPI tiles, the detail
 * panel, the breach log) is computed FROM this one array by the selectors in stats.ts —
 * never re-typed as a second hardcoded number.
 */

import { SLA_THRESHOLD_HOURS } from "./tokens";

export const REFERENCE_NOW_MS = 1731000000000;

export type TeamId = "billing" | "technical" | "shipping" | "trust-safety" | "listings";

export const TEAMS: { id: TeamId; name: string; short: string }[] = [
  { id: "billing", name: "Billing", short: "Billing" },
  { id: "technical", name: "Technical", short: "Technical" },
  { id: "shipping", name: "Shipping & Logistics", short: "Shipping" },
  { id: "trust-safety", name: "Trust & Safety", short: "Trust & Safety" },
  { id: "listings", name: "Listings & Catalog", short: "Listings" },
];

export function teamName(id: TeamId): string {
  return TEAMS.find((t) => t.id === id)?.name ?? id;
}

export type AgentId = "mina-cho" | "theo-park" | "ava-reyes" | "noah-kim" | "lucia-haines" | "sam-okafor";

export const AGENTS: { id: AgentId; name: string; role: string; photoId: string }[] = [
  { id: "mina-cho", name: "Mina Cho", role: "Billing Specialist", photoId: "1494790108377-be9c29b29330" },
  { id: "theo-park", name: "Theo Park", role: "Technical Support", photoId: "1507003211169-0a1dd7228f2d" },
  { id: "ava-reyes", name: "Ava Reyes", role: "Logistics Coordinator", photoId: "1544005313-94ddf0286df2" },
  { id: "noah-kim", name: "Noah Kim", role: "Trust & Safety Analyst", photoId: "1500648767791-00dcc994a43e" },
  { id: "lucia-haines", name: "Lucia Haines", role: "Catalog Specialist", photoId: "1438761681033-6461ffad8d80" },
  { id: "sam-okafor", name: "Sam Okafor", role: "Escalations Lead", photoId: "1499996860823-5214fcc65f8f" },
];

export function agentById(id: AgentId) {
  return AGENTS.find((a) => a.id === id)!;
}

export function avatarUrl(id: AgentId): string {
  return `https://images.unsplash.com/photo-${agentById(id).photoId}?auto=format&fit=crop&w=96&h=96&q=80`;
}

export type TicketStatus = "resolved" | "breached" | "escalated";

export type Ticket =
  | {
      id: string;
      team: TeamId;
      subject: string;
      customer: string;
      agentId: AgentId;
      offsetMinutes: number;
      kind: "resolved";
      resolutionHours: number;
    }
  | {
      id: string;
      team: TeamId;
      subject: string;
      customer: string;
      agentId: AgentId;
      offsetMinutes: number;
      kind: "escalated";
      elapsedHours: number;
    };

/** Single derivation point — every badge, KPI and breach count reads status through this. */
export function ticketStatus(t: Ticket): TicketStatus {
  if (t.kind === "escalated") return "escalated";
  return t.resolutionHours > SLA_THRESHOLD_HOURS ? "breached" : "resolved";
}

const CUSTOMERS = [
  "Grace Liu", "Marcus Webb", "Priya Nandan", "Oliver Finch", "Dana Kowalski",
  "Ezra Tan", "Renata Silva", "Jonah Pruitt", "Sofia Marchetti", "Kwame Asante",
  "Hana Vogel", "Leo Abara", "Nadia Hollis", "Tobias Lindqvist", "Camille Dupree",
  "Rafael Ortiz", "Ingrid Solberg", "Malik Johansen", "Yuki Morimoto", "Esme Caldwell",
];

type TeamDef = {
  id: TeamId;
  agentId: AgentId;
  resolved: { hours: number; subject: string }[];
  escalated: { elapsed: number; subject: string }[];
};

const TEAM_DEFS: TeamDef[] = [
  {
    id: "billing",
    agentId: "mina-cho",
    resolved: [
      { hours: 2.1, subject: "Duplicate charge on order #48213" },
      { hours: 3.4, subject: "Payment method declined at checkout" },
      { hours: 4.0, subject: "Promo code not applying" },
      { hours: 4.8, subject: "Sales tax calculated incorrectly" },
      { hours: 5.9, subject: "Invoice mismatch for seller payout" },
      { hours: 6.3, subject: "Currency conversion discrepancy" },
      { hours: 7.8, subject: "Subscription renewal billed twice" },
      { hours: 8.5, subject: "Refund not reflected in wallet" },
      { hours: 9.9, subject: "Payout held for verification review" },
      { hours: 26.4, subject: "Chargeback dispute follow-up delayed" },
    ],
    escalated: [
      { elapsed: 18.5, subject: "Refund escalated to finance team" },
      { elapsed: 27.0, subject: "Payout dispute awaiting seller response" },
    ],
  },
  {
    id: "technical",
    agentId: "theo-park",
    resolved: [
      { hours: 5.1, subject: "Push notifications not received" },
      { hours: 6.8, subject: "Dark mode layout glitch on listing page" },
      { hours: 9.4, subject: "Barcode scanner misreads SKU" },
      { hours: 10.2, subject: "Search results not updating after edit" },
      { hours: 12.8, subject: "Login loop on password reset" },
      { hours: 14.0, subject: "Listing editor freezes on save" },
      { hours: 15.9, subject: "Sync delay between web and app" },
      { hours: 18.2, subject: "Photos fail to upload from mobile" },
      { hours: 22.7, subject: "API webhook delivery failing intermittently" },
      { hours: 38.6, subject: "App crashes on listing upload" },
    ],
    escalated: [
      { elapsed: 9.0, subject: "Critical outage on checkout flow" },
      { elapsed: 31.5, subject: "Data sync escalated to platform team" },
    ],
  },
  {
    id: "shipping",
    agentId: "ava-reyes",
    resolved: [
      { hours: 1.8, subject: "Wrong shipping rate applied" },
      { hours: 2.6, subject: "Tracking number invalid" },
      { hours: 3.5, subject: "Delivery address correction needed" },
      { hours: 4.9, subject: "Return label expired before use" },
      { hours: 5.6, subject: "Label generation failed for bulky item" },
      { hours: 6.4, subject: "Freight quote mismatch" },
      { hours: 7.2, subject: "International customs delay, minor" },
      { hours: 8.1, subject: "Carrier pickup never arrived" },
      { hours: 9.8, subject: "Lost parcel claim follow-up" },
      { hours: 27.5, subject: "Package marked delivered but missing" },
    ],
    escalated: [
      { elapsed: 14.0, subject: "High-value parcel escalated to carrier liaison" },
      { elapsed: 22.0, subject: "Customs clearance stuck, escalated" },
    ],
  },
  {
    id: "trust-safety",
    agentId: "noah-kim",
    resolved: [
      { hours: 6.2, subject: "Listing photos reused from stock" },
      { hours: 8.1, subject: "Identity verification stuck in queue" },
      { hours: 9.7, subject: "Prohibited item listed, needs removal" },
      { hours: 11.4, subject: "Account takeover suspected, locked" },
      { hours: 13.0, subject: "Harassment report between users" },
      { hours: 14.8, subject: "Repeat dispute pattern on seller" },
      { hours: 16.5, subject: "Seller account flagged for review" },
      { hours: 21.2, subject: "Fraudulent return request" },
      { hours: 29.8, subject: "Counterfeit item reported" },
      { hours: 42.1, subject: "Suspicious buyer requesting off-platform payment" },
    ],
    escalated: [
      { elapsed: 20.0, subject: "Repeat fraud pattern escalated to risk team" },
      { elapsed: 36.0, subject: "Identity verification escalated to compliance" },
    ],
  },
  {
    id: "listings",
    agentId: "lucia-haines",
    resolved: [
      { hours: 1.2, subject: "Photo order not saving" },
      { hours: 1.9, subject: "Attribute field validation error" },
      { hours: 2.4, subject: "Price suggestion out of range" },
      { hours: 2.9, subject: "Listing stuck in draft" },
      { hours: 3.3, subject: "Brand field locked incorrectly" },
      { hours: 3.8, subject: "Condition grade dispute" },
      { hours: 4.7, subject: "Duplicate listing needs merge" },
      { hours: 5.3, subject: "Size chart missing for shoes" },
      { hours: 7.4, subject: "Category mismatch on vintage item" },
      { hours: 16.8, subject: "Listing delisted without reason shown" },
    ],
    escalated: [
      { elapsed: 6.5, subject: "Bulk mislisting escalated to catalog ops" },
      { elapsed: 19.0, subject: "Brand dispute escalated to legal" },
    ],
  },
];

// 60 strictly-increasing minute offsets (~3.9 days of activity), computed once by a closed
// form (6 + 8i + 1.5*i*(i-1)) rather than hand-typed or randomised.
const OFFSETS: number[] = Array.from({ length: 60 }, (_, i) => 6 + 8 * i + 1.5 * i * (i - 1));

// occurrence -> which slot in a team's queue it draws from.
const RESOLVED_INDEX_BY_OCCURRENCE: Record<number, number> = { 0: 0, 1: 1, 3: 2, 4: 3, 5: 4, 7: 5, 8: 6, 9: 7, 10: 8, 11: 9 };
const ESCALATED_INDEX_BY_OCCURRENCE: Record<number, number> = { 2: 0, 6: 1 };

function buildTickets(): Ticket[] {
  const tickets: Ticket[] = [];
  let slot = 0;
  for (let occurrence = 0; occurrence < 12; occurrence++) {
    for (const team of TEAM_DEFS) {
      const offsetMinutes = OFFSETS[slot];
      const customer = CUSTOMERS[slot % CUSTOMERS.length];
      if (occurrence === 2 || occurrence === 6) {
        const idx = ESCALATED_INDEX_BY_OCCURRENCE[occurrence];
        const entry = team.escalated[idx];
        tickets.push({
          id: `t${slot + 1}`,
          team: team.id,
          subject: entry.subject,
          customer,
          agentId: "sam-okafor",
          offsetMinutes,
          kind: "escalated",
          elapsedHours: entry.elapsed,
        });
      } else {
        const idx = RESOLVED_INDEX_BY_OCCURRENCE[occurrence];
        const entry = team.resolved[idx];
        tickets.push({
          id: `t${slot + 1}`,
          team: team.id,
          subject: entry.subject,
          customer,
          agentId: team.agentId,
          offsetMinutes,
          kind: "resolved",
          resolutionHours: entry.hours,
        });
      }
      slot++;
    }
  }
  return tickets;
}

/** Sorted most-recent-first by construction (OFFSETS is ascending). Single source of truth. */
export const TICKETS: Ticket[] = buildTickets();
