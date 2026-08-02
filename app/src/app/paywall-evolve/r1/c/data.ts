// Deterministic content for the Trestle hard-paywall interrupt.
// No Math.random / Date.now / new Date() anywhere in this module or its consumers.

export const PLAN = {
  name: "Trestle Pro",
  monthlyPerSeat: 16,
  annualPerSeatMonthly: 12,
  seatMin: 1,
  seatMax: 50,
  seatDefault: 5,
} as const;

export const savingsPercent = Math.round(
  ((PLAN.monthlyPerSeat - PLAN.annualPerSeatMonthly) / PLAN.monthlyPerSeat) * 100,
);

export type LockedFeature = {
  id: string;
  label: string;
  detail: string;
};

export const lockedFeatures: LockedFeature[] = [
  {
    id: "boards",
    label: "Unlimited boards",
    detail: "Free stops at 3 active boards per workspace.",
  },
  {
    id: "history",
    label: "Full version history",
    detail: "Free keeps only the last 7 days of board history.",
  },
  {
    id: "permissions",
    label: "Advanced permissions",
    detail: "Per-board roles, guest links, and view-only sharing.",
  },
  {
    id: "support",
    label: "Priority support",
    detail: "Median first response under 2 hours, 7 days a week.",
  },
];

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  avatarSeed: string;
  rating: number;
};

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "We hit the board limit in our second week. Upgrading took two minutes and nobody lost a single card.",
    name: "Priya Nandan",
    role: "Head of Ops",
    company: "Fernhollow Studio",
    avatarSeed: "trestle-priya",
    rating: 5,
  },
  {
    id: "t2",
    quote:
      "Version history alone paid for the upgrade the first time a client asked us to roll back a plan.",
    name: "Marcus Oyelaran",
    role: "Delivery Lead",
    company: "Basecamp Wharf Co.",
    avatarSeed: "trestle-marcus",
    rating: 5,
  },
  {
    id: "t3",
    quote:
      "Annual billing plus the seat slider made it trivial to size the plan to our actual team, not a tier.",
    name: "Elin Sørvik",
    role: "COO",
    company: "Norrland Freight",
    avatarSeed: "trestle-elin",
    rating: 4,
  },
];

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    id: "seats",
    question: "Can I change my seat count after upgrading?",
    answer:
      "Yes. Add or remove seats anytime from Workspace Settings — the next invoice is prorated automatically, whether you're on monthly or annual billing.",
  },
  {
    id: "existing-boards",
    question: "What happens to boards I already made on Free?",
    answer:
      "Nothing changes. All existing boards, cards, and comments carry over immediately, and the 3-board limit lifts the moment your upgrade is confirmed.",
  },
  {
    id: "annual",
    question: "How does annual billing work?",
    answer:
      `You're billed once for the year at $${PLAN.annualPerSeatMonthly}/seat/month, a ${savingsPercent}% discount on the monthly rate. You can still add seats mid-year — those are prorated to your renewal date.`,
  },
  {
    id: "downgrade",
    question: "What happens if I downgrade later?",
    answer:
      "Your workspace reverts to the Free limits at the end of the current billing period. Boards beyond the Free cap are archived, not deleted, and unlock again the moment you re-upgrade.",
  },
  {
    id: "trial",
    question: "Is there a trial before I commit?",
    answer:
      "Every Pro upgrade includes a 14-day window where you can cancel for a full refund, no reason required — reach support and it's handled the same day.",
  },
];
