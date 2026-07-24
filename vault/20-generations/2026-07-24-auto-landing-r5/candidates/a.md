# r5/a — 매칭 정확도 다이얼 (Radial Gauge Instrument Panel) 히어로

## 한 줄 컨셉
히어로 우측을 계기판형 원형 SVG 다이얼로 채워, "AI가 지금 매칭 점수를 계산하고 있다"는 감각을 시각화한 랜딩. 취향 프로필·사이즈·예산·컨디션 등급·시세 5개 기준 웨지가 결정론적 스텝 카운터(설정 간격 setInterval, 총 60스텝·1.8초)로 순차 점등되며 중앙의 tabular-nums 퍼센트(96%)가 함께 카운트업된다. 애니메이션 완료 후에도 5개 기준은 실제 버튼(role="tab")으로 남아, 클릭·키보드로 선택하면 옆 패널의 근거 문장이 즉시 갱신된다.

## 경로
- `app/src/app/landing-evolve/r5/a/page.tsx` — 서버 컴포넌트, metadata만 export.
- `app/src/app/landing-evolve/r5/a/ui.tsx` — `'use client'`, Landing 5단(Hero/제품프리뷰/가치3분할/소셜프루프/마무리CTA) 조립.
- `app/src/app/landing-evolve/r5/a/Gauge.tsx` — `'use client'`, 다이얼 SVG + 기준 선택 위젯 본체.
- `app/src/app/landing-evolve/r5/a/data.ts` — CRITERIA(5)/PRODUCTS(6)/VALUES(3)/PROOF_WEEK·PROOF_TOTAL(각 3) 고정 배열 + 공유 토큰.

## 핵심 인터랙션 (4종)
1. **다이얼 라이브 필(히어로)** — `Gauge.tsx`에서 `setInterval`로 고정폭(30ms) 스텝 카운터를 60까지 증가시켜 `progress`(0~1)를 만든다. 원형은 5개 세그먼트(각 64°+8° gap)로 나뉘고, 각 세그먼트는 자신의 진행 구간에서 `strokeDasharray`가 채워지며 통과 시점에 라벨·점수가 "점등"된다. 중앙 값은 `Math.round(progress*96)`으로 함께 카운트업. `Math.random`/`Date.now`/`new Date` 없음 — 순수 스텝 카운터.
2. **기준 선택(히어로)** — 다이얼 옆 5개 버튼(`role="tab"`, 화살표/Home/End 키보드 내비게이션)을 클릭·포커스하면 선택된 웨지가 굵어지고, 아래 패널(`role="tabpanel"`)의 가중치·근거 문장이 즉시 다른 텍스트로 교체된다 — "조작=가치체감"을 다이얼 자체에 결속.
3. **제품 프리뷰 정렬(제품 프리뷰)** — 매칭순/할인율순/신상품순 세그먼트(`role="radiogroup"`)를 누르면 6개 제품 카드가 실제로 재정렬된다(`sortProducts`, framer-motion `layout` prop으로 FLIP 전환). 데코가 아니라 실제 배열 데이터가 바뀐다.
4. **집계 범위 토글(소셜프루프)** — "이번 주" / "전체 누적" 토글(`role="radiogroup"`, `aria-live="polite"`)을 누르면 스탯 3개(누적 매칭 수·평균 정확도·검수 항목 또는 매칭 시간)가 다른 고정 데이터셋으로 즉시 교체된다.
5. (+) **스크롤 트리거** — 제품 카드·가치 3분할·소셜프루프·최종 CTA가 `whileInView`(once, margin -80px) + `useReducedMotion` 게이팅으로 순차 등장.

## 증명 상시노출 (r3/r4 delta 준수)
- 제품 카드는 이미지 위 컨디션 등급 배지(`S급 · 새 상품급`)와 매칭% 원형 뱃지(conic-gradient 미니 다이얼 — 히어로 모티프를 소형으로 반복)가 **정지 상태에서 항상 노출**된다. hover 전용 리빌 요소 없음.
- 카드 본문에도 before(취소선)/after 가격 + `-N%` 할인 배지, 인증 셀러 배지(BadgeCheck+거래건수), AI 매칭 근거 태그 2개가 기본 렌더링 — 터치 기기에서도 동일.
- 다이얼의 5개 기준 버튼도 애니메이션 완료 후 각자의 점수를 항상 표시(선택 여부와 무관하게 숫자 노출), 선택은 "근거 문장"이라는 부가 정보만 확장한다.

## 중복 회피 근거 (아키타입 지정 요구사항 준수)
- 스캐닝 콘솔(r1/a), 채팅 로그, 스와이프 카드 덱(r4/a), 드래그 리빌(r2/a), 매서너리 피드(r3/a), 비교표(r4/c), 예산 계산기/슬라이더(r3/c) 중 어느 것도 사용하지 않음.
- 히어로의 구조적 장치는 **원형 계기판 SVG 게이지** 하나뿐 — 5개 세그먼트가 스텝 카운터로 순차 점등되고 중앙 tabular-nums 퍼센트로 수렴하는 문법은 기존 13개+ 후보 중 사용된 적 없음(가장 가까운 r4/c의 표 재계산과도 시각 문법이 다름 — 표가 아니라 원형 인스트루먼트).
- 제품 카드의 conic-gradient 미니 링은 장식이 아니라 히어로 다이얼과 동일한 "원형 진행률" 언어를 소규모로 재사용해 형태 일관성을 주되, 히어로의 SVG 세그먼트 구조와는 다른(순수 CSS) 구현이라 코드 중복이 없다.

## 접근성/견고성 메모
- SVG는 순수 장식(`aria-hidden="true"`)이며, 동일 데이터를 `sr-only` 요약 문장(다이얼 전체) + 기준 버튼 텍스트(개별 점수) + 카드 `sr-only` 스팬(매칭%)으로 항상 제공.
- 모든 토글/선택 컨트롤은 실제 `<button>`(`role="tab"`/`role="radio"`)이며 텍스트 라벨이 있어 아이콘 전용 버튼이 없다. 전부 `FOCUS`(accent focus-visible 링) 적용.
- `prefers-reduced-motion` 시 `Gauge.tsx`의 스텝 인터벌 자체가 시작되지 않고 `progress`가 즉시 1로 고정되어 다이얼이 완료 상태(96%, 5개 기준 모두 점등)로 바로 렌더링됨 — 중간에 멈추지 않음.
- 폰트 웨이트 정확히 3종(font-normal/font-semibold/font-extrabold = 400/600/800), 헤딩 순서 h1→h2→h3(카드)→h2×4(가치3분할+최종CTA) 스킵 없음.
- 정가 취소선 텍스트는 이전 라운드에서 지적된 `text-white/40` 대신 브리프 muted 토큰 `text-[#A1A1AA]`(대비 개선)로 처음부터 적용.
- 이미지는 전부 `next/image` + `images.unsplash.com` 고정 URL + `alt`, `unoptimized` 미사용.
- `npx eslint src/app/landing-evolve/r5/a --max-warnings=0`·`npx tsc --noEmit` 모두 통과(대상 파일 기준 에러 0건). eslint가 최초 지적한 `react-hooks/set-state-in-effect`(reduced-motion 분기에서 effect 내 동기 setState) 1건은 `progress` 계산을 `reduced` 삼항식으로 옮겨 effect가 조기 반환만 하도록 재구성해 해결.
