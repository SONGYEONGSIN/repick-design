---
run: 2026-07-07-auto-r4
candidate: a
direction: 라이트 테마 에디토리얼 (탐색)
---

## 방향

현재 누적 DNA(R1~R3)는 다크 배경(#0B0B0F) 위 에디토리얼 타이포 위계였다. 이번 회차는 "다크가 정말 최선인가"를 시험하기 위해 R3-a의 12-col 비대칭 그리드·ghost 넘버·Fig 캡션·quote mark 구조를 그대로 유지한 채 **배경만 라이트로 반전**했다 — 레이아웃/리듬 변수를 고정하고 색 변수만 바꿔 순수하게 테마 가설을 검증하는 실험 설계.

## 고른 참조

- `anthropic.design.md` (theme: light) — 근접-단색 + 극소량 accent 원칙(clay는 CTA 전용), 하드셰도우 없이 surface tone만으로 위계를 만드는 방식을 근거로 채택.
- `apple.design.md` (theme: light) — 단일 accent color, hairline border + surface shift로 elevation 대체하는 절제 원칙 참고.
- `general-intelligence-company.design.md` (theme: light) — 웜 오프화이트 캔버스 + 단일 accent border 절제, 세리프 대신 산세리프 위계 강조 구조의 밀도감 참고.

세 레퍼런스 모두 "단색 배경 + 극소량 단일 accent"라는 공통 원칙만 취하고, 실제 색상값은 지시대로 순백/오프화이트(#FFFFFF/#FAFAFA) + 기존 브랜드 accent(#6E56CF)를 그대로 유지해 다크 버전과의 A/B 비교 순도를 높였다.

## 핵심 결정

- 배경: `#FFFFFF`(기본 캔버스) / `#FAFAFA`(Value·CTA 섹션 밴딩용 대체 표면 — 다크 버전의 섹션 구분과 동일한 역할).
- 텍스트: 잉크색 `#0B0B0F`(제목·강조), 뮤트 `#52525B`(본문/캡션 — 순백 배경에서 AA 대비 확보를 위해 다크 버전의 `#A1A1AA`보다 어둡게 조정).
- accent: `#6E56CF` 그대로 유지 — 정지 상태에서도 존재감 있는 위치(헤드라인 강조 단어·CTA 버튼·그리드 1칸)에만 극소량 사용, R3 학습("accent 정지 상태 존재감 유지") 계승.
- ghost 넘버·hairline border는 `white/*` → `black/[0.04~0.12]`로 반전, 그 외 좌표·비율은 R3-a와 동일하게 고정.
- 폰트 웨이트 3종만 사용: `font-normal`(400) 본문, `font-semibold`(600) 소제목/뱃지, `font-extrabold`(800) 헤드라인/ghost 넘버.

## 사용 font-weight

- 400 (font-normal) — 본문, 캡션, footer 링크
- 600 (font-semibold) — nav, 소제목(h3), 라벨
- 800 (font-extrabold) — h1/h2, ghost 넘버, 인용구, 통계 수치

## 색 hex 목록

- `#FFFFFF` — 페이지 기본 배경
- `#FAFAFA` — Value/CTA 섹션 대체 표면
- `#0B0B0F` — 잉크 텍스트(제목/강조)
- `#52525B` — 뮤트 텍스트(본문/캡션)
- `#6E56CF` — accent (기존 브랜드 유지)
- `#FFFFFF`(버튼 텍스트), `black/[0.04~0.15]` 계열 — ghost 넘버·hairline border 투명도 오버레이
