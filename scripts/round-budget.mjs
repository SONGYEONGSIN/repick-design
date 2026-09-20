// 이번 실행이 돌 수 있는 라운드 수를 계산해 출력한다.
//
// **왜 스크립트인가.** 2026-09-12 에 상한을 "미채움 큐가 0종이면 N=1" 로 조건화하면서 스킬 §0-0-1
// 에 **인라인 셸 스니펫**으로 적었다. 그리고 **첫 기회에 안 먹혔다** — `auto-dash-r26`(09-13)이
// DECISION 에 *"연속의 2라운드째"* 라고 적었고, 그날 미채움은 0종이었다. 산문 속 스니펫은 실행
// 여부를 아무도 확인하지 않는다.
// 이 레포가 여러 번 얻은 교훈이 그것이다 — *"규칙을 절차에만 적으면 같은 일이 반복되므로 계측을
// 함께 둔다"*([[dash-falsify]] §4-0 이 스펙 등재에서, `native-promotion.test.mjs` 가 승격 경로에서
// 같은 결론에 도달했다). 그래서 **호출해서 답을 받는 한 줄**로 바꾼다.
//
// 사용: `N=$(node scripts/round-budget.mjs [요청값])`  — stdout 은 숫자 하나뿐이다.
//       `node scripts/round-budget.mjs --explain [요청값]` 은 근거를 함께 낸다.
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/** 카탈로그에 아직 0건인 페이지 타입. `N≥2` 의 유일한 근거다. */
export function unfilledTypes(src = readFileSync(join(ROOT, 'app/src/lib/works.ts'), 'utf8')) {
  const m = src.match(/export const PAGE_TYPES = \[([\s\S]*?)\] as const;/);
  if (!m) return [];
  const types = [...m[1].matchAll(/"([a-z0-9-]+)"/g)].map((x) => x[1]);
  return types.filter((t) => !src.includes(`category: "${t}"`));
}

/**
 * 허용 라운드 수.
 *
 * - 미채움 0종 → **1** (요청값과 무관하게). `N≥2` 의 근거는 커버리지 하나였고 큐가 비면 근거가 없다.
 * - 미채움 있음 → `min(요청값, 미채움 수, 2)`. 상한 3 은 2026-09-12 에 폐지됐다.
 */
export function roundBudget(requested = 1, unfilled = unfilledTypes()) {
  const req = Number.isFinite(+requested) && +requested > 0 ? Math.floor(+requested) : 1;
  if (!unfilled.length) return { n: 1, reason: '미채움 0종 — N≥2 의 근거(커버리지)가 없다', unfilled: 0, requested: req };
  const n = Math.min(req, unfilled.length, 2);
  return { n, reason: `미채움 ${unfilled.length}종 — min(요청 ${req}, 미채움, 상한 2)`, unfilled: unfilled.length, requested: req };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const args = process.argv.slice(2).filter((a) => a !== '--explain');
  const r = roundBudget(args[0] ?? 1);
  if (process.argv.includes('--explain')) {
    process.stdout.write(`${r.n}\t${r.reason}\n`);
  } else {
    // 숫자만. `console.log` 는 이 환경에서 ANSI 색이 붙어 셸 산술을 깨뜨린다 — 2026-09-12 실측.
    process.stdout.write(String(r.n));
  }
}
