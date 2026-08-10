/**
 * Fixtures for the "Escalation Ladder" Contact page.
 *
 * This route deliberately does not answer "when will they respond right now" — that question
 * requires a clock (`new Date()`, which is hard-banned for hydration determinism), and the three
 * `auto-contact-r1` candidates already converged on the same workaround (ask the visitor to input a
 * time and recompute). This route answers a different, clock-free question instead: "which of our
 * four support tiers is built to handle this, and what does that tier promise?" Every promise below
 * (`slaLabel`, `queueLabel`, `breaksWhen`) is a fixed, published characterization of the tier itself
 * — the kind of thing a support team would put in a runbook — not a live or simulated calculation.
 * There is no Math.random, no Date.now, no new Date() anywhere in this route.
 */

export type TierId = "self-serve" | "specialist" | "escalation" | "urgent";

export type IconKey = "MessageCircle" | "UserCheck" | "ShieldAlert" | "PhoneCall";

export type Tier = {
  id: TierId;
  level: 1 | 2 | 3 | 4;
  icon: IconKey;
  label: string;
  summary: string;
  owner: string;
  ownerRole: string;
  ownerNote: string;
  email: string;
  /** E.164-ish, tier 4 only. */
  phone?: string;
  phoneLabel?: string;
  /** A fixed, published promise — not a live calculation. */
  slaLabel: string;
  /** A fixed, published queue-depth characterization — not a live count. */
  queueLabel: string;
  /** The condition under which the SLA promise above does not apply. Always shown, never hidden. */
  breaksWhen: string;
};

export const TIERS: Tier[] = [
  {
    id: "self-serve",
    level: 1,
    icon: "MessageCircle",
    label: "Help desk",
    summary:
      "Order status, shipping questions, listing help, account settings — anything that isn't a dispute.",
    owner: "Help desk",
    ownerRole: "8-person rotating team",
    ownerNote: "No macros — whoever is up reads the whole message before replying.",
    email: "help@soletrace.com",
    slaLabel: "Same business day",
    queueLabel: "Moderate queue — our highest-volume desk",
    breaksWhen:
      "Messages after 4:00pm ET roll to the next business day; there is no weekend coverage, so Saturday and Sunday messages wait for Monday.",
  },
  {
    id: "specialist",
    level: 2,
    icon: "UserCheck",
    label: "Order & authentication specialists",
    summary:
      "The item didn't match the listing, authentication is running long, or a payout is late but not stuck.",
    owner: "Order specialists",
    ownerRole: "3-person team, named on first reply",
    ownerNote: "The specialist who takes your case stays on it — you won't repeat yourself to someone new.",
    email: "orders@soletrace.com",
    slaLabel: "Within 1 business day",
    queueLabel: "Light queue — one specialist per open case",
    breaksWhen:
      "Business days only, so a report filed Friday evening is picked up Monday; an authentication hold already in review is not sped up by a second message.",
  },
  {
    id: "escalation",
    level: 3,
    icon: "ShieldAlert",
    label: "Trust & escalations",
    summary: "Suspected fraud, a counterfeit dispute, or an account action you believe was wrong.",
    owner: "Escalations lead",
    ownerRole: "2-person team, weekdays",
    ownerNote: "Every case gets a decision-maker directly, not a position in a queue.",
    email: "escalations@soletrace.com",
    slaLabel: "Within 4 business hours",
    queueLabel: "Minimal queue — small team, few open cases at once",
    breaksWhen:
      "Business hours only, weekdays; a case opened Friday at 5:00pm ET is picked up Monday morning, and the 4-hour window is a first response, not always a final decision.",
  },
  {
    id: "urgent",
    level: 4,
    icon: "PhoneCall",
    label: "Urgent direct line",
    summary:
      "Fraud is happening on your account right now, or a payout above a threshold you can't wait out is stuck.",
    owner: "On-call escalations lead",
    ownerRole: "Direct line, one person",
    ownerNote: "This skips every queue above — say who you are and what's happening.",
    email: "urgent@soletrace.com",
    phone: "+14155550142",
    phoneLabel: "+1 415 555 0142",
    slaLabel: "Same-hour callback",
    queueLabel: "No queue — direct",
    breaksWhen:
      "The line is staffed weekdays 8:00am–8:00pm ET; outside that window, email urgent@soletrace.com with URGENT in the subject — it is read continuously, but the same-hour promise resumes at 8:00am ET.",
  },
];

export type Situation = {
  id: string;
  label: string;
  tierId: TierId;
};

/** Two per tier, on purpose — enough to prove the mapping is real without turning the picker into a menu. */
export const SITUATIONS: Situation[] = [
  { id: "shipping", label: "Where's my order, or a shipping question", tierId: "self-serve" },
  { id: "account", label: "Listing or account settings help", tierId: "self-serve" },
  { id: "mismatch", label: "The item didn't match the listing", tierId: "specialist" },
  { id: "payout-slow", label: "A payout is late, not stuck", tierId: "specialist" },
  { id: "fraud-suspect", label: "I think I'm being scammed", tierId: "escalation" },
  { id: "suspended", label: "My account was suspended and I disagree", tierId: "escalation" },
  { id: "active-fraud", label: "Fraud is happening on my account right now", tierId: "urgent" },
  { id: "payout-stuck", label: "A payout is stuck and I can't wait", tierId: "urgent" },
];

export const COMPANY = {
  name: "Sole Trace",
  tagline: "The resale price-tracking marketplace for sneakers and streetwear.",
  statusUrl: "https://status.soletrace.com",
};

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white";
