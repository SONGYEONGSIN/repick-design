import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const RULES = [
  { id: 'no-next-font', re: /from\s+['"]next\/font/u, why: 'next/font 추가 import 금지 (Pretendard 전역 단일)' },
  { id: 'no-font-serif', re: /\bfont-serif\b/u, why: '세리프·장식 폰트 금지' },
  { id: 'no-random', re: /Math\.random\(|Date\.now\(|new Date\(\)/u, why: '결정론적 더미 데이터 (합계 정합·하이드레이션)' },
  { id: 'no-emoji', re: /\p{Extended_Pictographic}/u, why: '이모지 금지 — lucide-react 아이콘 사용' },
];

export function checkSource(src) {
  const violations = [];
  src.split('\n').forEach((line, i) => {
    for (const r of RULES) {
      if (r.re.test(line)) {
        violations.push({ rule: r.id, line: i + 1, text: line.trim().slice(0, 80), why: r.why });
      }
    }
  });
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
