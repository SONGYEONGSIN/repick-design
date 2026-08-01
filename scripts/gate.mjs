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

function runLighthouse(url, preset) {
  const chromeFlags = '--headless' + (process.env.PW_NO_SANDBOX ? ' --no-sandbox' : '');
  const r = spawnSync('npx', ['lighthouse', url,
    '--only-categories=performance,accessibility', ...(preset === 'desktop' ? ['--preset=desktop'] : []),
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

const WEIGHT_NAMES = ['thin','extralight','light','normal','medium','semibold','bold','extrabold','black'];

/**
 * Counts the distinct Tailwind font-weight classes a route uses.
 *
 * page-brief-core §4 asks for exactly three weights, but the rule lived only in the brief — no
 * checker knew about it. auto-404-r1 had all three candidates violate it at once (two weights each);
 * both judge lenses noticed and neither could act, because a defect every candidate shares does not
 * separate them. A rule nothing enforces is a rule the loop does not have.
 *
 * Counted per *route*, not per file: the brief's unit is the page, and a route's weights are spread
 * across its page/ui/data files. Comments are stripped first, the way the static checker does.
 */
export function countFontWeights(sources) {
  const seen = new Set();
  for (const src of sources) {
    const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(?<!:)\/\/.*$/gmu, '');
    for (const m of code.matchAll(/\bfont-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)\b/g)) {
      seen.add(m[1]);
    }
  }
  const weights = [...seen].sort((a, b) => WEIGHT_NAMES.indexOf(a) - WEIGHT_NAMES.indexOf(b));
  return { count: weights.length, weights };
}

/**
 * Record-only, deliberately — the count is reported, never failed on.
 *
 * Q13 asked for this to become a hard gate on "exactly three weights". Measuring first said no:
 * 9 of 22 catalog routes sit outside three (seven at two, three at four), the two canon pages
 * disagree with each other (`design-principles` bans *more than* three, `page-brief-core` asks for
 * exactly three), and the reference this scene is matched against uses four (200/400/600/700).
 * A threshold that fails 41% of shipped work and contradicts its own source is not a gate, it is a
 * guess. So the number is surfaced in every round — drift stays visible — and the threshold waits
 * for the canon contradiction to be settled.
 */
export function normalizeWeights({ count, weights }) {
  const canonical = count === 3;
  return {
    name: 'weights',
    pass: true,
    detail: canonical ? '3종' : `${count}종 (${weights.join(', ') || '없음'}) — 기록만`,
    violations: [],
  };
}

/** Worst score across the measured routes — a gate passes only if every route it covers passes. */
export function worstLighthouse(results) {
  if (!results.length || results.some((r) => r === 'unavailable')) return 'unavailable';
  return {
    a11y: Math.min(...results.map((r) => r.a11y)),
    perf: Math.min(...results.map((r) => r.perf)),
  };
}

export async function runWeb({ routes, files, base }) {
  // An empty route list used to sail through: no files to scan is "위반 0", no widths to sweep is
  // "오버플로 0", and no Lighthouse result is "unavailable", which the a11y/perf gates pass. So
  // `gate.mjs --target web` with a forgotten --routes printed a clean five-gate pass having measured
  // nothing at all. A gate with nothing to check has not checked anything; say so instead.
  if (!routes.length && !files.length) {
    return buildVerdict('web', [{ name: 'scope', pass: false, detail: '측정 대상 없음 — --routes 또는 --files 필요',
      violations: [{ rule: 'empty-scope', detail: 'routes·files 모두 비어 있어 어떤 게이트도 실측하지 않았다' }] }]);
  }
  const { checkSource } = await import('./dash-static-check.mjs');
  const { runSweep, evaluateSweep } = await import('./dash-sweep.mjs');
  const tsxFiles = files.length ? files : routes.flatMap((r) => filesForRoute(r));
  const staticViolations = tsxFiles.flatMap((f) =>
    checkSource(readFileSync(f, 'utf8')).map((v) => ({ file: f, ...v })));
  const sweep = evaluateSweep(await runSweep(base, routes));
  // Every route, not just the first: measuring routes[0] alone reported a passing score while other
  // routes in the same call were below the threshold, which reads as assurance the run never gave.
  // Both viewports, worst taken. The desktop preset was the only one measured, and sweep already
  // checks 390px — so the two gates disagreed about what "the page" is, and mobile-only defects
  // (`button-name` on icon-only controls, source order putting decoration above the headline) went
  // to judges instead of to the gate two weeks running. Cost is 2 Lighthouse runs per route.
  const lh = worstLighthouse(routes.flatMap((r) => [
    runLighthouse(base + r, 'desktop'),
    runLighthouse(base + r, 'mobile'),
  ]));
  const gates = [
    normalizeStatic(staticViolations),
    normalizeWeights(countFontWeights(tsxFiles.map((f) => readFileSync(f, 'utf8')))),
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
