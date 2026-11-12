# Candidate b — "Week Scrubber" (single-point playhead)

A dark, near-monochrome landing page built around one mechanic: a native, keyboard-operable
`<input type="range">` styled as a video-style playhead that scrubs a single point across a
fixed 12-week window. Dragging it (or arrow-keying it, or Home/End-ing it) moves a highlighted
dot on a decorative trend line and live-recomputes three aggregate marketplace stats — matches
found, average payout, items sold — for that exact week; the same derived week record is read,
never restated, by the value-split section and the closing CTA, so the "scrub changes everything"
premise stays true all the way to the bottom of the page. This is deliberately a single moving
point, not the two-handle time-window selector already in this catalog (r48/c) and not an
auto-advancing carousel (also already in this catalog) — it is the one mechanic this round's
dedup list says has never been built here. The hero carries its own fold-proof proof: two
compact, fully-badged listing cards (match % / condition grade / verified badge / discount %)
sit inside the Hero component itself, sized deliberately small (square 64px thumbnails, not a
4:3 photo) so the whole hero stack — headline, scrubber, proof cards — clears common 1280–1920px
desktop viewport heights with zero scroll. Accent is a self-chosen blue (`#2563EB` saturated /
`#60A5FA` tint), body and headings both stay on Pretendard (no display face this round), and
exactly three font weights (400/600/800) are used throughout.

## 브리프에 없던 것

1. **① 결정 대상**: accent 계열(blue)의 정확한 hex 두 단계(채움용 saturated 값 / 소형 텍스트용 tint
   값)와 그 위 흰색·다크잉크 텍스트 대비.
   **② 결정**: `ACCENT_HEX = #2563EB`(Tailwind blue-600, 브리프가 예시로 든 `#2563EB/#3B82F6`
   계열 중 하나) — 채움 배경·보더·차트 막대/선·대형 텍스트(≥24px 또는 ≥19px bold)에만 사용.
   `ACCENT_TINT_HEX = #60A5FA`(blue-400) — 소형 텍스트·아이콘·포커스 링에 사용.
   **③ 근거**: **계산**(WCAG 상대휘도 공식, `L = 0.2126R + 0.7152G + 0.0722B`,
   `contrast = (L1+0.05)/(L2+0.05)`, 직접 손으로 산출, 표준 공식 그대로):
   - `#2563EB` vs `#0B0B0F`(bg): R=37/255 선형화 0.01852, G=99/255 선형화 0.12464,
     B=235/255 선형화 0.83185 → `L=0.2126×0.01852+0.7152×0.12464+0.0722×0.83185=0.15313`.
     bg의 `L=0.00345`. `contrast=(0.15313+0.05)/(0.00345+0.05)=3.80:1` — 대형 텍스트/비텍스트
     3:1 하한은 넘지만 **소형 본문 AA(4.5:1)에는 미달** → 소형 텍스트에는 절대 직접 쓰지 않음.
   - `#60A5FA` vs bg: `L=0.36305` → `contrast=7.73:1`. vs 카드 표면(`#14141B`, `L=0.00726`):
     `contrast=7.21:1`. 둘 다 4.5:1을 여유 있게 넘어 소형 텍스트·포커스 링에 안전.
   - 채움(`#2563EB`) 위 **흰색** 텍스트: `(1.0+0.05)/(0.15313+0.05)=5.16:1` — 전 크기 AA 통과,
     그래서 이 후보의 모든 버튼/배지 텍스트는 흰색을 쓴다.
   - 채움(`#2563EB`) 위 **다크잉크(`#0B0B0F`)** 텍스트: `(0.15313+0.05)/(0.00345+0.05)=3.80:1` —
     대형(≥24px/≥19px bold) 기준만 통과, 소형 본문엔 미달 → 이 후보는 채움 위에 다크잉크 텍스트를
     아예 쓰지 않는다(보더/막대 같은 비텍스트 용도로도 아직 안 씀, 전부 흰색으로 통일).

2. **① 결정 대상**: 본문 컨테이너 폭(줄당 글자수 상한 75자, 목표 70자 근처).
   **② 결정**: `Pretendard 평균 자폭 0.44em` 공식으로 폭을 폰트 크기별로 역산해 4단계 토큰화—
   12px→370px, 14px→431px, 16px→493px, 18px→554px(각각 `chars = px/(0.44×size)`로 69.9~70.1자).
   **③ 근거**: **계산**(브리프가 준 상수 그대로 사용, `ch` 단위는 전혀 쓰지 않음). 예시 산술:
   16px 본문 컨테이너 493px → `493 / (0.44 × 16) = 493 / 7.04 = 70.03자`. 18px 컨테이너 554px →
   `554 / (0.44 × 18) = 554 / 7.92 = 69.95자`. 14px 컨테이너 431px →
   `431 / (0.44 × 14) = 431 / 6.16 = 69.97자`. 12px 컨테이너 370px →
   `370 / (0.44 × 12) = 370 / 5.28 = 70.08자`. 네 값 모두 75자 상한에서 margin을 두고 70자
   근처에 맞춘다. 각 `<p>`는 실제 렌더 `font-size`와 **반드시 같은 단계의 토큰을 함께** 쓴다 —
   처음 초안에서 Hero 서브헤드에 `text-sm`(14px)인데 18px용 폭 토큰을 그대로 가져다 쓴 실수가
   있었고(554px÷(0.44×14)=89.9자로 상한 초과), 각 컴포넌트를 다시 훑어 폭-크기 짝을 전부
   맞췄다 — 이 교정 자체가 "폭은 반드시 실제 렌더 크기로 재계산해야 한다"는 상한 규칙의 실증이다.

3. **① 결정 대상**: 단일 플레이헤드를 "키보드로도 완전히 조작 가능"하게 만드는 구체적 구현 방식
   (브리프는 "native `<input type=range>` 또는 custom `role=slider`" 둘 다 허용).
   **② 결정**: native `<input type="range">`를 실제 컨트롤로 쓰고, 그 위에 비디오 스크러버처럼
   보이는 커스텀 thumb(원형 그립, border+shadow)을 `::-webkit-slider-thumb`/`::-moz-range-thumb`
   가상엘리먼트로 스타일링. `aria-valuetext`로 "Week N of 12, this week: X matches found" 같은
   사람이 읽는 문장을 덧붙이고, 포커스 링은 `focus-visible:outline-2 outline-offset-2` 안전
   패턴을 입력창 자체에 직접 건다(`outline-none`과 절대 같이 쓰지 않음).
   **③ 근거**: **레퍼런스/컨벤션** — 브리프가 "native range가 키보드 상호작용(화살표·Home/End·
   PageUp/Down)과 포커스 가시성을 공짜로 준다"고 명시했고, 이 레포의 page-brief-core §2가 적은
   실패 사례(`outline-none` 뒤의 `focus-visible:outline`이 Tailwind v4에서 자기 자신을 취소하는
   문제)를 피하려면 커스텀 `role=slider`를 처음부터 손으로 구현하는 것보다 네이티브 엘리먼트가
   훨씬 안전하다고 판단했다.

4. **① 결정 대상**: 히어로 안에 들어갈 "완전 배지 2장"의 구체적 레이아웃 — 브리프는 배지 4종
   (매칭%·등급·인증·할인) 완전성만 요구하고 카드의 시각적 형태는 규정하지 않는다.
   **② 결정**: 제품 프리뷰 섹션의 풀사이즈 카드(4:3 사진)를 히어로에 재사용하지 않고, 정사각
   64px 썸네일 + 가로 배치의 **별도 컴포지트(`HeroProofCard`)**를 새로 만들어 썼다. 배지 4종은
   동일하게 전부 포함하되 사진 크기만 줄였다.
   **③ 근거**: **계산(어림)** — 이 레포 히스토리에서 가장 많이 지적된 실패가 "히어로 자체 스택이
   너무 길어 카드가 폴드 밖으로 밀리는 것"이다. 풀사이즈 카드(4:3 썸네일 기준 대략 320px 높이 +
   텍스트/배지/버튼)를 그대로 썼을 때 히어로 전체 높이를 각 섹션별로 어림 합산(eyebrow~20px +
   headline 2행~115px + subhead~50px + CTA~40px + gap, 스크러버 패널 eyebrow+chart 80px+슬라이더
   46px+스탯 44px+델타 14px + 카드 섹션 캡션+풀사이즈 카드 ~520px)하면 1000px를 넘어 1280×800
   뷰포트에서 확실히 폴드 아래로 밀렸다. 같은 방식으로 컴팩트 카드(정사각 64px 썸네일, 카드 높이
   ≈88px)로 다시 어림하면 히어로 전체 ≈520~590px로 800px 뷰포트에도 여유 있게 들어온다. 이
   계산 때문에 히어로 전용 컴포넌트를 따로 만들기로 했다 — "배지 완전성은 지키되 카드 자체의
   세로 예산을 디자인 제약으로 다룬다"는 브리프의 명시적 지시를 수치로 확인한 결과다.

5. **① 결정 대상**: SocialProof 섹션에 넣을 "4번째 인터랙션 유형"의 구체적 선택 — 브리프는
   "최소 4종, 하나는 자유"라고만 하고 무엇인지는 규정하지 않는다.
   **② 결정**: Buyers/Sellers 두 탭(ARIA tabs 패턴, roving tabindex + ArrowLeft/Right/Home/End로
   선택과 포커스를 함께 이동)으로 증언 세트를 바꾸는 토글을 추가했다. 자동 전환은 전혀 없다.
   **③ 근거**: **레퍼런스/컨벤션** — 이 카탈로그의 자동 전환 캐러셀(auto-advance, 드래그 없음)과
   혼동되지 않도록 "사용자가 누르거나 화살표 키를 눌러야만 바뀌고, 누른 뒤에는 그 상태가 유지된다"는
   점을 명시적으로 다르게 설계했다(캐러셀은 자동 전환, 이 토글은 전혀 자동 전환하지 않음). WAI-ARIA
   Authoring Practices의 표준 tabs 키보드 패턴(선택된 탭만 tabIndex 0, 화살표로 이동+활성화)을
   그대로 따랐다 — 표본 1건의 임의 설계가 아니라 확립된 패턴을 재사용한 것이다.

6. **① 결정 대상**: 12주 데이터셋의 구체적 숫자 — 브리프는 "결정론적"만 요구하고 실제 값은
   규정하지 않는다.
   **② 결정**: 212→312건으로 대체로 증가하되 3주차·5주차·6주차에 작은 하락을 끼워 넣어 완전한
   단조증가가 아닌 "현실적인" 추세선을 만들었다(평균 payout·판매건수는 매칭건수와 같은 방향으로
   함께 움직이도록 손으로 맞춤).
   **③ 근거**: **임의(arbitrary), 단 제약 조건 안에서** — 실제 숫자 자체는 임의이지만, (a)
   `Math.random`/`Date.now`/`new Date()` 금지 조항을 지키기 위해 전부 리터럴 배열로 고정했고,
   (b) 트렌드 라인이 완전한 직선이면 "스크러빙이 뭔가를 바꾼다"는 느낌이 약해지므로 작은 굴곡을
   의도적으로 넣었다. 12주 전 대비 현재 매칭건수 변화율(+47%)은 이 리터럴 값에서 계산식으로
   유도된 것이지 별도로 하드코딩되지 않았다(`percentChangeFromStart` 함수, 모든 호출부가 같은
   `weekIndex` state를 읽는다).
