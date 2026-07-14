import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sweepWidths, evaluateSweep } from './dash-sweep.mjs';

const m = (over = {}) => ({
  route: '/dash-evolve/r1/a', width: 1440,
  scrollWidth: 1440, clientWidth: 1440, tables: [], ...over,
});

test('sweepWidths는 데스크톱 각 폭과 -16px 변형, 모바일 390을 오름차순 중복 없이 반환한다', () => {
  const w = sweepWidths();
  assert.ok(w.includes(390) && w.includes(1280) && w.includes(1264) && w.includes(1920) && w.includes(1904));
  assert.deepEqual(w, [...new Set(w)].sort((a, b) => a - b));
});

test('데스크톱 페이지 가로 오버플로는 실패', () => {
  const r = evaluateSweep([m({ scrollWidth: 1493 })]);
  assert.equal(r.pass, false);
  assert.deepEqual(r.failures[0], { route: '/dash-evolve/r1/a', width: 1440, kind: 'page-overflow', by: 53, sel: null });
});

test('데스크톱 테이블(카드 내) 가로 오버플로는 실패', () => {
  const r = evaluateSweep([m({ tables: [{ sel: 'table#0', scrollWidth: 900, clientWidth: 860 }] })]);
  assert.equal(r.pass, false);
  assert.equal(r.failures[0].kind, 'table-overflow');
  assert.equal(r.failures[0].sel, 'table#0');
});

test('모바일(390) 테이블 로컬 스크롤은 허용, 페이지 오버플로는 실패', () => {
  const ok = evaluateSweep([m({ width: 390, scrollWidth: 390, clientWidth: 390, tables: [{ sel: 'table#0', scrollWidth: 700, clientWidth: 358 }] })]);
  assert.equal(ok.pass, true);
  const bad = evaluateSweep([m({ width: 390, scrollWidth: 543, clientWidth: 390 })]);
  assert.equal(bad.pass, false);
  assert.equal(bad.failures[0].by, 153);
});

test('전 폭 무결하면 pass', () => {
  const r = evaluateSweep(sweepWidths().map((width) => m({ width, scrollWidth: width, clientWidth: width })));
  assert.deepEqual(r, { pass: true, failures: [] });
});
