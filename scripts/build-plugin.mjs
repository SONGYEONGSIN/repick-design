// 볼트·스킬 원본 → 플러그인 번들. 변환 없는 바이트 복사다.
//
// 왜 사본이 존재하나: 플러그인은 볼트가 없는 레포에서 동작해야 하므로 정본과 정적검사를 데이터로
// 실어 나른다. 사본은 없앨 수 없고, 대신 수동 cp 가 아니라 이 스크립트의 산출물로 둔다 —
// 드리프트는 `build-plugin.test.mjs` 가 바이트 비교로 차단한다.
//
// 번들의 파일명이 볼트와 같기 때문에 스킬의 레포-내 경로와 스탠드얼론 경로가 같은 문장이 된다:
// 정본은 `vault/00-principles/` 또는 `<플러그인>/canon/` 에 같은 이름으로 있다.
//
// 싣지 않는 것: `page-brief-repo.md`(이 레포의 바인딩 — 남의 레포에서 거짓이 된다) ·
// `curation-criteria`·`questions-queue`(자율 루프 내부 장부) · `*-deltas-provisional.jsonl`(미종결 관찰).

import { mkdirSync, readdirSync, readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';

export const CANON_SRC = 'vault/00-principles';
export const SKILL_SRC = '.claude/skills/page-commission/SKILL.md';
export const CHECKER_SRC = 'scripts/dash-static-check.mjs';

/** 번들에 싣는 정본. 코어 + 타입 프로파일 전부 — 레포 바인딩(`page-brief-repo`)은 제외한다. */
export function canonFiles(canonDir) {
  return readdirSync(canonDir)
    .filter((f) => f.endsWith('.md'))
    .filter((f) => f === 'page-brief-core.md' || f === 'dash-brief-v3.md' || f === 'design-principles.md' || f.startsWith('brief-'))
    .sort();
}

/** 번들 안에서 해소되지 않는 `[[링크]]` — 루프 내부 문서를 가리키는 것들이라 예상된 값이다. */
export function danglingLinks(texts, shipped) {
  const names = new Set(shipped.map((f) => f.replace(/\.md$/, '')));
  const out = new Set();
  for (const t of texts) {
    for (const m of t.matchAll(/\[\[([a-z0-9-]+)\]\]/g)) if (!names.has(m[1])) out.add(m[1]);
  }
  return [...out].sort();
}

export function buildPlugin({ repoRoot = '.', pluginDir }) {
  const canonDir = join(repoRoot, CANON_SRC);
  const files = canonFiles(canonDir);

  // 잔존물 제거 후 재생성 — 복사만 하면 볼트에서 삭제된 파일이 번들에 남는다.
  const destCanon = join(pluginDir, 'canon');
  rmSync(destCanon, { recursive: true, force: true });
  mkdirSync(destCanon, { recursive: true });

  const texts = [];
  for (const f of files) {
    const body = readFileSync(join(canonDir, f));
    texts.push(body.toString('utf8'));
    writeFileSync(join(destCanon, f), body);
  }

  writeFileSync(join(pluginDir, 'SKILL.md'), readFileSync(join(repoRoot, SKILL_SRC)));

  const destScripts = join(pluginDir, 'scripts');
  mkdirSync(destScripts, { recursive: true });
  writeFileSync(join(destScripts, 'static-check.mjs'), readFileSync(join(repoRoot, CHECKER_SRC)));

  return { canonCount: files.length, files, dangling: danglingLinks(texts, files) };
}

const isMain = process.argv[1] && import.meta.url.endsWith(basename(process.argv[1]));
if (isMain) {
  const pluginDir = process.argv[2] ?? 'plugin/skills/page-commission';
  if (!existsSync(pluginDir)) mkdirSync(pluginDir, { recursive: true });
  const { canonCount, dangling } = buildPlugin({ pluginDir });
  console.log(`✓ ${pluginDir} — 정본 ${canonCount}종 + SKILL.md + static-check.mjs`);
  if (dangling.length) console.log(`  번들 밖 링크(예상): ${dangling.join(' · ')}`);
}
