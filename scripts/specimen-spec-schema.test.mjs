import { test } from "node:test";
import assert from "node:assert/strict";
import { SUBSET_IDS, validateSpec } from "./specimen-spec-schema.mjs";
import data from "../app/src/lib/specimen-specs.data.json" with { type: "json" };

test("SUBSET_IDS is exactly the 15 approved ids", () => {
  assert.equal(SUBSET_IDS.length, 15);
  assert.ok(SUBSET_IDS.includes("d29") && SUBSET_IDS.includes("v0") && SUBSET_IDS.includes("n1"));
});

test("validateSpec rejects an incomplete spec", () => {
  assert.ok(validateSpec({ id: "x", palette: [], dosDonts: [] }).length > 0);
});

test("validateSpec accepts a well-formed spec", () => {
  const good = {
    id: "x",
    palette: [{ token: "zinc-900", hex: "#18181b", role: "Ink", usage: "Primary text" },
      { token: "indigo-600", hex: "#4f46e5", role: "Accent", usage: "Primary actions" },
      { token: "zinc-200", hex: "#e4e4e7", role: "Border", usage: "Hairlines" }],
    typography: "Pretendard; oversized numeric KPIs.",
    spacing: "4/8 rhythm; 12px card radius.",
    philosophy: "Pure-white service-grade calm.",
    dosDonts: [{ do: "Keep one accent", dont: "Add a second hue" }, { do: "a", dont: "b" }, { do: "c", dont: "d" }],
    agentPrompt: "# Recreate\nBuild a pure-white dashboard...",
  };
  assert.deepEqual(validateSpec(good), []);
});

test("every spec present in the data file is well-formed", () => {
  for (const [id, spec] of Object.entries(data)) {
    assert.deepEqual(validateSpec(spec), [], `${id}: ${validateSpec(spec).join("; ")}`);
  }
});
