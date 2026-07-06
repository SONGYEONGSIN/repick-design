import { appendFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

export function appendLedger(entry, ledgerPath) {
  appendFileSync(ledgerPath, JSON.stringify(entry) + '\n');
}

export function recentDecisions(n, ledgerPath) {
  if (!existsSync(ledgerPath)) return [];
  const lines = readFileSync(ledgerPath, 'utf8').split('\n').filter(Boolean);
  return lines.slice(-n).map((l) => JSON.parse(l));
}

export function newRun(target, baseDir, dateStr) {
  const runPath = join(baseDir, `${dateStr}-${target}`);
  mkdirSync(join(runPath, 'candidates'), { recursive: true });
  return runPath;
}
