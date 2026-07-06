---
candidate: c
direction: whitespace-air-exploration
date: 2026-07-07
---

# 후보 C — 여백·에어 강조 (Whitespace / Air Exploration)

Mercury의 "spacious density"(72px 이상의 섹션 리듬, 그림자 없이 한 단계 밝은 표면만으로 카드 분리, 굵기 480 하나로만 헤딩을 처리하는 절제된 위계)와 Vivid+Co의 "무게가 아닌 크기·여백으로 위계를 만든다"는 태도를 뼈대로 삼되, 1회차 승자가 확립한 near-monochrome + 타이포 위계 DNA(bg #0B0B0F / fg #FFFFFF / muted #A1A1AA / accent #6E56CF)는 그대로 유지했다. 이번 회차의 실험 변수는 오직 **공간**이다 — 섹션 상하 패딩을 128~224px(py-32~py-56)까지 벌리고, 히어로 카피는 페이지 폭이 아니라 max-w-3xl 안에 가두어 좌우 여백을 크게 남겼으며, 가치 3분할은 카드 박스 대신 헤어라인 하나 없이 텍스트 블록 사이 간격(gap-x-16, gap-y-20)만으로 구획했다. 소셜프루프는 유일하게 한 단계 밝은 표면(#131318)을 은은한 헤어라인(border-white/5)으로 감싸 "떠 있는 밴드"처럼 느껴지게 하되, 그 안에서도 divide-x로 통계 사이 여백을 확보했다. 타이포 위계는 굵기 남발 대신 히어로 헤드라인 한 줄 안에서만 light↔bold 대비를 주고, 나머지 전부(본문/보조/버튼)는 기본 400을 쓰는 방식으로 정리해 **폰트 웨이트를 정확히 3종(300/400/700)**으로 좁혔다 — 1회차 4종 초과 지적을 반영한 결과다. 그라데이션이나 장식적 텍스처는 전혀 쓰지 않고, 여백과 크기 대비만으로 "고급스러운 여유"를 냈다.

**참조**:
- `vault/10-references/mercury.design.md` (spacious density, 그림자 없는 한 단계 표면 분리, 72px+ 섹션 리듬, 절제된 헤딩 굵기)
- `vault/10-references/vivid-co.design.md` (굵기 400 고정 + 크기·여백만으로 위계 형성, 센터드 레이아웃의 넉넉한 여백)

**폰트 웨이트 (3종 엄수)**:
- 300 (font-light) — 히어로 헤드라인 첫 줄, eyebrow 라벨, 가치 섹션 인덱스 번호, 통계 라벨, 푸터
- 400 (font-normal, 기본값) — 본문·서브카피·버튼 텍스트
- 700 (font-bold) — 히어로 헤드라인 둘째 줄, 가치 섹션 소제목, 통계 숫자, 마무리 CTA 헤딩

**쓴 색 hex**:
- `#0B0B0F` — 배경 (bg, DNA 유지)
- `#FFFFFF` — 전경/텍스트 (fg, DNA 유지)
- `#A1A1AA` — 보조/muted 텍스트 (DNA 유지)
- `#6E56CF` / `#7d64e0`(hover) — accent, CTA 버튼 전용 (DNA 유지)
- `#131318` — 신규: 소셜프루프 밴드용 한 단계 밝은 표면(Mercury의 value-lift 원리 차용, 그림자 없이 분리)
- `white/5`, `white/10` — 헤어라인 보더/디바이더 (별도 회색 hex 미사용)
