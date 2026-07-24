# auto-landing-r3 — HARD GATE SCORES

TARGET=landing · 후보: a(라이브 디스커버리 피드) · b(AI 큐레이터 대화 트랜스크립트) · c(절약 계산기 히어로)

## 정적 검사 (`scripts/dash-static-check.mjs`)
- a/b/c 전부 1차부터 위반 0건 (이미지 규칙 3종 no-raw-img·img-needs-alt·no-unoptimized 포함).

## sweep (`scripts/dash-sweep.mjs`, 데스크톱 1280/1366/1440/1536/1680/1920 ± 16px + 모바일 390px)
- a/b/c 전부 1차 통과 — page-overflow 0, table-overflow 0.

## Lighthouse (`--only-categories=performance,accessibility --preset=desktop`, dev 서버 측정)
| 후보 | a11y | perf(기록만) | 잔여 이슈 |
|---|---|---|---|
| a | 100 | 93 | `label-content-name-mismatch`(weight 0, hidden — 카테고리 점수 영향 없음) |
| b | 95 | 95 | `color-contrast`(accent eyebrow `#6E56CF`@11px, 3.64:1 — r5에서도 재발한 틴트 배경/소형 accent 텍스트 대비 부족 패턴), `heading-order`(트랜스크립트 제품 카드 figcaption h4가 상위 heading 건너뜀) — 둘 다 하드게이트 임계(≥95) 통과로 수정 불요 |
| c | 100 | 95 | 없음 (designer가 1차 자체 axe 스캔에서 heading-order 위반 발견·h2로 자체 수정 후 재스캔 0건) |

전 후보 하드게이트 통과 (a11y ≥95). perf는 기록만 — 탈락 미적용.

## 환경 제약 (판정 영향 없음, 기록용)
- 이 샌드박스의 아웃바운드 프록시가 `images.unsplash.com` 접근을 차단(`curl` 직접 테스트로 확인, `next.config.ts`의 `remotePatterns`엔 정상 등록됨) — dev 서버의 `next/image` 최적화 요청이 실패해 헤드리스 스크린샷·실브라우저 모두에서 제품 사진이 빈 상태로 보인다. 3후보 전부 동일하게 영향받는 대칭적 제약이며 레이아웃(고정 aspect-ratio 컨테이너)·오버플로·접근성 하드게이트에는 영향 없음(alt 텍스트는 유지됨). JUDGE 단계에서 스크린샷 판정 시 이 제약을 감안해 소스 코드 병행 검토로 보정.
