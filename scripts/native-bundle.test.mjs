import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import screens from "../native/screens.json" with { type: "json" };

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const jsDir = join(root, "app/public/native-app/_expo/static/js/web");
const js = readdirSync(jsDir).filter((f) => f.endsWith(".js")).map((f) => readFileSync(join(jsDir, f), "utf8")).join("");

test("committed native bundle contains each screen's check string (rebuild if this fails)", () => {
  for (const [slug, { check }] of Object.entries(screens)) {
    assert.ok(js.includes(check), `bundle missing "${check}" for ${slug} — rebuild via native/scripts/build-gallery-web.sh then recommit app/public/native-app`);
  }
});

test("committed native bundle has zero Korean", () => {
  assert.equal((js.match(/[가-힣]/g) || []).length, 0, "Korean found in committed native bundle — rebuild after Englishizing native/src");
});
