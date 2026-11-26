# Candidate c — "Trust Breakdown"

**Theme / accent / face**: light / lime (`#3F6212` text+icon+fill-with-white-text, `#4D7C0F`
large-text-only) / no display face (Pretendard-only, a deliberate counterpoint to a/b)

**One-line concept**: Five independent toggle chips (photo match, serial verification, battery
health, cosmetic grading, functional test) each carry a fixed point value; toggling any of them
in or out adds or removes exactly that many points from a running Trust Score, shown as a big
number plus a per-category horizontal bar chart (bar width = that category's current point
value, muted when off). A second, independent "Standard / Strict" toggle re-weights every
category rather than scaling the score down uniformly — under Strict, functional testing alone
(36 pts) outweighs photos and cosmetic grading combined (30 pts), which is not true under
Standard (20 vs 38) — and both modes are deliberately engineered to cap at the same 100-point
maximum so the two settings are a real re-weighting, not a difficulty slider. Each category row
is keyboard-expandable to show what that check actually measures.

**Archetype**: multi-select toggle-set (not single-select) + a re-weighting (non-scaling) second
axis -> a grouped/categorical bar chart, not a ring, not a waterfall. Deliberately avoids the
radial gauge already used by "Trust Score Console" (`auto-landing-r18`, 4 sliders -> 1 radial
gauge) despite the similar "trust score" framing — this device's visualization is a set of
discrete, independently-readable bars rather than a single renormalizing dial, and its input is
discrete toggles rather than continuous sliders.

## 브리프에 없던 것

1. **무엇을 정해야 했나**: "트러스트 점수" 소재가 이미 카탈로그에 있는 `auto-landing-r18`(레이더 게이지)와 겹치지 않으려면 어떤 출력 시각화를 써야 하는가.
   **무엇으로 정했나**: 단일 다이얼/게이지 대신 카테고리별 독립 막대(그룹형 바 차트)를 선택 — 색은 단일 accent만 쓰고(근채도 유지), 구분은 라벨 텍스트로만.
   **왜 그렇게 정했나**: [[curation-criteria]]의 Q6 판정("입력축×출력축 조합표로 재탕을 판별한다")을 적용 — 입력(다중 토글 + 재가중 모드)과 출력(그룹 막대) 조합이 기존 라운드와 다르다고 판단했다.
2. **무엇을 정해야 했나**: lime 계열 중 어느 음영을 "본문 크기" 토큰으로, 어느 음영을 "대형 전용" 토큰으로 쓸지 — `lime-600`(3.09:1)과 `lime-700`(4.99:1)이 둘 다 근접-미달/근접-통과 값이었음.
   **무엇으로 정했나**: `lime-600`은 완전히 폐기(3:1 기준에 0.09 여유 — "딱 맞음" 규율 위반), `lime-700`은 대형/논텍스트 전용(4.99:1, 3:1 기준엔 충분한 여유), `lime-800`(7.08:1)을 유일한 소형텍스트/아이콘/포커스링/채움 토큰으로 지정.
   **왜 그렇게 정했나**: `design-principles.md`가 "4.53은 여유가 0.03이라 딱 맞음이라 쓰지 않는다"는 명시적 선례를 남겨서, 같은 기준을 두 값 모두에 적용했다.
3. **무엇을 정해야 했나**: 디스플레이 활자를 쓸지 — 브리프는 "선택 가능"이라고만 적음.
   **무엇으로 정했나**: 쓰지 않음 — 헤딩도 `--font-sans`(Pretendard)로 두고 크기/자간/색으로만 위계를 만듦.
   **왜 그렇게 정했나**: 이번 라운드의 세 후보 중 둘(a=grotesk, b=mono)이 디스플레이 활자를 쓰므로, c가 안 쓰는 선택도 "유효한 대안"이라는 브리프 문구를 실제로 행사해 세 후보 간 활자 축을 다양화했다.
