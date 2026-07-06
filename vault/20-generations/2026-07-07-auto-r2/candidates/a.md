---
run: 2026-07-07-auto-r2
candidate: a
direction: 타이포 위계 극대화 (1회차 승자 C 계승·강화)
---

# Candidate A — 타이포 위계 극대화

## 방향
현재 principles의 "에디토리얼 타이포 위계 우선" 방향을 계승하되 더 밀어붙였다. 색은 기존 4토큰(bg/fg/muted/accent) 그대로 near-monochrome을 유지하고, 위계는 오직 **크기·자간·굵기 3단**으로만 만든다. Hero/최종 CTA 헤드라인은 `clamp()`로 데스크톱에서 최대 ~120px까지 확장되고 `tracking-[-0.03em]~[-0.04em]`의 공격적 네거티브 트래킹을 적용해 gsap/dala류의 "carved type" 느낌을 낸다. 값 3분할의 배경 넘버(01/02/03)는 gsap의 카테고리 라벨처럼 대형 저채도 워터마크로 배치하되 `aria-hidden`으로 처리해 접근성 대비 이슈를 회피했다.

## 고른 참조
- `gsap.design.md` — 224px급 display 헤드라인, 단일 패밀리 다중 웨이트 대신 "스케일이 위계를 만든다"는 원칙, 헤어라인 디바이더.
- `dala.design.md` — weight 400이 113px 헤드라인과 body를 동시에 담당(웨이트보다 스케일 신뢰), pure void 배경, 단일 액센트만 색으로 사용.
- `linear-2.design.md` — 타이트한 네거티브 트래킹(-0.022em~) 수치 체계, hairline border로 구획, 단일 accent(라임) 절제 사용 원칙 → 여기선 보라 accent로 대체 적용.

## 핵심 결정
- Hero h1: `clamp(2.75rem,7.5vw,7.5rem)` / extrabold(800) / leading 0.94 / tracking -0.04em, 단어 "다시"만 accent 색.
- 본문/보조 텍스트는 전부 muted(#A1A1AA) + font-normal(400)로 절제, 소셜프루프 인용구만 large+extrabold로 재차 임팩트.
- 값 3분할 배경 넘버는 흰색 20% 톤 + aria-hidden으로 장식화(대비 이슈 회피, 정보는 h3로 별도 전달).
- 버튼/링크는 accent 배경 + 흰 텍스트 조합만 사용(accent를 텍스트 색으로 쓰는 곳은 24px 이상 굵은 텍스트로 한정 — 3:1 대비 확보).

## Font Weights (3종)
- 400 (font-normal) — 본문, 캡션, 통계 라벨
- 600 (font-semibold) — 로고, 내비, 라벨/H3, 버튼
- 800 (font-extrabold) — H1/H2, 블록쿼트, 통계 수치

## 색 Hex
- bg: #0B0B0F
- fg: #FFFFFF
- muted: #A1A1AA
- accent: #6E56CF
(구분선/장식은 white의 opacity 변형(5%/10%/15%/20%)만 사용, 신규 hex 미도입)
