// Deterministic branching tree for the Delivery Problem Resolver screen.
// No randomness, no dates — every value below is a fixed literal.

export type Tone = "success" | "warning" | "danger" | "info";

export interface QuestionOption {
  id: string;
  label: string;
  next: string;
}

export interface QuestionNode {
  type: "question";
  id: string;
  shortLabel: string;
  prompt: string;
  helper?: string;
  options: QuestionOption[];
}

export type TerminalActionKind = "submit" | "restart" | "recheck";

export interface TerminalNode {
  type: "terminal";
  id: string;
  tone: Tone;
  badgeLabel: string;
  title: string;
  message: string;
  blocked: boolean;
  blockedReason?: string;
  primaryActionKind: TerminalActionKind;
  primaryActionLabel: string;
  submittedNote?: string;
  /** Only set when primaryActionKind === "recheck": which question to re-open. */
  recheckTarget?: string;
}

export type TreeNode = QuestionNode | TerminalNode;

export const ROOT_ID = "start";

export const TREE: Record<string, TreeNode> = {
  start: {
    type: "question",
    id: "start",
    shortLabel: "Arrived",
    prompt: "Did your order arrive?",
    helper: "Start here so we can route this the right way.",
    options: [
      { id: "yes", label: "Yes, it arrived", next: "arrived_match" },
      { id: "no", label: "No, it never arrived", next: "tracking_status" },
    ],
  },

  tracking_status: {
    type: "question",
    id: "tracking_status",
    shortLabel: "Tracking",
    prompt: "What does the tracking say?",
    options: [
      { id: "delivered", label: "Carrier marked it delivered", next: "term_missing_claim" },
      { id: "stuck", label: "Tracking hasn't moved in days", next: "time_since_update" },
      { id: "lost", label: "Carrier confirmed it's lost", next: "term_lost_claim" },
    ],
  },

  time_since_update: {
    type: "question",
    id: "time_since_update",
    shortLabel: "Update age",
    prompt: "How long since the last tracking update?",
    options: [
      { id: "under3", label: "Less than 3 days", next: "term_wait" },
      { id: "3to7", label: "3 to 7 days", next: "term_contact_carrier" },
      { id: "over7", label: "More than 7 days", next: "term_lost_claim" },
    ],
  },

  arrived_match: {
    type: "question",
    id: "arrived_match",
    shortLabel: "Match",
    prompt: "Does the item match the listing?",
    options: [
      { id: "match", label: "Yes, exactly as described", next: "term_no_action" },
      { id: "issue", label: "No, something's wrong", next: "item_issue_type" },
    ],
  },

  item_issue_type: {
    type: "question",
    id: "item_issue_type",
    shortLabel: "Issue",
    prompt: "What's the problem?",
    options: [
      { id: "damaged", label: "Arrived damaged", next: "damage_photos" },
      { id: "wrong", label: "Wrong item entirely", next: "term_wrong_item" },
      { id: "missing", label: "Missing parts or pieces", next: "term_missing_parts" },
      { id: "quality", label: "Condition not as described", next: "quality_disclosed" },
    ],
  },

  damage_photos: {
    type: "question",
    id: "damage_photos",
    shortLabel: "Photos",
    prompt: "Do you have photos of the damage?",
    options: [
      { id: "yes", label: "Yes, I have photos", next: "term_damage_approved" },
      { id: "no", label: "Not yet", next: "term_photos_required" },
    ],
  },

  quality_disclosed: {
    type: "question",
    id: "quality_disclosed",
    shortLabel: "Disclosed",
    prompt: "Did the listing mention this condition?",
    options: [
      { id: "yes", label: "Yes, it was disclosed", next: "term_disclosed_no_return" },
      { id: "no", label: "No, this wasn't mentioned", next: "term_not_as_described" },
    ],
  },

  term_no_action: {
    type: "terminal",
    id: "term_no_action",
    tone: "success",
    badgeLabel: "RESOLVED",
    title: "No Action Needed",
    message: "Your item matches the listing. There's nothing further to file here.",
    blocked: false,
    primaryActionKind: "restart",
    primaryActionLabel: "Start a New Check",
  },

  term_missing_claim: {
    type: "terminal",
    id: "term_missing_claim",
    tone: "info",
    badgeLabel: "ACTION NEEDED",
    title: "Report a Missing Package",
    message:
      "The carrier shows this as delivered, but you don't have it. File a missing-package claim and we'll open an investigation with the carrier.",
    blocked: false,
    primaryActionKind: "submit",
    primaryActionLabel: "File Missing Package Claim",
    submittedNote: "Claim filed. The carrier investigation usually takes 2 to 5 business days.",
  },

  term_lost_claim: {
    type: "terminal",
    id: "term_lost_claim",
    tone: "info",
    badgeLabel: "ACTION NEEDED",
    title: "File a Lost Package Claim",
    message:
      "This shipment is confirmed lost, or has gone quiet for too long. You're eligible for a refund or a replacement.",
    blocked: false,
    primaryActionKind: "submit",
    primaryActionLabel: "File Lost Package Claim",
    submittedNote: "Claim filed. You'll get a refund or replacement decision within 3 business days.",
  },

  term_wait: {
    type: "terminal",
    id: "term_wait",
    tone: "warning",
    badgeLabel: "PENDING",
    title: "Not Eligible Yet — Keep Watching",
    message:
      "Carriers often catch up within a few days. Hang on a little longer before filing anything.",
    blocked: true,
    blockedReason: "You can't file a claim until it's been at least 3 days with no tracking movement.",
    primaryActionKind: "recheck",
    primaryActionLabel: "Re-check Tracking Status",
    recheckTarget: "time_since_update",
  },

  term_contact_carrier: {
    type: "terminal",
    id: "term_contact_carrier",
    tone: "warning",
    badgeLabel: "PENDING",
    title: "Contact the Carrier First",
    message:
      "At 3 to 7 days of silence, the carrier asks you to open a trace with them before we can step in.",
    blocked: true,
    blockedReason: "A claim opens only after the carrier trace comes back, or after 7 total days of silence.",
    primaryActionKind: "recheck",
    primaryActionLabel: "Re-check Tracking Status",
    recheckTarget: "time_since_update",
  },

  term_wrong_item: {
    type: "terminal",
    id: "term_wrong_item",
    tone: "success",
    badgeLabel: "ELIGIBLE",
    title: "Wrong Item — Free Return Issued",
    message: "This qualifies for a free return. A prepaid label will be issued for the item you received.",
    blocked: false,
    primaryActionKind: "submit",
    primaryActionLabel: "Request Return Label",
    submittedNote: "Return label requested. Check your email for the prepaid label shortly.",
  },

  term_missing_parts: {
    type: "terminal",
    id: "term_missing_parts",
    tone: "success",
    badgeLabel: "ELIGIBLE",
    title: "Missing Parts — Partial Refund",
    message: "You're eligible for a partial refund covering the missing pieces. No return shipping needed.",
    blocked: false,
    primaryActionKind: "submit",
    primaryActionLabel: "Request Partial Refund",
    submittedNote: "Partial refund requested. It will post to your original payment method.",
  },

  term_damage_approved: {
    type: "terminal",
    id: "term_damage_approved",
    tone: "success",
    badgeLabel: "ELIGIBLE",
    title: "Damage Claim Approved",
    message: "With photos on file, you can get a refund or a replacement for the damaged item.",
    blocked: false,
    primaryActionKind: "submit",
    primaryActionLabel: "Submit Damage Claim",
    submittedNote: "Damage claim submitted along with your photos for review.",
  },

  term_photos_required: {
    type: "terminal",
    id: "term_photos_required",
    tone: "warning",
    badgeLabel: "BLOCKED",
    title: "Photos Required to Continue",
    message: "Damage claims need at least one photo on file before they can be submitted.",
    blocked: true,
    blockedReason: "Add a photo of the damage to unlock this claim.",
    primaryActionKind: "recheck",
    primaryActionLabel: "I Have Photos Now",
    recheckTarget: "damage_photos",
  },

  term_disclosed_no_return: {
    type: "terminal",
    id: "term_disclosed_no_return",
    tone: "danger",
    badgeLabel: "NOT ELIGIBLE",
    title: "Not Eligible for Return",
    message: "The listing disclosed this condition, so this doesn't qualify for a return under policy.",
    blocked: false,
    primaryActionKind: "restart",
    primaryActionLabel: "Start a New Check",
  },

  term_not_as_described: {
    type: "terminal",
    id: "term_not_as_described",
    tone: "success",
    badgeLabel: "ELIGIBLE",
    title: "Return Approved — Not as Described",
    message: "This condition wasn't disclosed in the listing, so you're eligible for a full return.",
    blocked: false,
    primaryActionKind: "submit",
    primaryActionLabel: "Start Return",
    submittedNote: "Return started. A prepaid label and instructions are on their way to your email.",
  },
};
