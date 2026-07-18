---
name: dash-evolve
description: 자율 진화 1라운드 (이중 타깃 — SaaS 대시보드 또는 랜딩페이지를 무작위 선택) — 정본 brief+격리 delta로 후보 3개 생성 → 하드게이트(정적·sweep·a11y) → 3렌즈 judge 다수결 → delta 격리 적재 → 정제 게이트 → evolve/dash 커밋. "/dash-evolve", "자율 라운드" 시 사용. 무인 실행 전제 — 사람 확인 없이 완주하며 no-winner 라운드를 허용한다.
---

# dash-evolve — 자율 라운드 (무인, 이중 타깃)

**불변식: 정본 2개(`vault/00-principles/dash-brief-v3.md`, `vault/00-principles/design-principles.md`)와 `/dash` 갤러리·`/v1~v5`는 절대 수정하지 않는다. jsonl은 append-only. main에 커밋하지 않는다.**

## 0. 준비 — 타깃 선택
- 브랜치: `git checkout evolve/dash` (없으면 `git checkout -b evolve/dash`).
- **타깃 무작위 결정**: `TARGET=$([ $((RANDOM % 2)) -eq 0 ] && echo dash || echo landing)` — 결과는 ledger에 기록되므로 재현성은 ledger가 담보 (후보 코드의 결정론 규칙과 무관한 오케스트레이션 난수).
- 라운드 번호 N = `vault/30-ledger/auto-ledger.jsonl`에서 **해당 타깃의 최대 라운드 번호 + 1** (타깃별 독립 시퀀스):
  `node -e "const ls=require('fs').readFileSync('vault/30-ledger/auto-ledger.jsonl','utf8').trim().split('\n').filter(Boolean).map(JSON.parse); const t='<TARGET>'; console.log(Math.max(0,...ls.filter(e=>e.round.startsWith('auto-'+t+'-r')).map(e=>+e.round.split('-r')[1]))+1)"`
- run id = `auto-<TARGET>-r<N>`. run 디렉토리: `node -e "import('./scripts/design-loop.mjs').then(m=>console.log(m.newRun('auto-<TARGET>-r<N>','vault/20-generations','<오늘 YYYY-MM-DD>')))"`

## 타깃 파라미터 (이하 전 단계에서 치환)

| 변수 | dash | landing |
|---|---|---|
| BRIEF | `vault/00-principles/dash-brief-v3.md` | `vault/00-principles/design-principles.md` |
| DELTAS | `vault/00-principles/dash-deltas-provisional.jsonl` | `vault/00-principles/landing-deltas-provisional.jsonl` |
| ROUTES | `app/src/app/dash-evolve/r<N>/` | `app/src/app/landing-evolve/r<N>/` |
| 중복 금지 | `/dash` 갤러리 등록분 + dash-evolve 누적 아키타입 | `/v1~v5` + landing-evolve 누적 형태(landing-forms.jsonl 용어) |
| judge 렌즈 | brief 준수 / 상용 SaaS 완성도(Mercury·Asana·n8n·Coinbase) / 아키타입 차별성 | DNA 준수 / 상용 랜딩 완성도(Linear·Stripe·Vercel급) / 형태 차별성 |

> URL 라우트 = ROUTES에서 `app/src/app` 접두를 제거한 경로 (예: ROUTES `app/src/app/landing-evolve/r1/` → URL `/landing-evolve/r1/<v>`). §3 sweep/Lighthouse·§4 스크린샷의 <라우트>는 이 URL을 쓴다.

## 1. RETRIEVE
다음을 전부 읽어 생성 컨텍스트를 구성한다:
- BRIEF 전문 (정본 — 읽기 전용)
- DELTAS 전체 (격리 delta — status가 refuted가 아닌 최신 entry들)
- `vault/00-principles/curation-criteria.md` (meta-기준 — judge·정제 프롬프트에 주입)
- `vault/30-ledger/auto-ledger.jsonl`에서 해당 타깃 최근 5개 (직전 승자·no-winner 사유)
- 중복 금지 목록 (타깃 파라미터 참조) 정리

## 2. GENERATE — 3병렬
- designer(또는 frontend-design-specialist) 에이전트 3개 병렬 호출. 각자에게: RETRIEVE 컨텍스트 + 서로 다른 아키타입/형태 명시 지정(중복 금지 목록 포함) + 산출 경로.
- 경로: ROUTES`{a,b,c}/page.tsx` (+client 컴포넌트 분리 허용, 자기 폴더만).
- 각 후보의 한 줄 컨셉을 `vault/20-generations/<run>/candidates/<v>.md`에 기록.

## 3. HARD GATE (하나라도 실패 → 1회 수정 기회 → 재실패 시 탈락)
- dev 서버: 3100 응답 확인(`curl -s -o /dev/null -w '%{http_code}' http://localhost:3100/`), 없으면 `cd app && npm run dev` 백그라운드 기동(이 라운드가 띄웠으면 마지막에 종료).
- **정적**: `node scripts/dash-static-check.mjs <ROUTES-루트 상대경로>/<v>/*.tsx` — 위반 JSON을 해당 designer에 전달해 1회 수정.
- **sweep**: `node scripts/dash-sweep.mjs --base http://localhost:3100 --routes <라우트 a b c>` — 실패 후보만 failures JSON 전달해 1회 수정 후 재sweep. (랜딩도 동일한 그리드 룰 — 전 폭 오버플로 금지.)
- **Lighthouse**: `npx lighthouse http://localhost:3100<라우트> --only-categories=performance,accessibility --preset=desktop --output=json --output-path=stdout --chrome-flags="--headless" 2>/dev/null` → a11y ≥95(하드게이트). perf는 기록만 — dev 서버 측정치는 탈락 사유로 쓰지 않는다. 명령 자체 실패 시 skip + `"lighthouse":"unavailable"` 기록.
- 게이트 결과를 `vault/20-generations/<run>/SCORES.md`에 표로 기록.

## 4. JUDGE 패널 (생존 후보 2개 이상일 때; 1개면 단독 심사로 승자/no-winner만 판정)
- 스크린샷: 후보별 4폭 캡처 → `npx playwright screenshot --viewport-size=<w>,900 http://localhost:3100<라우트> vault/20-generations/<run>/shots/<v>-<w>.png` (w ∈ 1280, 1440, 1920, 390).
- judge 3개 병렬(Agent 도구, comparator 계열). 공통 입력: 스크린샷 + 소스 경로 (컨셉·순서 비공개 — 블라인드). 렌즈는 타깃 파라미터 표를 따른다 (렌즈 1=정본 대조, 렌즈 2=상용 완성도, 렌즈 3=구조 차별성).
- judge가 응답 없이 정지하면 1회 재디스패치, 재실패 시 해당 렌즈 기권 — 잔여 2렌즈 다수결(동률이면 렌즈 1 우선, 렌즈 1 기권 시 렌즈 2 우선). 기권은 DECISION.md에 명시.
- 각 judge 출력: 랭킹 + 후보별 한 줄 사유 + (전원 미달 시) no-winner 표.
- 집계: 1위 표 다수결. **no-winner 표 2개 이상이면 라운드 no-winner** — 억지 승자 금지.
- 판정 전문을 `vault/20-generations/<run>/DECISION.md`에 기록.

## 5. LEARN — 격리 적재
승자가 있으면 판정 사유에서 재사용 가능한 delta **1개**를 추출해 DELTAS에 append:
```bash
node -e "import('./scripts/design-loop.mjs').then(m=>m.appendLedger({round:'auto-<TARGET>-r<N>',variant:'<v>',delta:'<한 줄>',evidence:'<judge 사유 인용>',judge_votes:{lens1:'<v>',lens2:'<v>',lens3:'<v>'},confidence:'<high|low>',level:'L1',status:'provisional'},'<DELTAS>'))"
```
level은 L1로 — 상승은 정제 게이트가 판단.

## 6. 지식 정제 게이트
- 해당 타깃 DELTAS 전체 로드 → 클러스터링: 유사 delta 묶음, 충돌 쌍 식별 (타깃 간 교차 충돌도 — 예: dash delta가 landing 정본과 모순되면 질문 대상).
- **레벨 재책정**: curation-criteria.md 체크리스트로 판정. 재현(2라운드+)·기계 검증 가능 delta는 `{...원본, level:'L2'|'L3', supersedes:'<원본 round>', status:'provisional'}` append (원줄 수정 금지).
- **질문 강제 생성**: ① 충돌 쌍 ② meta-기준으로 정당화 불가 — `questions-queue.md` "대기 중"에 append(질문에 target 표기 + 배경 + 잠정 가설). 동일 유형 중복 금지.

## 7. 기록 + 커밋
- auto-ledger append: `{target:'<TARGET>', round:'auto-<TARGET>-r<N>', date:'<YYYY-MM-DD>', winner:'<v>'|null, no_winner:<bool>, hardgate:{sweep:'...', static:'...', lighthouse:'...'}, judges:{lens1:'<v>',lens2:'<v>',lens3:'<v>'}, refuted:null}` → `vault/30-ledger/auto-ledger.jsonl`
- **index.md 갱신**: `vault/index.md`의 "세대 기록" 섹션에 `- [[DECISION]]` 형태로 이번 run의 DECISION을 등재 (경로 포함형: `[[20-generations/<run>/DECISION|<run>]]`).
- no-winner면 사유를 DECISION.md에 남기고 후보 route 유지(주간 반증에서 일괄 드롭).
- `git add -A && git commit -m "feat(dash-evolve): <TARGET> r<N> <승자 v — 아키타입/형태 | no-winner>"` (+ Co-Authored-By 푸터) → `git push origin evolve/dash`.
