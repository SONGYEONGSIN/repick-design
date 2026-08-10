import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import screens from "../native/screens.json" with { type: "json" };

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const jsDir = join(root, "app/public/native-app/_expo/static/js/web");
const js = readdirSync(jsDir).filter((f) => f.endsWith(".js")).map((f) => readFileSync(join(jsDir, f), "utf8")).join("");

// `evolve-*` 슬러그는 검사하지 않는다 — 원래 이 단언이 전부를 훑었고, 그것이 틀렸다.
//
// 라운드는 후보를 `native/screens.json`에 `evolve-r<N>-<v>`로 등록하지만 **웹 번들을 재빌드하지
// 않는다.** 그건 설계대로다 — `build-gallery-web.sh`는 `dash-falsify`의 승격 단계에만 있고
// 라운드에는 없다. 커밋된 번들이 존재하는 이유는 갤러리가 `NATIVE_WORKS`의
// `/native-app/index.html?screen=<name>` iframe을 그리기 위해서인데, evolve 슬러그는 승격 전까지
// `NATIVE_WORKS`에 없다. 네이티브 하드게이트도 `validate.sh`가 자체 export를 돌리므로 커밋된
// 번들에 의존하지 않는다. 즉 evolve 화면이 번들에 있어야 할 이유가 어디에도 없다.
//
// 그런데 단언은 `screens.json` 전체를 훑어, **라운드가 하지 않기로 되어 있는 재빌드를 요구**했다.
// 2026-08-10 야간 `auto-native-r2`가 evolve 슬러그 3개를 등록하자 `main`이 빨개졌다(실측:
// `bundle missing "Search & Discover" for evolve-r2-a`). 라운드 동작이 아니라 이 단언의 범위가
// 틀렸다. 영구 슬러그에 대한 보장은 그대로다 — 그게 갤러리가 실제로 여는 것이다.
const permanent = Object.entries(screens).filter(([slug]) => !slug.startsWith("evolve-"));

test("committed native bundle contains each permanent screen's check string (rebuild if this fails)", () => {
  assert.ok(permanent.length > 0, "영구 슬러그가 0개면 이 테스트가 아무것도 보장하지 않는다");
  for (const [slug, { check }] of permanent) {
    assert.ok(js.includes(check), `bundle missing "${check}" for ${slug} — rebuild via native/scripts/build-gallery-web.sh then recommit app/public/native-app`);
  }
});

test("committed native bundle has zero Korean", () => {
  assert.equal((js.match(/[가-힣]/g) || []).length, 0, "Korean found in committed native bundle — rebuild after Englishizing native/src");
});
