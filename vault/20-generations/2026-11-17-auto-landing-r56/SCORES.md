# auto-landing-r56 — SCORES

Freeze hash (all candidate `.tsx`/`.ts` sources concatenated, post-1-fix): `555e17c193cd414296a942a396b3006d74cbf452`

## Candidate a — "repick" (free-text match search), light / cyan / display-grotesk

| gate | result |
|---|---|
| route | pass — 1개 라우트 응답 OK |
| types | pass — 에러 0 |
| static | pass — 위반 0 |
| lint | pass — 위반 0 |
| weights | pass — 3종 (렌더 실측) |
| sweep | pass — 전 폭 오버플로 0 |
| focus | pass — 포커스 표시 0건 누락 |
| console | pass — 메시지 64건 · 결함 0 |
| a11y | pass — 100 |
| perf | pass — 73 |

1-fix used: no. Clean on first attempt.

## Candidate b — "GRIDLINE" (spatial zone-click pickup map), dark / indigo / display-mono

| gate | 1st attempt | after 1-fix |
|---|---|---|
| route | pass | — |
| types | pass | — |
| static | pass | — |
| lint | pass | — |
| weights | pass — 3종 | — |
| sweep | pass — 오버플로 0 | — |
| focus | pass | — |
| console | pass — 129건 · 결함 0 | — |
| a11y | **fail — 100점이지만 승격 감사 `label-content-name-mismatch` 실패** | pass — 100 |
| perf | pass — 92 | pass — 98 |

1-fix used: yes, 1 of 1. Root cause: `ZoneMap.tsx`의 zone 버튼 `aria-label`이 `"{zone.name}, {tier}, currently selected"` 형태로 쉼표/추가문구를 넣어, 보이는 텍스트(zone.name + tier 라벨, 구분자 없이 연결)를 그대로 포함하지 못했다. 처방: 경쟁 `aria-label`을 완전히 제거 — 버튼의 접근 가능한 이름을 보이는 텍스트 자체(zone.name + tier 라벨)로 복원했고, "선택됨" 상태는 이미 `aria-pressed`가 의미론적으로 전달하므로 텍스트 중복이 불필요했다. 재게이트 10/10 클린.

## Candidate c — "Sift" (sequential swipe/vote preference deck), light / lime / display-wide

| gate | 1st attempt | after 1-fix |
|---|---|---|
| route | pass | — |
| types | pass | — |
| static | pass | — |
| lint | pass | — |
| weights | pass — 3종 | — |
| sweep | **fail — `table-overflow` 12건 (1264~1920px, `ul#0`, 199~261px)** | pass — 전 폭 오버플로 0 |
| focus | pass | — |
| console | pass — 91건 · 결함 0 | — |
| a11y | **fail — 96, 실패 감사 `color-contrast`** | pass — 100 |
| perf | pass — 99 | pass — 98 |

1-fix used: yes, 1 of 1 (combined). Root causes (2, independent):
1. `RecommendRail.tsx`의 추천 레일 `<ul>`에 `overflow-x-auto`를 데스크톱 전 폭에서도 상시 적용 — `page-brief-core` §4 "데스크톱 가로 스크롤바 금지(로컬 가로 스크롤은 모바일 전용)"를 그대로 어겼다(게이트 셀렉터가 `[class*="overflow-x"]` 전체를 본다, 테이블 한정이 아니다). 처방: `overflow-x-auto` 제거, `flex-wrap`으로 전환 + 아이템 폭을 `150px`(모바일) → `190px`(`sm:` 이상)로 반응형화해 4개 항목이 어떤 폭에서도 스크롤 없이 배치되게 함.
2. `ui.tsx`의 할인 배지 내 취소선 "before" 가격(`line-through opacity-80`, 흰 글자 on `bg-lime-700`)이 불투명도 80%로 실효 색상이 `#dbe5cc`가 되어 `#497d00` 배경 위 3.81:1로 AA(4.5:1) 미달. 흰색 100% 자체는 5.00:1로 통과(디자이너 자체 계산과 일치). 처방: `opacity-80` 제거.

axe-core 직접 실행(Playwright, `color-contrast`만)으로 정확한 실패 노드를 특정한 뒤 수정 — Lighthouse 요약만으로는 어떤 엘리먼트인지 알 수 없었다.

## 다양성 축 (§GENERATE 선제 체크)

- 직전 3라운드 승자 테마/액센트/페이스: r55=dark/orange/Pretendard-only · r54=light/emerald/wide · r53=light/rose/grotesk — 전부 distinct, 밴리스트 없음(연속 2회 동일 테마 없음, 최근 3윈도우 내 동일 액센트/페이스 2회 이상 없음).
- 카탈로그 전체 최다 액센트: amber 8 · teal 8 (공동 최다) — 이번 라운드 3후보 모두 회피(cyan/indigo/lime 배정).
- 후보별 디스플레이 활자 전부 다르게 배정: a=grotesk · b=mono · c=wide.
- 매크로 버킷: 최근 5라운드(r51-r55)가 전부 continuous-slider/drag-handle/stepper/toggle-grid/scatter-plot 계열이었다 — 이번 3후보는 입력축을 free-text 타이핑(a) · discrete spatial map click(b) · sequential binary swipe(c)로 완전히 교체해 셋 다 그 계열 밖이다.
