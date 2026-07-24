---
name: dash-evolve
description: 자율 진화 1라운드 (이중 타깃 — SaaS 대시보드 또는 랜딩페이지를 무작위 선택) — 정본 brief+격리 delta로 후보 3개 생성 → 하드게이트(gate.mjs --target web: 정적·sweep·a11y·perf) → 3렌즈 judge 다수결 → delta 격리 적재 → 정제 게이트 → evolve/dash 커밋. "/dash-evolve", "자율 라운드" 시 사용. 무인 실행 전제 — 사람 확인 없이 완주하며 no-winner 라운드를 허용한다.
---

# dash-evolve — 자율 라운드 (무인, 이중 타깃)

**불변식: 정본 2개(`vault/00-principles/dash-brief-v3.md`, `vault/00-principles/design-principles.md`)와 `/dash` 갤러리·`/v1~v5`는 절대 수정하지 않는다. jsonl은 append-only. main에 커밋하지 않는다.**

## 0. 준비 — 타깃 선택
- 브랜치: `git checkout evolve/dash` (없으면 `git checkout -b evolve/dash`).
- **타깃 무작위 결정**: `TARGET=$(case $((RANDOM % 3)) in 0) echo dash;; 1) echo landing;; 2) echo native;; esac)` — dash/landing/native 균등. 결과는 ledger에 기록되므로 재현성은 ledger가 담보 (후보 코드의 결정론 규칙과 무관한 오케스트레이션 난수).
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
| 에셋·인터랙션 | 서비스급 절제 유지 + 도메인 생성형 시각화 밀도↑, 인터랙션 4종+ (연출·발광 금지) | 표현 상한 없음 — 히어로 이미지·framer-motion·스크롤 연출, 인터랙션 4종+ |

### native 타깃 파라미터 (RN 라운드 — 웹과 구조 상이)

native는 웹 라우트가 아니라 RN 화면이라 아래 규약을 따른다. §5 LEARN·§6 정제 게이트도 native에서 수행한다(웹과 동형 — DELTAS만 native 파일).

| 변수 | native |
|---|---|
| BRIEF | `native/GENERATION.md`(7절) + `native/src/tokens.ts`(DNA 토큰) — 읽기 전용 정본 |
| DELTAS | `vault/00-principles/native-deltas-provisional.jsonl` |
| ROUTES(코드) | `native/src/evolve/r<N>/{a,b,c}/` |
| 등록 | 각 후보를 `native/screens.ts`(import + `COMPONENTS["evolve-r<N>-<v>"] = <컴포넌트>`)·`native/screens.json`(`"evolve-r<N>-<v>": {"check": "<화면 대표 헤딩 텍스트>"}`)에 등재 (evolve/dash에만 — main 무변경) |
| 게이트 slug | `evolve-r<N>-a evolve-r<N>-b evolve-r<N>-c` |
| 중복 금지 | 기존 native 화면(watchlist/match) + native-evolve 누적 화면유형 |
| judge 렌즈 | 1=DNA 준수(GENERATION.md·tokens) / 2=모바일 앱 완성도(iOS·Android 관용구·네이티브급) / 3=화면유형 차별성 |
| 에셋·인터랙션 | RN 관용구(Pressable·FlatList·SafeAreaView) + 모바일 인터랙션(제스처·상태 전환). 이모지 금지·결정론 유지 |

> URL 라우트 = ROUTES에서 `app/src/app` 접두를 제거한 경로 (예: ROUTES `app/src/app/landing-evolve/r1/` → URL `/landing-evolve/r1/<v>`). §3 gate.mjs `--routes`·§4 스크린샷의 <라우트>는 이 URL을 쓴다. (native는 URL이 아니라 §3에서 `--screens <slug>`, §4에서 `EXPO_PUBLIC_SCREEN=<slug>` 렌더를 쓴다.)

## 1. RETRIEVE
다음을 전부 읽어 생성 컨텍스트를 구성한다:
- BRIEF 전문 (정본 — 읽기 전용)
- DELTAS 전체 (격리 delta — status가 refuted가 아닌 최신 entry들)
- `vault/00-principles/curation-criteria.md` (meta-기준 — judge·정제 프롬프트에 주입)
- **참조 카탈로그** (`vault/20-catalog/` — 정량 결정 규칙층; BRIEF가 `[[링크]]`로 가리키는 실체를 여기서 **실제로 읽어 컨텍스트에 싣는다**. 링크만 두면 designer가 로드 못 함):
  - **dash**: `vault/20-catalog/charts.catalog.md`(데이터 타입→차트+a11y등급+SVG↔Canvas 볼륨임계) · `colors.catalog.md`(AA 보정 shadcn 토큰 뱅크) · `ux-guidelines.catalog.md`(Plat=web/both 행) · `motion.catalog.md`(dash 열 ✅/△만 — 연출·시차 ❌)
  - **native**: `vault/20-catalog/ux-guidelines.catalog.md`의 **Native/Mobile 섹션 + Plat=both 행**만 (색=tokens.ts·차트=후속이라 제외, 모션=Reanimated 후속이라 제외)
  - **landing**: `vault/20-catalog/ux-guidelines.catalog.md`(Plat=web/both) + `motion.catalog.md`(landing 열 — framer-motion 연출 적극) — 색/차트는 dash 전용
  - **anti-slop 필터 우선**: 카탈로그 추천이 BRIEF·`curation-criteria`와 충돌하면 BRIEF·DNA가 이긴다
- `vault/30-ledger/auto-ledger.jsonl`에서 해당 타깃 최근 5개 (직전 승자·no-winner 사유)
- 중복 금지 목록 (타깃 파라미터 참조) 정리

## 2. GENERATE — 3병렬
- designer(또는 frontend-design-specialist) 에이전트 3개 병렬 호출. 각자에게: RETRIEVE 컨텍스트 + 서로 다른 아키타입/형태 명시 지정(중복 금지 목록 포함) + 산출 경로.
- 경로: ROUTES`{a,b,c}/page.tsx` (+client 컴포넌트 분리 허용, 자기 폴더만).
- 각 후보의 한 줄 컨셉을 `vault/20-generations/<run>/candidates/<v>.md`에 기록.
- **native의 경우**: designer 3개는 `native/GENERATION.md` + `native/src/tokens.ts`를 입력받아 서로 다른 RN 화면을 `native/src/evolve/r<N>/<v>/`에 생성(웹 라우트 아님). 생성 후 각 후보를 native 블록의 "등록" 규약대로 `native/screens.ts`·`native/screens.json`에 slug `evolve-r<N>-<v>`로 등재한다. check 문자열 = 화면 대표 헤딩(예: "관심목록").

## 3. HARD GATE (하나라도 실패 → 1회 수정 기회 → 재실패 시 탈락)
- dev 서버: 3100 응답 확인(`curl -s -o /dev/null -w '%{http_code}' http://localhost:3100/`), 없으면 `cd app && npm run dev` 백그라운드 기동(이 라운드가 띄웠으면 마지막에 종료). gate.mjs 웹 브랜치가 sweep·Lighthouse 대상으로 3100을 쓴다.
- **후보별 게이트**: 각 후보 v ∈ {a,b,c}에 대해 `node scripts/gate.mjs --target web --routes /<TARGET>-evolve/r<N>/<v>` 실행 → 공통 판정 verdict `{pass, gates:[{name:'static',…},{name:'sweep',…},{name:'a11y',…},{name:'perf',…}], violations}`. 디스패처가 정적(이미지 규칙 3종 포함 — 원시 img·alt 누락·unoptimized)·sweep(전 폭 오버플로, 랜딩도 동일 그리드 룰)·a11y·perf를 전부 실행·판정한다.
- **1-fix 루프**: `pass:false`면 `verdict.violations`(위반 상세 — `gate`명 + file/route/line 태그)를 해당 designer v에 전달해 **1회 수정** 후 같은 명령 재실행. 재통과 → 생존, 재실패 → 탈락. (후보별 단일 라우트라 violations가 전부 그 후보 소속 — demux 불필요.)
- **게이트 기준**(디스패처 강제, SKILL 별도 규칙 불요): a11y < 95 = 하드페일 / Lighthouse 실행 불가 = `unavailable`(하드페일 아님) / perf = 항상 통과(기록만 — dev 서버 측정치 탈락 미적용).
- 각 후보 `verdict.gates`를 `vault/20-generations/<run>/SCORES.md`에 표로 기록.
- **native의 경우**: 3100 dev 서버 불요(gate.mjs native 브랜치가 Expo Web 8091을 자체 export·serve). `node scripts/gate.mjs --target native --screens evolve-r<N>-a evolve-r<N>-b evolve-r<N>-c` → verdict(후보×4게이트 `<slug>/<tsc|export|render|iframe>`). `pass:false`면 `verdict.violations`(screen/step 태그)를 해당 후보 designer에 1회 수정 후 재호출. 화면별 4단계 전부 pass여야 그 후보 생존.

## 4. JUDGE 패널 (생존 후보 2개 이상일 때; 1개면 단독 심사로 승자/no-winner만 판정)
- 스크린샷: 후보별 4폭 캡처 → `npx playwright screenshot --viewport-size=<w>,900 http://localhost:3100<라우트> vault/20-generations/<run>/shots/<v>-<w>.png` (w ∈ 1280, 1440, 1920, 390).
- **native의 경우**: 후보별 Expo Web 모바일 렌더 스크린샷 — `cd native && EXPO_PUBLIC_SCREEN=evolve-r<N>-<v> npx expo export --platform web --output-dir dist --clear` → `npx serve dist -l 8091` → `npx playwright screenshot --viewport-size=<w>,844 http://localhost:8091/ vault/20-generations/<run>/shots/<v>-<w>.png` (w ∈ 390, 768 모바일·태블릿폭, 데스크톱 폭 대신). judge 렌즈는 native 블록 표(DNA/모바일 완성도/화면유형 차별)를 따른다. 집계·기권·no-winner 규칙은 웹과 동일.
- judge 3개 병렬(Agent 도구, comparator 계열). 공통 입력: 스크린샷 + 소스 경로 (컨셉·순서 비공개 — 블라인드). 렌즈는 타깃 파라미터 표를 따른다 (렌즈 1=정본 대조, 렌즈 2=상용 완성도, 렌즈 3=구조 차별성).
- 렌즈2 심사 축(에셋·인터랙션 풍부도): 생성형/이미지 에셋을 의미있게 썼는가, 인터랙션이 데코가 아니라 정보·전환에 기여하는가, 타깃 절제선(dash=서비스급 / landing=표현적)을 지켰는가. **장식 과잉·의미없는 모션은 감점**(v2세대 탈락 사유 재발 방지).
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
- auto-ledger append: `{target:'<TARGET>', round:'auto-<TARGET>-r<N>', date:'<YYYY-MM-DD>', winner:'<v>'|null, no_winner:<bool>, hardgate:{sweep:'...', static:'...', lighthouse:'...'}, judges:{lens1:'<v>',lens2:'<v>',lens3:'<v>'}, refuted:null}` → `vault/30-ledger/auto-ledger.jsonl`. **hardgate 3키는 §3 후보별 verdict.gates에서 소싱**한다(스키마 불변): `static`←static gate detail 요약, `sweep`←sweep gate detail 요약, `lighthouse`←a11y gate detail(+ perf gate detail 기록) 요약.
- **native의 경우** ledger entry의 `hardgate`는 4키 `{tsc:'...', export:'...', render:'...', iframe:'...'}` (웹의 static/sweep/lighthouse 대신) — §3 후보별 verdict.gates(후보×4단계)에서 소싱. 나머지 필드(`target:'native'`, `round:'auto-native-r<N>'`, winner/no_winner/judges/refuted)는 동일 스키마.
- **index.md 갱신**: `vault/index.md`의 "세대 기록" 섹션에 `- [[DECISION]]` 형태로 이번 run의 DECISION을 등재 (경로 포함형: `[[20-generations/<run>/DECISION|<run>]]`).
- no-winner면 사유를 DECISION.md에 남기고 후보 route 유지(주간 반증에서 일괄 드롭).
- `git add -A && git commit -m "feat(dash-evolve): <TARGET> r<N> <승자 v — 아키타입/형태 | no-winner>"` (+ Co-Authored-By 푸터) → `git push origin evolve/dash`.
