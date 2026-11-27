# SCORES — auto-landing-r58

Freeze hash (all 3 candidates' `.tsx`/`.ts` source, sorted paths, concatenated, SHA-1): `89adf2c3ed9d7459928bd7f71d5b4956996960b6`

No 1-fix cycles needed — all 3 candidates passed the hard gate clean on the first run.

| gate | a (Bulk Trade-In Tier Counter) | b (Add-On Combination Tier) | c (Delivery Grid Pick) |
|---|---|---|---|
| route | pass — 1개 라우트 응답 OK | pass — 1개 라우트 응답 OK | pass — 1개 라우트 응답 OK |
| types | pass — 에러 0 | pass — 에러 0 | pass — 에러 0 |
| static | pass — 위반 0 | pass — 위반 0 | pass — 위반 0 |
| lint | pass — 위반 0 | pass — 위반 0 | pass — 위반 0 |
| weights | pass — 3종 (렌더 실측) | pass — 3종 (렌더 실측) | pass — 3종 (렌더 실측) |
| sweep | pass — 전 폭 오버플로 0 | pass — 전 폭 오버플로 0 | pass — 전 폭 오버플로 0 |
| focus | pass — 포커스 표시 0건 누락 | pass — 포커스 표시 0건 누락 | pass — 포커스 표시 0건 누락 |
| console | pass — 117건 · 결함 0 | pass — 40건 · 결함 0 | pass — 64건 · 결함 0 |
| a11y | pass — 100 | pass — 100 | pass — 99 · 실패 감사 `landmark-one-main` (≥95 이므로 하드페일 아님) |
| perf | pass — 90 (기록만) | pass — 93 (기록만) | pass — 68 (기록만) |

**pass: true (all 3)** — proceeding to §4 JUDGE with 3 survivors.
