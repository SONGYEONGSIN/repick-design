# Candidate a — Culvert

**컨셉 1줄**: 다섯 창구가 각자의 근무시간·담당자·직통 주소·**응답 예정 시각**을 처음부터 전부 펼쳐 놓은 디스패치 보드이고, 창구를 고르는 행위는 그 증명을 여는 것이 아니라 **조준을 바꾸는 것**이다 — 필요 정보·담당자 브리프·잘못 찾아온 경우의 안내·폼 우회 경로가 함께 바뀌고, 폼은 그 선택의 결과로 나타난다.

Culvert is a fictional B2B company that moves interval data from 4.1 million utility meters into systems that bill against it. Five desks — Utility sales (Dana Okonkwo), Operations & support (a six-person on-call rota), Partnerships (Marta Ellingsen, Lisbon), Recruiting (Priya Raman), Press (Tomas Krall) — each publish their own coverage window, their own service level, and their own direct address, all five visible on load with no click. The page never asks the device what time it is: the visitor states the moment they would send (day + hour slider + their own time zone, defaulting to Thursday 16:00 in New York), and all five reply-by figures recompute together from integer arithmetic over published desk hours. Drag the hour past 23:00 UTC and Utility sales rolls to Friday morning while the 24/7 operations desk does not move — the actual difference between the desks, made visible rather than asserted. Choosing a desk swaps the required fields (Account ID + severity for operations, Outlet + deadline for press, Endpoints under management for sales), the owner brief, the honest wrong-desk redirect, and the two routes that skip the form entirely (P1 pager, status page, procurement packet, press kit). Submitting validates inline with `role="alert"` messaging and returns a reference code derived from the message contents, so the same message always yields the same code on server and client. Light theme, emerald accent (emerald-700/800 only — emerald-600 behind white text is 3.76:1), `--font-display-grotesk` on the wordmark and h1, exactly three weights route-wide (`font-normal` / `font-semibold` / `font-bold`).

**이 타입의 정의 (프로파일 0건 상태에서 자체 정의)**: `contact`는 **읽는 사람이 "어느 창구로, 어떻게, 언제 답을 받는지" 알고 실제로 연락을 시작하는** 화면이다. 인접 타입과 갈리는 지점:

| 인접 타입 | contact에서 다른 점 |
|---|---|
| `landing`의 CTA 섹션 | 랜딩은 **의도를 만든다**. contact는 의도가 이미 있다고 전제하고 "누구에게 말해야 하나"라는 마찰만 제거한다 — 설득 카피가 주축이 되면 랜딩의 재탕이다 |
| `support` / 헬프센터 | 헬프센터는 **질문에 답한다**(셀프서브 문서). contact는 질문을 사람에게 라우팅하고 **응답 시간을 약속한다** |
| `careers` 지원 경로 | careers는 **사람을 역할로** 보낸다. contact는 **질문을 창구로** 보낸다 — 채용은 여기서 다섯 창구 중 하나일 뿐이다 |
| `about` 오피스 목록 | about의 주소는 **회사가 어디 있는지**를 말한다. contact의 주소는 **답이 언제 오는지**에 종속돼야 한다 — 주소만 있고 응답 약속이 없으면 about의 재탕이다 |
| `login` | 둘 다 진입로지만 login은 **신원**, contact는 **유입**이다 |

**핵심 판정 기준 제안(초안)**: 창구별 ① 담당·② 채널·③ 응답 시간 ④ 대체 경로 네 가지가 **클릭 없이 도달 가능**해야 한다. 연락처가 아코디언·탭·드로어 뒤에만 있으면 contact가 아니라 catalog다.

**인터랙션 5종** (전부 `'use client'` 실동작 · 결정론 · `motion-reduce` 게이팅): ① 창구 라디오 보드(필드·브리프·대체경로·리다이렉트 동시 전환) ② 발신 시각 시간 슬라이더(다섯 창구 응답시각 동시 재계산) ③ 발신 요일 선택 ④ 발신자 시간대 선택(30분 오프셋 포함) ⑤ 창구별 스키마 기반 폼 검증 → 결정론적 접수번호 확인 화면.

## 브리프에 없던 것

1. **① 무엇을 정해야 했나**: `contact`가 무엇인지. 프로파일이 0건이고 코어에는 이 타입에 대한 언급이 없다. 특히 "단순 폼 하나가 아니다"라는 배정 문구는 무엇이 **아닌지**만 말해준다.
   **② 무엇으로 정했나**: 위 표대로 인접 5타입과의 경계를 먼저 긋고, "**창구별 담당·채널·응답시간·대체경로 4종이 클릭 없이 도달 가능할 것**"을 이 타입의 하드 기준 초안으로 세웠다. 그 기준을 만족시키기 위해 다섯 창구를 전부 펼친 보드를 페이지의 척추로 삼았다.
   **③ 왜**: [[brief-careers]] §2의 "오픈 롤 상시노출"이 이 레포에서 타입 고유 하드 기준이 어떤 형태를 갖는지 보여준 선례다 — 그 타입에서 "공고가 접혀 있으면 안 된다"에 해당하는 것이 contact에서는 "연락처가 접혀 있으면 안 된다"이고, 배정문의 "클릭해야만 연락처가 보이면 감점"이 같은 말이다. 인접 타입 경계표는 [[brief-careers]] §0의 형식을 따랐다(내용은 복사하지 않음).

2. **① 무엇을 정해야 했나**: "언제 답이 오는가"를 어떻게 증명할지. `new Date()`가 하드페일이라 "지금 영업 중"을 말할 수 없다. 그런데 응답 시간이야말로 이 타입의 핵심 증명이다.
   **② 무엇으로 정했나**: 시계를 **읽지 않고 입력으로 받았다**. 방문자가 "이 시각에 보낸다면"을 요일·시(슬라이더)·자기 시간대로 지정하면, 페이지가 각 창구의 공표된 근무시간에 대해 정수 산술로 응답 예정 시각을 계산한다. 창구가 닫혀 있으면 "SLA 시계가 시작되기까지 남은 시간"을 따로 표시한다(`queueMinutes`).
   **③ 왜**: 제약을 우회하는 대신 컨셉으로 승격시켰다 — "지금 영업 중"은 캐시되는 순간 거짓이 되고 "보통 빠르게 답합니다"는 반증 불가능한데, 발신 시각을 명시하게 하면 약속이 **검증 가능**해지면서 결정론도 공짜로 따라온다. [[curation-criteria]] "차별성 ↔ 완성도 상충 시 판정 방향"이 요구하는 "조작이 증명을 지연시키지 말고 강화할 것"에 정확히 부합하는 형태이기도 하다: 슬라이더를 움직이면 다섯 창구의 숫자가 **동시에** 바뀌고, 24/7 창구만 움직이지 않는 것이 곧 창구 간 차이의 증명이 된다.

3. **① 무엇을 정해야 했나**: SLA를 벽시계 시간으로 셀지 창구 운영시간으로 셀지. "4시간 내 응답"이 금요일 22시에 보낸 메일에도 적용된다고 하면 거짓말이 된다.
   **② 무엇으로 정했나**: **창구 운영 분(desk minutes)** 으로 세고, 주 단위로 반복되는 커버리지 윈도우를 앞으로 걸어가며 소진시킨다(`dispatch()`). 화면에는 두 숫자를 나눠 보여준다 — 실제 대기 시간(벽시계)과 "창구가 닫혀 있어 시계가 아직 시작도 안 한 시간".
   **③ 왜**: [[brief-careers]] §2의 보상 항목이 남긴 교훈("축과 계산 방식을 먼저 정하지 않으면 라운드마다 잣대가 달라진다")을 응답 시간 축에 그대로 적용했다. 벽시계로 세면 야간 발신에서 약속이 깨지고, 운영시간으로만 표시하면 방문자가 "그래서 몇 시?"를 스스로 계산해야 한다. 둘 다 보여주는 것이 유일하게 정직한 조합이다.

4. **① 무엇을 정해야 했나**: 창구를 고르면 다른 창구의 연락처를 접어도 되는지. 배정의 "창구 분기 우선형"은 자연스럽게 마스터-디테일을 부르는데, 그건 이번 라운드 금지 골격이자 이 타입의 핵심 증명을 클릭 뒤로 숨기는 구조다.
   **② 무엇으로 정했나**: 보드의 각 행을 **스텁이 아니라 완결된 레코드**로 만들었다 — 이름·담당자·근무시간·직통 mailto·계산된 응답시각이 다섯 행 전부에 상시 노출된다. 선택은 아래쪽 "브리프 + 폼"의 조준만 바꾼다.
   **③ 왜**: 마스터-디테일 회피는 금지 목록 준수이기도 하지만, 더 중요한 건 [[curation-criteria]]가 3라운드 연속 관측한 실패 유형(archetype 승자가 매번 증명을 인터랙션 뒤로 지연시켜 탈락)을 구조적으로 차단하는 것이다. 행이 완결돼 있으면 "열어야 보이는 것"이 없어서 그 실패가 성립하지 않는다.

5. **① 무엇을 정해야 했나**: 폼이 어디로도 전송되지 않는 정적 사이트에서 제출 확인을 무엇으로 보여줄지. 결정론 규칙 때문에 타임스탬프도 난수 티켓번호도 못 쓴다.
   **② 무엇으로 정했나**: 접수번호를 **메시지 내용에서 파생**시켰다(창구 id + 필드값들의 문자코드 해시 → base36 4자리, `CV-XXXX`). 같은 내용은 서버·클라이언트에서 항상 같은 번호가 나온다. 확인 화면에는 접수번호와 함께 그 창구의 응답 예정 시각을 다시 적었다.
   **③ 왜**: 관행상 접수번호는 시각 기반이지만, 여기서 필요한 성질은 "고유성"이 아니라 "방문자가 되물을 때 인용할 수 있을 것"이다. 내용 파생 해시가 그 성질을 만족시키면서 하이드레이션 불일치를 원천적으로 없앤다. 확인 화면에 응답 시각을 반복한 것은, 그 시점이 방문자가 그 약속을 실제로 기억해야 하는 유일한 순간이기 때문이다.

6. **① 무엇을 정해야 했나**: 창구를 바꿨을 때 이미 입력한 값을 유지할지 버릴지. 브리프에 없고, 폼 UX 관행도 갈린다.
   **② 무엇으로 정했나**: `key={desk.id}`로 폼을 리마운트해 **전부 초기화**한다.
   **③ 왜**: 창구마다 필드 스키마가 다르므로 유지되는 값은 "이메일" 정도뿐인데, 남는 부작용이 훨씬 나쁘다 — 운영 창구에서 고른 "P1 — 데이터 유입 중단"이 언론 문의에 딸려 들어가면 잘못된 큐로 라우팅될 수 있다. 라우팅이 페이지의 목적인 이상, 라우팅을 오염시킬 수 있는 편의는 편의가 아니다. 대신 값이 사라진다는 사실을 감추지 않기 위해 선택된 행에 "Selected — brief and form below"를 명시했다.

7. **① 무엇을 정해야 했나**: 액센트로 배정된 emerald의 정확한 단계. 버튼·링크·아이콘에 관행적으로 쓰이는 것은 emerald-600이다.
   **② 무엇으로 정했나**: **emerald-700/800만** 쓴다. 흰 글자를 얹는 채움 버튼은 emerald-700(5.55:1), 흰·zinc-50·emerald-50 위의 텍스트·링크는 emerald-800.
   **③ 왜**: emerald-600(#059669) 위의 흰 텍스트는 3.76:1로 AA 미달이다 — Lighthouse a11y 하드게이트(95)와 [[page-brief-core]] §2 대비 규칙을 동시에 깬다. 보조 텍스트 하한은 [[curation-criteria]] Q10 판정을 따라 표면 톤 조건부로 적용했다: emerald-50/zinc-50 같은 muted 표면 위의 라벨은 zinc-600 이상(실측 6.95:1), zinc-500은 순백 위에도 쓰지 않았다.

8. **① 무엇을 정해야 했나**: 배정된 다섯 창구(영업/기술지원/파트너십/채용/언론)를 이 제품 맥락에서 어떤 이름과 담당자로 구체화할지. 카피는 영문 전용이라 직역이 아니라 재명명이 필요했다.
   **② 무엇으로 정했나**: Utility sales · Operations & support · Partnerships · Recruiting · Press. 기술지원만 "Operations & support"로 넓혀 24/7 온콜 로테이션(사람 이름 대신 "On-call engineer, rota of six")으로 두고, 나머지 넷은 실명 담당자를 붙였다.
   **③ 왜**: 유틸리티 텔레메트리 제품에서 "기술지원"은 티켓 데스크가 아니라 파이프라인을 들여다보는 운영 조직이고, 그 창구만 24/7이어야 다섯 창구의 시계가 서로 달라진다 — 시간 축 차별화가 이 페이지의 축인 이상 창구 구성이 그 축을 만들어줘야 했다. 온콜만 실명을 안 쓴 것도 같은 이유다: 6인 로테이션에 한 사람 이름을 박으면 24/7 주장과 모순된다.
