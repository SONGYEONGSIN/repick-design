# S4a — dash-evolve 웹 게이트를 gate.mjs로 채택 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** dash-evolve SKILL §3 HARD GATE의 prose 게이트 호출(dash-static-check·dash-sweep·Lighthouse 개별)을 후보별 `node scripts/gate.mjs --target web` 호출로 교체하되, dash/landing 라운드 동작·게이트 기준·ledger 스키마를 전부 보존한다.

**Architecture:** 단일 파일(`.claude/skills/dash-evolve/SKILL.md`)의 prose 재배선. §3의 세 도구 개별 호출을 후보별 통일 디스패처 1회 호출 + 1-fix 루프로 바꾼다. gate.mjs는 S2에서 이미 이 세 도구를 무수정으로 감싸므로(동적 import) 동작 보존은 구성상 보장된다. 검증은 실행 코드가 없어(SKILL은 런타임 prose) 게이트 재현 + prose 자기정합으로 한다.

**Tech Stack:** Markdown(SKILL.md), `scripts/gate.mjs`(S2, 무수정), Next.js dev 서버(3100), node:test(회귀 확인용).

## Global Constraints

- **동작 보존(불변)**: 게이트 판정 기준 = 정적 위반 0 · 전 폭 오버플로 0 · a11y ≥ 95(하드) · Lighthouse 불가 시 `unavailable`(하드페일 아님) · perf 항상 통과(기록만). gate.mjs가 이미 강제 — SKILL이 별도 임계 규칙을 걸지 않는다.
- **후보별 호출**: 각 후보 v ∈ {a,b,c}에 `node scripts/gate.mjs --target web --routes /<TARGET>-evolve/r<N>/<v>` (배치 아님).
- **gate.mjs 무수정**: `scripts/gate.mjs` diff 0.
- **ledger 스키마 불변**: `hardgate:{static, sweep, lighthouse}` 3키 free-text 형태 유지 — `app/src/lib/evolve-status.ts`·`works.ts`·갤러리·`target` 유니온 무변경. 텍스트만 §3 verdict에서 소싱.
- **변경 파일 = `.claude/skills/dash-evolve/SKILL.md` 단독**. `scripts/`·`app/`·`vault/` diff 0.
- **불변식 유지**: 정본 2개·`/dash`·`/v1~v5` 미수정, jsonl append-only, main 커밋 금지(이 SKILL의 기존 불변식 문장 보존).
- **한국어 커밋 메시지 + conventional 접두사**, Co-Authored-By 등 푸터 없음(주변 리포 관례).

---

### Task 1: §3 HARD GATE를 gate.mjs 후보별 호출로 재배선

**Files:**
- Modify: `.claude/skills/dash-evolve/SKILL.md` (frontmatter description 1줄, §3 전체, §7 hardgate 소싱 문구)

**Interfaces:**
- Consumes: `scripts/gate.mjs`(S2)의 CLI `node scripts/gate.mjs --target web --routes <route>` → stdout JSON `{target:'web', pass, gates:[{name,pass,detail}], violations:[{gate,...}]}`, exit 0(pass)/1(fail). gate 이름 = `static`·`sweep`·`a11y`·`perf`.
- Produces: 재배선된 SKILL prose (런타임 에이전트가 소비). 인터페이스 함수 없음.

- [ ] **Step 1: frontmatter description 문구 교체**

`.claude/skills/dash-evolve/SKILL.md` 2번째 줄(frontmatter `description:`)에서 아래 old를 new로 교체.

old (부분 문자열):
```
후보 3개 생성 → 하드게이트(정적·sweep·a11y) → 3렌즈 judge 다수결
```
new:
```
후보 3개 생성 → 하드게이트(gate.mjs --target web: 정적·sweep·a11y·perf) → 3렌즈 judge 다수결
```

- [ ] **Step 2: §3 HARD GATE 섹션 전체 교체**

현재 §3 (아래 old 전체)을 new 전체로 교체.

old (`## 3. HARD GATE` 헤더부터 `SCORES.md에 표로 기록.` 까지 전체):
```markdown
## 3. HARD GATE (하나라도 실패 → 1회 수정 기회 → 재실패 시 탈락)
- dev 서버: 3100 응답 확인(`curl -s -o /dev/null -w '%{http_code}' http://localhost:3100/`), 없으면 `cd app && npm run dev` 백그라운드 기동(이 라운드가 띄웠으면 마지막에 종료).
- **정적**: `node scripts/dash-static-check.mjs <ROUTES-루트 상대경로>/<v>/*.tsx` — 위반 JSON을 해당 designer에 전달해 1회 수정(이미지 규칙 포함 — 원시 img·alt 누락·unoptimized 자동 검출).
- **sweep**: `node scripts/dash-sweep.mjs --base http://localhost:3100 --routes <라우트 a b c>` — 실패 후보만 failures JSON 전달해 1회 수정 후 재sweep. (랜딩도 동일한 그리드 룰 — 전 폭 오버플로 금지.)
- **Lighthouse**: `npx lighthouse http://localhost:3100<라우트> --only-categories=performance,accessibility --preset=desktop --output=json --output-path=stdout --chrome-flags="--headless" 2>/dev/null` → a11y ≥95(하드게이트). perf는 기록만 — dev 서버 측정치는 탈락 사유로 쓰지 않는다. 명령 자체 실패 시 skip + `"lighthouse":"unavailable"` 기록.
- 게이트 결과를 `vault/20-generations/<run>/SCORES.md`에 표로 기록.
```
new:
```markdown
## 3. HARD GATE (하나라도 실패 → 1회 수정 기회 → 재실패 시 탈락)
- dev 서버: 3100 응답 확인(`curl -s -o /dev/null -w '%{http_code}' http://localhost:3100/`), 없으면 `cd app && npm run dev` 백그라운드 기동(이 라운드가 띄웠으면 마지막에 종료). gate.mjs 웹 브랜치가 sweep·Lighthouse 대상으로 3100을 쓴다.
- **후보별 게이트**: 각 후보 v ∈ {a,b,c}에 대해 `node scripts/gate.mjs --target web --routes /<TARGET>-evolve/r<N>/<v>` 실행 → 공통 판정 verdict `{pass, gates:[{name:'static',…},{name:'sweep',…},{name:'a11y',…},{name:'perf',…}], violations}`. 디스패처가 정적(이미지 규칙 3종 포함 — 원시 img·alt 누락·unoptimized)·sweep(전 폭 오버플로, 랜딩도 동일 그리드 룰)·a11y·perf를 전부 실행·판정한다.
- **1-fix 루프**: `pass:false`면 `verdict.violations`(위반 상세 — `gate`명 + file/route/line 태그)를 해당 designer v에 전달해 **1회 수정** 후 같은 명령 재실행. 재통과 → 생존, 재실패 → 탈락. (후보별 단일 라우트라 violations가 전부 그 후보 소속 — demux 불필요.)
- **게이트 기준**(디스패처 강제, SKILL 별도 규칙 불요): a11y < 95 = 하드페일 / Lighthouse 실행 불가 = `unavailable`(하드페일 아님) / perf = 항상 통과(기록만 — dev 서버 측정치 탈락 미적용).
- 각 후보 `verdict.gates`를 `vault/20-generations/<run>/SCORES.md`에 표로 기록.
```

- [ ] **Step 3: §7 auto-ledger hardgate 소싱 문구 추가**

§7 첫 bullet(`- auto-ledger append:` 로 시작하는 줄)을 아래 old에서 new로 교체 (스키마 자체는 불변 — 소싱 출처 절만 추가).

old:
```markdown
- auto-ledger append: `{target:'<TARGET>', round:'auto-<TARGET>-r<N>', date:'<YYYY-MM-DD>', winner:'<v>'|null, no_winner:<bool>, hardgate:{sweep:'...', static:'...', lighthouse:'...'}, judges:{lens1:'<v>',lens2:'<v>',lens3:'<v>'}, refuted:null}` → `vault/30-ledger/auto-ledger.jsonl`
```
new:
```markdown
- auto-ledger append: `{target:'<TARGET>', round:'auto-<TARGET>-r<N>', date:'<YYYY-MM-DD>', winner:'<v>'|null, no_winner:<bool>, hardgate:{sweep:'...', static:'...', lighthouse:'...'}, judges:{lens1:'<v>',lens2:'<v>',lens3:'<v>'}, refuted:null}` → `vault/30-ledger/auto-ledger.jsonl`. **hardgate 3키는 §3 후보별 verdict.gates에서 소싱**한다(스키마 불변): `static`←static gate detail 요약, `sweep`←sweep gate detail 요약, `lighthouse`←a11y gate detail(+ perf gate detail 기록) 요약.
```

- [ ] **Step 4: dev 서버 확인 후 게이트 재현 증명**

동작 보존을 실증한다 — gate.mjs 웹 호출 형태가 통과작에서 pass를 재현하는지. `/dash/d29`는 main에 존재하는 출하된 dash 승자로, gate.mjs가 evolve dash 후보와 **동일 코드 경로**(filesForRoute + sweep + Lighthouse)로 처리한다.

```bash
# 3100 dev 서버 확인(없으면 기동)
[ "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3100/dash/d29)" = "200" ] || ( cd app && PORT=3100 npm run dev >/tmp/dev3100.log 2>&1 & )
for i in $(seq 1 40); do [ "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3100/dash/d29)" = "200" ] && break; sleep 1; done
node scripts/gate.mjs --target web --routes /dash/d29
echo "exit=$?"
```
Expected: JSON `{"target":"web","pass":true,"gates":[{"name":"static",…},{"name":"sweep",…},{"name":"a11y",…},{"name":"perf",…}],"violations":[]}`, `exit=0`. (Lighthouse 불가 환경이면 a11y `detail:"unavailable"`이어도 pass — static·sweep가 통과작에서 위반 0이면 전체 pass. 이는 §3 새 규칙과 정확히 일치.)

- [ ] **Step 5: SKILL 자기정합 + 비회귀 확인**

```bash
# 변경 파일이 SKILL.md 단독인지
git diff --stat -- . ':!.superpowers'
# gate 코드 무변경 → 기존 테스트 불변
npm test 2>&1 | grep -E "# (tests|pass|fail)"
```
Expected: `git diff --stat`가 `.claude/skills/dash-evolve/SKILL.md` 단 하나(+`scripts/`·`app/`·`vault/` 없음). `npm test` `# pass 44 / # fail 0`.

자기정합 리뷰(읽기): 재작성된 §3의 라우트 `/<TARGET>-evolve/r<N>/<v>`가 §0 run id·§2 산출 경로(`ROUTES{a,b,c}/page.tsx`, ROUTES = `app/src/app/<TARGET>-evolve/r<N>/`)와 §"타깃 파라미터" 표 하단의 URL 규칙(`app/src/app` 접두 제거)과 일치하는지, §3 SCORES.md 기록이 §4 judge 입력과 연결되는지, §7 hardgate 소스가 §3 verdict과 정합하는지 확인.

- [ ] **Step 6: 커밋**

```bash
git add .claude/skills/dash-evolve/SKILL.md
git commit -m "refactor(dash-evolve): §3 HARD GATE를 gate.mjs --target web 후보별 호출로 채택(동작 보존)"
```

---

## Self-Review

- **Spec coverage**: §3 재배선(spec §3)→Task1 Step2 · §7 hardgate 소싱 스키마 불변(spec §4)→Step3 · frontmatter(spec §5 표)→Step1 · 게이트 재현 증명(spec §6.1)→Step4 · SKILL 자기정합(spec §6.2)→Step5 · 비회귀 diff/npm test(spec §6.3)→Step5. 전 요구 매핑됨. spec §6.4(야간 스모크 불필요)는 의도적 비수행 — 계획에 스모크 태스크 없음이 정합.
- **Placeholder scan**: old/new 전문 제시, 검증 명령·기대출력 구체. TBD/TODO 없음.
- **Type consistency**: gate verdict 형태(`{target,pass,gates:[{name,pass,detail}],violations}`)·gate 이름(static/sweep/a11y/perf)이 S2 gate.mjs 실제 출력과 일치(§Global Constraints·Step2·Step4 동일 표기). 라우트 표기 `/<TARGET>-evolve/r<N>/<v>` 일관.
- **동작 보존 근거**: gate.mjs는 S2 최종 리뷰에서 dash-static-check·dash-sweep를 동적 import로 무수정 호출, a11y≥95·perf 기록전용 보존 확인됨 — 재배선은 호출 형태만 바꾸고 판정 로직 불변.
