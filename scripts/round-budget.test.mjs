import { test } from 'node:test';
import assert from 'node:assert/strict';
import { roundBudget, unfilledTypes } from './round-budget.mjs';

test('미채움이 0종이면 요청값과 무관하게 1이다', () => {
  // 2026-09-12 에 조건화한 규칙의 핵심. 인라인 스니펫으로 뒀을 때 첫 기회에 안 먹혀
  // (`auto-dash-r26` 이 "연속의 2라운드째" 로 돌았다) 스크립트로 옮기며 고정한다.
  for (const req of [1, 2, 3, 9]) assert.equal(roundBudget(req, []).n, 1, `요청 ${req}`);
});

test('미채움이 있으면 요청·미채움·상한2 중 최소', () => {
  assert.equal(roundBudget(3, ['a', 'b', 'c']).n, 2, '상한 2 가 이긴다');
  assert.equal(roundBudget(2, ['a']).n, 1, '미채움 수가 이긴다');
  assert.equal(roundBudget(1, ['a', 'b']).n, 1, '요청값이 이긴다');
});

test('잘못된 요청값은 1로 떨어진다', () => {
  for (const bad of [undefined, 0, -3, 'x', NaN]) assert.equal(roundBudget(bad, ['a', 'b']).n, 1);
});

test('unfilledTypes — PAGE_TYPES 중 category 가 없는 것만 센다', () => {
  const src = 'export const PAGE_TYPES = ["alpha", "beta", "gamma"] as const;\n category: "beta",';
  assert.deepEqual(unfilledTypes(src).sort(), ['alpha', 'gamma']);
});

test('현재 카탈로그는 미채움 0종이라 예산이 1이다', () => {
  // 실제 상태를 함께 고정한다 — 새 타입이 추가되면 이 단언이 먼저 깨져 알려 준다.
  assert.equal(unfilledTypes().length, 0);
  assert.equal(roundBudget(3).n, 1);
});
