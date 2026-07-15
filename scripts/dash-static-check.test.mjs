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
