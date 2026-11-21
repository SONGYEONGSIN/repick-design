# Candidate A — "Credit Stack": a live trade-in pictogram, not a comparison bar

One-line concept: a flat segmented condition selector + price slider drive a live instant-credit
number, visualized as a two-row *icon-array (isotype) pictogram* of banknote glyphs — original
price vs. repick credit — with the catalog below re-filtering into "within your credit" / "needs
$N more" by the same live number, all inside the hero.

## 브리프에 없던 것

### ① 어떤 "시각 장치"를 쓸지 — 직접 명시되지 않음
브리프는 "dual horizontal before/after comparison bars"를 가설로 제시했지만, 그대로 쓰면 안 되고
먼저 카탈로그 충돌을 확인하라고 명시했다. 확인이 필요했다.

### ② 결정: 아이콘-배열(isotype) 픽토그램 + 숫자 판독값
`app/src/app/landing-evolve/`와 production `(marketing)` 양쪽을 grep했다. 결과:
- `r45/a/Receipt.tsx` — 이번 주(인접 라운드) 후보가 이미 "settled-ledger line-item breakdown"
  (영수증 스타일 항목별 차감)을 썼다. 브리프가 대안으로 예시한 "receipt-style breakdown"은 이미
  소진됨.
- `r38/a/Ladder.tsx` + `ComparisonStrip.tsx` — 세로 rung 사다리(조건 티어 선택, 클릭하면 올라가는
  단일 선택 라디오그룹)와 그 옆의 **수평 bar**(buyer-reach %, tick 마크 포함)를 이미 씀. 이건
  브리프가 금지한 "ladder physical reorder" 및 "comparison-bar/dumbbell" 계열에 사실상 해당.
  브리프가 대안으로 예시한 "stepped tier-ladder"도 이미 소진됨.
- `r43/b/page.tsx` — reverse-auction order-book (명시적으로 금지된 항목, r43/b에서 실제로 구현됨
  확인).
- `r33/b/LedgerCalendar.tsx` — 가격대×월 히트맵 캘린더 그리드 (price-range/band 계열, 명시적으로
  금지된 항목과 동일 계열).
- 그 외 금지 목록(원형 게이지, 퍼널, Sankey, parallel-coordinates, 산점도, 히스토그램, exploded
  stack, 스크롤 타임라인, 사진 드래그 슬라이더, 테이블+탭+아코디언, preference 그래프, spec-grid,
  bundle 곡선, redline 에디터, 대화 트랜스크립트, 검증 파이프라인, balance-beam, depletion
  projection, draggable split)와도 겹치지 않음을 목록 대조로 확인.

남은 선택지로 **아이콘-배열(isotype/pictogram) 차트**를 골랐다: 지폐 모양 아이콘을 $20 단위로 늘어
놓아 "원래 가격"과 "지금 받는 크레딧"을 두 줄의 개수로 보여주고, 바로 옆에 tabular-nums 큰 숫자
판독값을 둔다. 이것은 연속 bar(길이로 인코딩)도 아니고, 세로 사다리(선택 구조)도 아니고, 영수증
(줄 항목 차감)도 아니고, 원형 게이지(각도)도 아니다 — 이산적 단위 카운트로 인코딩하는 별개의 차트
형식이다.

### ③ 왜
브리프가 스스로 "다른 예시도 이미 쓰였으면 또 피벗하라"고 명시했고, 실제로 두 예시(영수증,
사다리)가 모두 같은 주 r46 생성 직전의 r45·r38에서 이미 쓰였다. 세 번째로 구조적으로 다른 형식을
고르는 것이 "장치 충돌 회피"라는 체크 자체의 취지에 맞는다. 픽토그램은 trade-in 도메인("물건이
실제로 얼마의 가치가 있는가")에도 은유적으로 잘 맞는다 — 지폐 다발이 실제로 늘거나 줄어드는
그림이 "credit"이라는 개념을 직관적으로 전달한다.

### ① 정확한 accent hex와 대비 계산 — 브리프는 "sky 계열"만 지정, 정확한 hex는 미지정
### ② 결정: 베이스 accent `#0EA5E9`(sky-500), 틴트 `#7DD3FC`(sky-300), 버튼 전용 진한 fill
`#0369A1`(sky-700)
### ③ 왜 — WCAG 상대휘도 계산 (표준 공식: `c<=0.03928 → c/12.92`, 그 외
`((c+0.055)/1.055)^2.4`; `L=0.2126R+0.7152G+0.0722B`; `contrast=(L1+0.05)/(L2+0.05)`)

- 배경 `#0B0B0F`: L ≈ 0.00339.
- **베이스 accent `#0EA5E9` 를 전경(텍스트/아이콘/테두리)으로 어두운 배경 위에 쓸 때**: L ≈
  0.33403 → contrast = (0.33403+0.05)/(0.00339+0.05) ≈ **7.19:1** — 본문 크기 텍스트 AA(4.5:1)를
  넉넉히 통과. 그래서 eyebrow 캡션·아이콘처럼 작은 텍스트도 배경 위에서는 베이스 accent를 그대로
  쓴다(틴트로 바꿀 필요 없음 — 계산이 이미 충분히 안전함을 확인했기 때문).
- **흰 텍스트를 `#0EA5E9` 채움 위에 올릴 때**: L_white=1 → contrast ≈ **2.73:1** — 3:1(큰 텍스트
  최소선)조차 통과하지 못한다. 이 정확한 hex에서는 크기와 무관하게 흰 텍스트를 절대 쓰지 않는다.
- **다크 잉크 `#0B0B0F` 텍스트를 `#0EA5E9` 채움 위에 올릴 때**: contrast ≈ **7.19:1**(위와 같은
  쌍의 반대 방향) — 어떤 크기에도 안전. 그래서 이 후보의 모든 accent-fill(선택된 조건 pill,
  크레딧 바 아이콘 사각형, "Within your credit" 배지, 헤더의 "Price an item" 버튼)은 예외 없이
  다크 잉크 텍스트를 쓴다.
- **버튼처럼 흰 텍스트가 필요한 채움**: `#0369A1`(sky-700) 위에 흰 텍스트 → L ≈ 0.12701 →
  contrast ≈ **5.93:1** — AA 통과. CTA 버튼(`ACCENT_BUTTON_FILL`)에만 이 더 어두운 채움을 쓴다.
- **포커스 링/작은 장식 틴트 `#7DD3FC`(sky-300)**: 배경 위 contrast ≈ **11.81:1** — 포커스 링과
  슬라이더 트랙 채움처럼 얇은 요소에 충분히 밝음.
- **MUTED 텍스트 `#A1A1AA`(zinc-400)**: 배경 위 contrast ≈ **7.68:1** — 본문 바닥선 확보.
- **GHOST 장식 글리프 `#6B6B78`**: 배경 위 contrast ≈ **3.74:1** — 큰 텍스트/비텍스트 바닥선(3:1)
  통과. (처음 초안에서 `opacity-70`을 같이 줬다가 배경과 블렌딩되어 실질 contrast가 ≈2.38:1로
  떨어지는 것을 계산으로 발견 — opacity를 제거해 계산대로의 색을 그대로 렌더링하도록 고쳤다. 이
  사실 자체가 "계산은 실제 렌더링된 픽셀 기준이어야 한다"는 점을 보여준다.)

### ① 본문 줄 길이 컨테이너 폭 — 브리프는 공식만 주고 폭은 미지정
### ② 결정: 폭을 글자 크기별로 세 단계로 고정(12px/16px/18px)
### ③ 왜 — 계산: `chars-per-line = container-px / (0.44 × font-size-px)`, 목표 70자·상한 75자
- 16px 본문(`text-base`): 70자 × 0.44 × 16 = 492.8px → 상한 75자 = 528px. `max-w-[30.5rem]`
  (488px) 채택 → 488/(0.44×16) ≈ **69.3자**. (ValueSplit 카드 본문, ProductGrid 소개문, 증언
  인용문에 적용)
- 18px lede(`text-lg`, 히어로 서브헤드·클로징 서브헤드): 70×0.44×18=554.4px → 상한
  75자=594px. `max-w-[34.5rem]`(552px) 채택 → ≈**69.7자**.
- 12px 잔글씨(`text-xs`, 조건 상세 설명): 70×0.44×12=369.6px → 상한 75자=396.0px.
  `max-w-[23rem]`(368px) 채택 → ≈**69.7자**. CSS `ch` 단위는 쓰지 않았다 — 이 프로젝트의 실측
  평균 글자폭(0.44em)보다 약 35% 넓게 잡혀 과다 추정되기 때문.
- 증언 인용문은 처음에 `text-sm`(14px)에 16px용 폭 토큰을 잘못 붙였다가(75자 상한을 초과할 수
  있는 조합) `text-base`로 올려 폭-글자크기 쌍을 다시 맞췄다.

### ① 상품 이미지 — 브리프는 "실사 unsplash 사진 또는 생성형 SVG/CSS" 둘 다 허용, 선택은 미지정
### ② 결정: 생성형 CSS/아이콘 (실사 사진 없음)
### ③ 왜: 샌드박스에 네트워크 제약이 있다고 브리프 스스로 명시했고, 생성형 방식은 결정론적이고
항상 렌더링이 보장된다. 카테고리별 고정 솔리드 배경색 + 가운데 lucide 아이콘(윤곽선 블루프린트가
아니라 꽉 찬 글리프)으로 처리했다 — "line-art/blueprint 장식 금지" 규칙과 충돌하지 않도록, 얇은
윤곽선 일러스트가 아니라 굵은 단색 아이콘 마크를 썼다.

### ① 히어로 안의 "상품 미리보기 카드"와 2번 섹션의 "상품 미리보기 카드"가 어떻게 다를지 —
브리프에 구조는 있지만 두 번 나오는 이유는 명시 안 됨
### ② 결정: 같은 전역 상태(조건+가격)를 공유하는 단일 소스 — 히어로에는 하위 3개(최저가 3종)만
미리보기로, 2번 섹션(`#catalog`)에는 전체 6개를 보여준다. 둘 다 동일한 `credit` prop으로 잠금
상태를 라이브 재계산한다.
### ③ 왜: 브리프가 요구한 "causal consistency, no exceptions" — 어디서든 같은 계산을 인용해야
하므로, 두 군데서 각자 다른 상태를 만들지 않고 하나의 `LandingExperience` 클라이언트 컴포넌트에서
`price`/`conditionIndex`를 끌어올려 모든 하위 섹션(히어로 미니 카드, 전체 카탈로그, Value-split의
문장, 클로징 CTA의 헤드라인)에 그대로 내려보낸다. 클로징 CTA의 헤드라인(`"Your {condition} item
at {price} is worth {credit} today."`)은 글자 그대로 같은 `credit`/`price` 변수를 인용한다 —
하드코딩된 별도 숫자가 없다.

### ① 기본 시작 상태(조건/가격) — 브리프는 "비어있지 않게"만 요구, 정확한 값은 미지정
### ② 결정: 기본 `price=$180`, `conditionIndex=1`("Good") → `credit=$94`
### ③ 왜: $40–$360 범위의 중간값(비어있지도, 끝값도 아닌 "진짜" 설정)을 골라 히어로가 첫 렌더부터
실질적인 증거(6개 중 2개 unlocked, 1개는 $2 차이로 근접)를 보여주게 했다. 조건은 네 개 중 하나가
항상 선택된 라디오그룹이라 "리셋 시에도 빈 상태"가 구조적으로 발생하지 않는다.

### 접근성 교차 점검(요약)
- 포커스 링: 모든 인터랙티브 요소가 `FOCUS_RING`(sky-300 `outline-2`)을 쓰고, 어떤 요소에도
  `outline-none`이 먼저 붙어있지 않음을 grep으로 확인(취소 가능성 없음).
- 그리드 자식에 전부 `min-w-0`: Hero 2분할 그리드, 히어로 미니 카드 3그리드, 카탈로그 3그리드,
  Value-split 3그리드, SocialProof 증언 3그리드·통계 3그리드 — 모든 grid 컨테이너의 **직접 자식**
  래퍼(또는 `Reveal`의 `motion.div` 자체)에 `min-w-0`을 달았다.
- `overflow-x-auto` 클리핑 컨테이너를 전혀 쓰지 않아 `sr-only` + 클립 이슈는 발생하지 않음.
- `whileInView` 리빌(`Reveal.tsx`)은 `useSyncExternalStore` 기반 `useMounted()`로 마운트 게이트.
- 별점(★★★★★)은 장식용으로 `aria-hidden`이지만 그 옆에 `sr-only` "Rated 5 out of 5 stars" 텍스트
  동반 — 색상/아이콘만으로 끝나는 정보가 없게 고쳤다.
- 숫자(가격·크레딧·퍼센트·카운트)는 전부 `tabular-nums` — 처음 누락됐던 match-% 배지, 클로징
  헤드라인, Value-split 본문 인라인 숫자를 발견해 추가로 고쳤다.

## 파일
- `app/src/app/landing-evolve/r46/a/page.tsx`
- `LandingExperience.tsx` (전역 상태 + 헤더/푸터)
- `Hero.tsx`, `ConditionSelector.tsx`, `PriceSlider.tsx`, `CreditStack.tsx` (장치 본체)
- `ProductGrid.tsx`, `ProductCard.tsx`, `ProductThumb.tsx` (카탈로그)
- `ValueSplit.tsx`, `SocialProof.tsx`, `ClosingCTA.tsx`
- `Reveal.tsx`, `useMounted.ts`, `data.ts`, `tokens.ts`
