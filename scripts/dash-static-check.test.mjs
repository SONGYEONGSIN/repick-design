import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkSource } from './dash-static-check.mjs';

test('no-emoji — 법적 기호(©™®)는 이모지가 아니다', () => {
  // Extended_Pictographic은 "그림문자가 될 수 있는 것" 전부라 활자 기호까지 포함한다. 이 오탐이
  // 세 번 발동했고(2026-07-31 랜딩 PR #57 · blog 승격본 · 2026-08-06 careers r1/a), 세 번 다
  // 규칙이 아니라 산출물을 고쳐 카탈로그에 "Copyright 2026 …" 푸터가 남았다. careers 라운드는
  // 후보당 1회뿐인 1-fix 기회를 이 오탐에 썼다.
  const hit = (src) => checkSource(src).some((v) => v.rule === 'no-emoji');
  assert.ok(!hit('<p>© 2026 Fathom Labs</p>'));
  assert.ok(!hit('<p>Attune™</p>'));
  assert.ok(!hit('<p>Attune®</p>'));
  assert.ok(!hit('<span>View live ↗</span>'), '화살표 글리프도 이모지가 아니다');
});

test('no-emoji — 진짜 이모지는 여전히 잡는다', () => {
  const hit = (src) => checkSource(src).some((v) => v.rule === 'no-emoji');
  assert.ok(hit('<p>🎉 launch</p>'), '기본 표시가 이모지인 문자');
  assert.ok(hit('<p>🚀</p>'));
  assert.ok(hit('<p>❤️</p>'), '이형 선택자로 이모지 표시를 강제한 문자');
  assert.ok(hit('<p>✔️ done</p>'));
});


test('no-random-image-host — 무작위 이미지 서비스는 하드페일', () => {
  // 2026-08-02 catalog r1 승격본이 picsum.photos로 CRM 동기화 카드에 이끼 사진을 달았고,
  // 2026-08-05 blog r1/c가 같은 호스트로 전 포스트 이미지를 로드해 전부 실패 —
  // 데스크톱은 빈 회색 박스, 모바일 390px에서는 alt 텍스트가 컨테이너를 넘어 옆 헤드라인으로 번졌다.
  // 재현 2회 + 소급 위반 0건이라 하드페일로 승격.
  const hit = (src) => checkSource(src).some((v) => v.rule === 'no-random-image-host');
  assert.ok(hit('const s = "https://picsum.photos/seed/x/640/640";'));
  assert.ok(hit('<Image src="https://loremflickr.com/320/240" alt="x" />'));
  assert.ok(hit('const s = "https://source.unsplash.com/random/800x600";'));
});

test('no-random-image-host — 내용이 통제된 고정 이미지는 통과', () => {
  // images.unsplash.com/photo-<고정ID>는 사람이 고른 특정 사진이라 성격이 다르다.
  // 전수 소급에서 23개 파일(랜딩 v6~v10·챔피언·대시보드 12종)이 이 호스트를 쓰고 있어,
  // "외부 호스트 전면 금지"는 카탈로그 대부분을 소급 실패시킨다 — 금지 대상은 무작위성이다.
  const hit = (src) => checkSource(src).some((v) => v.rule === 'no-random-image-host');
  assert.ok(!hit('const s = "https://images.unsplash.com/photo-1445205170230-053b83016050?w=900";'));
  assert.ok(!hit('const s = "https://images.pexels.com/photos/1234/x.jpg";'));
});

test('no-random-image-host — 주석 속 언급은 위반이 아니다', () => {
  // brand-tile.tsx가 이 규칙이 생긴 경위를 주석에 적고 있다. 기록이 위반이 되면 안 된다.
  const src = '/** picsum.photos was replaced here — see the round note. */\nexport const x = 1;';
  assert.ok(!checkSource(src).some((v) => v.rule === 'no-random-image-host'));
});
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

// ── 블록 주석 내부 오탐 (motion-pilot 실측: 규칙을 설명한 JSDoc이 규칙 위반으로 잡혔다) ──
test('JSDoc 블록 주석 안의 금지 심볼은 위반이 아니다', () => {
  const src = [
    '/**',
    ' * No time base here: the field never reads Date.now() and never calls Math.random().',
    ' */',
    'export const x = 1;',
  ].join('\n');
  assert.deepEqual(checkSource(src), []);
});

test('블록 주석을 걷어내도 실제 코드의 위반은 그대로 잡는다', () => {
  const src = [
    '/**',
    ' * Deterministic — no Date.now() anywhere.',
    ' */',
    'const t = Date.now();',
  ].join('\n');
  const v = checkSource(src);
  assert.equal(v.length, 1);
  assert.equal(v[0].rule, 'no-random');
  assert.equal(v[0].line, 4, '위반 줄 번호가 원본 기준으로 보고돼야 한다');
});

test('no-dark-dim-text: 다크 보조텍스트 500/600단을 잡는다', () => {
  const v = checkSource(`<p className="text-neutral-500 dark:text-neutral-500">note</p>`);
  assert.equal(v.length, 1);
  assert.equal(v[0].rule, 'no-dark-dim-text');
  assert.ok(checkSource(`<span className="dark:text-zinc-600">x</span>`).some((x) => x.rule === 'no-dark-dim-text'));
});

test('no-dark-dim-text: 라이트 전용 토큰과 다크 400단은 통과', () => {
  const ok = `<p className="text-neutral-500 dark:text-neutral-400">note</p>\n<span className="text-zinc-600">light only</span>`;
  assert.ok(!checkSource(ok).some((x) => x.rule === 'no-dark-dim-text'));
});

test('no-dark-dim-text: 다크 모드 안 밝은 표면 위 어두운 글자(700단 이상)는 잡지 않는다', () => {
  const ok = `<span className="dark:bg-white dark:text-zinc-900">badge</span>`;
  assert.ok(!checkSource(ok).some((x) => x.rule === 'no-dark-dim-text'));
});

test('no-unlisted-font: 허용 목록 밖 font-family 선언을 잡는다', () => {
  const v = checkSource(`<h1 style={{ fontFamily: "Bebas Neue, sans-serif" }}>x</h1>`);
  assert.ok(v.some((x) => x.rule === 'no-unlisted-font'), '미등록 폰트를 잡아야 한다');
});

test('no-unlisted-font: 허용된 디스플레이 변수는 통과', () => {
  const ok = `<h1 className="font-[family-name:var(--font-display-grotesk)]">x</h1>`;
  assert.ok(!checkSource(ok).some((x) => x.rule === 'no-unlisted-font'));
  const ok2 = `<p style={{ fontFamily: "var(--font-display-mono)" }}>x</p>`;
  assert.ok(!checkSource(ok2).some((x) => x.rule === 'no-unlisted-font'));
});

test('no-unlisted-font: Pretendard 본문 지정은 통과', () => {
  const ok = `<p style={{ fontFamily: "var(--font-sans)" }}>x</p>`;
  assert.ok(!checkSource(ok).some((x) => x.rule === 'no-unlisted-font'));
});
