import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { canonFiles, danglingLinks, CANON_SRC, SKILL_SRC, CHECKER_SRC } from './build-plugin.mjs';

const BUNDLE = 'plugin/skills/page-commission';

test('canonFiles — 코어와 타입 프로파일은 싣고 레포 바인딩은 싣지 않는다', () => {
  const files = canonFiles(CANON_SRC);
  assert.ok(files.includes('page-brief-core.md'), '코어는 싣는다');
  assert.ok(files.includes('brief-careers.md'), '타입 프로파일은 싣는다');
  assert.ok(!files.includes('page-brief-repo.md'), '레포 바인딩은 남의 레포에서 거짓이 된다');
  assert.ok(!files.includes('curation-criteria.md'), '루프 내부 장부는 안 싣는다');
  assert.ok(!files.includes('questions-queue.md'), '루프 내부 장부는 안 싣는다');
});

test('danglingLinks — 번들에 없는 링크만 골라낸다', () => {
  const d = danglingLinks(['[[page-brief-core]]와 [[curation-criteria]]'], ['page-brief-core.md']);
  assert.deepEqual(d, ['curation-criteria']);
});

// 이 셋이 이 번들 구조의 존재 이유다. 사본은 없앨 수 없으니 손으로 복사하지 않고
// 빌드 산출물로 두고, 원본과 바이트가 갈라지면 여기서 막는다.
test('드리프트 — 번들 정본이 볼트 원본과 바이트 동일', () => {
  if (!existsSync(BUNDLE)) return; // 번들 미생성 상태에서는 건너뛴다
  const files = canonFiles(CANON_SRC);
  const shipped = readdirSync(`${BUNDLE}/canon`).filter((f) => f.endsWith('.md')).sort();
  assert.deepEqual(shipped, files, '번들 목록이 원본 선택과 일치 (삭제 전파 포함)');
  for (const f of files) {
    assert.deepEqual(
      readFileSync(`${BUNDLE}/canon/${f}`),
      readFileSync(`${CANON_SRC}/${f}`),
      `${f} 가 볼트와 갈라졌다 — node scripts/build-plugin.mjs 를 다시 돌려라`,
    );
  }
});

test('드리프트 — 번들 SKILL.md가 레포 스킬과 바이트 동일', () => {
  if (!existsSync(`${BUNDLE}/SKILL.md`)) return;
  assert.deepEqual(readFileSync(`${BUNDLE}/SKILL.md`), readFileSync(SKILL_SRC),
    'SKILL.md 가 갈라졌다 — 스킬은 한 벌만 존재한다');
});

test('드리프트 — 번들 정적검사가 원본과 바이트 동일', () => {
  if (!existsSync(`${BUNDLE}/scripts/static-check.mjs`)) return;
  assert.deepEqual(readFileSync(`${BUNDLE}/scripts/static-check.mjs`), readFileSync(CHECKER_SRC),
    'static-check.mjs 가 갈라졌다');
});

// 번들은 npm 의존이 없어야 한다 — 남의 레포에 install 을 요구하는 순간 "설치하고 바로 쓴다"가 깨진다.
test('번들 정적검사는 node 내장 모듈만 쓴다', () => {
  const src = readFileSync(CHECKER_SRC, 'utf8');
  const imports = [...src.matchAll(/^import .* from '([^']+)';/gm)].map((m) => m[1]);
  assert.ok(imports.length > 0, 'import 을 찾지 못했다면 이 테스트가 무의미하다');
  for (const i of imports) assert.ok(i.startsWith('node:'), `외부 의존 발견: ${i}`);
});
