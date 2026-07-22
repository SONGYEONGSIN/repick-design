# S4b — native 타깃 라운드 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** dash-evolve 자율 루프에 native를 3번째 균등 타깃으로 추가해, native 라운드가 RN 후보 3개 생성 → `gate.mjs --target native` 검증 → 모바일 judge → ledger 승자 기록까지 무인 실행되게 한다.

**Architecture:** 두 파일 편집(`app/src/lib/works.ts` target 유니온 1줄, `.claude/skills/dash-evolve/SKILL.md` native 분기) + native 스모크 라운드 1회로 end-to-end 실증. native 후보 코드·screens 레지스트리·ledger entry는 스모크 라운드가 런타임 생성(throwaway 브랜치 — main 병합 대상 아님). gate.mjs·native 정본(GENERATION.md·tokens.ts) 무변경.

**Tech Stack:** Markdown(SKILL.md), TypeScript(works.ts), `scripts/gate.mjs`(S2, 무수정), Expo Web(react-native-web, 8091), designer/comparator 에이전트, Next.js(3100/build).

## Global Constraints

- **native 라운드 = 실행만**: 생성→게이트→판정→ledger 승자 기록. **§5 LEARN·§6 정제 게이트는 native 스킵(S4c)**.
- **후보 등록**: evolve/dash 브랜치의 `native/src/evolve/r<N>/{a,b,c}/` + `native/screens.ts`(import + `COMPONENTS["evolve-r<N>-<v>"]`)·`native/screens.json`(`"evolve-r<N>-<v>":{"check":"<검사문자열>"}`). main은 watchlist/match만.
- **타깃 선택**: `RANDOM%3` — dash/landing/native 균등. native 시퀀스 `auto-native-r<N>` 독립.
- **후보 수 3**(웹 파리티). native 게이트 = `node scripts/gate.mjs --target native --screens evolve-r<N>-a evolve-r<N>-b evolve-r<N>-c`(3100 dev 서버 불요).
- **gate.mjs·native 정본 무변경**. jsonl append-only. main 커밋 금지(라운드는 evolve/dash). 정본 2개·`/dash`·`/v1~v5` 미수정.
- **한국어 커밋 + conventional 접두사**, Co-Authored-By 등 푸터 없음.
- native ledger hardgate = `{tsc, export, render, iframe}` 4키(웹은 `{static,sweep,lighthouse}` 유지 — 타깃별 상이 허용).

---

### Task 1: works.ts target 유니온에 native 추가

**Files:**
- Modify: `app/src/lib/works.ts` (line 10 부근 `target?` 타입)

**Interfaces:**
- Produces: `Work.target` 타입 = `"dash" | "landing" | "native"`. native ledger entry가 유입돼도 타입 정합(evolveWorks는 웹 라우트 디렉토리만 스캔 — native entry 무해).

- [ ] **Step 1: 현재 타입 확인**

Run: `grep -n 'target?' app/src/lib/works.ts`
Expected: `10:  target?: "dash" | "landing";` (줄번호는 다를 수 있음)

- [ ] **Step 2: 유니온 확장**

`app/src/lib/works.ts`에서 아래 old를 new로 교체.

old:
```ts
  target?: "dash" | "landing";
```
new:
```ts
  target?: "dash" | "landing" | "native";
```

- [ ] **Step 3: 빌드 회귀 확인**

Run: `cd app && npx next build 2>&1 | tail -8`
Expected: 빌드 성공(`✓ Compiled` / `Generating static pages` 완료, 에러 0). 타입 확장이라 기존 `"dash"`/`"landing"` 사용처 불변.

- [ ] **Step 4: 단위 테스트 불변 확인**

Run: `npm test 2>&1 | grep -E "# (tests|pass|fail)"`
Expected: `# pass 44 / # fail 0` (works.ts는 evolve-status 테스트와 무관 — 회귀 없음).

- [ ] **Step 5: 커밋**

```bash
git add app/src/lib/works.ts
git commit -m "feat(gallery): works.ts target 유니온에 native 추가(S4b 타입 정합)"
```

---

### Task 2: dash-evolve SKILL native 타깃 분기

**Files:**
- Modify: `.claude/skills/dash-evolve/SKILL.md` (§0 선택, 파라미터 표 뒤 native 블록, §2/§3/§4 native 서브불릿, §5·§6 native 스킵, §7 native ledger)

**Interfaces:**
- Consumes: `scripts/gate.mjs --target native --screens <slugs>`(S2), `native/GENERATION.md`·`native/src/tokens.ts`(S1 정본), `native/screens.{ts,json}`(S2 레지스트리), `newRun`(design-loop.mjs, target-제네릭).
- Produces: SKILL prose에 native 3번째 타깃(런타임 에이전트가 소비). 함수 인터페이스 없음.

- [ ] **Step 0: 현재 SKILL 구조 확인 (편집 전 필수)**

Run: `grep -n 'RANDOM % 2\|## 타깃 파라미터\|## 2. GENERATE\|## 3. HARD GATE\|## 4. JUDGE\|## 5. LEARN\|## 6. 지식 정제\|## 7. 기록\|auto-ledger append' .claude/skills/dash-evolve/SKILL.md`
Expected: 각 앵커의 현재 줄번호 출력. 아래 old 문자열이 실제와 일치하는지 대조 후 편집(불일치 시 실제 텍스트에 맞춰 조정).

- [ ] **Step 1: §0 타깃 선택을 RANDOM%3으로**

old:
```
- **타깃 무작위 결정**: `TARGET=$([ $((RANDOM % 2)) -eq 0 ] && echo dash || echo landing)` — 결과는 ledger에 기록되므로 재현성은 ledger가 담보 (후보 코드의 결정론 규칙과 무관한 오케스트레이션 난수).
```
new:
```
- **타깃 무작위 결정**: `TARGET=$(case $((RANDOM % 3)) in 0) echo dash;; 1) echo landing;; 2) echo native;; esac)` — dash/landing/native 균등. 결과는 ledger에 기록되므로 재현성은 ledger가 담보 (후보 코드의 결정론 규칙과 무관한 오케스트레이션 난수).
```

- [ ] **Step 2: 파라미터 표 바로 뒤에 native 블록 추가**

파라미터 표 다음(현재 `> URL 라우트 = ROUTES에서 …` 줄) **바로 앞**에 아래 블록을 삽입. (앵커: `> URL 라우트 =` 줄을 찾아 그 앞에 삽입.)

```markdown
### native 타깃 파라미터 (RN 라운드 — 웹과 구조 상이)

native는 웹 라우트가 아니라 RN 화면이라 아래 규약을 따른다. **§5 LEARN·§6 정제 게이트는 native에서 건너뛴다(S4c 전까지 승자 기록까지만).**

| 변수 | native |
|---|---|
| BRIEF | `native/GENERATION.md`(7절) + `native/src/tokens.ts`(DNA 토큰) — 읽기 전용 정본 |
| DELTAS | N/A (S4c) |
| ROUTES(코드) | `native/src/evolve/r<N>/{a,b,c}/` |
| 등록 | 각 후보를 `native/screens.ts`(import + `COMPONENTS["evolve-r<N>-<v>"] = <컴포넌트>`)·`native/screens.json`(`"evolve-r<N>-<v>": {"check": "<화면 대표 헤딩 텍스트>"}`)에 등재 (evolve/dash에만 — main 무변경) |
| 게이트 slug | `evolve-r<N>-a evolve-r<N>-b evolve-r<N>-c` |
| 중복 금지 | 기존 native 화면(watchlist/match) + native-evolve 누적 화면유형 |
| judge 렌즈 | 1=DNA 준수(GENERATION.md·tokens) / 2=모바일 앱 완성도(iOS·Android 관용구·네이티브급) / 3=화면유형 차별성 |
| 에셋·인터랙션 | RN 관용구(Pressable·FlatList·SafeAreaView) + 모바일 인터랙션(제스처·상태 전환). 이모지 금지·결정론 유지 |
```

- [ ] **Step 3: §2 GENERATE에 native 서브불릿 추가**

§2의 마지막 bullet(`- 각 후보의 한 줄 컨셉을 …candidates/<v>.md에 기록.`) **뒤에** 아래를 추가.

```markdown
- **native의 경우**: designer 3개는 `native/GENERATION.md` + `native/src/tokens.ts`를 입력받아 서로 다른 RN 화면을 `native/src/evolve/r<N>/<v>/`에 생성(웹 라우트 아님). 생성 후 각 후보를 native 블록의 "등록" 규약대로 `native/screens.ts`·`native/screens.json`에 slug `evolve-r<N>-<v>`로 등재한다. check 문자열 = 화면 대표 헤딩(예: "관심목록").
```

- [ ] **Step 4: §3 HARD GATE에 native 서브불릿 추가**

§3의 마지막 bullet(`- 각 후보 verdict.gates를 …SCORES.md에 표로 기록.`) **뒤에** 아래를 추가.

```markdown
- **native의 경우**: 3100 dev 서버 불요(gate.mjs native 브랜치가 Expo Web 8091을 자체 export·serve). `node scripts/gate.mjs --target native --screens evolve-r<N>-a evolve-r<N>-b evolve-r<N>-c` → verdict(후보×4게이트 `<slug>/<tsc|export|render|iframe>`). `pass:false`면 `verdict.violations`(screen/step 태그)를 해당 후보 designer에 1회 수정 후 재호출. 화면별 4단계 전부 pass여야 그 후보 생존.
```

- [ ] **Step 5: §4 JUDGE에 native 서브불릿 추가**

§4의 스크린샷 bullet(`- 스크린샷: 후보별 4폭 캡처 …`) **뒤에** 아래를 추가.

```markdown
- **native의 경우**: 후보별 Expo Web 모바일 렌더 스크린샷 — `cd native && EXPO_PUBLIC_SCREEN=evolve-r<N>-<v> npx expo export --platform web --output-dir dist --clear` → `npx serve dist -l 8091` → `npx playwright screenshot --viewport-size=<w>,844 http://localhost:8091/ vault/20-generations/<run>/shots/<v>-<w>.png` (w ∈ 390, 768 모바일·태블릿폭, 데스크톱 폭 대신). judge 렌즈는 native 블록 표(DNA/모바일 완성도/화면유형 차별)를 따른다. 집계·기권·no-winner 규칙은 웹과 동일.
```

- [ ] **Step 6: §5·§6 native 스킵 명시**

§5 헤더(`## 5. LEARN — 격리 적재`) 바로 아래 첫 줄로 아래를 삽입.

```markdown
> **native 타깃은 §5·§6을 건너뛴다** (S4c 전까지 delta 미추출·정제 미수행 — 승자 기록까지만). 이하 §5·§6은 dash/landing에만 적용.
```

- [ ] **Step 7: §7 ledger에 native hardgate 형태 추가**

§7의 auto-ledger bullet(`- auto-ledger append: …refuted:null}` → `vault/30-ledger/auto-ledger.jsonl`. **hardgate 3키는…요약.`) **뒤에** 아래를 추가.

```markdown
- **native의 경우** ledger entry의 `hardgate`는 4키 `{tsc:'...', export:'...', render:'...', iframe:'...'}` (웹의 static/sweep/lighthouse 대신) — §3 후보별 verdict.gates(후보×4단계)에서 소싱. 나머지 필드(target:'native', round:'auto-native-r<N>', winner/no_winner/judges/refuted)는 동일 스키마.
```

- [ ] **Step 8: SKILL 자기정합 확인**

Run: `grep -n 'RANDOM % 3\|native 타깃 파라미터\|evolve-r<N>\|--target native\|native 타깃은 §5·§6\|hardgate.*tsc' .claude/skills/dash-evolve/SKILL.md`
Expected: §0(RANDOM%3)·native 블록·§2/§3/§4 native 서브불릿·§5 스킵·§7 native hardgate가 전부 존재. 라우트/슬러그 표기(`native/src/evolve/r<N>/`·`evolve-r<N>-<v>`)가 블록·서브불릿 간 일관.

- [ ] **Step 9: 변경 범위 확인 + 커밋**

```bash
git diff --stat -- . ':!docs' ':!.superpowers'
```
Expected: `.claude/skills/dash-evolve/SKILL.md` 단독(scripts/app/vault 없음).

```bash
git add .claude/skills/dash-evolve/SKILL.md
git commit -m "feat(dash-evolve): native를 3번째 타깃으로 추가(RANDOM%3·RN 생성·gate --target native·모바일 judge, §5·§6 스킵)"
```

---

### Task 3: native 스모크 라운드 — end-to-end 무인 실행 실증

Task 2의 native 분기가 실제로 도는지 throwaway 브랜치에서 1회 완주해 증명한다. **이 태스크의 산출물(후보 코드·screens 등재·ledger entry)은 main 병합 대상이 아니다** — 메커니즘 증명만. 컨트롤러가 designer/comparator 서브에이전트를 오케스트레이션한다(중첩 위임 회피 위해 SDD 구현자에 위임하지 말고 컨트롤러 직접 실행 권장).

**Files:**
- (런타임 생성, throwaway 브랜치) `native/src/evolve/r1/{a,b,c}/`, `native/screens.{ts,json}` 편집, `vault/20-generations/<run>/`, `vault/30-ledger/auto-ledger.jsonl` 1줄.

**Interfaces:**
- Consumes: Task 2의 SKILL native 분기, `scripts/gate.mjs --target native`, designer/comparator 에이전트.

- [ ] **Step 1: 스모크 브랜치 준비**

```bash
git checkout -b smoke/native-r1   # feature 브랜치(Task1·2 반영본) 위에서
```
(이 브랜치는 증명 후 폐기 — main 미병합.)

- [ ] **Step 2: §2 GENERATE — designer 3개로 RN 후보 생성**

designer(또는 frontend-design-specialist) 3개를 병렬 dispatch. 각 입력: `native/GENERATION.md` 전문 + `native/src/tokens.ts` + 서로 다른 화면유형(watchlist/match와 다른 것 — 예: 알림센터/판매등록/프로필) + 산출 경로 `native/src/evolve/r1/<v>/`.
Expected: `native/src/evolve/r1/{a,b,c}/`에 RN 화면 파일 생성(각기 다른 도메인·구조).

- [ ] **Step 3: 후보 등재 (screens.ts + screens.json)**

각 후보를 `native/screens.ts`(import + `COMPONENTS["evolve-r1-a"]=…` 등 3개)·`native/screens.json`(`"evolve-r1-a":{"check":"<헤딩>"}` 등 3개)에 등재.
Run: `cd native && npx tsc --noEmit && echo TSC_OK`
Expected: `TSC_OK` (등재 후 타입 정합).

- [ ] **Step 4: §3 GATE — gate.mjs --target native**

```bash
node scripts/gate.mjs --target native --screens evolve-r1-a evolve-r1-b evolve-r1-c
echo "exit=$?"
```
Expected: verdict JSON `{"target":"native","pass":…,"gates":[12개 — 후보 3 × tsc/export/render/iframe],"violations":[…]}`. `pass:false`인 후보는 violations를 해당 designer에 1회 수정 후 재호출. 최종 생존 후보(≥1) 확인. (모든 후보 탈락이면 스모크 재생성 — 메커니즘은 gate 실행·판정이 동작함으로 이미 증명.)

- [ ] **Step 5: §4 JUDGE — 모바일 스크린샷 + 3렌즈**

생존 후보별 모바일 스크린샷:
```bash
for v in a b c; do
  ( cd native && EXPO_PUBLIC_SCREEN=evolve-r1-$v npx expo export --platform web --output-dir dist --clear >/dev/null 2>&1 )
  ( cd native && npx serve dist -l 8091 >/dev/null 2>&1 & ); sleep 3
  npx playwright screenshot --viewport-size=390,844 http://localhost:8091/ vault/20-generations/<run>/shots/$v-390.png
  lsof -ti :8091 | xargs -r kill
done
```
comparator 3개 병렬 dispatch(블라인드 — 스크린샷 + `native/src/evolve/r1/<v>/` 소스, 렌즈=DNA/모바일완성도/화면차별). 1위 다수결 집계.
Expected: 승자 1개(또는 no-winner 표 2+ 시 no-winner). `vault/20-generations/<run>/DECISION.md` 기록.

- [ ] **Step 6: §7 ledger entry 기록 + 스키마 검증**

```bash
node -e "import('./scripts/design-loop.mjs').then(m=>m.appendLedger({target:'native',round:'auto-native-r1',date:'<오늘>',winner:'<v>'|null,no_winner:<bool>,hardgate:{tsc:'...',export:'...',render:'...',iframe:'...'},judges:{lens1:'<v>',lens2:'<v>',lens3:'<v>'},refuted:null},'vault/30-ledger/auto-ledger.jsonl'))"
node -e "const l=require('fs').readFileSync('vault/30-ledger/auto-ledger.jsonl','utf8').trim().split('\n').pop(); const e=JSON.parse(l); console.log('target',e.target==='native','hardgate키',Object.keys(e.hardgate).join('/'), 'round',e.round)"
```
Expected: 마지막 줄 = native entry, `target native true`, `hardgate키 tsc/export/render/iframe`, `round auto-native-r1`. **end-to-end 실증 완료.**

- [ ] **Step 7: 스모크 정리 (throwaway 폐기)**

```bash
# 증명 완료 — 후보 코드·ledger·screens 편집은 main 병합 대상 아님
git checkout .   # 스모크 변경 폐기 (또는 브랜치째 폐기)
git checkout <feature-branch>
git branch -D smoke/native-r1
```
(evolve/dash에 실 라운드로 남길지는 별도 판단 — S4b 병합엔 불포함.)

---

## Self-Review

- **Spec coverage**: §3 RANDOM%3(spec §3)→T2S1 · native 파라미터 표(spec §4)→T2S2 · §2 GENERATE native(spec §5)→T2S3 · §3 GATE native(spec §6)→T2S4 · §4 JUDGE native(spec §7)→T2S5 · §5·§6 스킵(spec §8)→T2S6 · §7 native ledger(spec §8)→T2S7 · works.ts union(spec §9)→T1 · 스모크 라운드(spec §10.1)→T3 · gate.mjs 무변경(spec §10.3)→T2S9 diff · build/test 회귀(spec §10.4)→T1S3/S4. 전 요구 매핑됨.
- **Placeholder scan**: 편집별 old/new·명령·기대출력 구체. `<N>`·`<v>`·`<run>`·`<오늘>`은 런타임 치환자(SKILL prose 관례 — 스모크 T3에서 r1 등 구체값). TBD/TODO 없음.
- **Type consistency**: gate --target native verdict(후보×4 gates, `<slug>/<step>`)·slug `evolve-r<N>-<v>`·native hardgate 4키(tsc/export/render/iframe)가 T2·T3 전반 일관. works.ts union `"dash"|"landing"|"native"`(T1) — evolve-status 미참조(spec §9) 정합.
- **실행 모드 주의**: T3(스모크)는 컨트롤러가 designer/comparator를 오케스트레이션 — SDD 구현자 위임 시 중첩 위임 발생. Inline 실행 권장(핸드오프에서 안내).
