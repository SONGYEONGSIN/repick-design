---
tags: [auto-landing-r19, candidate]
---

# r19/a — The Case File

한 줄 컨셉: 히어로 안의 "Exhibit A" 케이스 파일 카드에서 인스펙션 강도(Standard/Enhanced/Forensic)와 비교매물 기간(30/90/180일) 두 세그먼트 컨트롤을 조작하면 신뢰도·추천가·통과 체크·회전일수가 즉시 재계산되고, 같은 파생값이 별도의 "Exhibit B" 감도표(3×현재 window)·상품 프리뷰의 대표 카드·가치 3분할 섹션·클로징 CTA 헤드라인까지 전부 동일한 `deriveVerdict()` 함수 하나로 흘러간다. 레스트 상태는 Enhanced/90일(신뢰도 88%, $6,801, 26% 할인, 14/14 체크 통과)로 이미 증거가 노출된 지점이다.

## 브리프에 없던 것

**1. 제품 도메인 및 대표 상품**
① 무엇을 정해야 했나 — "감사 가능한 단일 리스팅"이 구체적으로 무엇인지(브리프는 grade/verification/discount 어휘만 규정).
② 무엇으로 정했나 — 1972년산 Herman Miller Eames Lounge Chair & Ottoman(로즈우드/블랙 레더), Case File `REPICK-CF-2291`을 히어로의 유일한 주인공으로, 프리뷰 섹션에는 이 체어(라이브 데이터 재사용) + 시계(Rolex Datejust 36)·자전거(1987 Bianchi 스틸 프레임)·러그(Anatolian Kilim) 3종을 정적 비교 항목으로 배치.
③ 왜 — 최근 라운드(r18/a)가 카메라를 주인공으로 썼기에 가구로 도메인을 이동해 차별화했고, "감정평가 서류가 붙는 고가 빈티지 가구"는 실제로 감사/출처 증명 관행이 존재하는 카테고리라 "Editorial Data-Room" 컨셉과 자연스럽게 맞물림.

**2. accent 색상 계열 (hex 및 대비 계산 — 필수 기록)**
① 무엇을 정해야 했나 — violet 회피 + 라이트 테마에서 실제로 통과하는 accent를 hex 단위로 계산해 고르는 것.
② 무엇으로 정했나 — base accent `#A6341F`(옥스블러드/스탬프 레드, 채움·보더·큰 텍스트용), 딥틴트 `#7A2515`(작은 텍스트/링크/포커스링용). WCAG 상대휘도 공식으로 직접 계산(스크립트로 검증, `/tmp/contrast.py`):
   - `#A6341F` vs bg(`#F6F4EF`) = **6.10:1**(작은 텍스트도 통과) · vs white = **6.70:1** · vs ink(`#15140F`) = **2.75:1**(3:1 큰텍스트 기준도 미달 — 그래서 ink 텍스트는 accent 채움 위에 절대 사용하지 않음).
   - `#7A2515` vs bg = **9.08:1** · vs white = **9.99:1** · vs surface(`#E3DECE`) = **7.42:1**.
   - 채움 배경 규칙: accent 채움 버튼/배지는 **흰색 텍스트만** 사용(6.70:1로 4.5:1 통과) — ink 텍스트는 2.75:1로 실패하므로 절대 사용 금지, 브리프의 "fill-background rule"을 문자 그대로 지킴.
③ 왜 — "승인 스탬프/봉인 잉크" 은유가 감사 도서관 컨셉과 직결되고, 최근 라운드(r18/a)가 이미 웜톤 브라스 계열을 썼기에 채도를 높인 레드 쪽으로 이동해 차별화. violet 계열은 카탈로그에서 8회 최다 사용이라 명시적으로 배제.

**3. 배경/표면/잉크 그레이스케일 팔레트**
① 무엇을 정해야 했나 — bg/surface/ink/muted 네 톤을 정확한 hex로 확정하고 각 조합의 대비를 계산하는 것.
② 무엇으로 정했나 — `bg #F6F4EF`(페이퍼) / `surface #E3DECE`(크래프트 폴더 톤) / `ink #15140F` / `mutedOnBg #6B6862`(근백색 표면 플로어) / `mutedOnSurf #57544D`(틴트 표면 플로어). 계산: ink vs bg **16.78:1**, mutedOnBg vs bg **5.05:1**(≥4.5 통과), mutedOnSurf vs surface **5.61:1**(≥4.5 통과). 단, surface vs bg 자체는 **1.11:1**로 시각적 경계가 거의 없어서(둘 다 명도가 비슷한 warm off-white 계열) 모든 surface 카드에 `1px solid ink/12~15%` 헤어라인 보더를 강제로 추가해 시각 경계를 보정 — 이는 대비 실패가 아니라(카드 배경은 텍스트가 아님) 순수 디자인 가독성 보정.
③ 왜 — 감사 서류함/폴더 색 계열(warm off-white + kraft tan)이 "case file/dossier" 은유에 직접 부합; 헤어라인 보더 보정은 편집 디자인에서 통용되는 방식(경계선으로 필드 구분)이라 아예 이 컨셉의 시각 언어(§ 폴리오, 표 보더)와 자연스럽게 통일됨.

**4. 라이트 테마 커밋**
① 무엇을 정해야 했나 — 이번 라운드 필수 라이트 테마를 다크 폴백 없이 완전히 커밋할지.
② 무엇으로 정했나 — 다크모드 분기(`@media prefers-color-scheme: dark`, `[data-theme="dark"]`) 전부 생략, `bg`/`ink` 등은 인라인 `style`로 명시적 색칠(투명 배경 없음).
③ 왜 — 정본이 허용한 예외("단일 룩에 확정하는 디자인은 다크 블록 생략 가능, 단 배경·색은 명시적으로 칠할 것")를 그대로 사용; "감사 보고서"는 인쇄물/서류 질감이 라이트에서만 성립하는 컨셉이라 다크 대안 자체가 의미 없음.

**5. 디스플레이 활자 범위**
① 무엇을 정해야 했나 — 배정된 `--font-display-wide`(Archivo Display)를 어디까지 쓸지(그로테스크 금지 라운드).
② 무엇으로 정했나 — h1 1곳 + 섹션 h2 5곳(Exhibit B/Every listing/One case file/What the case file changes/Read Case File...) + 마스트헤드 "repick" 워드마크에만 적용. 카드 제목·배지·본문·h3(가치 3분할 컬럼 타이틀)은 전부 Pretendard(`--font-sans`) 유지.
③ 왜 — 브리프가 "large latin display text only"로 범위를 좁혔으므로 헤딩 레벨을 벗어나지 않음; Tailwind 임의값 `font-[family-name:...]` 파싱 신뢰성이 불확실해 인라인 `style={{fontFamily: DISPLAY_FONT}}`로 강제 지정(파싱 실패 시 폰트가 조용히 무시되는 리스크 제거).

**6. 폰트 웨이트 배정 (정확히 3종)**
① 무엇을 정해야 했나 — 400/600/800을 어디에 배정하고 4번째 웨이트가 새어들지 않게 보장하는 것.
② 무엇으로 정했나 — 400(`font-normal`, 본문/캡션/워치 값 텍스트)/600(`font-semibold`, 라벨·배지·버튼·h3·카드 제목)/800(`font-extrabold`, h1·h2·큰 스탯 숫자). `tokens.ts`의 `W` 상수 하나로 전 컴포넌트가 공유, grep으로 `font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)` 검색해 세 종류만 검출됨을 확인.
③ 왜 — 웨이트를 한 파일에 상수로 강제하면 컴포넌트별로 실수로 `font-bold`/`font-medium`을 쓸 여지가 원천 차단됨 — r18/a가 grep으로 사후 검증한 것과 동일한 안전장치를 사전(상수화)으로 옮김.

**7. 본문 문단 폭 계산 (`ch` 단위 금지, 0.44em 상수)**
① 무엇을 정해야 했나 — 여러 문단 컨테이너의 실제 px 폭을 65~75자 상한(목표 70자) 안에 들어오게 계산하는 것.
② 무엇으로 정했나 — 히어로 서브헤드 `max-w-[480px]`+16px = 480÷(0.44×16=7.04) ≈ **68.2자**. Exhibit B/Value 섹션 인트로 `max-w-[440px]`+15px = 440÷6.6 ≈ **66.7자**. 상품 프리뷰/클로징 CTA 인트로 `max-w-[460px]`+15px = 460÷6.6 ≈ **69.7자**(초안은 480px=72.7자였으나 목표(70)에 더 가깝게 460px로 축소). 테스티모니얼 인용문 `max-w-[540px]`+18px = 540÷(0.44×18=7.92) ≈ **68.2자**. 카드 디테일 텍스트는 `max-w-[300px]`+12.5px ≈ 54.5자(짧은 사이드바 텍스트라 하한 없음).
③ 왜 — 모든 값이 70자 목표 부근·75자 상한 아래로 수렴하도록 반복 계산·조정(초기 500px/480px 시안은 각각 75.8자/72.7자로 상한 근접·초과라 460px로 축소); `ch` 단위는 Pretendard 기준 폭 왜곡 때문에 전혀 사용하지 않고 항상 px+0.44em 산수로 역산.

**8. 거대 고스트 넘버 대안 처리**
① 무엇을 정해야 했나 — "고스트 넘버링"을 편집적 시그니처로 넣되, 대비 플로어와 헤딩 위계 충돌 없이 구현하는 방법.
② 무엇으로 정했나 — 두 갈래로 분리: (a) 히어로 좌측 하단에 케이스 번호 "2291"을 weight 400 + tracking 0.12em(stat tier) + `mutedOnBg`(5.05:1, 24px 이상 large-text 3:1 플로어를 훨씬 상회) 색으로, h1 글자와 절대 겹치지 않는 별도 빈 그리드 셀에 배치. (b) 섹션 2~6에는 브리프가 제시한 "안전한 대안"인 작은 폴리오 마커 `§ 0X / 06`(11px, mutedOnBg)를 각 섹션 우상단에 배치, "FIG."와 용어를 분리해 이미지 캡션 "Fig. N"과 혼동되지 않게 함.
③ 왜 — 겹침 자체를 설계로 배제하면 "대비를 낮췄더니 그래도 헤딩과 경쟁한다"는 실패 모드가 구조적으로 발생할 수 없음; 이미지 fig 번호(1~5)와 섹션 폴리오 번호(1~6)를 다른 기호(Fig. vs §)로 분리해 두 넘버링 체계가 서로 참조하지 않게 정리.

**9. 가정 파생 모델 (deriveVerdict) 및 감도표**
① 무엇을 정해야 했나 — rigor×window 두 축을 실제로 어떤 산식으로 엮어 "전체 도시에가 재도출된다"를 증명할지, 임의 난수 없이.
② 무엇으로 정했나 — `confidence = round(weight×100 − volatility×40)`, `price = round(basePrice×(1−volatility×(1−weight)))`, `discount = round((retail−price)/retail×100)`, `clean = comps ≥ 8`. 9개 조합을 파이썬 스크립트로 사전 계산해 단조성 확인(신뢰도 76→95%, 가격 $6,678→$6,840, 체크 통과는 30일 창에서만 comps=6<8이라 −1). Exhibit B 표는 동일 함수를 현재 window로 3개 rigor에 대해 다시 실행해 히어로 카드와 항상 동기화.
③ 왜 — 순수 함수 하나(`deriveVerdict`)를 hero/표/가치섹션/CTA가 전부 import해서 쓰게 만들면 "조작이 하단까지 살아있는다"는 요구가 구조적으로 보장됨(마지막 CTA가 별도 하드코딩 문자열을 쓸 수 없는 구조); 30일 창에서만 clean=false가 되도록 comps 임계값(8)을 설계해 "데이터가 부족하면 플래그가 뜬다"는 서사를 숫자로 체감시킴.

**10. 이미지 처리 — 생성형 SVG 전용**
① 무엇을 정해야 했나 — "실제 사진"을 쓸지, 생성형으로 갈지 — 특히 이 환경에서 특정 Unsplash photo-id가 실제로 resolve되는지 검증할 방법이 마땅치 않음.
② 무엇으로 정했나 — 4종(체어/시계/자전거/러그) 전부 인라인 SVG(`Glyphs.tsx`), 정수 좌표만 사용(삼각함수 없음), 채움 도형 + 두꺼운 round-cap 스트로크(12~14px)로 구성해 "블루프린트 얇은 선화"가 아니라 "솔리드 마크"로 읽히게 함. `aria-hidden`+`role="presentation"`, `<text>` 노드 없음 — 정보는 옆의 실제 HTML(Fig 캡션·태그·배지)로만 전달. `next/image`는 사용하지 않음(래스터 이미지 자체가 없으므로).
③ 왜 — r18/a가 동일한 이유(검증 안 된 photo-id의 깨짐 리스크, 배지-위에-이미지 충돌 리스크)로 생성형을 택한 선례를 따름; 대신 "감사 증거물"이라는 컨셉상 오히려 실사진보다 "플랫 다이어그램" 쪽이 자료의 톤에 더 맞아 컨셉 적합도도 높다고 판단.

**11. 포커스 링 구현**
① 무엇을 정해야 했나 — Tailwind v4에서 실제로 페인트되는 포커스 표시 메커니즘.
② 무엇으로 정했나 — `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A2515] focus-visible:shadow-[0_0_0_3px_#7A2515]` 하나의 상수(`FOCUS_RING`)로 전 인터랙티브 요소 통일, `outline-none`은 파일 전체에 단 한 번도 사용하지 않음(주석 제외, grep으로 확인).
③ 왜 — `outline-none`을 아예 안 쓰면 "reset이 나중 유틸리티를 취소한다"는 죽은 관용구가 애초에 발생할 수 없음; 같은 저장소의 최근 r20/r21 dash-evolve 라운드들이 이미 이 정확한 패턴(`outline-2`+`outline-offset-2`+`outline-[color]`+`shadow-[...]`, `outline-none` 없이)으로 수렴한 것을 확인하고 재사용.

**12. sr-only × overflow-x-auto 클리핑 상호작용**
① 무엇을 정해야 했나 — Exhibit B 표의 "Currently selected" sr-only 헤더 셀이 `overflow-x-auto` 래퍼 안에 있을 때 모바일 390px에서 `document.scrollWidth`를 부풀리지 않게 하는 것.
② 무엇으로 정했나 — sr-only `<span>`을 감싸는 `<th>`에 `position: relative`(`className="relative"`)를 추가해, absolute로 배치되는 sr-only 요소의 positioned ancestor를 그 th 자신으로 고정.
③ 왜 — 브리프가 명시적으로 경고한 실패 모드(가장 가까운 positioned ancestor가 없으면 뷰포트 기준으로 튀어나가 스크롤 폭을 부풀림)를 sr-only span이 아니라 "가장 가까운 wrapper"에 relative를 주는 방식으로 정확히 브리프 문구대로 해결.

**13. 캐러셀 ARIA 패턴 단순화**
① 무엇을 정해야 했나 — 소셜프루프 캐러셀의 점 인디케이터를 `role="tablist"/"tab"`(완전한 ARIA 탭 패턴, 화살표 키 내비게이션 요구)으로 만들지, 더 단순한 패턴으로 갈지.
② 무엇으로 정했나 — `role="tablist"/"tab"` 대신 `role="group"` + `aria-pressed` 토글 버튼 그룹으로 단순화. prev/next 버튼은 `aria-label`만으로 충분히 명확화.
③ 왜 — 화살표 키 로빙 tabindex 등 완전한 tab 패턴의 키보드 동작을 구현하지 않은 채 `role="tab"`만 붙이면 ARIA 저작 관행 불일치 리스크가 있어, 기능은 동일하되 의미상 더 안전한 토글 버튼 그룹으로 낮춤.

## 인터랙션 목록 (최소 4종 확인)

1. **히어로 가정 패널** — Inspection rigor(3옵션) + Comparables window(3옵션) 세그먼트 컨트롤 2세트, 둘 다 같은 `(rigorId, windowId)` state를 갱신 → `deriveVerdict()`가 히어로 카드의 확신도/가격/체크/회전일수/배지 전부를 즉시 재계산.
2. **스크롤 트리거** — `Reveal`(framer-motion `whileInView`, `viewport once:true`)이 전 섹션에 적용. opacity는 절대 건드리지 않고 `y: 16 → 0`만 애니메이션해서 JS가 죽어도(SSR에 `style="transform:translateY(16px)"`만 남음) 콘텐츠가 완전히 보이는 상태를 보장 — "opacity:0 고착" 실패 모드를 애초에 발생 불가능하게 설계.
3. **상품 프리뷰 카테고리 필터** — All/Furniture/Watches/Cycling/Home 칩, `aria-pressed` + 체크 아이콘 + 채움색 변화(색상 단독 아님)로 4개 카드 실시간 필터링. 대표 카드(Case File 2291)는 `live:true`라 필터 상태와 무관하게 항상 히어로와 동일한 라이브 verdict를 보여줌.
4. **클로징 CTA 이메일 폼** — 정규식(`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) 검증, `aria-invalid`/`aria-describedby`로 에러 연결, 성공 시 아이콘+텍스트 상태로 전환.
+보강 5. **Exhibit B 감도표** — 표 자체는 클릭 인터랙션은 아니지만 히어로 컨트롤 조작에 따라 3행 전체(체크/신뢰도/가격)가 실시간 재계산되고 현재 rigor 행에 보더+"Selected" 텍스트+체크 아이콘이 붙는 시각 확인 장치.
+보강 6. **소셜프루프 증언 캐러셀** — prev/next 버튼 + 점 토글 그룹, `AnimatePresence mode="wait" initial={false}`로 진입 애니메이션 없이 첫 렌더 고정, reduced-motion 시 애니메이션 없는 순수 스왑.

## 상태 연속성 확인 (히어로 → 하단까지)

`client.tsx`가 `rigorId`/`windowId` state와 그로부터 도출한 `verdict = useMemo(() => deriveVerdict(...), [...])`를 최상위에서 소유하고, `Hero`/`SensitivityTable`/`ProductPreview`/`ValueSection`/`ClosingCta` 다섯 컴포넌트 전부에 그대로 prop으로 내려보냄. 히어로에서 세그먼트를 바꾸면 Exhibit B 표, 대표 상품 카드, 가치 3분할의 세 컬럼 스탯, 마지막 CTA 헤드라인의 "{confidence}% confidence" 문구까지 전부 같은 렌더 사이클에서 동시에 갱신됨 — 클로징 CTA는 하드코딩 문자열이 아니라 `verdict.confidence`/`verdict.recommendedPrice`/`verdict.discountPercent`/`verdict.checksPassed`를 직접 읽음.

## 폰트 웨이트 실측 확인

`grep -E "font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)"`를 `tokens.ts`(정의부)와 나머지 8개 파일(소비부)에 실행 — `font-normal`/`font-semibold`/`font-extrabold` 세 종류만 검출, 전부 `tokens.ts`의 `W` 상수 하나를 통해서만 진입(개별 컴포넌트가 직접 웨이트 클래스를 타이핑하지 않음).
