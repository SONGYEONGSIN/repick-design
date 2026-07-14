---
name: dash-evolve
description: dash 루프 자율 진화 1라운드 — brief v3+격리 delta로 후보 3개 생성 → 하드게이트(sweep·정적·Lighthouse) → 3렌즈 judge 다수결 → delta 격리 적재 → 정제 게이트(질문 생성) → evolve/dash 커밋. "/dash-evolve", "dash 자율 라운드" 시 사용. 무인 실행 전제 — 사람 확인 없이 완주하며 no-winner 라운드를 허용한다.
---

# dash-evolve — 자율 라운드 (무인)

**불변식: `vault/00-principles/dash-brief-v3.md`와 `/dash` 갤러리는 절대 수정하지 않는다. jsonl은 append-only. main에 커밋하지 않는다.**

## 0. 준비
- 브랜치: `git checkout evolve/dash` (없으면 `git checkout -b evolve/dash`).
- 라운드 번호 N = `dash-auto-ledger.jsonl` 줄 수 + 1. run id = `auto-dash-r<N>`.
- run 디렉토리: `node -e "import('./scripts/design-loop.mjs').then(m=>console.log(m.newRun('auto-dash-r<N>','vault/20-generations','<오늘 YYYY-MM-DD>')))"`

## 1. RETRIEVE
다음을 전부 읽어 생성 컨텍스트를 구성한다:
- `vault/00-principles/dash-brief-v3.md` 전문 (정본 — 읽기 전용)
- `vault/00-principles/dash-deltas-provisional.jsonl` 전체 (격리 delta — status가 refuted가 아닌 최신 entry들)
- `vault/00-principles/curation-criteria.md` (meta-기준 — judge·정제 프롬프트에 주입)
- `vault/30-ledger/dash-auto-ledger.jsonl` 최근 5개 (직전 승자·no-winner 탈락 사유)
- 기존 아키타입 목록: `/dash` 갤러리 14종 + `app/src/app/dash-evolve/` 하위 기존 라운드의 아키타입 — 중복 금지 목록으로 정리

## 2. GENERATE — 3병렬
- designer(또는 frontend-design-specialist) 에이전트 3개 병렬 호출. 각자에게: RETRIEVE 컨텍스트 + 서로 다른 레이아웃 아키타입 명시 지정(중복 금지 목록 포함) + 산출 경로.
- 경로: `app/src/app/dash-evolve/r<N>/{a,b,c}/page.tsx` (+client 컴포넌트 분리 허용, 자기 폴더만).
- 각 후보의 한 줄 컨셉을 `vault/20-generations/<run>/candidates/<v>.md`에 기록.

## 3. HARD GATE (하나라도 실패 → 1회 수정 기회 → 재실패 시 탈락)
- dev 서버: 3100 응답 확인(`curl -s -o /dev/null -w '%{http_code}' http://localhost:3100/`), 없으면 `cd app && npm run dev -- -p 3100` 백그라운드 기동(이 라운드가 띄웠으면 마지막에 종료).
- **정적**: `node scripts/dash-static-check.mjs app/src/app/dash-evolve/r<N>/<v>/*.tsx` — 위반 JSON을 해당 designer에 전달해 1회 수정.
- **sweep**: `node scripts/dash-sweep.mjs --base http://localhost:3100 --routes /dash-evolve/r<N>/a /dash-evolve/r<N>/b /dash-evolve/r<N>/c` — 실패 후보만 failures JSON을 전달해 1회 수정 후 해당 route만 재sweep.
- **Lighthouse**: `npx lighthouse http://localhost:3100/dash-evolve/r<N>/<v> --only-categories=performance,accessibility --preset=desktop --output=json --output-path=stdout --chrome-flags="--headless" 2>/dev/null` → perf ≥80, a11y ≥95. 명령 자체가 실패(미설치·chrome 부재)하면 게이트 skip하고 ledger hardgate에 `"lighthouse":"unavailable"` 기록.
- 게이트 결과를 `vault/20-generations/<run>/SCORES.md`에 표로 기록.

## 4. JUDGE 패널 (생존 후보 2개 이상일 때; 1개면 그 후보를 단독 심사해 승자/no-winner만 판정)
- 스크린샷: 후보별 4폭 캡처 → `npx playwright screenshot --viewport-size=<w>,900 http://localhost:3100/dash-evolve/r<N>/<v> vault/20-generations/<run>/shots/<v>-<w>.png` (w ∈ 1280, 1440, 1920, 390).
- judge 3개 병렬(Agent 도구, 각각 comparator 계열). 공통 입력: 후보 스크린샷 + 소스 경로 (생성 컨셉·순서는 비공개 — 블라인드). 렌즈:
  1. **brief**: brief v3 전문 대조 — 규칙 위반·완성도 기준 미달 지적
  2. **visual**: Mercury/Asana/n8n/Coinbase 대비 상용 서비스급인가 — 스크린샷 중심
  3. **archetype**: 기존 아키타입 목록 대비 구조 차별성
- 각 judge 출력: 후보 랭킹 + 후보별 한 줄 사유 + (전원 미달이면) no-winner 표.
- 집계: 1위 표 다수결. 동률이면 brief 렌즈의 1위. **no-winner 표 2개 이상이면 라운드 no-winner** — 억지 승자 금지.
- 판정 전문을 `vault/20-generations/<run>/DECISION.md`에 기록.

## 5. LEARN — 격리 적재
승자가 있으면 판정 사유에서 재사용 가능한 delta **1개**를 추출해 append:
```bash
node -e "import('./scripts/design-loop.mjs').then(m=>m.appendLedger({round:'auto-dash-r<N>',variant:'<v>',delta:'<한 줄>',evidence:'<judge 사유 인용>',judge_votes:{brief:'<v>',visual:'<v>',archetype:'<v>'},confidence:'<high|low>',level:'L1',status:'provisional'},'vault/00-principles/dash-deltas-provisional.jsonl'))"
```
level은 일단 L1로 넣는다 — 상승은 6단계 정제 게이트가 판단.

## 6. 지식 정제 게이트
- provisional 전체 로드(`recentDecisions(999, ...)`) → 클러스터링: 유사 delta 묶음, 충돌 쌍 식별.
- **레벨 재책정**: curation-criteria.md의 체크리스트로 각 클러스터 판정. 재현(2라운드+)이나 기계 검증 가능성이 확인된 delta는 `{...원본, level:'L2'|'L3', supersedes:'<원본 round>', status:'provisional'}`로 새 entry append (원줄 수정 금지).
- **질문 강제 생성**: ① 충돌 쌍 발견 ② 병합/랭킹 판단을 meta-기준으로 정당화 불가 — 둘 중 하나면 `questions-queue.md`의 "대기 중"에 append: 질문 + 배경(충돌 delta 인용) + 잠정 가설. 이미 대기 중인 동일 유형 질문이 있으면 중복 생성 금지.

## 7. 기록 + 커밋
- auto-ledger append: `{round:'auto-dash-r<N>', date:'<YYYY-MM-DD>', winner:'<v>'|null, no_winner:<bool>, hardgate:{sweep:'pass|<탈락 v들>', static:'pass|<탈락 v들>', lighthouse:'pass|<수치>|unavailable'}, judges:{brief:'<v>',visual:'<v>',archetype:'<v>'}, refuted:null}`
- no-winner면 탈락 사유 요약을 DECISION.md에 남기고 후보 route는 유지(주간 반증에서 일괄 드롭).
- `git add -A && git commit -m "feat(dash-evolve): r<N> <승자 v — 아키타입 | no-winner>"` (+ Co-Authored-By 푸터). push는 원격 등록 후: `git push -u origin evolve/dash`.
