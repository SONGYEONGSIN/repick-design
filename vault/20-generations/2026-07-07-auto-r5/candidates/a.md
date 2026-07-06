# R5 후보 a — 라이트 챔피언 정련

## 방향
R4 라이트(a, 19점)를 R4 챔피언(c, 다크)의 정련 수준까지 끌어올려 "폴리시된 라이트가 다크 챔피언을 이길 수 있는가"를 시험한다. 구조는 그대로(비대칭 12-col, ghost 넘버, Fig 캡션, quote mark, 3분할 가치 섹션)두고 R4→R4c 사이에 있었던 디테일 정련만 라이트에 이식 + 추가 폴리시 1개를 더했다.

## 고른 참조
- `vault/00-principles/design-principles.md` — R4 c 승리 학습(에디토리얼 구조>테마, 트래킹 3단 스케일, 넘버링 포맷 통일)
- `vault/10-references/anthropic.design.md` — 라이트 표면에서 accent를 "행동 순간에만" 절제해서 쓰는 원칙, hairline border로 elevation 대체
- `vault/10-references/drive-capital.design.md` — 단일 accent 색 + 타이트 트래킹 + shadowless 평면 표면의 에디토리얼 포스터 리듬

## 핵심 결정
1. **트래킹 3단 스케일 통일**: eyebrow 0.28em / Fig 캡션 0.16em / 스탯 라벨 0.12em으로 전 섹션 고정(R4 a는 proof Fig 라벨이 0.24em으로 어긋나 있었음 — 수정).
2. **proof 섹션에 ghost "03" 배경 넘버 + quote 옆 accent 세로바 추가**: R4 a에는 없던 요소로, hero/CTA의 ghost 넘버 패턴을 proof까지 완성해 4섹션 전부 일관된 "Issue" 리듬을 만들고 accent 정지 존재감을 강화.
3. **value 섹션 ghost 넘버 clamp 스케일 재조정**(01: 6vw/5.5rem → 02: 5vw/4.5rem → 03: 4vw/3.5rem, 불투명도 black/[0.1]로 통일) — 이전 R4 a는 스케일 간격이 불균등했음.
4. **최상단 3px accent 시그니처 룰 추가**(`bg-[#6E56CF]` 풀블리드 바) — 다크 챔피언에는 없는 라이트 전용 차별화 포인트. hover 의존이 아닌 정지 상태 존재감으로 principle 준수.
5. Hero 스와치 그리드는 페이지 배경과 동일한 흰색 셀 + accent 센터로 단순화(챔피언의 다크 셀 패턴과 대칭 유지).

## Font Weight (3종)
- `font-normal` (400) — 본문, 캡션, 라벨
- `font-semibold` (600) — 소제목, nav, 버튼
- `font-extrabold` (800) — 헤드라인, ghost 넘버, 스탯 수치

## 색 Hex
- `#FFFFFF` — 페이지 배경
- `#FAFAFA` — 섹션 배경(value, cta)
- `#0B0B0F` — 잉크(텍스트)
- `#52525B` — muted 텍스트(zinc-600)
- `#6E56CF` — accent(고정 극소량 + 시그니처 룰)
- `black/[0.05]~black/[0.1]` — ghost 넘버/보더 투명도 스케일
