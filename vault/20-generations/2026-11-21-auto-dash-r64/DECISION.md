# DECISION — auto-dash-r64

## 0. 상한/타깃 판정 (스킬 §0-0-1·§0 그대로 실행)

- `node scripts/round-budget.mjs 2` → **N=1** (근거: `미채움 0종 — N≥2 의 근거(커버리지)가 없다`). `app/src/lib/works.ts` `PAGE_TYPES` 18종 전부 카탈로그에 1건 이상 있다 — 호출자가 `/dash-evolve 2`로 2라운드를 요청했어도 **이번 실행은 1라운드만 돈다.**
- 오늘(2026-11-21)은 토요일(`getUTCDay()===6`)이라 native 주 1회 고정 월요일 규칙은 미적용.
- `node -e "..."` 타깃 추첨(미채움 0종 → dash/landing/native 균등 난수) → **dash**.
- 라운드 번호: `auto-dash-r64` (직전 dash 라운드 r63 + 1, 타깃별 독립 시퀀스).
- **서브에이전트 가용성 확인**: Agent 도구 있음 → 정상 진행(자기판정 아님, `self_judged` 불필요).

## 1. RETRIEVE 요약

- BRIEF: `dash-brief-v3.md` + `page-brief-core.md` + `page-brief-repo.md` 전문.
- `reassign-queue.md` 대기 중 — **#24 `auto-dash-r63/c` "Weir"**(API 게이트웨이 레이트리밋/쿼터 콘솔, 2페인 마스터-디테일+hour×endpoint 히트맵)가 유일한 대기 항목 → 후보 a에 배정, 탈락 사유(aria-hidden `label-content-name-mismatch`) 배정문에 그대로 명시.
- `dash-deltas-provisional.jsonl` 최근 항목(r56~r62) 전체 반영: opacity→contrast 상호작용 없음(이번에 새로 발견, 아래 §5), truncate 블록화, sr-only 앵커, min-w는 `<table>`에만, 1-fix가 다른 규칙을 깨는 패턴, `trailingZeroDisplay`, aria-hidden이 color-contrast/label-mismatch를 면제하지 않음(§2) 전부 designer 프롬프트에 명문 지시로 포함.
- `catalog-variety.mjs` → 65작품, theme dark 36/light 29, accent 분산(amber·teal 8 최다), face pretendard 29/mono 13/grotesk 12/wide 11. 최근 3 dash 승자(r62/c, r58/c, r57/c) 전부 dark → **이번 라운드 금지 축: theme=dark, face=mono**(2회+ 연속/반복). 3후보 전부 light 배정 + mono 미사용(a=pretendard-only, b=wide, c=grotesk)으로 반영.
- 매크로-버킷 선제 체크: a=master-detail(재배정 고정), b=board/calendar-centric, c=feed-centric — 3종 모두 다르게 배정, 직전 라운드들과도 겹치지 않음.

## 2. GENERATE

3 designer 서브에이전트 병렬 호출(조립 브리프 전문 전달, 경로 아님). 산출:
- **a — "Weir"**: API 게이트웨이 레이트리밋 콘솔. 재배정 지시(aria-hidden이 label-content-name-mismatch를 면제하지 않음 → 피크 셀 시각 숫자 전면 삭제, 값은 공유 aria-live 캡션으로만) 정확히 반영 + 히트맵을 CSS grid→생성형 SVG로 재작성.
- **b — "Jobline"**: 필드서비스 디스패치 보드/캘린더. 지배 시각화 = utilization bullet-chart grid(값+타깃 상시 텍스트).
- **c — "Vigil"**: SOC 경보 트리아지 피드. 지배 시각화 = 6축 radar(알럿 vs 카테고리 베이스라인), 축별 값 상시 텍스트 + 하단 상시 테이블.

게이트 직전 해시(후보 3개 소스 cat | shasum, 1차 등록 시점): `be52010b29f4b711198bcb244caa82fce91f731c`. 이후 1-fix 수정(a: `KeyRail.tsx` 미사용 var 제거, b: `DispatchBoard.tsx` opacity-70 제거)은 §3-1 규칙 위반 해소 수정이며 재게이트로 10/10 확인했다 — 수정 후 해시는 자연히 달라지나 **판정 순위에 영향 없는 범위**(둘 다 하드게이트 전 단계, judge는 수정 후 상태만 봤다).

## 3. HARD GATE — `vault/20-generations/2026-11-21-auto-dash-r64/SCORES.md` 참조

- a: 1차 `lint` 실패(미사용 var) → 1-fix → **10/10 클린**.
- b: 1차 `a11y` 96 실패(승격 감사 `color-contrast`, 하드페일) → 1-fix → **10/10 클린**.
  - 진단: 취소된 작업 카드에 건 `opacity-70`이 그 서브트리 전체(시간 라벨 zinc-500 · 제목 zinc-500 line-through · 고객명 zinc-600 · 상태 Badge의 zinc-600 · InitialsAvatar의 zinc-600-on-zinc-100 — 5개 노드)의 실측 대비를 일괄로 AA 밑으로 끌어내렸다. 토큰 자체는 전부 이 카탈로그의 기존 표면톤 규칙(순백/거의순백 zinc-500 하한, muted zinc-100+ zinc-600 하한)을 지켰는데도 실패했다 — **원인은 토큰이 아니라 조상의 opacity 곱연산**이었다. 조치: `opacity-70` 제거(점선 보더+취소선만으로 "취소됨" 시각 신호 유지, 색 토큰 변경 없음). 재게이트 10/10.
- c: 1차부터 **10/10 클린**(1-fix 불필요).

## 4. JUDGE 패널 (3렌즈 블라인드, 각 렌즈 후보당 3프레임: `<v>-1440` / `<v>-1440-s70`(a·b) or `<v>-1920`(c, 스크롤 프레임 없음 — 본문이 뷰포트 높이 이내) / `<v>-390`)

| 렌즈 | 1위 | 2위 | 3위 | 핵심 사유 |
|---|---|---|---|---|
| 렌즈1(브리프 준수) | **c** | b | a | 룰4(지배 시각화 값 상시노출)가 유일한 변별축 — a의 히트맵이 셀에 숫자를 전혀 안 그려(호버/키보드 전용) 가장 약함; b·c는 룰4를 거의 교본대로 충족. 나머지 룰(1·2·3·5·6·7·8·9) 전부 3후보 통과. |
| 렌즈2(상용 완성도) | **b** | c | a | at-a-glance 정보밀도(룰1)가 결정적: b의 bullet-chart가 값·타깃을 매 행 인쇄해 가장 안전; c는 radar+상시 테이블로 보완되나 그 radar 자체에 **실제 렌더 버그**(스포크 라벨이 SVG viewBox 밖으로 잘림 — `RadarChart.tsx`, `labelPoint` 반경이 viewBox 400을 넘음)가 있음; a는 히트맵이 값을 전혀 안 보여줄 뿐더러 두 군데 하드 클리핑(행 라벨 "...{id" 잘림, 스탯타일 "ENDPOINTS IN SCO…" 잘림)까지 겹침. |
| 렌즈3(아키타입 차별성) | **b** | a | c | 매크로-버킷: a=마스터-디테일(이 카탈로그 최다·재배정으로 신규성 0 처리)·b=보드/캘린더(필드서비스 신규 도메인+드문 bullet-chart 신규성)·c=3페인 레일+피드+인스펙터(이미 3회+ 과다사용 버킷, 트레이딩 터미널류와 구조적으로 동형). 선택-파급 티어(소스 추적): a=2축 독립(최고 티어, 코멘트가 아니라 상태배선으로 검증) · b=3축 독립(최고 티어, a보다 폭넓음) · c=1개 단독축(`pinnedId`→InspectorPanel만)+1개 **공유** 필터(`period`가 Feed·QueuePanel 둘 다 재계산 — 독립축 아님)로 중간 티어. |

**집계**: 1위 표 — b 2표(렌즈2·렌즈3), c 1표(렌즈1). **2:1로 b("Jobline") 승.** no-winner 아님(no-winner 표 0개).

**교차 관찰(렌즈3 보강)**: 3후보가 매크로-버킷 수준에서는 겹치지 않았으나, 그 아래 보일러플레이트 층(⌘K 팔레트, skip-link, 모바일 드로어, `Card`/`SegmentedControl`/`FOCUS_RING` 어휘, hover-reveal+상시-폴백 짝)에서는 수렴 — 이 레포 역사의 "수렴은 막힌 층위 바로 아래로 이동한다" 관측과 동형. 판정에는 반영하지 않음(세 후보가 공유하는 것은 순위를 만들지 못한다, [[curation-criteria]] Q21).

## 3-1. 판정 후 수정

없음. 하드게이트 1-fix 2건(a, b)은 모두 **판정 이전**(§3, judge 패널 호출 전)에 적용·재게이트됐고 judge는 수정 후 상태만 봤다 — §3-1의 "판정 뒤 산출물 수정" 조항 대상이 아니다.

## 5. LEARN — delta 1건 (append)

대상: **b(승자)가 아니라 b의 1-fix 과정에서 드러난, 승자 포함 전 라운드에 적용 가능한 새 하드게이트 메커니즘** — judge 사유(렌즈2가 a의 at-a-glance 실패·c의 viewBox 클리핑을 승패 요인으로 직접 인용)와 함께 이 메커니즘도 실측 근거가 분명해 이번 라운드의 1건으로 택한다(아래 jsonl 참조). a/c 쪽 발견(히트맵 전면 비가시·radar 라벨 클리핑)은 judge 사유에는 남았으나 "1건" 제약상 delta로 올리지 않고, c의 viewBox 버그는 기계 재현성이 낮아(생성형 SVG 좌표 설계 문제, 범용 규칙화 전 추가 사례 필요) 보류했다.

append 완료(`vault/00-principles/dash-deltas-provisional.jsonl`):
```json
{"round":"auto-dash-r64","variant":"b","delta":"An ancestor opacity utility (e.g. opacity-70 on a whole 'cancelled/disabled state' card) multiplies the EFFECTIVE rendered contrast of every descendant text node against whatever sits behind it, independent of whether each descendant's own color token already satisfies this catalog's surface-tone contrast floors (zinc-500 on near-white, zinc-600 on muted zinc-100+). Five descendant nodes (a time label, a line-through title, a customer-name span, a status Badge's inner span, and an aria-hidden InitialsAvatar's fallback-letter span) all individually used tokens that pass this catalog's documented floors in isolation, yet all five failed Lighthouse's promoted color-contrast audit together purely because they sit inside one opacity-70 ancestor button. Fix: drop the blanket opacity and signal the muted/disabled state through non-opacity cues already present (dashed border, line-through, a muted badge tone) instead -- this is the same failure shape as the catalog's existing contrast-floor rule, but the variable is an ancestor's opacity, not the descendant's own token, so the existing floor rule alone would not have caught it by inspection.","evidence":"auto-dash-r64/b DispatchBoard.tsx cancelled-card button: className included `opacity-70` alongside `border-dashed border-zinc-200 bg-zinc-50`; 1st gate a11y=96 with promoted-audit hard-fail `color-contrast` (5 flagged nodes: time-range span text-zinc-500, title text-zinc-500 line-through, customer span text-zinc-600, Badge inner span inheriting muted-tone text-zinc-600, InitialsAvatar fallback span text-zinc-600 on bg-zinc-100 -- all five descendants of the same opacity-70 button); removing only `opacity-70` (zero color-token changes) brought 2nd gate to a11y=100, 10/10 clean.","judge_votes":null,"confidence":"high","level":"L1","status":"provisional"}
```

## 6. 지식 정제 게이트

- 클러스터링: 위 opacity delta는 기존 "표면 톤별 대비 하한"([[dash-brief-v3]] §상태 분기 대비, L3) 조항과 **충돌하지 않는다** — 하한 조항은 "토큰을 무엇으로 쓰는가"를 다루고, 이번 delta는 "조상이 그 토큰의 실효값을 바꿀 수 있다"는 **그 조항이 다루지 않는 새 변수**를 더한다. 보강(흡수)이지 대체가 아니다.
- 레벨 재책정: 1라운드·1사례이므로 **L1 유지**(재현 2라운드 미달). 기계 검증 가능(Lighthouse color-contrast)이라는 점은 §5 jsonl에 이미 명시했다 — 2번째 독립 재현이 나오면 L2로 승격.
- 재현 주장 없음(이 delta는 "r* 델타를 확장한다"류 표현을 쓰지 않았다 — 순수 신규 메커니즘이므로 재현 검증 절 불필요).
- **질문 강제 생성** — `questions-queue.md` 대기 중에 Q77 append:

```
### Q77. 재배정 지시가 "a11y 감사 하나를 피하라"고만 적으면, 그 처방이 이 카탈로그의 더 무겁게 가중된 다른 규칙(지배 시각화 값 상시노출)을 희생시킬 수 있다 (target: dash · reassign-queue 배정문 설계, auto-dash-r63/c→r64/a)

r63/c("Weir")는 `label-content-name-mismatch` 하드페일로 탈락했고, 재배정 큐 #24의 배정문은 "가장 안전한 해법"으로 **피크 셀의 시각적 숫자를 완전히 없애고 값은 호버/포커스 전용 공유 캡션으로만 노출하라**고 명시했다. r64/a는 그 지시를 정확히 따랐고 — 재게이트에서 원 재배정 사유(label-content-name-mismatch)는 실제로 한 번도 재현되지 않았다 — **하지만 그 수정이 이 카탈로그의 다른 하드 규칙, "지배 시각화 값은 상시 텍스트로(hover-only 금지)"를 정면으로 위반하는 결과를 낳았다.** 하드게이트는 그 규칙을 기계로 재지 않으므로(색 대비·구조 규칙만 하드게이트, "값 상시노출"은 judge 렌즈가 재는 L3 완성도 원칙) 1차 게이트는 통과했지만, 3렌즈 중 2렌즈(렌즈1·렌즈2)가 **독립적으로 이 정확한 결함을 승패 결정 요인으로 지목**했다 — 렌즈1: "a의 히트맵이 셀에 숫자를 전혀 안 그려 가장 약함", 렌즈2: "이 레포 규칙이 '어떤 인코딩이든 결정적'이라고 못박은 바로 그 실패 유형, 그 위에 하드 클리핑 2건까지 겹침."

**잠정 가설**: 재배정 배정문이 "탈락시킨 그 감사 하나"만 좁게 보고 처방을 쓰면, 그 처방이 (a) 기계 하드게이트는 통과하면서 (b) judge만 재는 더 무거운 원칙을 희생시키는 교환이 구조적으로 가능하다 — 이번 사례에서 그 교환은 승자 결정에 **직접 반영**됐다(2:1 판정에서 a가 전 렌즈 최하위 또는 차하위). 배정문을 쓸 때 "이 수정이 다른 상시노출/완성도 규칙과 충돌하지 않는가"를 명시적으로 자문하게 해야 하는가, 아니면 이런 교환은 (아키타입 신규성 ↔ 완성도처럼) 판정 다수결에 맡기는 것으로 충분한가?

**대안 처방이 있었다는 점도 기록한다**: 배정문 자체가 두 번째 대안("시각 텍스트와 aria-label을 정확히 같은 포맷터로 생성")을 이미 제시했었다 — designer가 그 대안 대신 "가장 안전한" 첫 대안(숫자 전면 삭제)을 골랐다. 두 대안 모두 하드게이트는 통과했을 것이나, 대안 2는 상시노출 원칙을 안 건드렸을 가능성이 높다.
```

## 7. 기록 + 커밋

- `auto-ledger.jsonl` append: target dash, round auto-dash-r64, winner b, variety(theme/accent/face) = readWork(b) 결과.
- `vault/index.md` "세대 기록"에 `[[20-generations/2026-11-21-auto-dash-r64/DECISION|auto-dash-r64]]` 등재.
- 재배정 큐 #24 소진: 아카이브로 이동(사유 완전 해소 + 판정 2위, 승격 실패 — 세 번째 재배정 여부는 보류).
- `git add -A && git commit` → `evolve/dash` push.
- dev 서버: 이 라운드가 띄웠으므로 §7 완료 후 종료.

**N=1 라운드 상한이었으므로 이번 실행은 여기서 끝난다** — 호출자가 2라운드를 요청했어도 `round-budget.mjs`가 1을 반환했고 §0에서 그 사실을 이미 명시했다. 2번째 라운드는 돌지 않는다.
