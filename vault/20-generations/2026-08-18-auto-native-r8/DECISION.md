# DECISION — auto-native-r8

타깃: native · 후보: a(Seller Storefront) · b(Write a Review) · c(Checkout / Order Review)
소스 해시(판정 대상 동결): `fd15d31baf58e7121a98447feb7527ce8cf76907`
게이트: 12/12 1차 통과, 1-fix 루프 미발동 (`SCORES.md` 참조)
스크린샷: 390px·768px × 3후보 (native 블록 규약 — 데스크톱 폭 대신 모바일/태블릿 2폭)

## 렌즈 1 — DNA/스펙 준수: **b > c > a**
전 후보 하드 불변식(토큰만 사용·이모지 없음·결정론·tabular-nums 미사용) 동일 통과. 갈린 지점은 접근성 매핑 정밀도.
- b(1위): 모든 `accessibilityLabel`이 본질적으로 접근 가능한 프리미티브(`Pressable`/`TextInput`) 위에 있어 트리 붕괴 없음. 로딩→성공 전환에 `accessibilityRole="alert"`+`accessibilityLiveRegion="polite"` 정확 적용(`WriteReviewScreen.tsx:218`). 터치 타겟 전부 명시 44pt+.
- c(2위): 리스트 없는 화면에 FlatList를 안 쓴 것은 올바른 관용구 선택. 밴드 채택 근거가 파일 주석에 명시(`CheckoutScreen.tsx:21-24`). 단 `changeButton` `minHeight:32`(`:261-267`)가 44pt 미달, `hitSlop={8}`이 숫자 단축형이라 a/b의 객체형과 관용구 불일치(RN 0.86 호환성 미검증).
- a(3위): 접근성 매핑 결함 — `ListingCard`/`ReviewCard`가 `accessibilityLabel`을 단 `View`에 `accessible={true}` 없이 붙여(`SellerStorefrontScreen.tsx:53-56, 77-80`), 스크린리더가 통합 라벨 대신 중첩 `Text` 개별 낭독으로 빠질 위험.

## 렌즈 2 — 모바일 완성도: **b > a > c**
- b(1위): 별점·태그·텍스트·게이트드 제출 전부 실제 동작, 44pt+ 터치 타겟, disabled 이유 문장 상시 노출.
- a(2위): 탭 전환 실동작, 빈 썸네일 자리 우아한 벡터 플레이스홀더. 단 `ListingCard`/`ReviewCard`에 `onPress` 없음(`:51-73, 75-96`) — 카드 탭 시 상세로 이동하는 통상 동작 부재, 탭 버튼 `minHeight:40`, 768px에서 `numColumns={2}` 고정으로 태블릿 폭 활용 부족.
- c(3위, 실격급 결함): 화면의 유일한 종결 액션 "Place order"가 `noop`에 연결(`CheckoutScreen.tsx:25-28, 149-156`) — 눌러도 로딩·성공·에러·이동 무엇도 없음. `vault/20-catalog/ux-guidelines.catalog.md:68`(Forms, 🔴, Plat=both) "제출 피드백: 로딩→성공/에러 / ✗ 무반응"의 직접 위반. "Change" 두 곳도 noop(주석에서 의도적 명시)이지만, 지시문에서 명시 허용한 자리이고, 문제는 **화면의 존재 이유인 CTA 자체**가 같은 처리를 받은 것.

## 렌즈 3 — 화면유형 차별성: **a > b > c**
- a(1위): 프로필헤더+통계행+탭전환+이원 바디(그리드/리스트)가 기존 어떤 화면과도 다른 신규 매크로 조합. 밴드 생략도 정당(종결 액션 없음).
- b(2위): 헤더+요약카드+3단 인터랙티브 폼+인라인 게이트드 제출 — 신규 조합이나, 오프닝 킥커/타이틀/리드 관용구가 c와 구조적으로 동일해 c와의 차별성이 다소 약함.
- c(3위): 요약+정보블록×2+가격분해+고정CTA밴드는 이 도메인의 "기대되는 기본형"에 가장 가까운 형태 — 밴드 자체는 기존 3연승 상태기계 밴드의 "재사용(단순 변형)"이라 신규성 낮음(단, 상태기계를 억지로 넣지 않은 것은 올바른 판단).

## 집계
1위 표: b(렌즈1) · b(렌즈2) · a(렌즈3) → **2-1 다수결로 b 승** (Write a Review). no-winner 아님(2표 이상 no-winner 없음).

## 정제 조치
없음 — 규칙 위반 해소용 판정 후 수정 없음. c의 noop CTA 결함은 판정 순위에 반영된 채로 유지(카탈로그 미승격, 다음 라운드 재시도 대상).

## 판정 커버리지 자진 신고 (3렌즈 취합)
- 3렌즈 전원: 390px·768px만 확인, 다른 폭(태블릿 가로 등) 미확인. tokens.ts 값 자체는 사용처만 확인, 정의 자체는 미검증(렌즈1 예외 — 직접 확인).
- 3렌즈 전원: validate.sh/게이트 로그 직접 실행 미확인 — 소스+스크린샷 근거만으로 판정(오케스트레이터가 별도로 12/12 게이트 통과를 SCORES.md에 기록해 교차 확인됨).
- 렌즈1·2: b의 submitting/submitted 상태, a의 Reviews 탭 바디는 스크린샷에 없어 소스 로직만으로 정합성 판단(런타임 미검증).
- 렌즈3: 과거 라운드 손실 후보(Discover Listings 등)의 실제 소스는 미대조, 프롬프트가 제공한 한 줄 요약에만 근거.

## LEARN — 격리 delta (아래 참조)
승자(b)의 정합성 자체보다, 이 라운드가 새로 드러낸 재사용 가능 교훈은 c의 결함에서 나왔다 — no-op 자리 허용(placeholder)과 종결 CTA 무반응(결함)의 경계.
