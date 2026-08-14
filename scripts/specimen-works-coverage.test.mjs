import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { SUBSET_IDS } from "./specimen-spec-schema.mjs";
import data from "../app/src/lib/specimen-specs.data.json" with { type: "json" };

/**
 * Every catalogued work must carry a rich spec.
 *
 * `specimen-subset-complete` already checks `SUBSET_IDS` against the data file, but both sides are
 * hand-maintained: forgetting a newly promoted work leaves them perfectly consistent while the
 * gallery shows "Full spec coming soon". That is exactly what happened — the 2026-08-14 batch took
 * coverage to 48/48, and the next weekly promotion (`v12`, `n8`, `n9`) reopened a three-work hole
 * that nothing measured.
 *
 * So the truth set is `works.ts`, not a list beside it. A promotion that skips its spec fails here,
 * which is the only way the procedure survives being written down.
 */
export function catalogueIds(src = readFileSync("app/src/lib/works.ts", "utf8")) {
  return [...src.matchAll(/id: "([a-z]+\d+)"/g)].map((m) => m[1]);
}

test("works.ts의 모든 작품에 스펙이 있다", () => {
  const ids = catalogueIds();
  assert.ok(ids.length >= 48, `카탈로그를 못 읽었다 — ${ids.length}건`);
  const missing = ids.filter((id) => !data[id]);
  assert.deepEqual(missing, [], `스펙 없는 작품: ${missing.join(", ")} — 승격 시 스펙도 함께 등재한다`);
});

test("SUBSET_IDS가 카탈로그를 그대로 덮는다", () => {
  // 두 목록이 갈라지면 한쪽만 보는 검사가 조용히 통과한다.
  const ids = catalogueIds();
  const uncovered = ids.filter((id) => !SUBSET_IDS.includes(id));
  assert.deepEqual(uncovered, [], `SUBSET_IDS 누락: ${uncovered.join(", ")}`);
});

test("catalogueIds — id 형태만 걷어낸다", () => {
  const src = 'const X = [{ id: "v12", route: "/v12" }, { id: "n8" }];\n// id: "zz9" 는 주석이지만 형태가 같아 걸린다';
  assert.deepEqual(catalogueIds(src), ["v12", "n8", "zz9"]);
});
