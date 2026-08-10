# auto-contact-r2 / c — Overrun Desk Directory

Overrun is a fictional price-tracking resale marketplace for streetwear and sneakers whose contact
page is a **searchable staff directory**: all six support desks — their published `mailto:`/`tel:`
addresses, named desk lead, staffed weekdays, hour range, and response target — render in full at the
zero-interaction default, in a two-pane layout with a category-filter rail beside the card list (the
rail collapses to a horizontal chip row and the search bar itself goes sticky on narrow viewports).
The one interactive device is a live-narrowing text search plus five category chips over that fixed,
deterministic array — it only ever *finds* a desk faster, never gates one, and a query matching
nothing surfaces a "clear filters + write to the general inbox" fallback rather than a dead end. Each
card's "wrong desk?" line is itself wired: clicking it sets the search query to the correct desk's
name so the redirect is one click, not a re-read of the whole list. No clock is read or accepted
anywhere — each desk's coverage is a fixed weekday set (hard-coded, not `new Date()`-derived) shown as
prose plus a decorative day-letter grid, and an "after hours" sentence states what happens to a
message sent outside that window. Theme: light. Accent: orange (orange-700 interactive
surfaces/links, orange-800 on tinted backgrounds, orange-100/50 tints). Display face
`--font-display-mono` on the h1 and section headings only (Latin, display sizes — picked for a
directory concept); body and all Korean stay on `--font-sans`. Exactly three weight classes
route-wide (`font-normal`, `font-semibold`, `font-bold`).

## 브리프에 없던 것

1. **① 창구를 몇 개, 어떤 카테고리로 나눌지 — 배정 텍스트는 예시 5개(Orders, Payouts,
   Authentication Disputes, Account Security, Partnerships)만 주고 정확한 수·카테고리 체계는
   지정하지 않았다.** ② 6개 창구(Orders & Shipping · Payments & Payouts · Authentication &
   Disputes · Account & Security · Seller Partnerships · Press & Media)를 5개 카테고리(Buying ·
   Payments · Trust & Safety · Selling · Company)로 묶었다 — Trust & Safety에 2개를 몰아 칩 카운트가
   전부 1로 밋밋해지지 않게 했다. ③ [[brief-careers]] §2 "공고 수와 구체성이 함께 가야 한다"를
   여기서도 적용했다 — 필터 장치가 실제로 뭔가를 줄이는 걸 보여주려면 카테고리당 1개뿐이면
   장치가 무의미해진다.

2. **① 시계 없이 "응답 약속이 언제 깨지는가"를 어떻게 보여줄지 — `auto-contact-r1` delta는
   요구사항만 있고 장치는 금지됐다(시각 시뮬레이터).** ② 요일별 커버리지를 **고정 불리언
   배열**(창구마다 하드코딩)로 두고, 접근성 대상 텍스트("Mon–Fri · 09:00–18:00 KST")로 항상
   노출한 뒤, 장식용 7일 격자(`aria-hidden`, 텍스트와 중복)와 "afterHours" 한 줄(마감 후 보낸
   메시지가 어떻게 큐잉되는지)을 덧붙였다. 사용자가 시각을 입력하는 컨트롤은 어디에도 없다.
   ③ `contact-deltas-provisional.jsonl` + r1 DECISION의 "판정 기준" 절이 요구한 내용이고,
   Q21/Q22가 지적한 "입력 장치 자체가 수렴을 만든다"는 교훈에 따라 **입력이 아니라 정적 데이터로
   해결**했다 — 조작을 요구하지 않으므로 다음 라운드가 수렴할 여지도 줄인다.

3. **① 가상의 회사를 무엇으로 할지 — 배정 텍스트가 "resale marketplace" 도메인을 명시했지만
   브랜드명·설정은 없었다.** ② "Overrun"이라는 스트리트웨어·스니커즈 리세일 마켓플레이스를
   만들었다. 이 레포의 실제 제품(repick)과는 별개 이름을 썼다 — 카탈로그 데모 페이지가 실제
   제품의 지원 채널인 것처럼 읽히는 걸 피하기 위해서다. ③ r1의 세 후보(Culvert/유틸리티,
   Havelock/?, Tessera/결제 정산)가 전부 배정과 무관한 가상 회사를 썼던 전례를 따르되, 이번
   배정은 "resale marketplace"를 명시했으므로 도메인만은 지켰다.

4. **① 검색이 정확히 무엇을 매치할지 — "live-narrowing search"라고만 돼 있고 매치 대상 필드는
   없었다.** ② 이름·요약·handles 목록·창구별 소문자 키워드 배열(`tags`)을 대소문자 무시
   부분일치 OR로 매치하게 했다. `tags`는 카피에 없는 동의어("refund", "hacked", "locked
   out" 등)까지 담아 실제 지원 검색창처럼 "뭘 쳐도 걸리는" 느낌을 내려 했다. ③ 근거는
   [[curation-criteria]] Q6 판정("입력축 × 출력축 조합표") — 여기서 입력축은 타이핑(r1/c와 동일)
   이지만 출력축은 "판정 슬립 교체"가 아니라 **리스트 자체가 줄어드는 것**이라, 배정 텍스트가
   명시한 대로 r1 승자와 다른 조합으로 판단했다.

5. **① "잘못 찾아온 창구" 처리를 어디까지 인터랙티브하게 만들지 — 브리프는 "숨기지 마라"만
   요구했다.** ② 각 카드의 "이 창구가 아니라면?" 문구를 실제 버튼으로 만들어, 클릭하면 검색어가
   올바른 창구 이름으로 바뀌고 필터가 그 카드로 좁혀지도록 했다(카테고리는 리셋). ③ r1 DECISION의
   "무매칭 시 자가해결을 건너뛰고 핸드오프가 스스로 열린다"는 c 승자의 패턴을 **좁히는 리스트라는
   이번 장치**에 맞게 재해석했다 — 슬립을 바꾸는 대신 리스트를 다시 좁힌다.

6. **① 실제 `<form>`을 둘지 — 이번에도 이 카탈로그 작품에는 백엔드가 없다.** ② 두지 않았다.
   `mailto:`/`tel:` 링크만 쓰고, r1/c가 했던 "초안 자동생성 + 클립보드 복사" 보조 기능은 이번에는
   추가하지 않았다 — 이 후보의 핵심 장치는 검색/필터이지 초안 조립이 아니라서, 두 장치를 한
   후보에 다 넣으면 어느 쪽도 두드러지지 않을 것으로 판단했다. ③ [[ux-guidelines.catalog]] Forms
   행의 "제출 피드백 없는 폼은 무음 실패"라는 지적을 r1/c와 같은 이유로 피했다 — 아무 데도
   POST하지 않는 폼을 아예 만들지 않는 쪽.

7. **① 어느 창구에 전화번호를 줄지 — 브리프에 규정이 없다.** ② 대표 전화(일반 문의) 외에
   Orders & Shipping·Authentication & Disputes·Account & Security 세 곳에만 `tel:`을 줬고
   Payments·Sellers·Press는 이메일만 뒀다. ③ 실제 지원 조직의 통상적 티어링을 모사한 임의
   판단이다 — 고빈도·고긴급 창구(배송 지연, 위조 의심, 계정 탈취)는 전화가 유용하고, 저긴급·비동기
   성격 창구(정산 문의, 파트너십, 언론)는 이메일이 자연스럽다고 봤다.

> 이 문서의 2·4·5가 다음 `contact` 프로파일 초안에 더할 후보다. 전부 **재현 0회 L1**이므로 다음
> 라운드가 반증하기 전까지 판정 기준으로 쓰면 안 된다([[curation-criteria]] 레벨 체크리스트).
