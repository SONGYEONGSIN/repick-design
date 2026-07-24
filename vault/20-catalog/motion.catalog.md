---
tags: [catalog, motion]
source: ui-ux-pro-max (github.com/nextlevelbuilder/ui-ux-pro-max-skill)
license: MIT
attribution: Next Level Builder
fetched: 2026-07-24
platform: web — landing=framer-motion, dash=결정론 CSS/transform. native 모션(Reanimated)은 후속.
note: 원본 16 모션 패턴의 taxonomy(강도 티어·트리거·듀레이션·이징·do/don't)만 이식. GSAP 스니펫은 버리고 framer-motion/CSS로 재해석. dash는 절제, landing은 적극.
---

# Motion — 모션 패턴 카탈로그 (강도 티어)

> 소비자: dash는 [[dash-brief-v3]] §에셋·인터랙션(서비스급 절제·결정론·motion-reduce), landing은 [[design-principles]] §에셋·인터랙션(framer-motion 적극). 정제 기준 [[curation-criteria]].
> 층위: 정량 결정 규칙. 강도 티어 = **Subtle**(피드백) · **Standard**(연출) · **Complex**(스토리텔링).

## repick 적응 규칙 (원본과 다른 점 — 반드시 적용)
- **GSAP 스니펫은 버린다**. repick 스택은 **landing=framer-motion**, **dash=결정론 CSS/transform**. 아래 표는 "언제·무엇을·얼마나(강도·듀레이션·이징)" taxonomy만 이식.
- **dash vs landing 적용 구분**(가장 중요):
  - **dash**: 서비스급 절제 — 모션은 **정보·전환에 기여할 때만**. 연극적 발광·스캔라인·시차(parallax)·scrub·pin·magnetic·split-text는 **금지**(연출 감점). Hover 피드백·로딩·기간토글 같은 기능성 모션만.
  - **landing**: 표현 적극 — 스크롤 리빌·시차·진입 시퀀스·scrollytelling 허용(단 §공통 필수 준수).
- **§공통 필수 (dash·landing 둘 다)**:
  - `motion-reduce`/`prefers-reduced-motion` 게이팅 필수 — 미준수 시 하드게이트 감점([[ux-guidelines.catalog]] "모션 민감" 🔴).
  - **결정론**: `Math.random`/`Date.now` 금지, 좌표는 고정·계산(삼각함수 소수 2자리).
  - **진입 opacity:0 잔존 금지** — 애니메이션 미실행 시에도 콘텐츠가 보여야 함(SEO·no-JS 폴백).
  - **transform·opacity만** 애니(레이아웃 속성 width/height/top/left 금지 → 컴포지터 스레드 유지).
  - 진입(exit)은 <250ms, 진입<이탈 비대칭 타이밍(back/forward 스냅).

## 패턴 카탈로그 (16종)

| 카테고리 | 티어 | 트리거 | 듀레이션 | 이징(→CSS/framer) | dash | landing | 핵심 do / don't |
|---|---|---|---|---|:--:|:--:|---|
| Hover 마이크로 | Subtle | hover | 150–200ms | ease-out | ✅ | ✅ | 변위 <2px(피드백) / 레이아웃 속성 애니 금지 |
| Hover 마이크로 | Standard | hover | 200–300ms | ease-out | ✅ | ✅ | y·scale·shadow / mouseleave 역전 트윈 필수(멈춤 방지) |
| Hover 마이크로 | Complex(magnetic) | hover+move | 300–500ms | elastic/spring | ❌ | ✅ | 화면당 1–2개·pull 클램프 / dash는 연출 금지 |
| Scroll Reveal | Subtle | 뷰포트 진입 | 300–400ms | ease-out | △ | ✅ | y offset 8–16px(fade) / 크롤러 필요 콘텐츠 invisible 금지 |
| Scroll Reveal | Standard | 뷰포트 진입 | 400–600ms | ease-out | ❌ | ✅ | stagger ≤8자녀 / 컨테이너에 스코프 |
| Scroll Reveal | Complex(scrollytelling) | scrub 연속 | 스크롤 종속 | scrub | ❌ | ✅ | pin 1–2섹션만 / 모바일 스크롤감 해침 주의 |
| Stagger List | Subtle | load/scroll | 250–350ms | ease-out | △ | ✅ | per-item 0.02–0.04s / 긴 리스트 0.1s 초과 금지 |
| Stagger List | Standard(bento) | load/scroll | 300–450ms | back.out(overshoot) | ❌ | ✅ | grid wave·center부터 / **데이터 테이블엔 overshoot 금지(sloppy)** |
| Stagger List | Complex(split-text) | load/scroll | 400–700ms | expo.out | ❌ | ✅ | 짧은 헤드라인(<8단어)만 / 문단 split 금지·a11y 복원 |
| Page Transition | Subtle | 라우트 변경 | 200–300ms | ease-in-out | ✅ | ✅ | 목적지 프리로드 / 네비 블로킹 금지(≤250ms) |
| Page Transition | Standard(overlay) | 라우트 변경 | 400–600ms | ease-in-out | △ | ✅ | 오버레이 레이아웃 루트 유지 / 데이터fetch에 종속 금지(max-wait) |
| Page Transition | Complex(shared/FLIP) | 라우트 변경 | 500–800ms | expo.inOut | ❌ | ✅ | 공유요소 1쌍만 / 저사양 기기 잰크 테스트 |
| Parallax | Subtle | scroll 연속 | 스크롤 종속 | linear(scrub) | ❌ | ✅ | 배경·장식 레이어만 / **본문 parallax 금지(멀미)** |
| Parallax | Standard(multi-layer) | scroll 연속 | 스크롤 종속 | linear(scrub) | ❌ | ✅ | 레이어 3–4 이하·속도 차등 / 컨테이너 overflow clip |
| Loading/Skeleton | Subtle(shimmer) | mount/async | 1200–1600ms loop | sine.inOut | ✅ | ✅ | 그라데이션 sweep / 언마운트 시 loop kill(누수) |
| Loading/Skeleton | Standard(spinner) | mount/async | 800–1200ms loop | ease-in-out | ✅ | ✅ | loop <1.5s / sub-300ms 대기엔 로더 금지(깜빡) |

> dash 열: ✅=기능성으로 채택 · △=절제해 최소만(진입 fade 정도) · ❌=연출이라 금지(landing만).

## framer-motion 매핑 (landing 구현 힌트)
- Hover → `whileHover` (+ `whileTap`). Complex magnetic → `useMotionValue`+`useSpring`.
- Scroll Reveal → `whileInView` + `viewport={{ once: true, amount }}`, 진입 `initial`/`animate`.
- Stagger → 부모 `variants` + `staggerChildren`(each 0.02–0.08). overshoot는 `type:"spring"`(데이터엔 금지).
- Page Transition → `AnimatePresence` + route key. Shared element → `layoutId`(1쌍만).
- Parallax/scrub → `useScroll` + `useTransform`(배경 레이어만, `once` 아님).
- Loading → CSS `background-position` sweep 권장(framer보다 가벼움), 언마운트 시 정리.

## dash 구현 힌트 (결정론 CSS)
- Hover/active → Tailwind `hover:`/`active:` + `transition-[transform,opacity] duration-200`.
- 진입 fade(△) → CSS `@starting-style` 또는 `motion-safe:` 게이팅, `motion-reduce:transition-none`.
- 로딩 → `animate-pulse` 스켈레톤. **연출성(parallax·scrub·발광)은 전부 금지.**

## 관련
- [[dash-brief-v3]] · [[design-principles]] · [[ux-guidelines.catalog]](모션 민감·과도한 모션 행) · [[charts.catalog]] · [[curation-criteria]]
