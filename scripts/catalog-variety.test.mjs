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

test('banList — 테마는 2연속이면 금지한다', () => {
  const recent = [
    { theme: 'dark', accent: 'emerald', face: 'grotesk' },
    { theme: 'dark', accent: 'teal', face: 'wide' },
    { theme: 'light', accent: 'indigo', face: 'pretendard' },
  ];
  assert.deepEqual(banList(recent).theme, ['dark'], '직전 2라운드가 같은 테마면 금지한다');
});

test('banList — 테마가 직전에서 끊기면 금지하지 않는다', () => {
  const recent = [
    { theme: 'light', accent: 'indigo', face: 'pretendard' },
    { theme: 'dark', accent: 'teal', face: 'wide' },
    { theme: 'dark', accent: 'emerald', face: 'grotesk' },
  ];
  assert.deepEqual(banList(recent).theme, [], '연속이 끊기면 누적 횟수와 무관하게 금지 없음');
});

test('banList — 테마가 기록되지 않은 레거시 라운드는 연속으로 세지 않는다', () => {
  // variety 필드는 2026-08-01에야 들어갔다. 그 이전 entry는 theme이 없으며,
  // undefined 두 개를 "같은 테마 2연속"으로 읽으면 존재하지 않는 축을 금지하게 된다.
  const recent = [{ accent: 'none', face: 'pretendard' }, { accent: 'none', face: 'pretendard' }];
  assert.deepEqual(banList(recent).theme, []);
  assert.deepEqual(banList([{ theme: 'unknown' }, { theme: 'unknown' }]).theme, []);
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
