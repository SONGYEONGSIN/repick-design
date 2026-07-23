# S3a — 갤러리 native 표시 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 야간 루프가 만드는 native 후보/승자를 `/gallery`에 정적 스크린샷으로 노출한다 — WorkCard가 native work를 iframe 대신 `<img>`로 렌더하고, S4b 스모크 승자 a를 seed해 첫 native 작품을 보인다.

**Architecture:** 웹 후보는 Next 라우트라 iframe이지만 native는 Expo Web 정적 export(프로덕션에 서버 없음)라 judge가 생성한 스크린샷을 정적 이미지로 표시. `Work.image` 필드 유무로 WorkCard가 img/iframe 분기. native 스크린샷은 `app/public/native/`에 정적 자산으로.

**Tech Stack:** Next.js 16(App Router), React, TypeScript. plain `<img>`(Next 16 Image API 회피). 컴포넌트 unit 테스트 없음 → 검증 = `next build` + 갤러리 렌더.

## Global Constraints

- **native 미리보기 = 정적 스크린샷**(plain `<img>`, `alt=""`, 명시 width/height, `object-contain`). Expo 서버 불요. `/gallery`는 나이틀리 게이트(dash-static-check) 대상 아님(후보 라우트만).
- **웹 회귀 없음**: `image` 없는 work(landing/dash/free/evolve)는 기존 iframe 경로 불변.
- **native = permanent 카테고리 Ⅳ** (landing Ⅰ·dash Ⅱ·free Ⅲ·native Ⅳ·evolve Ⅴ조건부).
- **seed 콘텐츠**: S4b 스모크 승자 a(auto-native-r1) — 실제 gate 통과·3렌즈 judge 선정 승자.
- **비회귀**: `npm test` 44/44. `scripts/gate.mjs`·`.claude/skills/**`·`native/` 정본 diff 0. 변경 = `works.ts`·`work-card.tsx`·`page.tsx` + `app/public/native/notification-center.png`(신규).
- **한국어 커밋 + conventional 접두사, 푸터 없음.**

---

### Task 1: Work.image 필드 + WorkCard native 이미지 분기

**Files:**
- Modify: `app/src/lib/works.ts` (Work 타입에 `image?` 추가)
- Modify: `app/src/app/gallery/work-card.tsx` (프리뷰 img/iframe 분기)

**Interfaces:**
- Produces: `Work.image?: string`(스크린샷 정적 경로). WorkCard: `work.image` 있으면 `<img>`, 없으면 기존 `<iframe>`. Task 2의 NATIVE_WORKS가 소비.

- [ ] **Step 1: Work 타입에 image 필드 추가**

`app/src/lib/works.ts`에서 아래 old를 new로 교체.

old:
```ts
  target?: "dash" | "landing" | "native";
  date?: string;
};
```
new:
```ts
  target?: "dash" | "landing" | "native";
  date?: string;
  image?: string; // 정적 스크린샷 경로(native 등 이미지 미리보기 work). 있으면 WorkCard가 iframe 대신 <img> 렌더
};
```

- [ ] **Step 2: WorkCard 프리뷰를 img/iframe 분기로 교체**

`app/src/app/gallery/work-card.tsx`의 프리뷰 `<iframe>` 블록(아래 old)을 new로 교체.

old:
```tsx
        <iframe
          src={work.route}
          loading="lazy"
          title={`${work.brand} 미리보기`}
          tabIndex={-1}
          scrolling="no"
          onLoad={() => setLoaded(true)}
          className={`pointer-events-none absolute left-0 top-0 origin-top-left transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          style={{ width: "1440px", height: "1100px", transform: "scale(0.34)", border: 0 }}
        />
```
new:
```tsx
        {work.image ? (
          <img
            src={work.image}
            alt=""
            width={390}
            height={844}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className={`absolute left-1/2 top-1/2 max-h-full w-auto -translate-x-1/2 -translate-y-1/2 object-contain transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          />
        ) : (
          <iframe
            src={work.route}
            loading="lazy"
            title={`${work.brand} 미리보기`}
            tabIndex={-1}
            scrolling="no"
            onLoad={() => setLoaded(true)}
            className={`pointer-events-none absolute left-0 top-0 origin-top-left transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
            style={{ width: "1440px", height: "1100px", transform: "scale(0.34)", border: 0 }}
          />
        )}
```

- [ ] **Step 3: 빌드 회귀 확인 (image 없는 work = iframe 불변)**

Run: `lsof -ti :3100 | xargs -r kill 2>/dev/null; rm -rf app/.next; cd app && npx next build 2>&1 | tail -8`
Expected: 빌드 성공(정적 페이지 생성 완료, 에러 0). 아직 native work 없음 → 모든 카드 iframe 경로(웹 무변경), 타입 정합.

- [ ] **Step 4: 단위 테스트 불변**

Run: `npm test 2>&1 | grep -E "# (pass|fail)"`
Expected: `# pass 44 / # fail 0`.

- [ ] **Step 5: 커밋**

```bash
git add app/src/lib/works.ts app/src/app/gallery/work-card.tsx
git commit -m "feat(gallery): WorkCard native 이미지 미리보기 분기 + Work.image 필드(S3a)"
```

---

### Task 2: NATIVE_WORKS + seed 이미지 + 갤러리 native 카테고리

**Files:**
- Create: `app/public/native/notification-center.png` (seed 스크린샷)
- Modify: `app/src/lib/works.ts` (`NATIVE_WORKS` 신설 + `LAST_UPDATED`)
- Modify: `app/src/app/gallery/page.tsx` (native 카테고리 추가)

**Interfaces:**
- Consumes: Task 1의 `Work.image`·WorkCard img 분기.
- Produces: `NATIVE_WORKS: Work[]`(갤러리 native 카테고리 works).

- [ ] **Step 1: seed 스크린샷 복사 (smoke/native-r1에서 취득)**

```bash
mkdir -p app/public/native
git show smoke/native-r1:vault/20-generations/2026-07-22-auto-native-r1/shots/a-390.png > app/public/native/notification-center.png
file app/public/native/notification-center.png
ls -la app/public/native/notification-center.png
```
Expected: `PNG image data, 390 x 844` (또는 유사), 파일 크기 >0(스모크 승자 a 실제 렌더 스크린샷).

- [ ] **Step 2: NATIVE_WORKS 배열 추가 + LAST_UPDATED 갱신**

`app/src/lib/works.ts`의 `LANDING_WORKS` 선언(아래 old의 첫 줄) 바로 앞에 NATIVE_WORKS를 추가하고, `LAST_UPDATED`를 오늘 날짜로 갱신.

old (LAST_UPDATED 줄):
```ts
export const LAST_UPDATED = "2026-07-17"; // 결정론 규칙: 동적 Date 호출 금지, 갱신 시 수동 수정
```
new:
```ts
export const LAST_UPDATED = "2026-07-23"; // 결정론 규칙: 동적 Date 호출 금지, 갱신 시 수동 수정

export const NATIVE_WORKS: Work[] = [
  {
    id: "n1",
    route: "/native/notification-center.png",
    brand: "알림센터",
    desc: "알림 피드 · 날짜 그룹핑 · 미읽음 단일 액센트 (자동 native 라운드 auto-native-r1 승자)",
    target: "native",
    image: "/native/notification-center.png",
    status: "winner",
    round: "auto-native-r1",
    previewH: 420,
  },
];
```

- [ ] **Step 3: page.tsx에 native 카테고리 추가**

`app/src/app/gallery/page.tsx`의 import와 categories를 교체.

old (import 줄):
```ts
import { DASH_WORKS, FREE_WORKS, LANDING_WORKS, LAST_UPDATED, type Work } from "@/lib/works";
```
new:
```ts
import { DASH_WORKS, FREE_WORKS, LANDING_WORKS, NATIVE_WORKS, LAST_UPDATED, type Work } from "@/lib/works";
```

old (categories 배열):
```ts
  const categories = [
    { key: "landing", numeral: "Ⅰ", label: "랜딩", works: LANDING_WORKS },
    { key: "dash", numeral: "Ⅱ", label: "SaaS 대시보드", works: DASH_WORKS },
    { key: "free", numeral: "Ⅲ", label: "자유 창작", works: FREE_WORKS },
    ...(evolve.length > 0 ? [{ key: "evolve", numeral: "Ⅳ", label: "자율 루프 후보", works: evolve }] : []),
  ];
```
new:
```ts
  const categories = [
    { key: "landing", numeral: "Ⅰ", label: "랜딩", works: LANDING_WORKS },
    { key: "dash", numeral: "Ⅱ", label: "SaaS 대시보드", works: DASH_WORKS },
    { key: "free", numeral: "Ⅲ", label: "자유 창작", works: FREE_WORKS },
    { key: "native", numeral: "Ⅳ", label: "네이티브", works: NATIVE_WORKS },
    ...(evolve.length > 0 ? [{ key: "evolve", numeral: "Ⅴ", label: "자율 루프 후보", works: evolve }] : []),
  ];
```

- [ ] **Step 4: 빌드 + 갤러리 native 렌더 확인**

```bash
lsof -ti :3100 | xargs -r kill 2>/dev/null; rm -rf app/.next
cd app && npx next build 2>&1 | tail -8
```
Expected: 빌드 성공. 이어 dev로 렌더 확인:
```bash
( cd app && PORT=3100 npm run dev >/tmp/dev3100.log 2>&1 & )
for i in $(seq 1 40); do [ "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3100/gallery)" = "200" ] && break; sleep 1; done
curl -s http://localhost:3100/gallery | grep -o '네이티브\|notification-center.png\|알림센터' | sort -u
```
Expected: `/gallery` 200 + `네이티브`·`notification-center.png`·`알림센터` 전부 출현(카테고리 탭 + native 카드 이미지 렌더).

- [ ] **Step 5: 웹 회귀 + a11y + 단위 테스트**

```bash
# 기존 웹 카드(iframe) 여전히 존재
curl -s http://localhost:3100/gallery | grep -c 'iframe\|<img'
# a11y (갤러리 도그푸딩 유지)
npx lighthouse http://localhost:3100/gallery --only-categories=accessibility --preset=desktop --output=json --output-path=stdout --chrome-flags="--headless" 2>/dev/null | node -e "process.stdin.on('data',d=>{try{console.log('a11y',Math.round(JSON.parse(d).categories.accessibility.score*100))}catch{console.log('a11y unavailable')}})"
npm test 2>&1 | grep -E "# (pass|fail)"
```
Expected: iframe(웹) + img(native) 공존(grep ≥ 2). a11y ≥ 95(또는 unavailable — 환경 제약 시). `# pass 44 / # fail 0`.

- [ ] **Step 6: 변경 범위 + 커밋**

```bash
git add app/public/native/notification-center.png app/src/lib/works.ts app/src/app/gallery/page.tsx
git status --short
git commit -m "feat(gallery): 네이티브 카테고리 + 스모크 승자 a seed(알림센터, S3a)"
```
Expected: git status = 위 3파일만(scripts/skills/native 정본 무변경).

---

## Self-Review

- **Spec coverage**: Work.image(spec §3)→T1S1 · WorkCard native 분기(spec §4)→T1S2 · NATIVE_WORKS+seed(spec §5)→T2S1/S2 · page.tsx 카테고리(spec §6)→T2S3 · seed 이미지(spec §6)→T2S1 · 빌드/렌더(spec §7.1)→T2S4 · 웹 회귀(spec §7.2)→T1S3/T2S5 · a11y(spec §7.3)→T2S5 · 비회귀(spec §7.4)→T1S4/T2S5/T2S6. 전 요구 매핑됨.
- **Placeholder scan**: old/new 전문·명령·기대출력 구체. TBD/TODO 없음.
- **Type consistency**: `Work.image?: string`(T1) → NATIVE_WORKS의 `image` 필드(T2)·WorkCard `work.image`(T1) 일관. `NATIVE_WORKS` export명(T2S2)이 page.tsx import(T2S3)와 일치. 카테고리 numeral Ⅳ(native)/Ⅴ(evolve) 정합. seed 경로 `/native/notification-center.png`가 image·route·public 파일(T2S1)·NATIVE_WORKS(T2S2) 전반 동일.
- **주의**: 3100 dev 서버는 렌더 검증에만 사용(S3a는 8091 무관). `.next` 정리로 stale 캐시 회피(프로젝트 반복 이슈).
