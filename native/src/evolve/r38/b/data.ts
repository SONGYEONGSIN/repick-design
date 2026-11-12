// native/src/evolve/r38/b/data.ts
//
// Deterministic data for the Seller Annual Tax Documents screen.
//
// This is NOT "Tax Export Tagging" (a seller marking individual transactions
// business/personal for their own export). This screen lists the
// marketplace's own OFFICIAL annual tax documents — one group per tax year
// the seller has sold on the platform, each group holding the 1-3 fixed
// forms the marketplace issued for that year (a 1099-K-equivalent and,
// where relevant, a supplementary transaction summary or a correction).
//
// No Math.random, no Date.now, no argument-less `new Date()` — every record
// below is a fixed literal, and `buildTaxDocumentListItems` only rearranges
// those literals into a flat, two-level (year-header + document-row) list;
// it never invents or derives new values.

export type TaxDocumentKind = "1099-K" | "Corrected 1099-K" | "Transaction Summary";

export interface TaxDocumentRecord {
  id: string;
  formNumberLabel: string;
  kind: TaxDocumentKind;
  fileFormat: "PDF";
  issuedDateLabel: string;
  fileSizeLabel: string;
  /** Gross amount the marketplace reported to the tax authority for this document, if any. */
  totalReportedAmount?: number;
  /** A short explanatory note shown under the row (threshold notice, correction notice, etc). */
  noteLabel?: string;
}

export interface TaxYearPendingNotice {
  reasonLabel: string;
}

export interface TaxYearGroup {
  taxYear: number;
  documents: TaxDocumentRecord[];
  /** Present when the year's filing season hasn't closed yet — no documents to show. */
  pending?: TaxYearPendingNotice;
}

// ---- fixed literal records, newest tax year first ----

const taxYear2025_1099k: TaxDocumentRecord = {
  id: "tax-doc-2025-1099k",
  formNumberLabel: "Form 1099-K",
  kind: "1099-K",
  fileFormat: "PDF",
  issuedDateLabel: "Jan 31, 2026",
  fileSizeLabel: "182 KB",
  totalReportedAmount: 18420000,
};

const taxYear2025_summary: TaxDocumentRecord = {
  id: "tax-doc-2025-summary",
  formNumberLabel: "Annual Transaction Summary",
  kind: "Transaction Summary",
  fileFormat: "PDF",
  issuedDateLabel: "Jan 31, 2026",
  fileSizeLabel: "96 KB",
};

const taxYear2024_summary: TaxDocumentRecord = {
  id: "tax-doc-2024-summary",
  formNumberLabel: "Annual Transaction Summary",
  kind: "Transaction Summary",
  fileFormat: "PDF",
  issuedDateLabel: "Jan 31, 2025",
  fileSizeLabel: "88 KB",
  noteLabel:
    "Your 2024 sales were below the 1099-K reporting threshold, so no 1099-K was issued for this year.",
};

const taxYear2023_1099k: TaxDocumentRecord = {
  id: "tax-doc-2023-1099k",
  formNumberLabel: "Form 1099-K",
  kind: "1099-K",
  fileFormat: "PDF",
  issuedDateLabel: "Jan 31, 2024",
  fileSizeLabel: "176 KB",
  totalReportedAmount: 9650000,
};

const taxYear2023_1099kCorrected: TaxDocumentRecord = {
  id: "tax-doc-2023-1099k-corrected",
  formNumberLabel: "Form 1099-K (Corrected)",
  kind: "Corrected 1099-K",
  fileFormat: "PDF",
  issuedDateLabel: "Mar 18, 2024",
  fileSizeLabel: "177 KB",
  totalReportedAmount: 9825000,
  noteLabel: "Corrects the gross amount reported on the original Jan 31, 2024 form.",
};

const taxYear2023_summary: TaxDocumentRecord = {
  id: "tax-doc-2023-summary",
  formNumberLabel: "Annual Transaction Summary",
  kind: "Transaction Summary",
  fileFormat: "PDF",
  issuedDateLabel: "Jan 31, 2024",
  fileSizeLabel: "81 KB",
};

export const taxYearGroups: TaxYearGroup[] = [
  {
    taxYear: 2026,
    documents: [],
    pending: {
      reasonLabel:
        "Documents for the 2026 tax year are issued after the filing season closes, by Jan 31, 2027.",
    },
  },
  {
    taxYear: 2025,
    documents: [taxYear2025_1099k, taxYear2025_summary],
  },
  {
    taxYear: 2024,
    documents: [taxYear2024_summary],
  },
  {
    taxYear: 2023,
    documents: [taxYear2023_1099k, taxYear2023_1099kCorrected, taxYear2023_summary],
  },
];

// ---- flattening into a two-level (year-header -> document-row) list ----

export type TaxDocListItem =
  | { type: "yearHeader"; id: string; taxYear: number; captionLabel: string }
  | { type: "pending"; id: string; taxYear: number; reasonLabel: string }
  | { type: "document"; id: string; taxYear: number; record: TaxDocumentRecord };

export function buildTaxDocumentListItems(groups: TaxYearGroup[]): TaxDocListItem[] {
  const items: TaxDocListItem[] = [];
  for (const group of groups) {
    const documentCount = group.documents.length;
    const captionLabel = group.pending
      ? "Not yet available"
      : `${documentCount} document${documentCount === 1 ? "" : "s"}`;
    items.push({
      type: "yearHeader",
      id: `year-header-${group.taxYear}`,
      taxYear: group.taxYear,
      captionLabel,
    });
    if (group.pending) {
      items.push({
        type: "pending",
        id: `year-pending-${group.taxYear}`,
        taxYear: group.taxYear,
        reasonLabel: group.pending.reasonLabel,
      });
    }
    for (const record of group.documents) {
      items.push({
        type: "document",
        id: record.id,
        taxYear: group.taxYear,
        record,
      });
    }
  }
  return items;
}

/** Indices of every "yearHeader" entry in a flattened list — used for sticky section headers. */
export function findYearHeaderIndices(items: TaxDocListItem[]): number[] {
  const indices: number[] = [];
  items.forEach((item, index) => {
    if (item.type === "yearHeader") {
      indices.push(index);
    }
  });
  return indices;
}

/**
 * "KRW 1,842,000" style formatting — Latin-letter currency notation, chosen
 * deliberately over the bare ₩ glyph: at body text size its horizontal
 * stroke can sit flush against an adjacent digit and read like a
 * strikethrough, so this screen avoids it outright rather than adding
 * spacing workarounds.
 */
export function formatKRW(amount: number): string {
  const roundedAbs = Math.round(Math.abs(amount));
  const digits = String(roundedAbs);
  let grouped = "";
  for (let i = 0; i < digits.length; i += 1) {
    const fromEnd = digits.length - i;
    grouped += digits[i];
    if (fromEnd > 1 && fromEnd % 3 === 1) {
      grouped += ",";
    }
  }
  return `${amount < 0 ? "-" : ""}KRW ${grouped}`;
}
