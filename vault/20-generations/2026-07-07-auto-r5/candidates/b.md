# 2026-07-07-auto-r5 / candidate b

## 방향
"다크 챔피언 추가 정련" — R4 승자(에디토리얼 12-col 비대칭 그리드, 다크, ghost 넘버, Fig 캡션)를 그대로 계승하고 큰 구조는 전혀 바꾸지 않았다. 이번 라운드는 완성도·견고성 정련에만 집중.

## 참조
- 새 외부 참조 없음 — 현재 챔피언(`app/src/app/page.tsx`, R4 c)과 `vault/00-principles/design-principles.md` 누적 원칙만 기준.

## 핵심 결정 (정련 diff)
1. **모바일 375px 헤드라인 오버플로 수정** — Hero h1이 `clamp(2.5rem,7vw,6.5rem)` 단일 클램프를 쓰던 것을, `<lg`에서는 `clamp(1.875rem,9vw,3.5rem)`(+leading/tracking 완화), `lg:`부터는 기존 값을 그대로 유지하는 2단 클램프로 분리. 375px 뷰포트에서 "버려질 뻔한 것들," 한 줄이 padding을 포함한 콘텐츠 폭(약 327px)에 맞춰 여유 있게 들어가도록 계산해 재조정 — desktop 룩은 픽셀 단위로 동일하게 보존.
2. **캡션 웨이트 불일치 수정** — Fig.01/Fig.04 캡션은 `font-normal`인데 Fig.03(소셜프루프 통계 캡션)만 `font-semibold`로 어긋나 있던 것을 `font-normal`로 통일. 세 캡션이 동일한 시각적 위계를 갖도록 정렬.
3. **키보드 포커스 접근성 보강** — 모든 인터랙티브 `<a>`(nav 링크, 헤더/히어로/최종 CTA 버튼, "색인 보기" 링크, 푸터 링크)에 `focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F]`를 추가. 다크 배경에서 브라우저 기본 아웃라인이 약해 보이는 문제를 accent 색 링으로 보완, hover와 시각 언어를 통일.
4. 섹션 간 리듬(py-24/36 vs 최종 CTA py-28/40), 스탯 정렬, 그리드 구조, 색·폰트 웨이트는 챔피언과 완전히 동일하게 유지 — 방향 전환 없음.

## 폰트 웨이트 (3종, 변경 없음)
- `font-extrabold` (800) — 헤드라인/숫자/ghost 넘버
- `font-semibold` (600) — 라벨/로고/버튼/소제목
- `font-normal` (400) — 본문/캡션/보조 텍스트

## 색 hex (변경 없음)
- bg: `#0B0B0F`
- fg: `#FFFFFF`
- muted: `#A1A1AA`
- accent: `#6E56CF`
