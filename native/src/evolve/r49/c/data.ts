// native/src/evolve/r49/c/data.ts
// Deterministic dummy data for the Seller Onboarding Checklist screen.
// No Math.random / Date.now / argument-less `new Date()` anywhere below —
// every value here is a fixed literal, or a pure computation over fixed
// literals performed in the screen component itself.

export type OnboardingStep = {
  id: string;
  title: string;
  description: string;
};

// The fixed sequence of first-run setup steps a brand-new seller must
// complete, in order, before their shop can go live. Order matters: each
// step's "locked" reason references the step immediately before it.
export const ONBOARDING_STEPS: readonly OnboardingStep[] = [
  {
    id: "verify-identity",
    title: "Verify your identity",
    description:
      "Confirm who you are with a government ID so buyers know they're dealing with a real person.",
  },
  {
    id: "link-payout",
    title: "Link a payout account",
    description:
      "Add a bank account or debit card so you can get paid when your items sell.",
  },
  {
    id: "storefront-profile",
    title: "Set up your storefront profile",
    description:
      "Add a shop name, a profile photo, and a short bio so buyers know who they're buying from.",
  },
  {
    id: "list-first-item",
    title: "List your first item",
    description:
      "Create your first listing with photos, a price, and a condition rating.",
  },
] as const;

// Fixed starting state for this screen: only the first step has already
// been completed, which makes the second step "current" and the remaining
// two "locked" until the step before each of them is done. The component
// derives every row's status from this array plus ONBOARDING_STEPS's fixed
// order — never from a random or time-based source.
export const INITIAL_COMPLETED_STEP_IDS: readonly string[] = [
  "verify-identity",
] as const;
