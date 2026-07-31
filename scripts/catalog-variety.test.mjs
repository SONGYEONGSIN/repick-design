import { test } from 'node:test';
import assert from 'node:assert/strict';
import { themeOf, accentOf, displayFaceOf, banList } from './catalog-variety.mjs';

test('themeOf — 루트 캔버스 표식으로 다크/라이트를 가른다', () => {
  assert.equal(themeOf('<main className="min-h-screen bg-zinc-950 text-white">x</main>'), 'dark');
  assert.equal(themeOf('<main className="min-h-screen bg-white text-zinc-900">x</main>'), 'light');
  assert.equal(themeOf('<main>x</main>'), 'unknown');
});

test('accentOf — 가장 많이 쓰인 색상 계열을 고른다', () => {
  const src = '<a className="bg-indigo-600"/><b className="text-indigo-500"/><c className="border-rose-400"/>';
  assert.equal(accentOf(src), 'indigo');
  assert.equal(accentOf('<a className="bg-[#6E56CF]"/>'), 'violet-hex');
  assert.equal(accentOf('<p>없음</p>'), 'none');
});

test('displayFaceOf — 화이트리스트 활자 사용을 식별한다', () => {
  assert.equal(displayFaceOf('className="font-[family-name:var(--font-display-wide)]"'), 'wide');
  assert.equal(displayFaceOf('style={{fontFamily:"var(--font-display-mono)"}}'), 'mono');
  assert.equal(displayFaceOf('<h1>plain</h1>'), 'pretendard');
});

test('banList — 최근 N개에서 반복된 축만 금지 목록에 올린다', () => {
  const recent = [
    { theme: 'dark', accent: 'violet-hex', face: 'pretendard' },
    { theme: 'dark', accent: 'violet-hex', face: 'pretendard' },
    { theme: 'dark', accent: 'indigo', face: 'grotesk' },
  ];
  const b = banList(recent, 3);
  assert.deepEqual(b.theme, ['dark'], '3연속이면 테마를 금지한다');
  assert.ok(b.accent.includes('violet-hex'), '2회 이상 쓰인 액센트를 금지한다');
  assert.ok(b.face.includes('pretendard'));
});

test('banList — 이미 고르게 퍼져 있으면 금지 없음', () => {
  const recent = [
    { theme: 'dark', accent: 'indigo', face: 'grotesk' },
    { theme: 'light', accent: 'teal', face: 'wide' },
    { theme: 'dark', accent: 'rose', face: 'mono' },
  ];
  const b = banList(recent, 3);
  assert.deepEqual(b.theme, []);
  assert.deepEqual(b.accent, []);
});
