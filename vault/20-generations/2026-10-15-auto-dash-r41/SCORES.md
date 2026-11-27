# auto-dash-r41 — SCORES

하드게이트 결과 (1차). 각 후보 개별 라우트 실행(`node scripts/gate.mjs --target web --routes /dash-evolve/r41/<v>`).

| 후보 | route | types | static | lint | weights | sweep | focus | console | a11y | perf | verdict (1차) | verdict (재게이트) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| a (Fathom — OHLC candlestick) | ✓ | ✓ | ✓ | ✗ error 1 (`prefer-const`) | 3종 | ✗ cell-overlap(1264/1280px) + table-overflow(전구간) | ✓ 0건 | ✓ 0건 | ✓ 100 | 64 | 1-fix 적용 | **탈락** — cell-overlap은 해소됐으나 table-overflow 동일 수치로 재실패(26px→5px, 1차와 완전히 같음) |
| b (Outlay — donut 비용배분) | ✓ | ✓ | ✓ | ✓ | 3종 | ✓ | ✓ 0건 | ✓ 0건 | ✗ 96 color-contrast | 64 | 1-fix 적용 | **PASS** (a11y 100, 0 violations) |
| c (Pulsegrid — anomaly line chart) | ✓ | ✓ | ✓ | ✓ | 3종 | ✓ | ✓ 0건 | ✓ 0건 | ✗ 96 color-contrast | 68 | 1-fix 적용 | **PASS** (a11y 100, 0 violations) |

**최종 해시** (판정 대상 b·c 소스 SHA-1): 아래 §freeze 참조.

**r40에서 배운 교훈이 효과를 냈다** — `outline-none`+`focus-visible:outline-*` 죽은 관용구, SVG `<title>` 하이드레이션 함정 둘 다 세 후보 전원 1차부터 0건(디자이너 프롬프트에 명시한 두 함정 모두 재발 없음).

## 근본원인 (오케스트레이터 직접 디버깅)

- **a lint**: `candlestick-chart.tsx:86` `let tooltipY` 재할당 없음 → `prefer-const`. 1줄 수정.
- **a sweep cell-overlap**: 가장 좁은 두 데스크톱 폭(1264·1280px)에서만 가격 라벨(`"62,226.13"` 등, 2소수 가격값) 여러 쌍이 2~4px 겹침 — 격자선 가격라벨 또는 호버 툴팁 O/H/L/C 행 추정. 1350px 이상에서는 재현 안 됨.
- **a sweep table-overflow**: `ohlc-table.tsx` colgroup(18/16/16/16/16/18%) — `min-w` 누락이 아니라 **실제 콘텐츠(9자리 가격 문자열)가 16% 배분보다 넓은** 순수 배분부족. 1536px까지도 5px 잔존.
- **b a11y**: Lighthouse 데스크톱 프리셋 직접 재실행 — `SegmentedControl`의 활성 pill이 `bg-rose-500 text-white` = 3.75:1(4.5 미달). 12px 작은 글자에 rose-500이 너무 밝음.
- **c a11y**: 동일 방법 — 헤더 primary CTA "New alert rule"이 `bg-sky-600 text-white` = 4.02:1(4.5 미달). sky-600이 아직 밝음.

## a 탈락 — 원인 오진단 (sweep "table#1" 셀렉터 의미 정정)

`dash-sweep.mjs`가 보고하는 `table#1` 등 인덱스는 `document.querySelectorAll('table, [class*="overflow-x"]')`로 **table 태그와 overflow-x 클래스를 가진 모든 요소를 DOM 순서로 합쳐** 매긴 번호다 — "두 번째 `<table>` 태그"가 아니라 "그 합쳐진 목록에서 인덱스 1인 요소(마침 TABLE 태그)"다. a는 `page.tsx`가 애초에 `ohlc-table.tsx`를 import·렌더하지 않는다(그레프로 확인 — `OHLCTable`은 어디서도 쓰이지 않음) — 페이지의 유일한 실제 `<table>`은 `trades-table.tsx`(colgroup 16/13/27/16/13/15%)다. 1-fix 지시가 "ohlc-table.tsx의 colgroup을 조정하라"고 (오케스트레이터 오진단으로) 지시했고, designer는 그 지시를 정확히 따라 ohlc-table.tsx를 고쳤으나 **렌더되지 않는 파일이라 재게이트 수치가 1차와 완전히 동일(26px→5px, 모든 폭에서 1px 차이도 없음)**하게 재현됐다.

**판정**: 이것은 §0-0 (서브에이전트 가용성)이나 r40의 "오케스트레이터가 위반을 전달 안 함" 편차와 다르다 — 위반은 전달됐고 designer는 실제로 수정을 시도했으나 **잘못된 파일을 고쳤고 재게이트가 같은 위반으로 재실패**했다. 스킬 §3 "재실패 시 탈락" 그대로 적용 — **a 탈락**. cell-overlap(별도 위반)은 이번 1-fix로 완전히 해소됐으므로 재배정 시 유효하다.

reassign-queue.md에 다음을 명시해 등재: "table#1은 트레이드 테이블(trades-table.tsx)이다, OHLC 테이블이 아니다 — colgroup 16/13/27/16/13/15%를 실제 콘텐츠(9자리 가격 등) 기준으로 재배분하라."
