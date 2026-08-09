import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateHeartbeat, expectedLastRoundDate, FIRING_UTC_HOUR } from './heartbeat.mjs';

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
