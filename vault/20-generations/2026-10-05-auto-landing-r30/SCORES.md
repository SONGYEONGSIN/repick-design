# auto-landing-r30 — SCORES

소스 동결 SHA-1(최초, 1-fix 전): `c1556a25ec279639450ae2dea077be40dddbc3b0`
(`find app/src/app/landing-evolve/r30 -name "*.tsx" -o -name "*.ts" | sort | xargs cat | shasum`)

`node scripts/gate.mjs --target web --routes /landing-evolve/r30/a /landing-evolve/r30/b /landing-evolve/r30/c`

## 1차

| gate | a | b | c |
|---|---|---|---|
| route | 통과 | 통과 | 통과 |
| types | 통과 | 통과 | 통과 |
| static | 통과 | 통과 | 통과 |
| lint | 통과 | 통과 | **실패** — `react/no-unescaped-entities` 4건(`hero.tsx:39,41,51`·`value-split.tsx:45`) |
| weights | 4종(400/600/700/800, 기록만) | ← | ← |
| sweep | 통과 | 통과 | 통과 |
| focus | 통과 | 통과 | 통과 |
| console | 통과(결함 0) | 통과 | 통과 |
| a11y | 통과(100) | **실패(93)** — 승격 하드페일 `definition-list`+`label-content-name-mismatch` | 통과 |
| perf | 기록만 | 기록만 | 기록만 |

**pass: false** (b, c 각 1건 실패)

## 1-fix

- **b**: `CategoryAudit.tsx` — ① `<dl>` 직계 자식이 `div > div`(dt/dd 2단 중첩)였던 구조를 `div > (dt, dd)` 직계 쌍으로 재구성(스와치 아이콘을 `dt` 내부로 이동). ② 카테고리 선택 버튼(데스크톱+모바일 변형, 총 4곳)의 `aria-label`이 가시 텍스트를 포함하지 않는다고 axe가 판정 → `aria-label` 제거, 가시 텍스트 뒤 `sr-only` 보충 문구로 전환.
- **c**: `hero.tsx`(3건)·`value-split.tsx`(1건) 아포스트로피를 `&rsquo;`로 치환.

## 재게이트

`node scripts/gate.mjs --target web --routes /landing-evolve/r30/a /landing-evolve/r30/b /landing-evolve/r30/c` → **pass: true, violations: 0**. a11y 100(전원, `bf-cache`만 미승격 감사로 기록). lint 0.

스크린샷: `capture-shots.mjs` 4폭(1280/1440/1920/390) × 4스크롤(0/35/70/100%) = 48장(16×3), blank 0건·에러 0건.
