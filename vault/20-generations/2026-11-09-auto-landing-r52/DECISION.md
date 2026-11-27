# auto-landing-r52 — DECISION

## 0. 라운드 확정
이 스케줄 세션의 2번째 요청 라운드. 라운드 1은 `auto-native-r53`(승자 a, 3파전 tie-break)이며 커밋+푸시(`e88f97e`) 완료 후 이 라운드를 시작했다. `round-budget.mjs "2"` 재호출 → **N=1**(미채움 0종, 근거 동일). 타깃: 라운드 1이 이미 native를 소진(월요일 고정 주기)했으므로 `[dash, landing]` 중 균등 난수 → **landing** 당첨(`node -e "Math.random()"` 1회, 결과 기록: landing). reassign-queue.md 확인 — target:landing 대기 항목 없음(대기 중인 유일 항목은 #21 target:dash, 미소비).

## 0-0. 서브에이전트 가용성
Agent 도구 확인됨(라운드 1에서 이미 검증). designer 3·judge 3 전부 `general-purpose` 서브에이전트. `self_judged: false`.

## 1. RETRIEVE
읽은 것: `design-principles.md` 전문, `page-brief-core.md` 전문, `page-brief-repo.md` 전문, `reassign-queue.md`(target:landing 없음 확인), `landing-deltas-provisional.jsonl`(85줄, 최근 15건 요약), `curation-criteria.md`(라운드 1에서 이미 전문 로드), `questions-queue.md`에서 landing 관련 미결 질문, `vault/20-catalog/ux-guidelines.catalog.md`(web/both 행), `vault/20-catalog/motion.catalog.md`(landing 열), `vault/30-ledger/auto-ledger.jsonl` landing 최근 8개 + `landing-forms.jsonl`(v0-v5 베이스라인 아키타입), `scripts/catalog-variety.mjs` 실행(카탈로그 전체 65작품 분포 — landing 전용 세분은 없어 최근 3 landing 승자(r49 dark/blue · r50 light/orange · r51 dark/cyan)를 직접 대조), app 레포 관례(`globals.css` 폰트 변수, `page.tsx`+클라이언트 컴포넌트 분리 패턴, framer-motion/lucide-react 설치 확인).

## 2. GENERATE
designer 3개 병렬 디스패치(조립 브리프 전문을 프롬프트 본문에 직접 기재). 매크로-골격 선제 체크 겸 다양성 축 선제 체크를 결합해, 최근 landing 승자들이 이미 소진한 입력 모달리티(페어와이즈 듀얼 r50/b·r51/a, 드래그-재정렬 사다리 r51/b, 다중점 예산 곡선 r51/c, Sankey 흐름 r47/b, 티어 사다리 r50/c)를 피해 **입력 모달리티 자체를 레인으로 명시 배정**했다:
- **a**: 단일 연속 스크럽/드래그 (listing-age 타임라인)
- **b**: 이산 다중선택 토글셋 (신뢰축 체크리스트, 고정 6개 중 임의 조합)
- **c**: 직접 타이핑 숫자 입력 (예산 필드 — 이 카탈로그 52라운드 역사상 최초의 키보드 타이핑 주입력)

최근 승자(r51) 축(dark/cyan/`display-mono`)은 금지 축으로 명시 전달, 정확한 재사용 없음(a=dark/amber/grotesk, b=light/violet-default/wide, c=light/terracotta/grotesk).

산출:
- **a** = "Sell it at the moment buyers actually want it" — 리스팅 경과일수(Day 0–60) 스크러버 하나가 순수 지수함수 파생(`model.ts`)으로 히어로 통계스트립+히어로 미니카드+제품프리뷰그리드+Value섹션 거울 스크러버+클로징 CTA 문장까지 **5곳을 동시 갱신**. 소셜프루프는 의도적으로 라이브 연결하지 않고 코드 주석+지면 모두에서 "스냅샷"으로 명시(과잉주장 회피).
- **b** = "Secondhand, matched like it was made for you." — 6개 고정 신뢰신호 체크박스(임의 조합) → 집계 통계밴드 + 필터/재랭크된 카드그리드 동시 파생. 전원 해제(AND 결과 0건) 시 최근접 랭킹 폴백.
- **c** = "type a budget, meet your match" — 타이핑 예산 입력(디바운스 250ms, 유효성 검증, 빈/무효 입력 시 마지막 유효값 유지) → 임계값 필터+매치율 랭크.

**브리프 구멍 보고**: 세 candidate의 `candidates/{a,b,c}.md`에 각각 기록(이번 라운드 조치 없음).

## 3. HARD GATE
dev 서버 3100 기동(이 라운드가 띄움, Next.js 16.2.10 Turbopack, 890ms ready). `node scripts/gate.mjs --target web --routes /landing-evolve/r52/<v>` 개별 실행.

**1차**: a `static` 1건 실패(`no-unlisted-font`, `Hero.tsx:57`) — `fontFamily`가 JS 상수(`DISPLAY_FONT`, `tokens.ts`에서 import)를 참조해 리터럴만 보는 정적검사기가 못 잡음(`auto-landing-r50/a`와 동일한 기지 실패 유형, `design-principles.md`에 이미 기록됨). b·c는 1차부터 클린.

**1-fix**: 오케스트레이터가 직접 수정(기계적·규칙위반 해소 한정) — `Hero.tsx`에 리터럴 `"var(--font-display-grotesk)"` 인라인, 이제 미사용된 `DISPLAY_FONT` import 제거.

**2차**: a 10/10 클린. 전원 10/10, violations 0. a11y 전원 100, perf a=97·b=97·c=90.

동결 해시(등록~판정 구간 불변): `96daea5dc6547187dc33e22c0d34d121882ae8b5`.

## 4. JUDGE 패널
스크린샷: 후보별 `scripts/capture-shots.mjs`로 4폭(1280/1440/1920/390)×4 스크롤 지점(0/35/70/100%) = 48장 전수 캡처, blank 0건(스크립트 자체 픽셀 검증 + 오케스트레이터 3장 샘플 육안 확인). judge에는 후보당 4장(`<v>-1440.png`·`-1440-s35.png`·`-1440-s100.png`·`<v>-390.png`) 지정.

judge 3개 병렬(Agent `general-purpose`), 블라인드(`candidates/*.md` 열람 금지 명시).

- **렌즈1(브리프/DNA 준수)**: **a > b > c**. a=히어로 카드 그리드가 1440px에서 `lg:` 오버라이드 없이 3열 그대로 유지되어 스크롤 없이 3장 전부 노출(히어로 폴드 규칙 완전 충족) + accent(amber `#F59E0B`) 대비 수치를 렌즈1이 직접 WCAG 상대휘도로 재계산해 9.15:1 일치 확인 + 웨이트 3종 전원 명시 클래스(암묵 기본값 의존 없음). b·c는 공통 결함 — `lg:grid-cols-1`로 1440px에서 카드가 1장만 보이고 2번째부터 스크롤해야 함(히어로 폴드 규칙 부분 미충족). c는 추가로 카드 아트의 장식용 radial-gradient 하이라이트 + 블러 액센트 블롭(스크롤 패럴랙스)이 anti-slop "장식 그라데이션 금지" 조항과 정면 충돌(세 후보 중 유일). 부수 발견(순위와 무관, 세 후보 공통): `design-principles.md` Typography 절이 "헤딩: Inter"라고 적지만 `globals.css`에 Inter 자체가 설정돼 있지 않고 레포 전체가 헤딩에도 `--font-sans`(Pretendard)를 쓴다 — 정본과 실제 레포 설정의 불일치, 세 후보 모두 동일해 순위에는 영향 없음.
- **렌즈2(상용 완성도)**: **a > c > b**. a=11개 파일로 분리된 가장 완결된 엔지니어링, 카테고리별 실제 일러스트(`ProductArt.tsx`), 라이브 연결 안 한 섹션을 코드·지면 양쪽에서 명시적으로 "스냅샷"이라 라벨링(이 코드베이스의 핵심 독트린 실패 유형을 가장 정확히 이해하고 회피한 유일한 후보). c=타이핑 입력의 엣지케이스(빈값·무효값·디바운스)를 가장 정교하게 처리 + 정량화된 신뢰 통계 블록(42,000+ 판매자 등)이 세 후보 중 가장 설득력 있는 소셜프루프. b=AND필터+최근접 폴백이라는 조합적으로 가장 어려운 로직을 우아하게 풀었으나(가산점), 카드 아트가 lucide 아이콘+단색 타일뿐이라 세 후보 중 일러스트 투자가 가장 약하고 히어로의 증명 블록도 구조화된 통계카드가 아니라 인라인 텍스트 한 줄뿐.
- **렌즈3(구조적 차별성)**: **a > c > b**. a=단일 연속값이 "집합 구성/순서는 전혀 안 바뀌고, 모든 항목의 표시값 자체가 공식으로 재계산되어 5곳에 동시 분배"되는 조합은 기존 52라운드 아카이브 요약 어디에도 없는 새 지점. c=입력축 자체(타이핑)가 카탈로그 최초(모든 선행 라운드가 슬라이더/다이얼/토글/드래그/다중선택) + 출력축(연속 임계값 필터+랭크)도 아카이브 목록과 다르나, 메커니즘 자체는 "예산 필드가 당연히 낳을 법한" 가장 통상적인 필터링이라 출력축 참신성은 상대적으로 낮음. b=입력축(이산 다중선택)이 기존 "가변 기수 다중선택 세트빌더"와 유사 계열이나, 출력이 단일 숫자가 아니라 통계밴드+재랭크 그리드 이원 출력이고 AND→최근접폴백의 2모드 reachable-state가 추가된 진짜 확장 — 셋 중 아카이브와 가장 가까운 지점이라 3위. (세 렌즈 공통 소견: 세 후보 모두 동일한 5섹션 매크로 셸(히어로→프리뷰→Value→소셜프루프→클로징)을 쓴다 — 입력 모달리티가 다르므로 결격은 아니나 기록.)

## 집계 — 3-0 만장일치
1위 득표: 렌즈1→**a**, 렌즈2→**a**, 렌즈3→**a**. 완전 동률(3파전)이 아니라 **만장일치**이므로 tie-break 규칙 자체가 발동하지 않는다 — `curation-criteria.md` "Q32 판정"의 통상 다수결 범주(만장일치는 2-1보다도 더 명확한 정상 결과).

## 승자: a — "Sell it at the moment buyers actually want it" (listing-age scrubber)
세 렌즈 중 어느 렌즈도 a에 규칙 위반을 지적하지 않았다(렌즈2가 언급한 유일한 약점은 "카탈로그가 6개뿐이라 숫자 주장의 체감 규모가 b·c보다 작다"는 완성도 인상평이지 규칙 위반이 아니다). **§3-1 판정 후 수정 불요** — 동결 해시 `96daea5dc6547187dc33e22c0d34d121882ae8b5` 그대로 승격.

## 판정 커버리지 자진 신고 (세 렌즈 공통 미확인 범위)
- 1280px·1920px 폭 스크린샷은 세 렌즈 모두 미확인(1440·390만 지정).
- 실브라우저 렌더/실제 Tab 키 포커스 가시성은 소스 코드 추론으로만 판단 — axe·실측 도구 미사용.
- c의 terracotta 액센트 대비 수치는 렌즈1이 독립 재계산하지 않음(a·b의 amber/violet만 직접 재계산해 일치 확인).
- 렌즈3은 52라운드 아카이브의 실제 소스에 접근하지 못해 약어 설명(한 줄 라벨)만으로 차별성을 판단 — "가장 가까운 선례와 실제로 얼마나 겹치는가"는 라벨 수준 추정이다.
- build/typecheck 재실행 없음(§3 하드게이트가 이미 통과 확정).

## 5. LEARN
`node -e "import('./scripts/design-loop.mjs').then(m=>m.appendLedger({round:'auto-landing-r52',variant:'a',delta:'A single continuous live-manipulation control need not drive a chart/dial/plot as its primary output shape -- it can instead drive a pure-function recomputation of every displayed value for a FIXED-cardinality, FIXED-order item set (no filtering/sorting/membership change at all), broadcasting the one derived state to multiple independent page regions (hero stat strip, hero mini-cards, full product grid, a second mirrored instance of the control itself, and a closing-CTA sentence) via one lifted state variable read by pure derivation functions. This is a genuinely different output vocabulary from this catalog is established data-viz-widget and 2D-coordinate-plot forms (both of which render a chart/marker): here nothing is charted at all, only ordinary UI copy/numbers recompute in place. A companion technique worth generalizing: sections that are deliberately NOT wired to the live control should say so explicitly, in both code comment and on-page copy (e.g. labeling testimonials a snapshot), which is the most direct known defense against this codebases own documented failure mode of a page implying every number is live when some are static.',evidence:'lens2: the only candidate that explicitly understands and defends against the exact doctrine failure mode this lens tests for; lens3: that single-input/no-set-change/multi-site-pure-recompute shape is not described anywhere in the given archive list, making it the most novel point of the three',judge_votes:{lens1:'a',lens2:'a',lens3:'a'},confidence:'high',level:'L1',status:'provisional'},'vault/00-principles/landing-deltas-provisional.jsonl'))"`

level L1 — 단일 라운드, 특정 후보(a) 종속. 상승은 정제 게이트가 판단(재현 없음, 아래 참조).

## 6. 지식 정제 게이트
landing-deltas-provisional.jsonl 전체(86건, 이번 r52/a 추가분 포함) 재로드. 최근 15건 범위 클러스터링 — 이번 delta는 재현 주장 없이 신규 관찰로만 적혔으므로(§5 delta 본문에 "확장한다"·"재현" 류 표현 없음) 정제 게이트의 "재현 주장 우선 검증" 절차는 발동하지 않는다. 충돌 쌍 없음(기존 delta와 모순 없음 — "매니퓰레이션이 CTA까지 살아있어야 한다" 기존 L2 원칙을 위반하지 않고 오히려 그 원칙을 가장 정밀하게 지킨 사례로 인용됨). 레벨 재책정 대상 없음(이번 delta는 L1 유지, 2라운드+ 재현이나 기계검증 조건 미충족).

**질문 강제 생성 — 1건**: 렌즈1이 순위와 무관하게 부수 발견한 **정본↔레포 설정 불일치**를 `questions-queue.md`에 신규 등재한다 — `design-principles.md` Typography 절이 "헤딩: Inter(세리프 금지)"라고 명시하지만, 이 레포의 `app/globals.css`는 Inter를 전혀 설정하지 않고 본문·헤딩 모두 `--font-sans`(Pretendard)만 쓴다. 52라운드 전체가 동일하게(의도적이든 우연이든) Inter를 안 쓰고도 통과해왔다는 뜻이라, 정본 문구가 낡았거나(레포 실제 값으로 갱신) 애초에 "Inter"가 페이지브리프 코어가 아니라 리포 고유 값인데 잘못된 문서(`design-principles.md`, repo-neutral이어야 할 자리)에 적혀 있을 가능성도 있다 — `page-brief-repo.md` §2 폰트 화이트리스트가 이미 Pretendard/mono/display-3종만 정의하고 Inter는 어디에도 없다. 판단은 사람에게 유보한다(이 라운드는 기록·등재만).

## 7. 기록 + 커밋
- `auto-ledger.jsonl`에 `target:'landing', round:'auto-landing-r52', winner:'a', variety:{theme:'dark', accent:'amber #F59E0B', face:'display-grotesk'}` 포함 entry append.
- `vault/index.md` "세대 기록"에 `[[20-generations/2026-11-09-auto-landing-r52/DECISION|auto-landing-r52]]` 등재.
- `questions-queue.md`에 Inter↔Pretendard 정본 불일치 질문 신규 등재(위 §6).
- 정본(`design-principles.md`·`page-brief-core.md`·`page-brief-repo.md`) 무변경, `/dash` 갤러리·`/v1~v5` 무변경, jsonl append-only 준수, main 무변경.

## 세션 종합
이번 스케줄 세션은 요청된 "2회 연속" 중 round-budget.mjs가 허용하는 유효 2라운드를 전부 완주했다 — 라운드 1 `auto-native-r53`(native, 승자 a, 3파전 tie-break) + 라운드 2 `auto-landing-r52`(landing, 승자 a, 3-0 만장일치). 두 라운드 합산 하드게이트 1-fix 2건(둘 다 기계적·규칙위반 해소), no-winner 0건, 정본 변경 0건.
