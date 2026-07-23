# S3b — falsify native 킵/드롭 자동 승격 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 주간 dash-falsify apply가 native 승자를 permanent 화면으로 승격(evolve 후보 → `native/src/<name>/` + main screens 등재 + 스크린샷 복사 + `NATIVE_WORKS` append)하고 탈락은 드롭하도록, dash-falsify SKILL의 §4·open native 섹션을 확장한다.

**Architecture:** dash-falsify SKILL(prose) 편집만 — §4 apply에 native 킵/드롭 메커니즘(웹 keep 병렬), open §2 native 섹션에 후보 킵/드롭 노출, S4c의 "미지원(S3)" 노트 3곳 제거. 검증은 실행 코드가 없어(SKILL prose) throwaway 브랜치에서 스모크 승자 a 승격을 실제 시연.

**Tech Stack:** Markdown(dash-falsify SKILL), git mv, `native/screens.{ts,json}`, `scripts/gate.mjs`(무변경), Next build. 승격 실행자 = falsify 에이전트(웹과 동일 prose 실행).

## Global Constraints

- **승격 화면 naming = semantic 폴더명**(watchlist/match 관례 — 승자 도메인 도출, 예 알림센터→`notifications`).
- **native 킵 = 4요소**: `git mv native/src/evolve/r<N>/<v> native/src/<name>/` + main `native/screens.{ts,json}` 등재(evolve 슬러그 제거) + `shots/<v>-390.png`→`app/public/native/<name>.png` + `NATIVE_WORKS` append(+LAST_UPDATED).
- **native 드롭**: `native/src/evolve/r<N>/<v>` 삭제 + evolve 슬러그 screens.{ts,json} 제거.
- **레지스트리 소진 불변식**: 한 라운드 evolve 슬러그(`evolve-r<N>-{a,b,c}`)는 falsify 후 전부 소진(승격/드롭) — evolve/dash screens 무한 축적 방지.
- **웹 falsify 무영향**: dash/landing 킵/드롭·delta·질문 경로 diff 0. gate.mjs·dash-evolve·native 정본 무변경.
- **변경 = `.claude/skills/dash-falsify/SKILL.md` 단독**(dry-run 산출물은 미병합). `npm test` 44/44. **한국어 커밋 + conventional 접두사, 푸터 없음.**

---

### Task 1: dash-falsify SKILL — native 킵/드롭 + open native 후보 노출

**Files:**
- Modify: `.claude/skills/dash-falsify/SKILL.md` (open §2 native bullet, open 리뷰 방법, apply §4 native 메커니즘)

**Interfaces:**
- Consumes: `native/screens.{ts,json}`, `native/src/evolve/`, `app/public/native/`, `works.ts NATIVE_WORKS`, `vault/20-generations/<run>/shots/`.
- Produces: 주간 falsify가 native 승자를 permanent 화면+갤러리로 승격(에이전트 prose 실행).

- [ ] **Step 0: 현재 native 노트 위치 확인**

Run: `grep -n '후보 킵/드롭 제안은 생략(S3)\|후보 킵/드롭 미지원\|네이티브 후보 킵/드롭은 미지원(S3)' .claude/skills/dash-falsify/SKILL.md`
Expected: 3곳(open §2 native bullet · open 리뷰 방법 · apply §4)의 줄번호 출력. 아래 old 문자열과 대조.

- [ ] **Step 1: open §2 native bullet — 후보 킵/드롭 노출**

old:
```
   - `## 네이티브`: 위와 동형 — 라운드 표(`auto-native-r*`), L3 delta 편입 제안(`vault/00-principles/native-deltas-provisional.jsonl`의 최신 level=L3 & status=provisional), L1/L2 잔류, DECISION.md 링크 + 스크린샷 경로(`shots/<v>-390.png` 모바일). **네이티브는 delta·질문만 반증 대상 — 후보 킵/드롭 제안은 생략(S3)**.
```
new:
```
   - `## 네이티브`: 위와 동형 — 라운드 표(`auto-native-r*`, 후보별 status 승자/탈락/대기), L3 delta 편입 제안(`vault/00-principles/native-deltas-provisional.jsonl`의 최신 level=L3 & status=provisional), L1/L2 잔류, DECISION.md 링크 + 스크린샷 경로(`shots/<v>-390.png` 모바일). delta·질문·**후보 킵/드롭** 전부 반증 대상.
```

- [ ] **Step 2: open 리뷰 방법 — native 제외 문구 제거**

old:
```
   - `## 리뷰 방법`: "후보 킵/드롭·delta 승인/기각·질문 답변을 PR 코멘트로 남기고 로컬에서 /dash-falsify apply 실행 (네이티브는 delta 승인/기각·질문만 — 후보 킵/드롭 미지원)".
```
new:
```
   - `## 리뷰 방법`: "후보 킵/드롭·delta 승인/기각·질문 답변을 PR 코멘트로 남기고 로컬에서 /dash-falsify apply 실행".
```

- [ ] **Step 3: apply §4 — native 킵/드롭 메커니즘으로 교체**

§4 끝의 native "미지원(S3)" 노트(아래 old)를 native 메커니즘(new)으로 교체.

old:
```
 **네이티브 후보 킵/드롭은 미지원(S3) — native 라운드는 delta·질문만 반영하고 후보 디렉토리(`native/src/evolve/`)는 evolve/dash에 유지.**
```
new:
```
 **native 킵**: `git mv native/src/evolve/r<N>/<v> native/src/<name>/`(`<name>`=semantic 폴더명 — watchlist/match 관례, 승자 도메인 도출) + `native/screens.ts`(import + `COMPONENTS["<name>"]`)·`native/screens.json`(`"<name>":{"check":"<검사문자열>"}`)에 permanent 슬러그 등재(이동한 evolve 슬러그 `evolve-r<N>-<v>` 등록은 제거) + `vault/20-generations/<run>/shots/<v>-390.png`→`app/public/native/<name>.png` 복사 + `NATIVE_WORKS`에 `{id:'n<다음>', route:'/native/<name>.png', brand:'<한글명>', desc:'…(auto-native-r<N> 승자)', target:'native', image:'/native/<name>.png', status:'winner', round:'auto-native-r<N>', previewH:420}` append(+ `works.ts` `LAST_UPDATED` 오늘 날짜). **native 드롭**: `native/src/evolve/r<N>/<v>` 삭제 + evolve 슬러그를 `native/screens.{ts,json}`에서 제거. 한 라운드 evolve 슬러그(`evolve-r<N>-{a,b,c}`)는 승격/드롭으로 **전부 소진**(evolve/dash screens 무한 축적 방지).
```

- [ ] **Step 4: 자기정합 + 회귀**

```bash
grep -c '후보 킵/드롭 제안은 생략(S3)\|후보 킵/드롭 미지원\|네이티브 후보 킵/드롭은 미지원(S3)' .claude/skills/dash-falsify/SKILL.md
grep -c 'native 킵.*git mv native/src/evolve\|native 드롭.*삭제\|전부 소진' .claude/skills/dash-falsify/SKILL.md
git diff --stat -- . ':!docs'
npm test 2>&1 | grep -E "# (pass|fail)"
```
Expected: 첫 grep = **0**(S3 미지원 문구 전부 제거). 둘째 grep ≥ 1(native 킵/드롭·소진 존재). git diff = `dash-falsify/SKILL.md` 단독. `# pass 44 / # fail 0`.

- [ ] **Step 5: 커밋**

```bash
git add .claude/skills/dash-falsify/SKILL.md
git commit -m "feat(dash-falsify): native 후보 킵/드롭 자동 승격 — §4 permanent 화면화 + open 후보 노출(S3b)"
```

---

### Task 2: 승격 dry-run — 스모크 승자 a → permanent 화면 + 갤러리

Task 1의 native 킵/드롭 메커니즘이 실제로 도는지 throwaway 브랜치에서 시연한다. **산출물(승격 화면·screens·스크린샷·NATIVE_WORKS)은 main 병합 대상 아니다** — 메커니즘 증명만. 컨트롤러 직접 실행 권장(git mv·등재 편집 판단 동반).

**Files:** (throwaway) `native/src/notifications/`, `native/screens.{ts,json}`, `app/public/native/notifications.png`, `app/src/lib/works.ts` NATIVE_WORKS.

**Interfaces:** Consumes Task 1 §4 메커니즘 + S4b 스모크(smoke/native-r1)의 evolve 화면·스크린샷.

- [ ] **Step 1: dry-run 브랜치 + 스모크 evolve 화면 가져오기**

```bash
git checkout -b smoke/s3b-native-promote   # S3b feature 브랜치 위(NATIVE_WORKS 있는 S3a 반영 works.ts 보유)
# 스모크의 evolve 화면 3개 + evolve 슬러그 등록된 screens 가져오기(승격 전 상태 재현)
git checkout smoke/native-r1 -- native/src/evolve/r1 native/src/screens.ts native/screens.json
node -e "console.log('evolve 슬러그:', Object.keys(require('./native/screens.json')).filter(k=>k.startsWith('evolve-r1')).join(','))"
```
Expected: `evolve 슬러그: evolve-r1-a,evolve-r1-b,evolve-r1-c` (승격 전 = 3 후보 등록됨).

- [ ] **Step 2: keep — 승자 a를 `native/src/notifications/`로 승격**

§4 native 킵 메커니즘 실행:
```bash
git mv native/src/evolve/r1/a native/src/notifications
git show smoke/native-r1:vault/20-generations/2026-07-22-auto-native-r1/shots/a-390.png > app/public/native/notifications.png
```
- `native/src/notifications/`의 화면 파일 import 경로 조정(evolve/r1/a → src/notifications: tokens import가 `../../../tokens`(3단계)에서 `../tokens`(1단계)로 바뀜 — 파일 내 상대경로 수정).
- `native/screens.ts`: `evolve-r1-a` import/COMPONENTS 항목을 `notifications`(from `./notifications/<Comp>`)로 교체.
- `native/screens.json`: `"evolve-r1-a"` → `"notifications": {"check": "알림"}`.
- `app/src/lib/works.ts` `NATIVE_WORKS`에 append: `{ id:"n2", route:"/native/notifications.png", brand:"알림센터", desc:"알림 피드 · 날짜 그룹핑 (auto-native-r1 승자, 승격)", target:"native", image:"/native/notifications.png", status:"winner", round:"auto-native-r1", previewH:420 }` + `LAST_UPDATED`를 오늘로.

- [ ] **Step 3: keep 정합 검증 (tsc + gate + build)**

```bash
( cd native && npx tsc --noEmit && echo TSC_OK )
node scripts/gate.mjs --target native --screens notifications
echo "gate exit=$?"
lsof -ti :3100 | xargs -r kill 2>/dev/null; rm -rf app/.next; ( cd app && npx next build 2>&1 | tail -4 )
```
Expected: `TSC_OK`(등재 정합) + gate verdict `pass:true`/exit 0(승격 화면 tsc/export/render/iframe 통과 — check "알림" 매칭) + next build 성공(NATIVE_WORKS n2 확장).

- [ ] **Step 4: drop — 탈락 b/c 제거 + 레지스트리 소진 확인**

```bash
rm -rf native/src/evolve/r1/b native/src/evolve/r1/c
# native/screens.ts에서 evolve-r1-b, evolve-r1-c import/COMPONENTS 제거
# native/screens.json에서 "evolve-r1-b", "evolve-r1-c" 제거
( cd native && npx tsc --noEmit && echo TSC_OK )
node -e "const s=require('./native/screens.json'); console.log('잔여 evolve 슬러그:', Object.keys(s).filter(k=>k.startsWith('evolve-r')).length, '| notifications 등재:', 'notifications' in s)"
[ -d native/src/evolve/r1 ] && ls native/src/evolve/r1 || echo "evolve/r1 비었거나 없음"
```
Expected: `TSC_OK` + `잔여 evolve 슬러그: 0 | notifications 등재: true`(소진 불변식 성립) + evolve/r1 비었음.

- [ ] **Step 5: 갤러리 표시 확인 (n2 승격작)**

```bash
( cd app && PORT=3100 npm run dev >/tmp/dev3100.log 2>&1 & )
for i in $(seq 1 40); do [ "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3100/gallery)" = "200" ] && break; sleep 1; done
html=$(curl -s http://localhost:3100/gallery)
echo "$html" | grep -c 'notifications.png' | xargs echo "n2 이미지 src:"
echo "이미지 200: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:3100/native/notifications.png)"
lsof -ti :3100 | xargs -r kill 2>/dev/null
```
Expected: `n2 이미지 src: 1`(승격작 카드 렌더) + 이미지 200. **승격 end-to-end 실증 완료.**

- [ ] **Step 6: dry-run 정리 (throwaway 폐기)**

```bash
git reset --hard HEAD; git clean -fd native/src app/public/native
git checkout feat/s3b-falsify-native
git branch -D smoke/s3b-native-promote
```
Expected: feature 브랜치는 Task 1(dash-falsify SKILL)만. dry-run 산출물 미병합.

---

## Self-Review

- **Spec coverage**: §4 keep(spec §3.1)→T1S3/T2S2 · §4 drop(spec §3.2)→T1S3/T2S4 · 레지스트리 소진(spec §3.3)→T1S3/T2S4 · open native 후보 노출(spec §4)→T1S1 · 리뷰 방법(spec §4)→T1S2 · keep dry-run(spec §5.1)→T2S2 · tsc/gate/build 정합(spec §5.2)→T2S3 · drop dry-run(spec §5.3)→T2S4 · 웹 무영향·회귀(spec §5.4)→T1S4 · 비회귀 SKILL 단독(spec §5.5)→T1S4/T2S6. 전 요구 매핑됨.
- **Placeholder scan**: old/new 전문·명령·기대출력 구체. `<N>`·`<v>`·`<name>`·`<검사문자열>`은 SKILL 런타임 치환자(기존 관례; dry-run T2는 r1/a/notifications/"알림" 구체값). TBD/TODO 없음.
- **Type consistency**: NATIVE_WORKS entry 형식(id/route/brand/desc/target/image/status/round/previewH)이 S3a seed·T1S3 prose·T2S2 dry-run 일관. permanent 슬러그 `notifications`·검사문자열 `"알림"`이 screens.json·gate·NATIVE_WORKS 전반 동일. 승격 화면 tokens import 경로(`../../../tokens`→`../tokens`) 조정 T2S2 명시.
- **실행 모드 주의**: T2는 컨트롤러 판단(import 경로 조정·screens 편집·git mv) 동반 — Inline 실행 권장.
