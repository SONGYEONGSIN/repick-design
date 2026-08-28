# Candidate c — "Redline"

An AI-verified-marketplace landing page whose hero centerpiece is a Google-Docs-style tracked-changes view of a real seller listing: struck-through overstated claims, inserted AI-corrected claims, tagged by category (condition / authenticity / price fairness). A three-chip filter control sits next to the headline — toggling a category recomputes, live, which redline corrections render in the paragraph, which rows appear in a "why we corrected this" evidence accordion below it, and a numeric trust-score readout (58–100, deterministic, weighted by category) — and the closing CTA echoes that same live state instead of a hardcoded number. The default (all three categories on) already shows all four corrections and a 100/100 score, so the diff is never zero before the user touches anything. Below the redlined listing, three more listing cards carry the same full proof stack (match %, grade, verification badge, before/after discount), so the whole first fold reads as real inventory, not just one illustrative example. Light "document" theme, near-monochrome, single sky accent, Space Grotesk Display on headlines only.

## 브리프에 없던 것

**① 정확한 accent 값과 대비 계산**
② `#0369a1` (Tailwind sky-700) — 버튼/보더/작은 텍스트·아이콘·포커스링 전부 이 한 값으로 통일.
③ 직접 relative-luminance 공식으로 세 후보를 계산했다 (sRGB → linearize → `L = 0.2126R+0.7152G+0.0722B` → `(L1+0.05)/(L2+0.05)`):
  - `sky-500 #0ea5e9` vs 흰색 = **2.77:1** — DNA가 요구하는 "filled fill/large-text 3:1"조차 못 넘는다. 완전히 폐기.
  - `sky-600 #0284c7` vs 흰색 = **4.09:1** — 3:1은 넘지만, 이 색을 버튼 배경으로 쓰고 그 위에 흰 글씨를 얹으면(흰 글씨 vs 배경 = 같은 비율) 4.5:1에 못 미친다. 작은 텍스트가 얹힐 채우기 색으로는 탈락.
  - `sky-700 #0369a1` vs 흰색 = **5.93:1** — 3:1(채우기/보더)과 4.5:1(작은 텍스트·아이콘·포커스링) 둘 다 넉넉히 통과. 최종 채택.
  - `sky-700` vs 다크 잉크(`zinc-900 #18181b`, 이 라우트의 헤딩/본문 색) = **2.99:1**. 이 페어링은 실제로 어디에도 안 쓰인다 — 이 디자인은 accent 채우기 위엔 항상 흰 글씨를 쓰고, ink 텍스트는 항상 흰/근흰 배경 위에만 놓기 때문. 그래도 브리프가 "두 값 다 계산해서 로그하라"고 명시했으므로 정직하게 기록.
  - `hover` 상태는 `sky-800 #075985`로 한 단계 더 어둡게 — 대비는 더 벌어지므로 별도 계산 불필요.
  - 옅은 배경용 틴트는 `sky-50 #f0f9ff`(칩 채우기)와 `sky-200 #bae6fd`(칩 보더, 장식용 non-text) 두 개만 썼다. `sky-100`은 결국 안 씀.

**② 다크 잉크 기준값**
② `zinc-900 (#18181b)`를 이 라이트 테마의 "dark ink"로 채택 (헤딩·본문 텍스트 색).
③ 브리프가 흑색 배경 톤을 가정한 문구(`bg #0B0B0F`)를 주지만 이 후보는 라이트 테마 지정이라, 텍스트로 실제 렌더링되는 가장 어두운 색을 "ink" 기준으로 삼는 게 계산을 실제 렌더 결과와 일치시키는 유일한 방법이라 판단.

**③ Body copy 컨테이너 폭 · 글자수 계산 (공식: `chars = width / (0.44 × font-size)`, `ch` 단위 금지)**
② 문단마다 실측 후 안전 마진을 두고 확정:
  - Hero subhead: 480px @ 17px → 480/(0.44×17)=**64.2자**
  - Value/Closing subhead: 460px @ 15px → 460/(0.44×15)=**69.7자** (처음엔 480px로 썼다가 72.7자로 70 목표를 넘겨서 460으로 축소)
  - Redline 문단(CorrectionText): 480px @ 15–16px → 480/6.6=**72.7자**(모바일 15px) / 480/7.04=**68.2자**(sm 16px 이상). 원래 496px로 썼더니 모바일에서 75.15자로 하드 상한(75)을 넘겨서 480으로 축소.
  - Evidence "why" 사유 텍스트: 380px @ 13px → 380/5.72=**66.4자**
  - Evidence 빈 상태 메시지: 400px @ 13px → **69.9자**
  - Value 카드 설명: 280px @ 14px → **45.5자**
  - Quote 카드 본문: 280px @ 15px → **42.4자**
③ 처음 두 곳(subhead, redline 문단)은 계산 없이 480px/496px를 임의로 잡았다가 공식 검산에서 75 상한 초과를 발견해 되돌렸다 — "짐작하지 말고 계산하라"는 브리프 지시를 스스로 위반할 뻔한 지점이라 기록해둔다.

**④ 상품 "사진"을 실사진 대신 생성형 SVG/CSS 스와치로 대체**
② 각 리스팅의 이미지 영역을 `next/image` 없이, 고정 aspect-ratio(`1/1`) + `bg-zinc-100` 타일 안에 lucide 아이콘(Shirt/Table2/Backpack/Lamp) 하나만 넣는 방식으로 처리.
③ 브리프는 `images.unsplash.com/photo-<fixed-id>` 또는 "generative SVG/CSS"를 명시적으로 허용한다. 이 세션의 아웃바운드 네트워크가 `images.unsplash.com`을 프록시 정책으로 차단(`curl` 시도 시 CONNECT 403)해서, 내가 기억에 의존해 고른 photo-id가 실제로 살아있는지 **검증이 불가능**했다. 틀린 id를 박아 넣으면 next/image가 조용히 깨진 이미지를 렌더링하는 리스크가 있어, 검증 가능하고 결정론적인 대안(아이콘 타일)을 택했다. 부수 효과로 "spec sheet/document" 미학과 오히려 더 잘 어울리고, 근단색 팔레트를 깨지 않는다.

**⑤ Trust-score 공식**
② `58(기본) + Σ(활성 카테고리의 교정 포인트)`, 포인트: condition 6점×2건=12, authenticity 18점×1건, price 12점×1건 → 전부 켜면 **100/100**, 다 끄면 **58/100**.
③ 임의의 숫자가 아니라 "몇 개 클레임을 실제로 검증했는가"에 비례해야 사용자가 토글을 만질 이유가 생긴다고 판단. 만점이 딱 100이 되도록 포인트를 역산했다 — 기본 상태(전부 켜짐)가 "완전히 검증됨"이라는 의미 있는 nonzero 상태로 시작해야 한다는 요구사항과도 맞아떨어진다. `computeTrustScore()`는 `CORRECTIONS` 배열에서 직접 reduce하므로 카피를 고치면 점수도 자동으로 따라간다 (하드코딩 없음).

**⑥ 레드라인 본문 카피 (판매자 원문 vs AI 교정문)**
② "Vintage Leather Field Jacket — Size M"에 대해 4건의 교정을 만들었다: condition-grade(등급 하향, B+), condition-care(케어 라벨 정정), authenticity-brand(브랜드 마크 검증), price-fair(가격 12% 저렴함을 근거와 함께 확인). 각 교정에 `reason`(근거 문장)까지 별도로 붙였다.
③ 아키타입 브리프가 "실제 판매자 리스팅처럼 읽히는" 구체적 카피를 요구했고, 카테고리당 최소 1건 이상 있어야 세 칩 전부가 기본 상태에서 뭔가를 보여준다. price-fair는 일부러 "나쁜 뉴스"가 아니라 "가격이 정당하다는 걸 확인해주는" 교정으로 써서 — 레드라인이 항상 판매자를 깎아내리는 게 아니라 근거 있는 판단이라는 톤을 세웠다 (트러스트워시 미니멀 보이스 유지).

**⑦ 다른 리스팅 3개 + 가격/할인 데이터**
② Mid-Century Oak Side Table ($210→$172, -18%), Canvas Weekender Duffel ($95→$86, -9%), Ceramic Table Lamp, Cream ($64→$58, -9%, 검증 "in review" 상태 하나 포함).
③ 할인율은 전부 `pctOff(before, after) = round((before-after)/before*100)` 함수로 계산 — 가격 두 개만 손으로 정하고 배지 숫자는 코드가 산출하게 해서 손 타이핑 불일치를 원천 차단. 세 번째 카드를 일부러 "verified"가 아닌 "pending/in review"로 만들어, 색만으로 상태를 구분하지 않고 아이콘(Hourglass vs ShieldCheck)+문구로도 구분되게 했다.

**⑧ 소셜 프루프 수치·인용구**
② 4개 통계(128,400+ listings redlined / 1 in 4 / 94% / 11 hrs)와 3개의 가상 인용구(구매자 2, 판매자 1).
③ 브리프에 실제 데이터가 없으므로 그럴듯하지만 임의인 숫자를 만들었다 — "94%"는 트러스트 스코어 만점(100)과 일부러 다르게 잡아 두 숫자를 혼동하지 않게 했다.

**⑨ 헤딩 구조 재배치 (h1→h2→h3 스킵 방지)**
② `<h2 className="sr-only">Verified listings</h2>`를 RedlineCard 앞, 즉 12-col 그리드의 오른쪽 컬럼 **맨 앞**에 배치.
③ 처음에는 이 sr-only h2를 카드 4개짜리 그리드 앞(문서 순서상 RedlineCard의 h3보다 뒤)에 뒀다가, DOM 순서를 다시 짚어보니 h1(왼쪽 컬럼) → h3(RedlineCard, 오른쪽 컬럼) → h2(뒤늦게) 순이 되어버려 "h1 다음에 h3로 건너뜀" 위반이 생기는 걸 발견했다. h2를 오른쪽 컬럼의 첫 자식으로 옮겨 h1→h2→h3 순서를 문서 순서 그대로 맞췄다.

**⑩ `<dl>` 대신 일반 `<div>`로 통계 타일 구현**
② SocialProof의 4개 통계 타일을 `dt/dd`가 아니라 그냥 `<p>` 두 개로 렌더링.
③ `framer-motion`으로 각 타일에 개별 reveal 애니메이션을 걸려면 타일 하나(label+value)를 `motion.div`로 감싸야 하는데, 그러면 `<dl>` 아래 `dt`/`dd`를 감싸는 `<div>`가 생겨버려 브리프가 명시적으로 지적한 axe `dlitem`/`definition-list` 실패 패턴 그 자체가 된다. 애초에 이건 용어/정의 쌍이 아니라 그냥 통계 타일이라 `dl`을 쓸 의미론적 이유도 없어서, 통째로 일반 div로 바꿔 문제 자체를 없앴다.

**⑪ Tailwind 임의값 안의 `clamp()` 공백 처리**
② `text-[clamp(1.75rem,1.4rem_+_1.6vw,2.75rem)]`처럼 `+` 앞뒤를 언더스코어로 표기.
③ 처음엔 `1.4rem+1.6vw`(공백 없이)로 썼는데, `calc()`/`clamp()` 문법상 `+`/`-` 앞뒤에 공백이 필수라 이대로면 브라우저가 값 전체를 무효 처리해 `font-size`가 조용히 상속값으로 폴백하는 실제 렌더링 버그였다. 그렇다고 리터럴 공백을 넣으면 Tailwind가 클래스 후보를 공백 기준으로 잘라버려 파싱이 깨진다. Tailwind의 표준 해법(임의값 안의 공백은 `_`로 표기, 빌드 시 공백으로 환원)을 적용해 네 곳(ValueSection·SocialProof×2·ClosingCTA) 모두 수정했다. Hero의 h1은 `style={{fontSize: "clamp(2.5rem, 1.7rem + 3.6vw, 5.5rem)"}}`처럼 인라인 스타일 문자열이라 이 문제가 아예 없다 (Tailwind 파서를 안 거치므로 진짜 CSS 공백 규칙을 그대로 따르면 됨) — 이 차이를 이해하지 못했다면 넷 다 놓쳤을 것.

**⑫ 카드 모서리 "종이 접힘" 장식 폐기**
② `clip-path: polygon(...)`로 RedlineCard 우상단에 문서-접힘 느낌을 주려다 제거.
③ `clip-path`는 보더까지 같이 잘라내므로 대각선 절단면에 테두리선이 안 남고 그냥 배경이 뚫려 보인다 — 종이 접힘처럼 보이려면 별도의 삼각형 pseudo-element+그림자가 필요한데, 그 정도 공수 대비 리스크(깨진 렌더링처럼 보일 가능성)가 크고 "no gradient/line-art decoration" 지침과도 방향이 안 맞아 통째로 버리고 일반 둥근 사각 카드로 되돌렸다.

**⑬ 4개 이상 인터랙션 타입의 실제 구성**
② 카테고리 필터 토글(버튼, `aria-pressed`) · evidence 아코디언(버튼, `aria-expanded` + CSS `grid-template-rows` 트랜지션) · 레드라인 문단의 `AnimatePresence` 교차 페이드(토글에 종속) · 3개 섹션의 `whileInView` 스크롤 리빌 · CTA 버튼의 `active:scale` 프레스 피드백 + `focus-visible` 키보드 아웃라인 — 총 5종.
③ 전부 `useReducedMotion()`으로 게이팅했고(`initial={false}` + `duration:0` 패턴), 스크롤 리빌은 `viewport={{once:true}}`라 스크롤할 때마다 재생되지 않는다. 카드 hover-lift(장식성이 강한 whileHover)는 애초에 넣지 않았다 — 실제 목적지 없는 카드에 순수 장식 모션을 추가하는 게 "decorative-only motion is penalized" 규정과 충돌할 여지가 있다고 판단해 스스로 배제했다.

**⑭ 간격 스케일**
② Tailwind 기본 4px 배수 스케일(`mt-3/4/5/6/8/10/14/16/24`, `p-4/5/6/8`, `gap-2/3/4/6/10`)만 사용, 커스텀 spacing 토큰은 만들지 않음.
③ 브리프가 별도 스케일을 지정하지 않았고, 레포의 Tailwind v4 기본 스케일이 이미 4px 리듬을 강제하므로 새로 정의할 이유가 없었다. 유일한 예외는 문자수 계산에서 나온 명시적 `max-w-[…px]` 값들(위 ③ 항목) — 이건 spacing이 아니라 컨테이너 폭이라 별도 항목으로 기록.

**⑮ 폰트 웨이트 3종 배분**
② 400(기본 상속, 본문/사유/인용구) · 500(`font-medium`, 버튼·칩·캡션·카드 타이틀·삽입 텍스트) · 700(`font-bold`, h1·h2·트러스트 점수·통계 값·가격 "after"·따옴표 글리프·워드마크).
③ 배분 후 모든 파일을 `font-(thin|extralight|light|normal|semibold|extrabold|black)` 정규식으로 grep해 검증 — 세 웨이트 밖의 클래스가 하나도 없음을 확인했다. Space Grotesk Display의 가변폭 범위가 `300–700`이라 700이 실제로 그 폰트 안에서 렌더되는 진짜 상한값이라는 것도 `globals.css`의 `@font-face` 선언에서 재확인.
