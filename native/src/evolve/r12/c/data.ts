// native/src/evolve/r12/c/data.ts — auto-native-r12 candidate c: Item Authentication Certificate.
//
// All values are fixed literals — no Math.random / Date.now / argument-less `new Date()` — so the
// screen renders identically on every load.

export type CheckpointStatus = "pass" | "note";

export type Checkpoint = {
  id: string;
  name: string;
  status: CheckpointStatus;
  /** Short label shown next to the checkpoint name. */
  verdictLabel: string;
  /** The inspector's note explaining what was checked and what was found. */
  note: string;
  timestampLabel: string;
};

export const CERTIFICATE_ID = "RPK-AUTH-2026-081842";
export const ISSUED_LABEL = "Aug 18, 2026";
export const INTAKE_PHOTO_LABEL = "Captured at intake · Aug 15, 2026";

export const ITEM = {
  title: "Quilted Flap Bag, Medium",
  brand: "Chanel",
  category: "Handbag · Leather goods",
  refNumber: "A01112",
  conditionLabel: "Excellent (A)",
};

export const INSPECTOR = {
  name: "J. Rho",
  credential: "Senior Authenticator, Repick Trust Lab",
};

export const CHECKPOINTS: Checkpoint[] = [
  {
    id: "hardware",
    name: "Hardware",
    status: "pass",
    verdictLabel: "Passed",
    note: "Zipper pull, turn-lock, and chain links match verified reference specs for this production year.",
    timestampLabel: "Checked Aug 17, 2026 · 10:42",
  },
  {
    id: "stitching",
    name: "Stitching",
    status: "pass",
    verdictLabel: "Passed",
    note: "Stitch count and thread tension are consistent with authentic construction, 8 stitches per inch.",
    timestampLabel: "Checked Aug 17, 2026 · 10:51",
  },
  {
    id: "material",
    name: "Material",
    status: "pass",
    verdictLabel: "Passed",
    note: "Leather grain, weight, and tannage are consistent with authentic sourcing for this line.",
    timestampLabel: "Checked Aug 17, 2026 · 11:03",
  },
  {
    id: "serial",
    name: "Serial match",
    status: "pass",
    verdictLabel: "Passed",
    note: "Serial number matches the manufacturer's production ledger for reference A01112.",
    timestampLabel: "Checked Aug 17, 2026 · 11:15",
  },
  {
    id: "lining",
    name: "Interior lining",
    status: "note",
    verdictLabel: "Passed, advisory",
    note: "Lining shows wear consistent with the stated production year. This does not affect the authenticity verdict.",
    timestampLabel: "Checked Aug 17, 2026 · 11:22",
  },
];

export const OVERALL = {
  headline: "Authentic",
  summary:
    "This item passed all 5 authentication checkpoints performed by Repick's Trust Lab. One checkpoint carries an advisory note that does not change the verdict.",
};

export type ShareDestination = {
  id: string;
  label: string;
  feedback: string;
};

export const SHARE_DESTINATIONS: ShareDestination[] = [
  {
    id: "buyer",
    label: "Message to buyer",
    feedback: "Certificate sent to the buyer's chat thread.",
  },
  {
    id: "link",
    label: "Copy certificate link",
    feedback: "Certificate link copied — ready to share.",
  },
  {
    id: "image",
    label: "Save as image",
    feedback: "Certificate image saved to Photos.",
  },
];

export const DOWNLOAD_FEEDBACK = "Certificate saved as a PDF to your device.";

export const VOID_NOTE =
  "This certificate reflects the item's condition at the time of inspection and becomes void if the item is structurally altered afterward.";
