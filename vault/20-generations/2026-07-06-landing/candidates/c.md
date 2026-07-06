---
candidate: c
direction: typography-first
date: 2026-07-06
---

# 후보 C — 타이포 중심 (Typography-first)

Vercel의 순흑/순백 모노크롬 + 헤어라인 보더 + 격자 텍스처를 뼈대로 삼되, 색 대신 **글자 크기·굵기·자간·행간의 대비**로 리듬을 만드는 데 집중했다. 히어로 헤드라인은 `font-bold`와 `font-light`를 한 줄 안에서 교차시켜("다시,"는 light+저채도, "고르다"는 bold) 타이포 자체로 강약을 주고, 각 섹션에 Vercel식 인덱스 라벨("001", "002", "003")을 mono-uppercase-tracking으로 배치해 편집디자인 특유의 목차 감각을 더했다. 가치 3분할은 큰 아웃라인 숫자(01/02/03, text-stroke만 accent 색)를 헤어라인 구분선과 함께 배치해 잡지 그리드처럼 읽히게 했고, 소셜프루프는 숫자 자체를 히어로급 크기(tabular-nums, text-8xl)로 키워 통계가 곧 비주얼이 되도록 했다. 마무리 CTA 배경에는 초저투명도(3%)의 거대 워드마크를 깔아 브랜드 각인을 타이포로만 처리했다. 색은 흑/백/그레이 스케일로 한정하고 accent(#6E56CF)는 eyebrow 점 하나와 숫자 아웃라인 스트로크 두 곳에만 극소량 사용해 "색이 아닌 형태와 크기로 위계를 만든다"는 원칙을 지켰다.

**참조**: `vault/10-references/vercel.design.md` (모노크롬 대비, 헤어라인 보더, 격자 텍스처, 정직한 크기 대비로 위계 형성)

**쓴 색 hex**:
- `#050505` — 배경 (bg)
- `#FFFFFF` — 전경/텍스트 (fg)
- `#6E56CF` — accent (eyebrow 점, 숫자 01/02/03 아웃라인 스트로크에만 극소량)
- `white/10`, `white/15`, `white/20`, `white/25`, `white/30`, `white/35`, `white/40`, `white/50`, `white/85`, `white/90`, `white/[0.03]`, `white/[0.07]` — 그레이 스케일 위계는 전부 흰색 투명도로만 표현 (별도 회색 hex 미사용)
