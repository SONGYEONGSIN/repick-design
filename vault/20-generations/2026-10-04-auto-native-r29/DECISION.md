# auto-native-r29 — DECISION

## §0 라운드 수 / 타깃

- 호출: 사람 없는 예약 실행(스케줄된 루틴)이 "/dash-evolve 2" 상당의 동작(2라운드 연속)을 요청. `node scripts/round-budget.mjs --explain 2` → **`1\t미채움 0종 — N≥2 의 근거(커버리지)가 없다`**. `PAGE_TYPES`(`app/src/lib/works.ts`) 18종 전부 카탈로그에 등재돼 미채움 0종이므로 이번 단일 `/dash-evolve` 실행은 N=1로 강제됐다 — 요청값 2는 무시되지 않고 정확히 스킬 §0-0-1 규정대로 다운그레이드됐다. **2라운드 연속 요청은 이 실행을 독립적으로 두 번 순차 호출하는 방식으로 충족한다** (각 호출이 그 시점의 round-budget을 다시 묻는다) — 이것이 그 첫 번째 호출이다.
- Agent 도구 가용성 확인(§0-0): 가용 — 3개의 독립 `general-purpose` 서브에이전트로 GENERATE를, 3개의 독립 `general-purpose` 서브에이전트로 JUDGE를 수행했다(이 환경은 전용 `designer`/`comparator` 에이전트 타입이 아니라 범용 타입만 노출한다 — 과거 r28·r27 라운드와 동일한 제약, 동일한 대응). **`self_judged: false`** — judge 세 개는 전부 GENERATE와 무관한 새 서브에이전트이고 서로를 못 본다.
- 날짜 2026-10-04는 일요일(UTC) — native 주간 고정(월요일 강제) 해당 없음. 타깃은 미채움 큐가 비어 있어 `dash/landing/native` 균등 난수로 결정했다: `node -e "..."` 실행 결과 **native**.
- `reassign-queue.md` "대기 중": 없음 — 재배정 없음.
- 라운드 번호: `auto-ledger.jsonl`에서 target=native 최대 라운드(r28) + 1 = **r29**.

## §1 RETRIEVE

- BRIEF: `native/GENERATION.md`(§1~8 전문) + `native/src/tokens.ts`(DNA 토큰, light/indigo #4f46e5/system 고정).
- 공통 코어: `page-brief-core.md`를 확인했으나 그 조항들(ESLint flat config·next/image·Lighthouse 라우트 등)은 전부 웹 전용이라 RN 코드에 구조적으로 적용되지 않는다 — `GENERATION.md`가 이미 동형 네이티브 대응 규칙(결정론·이모지 금지·토큰 강제)을 자체 보유. page-brief-repo는 네이티브엔 불필요(§0 target table).
- 참조 카탈로그: `vault/20-catalog/ux-guidelines.catalog.md` Native/Mobile 섹션(터치타겟·SafeArea·FlatList·네이티브 a11y·제스처·결정론) + Plat=both 공통행.
- 최근 5라운드(r24~r28) 전부 숙지 — 밴드 폼 분포: blocked-workflow가 r25/a(승)·r26/a(승)·r28/a 세 라운드 중 둘에서 우승, r28 DECISION이 "a가 독립적으로 세 번째로 똑같은 체크포인트 골격을 재현 + 거의 동일한 액션 카피 템플릿"이라고 명시 지적. **이번 라운드는 이 문제를 피하려고 blocked-workflow 폼을 의도적으로 전부 배제**하고 나머지 세 유효 폼(상시 액션바/선택 기반 컨텍스추얼 바/행 단위 파괴 확인)만 배정했다 — 결과적으로 그 판단은 옳았으나(아무도 blocked-workflow를 쓰지 않음), 대신 **다른 재사용 축(코드 표면 복제)**이 터졌다(§4 참조, Q57로 별도 적재).
- 기존 카탈로그 전체 도메인(`native/screens.json`) 확인 후 미사용 도메인 3종 선정: Loyalty Points Statement / Draft Listings / Saved Addresses — 기존 "blocked"·"bank accounts"·"export" 등 도메인과 중복 없음(단, 구조적 재사용은 §4에서 드러남).

## §2 GENERATE

3개 독립 `general-purpose` 서브에이전트(서로의 산출물 비가시) 병렬 디스패치:

| v | 화면 | 밴드 폼 | 비고 |
|---|---|---|---|
| a | Loyalty Points Statement | 상시 노출 액션바(읽기전용 완결 기록) | `Share.share()` 실호출 + 히어로/행이 같은 fold 함수 |
| b | Draft Listings | 선택 기반 컨텍스추얼 바 | `selectedCount`는 Set에서 파생, 파기는 바 자체가 Cancel/Confirm 전환 |
| c | Saved Addresses | 밴드 없음, 행 단위 3상태(normal/confirming/locked) | locked 사유 문장 + 확인 문구와 announce 문구 동일 문자열 |

각 designer에게 GENERATION.md 전 규칙(RN idiom·토큰 강제·영문전용·이모지금지·결정론·a11y 7종 규칙·₩ 글리프 주의)을 프롬프트 본문에 문장으로 조립해 전달했고, **추가로 "파일 구조 관례 참고용"으로 각자 구조가 가장 가까운 단일 직전 라운드 파일 경로를 지정하며 "복사 금지, 네 스타일 키·문구는 직접 지어라"를 명시했다** — 이 마지막 결정이 §4에서 드러나듯 원인이 됐다(Q57).

candidates/{a,b,c}.md에 컨셉 + "브리프에 없던 것" 2~4건씩 기록 완료.

## §3 HARD GATE

소스 동결 SHA-1: `cffbccb3f544680d05ab1e5c624646399c7e6078` (SCORES.md 동일 기록).

`node scripts/gate.mjs --target native --screens evolve-r29-a evolve-r29-b evolve-r29-c` → **12/12 1차 통과, 1-fix 불요, blockedBy 없음**. 상세는 SCORES.md.

## §4 JUDGE 패널

screenshots: 390px·768px × {a,b,c} = 6프레임, `shots/`.

**렌즈1 (DNA 준수)**: 1위 a, 2위 c, 3위 b. 세부: a는 공유 fold로 히어로=행합 증명(손계산 1200+85-500+300+64-120+42-250=821 일치), live region 1개·중복 없음, accessible 래퍼 오용 없음. c는 locked 사유·확인문구 일치 확인, 토큰 위생 가장 깨끗. b는 파기/퍼블리시 완료 시 스크린리더에 무음(출력 없음), 베어 spacing/radius 리터럴 다수(b:405,445,398-400) 등으로 최하위. 전원 하드룰 위반 0건(이 렌즈 기준) — 순수 우열 판정.

**렌즈2 (모바일 완성도)**: 1위 a, 2위 c, 3위 b. a의 Share/Rules가 실제로 동작하고 수치가 손으로 검산한 그대로 일치한다는 점을 독립적으로 재확인. c는 기본 동작은 되지만 Add/Edit 부재, locked 사유가 하드코딩 플래그라는 점을 감점. b는 로직은 가장 정교하나(부분 퍼블리시, 실제 검증 규칙) 완료 시 무음, 390px에서 제목 트렁케이션 다수, 카드 터치영역이 체크서클 외엔 비활성이라는 점에서 최하위.

**렌즈3 (차별성)** — **no-winner 선언, 강제 순위를 요구하면 b>a>c**:
구조 비교 방법론(스타일 블록을 키 무시하고 속성:값 쌍으로 정렬 비교) 적용 결과:
- **a ↔ r28/c (ShippingProtectionClaim)**: 44개 중 28개 블록 속성:값 동일(키만 renaming), 순서까지 동일 — 헤더 kicker/hero card/ledger card/dock 골격 전체. `[rulesOpen, shareOutcome]` state pair가 `[receiptSent, supportOpen]`와 구조 동일, `handleToggleRules`가 `handleToggleSupport`와 완전 동일 바디. 파일 헤더 주석도 근접 패러프레이즈. **신규 요소**: 실제 `Share.share()`(카탈로그 최초).
- **b ↔ r28/b (TaxExportTagging)**: 49개 중 28개 블록 동일. `DiscardStep`/`LockStep` 타입이 동일 구조, `toggleSelected`/`togglePick` 바디 동일, 확인문구 템플릿("~? This can't be undone.")이 명사만 교체. **신규 요소**: 부분 퍼블리시 로직, 필드 기반 ready 판정 — 세 후보 중 자체 기여가 가장 큼.
- **c ↔ r26/c (LinkedBankAccounts)**: 33개 중 22개(67%) 블록 동일 — 가장 심각. Row prop 구조, 화면 state triple, `promoteRow`의 `prev.map` 바디, 확인/기본설정 카피 템플릿까지 명사만 교체. **신규 요소**: locked 사유 배지, 기본주소 제거 시 자동승계 — 상대적으로 가장 적음.

렌즈3은 이를 "공유 토큰 어휘(3속성 이하 매치)"와 명확히 구분해 집계했고(그런 매치는 증거에서 제외), 세 건 모두 단일 가장 가까운 직전 파일에 50~85% 집중됐다는 점에서 우연한 수렴이 아니라 **그 특정 파일을 참고 대상으로 지정한 오케스트레이션 자체의 산물**로 진단했다(§2 참조, 사후 확인).

## 집계 및 판정

표 집계만 보면 렌즈1=a, 렌즈2=a, 렌즈3=no-winner → 기계적 다수결(2:1)로는 a가 승자다. **그러나 이 라운드는 a를 승자로 확정하지 않고 전체를 no-winner로 처리한다.** 이유:

1. 렌즈3이 지목한 결함은 취향이 아니라 `native/GENERATION.md` §3이 명문화한 하드 doctrine("형태를 맞게 골라도 코드 표면까지 닮으면 진다")의 **정량적·검증된 위반**이고, 승자로 꼽힌 a를 포함해 **세 후보 전원**에서 재현됐다 — 패자만의 결함이 아니라 생성 과정 자체의 결함이다.
2. §3-1 "판정 후 수정"은 **규칙 위반 해소에 한해** 좁게 허용되고, 순위를 바꿀 만한 수정은 "재판정 사유"로 명시 배제된다. 이번 결함(스타일 블록 50~85% 동일, 상태/핸들러 구조 동일, 카피 템플릿 재사용)을 제거하려면 사실상 세 후보 모두 전면 재작성이 필요해 §3-1의 허용 범위를 넘는다.
3. 과거 `auto-dash-r18/c` 선례(영문 카피 정책 위반 — 기계 검증 불가·judge 전 발견)에서도 판정상 1위 근거로 인용된 형태가 **정책 위반을 이유로 승격되지 못하고 재배정 큐로 보내졌다** — 심각한 doctrine 위반은 투표 다수결 위에 있다는 조직적 선례가 이미 있다.
4. 스킬은 명시적으로 "no-winner 라운드를 허용한다(억지 승자 금지)"고 규정한다 — 여기서 "억지 승자"란 숫자상 다수결을 기계적으로 적용해 알려진 심각한 결함을 못 본 척 승격시키는 경우를 포함한다고 판단했다.

**근본 원인**: GENERATE 프롬프트가 각 후보에게 "파일-구조 참고용"으로 **구조가 가장 가까운 단일 직전 라운드 파일**을 직접 지정한 것(§2) — 복사 금지 문구를 포함했음에도 3/3 전원이 그 특정 파일을 사실상의 템플릿으로 사용했다. `questions-queue.md` **Q57**로 적재, 다음 라운드(이 세션의 2라운드째 포함)부터 교정안 적용: GENERATE 프롬프트에서 구조가 가장 가까운 단일 참고 파일 지정을 제거하고 레포 관례는 문장으로만 전달한다.

## §5 LEARN

승자가 없으므로 판정 사유 기반 delta는 적재하지 않는다(§5는 "승자가 있으면"을 전제). 대신 조직적 교훈을 `questions-queue.md` Q57로 적재했다(위).

## §6 지식 정제 게이트

해당 없음 — 이번 라운드가 새 delta를 내지 않았다.

## §7 기록

- `auto-ledger.jsonl`에 target=native, round=auto-native-r29, winner=null, no_winner=true로 append(아래).
- `vault/index.md` "세대 기록"에 등재.
- 후보 route(native/src/evolve/r29/*)·screens.ts/json 등록은 **유지**한다(no-winner 처리 규약: "후보 route 유지 — 주간 반증에서 일괄 드롭").
- 정본(`dash-brief-v3.md`·`design-principles.md`) 무변경. `native/GENERATION.md`·`tokens.ts`도 무변경(이번 라운드는 L3 승격 근거 없음). `/dash` 갤러리·`/v1~v5` 무변경.
