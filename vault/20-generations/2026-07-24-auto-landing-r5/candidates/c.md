# r5/c — 라이브 서치 인덱스 (Search-as-Hero Live Index) 히어로

## 한 줄 컨셉
히어로를 "검색창"이 아니라 5개의 자연어 검색 조건 칩("빈티지 자켓 밑 8만원", "정품 인증 스니커즈", "니트 S급 컨디션", "가죽 미니백 10만원대", "여름 원피스 정품 셀러")으로 대체하고, 칩을 고르면 바로 아래 라이브 매물 인덱스(매칭 근거·AI 매칭%·컨디션 등급·인증 판매자·before/after 할인율 6열)가 그 조건에 맞는 매물로 즉시 재필터링·재정렬되는 랜딩. 자유 텍스트 입력 대신 결정론적 프리셋 칩을 써서 하드게이트(Math.random/Date.now 금지)를 준수하면서도 "검색"이라는 행위 자체를 히어로 구조로 만들었다.

## 경로
- `app/src/app/landing-evolve/r5/c/page.tsx` — 서버 컴포넌트, metadata만 export.
- `app/src/app/landing-evolve/r5/c/ui.tsx` — `'use client'`, Landing 5단(Hero/제품프리뷰/가치3분할/소셜프루프/마무리CTA) 조립 + `PreviewCard` 서브컴포넌트.
- `app/src/app/landing-evolve/r5/c/IndexPanel.tsx` — `'use client'`, 검색 조건 칩 + 정렬 토글 + 라이브 매칭 인덱스(행 리스트) 본체 — 이 후보의 핵심 장치.
- `app/src/app/landing-evolve/r5/c/data.ts` — `LISTINGS`(매물 10종 고정 카탈로그), `QUERIES`(검색 조건 칩 5개 × 각 3개 매칭 결과 + 매칭%/근거 태그), `PREVIEW_PICKS`/`PREVIEW_DETAIL`, `VALUES`/`PROOF` + 공유 토큰.

## 핵심 인터랙션 (5종)
1. **검색 조건 칩 선택 → 인덱스 전체 재필터링/재계산 (히어로 인터랙션)** — `role="tablist"` + 5개 `role="tab"`(자연어 검색 프리셋). 칩을 바꾸면 `queryIdx` state가 바뀌며 매칭된 매물 3건(id·매칭%·근거 태그)이 `QUERIES[i].results`라는 고정 데이터로 즉시 교체된다. `AnimatePresence`(`mode="popLayout"`) + `motion.li layout`로 이전 매물은 빠지고 새 매물은 들어오며, 남아있는 매물은 순서가 부드럽게 재정렬된다. 결과 개수 문장(`aria-live="polite"`)이 "N개 매물이 '{칩 라벨}' 조건에 매칭되었습니다"로 즉시 갱신.
2. **정렬 기준 토글(매칭 정확도순 ↔ 할인율 높은순)** — `role="group"` + `aria-pressed` 두 버튼. 같은 필터링 결과를 다른 기준(매칭% vs 할인율)으로 재정렬해 `motion.li layout`이 카드 위치를 스프링처럼 재배열한다 — 필터와 별개로 "같은 데이터를 다른 각도로 다시 본다"는 조작=가치체감을 한 번 더 구현.
3. **관심 매물 저장 토글(하트 버튼, 폼/증명 상호작용)** — 각 행의 하트 버튼(`aria-pressed`)을 누르면 `savedIds` Set이 갱신되고, 패널 하단 CTA 위 상태 문장이 "마음에 드는 매물을 관심으로 저장해보세요" → "N개 관심 매물 저장됨"으로 실시간 전환되어 CTA 진입부를 강화한다.
4. **제품 프리뷰 카드 "AI 매칭 근거 더보기" 아코디언(제품 프리뷰 상호작용)** — 이번 주 하이라이트 카드 3장 각각에 `aria-expanded`/`aria-controls` 토글이 있어 CSS `grid-template-rows` 0fr→1fr로 추가 근거 문장을 펼친다. **매칭%·등급·인증 배지·before/after 가격은 아코디언과 무관하게 카드 정면에 항상 노출**(hover 전용 리빌 금지 원칙 준수) — 토글은 "더 깊은 근거"만 추가한다.
5. **스크롤 트리거 섹션 진입** — 제품 프리뷰 카드(stagger), 가치 3분할(ghost 넘버 + stagger), 소셜프루프 스탯밴드/인용구 모두 `whileInView`(once) + `useReducedMotion` 게이팅.

## "조작=가치체감" 결속 방식
칩을 누르는 행위 자체가 "AI가 문장형 검색 조건마다 실제 매물 데이터를 다시 계산해 보여준다"는 핵심 가치명제를 즉시 체감시킨다 — 사용자가 관심 있는 검색 의도를 고르면 매칭된 매물 수·순서·매칭 근거 태그·매칭%가 전부 바뀌는 것을 눈으로 확인하므로, 인터랙션이 장식이 아니라 "우리는 자연어 검색 의도에 맞춰 실측 데이터를 재계산한다"는 증명 그 자체가 된다. 정렬 토글은 동일 원칙을 "필터링"이 아닌 "재정렬" 축으로 한 번 더 반복해 조작 표면을 이중화한다.

## 중복 회피 근거
- 기존 아키타입(v0~v5, r1~r4) 중 "검색창형 프리셋 칩 + 매물 리스트 재필터링/재랭킹" 문법을 쓴 사례 없음. r4/c는 **탭(카테고리 4개) + 고정 5행 2열(일반거래 vs AI) 대조표**로, 탭을 바꿔도 항상 "같은 5개 기준"의 값만 바뀌는 구조였다. r5/c는 정반대로 **칩(자연어 검색 의도 5개) + 가변 개수(3개)의 매물 행 자체가 필터링되어 나타나거나 사라지는** 구조 — 비교축(general vs AI)이 아니라 검색 결과 랭킹 축이라 표면 형태와 데이터 모델이 다르다.
- `<table>`을 쓰지 않고 `<ul>`/`role="list"` 기반 반응형 행 리스트로 구현해 r4/c의 "표 오버플로 이슈" 재발을 원천 차단했다 — 모바일에서는 `grid-cols-2`(항상 `minmax(0,1fr)`로 트랙이 콘텐츠보다 좁아지지 않음) 카드로, 데스크톱에서는 `lg:grid-cols-[...]` 7열 단일 행으로 같은 DOM이 반응형 재배치된다.
- 제품 프리뷰 섹션은 히어로 인덱스와 다른 레이아웃(이미지 포워드 3열 카드 그리드 + 아코디언)으로 별도 설계해 같은 화면 안에서도 형태 반복을 피했다.

## 접근성/견고성 메모
- 검색 조건 칩: `role="tablist"`/`role="tab"`/`aria-selected`/`aria-controls`, roving tabindex + `ArrowLeft/ArrowRight/ArrowUp/ArrowDown/Home/End` 키보드 내비게이션(WAI-ARIA APG tabs 패턴).
- 결과 리스트는 `role="tabpanel"`로 칩과 연결, `<ul role="list">`(`list-none`으로 마커 제거 시 Safari/VoiceOver가 list 역할을 잃는 문제를 `role="list"` 명시로 방지).
- 결과 개수/조건 요약 문장에 `aria-live="polite"` — 재필터링 시 스크린리더에도 즉시 안내.
- 정렬 토글은 `role="group"` + `aria-pressed` 두 버튼, 저장 버튼도 `aria-pressed`/`aria-label`(매물명 포함) — 모두 h-9 w-9(36px) 이상 히트 영역으로 target-size 기준 충족(r4/a에서 지적된 8px dot 버튼 재발 방지).
- **retail 취소선 가격은 `text-white/40`이 아니라 `text-[#A1A1AA]`를 사용** — r4/a 하드게이트 수정 이력(color-contrast 실패 → `#A1A1AA`로 교체)을 처음부터 반영해 동일 실수를 반복하지 않음.
- 모든 인터랙티브 요소에 accent `focus-visible` 링(`FOCUS` 토큰), 아코디언/레이아웃 전환은 `motion-reduce:transition-none` + `useReducedMotion` 게이팅.
- heading 순서: `<h1>`(히어로) → `<h2>`(제품 프리뷰 섹션 타이틀) → `<h3>`(카드 타이틀) → `<h2>`×3(가치 3분할, r4/c와 동일하게 섹션 자체 heading 없이 아이템 타이틀을 h2로 유지) → `<h2>`(최종 CTA) — 레벨 스킵 없음.
- 폰트 웨이트 정확히 3종(font-normal/font-semibold/font-extrabold = 400/600/800), `Math.random`/`Date.now`/`new Date` 미사용(모든 매칭%·근거·정렬은 칩 id 기준 고정 배열/파생 정렬로 결정론적), 이미지 전부 `next/image` + 고정 unsplash URL(images.unsplash.com, 프로젝트 내 기존 검증된 URL 재사용) + alt, 원시 `<img>`/`unoptimized` 없음.
- `npx tsc --noEmit`·`npx eslint src/app/landing-evolve/r5/c/` 모두 에러 0건 확인.
