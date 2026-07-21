# native/ — 멀티플랫폼 진화 루프 S0: Expo 단일 타깃 PoC

**S0 실현성 게이트 판정: ✅ 통과**

react-native-web(Expo Web)이 이 저장소 환경(Node 22 / npm 10, Mac + 클라우드 무관)에서 생성 → 타입체크 → 렌더 → 갤러리 iframe 미리보기까지 전부 성립함을 실증했다. 스택 재선택(Flutter web 등) escalate는 발생하지 않았다.

관련 문서: `docs/superpowers/specs/2026-07-21-native-loop-s0-expo-poc-design.md`(설계) · `.claude/plans/2026-07-21-native-loop-s0-expo-poc.md`(5태스크 계획) · `.superpowers/sdd/task-1~5-report.md`(태스크별 실행 기록).

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

## 배포 무영향

`native/`는 Vercel 프로젝트 rootDirectory(`app`) 밖에 위치 — Vercel 빌드는 `app/`만 참조하므로 이 커밋은 프로덕션 빌드에 관여하지 않는다. push 후 `https://repick-design.vercel.app/` 200 유지를 실측 확인함(본 태스크 보고서 참조).
