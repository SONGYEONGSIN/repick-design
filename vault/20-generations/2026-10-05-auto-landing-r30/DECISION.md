# auto-landing-r30 — DECISION

## §0 라운드 수 / 타깃

- 호출: 사람 없는 예약 실행이 "/dash-evolve 2" 상당의 동작(2라운드 연속)을 요청한 것의 **두 번째 독립 호출**. 1번째 호출(`auto-native-r30`)이 완주·커밋된 뒤 이 호출을 새로 시작했다.
- `node scripts/round-budget.mjs --explain 2` → **`1\t미채움 0종`** — 다시 N=1 강제(PAGE_TYPES 여전히 18/18 등재).
- Agent 도구 가용성: 가용. 3개 독립 `general-purpose`로 GENERATE, 3개 독립 `general-purpose`로 JUDGE. `self_judged: false`.
- **native 주간 고정 재확인**: 오늘(월요일)의 native 할당은 1번째 호출(`auto-native-r30`)이 이미 충족했다 — 같은 날 두 번째 native 강제는 과거 실행 관례(동일 세션 내 두 독립 호출 시 1번째가 이미 생산한 타깃을 2번째가 제외하는 패턴, `r25`·`r29` 선례)와 일치하지 않으므로 적용하지 않았다.
- 타깃 결정: 미채움 큐 재조회 결과 여전히 0종 → `dash/landing/native` 균등 난수에서 **native를 제외**(이번 세션 1번째 호출이 이미 생산)하고 `{dash, landing}` 중 재추첨 → **landing** 당첨.
- `reassign-queue.md` "대기 중": landing 항목 없음(dash #8 항목만 대기 중, 이번 타깃과 무관) — 재배정 없음.
- 라운드 번호: `auto-ledger.jsonl`에서 target=landing 최대 라운드(r29, 2026-10-01) + 1 = **r30**.

## §1 RETRIEVE

- BRIEF: `vault/00-principles/design-principles.md` 전문(Voice·Layout·Color Tokens+대비계산·Typography+폭계산상수·접근성·Spacing·Landing구조1-5·금지·에셋인터랙션).
- 공통 코어: `page-brief-core.md` §2-4(접근성·타이포·이미지규율·폭검증) + `page-brief-repo.md`(영문전용·폰트 화이트리스트·레포 경로).
- 참조 카탈로그: `ux-guidelines.catalog.md`(web/both 행) + `motion.catalog.md`(landing 열 — framer-motion 적극, §공통필수 결정론·motion-reduce·opacity:0잔존금지).
- 최근 5라운드(r25-r29) 숙지: r26 no-winner, r27·r28·r29 각각 L1/L2 delta를 남김 — 특히 **r28/c(L1)·r29 tie-break(L2, 2라운드 재현)**가 "시각화장치 축만 갈라도 그 아래 서사골격+카피템플릿 층위의 수렴은 못 막는다"를 확립. r28/a가 추가로 **SSR `opacity:0` 하이드레이션게이팅 결함**(Q56)을 L1로 남김.
- 열린 delta 반영: 이번 라운드는 (1) 시각화장치 **그리고** 서사골격을 동시에 명시 배정(r28/r29보다 한 층 강한 방어) + 과거 재현된 구체 카피템플릿 5건을 금지 목록으로 전달 + (2) `useSyncExternalStore` 하이드레이션게이팅을 GENERATE 프롬프트에 필수 사항으로 명문화.
- 다양성 축(`catalog-variety.mjs`): 최근 landing 승자 3연속(r25·r28·r29)이 전부 light 테마, accent는 blue-hex/emerald/rose(-hex)/green(최근 4라운드 전부 다름 — 정본 "accent 계열 자유" 조항이 실제로 작동 중), face는 grotesk/wide/mono/wide. **회피 권고**(강제 아님)로 designer 프롬프트에 전달: dark 테마 고려, 최근 미사용 hue(cyan/sky/indigo/violet/orange/amber/teal/lime) + named Tailwind scale(비-hex) 고려.
- 밴드 폼(시각화장치) 배정 — 기존 카탈로그 소진 목록(before/after·radial gauge·비교표+탭·대화형트랜스크립트·redline문서·재정규화다이얼·가변다중선택·연속2D산점도·레이어스택·분포히스토그램·노드-엣지그래프·버블팩·waterfall/bridge·2D히트맵·radial arc·stream graph·radar polygon·treemap·slope chart·Sankey·funnel·parallel-coordinates·연속슬라이더 리더보드·이산토글 게이트체인) 전부 회피하고 3개 신규 장치 배정: a=불릿그래프 예산적합(연속슬라이더), b=마리메꼬/모자이크 신뢰도분해(이산선택), c=아이시클/파티션 매칭근거(가변가중 다중슬라이더).
- 서사골격 동시 배정: a=워크드이그잼플 워크스루, b=카테고리 감사/비교, c=AI 투명성/설명책임.

## §2 GENERATE

3개 독립 `general-purpose` 서브에이전트(서로의 산출물 비가시) 병렬 디스패치. 조립한 브리프 전문(정본 발췌·기계검증규칙·영문전용·레포관례·대비계산 의무·중복금지)을 프롬프트 본문에 직접 전달, 경로만 주지 않음. tsc·게이트 실행 지시 미포함.

| v | 장치 | 서사골격 | accent | theme | display face |
|---|---|---|---|---|---|
| a | 불릿그래프(가격상한 슬라이더 → 5개 카테고리 밴드 재분류) | 워크드이그잼플("$180 to spend on a jacket") | amber-500(named) | dark | mono(숫자만) |
| b | 마리메꼬/모자이크(카테고리 선택 → 재고비중×신뢰등급 2축 재계산) | 카테고리 감사 | teal(named) | dark | grotesk |
| c | 아이시클(3가중슬라이더 → 1개 예시상품의 매칭근거 재분할) | AI 투명성 | cyan(named) | dark | grotesk |

각 candidates/{a,b,c}.md에 컨셉 + accent 대비계산(필수) + "브리프에 없던 것" 기록 완료.

소스 동결 SHA-1(최초): `c1556a25ec279639450ae2dea077be40dddbc3b0` — §3 1-fix 후 재게이트 통과(아래), 해시는 SCORES.md에 1차 동결값만 기록(재게이트는 lint/a11y 수정뿐, 재동결 불요 — 판정은 1-fix 이후 상태로 진행하므로 1-fix 후 버전이 "판정된 산출물"이다. §3-1과 달리 이는 §3 1-fix 루프 자체이므로 정상 절차다).

## §3 HARD GATE

`node scripts/gate.mjs --target web --routes /landing-evolve/r30/a /landing-evolve/r30/b /landing-evolve/r30/c`

- **1차**: `pass:false`. lint 4건(전부 c — `react/no-unescaped-entities`, `hero.tsx:39,41,51`·`value-split.tsx:45`, 미이스케이프 아포스트로피). a11y 93(전부 b — 승격 하드페일 감사 `definition-list`+`label-content-name-mismatch`).
- **1-fix**: c는 4건 전부 `&rsquo;`로 치환. b는 두 결함 모두 근본 구조 수정 — ① `<dl>` 직계 자식이 `div > div`(dt/dd가 2단 중첩)였던 것을 `div > (dt, dd)` 직계 쌍 패턴으로 재구성(스와치 아이콘을 `dt` 내부로 이동). ② 카테고리 선택 버튼 4개(데스크톱+모바일 레이아웃 각 변형)의 `aria-label`이 가시 텍스트("Sneakers"+"32.4%")를 포함하지 않는다고 axe가 판정(`label-content-name-mismatch` — `Lighthouse` 직접 재현으로 selector까지 특정) → `aria-label` 제거, 대신 가시 텍스트 뒤에 `sr-only` 보충 문구를 추가하는 레포 기존 확립 패턴(`button-name` 결함의 과거 해법과 동일 계열 — "라벨을 달면 보이는 텍스트와 어긋나 label-content-name-mismatch로 옮겨간다"는 page-brief-core §1의 경고를 그대로 재현한 사례)으로 전환.
- **재게이트**: `pass:true`, violations 0. a11y 100(`bf-cache`만 미승격 감사로 기록, 하드페일 아님). 10/10 전체 클린.
- 스크린샷: `capture-shots.mjs`로 4폭(1280/1440/1920/390)×4스크롤(0/35/70/100%) = 48장(16×3), blank 0건, 에러 0건.

## §4 JUDGE 패널

judge 입력: 후보당 4프레임(1440 스크롤0/35/70% + 390 스크롤0). 렌즈는 랜딩 파라미터 표를 따름(렌즈1=DNA/브리프준수, 렌즈2=상용 랜딩 완성도 Linear·Stripe·Vercel급, 렌즈3=형태 차별성).

**렌즈1 (브리프준수)**: 1위 b, 2위 a, 3위 c. 하드게이트성 위반은 전원 0건(1-fix 이후). c에 두 가지 구체적 브리프 이탈 발견: ① 전 라우트에 `next/image` 사용 0건 — 상품샷을 타이포그래픽 "고스트워드"로 전원 대체, 브리프 §에셋 "히어로 이미지·제품샷 적극"과 정면 배치 ② 헤더의 별도 CTA("Browse listings")가 히어로 CTA와 **동일 뷰포트 내 동시 노출**(1440·390 스크린샷 모두 확인) — "단일 CTA" 원칙의 모호 영역이지만 a·b엔 이 경쟁 요소가 없음. a·b는 결함 0건, 근소한 b 우위(라인길이 공식 적용 정밀도, 클로징 CTA가 버튼 라벨 자체까지 상태에 묶임).

**렌즈2 (상용완성도)**: 1위 b, 2위 c, 3위 a. **a에서 이번 라운드 가장 심각한 발견**: `data.ts`가 "고정 리터럴 데이터, 무작위성 없음"이라 자체 주석까지 달아놓고도, 페이지 카피는 반복적으로 라이브 백엔드를 주장한다 — "PRICES RE-PULLED EVERY MONDAY", "EVERY BAND FROM REAL LISTINGS, NOT A MODEL", "That number is real, and so is the data underneath it." 코드가 수행하지 않는 효과를 카피가 주장하는, 브리프가 명시 경고한 결함 그 자체. c는 제품샷 부재(렌즈1과 동일 지적)가 유일한 약점이나 카피는 가장 정직("illustrative... recompute the same way, live"로 계산방식과 기반데이터를 정확히 구분). b는 결함 없음 — 클로징 CTA가 문장과 **버튼 라벨 자체**("Browse {현재카테고리} on Repick")까지 동일 상태에서 파생되는 유일한 후보로 "조작이 끝까지 살아있다" 원칙을 가장 완전히 구현(§5 LEARN).

**렌즈3 (차별성)** — **no-winner 아님, 명시적으로 억지 승자 판정이 아님을 자체 확인**: 1위 b, 2위 a, 3위 c. 배정한 두 층위(장치·서사골격)에서는 **전원 실제로 갈렸고** 금지 카피템플릿 5건도 **전원 미위반** — 이번 세션 들어 가장 강한 방어였다. 그러나 **미배정 층위에서 수렴 재현**: ① "조작→watch/redraw" 반사동사 스켈레톤(b·c 본문, a는 메타데이터) ② 상품카드 디스클로저 버튼 메커니즘+카피 거의 동일(3후보 전원, "Why [this/the AI] [matched/picked] this") ③ "Free to [browse/look]." 무약정 문구(a·c) ④ 클로징 CTA "Right now," 오프너(b·c) ⑤ `<input type="range">` 입력장치(a·c, b만 이산선택으로 이탈). 단, 가격배지 3단 구성·scroll-reveal 하이드레이션게이팅·섹션 순서는 정본이 직접 강제하는 공유 제약이라 수렴으로 안 셈 — 렌즈3이 직접 이 구분을 수행했다. 이 발견을 순위 변경 근거로 쓰지 않음(명시). `questions-queue.md` **Q60**으로 적재(위, Q21/Q54/Q56의 세 번째 landing 재현).

## 집계 및 판정

렌즈1=b, 렌즈2=b, 렌즈3=b → **3:0 만장일치로 b(Marimekko Trust Breakdown) 승자.** 억지 승자 아님 — 3렌즈 전원이 독립적으로 b를 1위로 판정했고, b에 대해 어느 렌즈도 규칙위반·구체결함을 지적하지 않았다.

## §3-1 판정 후 수정

불필요 — 승자 b에 지적된 규칙위반 없음(3렌즈 전원 "no faults found").

## §5 LEARN

승자 b의 판정 사유에서 재사용 가능한 delta 1개를 추출해 `landing-deltas-provisional.jsonl`에 append(L1, provisional):
- 요지: "조작 상태가 클로징 CTA까지 생존해야 한다"는 기존 원칙(L2)의 더 날카로운 사례 — 요약 **문장**뿐 아니라 CTA **버튼 라벨 자체**까지 같은 상태에서 파생되면("Browse {current.label} on Repick") 상용완성도 렌즈가 최상위 근거로 인용한다. 별개로(같은 라운드, 패자) 마케팅 카피가 "매주 재수집" 같은 구현되지 않은 백엔드 효과를 주장하는 것은 a11y 힌트·가시 UI 카피에 이미 적용되던 "수행하지 않는 효과를 주장 금지" 원칙이 신뢰 구축용 마케팅 카피로도 확장됨을 확인 — 새 원칙이라 로그만, 재승격은 보류(원문에 명시).

## §6 지식 정제 게이트

- 클러스터링: 이번 delta는 기존 L2(조작생존 원칙)의 날카로운 사례 — 재판정 사유 아님, L2 자체 승격 불요(이미 L2). 마케팅카피 위반건은 신규 관찰 L1.
- 레벨 재책정: 변경 없음 — 이번 라운드는 기존 delta의 2라운드 재현 사례 없음.
- 질문 강제 생성: 렌즈3의 미배정 층위 수렴 재현(①~⑤) → **Q60** 신규 적재(위) — Q21/Q54/Q56 계보의 landing 세 번째 재현, 판단 보류 상태로 다음 1~2라운드 추가 관측 예정.

## §7 기록

- `auto-ledger.jsonl`에 target=landing, round=auto-landing-r30, winner=b, no_winner=false로 append.
- `vault/index.md` "세대 기록"에 등재.
- 정본(`dash-brief-v3.md`·`design-principles.md`) 무변경. `/dash` 갤러리·`/v1~v5` 무변경.
- 후보 route(`app/src/app/landing-evolve/r30/*`) 유지 — 최종 카탈로그 편입은 `/dash-falsify apply`의 킵 결정에 달려 있다.
- landing-deltas-provisional.jsonl: append-only, 1건 추가. questions-queue.md: Q60 신규 추가.
- **이 호출로 오늘 예약된 "2라운드 연속" 요청이 완료됐다** — 1번째(`auto-native-r30`, native, c 승자)·2번째(`auto-landing-r30`, landing, b 승자) 둘 다 승자 확정, no-winner 0건.
