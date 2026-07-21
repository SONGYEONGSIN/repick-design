# S0: Expo 단일 타깃 PoC (실현성 게이트) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `native/` Expo 워크스페이스에서 repick DNA를 쓴 RN 화면 1개를 `설치 → 타입체크 → Expo Web 서빙 → iframe 미리보기`까지 성립시켜, 네이티브 타깃이 진화 루프 기계장치에 물림을 증명(실현성 게이트).

**Architecture:** 레포 루트에 기존 `app/`(Next.js)와 분리된 `native/` Expo 프로젝트 신설. `react-native-web`로 RN 컴포넌트를 브라우저에 렌더 → localhost URL → 기존 갤러리 iframe 미리보기 경로 재사용. 전 단계 Node만 요구(Mac/시뮬레이터 불필요).

**Tech Stack:** Expo(~57), React Native, react-native-web, TypeScript, Node 22 / npm 10.

**Spec:** `docs/superpowers/specs/2026-07-21-native-loop-s0-expo-poc-design.md`

## Global Constraints

- **PoC = spike, 실현성 게이트**: 목표는 "성립하는가" 증명이지 프로덕션 품질이 아니다. 검증 4단계(설치·tsc·Expo Web 200·iframe) 통과가 완료 기준.
- **웹 루프 무변경**: `app/`·`vault/`·기존 스킬·프로덕션 건드리지 않는다. S0는 `native/` 신설 + 루트 `.gitignore` 한 줄만.
- repick DNA: 순백 라이트(흰/zinc-50 배경), near-monochrome + 극소량 단일 액센트, 이모지 금지. RN이라 Pretendard 강제는 비적용(시스템 폰트 허용 — S0 범위).
- 결정론: 더미 데이터에 `Math.random`/`Date.now` 금지(웹 루프 규칙 계승).
- dev 서버 포트: Next.js가 3100 점유하므로 **Expo Web은 다른 포트(8081 기본 또는 명시 지정)** — 충돌 금지.
- **중단 조건**: 어느 태스크든 근본적으로 불가(react-native-web가 이 환경에서 안 뜸 등)하면 즉시 STOP하고 스택 재선택 escalate — 억지로 우회하지 않는다.
- 커밋: conventional + 한국어 + `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>` 푸터. push는 Task 5(컨트롤러).

---

### Task 1: Expo 워크스페이스 부트스트랩 (툴체인 게이트)

**Files:**
- Create: `native/` (Expo 프로젝트 — package.json·app.json·tsconfig.json·app/ 등 Expo가 생성)
- Modify: `.gitignore` (native 산출물 무시)

**Interfaces:**
- Consumes: 없음.
- Produces: `native/`에서 `npm install`·`npx tsc --noEmit`·`npx expo`가 도는 환경. Task 2~4가 이 워크스페이스에서 작업.

- [ ] **Step 1: Expo 프로젝트 생성** — repo 루트에서:

Run: `npx create-expo-app@latest native --template blank-typescript --no-install`
Expected: `native/` 생성(package.json·app.json·App.tsx·tsconfig.json). `--no-install`로 의존성은 다음 스텝에서 명시 설치(네트워크 실패 분리 진단).

만약 `create-expo-app`이 이 환경에서 실패하면 → **STOP·escalate**(중단 조건: 툴체인 불가). 대체 시도 1회: `mkdir native && cd native && npm init -y && npm install expo` 후 `npx expo customize` — 그래도 안 되면 escalate.

- [ ] **Step 2: 의존성 설치 + web 지원 추가**

Run: `cd native && npm install`
그다음 Expo Web 렌더에 필요한 패키지: `npx expo install react-dom react-native-web @expo/metro-runtime`
Expected: `native/node_modules` 생성, 설치 에러 0. 실패 시 에러 전문 기록 후 escalate.

- [ ] **Step 3: .gitignore 갱신** — 루트 `.gitignore`에 추가(기존 `node_modules`·`app/node_modules` 아래):

```
native/node_modules
native/.expo
native/dist
native/web-build
```

- [ ] **Step 4: 툴체인 검증**

Run: `cd native && npx tsc --noEmit; echo "tsc exit=$?"`
Expected: `tsc exit=0` (Expo 템플릿 기본 App.tsx가 타입 클린).

Run: `cd native && node -e "require.resolve('react-native-web'); require.resolve('expo'); console.log('deps OK')"`
Expected: `deps OK`.

- [ ] **Step 5: 커밋**

```bash
git add native/ .gitignore
git commit -m "feat(native): Expo 워크스페이스 부트스트랩 — S0 툴체인 게이트

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

(주의: `native/node_modules`가 gitignore로 빠졌는지 `git status` 확인 — 커밋에 node_modules 포함 금지.)

---

### Task 2: repick DNA PoC 화면 작성

**Files:**
- Create: `native/src/MatchList.tsx` (PoC 화면 — RN 컴포넌트)
- Create: `native/src/data.ts` (결정론적 더미 데이터)
- Modify: `native/App.tsx` (MatchList 렌더)

**Interfaces:**
- Consumes: Task 1 워크스페이스.
- Produces: `App.tsx`가 렌더하는 `<MatchList/>` — Task 3의 Expo Web 서빙 대상. 데이터 export `MATCHES: Match[]`.

- [ ] **Step 1: 결정론적 데이터** — `native/src/data.ts`:

```ts
export type Match = { id: string; title: string; grade: string; price: string; score: number };

// 결정론적 더미 (Math.random/Date.now 금지)
export const MATCHES: Match[] = [
  { id: "m1", title: "빈티지 카메라 · Contax T2", grade: "S", price: "₩480,000", score: 96 },
  { id: "m2", title: "가죽 자켓 · Schott 618", grade: "A", price: "₩210,000", score: 91 },
  { id: "m3", title: "기계식 시계 · Seiko SARB", grade: "A", price: "₩175,000", score: 88 },
  { id: "m4", title: "러그 · 페르시안 나인 60x90", grade: "B", price: "₩95,000", score: 82 },
];
```

- [ ] **Step 2: PoC 화면** — `native/src/MatchList.tsx` (RN 관용구 + repick DNA: 순백·단일 액센트 indigo·이모지 없음):

```tsx
import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import { MATCHES, type Match } from "./data";

const ACCENT = "#4f46e5"; // 단일 액센트 (indigo-600)

function Card({ item }: { item: Match }) {
  return (
    <Pressable style={styles.card} accessibilityRole="button" accessibilityLabel={`${item.title}, 매칭 ${item.score}점`}>
      <View style={styles.cardHead}>
        <Text style={styles.grade}>{item.grade}</Text>
        <Text style={styles.score}>{item.score}</Text>
      </View>
      <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.price}>{item.price}</Text>
    </Pressable>
  );
}

export function MatchList() {
  return (
    <View style={styles.root}>
      <Text style={styles.h1} accessibilityRole="header">AI 매칭 결과</Text>
      <Text style={styles.sub}>RE:픽이 다시 고른 중고 — 오늘의 추천 {MATCHES.length}건</Text>
      <FlatList
        data={MATCHES}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => <Card item={item} />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#ffffff", paddingHorizontal: 20, paddingTop: 56 },
  h1: { fontSize: 28, fontWeight: "800", color: "#18181b", letterSpacing: -0.5 },
  sub: { marginTop: 6, fontSize: 13, color: "#71717a" },
  list: { paddingVertical: 20, gap: 12 },
  card: { borderWidth: 1, borderColor: "#e4e4e7", borderRadius: 12, padding: 16, backgroundColor: "#ffffff" },
  cardHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  grade: { fontSize: 12, fontWeight: "700", color: "#ffffff", backgroundColor: ACCENT, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, overflow: "hidden" },
  score: { fontSize: 20, fontWeight: "800", color: "#18181b", fontVariant: ["tabular-nums"] },
  title: { marginTop: 12, fontSize: 15, fontWeight: "600", color: "#27272a", lineHeight: 21 },
  price: { marginTop: 6, fontSize: 14, color: "#52525b", fontVariant: ["tabular-nums"] },
});
```

- [ ] **Step 3: App.tsx 교체** — `native/App.tsx`:

```tsx
import { SafeAreaView, StyleSheet } from "react-native";
import { MatchList } from "./src/MatchList";

export default function App() {
  return (
    <SafeAreaView style={styles.safe}>
      <MatchList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#ffffff" },
});
```

- [ ] **Step 4: 타입체크** — Run: `cd native && npx tsc --noEmit; echo "exit=$?"` / Expected: `exit=0`.

- [ ] **Step 5: 커밋**

```bash
git add native/src/ native/App.tsx
git commit -m "feat(native): repick DNA PoC 화면 — AI 매칭 결과 리스트

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Expo Web 서빙 + 렌더 실증

**Files:**
- Create: `native/scripts/serve-web.md` (재현 절차 — 명령·포트·검증)

**Interfaces:**
- Consumes: Task 2의 App.tsx/MatchList.
- Produces: PoC 화면이 뜨는 Expo Web URL(정적 export 또는 dev 서버). Task 4가 iframe으로 로드.

- [ ] **Step 1: 정적 웹 export 시도(가장 결정론적)** — Run: `cd native && npx expo export --platform web --output-dir dist 2>&1 | tail -8`
Expected: `dist/`에 정적 웹 번들 생성(index.html + `_expo`/static). 에러 시 다음 스텝(dev 서버)으로 폴백.

- [ ] **Step 2: 정적 서빙 + HTTP 200** — 포트 **8091**(Next 3100 회피)로 백그라운드 서빙: `cd native && (npx serve dist -l 8091 &)` 후:
`curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8091/`
Expected: `200`.

폴백(export 실패 시): `cd native && (npx expo start --web --port 8091 &)` 후 컴파일 대기하여 `curl ... http://localhost:8091/` 200 확인.

- [ ] **Step 3: 실제 렌더 확인(빈 화면 아님)** — playwright로 텍스트·카드 렌더 실측:
Run: `node -e "const {chromium}=require('/Users/yss/개발/build/repick-design/node_modules/playwright'); (async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('http://localhost:8091/',{waitUntil:'load'});await p.waitForTimeout(1500);const t=await p.evaluate(()=>document.body.innerText);await p.screenshot({path:'native/dist-render.png'});await b.close();console.log('TEXT_HAS_HEADING:', t.includes('AI 매칭 결과'), '| TEXT_HAS_CARD:', t.includes('Contax'));})()"`
Expected: `TEXT_HAS_HEADING: true | TEXT_HAS_CARD: true`. false면 렌더 실패 — react-native-web 문제 진단(중단 조건 후보).

- [ ] **Step 4: 재현 절차 문서화** — `native/scripts/serve-web.md`에 export·서빙·검증 명령 + 포트(8091) + 성공 기준을 기록(S1 입력).

- [ ] **Step 5: 커밋** (`dist/`는 gitignore — 문서만 커밋)

```bash
git add native/scripts/serve-web.md
git commit -m "feat(native): Expo Web 서빙·렌더 실증 절차 — 8091 정적 export

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: iframe 미리보기 경로 실증 (갤러리 재사용 검증)

**Files:**
- Create: `native/scripts/iframe-check.mjs` (Expo Web URL을 iframe으로 로드해 렌더 확인)

**Interfaces:**
- Consumes: Task 3의 Expo Web 서빙(8091).
- Produces: "기존 갤러리 iframe 미리보기 경로가 네이티브 타깃에도 성립"의 증거. S3(갤러리 통합)의 근거.

- [ ] **Step 1: iframe 로드 검증 스크립트** — `native/scripts/iframe-check.mjs` (갤러리 WorkCard가 하듯 iframe에 Expo Web URL을 넣고, iframe 내부가 실제 렌더되는지):

```js
import { chromium } from '/Users/yss/개발/build/repick-design/node_modules/playwright/index.js';

const EXPO_URL = process.argv[2] || 'http://localhost:8091/';
const b = await chromium.launch();
const p = await b.newPage();
// 갤러리 WorkCard와 동일 구조: iframe src=Expo Web URL
await p.setContent(`<iframe src="${EXPO_URL}" style="width:1440px;height:1100px;border:0" title="native preview"></iframe>`);
await p.waitForTimeout(2500);
const frame = p.frames().find((f) => f.url().startsWith(EXPO_URL));
const inner = frame ? await frame.evaluate(() => document.body.innerText) : '';
console.log('IFRAME_LOADED:', !!frame, '| RENDERS_HEADING:', inner.includes('AI 매칭 결과'));
await b.close();
process.exit(frame && inner.includes('AI 매칭 결과') ? 0 : 1);
```

- [ ] **Step 2: 서빙 확인 후 실행** — Expo Web(8091)이 떠 있는지 `curl -s -o /dev/null -w "%{http_code}" http://localhost:8091/` → 200 확인 후:
Run: `node native/scripts/iframe-check.mjs http://localhost:8091/; echo "exit=$?"`
Expected: `IFRAME_LOADED: true | RENDERS_HEADING: true` + `exit=0`. false면 iframe 경로가 네이티브에 안 통하는 것 — S3 재설계 신호(기록).

- [ ] **Step 3: 커밋**

```bash
git add native/scripts/iframe-check.mjs
git commit -m "feat(native): iframe 미리보기 경로 실증 — 갤러리 재사용 검증

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: S0 완료 판정 + README + push (컨트롤러 전용)

**Files:**
- Create: `native/README.md` (S0 결과 요약 + 4단계 재현 + S1 인계)

**Interfaces:**
- Consumes: Task 1~4 결과.
- Produces: S0 실현성 게이트 판정(통과/실패) 기록 + 다음 하위 프로젝트(S1) 인계 노트.

- [ ] **Step 1: 검증 4단계 종합 재실행** — 툴체인(Task1 Step4), tsc(Task2 Step4), Expo Web 200 + 렌더(Task3 Step2·3), iframe(Task4 Step2)을 순차 재실행해 전부 통과 확인. 하나라도 실패면 S0 = 실패, README에 실패 지점·원인 기록 후 사용자에게 스택 재선택 escalate.
- [ ] **Step 2: README 작성** — `native/README.md`에: S0 판정(✅/❌), 검증 4단계 실측 출력, 재현 명령(설치·tsc·export·serve·iframe), 클라우드 병행 가능성(Node만 요구 확인), **S1 인계**(designer가 이 화면 구조를 자동 생성하려면 필요한 것 — RN 관용구·StyleSheet 토큰·검증 훅).
- [ ] **Step 3: 커밋 + push**

```bash
git add native/README.md
git commit -m "docs(native): S0 실현성 게이트 판정 + S1 인계 노트

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
git push
```

- [ ] **Step 4: 배포 무영향 확인** — main push가 Vercel 프로덕션(웹)에 영향 없는지: `native/`는 Vercel rootDirectory(`app`) 밖이라 빌드 무관. `curl -s -o /dev/null -w "%{http_code}" https://repick-design.vercel.app/` → 200 유지 확인.

---

## Self-Review 결과

- **Spec coverage**: §3 아키텍처(native/ 신설·Expo Web·iframe 재사용)→Task 1~4, §4 검증 4단계(툴체인→Task1, tsc→Task2, Expo Web 200+렌더→Task3, iframe→Task4, 재현 문서→Task3/5)→전 태스크, §5 비범위(designer 자동생성·시뮬레이터·재배선·카탈로그 없음) 준수, §6 중단 조건(각 태스크 STOP·escalate 명시).
- **환경 반영**: Expo ~57 실측, Node 22/npm 10 확인, 포트 8091(Next 3100 회피), playwright는 루트 node_modules 재사용.
- **웹 루프 무변경**: `native/` 신설 + `.gitignore` 4줄만. app/·vault/·프로덕션 무변경(Task 5 Step 4가 프로덕션 무영향 확인).
