# native/ — 멀티플랫폼 진화 루프 S0: Expo 단일 타깃 PoC

**S0 실현성 게이트 판정: ✅ 통과**

react-native-web(Expo Web)이 이 저장소 환경(Node 22 / npm 10, Mac + 클라우드 무관)에서 생성 → 타입체크 → 렌더 → 갤러리 iframe 미리보기까지 전부 성립함을 실증했다. 스택 재선택(Flutter web 등) escalate는 발생하지 않았다.

관련 문서: `docs/superpowers/specs/2026-07-21-native-loop-s0-expo-poc-design.md`(설계) · `docs/superpowers/plans/2026-07-21-native-loop-s0-expo-poc.md`(5태스크 계획) · `.superpowers/sdd/task-1~5-report.md`(태스크별 실행 기록).

---

## 검증 4단계 — 종합 재실행 실측 (2026-07-22)

기존 웹 루프(dev 서버 3100)와 무관하게 독립 재현. 4단계 전부 1차 시도에서 통과.

### 1) 툴체인 (Expo 워크스페이스 성립)

```bash
cd native && npx tsc --noEmit
```
```
exit=0
```

```bash
cd native && node -e "require.resolve('react-native-web'); require.resolve('expo'); console.log('deps OK')"
```
```
deps OK
```

### 2) 타입체크 (repick DNA PoC 화면 포함)

`native/src/data.ts`(결정론적 더미 4건) + `native/src/MatchList.tsx`(RN 관용구 화면) + `native/App.tsx`를 포함한 전체 트리에서 동일 `npx tsc --noEmit` — **exit=0**, 위 1)과 같은 실행으로 통합 확인됨(Task2 산출물이 이미 트리에 존재).

### 3) Expo Web 서빙 + 렌더 실증

```bash
cd native && npx expo export --platform web --output-dir dist
```
```
Web Bundled 73ms index.ts (1 module)
› web bundles (1): _expo/static/js/web/index-d4fa24a5c69ea3d1d3ec7992ebebf7cf.js (417KB)
› Files (3): favicon.ico (15KB), index.html (1.2KB), metadata.json (49B)
Exported: dist
```

```bash
cd native && (npx serve dist -l 8091 &)
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8091/
```
```
200
```

Playwright 렌더 실증(루트 `node_modules/playwright` 재사용):
```
TEXT_HAS_HEADING: true | TEXT_HAS_CARD: true
```
빈 화면이 아니라 "AI 매칭 결과" 헤딩 + 4개 매칭 카드(등급 배지·점수·가격)가 실제로 렌더됨.

### 4) iframe 미리보기 (갤러리 재사용 검증)

```bash
node native/scripts/iframe-check.mjs http://localhost:8091/
```
```
IFRAME_LOADED: true | RENDERS_HEADING: true
exit=0
```

갤러리 `WorkCard`와 동일 구조(`<iframe src="Expo Web URL">`)로 로드했을 때 iframe 내부에 실제 텍스트가 렌더됨 — 기존 웹 갤러리의 iframe 미리보기 경로가 재설계 없이 네이티브(Expo) 타깃에도 성립한다.

검증 종료 후 `lsof -ti :8091 | xargs -r kill`로 서버 정리, 포트 clear 확인.

---

## 재현 명령 (전체)

```bash
# 0. 설치 (최초 1회)
cd native && npm install

# 1. 타입체크
npx tsc --noEmit

# 2. 정적 웹 export
npx expo export --platform web --output-dir dist

# 3. 정적 서빙 (8091 — Next dev 서버 3100과 충돌 회피)
(npx serve dist -l 8091 &)
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8091/   # → 200

# 4. 렌더 실증 (Playwright, 루트 node_modules 재사용)
node -e "
const {chromium}=require('/Users/yss/개발/build/repick-design/node_modules/playwright');
(async()=>{
  const b=await chromium.launch();
  const p=await b.newPage();
  await p.goto('http://localhost:8091/',{waitUntil:'load'});
  await p.waitForTimeout(1500);
  const t=await p.evaluate(()=>document.body.innerText);
  await b.close();
  console.log('TEXT_HAS_HEADING:', t.includes('AI 매칭 결과'), '| TEXT_HAS_CARD:', t.includes('Contax'));
})()
"

# 5. iframe 미리보기 검증
node native/scripts/iframe-check.mjs http://localhost:8091/

# 6. 정리 (필수)
lsof -ti :8091 | xargs -r kill
```

상세 단계별 대안(dev 서버 폴백 등)은 `native/scripts/serve-web.md` 참조.

## 클라우드 병행 가능성

검증 4단계 전부 **Node(npm 패키지)만 요구** — Xcode·iOS 시뮬레이터·Mac 특이 의존성이 없다. `npx tsc`, `npx expo export --platform web`, `npx serve`, Playwright(headless chromium)는 Linux 클라우드 샌드박스에서도 동일하게 동작한다. 즉 S0 성공은 곧 "네이티브(Expo Web 한정) 무인 라운드가 클라우드에서도 가능하다"는 근거가 된다 — Mac 의존은 iOS 시뮬레이터 실렌더·실기기 빌드(.ipa) 단계에만 있으며 이 두 단계는 S0 비범위다.

---

## S1 인계 — designer가 이 화면 구조를 자동 생성하려면 필요한 것

S1(생성 계층 일반화: designer가 타깃별 코드 생성)의 입력으로, 이번 PoC(`native/src/data.ts` + `native/src/MatchList.tsx` + `native/App.tsx`)에서 관찰된 요구사항:

1. **RN 관용구 카탈로그** — 웹 코드(JSX/div/Tailwind)를 그대로 옮기면 안 됨. designer가 알아야 할 최소 컴포넌트 매핑:
   - `View`(div 대응, flex 기본), `Text`(모든 텍스트는 반드시 `Text`로 감싸야 함 — 웹처럼 순수 텍스트 노드 불가), `Pressable`(버튼/클릭 영역), `FlatList`(리스트 — `.map()` 대신 가상화 리스트 필요), `SafeAreaView`(최상위 래퍼)
   - 인라인 스타일(`style={{...}}`) 대신 `StyleSheet.create()` 사용 — 웹의 className 관용구와 다른 스타일링 모델

2. **repick DNA → RN StyleSheet 토큰 매핑** — 이번 PoC가 실증한 값 그대로 재사용 가능:
   - 배경 순백 `#ffffff`, 단일 액센트 `#4f46e5`(indigo-600), 텍스트 계조 `#18181b`/`#27272a`/`#52525b`/`#71717a`, 테두리 `#e4e4e7`
   - 이모지 금지, `fontWeight`/`letterSpacing`/`lineHeight`로 타이포그래피 위계 표현(웹의 font-size 유틸리티 클래스 대응)
   - 이 매핑을 **RN 토큰 파일**(예: `native/src/tokens.ts`)로 명시 추출해두면 designer가 매 생성마다 색상값을 재추론하지 않고 import해서 씀 — 웹 루프의 디자인 시스템 토큰 파일과 동일한 역할

3. **접근성 관용구** — 웹의 `aria-*`가 아니라 `accessibilityRole`/`accessibilityLabel` prop. designer가 생성 시 이 매핑 규칙(`role="button"` → `accessibilityRole="button"` 등)을 알아야 함.

4. **결정론적 더미 데이터 규칙** — `Math.random()`/`Date.now()` 금지(웹 루프 conventions와 동일 원칙, RN에서도 유지 확인됨).

5. **검증 훅 (자동 생성 후 게이트)** — S1이 생성한 코드를 게이트에 걸려면 이번에 실증된 4개 훅을 그대로 재사용 가능:
   - `cd native && npx tsc --noEmit` (컴파일 게이트)
   - `npx expo export --platform web --output-dir dist` (빌드 게이트)
   - 8091 서빙 + curl 200 + Playwright 텍스트 검사(`document.body.innerText` 포함 여부) (렌더 게이트)
   - `native/scripts/iframe-check.mjs` (갤러리 미리보기 통합 게이트)
   - 이 4개를 스크립트화(예: `native/scripts/validate.sh`)해두면 S2(검증 게이트 재설계)에서 타깃별 분기(웹 vs 네이티브)의 네이티브 분기 구현이 이미 준비됨.

6. **비범위로 남는 것 (S1이 아직 안 다뤄도 됨)**: NativeWind 채택 여부(이번 PoC는 순수 `StyleSheet` — 결정 보류), iOS 시뮬레이터 실렌더, 카탈로그 192색/98UX 패턴의 RN 대응표(S5).

---

## 배포 무영향 (S0)

`native/`는 Vercel 프로젝트 rootDirectory(`app`) 밖에 위치 — Vercel 빌드는 `app/`만 참조하므로 이 커밋은 프로덕션 빌드에 관여하지 않는다. push 후 `https://repick-design.vercel.app/` 200 유지를 실측 확인함(본 태스크 보고서 참조).

---

# S1: designer 온디맨드 네이티브 생성 (2026-07-22)

**S1 판정: ✅ 통과**

바로 위 "S1 인계" 절이 요구한 5개 항목(RN 관용구·토큰·접근성·결정론·검증훅)을 전부 구현하고, designer 에이전트가 그 입력만으로 MatchList와 다른 도메인(관심목록/watchlist)의 새 RN 화면을 실제로 설계·생성해 4게이트를 1회 dispatch로 통과시켰다 — "생성 계층이 화면 하나에 특화되지 않고 일반화됨"의 증명.

## S1 산출물 3종 + 각 역할

| 파일 | 역할 |
|---|---|
| `native/src/tokens.ts` | repick DNA(색·간격·radius)를 RN `StyleSheet` 값으로 추출한 단일 소스. designer가 매 생성마다 색상값을 재추론하지 않고 import해서 참조(웹 루프 디자인 토큰 파일의 네이티브 대응) |
| `native/GENERATION.md` | designer가 네이티브 화면을 생성할 때 따르는 규약 문서(RN 관용구 금지 목록·토큰 사용 강제·DNA 절제 원칙·접근성 매핑·결정론 규칙·산출 구조·검증 명령) — 웹 `dash-brief-v3`의 네이티브 대응 |
| `native/scripts/validate.sh` | 생성 후 게이트 4종(tsc→expo export→serve+Playwright 렌더→iframe) 단일 스크립트화. `validate.sh "<검사 문자열>"` 형태로 화면 무관 재사용 가능 |

## designer 생성 화면 — watchlist가 MatchList와 무엇이 다른가

designer가 복붙이 아닌 새 도메인 설계를 수행했음을 보이는 차이(Task 4 실행 기록 기준):

| 항목 | MatchList (기존) | WatchList (신규, designer 생성) |
|---|---|---|
| 카드 축 | 세로 스택(등급배지+점수 → 제목 → 가격) | 가로 2컬럼(좌: 정보 블록 / 우: 알림 컬럼), `flexDirection: row` |
| 데이터 표현 | 단일 가격 | 원가↔현재가 취소선 비교(`textDecorationLine: line-through`) |
| 배지 의미 | 항상 액센트인 등급 배지 | 조건부 가격변동 배지 — 인하만 액센트 채움(`badgeDrop`), 인상/변동없음은 절제된 아웃라인(`badgeQuiet`) |
| 인터랙션 | 카드 전체 1개 Pressable | 2개 sibling Pressable — 정보영역(`role=button`) + 알림 스위치(`role=switch`), button-in-button 회피 |
| 상태 | 무상태 | 로컬 상태 스위치(`useState`, `AlertToggle`) — 초기값은 결정론 고정값(`item.alertOn`) |
| 데이터 계약 | `Match{grade, price, score}` | `WatchItem{original, current, alertOn}` + 순수함수 `formatKRW`/`priceChange` |

파일: `native/src/watchlist/WatchList.tsx`(152줄) · `native/src/watchlist/data.ts`(36줄) · `native/App.tsx`(WatchList 렌더로 배선, 2줄).

## 종합 재검증 (본 태스크, 2026-07-22 재실행)

### 1) 현재 렌더 화면(WatchList) — `validate.sh` 4게이트

```
$ bash native/scripts/validate.sh "관심목록"; echo "EXIT=$?"
[1/4] tsc
[2/4] expo export (web)
[3/4] serve + render
render OK
[4/4] iframe
IFRAME_LOADED: true | RENDERS_HEADING: true
✅ validate 4/4 통과
EXIT=0
```

App.tsx를 손대지 않고 재실행한 결과 여전히 4/4 — designer 산출물(watchlist)이 회귀하지 않았다.

### 2) tokens 회귀(MatchList) — App.tsx 비변경 격리 확인

Task 1에서 이미 확인된 MatchList 회귀를 App.tsx를 건드리지 않는 별도 절차로 재확인: App.tsx를 임시로 `MatchList` 렌더로 바꿔 대체 포트(8093)에서 export·서빙·Playwright 검사 후 `git checkout -- native/App.tsx`로 즉시 원복(diff 0 확인).

```
tsc_exit=0
export_exit=0
http=200
HEADING: true | CARD: true
```

`git status --porcelain native/` → 빈 출력(원복 확인). tokens.ts 참조로 리팩터된 MatchList가 여전히 정상 렌더됨 — 두 화면(MatchList·WatchList) 모두 동일 tokens.ts 위에서 회귀 없음.

**종합 판정: 두 재검증 모두 1차 시도 통과 → S1 = ✅ 통과.** (하나라도 실패 시 이 절을 S1=❌로 갱신하고 escalate하는 것이 원래 계획이었으나 해당 경로는 발생하지 않았다.)

## S2 인계

- `native/scripts/validate.sh`의 4게이트(tsc·export·serve+render·iframe)를 **웹↔네이티브 타깃 분기의 네이티브 브랜치**로 그대로 흡수한다 — S2는 "타깃이 웹이면 기존 웹 게이트, 네이티브면 이 스크립트"로 분기하는 상위 검증 레이어만 설계하면 된다(게이트 내부 재구현 불필요).
- `native/scripts/iframe-check.mjs`의 이식성(루트 `node_modules`를 `createRequire`로 상대 해석)은 Task 3에서 이미 해결됨 — S2가 별도 경로 문제를 안 다뤄도 됨.
- S4(자율 라운드)가 타깃 분기 시 호출할 단일 진입점은 `bash native/scripts/validate.sh "<렌더 검사 문자열>"` — 인자 1개(검사 문자열)만 받으면 되므로 자율 루프의 화면별 오케스트레이션과 자연 결합.
- 비범위로 남는 것(S1 이후에도 미해결): NativeWind 채택 여부, iOS 시뮬레이터 실렌더/실기기 빌드, 카탈로그 192색/98UX 패턴의 RN 대응표(S5).

## 배포 무영향 (S1)

`native/scripts/validate.sh`·`GENERATION.md`·`native/src/watchlist/*`·README 갱신 전부 `native/` 내부 — Vercel rootDirectory(`app`) 밖. push 후 `https://repick-design.vercel.app/` 200 유지 및 `git diff d38dfcb..HEAD --stat -- app/ vault/` 빈 출력(웹 루프 diff 0)으로 이중 확인(본 태스크 보고서 참조).

## S2 — 게이트 디스패처 (2026-07-22)

단일 디스패처 `scripts/gate.mjs`가 웹·네이티브 검증을 공통 판정 JSON으로 통일한다.

- 공통 계약: `{ target, pass, gates:[{name,pass,detail}], violations }` + exit 0/1.
- 웹: `node scripts/gate.mjs --target web --routes /dash/d29` (dev 서버 3100 전제) — dash-static-check·dash-sweep·Lighthouse 정규화.
- 네이티브: `node scripts/gate.mjs --target native --screens watchlist match` — 화면별 `EXPO_PUBLIC_SCREEN`+검사문자열로 validate.sh 실행, `GATE_STEP:*:ok` 마커 정규화.
- 화면 추가: `native/screens.json`(검사문자열) + `native/src/screens.ts`(컴포넌트) 두 곳에 slug 등록.
- S1 이월 해소: M1(복수 화면 게이트=EXPO_PUBLIC_SCREEN 스위처)·#3(검사문자열 env 전달)·공통 계약.
- 비범위: SKILL HARD GATE의 gate.mjs 채택·ledger·타깃 선택 = S4. 갤러리 통합 = S3.
