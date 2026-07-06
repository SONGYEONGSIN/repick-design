---
run: 2026-07-07-auto-r3
candidate: b
direction: 초대형 타이포 + 미니멀 라인아트
---

## 방향

`design-principles.md`의 "에디토리얼 타이포 위계 우선 + near-monochrome + accent 극소량"(1회차 C), "비대칭 좌측정렬 + clamp 초대형 스케일 대비"(R2 a) 기조를 유지하면서, 이번 회차는 그라데이션·이미지 없이 **얇은 라인(1px border)만으로 시각적 흥미**를 더하는 데 집중했다. 그라데이션은 단 한 곳에도 쓰지 않았다.

## 참조

- `vault/10-references/dope-security.design.md` — "Hairline Divider" 컴포넌트(그림자 대신 저투명도 1px 스트로크로 리듬 생성), 코너/보더 중심 카드("card IS the row"), accent를 "signal lighting"처럼 극소량만 사용하는 철학을 차용.
- `vault/10-references/factory.design.md` — figure/ground 대비(밝은 카드 vs 어두운 캔버스 대신, 여기선 hairline border 카드), shadow 완전 배제, weight 400 계열의 절제된 타이포 보이스, 96px+ 섹션 갭.

## 핵심 결정

1. **코너 브래킷 모티프**: 히어로 우측의 스탯 카드와 마지막 CTA 박스에 4개 코너마다 얇은 L자 보더(`corner()` 헬퍼, 16px, `border-white/30` 기본 + 1~2개 코너만 accent)를 반복 배치해 "라인아트 프레임" 시그니처를 만들었다. 두 섹션에서 반복되어 일관된 브랜드 마크로 읽히게 함.
2. **플러스 틱마크**: 헤더 로고 옆, 히어로 eyebrow 라벨 옆에 두 개의 1px 라인이 교차하는 십자(`plusMark()`, 10px)를 배치. 점(dot) 대신 라인으로 만든 미니멀 불릿.
3. **가치 3분할**: 이전 회차(R2 a)의 `border-t` 가로 구분 대신 `divide-x`(세로 헤어라인)로 컬럼을 나눠 동일 섹션이라도 다른 리듬을 시도.
4. **소셜프루프 루트라인**: 4개 통계 위에 가로 헤어라인 + 각 통계 앞에 작은 원형 노드(`border` only, fill은 배경색)를 배치해 "연결된 지표"처럼 보이게 함 — dope.security의 comparison card "route line" 아이디어 차용.
5. **텍스트 스트로크(외곽선 숫자) 기법은 배제**: 대비 하락으로 인한 자동 접근성 검사(axe) contrast 실패 위험이 있어, 라인아트는 보더/구분선/틱마크에만 적용하고 글자 자체는 항상 solid fill 유지.

## Font Weight (3종)

- `font-bold` (700) — H1/H2/스탯 숫자/블록쿼트
- `font-medium` (500) — 라벨/버튼/네비/eyebrow
- `font-light` (300) — 본문/서브카피/푸터

## 색상 (기존 토큰만 사용, 신규 hex 없음)

- `#0B0B0F` — bg
- `#FFFFFF` — fg (opacity 변형: /10, /15, /20, /30, /40, /85 는 라인/보더/배경 투명도 용도)
- `#A1A1AA` — muted
- `#6E56CF` — accent (헤더 로고 십자 1곳, H1 "다시" 1곳, CTA 버튼 배경 2곳, 코너 브래킷 강조 2곳 — 총 6곳 이하로 제한, 확장 없음)

그라데이션 사용 0건.
