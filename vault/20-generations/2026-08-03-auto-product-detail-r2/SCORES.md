# SCORES — auto-product-detail-r2

게이트: `node scripts/gate.mjs --target web --routes /product-detail-evolve/r2/<v>` (CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome, PW_NO_SANDBOX=1 — 세션 로컬 크로미움 심링크 경로, gate.mjs 자체는 무수정)

| 후보 | static | weights | sweep | a11y | perf | 1-fix |
|---|---|---|---|---|---|---|
| a — Meridian Exchange (twin-column comparison) | 위반 0 | 3종 | 오버플로 0 | 100 | 66 | 불요 — 1차 전 항목 통과 |
| b — Anvil Type Co (console/panel grid) | 위반 0 | 3종 | 오버플로 0 | **1차 91→100** | 72 | 모바일(390) 전용 `button-name`(Add to cart 아이콘 버튼, 텍스트가 `sm:inline`으로 숨김) + `link-name`(브랜드 워드마크 링크, 동일 원인) — 두 요소에 `aria-label` 추가 후 재게이트 전 항목 통과 |
| c — Ferrous & Oak (journal + floating card) | 위반 0 | 3종 | 오버플로 0 | 100 | 69 | 불요 — 1차 전 항목 통과 |

전 후보 생존 (3/3) → §4 JUDGE 패널로 진행.
