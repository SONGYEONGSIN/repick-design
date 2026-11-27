import type { CategoryId } from "./categories";
import { CATEGORIES } from "./categories";

export type Priority = "urgent" | "high" | "normal" | "low";
export type Status = "open" | "pending" | "waiting";
export type Channel = "email" | "chat" | "api" | "phone";
export type Period = "today" | "7d" | "30d";

export interface Ticket {
  id: number;
  category: CategoryId;
  subject: string;
  requester: string;
  priority: Priority;
  status: Status;
  channel: Channel;
  /** Whole days since the ticket was opened. 0 = opened today. */
  daysOpen: number;
}

interface Seed {
  category: CategoryId;
  subject: string;
  daysOpen: number;
}

/**
 * Seed list, grouped by category. Each category's `daysOpen` values are chosen
 * so the three period windows nest cleanly and by design:
 *   - "today"  = daysOpen === 0
 *   - "7d"     = daysOpen <= 6   (includes today's tickets)
 *   - "30d"    = daysOpen <= 29  (the full seed list, includes 7d and today)
 * The per-category counts in each window are deliberately uneven so that
 * naive percentage rounding would NOT sum to 100 — that unevenness is what
 * makes the largest-remainder allocation in allocation.ts necessary rather
 * than decorative.
 */
const SEEDS: Seed[] = [
  // billing — 12 total (30d), 5 within 7d, 2 today
  { category: "billing", subject: "Duplicate charge on invoice INV-2291", daysOpen: 0 },
  { category: "billing", subject: "Card declined but subscription still active", daysOpen: 0 },
  { category: "billing", subject: "Requesting refund for annual plan", daysOpen: 2 },
  { category: "billing", subject: "Invoice shows wrong tax rate", daysOpen: 4 },
  { category: "billing", subject: "Unable to update billing contact email", daysOpen: 6 },
  { category: "billing", subject: "Prorated credit missing after downgrade", daysOpen: 8 },
  { category: "billing", subject: "Receipt PDF fails to generate", daysOpen: 11 },
  { category: "billing", subject: "Currency mismatch on EU invoice", daysOpen: 14 },
  { category: "billing", subject: "Seat count billed above contract terms", daysOpen: 17 },
  { category: "billing", subject: "Dunning email sent after payment cleared", daysOpen: 20 },
  { category: "billing", subject: "VAT ID not reflected on past invoices", daysOpen: 23 },
  { category: "billing", subject: "Trial converted to paid without notice", daysOpen: 26 },

  // bug — 9 total, 4 within 7d, 1 today
  { category: "bug", subject: "Export to CSV truncates the last row", daysOpen: 0 },
  { category: "bug", subject: "Dashboard filter resets on page reload", daysOpen: 1 },
  { category: "bug", subject: "Dark mode toggle not persisting", daysOpen: 3 },
  { category: "bug", subject: "Webhook retries exceed documented limit", daysOpen: 5 },
  { category: "bug", subject: "Search returns stale results after edit", daysOpen: 9 },
  { category: "bug", subject: "Timezone offset wrong in activity log", daysOpen: 13 },
  { category: "bug", subject: "Bulk delete leaves orphaned records", daysOpen: 17 },
  { category: "bug", subject: "Chart tooltip misaligned in Safari", daysOpen: 21 },
  { category: "bug", subject: "Pagination skips a page past 500 rows", daysOpen: 25 },

  // access — 7 total, 3 within 7d, 1 today
  { category: "access", subject: "SSO login loop after password reset", daysOpen: 0 },
  { category: "access", subject: "Team member locked out after 2FA change", daysOpen: 2 },
  { category: "access", subject: "API key shows revoked but still active", daysOpen: 5 },
  { category: "access", subject: "Cannot downgrade admin to member role", daysOpen: 10 },
  { category: "access", subject: "Magic link expires before email arrives", daysOpen: 15 },
  { category: "access", subject: "Guest access persists after offboarding", daysOpen: 20 },
  { category: "access", subject: "Domain auto-join broken for a subdomain", daysOpen: 25 },

  // onboarding — 6 total, 2 within 7d, 1 today
  { category: "onboarding", subject: "Import wizard stalls at the mapping step", daysOpen: 0 },
  { category: "onboarding", subject: "Sample workspace data will not delete", daysOpen: 3 },
  { category: "onboarding", subject: "Welcome checklist stuck at 80%", daysOpen: 8 },
  { category: "onboarding", subject: "Invite link points to the wrong workspace", daysOpen: 14 },
  { category: "onboarding", subject: "Setup guide is missing the SSO step", daysOpen: 19 },
  { category: "onboarding", subject: "First-run survey blocks dashboard access", daysOpen: 24 },

  // integration — 5 total, 2 within 7d, 1 today
  { category: "integration", subject: "Slack notifications stopped after reauth", daysOpen: 0 },
  { category: "integration", subject: "Zapier trigger fires twice per event", daysOpen: 4 },
  { category: "integration", subject: "Salesforce sync drops custom fields", daysOpen: 9 },
  { category: "integration", subject: "Webhook signature validation fails", daysOpen: 16 },
  { category: "integration", subject: "Calendar integration ignores recurring events", daysOpen: 22 },

  // performance — 4 total, 2 within 7d, 0 today
  { category: "performance", subject: "Dashboard load time over 8 seconds", daysOpen: 2 },
  { category: "performance", subject: "Report export times out on large datasets", daysOpen: 5 },
  { category: "performance", subject: "Search latency spikes during peak hours", daysOpen: 12 },
  { category: "performance", subject: "Bulk import slows the entire workspace", daysOpen: 21 },

  // feature — 4 total, 1 within 7d, 0 today
  { category: "feature", subject: "Custom fields on ticket intake forms", daysOpen: 4 },
  { category: "feature", subject: "Dark mode for the client-facing portal", daysOpen: 10 },
  { category: "feature", subject: "More granular weekly digest options", daysOpen: 18 },
  { category: "feature", subject: "Bulk tag editing from the table view", daysOpen: 26 },

  // other — 3 total, 1 within 7d, 0 today
  { category: "other", subject: "General question about data retention policy", daysOpen: 3 },
  { category: "other", subject: "Feedback on the new navigation layout", daysOpen: 11 },
  { category: "other", subject: "Clarification on usage-based pricing", daysOpen: 22 },
];

const NAMES = [
  "Mara Lindqvist",
  "Devon Okafor",
  "Priya Raman",
  "Sofia Castellano",
  "Ethan Brandt",
  "Noor Haidari",
  "Liam Ferreira",
  "Yuki Tanaka",
  "Grace Olumide",
  "Theo Vance",
  "Amara Osei",
  "Felix Donnelly",
  "Ines Moreau",
  "Caleb Whitfield",
  "Rosa Delgado",
  "Owen Masters",
  "Nadia Petrov",
  "Marcus Lindgren",
  "Elena Marchetti",
  "Jonah Pryce",
];

const PRIORITY_PATTERN: Priority[] = ["high", "normal", "normal", "urgent", "low", "normal", "high", "normal"];
const STATUS_PATTERN: Status[] = ["open", "pending", "waiting"];
const CHANNEL_PATTERN: Channel[] = ["email", "chat", "api", "phone"];

const ID_BASE = 4100;

export const TICKETS: Ticket[] = SEEDS.map((seed, index) => ({
  id: ID_BASE + index,
  category: seed.category,
  subject: seed.subject,
  requester: NAMES[index % NAMES.length],
  priority: PRIORITY_PATTERN[index % PRIORITY_PATTERN.length],
  status: STATUS_PATTERN[index % STATUS_PATTERN.length],
  channel: CHANNEL_PATTERN[index % CHANNEL_PATTERN.length],
  daysOpen: seed.daysOpen,
}));

export function ticketsForPeriod(period: Period, source: Ticket[] = TICKETS): Ticket[] {
  if (period === "today") return source.filter((t) => t.daysOpen === 0);
  if (period === "7d") return source.filter((t) => t.daysOpen <= 6);
  return source.filter((t) => t.daysOpen <= 29);
}

export function countForCategory(tickets: Ticket[], category: CategoryId): number {
  return tickets.filter((t) => t.category === category).length;
}

/** Counts in the same fixed order as CATEGORIES — required for the waffle allocation. */
export function countsInCategoryOrder(tickets: Ticket[]): number[] {
  return CATEGORIES.map((c) => countForCategory(tickets, c.id));
}

function median(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export const TOTAL_BACKLOG = TICKETS.length;
export const TODAY_INTAKE = TICKETS.filter((t) => t.daysOpen === 0).length;
export const URGENT_AT_RISK = TICKETS.filter((t) => t.priority === "urgent" && t.daysOpen >= 3).length;
export const MEDIAN_AGE_DAYS = median(TICKETS.map((t) => t.daysOpen));

/** Illustrative 7-point trend of total open backlog size, ending at TOTAL_BACKLOG. */
export const BACKLOG_TREND = [41, 44, 43, 46, 48, 47, TOTAL_BACKLOG];

export const PERIOD_LABEL: Record<Period, string> = {
  today: "Today",
  "7d": "7d",
  "30d": "30d",
};

export const PRIORITY_LABEL: Record<Priority, string> = {
  urgent: "Urgent",
  high: "High",
  normal: "Normal",
  low: "Low",
};

export const STATUS_LABEL: Record<Status, string> = {
  open: "Open",
  pending: "Pending",
  waiting: "Waiting",
};

export const CHANNEL_LABEL: Record<Channel, string> = {
  email: "Email",
  chat: "Chat",
  api: "API",
  phone: "Phone",
};
