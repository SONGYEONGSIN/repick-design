# r4/c — AI 매칭 대조표 (Interactive Compare Table) 히어로

## 한 줄 컨셉
히어로를 "일반 중고거래 vs repick AI 매칭" 2열 에디토리얼 비교표로 구성하고, 카테고리 탭(아우터/가방/신발/상의)을 전환하면 가격 근거·컨디션 확인·판매자 신뢰·검색 시간·취향 적합도 5개 행의 대조값 전체가 실시간으로 재계산되는 랜딩. 행을 클릭하면 아코디언으로 확장되어 실제 매물(이미지·매칭%·등급·인증·before/after 할인율)을 보여주되, 확장 전 기본 대조값은 표에 항상 노출된다.

## 경로
- `app/src/app/landing-evolve/r4/c/page.tsx` — 서버 컴포넌트, metadata만 export.
- `app/src/app/landing-evolve/r4/c/ui.tsx` — `'use client'`, Landing 5단(Hero/제품프리뷰/가치3분할/소셜프루프/마무리CTA) 조립.
- `app/src/app/landing-evolve/r4/c/CompareTable.tsx` — `'use client'`, 카테고리 탭 + 비교 표 + 행 아코디언 본체.
- `app/src/app/landing-evolve/r4/c/data.ts` — CATEGORIES(4개 카테고리 × 5행 대조값 + 대표 매물), ROWS(5개 비교 기준 메타), PREVIEW_CARDS(제품 프리뷰용 3장), VALUES/PROOF + 공유 토큰.

## 핵심 인터랙션 (4종 이상)
1. **카테고리 탭 전환 — 표 전체 재계산** — `role="tablist"` + 4개 `role="tab"`(아우터/가방/신발/상의). 탭을 바꾸면 `catIdx` state가 바뀌며 5행 전부(가격 오차·검수 항목 수·판매자 평점·평균 검색 시간·적합도)와 아코디언 안 대표 매물(이미지·매칭%·등급·가격)이 그 카테고리의 고정 데이터로 즉시 갱신된다. 값이 바뀔 때마다 `motion.div key={category.id}`로 짧은 fade+slide 진입(count-up 스프링이 아닌 크로스페이드로 r3/c 계산기와 표면을 구분).
2. **행 클릭 → 아코디언 확장/축소** — 5개 행 각각에 `aria-expanded`/`aria-controls` 토글 버튼. 확장하면 실제 매물 카드(이미지 + 매칭% + S/A 등급 배지 + 인증 셀러 + retail 취소선가→repick가 + 할인율 + 그 행에 특화된 근거 문장)가 CSS `grid-template-rows` 0fr→1fr 트랜지션으로 펼쳐진다. **기본 대조값(가격 오차 %, 검수 항목 수, 평점, 검색 시간, 적합도 등)은 행 확장 여부와 무관하게 표 셀에 항상 렌더링** — 아코디언은 "더 깊은 근거"만 추가할 뿐 기본 증명을 가리지 않는다(r3 delta 정면 준수). 초기 로드 시 첫 행(가격 근거)이 기본으로 펼쳐져 있어 정지 상태에서도 실사 이미지가 노출된다(hover 전용 리빌 금지).
3. **키보드 탭 내비게이션** — 탭 버튼은 roving tabindex 패턴(`tabIndex={selected?0:-1}`)으로 구성되고 `ArrowLeft/ArrowRight/Home/End` 키다운 핸들러가 포커스를 이동시키며 즉시 해당 카테고리로 전환(WAI-ARIA APG tabs 패턴 준수).
4. **스크롤 트리거 섹션 진입** — 제품 프리뷰 카드 그리드(stagger), 가치 3분할(ghost 넘버 + stagger), 소셜프루프 스탯밴드/인용구가 모두 `whileInView` + `VIEWPORT`(once) 사용, `useReducedMotion` 게이팅으로 감속모션 시 즉시 최종 상태 수렴.

## "조작=가치체감" 결속 방식
탭을 누르는 행위 자체가 "AI가 카테고리마다 다른 데이터로 다시 계산한다"는 핵심 가치명제를 즉시 체감시킨다 — 사용자가 관심 카테고리를 고르면 5개 비교 기준 수치가 전부 바뀌는 것을 눈으로 확인하므로, 인터랙션이 장식이 아니라 "우리 서비스는 카테고리별로 실측 데이터를 갖고 있다"는 증명 그 자체가 된다. 행 아코디언은 표의 요약 수치를 "왜 이 숫자가 나왔는지"까지 파고들게 하는 2단 증명 구조(요약 표 → 근거 상세)로, 기본 증명(표 셀)을 절대 지연시키지 않는다.

## 중복 회피 근거
- 기존 14개 아키타입(v0~v5, r1/a·b, r2/a·b, r3/a·b·c, r4/a) 중 "탭 전환形 비교표 + 행 아코디언" 문법을 쓴 사례 없음. r2/a는 이미지 2장을 좌우로 드래그하는 **before/after 슬라이더**(단일 값, 단일 축)였고, r3/c는 **슬라이더+숫자 count-up 계산기**(단일 결과 카드)였다. 이번 후보는 슬라이더나 드래그 없이 **탭 + 다중 행 표**라는 새 표면 형태로 "조작=가치체감"을 구현하며, count-up 스프링 대신 크로스페이드 전환을 써서 r3/c와 시각적으로도 구분된다.
- r4/a(스와이프 카드 덱)와도 형태가 다르다 — 카드 스택/드래그 제스처가 아니라 정적 `<table>` 구조(고정 3열: 비교 기준 / 일반 거래 / repick AI) 위에 탭과 아코디언을 얹은 에디토리얼 밀도 문법(Fig 캡션, ghost 넘버 "05", mono tabular-nums)을 전면에 세운 점이 차별점.
- 제품 프리뷰 섹션(Fig. 02)은 히어로 표와 별개로 3장의 정적 카드 그리드(탭·아코디언 없음)로 설계해 같은 화면 안에서도 형태 반복을 피했다.

## 접근성/견고성 메모
- 표는 실제 `<table>`(`<caption className="sr-only">`, `<colgroup>` 고정 폭, `<thead>` `scope="col"`)로 구성해 스크린리더 표 탐색이 가능하고, `table-fixed` + 반응형 폰트 크기(clamp형 text 사이즈 단계)로 375px~1920px 전 구간 가로 스크롤 없음(colgroup 고정 폭으로 표 자체 overflow 방지).
- 행 확장 트리거 버튼에 `aria-expanded`/`aria-controls`, 확장 패널 `<tr>`에 `id`/`aria-labelledby` 연결.
- 탭 버튼·행 트리거·CTA·행 데이터 셀(클릭 가능) 모두 accent `focus-visible` 링(`FOCUS` 토큰) 적용, 아코디언 트랜지션은 `motion-reduce:transition-none`으로 감속모션 게이팅.
- 폰트 웨이트 정확히 3종(font-normal/font-semibold/font-extrabold = 400/600/800) 유지, `Math.random`/`Date.now`/`new Date` 미사용(모든 대조값은 카테고리별 고정 배열 인덱스로 결정론적 전환), 이미지 전부 `next/image` + 고정 unsplash URL + alt, 원시 `<img>`/`unoptimized` 없음.
- `npx tsc --noEmit`·`npx eslint`(대상 파일) 모두 에러 0건, dev 서버(`localhost:3100/landing-evolve/r4/c`)에서 200 응답 및 표/탭/아코디언 텍스트 렌더링, 컴파일된 CSS에 `grid-rows-[0fr]/[1fr]`·`motion-reduce:transition-none` 클래스 존재 확인.
