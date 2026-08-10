# auto-contact-r2 / b — Trust Tier Console

Trust Tier Console organises repick's contact page around **the reader's relationship to the
marketplace** — guest, verified buyer, verified seller — instead of a department or a clock. Two
channels (general email, general phone) render as a server-side `<ul>` of real `mailto:`/`tel:`
pills directly under the intro, independent of any client state, so they work above the fold with
zero interaction even if JavaScript never hydrates. Below that, a fieldset of three native radio
inputs styled as an identity picker — not a passive stat strip — doubles as legend and control:
choosing "Guest" / "Verified buyer" / "Verified seller" re-sorts a six-channel list (each channel
carries a `tiers` membership and a per-tier `priority`) so the tier-exclusive channel renders first
with a "Matched to \<tier\>" badge, while a second panel swaps in three tier-specific "Good to know"
lines (buyer protection routing, payout holds, account verification). No channel disappears that
was visible before — channels are added and reordered, never taken away from what a lower-context
reader already saw. Nothing on the page reads a clock: "median reply," "monthly volume" and "breaks
when" (weekend closures, post-promo Monday backlog, unstaffed seller-payout weekends) are fixed
published figures, honouring the r1 provisional criterion (promise + the conditions it breaks)
without touching time-of-day math. Light surface (`bg-white`/`zinc-50`), blue as the sole accent
(verification/trust connotation, unused in the last three rounds), `--font-display-wide` on display
type only, `--font-sans` everywhere else. Exactly three weight classes route-wide: `font-normal`,
`font-medium`, `font-semibold`.

인터랙션: 계정 컨텍스트 라디오 그룹(3-way, 네이티브 `<input type=radio>` + `fieldset`/`legend`,
화살표 키로 그룹 내 이동) 1종 — 선택이 우측 두 패널(우선순위 채널 리스트 재정렬 + "Good to know"
텍스트 전환)을 동시에 갱신한다. 폼 제출이나 검색 없음 — 셀렉터 자체가 유일한 조작 축.

## 매크로 골격

```
skip-link
header  (워드마크 + "Back to marketplace" 내부 링크)
h1 + 1문장 서브카피            ← 스탯 스트립 없음
"Reach a person right now"     ← 서버 렌더 zero-interaction 베이스라인 필(pill) 2개, mailto/tel
"Matched to how you use repick"
  ├─ fieldset(3 radio: Guest / Verified buyer / Verified seller) — 설명과 컨트롤 겸용
  ├─ 좌: "Priority channels — <tier>" 카드 리스트 (실제 재정렬, dt/dd median/breaks)
  └─ 우: "Good to know — <tier>" bullet 3종 (텍스트 전면 교체)
"Paths that don't need a tier"  ← Trust & Safety · Security · Press, 티어 무관 3카드
footer
```

## 축

identity/verification-tier selector (시계·전역 재계산 아님) · light · blue · `--font-display-wide`

## 브리프에 없던 것

1. **연락처 실주소·전화번호**
   ① 브리프는 mailto/tel이 실제 링크여야 한다고만 정했지, 어떤 도메인·번호를 쓸지는 정하지 않았다.
   ② `repick.co` 도메인 아래 `help@` · `onboarding@` · `disputes@` · `payouts@` · `appeals@` ·
   `trust@` · `security@` · `press@`와 고정 미국 번호(+1 415 555 01xx) 5종을 발명했다.
   ③ r1 세 후보 전부 같은 방식(가상 회사 도메인 + 555 국번 전화)을 썼다 — 555 국번은 미국에서
   실제 배정되지 않는 예약 대역이라 실존 회선과 충돌할 위험이 없다.

2. **티어를 정확히 몇 개, 무엇으로 할지**
   ① 배정문은 "Guest / Verified buyer / Verified seller — or similar plausible tiers"라고만
   말해 예시였을 뿐 확정이 아니었다.
   ② 예시 세 개를 그대로 채택했다.
   ③ 셋은 리셀 마켓플레이스의 자연스러운 3분류(구매 이력 없음 / 결제·수령 확인됨 / 판매 활동 중)이고,
   더 늘리면(예: "파워셀러" 등급 분리) 배정 범위를 넘어 임의 확장이 된다.

3. **베이스라인 vs 티어 전용의 정확한 배분**
   ① "기본값이 여전히 실링크를 보여야 하고, 셀렉터는 추가/재정렬/강조만 해야 한다"까지는 정했지
   몇 개가 항상 뜨고 몇 개가 티어 전용인지는 안 정했다.
   ② 항상-노출 2개(general support 이메일·전화) + 게스트 전용 1개 + 바이어 전용 1개 + 셀러 전용
   2개, 총 6채널로 확정했다.
   ③ 셀러에 2개(payouts·listing appeals)를 준 것은 배정문의 "verified sellers get a
   payout-issues direct line"을 문자 그대로 지키면서, 리셀 특유의 두 번째 마찰점(리스팅 정지 이의)도
   상용 지원 페이지에 흔히 있는 구성이라 판단해 넣었다.

4. **"응답 약속이 깨지는 조건"을 어떻게 정량화할지**
   ① r1 delta는 "약속이 깨지는 조건까지 같은 화면에서 드러나야 한다"고만 요구했고, 시계 장치 없이
   그걸 어떤 형식으로 낼지는 미정이었다.
   ② 채널마다 median reply·월간 처리량(고정 숫자)·`breaksWhen` 한 줄(주말 미운영·프로모 다음
   월요일 적체·페이아웃 라인 주말 미운영 등)을 `<dl>`로 병기했다.
   ③ r1 승자 c가 "우리가 하지 않는 일 3가지"를 인쇄해 조건을 명시한 것과 같은 정신을 시간 대신
   운영 조건(요일·이벤트)으로 옮겨 재현했다 — 시각 시뮬레이터를 만들지 않아야 하므로 조건을
   숫자가 아니라 문장으로 고정했다.

5. **셀렉터의 접근성 패턴**
   ① 배정문은 "세그먼트 컨트롤 또는 토글 그룹"이라고만 했지 구현 방식(커스텀 div+aria vs 네이티브
   폼 요소)은 정하지 않았다.
   ② `fieldset`/`legend` + 네이티브 `input[type=radio]` 3개(레이블로 시각 스타일링, sr-only 인풋)로
   구현했다.
   ③ 커스텀 `role="radiogroup"` div 조합보다 네이티브 라디오가 화살표 키 이동·스크린리더 그룹
   안내를 브라우저가 공짜로 제공해 브리프의 "키보드 전 경로 도달" 요구를 더 적은 코드로 만족한다.

6. **`dl` 안 아이콘 중첩 회피**
   ① curation-criteria가 기록한 L2 결함(아이콘이 `dt`/`dd`를 감싸면 axe `definition-list`가
   깨짐)을 피하되 시각적으로는 라벨과 값을 나란히 두고 싶었다 — 정확한 마크업 형태는 브리프에
   없다.
   ② `dl > div > (dt, dd)` 평탄 구조를 그대로 쓰고 아이콘은 `dl` 바깥(카드 헤더)에만 배치했다.
   ③ 2026-08-02 `auto-product-detail-r1/c`·`auto-paywall-r1/c`에서 두 번 재현된 정본 학습을
   직접 적용.

7. **디스플레이 서체·액센트 색**
   ① 이번 라운드 다양성 제약은 grotesk만 금지했고 wide/mono 중 선택과 액센트 색은 자유였다.
   ② `--font-display-wide`(Archivo Display) + blue를 선택했다.
   ③ r1 세 후보가 각각 grotesk/mono/wide를 썼고 이번 라운드 금지는 grotesk뿐이라, r1-b가 이미
   쓴 mono 대신 wide를 골라 같은 3라운드 창 안에서 서체 반복을 추가로 줄였다. blue는 인증/신뢰
   배지에 흔히 쓰이는 색이라 "Verified" 티어 개념과 의미적으로 붙는다는 것이 근거이자, 최근
  라운드 액센트 목록에 없어 다양성 제약과도 무충돌.
