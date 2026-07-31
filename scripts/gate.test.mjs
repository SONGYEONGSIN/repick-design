import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeStatic, normalizeSweep, normalizeA11y, normalizePerf,
  normalizeNativeRun, buildVerdict, parseArgs, filesForRoute, worstLighthouse,
  countFontWeights, normalizeWeights,
} from './gate.mjs';

test('normalizeStatic — 위반 0이면 pass', () => {
  const g = normalizeStatic([]);
  assert.equal(g.name, 'static');
  assert.equal(g.pass, true);
  assert.equal(g.detail, '위반 0');
});

test('normalizeStatic — 위반 있으면 fail + 개수', () => {
  const g = normalizeStatic([{ rule: 'no-emoji', line: 3 }]);
  assert.equal(g.pass, false);
  assert.equal(g.detail, '위반 1');
  assert.equal(g.violations.length, 1);
});

test('normalizeSweep — pass 전파', () => {
  assert.equal(normalizeSweep({ pass: true, failures: [] }).pass, true);
  const f = normalizeSweep({ pass: false, failures: [{ route: '/x', width: 1280 }] });
  assert.equal(f.pass, false);
  assert.equal(f.detail, '오버플로 1');
});

test('normalizeA11y — 95 미만은 fail, 이상은 pass', () => {
  assert.equal(normalizeA11y(94).pass, false);
  assert.equal(normalizeA11y(95).pass, true);
  assert.equal(normalizeA11y(100).detail, '100');
});

test('normalizeA11y — unavailable은 pass(하드페일 아님)', () => {
  const g = normalizeA11y('unavailable');
  assert.equal(g.pass, true);
  assert.equal(g.detail, 'unavailable');
});

test('normalizePerf — 항상 pass(기록만)', () => {
  assert.equal(normalizePerf(10).pass, true);
  assert.equal(normalizePerf('unavailable').pass, true);
});

test('normalizeNativeRun — 4단계 마커 전부 있으면 pass', () => {
  const out = 'GATE_STEP:tsc:ok\nGATE_STEP:export:ok\nGATE_STEP:render:ok\nGATE_STEP:iframe:ok';
  const gates = normalizeNativeRun('watchlist', out, true);
  assert.equal(gates.length, 4);
  assert.ok(gates.every((g) => g.pass));
  assert.equal(gates[0].name, 'watchlist/tsc');
});

test('normalizeNativeRun — render 마커 없으면 해당 게이트 fail', () => {
  const out = 'GATE_STEP:tsc:ok\nGATE_STEP:export:ok';
  const gates = normalizeNativeRun('match', out, false);
  assert.equal(gates.find((g) => g.name === 'match/render').pass, false);
  assert.equal(gates.find((g) => g.name === 'match/render').detail, '실패');
});

test('buildVerdict — 전 게이트 pass면 pass, violations 병합·gates는 3키만', () => {
  const v = buildVerdict('web', [
    normalizeStatic([]), normalizeSweep({ pass: true, failures: [] }),
    normalizeA11y(100), normalizePerf(98),
  ]);
  assert.equal(v.pass, true);
  assert.equal(v.violations.length, 0);
  for (const g of v.gates) assert.deepEqual(Object.keys(g).sort(), ['detail', 'name', 'pass']);
});

test('buildVerdict — 한 게이트라도 fail이면 fail + violations에 gate명 태그', () => {
  const v = buildVerdict('web', [normalizeStatic([{ rule: 'no-emoji', line: 3 }])]);
  assert.equal(v.pass, false);
  assert.equal(v.violations[0].gate, 'static');
  assert.equal(v.violations[0].rule, 'no-emoji');
});

test('계약 동형 — web·native verdict가 동일 스키마', () => {
  const web = buildVerdict('web', [
    normalizeStatic([]), normalizeSweep({ pass: true, failures: [] }),
    normalizeA11y(100), normalizePerf(98),
  ]);
  const native = buildVerdict('native', normalizeNativeRun(
    'watchlist', 'GATE_STEP:tsc:ok GATE_STEP:export:ok GATE_STEP:render:ok GATE_STEP:iframe:ok', true));
  for (const v of [web, native]) {
    assert.deepEqual(Object.keys(v).sort(), ['gates', 'pass', 'target', 'violations']);
    for (const g of v.gates) assert.deepEqual(Object.keys(g).sort(), ['detail', 'name', 'pass']);
  }
});

test('parseArgs — target/routes/screens 파싱', () => {
  assert.deepEqual(parseArgs(['--target', 'web', '--routes', '/dash/d29']),
    { target: 'web', routes: ['/dash/d29'], files: [], screens: [], base: 'http://localhost:3100' });
  const n = parseArgs(['--target', 'native', '--screens', 'watchlist', 'match']);
  assert.deepEqual(n.screens, ['watchlist', 'match']);
});

test('filesForRoute — d29 라우트에서 tsx 파일을 모은다', () => {
  const files = filesForRoute('/dash/d29');
  assert.ok(files.length > 0);
  assert.ok(files.every((f) => f.endsWith('.tsx')));
  assert.ok(files.some((f) => f.endsWith('page.tsx')));
  assert.ok(files.every((f) => f.startsWith('app/src/app/dash/d29/')));
});

test('worstLighthouse — 여러 라우트 중 최악을 채택한다', () => {
  const worst = worstLighthouse([{ a11y: 100, perf: 98 }, { a11y: 91, perf: 99 }, { a11y: 96, perf: 80 }]);
  assert.equal(worst.a11y, 91);
  assert.equal(worst.perf, 80);
});

test('worstLighthouse — 하나라도 unavailable이면 unavailable', () => {
  assert.equal(worstLighthouse([{ a11y: 100, perf: 98 }, 'unavailable']), 'unavailable');
  assert.equal(worstLighthouse([]), 'unavailable');
});

test('worstLighthouse — 단일 라우트는 그대로 통과', () => {
  assert.deepEqual(worstLighthouse([{ a11y: 97, perf: 88 }]), { a11y: 97, perf: 88 });
});

test('countFontWeights — 파일들에 걸친 고유 웨이트 집합을 센다', () => {
  const srcs = ['<p className="font-normal">a</p>', '<h1 className="font-semibold tracking-tight">b</h1>'];
  const r = countFontWeights(srcs);
  assert.deepEqual(r.weights.sort(), ['normal', 'semibold']);
  assert.equal(r.count, 2);
});

test('countFontWeights — 주석 속 언급은 세지 않는다', () => {
  const r = countFontWeights(['// font-black 쓰지 말 것\n<p className="font-light">a</p>']);
  assert.deepEqual(r.weights, ['light']);
});

test('normalizeWeights — 기록 전용: 어떤 개수든 통과하되 개수를 detail에 남긴다', () => {
  assert.equal(normalizeWeights({ count: 3, weights: ['light', 'normal', 'bold'] }).detail, '3종');
  const off = normalizeWeights({ count: 2, weights: ['normal', 'semibold'] });
  assert.equal(off.pass, true, '카탈로그 41%를 깨는 임계를 하드페일로 두지 않는다');
  assert.match(off.detail, /2종.*기록만/);
  assert.deepEqual(off.violations, []);
});
