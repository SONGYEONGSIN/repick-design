import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

/**
 * The CSS custom properties this repo's `globals.css` declares — see `page-brief-repo` §2.
 *
 * This list is the one rule here that is *not* true of every repo. The checker itself needs nothing
 * but `node:fs`, which is why it is the piece the `page-commission` plugin ships; a hardcoded
 * `--font-display-grotesk` would make it silently wrong in any repo that never declared that
 * variable — every `fontFamily` line flagged, or worse, a repo's real faces waved through because
 * they happen to be named the same.
 */
export const DEFAULT_FONT_VARS = ['sans', 'mono', 'display-grotesk', 'display-wide', 'display-mono'];

/** Builds the allow-list rule for a given set of font custom properties. */
export function fontRule(vars = DEFAULT_FONT_VARS) {
  const alt = vars.map((v) => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  return {
    id: 'no-unlisted-font',
    re: new RegExp(`font-?[Ff]amily\\s*[:=]\\s*["'\`{]?\\s*(?!var\\(--font-(?:${alt})\\))[A-Za-z]`, 'u'),
    why: `허용 목록 밖 폰트 금지 — --font-${vars.join(' · --font-')} 중 하나`,
  };
}

export const RULES = [
  { id: 'no-next-font', re: /from\s+['"]next\/font/u, why: 'next/font 추가 import 금지 (Pretendard 전역 단일)' },
  { id: 'no-font-serif', re: /\bfont-serif\b/u, why: '세리프·장식 폰트 금지' },
  { id: 'no-random', re: /Math\.random\(|Date\.now\(|new Date\(\)/u, why: '결정론적 더미 데이터 (합계 정합·하이드레이션)' },
  // `Extended_Pictographic`은 "그림문자가 될 수 있는 것" 전부라 ©(U+00A9)·™·®·↗ 같은 활자
  // 기호까지 포함한다. 그 오탐이 세 번 발동했고(2026-07-31 랜딩 PR #57 · blog 승격본 ·
  // 2026-08-06 careers r1/a) 세 번 다 규칙이 아니라 산출물을 고쳐, 카탈로그에 `© 2026`보다
  // 나쁜 `Copyright 2026 …` 푸터가 남았다. careers 라운드는 후보당 1회뿐인 1-fix 기회를 이
  // 오탐에 썼다 — 진짜 결함이 함께 있었다면 그 후보는 탈락했을 것이다.
  //
  // 원하는 것은 "기본 표시가 이모지인 문자"이고 그 속성은 `Emoji_Presentation`이다. 다만 그것만
  // 쓰면 ❤️처럼 이형 선택자(U+FE0F)로 이모지 표시를 강제한 문자를 놓치므로 둘을 합친다.
  // 선택자 없는 맨 ❤·✔는 통과하는데, 활자 기호로 쓸 여지가 있어 의도한 동작이다.
  { id: 'no-emoji', re: /\p{Emoji_Presentation}|\p{Extended_Pictographic}\uFE0F/u, why: '이모지 금지 — lucide-react 아이콘 사용 (©™® 등 활자 기호는 허용)' },
  { id: 'no-raw-img', re: /<img[\s/>]/u, why: '원시 img 금지 — next/image Image 사용(LCP·CLS)' },
  { id: 'no-next-image-unopt', re: /\bunoptimized\b/u, why: 'unoptimized 금지 — 최적화 우회는 CLS/LCP 이점 상실' },
  // Dark-mode auxiliary text below the canon floor (page-brief-core §2: dark >= zinc-400).
  // Lighthouse only audits the scheme the host happens to render, so `dark:text-*-500` can pass the
  // a11y gate at one time of day and fail at another — auto-login-r1 scored 100 in the round and 96
  // on re-measurement from this exact token (4.17:1). A token-level regex is scheme-independent.
  // Only the 500/600 steps: 700 and darker are normally paired with a light surface inside dark mode
  // (`dark:bg-white dark:text-zinc-900`), where they are correct rather than dim.
  // Typeface was the one axis the loop could not vary: `no-next-font` blocked every addition, so 22
  // works shipped in a single face — the largest share of a page's impression, held constant. The
  // ban is now an allow-list. A work may set display type in one of the three declared faces
  // (`--font-display-*` in globals.css); anything else — a raw family name, a newly imported face —
  // is still a hard fail, because that is what keeps Korean body copy on Pretendard and the CLS
  // budget predictable.
  fontRule(),
  // Image services that return *arbitrary* pictures. Twice now a round has reached for one and
  // shipped nonsense: `auto-catalog-r1` put moss on a CRM sync and wooden planks on double-entry
  // bookkeeping (picsum.photos/seed/<slug> — the seed is stable, the subject is not), and
  // `auto-blog-r1/c` loaded every post image from the same host, all of which failed — desktop
  // showed empty grey boxes and at 390px the alt text overflowed its container into the adjacent
  // headline. `page-brief-core` §4 reserves the box but cannot stop the content from being wrong.
  //
  // The ban is on randomness, not on remote hosts. A blanket "no external image host" rule was the
  // first proposal and the retroactive scan killed it: 23 files — every landing (v6~v10, champion)
  // and 12 dashboards — load fixed `images.unsplash.com/photo-<id>` assets a human chose. Those are
  // controlled content. This list is the random-image family only, and it scans clean across the
  // whole catalogue, which is what makes it promotable to a hard fail.
  { id: 'no-random-image-host', re: /\b(?:picsum\.photos|loremflickr\.com|placekitten\.com|placeimg\.com|source\.unsplash\.com|placehold\.co|dummyimage\.com)/u, why: '무작위 이미지 서비스 금지 — 내용을 통제할 수 없어 주제와 무관한 사진이 실린다. 생성형(SVG) 또는 내용이 정해진 고정 이미지를 쓸 것' },
  { id: 'no-dark-dim-text', re: /\bdark:text-(?:zinc|neutral|gray|slate|stone)-[56]00\b/u, why: '다크 보조텍스트 하한 zinc-400 — 500/600단은 다크 배경에서 AA 미달 (page-brief-core §2)' },
];

// 블록 주석 내용을 공백으로 치환(개행·길이 보존 → 라인/인덱스 불변)
function stripBlockComments(src) {
  return src.replace(/\{\/\*[\s\S]*?\*\/\}|\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
}

// <img|<Image 태그의 종료 '>' 인덱스 (JSX 표현식 {} 안의 '>'는 무시)
function tagSpanEnd(src, start) {
  let depth = 0;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (c === '{') depth++;
    else if (c === '}') depth--;
    else if (c === '>' && depth === 0) return i;
  }
  return src.length - 1;
}

export function checkSource(src, { fontVars } = {}) {
  const rules = fontVars ? RULES.map((r) => (r.id === 'no-unlisted-font' ? fontRule(fontVars) : r)) : RULES;
  const violations = [];
  // 1) line-level 규칙.
  // 여러 줄 블록 주석의 **내부 줄**(` * ...`)에는 여는 `/*`가 없어 줄 단위 제거로는 안 걷힌다.
  // 그래서 먼저 블록 주석을 공백으로 치환한 사본을 검사한다 — 규칙을 설명한 JSDoc이 그 규칙
  // 위반으로 잡히던 오탐(motion-pilot 실측)의 원인. 치환은 개행·길이를 보존하므로 줄 번호는
  // 원본과 일치하고, 보고 텍스트는 아래에서 원본 줄을 그대로 쓴다.
  const rawLines = src.split('\n');
  stripBlockComments(src).split('\n').forEach((scanLine, i) => {
    const line = rawLines[i] ?? scanLine;
    const stripped = scanLine.replace(/\{\/\*.*?\*\/\}/g, '').replace(/\/\*.*?\*\//g, '').replace(/(?<!:)\/\/.*$/u, '');
    for (const r of rules) {
      if (r.re.test(stripped)) {
        violations.push({ rule: r.id, line: i + 1, text: line.trim().slice(0, 80), why: r.why });
      }
    }
  });
  // 2) source-level img-needs-alt (다중 라인 태그 span 스캔)
  const clean = stripBlockComments(src);
  const tagRe = /<(?:img|Image)\b/g;
  let m;
  while ((m = tagRe.exec(clean)) !== null) {
    const end = tagSpanEnd(clean, m.index);
    const span = clean.slice(m.index, end + 1);
    if (!/(?:^|[\s{])alt\s*=/.test(span)) {
      violations.push({
        rule: 'img-needs-alt',
        line: clean.slice(0, m.index).split('\n').length,
        text: span.trim().slice(0, 80).replace(/\n/g, ' '),
        why: '이미지 alt 누락 (a11y)',
      });
    }
  }
  violations.sort((a, b) => a.line - b.line);
  return violations;
}

/**
 * Splits file arguments from `--font-vars a,b,c`.
 *
 * The plugin bundle ships this file as its whole gate, and the skill tells a standalone user to pass
 * their own font variables. Without this the flag was read as a path and the run died on ENOENT —
 * an instruction that does not run is worse than no instruction.
 */
export function parseCliArgs(argv) {
  const files = [];
  let fontVars = null;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--font-vars') fontVars = (argv[++i] ?? '').split(',').map((v) => v.trim()).filter(Boolean);
    else files.push(argv[i]);
  }
  return { files, fontVars };
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  const { files, fontVars } = parseCliArgs(process.argv.slice(2));
  let all = [];
  for (const f of files) {
    all = all.concat(checkSource(readFileSync(f, 'utf8'), fontVars ? { fontVars } : {}).map((v) => ({ file: f, ...v })));
  }
  console.log(JSON.stringify(all, null, 2));
  process.exit(all.length ? 1 : 0);
}
