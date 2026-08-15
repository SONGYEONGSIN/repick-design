import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sweepWidths, evaluateSweep, evaluateFocus } from './dash-sweep.mjs';

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

test('evaluateFocus — 포커스 시 보이는 표시가 생기면 통과', () => {
  const r = evaluateFocus([{ route: '/x', width: 1440, focusables: [
    { sel: 'button#0', before: '#~#~#~#', after: 'o:solid:2px:rgb(1, 2, 3)#~#~#~#' },
    { sel: 'input#1', before: '#~#~#rgba(0,0,0,.1) 0px 1px 3px~#', after: '#~#rgb(9,9,9) 0px 0px 0px 2px~#rgba(0,0,0,.1) 0px 1px 3px~#' },
  ] }]);
  assert.equal(r.pass, true);
  assert.deepEqual(r.failures, []);
});

test('evaluateFocus — 표시가 전혀 없으면 실패', () => {
  // `outline-none` 만 걸고 링을 안 준 상태다. `d32` 톱바 검색 입력이 실제로 이랬고,
  // 정적 규칙·Lighthouse 둘 다 이걸 못 잡아 a11y 100 을 받았다.
  const r = evaluateFocus([{ route: '/x', width: 1440, focusables: [
    { sel: 'input#3', before: '#~#~#~#', after: '#~#~#~#' },
  ] }]);
  assert.equal(r.pass, false);
  assert.equal(r.failures[0].kind, 'focus-invisible');
  assert.equal(r.failures[0].sel, 'input#3');
  assert.equal(r.failures[0].route, '/x');
});

test('evaluateFocus — 상시 그림자만 있으면 실패 (그건 포커스 표시가 아니다)', () => {
  // 모달의 shadow-xl 과 버튼의 shadow-sm 은 포커스와 무관하게 늘 있다. 그걸 표시로 세면
  // 팔레트 입력이 전부 통과하고, 반대로 '변화'만 보면 shadow-sm 버튼이 거짓 실패한다.
  const r = evaluateFocus([{ route: '/x', width: 1440, focusables: [
    { sel: 'input#4', before: '#~#~#rgba(0,0,0,.2) 0px 8px 24px~#', after: '#~#~#rgba(0,0,0,.2) 0px 8px 24px~#' },
  ] }]);
  assert.equal(r.pass, false);
  assert.equal(r.failures[0].kind, 'focus-invisible');
});

test('evaluateFocus — 모바일 폭은 건너뛴다 (포커스 링은 폭에 안 걸린다)', () => {
  const r = evaluateFocus([{ route: '/x', width: 390, focusables: [{ sel: 'input#5', before: '#~#~#~#', after: '#~#~#~#' }] }]);
  assert.equal(r.pass, true, '같은 결함을 폭마다 반복 보고하지 않는다');
});

test('evaluateFocus — 상시 shadow-sm 위에 링이 얹히면 통과', () => {
  // 이 케이스가 두 번째 구현을 무너뜨렸다: 버튼이 늘 shadow-sm 을 갖고 있어 '링이 있나'로도
  // '바뀌었나'로도 판정이 뒤집혔다. 서명은 상시 조각이 양쪽에 같이 들어가 상쇄된다.
  const drop = 'rgba(0,0,0,.1) 0px 1px 3px';
  const r = evaluateFocus([{ route: '/x', width: 1440, focusables: [
    { sel: 'button#12', before: `#${drop}~#~#~#`, after: `#rgb(255,255,255) 0px 0px 0px 2px|${drop}~#~#~#` },
  ] }]);
  assert.equal(r.pass, true);
});
