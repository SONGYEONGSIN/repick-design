---
name: dash-evolve
description: 자율 진화 라운드 N회 (기본 1, 최대 3 · 다중 타깃 — works.ts PAGE_TYPES 순서대로 카탈로그에 없는 페이지 타입을 우선 생성하고, 전부 차면 대시보드·랜딩·네이티브 중 무작위) — 정본 brief+격리 delta로 후보 3개 생성 → 하드게이트(gate.mjs --target web: 정적·sweep·a11y·perf) → 3렌즈 judge 다수결 → delta 격리 적재 → 정제 게이트 → evolve/dash 커밋. 인자로 라운드 수(1~3, 기본 1)를 받는다 — `/dash-evolve 3`. "/dash-evolve", "자율 라운드" 시 사용. 무인 실행 전제 — 사람 확인 없이 완주하며 no-winner 라운드를 허용한다.
---

# dash-evolve — 자율 라운드 (무인, 이중 타깃)

인자: 실행할 라운드 수 `N` (1~3, 기본 1).

## 연속 라운드 — 순차만, 병렬 금지

`N`이 2 이상이면 §0~§7을 **처음부터 끝까지 N번 반복**한다. 라운드 사이에 건너뛰는 단계는 없다.

**반드시 순차로 돈다.** 이 루프의 값어치는 라운드가 낳은 delta·질문이 다음 라운드의 §1 RETRIEVE로 들어가 브리프를 바꾸는 데 있다. 병렬로 돌리면 N개 라운드가 전부 **같은 시점의 delta 위에서** 만들어져 폭만 넓어지고 축적이 사라진다 — 실측 근거: `auto-login-r1`의 대비 delta가 `auto-404-r1`의 브리프에 실렸고, 3파전 완전 동률이 2주 연속 나온 뒤 넣은 "3렌즈 동시 만족" 지시가 그 다음 라운드에서 다수결을 만들었다. 둘 다 이전 라운드의 산출물이 다음 라운드를 바꾼 사례다.

라운드마다 다음이 갱신된 상태로 시작해야 한다:
- **타깃**: §0의 `PAGE_TYPES` 미채움 조회를 매 라운드 다시 실행하되, **이번 실행에서 이미 생성한 타입은 제외**하고 큐의 다음 항목으로 내려간다. 승격은 `/dash-falsify apply`에서 일어나므로 카탈로그 조회만으로는 같은 타입이 계속 뽑히고, 그러면 `N`을 올려도 커버리지가 한 칸도 안 늘어난다 — 연속 실행의 목적이 정확히 커버리지다. 예: 미채움이 `catalog → scene → product-detail`일 때 `/dash-evolve 3`은 세 타입을 하나씩 돈다.
- **DELTAS·questions-queue**: 직전 라운드가 append한 내용을 포함해 다시 읽는다.
- **다양성 금지 축**: `scripts/catalog-variety.mjs`를 다시 실행한다. 직전 라운드 승자가 아직 카탈로그에 없으므로 `banList`는 그대로일 수 있지만, 그 라운드가 쓴 테마·액센트·활자는 designer 프롬프트에 **"직전 라운드가 쓴 축"**으로 별도 전달해 연속 라운드가 서로 베끼지 않게 한다.

**상한 3.** 라운드 하나가 후보 3개 생성 + 게이트(정적·sweep·Lighthouse 6회) + judge 3개 + 정제다. 그 이상은 한 번에 검토할 수 있는 산출물의 양을 넘고, 주간 반증 PR이 사람이 읽을 수 없게 커진다.

**불변식: 정본 2개(`vault/00-principles/dash-brief-v3.md`, `vault/00-principles/design-principles.md`)와 `/dash` 갤러리·`/v1~v5`는 절대 수정하지 않는다. jsonl은 append-only. main에 커밋하지 않는다.**

## 0. 준비 — 타깃 선택
- 브랜치: `git checkout evolve/dash` (없으면 `git checkout -b evolve/dash`).
- **native 주기 (주 1회 고정)** — `N`이 2 이상인 실행에서 **월요일이면 첫 라운드의 타깃을 무조건 `native`로** 두고, 나머지 라운드만 아래 미채움 큐를 따른다. `N=1`이면 그날은 native 한 라운드만 돈다.

  ```bash
  # 오케스트레이션 시각 판단 — 후보 코드의 결정론 규칙과 무관
  IS_NATIVE_DAY=$(node -e "console.log(new Date().getUTCDay() === 1 ? 1 : 0)")
  ```

  **왜 고정 주기가 필요한가**: 미채움 큐 우선 규칙 아래에서 native는 **영영 뽑히지 않는다.** `mobile`은 이미 카탈로그에 차 있어 미채움 목록에 없고, native는 미채움이 0이 된 뒤에야 dash/landing/native 균등 난수로 1/3 확률을 얻는다. 2026-08-06 기준 미채움 8종이 남아 있었고, 그 사이 `auto-native-r*`는 **0건**이었다 — 유일한 native 라운드(`auto-native-r1`)는 사람이 수동으로 돌린 것이다.

  결과는 delta 고갈이다. native delta는 L1 1건에서 멈춰 있고, 재현이 없으면 L2로 올라가지 못하므로 **`native/GENERATION.md`가 개선될 통로 자체가 없다**. 웹 정본(`page-brief-core`·타입 프로파일)이 매일 두꺼워지는 동안 native 정본만 정지한다.

  주 1회로 정한 이유: 매일(또는 N의 절반)로 하면 웹 커버리지 진행이 절반으로 느려진다. 주 1회는 native delta가 쌓이기 시작하는 최소 빈도이면서 큐 전진을 크게 늦추지 않는다.

- **타깃 결정 — 미충족 페이지 타입 우선**: 카탈로그에 아직 0건인 페이지 타입이 있으면 **그 타입을 먼저** 뽑고, 없으면 기존 3종(dash/landing/native) 균등 난수로 돌아간다. 균등 난수만 쓰면 이미 12건인 dashboard가 계속 뽑혀 갤러리 다양성이 늘지 않는다.

  ```bash
  TARGET=$(node -e "
  const src=require('fs').readFileSync('app/src/lib/works.ts','utf8');
  const m=src.match(/export const PAGE_TYPES = \[([\s\S]*?)\] as const;/);
  const types=[...m[1].matchAll(/\"([a-z0-9-]+)\"/g)].map(x=>x[1]);
  const has=(c)=>src.includes('category: \"'+c+'\"');
  const unfilled=types.filter(t=>!has(t));
  if(unfilled.length){ console.log(unfilled[0]); }
  else { const base=['dash','landing','native']; console.log(base[Math.floor(Math.random()*base.length)]); }
  ")
  ```

  큐는 **`works.ts`의 `PAGE_TYPES` 배열에서 그대로 읽는다** — 여기에 목록을 복사해 두지 않는다. 예전에는 이 자리에 4개짜리 하드코딩 배열이 있었고, 유니온에는 18종이 있었다. `catalog`·`scene`을 채우고 나면 나머지 10종은 큐에 없어서 **영영 생성되지 않고** dash/landing/native 난수로 되돌아갔다 — 커버리지가 조용히 멈추는 구조였다. 타입을 추가하려면 `PAGE_TYPES`에 한 줄 넣으면 되고, 그것만으로 로테이션에 들어간다.

  결과는 ledger에 기록되므로 재현성은 ledger가 담보한다 (후보 코드의 결정론 규칙과 무관한 오케스트레이션 난수).
  새 타입이 카탈로그에 등재되는 시점은 `/dash-falsify apply`의 킵 결정이므로, 드롭된 타입은 다음 라운드에서 다시 우선 추첨된다 — 의도된 동작이다(성공할 때까지 재시도).
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

### 신규 페이지 타입 파라미터 (login · 404 · catalog · scene — 웹 라우트, 게이트는 dash/landing과 동일)

게이트(`gate.mjs --target web`)는 페이지 타입 중립이므로 **그대로 쓴다**. 달라지는 것은 브리프와 judge 렌즈뿐이다.

| 변수 | login | 404 | catalog | scene |
|---|---|---|---|---|
| BRIEF | `vault/00-principles/brief-login.md` | `vault/00-principles/brief-404.md` | `vault/00-principles/brief-catalog.md` | `vault/00-principles/brief-scene.md` |
| 공통 코어 | 전 타입 `vault/00-principles/page-brief-core.md` 를 함께 읽는다 (프로파일은 코어를 복사하지 않는다) | ← | ← | ← |
| DELTAS | `vault/00-principles/login-deltas-provisional.jsonl` | `vault/00-principles/404-deltas-provisional.jsonl` | `vault/00-principles/catalog-deltas-provisional.jsonl` | `vault/00-principles/scene-deltas-provisional.jsonl` |
| ROUTES | `app/src/app/login-evolve/r<N>/` | `app/src/app/404-evolve/r<N>/` | `app/src/app/catalog-evolve/r<N>/` | `app/src/app/scene-evolve/r<N>/` |
| 중복 금지 | 해당 타입의 기존 카탈로그 작품 + 그 타입 evolve 누적 아키타입 (각 BRIEF §3 아키타입 목록 기준) | ← | ← | 형상·전이 방식이 겹치지 않을 것 (BRIEF §6 렌즈3) |
| judge 렌즈 | 각 BRIEF §6 표를 그대로 사용 (렌즈1=프로파일 준수 / 렌즈2=상용 완성도 / 렌즈3=아키타입 차별성) | ← | ← | ← (단 **다중 프레임 필수** — 단일 프레임 판정 금지) |
| 인터랙션 최소 | **2종** (BRIEF §4) | **1종** (BRIEF §4) | **3종** (BRIEF §4) | **2종** — 장면 자체가 주 인터랙션 |
| 스크롤 연출 | 금지 (한 화면) | 금지 (한 화면) | **허용** — BRIEF §5 제약 준수 | **필수** — 장면이 페이지의 축 (BRIEF §1) |

- DELTAS 파일은 **해당 타입 첫 라운드에서 생성**한다(미리 빈 파일을 만들지 않는다).
- 승격 시 `works.ts` `category`는 타깃 id와 동일한 값(`login`/`404`/`catalog`/`scene`)을 쓴다 — 갤러리 칩이 자동으로 나타난다.

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
- **브리프 구멍 보고 (designer 필수 산출)** — 각 designer에게 컨셉과 함께 **"브리프에 없어서 스스로 정해야 했던 값·규칙"**을 열거하게 하고, 같은 `candidates/<v>.md`에 `## 브리프에 없던 것` 절로 적는다. 항목마다 ① 무엇을 정해야 했나 ② 무엇으로 정했나 ③ 왜 그렇게 정했나(다른 작품 참조 / 관행 / 임의) 세 줄.

  **이 루프는 이미 매일 밤 재현 시험을 돌리고 있는데 그 결과를 안 걷고 있다.** 후보 6개가 브리프만 읽고 만들어지지만, 우리가 재는 것은 후보 품질이지 **브리프 완전성**이 아니다. designer가 무엇을 지어내야 했는지는 그 자리에서만 알 수 있고, 사후에 산출물을 봐서는 "정한 것"과 "브리프가 시킨 것"이 구분되지 않는다.

  수집만 하고 이번 라운드에서 조치하지 않는다 — **같은 구멍이 2회 이상 보고되면** 그때 브리프에 채운다(delta의 재현 임계와 같은 규율). 판정에도 영향을 주지 않는다: judge는 이 절을 보지 않는다(블라인드 유지).

  > 차용: `intranet-style` 스킬의 재현 시험. 스펙만 읽고 만들게 한 뒤 *"스펙에 없어 추정해야 했던"* 지점을 백로그로 뽑아 14건을 채웠다. 그쪽은 사람이 한 번 돌린 시험이고, 이쪽은 매 라운드가 자동으로 같은 시험이 된다.
- **매크로-골격 버킷 선제 체크** — 아키타입 지정 전에 직전 3~5라운드의 매크로 버킷(히어로+단일시각화 / 고정폭레일+세그먼트토글 / 마스터-디테일 …)을 열거해 designer 프롬프트에 "이번 라운드 금지 버킷"으로 넘긴다. 사후 judge 발견에 맡기면 3후보 중 2개가 같은 버킷일 때 그 라운드가 **사실상 2파전**이 되어 통째로 낭비된다 — 막는 비용은 프롬프트 한 줄뿐이다. ([[curation-criteria]] "Q7 판정", 2026-07-31)
- **다양성 축 선제 체크 (테마·액센트·활자)** — GENERATE 전에 `node scripts/catalog-variety.mjs`를 실행해 카탈로그 전체의 테마/액센트/활자 분포와, 최근 승자들의 `banList`를 얻는다. **임계는 여기 적지 않는다** — `catalog-variety.mjs`가 유일한 출처이고, 여기 복사해 두면 스크립트가 바뀔 때 갈라진다(2026-08-02에 실제로 갈라져 있었다). 그 결과를 designer 프롬프트에 **"이번 라운드 금지 축"**으로 넘긴다. 이 세 축은 라운드 하나만 봐서는 절대 안 보이고 카탈로그를 가로질러 세어야만 드러난다 — 2026-08-01 실측에서 **활자 20/20이 한 종**, 액센트는 `violet-hex` 7개, 테마는 대시보드 11/12 라이트 대 랜딩 4/5 다크였다. 강제가 아니라 **회피 목록**이다: 금지 축을 피하면서도 렌즈를 만족시킬 수 없다면 그 이유를 DECISION에 적고 진행한다.
- **승자의 세 축을 원장에 기록** — 라운드 종료 시 `auto-ledger.jsonl` entry에 `variety: {theme, accent, face}`를 넣는다(값은 위 스크립트의 `readWork`로 산출). 기록이 없으면 다음 라운드의 `banList`가 계산되지 않아 이 체크가 첫 회에만 동작하고 만다.
- **디스플레이 활자를 라운드마다 지정** — 후보별로 화이트리스트 3종(`--font-display-grotesk` / `-wide` / `-mono`) 중 **서로 다른 것**을 배정하거나, 최소한 직전 2라운드 승자가 쓴 활자는 제외한다. 활자체는 페이지 인상의 가장 큰 지분인데 `no-next-font`가 추가를 전면 금지하던 동안 **22개 작품이 한 활자로 나왔다**(2026-08-01 실측). 본문·한글은 Pretendard 고정이고 선택은 라틴 디스플레이에 한한다 — 한 작품에 두 종 이상은 금지(`no-unlisted-font`). 활자를 안 바꾸는 선택도 유효하다: 지정은 "이 라운드에서 쓸 수 있는 것"이지 "반드시 써야 하는 것"이 아니다.
- **3렌즈 동시 만족을 명시 요구** — 각 designer에게 "차별성을 완성도와 맞바꾸지 마라: 신규 아키타입을 추구하되 핵심 증명은 상시-노출 기본값으로 두고, 조작은 그 증명을 지연시키는 게 아니라 강화해야 한다"를 넣는다. 3파전 완전 동률이 `auto-landing-r7`·`auto-login-r1` 2주 연속 발동한 원인은 렌즈 결함이 아니라 **후보가 세 렌즈를 동시에 만족시키려 하지 않는 것**이다(규칙을 잘 지킨 후보는 안전해서 차별성이 낮고, 차별성 높은 후보는 규칙을 벗어나 완성도가 낮다). 렌즈 구조 변경은 이 지시를 넣고 **1라운드 더 관측한 뒤** 판단한다. ([[curation-criteria]] "tie-break 예외의 재발 대응", 2026-07-31)
- **native의 경우**: designer 3개는 `native/GENERATION.md` + `native/src/tokens.ts`를 입력받아 서로 다른 RN 화면을 `native/src/evolve/r<N>/<v>/`에 생성(웹 라우트 아님). 생성 후 각 후보를 native 블록의 "등록" 규약대로 `native/screens.ts`·`native/screens.json`에 slug `evolve-r<N>-<v>`로 등재한다. check 문자열 = 화면 대표 헤딩(예: "관심목록").

- **designer 완료를 확인한 뒤에만 §3으로 넘어간다 — 파일 존재는 완료가 아니다.** designer가 비동기로 돌면 산출물을 여러 번에 걸쳐 쓰고, 초안을 디스크에 남긴 뒤 계속 고친다. 완료 알림을 기다리지 않고 진행하면 **낡은 상태를 게이트하고 낡은 프레임으로 판정**하게 된다(2026-08-04 `auto-native-r1` 실증 — 후보 b가 게이트 3분 뒤·스크린샷 2분 뒤에 다시 쓰였고, 판정 중이던 렌즈3이 "후보 파일이 첫 읽기 이후 바뀌었다"고 스스로 감지해 드러났다).
- **게이트 직전에 상태를 동결하고 해시를 기록한다.** 후보 전체의 소스를 이어붙인 SHA-1을 구해 SCORES·DECISION에 남긴다 — 게이트·스크린샷·judge가 같은 산출물을 봤다는 유일한 증거다. 해시가 없으면 사후에 "무엇을 판정했는가"를 특정할 수 없다.
  ```bash
  cat <ROUTES>/*/*.tsx <ROUTES>/*/*.ts | shasum | cut -d" " -f1
  ```
  판정 중 이 해시가 바뀌면 그 라운드는 무효다 — judge를 중단하고 재게이트·재캡처 후 다시 시작한다.

## 3. HARD GATE (하나라도 실패 → 1회 수정 기회 → 재실패 시 탈락)
- dev 서버: 3100 응답 확인(`curl -s -o /dev/null -w '%{http_code}' http://localhost:3100/`), 없으면 `cd app && npm run dev` 백그라운드 기동(이 라운드가 띄웠으면 마지막에 종료). gate.mjs 웹 브랜치가 sweep·Lighthouse 대상으로 3100을 쓴다.
- **후보별 게이트**: 각 후보 v ∈ {a,b,c}에 대해 `node scripts/gate.mjs --target web --routes /<TARGET>-evolve/r<N>/<v>` 실행 → 공통 판정 verdict `{pass, gates:[{name:'static',…},{name:'sweep',…},{name:'a11y',…},{name:'perf',…}], violations}`. 디스패처가 정적(이미지 규칙 3종 포함 — 원시 img·alt 누락·unoptimized)·sweep(전 폭 오버플로, 랜딩도 동일 그리드 룰)·a11y·perf를 전부 실행·판정한다.
- **1-fix 루프**: `pass:false`면 `verdict.violations`(위반 상세 — `gate`명 + file/route/line 태그)를 해당 designer v에 전달해 **1회 수정** 후 같은 명령 재실행. 재통과 → 생존, 재실패 → 탈락. (후보별 단일 라우트라 violations가 전부 그 후보 소속 — demux 불필요.)
- **게이트 기준**(디스패처 강제, SKILL 별도 규칙 불요): a11y < 95 = 하드페일 / Lighthouse 실행 불가 = `unavailable`(하드페일 아님) / perf = 항상 통과(기록만 — dev 서버 측정치 탈락 미적용).
- 각 후보 `verdict.gates`를 `vault/20-generations/<run>/SCORES.md`에 표로 기록.
- **native의 경우**: 3100 dev 서버 불요(gate.mjs native 브랜치가 Expo Web 8091을 자체 export·serve). `node scripts/gate.mjs --target native --screens evolve-r<N>-a evolve-r<N>-b evolve-r<N>-c` → verdict(후보×4게이트 `<slug>/<tsc|export|render|iframe>`). `pass:false`면 `verdict.violations`(screen/step 태그)를 해당 후보 designer에 1회 수정 후 재호출. 화면별 4단계 전부 pass여야 그 후보 생존.

## 3-1. 판정 후 수정 (조건부 허용 — 2026-08-01 결정)

승자 확정 **뒤에** 산출물을 고치는 것은 블라인드 판정을 받은 것과 승격되는 것을 다르게 만든다. 그렇다고 금지하면 **규칙 위반을 알면서 카탈로그에 올리게 된다**(`auto-404-r1`: 3후보 전원이 "폰트 웨이트 3종"을 위반, judge는 비차별적이라 순위에 반영 못 함). 그래서 좁게 허용한다:

- **규칙 위반 해소에 한한다.** 취향·완성도 개선은 금지 — 그건 다음 라운드의 일이다.
- 수정 후 **반드시 재게이트**하고 전 항목 통과를 확인한다.
- DECISION.md에 **"정제 조치" 절로 무엇을·왜 고쳤는지 명시**한다. 기록이 없으면 판정본과 승격본의 차이를 아무도 추적할 수 없다.
- 판정 **순위 자체는 재계산하지 않는다** — 수정이 순위를 바꿀 만한 것이면 그건 규칙 위반 해소가 아니라 재판정 사유다.

## 4. JUDGE 패널 (생존 후보 2개 이상일 때; 1개면 단독 심사로 승자/no-winner만 판정)
- 스크린샷: 후보별로 `node scripts/capture-shots.mjs --route <라우트> --name <v> --out vault/20-generations/<run>/shots` 실행. 4폭(1280/1440/1920/390) × 4 스크롤 지점(0·35·70·100%)을 찍고, 찍기 전에 **스크롤 스루 패스**를 돌려 `whileInView` 계열 리빌을 발동시킨다. 파일명은 스크롤 0 프레임이 기존과 동일한 `<v>-<w>.png`, 나머지가 `<v>-<w>-s35.png` 식이라 기존 DECISION·PR 링크가 그대로 유효하다.
  - **단일 프레임 캡처 금지** — 스크롤 0 한 장은 폴드 아래에 가치가 있는 작품(카탈로그 그리드)이나 스크롤로 장면이 변하는 작품을 평가할 수 없다. 16장을 **찍는** 것은 그대로다 — 전수 캡처는 사후 검증과 PR 링크용이다.
  - **프레임 예산 — judge에게 16장을 다 넘기지 마라. 후보당 3~4장으로 골라 지정한다.** 권장 조합: `<v>-1440.png`(스크롤 0) · 중간 스크롤 1장 · 마지막 스크롤 1장 · `<v>-390.png`. 모바일 전용 결함이 의심되면 390의 스크롤 지점을 하나 더 준다.
    근거는 실측이다 — `auto-contact-r1`에서 세 judge에게 48장을 통째로 넘겼더니 **셋 다 111~130k 토큰에서 판정 없이 중단**했다(렌즈1·2는 각 2회, 렌즈3은 1회). 후보당 3~4장으로 줄이자 셋 다 완주했고 판정 품질은 유지됐다. **캡처 매수와 judge 입력 매수는 다른 문제다.**
    대신 **judge에게 "못 본 범위를 스스로 밝히라"고 요구한다.** 위 라운드에서 셋 다 1920폭 미확인을 자진 명시했고 그것이 DECISION의 판정 커버리지 절이 됐다 — 안 밝히면 부분 판정이 전수 판정으로 읽힌다.
  - 스크립트는 프레임마다 실제 픽셀을 재 **빈 화면을 판정**한다(`blank: true`면 비-zero exit). 하드게이트 4종은 "통과했는데 아무것도 안 그려진" 경우를 잡지 못한다 — 배경 레이어가 캔버스를 덮는 등의 실패는 오직 픽셀로만 드러난다. blank 프레임이 나오면 그 후보는 judge로 보내지 말고 1회 수정 루프로 되돌린다.
- **native의 경우**: 후보별 Expo Web 모바일 렌더 스크린샷 — `cd native && EXPO_PUBLIC_SCREEN=evolve-r<N>-<v> npx expo export --platform web --output-dir dist --clear` → `npx serve dist -l 8091` → `npx playwright screenshot --viewport-size=<w>,844 http://localhost:8091/ vault/20-generations/<run>/shots/<v>-<w>.png` (w ∈ 390, 768 모바일·태블릿폭, 데스크톱 폭 대신). judge 렌즈는 native 블록 표(DNA/모바일 완성도/화면유형 차별)를 따른다. 집계·기권·no-winner 규칙은 웹과 동일.
- judge 3개 병렬(Agent 도구, comparator 계열). 공통 입력: **후보당 3~4 프레임**(§프레임 예산) + 소스 경로 (컨셉·순서 비공개 — 블라인드). 렌즈는 타깃 파라미터 표를 따른다 (렌즈 1=정본 대조, 렌즈 2=상용 완성도, 렌즈 3=구조 차별성).
  - **다중 프레임 판정 규칙**: ① 첫 프레임(스크롤 0)만 보고 "휑하다"고 감점하지 않는다 — 폴드 아래에 가치가 있는 타입(catalog)과 장면이 스크롤로 변하는 타입(scene)은 정의상 한 프레임에 담기지 않는다. ② 렌즈2는 **프레임 간 변화가 서사를 만드는가**를 본다(바뀌긴 하는데 의미가 없으면 감점). ③ 특정 스크롤 지점에서만 나타나는 결함(겹침·잘림·빈 구간)은 그 프레임을 근거로 인용한다.
- 렌즈2 심사 축(에셋·인터랙션 풍부도): 생성형/이미지 에셋을 의미있게 썼는가, 인터랙션이 데코가 아니라 정보·전환에 기여하는가, 타깃 절제선(dash=서비스급 / landing=표현적)을 지켰는가. **장식 과잉·의미없는 모션은 감점**(v2세대 탈락 사유 재발 방지).
- **완료 확인 — 에이전트 종료는 완료가 아니다.** judge는 침묵하며 멈추지 않는다. **정상 완료처럼 보이는 부분 산출**로 끝난다 — `auto-contact-r1`에서 세 렌즈가 각각 "Now the screenshots. Candidate a, 1280 across all scroll positions." 같은 **읽던 중의 한 문장**을 최종 결과로 반환했다. 완료 알림을 신호로 쓰면 그 라운드는 판정 없이 닫힌다.
  산출물이 다음을 **전부** 갖췄을 때만 그 렌즈를 완료로 친다:
  1. **랭킹** 1·2·3위 (또는 no-winner 명시)
  2. **후보별 사유** — 무엇이 갈랐는가
  3. **근거** — `파일:줄` 또는 프레임 파일명. 인상 평가만 있으면 미완료다
  4. **미확인 범위 자진 신고** — 보지 않은 폭·스크롤 지점·소스
  하나라도 없으면 **`SendMessage`로 같은 에이전트를 이어 돌린다. 재디스패치(새로 띄우기) 금지** — 읽은 프레임과 소스를 버리게 되고, 같은 예산을 다시 태우다 같은 지점에서 다시 멈춘다. 이어 돌릴 때는 **무엇이 없는지 구체적으로 적고**, 프레임을 더 줄이고(후보당 3장), "불완전해도 좋으니 판정을 내라 · 확신 없는 부분은 미확인으로 적어라"를 명시한다.
- **재개 횟수 제한 없음 — 기권은 최후다.** `auto-contact-r1`에서 렌즈1·2가 **각각 2회** 재개를 거쳐 완주했다. 이전의 "1회 재디스패치 후 기권" 규칙이었다면 세 렌즈 중 둘이 기권해, 3:0 만장일치로 닫힌 라운드가 단독 렌즈 판정으로 축소됐을 것이다. 재개해도 판정이 안 나오면 그때 해당 렌즈 기권 — 잔여 2렌즈 다수결(동률이면 렌즈 1 우선, 렌즈 1 기권 시 렌즈 2 우선). **기권과 재개 횟수를 DECISION.md에 명시한다.**
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
