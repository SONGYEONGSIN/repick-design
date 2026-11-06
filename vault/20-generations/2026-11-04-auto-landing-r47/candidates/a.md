# Candidate A — "Transit Path": a schematic seller → hub → buyer route with live ETA/cost

One-line concept: a three-node schematic (Seller → Verification Hub → Buyer) sits inside the hero
next to a Standard / Expedited / Same-day shipping-speed toggle; switching speed re-animates each
connecting edge and recomputes the ETA and the leg-cost shown at every node, the hero's own proof
line, the comparison table in the value section, and the closing CTA's cited quote — all from one
shared piece of state and one pure `deriveSpeed()` function, so nothing downstream is a hardcoded
literal.

## 브리프에 없던 것

### ① 정확한 violet accent hex와 각 대비비 — 브리프는 "violet" 색조만 지정, 정확한 값은 미지정
### ② 결정: fill `#7C3AED`(violet-600) + 텍스트용 `#6D28D9`(violet-700) + tint `#F5F3FF`/`#EDE9FE`(violet-50/100), 항상 흰 텍스트와 짝
### ③ 왜 — WCAG 상대휘도 공식으로 직접 계산 (가정하지 않음)
표준 공식(`c≤0.03928→c/12.92`, 그 외 `((c+0.055)/1.055)^2.4`; `L=0.2126R+0.7152G+0.0722B`;
`contrast=(L1+0.05)/(L2+0.05)`)으로 계산한 실측값:
- 흰색 텍스트 on `#7C3AED` 채움 → **5.70:1** — 어떤 크기 텍스트도 AA 통과. 모든 accent-fill
  버튼/뱃지/토글 선택 상태는 예외 없이 흰 텍스트와 짝짓는다.
- `#18181B`(zinc-900, 다크 잉크) 텍스트 on `#7C3AED` 채움 → **3.11:1** — 큰 텍스트(24px+) 3:1
  바닥만 통과, 본문 크기 AA는 실패. 그래서 다크 잉크는 accent 채움 위에 절대 쓰지 않음 — 브리프의
  "rule of thumb"이 이 정확한 hex에서도 그대로 확인됨.
- `#7C3AED` 자체를 흰 배경 위 **텍스트 색**으로 쓸 때 → **5.70:1**(같은 쌍, 역할만 반전) — AA
  통과. 그래서 eyebrow/링크 같은 작은 텍스트는 채움 없이 흰 배경 위에 violet 텍스트를 그대로 써도
  안전.
- `#6D28D9`(violet-700) on 흰 배경 → **7.10:1**, `#6D28D9` on `#EDE9FE`(violet-100) → **5.98:1** —
  카드 뱃지·pill 텍스트(Grade, Verified seller, Fastest/Cheapest)에 사용.
- `#71717A`(zinc-500, muted) on 흰 배경 → **4.83:1**(브리프가 요구한 근흰색 바닥 통과) / 같은
  `#71717A` on `#F5F3FF`(violet-50 tint) → **4.41:1**로 AA 본문 기준 **실패**. 그래서 틴트
  배경에서는 항상 `#52525B`(zinc-600, mutedOnTint)을 쓴다 — `#52525B` on `#F5F3FF` → **7.05:1**,
  on `#EDE9FE` → **6.51:1**. `tokens.ts`에 두 토큰(`muted`/`mutedOnTint`)을 분리해 섹션 배경이
  틴트인지 아닌지에 따라 강제로 다른 쪽을 쓰게 했다.

### ① 본문 줄 길이 컨테이너 폭 — 브리프는 공식만 주고 실제 픽셀값은 각 후보가 계산해야 함
### ② 결정: 히어로 subhead(18px) `555px`, 클로징 CTA 본문(16px) `492px`, 그 외는 그리드 트랙 폭이 이미 더 좁아 추가 제약 불필요
### ③ 왜 — `width = target_chars × 0.44 × font_size_px`로 직접 계산 (ch 단위 금지, 사용 안 함)
- 히어로 subhead: 18px, 목표 70자 → `70 × 0.44 × 18 = 554.4px` → `max-w-[555px]` (Hero.tsx).
- 클로징 CTA 본문: 16px, 목표 70자 → `70 × 0.44 × 16 = 492.8px` → `max-w-[492px]` (ClosingCTA.tsx).
- ValueSection의 3분할 칼럼(15px)과 ProductPreview 카드 본문(13px)은 1280px 컨테이너를
  그리드 3칼럼+gap으로 나눈 실측 폭(약 384px, 카드 패딩 반영 시 약 352px)이 이미 각각
  58자·62자 수준이라 70자 목표에 못 미치지만 "65자 미만 캡션은 허용"이라는 예외 조항 범위 안이고,
  상한 75자를 절대 넘지 않으므로 추가 `max-w` 없이 그대로 둠.

### ① 디바이스 자체의 수치 모델 — 브리프는 메커니즘(노드-경로 + 속도 토글 + 실시간 재계산)만
지정, ETA/비용의 실제 숫자와 tie-guard 코드 패턴은 지정하지 않음
### ② 결정: `SPEEDS`를 시간(hour) 단위로 손으로 깨끗하게 맞춰 Standard(24/24/48h, $4) ·
Expedited(12/12/24h, $15) · Same-day(2/2/4h, $34)로 고정, `deriveSpeed()`가 노드별 도착 시각·
leg-cost·총 ETA·총 비용 레이블을 전부 계산해서 Hero/TransitPath/ValueSection 테이블/ClosingCTA가
모두 같은 파생값을 이름으로 인용하게 함. `FASTEST_SPEED`/`CHEAPEST_SPEED`는 `SPEEDS[0]`을
초깃값으로 두고 엄격한 `<` 비교만으로 reduce — 동률이면 먼저 나온 쪽이 그대로 유지되어 두 배지가
동시에 또는 전혀 안 뜨는 자기모순을 원천 차단.
### ③ 왜
"첫 페인트에 실제 비어있지 않은 상태"를 지키려고 Standard의 리그 비용을 처음엔 `[0,0,0]`(총
$0/free)으로 짰다가, 브리프의 "never an empty/zero/unanswered state"를 문자 그대로 더 엄격하게
읽어 각 노드 칩에도 리터럴 `$0`이 뜨는 걸 피하기로 하고 `[1,2,1]`(합 $4)로 바꿨다 — 기본 상태에서
히어로·경로 다이어그램·우측 패널 어디에도 "0"이라는 숫자가 단독으로 노출되지 않는다. tie-guard는
현재 데이터셋에는 실제 동률이 없지만(24+24+48, 12+12+24, 2+2+4 전부 다름; $4/$15/$34도 전부
다름), 브리프가 "데이터와 무관하게 방어적으로 작성하라"고 명시했으므로 숫자가 나중에 바뀌어도
안전한 형태로 고정했다.
