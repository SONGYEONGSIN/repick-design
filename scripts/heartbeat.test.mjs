import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateHeartbeat, expectedLastRoundDate, FIRING_UTC_HOUR, lastRoundDateFromText, resolveLastRoundDate } from './heartbeat.mjs';

// 2026-08-09 사고: 야간 라운드가 발화하지 않았는데 **아무 신호도 없었다.** 사용자가 "발화했나"를
// 물어서야 알았다. 스케줄러가 무엇이든(리모트컨트롤·크론·Actions) 연결이 끊기면 실행이 시작조차
// 안 되므로 실패 로그도 없다 — 침묵과 정상을 구분할 신호가 필요하다.

const at = (iso) => Date.parse(iso);

test('발화 시각 전이면 기대 라운드는 어제', () => {
  assert.equal(expectedLastRoundDate(at('2026-08-09T17:59:00Z')), '2026-08-08');
});

test('발화 시각을 지나면 기대 라운드는 오늘', () => {
  assert.equal(expectedLastRoundDate(at('2026-08-09T18:00:00Z')), '2026-08-09');
  assert.equal(expectedLastRoundDate(at('2026-08-09T23:30:00Z')), '2026-08-09');
});

test('기대와 실제가 같으면 ok', () => {
  const r = evaluateHeartbeat({ now: at('2026-08-09T23:00:00Z'), lastRoundDate: '2026-08-09' });
  assert.equal(r.stale, false);
  assert.equal(r.missedDays, 0);
});

// 이번 사고 그 자체. 08-08 라운드가 마지막이고 08-09 18:00 UTC 발화가 빠졌다.
test('이번 사고를 잡는다 — 08-09 발화 누락', () => {
  const r = evaluateHeartbeat({ now: at('2026-08-09T21:39:00Z'), lastRoundDate: '2026-08-08' });
  assert.equal(r.stale, true);
  assert.equal(r.missedDays, 1);
  assert.match(r.detail, /2026-08-09/);
});

test('여러 날 누적되면 일수를 센다', () => {
  const r = evaluateHeartbeat({ now: at('2026-08-12T20:00:00Z'), lastRoundDate: '2026-08-08' });
  assert.equal(r.missedDays, 4);
});

// 발화 직후 몇 시간은 라운드가 아직 도는 중일 수 있다. 그 창에서 경보를 내면
// 매일 거짓 경보가 뜨고, 그 습관이 진짜 경보까지 무디게 만든다.
test('발화 직후 유예 창 안에서는 경보하지 않는다', () => {
  const r = evaluateHeartbeat({ now: at('2026-08-09T18:30:00Z'), lastRoundDate: '2026-08-08' });
  assert.equal(r.stale, false, '발화 30분 뒤 — 아직 도는 중일 수 있다');
});

// 유예는 실측(2026-08-08: 2라운드 65분)의 3배다. 더 길게 잡으면 감지가 반나절 늦는다.
test('유예를 넘기면 같은 날에도 경보한다', () => {
  const r = evaluateHeartbeat({ now: at('2026-08-09T21:30:00Z'), lastRoundDate: '2026-08-08' });
  assert.equal(r.stale, true, '발화 3시간 반 뒤 — 라운드가 65분이면 끝났어야 한다');
});

test('이력이 없으면 stale이 아니라 unknown', () => {
  const r = evaluateHeartbeat({ now: at('2026-08-09T21:00:00Z'), lastRoundDate: null });
  assert.equal(r.stale, false);
  assert.equal(r.unknown, true);
});

test('발화 시각은 스킬이 적어 둔 18:00 UTC와 일치한다', () => {
  assert.equal(FIRING_UTC_HOUR, 18);
});

/* ───────── 원장을 어느 브랜치에서 읽는가 (2026-08-14, 실사용에서 드러남) ─────────
   야간 라운드는 `evolve/dash`에 커밋하고 main 의 원장은 주간 반증 머지까지 갱신되지 않는다.
   CLI 진입점은 처음부터 `origin/evolve/dash` 를 읽었지만 **그 로직이 CLI 블록 안에만 인라인으로
   있었고**, export 된 `lastRoundDateFromLedger` 는 워킹트리를 읽는다. 그래서 프로그램에서 부르면
   main 체크아웃 상태에서 정상 발화를 "3일 누락"으로 보고한다 — 2026-08-14 에 실제로 그렇게 오판했다
   (main 원장 08-10 vs evolve/dash 원장 08-13). 판정 로직을 export 해 부르는 쪽이 틀릴 수 없게 한다. */

test('lastRoundDateFromText — 마지막 유효 항목의 date', () => {
  const t = '{"date":"2026-08-10","round":"a"}\n{"date":"2026-08-13","round":"b"}';
  assert.equal(lastRoundDateFromText(t), '2026-08-13');
});

test('lastRoundDateFromText — 뒤쪽 손상 줄은 건너뛰고 앞의 온전한 줄을 쓴다', () => {
  const t = '{"date":"2026-08-13","round":"b"}\n{"date":"2026-08-14"';
  assert.equal(lastRoundDateFromText(t), '2026-08-13');
});

test('lastRoundDateFromText — 비었거나 date 없는 원장은 null', () => {
  assert.equal(lastRoundDateFromText(''), null);
  assert.equal(lastRoundDateFromText('{"round":"a"}'), null);
});

test('resolveLastRoundDate — evolve/dash 내용을 워킹트리보다 우선한다', () => {
  const v = resolveLastRoundDate({
    runGit: () => ({ status: 0, stdout: '{"date":"2026-08-13","round":"auto-native-r4"}' }),
    readWorkingTree: () => '{"date":"2026-08-10","round":"auto-contact-r2"}',
  });
  assert.equal(v, '2026-08-13', 'main 워킹트리(08-10)가 아니라 evolve/dash(08-13)를 봐야 한다');
});

test('resolveLastRoundDate — git 이 실패하면 워킹트리로 물러난다', () => {
  const v = resolveLastRoundDate({
    runGit: () => ({ status: 128, stdout: '' }),
    readWorkingTree: () => '{"date":"2026-08-10","round":"auto-contact-r2"}',
  });
  assert.equal(v, '2026-08-10');
});

test('resolveLastRoundDate — 양쪽 다 못 읽으면 null (누락이 아니라 판정 불가)', () => {
  const v = resolveLastRoundDate({ runGit: () => ({ status: 128, stdout: '' }), readWorkingTree: () => null });
  assert.equal(v, null);
  assert.equal(evaluateHeartbeat({ now: Date.parse('2026-08-14T22:00:00Z'), lastRoundDate: v }).unknown, true);
});
