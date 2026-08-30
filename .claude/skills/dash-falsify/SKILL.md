---
name: dash-falsify
description: 자율 진화 주간 반증 (다중 타깃) — evolve/dash 누적분으로 대시보드·랜딩·네이티브 섹션의 반증 PR 생성(open 모드, 무인) / 사람 리뷰 결과 반영+위키 갱신+squash merge(apply 모드). "/dash-falsify open", "/dash-falsify apply", "반증 PR", "주간 리뷰 반영" 시 사용.
---

# dash-falsify — 주간 반증 (이중 타깃)

인자: `open`(기본) 또는 `apply`.

## open 모드 (무인 — 주간 routine)
1. `git fetch && git log origin/main..origin/evolve/dash --oneline` — 누적 커밋이 없으면 "반증할 산출물 없음" 로그만 남기고 종료. 누적 커밋이 있으면 이후 모든 파일 읽기(auto-ledger·provisional·questions-queue·DECISION.md·index.md)는 evolve/dash 컨텍스트에서 한다 — `git checkout evolve/dash` 또는 `git show origin/evolve/dash:<경로>` (main 워킹트리에서 읽으면 본문이 빈 채 조립된다).
2. PR 본문 조립 — **타깃별 섹션**. **링크는 반드시 클릭 가능한 GitHub URL로 생성** — evolve/dash 브랜치 파일은 PR 화면에서 경로 텍스트로는 안 보이므로 판정/스크린샷을 사람이 못 본다. 형식: DECISION·개별 PNG = `https://github.com/<owner>/<repo>/blob/evolve/dash/<경로>`, 샷 폴더 = `https://github.com/<owner>/<repo>/tree/evolve/dash/<경로>` (owner/repo는 `gh repo view --json owner,name`로 확인). 라운드별로 세 링크를 표에 넣는다: [DECISION](blob DECISION.md) · [승자 대표샷](blob `shots/<승자v>-1440.png`, 모바일 타깃은 `-390.png`) · [전체샷](tree `shots/` 폴더).
   - `## 대시보드` / `## 랜딩` 각각: 주간 라운드 표(auto-ledger에서 해당 target entry(target 필드 없는 레거시 entry는 round id `auto-<t>-r*`에서 유추)), L3 delta 편입 제안(해당 DELTAS에서 **`(round, variant, level)` 키로 종결(promoted/refuted)되지 않은** 최신 level=L3 & status=provisional. 열린 L3가 0건이면 "L3 편입 제안 없음"을 명시하고, 재현 조건을 이미 충족한 L2를 "사람 판단 요청"으로 함께 올린다 — 그러지 않으면 승격 대기 중인 L2가 매주 잔류 요약에 묻힌다), L1/L2 잔류 요약, 라운드별 위 3-링크(DECISION·승자샷·전체샷). 해당 타깃 라운드가 없던 주면 섹션에 "이번 주 라운드 없음" 1줄.
   - `## 네이티브`: 위와 동형 — 라운드 표(`auto-native-r*`, 후보별 status 승자/탈락/대기), L3 delta 편입 제안(`vault/00-principles/native-deltas-provisional.jsonl`에서 위와 동일하게 `(round, variant, level)` 키로 미종결인 최신 level=L3 & status=provisional), L1/L2 잔류, 라운드별 3-링크(승자샷은 `shots/<v>-390.png` 모바일). delta·질문·**후보 킵/드롭** 전부 반증 대상.
   - `## 다양성`: `node scripts/catalog-variety.mjs` 결과를 표로 — 테마/액센트/활자 분포와 **직전 주 대비 변화**. 이 절의 목적은 "매주 비슷한 게 나온다"를 인상이 아니라 수치로 남기는 것이다. 한 축이 3주 연속 움직이지 않으면 그 축의 선제 체크가 작동하지 않는다는 뜻이므로 finding으로 올린다.
   - `## 브리프 구멍`: 이번 기간 `candidates/<v>.md`의 `## 브리프에 없던 것` 절을 타깃별로 모아, **2회 이상 반복된 항목만** 표로 올린다(1회는 집계에서 제외 — designer 취향과 구멍이 구분되지 않는다). 열: 항목 · 후보들이 각자 정한 값 · 반복 횟수 · 제안(브리프 어느 절에 넣을지). 반복 0건이면 "이번 기간 반복된 구멍 없음" 1줄.
   - `## 질문 큐`: questions-queue.md "대기 중" 전문 (target 표기 포함).
   - `## 위키 건전성`: ① 기계 — `node scripts/wiki-lint.mjs` 실행 결과 JSON(위반 0이면 "clean") ② 판단 — 페이지 간 모순·stale 주장(최신 delta가 정본과 충돌하는 사례) 스캔 결과를 2~3줄로.
   - `## 리뷰 방법`: "후보 킵/드롭·delta 승인/기각·질문 답변을 PR 코멘트로 남기고 로컬에서 /dash-falsify apply 실행".
3. 열린 반증 PR이 있으면 `gh pr edit`로 본문 갱신, 없으면 `gh pr create --base main --head evolve/dash` (제목: "feat(evolve): 주간 자율 진화 반증 <기간>").

## apply 모드 (로컬 세션 — 사람 리뷰 완료 후)
입력: PR 코멘트(`gh pr view <num> --comments`) 또는 대화로 받은 ① 후보 킵/드롭 ② delta 승인/기각 ③ 질문 답변. 입력 없는 항목은 건너뛴다.
1. **delta 승인 (타깃별 정본 편입 + ingest 파급)** — dash delta는 `dash-brief-v3.md`에, landing delta는 `design-principles.md`에, **native delta는 규칙성이면 `native/GENERATION.md`의 해당 절(§1~§7), 토큰값이면 `native/src/tokens.ts`에** surgical 편입(default GENERATION.md). **편입할 때 그 내용을 참조·인접하는 관련 노트(curation-criteria, 반대 타깃 brief의 공통 룰 등)의 상호참조([[링크]])도 동반 갱신한다** — "1건 편입 = 관련 페이지들 터치". provisional에는 `{...원본, status:'promoted', supersedes:'<round>'}` append — **`round`·`variant`·`level` 3개를 반드시 포함**해 어느 delta를 닫았는지 특정한다. 한 라운드가 서로 다른 level의 delta를 여러 건 낳을 수 있어(예: `auto-landing-r8` = L1 + L2) round만으로 종결하면 **승인하지 않은 delta까지 닫힌 것처럼 보인다**(2026-07-30 실증 — L2만 승인했는데 같은 라운드 L1이 종결로 읽힘). 종결 판정도 round 단위가 아니라 `(round, variant, level)` 키로 한다. **2026-08-15·08-17 두 주 연속 양방향 실측 확인** — 승인하지 않은 delta 가 종결로 읽힌 사례 0건, 편입 완료 delta 가 미종결로 부활한 사례 0건. 같은 라운드(`auto-native-r5/a`)의 L1 과 L2 가 동시에 열린 상태에서 L2 만 승인했을 때 L1 이 열린 채 남았다 — 레벨을 키에 넣은 목적이 달성됐다.
   **정본을 고쳤으면 `node scripts/build-plugin.mjs`를 돌린다.** `page-commission` 플러그인이 `vault/00-principles/*`를 바이트 복사로 번들하므로, 편입만 하고 번들을 안 만들면 드리프트 테스트가 실패한다. **두 번 걸렸다**(2026-08-11 PR #101, 2026-08-14 주간 apply) — 둘 다 "정본 편입 → 커밋" 사이에서 이 한 줄이 빠졌다. 편입 직후에 돌리고, `npm test`를 **커밋 전에** 확인한다.
2. **delta 기각** — provisional에 `{...원본, status:'refuted', supersedes:'<round>'}` append(§1과 동일하게 `round`·`variant`·`level` 필수 — 기각도 delta 단위다) + auto-ledger에 해당 라운드 원본 entry 전체를 spread한 `{...원본, refuted:true, refute_reason:'<사유>'}`를 append(자기완결 줄 유지 — 같은 round의 최신 줄이 유효). **refute rate**(기각된 judge 승자 / 전체 승자 판정, 타깃 통합)를 계산해 40% 초과면 "judge 렌즈 개선 필요" finding을 사용자에게 보고.
3. **질문 답변** — 답변에서 재사용 가능한 정제 기준을 추출해 curation-criteria.md "축적된 기준"에 append, 해당 질문은 questions-queue.md 아카이브로 이동.
4. **신규 타입 복수 킵의 라우트 규칙 (2026-08-09 신설)** — 타입 프로파일이 없던 신규 타입은 그동안 전부 1작품만 승격돼 `/blog`·`/catalog`처럼 **타입명 라우트 하나**였다. 한 타입에서 2개 이상을 킵하면 **라운드 순으로 `/<type>` · `/<type>-2` · `/<type>-3`**을 쓴다(첫 사례: careers r1→`/careers`, r2→`/careers-2`, r3→`/careers-3`). dash의 `/dash/dN` 하위 디렉토리 방식을 쓰지 않는 이유는 `/dash`와 달리 이 타입들에는 색인 페이지가 없어 `/<type>` 자체가 404가 되기 때문이다.
4. **후보 킵/드롭** — dash 킵: `git mv app/src/app/dash-evolve/r<N>/<v> app/src/app/dash/d<다음>` + `/dash` 갤러리 등재(works.ts `DASH_LAB_WORKS`). landing 킵: `git mv app/src/app/landing-evolve/r<N>/<v> app/src/app/(marketing)/v<다음>` + works.ts `LANDING_WORKS` 등재. **두 경우 모두 새 작품 entry에 (a) 도메인 `category`(**`works.ts` 의 `PAGE_TYPES` 유니온에 있는 값만 쓴다** — 목록을 여기 복사해 두지 않는다. 없는 값을 쓰면 `next build` 가 타입 에러로 죽는다(2026-08-17 실사고: 이 자리에 `project`/`scheduling`/`ops`/`finance`/`analytics` 라는 **존재하지 않는 카테고리 목록**이 적혀 있었고, 그대로 `scheduling` 을 넣었다가 빌드가 깨졌다). 대시보드 승격은 `dashboard`, native 는 `mobile` 이 기본이다. 없으면 갤러리 필터 칩에서 누락) (b) `desc:{en,ko}` 이중언어(en 우선, ko는 참고 번역) 부여**, `works.ts`의 `LAST_UPDATED`를 오늘 날짜 문자열로 갱신. **챔피언(`/`) 교체는 사용자가 명시적으로 지시할 때만.** 드롭: 해당 후보 디렉토리 삭제. **native 킵**: `git mv native/src/evolve/r<N>/<v> native/src/<name>/`(`<name>`=semantic 폴더명 — watchlist/match 관례, 승자 도메인 도출) + **이동 직후 상대경로와 헤더 경로를 고친다**: 후보는 `native/src/evolve/r<N>/<v>/`에 살아 `import { tokens } from "../../../tokens"`인데, 승격 위치는 한 단계 얕아 **`"../tokens"`가 맞다**. 헤더 주석의 옛 경로도 같이 고친다. **`scripts/native-promotion.test.mjs`가 둘 다 강제하므로 빠뜨리면 `npm test`가 파일과 종류를 지목하며 실패한다.** (`n4`·`n6`·`n7`·`r7/a` **네 번 연속** 손으로 잡았다 — 절차에 적혀 있는데도 그랬으므로 2026-08-17에 계측을 붙였다. 임포트는 `tsc`가 늦게라도 잡지만 **헤더 경로는 아무도 안 잡아**, `account`·`offer-thread`가 승격 뒤로도 자기 위치를 후보 경로로 적어 두고 있었다.) + `native/src/screens.ts`(import + `COMPONENTS["<name>"]` — **`native/screens.ts`가 아니다**, 2026-08-04 최초 native 라운드에서 확인)·`native/screens.json`(`"<name>":{"check":"<영문 검사문자열>"}` — GENERATION.md §영문전용에 따라 렌더 영문 substring)에 permanent 슬러그 등재(이동한 evolve 슬러그 `evolve-r<N>-<v>` 등록은 제거) + **`bash native/scripts/build-gallery-web.sh`로 Expo web 정적 번들 재빌드(새 화면이 `app/public/native-app/`에 포함)·`app/public/native-app/` 재커밋** + `NATIVE_WORKS`에 `{id:'n<다음>', route:'/native-app/index.html?screen=<name>', brand:'<영문 화면명>', desc:{en:'…(auto-native-r<N> 승자)', ko:'…'}, target:'native', category:'mobile'}`(**`previewH`를 넣지 마라** — 카드 높이는 전 작품 공통 기본값 300이다. 이 자리에 있던 `previewH:520`은 카드 표준화(2026-08-01 #69~#71, 모든 previewH 오버라이드 제거) 이전 값이라 그대로 따르면 native 카드 하나만 220px 길어진다 — 2026-08-04 `n4`에서 실제로 발생) append(**라이브 iframe — PNG·`image` 필드 아님**; ①(PR#25)로 S3a PNG→라이브 Expo 전환, WorkCard가 `category==="mobile"`로 모바일 iframe 렌더)(+ `works.ts` `LAST_UPDATED` 오늘 날짜). **native 드롭**: `native/src/evolve/r<N>/<v>` 삭제 + evolve 슬러그를 `native/screens.{ts,json}`에서 제거. 한 라운드 evolve 슬러그(`evolve-r<N>-{a,b,c}`)는 승격/드롭으로 **전부 소진**(evolve/dash screens 무한 축적 방지).
   - **프리뷰 플래그 (웹 킵 공통)** — 새 작품이 카드에서 어떻게 렌더될지 결정하는 `Work` 플래그를 함께 판단한다. 기본값(둘 다 끔)은 2400px 높이 iframe에 페이지를 그려 창을 미끄러뜨리는 방식이고, 이는 **뷰포트 높이를 무시하는 레이아웃에서만** 맞다.
     - `singleScreen: true` — 스크롤하지 않고 한 화면에서 끝나는 페이지(login·404 계열).
     - `viewportPreview: true` — 섹션을 뷰포트 단위로 짠 페이지(`min-h-dvh`/`h-screen` + 세로 중앙 정렬). **`scene` 타입은 정의상 여기 해당한다.** 안 켜면 2400px 뷰포트에서 히어로 하나가 2400px이 되고 중앙 정렬된 콘텐츠가 카드 창 아래로 내려가, 카드가 검은 여백만 보인다(2026-08-02 `sc1` 실증).
     판별: `grep -E "min-h-dvh|min-h-screen|h-screen" <승격경로>` 결과가 `items-center`/`justify-center`와 같은 줄에 있으면 `viewportPreview`. 루트 래퍼 한 줄뿐이면 불필요.
4-0. **승격본 스펙 등재 (필수)** — 킵한 작품은 **같은 PR에서** `app/src/lib/specimen-specs.data.json`에 상세 스펙을 넣고 `scripts/specimen-spec-schema.mjs`의 `SUBSET_IDS`에 id를 추가한다. `scripts/specimen-works-coverage.test.mjs`가 **`works.ts`를 진실 집합으로** 두고 강제하므로, 빠뜨리면 `npm test`가 그 작품 id를 지목하며 실패한다.
   **왜 절차에 넣었나**: 스펙은 그동안 사후 배치로 메웠고, 2026-08-14에 48/48을 채운 바로 다음 주 승격(`v12`·`n8`·`n9`)이 3작품 구멍을 다시 냈다. 기존 `specimen-subset-complete` 테스트는 `SUBSET_IDS`와 데이터 파일만 대조하는데 **둘 다 손으로 유지하는 목록이라, 승격을 빠뜨리면 양쪽이 완벽히 일관된 채로 갤러리에 "Full spec coming soon"이 뜬다.** 규칙을 절차에만 적으면 같은 일이 반복되므로 계측을 함께 둔다.
   **값은 실측으로 채운다** — 소스를 읽어 추정하지 마라:
   - **테마·색**: 렌더된 픽셀에서 뽑는다(`getComputedStyle`로 배경·전경 빈도 집계). 소스 정규식은 반투명 오버레이를 라이트 캔버스로 오판한다([[curation-criteria]] Q26).
   - **활자·웨이트·스케일**: 렌더 실측. 클래스를 세면 클래스 없는 기본 굵기를 못 본다.
   - **hex**: Tailwind 유틸리티를 쓴 곳은 v4 토큰값과 대조한다(손 변환은 틀린다 — 네 배치 183건 중 1건 오차가 그렇게 났다). 리터럴은 리터럴대로 적되 같은 라우트에서 유틸리티와 어긋나면 그 사실을 적는다.
   - 스키마는 `validateSpec`으로 확인한다(palette ≥3 · dosDonts ≥3 · 네 서술 필드).
   native 작품은 웹과 같은 스키마를 쓰되 폭 390에서 측정한다.

3-1. **`self_judged` 라운드는 승격 후보에서 제외한다 — delta 만 검토한다.** 원장 entry 에 `"self_judged": true` 가 있거나 DECISION 첫 절에 서브에이전트 부재 편차가 고지된 라운드는, **판정이 블라인드·독립이 아니므로 승자를 카탈로그에 올리지 않는다.** 후보를 **드롭하지도 않는다** — 판정이 유효하지 않으면 승자도 패자도 그 판정으로 처분할 수 없다. 후보 디렉토리를 그대로 두고 DECISION 에 보류 사유를 기록한다.
   **delta 는 별개다.** delta 가 렌즈 순위가 아니라 **실측·격리 실험**에 근거하면 채택한다 — `auto-dash-r20/a` 의 이중 `overflow-x-auto` 누출은 한 후보 안 A/B 토글로 격리된 사실이고, 판정 방식과 무관하다. 렌즈 인용이 유일한 근거인 delta 는 같이 보류한다.
   **재배정 큐에 넣지 마라** — 이 보류는 형태 탈락도 규칙 위반도 아닌 **절차 결함**이라, 형태를 다시 만들게 하는 처방이 어긋난다. 근본 원인은 `/dash-evolve` §0-0 가드가 막는다. ([[questions-queue]] Q47 · 2026-08-29 첫 적용)

4-0-1. **킵하지 않은 후보의 사유를 가른다 — 형태 탈락인가, 규칙 위반인가.** 드롭 사유가 **형태가 아니면**(a11y 감사 1건 · 카피 언어 · 웨이트 등 규칙 위반) 소스는 지우되 **형태를 `vault/00-principles/reassign-queue.md` "대기 중"에 등재한다** — 탈락 사유·형태가 살아 있는 근거·배정문에 넣을 문장을 함께 적는다. `/dash-evolve` §1 이 이 파일을 읽어 다음 라운드가 후보 하나에 배정한다.
   **왜 파일인가**: [[curation-criteria]] 가 2026-08-24 에 *"게이트 탈락은 형태 판정이 아니다"* 를 세웠지만 **그 결정을 읽는 단계가 없어 2연속 놓쳤다**(`landing r14/c`→r15, `dash r18/c`→r19). 결정을 산문에만 적으면 다음 라운드에 닿지 않는다.

4-1. **승격본 검사 (필수) — 게이트 + lint 둘 다.** 킵한 작품을 옮긴 직후 **승격된 라우트에 게이트를 다시 돌린다**:

   ```bash
   node scripts/gate.mjs --target web --routes /<새 라우트>      # 예: /v17 · /dash/d50 · /careers-4
   node scripts/gate.mjs --target native --screens <name>        # native 킵은 permanent 슬러그로
   ```

   **왜 승격 후에 또 돌리나**: 후보는 evolve 경로(`/landing-evolve/rN/v`)에서만 게이트를 받았다. `git mv` 자체는 내용을 안 바꾸니 그 시점까지는 안전하지만, **§4의 이동·경로 수정·§4-0 스펙 작업이 전부 그 뒤에 온다.** 2026-08-24 apply 에서 실제로 물렸다 — `v16` 헤더를 보수하면서 `font-semibold` 가 들어가 웨이트가 4종이 됐고, 손으로 렌더를 재서야 잡았다. 오래도록 이걸 못 돌린 이유는 게이트가 라우트 그룹을 못 봐 `(marketing)/v*` 에서 ENOENT 로 죽었기 때문이고, **그 결함은 2026-08-25 에 고쳐졌다**([[questions-queue]] Q45 · `172ceaf`·`0fe47d5`). 이제 돌아가니 돌린다.

   **`pass` 만 보지 마라 — 기록 전용 관문의 `detail` 을 눈으로 읽는다.** 위 사고에서 실제로 문 것은 `weights` 인데 그 관문은 `pass:true` 고정이다. 같은 소급 스캔에서 **챔피언 `/`(v0)도 웨이트 4종**으로 드러났고, pass/fail 만 봤다면 둘 다 못 잡았다. 최소한 `weights` 의 종수와 `perf` 점수는 읽고 넘어간다. (native 게이트는 `tsc·export·render·iframe` 4관문뿐이라 읽을 기록 전용 항목이 없다 — 웨이트를 안 재는 것은 별건이다.)

   비용은 라우트당 약 6분(tsc·lint·sweep·Lighthouse 2회)이다 — 2026-08-25 에 12작품을 이 방식으로 소급 스캔해 실측했다. dev 서버 3100 이 필요하다(§4 다른 단계와 동일).

   **그다음 `cd app && npx eslint src --max-warnings=0`** 을 돌려 위반 0을 확인한다. 게이트의 `lint` 관문은 **스코프 파일만** 보므로 이것과 겹치지 않는다 — 승격이 다른 파일(`works.ts`·`screens.ts`·스펙 데이터)을 건드리기 때문에 전체 `src` 검사가 따로 필요하다. 라운드는 통과했는데 카탈로그에 lint 에러가 들어오는 일이 두 번 반복됐다(2026-08-01 `auto-404-r1` 승격: effect 내 setState + 원시 `<a>` 2건). 게이트가 안 보는 것은 승격이 봐야 한다.

5. **위키 마감** — index.md에 승격/신규 노트 등재 반영 → `node scripts/wiki-lint.mjs` 재실행, 위반 0 확인(승격이 만든 깨진 링크·미등재 즉시 수정).
6. 반영 커밋(evolve/dash) → `cd app && npx next build` 통과 확인 → `gh pr merge <num> --squash` (PR 제목 conventional 확인. `--delete-branch` 금지 — evolve/dash는 상시 브랜치).
   **머지 전 범위 확인 (2026-08-11 신설)** — 머지 직전에 `git log origin/main..origin/evolve/dash --oneline`을 **다시** 돌려, 브랜치가 PR 본문이 다룬 라운드와 같은 범위인지 본다. **PR을 연 뒤 머지하기 전에 착지한 야간 라운드는 아무도 안 본 채 딸려 들어간다** — §6의 정합 분기는 *머지 후* 신규 커밋만 보므로 이 창을 못 막는다.
   실사고: PR #98을 4라운드 기준으로 열었는데 그 사이 `auto-native-r2`·`auto-contact-r2`가 착지해, 머지 시점 브랜치에는 **6라운드**가 있었다. 승격은 승인된 4종만 했으나 **두 라운드의 DECISION·delta·원장 항목·후보 코드가 전부 미리뷰로 main에 들어갔고**, 그 뒤 `evolve/dash`에 diff가 없어 정상 반증 PR을 열 수 없게 됐다(승격 PR로 우회).
   범위가 다르면 둘 중 하나다 — **본문을 갱신해** 새 라운드까지 리뷰 대상에 넣거나, 그 커밋들을 **다음 주로 미룬다**. 조용히 머지하지 않는다.
   **미루는 쪽은 대개 불가능하다.** 2026-08-17 에 이 확인이 처음 발동했을 때 둘을 실제로 저울질했는데, apply 커밋이 이미 새 라운드 **위에** 얹혀 있었고 `native-deltas-provisional.jsonl`·`questions-queue.md` 를 그 라운드와 **같이** 건드리고 있었다 — 분리하려면 append-only 원장과 질문 큐에서 충돌을 손으로 풀어야 하고, 그 과정이 delta 종결 행을 어긋나게 할 위험이 종결 키 규율을 깨는 방향이었다. **기본은 본문 갱신이고**, 미루기는 apply 를 아직 시작하지 않았을 때만 값이 있다.
   **머지 후 브랜치 정합** — 머지한 evolve/dash head를 `$MERGED`로 두고 `git fetch origin` 후 **origin/main 으로 리셋한다. 경로는 하나뿐이고, `git rebase` 는 어떤 형태로도 쓰지 않는다.**
   - 먼저 `git checkout -B evolve/dash origin/evolve/dash` (반드시 origin 기준 재설정 — 낡은 로컬 브랜치를 밀면 그 사이 착지한 야간 커밋이 유실된다, 2026-07-15 실사고).
   - **리셋 대상은 `origin/main`이다 — 로컬 `main`이 아니다.** 방금 `gh pr merge`로 머지했으면 **origin은 앞서 있고 로컬 `main`은 그 직전 세대**다. 소스(`origin/evolve/dash`)만 origin으로 잡고 타깃을 로컬 `main`으로 쓰면 **방금 머지한 apply 전체가 빠진 커밋으로 브랜치를 밀게 된다**(2026-08-14 실사고 — `origin/main` 08cb20f 인데 로컬 `main`은 한 세대 전 314f8f1 이었다). 유실은 아니지만(내용은 origin/main 에 있다) 다음 라운드가 낡은 베이스 위에서 돈다. 아래 명령의 `main`을 전부 `origin/main`으로 읽고, 헷갈리면 `git fetch origin && git rev-parse --short main origin/main` 으로 두 값이 같은지 먼저 본다.
   - `git log $MERGED..origin/evolve/dash --oneline` 이 **비어 있어야 한다.** 비어 있으면 무손실을 먼저 증명하고 — `git diff $MERGED origin/main` 이 비어 있거나 **main 우위 변경만** 있어야 한다(main이 먼저 받은 스킬/설정 수정이 evolve/dash에 없는 경우가 있다) — `git reset --hard origin/main` → push.
     squash 머지 뒤 `git rebase main`을 쓰면 이전 커밋들을 재생하면서 **apply가 삭제한 후보 디렉토리를 되살리고 `vault/index.md`에서 충돌한다**(2026-07-30 실증 — abort 후 reset으로 우회). 그래서 정합은 reset 하나뿐이다.
   - **비어 있지 않으면 멈추고 보고한다.** 자동 복구를 시도하지 마라 — 그 커밋들은 머지 안 된 야간 라운드이고, `reset --hard` 는 그것을 지운다.
     여기 한때 `git rebase --onto origin/main $MERGED` 레시피가 있었으나 **8번의 apply 동안 한 번도 실행되지 않아 삭제했다**(2026-07-31·08-01·08-02·08-09·08-11·08-14·08-15·08-17 전부 reset 경로 — reflog 로 확인). 리허설된 적 없는 레시피를 1년에 한 번 시간 압박 아래 실행하는 것이, 멈추고 사람이 보는 것보다 위험하다. **안전을 지키는 것은 레시피가 아니라 이 확인이다.**
     실제로 야간 커밋이 apply 도중 착지할 창은 분 단위다 — 발화는 18:00 UTC 고정이고 apply 는 한 세션 안에서 끝난다. 정말 그 창에 걸리면 `$MERGED` 이후 커밋만 보존해 옮기면 되지만, 그 판단은 그때 상황을 보고 한다.
   - push 는 `git push --force-with-lease=evolve/dash:$MERGED origin evolve/dash` — lease를 **명시**한다. 맨 `--force-with-lease`는 로컬 원격추적 ref가 낡았을 때 야간 커밋을 조용히 덮는다.

## 금지
- open 모드에서 어떤 파일도 수정하지 않는다 (PR 생성/갱신만).
- apply 모드에서 사람 입력 없는 delta를 임의로 승인/기각하지 않는다.
