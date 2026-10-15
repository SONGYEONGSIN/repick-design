# auto-dash-r41 — SCORES

하드게이트 결과 (1차). 각 후보 개별 라우트 실행(`node scripts/gate.mjs --target web --routes /dash-evolve/r41/<v>`).

| 후보 | route | types | static | lint | weights | sweep | focus | console | a11y | perf | verdict (1차) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| a (Fathom — OHLC candlestick) | ✓ | ✓ | ✓ | ✗ error 1 (`prefer-const`) | 3종 | ✗ cell-overlap(1264/1280px) + table-overflow(전구간) | ✓ 0건 | ✓ 0건 | ✓ 100 | 64 | 1-fix 진행 중 |
| b (Outlay — donut 비용배분) | ✓ | ✓ | ✓ | ✓ | 3종 | ✓ | ✓ 0건 | ✓ 0건 | ✗ 96 color-contrast | 64 | 1-fix 진행 중 |
| c (Pulsegrid — anomaly line chart) | ✓ | ✓ | ✓ | ✓ | 3종 | ✓ | ✓ 0건 | ✓ 0건 | ✗ 96 color-contrast | 68 | 1-fix 진행 중 |

**r40에서 배운 교훈이 효과를 냈다** — `outline-none`+`focus-visible:outline-*` 죽은 관용구, SVG `<title>` 하이드레이션 함정 둘 다 세 후보 전원 1차부터 0건(디자이너 프롬프트에 명시한 두 함정 모두 재발 없음).

## 근본원인 (오케스트레이터 직접 디버깅)

- **a lint**: `candlestick-chart.tsx:86` `let tooltipY` 재할당 없음 → `prefer-const`. 1줄 수정.
- **a sweep cell-overlap**: 가장 좁은 두 데스크톱 폭(1264·1280px)에서만 가격 라벨(`"62,226.13"` 등, 2소수 가격값) 여러 쌍이 2~4px 겹침 — 격자선 가격라벨 또는 호버 툴팁 O/H/L/C 행 추정. 1350px 이상에서는 재현 안 됨.
- **a sweep table-overflow**: `ohlc-table.tsx` colgroup(18/16/16/16/16/18%) — `min-w` 누락이 아니라 **실제 콘텐츠(9자리 가격 문자열)가 16% 배분보다 넓은** 순수 배분부족. 1536px까지도 5px 잔존.
- **b a11y**: Lighthouse 데스크톱 프리셋 직접 재실행 — `SegmentedControl`의 활성 pill이 `bg-rose-500 text-white` = 3.75:1(4.5 미달). 12px 작은 글자에 rose-500이 너무 밝음.
- **c a11y**: 동일 방법 — 헤더 primary CTA "New alert rule"이 `bg-sky-600 text-white` = 4.02:1(4.5 미달). sky-600이 아직 밝음.

1-fix 지시를 세 후보 designer에게 각각 전달, 재게이트 대기 중.
