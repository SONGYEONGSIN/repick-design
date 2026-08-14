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

/**
 * Every measured route must actually render.
 *
 * On 2026-08-09 `auto-developers-r1/a` returned HTTP 500 (`ReferenceError: TRACE_OPTIONS is not
 * defined`) and **all six gates passed it**. Each one had a reason: `static` and `lint` read source
 * and the source parses; `sweep` loads the page and an error page has nothing to overflow; `a11y`
 * and `perf` got `unavailable` because Lighthouse could not score an error page — and `unavailable`
 * is a pass, by design, so the run degrades gracefully where Chrome is missing.
 *
 * That graceful degradation was written for a missing *tool*. Here it excused a missing *page*. The
 * two look identical downstream, so the distinction has to be drawn upstream: ask the route for its
 * status first, and fail on anything that is not 2xx. A route that does not render cannot be judged,
 * and the judges were about to be handed screenshots of an error page.
 */
export function normalizeRoutes(results) {
  if (!results.length) return { name: 'route', pass: true, detail: '측정 대상 없음', violations: [] };
  const bad = results.filter((r) => !(r.status >= 200 && r.status < 300));
  const pass = bad.length === 0;
  return {
    name: 'route',
    pass,
    detail: pass
      ? `${results.length}개 라우트 응답 OK`
      : bad.map((r) => `${r.route} → ${r.status === 0 ? '도달 실패' : r.status}`).join(' · '),
    violations: bad.map((r) => ({ route: r.route, status: r.status })),
  };
}

/**
 * React correctness warnings the browser prints while the page runs.
 *
 * `auto-integration-r1/b` won its round carrying a Next dev-overlay `1 Issue` badge in all four
 * frames, and seven gates passed it. The defect was a duplicate React key
 * (`Encountered two children with the same key, "no counterpart"`) — a judge caught it by eye, in a
 * screenshot, because nothing measured the console.
 *
 * The pattern list is narrow on purpose. A retroactive scan of all 34 catalogue routes found five
 * console messages, and **none of them were defects**: four WebGL driver performance notices from
 * `/scene` and one `next/image` LCP hint from `/v7`. A blanket "any warning fails" rule would have
 * failed 6% of shipped work on things that are not wrong. Narrowed to React correctness plus
 * uncaught page errors, the same scan reports zero — which is what makes it promotable to a hard
 * fail (the same bar `no-random-image-host` had to clear).
 */
export const CONSOLE_DEFECT_RE =
  /same key|unique "?key"?|Hydration failed|did not match|Text content does not match|Warning: .*React|Maximum update depth|Cannot update a component/i;

export function normalizeConsole(messages) {
  if (messages === 'unavailable') return { name: 'console', pass: true, detail: 'unavailable', violations: [] };
  // `pageerror`는 패턴과 무관하게 위반이다 — 잡히지 않은 예외는 그 자체로 결함이다.
  const bad = messages.filter((m) => m.type === 'pageerror' || CONSOLE_DEFECT_RE.test(m.text));
  const pass = bad.length === 0;
  return {
    name: 'console',
    pass,
    detail: pass ? `메시지 ${messages.length}건 · 결함 0` : `${bad.length}건 — ${bad.map((m) => m.text.slice(0, 40)).join(' · ')}`,
    violations: bad,
  };
}

/** `tsc --noEmit` 출력 한 줄 = `src/…/foo.tsx(280,18): error TS2304: …` */
export function parseTscOutput(stdout) {
  const out = [];
  for (const line of String(stdout).split('\n')) {
    const m = /^(.+?)\((\d+),(\d+)\): error (TS\d+): (.+)$/.exec(line.trim());
    if (m) out.push({ file: m[1], line: Number(m[2]), rule: m[4], detail: m[5] });
  }
  return out;
}

/**
 * Type errors, attributed to the candidate whose files they land in.
 *
 * `auto-developers-r1/a` returned HTTP 500 (`ReferenceError: TRACE_OPTIONS is not defined`) and six
 * gates passed it. The `route` gate now catches that *symptom*, but a type error that does not throw
 * at runtime still sails through — and `tsc` had named the defect exactly (`TS2304`) all along. It
 * simply was not part of the gate.
 *
 * Scoping matters more here than anywhere else. `tsc` compiles the whole project, while the gate
 * judges one candidate at a time: if candidate b's type error failed a and c too, a single mistake
 * would void the entire round. So the run happens once and the errors are filtered down to the files
 * this invocation actually covers. Errors elsewhere are someone else's gate.
 */
export function normalizeTypes(errors, files) {
  if (errors === 'unavailable') return { name: 'types', pass: true, detail: 'unavailable', violations: [] };
  if (!files.length) return { name: 'types', pass: true, detail: '측정 대상 없음', violations: [] };
  // 스코프 파일은 레포 루트 기준(`app/src/…`), tsc 출력은 `app/` 기준(`src/…`)이라 접미사로 맞춘다.
  const mine = errors.filter((e) => files.some((f) => f.endsWith(e.file) || f === e.file));
  const pass = mine.length === 0;
  return {
    name: 'types',
    pass,
    detail: pass ? '에러 0' : `${mine.length}건 — ${mine.map((e) => e.rule).join(', ')}`,
    violations: mine,
  };
}

/**
 * The accessibility score, plus the audits that failed outright.
 *
 * `/developers` failed `heading-order` (`score: 0`, binary) and passed the gate with 98. The canon
 * writes heading skips as an absolute prohibition; the instrument is a **weighted average against a
 * threshold**, so any audit worth less than five points slips through — and audits carrying zero
 * weight fail while the page scores a perfect 100 (`d45`, `d41`: `label-content-name-mismatch`).
 * An absolute rule cannot be enforced by an averaging instrument.
 *
 * The verdict is deliberately unchanged: a retroactive scan of 41 works found **18** failing at
 * least one binary audit, so hard-failing on any of them would break 44% of the catalogue — the
 * same wall the font-weight rule hit. What changes is visibility. Until now the failing audit ids
 * never reached the gate at all: `runLighthouse` returned two numbers. Fifteen works passed while
 * carrying a named accessibility defect nobody could see.
 */
/**
 * Audits promoted from record-only to hard fail.
 *
 * The canon writes these as absolute prohibitions, and an averaging score cannot enforce an
 * absolute — `/developers` failed `heading-order` outright and passed with 98. The promotion bar is
 * the one `no-random-image-host` and `console` had to clear: a retroactive scan across every work
 * must report zero violations, so nothing already shipped is retroactively broken. Each of these
 * four was down to a handful of works (`heading-order` 1, `definition-list` 1, `target-size` 1,
 * `skip-link` 2); those five were fixed first, taking the catalogue to zero.
 *
 * `color-contrast` (6 works), `button-name` (5) and `label-content-name-mismatch` (3) stay
 * record-only for now — same rule, they simply have not been fixed down to zero yet.
 */
export const A11Y_HARD_AUDITS = new Set(['heading-order', 'definition-list', 'target-size', 'skip-link']);

export function normalizeA11y(result) {
  if (result === 'unavailable') return { name: 'a11y', pass: true, detail: 'unavailable', violations: [] };
  // 숫자만 넘어오는 호출부(레거시·테스트)도 그대로 받는다 — 점수는 언제나 첫 번째 신호다.
  const score = typeof result === 'number' ? result : result.score;
  const failedAudits = typeof result === 'number' ? [] : (result.failedAudits ?? []);
  const hard = failedAudits.filter((a) => A11Y_HARD_AUDITS.has(a));
  const pass = score >= 95 && hard.length === 0;
  return {
    name: 'a11y',
    pass,
    detail: failedAudits.length ? `${score} · 실패 감사 ${failedAudits.join(' · ')}` : String(score),
    violations: [
      ...(score >= 95 ? [] : [{ rule: 'a11y-score', score, threshold: 95 }]),
      ...hard.map((audit) => ({ rule: 'a11y-audit', audit, detail: `${audit} 실패 — 정본이 절대 금지로 적은 조항이다 (page-brief-core §2)` })),
    ],
  };
}

export function normalizePerf(score) {
  return { name: 'perf', pass: true, detail: score === 'unavailable' ? 'unavailable' : String(score), violations: [] };
}

/**
 * ESLint findings, folded into a gate.
 *
 * The hard gate measured rendered pages — static source rules, widths, Lighthouse — and never asked
 * whether the code compiles clean. On 2026-08-09 that leaked for the first time: `auto-careers-r2/b`
 * shipped three `any` casts and `r3/a` a `useMemo` defeated by a dependency rebuilt every render,
 * and all five gates passed them. Both went into the catalogue and were caught only because the
 * promotion step happens to run `eslint` by hand.
 *
 * Warnings fail too. One of the two escapes was a warning (`react-hooks/exhaustive-deps`), and the
 * repo's own command is `eslint --max-warnings=0` — a gate that passes what the repo's rule fails
 * would be a second, laxer standard. Retroactive scan before making it hard: `eslint src` reported
 * 0 findings across all 251 promoted files, so nothing already shipped is retroactively broken.
 */
export function normalizeLint(result) {
  if (result === 'unavailable') return { name: 'lint', pass: true, detail: 'unavailable', violations: [] };
  const { errorCount = 0, warningCount = 0, messages = [] } = result;
  const pass = errorCount === 0 && warningCount === 0;
  return {
    name: 'lint',
    pass,
    detail: pass ? '위반 0' : `error ${errorCount} · warning ${warningCount}`,
    violations: messages,
  };
}

export const NATIVE_STEPS = ['tsc', 'export', 'render', 'iframe'];

const ANSI_RE = /\[[0-9;]*m/g;

// tsc는 출력이 TTY냐 파이프냐에 따라 두 형식을 낸다. 하나만 읽으면 환경에 따라 조용히 0건이
// 되어 "에러가 없다"와 "에러를 못 읽었다"가 구분되지 않는다.
export function parseNativeTsc(stdout) {
  const out = [];
  for (const raw of String(stdout).replace(ANSI_RE, '').split('\n')) {
    const line = raw.trim();
    const m =
      /^(.+?)\((\d+),(\d+)\): error (TS\d+): (.+)$/.exec(line) ??
      /^(.+?):(\d+):(\d+) - error (TS\d+): (.+)$/.exec(line);
    if (m) out.push({ file: m[1], line: Number(m[2]), rule: m[4], detail: m[5] });
  }
  return out;
}

// 한계: 슬러그에서 폴더를 유추한다. 라운드 후보(`evolve-r<N>-<v>`)와 자기 폴더를 가진 영구
// 화면(watchlist·detail·offer-thread·account)은 맞지만, 파일 하나로 사는 화면(`match` →
// `src/MatchList.tsx`)은 못 맞춘다. 그때 그 화면의 에러는 아래에서 `shared`로 분류돼 **전
// 후보가 실패**한다 — 틀리는 방향이 "남의 에러를 내 탓으로"가 아니라 "모두 멈춤"이라 안전한
// 쪽이다. 후보 격리가 필요한 곳은 한 라운드를 함께 게이트하는 evolve 슬러그뿐이다.
export function screenSourceDir(slug) {
  const m = /^evolve-r(\d+)-([a-z])$/.exec(slug);
  return m ? `src/evolve/r${m[1]}/${m[2]}/` : `src/${slug}/`;
}

// `npx tsc --noEmit`은 native 프로젝트 전역을 한 번에 돈다. 그래서 후보 하나의 타입 에러가
// 같은 라운드의 다른 후보 tsc까지 실패시키고, `set -e`인 validate.sh가 거기서 멈춰 뒤 3단계는
// 아예 돌지도 않는다 — 그런데 예전에는 그 12건이 전부 `detail: '실패'` 한 단어로 나왔다.
// 무인 라운드였다면 3후보 전원 탈락 no-winner로 기록되고 사유는 한 단어만 남는다
// (2026-08-13 `auto-native-r3` 실측). 웹의 `normalizeTypes`가 스코프 귀속으로 이미 푼 문제라
// 같은 방식을 옮긴다: 에러를 후보 폴더에 귀속시키고, 돌지 않은 단계는 실패와 구분해 적는다.
export function normalizeNativeRun(screen, stdout, exitOk, opts = {}) {
  const allScreens = opts.allScreens ?? [screen];
  const errors = parseNativeTsc(stdout);
  const myDir = screenSourceDir(screen);
  const otherDirs = allScreens.filter((s) => s !== screen).map((s) => ({ slug: s, dir: screenSourceDir(s) }));
  const mine = errors.filter((e) => e.file.includes(myDir));
  const others = errors.filter((e) => !mine.includes(e) && otherDirs.some((o) => e.file.includes(o.dir)));
  // 공용 파일(tokens.ts·screens.ts 등)이 깨지면 전 후보가 실제로 못 돈다 — 남의 탓이 아니다.
  const shared = errors.filter((e) => !mine.includes(e) && !others.includes(e));

  let blockedBy = null;
  return NATIVE_STEPS.map((step) => {
    if (stdout.includes(`GATE_STEP:${step}:ok`)) {
      return { name: `${screen}/${step}`, pass: true, detail: '통과', violations: [] };
    }
    if (blockedBy) {
      return {
        name: `${screen}/${step}`, pass: false,
        detail: `미실행 — ${blockedBy}로 중단`,
        violations: [{ screen, step, blockedBy }],
      };
    }
    if (step === 'tsc' && errors.length) {
      const owned = [...mine, ...shared];
      if (!owned.length) {
        const who = [...new Set(others.map((e) => otherDirs.find((o) => e.file.includes(o.dir)).slug))];
        blockedBy = `다른 후보(${who.join(', ')})의 tsc 에러`;
        return {
          name: `${screen}/tsc`, pass: true,
          detail: `에러 0 — 다른 후보(${who.join(', ')})의 에러로 전역 tsc가 중단됨`,
          violations: [],
        };
      }
      blockedBy = 'tsc 실패';
      const head = owned.slice(0, 3).map((e) => `${e.file}:${e.line} ${e.rule}`).join(' · ');
      return {
        name: `${screen}/tsc`, pass: false,
        detail: `${owned.length}건 — ${head}${owned.length > 3 ? ` 외 ${owned.length - 3}건` : ''}`,
        violations: owned.map((e) => ({ screen, step, ...e })),
      };
    }
    blockedBy = `${step} ${exitOk ? '미실행' : '실패'}`;
    return {
      name: `${screen}/${step}`, pass: false,
      detail: exitOk ? '미실행' : '실패',
      violations: [{ screen, step }],
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
  const out = { target: null, routes: [], files: [], screens: [], base: 'http://localhost:3100', appRoot: 'app/src/app', fontVars: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--target') out.target = argv[++i];
    else if (a === '--base') out.base = argv[++i];
    // Both default to this repo's layout and faces. They are flags because the static checker and the
    // brief now ship as a plugin: a repo with `src/app` and its own font variables must be able to run
    // the same rules without editing them. See `page-brief-repo` §2·§3 for what the defaults bind to.
    else if (a === '--app-root') out.appRoot = argv[++i];
    else if (a === '--font-vars') out.fontVars = argv[++i].split(',').map((v) => v.trim()).filter(Boolean);
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
    // `.ts`도 포함한다. 오래도록 `.tsx`만 봤고, 그래서 각 작품의 `data.ts`·`tokens.ts`가 정적
    // 검사를 한 번도 받지 않았다 — 하필 `data.ts`가 더미 데이터가 사는 곳이라 `no-random`
    // (`Math.random`/`Date.now`)이 가장 나올 법한 자리다. 결정론 규칙의 주 검사 대상이 검사망
    // 밖에 있었다(2026-08-07 실측: 승격본 `.tsx` 205개 검사 · `.ts` 43개 미검사, 실위반 0).
    .filter((f) => typeof f === 'string' && /\.tsx?$/.test(f))
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
      // 이진 판정 감사만. `manual`·`notApplicable`·`informative` 는 실패가 아니다.
      failedAudits: Object.values(j.audits)
        .filter((a) => a.scoreDisplayMode === 'binary' && a.score !== null && a.score < 1)
        .map((a) => a.id),
    };
  } catch {
    return 'unavailable';
  }
}

/**
 * Runs the repo's own ESLint over the scoped files.
 *
 * Paths arrive rooted at the repo (`app/src/app/…`) but the flat config lives in `app/`, so the run
 * happens with `cwd: appDir` and the prefix stripped. Exit status is not the signal — ESLint exits 1
 * precisely when it finds something, which is the case we most need to read. Parseable JSON on
 * stdout means it ran; anything else (missing binary, config error, a path it cannot resolve) is
 * reported as unmeasured rather than as a clean pass.
 */
function runLint(files, appDir = 'app') {
  if (!files.length) return 'unavailable';
  const prefix = appDir + '/';
  const rel = files.map((f) => (f.startsWith(prefix) ? f.slice(prefix.length) : f));
  const r = spawnSync('npx', ['eslint', '--format', 'json', ...rel],
    { cwd: appDir, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, env: process.env });
  if (!r.stdout) return 'unavailable';
  try {
    const results = JSON.parse(r.stdout);
    let errorCount = 0;
    let warningCount = 0;
    const messages = [];
    for (const f of results) {
      errorCount += f.errorCount ?? 0;
      warningCount += f.warningCount ?? 0;
      for (const m of f.messages ?? []) {
        messages.push({
          file: prefix + (f.filePath ?? '').split(`/${appDir}/`).pop(),
          line: m.line,
          rule: m.ruleId,
          detail: m.message,
        });
      }
    }
    return { errorCount, warningCount, messages };
  } catch {
    return 'unavailable';
  }
}

const WEIGHT_NAMES = ['thin','extralight','light','normal','medium','semibold','bold','extrabold','black'];

/**
 * Counts the distinct Tailwind font-weight classes a route uses.
 *
 * page-brief-core §3 asks for exactly three weights, but the rule lived only in the brief — no
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
 * Counts the distinct *display* faces a route uses.
 *
 * design-principles §Typography allows one display face per work and forbids a second. Nothing
 * enforced it. `no-unlisted-font` tests **membership** — is this variable on the whitelist — so a
 * work using grotesk in four files and mono in a fifth passes every file individually. The
 * violation only exists across the work, which is why this is counted per *route* like the weights
 * rule, not per file.
 *
 * `--font-sans` and `--font-mono` are body faces, not display faces, and are deliberately not
 * counted: dashboards set `--font-mono` on tabular figures constantly, and counting it would make
 * nearly every work a violation, which is the fastest way to get a rule ignored.
 *
 * Found by the spec-writing pass over d44 (`commissioned/verdant/rail.tsx:94`), the one violation in
 * a retroactive scan of 41 works — 17 use exactly one face, 23 use none. A hard fail costs the
 * existing catalog nothing, which is the opposite of what the same scan said about weights (41%
 * off-count, so that one stayed record-only).
 */
export function countDisplayFaces(sources) {
  const seen = new Set();
  for (const src of sources) {
    const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(?<!:)\/\/.*$/gmu, '');
    for (const m of code.matchAll(/var\(--font-(display-[a-z]+)\)/g)) seen.add(m[1]);
  }
  const faces = [...seen].sort();
  return { count: faces.length, faces };
}

/** Display-face violations for the static gate. Two or more faces is a hard fail; one or none passes. */
export function normalizeDisplayFaces({ count, faces }) {
  if (count < 2) return [];
  return [{
    rule: 'multi-display-face',
    detail: `디스플레이 활자 ${count}종 — ${faces.join(' · ')}. 한 작품에 한 종만 (design-principles §Typography)`,
  }];
}

/**
 * The same rule, applied per route rather than to the union of every file in scope.
 *
 * One gate call routinely covers several routes, and the union of two compliant works looks exactly
 * like one non-compliant work: verdant (grotesk) plus hopline (mono) in a single invocation reported
 * a violation neither of them has. The rule's unit is the work, so the grouping has to survive all
 * the way to the count — flattening first destroys the only distinction that matters.
 */
export function displayFaceViolations(groups) {
  return groups.flatMap(({ route, sources }) =>
    normalizeDisplayFaces(countDisplayFaces(sources)).map((v) => ({ route, ...v })));
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
/**
 * Distinct font weights the browser actually painted.
 *
 * `countFontWeights` reads Tailwind classes out of source, which misses the one weight nobody
 * writes: preflight's default 400. The artifact showed up twice, in opposite directions —
 * `auto-careers-r1` had four rendered weights read as three, and `auto-integration-r1/c` had three
 * read as two (its only explicit classes were `font-medium` and `font-semibold`; body copy sat at an
 * implicit 400). Both times a judge had to settle it by eye.
 *
 * The canon's unit is the *rendered* page, so measure the rendered page. `sweep` already loads every
 * route, so `getComputedStyle` costs nothing extra. Class counting stays as the fallback for runs
 * with no browser.
 */
export function renderedWeights(values) {
  const weights = [...new Set(values.map(Number).filter((n) => Number.isFinite(n)))].sort((a, b) => a - b);
  return { count: weights.length, weights, rendered: true };
}

export function normalizeWeights({ count, weights, rendered = false }) {
  const canonical = count === 3;
  const how = rendered ? '렌더 실측' : '명시 클래스';
  return {
    name: 'weights',
    pass: true,
    detail: canonical ? `3종 (${how})` : `${count}종 (${weights.join(', ') || '없음'}) — 기록만, ${how}`,
    violations: [],
  };
}

/** Worst score across the measured routes — a gate passes only if every route it covers passes. */
export function worstLighthouse(results) {
  if (!results.length || results.some((r) => r === 'unavailable')) return 'unavailable';
  return {
    a11y: Math.min(...results.map((r) => r.a11y)),
    perf: Math.min(...results.map((r) => r.perf)),
    // 데스크톱·모바일 합집합 — 한쪽에서만 터지는 감사(모바일 target-size)를 다른 쪽이 지우면 안 된다.
    failedAudits: [...new Set(results.flatMap((r) => r.failedAudits ?? []))].sort(),
  };
}

/** `tsc --noEmit`를 한 번 돌려 에러 목록을 얻는다. 실행 불가면 'unavailable'. */
function runTypecheck(appDir = 'app') {
  const r = spawnSync('npx', ['tsc', '--noEmit'], { cwd: appDir, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, env: process.env });
  // tsc는 에러가 있으면 비-0으로 끝난다 — 그게 우리가 읽어야 할 경우다. 판단 기준은 출력이다.
  if (r.error || r.stdout == null) return 'unavailable';
  return parseTscOutput(r.stdout);
}

/** 각 라우트의 HTTP 상태. 도달 실패는 0으로 보고한다 — 통과시키지 않기 위해 값으로 남긴다. */
async function fetchRouteStatuses(routes, base) {
  const out = [];
  for (const route of routes) {
    try {
      const res = await fetch(base + route, { redirect: 'manual' });
      out.push({ route, status: res.status });
    } catch {
      out.push({ route, status: 0 });
    }
  }
  return out;
}

export async function runWeb({ routes, files, base, appRoot = 'app/src/app', fontVars = null }) {
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
  const tsxFiles = files.length ? files : routes.flatMap((r) => filesForRoute(r, appRoot));
  // 라우트별 묶음을 유지한다 — 작품 단위 규칙은 파일 하나만 봐도, 전부 합쳐 봐도 틀린 답을 낸다.
  // `--files`로 직접 준 경우는 그 자체가 한 작품이다.
  const faceGroups = files.length
    ? [{ route: null, sources: files.map((f) => readFileSync(f, 'utf8')) }]
    : routes.map((r) => ({ route: r, sources: filesForRoute(r, appRoot).map((f) => readFileSync(f, 'utf8')) }));
  const staticViolations = [
    ...tsxFiles.flatMap((f) =>
      checkSource(readFileSync(f, 'utf8'), fontVars ? { fontVars } : {}).map((v) => ({ file: f, ...v }))),
    ...displayFaceViolations(faceGroups),
  ];
  const sweepRaw = await runSweep(base, routes);
  const sweep = evaluateSweep(sweepRaw);
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
  const routeStatuses = await fetchRouteStatuses(routes, base);
  const gates = [
    normalizeRoutes(routeStatuses),
    normalizeTypes(runTypecheck(), tsxFiles),
    normalizeStatic(staticViolations),
    normalizeLint(runLint(tsxFiles)),
    // 렌더 실측을 우선하고, 브라우저가 없으면 명시 클래스 집계로 물러선다.
    normalizeWeights(
      sweepRaw.fontWeights?.length
        ? renderedWeights(sweepRaw.fontWeights)
        : countFontWeights(tsxFiles.map((f) => readFileSync(f, 'utf8'))),
    ),
    normalizeSweep(sweep),
    normalizeConsole(sweepRaw.consoleMessages ?? 'unavailable'),
    normalizeA11y(lh === 'unavailable' ? 'unavailable' : { score: lh.a11y, failedAudits: lh.failedAudits }),
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
    gates = gates.concat(normalizeNativeRun(screen, stdout, r.status === 0, { allScreens: screens }));
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
