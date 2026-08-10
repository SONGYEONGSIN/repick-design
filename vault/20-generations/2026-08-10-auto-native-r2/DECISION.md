# DECISION — auto-native-r2

타깃: `native`, 2라운드째(`auto-native-r1`이 `offer-thread`로 승격되어 카탈로그에 이미 있음). 오늘(2026-08-10)이 월요일이라 스킬 §0의 "native 주기(주 1회 고정)" 규칙에 따라 이번 연속 실행의 **1라운드 목표가 native로 강제**됐다.

BRIEF: `native/GENERATION.md`(§1~§8) + `native/src/tokens.ts`. 참조 카탈로그: `vault/20-catalog/ux-guidelines.catalog.md`의 Native/Mobile 섹션 + `Plat=both` 행.

## 후보

기존 화면(watchlist·match·detail·offer-thread) + r1 비승자 아키타입(3단계 입력 위저드 `ListingComposer`, 단건 판정+상시 프로필 패널 `TasteCalibration`)과 겹치지 않는 3개 신규 화면유형을 배정했다.

- **a — Search & Discover** (`Discover`): 검색창 + 토글형 필터칩 행이 2열 가상화 그리드를 실시간으로 좁힌다. 축 = **질의 기반 탐색**. 매크로 골격: 고정 헤더+검색창+필터칩 행 → 단일 스크롤 그리드 (하단 바 없음)
- **b — Alerts Center** (`AlertsCenter`): 날짜별로 그룹된 알림(가격하락/AI매치/오퍼) 트리아지 피드. 카테고리 세그먼트 탭 + 행별 Mark read/Dismiss 즉시 액션. 축 = **알림 우선순위 분류**. 매크로 골격: 고정 헤더+탭 행 → 단일 스크롤 SectionList (하단 바 없음)
- **c — Account & Preferences** (`Preferences`): 알림·가격하락 임계값(%, 상한가)·계정 설정을 그룹별로 나열, 행별 즉시 적용(지연 저장 바 없음). 축 = **환경설정/문턱값 구성**. 매크로 골격: 프로필 카드 포함 전체가 **단일** SectionList — 고정 헤더도 하단 바도 없음

## 하드게이트

`node scripts/gate.mjs --target native --screens evolve-r2-a evolve-r2-b evolve-r2-c` → **12/12 전원 통과**(후보×4단계: tsc·export·render·iframe). 1-fix 루프 불요. 상세는 SCORES.md.

**판정 대상 해시**: `8f18f529fdd1a061efedba499122b5ea1647996e`(`cat native/src/evolve/r2/*/*.tsx native/src/evolve/r2/*/*.ts | shasum`) — 게이트 실행 전/후 동일함을 재확인해 동결 상태로 판정에 들어갔다.

**환경 메모**: 이 실행 환경의 샌드박스에 사전 설치된 chromium 빌드(리비전 1194)가 `node_modules`의 playwright-core(1.61.1)가 기대하는 리비전(1228)과 달라 CDN 다운로드가 프록시에서 차단됐다. `native/scripts/iframe-check.mjs`·`native/scripts/validate.sh`의 `chromium.launch()`에 `executablePath: process.env.PW_CHROMIUM_PATH` 오버라이드를 추가해 우회했다(게이트 판정 로직·기준 자체는 무변경). 스킬·정본 불변식 대상이 아닌 순수 환경 적응 조치.

## JUDGE 패널 (3렌즈, 블라인드 — X/Y/Z = c/a/b)

프레임: 후보당 2장(390px·768px — native 브랜치 규약, `Expo export --platform web` → serve 8091 → playwright screenshot).

### 렌즈1 — DNA 준수 (`GENERATION.md` §1~§7)
**1위 X(c) · 2위 Y(a) · 3위 Z(b).**

세 후보 모두 기계적 조항(SafeAreaView 최상위 래퍼·StyleSheet·hex 0건·영문 전용·이모지 0·결정론)을 통과했다 — r1의 SafeAreaView 델타가 **이번 라운드엔 재현되지 않았다**. 순위를 가른 것은 a11y 매핑 정확도. X(c)는 유일하게 진짜 on/off 설정 컨트롤을 갖고 있고 `accessibilityRole="switch"` + `accessibilityState`를 정확히 매핑(`Preferences.tsx:102-103`), 세그먼트 컨트롤엔 `radiogroup`/`radio`(`:132,139-140`)까지 위젯별로 구분했다. Z(b)는 콘텐츠가 가장 풍부하고 헤딩 커버리지도 최고이나, `AlertRow`의 바깥 `View`가 `accessible accessibilityLabel=...`로 감싸면서 그 안에 Mark read/Dismiss `Pressable` 2개를 포함한다(`AlertsCenter.tsx:71-75`, `:104-123`) — RN에서 `accessible=true`인 컨테이너는 하위 트리를 하나의 포커스 노드로 접어버려 중첩된 Pressable이 스크린리더 순차 탐색에서 안 잡힐 위험이 있다(Undo 배너에서도 동일 패턴 재현: `:230`+`:234-241`). 카탈로그의 네이티브 a11y 관용구 🔴 조항에 저촉되는 구조적 결함이라 콘텐츠 풍부함을 상쇄하고 3위로 내려갔다.

### 렌즈2 — 모바일 앱 완성도
**1위 X(c) · 2위 Z(b) · 3위 Y(a).**

X(c)는 모든 인터랙션이 실제 결과로 이어진다 — 토글/세그먼트/스테퍼 전부 인라인 "Applied/Updated" 태그로 즉시 확인되고(`:98,130,214`), sign-out은 2단계 확인→취소/확정의 진짜 종결 상태를 갖는다(`:231-291`). Z(b)는 트리아지 흐름 자체는 탄탄하나 상시 노출되는 카테고리 필터 탭이 `minHeight:36`에 `hitSlop` 없음(44pt 미달, `AlertsCenter.tsx:28-57`)과 섹션 "Mark all read"가 `minHeight:32`+4pt hitSlop=40pt로 역시 미달 — 둘 다 기본 상태에서 상시 발현. Y(a)는 **가장 심각한 결함**: 상품 카드 전체의 탭 영역이 `accessibilityRole="button"`과 "View details for..."를 약속하는 `accessibilityLabel`을 가진 `Pressable`인데 `onPress`가 없다(`Discover.tsx:40-44` — 파일 전체 5개 onPress 핸들러 중 카드 탭 영역은 없음). 카드는 시각적으로도, 접근성 트리 상으로도 클릭 가능해 보이지만 실제로는 죽어 있다 — "인터랙션처럼 보이는 요소는 실제로 동작해야 한다"는 렌즈 기준을 정면으로 위반.

### 렌즈3 — 화면유형 차별성
**1위 X(c) · 2위 Z(b) · 3위 Y(a).**

X(c)는 앱 역사를 통틀어 **고정/핀 크롬이 전혀 없는 유일한 화면**이다 — 타이틀부터 프로필 카드, 설정 섹션까지 전부 `SectionList` 하나에 들어가 함께 스크롤된다(`:319-376`). 기존 화면(watchlist·match)과 r2의 나머지 두 후보 전부 "고정 헤더 스택 + 단일 스크롤 리스트"라는 2밴드 골격을 공유하는데, X는 그 골격 자체를 없앴다. Z(b)는 콘텐츠(행별 이중 퀵액션·날짜 그룹·언두 배너)는 새롭지만 매크로 밴드 구조(고정 헤더+탭 행 → 단일 스크롤)는 watchlist/match와 동일 골격이다. Y(a)는 구조상 watchlist/match의 "고정 헤더 스택 + 단일 스크롤 리스트" 골격에 검색·필터를 더 얹은 변형이고, 카드의 핵심 액션(SAVE 토글)도 watchlist의 `AlertToggle`과 동일한 "이 아이템을 계속 추적한다" 의미를 재사용한다.

## 승자 — c (Account & Preferences)

1위 표: **c 3표(렌즈1·렌즈2·렌즈3) 만장일치** — tie-break 불요, no-winner 아님.

세 렌즈가 서로 다른 근거(a11y 매핑 정확도 / 인터랙션 완결성 / 매크로 골격 이탈)로 같은 결론에 도달했다는 점이 이례적이다 — [[curation-criteria]] "차별성 ↔ 완성도 상충 시 판정 방향"이 예상한 충돌(신규 아키타입 추구 후보가 완성도에서 밀리는 패턴)이 이번엔 발생하지 않았다: X는 신규 골격이면서 동시에 가장 완결됐다.

## 비승자 결함 기록 (참고, 재현 1회 — 승격 대상 아님)

- **Y(a) — 죽은 카드 탭 영역**: `Discover.tsx:40-44`의 카드 `Pressable`에 `onPress` 누락. 접근성 라벨은 상세 진입을 약속하나 실제 핸들러가 없어 시각적·의미적으로는 클릭 가능해 보이는데 아무 반응이 없다. r2는 승격 라운드가 아니고 Y는 승자가 아니므로 §3-1 정제 조치 대상이 아니다(규칙 위반이 아니라 미완성 인터랙션이라 판정 대상에서도 하드페일이 아니었다) — 기록만.
- **Z(b) — 중첩 Pressable을 접는 `accessible` 컨테이너**: `AlertsCenter.tsx:71-75`(행)·`:230`(언두 배너) 2곳에서 재현. 단일 라운드·단일 후보 내 2회 발생이라 L1 승격 임계(2 라운드+)엔 못 미치지만, 향후 유사 패턴이 다른 라운드에서 재현되면 delta로 승격 고려.

## 정제 게이트

- `native-deltas-provisional.jsonl` 전체 로드(2줄: r1 SafeAreaView 델타, r2 신규 델타). r1 델타는 **이번 라운드 재현되지 않음**(3후보 전원 SafeAreaView 준수) — L2 승격 보류, L1 유지.
- 충돌 쌍 없음. meta-기준 정당화 불가 항목 없음 — questions-queue 신규 항목 불요.

## 다양성 축

native는 `tokens.ts`가 배경·액센트를 고정(순백 라이트 + indigo 단일)하고 활자도 RN 기본이라, `catalog-variety.mjs`의 세 축(테마/액센트/활자) 중 어느 것도 native 후보를 구분하지 않는다 — r1과 동일한 구조. 이 타깃의 차별 축은 화면유형이며 렌즈3이 그 역할을 한다.
