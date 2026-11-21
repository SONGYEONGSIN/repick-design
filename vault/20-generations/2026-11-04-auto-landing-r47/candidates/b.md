# Candidate B — "Checkpoint Deck": a swipeable verification stack, not a gate-chain

One-line concept: the hero runs a fixed Sony a7 IV camera listing through four always-present
checkpoint cards (condition, authenticity, damage, function) — confirm or flag each one by
dragging, clicking, or Tab+Enter — and a persistent tally directly below recomputes a live trust
score and resale price range on every touch, ending in a derived "Verified/Flagged — Grade X"
card once all four are resolved; that same live score, grade and price range are then cited by
name in the value section and the closing CTA, never restated as a fixed number.

## 브리프에 없던 것

### ① 정확히 어떤 "장치" 메커니즘을 쓸지 — 슬롯은 "swipeable checkpoint stack"만 명시
브리프는 디바이스/컨셉 이름("Checkpoint Deck")과 대략적 동작(스와이프/클릭으로 confirm/flag →
라이브 트러스트 스코어 + 가격대 집계 → 전체 해소 시 verdict 카드)만 줬다. 금지 목록의
"sequential verification gate-chain"과 구별되는 지점(누적 스코어가 있다 vs 없다)은 브리프가 직접
설명해줬지만, 실제 UI 구조(진짜 숨겨진 스택인지, 항상 보이는 그리드인지, 몇 장이 동시에
떠 있는지)는 미지정.

### ② 결정: 4장 모두 항상 DOM에 존재하는 2×2 그리드 + 드래그 제스처 + 항상 보이는
Confirm/Flag/Undo 버튼
"진짜 숨겨진 스택"(해소된 카드가 사라지고 다음 카드가 올라오는 방식)은 키보드 접근성이 까다롭다
— Tab 순서가 매 상호작용마다 바뀌고, 아직 액션할 수 없는 "다음 카드"를 Tab에 노출할지 숨길지
애매해진다. 대신 4장을 항상 동시에 렌더링하는 그리드로 만들고, 드래그(`framer-motion`
`drag="x"` + `dragSnapToOrigin`)는 보조 제스처로만 얹었다 — 실제 1차 접근 경로는 항상 보이는
`<button>` 3종(Confirm/Flag/Undo)이라, Tab이 카드마다 안정적인 순서로 버튼을 방문한다.

### ③ 왜
브리프의 하드 요구("Tab between cards", "Enter/Space to confirm, a dedicated flag key or
button")가 의미하는 것은 "제스처 없이도 전부 가능해야 한다"는 것이지, "숨겨진 스택처럼 보여야
한다"는 것은 아니다. 실제 네이티브 `<button>`을 쓰면 Enter/Space가 공짜로 동작하고, 커스텀
키다운 핸들러의 버그 위험(예: `preventDefault` 누락, 포커스 트랩)을 아예 없앤다. 드래그는 "느낌"을
위한 장식적 보강이고, `prefers-reduced-motion`일 때는 `whileDrag`/스냅백 스프링만 꺼지고 드래그
자체(직접 조작)는 유지했다 — 자동 재생 애니메이션이 아니라 사용자가 직접 트리거하는 제스처라서.

### ① 카드 뒤집기(card-flip) 인터랙션 구조 — 브리프는 예시로만 언급
"a card-flip revealing checkpoint detail"은 "예시"로만 제시됐고, 실제 구현(3D transform으로 양면을
동시에 DOM에 둘지, 단일 콘텐츠 교체로 할지)은 미지정. 양면을 동시에 DOM에 두는 진짜 3D flip은
숨겨진 면에 `aria-hidden` + 포커스 가능한 요소에 `tabIndex=-1`을 동적으로 토글해야 해서 버그
표면적이 넓다.

### ② 결정: `AnimatePresence`로 앞면/뒷면을 완전히 교체(한쪽만 항상 DOM에 존재), `rotateY`
트랜지션으로 시각적 flip 느낌만 재현
### ③ 왜
한 번에 한쪽 면만 마운트되므로 `aria-hidden`+포커스 트랩 로직이 전혀 필요 없다 — 접근성
버그 표면적을 구조적으로 제거하는 선택. Confirm/Flag/Undo 액션 버튼은 이 flip 영역 **바깥**에
둬서, 뒷면(설명 텍스트)을 보는 중에도 액션 경로를 잃지 않게 했다.

### ① amber accent의 실제 hex와 각 대비값 — 브리프는 "amber, dark-ink가 유리할 것"이라는 예측만
주고 정확한 값은 미지정, 직접 계산하라고 명시
### ② 결정: fill `#F59E0B`(amber-500, 항상 dark-ink 텍스트 전용), 작은 텍스트/링크/아이콘용
`#B45309`(amber-700), 큰(≥24px) bold 헤드라인 한 단어 전용 `#D97706`(amber-600), 포커스 링
`amber-700`
### ③ 왜 — WCAG 상대휘도 계산(표준 공식, 노드 스크립트로 직접 실행)
- 흰 텍스트 on `#F59E0B`(amber-500) → **2.15:1** — 3:1(큰 텍스트 최소선)조차 통과 못함. 이
  채움에 흰 텍스트는 어떤 크기에도 쓰지 않는다.
- 다크 잉크 `#18181B`(zinc-900) on `#F59E0B` → **8.25:1** — 모든 크기 통과. 그래서 Confirm
  버튼, 헤더 CTA, hero CTA, verdict 배너 등 모든 accent-fill은 예외 없이 dark-ink 텍스트.
- `#D97706`(amber-600) on white → **3.19:1** — 딱 큰 텍스트(3:1) 선만 통과, 본문(4.5:1)은
  실패. 그래서 히어로 h1의 "checkpoint deck" 한 단어(font-extrabold, clamp 최소 36px)에만
  한정해서 썼다 — 캡션/아이콘/본문 텍스트에는 절대 안 씀.
- `#B45309`(amber-700) on white → **5.02:1** — 모든 크기 통과. 그래서 eyebrow·캡션·"Why this
  match" 같은 작은 accent 텍스트는 전부 amber-700.
- `#B45309`(amber-700) on `#FEF3C7`(amber-100, 배지 틴트 배경) → **4.51:1** — AA(4.5)를 통과는
  하지만 마진이 거의 없다(0.01 차이). 이 정확한 페어링은 아예 쓰지 않기로 하고, 모든 amber-100
  배지는 텍스트를 다크 잉크(`#18181B` on `#FEF3C7` → **15.91:1**)로 바꿔 안전 마진을 크게
  확보했다 — 아이콘만 amber-700을 쓰거나, 아이콘도 잉크로 통일.
- `zinc-500`(`#71717A`) on white → **4.83:1**, on `zinc-50`(`#FAFAFA`) → **4.63:1**: 둘 다
  4.5 통과. 하지만 `zinc-500` on `zinc-100`(`#F4F4F5`) → **4.40:1**로 실패한다 — 브리프가 경고한
  "surface-tone-conditional floor"가 실측으로 확인됨. 그래서 `MUTED_TEXT`(zinc-500)는 흰/zinc-50
  배경에만, `MUTED_TEXT_ON_TINT`(zinc-600, on zinc-100 → **7.03:1**)는 틴트 표면(배지, 트랙,
  카드 안쪽 캡션 등)에만 쓰도록 토큰을 둘로 분리했다.
- 장식용 ghost 숫자(zinc-400 `#A1A1AA` on white → **2.56:1**, 실패)는 `aria-hidden`이어도
  axe가 실제 렌더 대비를 본다는 브리프 경고대로 zinc-500(**4.83:1**)으로 올려서 썼다 — zinc
  스케일에서 흰 배경 위 3:1을 넘는 가장 밝은 회색이 zinc-500이라는 것도 계산으로 확인했다
  (zinc-300/zinc-400 모두 1.4~2.6대로 실패).

### ① 본문 줄 길이 컨테이너 폭 — 공식만 주어짐, 폭 숫자는 미지정
### ② 결정: 4단계 고정 폭 — 12px→370px(`23.125rem`), 14px→431px(`26.9375rem`),
16px→492px(`30.75rem`), 18px→554px(`34.625rem`)
### ③ 왜 — 계산: `chars-per-line = container-px / (0.44 × font-size-px)`, 목표 70자·상한 75자.
`container-px = 70 × 0.44 × font-size-px`로 역산해서 각 폭을 직접 산출했다(12px: 70×0.44×12
=369.6→370; 14px: 431.2→431; 16px: 492.8→492; 18px: 554.4→554). 검증: 370/(0.44×12)=70.08자,
431/(0.44×14)=69.96자, 492/(0.44×16)=69.89자, 554/(0.44×18)=69.95자 — 전부 70자 근방, 75자
상한 아래. `ch` 단위는 전혀 쓰지 않았다(브리프가 지적한 대로 Pretendard digit `0`이 평균보다
35% 넓어서 과다 추정되기 때문).

### ① 히어로 폴드 예산 — "hero-fold completeness"는 하드 게이트지만 실제 px 여유는 직접 계산
브리프는 "1280/1440/1920px 실제 스크린샷으로 체크한다"고만 했고, 허용 높이는 안 알려줌.

### ② 결정: 헤더 padding 축소(`py-4`), 히어로 섹션 padding `lg:pt-8/lg:pb-10`으로 축소, 서브헤드
2줄로 단축, 체크포인트 카드 padding/gap을 전부 한 단계씩 축소(`p-3`→`p-2.5`, `gap-2`→`gap-1.5`
등), 트러스트 탤리 숫자를 `text-2xl`→`text-xl`로 축소
### ③ 왜: 초안 그대로면 헤더(~70px)+히어로(디바이스 패널 기준 ~738px) ≈ 808px로, 일반적인
1280×800/1440×900 데스크톱 뷰포트에서 폴드 아래로 밀릴 위험이 있었다. 패딩·간격·폰트 크기를
단계적으로 줄여 총 높이를 ~700px대로 낮췄다 — 디바이스(덱+탤리)가 히어로 **안에서** 완전히
보이는 것이 하드 요구라서, 줄 수 있는 모든 여백을 먼저 줄이는 쪽을 택했다(글자 자체를 더 줄이지
않고 여백만 줄여서 가독성은 유지).

### ① 기본 상태(어떤 체크포인트가 이미 confirmed인지) — "2 of 4"라는 개수만 명시, 어떤 2개인지는
미지정
### ② 결정: condition + authenticity를 기본 confirmed, damage + functional을 기본 pending
### ③ 왜: 카메라 중고 거래에서 실제로 "사진만 보고도 먼저 확인되는" 항목(겉 상태, 시리얼 인증)과
"기기를 손에 들고 돌려봐야 하는" 항목(센서 스크래치, 셔터/AF 실측)이 자연스럽게 나뉜다 — 임의의
2개가 아니라 도메인상 그럴듯한 순서. 이 기본값에서 `confirmedRatio = 2/4 = 0.5` 정확히 경계값이
되므로, 상태 레이블 분기(`confirmedRatio >= 0.5 ? "Trending Verified" : "Needs Review"`)의
`>=` 가드가 "가상의 엣지 케이스"가 아니라 **모든 방문자가 첫 렌더에서 실제로 보는 경로**임을
의도적으로 확인했다(노드 스크립트로 직접 실행: 기본 상태 → avgScore 90, Grade A, `$1,690–
$1,950`, confirmedRatio 0.5 → "Trending Verified").

### ① 상품 사진 — 실사 Unsplash 고정 ID 허용, 어떤 ID를 쓸지는 미지정
### ② 결정: 레포 내 기존 후보들이 이미 쓴 검증된 고정 ID를 재사용(Sony a7 IV
`1495121605193-b116b5b09a56`, Air Jordan 1 `1542291026-7eec264c27ff`, Peak Design 백팩
`1553062407-98eeb64c6a62`, Canon RF 렌즈 `1560243563-062bfc001d68`, Omega Speedmaster
`1524805444758-089113d48a6d`)
### ③ 왜: 무작위 Unsplash URL을 새로 추측하면 존재하지 않는 photo id일 위험이 있다. 레포를
grep해서 다른 라운드(`r25`~`r45`) 후보들이 이미 실사용·검증한 고정 ID를 그대로 재사용함으로써
"고정 실사 URL" 요구를 지키면서도 깨진 이미지 위험을 없앴다 — 이는 사진 자산 재사용이고, 금지된
"장치/메커니즘 중복"과는 무관하다(브리프도 `r33/a`에서 동일하게 "fixed real photo, reused across
the catalog"라고 명시).

### 접근성 교차 점검(요약)
- 포커스 링: 모든 인터랙티브 요소가 `FOCUS_RING`(`outline-amber-700`)을 쓰고, `outline-none`이
  어디에도 먼저 붙어있지 않음을 grep으로 확인.
- `role="group"` 카드의 `aria-label`은 보이는 라벨 텍스트(`checkpoint.label`)를 그대로 앞에
  포함(`"{label}, {status}"`)해서, `button`류가 아니라 서로 다른 규칙이 적용되는 역할이라도
  라벨-콘텐츠 불일치를 원천적으로 피했다. 아이콘만 있는 버튼은 전혀 없음(Confirm/Flag/Undo/
  Details/Back/Why this match 전부 보이는 텍스트가 곧 접근 가능한 이름).
- 그리드 자식에 전부 `min-w-0`: 히어로 2분할 그리드, 체크포인트 덱 2×2 그리드(`CheckpointCard`
  루트가 직접 자식), 카탈로그 4그리드(`Reveal`의 `motion.div`가 직접 자식), Value-split
  3그리드, SocialProof 증언 3그리드·통계 3그리드 — 모든 grid 컨테이너의 **직접 자식**에
  `min-w-0`을 달았다(자손이 아니라).
- 카드 뒤집기는 `AnimatePresence`로 한쪽 면만 마운트하므로 `aria-hidden`+포커스 트랩 로직이
  필요 없음(위 ① 참고).
- `whileInView` 리빌(`Reveal.tsx`)은 `useSyncExternalStore` 기반 `useMounted()`로 마운트
  게이트, `prefers-reduced-motion`이면 `initial=false`로 애초에 숨겨진 상태를 서버에서
  내려보내지 않음.
- 숫자(트러스트 스코어·가격대·AI baseline·match%)는 전부 `tabular-nums`.
- 별점(★★★★★)은 `aria-hidden`이고 옆에 `sr-only` "Rated 5 out of 5 stars" 동반.

## 파일
- `app/src/app/landing-evolve/r47/b/page.tsx`
- `LandingExperience.tsx` (전역 상태: `statuses` + `computeVerdict`)
- `Hero.tsx`, `CheckpointDeck.tsx`, `CheckpointCard.tsx`, `TrustTally.tsx` (장치 본체)
- `ProductPreview.tsx`, `ProductCard.tsx`, `ProductThumb.tsx` (카탈로그)
- `ValueSplit.tsx`, `SocialProof.tsx`, `ClosingCTA.tsx`
- `Reveal.tsx`, `useMounted.ts`
- `checkpoint-data.ts`, `checkpoint-math.ts`, `product-data.ts`, `tokens.ts`
