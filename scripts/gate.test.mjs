import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeStatic, normalizeSweep, normalizeA11y, normalizePerf,
  normalizeNativeRun, buildVerdict, parseArgs, filesForRoute, worstLighthouse,
  countFontWeights, normalizeWeights, normalizeLint, normalizeRoutes, parseTscOutput, normalizeTypes,
} from './gate.mjs';

test('filesForRoute — .ts 파일도 스캔한다', () => {
  // 정적검사는 지금까지 .tsx만 봤다. 승격본 기준 .tsx 205개는 검사되고 .ts 43개는 한 번도
  // 검사된 적이 없었다 — 하필 data.ts가 더미 데이터가 사는 곳이라 no-random(Math.random /
  // Date.now)이 가장 나올 법한 자리다. 결정론 규칙의 주 검사 대상이 검사망 밖에 있었다.
  const files = filesForRoute('/catalog');
  assert.ok(files.some((f) => f.endsWith('.tsx')), 'tsx는 그대로 포함');
  assert.ok(files.some((f) => f.endsWith('data.ts')), 'data.ts가 포함되어야 한다');
  assert.ok(files.every((f) => /\.tsx?$/.test(f)), 'ts/tsx 외 확장자는 제외');
});

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
  // 단언에 appRoot·fontVars가 더해졌다. 2026-08-09에 정적검사와 브리프를 플러그인으로 배포하면서
  // 이 레포의 레이아웃(`app/src/app`)과 폰트 변수를 코드에서 떼어 플래그로 뺐기 때문이다.
  assert.deepEqual(parseArgs(['--target', 'web', '--routes', '/dash/d29']),
    { target: 'web', routes: ['/dash/d29'], files: [], screens: [], base: 'http://localhost:3100',
      appRoot: 'app/src/app', fontVars: null });
  const n = parseArgs(['--target', 'native', '--screens', 'watchlist', 'match']);
  assert.deepEqual(n.screens, ['watchlist', 'match']);
});

test('parseArgs — --app-root·--font-vars로 레포 바인딩을 갈아끼운다', () => {
  const o = parseArgs(['--target', 'web', '--routes', '/x', '--app-root', 'src/app', '--font-vars', 'brand, body ,']);
  assert.equal(o.appRoot, 'src/app');
  assert.deepEqual(o.fontVars, ['brand', 'body'], '공백 정리 + 빈 항목 제거');
});

test('filesForRoute — d29 라우트에서 ts/tsx 파일을 모은다', () => {
  // 이 테스트는 원래 `.every(f => f.endsWith('.tsx'))`로 **결함이던 동작을 단언**하고 있었다.
  // `.ts`를 스캔에서 빼는 것이 의도가 아니라 사고였음이 2026-08-07에 드러나(승격본 .ts 43개가
  // 한 번도 정적검사를 받지 않았다) 단언을 의도에 맞게 고쳤다.
  const files = filesForRoute('/dash/d29');
  assert.ok(files.length > 0);
  assert.ok(files.every((f) => /\.tsx?$/.test(f)), 'ts/tsx만 모은다');
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

test('normalizeLint — 위반 0이면 pass', () => {
  const g = normalizeLint({ errorCount: 0, warningCount: 0, messages: [] });
  assert.equal(g.pass, true);
  assert.equal(g.name, 'lint');
  assert.equal(g.detail, '위반 0');
});

test('normalizeLint — error는 하드페일', () => {
  const g = normalizeLint({ errorCount: 2, warningCount: 0, messages: [
    { file: 'a.tsx', line: 3, ruleId: '@typescript-eslint/no-explicit-any', message: 'Unexpected any.' },
    { file: 'a.tsx', line: 9, ruleId: '@typescript-eslint/no-explicit-any', message: 'Unexpected any.' },
  ] });
  assert.equal(g.pass, false);
  assert.match(g.detail, /error 2/);
  assert.equal(g.violations.length, 2);
});

// 오늘 승격본에서 실제로 샌 둘 중 하나(careers-3 useMemo 무력화)가 warning이었다.
// warning을 통과시키면 게이트를 다는 의미가 절반 사라진다 — 레포 규약도 --max-warnings=0이다.
test('normalizeLint — warning도 하드페일 (max-warnings=0 등가)', () => {
  const g = normalizeLint({ errorCount: 0, warningCount: 1, messages: [
    { file: 'b.tsx', line: 35, ruleId: 'react-hooks/exhaustive-deps', message: 'could change on every render' },
  ] });
  assert.equal(g.pass, false);
  assert.match(g.detail, /warning 1/);
});

// eslint를 못 돌리는 환경(미설치·다른 레포에 이식)에서 게이트 전체가 죽으면 안 된다.
// a11y의 'unavailable' 선례와 같은 처리 — 측정 못 한 것을 위반으로 읽지 않는다.
test('normalizeLint — unavailable은 pass(하드페일 아님)', () => {
  const g = normalizeLint('unavailable');
  assert.equal(g.pass, true);
  assert.equal(g.detail, 'unavailable');
  assert.deepEqual(g.violations, []);
});

// 2026-08-09 `auto-developers-r1/a`: 라우트가 500을 반환하는데 **6관문이 전부 통과**했다.
// static·lint는 소스만 보고, sweep은 에러 페이지에 오버플로가 없어 통과하고, a11y·perf는
// Lighthouse가 실패해 'unavailable'로 떨어졌는데 그게 하드페일이 아니다. 도구 부재를 위한
// 우아한 저하가 **깨진 라우트를 통과로 읽는 데** 쓰였다.
test('normalizeRoutes — 전부 200이면 pass', () => {
  const g = normalizeRoutes([{ route: '/x', status: 200 }, { route: '/y', status: 200 }]);
  assert.equal(g.pass, true);
  assert.equal(g.name, 'route');
});

test('normalizeRoutes — 500 하나면 하드페일', () => {
  const g = normalizeRoutes([{ route: '/x', status: 200 }, { route: '/bad', status: 500 }]);
  assert.equal(g.pass, false);
  assert.match(g.detail, /500/);
  assert.equal(g.violations.length, 1);
  assert.equal(g.violations[0].route, '/bad');
});

test('normalizeRoutes — 404도 하드페일 (라우트가 성립하지 않는다)', () => {
  assert.equal(normalizeRoutes([{ route: '/nope', status: 404 }]).pass, false);
});

// dev 서버가 안 떠 있으면 status가 0이다. 이건 후보의 결함이 아니라 측정 실패지만,
// 그래도 통과시키면 안 된다 — 아무것도 측정하지 못한 채 라운드가 진행된다.
test('normalizeRoutes — 도달 실패(status 0)도 하드페일', () => {
  const g = normalizeRoutes([{ route: '/x', status: 0 }]);
  assert.equal(g.pass, false);
  assert.match(g.detail, /도달/);
});

test('normalizeRoutes — --files 모드처럼 라우트가 없으면 측정 대상 없음으로 pass', () => {
  const g = normalizeRoutes([]);
  assert.equal(g.pass, true);
  assert.equal(g.detail, '측정 대상 없음');
});

// 2026-08-09 `auto-developers-r1/a`: `TRACE_OPTIONS` 미선언으로 라우트가 500이었고 게이트 6관문이
// 전부 통과시켰다. `route` 관문이 그 **증상**은 잡지만, 런타임에 안 터지는 타입 에러는 여전히
// 통과한다. tsc는 그 결함을 정확히 짚었다(TS2304) — 게이트에 없었을 뿐이다.
test('parseTscOutput — 파일·줄·코드·메시지를 뽑는다', () => {
  const out = [
    "src/app/developers-evolve/r1/a/console.tsx(280,18): error TS2304: Cannot find name 'TRACE_OPTIONS'.",
    "src/app/developers-evolve/r1/a/console.tsx(280,37): error TS7006: Parameter 'option' implicitly has an 'any' type.",
  ].join('\n');
  const errs = parseTscOutput(out);
  assert.equal(errs.length, 2);
  assert.equal(errs[0].file, 'src/app/developers-evolve/r1/a/console.tsx');
  assert.equal(errs[0].line, 280);
  assert.equal(errs[0].rule, 'TS2304');
  assert.match(errs[0].detail, /TRACE_OPTIONS/);
});

test('parseTscOutput — 에러 없는 출력은 빈 배열', () => {
  assert.deepEqual(parseTscOutput(''), []);
  assert.deepEqual(parseTscOutput('Found 0 errors.\n'), []);
});

// tsc는 프로젝트 전체를 본다. 게이트는 후보별 판정이므로 **다른 후보의 에러가 이 후보를
// 떨어뜨리면 안 된다** — 한 라운드에서 후보 b의 타입 에러로 a·c까지 탈락하면 그 라운드가 통째로
// 날아간다. 스코프 파일에 귀속된 에러만 이 관문의 위반이다.
test('normalizeTypes — 스코프 밖 에러는 무시한다', () => {
  const errs = [
    { file: 'src/app/x-evolve/r1/b/foo.tsx', line: 1, rule: 'TS2304', detail: 'x' },
  ];
  const g = normalizeTypes(errs, ['app/src/app/x-evolve/r1/a/page.tsx']);
  assert.equal(g.pass, true);
  assert.equal(g.name, 'types');
});

test('normalizeTypes — 스코프 안 에러는 하드페일', () => {
  const errs = [
    { file: 'src/app/x-evolve/r1/a/console.tsx', line: 280, rule: 'TS2304', detail: "Cannot find name 'TRACE_OPTIONS'." },
  ];
  const g = normalizeTypes(errs, ['app/src/app/x-evolve/r1/a/console.tsx']);
  assert.equal(g.pass, false);
  assert.match(g.detail, /TS2304|1/);
  assert.equal(g.violations.length, 1);
});

test('normalizeTypes — 측정 불가는 위반이 아니다', () => {
  const g = normalizeTypes('unavailable', ['app/src/app/x/page.tsx']);
  assert.equal(g.pass, true);
  assert.equal(g.detail, 'unavailable');
});

test('normalizeTypes — 스코프가 비면 측정 대상 없음', () => {
  assert.equal(normalizeTypes([], []).detail, '측정 대상 없음');
});
