import { test } from "node:test";
import assert from "node:assert/strict";
import { SUBSET_IDS, validateSpec } from "./specimen-spec-schema.mjs";
import data from "../app/src/lib/specimen-specs.data.json" with { type: "json" };

// 원래 이 테스트는 `SUBSET_IDS.length === 18`로 목록을 못 박았다. 그건 "조용한 드리프트를
// 막는다"는 보증이었는데, 2026-08-14부터 배치로 목록을 **의도적으로 늘리기** 시작하면서
// 숫자 고정은 매 배치 손대야 하는 상용구가 됐다. 지키려던 보증(승인된 작품이 조용히 빠지지
// 않는다)만 남기고 숫자는 뺀다 — 아래 BASELINE 은 줄어들지 않는다.
const BASELINE = [
  "d29", "d30", "d31", "d32", "d33", "d34", "d35", "d36", "d37", "d38", "d39", "d40",
  "v0", "v6", "v7", "v8", "v9", "v10",
];

test("승인된 작품은 목록에서 사라지지 않는다", () => {
  const dropped = BASELINE.filter((id) => !SUBSET_IDS.includes(id));
  assert.deepEqual(dropped, [], `승인분이 빠졌다: ${dropped.join(", ")}`);
});

test("SUBSET_IDS 에 중복이 없다", () => {
  assert.equal(new Set(SUBSET_IDS).size, SUBSET_IDS.length);
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
