// native/src/verification/data.ts — auto-native-r6 candidate c.
// Deterministic dummy data for the Seller Verification screen: a 4-step identity/payout
// verification flow (identity document capture, payout account, required attestations,
// review + submit-for-review). No Math.random / Date.now / bare `new Date()` anywhere.

export interface DocumentItem {
  id: string;
  label: string;
  /** How the reviewer will check this capture, shown so the seller can self-check first. */
  hint: string;
}

export interface AttestationItem {
  id: string;
  label: string;
}

export interface PayoutAccount {
  bankLabel: string;
  accountMasked: string;
  holderName: string;
  accountType: string;
}

export interface StepMeta {
  id: string;
  kicker: string;
  title: string;
  lede: string;
}

export const DOCUMENT_ITEMS: readonly DocumentItem[] = [
  {
    id: "id-front",
    label: "Government ID — front",
    hint: "All four corners visible, no glare over the photo or text",
  },
  {
    id: "id-back",
    label: "Government ID — back",
    hint: "Address and issue date fully legible",
  },
  {
    id: "selfie",
    label: "Selfie holding the ID",
    hint: "Your face and the ID photo both fully in frame",
  },
];

export const PAYOUT_ACCOUNT: PayoutAccount = {
  bankLabel: "Kookmin Bank",
  accountMasked: "•••• •••• 4471",
  holderName: "Ji-eun Park",
  accountType: "Checking",
};

export const ATTESTATION_ITEMS: readonly AttestationItem[] = [
  {
    id: "accurate",
    label:
      "The identity and payout information I provided is accurate and belongs to me.",
  },
  {
    id: "tax",
    label:
      "I understand I am responsible for reporting income earned from sales on Repick.",
  },
  {
    id: "policy",
    label: "I agree to Repick's Seller Policy and Prohibited Items list.",
  },
];

export const STEP_META: readonly StepMeta[] = [
  {
    id: "identity",
    kicker: "Step 1 of 4",
    title: "Identity document",
    lede: "Confirm each capture is usable before moving on. Retake anytime.",
  },
  {
    id: "payout",
    kicker: "Step 2 of 4",
    title: "Payout method",
    lede: "This is where Repick sends your proceeds after a sale clears.",
  },
  {
    id: "attestations",
    kicker: "Step 3 of 4",
    title: "Attestations",
    lede: "Three required statements before Repick can review your application.",
  },
  {
    id: "review",
    kicker: "Step 4 of 4",
    title: "Review and submit",
    lede: "Check each section below. Editing a confirmed section reopens it.",
  },
];

export const SUBMITTED_AT_LABEL = "2:04 PM";
export const REVIEW_WINDOW_LABEL = "1 business day";
