# r4/a — 매치 카드 스택 (Swipe Deck) 히어로

## 한 줄 컨셉
히어로 자체를 5장 고정 큐레이션 매물의 Tinder류 스와이프 카드 스택으로 만들어, "카드를 넘기는 행위 = 다음 AI 큐레이션을 확인하는 행위"로 결속시킨 랜딩. 드래그·화살표로 카드가 넘어가도 매칭%·컨디션 등급·인증 판매자 배지·before/after 할인율이 카드 정면(대기 상태)에 항상 노출된다.

## 경로
- `app/src/app/landing-evolve/r4/a/page.tsx` — 서버 컴포넌트, metadata만 export.
- `app/src/app/landing-evolve/r4/a/ui.tsx` — `'use client'`, Landing 5단(Hero/제품프리뷰/가치3분할/소셜프루프/마무리CTA) 조립.
- `app/src/app/landing-evolve/r4/a/SwipeDeck.tsx` — `'use client'`, 스와이프 카드 스택 본체.
- `app/src/app/landing-evolve/r4/a/data.ts` — DECK(5) / PREVIEW(4) 고정 매물 배열 + VALUES/PROOF + 공유 토큰.

## 핵심 인터랙션 (4종 이상)
1. **드래그/화살표 카드 스와이프** — `useMotionValue` + `useSpring`(스프링 물리)으로 상단 카드의 x/rotate를 제어. `onPointerDown`에서 `setPointerCapture`로 포인터를 캡처해 드래그 추적, 임계값(90px) 초과 시 카드가 반대편으로 튕겨나가며(`x.set(±560)`) `setTimeout`(고정 260ms, `Date.now` 미사용) 후 인덱스를 `(i+dir+N)%N`으로 순환 갱신. 좌우 화살표 버튼(`aria-label="이전/다음 매물 보기"`)과 카드 스택 컨테이너의 `ArrowLeft/ArrowRight` 키보드 핸들러도 동일 로직을 공유해 키보드로도 완전히 조작 가능.
2. **진행 인디케이터 dot** — 현재 카드 위치를 표시하는 dot 그룹(`role="group"`, 각 버튼 `aria-current`), 클릭 시 `jumpTo(i)`로 임의 카드로 즉시 점프(모든 카드가 상시 마운트된 상태에서 slot 기반 `animate`가 재계산되며 자연스럽게 재정렬).
3. **매칭 근거 상세 아코디언** — 상단 카드에만 노출되는 "매칭 근거 상세 보기" 토글(`aria-expanded`/`aria-controls`). **단, 매칭%·등급·인증 배지·before/after 가격+할인율은 아코디언과 무관하게 카드 이미지·바디에 항상 렌더링** — 토글은 추가 검수 근거 리스트만 확장한다(핵심 증명은 절대 게이팅하지 않음, r3 delta 준수).
4. **스크롤 트리거 진입 애니메이션** — 제품 프리뷰 그리드 카드(stagger), 가치 3분할(ghost 넘버 + stagger), 소셜프루프 스탯밴드/인용구 모두 `whileInView` + `VIEWPORT`(once) 사용, `useReducedMotion` 게이팅으로 감속모션 시 즉시 최종 상태.

## "조작=가치체감" 결속 방식
드래그 제스처의 결과가 곧바로 "다음 AI 큐레이션 매물"이라는 실제 가치를 노출한다 — 스와이프는 장식적 전환이 아니라 사용자가 실제 서비스에서 매물을 넘겨보는 핵심 발견 행동 그 자체를 히어로에서 선체험시킨다. 카드가 넘어가는 동안에도(드래그 중, 정지 시 모두) 매칭 근거 4요소(매칭%·등급·인증·할인율)가 카드 정면에서 사라지지 않아 r3 delta("hover/focus 전용 리빌 금지")를 정면으로 충족한다.

## 중복 회피 근거
- 기존 13개 아키타입(v0~v5, r1/a·b, r2/a·b, r3/a·b·c) 중 카드 스택·드래그 스와이프 문법을 쓴 사례 없음. r2/a는 히어로 이미지 2장을 좌우로 드래그하는 **before/after 비교 슬라이더**(단일 축, 이미지 두 장 고정)였고, 이번 후보는 **N장(5장) 순환 카드 스택**을 포인터로 넘기는 발견형 인터랙션이라 표면 형태가 다르다. r3/a(매서너리 그리드 + hover 리빌)와 달리 이번 후보는 그리드가 아닌 스택이며, 핵심 정보는 hover가 아니라 항상 카드 정면에 상주한다(hover 리빌 감점 사례 계승 회피). r3/c(예산 슬라이더 계산기)의 "조작=가치체감" 원칙은 계승하되, range input이 아닌 포인터 드래그 제스처로 표면을 바꿨다.
- 제품 프리뷰 섹션은 히어로 스택과 다른 레이아웃(정적 2/4열 그리드, 카드 4장, 드래그 없음)으로 별도 설계해 동일 화면 안에서도 형태 반복을 피했다.

## 접근성/견고성 메모
- 카드 스택 컨테이너: `role="group"` + `aria-roledescription="carousel"` + `aria-label`, `tabIndex=0`으로 키보드 포커스 가능, `aria-live="polite"` 상태 텍스트(sr-only)로 현재 카드 브랜드/제목 안내.
- 상단 카드 외 나머지는 `aria-hidden` + `pointer-events-none`으로 스크린리더/탭 순서에서 제외.
- 모든 버튼(화살표·dot·아코디언 토글·CTA)에 accent focus-visible 링(`FOCUS` 토큰) 적용.
- 폰트 웨이트 정확히 3종(font-normal/font-semibold/font-extrabold = 400/600/800) 유지, 이미지 전부 `next/image` + 고정 unsplash URL + alt.
- `npx eslint`·`npx tsc --noEmit` 모두 통과(대상 파일 기준 에러 0건), dev 서버(`localhost:3100/landing-evolve/r4/a`)에서 200 응답 및 카드/배지/아코디언 텍스트 렌더링 확인.

## 하드게이트 재수정 (Lighthouse a11y 91→100)
1회 수정 기회에서 지적된 3건 모두 수정 확인:
1. **color-contrast** — 정가 취소선 가격(`text-white/40`, SwipeDeck.tsx·ui.tsx 두 곳)을 브리프 muted 토큰 `text-[#A1A1AA]`로 교체(#0B0B0F 배경 대비 약 7.7:1로 4.5:1 기준 상회).
2. **heading-order** — `SwipeDeck.tsx`의 카드 제목이 `<h1>`(히어로 헤드라인) 바로 다음에 `<h3>`로 등장해 레벨을 건너뛰던 것을 `<h2>`로 수정(시각 크기는 CSS 그대로 유지). 이후 제품 프리뷰 섹션 heading(`<h2>`→카드 `<h3>`), 가치 3분할/최종 CTA(`<h2>`)까지 전체 순서가 건너뜀 없이 이어짐을 확인.
3. **target-size** — 진행 인디케이터 dot 버튼을 `h-2 w-2`(8×8px) 클릭 영역에서 `h-6 w-6`(24×24px) 히트 영역 + 내부 `span`으로 시각적 dot(8px/24px 활성 바)을 분리하는 구조로 변경. `aria-label`/`aria-current`는 유지.

재측정 결과: `CHROME_PATH=/opt/pw-browsers/chromium npx lighthouse http://localhost:3100/landing-evolve/r4/a --only-categories=performance,accessibility --preset=desktop` → **accessibility 100 / performance 96**, 실패 감사 0건.
