---
name: dash-falsify
description: dash 자율 진화 주간 반증 — evolve/dash 누적분으로 반증 PR 생성(open 모드, 무인) / 사람 리뷰 결과 반영+squash merge(apply 모드). "/dash-falsify open", "/dash-falsify apply", "반증 PR", "주간 리뷰 반영" 시 사용.
---

# dash-falsify — 주간 반증

인자: `open`(기본) 또는 `apply`.

## open 모드 (무인 — 주간 routine)
1. `git fetch && git log origin/main..origin/evolve/dash --oneline` — 누적 커밋 없으면 "반증할 산출물 없음" 로그만 남기고 종료. 누적 커밋이 있으면 이후 모든 파일 읽기(auto-ledger·provisional·questions-queue·DECISION.md)는 evolve/dash 컨텍스트에서 한다 — `git checkout evolve/dash` 또는 `git show origin/evolve/dash:<경로>` (main 워킹트리에서 읽으면 본문이 빈 채 조립된다).
2. PR 본문 조립 (전부 자동 산출):
   - **주간 라운드 표**: auto-ledger에서 이번 주 라운드별 winner/no-winner/hardgate 요약
   - **L3 편입 제안**: provisional에서 최신 level=L3 & status=provisional인 delta 목록 (delta·evidence·재현 라운드)
   - **L1/L2 잔류 요약**: 개수 + 대표 클러스터
   - **질문 큐**: questions-queue.md "대기 중" 전문
   - **judge 근거**: 각 라운드 DECISION.md 상대경로 링크 + 대표 스크린샷 경로
   - **링크 그래프 요약**: 이번 주 신규 vault .md의 `[[링크]]` 수(`grep -o '\[\[[^]]*\]\]' <file> | wc -l`), 0개인 고아 노트 목록
   - **리뷰 방법 안내**: "후보 킵/드롭·delta 승인/기각·질문 답변을 PR 코멘트로 남기고 로컬에서 `/dash-falsify apply` 실행"
3. 열린 반증 PR이 있으면 `gh pr edit <num> --body <조립본>`, 없으면:
   `gh pr create --base main --head evolve/dash --title "feat(dash): 주간 자율 진화 반증 r<시작>~r<끝>" --body <조립본>`

## apply 모드 (로컬 세션 — 사람 리뷰 완료 후)
입력: PR 코멘트(`gh pr view <num> --comments`) 또는 대화로 받은 ① 후보 킵/드롭 ② delta 승인/기각 ③ 질문 답변. 셋 중 입력이 없는 항목은 그 항목만 건너뛴다.
1. **delta 승인** → `dash-brief-v3.md`에 surgical 편입(있으면 강화, 없으면 추가 — 무관 부분 수정 금지) + provisional에 `{...원본, status:'promoted', supersedes:'<round>'}` append.
2. **delta 기각** → provisional에 `{...원본, status:'refuted', supersedes:'<round>'}` append + auto-ledger에 해당 라운드 원본 entry 전체를 spread한 `{...원본, refuted:true, refute_reason:'<사유>'}`를 append(자기완결 줄 유지 — 같은 round의 최신 줄이 유효). **refute rate**(이번 리뷰에서 기각된 judge 승자 수 / 전체 승자 판정 수)를 계산해 40% 초과면 "judge 렌즈 개선 필요" finding을 사용자에게 보고.
3. **질문 답변** → 답변에서 재사용 가능한 정제 기준을 추출해 curation-criteria.md "축적된 기준"에 append, 해당 질문은 questions-queue.md 아카이브로 이동.
4. **후보 킵** → `git mv app/src/app/dash-evolve/r<N>/<v> app/src/app/dash/d<다음 번호>` + `/dash` 갤러리 page.tsx에 카드 등록. **드롭** → 해당 후보 디렉토리 삭제.
5. 반영 커밋(evolve/dash) → `cd app && npx next build` 통과 확인 → `gh pr merge <num> --squash` (PR 제목이 conventional 형식인지 확인). 머지 후 `git fetch origin && git checkout -B evolve/dash origin/evolve/dash && git rebase main && git push --force-with-lease origin evolve/dash` — 반드시 **origin/evolve/dash 기준으로 로컬 브랜치를 재설정한 뒤** rebase(낡은 로컬 브랜치를 rebase하면 그 사이 착지한 야간 라운드 커밋이 force-push로 유실된다 — 2026-07-15 실사고). reset --hard main이 아닌 rebase(PR open 이후 커밋 보존). 이걸 빼먹으면 다음 주 open 모드의 merge-base가 과거에 고정돼 이미 리뷰된 라운드가 매주 재표시된다.

## 금지
- open 모드에서 어떤 파일도 수정하지 않는다 (PR 생성/갱신만).
- apply 모드에서 사람 입력 없는 delta를 임의로 승인/기각하지 않는다.
