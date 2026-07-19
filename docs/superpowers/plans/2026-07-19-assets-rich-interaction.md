# 에셋 + 풍부한 인터랙션 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 자율 라운드가 에셋(생성형 SVG/CSS + 외부 이미지)과 인터랙션을 타깃 차등으로 적극 활용하게 하되, 신규 리스크를 static-check 이미지 규칙 3종으로 기계 방어.

**Architecture:** static-check에 line-rule 2종(no-raw-img·no-next-image-unopt) + source-level 1종(img-needs-alt, 다중 라인 태그 span 스캔)을 추가. brief/DNA 문서와 dash-evolve SKILL에 에셋·인터랙션 조항·judge 렌즈를 반영. 스모크 2라운드로 배선 검증.

**Tech Stack:** Node ESM + node:test(기존 패턴), Claude Code 스킬 1종 개정, next.config(이미 Unsplash 허용됨), Next.js 16.

**Spec:** `docs/superpowers/specs/2026-07-19-assets-rich-interaction-design.md`

## Global Constraints

- static-check는 line-level 정규식(기존 패턴) + 주석 스트립 재사용. img-needs-alt만 source-level(다중 라인 태그 대응).
- 회귀 기준: 기존 생존작은 원시 `<img>` 0(전부 next/image), d29 Avatar는 `<Image>` 다중 라인 + `alt=` 별도 라인 → **img-needs-alt가 오탐하면 안 됨**(span 스캔 필수).
- 정본 2개(dash-brief-v3.md·design-principles.md) 수정은 이 계획의 명시 태스크에서만(자율 라운드는 여전히 불변식).
- 커밋: conventional + 한국어 + `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>` 푸터. **push는 Task 5(컨트롤러)에서** — main push는 프로덕션 자동 배포.
- dev 서버 3100 재사용(재기동 금지). Task 4(스모크)만 evolve/dash에서, 나머지는 main.

---

### Task 1: static-check 이미지 규칙 3종 (TDD)

**Files:**
- Modify: `scripts/dash-static-check.mjs`
- Modify: `scripts/dash-static-check.test.mjs`

**Interfaces:**
- Consumes: 기존 `checkSource(src) → violations[]`.
- Produces: `checkSource`가 신규 규칙 `no-raw-img`·`no-next-image-unopt`(line-rule)·`img-needs-alt`(source-level) 위반도 반환. 위반 배열은 line 오름차순 정렬.

- [ ] **Step 1: 실패 테스트 추가** (`scripts/dash-static-check.test.mjs` 말미)

```js
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
```

- [ ] **Step 2: 실패 확인** — Run: `node --test scripts/dash-static-check.test.mjs` / Expected: 신규 6 FAIL(no-raw-img 등 미구현), 기존 통과.

- [ ] **Step 3: 구현** — `scripts/dash-static-check.mjs`를 아래로 교체

```js
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
  // 1) line-level 규칙
  src.split('\n').forEach((line, i) => {
    const stripped = line.replace(/\{\/\*.*?\*\/\}/g, '').replace(/\/\*.*?\*\//g, '').replace(/(?<!:)\/\/.*$/u, '');
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
    if (!/\balt\s*=/.test(span)) {
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
```

- [ ] **Step 4: 테스트 통과** — Run: `node --test scripts/dash-static-check.test.mjs` (기존 8 + 신규 6 = 14) 그리고 `npm test` 전체 PASS.

- [ ] **Step 5: 회귀 확인 (핵심)** — 기존 생존작에 신규 규칙 오탐 0:
Run: `node scripts/dash-static-check.mjs app/src/app/dash/d29/components/ui/Avatar.tsx app/src/app/dash/d29/**/*.tsx; echo exit=$?`
(glob 안 먹으면 `find app/src/app/dash/d29 -name '*.tsx' | xargs node scripts/dash-static-check.mjs`)
Expected: `[]` + exit=0 — d29 Avatar의 다중 라인 `<Image>` + 별도 라인 `alt=`가 img-needs-alt로 **안 잡혀야** 함(span 스캔 검증). 잡히면 tagSpanEnd/alt 정규식 수정 후 Step 1~4 반복.

- [ ] **Step 6: 커밋**

```bash
git add scripts/dash-static-check.mjs scripts/dash-static-check.test.mjs
git commit -m "feat(evolve): static-check 이미지 규칙 3종 — no-raw-img·img-needs-alt·unopt

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: brief/DNA 문서 에셋·인터랙션 조항

**Files:**
- Modify: `vault/00-principles/dash-brief-v3.md` (dash 조항 추가)
- Modify: `vault/00-principles/design-principles.md` (landing 조항 추가)

**Interfaces:**
- Consumes: 없음.
- Produces: 자율 라운드가 RETRIEVE에서 읽는 정본에 에셋·인터랙션 기준. `node scripts/wiki-lint.mjs` 위반 0 유지(링크 추가 시 대상 실존 확인).

- [ ] **Step 1: dash-brief-v3.md에 조항 추가** — "## 하드 제약" 섹션 **직전**에 아래 절 삽입:

```markdown
## 에셋·인터랙션 (서비스급 절제 유지, 밀도 상향)
- **생성형 SVG/CSS 적극**: 도메인 고유 시각화(오실로스코프·간트·헥스맵류)를 코드 생성형 SVG/CSS(패턴·마스크·그라데이션·블렌드)로 더 풍부하게. 외부 파일 0, 결정론 유지(삼각함수 좌표 소수 2자리).
- **이미지 규율**: 아바타·썸네일 등은 원시 `<img>` 금지 → `next/image` `<Image>`(고정 URL·`width/height` 또는 `fill`·`alt` 필수, `unoptimized` 금지). 비결정 선택(Math.random 인덱싱) 금지.
- **인터랙션 최소 4종**(기존 3종에서 상향): 크로스헤어 툴팁·실제 정렬/필터·기간/뷰 토글·선택→다중 위젯 동기화·라이브 미니 차트 중 4개+. 전부 `'use client'` 실동작 + 결정론(step 카운터·state 구동) + `motion-reduce` 게이팅.
- **금지 유지**: 연극적 발광·스캔라인·그레인·글로시 장식은 여전히 금지(서비스급). 모션은 정보·전환에 기여할 때만 — 의미없는 데코는 감점.
```

- [ ] **Step 2: design-principles.md에 조항 추가** — 파일 말미(마지막 원칙 뒤)에 아래 절 추가:

```markdown
## 에셋·인터랙션 (랜딩 — 표현 상한 없음)
- **에셋 적극**: 히어로 이미지·제품샷·아바타(next/image, 고정 URL·alt·크기 명시)와 생성형 SVG/CSS(키네틱 타입·시차 배경·마스크 연출)를 표현적으로. dash와 달리 연출·무드를 허용.
- **framer-motion 적극**: 설치돼 있으나 미활용 — 스크롤 연동 연출·시차(parallax)·진입 시퀀스·제스처에 적극 사용. 단 결정론(랜덤 금지)·`motion-reduce` 게이팅·진입 opacity:0 잔존 금지.
- **인터랙션 최소 4종**: 히어로 인터랙션·스크롤 트리거·제품 프리뷰 상호작용·폼/퀴즈 등 4개+. 데코가 아니라 전환·설득에 기여.
- **이미지 규율**: 원시 `<img>` 금지 → `next/image`. `unoptimized` 금지. alt 필수.
```

- [ ] **Step 3: 검증** — Run: `node scripts/wiki-lint.mjs; echo exit=$?` / Expected: 위반 0, exit=0(문서 추가가 링크 무결성 안 깨짐). 그리고 `grep -c "에셋·인터랙션" vault/00-principles/dash-brief-v3.md vault/00-principles/design-principles.md` → 각 1.

- [ ] **Step 4: 커밋**

```bash
git add vault/00-principles/dash-brief-v3.md vault/00-principles/design-principles.md
git commit -m "feat(vault): 에셋·인터랙션 조항 — dash 절제 상향·landing 표현적

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: dash-evolve SKILL 에셋 파라미터·judge 렌즈·게이트

**Files:**
- Modify: `.claude/skills/dash-evolve/SKILL.md`
- Modify: `app/next.config.ts` (remotePatterns 확장)

**Interfaces:**
- Consumes: Task 1 규칙(HARD GATE에서 자동 적용됨 — static-check 호출은 이미 있음), Task 2 정본 조항.
- Produces: 타깃 파라미터 표에 "에셋 수위" 행, judge 렌즈2 확장, next.config 이미지 도메인.

- [ ] **Step 1: 타깃 파라미터 표에 행 추가** — `.claude/skills/dash-evolve/SKILL.md`의 "## 타깃 파라미터" 표에서 "judge 렌즈" 행 **뒤**에 아래 행 추가(표 형식 유지):

```markdown
| 에셋·인터랙션 | 서비스급 절제 유지 + 도메인 생성형 시각화 밀도↑, 인터랙션 4종+ (연출·발광 금지) | 표현 상한 없음 — 히어로 이미지·framer-motion·스크롤 연출, 인터랙션 4종+ |
```

- [ ] **Step 2: judge 렌즈2 확장** — "## 타깃 파라미터" 표의 judge 렌즈 셀 또는 §4 JUDGE 렌즈 설명에서, 렌즈2("상용 완성도")에 다음 문장을 덧붙인다(dash·landing 공통, §4 렌즈 목록 아래 한 줄):

```markdown
- 렌즈2 심사 축(에셋·인터랙션 풍부도): 생성형/이미지 에셋을 의미있게 썼는가, 인터랙션이 데코가 아니라 정보·전환에 기여하는가, 타깃 절제선(dash=서비스급 / landing=표현적)을 지켰는가. **장식 과잉·의미없는 모션은 감점**(v2세대 탈락 사유 재발 방지).
```

- [ ] **Step 3: HARD GATE 이미지 규칙 명시** — §3 HARD GATE의 "**정적**" 항목 문장 끝에 괄호 추가: `(이미지 규칙 포함 — 원시 img·alt 누락·unoptimized 자동 검출)`.

- [ ] **Step 4: next.config remotePatterns 확장** — `app/next.config.ts`의 remotePatterns에 자율 라운드가 쓸 만한 무료 이미지 도메인을 추가(현재 unsplash 2개). 아래로 교체:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 5: 검증** — Run: `cd app && npx next build 2>&1 | tail -3` (config 파싱 통과) + `grep -c "에셋·인터랙션" .claude/skills/dash-evolve/SKILL.md` → 1 이상 + `grep -c "picsum" app/next.config.ts` → 1.

- [ ] **Step 6: 커밋**

```bash
git add .claude/skills/dash-evolve/SKILL.md app/next.config.ts
git commit -m "feat(skill): dash-evolve 에셋 수위·judge 렌즈2·이미지 도메인 확장

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: 로컬 스모크 2라운드 (dash + landing, evolve/dash)

**Files:** 실행 산출물만 (`app/src/app/{dash,landing}-evolve/r<N>/`, run 디렉토리, jsonl append) — 결함 시 해당 태스크 복귀.

**Interfaces:**
- Consumes: Task 1~3 전부.
- Produces: 에셋·인터랙션 상향이 게이트를 통과하고 갤러리 iframe에서 이미지가 렌더됨을 실증.

- [ ] **Step 1: 브랜치 준비** — `git fetch origin && git checkout -B evolve/dash origin/evolve/dash && git rebase main`. 충돌 시 both-changes(내용 손실 금지). `git log --oneline -3`에 Task 1~3 커밋 포함 확인.
- [ ] **Step 2: dash 라운드** — `.claude/skills/dash-evolve/SKILL.md` 플레이북으로 **TARGET=dash 강제**, 후보 2개(a,b), 각 후보가 **이미지 1장+ 또는 생성형 SVG 에셋 + 인터랙션 4종+** 사용하도록 GENERATE 지시. dev 서버 3100 재사용(500/미응답이면 dev 종료 후 `rm -rf app/.next` 재기동 — .next 손상 대응). designer 멈추면 1회 재개 후 직접 완성. HARD GATE(이미지 규칙 포함)·JUDGE·LEARN·기록까지 완주.
- [ ] **Step 3: landing 라운드** — 동일하게 **TARGET=landing 강제**, 후보 2개, framer-motion·히어로 이미지·스크롤 연출 지시.
- [ ] **Step 4: 체크리스트**
  - `node scripts/dash-static-check.mjs <두 라운드 후보 tsx들>` → `[]` (이미지 규칙 포함 통과 — 후보가 next/image·alt 준수)
  - `tail -2 vault/30-ledger/auto-ledger.jsonl` → dash·landing 각 1 entry, target 필드
  - `git diff main..evolve/dash -- vault/00-principles/dash-brief-v3.md vault/00-principles/design-principles.md` → **출력 없음(정본 불변)**
  - **갤러리 iframe 이미지 렌더**: dev 서버에서 승자 후보의 이미지가 실제 로드되는지 — `curl -s "http://localhost:3100/_next/image?url=<후보가 쓴 이미지 URL 인코딩>&w=640&q=75" -o /dev/null -w "%{http_code}"` → 200(next/image 프록시 동작). 또는 후보 페이지 HTML에 `/_next/image` src가 있는지 grep.
  - `node scripts/wiki-lint.mjs; echo exit=$?` → 0
- [ ] **Step 5: main 복귀** — `git checkout main` (서버가 evolve 워킹트리 서빙 중이면 보류 판단 — Task 5가 브랜치 명시 push).

---

### Task 5: push + 배포 (컨트롤러 전용 — 서브에이전트 금지)

**Files:** 없음 (push + 기록)

- [ ] **Step 1: main push** — `git push`. Vercel git 자동 배포 확인(2~3분 후 새 배포). nightly routine 프롬프트는 SKILL.md 참조 방식이라 **변경 불요**(SKILL 개정이 자동 반영).
- [ ] **Step 2: evolve/dash push** — `git push --force-with-lease origin evolve/dash`(Task 4 rebase+스모크 반영).
- [ ] **Step 3: AUTO-RUN-LOG 기록 + push**

```markdown
- 2026-07-19: 에셋·인터랙션 상향 — 이원 에셋 엔진(생성형 SVG/CSS + 외부 이미지), 타깃 차등(landing 표현적·dash 절제+밀도↑), static-check 이미지 규칙 3종(no-raw-img·img-needs-alt·no-next-image-unopt), judge 렌즈2 풍부도 축.
```

```bash
git add vault/30-ledger/AUTO-RUN-LOG.md && git commit -m "docs(vault): 에셋·인터랙션 상향 가동 기록

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>" && git push
```

---

## Self-Review 결과

- **Spec coverage**: §3 이원 에셋→Task 2 조항, §4 인터랙션 상향(타깃 차등)→Task 2+Task 3 파라미터, §5 이미지 규칙 3종→Task 1(TDD), §6 judge 렌즈→Task 3 Step 2, §7 문서·배선→Task 1/2/3, §8 CSP·갤러리→Task 4 Step 4(iframe 이미지 렌더 실증), §9 검증→Task 1/4, §10 비범위 준수(로컬 에셋·Lottie·사운드 없음).
- **회귀 안전**: 기존 생존작 원시 img 0(실측), d29 Avatar 다중라인 alt는 span 스캔으로 통과 — Task 1 Step 5가 명시 검증.
- **타입/규칙 일관성**: 신규 규칙 id(no-raw-img·img-needs-alt·no-next-image-unopt)가 Task 1 코드·테스트·Task 3 SKILL 문구에서 일치.
