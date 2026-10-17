# Saved Addresses — candidate c

A flat list of a buyer's on-file shipping addresses, where every address card carries its
own complete lifecycle instead of deferring anything to shared screen chrome: a row shows
plain address text with a "Set as Default" button (or, if it already holds that status, a
non-interactive "Default" pill with a hand-drawn checkmark glyph — derived live from which
row's `isDefault` flag is true, not fixed to list position), and a "Remove" button that,
on tap, swaps that row's own action strip in place for an inline Keep/Remove confirmation
pair rather than opening a system `Alert`. A row currently cited by an in-transit order
can never reach that confirmation at all — its Remove control is disabled and a specific
locked-reason line sits under the card citing the real order id. Because nothing here
needs to be gated or confirmed at the whole-screen level, the screen has no fixed bottom
band: the `FlatList` scrolls edge to edge under a plain header, and all of the interesting
state — default status, confirmation, lock — lives per-row.

## 브리프에 없던 것

1. **삭제된 주소가 기본 배송지였을 때 무슨 일이 일어나는가**
   브리프는 "Set as Default"가 기본값을 바꾸는 별도 액션이라고만 했지, 기본 주소를 지웠을 때
   남은 목록에 기본 주소가 전혀 없는 상태를 허용할지는 말하지 않았다. 결정: 삭제된 주소가
   기본값이었고 다른 주소가 남아 있다면, 남은 목록의 첫 번째 주소를 자동으로 새 기본값으로
   승격시킨다(`removeRow` 안의 재배정 로직). 근거: 결제 플로우에서 "기본 배송지 없음"은
   일반적으로 더 나쁜 상태(체크아웃에서 조용히 깨지거나 별도 빈 상태 UI가 필요함)이고, 은행
   계좌 라운드(r26)가 반대 방향 규칙("기본 계좌는 재지정 전까지 해지 불가")을 택한 것과 대비되는
   선택으로, 결제 주소는 해지 계좌보다 되돌리기 쉬운 자원이라 자동 재배정 쪽이 합리적이라고
   판단했다.

2. **확인 상태를 추적하는 자료구조 — nullable id 하나 vs Set**
   브리프는 "동시에 하나의 live region/alert만 떠 있어야 한다"는 결과만 요구했지, 그걸
   보장하는 상태 모양까지는 지정하지 않았다. 결정: `confirmingId: string | null` 단일 값을
   사용해 구조적으로 한 번에 한 행만 confirming 상태가 될 수 있게 했다(새 행에서 Remove를
   누르면 이전 행의 confirming을 명시적으로 지우지 않아도 자동으로 교체됨). 근거: r26의 같은
   패턴은 `Set<string>`을 써서 여러 행이 동시에 확인 상태가 될 수 있었는데, 이번 화면은
   "최대 하나만 활성"이라는 요구가 명시돼 있으므로 그 불변 조건을 타입 수준에서 강제하는 쪽이
   더 단순하고 버그 여지가 적다고 판단해 의도적으로 다른 구조를 택했다.

3. **잠금 행의 시각적 톤 — danger 대신 warning 팔레트**
   브리프는 잠긴 행에 "인라인 이유"를 보이라고만 했지 색 톤까지는 정하지 않았다. 결정: 잠금
   사유 박스는 `tokens.color.danger`(삭제 버튼과 같은 색)가 아니라 `tokens.color.warning` /
   `warningBg` / `warningBorder` 조합을 사용했다. 근거: 이 상태는 사용자의 실수가 아니라
   시스템이 거는 일시적 제약(배송 중)이라 "경고/안내"에 가깝지 "위험/파괴적 행동 임박"은
   아니라고 봤고, tokens.ts 주석에 이미 warning 조합이 AA 대비를 만족하도록 문서화돼 있어
   임의 회색 대신 이를 채택했다.

4. **아이콘 — 위치 핀 / 체크 / 주의 세 가지를 직접 그림**
   브리프는 "아이콘이 필요하면 react-native-svg로 직접 그려라"라고만 했지 어떤 아이콘을
   쓸지는 정하지 않았다. 결정: 카드 선두에 위치 핀(`LocationGlyph`), 기본 배지에 체크
   (`CheckGlyph`), 잠금 사유 옆에 주의 원(`CautionGlyph`) 세 개를 `Path`/`Circle` 조합으로
   새로 그렸다. 근거: 이모지·텍스트 글리프 금지가 명시돼 있고, 각 아이콘의 좌표·path 데이터는
   r26에서 본 어떤 뱃지 모양과도 겹치지 않게 처음부터 새로 작성해, 스타일 키뿐 아니라 그래픽
   자체도 중복되지 않게 했다.
