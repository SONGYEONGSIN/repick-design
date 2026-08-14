# auto-landing-r10 — SCORES

frozen hash (후보 소스 전체 SHA-1, 게이트+1-fix 후 동결): `3507b5adfe38504ba21d30caca6d9eda6fdf54b4`

## 후보 개요 — 3개 모두 서로 다른 매크로 골격 배정 (r9의 6라운드 수렴 진단에 대한 직접 대응)
- **a** "Layer Inspector" — AI 레이어토글 히어로(조건/진위/가격공정성 3레이어, 토글 시 판정배지+신뢰도바+하이라이트 동시갱신) → 스펙시트형 제품카드 4장 → 에디토리얼 얼터네이팅 블록(번호 없음) → FAQ 아코디언 → 단일 대형 풀쿼트 → CTA. 다크·`--font-display-mono`.
- **b** "Filter-Rail Storefront" — 필터칩 히어로(예산/카테고리/컨디션, 조정 시 레일+집계 2면 동시재계산) → 배지행형 제품 레일(데스크톱은 그리드로 전환, 모바일만 가로스크롤) → 수평 스테퍼 → 단일 케이스스터디 블록 → CTA. 라이트·`--font-display-wide`.
- **c** "Negotiation Console" — 톤 슬라이더 히어로(정중↔단호, 조정 시 AI 메시지 초안+저축액+수락확률 동시갱신, 대기 상태부터 비영 값) → 비교스트립형 제품카드 4장 → 탭 패널 가치제안 → 마퀴 티커 → 시맨틱 비교표 → CTA. 다크·`--font-display-grotesk`(화이트리스트 3종 중 유일하게 직전 라운드 승자와 겹침 — 3종뿐인 화이트리스트에서 3-way 배정을 강제한 결과, DECISION에 사유 기록).

## 하드게이트 (`gate.mjs --target web --routes /landing-evolve/r10/<v>`)

| 후보 | route | types | static | lint | weights | sweep | console | a11y | perf |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| a | ✅ | ✅ | ✅ | ✅ | ✅ 3종 | ✅ | ✅ | ✅ 96(실패감사 bf-cache·**color-contrast**) | ✅ 56 |
| b | ✅ | ✅ | ✅ | ✅ | ✅ 3종 | ❌→✅(1-fix) | ✅ | ✅ 100(bf-cache만) | ✅ 59 |
| c | ✅ | ✅ | ✅ | ✅ | ✅ 3종 | ✅ | ✅ | ✅ 100(bf-cache만) | ✅ 60 |

`pass: true` 전원(1-fix 후). b 1차 실패 사유: 데스크톱 전 폭(1264~1920)에서 `ul#0`(제품 레일) `table-overflow` 2336px — `[class*="overflow-x"]` 셀렉터가 레일의 `overflow-x-auto`를 감지, `page-brief-core.md` §4 "로컬 가로 스크롤은 모바일 전용" 위반. **1-fix**: `FilterRailHero.tsx`의 레일 `<ul>`에 `md:grid md:grid-cols-4 md:overflow-visible md:snap-none md:pb-0` 추가해 데스크톱은 전 카드 그리드 표시(스크롤 불요)로 전환, 화살표 버튼·힌트 텍스트는 `md:hidden`으로 데스크톱에서 숨김(더 이상 필요한 조작이 아니므로 dead-control 방지). 재게이트 9/9 통과.

## 오케스트레이터 독립 확인 — accent 대비 규칙 실측 검증 (매우 중요한 발견)
`design-principles.md`는 "채움 위 글자: accent(#6E56CF) 배경 위에는 흰색이 아니라 어두운 잉크를 얹는다"를 명시한다. 후보 a는 이 규칙을 문자 그대로 따라 다크잉크를 썼고, 후보 c는 자체 WCAG 계산으로 **흰색이 더 낫다고 판단**해 규칙을 어기고 흰색을 썼다(사유는 `candidates/c.md`에 기록).
독립 재계산(WCAG relative luminance, `#6E56CF` 기준):
- 흰색 on accent: **5.39:1** (본문 크기 AA 4.5 통과)
- DNA 자체 다크 잉크(`#0B0B0F`) on accent: **3.64:1** (대형텍스트 AA 3.0은 통과하나 본문크기 AA 4.5 **미달**)
- 순검정 on accent: 3.90:1 · `#18181b` on accent: 3.29:1 — 전부 4.5 미달

**게이트 실측이 이를 뒷받침한다**: 규칙을 그대로 따른 a는 a11y `color-contrast` 감사가 **실패**(96점, 하드페일 승격 항목이 아니라 통과는 함)했고, 규칙을 어긴 c는 `color-contrast` 실패 없이 **100점**을 받았다. 즉 브리프의 이 조항은 대형 텍스트(≥24px/19px bold)나 비텍스트 요소(보더·막대)에는 맞지만, 본문 크기 버튼 라벨에는 **거꾸로 된 지침**이다 — 판정과 별개로 LEARN 단계에서 delta로 적재.
