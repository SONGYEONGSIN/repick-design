# 후보 a — "Layer Inspector"

**한 줄**: 코트 실사진 위 3개 AI 검사 레이어(컨디션·진품·가격 공정성)를 토글하면 판정 배지·신뢰도 바·사진 위 하이라이트 영역이 동시에 재계산되는 히어로 아래, 4장의 스펙시트형 매물 카드 → 에디토리얼 롱폼(이미지/텍스트 교차 3블록) → FAQ 아코디언 → 단일 풀쿼트 → CTA로 이어지는 다크·모노스페이스 랜딩.

- 배정: 조작 어휘 = **3레이어 토글 → 판정 배지 + 신뢰도 바 + 사진 하이라이트 동시 재계산** / 매크로 골격 = **레이어 인스펙터 히어로 → 에디토리얼 롱폼(넘버링 없음) → FAQ → 단일 풀쿼트 → CTA** (넘버드 섹션·고스트넘버·3분할·쿼트 그리드·스탯 스트립 전부 배제) / 다크 · `--font-display-mono`
- 파일: `page.tsx`(서버·metadata+조립) · `HeroSection.tsx`(클라이언트, 토글 상태 보유) · `InspectorDevice.tsx` · `InspectorFindings.tsx` · `ProductGrid.tsx` · `EditorialBlocks.tsx` · `FaqAccordion.tsx` · `PullQuote.tsx` · `ClosingCta.tsx` · `data.ts`

## 인터랙션 (4종)

| # | 조작 | 갱신 증거면 |
|---|---|---|
| 1 | 레이어 토글 칩 3개(`aria-pressed` 버튼) | 판정 배지(라벨+아이콘) + 신뢰도 바(폭+%) + 사진 하이라이트 박스(있는 레이어만) + 하단 finding 텍스트 — 실측: price 레이어 켜면 "Mostly verified"→"Fully verified" |
| 2 | FAQ 아코디언(다중 개방 허용, `aria-expanded`+`role=region`) | 실측: 클릭 시 `aria-expanded` false→true, 패널 `hidden` 해제 |
| 3 | 에디토리얼 3블록 스크롤 리빌(`framer-motion` `whileInView`, `once:true`) | opacity/translateY만 애니, `useReducedMotion` 시 애니 스킵하고 완성 상태로 즉시 렌더 |
| 4 | 매물 카드 hover/focus(카드 전체가 `<a>`, lift + 이미지 scale) | 상시 노출 스펙시트 위에 얹는 순수 부가 피드백(baseline은 인터랙션 없이도 완전) |

## 검증 (턴 예산 안에서 실제 실행)

- `dash-static-check.mjs`(`no-random`·`no-emoji`·`no-raw-img`·`no-next-image-unopt`·`no-unlisted-font`·`no-font-serif`·`no-next-font`·`no-random-image-host`·`no-dark-dim-text`) 전 파일 0 위반.
- `tsc --noEmit`, `eslint`(레포 flat config) 0 에러/경고. 렌더 웨이트 실측(클래스 grep) 3종(400/600/700).
- `next dev`(3100)에 실제로 라우트를 띄우고 Playwright로 1264/1280/1350/1366/1424/1440/1520/1584/1600/1904/1920/390 전 폭에서 `document.documentElement.scrollWidth === clientWidth` 확인, `pageerror`/`console.error` 0건.
- 1440×900, 390×900(게이트 스크린샷 프리셋과 동일 높이) 양쪽에서 히어로 폴드 스크린샷 실측 — 아래 "브리프에 없던 것 ②" 참조.
- 레이어 토글·FAQ 클릭을 Playwright로 실제 조작해 `aria-pressed`/`aria-expanded`/판정 라벨 텍스트 변화를 확인(주장이 아니라 실행 결과).
- 스크롤-스루 후 fullPage 스크린샷으로 에디토리얼 3블록의 `whileInView` 콘텐츠가 실제로 도달 가능함을 육안 확인(최초 캡처는 스크롤 이벤트 없이 찍어 `opacity:0` 잔존처럼 보였으나, 실제 스크롤 시 정상 노출 — 캡처 방법론 문제였지 코드 결함이 아니었음을 재현으로 구분).

## 브리프에 없던 것

1. **① 본문 컨테이너 폭을 얼마로 계산할 것인가.** ② `max-w-[58ch]`(에디토리얼 본문·FAQ 답변)로 정했다. text-base(16px)/leading-1.6 Pretendard 기준 58ch는 실측 62~68자 범위로 65~75자 상한에 여유 있게 못 미쳐 안전하다. ③ design-principles.md가 "고정값이 아니라 줄 길이가 정한다"고 명시하고 챔피언·v11이 46~62ch 구간을 실제로 쓰길래 그 구간 안에서 보수적으로 골랐다 — 상한 초과가 유일한 실패 방향이므로 여유를 크게 뒀다.
2. **① 390×900 첫 폴드에 "리치 스펙시트 카드 3~4장"과 "레이어 인스펙터 히어로"를 동시에 무스크롤로 넣는 방법.** ② 카드 4장을 2×2 그리드로 넣으면 실측 카드 1장이 351px(사진+스펙 4행)라 2행이면 700px+ 필요해 히어로와 공존 불가능했다. 대신 **모바일 전용 가로 스냅 캐러셀**(`overflow-x-auto snap-x`, lg 이상에선 4열 그리드로 전환)로 바꿔 카드 2장 전체 + 3번째 카드 가장자리가 스크롤 없이 보이게 했다(실측: 첫 카드 top 612~bottom 865, 뷰포트 900 안). ③ page-brief-core §4가 "로컬 가로 스크롤은 모바일 전용" 허용을 명시하길래(원래는 표 대상 조항이지만 원칙은 폭 제약 콘텐츠 일반에 적용된다고 해석) 그 여지를 매물 카드에도 썼다 — 전부 세로로 밀어넣어 2장만 보이거나 텍스트를 읽을 수 없을 만큼 압축하는 두 대안보다 낫다고 판단했다.
3. **① 히어로 검사 레이어의 finding 텍스트(각 레이어 1문단 설명)를 좁은 화면에서 어디에 둘 것인가.** ② 판정 배지·신뢰도 바(필수 최소 2증거면)는 모든 폭에서 유지하되, finding 텍스트(그 이상의 보너스 증거면)는 **모바일에서만 카드 다음 순서로 미뤘다**(`order-*` + 공유 상태를 부모로 끌어올린 `HeroSection`↔`InspectorFindings` 분리). ③ 필수 조건("증거면 2개 이상 동시 재계산")은 배지+바만으로 이미 충족되므로, 세 번째 보너스 증거면을 카드보다 뒤로 미루는 쪽이 "매물 카드가 폴드 안에" 규칙(§Landing 구조 기본형 1번, 더 명시적으로 강조된 규칙)과 덜 충돌한다고 판단했다.
4. **① 중첩 그리드 안의 모바일 전용 가로 스크롤 컨테이너가 페이지 레벨 `document.documentElement.scrollWidth`를 오염시키는 사례를 어떻게 다룰 것인가.** ② 실측(Playwright, 카드 개수를 2→3→4로 늘려가며 이분 탐색)으로 카드 3장 이상일 때만 `documentElement.scrollWidth`가 실제 뷰포트보다 커지는 현상을 재현했고, `overflow-x-auto` 컨테이너에 **`contain:layout`**(모바일 전용, `lg:[contain:none]`으로 데스크톱에선 해제)을 추가해 완전히 해소했다(수정 전후 12개 폭 전수 재측정으로 확인). ③ `no-*` 정적 규칙·페이지 브리프 어디에도 "중첩 그리드+가로 스크롤 조합엔 컨테인먼트가 필요할 수 있다"는 언급이 없어 스스로 이분 탐색으로 원인을 좁혀 고쳤다 — sweep 게이트의 `page-overflow` 판정이 `document.documentElement.scrollWidth`만 보고 지역 오버플로 컨테이너를 예외 처리하지 않기 때문에(§1 표), 이 패턴을 다시 쓰는 후보가 있다면 재현될 수 있는 일반적 함정으로 보인다.

## designer 자체 신고

턴 예산 안에서 `tsc`/`eslint`/`dash-static-check`/실제 `next dev` 렌더/Playwright 폭 스윕·인터랙션·스크린샷까지 전부 실행해 확인했다(위 "검증" 절 참조). Lighthouse a11y/perf 점수 자체는 게이트 실행 환경에서만 나와 이 세션에서는 재확인하지 못했다.
