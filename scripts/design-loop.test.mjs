import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { appendLedger, recentDecisions, newRun } from './design-loop.mjs';

test('appendLedger는 파일이 없으면 생성하고 JSON 한 줄을 붙인다', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ledger-'));
  const p = join(dir, 'design-ledger.jsonl');
  appendLedger({ run: 'r1', won: true }, p);
  appendLedger({ run: 'r2', won: false }, p);
  const lines = readFileSync(p, 'utf8').trim().split('\n');
  assert.equal(lines.length, 2);
  assert.deepEqual(JSON.parse(lines[0]), { run: 'r1', won: true });
  rmSync(dir, { recursive: true, force: true });
});

test('recentDecisions는 마지막 n개를 오래된→최신 순으로 반환한다', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ledger-'));
  const p = join(dir, 'design-ledger.jsonl');
  appendLedger({ run: 'r1' }, p);
  appendLedger({ run: 'r2' }, p);
  appendLedger({ run: 'r3' }, p);
  const got = recentDecisions(2, p);
  assert.deepEqual(got.map(e => e.run), ['r2', 'r3']);
  rmSync(dir, { recursive: true, force: true });
});

test('recentDecisions는 파일이 없으면 빈 배열을 반환한다', () => {
  assert.deepEqual(recentDecisions(5, join(tmpdir(), 'nope-xyz.jsonl')), []);
});

test('newRun은 run/candidates 디렉토리를 만들고 run 경로를 반환한다', () => {
  const dir = mkdtempSync(join(tmpdir(), 'gen-'));
  const runPath = newRun('landing', dir, '2026-07-05');
  assert.ok(runPath.endsWith('2026-07-05-landing'));
  assert.ok(existsSync(join(runPath, 'candidates')));
  rmSync(dir, { recursive: true, force: true });
});
