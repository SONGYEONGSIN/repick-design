// 라운드 스크린샷 정리 — 판정이 끝난 라운드는 대표 프레임만 남긴다.
//
// **왜 있나.** 라운드마다 후보 3개 × 16프레임(4폭 × 4스크롤)을 찍는다. 그 16장은 **판정하는 동안**
// 필요하고(judge 가 스크롤 지점별 결함을 인용한다) 판정이 끝나면 대표 프레임만 계속 참조된다 —
// 주간 반증 PR 이 거는 것이 정확히 그것이다. 그런데 전부 커밋돼 있어서 2026-09-02 기준
// **2,283장 · 266MB** 였고, Vercel 이 매 빌드에 받는 depth=1 트리 276MB 의 **96%** 가 이것이었다.
//
// 보존 규칙 (지우기 전에 반드시 이 셋을 통과시킨다):
//   ① 승자 대표 프레임 — 웹 `<v>-1440.png`, 모바일 `<v>-390.png`. **주간 PR 링크가 이걸 건다**
//   ② `DECISION.md` 가 **경로로 인용한** 프레임 — 판정 근거
//   ③ 표준 이름이 아닌 샷 — 통제 실험 증거(`AB-tabular-nums.png` 류)
//   no-winner 라운드는 승자가 없으므로 **후보별** 대표 프레임을 남긴다.
//
// `vault/40-commissions/` 는 건드리지 않는다 — 주문 제작 인수 근거이고 판정 산출물이 아니다.
//
// 사용: `node scripts/prune-shots.mjs [--apply]` (기본은 계획만 출력)
import { readFileSync, readdirSync, existsSync, statSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const GEN = join(ROOT, 'vault/20-generations');
const STD = /^(evolve-r\d+-)?[abc]-\d+(-s\d+)?\.png$/;

export function planPrune({ genDir = GEN, ledgerPath = join(ROOT, 'vault/30-ledger/auto-ledger.jsonl') } = {}) {
  const winnerOf = new Map();
  if (existsSync(ledgerPath)) {
    for (const line of readFileSync(ledgerPath, 'utf8').trim().split('\n').filter(Boolean)) {
      const e = JSON.parse(line);
      if (e.round && e.winner) winnerOf.set(e.round, e.winner);
    }
  }
  const keep = [], drop = [];
  if (!existsSync(genDir)) return { keep, drop };
  for (const dir of readdirSync(genDir)) {
    const shots = join(genDir, dir, 'shots');
    if (!existsSync(shots)) continue;
    const w = winnerOf.get(dir.replace(/^\d{4}-\d{2}-\d{2}-/, ''));
    const decisionPath = join(genDir, dir, 'DECISION.md');
    const decision = existsSync(decisionPath) ? readFileSync(decisionPath, 'utf8') : '';
    const reps = w ? [w] : ['a', 'b', 'c'];
    for (const f of readdirSync(shots)) {
      if (!f.endsWith('.png')) continue;
      const isRep = reps.some((v) => f === `${v}-1440.png` || f === `${v}-390.png`
        || new RegExp(`^evolve-r\\d+-${v}-390\\.png$`).test(f));
      const rec = { path: join(shots, f), dir, file: f };
      (!STD.test(f) || isRep || decision.includes(f) ? keep : drop).push(rec);
    }
  }
  return { keep, drop };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { keep, drop } = planPrune();
  const mb = (a) => (a.reduce((s, x) => s + statSync(x.path).size, 0) / 1048576).toFixed(1);
  console.log(`보존 ${keep.length}장 (${mb(keep)} MB) · 삭제 대상 ${drop.length}장 (${mb(drop)} MB)`);
  // 라운드마다 최소 한 장은 남아야 한다 — 안 남으면 PR 의 "전체샷" 폴더가 비어 링크가 무의미해진다.
  const kept = new Set(keep.map((k) => k.dir));
  const empty = [...new Set(drop.map((d) => d.dir))].filter((d) => !kept.has(d));
  if (empty.length) { console.error('✖ 대표샷이 하나도 안 남는 라운드:', empty.join(' ')); process.exit(2); }
  if (process.argv.includes('--apply')) {
    for (const d of drop) unlinkSync(d.path);
    console.log(`삭제 완료 — ${drop.length}장`);
  } else {
    console.log('(계획만 — 실제로 지우려면 --apply)');
  }
}
