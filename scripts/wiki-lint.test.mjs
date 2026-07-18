import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractLinks, lintVault } from './wiki-lint.mjs';

test('extractLinks는 alias·경로 포함 target을 원형으로 추출한다', () => {
  const md = `[[design-principles]] · [[20-generations/2026-07-06-landing/DECISION|R1]] 텍스트 [[curation-criteria|기준]]`;
  assert.deepEqual(extractLinks(md), ['design-principles', '20-generations/2026-07-06-landing/DECISION', 'curation-criteria']);
});

test('broken: 실존하지 않는 대상 링크를 잡는다', () => {
  const files = {
    '🏠 홈.md': '[[있는노트]] [[없는노트]]',
    '00-principles/있는노트.md': '내용',
    'index.md': '- [[있는노트]]',
  };
  const r = lintVault(files);
  assert.deepEqual(r.broken, ['🏠 홈.md: [[없는노트]]']);
});

test('orphans: 인바운드 0인 노트를 잡되 index.md발 링크는 세지 않는다', () => {
  const files = {
    '🏠 홈.md': '[[a]]',
    '00-principles/a.md': '',
    '00-principles/b.md': '',
    'index.md': '- [[a]]\n- [[b]]',
  };
  const r = lintVault(files);
  assert.deepEqual(r.orphans, ['00-principles/b.md']);
});

test('orphans: 홈 MOC와 index.md 자신은 검사 대상이 아니다', () => {
  const files = { '🏠 홈.md': '', 'index.md': '' };
  assert.deepEqual(lintVault(files).orphans, []);
});

test('unindexed: index.md 미등재를 잡고, 10-references는 README만 요구한다', () => {
  const files = {
    '🏠 홈.md': '[[a]] [[README]] [[DECISION]]',
    '00-principles/a.md': '',
    '10-references/README.md': '',
    '10-references/mercury.design.md': '',
    '20-generations/2026-07-15-auto-dash-r1/DECISION.md': '',
    'index.md': '- [[a]]',
  };
  const r = lintVault(files);
  assert.deepEqual(r.unindexed.sort(), ['10-references/README.md', '20-generations/2026-07-15-auto-dash-r1/DECISION.md']);
});

test('20-generations DECISION은 경로 기준 해석 — 다중 라운드 미등재를 각각 잡는다', () => {
  const files = {
    '🏠 홈.md': '[[a]] [[README]] [[20-generations/r1/DECISION]] [[20-generations/r2/DECISION]]',
    '00-principles/a.md': '',
    '10-references/README.md': '',
    '20-generations/r1/DECISION.md': '',
    '20-generations/r2/DECISION.md': '',
    'index.md': '- [[a]]\n- [[README]]\n- [[20-generations/r1/DECISION]]',
  };
  const r = lintVault(files);
  assert.deepEqual(r.unindexed, ['20-generations/r2/DECISION.md']); // r1 등재됨, r2 미등재만
  assert.deepEqual(r.broken, []); // 두 링크 다 실존 파일로 해석
});

test('20-generations 죽은 DECISION 링크를 broken으로 잡는다', () => {
  const files = {
    '🏠 홈.md': '[[20-generations/GHOST/DECISION]]',
    'index.md': '',
  };
  assert.deepEqual(lintVault(files).broken, ['🏠 홈.md: [[20-generations/GHOST/DECISION]]']);
});

test('클린 vault는 위반 0', () => {
  const files = {
    '🏠 홈.md': '[[a]] [[README]]',
    '00-principles/a.md': '[[README]]',
    '10-references/README.md': '',
    'index.md': '- [[a]]\n- [[README]]',
  };
  assert.deepEqual(lintVault(files), { orphans: [], broken: [], unindexed: [] });
});
