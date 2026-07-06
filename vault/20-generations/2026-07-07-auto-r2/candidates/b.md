---
candidate: b
run: 2026-07-07-auto-r2
direction: near-monochrome + accent 전략적 확장
based_on: 2026-07-06-landing/c (1회차 승자), 2026-07-06-landing-r2/a (직전 회차, 웨이트 3종 정리)
references: [dala.design.md, linear.design.md]
---

# 후보 B (2026-07-07 자율 Round 2) — accent를 CTA·핵심 지표에 자신 있게

## 방향
직전 회차(r2-a)는 accent(`#6E56CF`)를 eyebrow 점 + 인덱스 숫자 20% 저투명도에만 극소량 배치해 "색 절제"를 거의 회색조 수준까지 밀어붙였다. 이번 b는 같은 near-monochrome DNA(배경/전경/뮤트는 그대로) 위에서 **accent의 역할을 두 곳으로 명확히 확장**한다 — (1) 모든 CTA 버튼을 흰색 채움 대신 accent 채움으로, (2) 헤드라인의 한 단어·핵심 지표 숫자(통계, 인덱스, 소셜프루프 대수)를 accent 풀 컬러로. "색을 여러 군데 뿌리는 것"이 아니라 "accent가 나타나는 자리를 좁게 고정하고, 그 자리에서는 확실하게 보이게 한다"는 규율.

## 고른 참조와 훔친 것
- **Dala** (`dala.design.md`) — "violet은 필드 버튼 배경에만 쓰고 절대 큰 배경 면에 쓰지 않는다", "동일 화면에 filled violet 버튼을 여러 개 겹쳐 두지 않는다(단, 반복되는 동일 CTA는 예외)" 원칙을 그대로 채택 — header/hero/final의 CTA 3곳 모두 동일한 accent 필 버튼이고, 이외 표면에는 accent 배경을 쓰지 않았다.
- **Linear** (`linear.design.md`) — "그라디언트는 면이 아니라 글로우로, 채도 낮은 blur 광원 1~2개만" 원칙을 hero 상단과 final CTA 하단에 `radial-gradient` 글로우로 적용(각 섹션 1개, 투명도 0.22~0.28). 헤어라인 그리드 텍스처는 이번엔 제거해 글로우 하나로만 공간감을 냄 — 장식 레이어를 겹치지 않는다는 절제.

## 핵심 결정
- **CTA 3곳(header/hero/final) 전부 `bg-[#6E56CF]` 채움 + `hover:bg-[#6E56CF]/85`** — r1/r2-a의 흰색 CTA에서 전환. "행동을 부르는 자리 = accent"라는 신호를 명확히 하기 위함.
- **핵심 지표 숫자에 accent 풀 컬러**: hero 통계 3종(128K+/4.9/62%), 가치 3분할 인덱스(01/02/03, 이전 20% 투명도 → 100% 채움), 소셜프루프 대수(12,842)를 모두 `text-[#6E56CF]`로 통일. "이 숫자가 핵심 증거다"라는 위계를 색으로 즉시 스캔 가능하게 만든다.
- **헤드라인 강조어를 이탤릭+회색 대신 accent 색상 단어**로 전환 — 헤드라인의 "다시"(hero), "세 가지"(가치), "다시"(final CTA)를 `text-[#6E56CF]`로 표시. 웨이트나 스타일을 바꾸지 않고 색만 바꿔 accent 확장 방향과 타이포 위계 원칙(크기·자간·색으로 위계, 웨이트 남발 금지)을 동시에 지킨다.
- **소셜프루프 인용구 보더를 `border-white/15` → `border-l-2 border-[#6E56CF]`로** — 신뢰 증거(리뷰) 옆에 accent를 살짝 배치해 "이 증거를 봐라"는 시선 유도.
- eyebrow 라벨 색을 `text-white/40`에서 `text-[#6E56CF]`로 바꿔 accent가 hero 최상단부터 등장하도록 함(단, 배경 면이 아니라 텍스트 색 1줄에 한정).
- 그리드 텍스처 배경은 제거(r1/r2-a에 있던 장식) — glow 하나로 대체해 레이어 수를 줄이고 accent 확장에 시선이 분산되지 않게 함.

## 사용한 font-weight (정확히 3종)
- `font-normal` (400) — 본문, nav, 서브카피, 인용문, 라벨, footer
- `font-semibold` (600) — eyebrow 라벨, CTA 버튼 텍스트, 카드 소제목(h3)
- `font-bold` (700) — 로고, h1/h2 헤드라인, 통계·인덱스·소셜프루프 숫자, 워드마크

## 쓴 색 hex
- `#0B0B0F` — 배경 (bg, design-principles 토큰)
- `#FFFFFF` — 전경/텍스트 (fg), 인용구 본문은 `white/90`
- `#A1A1AA` — muted 텍스트 (라벨, 서브카피, 보조 정보)
- `#6E56CF` — accent — CTA 버튼 배경(hover는 `/85` 투명도), 핵심 지표 숫자(통계/인덱스/소셜프루프 대수), 헤드라인 강조어, eyebrow 라벨, 인용구 좌측 보더, hero/final 배경 글로우(`rgba(110,86,207,0.22~0.28)`)
- `white/10`, `white/60` — 순수 구조 요소(헤어라인 보더, footer 로고 톤)에 한정된 fg 투명도 변주
