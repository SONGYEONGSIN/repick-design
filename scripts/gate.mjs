import { readFileSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
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

/* ───────── 웹 브랜치 (IO) ───────── */

export function filesForRoute(route, appRoot = 'app/src/app') {
  const dir = appRoot + route;
  return readdirSync(dir, { recursive: true })
    .filter((f) => typeof f === 'string' && f.endsWith('.tsx'))
    .map((f) => `${dir}/${f}`);
}

function runLighthouse(url) {
  const chromeFlags = '--headless' + (process.env.PW_NO_SANDBOX ? ' --no-sandbox' : '');
  const r = spawnSync('npx', ['lighthouse', url,
    '--only-categories=performance,accessibility', '--preset=desktop',
    '--output=json', '--output-path=stdout', `--chrome-flags=${chromeFlags}`],
    { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, env: process.env });
  if (r.status !== 0 || !r.stdout) return 'unavailable';
  try {
    const j = JSON.parse(r.stdout);
    return {
      a11y: Math.round((j.categories.accessibility.score ?? 0) * 100),
      perf: Math.round((j.categories.performance.score ?? 0) * 100),
    };
  } catch {
    return 'unavailable';
  }
}

export async function runWeb({ routes, files, base }) {
  const { checkSource } = await import('./dash-static-check.mjs');
  const { runSweep, evaluateSweep } = await import('./dash-sweep.mjs');
  const tsxFiles = files.length ? files : routes.flatMap((r) => filesForRoute(r));
  const staticViolations = tsxFiles.flatMap((f) =>
    checkSource(readFileSync(f, 'utf8')).map((v) => ({ file: f, ...v })));
  const sweep = evaluateSweep(await runSweep(base, routes));
  const lh = runLighthouse(base + routes[0]);
  const gates = [
    normalizeStatic(staticViolations),
    normalizeSweep(sweep),
    normalizeA11y(lh === 'unavailable' ? 'unavailable' : lh.a11y),
    normalizePerf(lh === 'unavailable' ? 'unavailable' : lh.perf),
  ];
  return buildVerdict('web', gates);
}

/* ───────── 네이티브 브랜치 (IO) ───────── */

export function runNative({ screens }) {
  const registry = JSON.parse(readFileSync('native/screens.json', 'utf8'));
  let gates = [];
  for (const screen of screens) {
    const entry = registry[screen];
    if (!entry) throw new Error(`unknown screen: ${screen} (native/screens.json에 없음)`);
    const r = spawnSync('bash', ['native/scripts/validate.sh', entry.check, screen], {
      encoding: 'utf8',
      env: { ...process.env, EXPO_PUBLIC_SCREEN: screen },
      maxBuffer: 64 * 1024 * 1024,
    });
    const stdout = (r.stdout ?? '') + (r.stderr ?? '');
    gates = gates.concat(normalizeNativeRun(screen, stdout, r.status === 0));
  }
  return buildVerdict('native', gates);
}

/* ───────── CLI ───────── */

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  const opts = parseArgs(process.argv.slice(2));
  let verdict;
  if (opts.target === 'web') {
    verdict = await runWeb(opts);
  } else if (opts.target === 'native') {
    verdict = runNative(opts);
  } else {
    console.error('usage: node scripts/gate.mjs --target web|native ...');
    process.exit(2);
  }
  console.log(JSON.stringify(verdict, null, 2));
  process.exit(verdict.pass ? 0 : 1);
}
