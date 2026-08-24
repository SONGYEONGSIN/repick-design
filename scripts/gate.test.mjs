import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeStatic, normalizeSweep, normalizeFocus, normalizeA11y, A11Y_HARD_AUDITS, normalizePerf,
  normalizeNativeRun, buildVerdict, parseArgs, filesForRoute, worstLighthouse,
  parseNativeTsc, screenSourceDir,
  countFontWeights, normalizeWeights, countDisplayFaces, normalizeDisplayFaces, displayFaceViolations, renderedWeights, normalizeLint, normalizeRoutes, parseTscOutput, normalizeTypes, normalizeConsole,
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
  assert.deepEqual(worstLighthouse([{ a11y: 97, perf: 88, failedAudits: [] }]), { a11y: 97, perf: 88, failedAudits: [] });
});

test('worstLighthouse — 실패 감사는 합집합이다 (한쪽에서만 터지는 것을 지우지 않는다)', () => {
  // 데스크톱·모바일을 둘 다 돌리는 이유가 이것이다 — `target-size` 는 모바일에서만 터지고,
  // 교집합이나 첫 번째만 취하면 그 감사가 통째로 사라진다.
  const r = worstLighthouse([
    { a11y: 100, perf: 90, failedAudits: ['heading-order'] },
    { a11y: 96, perf: 70, failedAudits: ['target-size'] },
  ]);
  assert.equal(r.a11y, 96);
  assert.deepEqual(r.failedAudits, ['heading-order', 'target-size']);
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

test('normalizeA11y — 실패한 감사를 detail에 싣는다 (점수가 통과여도)', () => {
  // `/developers` 는 heading-order 를 명시적으로 실패(score=0, binary)했는데 총점 98로 게이트를
  // 통과했다. 정본 §2 는 헤딩 스킵을 **절대 금지**로 적었지만 계측은 **가중 평균의 임계값**이라
  // 5점 미만짜리 감사는 무엇이든 통과한다. 가중치 0인 감사는 총점 100 을 받고도 실패한다(d45·d41).
  // 판정은 그대로 두고 **보이게** 만든다 — 41작품 소급에서 15작품이 이 상태로 조용히 지나갔다.
  // 2026-08-14 승격 이후 `heading-order` 는 하드페일이므로 여기서는 아직 기록전용인 감사로 확인한다.
  // 2026-08-16 2차 승격 이후 button-name 도 하드페일이므로 아직 기록전용인 감사로 확인한다.
  const v = normalizeA11y({ score: 98, failedAudits: ['tap-targets'] });
  assert.equal(v.pass, true, '승격 안 된 감사는 점수 임계만 본다');
  assert.match(v.detail, /98/);
  assert.match(v.detail, /tap-targets/);
});

test('normalizeFocus — 표시 없는 요소가 있으면 하드페일', () => {
  // 정본 §2 의 마지막 미계측 조항이었다. 정적 규칙은 링이 조상이나 상태에 있을 때를 못 가리고,
  // Lighthouse 는 포커스 가시성을 감사하지 않는다 — 그래서 11작품이 a11y 100 을 받고도
  // 키보드 사용자에게 자기 위치를 알려주지 않았다.
  const v = normalizeFocus({ pass: false, failures: [{ route: '/x', sel: 'input#3', kind: 'focus-invisible' }] });
  assert.equal(v.pass, false);
  assert.equal(v.name, 'focus');
  assert.match(v.detail, /input#3/);
});

test('normalizeFocus — 상태 뒤 위반도 하드페일 (2026-08-17 승격)', () => {
  // 켠 첫날 3작품 11요소가 걸렸고 — `d45` 옵션 8 · `d33`·`d29` 팔레트 입력 각 1 — 고쳐서 0으로
  // 내린 뒤 올렸다. 상태 뒤라고 덜 중요한 결함이 아니다: 팔레트는 ⌘K 한 번이면 열린다.
  const st = normalizeFocus({ pass: false, failures: [{ route: '/x', sel: 'button#1003', state: 'palette' }] });
  assert.equal(st.pass, false);
  assert.match(st.detail, /palette/);

  const hard = normalizeFocus({ pass: false, failures: [{ route: '/x', sel: 'input#3', state: 'default' }] });
  assert.equal(hard.pass, false, '기본 뷰도 그대로 하드페일');
});

test('normalizeFocus — 전부 표시되면 통과', () => {
  const v = normalizeFocus({ pass: true, failures: [] });
  assert.equal(v.pass, true);
  assert.match(v.detail, /표시 0/);
});

test('normalizeA11y — 승격된 감사는 점수와 무관하게 하드페일', () => {
  // 정본 §2 는 헤딩 스킵을 **절대 금지**로 적었는데 점수는 평균이라 98 로도 통과했다. 소급 위반이
  // ≤2건인 감사부터 절대 규칙답게 강제한다 — 다섯 작품(dv1·ig1·pf1·d29·d33)을 먼저 고쳐 위반을 0으로
  // 만든 뒤라 카탈로그를 깨지 않는다.
  const v = normalizeA11y({ score: 98, failedAudits: ['heading-order'] });
  assert.equal(v.pass, false, '점수가 임계를 넘어도 승격된 감사 실패는 통과가 아니다');
  assert.match(v.detail, /heading-order/);
  assert.equal(v.violations[0].rule, 'a11y-audit');
});

test('normalizeA11y — 승격 안 된 감사는 여전히 기록만', () => {
  // color-contrast 6건 · button-name 5건 · label-content-name-mismatch 3건은 아직 위반이 많아
  // 하드페일로 올리면 카탈로그가 깨진다. 보이되 떨어뜨리지 않는다.
  const v = normalizeA11y({ score: 96, failedAudits: ['tap-targets'] });
  assert.equal(v.pass, true);
  assert.match(v.detail, /tap-targets/);
});

test('normalizeA11y — 승격 감사와 기록 감사가 섞이면 하드페일하되 둘 다 보인다', () => {
  const v = normalizeA11y({ score: 97, failedAudits: ['tap-targets', 'skip-link'] });
  assert.equal(v.pass, false);
  assert.match(v.detail, /skip-link/);
  assert.match(v.detail, /tap-targets/);
});

test('A11Y_HARD_AUDITS — 2차 승격으로 일곱이 된다', () => {
  // 1차(2026-08-15) 넷은 소급 위반이 각 1~2건이었다. 2차(2026-08-16)의 셋은 6·5·3건이라
  // 먼저 12작품을 고쳐 0으로 내린 뒤 올렸다 — 순서는 언제나 고치고 나서 올린다.
  assert.deepEqual([...A11Y_HARD_AUDITS].sort(), [
    'button-name', 'color-contrast', 'definition-list', 'heading-order',
    'label-content-name-mismatch', 'skip-link', 'target-size',
  ]);
});

test('normalizeA11y — 2차 승격분도 점수와 무관하게 하드페일', () => {
  // color-contrast 는 지금까지 가장 많이 실패한 감사였다(6작품). 100점을 받고도 이 감사를
  // 실패하는 페이지가 있었으므로(가중치 구조상) 점수만 보는 판정은 여기서도 무력하다.
  for (const audit of ['color-contrast', 'button-name', 'label-content-name-mismatch']) {
    const v = normalizeA11y({ score: 100, failedAudits: [audit] });
    assert.equal(v.pass, false, `${audit} 는 하드페일이어야 한다`);
    assert.equal(v.violations[0].rule, 'a11y-audit');
  }
});

test('normalizeA11y — 감사 전원 통과면 detail이 점수만 남는다', () => {
  assert.equal(normalizeA11y({ score: 100, failedAudits: [] }).detail, '100');
});

test('normalizeA11y — 점수 미달은 여전히 하드페일', () => {
  const v = normalizeA11y({ score: 84, failedAudits: ['color-contrast', 'listitem'] });
  assert.equal(v.pass, false);
  assert.match(v.detail, /color-contrast/);
});

test('normalizeA11y — 숫자만 넘겨도(레거시·unavailable) 깨지지 않는다', () => {
  assert.equal(normalizeA11y(97).pass, true);
  assert.equal(normalizeA11y(94).pass, false);
  assert.equal(normalizeA11y('unavailable').detail, 'unavailable');
});

test('countDisplayFaces — 라우트 전체에서 쓰인 디스플레이 활자 집합을 센다', () => {
  // 파일 단위로는 절대 안 걸린다. verdant(d44)가 grotesk 를 네 파일에서 쓰고 rail.tsx 한 줄에서만
  // mono 를 썼는데, `no-unlisted-font` 는 두 변수 다 화이트리스트 소속이라 통과시켰다. 위반은
  // **작품 전체를 가로질러야** 보인다 — 웨이트 3종 규칙을 라우트 단위로 센 것과 같은 이유다.
  const r = countDisplayFaces([
    'style={{ fontFamily: "var(--font-display-grotesk)" }}',
    'style={{ fontFamily: "var(--font-display-mono)" }}',
  ]);
  assert.deepEqual(r.faces, ['display-grotesk', 'display-mono']);
  assert.equal(r.count, 2);
});

test('countDisplayFaces — 본문 활자(sans·mono)는 디스플레이 면이 아니다', () => {
  // `--font-mono` 는 표·카드번호의 tabular 본문 활자고 화이트리스트에서 display 계열과 별개 항목이다.
  // 이걸 세면 숫자를 등폭으로 쓰는 대시보드가 전부 위반이 되어 규칙이 즉시 무의미해진다.
  const r = countDisplayFaces([
    'style={{ fontFamily: "var(--font-sans)" }}',
    'style={{ fontFamily: "var(--font-mono)" }}',
    'style={{ fontFamily: "var(--font-display-wide)" }}',
  ]);
  assert.deepEqual(r.faces, ['display-wide']);
  assert.equal(r.count, 1);
});

test('countDisplayFaces — 주석 속 언급은 세지 않는다', () => {
  const r = countDisplayFaces(['/* var(--font-display-mono) 는 쓰지 않는다 */\nvar(--font-display-grotesk)']);
  assert.deepEqual(r.faces, ['display-grotesk']);
});

test('normalizeDisplayFaces — 2종 이상은 하드페일, 0·1종은 통과', () => {
  // 웨이트와 달리 기록전용이 아니다. 소급 스캔에서 41작품 중 위반이 **1건**뿐이라(1종 17 · 0종 23)
  // 하드페일로 올려도 기존 카탈로그를 깨지 않는다 — 웨이트 규칙을 기록전용에 묶어 둔 근거(41% 위반)와
  // 정확히 반대되는 실측이다.
  assert.equal(normalizeDisplayFaces({ count: 1, faces: ['display-grotesk'] }).length, 0);
  assert.equal(normalizeDisplayFaces({ count: 0, faces: [] }).length, 0);
  const v = normalizeDisplayFaces({ count: 2, faces: ['display-grotesk', 'display-mono'] });
  assert.equal(v.length, 1);
  assert.equal(v[0].rule, 'multi-display-face');
  assert.match(v[0].detail, /display-grotesk.*display-mono/);
});

test('displayFaceViolations — 라우트를 가로질러 합산하지 않는다', () => {
  // 한 번의 게이트 호출이 여러 라우트를 받으면(주문 제작·수동 확인에서 흔하다) 소스가 합쳐진다.
  // 합집합으로 세면 **각자 1종인 두 작품**이 2종 위반으로 뜬다 — 실제로 verdant(grotesk) + hopline(mono)를
  // 한 호출에 넣었을 때 그렇게 나왔다. 규칙의 단위는 작품이므로 그룹 단위로 센다.
  const v = displayFaceViolations([
    { route: '/a', sources: ['var(--font-display-grotesk)'] },
    { route: '/b', sources: ['var(--font-display-mono)'] },
  ]);
  assert.deepEqual(v, [], '서로 다른 작품의 활자는 합산 대상이 아니다');
});

test('displayFaceViolations — 위반한 라우트를 지목한다', () => {
  const v = displayFaceViolations([
    { route: '/ok', sources: ['var(--font-display-wide)'] },
    { route: '/bad', sources: ['var(--font-display-grotesk)', 'var(--font-display-mono)'] },
  ]);
  assert.equal(v.length, 1);
  assert.equal(v[0].route, '/bad');
  assert.equal(v[0].rule, 'multi-display-face');
});

test('normalizeWeights — 기록 전용: 어떤 개수든 통과하되 개수를 detail에 남긴다', () => {
  // detail에 **측정 방식**이 붙었다. 같은 "3종"이라도 명시 클래스를 센 것과 렌더를 실측한 것은
  // 신뢰도가 다르고, 그 차이를 감추면 계측 아티팩트가 또 사람 눈에만 보인다(2026-08-11).
  assert.match(normalizeWeights({ count: 3, weights: ['light', 'normal', 'bold'] }).detail, /^3종/);
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

// 2026-08-10 `auto-integration-r1/b`: 승자가 프레임 4장 전부에 Next dev 오버레이 `1 Issue` 배지를
// 달고 있었고 7관문이 전부 통과시켰다. 추적하니 React 중복 키였다
// (`Encountered two children with the same key, "no counterpart"`). judge가 육안으로 잡았다.
//
// 하드페일 승격 전 소급 스캔: 카탈로그 34라우트에서 아래 패턴 매칭 **0건**
// (관측된 5건은 `/scene`의 WebGL 드라이버 성능 메시지 4건과 `/v7`의 next/image LCP 힌트 1건 —
// 둘 다 React 결함이 아니라 패턴에서 제외된다).
test('normalizeConsole — 메시지 없으면 pass', () => {
  const g = normalizeConsole([]);
  assert.equal(g.pass, true);
  assert.equal(g.name, 'console');
});

test('normalizeConsole — React 중복 키는 하드페일 (실제 사고)', () => {
  const g = normalizeConsole([
    { type: 'warning', text: 'Encountered two children with the same key, `no counterpart`.' },
  ]);
  assert.equal(g.pass, false);
  assert.equal(g.violations.length, 1);
});

test('normalizeConsole — 하이드레이션 불일치도 하드페일', () => {
  assert.equal(normalizeConsole([{ type: 'error', text: 'Hydration failed because the server rendered HTML didn\'t match' }]).pass, false);
});

test('normalizeConsole — 잡히지 않은 페이지 에러는 항상 하드페일', () => {
  assert.equal(normalizeConsole([{ type: 'pageerror', text: 'ReferenceError: TRACE_OPTIONS is not defined' }]).pass, false);
});

// 소급 스캔에서 실제로 나온 둘. 이것들을 잡으면 결함 아닌 것으로 카탈로그 6%가 떨어진다.
test('normalizeConsole — WebGL 드라이버 메시지는 통과 (결함 아님)', () => {
  assert.equal(normalizeConsole([
    { type: 'warning', text: '[.WebGL-0x11c0a4aba00]GL Driver Message (OpenGL, Performance, GL_CLOSE_PATH_NV)' },
  ]).pass, true);
});

test('normalizeConsole — next/image LCP 힌트는 통과 (성능 제안)', () => {
  assert.equal(normalizeConsole([
    { type: 'warning', text: 'Image with src "https://images.unsplash.com/photo-1445205170230" was detected as the Largest Contentful Paint (LCP)' },
  ]).pass, true);
});

test('normalizeConsole — 측정 불가는 위반이 아니다', () => {
  const g = normalizeConsole('unavailable');
  assert.equal(g.pass, true);
  assert.equal(g.detail, 'unavailable');
});

// `weights`는 지금까지 **명시 클래스만** 셌다. Tailwind preflight의 기본 400은 클래스가 없어서
// 카운터에 안 잡히고, 그 아티팩트가 두 번 관측됐다 — `auto-careers-r1`은 실질 4종을 3종으로,
// `auto-integration-r1/c`는 3종을 2종으로 읽었다(방향만 반대). 정본이 요구하는 것은 **렌더된**
// 굵기 종수이므로, 이제 sweep의 페이지 로드에서 `getComputedStyle`로 직접 잰다.
test('renderedWeights — 계산된 굵기를 정렬·중복제거한다', () => {
  const r = renderedWeights([400, 600, 400, 700, 600]);
  assert.deepEqual(r.weights, [400, 600, 700]);
  assert.equal(r.count, 3);
});

test('renderedWeights — 빈 입력은 0종', () => {
  assert.equal(renderedWeights([]).count, 0);
});

// preflight 400이 클래스 없이 렌더되는 그 상황. 명시 클래스는 2종인데 실제는 3종이다.
test('renderedWeights — 클래스 없는 기본 400도 센다', () => {
  const r = renderedWeights([400, 500, 600]);
  assert.equal(r.count, 3, '명시 클래스가 medium·semibold 둘뿐이어도 렌더는 3종');
});

test('normalizeWeights — 렌더 측정치를 받으면 그대로 보고한다', () => {
  const g = normalizeWeights(renderedWeights([400, 500, 600]));
  assert.equal(g.pass, true, '기록만 — 임계는 Q13에서 보류 상태');
  assert.match(g.detail, /3종/);
});

test('normalizeWeights — 측정 불가면 명시 클래스 집계로 물러선다', () => {
  const g = normalizeWeights(countFontWeights(['<p class="font-medium">x</p>']));
  assert.match(g.detail, /1종|medium/);
});

/* ───────── native 게이트 관찰성·귀속 (2026-08-13, auto-native-r3 실측 결함) ─────────
   후보 c의 tsc 에러 8건이 a·b의 tsc까지 실패시켜 12/12 실패가 났고, verdict의 detail은
   12건 전부 "실패" 한 단어여서 스킬 §3의 1-fix 루프에 넘길 내용이 없었다. 웹은
   normalizeTypes가 스코프 파일 귀속으로 이미 해결한 문제다. */

test('parseNativeTsc — pretty(ANSI 포함)·non-pretty 두 형식을 모두 읽는다', () => {
  const pretty = '\u001b[96msrc/evolve/r3/c/Own.tsx\u001b[0m:\u001b[93m153\u001b[0m:\u001b[93m58\u001b[0m - \u001b[91merror\u001b[0m\u001b[90m TS2339: \u001b[0mProperty \'up\' does not exist.';
  const plain = 'src/evolve/r3/a/Sell.tsx(12,4): error TS2322: Type X is not assignable.';
  const errs = parseNativeTsc(pretty + '\n' + plain);
  assert.equal(errs.length, 2);
  assert.equal(errs[0].file, 'src/evolve/r3/c/Own.tsx');
  assert.equal(errs[0].line, 153);
  assert.equal(errs[0].rule, 'TS2339');
  assert.equal(errs[1].file, 'src/evolve/r3/a/Sell.tsx');
  assert.equal(errs[1].rule, 'TS2322');
});

test('screenSourceDir — evolve 슬러그는 라운드 폴더, 영구 슬러그는 자기 폴더', () => {
  assert.equal(screenSourceDir('evolve-r3-a'), 'src/evolve/r3/a/');
  assert.equal(screenSourceDir('evolve-r12-c'), 'src/evolve/r12/c/');
  assert.equal(screenSourceDir('watchlist'), 'src/watchlist/');
});

test('normalizeNativeRun — 남의 후보 tsc 에러로 내 tsc가 실패하지 않는다', () => {
  const out = 'src/evolve/r3/c/Own.tsx(153,58): error TS2339: Property \'up\' does not exist.';
  const gates = normalizeNativeRun('evolve-r3-a', out, false, { allScreens: ['evolve-r3-a', 'evolve-r3-b', 'evolve-r3-c'] });
  const tsc = gates.find((g) => g.name === 'evolve-r3-a/tsc');
  assert.equal(tsc.pass, true, 'a의 파일에 에러가 없으므로 a의 tsc는 통과여야 한다');
  assert.match(tsc.detail, /evolve-r3-c/, '누구 때문에 막혔는지 detail이 말해야 한다');
});

test('normalizeNativeRun — 자기 파일 에러는 detail에 실제 내용이 담긴다', () => {
  const out = 'src/evolve/r3/c/Own.tsx(153,58): error TS2339: Property \'up\' does not exist.';
  const gates = normalizeNativeRun('evolve-r3-c', out, false, { allScreens: ['evolve-r3-a', 'evolve-r3-c'] });
  const tsc = gates.find((g) => g.name === 'evolve-r3-c/tsc');
  assert.equal(tsc.pass, false);
  assert.match(tsc.detail, /TS2339/);
  assert.equal(tsc.violations.length, 1);
  assert.equal(tsc.violations[0].line, 153);
});

test('normalizeNativeRun — 공용 파일 에러는 전 후보가 실패한다', () => {
  const out = 'src/tokens.ts(9,3): error TS2322: Type X is not assignable.';
  for (const s of ['evolve-r3-a', 'evolve-r3-c']) {
    const tsc = normalizeNativeRun(s, out, false, { allScreens: ['evolve-r3-a', 'evolve-r3-c'] })
      .find((g) => g.name === `${s}/tsc`);
    assert.equal(tsc.pass, false, `${s}: 공용 파일이 깨지면 모두 실패여야 한다`);
    assert.match(tsc.detail, /TS2322/);
  }
});

test('normalizeNativeRun — 선행 단계 실패로 못 돈 단계는 실패가 아니라 미실행으로 구분된다', () => {
  const out = 'src/evolve/r3/c/Own.tsx(1,1): error TS2339: nope.';
  const gates = normalizeNativeRun('evolve-r3-c', out, false, { allScreens: ['evolve-r3-c'] });
  assert.equal(gates.find((g) => g.name === 'evolve-r3-c/tsc').detail.includes('TS2339'), true);
  for (const step of ['export', 'render', 'iframe']) {
    const g = gates.find((x) => x.name === `evolve-r3-c/${step}`);
    assert.match(g.detail, /미실행/, `${step}: 돌지 않은 단계를 "실패"라고 하면 안 된다`);
    assert.match(g.detail, /tsc/, `${step}: 무엇 때문에 안 돌았는지 말해야 한다`);
  }
});

test('normalizeNativeRun — 기존 3인자 호출 호환 유지', () => {
  const out = 'GATE_STEP:tsc:ok\nGATE_STEP:export:ok\nGATE_STEP:render:ok\nGATE_STEP:iframe:ok';
  const gates = normalizeNativeRun('watchlist', out, true);
  assert.ok(gates.every((g) => g.pass));
});

test('filesForRoute — 라우트 그룹 안의 작품도 찾는다', () => {
  // Next 의 라우트 그룹 `(marketing)` 은 URL 에 나타나지 않는다. `appRoot + route` 로 경로를
  // 만들면 `/v16` → `app/src/app/v16` 을 찾다가 ENOENT 로 죽고, 그래서 **승격된 랜딩 12작품
  // (`v0`·`v6`~`v16`)이 승격 이후 한 번도 게이트를 받지 않았다.** 2026-08-24 apply 에서 실제로
  // 물렸다 — `v16` 보수가 `font-semibold` 를 넣어 웨이트를 4종으로 만들었는데 게이트로 확인이
  // 불가능해 손으로 렌더 실측해서 잡았다. ([[questions-queue]] Q45)
  const files = filesForRoute('/v16');
  assert.ok(files.length > 0, '라우트 그룹 안이라도 파일을 찾아야 한다');
  assert.ok(files.some((f) => f.endsWith('page.tsx')));
  assert.ok(
    files.every((f) => f.startsWith('app/src/app/(marketing)/v16/')),
    '실제 디스크 경로를 반환한다 — URL 경로가 아니라',
  );
});

test('filesForRoute — 그룹 없는 라우트는 동작이 바뀌지 않는다', () => {
  // 회귀 방지. 기존 호출부(`/dash/dN`·`/…-evolve/rN/v`)는 그룹을 안 쓰므로 그대로여야 한다.
  const files = filesForRoute('/dash/d29');
  assert.ok(files.every((f) => f.startsWith('app/src/app/dash/d29/')));
});
