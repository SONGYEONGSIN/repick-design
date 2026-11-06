# auto-dash-r35 — DECISION

## §0 라운드 수 / 타깃

- 두 번째 독립 `/dash-evolve` 실행(스케줄된 2연속 요청의 2번째 호출). `node scripts/round-budget.mjs --explain 2` → `1\t미채움 0종`. 1라운드째(`auto-native-r29`, no-winner)가 이미 native를 생성했으나, 이번 호출은 round-budget을 독립적으로 다시 물어 N=1을 받았고, 타깃 선택도 스킬 §0 그대로 독립 재추첨했다(이전 라운드가 뽑은 타깃을 인위적으로 제외하지 않음 — 과거 `auto-dash-r34`/`auto-native-r28` 선례와 동형, "독립 재추첨" 관례를 따름).
- Agent 도구 가용성 확인: 가용 — 3 designer + 3 judge 전원 `general-purpose` 서브에이전트로 독립·블라인드 디스패치(`self_judged: false`).
- 타깃 추첨: 미채움 0종 → `dash/landing/native` 균등 난수 → **dash**.
- `reassign-queue.md` "대기 중": 없음(2026-10-02 `auto-dash-r34/a`로 소진된 뒤 비어 있었음) — 재배정 없음.
- 라운드 번호: `auto-ledger.jsonl`에서 target=dash 최대 라운드(r34) + 1 = **r35**.

## §1 RETRIEVE

- BRIEF: `dash-brief-v3.md` 전문 + `page-brief-core.md` + `page-brief-repo.md` §1(영문 전용)·§2(폰트 화이트리스트) + 카탈로그 4종(`charts`·`colors`·`ux-guidelines`·`motion`).
- `catalog-variety.mjs` 실행 → 최근 3 dash 승자(r32/r33/r34) 기준 `banList` 전부 공백(연속 2회 동일 테마·2회+ 동일 accent/face 없음) — 자유 배정.
- 최근 5라운드(r30-r34) 매크로버킷·차트타입 전수 확인 → 카드-보드(r30)·3-페인 벤치/드릴다운/중첩트리(r31, self-judged)·스몰멀티플/와플/프로세스맵(r32)·핵스맵/퍼널(r33)·퍼널/레이더/워드클라우드(r34) 회피.
- **RETRIEVE 결함(사후 발견, Q58로 적재)**: "카탈로그 최초" 판단을 `works.ts`의 승격된 `category: "dashboard"` 제목만으로 내렸고, `app/src/app/dash-evolve/r*/` 전체 누적 후보(승격 여부 무관)는 검색하지 않았다. 그 결과:
  - 후보 a에 배정한 **OHLC 캔들스틱**은 실제로는 **세 번째** 시도였다 — `r20/b`("Fathom", 패배)·`r29/a`("Lotwise", 패배) 둘 다 미승격 상태로 누적돼 있었다. 렌즈3이 사후 grep으로 발견.
  - 후보 c에 배정한 **산점도/버블**은 `r29/c`("Reloop")가 **그 라운드 승자**(2026-09-25, 미승격)였다 — 오케스트레이터가 직접 사후 확인(JUDGE 단계 이전에 c가 하드게이트 탈락해 실질 영향은 없었음).
  - 두 사실 모두 디자이너 GENERATE 브리핑 시점엔 몰랐고, judge 단계(렌즈1·렌즈3)가 소스 재검증으로 바로잡았다. 승자(b)의 스트리밍 차트는 이 문제의 영향 밖(재검색 후에도 사실상 최초 확인).

## §2 GENERATE

3개 독립 `general-purpose` 디자이너, Q57 교정안(직전 라운드의 "구조가 가장 가까운 단일 참고 파일 지정" 금지) 적용 — 브리프 전문을 프롬프트 본문에 조립해 전달하고 참고 파일 경로는 일절 지정하지 않음.

| v | 제품 | 지배 시각화 | 매크로 골격 | 테마/accent/face |
|---|---|---|---|---|
| a | Fluxgate — Price Volatility Intelligence | OHLC 캔들스틱 | 피드중심 + nullable 상세패널 | dark/violet/mono |
| b | Fluxgate — Edge Platform (Live Traffic) | 실시간 스트리밍 영역차트 | 히어로+단일시각화 | light/lime/grotesk |
| c | Quadrant — campaign spend×conversion 산점도 | 산점도/버블 | 필터구동 커맨드덱 | dark/orange/(디스플레이 없음) |

**관측(판정에 영향 없음)**: a와 b가 서로 전혀 교신 없이 독립 생성됐음에도 **동일한 브랜드명 "Fluxgate"**와 동일한 파일명 `fluxgate-client.tsx`를 우연히 선택했다. 실제 컴포넌트 구조·상태·도메인 로직은 완전히 다름을 직접 대조 확인(렌즈1도 독립적으로 "실제 상태 모양이 다르다"고 확인). 코드 표면 재사용이 아니라 우연한 작명 수렴으로 판단 — judge에게 사전 고지해 편향 방지.

candidates/{a,b,c}.md에 컨셉 + "브리프에 없던 것" 기록 완료.

## §3 HARD GATE

소스 동결 SHA-1(생존 a+b, 최종 수정 반영): `caf992e77777594409596338e5c4ea4f978af97d`

- **a**: 1차 10/10 클린(a11y 100 실측).
- **b**: 1차 lint 2건(`react-hooks/set-state-in-effect` — `prefersReducedMotion`을 effect 내부에서 동기 `setState` / `react/no-unescaped-entities`) → `useSyncExternalStore` 전환 + `&apos;` 이스케이프로 1-fix 재통과, 10/10 클린.
- **c (탈락)**: 1차 복합 실패(lint 2건 + `Intl.NumberFormat` compact notation이 0을 서버/클라이언트 ICU에서 다르게 포맷해 생긴 하이드레이션 불일치 + a11y `target-size` — 데이터 좌표에 배치된 35개 24×24 버튼이 밀집구간에서 인접 여백 0.6px). 1-fix 시도(아포스트로피 이스케이프, `formatCompactUsd` 0 특수처리, 점을 포인터 전용으로 전환+핀 액션을 테이블 Pin 열로 이전)로 원 3건은 해소했으나 **재게이트 재실패** — colgroup 재분배가 만든 신규 390px `cell-overlap`(Conversions↔Rate, 7px) + **별개 원인**의 target-size 재발(`SortableHead` 정렬 버튼이 높이 15.7px로 24px 미달, 산점도 점과 무관). 스킬 §3 "재실패 시 탈락" 적용 — `reassign-queue.md` #8 등재(정밀 진단 포함).
- **환경 메모**: `PW_CHROMIUM_PATH`만으로는 lighthouse가 Chrome을 못 찾아 a11y/perf가 `unavailable`(=pass, 미실측)로 떨어짐을 발견 — `CHROME_PATH`를 함께 지정해야 실측된다. 이후 전 게이트 호출에 둘 다 지정, SCORES.md에 기록.

## §4 JUDGE 패널 (생존 2후보 a·b)

screenshots: 390/1280/1440/1920 × 4 스크롤 지점, 32장, blank 0.

- **렌즈1(브리프준수)**: 1위 b, 2위 a. a의 치명적 결함: 지배 시각화(캔들스틱)와 그 필수 폴백(OHLC 테이블)이 **기본 렌더에서 아예 안 보임**(핀 전까지 빈 상태) — "단일 지배 시각화는 hover 전에도 상시 가독"이라는 브리프 원칙 위반. 그 외 데스크톱 테이블 가로스크롤(OHLC `<details>` 전개 시), 워치리스트 1440px 과도 트렁케이션, 쉘 미완성(워크스페이스 스위처 없음, 토픽바 주요액션 버튼 없음), 팔레트에서 핀한 항목 언핀 불가 등 다수 지적. b는 390px 컨트롤 클리핑(아래 §3-1에서 수정)·팔레트 커밋 무동작(수정)·대비 미달 placeholder(수정)·ARIA 오용 2건(수정) 등 더 적은 수의 좁은 결함.
- **렌즈2(상용완성도)**: 1위 a, 2위 b. a는 실동작 인터랙션·정합되는 집계치·절제된 다크 스타일로 더 "출시 가능한" 인상. b는 데이터 모델은 더 깨끗하지만(단일 버퍼에서 KPI/차트 동시 파생) **스스로 가짜임을 5곳에서 드러내는 문구**("Demo data, not a live feed" 등 사양서 성격 텍스트가 그대로 제품 카피에 남음), **무동작 "Export traffic report" 버튼**, **42 vs 32/35 노드 수 불일치**, 390px 클리핑을 이유로 2위.
- **렌즈3(차별성)**: 1위 b, 2위 a. §1에서 보정된 정보로 재확인 — a는 `r20/b`·`r29/a`에 이은 **세 번째** 캔들스틱+레일+피드 계열 시도(선택 출처가 레일→피드로 바뀐 것이 유일한 실질 차이, nullable-pin 자체도 `r29/c` 승자의 어휘를 반복). b의 스트리밍 영역차트는 정적 영역차트 자체는 카탈로그에 흔하지만 **"실시간 롤링+pause/resume+스크러버" 행동 축은 전례 없음** — "형태가 아니라 행동에서 나오는 신규성"으로 b 손.
- **집계**: 1위표 렌즈1=b, 렌즈2=a, 렌즈3=b → **2:1 깨끗한 다수결, 승자 b**. 완전동률 아님, tie-break 불요.

## §3-1 판정 후 수정 (승자 b)

렌즈1(컴플라이언스 렌즈)이 근거와 함께 지목한 **규칙 위반만** 좁게 해소했다. 렌즈2(완성도 렌즈)가 지목한 항목(누설된 사양서 문구, 무동작 Export 버튼, 노드 수 불일치)은 **취향·완성도** 범주로 §3-1 범위 밖이라 판단해 손대지 않았다(다음 라운드/델타 학습 대상) — 순위를 바꿀 만큼 광범위한 재작성을 피하기 위해서이기도 하다.

적용한 수정:
1. 390px에서 기간창(60s/90s/180s) 세그먼트가 뷰포트 밖으로 잘림(루트 `overflow-x-hidden`이 sweep에서 숨김) → `sm` 미만에서 세로 스택으로 전환.
2. ⌘K 팔레트에서 리전 항목을 클릭/Enter 해도 아무 일도 안 일어남(해당 인터랙션이 "실동작"이 아님) → `onRegionChange`를 실제로 호출하도록 배선, Enter 커밋 핸들러 추가.
3. 알림 팝오버가 `role="menu"`인데 자식이 `menuitem`이 아닌 읽기전용 리스트(ARIA 콘텐츠 모델 위반) → `role="region"`으로 교체.
4. Pause/Resume 버튼이 `aria-pressed`와 바뀌는 라벨("Pause stream"/"Resume stream")을 동시에 써서 상태가 두 가지 다른 방식으로 중복 낭독 → `aria-pressed` 제거(라벨 관용구만 유지).
5. 팔레트 입력 placeholder가 `zinc-400`으로 라이트 표면 하한(`zinc-500`) 미달 → `zinc-500`으로 교정.

재게이트 10/10 클린. 순위 재계산 없음(양측 승리 렌즈 모두 이 항목들을 결정근거로 인용하지 않음).

## §5 LEARN

신규 L1 delta 1건 — "지배 시각화의 신규성은 마크 타입이 아니라 시간에 따른 행동(behavior)에서도 올 수 있다"(§4 렌즈3 근거 인용). `dash-deltas-provisional.jsonl`에 적재.

## §6 지식 정제 게이트

기존 delta와 충돌 없음 — 기존 매크로버킷/KPI종속 계보 delta들과 상호보완적(다른 축). 재현(2라운드+) 아직 없어 L1 유지, 승격 보류.

## §7 기록

- `auto-ledger.jsonl`에 target=dash, round=auto-dash-r35, winner=b, no_winner=false로 append.
- `vault/index.md` "세대 기록" 등재.
- `reassign-queue.md` #8(Quadrant 탈락) 신규 등재 — 정밀 진단 포함.
- `questions-queue.md` Q58 신규 등재 — RETRIEVE의 "카탈로그 최초" 판단이 승격 갤러리만 보고 `dash-evolve` 누적 아카이브를 안 봐서 생긴 연구 공백, 다음 라운드부터 전체 아카이브 grep을 RETRIEVE 절차에 명문화.
- 정본(`dash-brief-v3.md`·`design-principles.md`·`page-brief-core.md`·`page-brief-repo.md`·타입 프로파일) 무변경. `/dash` 갤러리·`/v1~v5` 무변경.
