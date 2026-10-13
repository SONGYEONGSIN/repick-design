// native/src/evolve/r38/c/data.ts
//
// Deterministic dummy data for the Return Shipping Label Generator.
// Nothing here uses Math.random, Date.now, or an argument-less `new Date()` —
// every value is a fixed literal or a pure function of fixed literals, so the
// screen renders identically on every load (including the mock barcode grid).

export type ReturnReason = {
  id: string;
  label: string;
  detail: string;
};

export const returnReasons: ReturnReason[] = [
  {
    id: "wrong-size",
    label: "Wrong size or fit",
    detail: "The item doesn't fit the way it was expected to.",
  },
  {
    id: "not-as-described",
    label: "Not as described",
    detail: "The item differs from the listing photos or details.",
  },
  {
    id: "arrived-damaged",
    label: "Arrived damaged",
    detail: "The item was damaged before it reached you.",
  },
  {
    id: "wrong-item",
    label: "Wrong item sent",
    detail: "This isn't the item that was ordered.",
  },
  {
    id: "changed-mind",
    label: "Changed my mind",
    detail: "No longer needed — the item itself is fine.",
  },
];

export type ReturnAddress = {
  fullName: string;
  streetLine1: string;
  streetLine2: string;
  cityStateZip: string;
  country: string;
};

export const returnAddress: ReturnAddress = {
  fullName: "Repick Returns Center",
  streetLine1: "4100 Distribution Way",
  streetLine2: "Suite 220",
  cityStateZip: "Columbus, OH 43215",
  country: "United States",
};

export const labelInfo = {
  carrierName: "ParcelPost Ground",
  serviceLevel: "Ground Return, 5-7 business days",
  trackingNumber: "RP4892017735US",
};

export const carrierInstructions: string[] = [
  "Pack the item securely, in its original packaging if you still have it.",
  "Attach this label to the outside of the box, covering any old labels.",
  "Drop it off at any ParcelPost location, or hand it to your mail carrier.",
];

// --- Deterministic mock barcode grid -----------------------------------
// A visual stand-in for a scannable barcode: a fixed grid of filled/empty
// squares derived purely from the tracking number's character codes plus the
// cell's row/column position. Same seed in, same grid out, every time — this
// is intentionally NOT a real barcode encoding, just a believable mock visual
// built from View elements by the screen.

export const BARCODE_GRID_COLUMNS = 16;
export const BARCODE_GRID_ROWS = 5;

function buildBarcodeRows(
  seed: string,
  columns: number,
  rows: number
): boolean[][] {
  const grid: boolean[][] = [];
  for (let row = 0; row < rows; row++) {
    const rowCells: boolean[] = [];
    for (let col = 0; col < columns; col++) {
      const charCode = seed.charCodeAt((row * columns + col) % seed.length);
      rowCells.push((charCode + row * 3 + col) % 3 === 0);
    }
    grid.push(rowCells);
  }
  return grid;
}

export const mockBarcodeRows: boolean[][] = buildBarcodeRows(
  labelInfo.trackingNumber,
  BARCODE_GRID_COLUMNS,
  BARCODE_GRID_ROWS
);
