import { test } from "node:test";
import assert from "node:assert/strict";
import { validateSpec } from "./specimen-spec-schema.mjs";
import data from "../app/src/lib/specimen-specs.data.json" with { type: "json" };

// Batch 8 — the four works promoted by the 2026-07-30 weekly falsification (PR #28).
for (const id of ["d39", "d40", "v9", "v10"]) {
  test(`${id} rich spec present and valid`, () => {
    assert.ok(data[id], `${id} missing`);
    assert.deepEqual(validateSpec(data[id]), []);
  });
}

// The palette hexes must be the ones actually used by each route's source, not invented.
// (scripts/extract-palette.mjs is the authoring aid that produced these.)
test("batch8 palettes cite each work's real accent", () => {
  const accents = { d39: "#00a6f4", d40: "#615fff", v9: "#6e56cf", v10: "#6e56cf" };
  for (const [id, hex] of Object.entries(accents)) {
    const hexes = data[id].palette.map((s) => s.hex);
    assert.ok(hexes.includes(hex), `${id} palette missing its accent ${hex} (got ${hexes.join(", ")})`);
  }
});
