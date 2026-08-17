# DECISION — auto-native-r7

## 후보
- **a — Dispute & Return Center**: 반품/분쟁 접수·이력 화면. 과거 케이스 아코디언(수직 타임라인) + 진행 중 드래프트 카드(사유·서술·증거사진·해결방식) + 하단 상태기계 밴드(차단 사유 명시 → 미해결 항목 점프 → 제출 후 확정 표시).
- **b — Search Results**: 질의 기반 검색결과+필터. 순위 리스트(관련도 미터+"Matches" 토큰 병기) + 상단 고정 라이브 필터 스트립(제거가능 칩·정렬) + 스크롤형 상세 패싯 피커.
- **c — Price Alerts**: 가격/재입고 알림 설정 관리(규칙 화면 — watchlist의 일반 추적, notifications의 이벤트 히스토리와 구분). ±스텝퍼 임계값, 사이즈 라디오, 즉시반영 편집, 2단계 삭제 확인.

셋 다 기존 카탈로그(watchlist/match/detail/offer-thread/account/handoff/notifications/listing/order-status + evolve-r6 payouts/discover/seller-verification)에 없는 화면 유형으로 배정 — a는 세 후보 중 유일하게 진짜 종결액션(분쟁 제출)을 가짐.

## 하드게이트
`gate.mjs --target native --screens evolve-r7-a evolve-r7-b evolve-r7-c` 단일 호출로 12/12 전부 1차 통과(tsc·export·render·iframe × 3후보). 1-fix 불요.

**오케스트레이터 수동 확인**(게이트 미검사, `auto-native-r1` 델타): SafeAreaView 최상위 래핑 3후보 전원 확인(연속 4라운드째 무위반). ₩+tabular-nums 렌더링 아티팩트(L2 델타) — a·b는 tabular-nums를 ₩ 근처에서 아예 미사용(회피), c는 유일하게 사용하되 `WonText` 헬퍼가 델타가 요구하는 정확한 구조(₩ 심볼·숫자를 비-스타일 wrapper 아래 형제 Text로 분리)로 구현 — 소스 확인 완료. 상세: `SCORES.md`.

## JUDGE 패널 (3렌즈 병렬, 블라인드)

### 렌즈1 — DNA 준수: **a > c > b**
셋 다 기계적 규칙(SafeAreaView·토큰 색상·인라인 style 금지·영문전용·결정론 데이터·이모지 금지·a11y 라벨) 위반 없음. 순위는 두 핵심 축적 델타(상태기계 밴드·₩+tabular-nums)에 대한 관여 깊이로 갈림 — a는 유일하게 진짜 차단상태를 가져 `accessibilityRole="alert"`+`accessibilityLiveRegion="polite"` 승격을 실제로 시연(`DisputeCenterScreen.tsx:512,515,533`); c는 유일하게 tabular-nums를 ₩ 근처에서 실제 사용하며 올바른 형제-분리 구조로 정확히 해결(`PriceAlertsScreen.tsx:39-61,445-446,472-475`); b는 두 축 다 회피 전략(합법적이나 시연 없음)이라 3위.

### 렌즈2 — 모바일 완성도: **a > b > c**
a 1위: 3상태(차단/준비/완료) 밴드가 실제로 일하며(`:113-134,172-205,513-551`), 차단 사유가 구체적이고 눌리면 정확히 그 필드로 스크롤+하이라이트. 결함: multiline TextInput이 고정 밴드 위 스크롤 중간에 있는데 `KeyboardAvoidingView` 부재(3후보 중 유일하게 실제로 문제될 조합). b 2위: 관련도 미터+매치 이유+패싯 태그가 전부 실계산 기반(장식 아님), 고정 스트립이 "일하는 요소만" 정확히 선별; 다만 가격이 행에서 정보위계상 뒤로 밀림. c 3위: 터치타겟 44pt로 최다 준수, 목표가↔현재가 위계 명확, 2단계 삭제로 실수 방지; 다만 ₩5,000 스텝퍼가 최대 26탭 필요해 세 화면 중 가장 상용 완성도가 낮은 인터랙션.

### 렌즈3 — 화면유형 차별성: **b > c > a**
b 1위: Discover(r6-b, 2열 그리드+단일선택 스왑칩)와 명확히 구분되는 1열 순위 리스트+제거가능 다중칩+관련도 근거 표기 — 구조·인터랙션 모두 신규. c 2위: watchlist(단순 on/off 토글, 임계값 없음)·notifications(이벤트 피드)와 구분되는 규칙/설정 모델(스텝퍼·상태 자동재계산). a 3위(핵심 발견): 종결액션 도메인(분쟁/반품) 자체는 신규이나, 하단 상태기계 밴드의 **구현이 r6-c(Seller verification)와 사실상 구조적 재사용**에 가깝다 — 동일 3상태 이름(bandBlocked/bandReady/bandDone), 동일 jumpTo+scrollToIndex+onScrollToIndexFailed 폴백, 동일 아코디언-in-FlatList 셸, 동일 alert/liveRegion 승격 패턴이 스타일 블록 수준까지 유사(`DisputeCenterScreen.tsx:833-877` vs `SellerVerificationScreen.tsx:838-905`). 다만 이 재사용은 r3→r5→r6c로 이미 3라운드 재현되어 L2로 승격된 **문서화된 관용구**를 따른 것이지 즉흥 표절이 아니라는 완화 요인도 함께 기록.

## 집계 — 2-1 다수결
1위 표: 렌즈1=a, 렌즈2=a, 렌즈3=b → **a가 2표로 다수결 승리**. [[curation-criteria]] "차별성↔완성도 상충 시 완성도 다수결" 원칙과도 일치하는 형태(DNA준수+모바일완성도 이중다수 vs 화면유형차별성 단독) — `auto-dash-r13`·`auto-native-r4`·`auto-native-r5`에서 이미 3회 재현된 동일 tie-break 형태의 4번째 사례.

**→ 승자: a (Dispute & Return Center)**

렌즈3이 지적한 a의 밴드-구현 구조적 유사성은 승자 결함이 아니라(문서화된 관용구 재사용) LEARN/questions-queue 대상으로 별도 기록한다.

## 정제 조치 (판정 후 수정)
승자 a는 판정 전 결함 0건(하드게이트 1차 통과, 오케스트레이터 수동확인도 전 항목 통과) — 정제 조치 대상 아님.

## LEARN — delta 추출
상태기계 밴드 관용구(r3→r5→r6c, 기존 L2)가 4번째 라운드(r7/a)에서 **다른 도메인에 그대로 재적용**되며 처음으로 "재사용의 경계"가 시험대에 올랐다 — 렌즈3은 이를 구조적 재수렴(감점 사유)으로, 렌즈1·2는 관용구의 올바른 적용(가산 사유)으로 정반대로 해석했다. 두 해석 모두 같은 라운드의 같은 코드를 보고 나온 것이라 충돌이 아니라 **관점 차이**(differentiation 렌즈는 재사용 자체를, compliance/polish 렌즈는 재사용의 정확성을 잰다)로 판단 — 다만 이 경계(언제부터 "관용구 준수"가 "구조 표절"로 읽히는가)는 정본에 없어 questions-queue로 올린다.

## 판정 커버리지 (자진 신고 종합)
- 렌즈1: 라이브 DOM 미검사(스크린샷+소스 판독만), a의 접힌 상태 카드 일부 텍스트(refundLabel) 미확인.
- 렌즈2: 시뮬레이터 미실행(키보드 가림 이슈는 코드 추론), 768px 외 중간폭 미검사.
- 렌즈3: order-status 타임라인과 a의 타임라인 구조 비교 미수행(잠재적 미확인 유사성), a/data.ts 직접 미독.
- 셋 다 확장 상태(b의 Refine 패널, c의 삭제확인, a의 제출후 상태)는 정적 프레임에 없어 소스 추론.

## 재개/기권
재개 0회, 기권 0회 — 3렌즈 전부 1회 디스패치로 4요건 완비.
