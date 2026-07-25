import { test } from "node:test";
import assert from "node:assert/strict";
import { validateSpec } from "./specimen-spec-schema.mjs";
import data from "../app/src/lib/specimen-specs.data.json" with { type: "json" };

for (const id of ["d30", "d31", "d32", "d33"]) {
  test(`${id} rich spec present and valid`, () => {
    assert.ok(data[id], `${id} missing`);
    assert.deepEqual(validateSpec(data[id]), []);
  });
}
