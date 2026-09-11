# SCORES — auto-landing-r20

Freeze-state hash (post-fix, all candidates gated): `8669680704757a34e1b3511eaf87eb4163b343eb`

| candidate | route | types | static | lint | weights | sweep | focus | console | a11y | perf |
|---|---|---|---|---|---|---|---|---|---|---|
| a — qualification wizard | ok | 에러 0 | 위반 0 | 위반 0 | 3종 | 오버플로 0 | 누락 0 | 결함 0 | **100** (1차, bf-cache만) | 60 |
| b — time-scrubbed price/verification ticker | ok | 에러 0 | 위반 0 | 위반 0 | 3종 | 오버플로 0 | 누락 0 | 결함 0 | 1차 **96**(definition-list — `dl>div>(dt,dd,p)`에서 3번째 자식이 `p`라 axe definition-list 위반) → 1-fix(`p`를 `dd`로 교체, 시각·기능 변화 없음) → **100** | 53 |
| c — bundle builder (cart-style multi-select) | ok | 에러 0 | 위반 0 | 위반 0 | 3종 | 오버플로 0 | 누락 0 | 결함 0 | **95** (1차, 실패 감사: aria-prohibited-attr·bf-cache·landmark-one-main — 승격된 하드페일 7종에 없음, 기록만) | 52 |

3후보 전원 하드게이트 생존. b만 1-fix 소모(definition-list, `page-brief-core` §1 승격 감사).
