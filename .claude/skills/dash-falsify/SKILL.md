---
name: dash-falsify
description: 자율 진화 주간 반증 (다중 타깃) — evolve/dash 누적분으로 대시보드·랜딩·네이티브 섹션의 반증 PR 생성(open 모드, 무인) / 사람 리뷰 결과 반영+위키 갱신+squash merge(apply 모드). "/dash-falsify open", "/dash-falsify apply", "반증 PR", "주간 리뷰 반영" 시 사용.
---

# dash-falsify — 주간 반증 (이중 타깃)

인자: `open`(기본) 또는 `apply`.

## open 모드 (무인 — 주간 routine)
1. `git fetch && git log origin/main..origin/evolve/dash --oneline` — 누적 커밋이 없으면 "반증할 산출물 없음" 로그만 남기고 종료. 누적 커밋이 있으면 이후 모든 파일 읽기(auto-ledger·provisional·questions-queue·DECISION.md·index.md)는 evolve/dash 컨텍스트에서 한다 — `git checkout evolve/dash` 또는 `git show origin/evolve/dash:<경로>` (main 워킹트리에서 읽으면 본문이 빈 채 조립된다).
2. PR 본문 조립 — **타깃별 섹션**. **링크는 반드시 클릭 가능한 GitHub URL로 생성** — evolve/dash 브랜치 파일은 PR 화면에서 경로 텍스트로는 안 보이므로 판정/스크린샷을 사람이 못 본다. 형식: DECISION·개별 PNG = `https://github.com/<owner>/<repo>/blob/evolve/dash/<경로>`, 샷 폴더 = `https://github.com/<owner>/<repo>/tree/evolve/dash/<경로>` (owner/repo는 `gh repo view --json owner,name`로 확인). 라운드별로 세 링크를 표에 넣는다: [DECISION](blob DECISION.md) · [승자 대표샷](blob `shots/<승자v>-1440.png`, 모바일 타깃은 `-390.png`) · [전체샷](tree `shots/` 폴더).
   - `## 대시보드` / `## 랜딩` 각각: 주간 라운드 표(auto-ledger에서 해당 target entry(target 필드 없는 레거시 entry는 round id `auto-<t>-r*`에서 유추)), L3 delta 편입 제안(해당 DELTAS의 최신 level=L3 & status=provisional), L1/L2 잔류 요약, 라운드별 위 3-링크(DECISION·승자샷·전체샷). 해당 타깃 라운드가 없던 주면 섹션에 "이번 주 라운드 없음" 1줄.
   - `## 네이티브`: 위와 동형 — 라운드 표(`auto-native-r*`, 후보별 status 승자/탈락/대기), L3 delta 편입 제안(`vault/00-principles/native-deltas-provisional.jsonl`의 최신 level=L3 & status=provisional), L1/L2 잔류, 라운드별 3-링크(승자샷은 `shots/<v>-390.png` 모바일). delta·질문·**후보 킵/드롭** 전부 반증 대상.
   - `## 질문 큐`: questions-queue.md "대기 중" 전문 (target 표기 포함).
   - `## 위키 건전성`: ① 기계 — `node scripts/wiki-lint.mjs` 실행 결과 JSON(위반 0이면 "clean") ② 판단 — 페이지 간 모순·stale 주장(최신 delta가 정본과 충돌하는 사례) 스캔 결과를 2~3줄로.
   - `## 리뷰 방법`: "후보 킵/드롭·delta 승인/기각·질문 답변을 PR 코멘트로 남기고 로컬에서 /dash-falsify apply 실행".
3. 열린 반증 PR이 있으면 `gh pr edit`로 본문 갱신, 없으면 `gh pr create --base main --head evolve/dash` (제목: "feat(evolve): 주간 자율 진화 반증 <기간>").

## apply 모드 (로컬 세션 — 사람 리뷰 완료 후)
입력: PR 코멘트(`gh pr view <num> --comments`) 또는 대화로 받은 ① 후보 킵/드롭 ② delta 승인/기각 ③ 질문 답변. 입력 없는 항목은 건너뛴다.
1. **delta 승인 (타깃별 정본 편입 + ingest 파급)** — dash delta는 `dash-brief-v3.md`에, landing delta는 `design-principles.md`에, **native delta는 규칙성이면 `native/GENERATION.md`의 해당 절(§1~§7), 토큰값이면 `native/src/tokens.ts`에** surgical 편입(default GENERATION.md). **편입할 때 그 내용을 참조·인접하는 관련 노트(curation-criteria, 반대 타깃 brief의 공통 룰 등)의 상호참조([[링크]])도 동반 갱신한다** — "1건 편입 = 관련 페이지들 터치". provisional에는 `{...원본, status:'promoted', supersedes:'<round>'}` append.
2. **delta 기각** — provisional에 `{...원본, status:'refuted', supersedes:'<round>'}` append + auto-ledger에 해당 라운드 원본 entry 전체를 spread한 `{...원본, refuted:true, refute_reason:'<사유>'}`를 append(자기완결 줄 유지 — 같은 round의 최신 줄이 유효). **refute rate**(기각된 judge 승자 / 전체 승자 판정, 타깃 통합)를 계산해 40% 초과면 "judge 렌즈 개선 필요" finding을 사용자에게 보고.
3. **질문 답변** — 답변에서 재사용 가능한 정제 기준을 추출해 curation-criteria.md "축적된 기준"에 append, 해당 질문은 questions-queue.md 아카이브로 이동.
4. **후보 킵/드롭** — dash 킵: `git mv app/src/app/dash-evolve/r<N>/<v> app/src/app/dash/d<다음>` + `/dash` 갤러리 등재(works.ts `DASH_LAB_WORKS`). landing 킵: `git mv app/src/app/landing-evolve/r<N>/<v> app/src/app/(marketing)/v<다음>` + works.ts `LANDING_WORKS` 등재. **두 경우 모두 새 작품 entry에 (a) 도메인 `category`(Specimen 카테고리: `project`/`scheduling`/`ops`/`finance`/`analytics`/`landing`/`mobile` 중 승자 도메인 도출 — 없으면 갤러리 필터 칩에서 누락) (b) `desc:{en,ko}` 이중언어(en 우선, ko는 참고 번역) 부여**, `works.ts`의 `LAST_UPDATED`를 오늘 날짜 문자열로 갱신. **챔피언(`/`) 교체는 사용자가 명시적으로 지시할 때만.** 드롭: 해당 후보 디렉토리 삭제. **native 킵**: `git mv native/src/evolve/r<N>/<v> native/src/<name>/`(`<name>`=semantic 폴더명 — watchlist/match 관례, 승자 도메인 도출) + `native/screens.ts`(import + `COMPONENTS["<name>"]`)·`native/screens.json`(`"<name>":{"check":"<영문 검사문자열>"}` — GENERATION.md §영문전용에 따라 렌더 영문 substring)에 permanent 슬러그 등재(이동한 evolve 슬러그 `evolve-r<N>-<v>` 등록은 제거) + **`bash native/scripts/build-gallery-web.sh`로 Expo web 정적 번들 재빌드(새 화면이 `app/public/native-app/`에 포함)·`app/public/native-app/` 재커밋** + `NATIVE_WORKS`에 `{id:'n<다음>', route:'/native-app/index.html?screen=<name>', brand:'<영문 화면명>', desc:{en:'…(auto-native-r<N> 승자)', ko:'…'}, target:'native', category:'mobile', previewH:520}` append(**라이브 iframe — PNG·`image` 필드 아님**; ①(PR#25)로 S3a PNG→라이브 Expo 전환, WorkCard가 `category==="mobile"`로 모바일 iframe 렌더)(+ `works.ts` `LAST_UPDATED` 오늘 날짜). **native 드롭**: `native/src/evolve/r<N>/<v>` 삭제 + evolve 슬러그를 `native/screens.{ts,json}`에서 제거. 한 라운드 evolve 슬러그(`evolve-r<N>-{a,b,c}`)는 승격/드롭으로 **전부 소진**(evolve/dash screens 무한 축적 방지).
5. **위키 마감** — index.md에 승격/신규 노트 등재 반영 → `node scripts/wiki-lint.mjs` 재실행, 위반 0 확인(승격이 만든 깨진 링크·미등재 즉시 수정).
6. 반영 커밋(evolve/dash) → `cd app && npx next build` 통과 확인 → `gh pr merge <num> --squash` (PR 제목 conventional 확인). 머지 후 `git fetch origin && git checkout -B evolve/dash origin/evolve/dash && git rebase main && git push --force-with-lease origin evolve/dash` — 반드시 **origin/evolve/dash 기준으로 로컬 브랜치를 재설정한 뒤** rebase(낡은 로컬 브랜치를 rebase하면 그 사이 착지한 야간 라운드 커밋이 force-push로 유실된다 — 2026-07-15 실사고). reset --hard main이 아닌 rebase(PR open 이후 커밋 보존).

## 금지
- open 모드에서 어떤 파일도 수정하지 않는다 (PR 생성/갱신만).
- apply 모드에서 사람 입력 없는 delta를 임의로 승인/기각하지 않는다.
