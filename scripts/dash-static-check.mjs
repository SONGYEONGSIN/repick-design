import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const RULES = [
  { id: 'no-next-font', re: /from\s+['"]next\/font/u, why: 'next/font 추가 import 금지 (Pretendard 전역 단일)' },
  { id: 'no-font-serif', re: /\bfont-serif\b/u, why: '세리프·장식 폰트 금지' },
  { id: 'no-random', re: /Math\.random\(|Date\.now\(|new Date\(\)/u, why: '결정론적 더미 데이터 (합계 정합·하이드레이션)' },
  { id: 'no-emoji', re: /\p{Extended_Pictographic}/u, why: '이모지 금지 — lucide-react 아이콘 사용' },
  { id: 'no-raw-img', re: /<img[\s/>]/u, why: '원시 img 금지 — next/image Image 사용(LCP·CLS)' },
  { id: 'no-next-image-unopt', re: /\bunoptimized\b/u, why: 'unoptimized 금지 — 최적화 우회는 CLS/LCP 이점 상실' },
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

export function checkSource(src) {
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
    for (const r of RULES) {
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

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  let all = [];
  for (const f of process.argv.slice(2)) {
    all = all.concat(checkSource(readFileSync(f, 'utf8')).map((v) => ({ file: f, ...v })));
  }
  console.log(JSON.stringify(all, null, 2));
  process.exit(all.length ? 1 : 0);
}
