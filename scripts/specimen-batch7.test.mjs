import { test } from "node:test";
import assert from "node:assert/strict";
import { validateSpec } from "./specimen-spec-schema.mjs";
import data from "../app/src/lib/specimen-specs.data.json" with { type: "json" };

for (const id of ["d34", "d35", "d36", "d37", "d38"]) {
  test(`${id} rich spec present and valid`, () => {
    assert.ok(data[id], `${id} missing`);
    assert.deepEqual(validateSpec(data[id]), []);
  });
}
