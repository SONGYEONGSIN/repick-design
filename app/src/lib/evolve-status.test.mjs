import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseLedger, candidateStatus } from './evolve-status.ts';

const LEDGER = [
  JSON.stringify({ target: 'dash', round: 'auto-dash-r7', date: '2026-07-19', winner: 'b', no_winner: false }),
  JSON.stringify({ round: 'auto-dash-r1', winner: 'b', no_winner: false }), // 레거시(target 없음)
  JSON.stringify({ target: 'landing', round: 'auto-landing-r2', date: '2026-07-19', winner: null, no_winner: true }),
  '',
  '{ 깨진 json',
].join('\n');

test('parseLedger: 유효 줄만 파싱, round 키로 매핑', () => {
  const m = parseLedger(LEDGER);
  assert.equal(m.size, 3);
  assert.deepEqual(m.get('auto-dash-r7'), { winner: 'b', noWinner: false, date: '2026-07-19' });
  assert.equal(m.get('auto-landing-r2').noWinner, true);
});

test('parseLedger: 같은 round는 뒤 줄이 override (refuted 최신 유효)', () => {
  const t = [
    JSON.stringify({ round: 'auto-dash-r3', winner: 'a', no_winner: false }),
    JSON.stringify({ round: 'auto-dash-r3', winner: 'a', no_winner: false, refuted: true }),
  ].join('\n');
  const m = parseLedger(t);
  assert.equal(m.size, 1);
  assert.equal(m.get('auto-dash-r3').winner, 'a'); // 최신 줄 반영
});

test('candidateStatus: 승자/탈락/대기 판정', () => {
  const m = parseLedger(LEDGER);
  assert.equal(candidateStatus('auto-dash-r7', 'b', m), 'winner');
  assert.equal(candidateStatus('auto-dash-r7', 'a', m), 'dropped');
  assert.equal(candidateStatus('auto-landing-r2', 'a', m), 'pending'); // no_winner
  assert.equal(candidateStatus('auto-dash-r99', 'a', m), 'pending'); // ledger 없음
});
