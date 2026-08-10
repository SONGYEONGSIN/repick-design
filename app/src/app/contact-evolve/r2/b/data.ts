import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  KeyRound,
  Mail,
  Megaphone,
  Phone,
  ShieldCheck,
  Store,
  UserCheck,
  Users,
  Wallet,
} from "lucide-react";

/**
 * Trust Tier Console — data.
 *
 * The page's axis is the reader's relationship to repick, not a department or a clock. `TIERS`
 * is the account-context selector (guest / verified buyer / verified seller). Every `Channel`
 * carries a `tiers` list (which contexts even see it) and a `priority` map (where it ranks once a
 * context is chosen) — a channel with a single tier is context-exclusive and gets the "Matched"
 * badge; a channel present in all three tiers is baseline and never disappears.
 *
 * No `Date.now()` / `new Date()` anywhere: "median reply" and "breaks when" are fixed, published
 * figures (the kind a real status page prints monthly), not a live clock reading.
 */

export type TierId = "guest" | "buyer" | "seller";

export interface TierMeta {
  id: TierId;
  label: string;
  hint: string;
  icon: LucideIcon;
}

export const TIERS: TierMeta[] = [
  {
    id: "guest",
    label: "Guest",
    hint: "Just browsing, no account yet",
    icon: Users,
  },
  {
    id: "buyer",
    label: "Verified buyer",
    hint: "ID confirmed, made a purchase",
    icon: UserCheck,
  },
  {
    id: "seller",
    label: "Verified seller",
    hint: "Listing and shipping items",
    icon: Store,
  },
];

export interface ChannelLink {
  kind: "email" | "phone";
  href: string;
  display: string;
}

export interface Channel {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  primary: ChannelLink;
  secondary?: ChannelLink;
  medianReply: string;
  volume: number;
  breaksWhen: string;
  /** Which contexts even see this channel — length 3 means "baseline, always shown". */
  tiers: TierId[];
  /** Sort rank within a given tier's view. Lower shows first. */
  priority: Partial<Record<TierId, number>>;
}

export const CHANNELS: Channel[] = [
  {
    id: "general-support",
    label: "General support",
    description: "Anything that doesn't fit a specific queue yet.",
    icon: Mail,
    primary: { kind: "email", href: "mailto:help@repick.co", display: "help@repick.co" },
    medianReply: "under 6 hours",
    volume: 3120,
    breaksWhen: "Email only on weekends — the queue resumes Monday at 9:00 ET.",
    tiers: ["guest", "buyer", "seller"],
    priority: { guest: 1, buyer: 3, seller: 4 },
  },
  {
    id: "support-line",
    label: "Support phone line",
    description: "Talk to someone directly during business hours.",
    icon: Phone,
    primary: { kind: "phone", href: "tel:+14155550142", display: "+1 415 555 0142" },
    medianReply: "under 20 minutes on hold",
    volume: 1180,
    breaksWhen: "Lines close at 19:00 ET and don't reopen on weekends.",
    tiers: ["guest", "buyer", "seller"],
    priority: { guest: 2, buyer: 4, seller: 5 },
  },
  {
    id: "account-help",
    label: "Creating & verifying an account",
    description: "ID verification, payment setup, and your first listing or order.",
    icon: UserCheck,
    primary: {
      kind: "email",
      href: "mailto:onboarding@repick.co",
      display: "onboarding@repick.co",
    },
    medianReply: "under 12 hours",
    volume: 640,
    breaksWhen: "Slower the Monday after a promo weekend — same-day, not same-hour.",
    tiers: ["guest"],
    priority: { guest: 0 },
  },
  {
    id: "buyer-disputes",
    label: "Authentication & payment disputes",
    description: "A failed authentication check, a chargeback, or a buyer protection claim.",
    icon: ShieldCheck,
    primary: { kind: "email", href: "mailto:disputes@repick.co", display: "disputes@repick.co" },
    secondary: { kind: "phone", href: "tel:+14155550143", display: "+1 415 555 0143" },
    medianReply: "under 3 hours while open",
    volume: 410,
    breaksWhen: "The phone line closes at 18:00 ET; email keeps moving after that.",
    tiers: ["buyer"],
    priority: { buyer: 0 },
  },
  {
    id: "seller-payouts",
    label: "Payouts & held funds",
    description: "A delayed, held, or missing seller payout.",
    icon: Wallet,
    primary: { kind: "email", href: "mailto:payouts@repick.co", display: "payouts@repick.co" },
    secondary: { kind: "phone", href: "tel:+14155550144", display: "+1 415 555 0144" },
    medianReply: "under 2 hours on weekdays",
    volume: 260,
    breaksWhen: "Unstaffed Saturday and Sunday — held payouts resume Monday morning.",
    tiers: ["seller"],
    priority: { seller: 0 },
  },
  {
    id: "seller-appeals",
    label: "Listing suspension appeals",
    description: "Appeal a removed or flagged listing.",
    icon: Store,
    primary: { kind: "email", href: "mailto:appeals@repick.co", display: "appeals@repick.co" },
    medianReply: "under 24 hours",
    volume: 95,
    breaksWhen: "Reviewed in daily batches, not real time — same-day, not instant.",
    tiers: ["seller"],
    priority: { seller: 1 },
  },
];

export const GOOD_TO_KNOW: Record<TierId, string[]> = {
  guest: [
    "Browsing and searching listings never requires an account.",
    "You'll need a confirmed name and payment method before you can message a seller or place an order.",
    "Verification usually takes minutes once you submit ID, not days.",
  ],
  buyer: [
    "Failed authentication checks and payment disputes route through Buyer Protection, not general support.",
    "Refunds go back to your original payment method — never store credit unless you ask for it.",
    "Verified buyers get priority phone routing until 18:00 ET, skipping the general queue.",
  ],
  seller: [
    "Payout holds are reviewed by a separate line from listing support — the payouts address gets there faster.",
    "A failed authentication doesn't cancel your listing automatically; you can appeal once per item.",
    "Seller phone routing skips the general queue and rings the seller line directly.",
  ],
};

export interface OtherPath {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  href: string;
  display: string;
}

export const OTHER_PATHS: OtherPath[] = [
  {
    id: "trust-safety",
    label: "Trust & Safety",
    description: "Report a scam, counterfeit listing, or suspicious account.",
    icon: AlertTriangle,
    href: "mailto:trust@repick.co",
    display: "trust@repick.co",
  },
  {
    id: "security",
    label: "Security disclosure",
    description: "Report a vulnerability — every valid report gets credited.",
    icon: KeyRound,
    href: "mailto:security@repick.co",
    display: "security@repick.co",
  },
  {
    id: "press",
    label: "Press",
    description: "Interview requests and media inquiries.",
    icon: Megaphone,
    href: "mailto:press@repick.co",
    display: "press@repick.co",
  },
];

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

export const PEER_FOCUS_RING =
  "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-blue-600 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white";

export function groupThousands(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
