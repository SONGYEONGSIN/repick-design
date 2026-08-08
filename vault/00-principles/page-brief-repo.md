---
tags: [principles, brief]
---

# 페이지 브리프 — 이 레포의 바인딩

> [[page-brief-core]]는 **어느 레포에서나 참인 규칙**만 담는다. 이 문서는 그 규칙들이 **이 레포에서 무엇에 묶이는지**를 담는다 — 언어 정책·폰트 변수명·빌드 명령·경로 레이아웃.
>
> 왜 나뉘어 있나: `page-commission` 스킬이 플러그인으로 배포되면서 정본이 **볼트 없는 레포에서도 읽힌다**. 코어에 이 레포의 값이 섞여 있으면 남의 레포에서 거짓이 된다(존재하지 않는 CSS 변수, 없는 디렉토리). 중복이 아니라 **분리**다 — 각 사실은 한 곳에만 산다.

## 1. 언어

- **카피 언어: 영문 전용** — 모든 UI 텍스트·헤딩·브랜드·라벨·더미 데이터는 영어. 한글·혼합 금지. 한 페이지 내 한/영 혼용은 그 자체로 결함이다.
- **근거는 글로벌 벤치마크 정합**이다 — 이 레포의 승격 작품은 Linear·Stripe·Vercel과 나란히 놓여 비교되는 카탈로그다. **이 근거가 없는 맥락에는 이 규칙이 적용되지 않는다.**
  - 주문 제작(`page-commission`)은 기본이 카탈로그 미등재라 **사용자가 고른 언어**를 쓴다. 다만 갤러리 등재를 요청하면 그 시점에 이 절이 발동한다
  - 플러그인 사용자에게는 애초에 카탈로그가 없다 — 이 절은 번들에 실리지 않는다

## 2. 폰트 화이트리스트 (실제 변수명)

`app/src/app/globals.css`가 정의하는 것만 쓴다. 정적 규칙 `no-unlisted-font`가 이 목록을 강제한다.

| 용도 | 변수 |
|---|---|
| 본문 (한글 포함 전 글리프) | `--font-sans` (Pretendard) |
| 고정폭 | `--font-mono` |
| 디스플레이 (라틴 전용·큰 크기 전용) | `--font-display-grotesk` · `--font-display-wide` · `--font-display-mono` |

- **한글 본문은 Pretendard 고정**이다 — `--font-display-*`에는 한글 글리프가 없다. 디스플레이 활자로 개성을 내는 축은 라틴에만 걸린다.
- 세리프는 의도적으로 부재다 — `no-font-serif`가 막는다.
- 다른 레포에 이식할 때는 이 목록을 그 레포의 변수로 갈아끼운다: `node scripts/gate.mjs --font-vars sans,mono,display-a,display-b`.

## 3. 산출물·환경

- **Next.js 16 App Router · Tailwind v4 · TypeScript.** 배정 경로의 `page.tsx`(+ client 컴포넌트 분리), default export.
- `cd app && npx next build` 통과. **자기 폴더만** 작업한다.
- dev 서버는 **3100**. 게이트의 `--base` 기본값이 `http://localhost:3100`이다.
- 라우트 → 파일 매핑의 뿌리는 `app/src/app`. 게이트의 `--app-root`가 이 값을 받는다.
- 반환은 간결히: 제품/브랜드 + 구성 + 적용한 인터랙션 목록 + 폰트/타이포 통일 확인 + 완성도 포인트.

## 4. 타입 목록의 정본은 코드다

`app/src/lib/works.ts`의 **`PAGE_TYPES`** 배열이 카테고리 유니온이자 자율 라운드의 생성 큐이며, **순서가 곧 우선순위**다. [[page-brief-core]]의 프로파일 표는 **문서가 있는 타입**만 추린 것이라 `PAGE_TYPES`보다 짧다. 프로파일이 없는 타입이 큐에서 뽑히면 그 라운드가 코어만으로 생성하고, 그때 나온 delta가 새 프로파일의 초안이 된다.

## 5. 게이트가 요구하는 것

| 관문 | 필요한 것 | 없으면 |
|---|---|---|
| `static` | 없음 (`node:fs`만) | — 항상 돈다 |
| `lint` | 레포의 ESLint flat config | `unavailable` (pass) |
| `weights` | 없음 | — 기록만 |
| `sweep` | Playwright + dev 서버 | 실패 |
| `a11y` · `perf` | Lighthouse + Chrome | `unavailable` (pass) |

플러그인 번들은 **`static`만** 싣는다 — 나머지는 이 레포의 개발 환경에 묶여 있다.

## 관련

- 코어: [[page-brief-core]] · 정제 기준: [[curation-criteria]]
