# SCORES — auto-paywall-r1

타깃: `paywall` (프로파일 부재 — page-brief-core만으로 생성)

| 후보 | static | weights | sweep | a11y | perf | pass |
|---|---|---|---|---|---|---|
| a (Ridgeline) | 위반 0 | 3종 | 오버플로 0 | 93→100 (1-fix) | 63 | ✅ (1-fix 후) |
| b (Hopwire) | 위반 0 | 3종 | 오버플로 0 | 96 | 69 | ✅ |
| c (Trestle) | 위반 0 | 3종 | 오버플로 0 | 89→100 (1-fix) | 66 | ✅ (1-fix 후) |

## 1-fix 루프 — a

- 최초 게이트: a11y 93 (데스크톱 97 / 모바일 93, worst 채택)
- Lighthouse 상세: ① `target-size` — 테스티모니얼 캐러셀 dot-nav 버튼이 시각 크기(h-1.5, 6px)를 그대로 클릭 영역으로 써서 24×24px 최소 터치 타깃 미달. ② `link-name` — 헤더 "Talk to sales" mailto 링크가 `sm:` 이하에서 텍스트가 `hidden`되고 아이콘만 남아 접근 가능한 이름 없음.
- 조치: dot 버튼을 h-6 w-6 클릭 영역 + 내부 aria-hidden span으로 시각 크기 유지(구조만 변경). mailto 링크에 `aria-label="Talk to sales"` 추가.
- 재게이트: a11y 100(양 프리셋), 나머지 게이트 불변 → 전 항목 통과

## 1-fix 루프 — c

- 최초 게이트: a11y 89
- Lighthouse 상세: ① `definition-list`/`dlitem` — "What's included" 체크리스트가 `dl > div.flex(Icon, div(dt,dd))` 구조로 dt/dd가 dl 직계 그룹보다 한 겹 더 중첩됨. **round1 후보 c(product-detail)와 동일한 패턴이 독립적으로 재현** — [[curation-criteria]]에 L2 항목으로 신규 편입. ② `target-size` — 테스티모니얼 dot-nav 버튼 동일 결함.
- 조치: 아이콘을 dt 안으로 이동해 `dl > div > (dt, dd)` 평탄화(`pl-[3.25rem]`로 시각 정렬 유지). dot 버튼을 a와 동일한 패턴(h-6 클릭영역 + 내부 span)으로 수정.
- 재게이트: a11y 100, 나머지 게이트 불변 → 전 항목 통과
