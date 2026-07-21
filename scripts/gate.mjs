import { pathToFileURL } from 'node:url';

/* ───────── 순수 정규화 ───────── */

export function normalizeStatic(violations) {
  const pass = violations.length === 0;
  return { name: 'static', pass, detail: pass ? '위반 0' : `위반 ${violations.length}`, violations };
}

export function normalizeSweep(result) {
  const failures = result.failures ?? [];
  const pass = result.pass === true;
  return { name: 'sweep', pass, detail: pass ? '전 폭 오버플로 0' : `오버플로 ${failures.length}`, violations: failures };
}

export function normalizeA11y(score) {
  if (score === 'unavailable') return { name: 'a11y', pass: true, detail: 'unavailable', violations: [] };
  const pass = score >= 95;
  return { name: 'a11y', pass, detail: String(score), violations: pass ? [] : [{ score, threshold: 95 }] };
}

export function normalizePerf(score) {
  return { name: 'perf', pass: true, detail: score === 'unavailable' ? 'unavailable' : String(score), violations: [] };
}

export const NATIVE_STEPS = ['tsc', 'export', 'render', 'iframe'];

export function normalizeNativeRun(screen, stdout, exitOk) {
  return NATIVE_STEPS.map((step) => {
    const pass = stdout.includes(`GATE_STEP:${step}:ok`);
    return {
      name: `${screen}/${step}`,
      pass,
      detail: pass ? '통과' : exitOk ? '미실행' : '실패',
      violations: pass ? [] : [{ screen, step }],
    };
  });
}

/* ───────── verdict 조립 ───────── */

export function buildVerdict(target, gates) {
  const pass = gates.every((g) => g.pass);
  const violations = gates.flatMap((g) => (g.violations ?? []).map((v) => ({ gate: g.name, ...v })));
  const stripped = gates.map(({ violations: _v, ...rest }) => rest);
  return { target, pass, gates: stripped, violations };
}

/* ───────── CLI 인자 파싱 ───────── */

export function parseArgs(argv) {
  const out = { target: null, routes: [], files: [], screens: [], base: 'http://localhost:3100' };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--target') out.target = argv[++i];
    else if (a === '--base') out.base = argv[++i];
    else if (a === '--routes') while (argv[i + 1] && !argv[i + 1].startsWith('--')) out.routes.push(argv[++i]);
    else if (a === '--files') while (argv[i + 1] && !argv[i + 1].startsWith('--')) out.files.push(argv[++i]);
    else if (a === '--screens') while (argv[i + 1] && !argv[i + 1].startsWith('--')) out.screens.push(argv[++i]);
  }
  return out;
}
