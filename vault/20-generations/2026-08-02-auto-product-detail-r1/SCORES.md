# SCORES — auto-product-detail-r1

타깃: `product-detail` (프로파일 부재 — page-brief-core만으로 생성, [[page-brief-core]] §"타입 프로파일 목록" 규정)

| 후보 | static | weights | sweep | a11y | perf | pass |
|---|---|---|---|---|---|---|
| a (Fernway) | 위반 0 | 3종 | 오버플로 0 | 100 | 66 | ✅ |
| b (Fenwick Audio) | 위반 0 | 3종 | 오버플로 0 | 96 | 69 | ✅ |
| c (Torvex) | 위반 0 | 3종 | 오버플로 0 | 94→100 (1-fix) | 68→70 | ✅ (1-fix 후) |

## 1-fix 루프 — c

- 최초 게이트: a11y 94 (< 95 하드페일 임계)
- Lighthouse 상세: `definition-list` / `dlitem` 위반 — `dl > div > div > dt/dd`로 아이콘이 dt/dd를 감싸는 wrapper div 안에 한 겹 더 들어가 있어 axe가 dt/dd를 dl의 직계 그룹으로 인식하지 못함 (`product-client.tsx` 스펙 4항목 dl)
- 조치: 아이콘을 dt 안으로 이동(`dt` 안에 아이콘+라벨), dl > div > (dt, dd) 구조로 평탄화. 시각 정렬은 `pl-[22px]`로 dd 들여쓰기 유지 (기능·시각 변화 없음, 마크업 구조만 수정 — 취향/완성도 개선 아님)
- 재게이트: a11y 100, 나머지 게이트 불변 → 전 항목 통과, 생존
