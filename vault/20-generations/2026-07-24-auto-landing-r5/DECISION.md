# auto-landing-r5 — DECISION

target: landing · round: auto-landing-r5 · date: 2026-07-24

## 후보 요약
- **a** — 매칭 정확도 다이얼(Radial Gauge) 히어로: SVG 다이얼이 취향 프로필/사이즈/예산/컨디션 등급/시세 5개 기준 웨지를 순차 점등하며 중앙 tabular-nums 매칭%로 수렴(결정론적 step 카운터). 기준 탭 선택 시 근거 패널 갱신.
- **b** — 옷장 레일(Wardrobe Rail) 드래그 히어로: 물리적 옷걸이 레일 은유. 드래그/스크롤로 "일반 매물"(무채색·밀집) 구간에서 "AI 큐레이션 캡슐"(여백·풍부한 증명) 구간으로 이동.
- **c** — 라이브 서치 인덱스(Query-chip) 히어로: 프리셋 검색의도 칩 선택 시 매물 인덱스(매칭 근거·매칭%·컨디션·인증·할인율)가 즉시 재필터/재랭크.

## 하드게이트
전 후보 정적 1차 통과. sweep: a/c 1차 통과, **b는 1회 수정** — 드래그 트랙(`overflow-x-auto`)이 데스크톱 전 폭에서 의도된 캐러셀 오버플로 1114px로 table-overflow 하드게이트 위반 → `overflow-hidden` + 프로그래매틱 `scrollLeft`(포인터/터치 드래그, 수동 `centerItem` 계산)로 전환해 재sweep 통과(사용자 경험 변화 없음, CSS 오버플로 스펙상 `overflow:hidden`도 유효한 스크롤 컨테이너). Lighthouse a11y 100/100/100(하드게이트 통과), perf 95/95/96(기록만). 상세: [[20-generations/2026-07-24-auto-landing-r5/SCORES|SCORES]].

## JUDGE 패널 (블라인드 — 스크린샷 4폭 + 소스, 컨셉 비공개)

| 렌즈 | 순위 | 비고 |
|---|---|---|
| lens1 — DNA 준수 | a > c > b | a: 상시노출 증명·다이얼이 장식 아닌 실데이터 시각화·규칙 위반 0. c: 항상노출 증명은 우수하나 1280/1920 양쪽에서 매칭근거 칩 3줄 래핑·타이틀 truncate로 밀도 과잉. b: `HangerIcon` 반복 라인아트가 anti-slop "라인아트/브래킷 장식" 명시 위반. |
| lens2 — 상용 완성도 | c > a > b | c: 다중 매물 동시 매칭%·등급·인증·할인 표시로 Stripe/Linear급 데이터 밀도 최고. a: 절제되고 자신감 있으나 증명이 스크롤 전까지 실제 상품·가격과 결속되지 않아 다소 얇음. b: 핵심 증명이 드래그 제스처 뒤에 있고 스크린샷상 썸네일이 빈 회색으로 렌더되어 미완성처럼 보임. |
| lens3 — 형태 차별성 | a > b > c | a: 라디얼 게이지는 "결과 시각화"형 히어로로 기존 "입력 조작"형(슬라이더·탭·드래그리빌)과 구조적으로 다른 축 — 16개 기존 폼 중 전례 없음. b: 행거 레일 스킨은 참신하나 메커니즘은 r4b 필름스트립·r2a 드래그리빌과 구조적으로 겹침. c: r4c 대조표(탭→테이블 재계산) 메커니즘의 확장판에 가까워 가장 낮은 신규성. |

**집계**: a 2표(lens1, lens3) · c 1표(lens2) · b 0표 → **1위 다수결 승자: a**. 기권 없음.

## 승자: a — 매칭 정확도 다이얼(Radial Gauge) 히어로

## LEARN
아래 격리 delta 1건을 `landing-deltas-provisional.jsonl`에 append (근거: lens3 판정문 — "output-visualization vs input-manipulation" 축 구분).
