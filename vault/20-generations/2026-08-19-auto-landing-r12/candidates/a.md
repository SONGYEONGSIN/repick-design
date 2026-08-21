# auto-landing-r12 후보 a — Cascade (live match-feed hero)

**한 줄 컨셉**: 히어로 폴드 안에서 3장의 매물 카드가 고정 순환 스트림으로 자리를 바꾸며 매칭%·등급·인증·할인을 항상 동시에 보여주고, 재생/일시정지·카테고리 필터·카드 확장 네 가지 조작이 전부 그 스트림과 아래 "3체크" 섹션의 실제 숫자를 재계산한다 — "지금 이 순간에도 거래가 일어난다"를 정지 스크린샷 한 장으로도, 조작 이후로도 증명한다.

**가장 가까운 이웃과의 차별화(한 문장)**: 기존 16종 중 실제로 가장 가까운 이웃은 v8(원형 게이지 다이얼 — 정적·단일 결과 시각화)과 r10/c의 `TrustMarquee`(순수 CSS 마퀴)인데, v8은 조작 후 하나의 최종값만 보여주는 단일-결과형이고 r10/c의 마퀴는 폴드 중간의 장식적 신뢰-로고 흐름(증명을 담지 않음)인 반면, 이 후보는 **히어로 첫 폴드 자체가 여러 매물의 매칭 증거 다발을 실시간으로 순환·재계산하는 다중-아이템 스트림**이라는 점에서 결이 다르다.

## 인터랙션 — 4종 이상, 전부 표시 증명을 갱신

| 조작 | 갱신되는 면 |
|---|---|
| 재생/일시정지 토글 (히어로 스트림 헤더) | 자동 순환 시작/정지, `aria-pressed` |
| 카테고리 필터 (All/Outerwear/Footwear/Bags/Accessories, `aria-pressed`) | 스트림 표시 카드 집합 · "Showing N of M" 문장(`aria-live`) · avg match·avg savings · 3체크 섹션의 avg match·등급 분포 막대(scaleX)·verified 비율 — **6면 동시 재계산** |
| 카드 hover/tap 확장 (`aria-expanded`) | AI 매칭 근거 태그 3개 인라인 노출, 확장 중엔 자동 순환 일시 정지 |
| 이전/다음 수동 스텝 버튼 | 순환 인덱스 수동 이동 (재생 상태와 무관하게 항상 사용 가능) |
| 스크롤 트리거 (`whileInView`, `once:true`) | 신뢰 통계 4개 + 후기 3개 stagger 리빌, 마감 CTA 밴드 리빌 |

정지 상태(자동 순환 꺼짐·필터 미조작)에서도 히어로는 이미 매칭%·등급·인증 배지·할인 배지가 3장 동시에 보인다 — 구조 기본형 1번을 스크린샷 한 장으로 만족한다.

## 브리프에 없던 것

**① 액센트를 인디고 3단 체계로 분리** — ② 채움(`#4F46E5`, indigo-600, 흰 텍스트 6.29:1) · 소형 텍스트/포커스링(`#A5B4FC`, indigo-300, `#0B0B0F` 위 9.86:1) · 대형 텍스트·비텍스트 전용(`#6366F1`, indigo-500, 4.4:1 — 대형 3:1 기준만 충족) ③ 배정받은 "indigo 계열"이 정본 토큰 `#6E56CF`(violet-hex, 이번 라운드 회피 대상)와 다른 hex여야 했고, indigo-500 자체도 본문 크기 AA(4.5:1)에 못 미쳐 `r9/c`·`r10`이 violet에서 겪은 것과 같은 함정이 그대로 재현됐다 — 3단 분리로 피했다. **직접 계산**

**② 다크 보조텍스트를 zinc-400 이하로 절대 안 내림** — ② 브랜드/타임스탬프/미인증 배지 등 모든 tertiary 텍스트를 `text-zinc-400`(`#A1A1AA`, 7.65:1)으로 고정, `zinc-500`(4.06:1)·`zinc-600`은 텍스트에 한 번도 안 씀 ③ 정적 규칙 `no-dark-dim-text`는 `dark:text-*-500/600` 리터럴만 잡는데 이 페이지는 조건부 다크가 아니라 **상시 다크**라 `dark:` 접두사를 안 쓴다 — 즉 규칙이 형식상 안 걸려도 실제 대비 결함은 그대로 발생할 수 있어, 정적 검사 통과 여부와 무관하게 직접 4.5:1 문턱으로 판단했다. **정적 검사 한계 인지 + 직접 계산**

**③ 데이터셋을 8개가 아니라 16개(카테고리당 4개)로 확장** — ② 카테고리당 4개, 스트림 윈도 3장 ③ 초안은 카테고리당 2개였는데 그러면 필터를 걸 때마다 `filtered.length <= STREAM_WINDOW`가 참이 되어 자동 순환이 즉시 멈추고 "라이브 피드"라는 주장이 필터 클릭 한 번에 무력화된다 — 순환이 실제로 도는 최소 크기를 역산해 4로 올렸다. **역산**

**④ 모바일 390px 오버플로 97px — 원인은 `lg:grid-cols-12`에 대응하는 base `grid-cols-1` 누락** — ② 히어로 2열, 가치 3분할, 신뢰 통계 4열 grid 세 곳 모두 `grid gap-* lg:grid-cols-N`만 있고 base `grid-cols-1`이 없었다 ③ Tailwind의 `grid-cols-N`은 트랙을 `minmax(0,1fr)`로 깔아 콘텐츠 기반 자동-최소폭 확장을 막는데, base가 없으면 `lg` 미만에서 `grid-template-columns:none`이 되어 암시적 단일 컬럼이 콘텐츠의 max-content 폭(463px)으로 벌어진다 — `page-brief-core` §4의 "그리드 아이템 `min-w-0`" 조항이 가리키는 것과 같은 계열의 함정을 그리드 트랙 쪽에서 재현한 것. Playwright 실측(390/1280/1366/1440/1536/1680/1920)으로 잡고 base `grid-cols-1` 추가로 0건까지 확인. **렌더 실측 + 게이트 역산**

**⑤ `useEffect` 안의 동기 `setState`를 렌더-단계 조정 패턴으로 교체** — ② 필터가 바뀔 때 스트림 인덱스·확장 카드를 리셋하는 로직을 `useEffect(() => setStartIndex(0), [activeCategory])`가 아니라 `if (activeCategory !== prevCategory) { setPrevCategory(...); setStartIndex(0); ... }`를 렌더 본문에 직접 두는 React 공식 문서 패턴("Adjusting state when a prop changes")으로 작성 ③ 이 레포의 `eslint-plugin-react-hooks`가 `react-hooks/set-state-in-effect`를 하드 에러로 강제해, 최초 구현(useEffect 버전)이 `npx eslint`에서 2건 실패했다 — 규칙이 요구하는 건 "효과 밖에서 정리"가 아니라 "렌더 중 조건부 조정"이라는 더 구체적인 구조였다. **게이트(lint) 역산**

**⑥ prefers-reduced-motion을 별도 state 동기화 없이 `isPlaying && !prefersReducedMotion` 파생값으로만 반영** — ② `isAutoAdvancing` 파생 변수 하나로 순환 인터벌 가드·점 펄스 애니메이션 클래스를 모두 제어, `isPlaying` 자체는 사용자의 재생/일시정지 의도만 담당 ③ 처음엔 `useEffect(() => { if (prefersReducedMotion) setIsPlaying(false) }, [prefersReducedMotion])`로 짰는데 이것도 ⑤와 같은 `set-state-in-effect` 위반이었고, 애초에 두 상태를 동기화하는 것 자체가 불필요한 간접이었다 — 파생값 하나로 접기가 규칙도 만족하고 코드도 더 정직해졌다. **게이트 역산 + 단순화**

**⑦ 헤더/푸터를 별도 서버 컴포넌트(`Chrome.tsx`)로 분리해 `<main>`이 전 1차 콘텐츠를 감싸게 함** — ② 처음엔 `LiveFeedLanding.tsx`(히어로+3체크) 안에 `<header>`+`<main>`을 두고 `ProofClosing.tsx`(신뢰+CTA+푸터)를 그 `</main>` 바깥 형제로 붙였는데, 그러면 신뢰/CTA/푸터 섹션이 `<main>` 랜드마크 밖에 남는다 — `axe`의 `landmark-one-main`은 통과해도(정확히 1개), "1차 콘텐츠는 main 안"이라는 관례를 어겼다. `page.tsx`에서 정적 `SkipLink`/`SiteHeader`/`SiteFooter`를 꺼내 `<main>`이 두 인터랙티브 컴포넌트를 전부 감싸도록 재배선했다 ③ Playwright로 `main mains:1, headers:1, footers:1, mainContainsProof:true, footerOutsideMain:true`를 직접 실측해 구조를 확정했다. **렌더 실측 + 구조 재배선**

**⑧ 줄 길이 상수 0.44em으로 두 문단 폭을 역산(그리고 실측 도중 위반 1건 발견해 수정)** — ② 히어로 서브헤드 17px×`max-w-[520px]`: 520÷(0.44×17)=520÷7.48≈69.5자 — 목표 70자 근처를 그대로 만족해 그대로 둠. 반면 "3체크" 인트로 문단은 초안이 15px×`max-w-[560px]`였는데 560÷(0.44×15)=560÷6.6≈84.8자로 상한 75자를 초과 — `max-w-[460px]`로 줄여 460÷6.6≈69.7자로 교정했다(마감 CTA 서브카피도 동일 계열 실수라 같이 460px로 맞춤). 값 카드 본문(300px@14px→48.7자)·후기 인용문(카드 폭 약 376px@15px→57자)은 짧은 캡션 예외에 해당해 그대로 둠. ③ `ch` 단위는 한 번도 안 씀. **계산 + 위반 자가 발견·수정**

**⑨ 매물 사진 alt를 "AI 스캔 소견"으로 서술** — ② 예: `"AI scan: single-breasted wool-blend, belt intact, light shoulder wear"` — 제목/브랜드와 겹치지 않는 별도 관찰 문장 16개 전부 개별 작성 ③ "AI가 무엇을 봤는지의 증명"이라는 이번 라운드 이미지 지시의 취지를 접근성 트리에도 그대로 심었다 — 스크린리더 사용자도 "AI가 사진에서 무엇을 확인했는가"를 카드 제목과 동일한 정보량으로 받는다. **정본 지시 해석**

**⑩ 스트림 패널 hover/focus/카드-확장 중 자동 순환을 일시정지, 조작 컨트롤은 항상 노출** — ② `isHovering`(마우스+포커스)·`expandedId !== null` 둘 다 인터벌 가드에 포함, 재생/일시정지·이전/다음 버튼은 순환 상태와 무관하게 항상 Tab 도달 가능 ③ 자동 갱신 콘텐츠가 사용자가 읽는 도중 밑에서 바뀌는 것은 WCAG 2.2.2(움직이는 콘텐츠)가 우려하는 패턴이다 — hover/focus/확장 중 정지는 카탈로그의 관례를 넘어 이 페이지가 자기 컨셉("계속 흐르는 피드")과 접근성 요구가 충돌하는 지점에서 직접 내린 판단. **임의(접근성 원칙 적용)**

## 쓴 축 3종 (배정 확인)

| 축 | 값 |
|---|---|
| 테마 | **dark** — bg `#0B0B0F` / fg `#FFFFFF` / muted `#A1A1AA`(zinc-400 고정, 텍스트에 500/600단 미사용) |
| 액센트 | **indigo** — 채움 `#4F46E5` · 소형텍스트/포커스링 `#A5B4FC` · 대형·비텍스트 `#6366F1` (정본 violet-hex `#6E56CF`와 다른 hex) |
| 디스플레이 활자 | **미사용** — 헤딩·본문 전부 `--font-sans`(Pretendard)만, `--font-display-*` 무호출 |

렌더 실측 폰트 웨이트: **[400, 600, 800] 정확히 3종** (Playwright `getComputedStyle` 실측, SVG 제외).

## 검증 방법과 결과

- `npx tsc --noEmit`, `npx eslint "src/app/landing-evolve/r12/a/**/*.{ts,tsx}"`, `node scripts/dash-static-check.mjs <4파일>` 전부 0건.
- `node scripts/dash-sweep.mjs --base http://localhost:3100 --routes /landing-evolve/r12/a` — 1280/1366/1440/1536/1680/1920/390 전 폭 `pass:true, failures:[]`(최초 실측은 `lg:grid-cols-12` base 누락으로 390px에서 97px 오버플로 실패 → ④ 수정 후 재실측 통과).
- `runSweep`의 렌더 포커스 실측(1440px, 실제 Tab 이동 + 링 서명 비교, 상태를 연 팔레트/토글류는 이 페이지엔 해당 없음) — 0건 누락.
- Playwright로 필터 5회 클릭·재생/일시정지 2회·이전/다음 각 1회·카드 확장/축소·자동 순환 4초 대기까지 전부 수행 후 콘솔 확인 — `pageerror`·React 경고 0건. 유일하게 뜬 콘솔 에러는 `images.unsplash.com`에 대한 `403 Forbidden`/`ERR_TUNNEL_CONNECTION_FAILED`로, 이 세션의 아웃바운드 정책 프록시가 그 호스트를 차단한다(`curl`로 직접 재현·확인). `auto-landing-r10/c`가 이미 같은 제약을 기록했다 — 이미지 자체나 코드의 결함이 아니라 샌드박스 환경 제약이다.
- Lighthouse a11y/perf는 이 세션에서 실행하지 않았다(Chrome 헤드리스-셸 미설치, `chromium-1194` 정식 바이너리로 대체해 sweep/focus만 수행).
- 구조 실측: `document.querySelectorAll('main').length === 1`, 헤딩 순서 h1→h2→h3(3개, 같은 h2 아래)→h2→h2로 레벨 스킵 없음, `<footer>`가 `<main>` 밖.
