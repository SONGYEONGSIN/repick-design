/** Fixed, deterministic fixtures. No clock is read anywhere — every timestamp is a literal. */

export type Direction = "both" | "toKestrel" | "toHubspot" | "blocked";

export type FieldRow = {
  hubspot: string;
  kestrel: string;
  direction: Direction;
  note: string;
};

export const FIELD_ROWS: FieldRow[] = [
  {
    hubspot: "contact.email",
    kestrel: "customer.email",
    direction: "both",
    note: "Matched lowercase. This is the join key — if it changes on both sides in one window, the run stops instead of guessing.",
  },
  {
    hubspot: "contact.firstname + lastname",
    kestrel: "customer.legal_name",
    direction: "toKestrel",
    note: "Joined with one space and trimmed. Kestrel never writes back, so invoice name edits stay in Kestrel.",
  },
  {
    hubspot: "company.name",
    kestrel: "account.name",
    direction: "toKestrel",
    note: "Verbatim, 120 character ceiling. Longer names are truncated, not rejected.",
  },
  {
    hubspot: "company.domain",
    kestrel: "account.domain",
    direction: "both",
    note: "Stripped to the registrable domain, so mail.fernbrook.co and fernbrook.co are one account.",
  },
  {
    hubspot: "deal.amount",
    kestrel: "subscription.mrr",
    direction: "toHubspot",
    note: "Written as ARR: MRR times 12, in USD cents, converted at the rate stored on the subscription.",
  },
  {
    hubspot: "deal.closedate",
    kestrel: "subscription.started_at",
    direction: "toHubspot",
    note: "Date only, UTC. A backdated subscription moves the deal's close date with it.",
  },
  {
    hubspot: "deal.dealstage",
    kestrel: "subscription.status",
    direction: "toHubspot",
    note: "Six stage rules. past_due maps to Closed Won, not to a risk stage — that surprised two teams, so it is spelled out here.",
  },
  {
    hubspot: "contact.lifecyclestage",
    kestrel: "customer.segment",
    direction: "toKestrel",
    note: "Only customer and evangelist map. The four earlier stages are ignored rather than written as null.",
  },
  {
    hubspot: "company.country",
    kestrel: "account.tax_region",
    direction: "both",
    note: "ISO 3166 alpha-2. Blank on both sides blocks invoicing outright — this is the single most common rejection.",
  },
  {
    hubspot: "contact.hs_object_id",
    kestrel: "customer.external_ids.hubspot",
    direction: "toKestrel",
    note: "Written once at first match and never overwritten, so a merged HubSpot contact does not silently re-point billing.",
  },
  {
    hubspot: "deal.pipeline",
    kestrel: "subscription.book",
    direction: "toKestrel",
    note: "Two of your five pipelines are in scope: New Business and Renewals. Deals in the other three are skipped entirely.",
  },
  {
    hubspot: "deal.line_items",
    kestrel: "no counterpart",
    direction: "blocked",
    note: "Kestrel builds invoices from plans and usage, not from deal lines. There is nothing to write into and no rule that would not invent revenue.",
  },
  {
    hubspot: "contact.hs_lead_status",
    kestrel: "no counterpart",
    direction: "blocked",
    note: "Free text in this portal: 340 distinct values across 8,412 contacts. No mapping survives contact with that.",
  },
  {
    hubspot: "quote.* (all properties)",
    kestrel: "no counterpart",
    direction: "blocked",
    note: "The Quotes scope was not granted at authorization. A portal admin can re-authorize to open this — nothing else about the connection changes.",
  },
  {
    hubspot: "no counterpart",
    kestrel: "customer.dunning_state",
    direction: "blocked",
    note: "Changes up to 40 times a day per customer. Syncing it would spend your 190,000 daily HubSpot calls before 09:00 UTC.",
  },
  {
    hubspot: "no counterpart",
    kestrel: "customer.payment_method",
    direction: "blocked",
    note: "Card and bank details never leave Kestrel. Not a setting.",
  },
  {
    hubspot: "company.industry",
    kestrel: "account.industry",
    direction: "blocked",
    note: "Both sides are maintained by people and neither is authoritative. Left alone on purpose rather than picking a winner you would have to audit.",
  },
];

export type RunOutcome = "complete" | "partial" | "conflict";

export type Run = {
  id: string;
  window: string;
  read: string;
  written: string;
  outcome: RunOutcome;
  headline: string;
  detailLabel: string;
  detail: { record: string; reason: string }[];
  footnote: string | null;
};

export const RUNS: Run[] = [
  {
    id: "4417",
    window: "Aug 08, 14:30 to 14:42 UTC",
    read: "1,204",
    written: "318",
    outcome: "partial",
    headline:
      "12 contacts rejected — company.country was blank on both sides, so Kestrel had no tax region to invoice against.",
    detailLabel: "the 12 rejected contacts",
    detail: [
      { record: "ops@fernbrook.co", reason: "company.country blank; HubSpot company 'Fernbrook Co.' has no country set" },
      { record: "ap@halloway-labs.com", reason: "company.country blank; company record was created by a form with no country field" },
      { record: "finance@nordvik.se", reason: "company.country 'Sweden' is not ISO 3166 alpha-2; expected SE" },
      { record: "billing@porthaven.io", reason: "company.country 'UK' is not ISO 3166 alpha-2; expected GB" },
    ],
    footnote: "8 more with the same two causes — 5 blank, 3 not alpha-2.",
  },
  {
    id: "4416",
    window: "Aug 08, 14:15 to 14:21 UTC",
    read: "1,190",
    written: "402",
    outcome: "complete",
    headline: "Nothing rejected. 402 writes, 71 of them the backlog deferred out of run #4413.",
    detailLabel: "the write breakdown",
    detail: [
      { record: "331 deal.dealstage", reason: "routine status refresh, no value changes outside the mapping" },
      { record: "71 deferred writes", reason: "carried over from run #4413 after HubSpot stopped returning 429" },
    ],
    footnote: null,
  },
  {
    id: "4415",
    window: "Aug 08, 14:00 to 14:09 UTC",
    read: "1,188",
    written: "377",
    outcome: "conflict",
    headline:
      "3 records were edited on both sides inside the same window. Held for a person rather than resolved by timestamp.",
    detailLabel: "the 3 held records",
    detail: [
      { record: "Fernbrook Co. — customer.email", reason: "HubSpot ops@fernbrook.co vs Kestrel billing@fernbrook.co, 41 seconds apart" },
      { record: "Halloway Labs — account.tax_region", reason: "HubSpot GB vs Kestrel IE; 14 open invoices are rated off this field" },
      { record: "Nordvik AB — account.name", reason: "HubSpot 'Nordvik AB' vs Kestrel 'Nordvik Holdings AB'" },
    ],
    footnote: "These are the same three sitting in Waiting on a person, below.",
  },
  {
    id: "4414",
    window: "Aug 08, 13:45 to 13:52 UTC",
    read: "1,201",
    written: "365",
    outcome: "complete",
    headline: "Nothing rejected. First clean run after the rate limit cleared.",
    detailLabel: "the write breakdown",
    detail: [
      { record: "294 deal.dealstage", reason: "routine status refresh" },
      { record: "71 deal.amount", reason: "ARR recalculated after 14 plan changes earlier in the day" },
    ],
    footnote: null,
  },
  {
    id: "4413",
    window: "Aug 08, 13:30 to 13:59 UTC",
    read: "1,177",
    written: "0",
    outcome: "partial",
    headline:
      "HubSpot returned 429 for 27 minutes straight. Reads continued, all 365 writes were deferred to run #4414 and none were lost.",
    detailLabel: "what the portal was doing",
    detail: [
      { record: "429 on POST /crm/v3/objects/deals/batch/update", reason: "portal-wide limit, 190,000 daily calls exhausted at 13:31 UTC" },
      { record: "Two other integrations were active", reason: "your portal shares one budget across all connected apps" },
    ],
    footnote: "This run is why the connection still reads Degraded — nothing since has failed.",
  },
  {
    id: "4412",
    window: "Aug 08, 13:15 to 13:22 UTC",
    read: "1,168",
    written: "341",
    outcome: "complete",
    headline: "Nothing rejected. Last run before the rate limit began.",
    detailLabel: "the write breakdown",
    detail: [
      { record: "341 deal.dealstage", reason: "routine status refresh" },
    ],
    footnote: null,
  },
];

export type Side = "hubspot" | "kestrel";

export type PrecedenceRow = {
  field: string;
  scope: string;
  hubspotValue: string;
  kestrelValue: string;
  ruleWinner: Side;
  decided: string;
  consequence: Record<Side, string>;
};

export const PRECEDENCE: PrecedenceRow[] = [
  {
    field: "customer.email",
    scope: "Fernbrook Co.",
    hubspotValue: "ops@fernbrook.co",
    kestrelValue: "billing@fernbrook.co",
    ruleWinner: "kestrel",
    decided: "decided 3 records in run #4415",
    consequence: {
      kestrel: "billing@fernbrook.co stays. HubSpot keeps its own value; the two records stay legitimately different.",
      hubspot: "ops@fernbrook.co is written into Kestrel. 2 invoices already in flight would be re-addressed mid-dunning.",
    },
  },
  {
    field: "account.tax_region",
    scope: "Halloway Labs",
    hubspotValue: "GB",
    kestrelValue: "IE",
    ruleWinner: "kestrel",
    decided: "decided 1 record in run #4415",
    consequence: {
      kestrel: "IE stays and 14 open invoices keep their current VAT treatment.",
      hubspot: "GB is written into Kestrel, which re-rates 14 open invoices at 20 percent and issues 14 credit notes.",
    },
  },
  {
    field: "account.name",
    scope: "Nordvik AB",
    hubspotValue: "Nordvik AB",
    kestrelValue: "Nordvik Holdings AB",
    ruleWinner: "hubspot",
    decided: "decided 1 record in run #4415",
    consequence: {
      hubspot: "Nordvik AB is written into Kestrel and appears on the next invoice PDF.",
      kestrel: "Nordvik Holdings AB stays — the legal entity on the signed order form, which is what an auditor reads.",
    },
  },
  {
    field: "subscription.book",
    scope: "Porthaven",
    hubspotValue: "New Business",
    kestrelValue: "Renewals",
    ruleWinner: "hubspot",
    decided: "decided 0 records in run #4415",
    consequence: {
      hubspot: "The deal pipeline wins, so the subscription moves books and leaves this quarter's renewal forecast.",
      kestrel: "Renewals stays. The deal keeps its pipeline; only reporting disagrees, and finance reports off Kestrel.",
    },
  },
];

export type StuckRecord = {
  id: string;
  label: string;
  field: string;
  reason: string;
  target: "HubSpot" | "Kestrel";
  fix: string;
};

export const STUCK: StuckRecord[] = [
  {
    id: "c-8841",
    label: "Fernbrook Co.",
    field: "customer.email",
    reason: "Edited on both sides 41 seconds apart in run #4415. No rule can pick without losing an address.",
    target: "Kestrel",
    fix: "Pick the surviving address on the account, then hand it back.",
  },
  {
    id: "c-8846",
    label: "Halloway Labs",
    field: "account.tax_region",
    reason: "GB in HubSpot, IE in Kestrel. Re-rates 14 open invoices whichever way it goes.",
    target: "Kestrel",
    fix: "Confirm the billing entity with finance before releasing this one.",
  },
  {
    id: "c-8852",
    label: "Nordvik AB",
    field: "account.name",
    reason: "Legal name in Kestrel, trading name in HubSpot. Both are correct for their own document.",
    target: "HubSpot",
    fix: "Nothing to fix at the source — release it and the current rule applies.",
  },
  {
    id: "c-8902",
    label: "Porthaven",
    field: "company.country",
    reason: "Value is UK, which is not an ISO 3166 alpha-2 code. Rejected in run #4417 and it will reject again.",
    target: "HubSpot",
    fix: "Change the HubSpot company country to GB first, or this returns next run.",
  },
  {
    id: "c-8917",
    label: "Sable Freight",
    field: "quote.total",
    reason: "Out of scope — the Quotes permission was never granted at authorization.",
    target: "HubSpot",
    fix: "Needs a portal admin to re-authorize. Releasing it now will not help.",
  },
];
