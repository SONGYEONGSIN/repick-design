// native/src/evolve/r54/b/data.ts — deterministic dummy data for the
// Report a Counterfeit Item wizard (auto-native-r54 candidate b).
// No Math.random / Date.now / bare `new Date()` anywhere — every value below
// is a fixed literal, so this screen renders identically on every run.

export type ReportReasonId =
  | "quality_defect"
  | "missing_markings"
  | "serial_mismatch"
  | "other";

export type ReportReason = {
  id: ReportReasonId;
  label: string;
  helpText: string;
};

// Fixed, short list — exactly the four reasons the brief specifies, in a
// fixed order so step 1's layout never shifts between runs.
export const REPORT_REASONS: ReportReason[] = [
  {
    id: "quality_defect",
    label: "Visible quality defect inconsistent with authentic",
    helpText:
      "Stitching, hardware, material, or print quality looks off for this brand.",
  },
  {
    id: "missing_markings",
    label: "Missing or incorrect authentication markings",
    helpText:
      "Date codes, holograms, engravings, or stamps are absent or wrong.",
  },
  {
    id: "serial_mismatch",
    label: "Serial number mismatch",
    helpText:
      "The serial number doesn't match the listing or the brand's own format.",
  },
  {
    id: "other",
    label: "Other",
    helpText: "Something else about this item doesn't look right.",
  },
];

export const MIN_NOTE_LENGTH = 20;
export const MAX_NOTE_LENGTH = 500;

export type ReportedItem = {
  title: string;
  brand: string;
  orderRef: string;
  sellerName: string;
};

// The order this report is being filed against. Context only — shown once,
// persistently, above the stepper; nothing on this screen gates on it.
export const REPORTED_ITEM: ReportedItem = {
  title: "Quilted Flap Shoulder Bag",
  brand: "Maison Vale",
  orderRef: "ORD-55214",
  sellerName: "velvet.archive",
};

export type WizardStepId = "reason" | "details" | "review";

export type WizardStepMeta = {
  id: WizardStepId;
  shortLabel: string;
  title: string;
};

// The ordered step definitions the stepper walks through. Exactly 3, fixed
// order — the architecture the brief calls for (an array of step
// definitions + a currentStepIndex into it), not a single blocked/ready/done
// band.
export const WIZARD_STEPS: WizardStepMeta[] = [
  { id: "reason", shortLabel: "Reason", title: "Why are you reporting this item?" },
  { id: "details", shortLabel: "Details", title: "Describe what you found" },
  { id: "review", shortLabel: "Review", title: "Review your report" },
];

// Shown once the report has been submitted. A real backend would mint the
// reference; here it is a fixed literal so the confirmation state renders
// identically every time.
export const CASE_REFERENCE = "CR-30842";
export const SUBMITTED_NOTE =
  "Our authentication team reviews reports within 2 business days.";
