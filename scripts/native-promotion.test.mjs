import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";

/**
 * A promoted native screen must not still look like a candidate.
 *
 * Candidates live at `native/src/evolve/r<N>/<v>/`, three levels below `tokens.ts`; promotion moves
 * them one level down to `native/src/<name>/`, where `../tokens` is correct. The falsification skill
 * has said so for months and it was still fixed by hand on `n4`, `n6`, `n7` and `r7/a` — four
 * consecutive promotions. A rule nothing measures is a rule the loop does not have, so this is the
 * measurement.
 *
 * Two halves, both seen in the wild:
 *
 * 1. **The import** — `tsc` does catch this one, but only after the gate runs. That is late enough
 *    that every promotion so far noticed it by hand first.
 * 2. **The header comment** — nothing catches this at all. `account` and `offer-thread` still
 *    claimed to live at `src/evolve/r2/c/` and `src/evolve/r1/b/` long after promotion, which is a
 *    file telling the next reader something false about where it is.
 */
const SRC = "native/src";

export function promotedScreenDirs(root = SRC) {
  return readdirSync(root)
    .filter((n) => n !== "evolve" && statSync(`${root}/${n}`).isDirectory())
    .map((n) => `${root}/${n}`);
}

/** 파일 하나의 잔재. 순수 함수라 단위로 검증한다 — 디렉토리 순회는 아래가 맡는다. */
export function residueIn(path, src) {
  const out = [];
  // 후보 깊이(3단계)의 상대경로 — 승격 위치에서는 `../` 하나가 맞다.
  for (const m of src.matchAll(/from\s+["'](\.\.\/\.\.\/\.\.\/[^"']*)["']/g)) {
    out.push({ file: path, kind: "deep-import", detail: m[1] });
  }
  // 자기 위치를 후보 경로로 적어 둔 헤더 주석 — 다음 읽는 사람에게 거짓을 말한다.
  for (const m of src.matchAll(/src\/evolve\/r\d+\/[a-z]\//g)) {
    out.push({ file: path, kind: "stale-path", detail: m[0] });
  }
  return out;
}

export function candidateResidue(dir) {
  return readdirSync(dir)
    .filter((n) => /\.tsx?$/.test(n))
    .flatMap((f) => residueIn(`${dir}/${f}`, readFileSync(`${dir}/${f}`, "utf8")));
}

test("승격된 native 화면에 후보 시절 흔적이 없다", () => {
  const found = promotedScreenDirs().flatMap((d) => candidateResidue(d));
  assert.deepEqual(
    found.map((f) => `${f.file} [${f.kind}] ${f.detail}`),
    [],
    "승격 시 상대경로와 헤더 경로를 함께 고친다 (dash-falsify §4 후보 킵)",
  );
});

test("residueIn — 후보 깊이 임포트를 잡는다", () => {
  const hit = residueIn("x.tsx", 'import { tokens } from "../../../tokens";');
  assert.equal(hit.length, 1);
  assert.equal(hit[0].kind, "deep-import");
});

test("residueIn — 옛 경로 헤더 주석을 잡는다", () => {
  const hit = residueIn("x.ts", "// native/src/evolve/r2/c/data.ts — auto-native-r2 candidate c\n");
  assert.equal(hit.length, 1);
  assert.equal(hit[0].kind, "stale-path");
});

test("residueIn — 올바른 승격본은 통과", () => {
  const ok = residueIn("x.ts", '// native/src/account/data.ts\nimport { tokens } from "../tokens";');
  assert.deepEqual(ok, []);
});
