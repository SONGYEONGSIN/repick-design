# auto-dash-r48/b — "Rundate"

Editorial publishing calendar console. Calendar/board-centric main content (brief §추가학습
explicitly names this as an underused archetype). A month grid where each day cell shows a
day number + a deterministic "posts published" count + a decorative intensity bar (opacity
scales with count). Selecting a day fans into a Day-detail panel listing that day's actual
scheduled posts. Month toggle (Oct/Nov, 2 fixed months) switches the whole grid. Real
column-sort on the "Scheduled this month" table. Theme: dark (`#0F172A` bank from
colors.catalog) / accent blue-400/-600 / display face `--font-display-wide`.

## 브리프에 없던 것

1. **무엇을 정해야 했나**: 날짜 셀의 "발행 건수" 배지를 배경색으로 인코딩할지, 별도 장식
   요소로 분리할지 — 처음엔 배지 배경 자체를 강도별 반투명 블루로 칠하고 그 위에 흰 숫자를
   얹었다가 `color-contrast` 실패(고강도 배경에서 흰 텍스트 대비 미달).
   **무엇으로 정했나**: 셀 배경은 카드와 동일한 고정 다크 톤으로 유지하고, 강도는 셀 **하단의
   `aria-hidden` 장식 바**(불투명 4px)로만 표현 — 텍스트 색은 배경이 바뀌지 않으므로 항상 동일
   대비를 유지한다.
   **왜**: 데이터 인코딩을 배경+전경색 조합에 의존하면 값마다 대비를 재계산해야 하고, 극단값에서
   실패하기 쉽다. 장식 요소를 텍스트와 분리하면 대비가 값과 무관해진다.
2. **무엇을 정해야 했나**: 날짜 셀의 `aria-label` — 처음엔 `"Oct 14: 2 posts published"`처럼
   서술형 커스텀 라벨을 달았다가 `label-content-name-mismatch` 실패(가시 텍스트 "14"+"2"가
   연결된 문자열 "142"가 그 라벨 문자열 안에 리터럴로 없음).
   **무엇으로 정했나**: 커스텀 `aria-label`을 완전히 제거하고, 가시 텍스트 뒤에 `sr-only`
   보강 설명 span을 덧붙임 — 접근 가능 이름이 가시 텍스트 자체에서 파생되므로 충돌이
   구조적으로 불가능해짐.
   **왜**: 레포 자체 선례(아카이브 #13 "content IS the accessible name, no competing custom
   aria-label" 원칙)를 그대로 적용.

## 자가 발견 결함 — 데이터 정합성 (하드게이트 밖, judge가 스크린샷에서 발견)

**날짜 셀의 발행 건수 배지와 실제 "Day detail" 패널의 게시물 목록이 서로 다른 데이터
소스에서 나온다.** 셀 배지(`countsFor()`)는 `(day*7 + base*11) % 6` 고정 공식으로 산출한
결정론적 더미 숫자이고, Day-detail 패널은 실제 `POSTS` 배열을 그 날짜로 필터링한 목록이다.
10월 14일 셀은 "1"을 표시하지만 실제 `POSTS`에는 그날 항목이 **2개**(`Grading rubric
clarification`·`Verified seller spotlight: Mara K.`) 있어 Day-detail 패널은 "2 posts
scheduled"를 보여준다 — **같은 화면 안에서 두 숫자가 어긋난다.** `dash-brief-v3.md` §완성도
기준 "데이터: 현실적·결정론적 더미 … **합계 정합(부분합=총합)**"을 직접 위반한다. 하드게이트는
이 종류의 교차-위젯 산술 불일치를 측정하지 않는다(스크린샷을 나란히 봐야만 드러난다) — 이번
라운드의 LEARN delta로 적재한다(DECISION.md §5).

## 프레임 커버리지 (self_judged 라운드 — judge 본인 메모)

`b-1440.png`·`b-390.png` 2장 확인. 데이터 정합성 결함은 이 2장을 "Day detail" 패널과 나란히
대조해서 발견했다 — 단일 프레임만 봤다면 놓쳤을 결함이다.
