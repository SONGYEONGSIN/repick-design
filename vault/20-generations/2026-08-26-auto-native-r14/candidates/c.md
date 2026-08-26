check: "Wallet"

# auto-native-r14 후보 c — Wallet & Transaction History

**한 줄 컨셉**: 상단에 잔액 요약 카드(현재 잔액 + as-of 날짜 + payout 화면으로 가는 진입점 버튼)를 상시 고정 노출하고, 그 아래 FlatList 하나가 헤더(잔액 카드 + 타입 필터 칩 5개 + "N of M" 요약)와 거래 행 8~12건을 함께 스크롤시키는, 하단 밴드 없는 read-only 원장 화면.

## 브리프에 없던 것

**① ₩ 기호와 숫자 사이 간격 처리** — ② `formatWon()`이 `₩ 128,000`처럼 심볼과 숫자 사이에 고정 공백(선택지 ①)을 넣고, 부호(+/−)는 숫자가 아니라 ₩ 글자 앞에 붙여(`+₩ 128,000`) 숫자 조판이 깨지지 않게 했다 ③ `native/src/payout/data.ts`가 같은 통화·같은 저장소에서 이미 이 컨벤션으로 정착시켰고(GENERATION.md §1이 2026-08-24 정정으로 확정한 조항), 이 화면은 거래 금액이 핵심 데이터라 다른 선택지로 갈아탈 이유가 없어 그대로 재사용했다. **정본 컨벤션 재사용**

**② 입금/출금을 색이 아니라 부호+타입 라벨로 구분** — ② 모든 거래 행에 (a) "SALE/PAYOUT/REFUND/FEE" 대문자 타입 라벨, (b) 금액 앞의 명시적 "+"/"−" 부호, (c) 스크린리더용 접근성 라벨에서 "plus"/"minus"를 단어로 말하는 세 겹 표시를 넣었다. 색은 ink(진함)/ink2(약간 옅음) 두 near-monochrome 톤만 보조로 썼다 ③ 델타가 "입금/출금을 색만으로 구분하지 마세요"라고 명시했고, 이 화면 유형(원장)에서 부호 판독 오류는 실제 금전 오해로 이어지므로 색을 아예 accent 하나로 몰아 강조하지 않고 텍스트 3중 표시로 방어했다. **정본 규칙 직접 적용**

**③ "Withdraw" 버튼을 payout 화면으로 이동만 하는 무동작 진입점으로 둠** — ② 잔액 카드 우측에 `accessibilityRole="button"` + `accessibilityHint="Opens the payout screen..."`을 가진 Pressable을 두되, `onPress` 핸들러는 의도적으로 빈 함수로 남기고 코드 주석에 이유를 적었다 ③ 이 저장소의 화면들은 `screens.ts`가 쿼리 파라미터로 화면 하나씩 독립 렌더링하는 구조라 실제 네비게이션 스택이 없다(App.tsx 확인). `chat/ChatInbox.tsx`도 같은 이유로 "fake-navigation state"라는 자체 주석을 남기며 로컬 상태로 대체한 전례가 있지만, 여기서는 payout 화면 전체를 이 폴더 안에 복제하는 게 더 나쁜 선택(델타가 명시적으로 금지한 "이 화면이 출금 플로우를 담당하지 않음"을 어기게 됨)이라 판단해, 라벨·힌트로 목적을 명확히 밝힌 상태에서 무동작 진입점으로만 남겼다. **논증 정합 (제약 하 결정)**

**④ 필터 칩 5종(All/Sales/Payouts/Refunds/Fees) 모두가 실데이터를 갖도록 10건을 4:2:2:2 배분** — ② 결정론 더미 10건을 sale 4 / fee 2 / payout 2 / refund 2로 고정 배치해 어떤 필터를 눌러도 최소 2건이 남게 했다 ③ 델타의 핵심 인터랙션이 "필터로 좁히기"이므로, 필터를 눌렀을 때 매번 빈 화면이 뜨면 그 인터랙션 자체를 시연할 수 없다. 대신 `EmptyState` 컴포넌트는 만들어 두되(진짜 0건 상황을 위한 방어적 구현), 이번 결정론 데이터로는 도달하지 않는 코드 경로로 남겨뒀다 — UX 체크리스트의 "빈 상태 안내" 항목은 컴포넌트 존재로 충족시키고, 3렌즈의 "증명 지연 없는 필터" 요구는 데이터 배치로 충족시켰다. **논증 정합**

**⑤ 필터 전환 시 라이브 리전 문구를 화면에 항상 보이는 캡션으로 둠(숨김 트릭 없음)** — ② `accessibilityLiveRegion="polite"` 컨테이너 안의 `accessibilityRole="alert"` 텍스트를 `opacity:0`이나 `height:0` 같은 시각적 은닉 없이 "Showing N of M transactions — Sales" 형태로 필터 칩 바로 아래 그대로 노출했다 ③ 처음에는 시각적으로 숨긴 안내문을 시도했으나, `notifications/NotificationsScreen.tsx`의 "{unread} unread of {total}" 관용구가 이미 같은 정보를 사용자에게도 보이는 캡션으로 노출하고 있었고, 숨김 텍스트는 스크린리더 전용 트릭이라 이 저장소의 기존 관용구와 어긋난다고 판단해 시각 사용자에게도 유용한 보이는 캡션으로 통일했다(라이브 리전은 컨테이너 1곳, `alert`는 캡션 텍스트 1곳 — §4의 "리전 1쌍" 규칙 준수). **정본 관용구 재사용**

**⑥ 거래 행 하나를 개별 Text 여러 개가 아니라 `accessible` + 단일 `accessibilityLabel`로 그룹핑** — ② `TransactionRow`를 `View accessible accessibilityLabel="Sale, plus ₩128,000. Sold to minji_92. Nike Air Force 1 '07 — Size 260 · Order #S-10432. Aug 24, 2026."`처럼 한 문장으로 묶어, 스크린리더가 타입·부호·금액·상대방·상세·날짜를 행 하나로 순서대로 말하게 했다 ③ `notifications/NotificationsScreen.tsx`의 `NotificationRow`가 같은 패턴(행 전체를 한 문장으로 조합)을 쓰고 있어 저장소 관용구를 따랐고, 개별 자식 Text들을 낱개로 노출하면 VoiceOver/TalkBack이 스와이프 6~7번을 요구해 리스트 8~12건을 훑는 데 지나치게 느려진다고 판단했다. **정본 관용구 재사용**
