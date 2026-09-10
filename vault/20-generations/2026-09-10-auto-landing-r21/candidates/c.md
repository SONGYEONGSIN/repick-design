# r21/c — Quadrant tier recommender

Two sliders (price priority × sale urgency) move one live marker across a fixed 2D plot of four
seller service tiers (Quick Sale, Balanced, Best Price, Premium Auth); nearest-neighbour distance
to the four fixed reference points selects the recommended tier, and that live state drives the
explanation copy, the recommended tier's own listing-preview card, the highlighted card in the
full tier catalog below, and the closing CTA line.

## 브리프에 없던 것

① **축 정의와 좌표 배치.** 브리프는 "Price sensitivity"와 "How fast do you need to sell" 두 축과
3~4개의 고정 기준점만 예시로 주고 구체적 좌표는 정하지 않았다.
② X = price priority(0=fair offer now, 100=top dollar), Y = sale urgency(0=no rush, 100=need it
gone), 네 티어를 `(20,84) Quick Sale`·`(50,50) Balanced`·`(84,20) Best Price`·`(80,80) Premium
Auth`에 배치했다.
③ Premium Auth를 두 축 모두 높은 지점에 둔 것은 의도적이다 — "빠르면서 동시에 비싸게"라는 네 번째
전략(사람 인증이 AI 등급을 검증해 프리미엄 매물을 빠르게 신뢰 구매자에게 연결)을 표현하려면 단순
사분면 대각선 배치(quick-sale/best-price만 반대 극단, balanced가 중앙)로는 안 되고 네 점이 실제로
평면을 4방향으로 나눠야 두 슬라이더가 "정말 2D 일"을 한다 — 한 축만 지배적이면 사실상 1D 게이지로
붕괴한다(금지 목록의 r18과 겹침). 최근접 이웃(유클리드 거리 제곱)으로 판정해 네 영역이 대칭적이지
않은 보로노이 분할을 만들었다.

④ **추천 산출 방식**: "quadrant/region"을 정확히 4등분 사분면 규칙(단순 x>50/y>50 분기)으로 할지,
연속 좌표에 대한 최근접 기준점 거리로 할지 브리프가 정하지 않았다.
⑤ 최근접 기준점(유클리드 거리 제곱, `(x-tx)²+(y-tx)²`) 방식을 선택했다.
⑥ 정수 슬라이더 값(0-100, step 1)이므로 반올림이 필요 없고, 사분면 규칙보다 기준점이 실제로 "가장
가까운" 것을 고르는 것이 카피("marker's position → why this tier")의 인과관계를 더 직접적으로
설명할 수 있다 — quadrant 경계에서 갑자기 바뀌는 것보다 "네 점 중 가장 가까운 것"이 사용자에게
더 직관적이다.

⑦ **마커 이동 애니메이션의 transform 전용 구현.** 브리프가 "marker's movement, animate its
transform: translate(x,y), not its left/top"이라고 명시했지만 퍼센트 기반 좌표계에서 transform만으로
컨테이너 상대 위치를 표현하는 표준 패턴은 없다.
⑧ `ResizeObserver`로 플롯 박스의 실제 픽셀 폭을 측정해(`useState` 초기값은 SSR/hydration 안정성을
위해 고정 상수 260) 슬라이더 값(0-100)을 px로 환산한 뒤, `framer-motion`의 `animate={{x, y}}`
(내부적으로 `transform: translate()`만 씀)로 마커를 이동시켰다. 고정 기준점은 움직이지 않으므로
정적 `left/top` 퍼센트 포지셔닝을 그대로 썼다(브리프 금지 대상은 "애니메이션"이지 정적 배치가
아니다).

⑨ **플롯 자체의 접근성 처리.** 좌표 위치라는 시각 정보를 스크린리더에 어떻게 동등하게 제공할지
브리프가 구체적으로 정하지 않았다.
⑩ 플롯 SVG/HTML 전체를 `aria-hidden="true"`로 감췄다 — 단, `aria-hidden`이 `color-contrast` 면제가
아니라는 축적 규칙을 그대로 적용해 플롯 내부의 모든 가시 텍스트(축 라벨·기준점 라벨)도 일반 텍스트와
동일한 대비 하한을 지키도록 계산했다(아래 참조, 처음에 `text-zinc-400`으로 썼다가 대비 미달을
확인하고 `text-zinc-500`로 교체했다). 동등한 정보는 항상 감춰지지 않은 일반 텍스트로 존재한다 — 두
`<input type="range">`의 실제 값(라벨+숫자)과, `aria-live="polite"`로 감싼 설명 문단(슬라이더 값을
그대로 인용하는 문장)이 그것이다. 스크린리더 사용자는 "점이 어디 있는지"가 아니라 "AI가 왜 이
티어를 추천하는지"를 문장으로 듣는다 — 시각 사용자가 보는 것과 동일한 결론에 도달하는 대안 경로다.

⑪ **모바일(390px) 반응형 전략.** 브리프가 "플롯이 작아지거나, 슬라이더가 주 인터랙션이 되고 플롯은
보조 확인 역할을 하거나 — 판단은 designer 몫"이라고 명시했다.
⑫ 슬라이더를 항상 전체 폭 `<input type="range">` (h-6=24px 탭 타겟)로 유지해 모바일에서도 주
인터랙션으로 완전히 동작하게 하고, 플롯은 `max-w-[260px]`로 축소한 뒤 390px 뷰포트에서 실측
여유폭을 계산해(페이지 좌우 패딩 24px×2 + 디바이스 카드 패딩 20px×2 = 88px, 342px 중 260px 사용 →
양쪽 21px 여유) 16px 최소 여백 기준을 지켰다. 플롯을 보조 확인 장치로 두되 완전히 숨기지는
않았다 — 라이브 설명 문단과 함께 "왜"를 시각적으로도 재확인할 수 있게.

⑬ **1280~1920px에서 sky accent 셰이드 선택과 계산.** 브리프는 accent 계열(hue)만 sky로 배정했고
정확한 셰이드와 두 대비값(흰색 위, 어두운 잉크 위) 계산은 candidate 몫이다.
⑭ 채움 배경(버튼·"Recommended for you" 리본)과 소형 텍스트(용도 겹침 시)에는 `sky-700`
(`#0369A1`)을 골랐고, 장식 전용(마커 점 채움·비텍스트 보더)에는 `sky-600`(`#0284C7`)을 썼다.
계산(WCAG 상대휘도, sRGB):
  - `sky-700 #0369A1` vs 흰색(`#FFFFFF`): **5.93:1** — 본문 크기 AA(4.5:1) 통과, 채움 위 흰 글자도
    역방향으로 동일 공식이라 5.93:1로 통과(그래서 CTA 버튼은 흰 글자를 쓴다).
  - `sky-700 #0369A1` vs 어두운 잉크(`#0B0B0F`, 정본 기본 다크 배경 토큰을 "dark ink" 기준으로
    사용): **3.31:1** — 대형 텍스트 기준(3:1)만 넘고 본문 크기 AA(4.5:1)에는 미달한다. 이 값이
    바로 "채움 위에는 흰 글자, 어두운 잉크는 쓰지 않는다"는 축적 규칙과 정확히 같은 이유로, 이
    페이지의 모든 sky 채움 위 텍스트는 흰색만 쓴다(어두운 잉크 텍스트는 sky 채움 위에 전혀
    두지 않았다).
  - 참고용: `sky-600 #0284C7` vs 흰색 = **4.10:1**(비텍스트 장식 요소는 3:1 기준만 충족하면
    되므로 마커 점·보더 용도로 충분), `sky-600` vs 어두운 잉크 = **4.80:1**.
  - `sky-700` vs `sky-50 #F0F9FF`(리본 배경 등 옅은 틴트 위) = **5.57:1**로 순백 대비와 거의 동일—
    별도로 확인해 틴트 배경에서도 AA를 유지함을 검증했다.
  두 계열을 나눈 것은 장식(dual-accent) 조건이 아니라 단일 accent(sky)를 "텍스트/상호작용용
  진한 셰이드"와 "장식 전용 밝은 셰이드"로 나눈 것뿐이라 근거 문서의 "이원 accent — 기능적
  근거" 조항 대상은 아니다(마커와 기준점을 서로 다른 색상 축으로 나누지 않았다 — 둘 다 sky 계열
  안에 있고, 기준점의 강조는 색이 아니라 보더+아이콘+라벨 굵기로 구분했다).

⑮ **본문 줄 길이 계산.** 상수는 필수 — Pretendard 혼합 본문 평균 자폭 `0.44em`, `ch` 단위 금지.
  - 히어로 서브 문단: 컨테이너 `max-w-[500px]`, 폰트 16px → `500 ÷ (0.44×16) = 500 ÷ 7.04 ≈
    71.0자/줄`(상한 75 이내, 목표 70 근처).
  - 디바이스 카드 안의 라이브 설명 문단: 실측 컨테이너 폭은 브레이크포인트마다 다르지만 최대치
    기준(1440px 데스크톱, `lg:col-span-7` 안에서 플롯 260px+gap 20px를 뺀 나머지) 약 330px,
    폰트 14px → `330 ÷ (0.44×14) = 330 ÷ 6.16 ≈ 53.6자/줄` — 상한 이내.
  - 티어 카드(full) pitch 문단: `max-w-[280px]`, 폰트 13px → `280 ÷ (0.44×13) = 280 ÷ 5.72 ≈
    49자/줄` — 짧은 캡션류라 65자 미만이어도 정상(카탈로그 관례상 실패 방향은 상한 초과 쪽뿐).

⑯ **디스플레이 활자 미사용 확인.** 이번 라운드는 display face를 건너뛰도록 배정받아 헤드라인
포함 전체 텍스트가 `--font-sans`(Pretendard) 그대로다. 폰트 웨이트는 정확히 3종
(400=font-normal · 600=font-semibold · 800=font-extrabold)만 썼고, `font-bold`(700)·
`font-medium`(500)은 전 파일에서 사용하지 않았다(라우트 전체 grep으로 확인).

⑰ **"Recommended for you"의 비-색 신호.** 브리프가 "색으로만 전달 금지"를 요구해, 추천 티어
카드에는 색(sky 보더) 외에 ① `CheckCircle2` 아이콘 ② "Recommended for you" 텍스트 리본 ③
`ring-1` 이중 보더를 함께 준다. 플롯의 추천 기준점도 마찬가지로 ① 흰 배경 대비 진한 보더 두께 ②
체크 아이콘 ③ semibold 라벨 굵기 변화를 색과 함께 쓴다.

⑱ **닫힘 CTA까지 상태 생존.** 클로징 섹션 문단은 `priceSensitivity`·`urgency`·`recommended.name`·
`recommended.turnaround`·`recommended.fee`를 전부 현재 state에서 직접 읽어 렌더한다(정적 리터럴
없음) — 슬라이더를 움직이면 히어로의 설명 문단, 히어로의 추천 티어 미리보기 카드, 티어 카탈로그
섹션의 강조 카드, 클로징 CTA 문장과 버튼 라벨("Get started with {티어명}")까지 전부 같은 렌더에서
갱신된다.
