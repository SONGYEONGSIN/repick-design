# Pricing · div · e — 클레이모피즘 (3D 클레이)

**아키타입**: 클레이모피즘 — 말랑한 3D 점토 UI. 두툼한 큰 라운드(1.5~2.25rem), 파스텔 클레이 컬러(복숭아·민트·라벤더), 4레이어 그림자(외곽 라이트하이라이트 + 외곽 다크섀도우 + 인셋 라이트 + 인셋 다크)로 "만질 수 있는 점토 덩어리" 볼륨감을 표현. 버튼은 hover 시 살짝 떠오르고 active 시 인셋 그림자로 반전되어 실제로 눌리는 듯한 촉각적 피드백을 준다.

## 구성
- 히어로: h1 + 결제 주기 토글(월간/연간, 눌린 클레이 표면으로 활성 상태 표현)
- 3티어 카드: Free(복숭아) / Pro(민트, 인기 배지 + 위로 튀어나온 배치) / Business(라벤더) — 각 카드 색조에 맞춘 틴트 그림자
- 기능 비교 표: 크림색 클레이 트레이 안에 지브라 스트라이프 행
- FAQ 3개: native `<details>`로 접히는 클레이 카드, 화살표 회전
- 최종 CTA: 큰 민트 클레이 패널 + 코랄 그라디언트 버블 버튼

## 기술 메모
- 컴포넌트명 `Landing`, "use client" (billing 토글 상태만 사용)
- 멀티레이어 box-shadow는 `<style>` 태그로 스코프(`.clay-page` 하위 CSS 변수 + `.clay-surface*` 클래스), Tailwind는 레이아웃/타이포에 집중
- 색상은 oklch 파스텔, 텍스트는 딥 플럼 잉크로 대비 확보
- 폰트: 시스템 라운드 폰트 스택(`ui-rounded, SF Pro Rounded, Segoe UI Rounded, system-ui`), 외부 CDN 없음
- 이모지로 마스코트/장식 대체(🍡🧡🧩🫧), 외부 이미지 없음
- 배경에 흐릿한 블롭 3개가 느린 float 애니메이션(prefers-reduced-motion 시 정지)
- 반응형: 모바일 1열 스택 → md 3열, Pro 카드만 `md:-translate-y-4`로 돌출

## 상태
완료. 경로: `app/src/app/pages/pricing/div/e/page.tsx`
