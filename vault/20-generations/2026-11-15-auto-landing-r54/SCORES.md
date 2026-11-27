# SCORES — auto-landing-r54 (target: landing)

Freeze hash (all 3 candidates, pre-gate): `667358212eef69f29c2715165be8fa1246e19dfa`

## Candidate a — "Switchback" (drag-to-reallocate fixed-sum budget split, light/emerald/`--font-display-wide`)

| gate | pass | detail |
|---|---|---|
| route | ✅ | 1개 라우트 응답 OK |
| types | ✅ | 에러 0 |
| static (1차) | ❌ | 위반 2 — `no-unlisted-font`: `style={{fontFamily: DISPLAY_FONT}}` (변수 참조라 정규식이 리터럴 `var(--font-...)`를 못 봄) |
| static (재게이트) | ✅ | 위반 0 |
| lint | ✅ | 위반 0 |
| weights | ✅ | 3종 (렌더 실측) |
| sweep | ✅ | 전 폭 오버플로 0 |
| focus | ✅ | 포커스 표시 0건 누락 |
| console | ✅ | 메시지 76건 · 결함 0 |
| a11y | ✅ | 100 |
| perf | ✅ | 86~91 |

**1-fix**: `fontFamily: DISPLAY_FONT`(변수)를 `fontFamily: "var(--font-display-wide)"`(리터럴)로 치환 + 이제 안 쓰는 `DISPLAY_FONT` import 제거. `no-unlisted-font` 정규식은 소스 텍스트의 리터럴 `var(--font-X)` 패턴만 인식하므로 변수 인다이렉션은 값과 무관하게 항상 걸린다 — 값 자체(이미 올바른 화이트리스트 변수)의 문제가 아니라 간접참조 패턴의 문제. 재게이트 10/10 클린. **생존**.

## Candidate b — "Reclaimed Trail" (draggable timeline-brush, dark/indigo, Pretendard-only)

전 게이트 1차 클린(1-fix 불요): route/types/static/lint/weights/sweep/focus/console(결함0)/a11y 100/perf 82.

## Candidate c — "repick Sort" (drag-and-drop bucket sort, light/green/`--font-display-mono`)

| gate | pass | detail |
|---|---|---|
| static (1차) | ❌ | 위반 7 — 동일 결함군(`fontFamily: DISPLAY_FONT` 변수 참조), `Client.tsx` 5건 + `CompositionPanel.tsx` 1건 + `ListingPreviewCard.tsx` 1건 |
| static (재게이트) | ✅ | 위반 0 |
| 나머지 8게이트 | ✅ | 1차부터 전부 클린 (a11y 100, console 결함0) |

**1-fix**: 3개 파일의 `fontFamily: DISPLAY_FONT` 전부(7곳)를 `fontFamily: "var(--font-display-mono)"` 리터럴로 치환 + 각 파일의 미사용 `DISPLAY_FONT` import 제거. 재게이트 10/10 클린(perf 78→94). **생존**.

## 생존 후보: a, b, c (3개 전부) — 이번 라운드는 하드게이트 탈락 없음, §4 정상 3자 비교
