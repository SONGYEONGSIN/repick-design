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
1. **delta 승인 (타깃별 정본 편입 + ingest 파급)** — dash delta는 `dash-brief-v3.md`에, landing delta는 `design-principles.md`에, **native delta는 규칙성이면 `native/GENERATION.md`의 해당 절(§1~§7), 토큰값이면 `native/src/tokens.ts`에** surgical 편입(default GENERATION.md). **편입할 때 그 내용을 참조·인접하는 관련 노트(curation-criteria, 반대 타깃 brief의 공통 룰 등)의 상호참조([[링크]])도 동반 갱신한다** — "1건 편입 = 관련 페이지들 터치". provisional에는 `{...원본, status:'promoted', supersedes:'<round>'}` append — **`round`·`variant`·`level` 3개를 반드시 포함**해 어느 delta를 닫았는지 특정한다. 한 라운드가 서로 다른 level의 delta를 여러 건 낳을 수 있어(예: `auto-landing-r8` = L1 + L2) round만으로 종결하면 **승인하지 않은 delta까지 닫힌 것처럼 보인다**(2026-07-30 실증 — L2만 승인했는데 같은 라운드 L1이 종결로 읽힘). 종결 판정도 round 단위가 아니라 `(round, variant, level)` 키로 한다.
2. **delta 기각** — provisional에 `{...원본, status:'refuted', supersedes:'<round>'}` append(§1과 동일하게 `round`·`variant`·`level` 필수 — 기각도 delta 단위다) + auto-ledger에 해당 라운드 원본 entry 전체를 spread한 `{...원본, refuted:true, refute_reason:'<사유>'}`를 append(자기완결 줄 유지 — 같은 round의 최신 줄이 유효). **refute rate**(기각된 judge 승자 / 전체 승자 판정, 타깃 통합)를 계산해 40% 초과면 "judge 렌즈 개선 필요" finding을 사용자에게 보고.
3. **질문 답변** — 답변에서 재사용 가능한 정제 기준을 추출해 curation-criteria.md "축적된 기준"에 append, 해당 질문은 questions-queue.md 아카이브로 이동.
4. **후보 킵/드롭** — dash 킵: `git mv app/src/app/dash-evolve/r<N>/<v> app/src/app/dash/d<다음>` + `/dash` 갤러리 등재(works.ts `DASH_LAB_WORKS`). landing 킵: `git mv app/src/app/landing-evolve/r<N>/<v> app/src/app/(marketing)/v<다음>` + works.ts `LANDING_WORKS` 등재. **두 경우 모두 새 작품 entry에 (a) 도메인 `category`(Specimen 카테고리: `project`/`scheduling`/`ops`/`finance`/`analytics`/`landing`/`mobile` 중 승자 도메인 도출 — 없으면 갤러리 필터 칩에서 누락) (b) `desc:{en,ko}` 이중언어(en 우선, ko는 참고 번역) 부여**, `works.ts`의 `LAST_UPDATED`를 오늘 날짜 문자열로 갱신. **챔피언(`/`) 교체는 사용자가 명시적으로 지시할 때만.** 드롭: 해당 후보 디렉토리 삭제. **native 킵**: `git mv native/src/evolve/r<N>/<v> native/src/<name>/`(`<name>`=semantic 폴더명 — watchlist/match 관례, 승자 도메인 도출) + `native/src/screens.ts`(import + `COMPONENTS["<name>"]` — **`native/screens.ts`가 아니다**, 2026-08-04 최초 native 라운드에서 확인)·`native/screens.json`(`"<name>":{"check":"<영문 검사문자열>"}` — GENERATION.md §영문전용에 따라 렌더 영문 substring)에 permanent 슬러그 등재(이동한 evolve 슬러그 `evolve-r<N>-<v>` 등록은 제거) + **`bash native/scripts/build-gallery-web.sh`로 Expo web 정적 번들 재빌드(새 화면이 `app/public/native-app/`에 포함)·`app/public/native-app/` 재커밋** + `NATIVE_WORKS`에 `{id:'n<다음>', route:'/native-app/index.html?screen=<name>', brand:'<영문 화면명>', desc:{en:'…(auto-native-r<N> 승자)', ko:'…'}, target:'native', category:'mobile'}`(**`previewH`를 넣지 마라** — 카드 높이는 전 작품 공통 기본값 300이다. 이 자리에 있던 `previewH:520`은 카드 표준화(2026-08-01 #69~#71, 모든 previewH 오버라이드 제거) 이전 값이라 그대로 따르면 native 카드 하나만 220px 길어진다 — 2026-08-04 `n4`에서 실제로 발생) append(**라이브 iframe — PNG·`image` 필드 아님**; ①(PR#25)로 S3a PNG→라이브 Expo 전환, WorkCard가 `category==="mobile"`로 모바일 iframe 렌더)(+ `works.ts` `LAST_UPDATED` 오늘 날짜). **native 드롭**: `native/src/evolve/r<N>/<v>` 삭제 + evolve 슬러그를 `native/screens.{ts,json}`에서 제거. 한 라운드 evolve 슬러그(`evolve-r<N>-{a,b,c}`)는 승격/드롭으로 **전부 소진**(evolve/dash screens 무한 축적 방지).
   - **프리뷰 플래그 (웹 킵 공통)** — 새 작품이 카드에서 어떻게 렌더될지 결정하는 `Work` 플래그를 함께 판단한다. 기본값(둘 다 끔)은 2400px 높이 iframe에 페이지를 그려 창을 미끄러뜨리는 방식이고, 이는 **뷰포트 높이를 무시하는 레이아웃에서만** 맞다.
     - `singleScreen: true` — 스크롤하지 않고 한 화면에서 끝나는 페이지(login·404 계열).
     - `viewportPreview: true` — 섹션을 뷰포트 단위로 짠 페이지(`min-h-dvh`/`h-screen` + 세로 중앙 정렬). **`scene` 타입은 정의상 여기 해당한다.** 안 켜면 2400px 뷰포트에서 히어로 하나가 2400px이 되고 중앙 정렬된 콘텐츠가 카드 창 아래로 내려가, 카드가 검은 여백만 보인다(2026-08-02 `sc1` 실증).
     판별: `grep -E "min-h-dvh|min-h-screen|h-screen" <승격경로>` 결과가 `items-center`/`justify-center`와 같은 줄에 있으면 `viewportPreview`. 루트 래퍼 한 줄뿐이면 불필요.
4-1. **승격본 lint 확인 (필수)** — 킵한 작품을 옮긴 직후 `cd app && npx eslint src --max-warnings=0`을 돌려 위반 0을 확인한다. 하드게이트(static·weights·sweep·a11y·perf)에는 **eslint가 없어서**, 라운드는 통과했는데 카탈로그에 lint 에러가 들어오는 일이 두 번 반복됐다(2026-08-01 `auto-404-r1` 승격: effect 내 setState + 원시 `<a>` 2건). 게이트가 안 보는 것은 승격이 봐야 한다.

5. **위키 마감** — index.md에 승격/신규 노트 등재 반영 → `node scripts/wiki-lint.mjs` 재실행, 위반 0 확인(승격이 만든 깨진 링크·미등재 즉시 수정).
6. 반영 커밋(evolve/dash) → `cd app && npx next build` 통과 확인 → `gh pr merge <num> --squash` (PR 제목 conventional 확인. `--delete-branch` 금지 — evolve/dash는 상시 브랜치).
   **머지 후 브랜치 정합** — 머지한 evolve/dash head를 `$MERGED`로 두고 `git fetch origin` 후 **야간 신규 커밋 유무로 분기한다. 무조건 `git rebase main`은 금지.**
   - 먼저 `git checkout -B evolve/dash origin/evolve/dash` (반드시 origin 기준 재설정 — 낡은 로컬 브랜치를 밀면 그 사이 착지한 야간 커밋이 유실된다, 2026-07-15 실사고).
   - `git log $MERGED..origin/evolve/dash --oneline` 이 **비어 있으면**(신규 라운드 없음): 무손실을 먼저 증명한다 — `git diff $MERGED main` 이 비어 있거나 **main 우위 변경만** 있어야 한다(main이 먼저 받은 스킬/설정 수정이 evolve/dash에 없는 경우가 있다). 확인 후 `git reset --hard main` → push. squash 머지 뒤 `git rebase main`을 쓰면 이전 커밋들을 재생하면서 **apply가 삭제한 후보 디렉토리를 되살리고 `vault/index.md`에서 충돌한다**(2026-07-30 실증 — abort 후 reset으로 우회). 이 경로의 reset은 "PR open 이후 커밋"이 0건임을 위 `git log`로 증명한 뒤에만 허용된다.
   - **신규 커밋이 있으면**: 그 커밋만 보존해야 하므로 `git rebase --onto main $MERGED` — `git rebase main`이 아니다(`--onto`는 이미 머지된 구간을 재생하지 않고 $MERGED 이후 커밋만 main 위로 옮긴다).
   - push는 두 경로 모두 `git push --force-with-lease=evolve/dash:$MERGED origin evolve/dash` — lease를 **명시**한다. 맨 `--force-with-lease`는 로컬 원격추적 ref가 낡았을 때 야간 커밋을 조용히 덮는다.

## 자기검증 (다음 라운드가 실측하고 지울 절)
2026-07-30 수정의 predicted impact. **apply 모드 §6 직전에 이 절을 확인**하고, 결과를 그 주 PR 본문에 1줄로 남긴다.
- **§6 분기 예측** — 머지 후 정합에서 rebase 충돌 0건 · apply가 삭제한 후보 디렉토리 부활 0건. 어긋나면 §6의 분기 조건(야간 커밋 유무)이 잘못 잡힌 것이므로 재설계한다.
- **§1·§2 종결 키 예측 (2026-07-31 부분 반증 — 범위 확대됨)** — 정방향(승인하지 않은 delta가 promoted/refuted로 읽힘)은 0건으로 예측대로였다. 그러나 **역방향이 2건 발생**했다: 키 도입 이전에 쓰인 레거시 종결 행에 `level`이 없어, **이미 정본에 편입된 L3가 매주 "편입 제안"으로 부활**했다(`auto-dash-r4/a`·`auto-dash-r7/b` — 2026-07-31 백필 완료). 예측은 이제 **양방향**으로 읽는다: 승인 안 한 delta가 종결로 읽히는 사례 0건 **그리고** 편입 완료된 delta가 미종결로 읽히는 사례 0건. 어긋나면 delta에 고유 id를 부여한다.
- **하위 레벨 흡수 종결 (2026-08-02 조건 완화 — 2주 연속 측정 불가)** — L3가 편입될 때 같은 내용의 L1·L2가 함께 닫히지 않으면 잔류 수치가 실제 미해결량을 과대 표시한다(2026-07-31 실측: 27건 → 실제 9건). §1 승인 시 **그 delta가 흡수하는 하위 레벨을 함께 종결**하고, `supersedes`에 편입된 정본 절을 적는다.
  원래 발동 조건은 "L3 승인 발생 시"였는데, 2026-07-31·08-01 두 주 연속 전 타깃 미종결이 L1뿐이라 **예측을 시험할 입력 자체가 없었다**. 측정할 수 없는 예측은 반증 장치가 아니라 장식이므로, 발동 조건을 **L2 이상 승인 발생 시**로 낮춘다. 이래도 2주 더 측정되지 않으면 예측이 아니라 승격 임계(재현 2회)가 너무 높은 것이므로 그쪽을 본다.
- 두 예측이 실측으로 확인되면 **이 절을 삭제한다**(스킬 비대 방지). 2라운드 이상 미확인으로 남으면 예측 자체가 검증 불가하다는 신호이므로, 예측을 측정 가능한 형태로 다시 쓴다.

## 금지
- open 모드에서 어떤 파일도 수정하지 않는다 (PR 생성/갱신만).
- apply 모드에서 사람 입력 없는 delta를 임의로 승인/기각하지 않는다.
