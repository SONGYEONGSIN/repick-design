# auto-contact-r1 / c — Tessera

Tessera is a fictional reconciliation platform for payment-operations teams whose contact page is a
**deflection-first triage desk**: one box takes what you type, scores it against a fixed corpus of
nine resolutions, and returns a *single routed verdict slip* — open incident, documented, asked
before, or needs a person — that changes shape by verdict instead of filtering a result list, while
all four desk addresses, their staffed hours, their named owner and their median and p90 first-reply
times render in full at the zero-interaction default above and below it. Four wired interactions:
the triage query plus six symptom chips; the resolve/escalate decision (a query matching nothing
skips deflection entirely and opens the handoff by itself); a send-time simulator (weekday + UTC
hour) that advances each desk's median through *staffed minutes only* and redraws a 7-day coverage
strip with a marker at the chosen hour; and copying the prepared, pre-addressed message. Theme:
light. Accent: rose (rose-700 interactive surfaces, rose-800 body links, rose-100/rose-50 tints).
Display face `--font-display-wide` on the h1 and four section headings only; body and all Korean on
`--font-sans`. Exactly three weight classes route-wide (`font-normal`, `font-semibold`, `font-bold`).

## 브리프에 없던 것

1. **① `contact` 타입의 필수 요소가 무엇인지 — 프로파일 문서가 없어 §1에 해당하는 목록 자체가
   존재하지 않았다.** ② 여섯 요소로 정의했다: 창구 인벤토리(누가 무엇을 받는가) · 도달 수단(주소를
   그대로 인쇄) · **응답 계약**(언제 답이 오는가, 근거 수치와 함께) · 자가해결 경로 · **취급하지
   않는 것**(어디로 보내면 하루를 버리는가) · 물리 주소·법인 정보. ③ [[brief-careers]] §1이 채용
   타입을 여섯 요소로 규정한 형식을 그대로 빌려 왔고, 항목 자체는 인접 타입에서 유추했다 —
   careers의 "오픈 롤 인벤토리"에 대응하는 것이 contact에서는 **창구 인벤토리 + 응답 계약**이라고
   판단했다. 이 판단이 이 후보의 §2 하드 기준 후보이기도 하다.

2. **① 자가해결 우선형이 다크패턴으로 넘어가는 선을 어디에 그을지 — "연락처를 숨기지 마라"는
   지시가 있었지만 무엇이 위반인지의 기계적 정의는 없었다.** ② 세 개의 구조적 장치로 고정했다:
   ⓐ 네 창구의 주소·시간·중앙값이 h1 바로 아래 `dl`에 **무조작 기본 상태로** 렌더된다(트리아지
   박스보다 위), ⓑ 에스컬레이션은 항상 1클릭이며 "해결됐다"를 눌러도 사라지지 않는다, ⓒ **매칭
   0건이면 자가해결 단계를 건너뛰고** 핸드오프가 스스로 열린다. ③ [[curation-criteria]]의
   "차별성 ↔ 완성도 상충 시 판정 방향"이 세 라운드 재현으로 정한 규칙 — **핵심 증명은 상시-노출
   기본값, 조작은 그 증명을 강화**한다 — 을 contact의 증명("어디로·언제")에 그대로 적용했다.
   성공 지표도 같은 이유로 "문의 수"가 아니라 페이지에 인쇄한 `63% never needed to write`로 뒀다.

3. **① 검색을 쓰되 `auto-careers-r1/b`·`auto-about-r1/b`의 "검색이 좁히는 리스트" 재스킨을
   어떻게 피할지 — 금지는 명시됐으나 대체 형태는 지정되지 않았다.** ② 입력은 리스트를 **줄이지
   않고 슬립 하나를 통째로 교체**한다. 출력은 verdict 종류(status / docs / answered / human)에 따라
   **골격이 달라지고**(인시던트는 상태·워크어라운드, 문서는 번호 매긴 절차, 답변은 사람 서명이
   붙은 본문, 무매칭은 즉시 핸드오프), 2순위는 링크 한 줄로만 노출해 결과 집합을 만들지 않는다.
   ③ [[curation-criteria]] Q6 판정("입력축 × 출력축 조합표로 환원")에 근거했다 — 입력축(타이핑)은
   같지만 출력축이 "필터된 목록"에서 "단일 라우팅 판정"으로 바뀌므로 조합이 새롭다고 판단했다.
   같은 이유로 무매칭을 "0 results" 빈 상태로 두지 않았다(빈 목록이 곧 실패인 careers §0과 동형).

4. **① 응답 시간을 정적 SLA 문구로 쓸지 계산할지, 그리고 축을 무엇으로 둘지 — 브리프에 규정이
   없다.** ② **발신 시각(요일 + UTC 시)을 입력축**으로 두고, 각 창구의 중앙값을 **근무 중인 분만
   골라 전진**시키는 실산술로 정했다(금요일 23:30 발신이 토요일 00:04 답장으로 둔갑하지 않는다).
   근거 데이터는 창구별 근무 창(요일 집합 + 분 단위 구간) 테이블이고, 화면에는 중앙값·상위 10%
   지연·근무 창 텍스트·7일 커버리지 스트립이 함께 나온다. ③ [[brief-careers]] §2의 "보상은 축과
   계산 방식을 먼저 정한다"를 같은 문제 형태로 보고 이식했다 — 숫자를 실으면 **입력 축이 무엇인지**와
   **조회인지 산술인지**가 화면에서 읽혀야 한다는 규칙은 보상에만 참일 이유가 없다. contact에서
   그 숫자는 보상이 아니라 응답 시간이다.

5. **① 시계를 어디서 가져올지 — contact 페이지는 본성상 "지금 열려 있나"를 말하고 싶어하는데
   `new Date()`가 하드게이트로 금지돼 있다.** ② 시계를 **사용자가 고르는 값**으로 바꿨다. 기본값은
   수요일 09:00 UTC 고정이고, 서버·클라이언트가 같은 값을 렌더하며, "지금"이라는 단어를 쓰지 않고
   "당신이 그 시각에 보낸다면"으로 카피를 다시 썼다. ③ 결정론 규칙([[page-brief-core]] §1)이
   원인이지만, 결과적으로 **오프라인 상태를 감추지 않는 쪽**이 됐다 — 방문 시각에 따라 "지금
   응답 가능"이 사라지는 화면보다, 주말 새벽을 직접 골라 답이 월요일에 온다는 걸 확인할 수 있는
   쪽이 증명으로 더 강하다고 판단했다. 반증 대상: 이 대체가 손실인지 이득인지는 이 라운드가 처음 잰다.

6. **① 실제 `<form>`을 둘지 — 상용 contact 페이지의 관행은 폼이지만 이 카탈로그의 작품에는
   백엔드가 없다.** ② HTML 폼을 두지 않고, **주소가 이미 채워진 초안 + 클립보드 복사 + `mailto:`**
   조합으로 갔다. 초안에는 사용자가 친 문장과 **이미 시도한 문서 제목**이 자동으로 들어간다.
   ③ [[ux-guidelines.catalog]] Forms 행이 "제출 피드백: 로딩 → 성공/에러, 무반응 금지"를 🔴로
   요구하는데, 아무 데도 POST하지 않는 폼은 그 요구를 **구조적으로 만족시킬 수 없고** 무음 실패가
   된다. 클립보드는 실패 경로가 있는 실제 동작이라 성공·차단 두 메시지를 `role="status"`로 낼 수
   있다. 대신 "초안은 편의지 요구사항이 아니다"를 명시하고 맨손 이메일 경로를 나란히 뒀다.

7. **① 창구를 몇 개로, 어느 수준까지 구체적으로 쓸지 — 브리프에 수 규정이 없다.** ② 네 개
   (제품·API 지원 / 계정·청구 / 신뢰·보안 / 세일즈·파트너십)로 두고, 각 창구에 **담당자 실명과
   직함 · 취급 목록 3개 · "여기 쓰면 안 되는 것" 한 줄 · 보조 채널**을 붙였다. ③ [[brief-careers]]
   §2의 "공고 수와 구체성이 함께 가야 한다"를 창구 수에 적용했다 — 창구가 많으면 라우팅이 과잉이
   되고, 적은데 카피가 뭉뚱그려지면 트리아지가 무의미해진다. 넷은 자가해결 라우팅이 의미를 갖는
   최소치이자, 390px에서 2열 그리드로 접히는 상한이라고 봤다.

> 이 문서의 1·2·4·7이 `contact` 프로파일 초안의 §1·§2 후보다. 전부 **재현 0회 L1**이므로 다음
> 라운드가 반증하기 전까지 판정 기준으로 쓰면 안 된다([[curation-criteria]] 레벨 체크리스트).
