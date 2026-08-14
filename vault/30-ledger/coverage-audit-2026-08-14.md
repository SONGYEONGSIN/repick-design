# 정본 ↔ 게이트 커버리지 감사

2026-08-14 · 정본 `vault/00-principles/` 전 조항 대 실제 계측(9관문 + 정적 9규칙 + sweep) 대조. 41작품 소급 실측.

---

## 요약

정본이 요구하는데 **계측이 그것을 재지 않는** 조항을 찾는 감사다. 이번 세션에 그 형태의 구멍이 두 건(디스플레이 활자 1종 · 캡 임계) 우연히 발견됐고, 체계적으로 훑으면 나머지가 나온다는 가설로 시작했다.

**결론은 예상과 달랐다.** 가장 큰 구멍은 "계측이 없는 조항"이 아니라 **계측이 있는데 통과시키는 조항**이었다.

---

## F1 — a11y 하드게이트가 개별 감사 실패를 통과시킨다 ★ 최우선

**evidence**: `/developers`(dv1)가 Lighthouse `heading-order` 감사를 **명시적으로 실패**(`score=0`, `scoreDisplayMode=binary`)했는데 총점 **98**로 하드게이트(95)를 통과한다. `scripts/gate.mjs:114` `normalizeA11y(score)`는 **숫자 하나만** 받는다 — 어떤 감사가 실패했는지는 애초에 게이트에 도달하지 않는다.

**root cause**: 정본 `page-brief-core §2`는 헤딩 스킵·버튼 이름·대비를 **절대 금지**로 적었다. 계측은 **가중 평균의 임계값**이다. 절대 규칙을 평균으로 강제할 수 없다 — 5점 미만짜리 감사는 무엇이든 통과한다. 가중치가 0인 감사(`label-content-name-mismatch`)는 **총점 100을 받고도 실패**한다.

**전수 실측 (41작품, Lighthouse accessibility)**

| 구분 | 작품 수 |
|---|---|
| 모든 binary 감사 통과 | **23** |
| 점수 ≥95(게이트 통과)인데 감사 1건 이상 실패 | **15** |
| 점수 <95 (오늘 돌리면 탈락) | **3** |

점수 100인데 감사를 실패한 작품이 2건 있다 — `d45`·`d41`의 `label-content-name-mismatch`.

**실패 감사별 집계**

| 감사 | 건수 | 정본 대응 조항 |
|---|---|---|
| `button-name` | 7 | §2 키보드 도달·접근 이름 |
| `color-contrast` | 6 | §2 대비 AA |
| `label-content-name-mismatch` | 3 | §2 접근 이름 |
| `skip-link` | 2 | §2 키보드 전 경로 |
| `target-size` · `listitem` · `heading-order` · `dlitem` · `definition-list` · `aria-required-parent` · `aria-required-children` | 각 1 | §2 |

**targeted fix**: `runLighthouse`가 실패한 binary 감사 id 목록을 함께 반환하고, `normalizeA11y`가 그것을 `detail`에 싣는다.

### 후속 실측 (같은 날, 양 프리셋 합집합)

위 표는 **모바일 프리셋만** 본 값이었다. 게이트는 데스크톱·모바일을 둘 다 돌려 **합집합**을 취하므로 소급 스캔도 같아야 한다. 다시 쟀다.

| 구분 | 모바일 단독 | 양 프리셋 (수정 후) |
|---|---|---|
| 모든 binary 감사 통과 | 23 | **26** |
| 점수 통과 + 감사 실패 | 15 | **15** |
| 점수 <95 | 3 | **0** |

**작품 수는 거의 같았지만 감사 목록이 달랐다** — `d39`에 `label-content-name-mismatch`가, `d45`에 `color-contrast`가 더 있었다. 한 프리셋만 보면 "몇 작품이 걸리나"는 맞아도 **"무엇을 어겼나"가 틀린다.** 그리고 고칠 대상을 정하는 것은 후자다.

**점수 미달 3건 해소** — `d32` 84 · `d35` 91 · `d37` 94 → 전부 **100 · 실패 감사 0**. 상세는 PR #137.

**갱신된 집계**: `color-contrast` 6 · `button-name` 5 · `label-content-name-mismatch` 3 · `skip-link` 2 · `target-size`·`heading-order`·`definition-list` 각 1.

**전면 하드페일 비용**: 15/41 = **37%** (수정 전 44%).

**좁은 승격 후보 (≤2건)**: `heading-order`(dv1) · `definition-list`(ig1) · `target-size`(pf1) · `skip-link`(d29·d33) — **4감사 5작품**. 이 5건을 고치면 네 감사를 하드페일로 올려도 카탈로그가 안 깨진다.

**승격 판정** — "감사 1건이라도 실패면 하드페일"은 **41작품 중 18건(44%)을 깬다.** 웨이트 3종이 41% 위반으로 기록전용에 머문 것과 같은 상황이라 전면 하드페일은 안 된다. 단계를 나눈다:

1. **즉시(무해)**: 실패 감사 목록을 `detail`에 **기록**한다. 지금은 아무도 못 본다 — 15작품의 결함이 게이트를 통과하며 조용히 지나갔다. 기록만으로도 다음 라운드부터 judge와 사람이 본다.
2. **좁은 하드페일**: 정본이 절대 금지로 적었고 소급 위반이 ≤2건인 감사만. `heading-order`(1) · `label-content-name-mismatch`(3, 단 2건은 점수 100) · `skip-link`(2) · `definition-list`(1) · `target-size`(1).
3. **보류**: `button-name`(7) · `color-contrast`(6)은 위반이 많아 먼저 고치고 나서 승격.

**predicted impact**: 1단계는 게이트 detail에 실패 감사가 나타난다(현재 0건 표시 → 15작품에서 표시). 2단계는 신규 라운드에서 해당 감사 실패가 judge 이전에 차단된다.

---

## F2 — 포커스 가시 규칙에 계측이 없다

**evidence**: `app/src/app/dash/d32/topbar.tsx:50` — `<input className="… outline-none placeholder:text-zinc-500">`. 브라우저 실측(포커스 후 `getComputedStyle`): `outlineStyle=none` · `boxShadow=none` → **포커스 표시가 전혀 없다.** `/dash/d45`도 동일. 대조군 `/commissioned/verdant`의 버튼은 같은 측정에서 표시 있음(ring = box-shadow)이라 계측은 유효하다.

**root cause**: 정본 §2 "포커스 가시(`outline-none` 단독 금지 — 반드시 `focus-visible` 링과 함께)". 정적 규칙 9종 중 이걸 보는 것이 없고, Lighthouse도 포커스 가시성은 감사하지 않는다(수동 점검 항목). 그래서 d32·d45가 a11y 95+를 받았다.

**전수 실측**: 맨 `outline-none`(= `focus-visible:`/`focus:` 접두 없음, `focus-within:ring` 래퍼도 없음) **62건 / 11작품**. 준수 30/41.

**targeted fix**: 정적 규칙 `bare-outline-none` — `focus-visible:`·`focus:`·`group-focus*:`·`peer-focus*:` 접두가 붙지 않고, 앞선 600자 안에 `focus-within:(ring|border|outline)`도 없는 `outline-none`.

**승격 판정**: 위반 27%(11/41)라 **하드페일 불가**. 기록전용으로 넣고 11작품을 고친 뒤 승격.

**주의 — 이 검사는 오탐을 내기 쉽다.** 첫 구현이 `focus-visible:outline-none`(올바른 패턴)을 부분 문자열로 잡아 4건을 거짓 보고했다. 접두 검사와 `focus-within` 래퍼 예외가 둘 다 필요하다.

---

## F3 — 라이트 표면 보조텍스트 하한에 계측이 없다 (다크는 있다)

**evidence**: 정적 규칙 `no-dark-dim-text`가 다크 하한(zinc-400)을 토큰 수준에서 강제한다. 정본 §2가 같은 문단에서 지정한 **라이트 쪽 조건부 하한**(순백/zinc-50 이하 표면에서 zinc-500 · zinc-100 이상 muted 표면에서 zinc-600)에는 대응 규칙이 없다.

**root cause**: 정본이 근거까지 적어 뒀다 — `neutral-500` on `neutral-100` = 4.34:1로 하드게이트 미달. 그런데 Lighthouse는 **기본 렌더 뷰만** 보므로 필터·토글로만 도달하는 상태는 못 잡고, 정적 규칙은 다크만 본다.

**targeted fix**: 정적 규칙에 표면 톤 조건부 하한 추가. 다만 표면 톤은 **부모 문맥**이라 소스만으로는 판정이 어렵다 — F2와 달리 신뢰할 수 있는 정적 검사를 쓸 수 있는지 자체가 불확실하다.

**predicted impact**: 미정. 구현 가능성 조사가 선행돼야 한다.

---

## 계측이 없지만 **넣지 말아야** 할 조항

감사 중 후보로 올렸다가 **전부 오탐으로 판명**된 것들. 기록해 두지 않으면 다음에 또 시도한다.

| 조항 | 왜 정적 검사가 안 되나 |
|---|---|
| §3 SVG 삼각함수 소수 2자리 | `/scene`의 `Math.sin`은 `Float32Array` **WebGL 버퍼**로 가고 마크업에 안 실린다. `shapes.ts:76`은 `Math.round(...)`로 이미 감싸여 있다. "삼각함수를 쓴다"와 "SSR 마크업 좌표에 쓴다"를 정적으로 못 가른다 |
| §2 reduced-motion 게이팅 | framer-motion 관용구는 `useReducedMotion()`이라 `motion-reduce` 문자열 검색으로는 안 잡힌다. 고치니 위반이 9건 → **1건**(cr1) |
| §3 이미지 컨테이너 예약 | 첫 검사는 파일 아무 데나 `h-`가 있으면 통과라 **공허한 통과**였다. 직속 부모 태그로 좁히니 41/41 준수 — 실제로 지켜지고 있다 |
| §3 `tabular-nums` | 어떤 텍스트가 숫자인지 정적으로 판정 불가 |
| §2 색만으로 의미 전달 금지 · 키보드 전 경로 | judge 렌즈 영역. 정본도 그렇게 배정했다 |

---

## 계측이 정본과 정확히 맞는 조항 (모범)

**§4 폭 검증.** 정본이 "1280/1366/1440/1600/1920 + 390, 여유폭 16px 미만은 실패"라 적었고, `dash-sweep.mjs:3-14`가 `DESKTOP_WIDTHS = [1280,1366,1440,1536,1680,1920]` 각각에 **`-16px`(SLACK)까지** 재며, 테이블 오버플로는 `width < 768`에서 제외한다(정본의 "로컬 가로 스크롤은 모바일 전용"과 일치). **정본의 문장이 코드에 1:1로 옮겨져 있다.**

사소한 드리프트 1건: 정본은 `1600`, sweep은 `1536`·`1680`. sweep이 더 넓게 브래킷하므로 실질 문제는 없으나 두 목록이 갈라져 있다.

---

## 감사 자체에 대한 관찰

**후보 검사 4종이 전부 첫 실행에서 오탐을 냈다.** 고치고 나서야 실제 위반이 드러났고, 그중 둘(`svg-precision`·`image-reserve`)은 고친 뒤 **위반이 0으로 사라졌다** — 즉 결함은 작품이 아니라 내 검사에 있었다.

계측을 새로 쓸 때의 규율: **첫 출력의 위반 사례를 하나씩 소스로 열어 확인하기 전에는 그 숫자를 보고하지 않는다.** 이번엔 확인이 오탐을 네 번 잡았다.
