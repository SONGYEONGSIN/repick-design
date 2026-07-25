import { test } from "node:test";
import assert from "node:assert/strict";
import { SUBSET_IDS, validateSpec } from "./specimen-spec-schema.mjs";
import data from "../app/src/lib/specimen-specs.data.json" with { type: "json" };

test("all 15 subset ids have a valid rich spec", () => {
  const missing = SUBSET_IDS.filter((id) => !data[id]);
  assert.deepEqual(missing, [], `missing: ${missing.join(", ")}`);
  for (const id of SUBSET_IDS) assert.deepEqual(validateSpec(data[id]), [], `${id}: ${validateSpec(data[id]).join("; ")}`);
});

test("data file contains only subset ids (no strays)", () => {
  const strays = Object.keys(data).filter((id) => !SUBSET_IDS.includes(id));
  assert.deepEqual(strays, [], `unexpected ids: ${strays.join(", ")}`);
});
