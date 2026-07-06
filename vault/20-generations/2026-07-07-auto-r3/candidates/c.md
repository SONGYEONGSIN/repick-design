---
run: 2026-07-07-auto-r3
candidate: c
direction: 여백 극대화 (에어리)
---

# Candidate C — 여백 극대화 (에어리)

**방향**: R2 근소 2위였던 "여백" 방향을 스케일 임팩트를 보강해 재도전. `mercury.design.md`(spacious density, 72~128px 리듬, 무채색+단일 코발트 액센트, no-shadow flat surface, 인터미디엇 웨이트 절제)와 `structured.design.md`(display 타입의 극단적 사이즈 대비로 스케일 임팩트)를 참조. 두 레퍼런스의 교집합 — "여백은 극단으로, 그러나 스케일 대비는 R2 승자(a) 수준으로 유지" — 를 핵심 결정으로 삼았다.

**핵심 결정**:
- 섹션 상하 패딩을 원칙 최소치(96px)의 1.5~2.5배로 확장(mobile py-32/128px → desktop lg:py-64/256px)해 "여백 극대화"를 R2보다 명확히 체감되게 만듦.
- Hero는 R2 학습(비대칭 좌측정렬 + clamp 초대형 스케일)을 유지 — 여백 방향이라고 중앙정렬로 후퇴하지 않음. `text-[clamp(2.75rem,7vw,6.75rem)]`로 R2 수준 스케일 대비 보존.
- 가치 3분할은 카드 배경/그림자 없이 상단 hairline(`border-white/10`)만으로 구획 — Mercury의 "elevation 없이 값 대비로만 분리" 원칙을 여백 극대화 맥락에 맞게 "테두리 하나로만 분리"로 재해석. 요소 최소화.
- 소셜프루프는 로고/카드 없이 큰 스탯 한 줄 + 인용 한 줄로 축소 — 요소 개수 자체를 줄여 여백의 밀도를 낮춤.
- accent(#6E56CF)는 섹션 번호(01/02/03)와 CTA hover에만 사용 — 극소량 고정 원칙(R2 학습) 준수.

## 폰트 웨이트 (3종, 원칙 준수)
- `font-light` (300) — 모든 display/heading (h1, 섹션 h2, 스탯 카피)
- `font-normal` (400) — 본문/서브카피/muted 텍스트
- `font-semibold` (600) — 브랜드 마크, 섹션 번호(01/02/03), CTA 버튼 라벨

## 색 (hex, 원칙 토큰 그대로 재사용 — 신규 색 없음)
- `#0B0B0F` — bg
- `#FFFFFF` — fg (헤드라인, 본문 주요)
- `#A1A1AA` — muted (서브카피, 보조 텍스트)
- `#6E56CF` — accent (섹션 번호, CTA hover만)
- `white/10`, `white/20` — 구분선/버튼 보더 (신규 색 아님, 기존 fg의 opacity 변형)
