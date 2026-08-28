# r16 · Candidate B — "Comparables Radius"

A dark, editorial repick landing page whose hero is a stylized radius map: dragging (or stepping) a search-radius control around a fictional buyer neighborhood recomputes, in real time, the comparable-listing count, the price band those comparables sold for, and which four listings appear as "top matches" — each already carrying its full match%/grade/verification/discount proof stack, visible without any hover or scroll. A "Three numbers, one control" section and the closing CTA both re-read the same live state so the whole page keeps telling one consistent, moving story instead of a headline that promises proof it never delivers above the fold.

## 브리프에 없던 것

① **정확한 accent hex와 두 가지 대비 계산이 필요했다.**
② Tailwind `lime-400` (`#a3e635`)를 그대로 사용하기로 했다. 계산 결과: `#a3e635` vs 흰색(`#FFFFFF`) ≈ **1.5:1** (실패 — 그래서 흰 배경에 텍스트로는 절대 쓰지 않음), `#a3e635` vs 다크 잉크(`#0B0B0F`) ≈ **13.0:1** (WCAG AA/AAA 모두 소형 텍스트 기준까지 여유 있게 통과). 다크 잉크가 라임 위에서도 같은 방향으로 13.0:1이 나오므로, 라임을 채운 배경(디스카운트 칩, CTA 버튼) 위의 소형 텍스트에도 흰색 대신 다크 잉크(`#0B0B0F`)를 직접 사용했다 — 브리프가 "4.5:1을 계산으로 입증하면 다크 잉크도 허용" 이라고 명시했고, 13.0:1은 그 기준을 크게 웃돈다.
③ 다크 테마가 기본이라 라임이 거의 항상 어두운 배경 위에서만 텍스트/아이콘/보더/필로 쓰이는데, 이 조합의 대비가 이미 13.0:1이라 별도의 옅은 tint를 새로 만들 필요가 없었다 — 계산을 먼저 하고, 필요 없으면 만들지 않는 쪽을 택했다. (참고로 보조 텍스트로 쓴 `zinc-400`(`#a1a1aa`)도 다크 잉크 위에서 직접 계산해보니 ≈7.7:1로 브리프가 명시한 "다크 테마 zinc-400 최소" 기준을 충분히 만족한다.)

① **가상 동네 이름과 브랜드 카피가 필요했다.**
② 동네는 "Elm Hollow"(가상), 테스티모니얼에 나오는 두 번째 동네는 "Birchfield"(가상)로 지었다. 헤드라인은 "Matched, verified, and priced against / the market right around you." 서브헤드는 "repick compares each listing to verified sales within a radius you control, not a citywide average..."로 작성했다.
③ 실제 지명을 쓰면 허구의 매물/가격 데이터가 특정 지역에 대한 사실 주장처럼 읽힐 위험이 있어 피했다. 축약형(contraction)은 전부 배제했다 — `what's`, `it's` 류가 JSX에서 `react/no-unescaped-entities` 린트 경고를 유발할 수 있어, 아포스트로피를 아예 쓰지 않는 문장으로 다시 썼다(대신 필요한 곳엔 `&mdash;`, `&middot;`, `&ldquo;/&rdquo;`, `&copy;` 같은 HTML 엔티티만 사용).

① **본문 컨테이너 너비와 글자 수 계산이 필요했다.**
② 본문 단락은 `max-w-[480px]`, `text-[15px]`로 고정했다. 공식: `chars = width / (0.44 × font-size)` → `480 / (0.44 × 15) = 480 / 6.6 ≈ 72.7`자.
③ 목표(~70자)에 가깝고 상한(75자)를 넘지 않는 값을 역산해서 골랐다 — `ch` 단위는 지시대로 전혀 쓰지 않았다.

① **지도에 찍을 실제 매물 데이터셋(16개)이 필요했다.**
② `data.ts`에 16개의 결정론적 매물을 하드코딩했다: 각도는 골든 앵글(137.51°) 배수로 균등 분산, 거리는 0.6km~5.7km 사이에서 반지름을 1~6km로 움직일 때 누적 매물 수가 2→3→5→6→8→9→11→12→14→15→16로 매끄럽게 늘어나도록 수작업으로 배치했다. 기본 반지름은 **3.5km**로 잡아서(9개 매물, top4는 turntable 96% / sneakers 94% / watch 91% / jacket 88%) 첫 화면에서 이미 "중간 상태"를 보여주고, 슬라이더를 양쪽 어디로 움직여도 눈에 띄게 달라지도록 설계했다. 좌표(x,y)는 `Math.cos/sin`으로 계산하되 결과를 소수점 2자리로 반올림했다(trig 좌표 반올림 규칙 준수, `Math.random`/`Date`는 전혀 사용하지 않음).
③ 브리프는 "반지름 조작이 최소 3개 표면을 재계산해야 한다"고만 했지 정확히 몇 개의, 어떤 거리 분포를 가진 매물이 있어야 하는지는 정하지 않았다. 값이 매 스텝마다 실제로 움직이는 걸 보장하려면 분포를 직접 설계해야 했다.

① **가격/할인/등급/인증 같은 매물별 구체적 숫자가 필요했다.**
② 상품군(재킷, 스니커즈, 암체어, 시계, 백팩, 책장, 턴테이블, 자전거, 카메라, 기타, 러그, 가방, 식탁 의자, 즉석카메라, 코트, 스케이트보드)마다 가격/정가/등급(A~B-)/인증 여부/매치율을 개별 설정했다. 할인율은 가격에서 역산(38%~52%)했다.
③ 등급 표기는 중고 거래에서 흔한 알파벳 등급(A, A-, B+, B, B-)으로 통일해 "condition grade"라는 브리프 요구를 구체화했다.

① **매물 사진에 쓸 고정 Unsplash photo id들이 필요했다.**
② `images.unsplash.com/photo-<id>` 형식으로 16개의 서로 다른 고정 id를 지정했다(예: 데님 재킷 `photo-1551028719-00167b16eac5`, 스니커즈 `photo-1549298916-b41d501d3772` 등). 모든 이미지 컨테이너에 `aspect-square` + `bg-zinc-800`을 고정해, 특정 id가 로드에 실패해도 레이아웃이 깨지지 않게 했다.
③ 무작위 이미지 서비스(picsum 등) 금지 규정과 "고정 id만 허용" 규정을 지키면서도 카테고리별로 그럴듯한 사진이 오도록 직접 골라야 했다. `next.config.ts`에 `images.unsplash.com`이 이미 허용돼 있어 이 도메인을 선택했다.

① **매치%/등급/인증/할인 각각에 대응하는 아이콘 매핑이 필요했다.**
② `lucide-react`에서 매치율=`Target`, 등급=`Award`, 인증=`ShieldCheck`(비인증은 `ShieldOff`), 할인=`Tag`로 고정 매핑했다. 지도에는 `MapPin`/`Compass`/`SlidersHorizontal`을 보조로 썼다.
③ 색만으로 의미를 전달하지 않기 위해 모든 칩에 아이콘+텍스트를 동시에 넣어야 했고, 매물 카드마다 반복되므로 아이콘 의미를 페이지 전체에서 통일했다.

① **`<dl>` 구조를 쓰면서 3열 시각 레이아웃도 만들어야 했는데, 두 요구가 충돌했다.**
② `ValueBeats` 섹션에서 `dl`의 직계 자식은 `dt`/`dd`만 두고(래핑 `div` 없음, `React.Fragment`로만 그룹화), 시각적 3열 배치는 CSS `grid-auto-flow: column`(`grid-flow-col`) + 명시적 `grid-rows-3`/`grid-cols-3`으로 해결했다. DOM 순서는 `dt,dd,dd`가 그룹별로 이어지는 정상적인 정의 목록 순서를 유지하면서, 화면에는 열 우선으로 배치된다.
③ 브리프가 "아이콘은 dt 안에, dt/dd를 div로 함께 감싸면 axe definition-list/dlitem이 실패한다"고 명시적으로 경고했다. 일반적인 "그룹마다 div로 감싸고 flex/grid" 패턴을 쓸 수 없어서, CSS 그리드의 열 우선 채우기 기능으로 우회했다.

① **모션 세부값(지속시간, easing, stagger)과 "orphaned opacity:0" 회피 패턴이 필요했다.**
② 모든 scroll-reveal은 `initial`을 `{opacity:1, y:14}`(또는 reduced-motion 시 `{opacity:1, y:0}`)로 시작해 opacity가 절대 0이 되지 않게 했고, `whileInView`로 `y:0`까지만 이동시켰다. duration은 0.35~0.5초, easing은 `easeOut`, reduced-motion이면 duration을 0으로 낮췄다. 매물 카드 그리드는 `layout` prop만 사용한 FLIP 애니메이션으로 반지름 변경 시 재정렬을 보여주되, 마운트 시엔 애니메이션 없이 즉시 보이도록 했다.
③ 브리프가 "JS 없이도 콘텐츠가 보여야 한다"는 하드룰을 명시했고, 일반적인 `initial={{opacity:0}}` 패턴은 이 규칙을 위반할 위험이 있어 opacity는 항상 1로 고정하고 위치(`y`)만 움직이는 쪽으로 설계를 바꿨다.

① **반지름 내 매물이 4개 미만일 때(특히 최소 반지름 1km) 카드 그리드에 빈칸이 생기는 문제를 정의해야 했다.**
② `Compass` 아이콘과 "Widen your radius to see another match here." 문구를 담은 점선 테두리 placeholder 카드(`EmptySlot`)를 만들어, 항상 4칸 그리드 형태를 유지하면서도 빈 상태가 깨진 레이아웃처럼 보이지 않게 했다.
③ 브리프는 이 archetype이 "top matches 3~4개"를 요구한다고만 했지, 매물이 그보다 적게 남는 극단적 반지름 상태를 어떻게 처리할지는 정하지 않았다.

① **사회적 증거(통계·후기) 섹션의 구체적 숫자와 문구가 필요했다.**
② 통계 3개("14,200+ Verified sellers", "92% Average match accuracy", "38% Average savings vs. retail")와 후기 3개(Dana R. / Marcus T. / Priya K., 각각 이니셜 아바타 + "Verified buyer" 배지)를 만들었다.
③ 브리프는 "소셜 프루프 섹션"이 있어야 한다고만 했다. 과장 없이 담백한 편집 톤을 유지하기 위해 숫자를 과하지 않은 범위로 잡았다.

① **정확히 3개의 렌더링 폰트 굵기 배정이 필요했다.**
② `font-normal`(암묵적 기본, 본문), `font-medium`(캡션·라벨·보조 버튼·서브헤드 인트로 줄), `font-bold`(헤드라인·통계 숫자·가격·CTA·매물 제목 일부)만 쓰고 `font-semibold`/`font-light`/`font-black` 등은 코드 전체에서 배제했다(직접 grep으로 확인).
③ 브리프의 "정확히 3개 굵기" 하드룰을 지키려면 어떤 요소가 어떤 굵기를 갖는지 표를 세워야 했다 — 위계는 굵기가 아니라 크기/트래킹/색으로만 만들었다.

① **트래킹 3단 스케일(0.28/0.16/0.12em)을 실제 어느 요소에 배정할지 정해야 했다.**
② eyebrow(0.28em) = 히어로 상단 "Comparable sales, mapped" 한 줄; caption(0.16em) = 지도 패널 제목, 매물 카드 카테고리 캡션, "Top matches within…" 소제목; stat(0.12em) = ValueBeats의 `dt` 라벨.
③ 브리프는 3단 스케일 값만 주고 어디에 쓸지는 정하지 않았다.

① **포커스 아웃라인 색을 버튼마다 다르게 할지 통일할지 정해야 했다.**
② 라임 채움 CTA(히어로 primary, closing primary)는 `focus-visible:outline-white`(다크 배경 위에서 흰색이 라임 필과 겹치지 않고 가장 또렷함), 그 외 아웃라인/보더 버튼과 슬라이더는 `focus-visible:outline-[#a3e635]`로 통일했다. 모든 인터랙티브 요소에서 `outline-none`은 절대 단독으로 쓰지 않고 반드시 `focus:outline-none`(즉 `:focus` 상태로 스코프)으로만 써서 브리프가 경고한 "outline-none이 뒤의 focus-visible을 죽이는" 함정을 피했다.
③ 브리프가 이 함정을 명시적으로 경고했고, 실제로 초안에서 두 유틸리티를 같은 요소에 섞어 썼다가(전부 `outline-none` bare) 발견하고 6곳 전부 `focus:outline-none`으로 고쳤다 — 자체 점검이 실제로 걸린 사례.

## 파일 목록

- `app/src/app/landing-evolve/r16/b/page.tsx` — 서버 컴포넌트, metadata + `LandingClient` 렌더.
- `app/src/app/landing-evolve/r16/b/landing-client.tsx` — 반지름 state, 파생 데이터(`within`/`top`/`band`)를 `useMemo`로 계산해 전 섹션에 전달.
- `app/src/app/landing-evolve/r16/b/Hero.tsx` — 헤드라인+서브헤드+CTA, `MapPanel` + 매물 그리드(퍼스트폴드).
- `app/src/app/landing-evolve/r16/b/MapPanel.tsx` — 추상 SVG 지도(링/도트/반지름 원) + 슬라이더 + 프리셋 버튼.
- `app/src/app/landing-evolve/r16/b/ListingCard.tsx` — 매치%/등급/인증/할인 4종 proof 칩을 가진 매물 카드.
- `app/src/app/landing-evolve/r16/b/ValueBeats.tsx` — "Three numbers, one control" `dl` 기반 3열 재확인 섹션.
- `app/src/app/landing-evolve/r16/b/SocialProof.tsx` — 통계 3개 + 후기 3개.
- `app/src/app/landing-evolve/r16/b/ClosingCta.tsx` — 현재 반지름 상태를 그대로 읽어 문장을 만드는 클로징 CTA.
- `app/src/app/landing-evolve/r16/b/data.ts` — 타입, 결정론적 매물 시드(16개), 좌표/할인율 계산, 필터/정렬 헬퍼.
