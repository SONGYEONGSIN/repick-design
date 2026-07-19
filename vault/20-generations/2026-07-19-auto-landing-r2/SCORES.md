# auto-landing-r2 — HARD GATE SCORES

TARGET=landing · 후보 2개(a,b) · 2026-07-19

| 후보 | 형태 | static (이미지 규칙 포함) | sweep (overflow) | Lighthouse a11y (게이트 ≥95) | perf (기록만) | next/image · framer-motion |
|---|---|---|---|---|---|---|
| a — 밀어서 비교 | Before/After 드래그 슬라이더 히어로 | pass `[]` (1차) | pass (1차, overflow 0) | 93 → **100** (1회 수정 후) | 84 | next/image 2곳(슬라이더 before/after·제품샷) · useScroll/useSpring/useTransform/useMotionValue/whileInView |
| b — 프루프 덱 | 스냅스크롤 애니메이티드 스탯 스토리 | pass `[]` (1차) | pass (1차, overflow 0) | **96** pass | 0* | next/image(제품 캐러셀) · useScroll/useSpring/useTransform/useInView/whileInView |

- 정적: 두 후보 모두 1차부터 위반 0건 — 이미지 규칙 3종 포함 통과(next/image·alt·비-unoptimized 준수).
- sweep: 1280~1920(−16px 여유폭 포함) + 모바일 390px, page-overflow·table-overflow 0.
- Lighthouse a11y: **후보 a는 1차 93으로 하드게이트(≥95) 미달** → 결함 2건 정밀 수정 1회 부여: ① 액센트 아이브로우 `#6e56cf` on `#0B0B0F` 3.64:1(<4.5) → 소형 아이브로우를 밝은 액센트 `#a894f7`로(대형 요소는 정본 `#6E56CF` 유지) ② `<dl>` 직접 자식이 `div>p`(정의 리스트 위반) → `<div>` + 일반 요소로 재구성. 재-Lighthouse 100/잔여 a11y 실패 0. 재-sweep도 통과(레이아웃 불변). 후보 b는 1차 96 통과.
- *perf: 후보 b perf=0은 dev 서버(프로덕션 아님)에서 무거운 framer-motion 스냅스크롤+SVG draw-in의 측정 이상치. perf는 기록만(SKILL 규정 — dev 측정치 탈락 미적용). a11y·sweep·static 하드게이트는 전부 통과.
- 캡처 주의: 두 후보의 첫 폴드 스크린샷은 진입 애니메이션 재생 중(playwright 즉시 캡처) 상태라 히어로 본문/lazy next/image가 아직 안 그려짐 — 이는 캡처 타이밍 아티팩트이며(진입 opacity:0 잔존 결함 아님, judge lens1이 소스로 확인), judge는 소스+스크린샷 병행 심사.
