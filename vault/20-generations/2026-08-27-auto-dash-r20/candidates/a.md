# Candidate a — Ridge (cohort triangle matrix + baseline pin)

**Reassigned from `reassign-queue.md` item 2** (`auto-dash-r18/c`, tabled solely for all-Korean copy — the design itself was judged the round's strongest by 2 of 3 lenses). Rebuilt in English, weight-disciplined (3 species), same mechanism: a triangular cohort-by-month retention grid where every cell is an always-visible white-text percentage on a color-banded fill, and pinning a cohort row (not a raw `selectedId` threaded to siblings) rewrites the grid's own color ramp, axis label, and cell values onto a percentage-points-vs-baseline reading — a single-consumer re-encoding, per the `r18`/`r19` lesson that raw-`selectedId` sibling-threading reads as stock master-detail to the differentiation lens.

Product: subscription retention analytics for a SaaS billing platform. Dark theme, rose accent, `--font-display-wide`.

Interactions (4): ① cell hover/focus reveals exact reading in a live-region rail (crosshair analog) ② real sort + filter on the independent cohort ledger table below ③ Logo%/Revenue% metric toggle (rewrites the grid's own values) ④ baseline pin (selection → single-consumer re-encoding).

## 브리프에 없던 것

1. **무엇을 정해야 했나**: 격자 자신의 인코딩을 "재작성"한다는 재배정 지시가 구체적으로 무엇을 바꾸는지(색 램프만? 라벨 단위까지?).
   **무엇으로 정했나**: 색 램프(절대→발산 5밴드) + 축 라벨("% retained" → "pp vs baseline") + 셀 표시값(절대% → 상대pp) 셋 다 바꾸되, KPI 헤더 스트립과 하단 테이블은 전혀 건드리지 않음.
   **왜**: `r18` delta 원문이 "색 램프 종류·라벨 단위·행렬 마진·축 도메인" 넷을 명시했으므로 그대로 따름 — 임의가 아니라 재배정문 인용.

2. **무엇을 정해야 했나**: 다크 표면에서 매트릭스 셀 다이버징 램프의 실제 hex 값(발산 색 2계열 + 중립 1계열, 전부 흰 텍스트 4.5:1 이상).
   **무엇으로 정했나**: sky(양) / zinc(중립) / rose(음) 3계열 5밴드, 각 흰 텍스트 대비를 사전 계산(5.93~10.44:1)해 코드 주석에 남김.
   **왜**: 브리프·카탈로그 어디에도 "발산 램프"의 구체 hex가 없음 — colors.catalog는 단일 액센트만 규정. 계측(대비 계산)으로 직접 도출.

3. **무엇을 정해야 했나**: 12개월 × 12코호트 격자가 390px에서 물리적으로 안 들어갈 때의 처리.
   **무엇으로 정했나**: 격자 자체는 `overflow-x-auto` 로컬 스크롤 유지(모바일 전용 가로 스크롤은 브리프가 허용), 대신 하단 코호트 테이블은 저우선 열 2개(Starting/Active now)를 `sm:table-cell`로 숨겨 스크롤 없이 3열로 수납.
   **왜**: 실측 중 `overflow-x-auto` + `min-w-[Npx]` 조합의 테이블이 390px에서 `document.scrollWidth`를 오염시키는 브라우저 동작을 발견(같은 페이지에 두 개의 큰 스크롤 컨테이너가 있을 때 재현, 단일 스크롤러만으로는 재현 안 됨 — 원인 특정은 못 했으나 회피는 검증됨). 테이블 쪽을 퍼센트 컬럼 `table-fixed`(기존 `OrderTable.tsx` 관용구)로 바꾸자 즉시 해소.
