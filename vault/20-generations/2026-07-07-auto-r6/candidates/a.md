---
run: 2026-07-07-auto-r6
candidate: a
direction: 브루탈리스트 편집(대담)
---

## 방향

굵은 룰 라인(border-b-4/border-2)과 초대형 타이포(font-black, clamp 최대 8.5rem)로 챔피언 계열(R3/R5, 얇은 1px 보더 + rounded-full 필/고스트 넘버)과 뚜렷이 다른 인상을 만들되, 원칙의 핵심(에디토리얼 12-col 비대칭 그리드, near-monochrome + accent 극소량, 헤드라인 Inter 계열 유지, focus-visible 링)은 그대로 계승했다. 대담함의 축은 (1) 필/보더 반경을 전부 `rounded-none`으로 각지게 처리, (2) 가치 3분할과 마무리 CTA 섹션을 fg/bg 반전(흰 배경 + 검정 텍스트)한 "과감한 흑백 블록 대비", (3) 12-col 그리드를 얇은 장식이 아니라 `divide-x-2`로 실선 노출한 것이다.

## 고른 참조

- `vault/10-references/hungry-tiger.design.md` — 단일 웨이트(400) 계열 위주지만 초대형 디스플레이(130–213px)로 스케일이 위계를 만드는 방식, dotted rule 대신 실선 rule로 차용
- `vault/10-references/oryzo-ai.design.md` — "필 버튼은 시스템 전체에서 단 하나"라는 절제 원칙과 `rounded-0` 인풋/각진 프레임 감각을 버튼·인풋 각짐에 반영
- `vault/10-references/dala.design.md` — 순수 블랙 캔버스 + 단일 비비드 accent 절제(다른 채도 색 없음) 원칙을 accent 최소 사용(정사각 스와치 1개 + 헤드라인 단어 1개)에 반영

## 핵심 결정

- 라운드 완전 제거(`rounded-none`) + `border-2`/`border-4` 굵은 룰 라인으로 브루탈 인상 확보, 기존 챔피언의 `rounded-full` 필/고스트넘버 계열과 시각적으로 분기
- 가치 3분할(`#value`)과 마무리 CTA(`#cta`) 섹션을 `bg-white text-[#0B0B0F]`로 반전 — 신규 hex 없이 기존 fg/bg 토큰을 맞바꿔 "과감한 흑백 블록 대비"를 구현(토큰 위반 없음)
- Hero·소셜프루프의 12-col/스탯 그리드에 `divide-x-2 divide-white/15`, `border-2 border-white/20` 등 실선을 노출해 "노출된 그리드"를 구조적으로 표현(장식용 라인아트 브래킷은 사용하지 않음)
- accent(`#6E56CF`)는 각 섹션 eyebrow의 2×2 정사각 스와치 1개 + 헤드라인 단어 1개(고르다/고를)로만 제한 — hover 없이도 정지 상태에서 존재감 유지
- 모든 인터랙티브 요소에 `focus-visible:ring-2 ring-[#6E56CF]` + 배경에 맞는 `ring-offset` 적용(다크 섹션은 `ring-offset-[#0B0B0F]`, 반전 섹션은 `ring-offset-white`)
- 헤드라인은 기본 sans(Geist, Inter 계열 유지) — 세리프·라인아트 브래킷·그라데이션 미사용

## Font Weight (3종)

- `font-normal` (400) — 본문, 라벨, 보조 텍스트
- `font-semibold` (600) — 소제목, 버튼, 내비/eyebrow
- `font-black` (900) — 헤드라인, 스탯 숫자, 고스트 넘버

## 색상 Hex (기존 토큰만 사용, 신규 hex 없음)

- `#0B0B0F` — bg (다크 섹션 배경 / 반전 섹션 텍스트)
- `#FFFFFF` — fg (텍스트 / 반전 섹션 배경 / 룰 라인)
- `#A1A1AA` — muted (보조 텍스트, 다크 섹션)
- `#6E56CF` — accent (스와치 2개소 + 헤드라인 강조 단어 2개소로 극소 사용)
