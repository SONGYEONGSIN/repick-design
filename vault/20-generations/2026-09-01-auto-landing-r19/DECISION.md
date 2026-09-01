# auto-landing-r19 — DECISION

타깃: landing · 라운드: 19 · 날짜: 2026-09-01 · 큐 결정: PAGE_TYPES 미채움 0건 → dash/landing/native 균등 난수 → landing.

## 후보

- **a — Editorial Data-Room ("The Case File")**: 단일 실 리스팅(1972 Eames Lounge Chair)을 감사/실사 도시에로 프레이밍, Inspection Rigor × Comparables Window 이산 컨트롤이 `deriveVerdict()` 순수함수로 confidence/price/discount/checks/turnaround를 전부 재파생. **§3 하드게이트 재실패로 탈락**(아래).
- **b — Reverse Auction Ledger** (승자): 가격/속도/신뢰 3축 가중 슬라이더가 6개 경쟁 셀러 오퍼를 실시간 재정렬하는 라이브 오더북 테이블. 순위변동을 아이콘+텍스트 델타칩으로 표시(`framer-motion layout`), 클로징 CTA가 동일 `rankOffers()` 파생값을 재인용.
- **c — Handoff Timeline**: 셀러 제출→AI 감정→검증→구매자 매칭 4단 체인오브커스터디 타임라인(WAI-ARIA tablist, 화살표 키 이동)에서 스테이지 선택이 `cumulativeTrustScore()`로 신뢰점수를 재파생, 클로징 CTA가 동일 값 인용.

## §3 하드게이트

소스 동결 해시(§2 종료, 1-fix 전): `1e1412782869b372bd3ce4bab32e5357ec555055`

- **a**: 1차 FAIL 19건(no-unlisted-font 8·sweep table-overflow 5·focus 3·a11y 93+color-contrast+target-size). 1-fix 적용(폰트 리터럴 인라인화·min-w 제거·dot버튼 히트타깃 확대·표면별 muted 분기) → 재게이트 **FAIL 9건**: table-overflow 4건 **재발**(1264/1280/1350px, 위치 동일) + 390px cell-overlap 신규 4건("Confidence"↔"Recommended price" 21px, 인스펙션 등급행 3건 각 5px — table-fixed 전환의 부작용). a11y는 100으로 해소됐으나 sweep 재실패로 **§3 규칙("재실패 시 탈락")에 따라 탈락**. judge 패널 미진입.
- **b**: 1차 FAIL 1건(lint `react-hooks/refs`, `Ledger.tsx:165` — `useMemo` 콜백 내 ref 읽기). 1-fix로 React 공식 "adjust state during render" 패턴으로 교체(ref 제거) → 재게이트 **PASS**(a11y 100 · sweep 0 · focus 0건 누락 · perf 63 기록만).
- **c**: 1차 **PASS**(1-fix 불요, a11y 100 · perf 69 기록만).

상세: SCORES.md.

## §4 JUDGE — 3:0 만장일치

| 렌즈 | 1위 | 2위 |
|---|---|---|
| 렌즈1(정본 준수) | b | c |
| 렌즈2(상용 완성도) | b | c |
| 렌즈3(아키타입 차별성) | b | c |

**승자: b.** 세 렌즈 모두 근소한 차이로 b를 1위로 판정 — 완전 압도가 아니라 여러 소축이 누적된 결과.

- **렌즈1**: 히어로 내 zero-scroll 증명 카드는 양쪽 다 통과(b: `Hero.tsx:41` `&lt;Ledger&gt;`가 히어로 그리드 내부 · c: `Hero.tsx:66-160` 동일 그리드 내부). c가 discount 라벨을 카드에 더 명시적으로 병기(`Hero.tsx:105-110`)해 문자 그대로는 근소 우위였으나, b는 실가격 6건이 실시간으로 재정렬되는 훨씬 풍부한 라이브 데이터셋으로 상쇄. anti-slop: b는 그라디언트 0건, c는 사진 캡션 스크림용 그라디언트 1건(기능적 사용, 하드페일 아님이나 인용). 조작→CTA 결속은 양쪽 다 실제 파생값 재인용으로 확인(`b/ClosingCTA.tsx:13` · `c/ClosingCTA.tsx:34-37`).
- **렌즈2**: b의 메커니즘이 더 깊음 — 3축 연속 가중평균이 6개 경쟁 로우를 실시간 재정렬(`scoring.ts:28-50`)하는 반면 c의 `cumulativeTrustScore`는 고정 4단계 룩업(`data.ts:25-106`)에 가까움. b는 중간 섹션(`ValueSection.tsx:49-50,66-67`)도 동일 라이브 데이터로 신규 정보(축별 리더)를 재계산해 스크롤 서사를 만드는 반면 c의 `ValueSplit` 3열은 스테이지 선택과 무관하게 정적. b에는 SiteHeader(로고+CTA)가 있으나 c에는 전무 — Stripe/Linear급 완성도 기준에서 감점. c는 실사진(next/image, 고정 Unsplash ID)을 쓰는 반면 b는 전부 아이콘 플레이스홀더(`PhotoTile.tsx`) — 이 축만 c 우위. 모바일에서도 b가 zero-scroll에 더 가깝게 증명카드를 보여줌(`b-390.png`) 반면 c는 스테이지 아이콘 레일만 보이고 증명카드는 더 아래(하드룰 위반은 아니나 폴리시 격차로 인용).
- **렌즈3**: 두 후보 모두 카탈로그 대비 (입력축×출력축) 조합이 겹치지 않아 신규이나, b가 더 명확한 신규성 — "연속 가중 슬라이더 → N행 라이브 재정렬 테이블(애니메이션 순위 델타)"은 r18/c(슬라이더→단일 다이얼)·r17/a·r18/b(반경+지도, 소진된 계열)와 명확히 다른 출력 형태. c의 "이산 순서형 단일선택 스크러버 → 재파생 검증점수"는 r17/b(독립 토글→게이트체인 판정)와 브리프가 지목한 "이산 입력→재계산 판정" 대분류를 공유 — 순서형/단일선택(고정 이력 스크러빙) vs 독립/다중선택(조합적 what-if)이라는 실질적 입력축 차이는 있으나 "더 근소한 판단"으로 명시.

세 렌즈가 모두 독립적으로 b를 1위로 뒀고 상충하는 근거가 없어 tie-break 불요.

## §3-1 판정 후 수정
불요 — b는 규칙 위반 없이 게이트를 통과했다(1-fix에서 이미 lint만 해소).

## §5 LEARN
아래 delta 1건을 `landing-deltas-provisional.jsonl`에 L1 provisional로 적재(상세는 해당 파일). 핵심 주장: (a) 출력 형태(단일 스칼라 vs N행 라이브 재정렬 리스트)는 입력 메커니즘과 별개의 신규성 판정 축이다(r18/c 다이얼과 r19/b 재정렬테이블은 같은 "슬라이더" 입력이지만 다른 출력형이라 둘 다 유효 신규) (b) 이산 순서형 단일선택(고정 이력 스크러버) vs 독립 다중선택(조합적 토글)이 서로 다른 입력축일 수 있다는 관측 — 렌즈3이 "더 근소한 판단"으로 명시했으므로 후자는 2라운드 재현 전까지 L1 유지.

## §6 지식 정제 게이트
- 클러스터링: 이번 delta는 재현 주장("r<N> 델타를 확장한다"·"같은 결함이다")을 포함하지 않는다 — 첫 관측이므로 검증 대상 없음.
- 레벨 재책정: 기계 검증 불가(아키타입 분류는 판단 사안)이고 2라운드 이상 재현되지 않았으므로 **L1 유지**(승격 없음).
- 충돌 쌍: 없음 — 3렌즈 만장일치, 다른 delta와 상충하는 주장 없음.
- 질문 강제 생성 조건(①충돌 쌍 ②meta-기준으로 정당화 불가) 둘 다 미해당 — 이번 라운드는 `questions-queue.md`에 신규 항목을 추가하지 않는다. delta 본문의 "이산 단일선택 vs 다중선택" 관측은 질문이 아니라 다음 라운드가 재현을 확인할 관찰로 delta 자체에 남겨 둔다(위 §5).

## 환경 고유 조치(스킬 밖)
- `npx playwright install chromium --with-deps`가 프록시에서 차단된 무관 PPA(`ppa.launchpadcontent.net`) 때문에 실패 → `npx playwright install chromium`(deps 없이)도 CDN(`cdn.playwright.dev`) 차단으로 실패. 세션에 사전설치된 `/opt/pw-browsers/chromium`(rev 1194, `playwright-core` 요구 rev 1228와 불일치)을 `PW_CHROMIUM_PATH`/`CHROME_PATH`/`PW_NO_SANDBOX=1`로 재지정 — r9~r24 등 다수 선례와 동일 계열 조치, `gate.mjs`/`dash-sweep.mjs`/`capture-shots.mjs` 자체는 무수정.
- dev 서버는 이 라운드가 직접 기동(포트 3100, Next.js 16.2.10 Turbopack) — 정상 기동, `.next` 캐시 손상 재기동 불요.

## no-winner 여부
아니오 — 3:0 만장일치로 b 승격.
