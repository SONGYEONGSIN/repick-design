# auto-dash-r53 — DECISION

## 오케스트레이션 편차 (먼저 고지)

이 라운드는 다음 두 지점에서 스킬의 문면과 다르게 실행됐다 — 둘 다 환경 자체의 구조적 제약이며, 라운드 진행 중 발견했다.

1. **§0-0-1 라운드 수**: 호출자는 N=2(연속 2라운드)를 요청했으나 `node scripts/round-budget.mjs 2`가 **1**을 반환했다(`--explain`: "미채움 0종 — N≥2의 근거(커버리지)가 없다" — `app/src/lib/works.ts`의 `PAGE_TYPES` 18종이 전부 카탈로그에 이미 있다). 스킬 §0-0-1의 명시 규칙("호출자가 2 이상을 줬어도 스크립트가 1을 내면 1라운드만 돌고 그 사실을 로그에 남긴다")을 그대로 따라 **이번 실행은 1라운드만 돈다.**
2. **§0-0 서브에이전트 가용성**: 이 실행 환경에는 이 스킬이 전제하는 named `designer`/`frontend-design-specialist`/`comparator` 에이전트 타입이 구성되어 있지 않다 — 가용한 것은 범용 `general-purpose`/`Explore`/`Plan`/`claude` 뿐이다. `Agent` 도구 자체(§0-0가 실제로 확인하는 대상)는 가용하므로, **생성 3건·판정 3건 전부를 `general-purpose` 서브에이전트에 독립·블라인드로 위임**했다 — 오케스트레이터(이 세션) 본인은 후보 코드를 작성하거나 판정을 내리지 않았다. 3명의 designer는 서로의 산출물을 모른 채 각자 다른 매크로 버킷/테마를 배정받아 작업했고, 3명의 judge는 서로의 판정을 모른 채 스크린샷+소스만으로 블라인드 평가했다. `self_judged: false`로 원장에 기록 — 이름 있는 에이전트 타입이 아니라 범용 타입을 썼을 뿐, 생성과 판정이 분리된 서로 다른 에이전트에서 일어났다는 §0-0의 핵심 불변식은 유지됐다.

## §0 타깃/라운드 번호

- N=1 (위 사유). 오늘(2026-10-31)은 UTC 토요일이라 월요일 native 고정 주기도 해당 없음.
- 미채움 큐 0종 → `base=['dash','landing','native']` 균등 난수 → **dash**.
- `auto-ledger.jsonl`에서 dash 최대 라운드 = r52 → 이번 라운드 = **r53**.
- `reassign-queue.md` "대기 중" 항목 없음(확인 시점 — 이번 라운드 종료 후 c가 #19로 새로 등재됨).

## §2 GENERATE — 사전 배정 (충돌 회피)

블라인드 3-designer가 서로 충돌하지 않도록, 매크로 버킷·테마·액센트·활자를 오케스트레이터가 사전 배정했다(최근 4라운드 r49-r52가 공식 버킷 거의 전부를 이미 소진한 상태였음을 확인한 뒤):

| v | 브랜드 | 매크로 버킷 | 테마/액센트/활자 |
|---|---|---|---|
| a | Outpost | 피드 중심(신호 피드+인스펙터) | dark / blue-hex / `display-mono` |
| b | Thrum | 레일 없는 밀집 벤토(8카드) | light / green / `display-wide` |
| c | Firebreak | 히어로+인라인스탯(단일 지배 시각화 없음) | light / orange / Pretendard-only |

## §3 HARD GATE

### 환경 설정 (스킬 밖 — 이 세션이 직접 진단)
Playwright 기본 `chromium.launch()`가 사전설치본(`/opt/pw-browsers/chromium`, build 1243)과 레포 `playwright@1.61.1`(build 1228 기대) 버전 불일치로 실패. 레포 스크립트(`capture-shots.mjs`/`dash-sweep.mjs`/`shot-native.mjs`)가 이미 `PW_CHROMIUM_PATH` 환경변수를 지원해 그대로 해소. Lighthouse(`chrome-launcher`)는 `CHROME_PATH`로 같은 바이너리를 가리켜야 했고, 루트 권한 실행이라 `gate.mjs`의 `PW_NO_SANDBOX` 플래그(`--no-sandbox`)도 필요했다 — 이 셋을 빠뜨리면 a11y/perf가 조용히 `unavailable`(소프트 통과)로 떨어져 실제로는 실행되지 않은 채 게이트를 통과하는 위험이 있었다; 직접 재현·확인 후 전 호출에 export했다.

### 1차 게이트
- **a (Outpost)**: `pass:false` — lint 2건(`react-hooks/set-state-in-effect`, 미사용 변수) + a11y `label-content-name-mismatch`(검색버튼 가시텍스트와 다른 문구의 `aria-label`).
- **b (Thrum)**: `pass:false` — lint 2건(동일 패턴) + sweep `table-overflow`(IncidentQueueCard, 1264-1440px) + a11y `button-name`(모바일 숨김 1차 CTA 라벨).
- **c (Firebreak)**: `pass:false` — lint 2건(동일 패턴) + sweep `cell-overlap`(IncidentsTable, 1280-1680px, 거의 전 행) + sweep `page-overflow`(390px +44px) + focus `focus-invisible`(검색버튼).

### 1-fix (각 1회)
- **a**: 전부 해소 → **재게이트 클린**(static/lint/sweep/focus/a11y 100/perf 72, 위반 0).
- **b**: 전부 해소(colgroup 재배분 + `sr-only sm:not-sr-only`) → **재게이트 클린**(a11y 100/perf 74, 위반 0).
- **c**: `cell-overlap`은 colgroup 재배분으로 완전 해소(재게이트 0건). `page-overflow`·`focus-invisible` 재시도는 **수치까지 완전히 동일하게 재발** — 스킬 §3 "재실패 시 탈락" 적용.
  - 1차 의심: 캐시 아티팩트. **배제했다** — dev 서버 전면 재기동(`rm -rf app/.next`) 후에도 바이트 단위로 동일 결과.
  - `focus-invisible` 근본원인을 직접 Playwright로 확진: `CommandPalette.tsx`의 "팔레트가 닫힐 때 트리거로 포커스 복원" `useEffect`가 `if(open){...} triggerRef.current?.focus();` 형태라 **초기 마운트(open=false로 시작)와 열림→닫힘 전환을 구분하지 못함** — 마운트 즉시 무조건 실행돼 검색버튼에 포커스를 뺏는다(`document.activeElement === button`이 `networkidle` 직후 이미 `true`, `button.matches(':focus-visible')`도 `true` — Tab을 누르기도 전). 게이트의 포커스 전/후 비교가 "이미 포커스됨"을 양쪽에서 보니 변화 없음으로 읽은 것이 오탐이 아니라 **진짜 결함의 정확한 증상**이었다.
  - `page-overflow` 근본원인은 미확정(1-fix의 방어적 하드닝 — heading wrapper `min-w-0`, 라벨폭 축소, truncate 보강 — 으로도 불변).
  - **탈락** — 판정 패널 미진입. `vault/00-principles/reassign-queue.md` #19로 신규 등재(두 원인 모두 명시, 하나는 확진·하나는 미확정으로 구분 기록).

## §4 JUDGE — 생존 2후보(a, b) 블라인드 3렌즈

판정 직전 소스 해시(a+b): `aec91a5e0091500b2d9c6eee0937ba35473b0b9f`. 이 해시 고정 이후 두 후보 소스를 건드리지 않았다(§3-1 정제 조치 불요 — 규칙 위반 지적 없음, 둘 다 1-fix에서 이미 클린).

각 렌즈에 스크린샷 3장/후보(`<v>-1440.png` · 중간 프레임 · `<v>-390.png`) + 소스 경로만 제공(컨셉 비공개, 블라인드).

### 렌즈1 (브리프 준수) → **a**
3-축 독립 스코프(`selectedId`→Inspector만 / 차트 hover→자기 자신만 / `pinnedIds`→QueueSummary만, 서로 무간섭)를 `OutpostClient.tsx`에서 직접 확인 — 브리프가 "최선"으로 든 예시를 거의 문자 그대로 구현. b는 반대로 `selectedServiceId` 하나를 `LatencyTrendCard`·`ServiceHealthCard`·`IncidentQueueCard` 세 위젯에 동시 threading — 브리프가 명시한 열위 패턴("one selection id... full-page" 쪽에 가까움)을 그대로 재현.

### 렌즈2 (상용 완성도) → **a**
결정적 사유 둘: ① b의 "Error budget" 카드가 260.0%/2760.0%(10배 차이)를 표시하면서 진행 바는 150%에서 클램프돼 둘이 시각적으로 구분 불가(`ErrorBudgetCard.tsx:54`) — 가장 비교가 필요한 지표가 바로는 안 읽힌다. ② b의 주요 CTA "New incident" 버튼이 `onClick` 자체가 없고(`Topbar.tsx:44-50`), 계정 드롭다운 3개 항목도 전부 핸들러 없음(`Topbar.tsx:118-141`) — 죽은 어포던스 4개. a는 상응하는 결함이 없고(사이드바 짧은 필터 카드의 사소한 여백 외), 비영속 상태는 카피로 명시("case record unchanged outside this session").

### 렌즈3 (아키타입 차별성) → **a**
두 버킷 모두 선행 사례가 있다(피드 중심=`r51/c` Siftline, 레일없는 벤토=`r50/c` Flagline) — 둘 다 "버킷 레이블은 새로워도 완전한 백지는 아니다"는 데 동의. 그 전제 위에서: a는 지배 시각화 종류(세그먼트 막대 vs Siftline의 스파크라인)·피드+테이블 통합 방식·3축 분리(선행의 2축보다 한 축 더)로 선행 대비 구체적 차이를 냈다. b는 오히려 Flagline이 의도적으로 뺀 좌측 사이드바를 되살려 "가장 일반적인 SaaS 셸"로 역행했고, 셀렉션도 Flagline이 명시적으로 피했던 "단일 id 다중 위젯 threading" 패턴을 그대로 썼다 — 선행보다 덜 차별화됨.

### 집계
**3:0 (lens1=a, lens2=a, lens3=a) → WINNER: a (Outpost).** 억지 승자 아님 — 3렌즈 전원 동일 결론, 각자 독립적인 구체 근거(코드 위치·스크린샷 파일명) 제시.

## §5 LEARN
델타 1건 추출·격리 적재(`dash-deltas-provisional.jsonl`, L1/provisional) — b의 Error-budget 카드 레이어: "비율이 100%를 넘을 수 있는 지표에 캡이 걸린 진행바를 쓰면, 캡을 크게 넘는 두 값이 시각적으로 구분 불가해진다(260% vs 2760%, 10배 차이가 똑같이 '꽉 찬 빨강'으로 보임)." lens2·lens3가 독립적으로 확인(수식 자체는 정확 — 데이터 드리프트 아니라 순수 시각화 설계 결함).

## §6 지식 정제
새 충돌 쌍·메타기준 미해결 사안 없음 — `questions-queue.md` 추가 없음. 레벨 재책정 대상 없음(이번 라운드 신규 delta 1건은 L1 단일 발생, 재현 전까지 provisional 유지).

## 불변식 확인
정본(`dash-brief-v3.md`·`design-principles.md`·`page-brief-core.md`·타입 프로파일)·`/dash` 갤러리·`/v1-v5` 무변경. `dash-deltas-provisional.jsonl`·`auto-ledger.jsonl`·`reassign-queue.md` 전부 append-only로만 수정(기존 줄 삭제/수정 없음). `main` 무커밋 — 전부 `evolve/dash`.
