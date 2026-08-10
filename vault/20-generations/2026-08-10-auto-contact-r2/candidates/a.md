# Candidate a — Escalation Ladder

**컨셉 1줄**: 창구가 아니라 **에스컬레이션 단계(Tier 1~4)**를 페이지의 척추로 삼는다 — 네 단계가 계단형 커넥터로 수직 연결된 "사다리"로 처음부터 전부 펼쳐져 있고, 각 rung(가로대)은 그 자체로 완결된 레코드(담당·실주소·고정 SLA 문구·그 약속이 깨지는 조건)이며, 유일한 인터랙션은 사다리를 재배열하거나 무엇을 감추는 게 아니라 방문자의 상황과 일치하는 rung 하나에 "Matches your situation" 배지를 얹어 **주의만 좁히는** 상황별 칩 그룹이다.

Sole Trace is a fictional resale price-tracking marketplace for sneakers and streetwear. Contact is organized as four support tiers rather than four departments: Tier 1 Help desk (general/self-serve, `help@soletrace.com`, same business day) → Tier 2 Order & authentication specialists (`orders@soletrace.com`, within 1 business day) → Tier 3 Trust & escalations (`escalations@soletrace.com`, within 4 business hours) → Tier 4 Urgent direct line (`urgent@soletrace.com` + `tel:+14155550142`, same-hour callback). All four render unconditionally as a step-connected `<ol>` with a numbered circle + vertical rail, every tier's mailto/tel link and SLA visible with zero interaction — Tier 1's full card (address, promise, break-condition) sits inside the first viewport at 1280×900 with no scroll. Eight issue-type chips ("I think I'm being scammed", "A payout is stuck and I can't wait", …), two per tier, are the page's one interactive device: clicking one adds a ring + "Matches your situation" badge to the tier that owns it — it never hides, filters, or gates any of the other three. No clock, no day/hour/timezone control anywhere; "when will they respond" is answered per tier with a fixed published promise (`slaLabel`) plus a fixed sentence describing when that promise does not hold (`breaksWhen`: weekend/after-hours/already-in-review conditions), all static data, zero `new Date()`/`Date.now()`/`Math.random()`.

Light theme, blue accent (blue-700/800 only). No display typeface — headings run on `--font-sans` (Pretendard) at larger sizes and heavier weight; a second face would compete with the rung numbers for the "operations runbook" texture this archetype leans into. Exactly three weights route-wide: `font-normal` / `font-semibold` / `font-bold`.

## 매크로 골격

```
Header: wordmark + status link + persistent Tier-1 mailto pill (always visible, any scroll position)
Hero: eyebrow "Contact" + h1 + one-sentence subhead (no stat paragraph, no bordered meta strip)
Situation chips: 8 toggle buttons, role="group", single-select, narrows attention only
The Ladder: <ol> of 4 step-connected tier cards (numbered circle + vertical rail connector)
  each card: icon+label → summary → mailto (+tel on Tier 4) → SLA + queue-depth → owner → "Breaks when" → escalate-to-next note
"Why tiers, not one inbox": 3-point rationale (why split beats a shared inbox)
"Before you write": 4-item prep checklist
Footer: repeat Tier-1 mailto + tagline
```

## 축

light · blue · no-display-font (Pretendard only)

## 이 라운드가 회피한 것

- **금지 장치**: 요일/시간/타임존 `<select>`+`<input type=range>` 발신시각 시뮬레이터(r1 3후보 전원 수렴) — 이 후보는 시간 입력을 아예 만들지 않았다. "언제 답이 오는가"는 티어별 **고정 게시 문구**(`slaLabel`)로만 답한다.
- **회피한 크롬 형태(Q22 관측)**: "히어로 문단 + 3~4셀 보더 메타 스트립 + 그 아래 단일 장치". 이 후보는 메타 스트립을 아예 두지 않고, 히어로 다음 요소가 곧바로 (칩 → )사다리 자체다 — 스트립처럼 별도로 접히지 않는다.

## 브리프에 없던 것

1. **① 무엇을 정해야 했나**: "시각 시뮬레이터를 쓰지 않고 응답시간 약속을 어떻게 검증 가능하게 만들지". r1의 판정 기준 초안은 "약속이 깨지는 조건까지 같은 화면에서 드러내야 한다"고 요구하는데, 배정문은 시계 장치를 명시적으로 금지했다.
   **② 무엇으로 정했나**: 약속을 **중앙값 하나가 아니라 문장 두 개**로 쪼갰다 — `slaLabel`(예: "Same business day")과 `breaksWhen`(예: "Messages after 4:00pm ET roll to the next business day; no weekend coverage"). 둘 다 결정론 고정 데이터다.
   **③ 왜**: [[contact-deltas-provisional]]과 r1 DECISION의 "판정 기준 초안"이 요구하는 것은 "약속이 언제 깨지는가"를 **보여주는** 것이지 "지금이 몇 시인가"를 **계산하는** 것이 아니다. 계산을 없애도 그 요구는 만족시킬 수 있다는 것이 이 후보의 핵심 내기였다.

2. **① 무엇을 정해야 했나**: "상황별 칩"이 무엇을 하면 안 되는지. 배정문은 "리스트를 좁히지 말 것"을 명시하지 않았지만, [[curation-criteria]]의 "차별성↔완성도 상충" 판정과 Q21이 요구하는 것은 조작이 증명(상시 노출된 4개 rung)을 지연시키지 않는 것이다.
   **② 무엇으로 정했나**: 칩 클릭은 **DOM에서 아무것도 제거하지 않는다** — 매치된 rung에 링+배지를 추가할 뿐, 나머지 세 rung과 그 mailto/tel는 선택 전후로 동일하게 렌더된다. `aria-live` sr-only 리전으로 매치 결과를 스크린리더에도 알린다.
   **③ 왜**: r1 승자 c의 트리아지 입력은 슬립 자체를 **교체**했고(그래서 "검색이 리스트를 좁힌다"는 금지 조항에 안 걸린다는 것을 코드로 증명해야 했다), 이 후보는 반대 극단 — 아무것도 교체하지 않고 **강조만** 얹는 방식 — 을 택해 같은 함정(핵심 증명이 인터랙션 뒤에 있다는 의심)을 원천적으로 피했다.

3. **① 무엇을 정해야 했나**: 디스플레이 폰트를 아예 쓰지 않는 게 "상용 SaaS 완성도" 기준에서 안전한지. 코어 규칙은 디스플레이 폰트 사용을 강제하지 않지만, r1 세 후보 전원이 (grotesk/mono/wide 각각) 디스플레이 폰트를 썼다.
   **② 무엇으로 정했나**: `--font-sans`(Pretendard) 단일 서체로 갔다. `fontFamily` 인라인 스타일이 라우트에 전혀 없다.
   **③ 왜**: 이번 라운드 다양성 축이 grotesk 재사용만 금지했지만, mono/wide도 r1에서 이미 각각 한 번씩(b/c) 쓰였다 — 셋 중 무엇을 골라도 어느 한 r1 후보와 "디스플레이 서체 사용" 자체는 겹친다. 완전히 건너뛰는 것이 유일하게 세 후보 전원과 겹치지 않는 선택이었고, Stripe 지원 페이지류의 벤치마크가 실제로 시스템 산세리프 단일 서체로 완성도를 낸다는 점이 근거를 보탰다. 부수 효과로 [[questions-queue]] Q19가 지적한 "폰트 상수 추출이 `no-unlisted-font`에 걸린다"는 함정도 원천적으로 사라졌다.

4. **① 무엇을 정해야 했나**: rung(단계)이 몇 개여야 자연스러운지. "escalation ladder"라는 개념 자체는 단수를 강제하지 않는다.
   **② 무엇으로 정했나**: 4단계로 고정하고, 각 단계에 상황 칩을 정확히 2개씩(총 8개) 배정해 대칭을 맞췄다.
   **③ 왜**: 3단계는 "urgent" 단계가 "escalation" 단계와 구분이 옅어지고, 5단계 이상은 사다리가 폴드 아래로 너무 길어져 Tier 1의 제로-인터랙션 증명과 균형이 깨진다. 4는 r1의 Culvert(5창구)·Tessera(4창구)와도 겹치지 않는 선택지 중 하나였고, 특히 마지막 단계에서만 전화(`tel:`)를 열어 "얼마나 급해야 전화까지 가는가"라는 사다리 특유의 위계를 명확히 남겼다.

5. **① 무엇을 정해야 했나**: 사다리 폭(레이아웃 최대 너비). 계단형 커넥터가 있는 세로 흐름은 r1 세 후보의 6xl 와이드 레이아웃과 다른 리듬을 요구한다.
   **② 무엇으로 정했나**: `max-w-4xl`(896px) 단일 칼럼. 사이드바나 다단 그리드를 두지 않았다.
   **③ 왜**: 넓은 그리드는 "사다리" 은유와 충돌한다 — 사다리는 한 줄로 오르내리는 것이지 병렬로 펼쳐지는 것이 아니다. 좁은 칼럼은 1920px에서도 오버플로 없이 안정적으로 스케일되는 것을 스크린샷으로 확인했다(§검증).

6. **① 무엇을 정해야 했나**: 접수 확인/폼 제출 흐름을 넣을지. r1 세 후보 모두 폼 + 결정론 접수번호를 넣었다.
   **② 무엇으로 정했나**: **폼을 아예 넣지 않았다.** 모든 접점이 `mailto:`/`tel:`뿐이다.
   **③ 왜**: 배정문이 이번 라운드에서 요구한 것은 "실제 채널이 작동 링크로 폴드 위에 있을 것"이지 접수 폼이 아니다. 폼+접수번호는 r1 세 후보가 이미 다뤘고 이번 배정(칩으로 rung을 좁히는 것)의 초점도 아니라서, 마크업 관용구가 겹칠 위험을 줄이려 의도적으로 뺐다. 대신 "Before you write" 섹션으로 이메일에 무엇을 담아야 빠른지를 안내해 같은 실용적 목적(첫 답장을 유용하게 만들기)을 폼 없이 달성했다.
