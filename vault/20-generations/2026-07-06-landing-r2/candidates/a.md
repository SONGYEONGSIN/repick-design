---
candidate: a
round: 2
direction: typography-first (refined)
date: 2026-07-06
based_on: 2026-07-06-landing/c (1회차 승자)
---

# 후보 A (2회차) — 타이포 위계, 웨이트 3종으로 정리

## 계승한 것 (1회차 C에서)
- **에디토리얼 타이포 위계 우선 + near-monochrome** 방향 그대로 계승 — 색이 아니라 크기·자간·행간·스타일로 리듬을 만든다는 원칙.
- 전체 구조(Header → Hero → 가치 3분할 → 소셜프루프 → 마무리 CTA → Footer)는 `design-principles.md`의 "Landing 구조 기본형"과 1회차 승자 구조를 그대로 유지.
- 헤어라인 보더(`border-white/10`)와 격자 텍스처 배경, 섹션별 인덱스 라벨("001/002/003") 같은 Vercel식 편집 그리드 장치를 재사용 — 성능(Lighthouse)과 토큰 이탈 최소화가 검증된 패턴이므로 유지.
- 마무리 CTA의 초저투명도 워드마크(`text-white/[0.03]`), tabular-nums 통계 강조 등 1회차에서 효과적이었던 디테일 유지.

## 고친 것 (핵심 개선)
- **폰트 웨이트를 4종(light 300 / medium 500 / semibold 600 / bold 700) → 정확히 3종(normal 400 / semibold 600 / bold 700)으로 축소.** `design-principles.md` 금지 섹션의 "다음 회차 정리 대상" 지시를 직접 반영.
  - 1회차 C가 "다시,"를 표현할 때 썼던 `font-light`(300)를 완전히 제거. 대신 **`italic` + 색상(`#A1A1AA`)**의 조합으로 동일한 시각적 강약을 재현 — 웨이트가 아니라 스타일(이탤릭)과 색 톤 차이로 대비를 만든다.
  - 헤더 CTA·nav에서 쓰던 `font-medium`(500)도 제거하고 `font-semibold`(600) 또는 `font-normal`(400)로 통합.
  - 결과적으로 위계는 크기(`text-[12vw]`~`text-8xl` 스케일), 자간(`tracking-tight`~`tracking-[0.25em]`), 스타일(`italic`), 색(`#A1A1AA` 톤 다운)의 조합으로 만들며, 웨이트는 "본문(400) / 강조 라벨·버튼(600) / 표제·숫자(700)" 3단 역할로만 고정.
- 색 토큰을 `design-principles.md`의 공식 Color Tokens 표(`#0B0B0F` / `#FFFFFF` / `#A1A1AA` / `#6E56CF`)에 문자 그대로 정렬. 1회차 C는 회색 위계를 전부 `white/xx` 투명도로만 표현했는데, 이번엔 본문·라벨의 muted 텍스트는 리터럴 `#A1A1AA`를 사용하고, 헤어라인 보더 등 순수 구조 요소만 `white/10` 계열 투명도를 유지해 토큰 정합성을 더 높였다.
- 숫자 인덱스(01/02/03) 표현 방식을 1회차의 `WebkitTextStroke` 아웃라인 기법에서 `text-[#6E56CF]/20`(accent 저투명도 채움)으로 단순화 — 동일하게 "accent는 숫자 장식에만 극소량" 원칙을 지키되 구현을 더 가볍게(별도 인라인 스타일 불필요) 정리.

## 사용한 font-weight (정확히 3종)
- `font-normal` (400) — 본문, nav, 라벨(누적 이용자 등), 인용문, footer
- `font-semibold` (600) — eyebrow 라벨, 헤더/CTA 버튼, 카드 소제목(h3)
- `font-bold` (700) — 로고, h1/h2 헤드라인, 통계 숫자, 인덱스 숫자(01/02/03), 워드마크

## 쓴 색 hex
- `#0B0B0F` — 배경 (bg, `design-principles.md` 토큰 그대로)
- `#FFFFFF` — 전경/텍스트 (fg)
- `#A1A1AA` — muted 텍스트 (라벨, 서브카피, 보조 정보) — 리터럴 hex로 사용, 1회차의 opacity 방식에서 토큰 정합으로 개선
- `#6E56CF` — accent (eyebrow 점 + 인덱스 숫자 01/02/03 채움에만 극소량, `/20` 저투명도)
- `white/10`, `white/15`, `white/20`, `white/85`, `white/90`, `white/[0.03]`, `white/[0.06]` — 순수 구조 요소(헤어라인 보더, 배경 워드마크, 격자 텍스처)에 한정된 fg 투명도 변주, 별도 회색 hex 아님
