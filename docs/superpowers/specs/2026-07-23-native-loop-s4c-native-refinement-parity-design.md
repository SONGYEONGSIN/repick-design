# 멀티플랫폼 진화 루프 — S4c: native 지식 정제 파리티

- 날짜: 2026-07-23
- 상태: 사용자 승인 완료 (구현 계획 수립 전)
- 상위 프로그램: 자율 진화 루프 멀티플랫폼 재설계. 선행 = S0·S1·S2·S4a·S4b(native 라운드 실행) 전부 ✅ 병합. 이 문서는 **S4c**만 다룬다.

## 0. 상위 프로그램 맥락

| # | 하위 프로젝트 | 상태 |
|---|---|---|
| S0~S2 | Expo PoC · designer 생성 · 게이트 디스패처 | ✅ 병합 |
| S4a | 웹 게이트 gate.mjs 채택 | ✅ 병합 |
| S4b | native 타깃 라운드 (실행) | ✅ 병합 |
| **S4c** | **native 지식 정제 파리티 (§5/§6 + falsify 승격)** | ← 이 문서 |
| S3 | 미리보기·갤러리 통합 (+ native 후보 킵/드롭) | 후속 |
| S5 | 카탈로그 192색·98UX 전수 수용 | 후속 |

## 1. 목표

native 라운드가 웹처럼 **§5 delta 추출 → §6 레벨링/질문 생성 → 주간 falsify 승격**까지 수행하게 한다. S4b가 native에서 스킵한 §5·§6을 해제하고, dash-falsify에 native 승격 경로를 추가한다. **payoff: native가 run(S4b)에 이어 learn까지 완비된 1급 타깃이 됨.**

## 2. 확정된 결정

| 결정 | 선택 |
|---|---|
| 범위 | 풀 파리티 — 루프 §5/§6 native + falsify open/apply native |
| native DELTAS | `vault/00-principles/native-deltas-provisional.jsonl`(신설, 빈 파일) |
| §5/§6 native 분기 | 최소 — 이미 `<DELTAS>`/"해당 타깃 DELTAS"로 parametrized. native 블록 DELTAS 지정 + 스킵 노트 제거만 |
| native delta 승격 타깃 | 규칙 delta → `native/GENERATION.md` 해당 절 / 토큰값 delta → `native/src/tokens.ts` (default GENERATION.md) |
| native 후보 킵/드롭 | **비범위 — S3** (S4c는 delta 지식만) |

## 3. native-deltas 파일 신설

- `vault/00-principles/native-deltas-provisional.jsonl` 신설 — 빈 파일(jsonl append-only, dash/landing deltas와 나란히 main 정본 위치).
- delta 포맷은 웹 공용: `{round:'auto-native-r<N>', variant, delta, evidence, judge_votes:{lens1,lens2,lens3}, confidence, level, status, [supersedes]}`. native 전용 필드 없음.

## 4. dash-evolve SKILL — native §5/§6 해제

- **native 파라미터 블록**: `DELTAS` 셀 `N/A (S4c)` → `vault/00-principles/native-deltas-provisional.jsonl`. 블록 상단 문구 "**§5 LEARN·§6 정제 게이트는 native에서 건너뛴다(S4c 전까지…)**" 제거.
- **§5 헤더 노트 제거**: `> **native 타깃은 §5·§6을 건너뛴다** …` 줄 삭제 → native도 §5/§6 수행.
- **§5/§6 본문 무변경**: `<DELTAS>`(§5 appendLedger)·"해당 타깃 DELTAS"(§6)가 이미 파라미터라 native DELTAS를 자동 참조. curation-criteria.md(meta, target-agnostic)·questions-queue.md(target 태그 공용)도 그대로. **native 델타의 §6 충돌 검사는 native-내부 + native delta ↔ native 정본(GENERATION.md/tokens.ts)** 축(기존 "타깃 간 교차 충돌" 문구가 포괄).

## 5. dash-falsify SKILL — native 승격 경로

### 5.1 open 모드 — `## 네이티브` 섹션 추가
`## 대시보드`/`## 랜딩` 미러. 조립 내용:
- native 주간 라운드 표(auto-ledger의 `auto-native-r*` entry — winner/no_winner/hardgate 요약).
- **L3 delta 승격 제안**: `native-deltas-provisional.jsonl`의 최신 `level:'L3' & status:'provisional'` delta.
- L1/L2 잔류 요약.
- 라운드별 `DECISION.md` 상대경로 링크 + 대표 스크린샷 경로(`shots/<v>-390.png`).
- 해당 주 native 라운드 없으면 "이번 주 라운드 없음" 1줄.

### 5.2 apply 모드 — native delta 승인/기각
- **native delta 승인**: 승격 타깃 판별 — **규칙성 delta → `native/GENERATION.md`의 해당 절(§1~§7)에 surgical 편입**, **토큰값 delta → `native/src/tokens.ts`에 추가**(default = GENERATION.md). 편입 시 관련 노트 상호참조([[링크]]) 동반 갱신(웹 규칙 계승). provisional에 `{...원본, status:'promoted', supersedes:'<round>'}` append.
- **native delta 기각**: provisional에 `{...원본, status:'refuted', supersedes:'<round>'}` append + auto-ledger에 `{...원본 라운드 entry, refuted:true, refute_reason:'…'}` append(웹 규칙 계승). refute rate 계산에 native 포함.
- **native 후보 킵/드롭은 미수행(S3)** — open의 native 섹션은 라운드/delta/질문 정보 제공 + delta·질문만 apply 액션. (native 승자 화면 permanent화는 S3.)

## 6. 검증

throwaway 브랜치 — demo 산출물(delta entry·GENERATION.md 편입 demo)은 미병합, **SKILL 2개 편집 + 빈 native-deltas 파일만 main**.

1. **§5 native**: S4b 스모크 승자 a의 판정 사유에서 native delta 1개 추출("미읽음 상태는 단일 액센트 닷 하나로 국한 — 타입 배지 색분리 회피") → `native-deltas-provisional.jsonl` append → 포맷 검증(round=auto-native-r1, level L1, status provisional).
2. **§6 레벨링 dry-run**: native-deltas 로드 → curation-criteria 체크리스트로 레벨 판정(1라운드라 L1 유지가 정상 — 재현 2라운드+ 필요) → 충돌/질문 생성 여부 확인.
3. **falsify open dry-run**: `## 네이티브` 섹션이 native 라운드 표 + delta 제안으로 조립되는지(스크립트 없이 prose 조립 시연).
4. **falsify apply dry-run**: 위 native delta를 `GENERATION.md`의 §3 DNA 절에 surgical 편입 시연 + provisional에 promoted append.
5. **웹 무영향**: dash/landing §5/§6·falsify 경로 diff 0(파라미터 재사용, 하드코딩 분기만 추가). `npm test` 44/44 불변. main 무영향(`curl` 200).
6. **비회귀**: 변경 = `dash-evolve/SKILL.md` + `dash-falsify/SKILL.md` + `native-deltas-provisional.jsonl`(빈) 3파일. gate.mjs·works.ts·app 무변경.

## 7. 비범위

- native **후보 킵/드롭**(승자 화면 permanent화 + main screens 등재) → **S3**.
- 갤러리 native 미리보기 → **S3**.
- native delta가 실제 L3 도달·다수 라운드 축적 → 루프 자연 진행(S4c는 메커니즘만).
- gate.mjs·works.ts 수정 → 불요.
