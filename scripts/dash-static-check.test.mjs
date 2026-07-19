import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkSource } from './dash-static-check.mjs';

test('next/font 추가 import를 잡는다', () => {
  const v = checkSource(`import { Inter } from 'next/font/google';`);
  assert.equal(v.length, 1);
  assert.equal(v[0].rule, 'no-next-font');
  assert.equal(v[0].line, 1);
});

test('font-serif 클래스를 잡는다', () => {
  const v = checkSource(`<h1 className="font-serif text-4xl">제목</h1>`);
  assert.equal(v[0].rule, 'no-font-serif');
});

test('비결정론(Math.random/Date.now/new Date())을 잡는다', () => {
  const src = `const a = Math.random();\nconst b = Date.now();\nconst c = new Date();`;
  const v = checkSource(src);
  assert.deepEqual(v.map((x) => x.line), [1, 2, 3]);
  assert.ok(v.every((x) => x.rule === 'no-random'));
});

test('이모지를 잡는다 (lucide 아이콘 강제)', () => {
  const v = checkSource(`<span>🚀 출시</span>`);
  assert.equal(v[0].rule, 'no-emoji');
});

test('규칙 준수 소스는 위반 0', () => {
  const src = `import { Rocket } from 'lucide-react';\nconst num = <td className="tabular-nums text-right">1,204</td>;\nconst fixed = new Date('2026-07-01');`;
  assert.deepEqual(checkSource(src), []);
});

test('주석 속 규칙 언급은 잡지 않는다', () => {
  const src = `// Math.random() 금지 — 결정론적 데이터만\nconst x = 1; /* new Date() 쓰지 말 것 */\n{/* 이모지 🚀 금지 */}`;
  assert.deepEqual(checkSource(src), []);
});

test('주석 제거 후에도 코드 위반은 잡는다', () => {
  const src = `const a = Math.random(); // 임시`;
  const v = checkSource(src);
  assert.equal(v.length, 1);
  assert.equal(v[0].rule, 'no-random');
});

test('URL의 //는 주석으로 취급하지 않는다', () => {
  const src = `<a href="https://x.com">{Date.now()}</a>`;
  assert.equal(checkSource(src)[0].rule, 'no-random');
});

test('no-raw-img: 원시 img 태그를 잡고 Image는 통과', () => {
  const v = checkSource(`<img src="/a.jpg" alt="x" />`);
  assert.ok(v.some((x) => x.rule === 'no-raw-img'));
  const ok = checkSource(`<Image src="/a.jpg" alt="x" width={10} height={10} />`);
  assert.ok(!ok.some((x) => x.rule === 'no-raw-img'));
});

test('img-needs-alt: 다중 라인 Image의 alt(별도 라인)는 통과, 누락은 잡는다', () => {
  const withAlt = `<Image\n  src={src}\n  alt={\`\${name} 프로필\`}\n  width={32}\n  height={32}\n/>`;
  assert.ok(!checkSource(withAlt).some((x) => x.rule === 'img-needs-alt'));
  const noAlt = `<Image\n  src={src}\n  width={32}\n  height={32}\n/>`;
  const v = checkSource(noAlt);
  const hit = v.find((x) => x.rule === 'img-needs-alt');
  assert.ok(hit);
  assert.equal(hit.line, 1); // 여는 <Image 라인
});

test('img-needs-alt: JSX 표현식 내 > 는 태그 종료로 오인하지 않는다', () => {
  const src = `<Image src={s} width={cols > 3 ? 400 : 200} height={200} alt="ok" />`;
  assert.ok(!checkSource(src).some((x) => x.rule === 'img-needs-alt'));
});

test('no-next-image-unopt: unoptimized 우회를 잡는다', () => {
  const v = checkSource(`<Image src="/a.jpg" alt="x" width={10} height={10} unoptimized />`);
  assert.ok(v.some((x) => x.rule === 'no-next-image-unopt'));
});

test('블록 주석 속 이미지 예시는 잡지 않는다', () => {
  const src = `{/* <img src="예시" /> 는 금지 */}\n<Image src={s} alt="설명" width={10} height={10} />`;
  const v = checkSource(src);
  assert.deepEqual(v, []);
});

test('규칙 준수 이미지는 위반 0', () => {
  const src = `<Image src="/hero.jpg" alt="히어로" width={1280} height={720} priority />`;
  assert.deepEqual(checkSource(src), []);
});
