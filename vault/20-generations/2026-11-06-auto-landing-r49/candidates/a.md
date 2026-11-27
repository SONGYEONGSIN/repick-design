---
tags: [candidate, auto-landing-r49, a]
---

# r49/a — Live Match Search

A dark, violet-accented landing page built around a genuinely new input mechanic for this catalog: a live text-search field that filters a fixed eight-listing comp set (cameras, watches, sneakers, a chair) in real time as the visitor types, using an AND-over-tokens substring match with a field-weighted confidence score (brand/model > category > free text) that produces a believable 60–97% "AI match" percentage rather than sorting a static list. The Hero renders with a non-empty default query (`"camera"`) so two fully-badged result rows — each carrying all four required proof badges (match%, condition grade, seller verification, before/after discount) — are visible with zero interaction and zero scroll, before the search device is ever touched; typing or tapping one of four quick-filter chips narrows the result set live (e.g. "camera" → 3 matches, "sony camera" → 1, at a visibly higher match%). That same `query` state and its derived `filterAndRank`/`computeSearchStats` output feed a three-stat "Your search, scored three ways" value section (top match%, average discount%, verified-seller share — all recomputed from the live result set, not the hero's visuals) and the closing CTA, which cites the real, current match count and top match% (or an honest "no matches" line) rather than a static figure, so the "search changes everything" premise holds all the way to the bottom of the page.

## 브리프에 없던 것

1. **① 결정 대상**: violet accent의 정확한 hex 값과 소형 텍스트용 틴트 값.
   **② 결정**: 채움/대형텍스트용 BASE `#7C4FE0`, 소형 텍스트/아이콘/포커스링용 TINT `#BCA7F3`. 둘 다 브리프가 예시로 든 `#7C3AED`/`#8B5CF6`와 다른 고유 값이고, 정본 기본값 `#6E56CF`도 아니다.
   **③ 근거(계산)**: WCAG 상대휘도 공식(sRGB 채널 선형화 후 `L = 0.2126 R + 0.7152 G + 0.0722 B`, `contrast = (L_light + 0.05) / (L_dark + 0.05)`)으로 직접 계산(파이썬으로 산출, 수치 아래 재기재).
     - `#7C4FE0` vs bg `#0B0B0F` → **3.79:1** (대형 텍스트/비텍스트 3:1 하한은 통과, 본문 크기 4.5:1에는 미달 — 그래서 이 값은 채움·보더·포커스링·대형헤드라인 전용으로만 쓰고 bg 위 소형 러닝텍스트에는 절대 안 씀).
     - 흰색(`#FFFFFF`) on `#7C4FE0` 채움 → **5.18:1** (소형·non-bold 텍스트 AA 4.5:1을 통과 — 그래서 이 후보는 채움 위 글자를 크기 분기 없이 **항상 흰색**으로 고정했다).
     - 다크 잉크(`#0B0B0F`) on `#7C4FE0` 채움 → **3.79:1** (대형/비텍스트 하한만 통과, 본문 크기엔 미달 — 기록용으로만 계산, 실제로는 쓰지 않음. 브리프가 "가정하지 말고 계산하라"고 명시했으므로 안 쓰는 값도 계산해 적음).
     - 틴트 `#BCA7F3` vs bg `#0B0B0F` → **9.32:1**, vs 패널 `#15141C` → **8.67:1**, vs soft chip `#231A3D` → **7.74:1**. 전부 4.5:1을 넉넉히 통과해 소형 텍스트·아이콘·eyebrow·포커스링(bg 위)에 안전.
     - muted `#A1A1AA`(정본 하한과 동일한 Tailwind zinc-400) vs bg `#0B0B0F` → **7.66:1**, vs 패널 `#15141C` → **7.13:1**. 둘 다 AA 넉넉히 통과.

2. **① 결정 대상**: 본문 컨테이너 폭(px).
   **② 결정**: 문단마다 폰트 크기에 맞춰 서로 다른 `max-w-[...]`를 직접 역산해서 지정 — Hero 서브헤드 `max-w-[460px]`@15px, SearchBar 보조문 `max-w-[370px]`@12px, Hero "no matches" 문단 `max-w-[400px]`@13px, ProductPreview 인트로 `max-w-[430px]`@14px, ValueSplit 인트로/스냅샷 문단 `max-w-[430px]`@14px, SocialProof 인용구 `max-w-[480px]`@16px, ClosingCTA 리드문 `max-w-[480px]`@16px.
   **③ 근거(계산)**: 브리프가 준 상수 **Pretendard 평균 영문 자폭 0.44em**, 공식 `글자수 = 컨테이너폭 ÷ (0.44 × font-size)`로 각 폭을 70자 근처로 역산(`ch` 단위는 쓰지 않음 — `ch`는 숫자 `0`의 advance라 Pretendard에서 평균보다 약 35% 넓어 상한을 넘긴다는 브리프의 경고를 그대로 따름). 계산:
     - 15px: `0.44 × 15 = 6.6px/자` → `460 ÷ 6.6 ≈ 69.7자`
     - 12px: `0.44 × 12 = 5.28px/자` → `370 ÷ 5.28 ≈ 70.1자`
     - 13px: `0.44 × 13 = 5.72px/자` → `400 ÷ 5.72 ≈ 69.9자`
     - 14px: `0.44 × 14 = 6.16px/자` → `430 ÷ 6.16 ≈ 69.8자`
     - 16px: `0.44 × 16 = 7.04px/자` → `480 ÷ 7.04 ≈ 68.2자`
     모두 70자 근처, 75자 상한에 딱 맞추지 않고 여유를 둠(브리프의 "16px 여유" 태도와 동일한 이유).

3. **① 결정 대상**: "실시간 검색/자동완성"을 정확히 어떤 UI 패턴으로 구현할지 — 완전한 ARIA combobox(listbox+aria-activedescendant)로 만들지, 단순 텍스트 입력+탭-투-필 칩으로 만들지.
   **② 결정**: ARIA combobox listbox 패턴을 쓰지 않고, 라벨이 상시 보이는 평범한 `<input type="text">` + 4개의 탭-투-필 퀵필터 칩(`role="group"`, 각각 실제 `<button>`)으로 구현. 두 입력 모두 같은 `query` state와 같은 `filterAndRank` 경로로 들어간다.
   **③ 근거(reference/위험 회피)**: `page-brief-core.md` §2가 이미 기록한 실패 사례(`d32`의 콤보박스 `aria-required-children`/`aria-required-parent`/`listitem` 3중 위반, `d45`의 `tabIndex`+`aria-activedescendant` 패턴 미완결 문제)를 이 라운드에서 또 재현할 위험이 있다고 판단해, 검증된 단순 패턴(라벨+입력+버튼 그룹)으로 "자동완성"의 실질(타이핑 중 실시간 좁혀짐 + 탭으로 완성)을 만족시키되 ARIA 상태 기계는 열지 않기로 결정. 브리프 문구("live search/autocomplete")는 입력 메커닉의 성격을 설명한 것으로 읽었고, 특정 ARIA 패턴을 강제하지 않았다고 해석.

4. **① 결정 대상**: Hero에 몇 개의 결과 행을 렌더할지, 그리고 그 개수를 쿼리가 바뀌어도 고정할지.
   **② 결정**: 쿼리가 몇 건을 매칭하든 Hero는 항상 **상위 2건만** 렌더(`HERO_VISIBLE_RESULTS = 2`), 전체 매칭 수는 같은 패널의 `role="status"` 텍스트로 정직하게 보고("3 matches for "camera" · showing top 2"). 매칭이 0건이면 배지 없는 안내 문구로 전환.
   **③ 근거(계산/구조적 필요)**: 브리프가 "최소 2장의 풀배지 카드가 스크롤 없이 보여야 한다"와 "Hero 자체 안에 있어야 한다"를 동시에 요구하면서, 동시에 쿼리에 따라 결과 수가 가변적인 장치를 요구했다. 결과 수를 그대로 다 렌더하면 넓은 쿼리("camera"=3건)에서 Hero 높이가 쿼리마다 달라져 폴드 보장이 깨진다. 상위 2건으로 캡을 걸어 Hero 높이를 쿼리와 무관하게 고정하면서, 전체 매칭 수는 숨기지 않고 같은 영역에 그대로 보여 "조작이 실제 데이터를 반영한다"는 요건도 함께 만족시켰다 — 임의 선택이지만 두 요건이 충돌하는 지점을 가장 직접적으로 푸는 값이라 2로 정함(브리프의 "최소 2장" 표현을 그대로 상한으로 재사용).

5. **① 결정 대상**: match% 산출 공식 — 브리프는 "match%를 보여라"라고만 했고 산출 로직은 명시하지 않았다.
   **② 결정**: 쿼리의 각 토큰이 어떤 필드(브랜드/모델=3, 카테고리=2, 설명/제목=1)에서 매칭됐는지의 평균 가중치와, 토큰 개수(쿼리 구체성, 최대 3까지 카운트)를 더해 `58 + avgWeight×10 + specificity×3`을 60–97 사이로 clamp하는 결정론적 순수 함수(`search-math.ts`)로 구현. 전부 고정 리터럴 기반이며 `Math.random`/`Date.now`/`new Date()` 없음.
   **③ 근거(계산/임의, 명시)**: 특정 선례가 없어 **임의로 설계**했지만, 두 원칙은 지켰다 — (a) 결정론(같은 쿼리는 항상 같은 숫자), (b) "더 구체적인 쿼리가 더 높은 확신도로 보인다"는 직관을 반영해 실제로 검색을 좁힐 때 match%가 체감적으로 오르게 함(예: "camera"=81%, "sony camera"=89%, "sony"=91%) — 숫자 자체의 정확한 의미보다, 검색 조작이 눈에 보이는 핵심 증명 숫자를 실제로 바꾄다는 "조작=가치체감" 원칙을 기계적으로 보장하는 것이 목적이었다.

6. **① 결정 대상**: Product Preview(2번 섹션)가 검색 상태에 종속되어야 하는지.
   **② 결정**: 독립시켰다 — 2번 섹션은 8개 comp 중 카테고리별 1개씩 고정 3장(`PREVIEW_IDS`)을 항상 보여주고, 검색 상태가 실시간으로 바뀌어야 하는 것은 3번(가치 3분할)과 5번(클로징)으로 한정.
   **③ 근거(reference)**: `design-principles.md` §Landing 구조 기본형의 "조작=가치체감" 조항이 명시한 판정 대상은 "핵심 증명/비교 데이터"이고, 그 조항이 실제로 깨진 사례(`r13`)는 전부 **3번/클로징류 요약 숫자**에서였다. 2번은 "이미 등급·매칭·인증된 상품"이라는 정적 카탈로그 증명 섹션으로 읽었고, 모든 섹션을 검색에 종속시키면 오히려 "이 중 어떤 숫자가 조작으로 바뀌는지" 신호가 흐려진다고 판단해 2번은 고정, 3번/5번만 살아있게 분리했다.

## 접근성 자가 감사 (기본 뷰 밖 상태)

검색 쿼리를 바꾸면(칩 클릭 또는 타이핑) Hero의 결과 목록이 새로 렌더되지만, 그 새 행들은 기본 뷰의 행과 **완전히 같은 `ResultRow` 컴포넌트·같은 클래스**를 재사용한다(상태별 분기 마크업 없음) — 그래서 어떤 쿼리에서도 같은 포커스·대비 특성을 가진다. 칩 자체(`QUICK_FILTERS`)는 기본 뷰에서 이미 전부 렌더되어 게이트의 Tab 스윕이 전수 커버한다. 직접 확인한 것:
- 0건 매칭 상태("zzz" 같은 쿼리)의 안내 문구 색상(`#A1A1AA` on `#0B0B0F` = 7.66:1)·아이콘(`#BCA7F3` on `#0B0B0F` = 9.32:1) 모두 AA 통과.
- placeholder 텍스트(`#A1A1AA` on 패널 `#15141C` = 7.13:1)는 기본값이 입력되어 있어 기본 렌더에서는 보이지 않지만, 입력을 지운 상태를 가정해 AA 통과 색으로 맞춰 둠(초안은 `#6B6876`였고 패널 위 3.37:1로 미달이라 교체).
- 활성 칩(`aria-pressed="true"`, accent 채움 + 흰 텍스트)과 비활성 칩 모두 같은 `FOCUS` 포커스링 클래스를 가지므로 상태 전환이 포커스 가시성을 깨지 않음.
