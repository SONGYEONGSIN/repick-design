# auto-native-r20 · candidate b — Link Payout Method

**Concept summary:** a one-time, seller-facing setup screen for linking a bank account before any
payout can ever happen — a routing-number field (validated with a real ABA checksum, not just a
digit count), an account-number field (validated against a real valid digit range), and a required
micro-deposit authorization checkbox, gated by a genuine blocked-workflow fixed bottom band; once
all three resolve the band becomes the real "Link account" submit action, and after submission the
band freezes into a static confirmation while the scroll body swaps the editable form for a locked
account summary plus a real, deterministic 4-stop verification timeline ("Day 0" → "Day 3", fixed
relative labels, never a calendar date). This is the antecedent step to both `wallet` (which shows
a ledger of transactions that can't exist yet) and `payout` (which withdraws an available balance
that can't exist yet) — this screen never shows a balance or a transaction and never lets money
move; it only proves an account is real.

**Check string** (exact visible heading text, always rendered): `Link a payout method`

**Files:**
- `/home/user/repick-design/native/src/evolve/r20/b/LinkPayoutMethodScreen.tsx`
- `/home/user/repick-design/native/src/evolve/r20/b/data.ts`

## 브리프에 없던 것

1. **① 결정할 것:** 브리프는 "bank account or card"라고 했지만 실제로 어느 쪽을(혹은 둘 다) 이 화면에서 다룰지는 지정하지 않음.
   **② 결정:** 은행 계좌(라우팅 넘버 + 계좌번호) 연결만 구현. 카드 연결(PAN·유효기간·CVV)은 화면 하단 풋터 문구("Adding a debit card instead isn't part of this step")로만 존재를 언급하고 실제 필드는 만들지 않음.
   **③ 근거:** 브리프 자체가 "routing number field, account number field" 두 개만 명시적으로 요구했고, 카드 필드까지 얹으면 완전히 다른 검증 로직(Luhn 체크, 만료일)이 추가되어 화면 하나가 두 개의 서로 다른 상태기계를 떠안게 된다. 과제 지침의 "Focus tightly on that scope only"를 그대로 따라 계좌 연결 하나에만 집중하고, 카드 옵션은 존재를 숨기지 않되(어포던스를 완전히 지우면 화면이 자기 한계를 못 보여준다는 GENERATION.md §4 원칙과 같은 맥락) 실제 동작은 만들지 않는 각주로 남김.

2. **① 결정할 것:** 라우팅 넘버·계좌번호의 "고정 유효 길이"를 정확히 어떻게 검증할지 — 브리프는 "fixed valid length"라고만 말함.
   **② 결정:** 라우팅 넘버는 정확히 9자리 + 실제 ABA 체크섬(3,7,1 가중치 반복, 합이 10의 배수)까지 검증하는 순수함수(`isValidRoutingNumber`)로 구현. 계좌번호는 은행마다 길이가 달라 "하나의 고정 길이"가 실제로는 존재하지 않으므로, 4~17자리라는 고정 유효 "범위"로 검증(`isValidAccountNumber`).
   **③ 근거:** 자릿수만 세는 것은 장식적 검증이다 — ABA 체크섬은 실제 은행 연결 폼이 서버 왕복 전에 클라이언트에서 돌리는 진짜 검사이고, 오탈자(자리 바뀜 등)까지 걸러낸다. `condition/ConditionAssessmentScreen.tsx`의 `computeGrade`처럼 "장식이 아닌 실제 함수"라는 밴드-폼 원칙을 라우팅 검증에도 그대로 적용했다. 계좌번호는 실제 미국 ACH 관행상 은행마다 길이가 다르므로 "고정 길이 하나"보다 "고정 범위"가 더 정직한 모델이라 판단해 브리프의 "fixed valid length"를 "고정된 유효 범위"로 해석했다.

3. **① 결정할 것:** 체크박스만 남았을 때(라우팅·계좌는 이미 유효) 밴드를 눌렀을 때 "그 지점으로 이동"을 어떻게 시각화할지 — 텍스트 인풋과 달리 체크박스는 `.focus()`할 대상이 없음.
   **② 결정:** 리스트를 맨 위로 스크롤한 뒤 체크박스 행에 `highlightField === "authorize"` 상태로 액센트 보더(`authRowFlagged`)를 씌우고, 사용자가 실제로 체크하거나 다른 필드로 포커스가 이동하면 즉시 해제.
   **③ 근거:** 라우팅·계좌 필드는 실제 `TextInput.focus()`로 "이동"을 구현할 수 있지만 체크박스엔 그런 개념이 없다 — 그렇다고 아무것도 안 하면 밴드가 "실제로 그 지점으로 이동시킨다"는 DNA §3 요구를 체크박스 케이스에서만 못 지키게 된다. 시각적 하이라이트로 같은 원리(진짜 상태기계, 눌리면 실제 미해결 지점을 가리킴)를 다른 구현으로 만족시켰다 — `verification`/`disputes`류의 아코디언 펼침이나 `condition`의 `scrollToIndex` 보더 하이라이트와 원리는 같지만, 이 화면은 아코디언도 `FlatList` 카드 목록도 아니라 폼 필드 3개뿐이라 그 둘의 구체적 구현을 그대로 가져올 자리가 없었고, 상태명(`highlightField`)·해제 조건·스타일 키(`authRowFlagged`) 모두 이 화면에서 새로 지었다.

4. **① 결정할 것:** 밴드의 상태별 스타일 키 이름과 문구 — 브리프가 명시적으로 "기존 화면의 `bandBlocked`/`bandReady`/`bandDone`이나 'Tap to go there'류 문구를 재사용하지 말라"고 지정했으므로 완전히 새 어휘가 필요했음.
   **② 결정:** 밴드 자체를 `linkStrip`으로, 세 상태를 `linkStripUnresolved`(막힘) / `linkStripArmed`(제출 가능) / `linkStripConfirmed`(제출 완료, 정적)로 명명. 이동 유도 문구는 "Tap to go there" 대신 "Opens that field below"로, 준비 상태 부제는 "Starts micro-deposit verification"으로 이 화면 도메인에서 새로 작성.
   **③ 근거:** GENERATION.md §3의 2026-09-12 조항이 정확히 이 문제(형태는 같아도 코드 표면·문구가 겹치면 재탕으로 읽힘, `r18/c`가 그 반증 사례)를 지목하고 있어, 형태(막힌 워크플로 상태기계)는 그대로 쓰되 이름·문구는 전부 이 화면의 도메인(계좌 연결)에서 독자적으로 지었다.

5. **① 결정할 것:** 제출 후 사용자가 라우팅·계좌 값을 다시 바꿀 수 있어야 하는지 — 브리프는 "submission, followed by a … pending-verification state"까지만 말하고 재수정 시나리오는 언급 안 함.
   **② 결정:** 제출 후에는 입력 필드 자체를 잠그고(`lockedCard`로 대체 렌더, 계좌번호는 `maskAccountNumber`로 마스킹 표시) 재수정 경로를 아예 만들지 않음.
   **③ 근거:** 이 화면은 "1회성 설정 플로우"라는 브리프 정의 자체가 재수정을 전제하지 않고, 실제 은행 연결도 검증 중에는 계좌를 바꾸면 이미 발송된 마이크로 디포짓과 불일치가 생긴다 — 그래서 `listing/ListingCreateScreen.tsx`의 "재선택 시 confirmed 리셋" 패턴과 달리(그 화면은 재평가가 실제로 의미 있는 도메인), 여기서는 잠그는 쪽이 도메인에 더 정직하다고 판단했다. 재수정을 지원하려면 "이미 발송된 디포짓은 어떻게 되는가"라는 브리프에 없는 새 규칙을 또 발명해야 했을 것이라 범위를 좁혔다.

6. **① 결정할 것:** 대기 화면에 보여줄 타임라인의 구체적 단계 구성과 문구 — 브리프는 예시 하나("micro-deposit verification, 2 business days")만 주고 전체 타임라인 형태는 지정하지 않음.
   **② 결정:** 4단계 고정 타임라인(제출 완료 → 디포짓 발송 → 금액 확인 → 페이아웃 활성화)을 상대적 영업일 라벨("Day 0"/"Day 1–2"/"Day 2"/"Day 3")로만 표기하고 실제 달러 금액이나 날짜는 절대 쓰지 않음("under $1.00"이라는 범위 표현만 사용).
   **③ 근거:** 결정론 규칙(§5)이 진짜 날짜·난수를 금지하므로, 상대적 영업일 라벨만 써서 "오늘이 언제든" 항상 같은 화면이 재현되게 했다. `order-status/OrderTrackingScreen.tsx`의 실제 배송 타임라인(연속 레일+원)과는 시각적으로도 다르게(카드형 + 좌측 보더 색상, 레일 없음) 만들어 같은 "타임라인" 카테고리 안에서도 구조적으로 겹치지 않게 했다.
