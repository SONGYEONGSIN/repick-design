# Candidate C — "Delivery Grid Pick" (r58, dark / violet / mono-or-none)

**한 줄 컨셉**: 배송 속도 3종 × 보험 2종, 정확히 6칸짜리 그리드에서 셀 하나를 클릭하면 그 조합의 총액·도착일·"지금 선택 기준으로 가장 가까운 대안 2개"가 즉시 재계산되는 단일 클릭 조회형 디바이스.

## 파일 구성

```
app/src/app/landing-evolve/r58/c/
├── page.tsx                      # Metadata + Page (서버 컴포넌트)
├── Client.tsx                    # "use client" — 유일한 상태(speed, insurance) 보유
├── lib/delivery.ts                # 순수 데이터 + 공유 파생 함수 (deriveCombo, nearestByCost ...)
└── components/
    ├── TopBar.tsx                 # 워드마크만, 44px 이하
    ├── Hero.tsx                   # 헤드라인 + 디바이스 + 4개 proof 배지, 전부 이 트리 안
    ├── DeliveryGrid.tsx           # 디바이스 본체 (3×2 그리드 + readout + 비교 스트립)
    ├── ProofBadges.tsx            # match% / 컨디션 / 인증 / 할인 4종 배지
    ├── ProductPreview.tsx         # 리치 카드 4개 + "Why this match" 토글
    ├── ValueSplit.tsx             # Value, three ways — 스크롤 리빌
    ├── SocialProof.tsx            # dl 통계 + 인용 3개
    └── ClosingCTA.tsx             # 동일 combo 재인용 + 이메일 폼
```

## 디바이스: Delivery Grid Pick

- `SPEEDS`(Standard/Express/Overnight) × `INSURANCE`(Basic/Full Coverage) = 정확히 6칸.
- 클릭 한 번이 "속도+보험" 조합 전체를 한 번에 선택한다 (행→열 2단계가 아님).
- 공유 파생 함수 하나(`deriveCombo(speed, insurance)`)가 바뀌는 모든 숫자의 유일한 출처:
  - `shippingCost` — 6칸 고정 테이블에서 조회
  - `totalCost` = `ITEM.price + shippingCost`
  - `deliveryWindow` — 속도에서 파생
- `nearestByCost(selectedKey, 2)`가 **선택된 셀을 기준으로** 나머지 5칸을 "총액 차이의 절댓값"으로 재정렬해 가장 가까운 2개를 반환한다. 정적 랭킹 테이블이 아니라 선택이 바뀔 때마다 다시 계산되는 구조 — 예를 들어 Overnight+Full을 고르면 이웃이 Overnight+Basic / Express+Full이 되지만, Standard+Basic을 고르면 이웃이 완전히 달라진다.
- 이 결과는 Hero의 readout, Hero 안의 "Next-best by cost" 스트립, Product Preview 1번 카드의 "Your shipping" 한 줄, Closing CTA 헤드라인 — 네 군데에서 모두 **같은 `combo` 객체**를 인용한다. 재입력된 숫자는 없다.
- 기본값은 `express` + `full`(비어 있지 않은 "대표값") — 리셋에 해당하는 동작이 이 페이지에는 없지만, 상수로 고정돼 있어 재마운트돼도 항상 같은 비어있지 않은 조합으로 시작한다.

## Hero-fold 체크 대응

1. **문서 순서** — `Hero.tsx`의 JSX 순서는 그대로 모바일 1컬럼 스택 순서다: 헤드라인 블록(eyebrow+h1+subhead+CTA+4배지) → 디바이스. `order-*`를 전혀 쓰지 않았다.
2. **카드 이미지가 세로 예산을 먹는 문제** — Hero에는 제품 사진을 전혀 넣지 않았다. match%/컨디션/인증/할인 4배지는 텍스트+아이콘 pill이고, 사진은 Product Preview 섹션에만 있다. 그래서 이 실패모드 자체가 Hero에는 적용되지 않는다.
3. **양방향 트레이드오프** — 디바이스를 헤드라인보다 앞세우지 않았다(데스크톱은 12-col 그리드의 컬럼 배치만 다르고 DOM 순서는 모바일과 동일).
4. **초기 상태가 0이 아님** — 기본 선택이 Express+Full이라 최초 렌더에서도 바로 `$153.00` 총액과 도착일이 보인다.

390px 기준 대략적 수직 예산(러프 추정, 실측 아님): TopBar 40 + eyebrow 24 + h1(2줄) 90 + subhead(2줄) 64 + CTA 64 + 디바이스 카드(그리드+readout+비교 스트립) 약 340 + 배지 2줄 62 ≈ 680–750px. 900px 기준 여유 150px 이상.

## Causal consistency 점검

- Hero readout, 비교 스트립의 "Your pick" 칩, Product Preview 1번 카드의 "Your shipping" 줄, Closing CTA 헤드라인 — 전부 `Client.tsx`에서 한 번 계산한 `combo`를 props로 받아 그대로 출력한다. 하드코딩된 숫자 리터럴 없음.
- Closing CTA가 Product Preview(`#preview`)로 링크하지만, 그 섹션에 "라이브 카운트"를 인용하지는 않는다 — 예를 들어 "지금 이 조합으로 배송되는 상품 12개" 같은 문구를 걸지 않았다. Product Preview 자체 카드들(2~4번)은 디바이스 상태와 무관한 자기 완결적 리스팅이라서, 그 섹션을 "같은 라이브 상태로 필터링"해야 하는 의무가 생기지 않는다.
- "Cheapest overall" 캡션(그리드 하단)은 선택과 무관하게 전체 6칸 중 최저가를 가리키는 정적 사실이지만, 그래도 하드타이핑하지 않고 `cheapest Combo()` 호출로 계산했다.

## 인터랙션 4종

1. Delivery Grid 셀 클릭 (디바이스 본체)
2. Product Preview 카드의 "Why this match" 펼치기/접기 (제품 인터랙션)
3. Value/Social Proof의 스크롤 유입 리빌 (`whileInView`, `viewport.once`)
4. Closing CTA의 이메일 알림 폼 (유효성 피드백 포함)

---

## 브리프에 없던 것

1. **악센트 보라색 색상 수치 (필수 계산)**
   - 배경 `#0B0B0F` 대비 `violet-500 #8B5CF6`: 상대휘도 L_bg≈0.00345, L_accent≈0.1982 → **대비비 ≈ 4.64:1**. 3:1은 물론이고 일반 텍스트 AA(4.5:1)에도 거의 걸리는 수준이라, 작은 텍스트에는 쓰지 않고 아이콘·라벨 색상(예: 배지 아이콘, eyebrow 라벨)에만 사용했다.
   - 포커스 링/작은 텍스트용 라이트 틴트 `violet-300 #C4B5FD`: L≈0.5188 → **대비비 ≈ 10.64:1** (목표 4.5:1 초과 달성). 포커스 아웃라인(`focus-visible:outline-violet-300`)과 비교 스트립의 "Your pick" 라벨에 사용.
   - 버튼/칩 채우기 위 텍스트: 브리프 지침대로 **흰색**을 썼다. 채우기 색은 `violet-600 #7C3AED` (L≈0.1344) → 흰 텍스트 대비 **≈ 5.69:1** (AA 통과, 거의 AAA에 근접). 호버 상태는 `violet-500`(흰 텍스트 대비 4.23:1, 작은 bold 텍스트 기준 AA 미달)이 아니라 더 어두운 `violet-700 #6D28D9`(L≈0.0979, 흰 텍스트 대비 **≈ 7.10:1**)로 바꿔서 호버 시에도 AA를 유지했다. 다크 잉크는 이 채우기 위에 전혀 쓰지 않았다(브리프가 요구한 대로 흰색만 사용).
   - Decision: Tailwind 기본 팔레트의 violet-300/500/600/700을 그대로 쓰고, 기본 악센트 `#6E56CF`는 전혀 사용하지 않음. 근거: 계산값이 모두 기준을 충족하고, "Tailwind violet-family"라는 지침을 가장 직접적으로 만족.

2. **본문 줄 길이 계산 (필수 계산)**
   - 공식: `chars-per-line = container-px ÷ (0.44 × font-size-px)`.
   - 모든 본문 단락에 `max-w-[30rem]`(480px) + `text-base`(16px)를 적용: `480 ÷ (0.44 × 16) = 480 ÷ 7.04 ≈ 68.2자` — 목표 70에 가깝고 75 미만.
   - 섹션 헤딩 옆의 보조 설명문(ValueSplit 컬럼 바디, SocialProof 인용문 등)도 동일하게 `max-w-[30rem] text-base`로 통일해서 같은 68.2자 계산이 전부 적용되도록 했다.

3. **배송 속도/보험/비용 수치** — 브리프가 "예시로 Standard/Express/Overnight, Basic/Full Coverage"만 제시하고 실제 요금·배송일은 지정하지 않았으므로 직접 정했다: Standard $4.50/$7.00, Express $8.50/$11.00, Overnight $16.00/$19.50 (속도가 오를수록, 보험을 올릴수록 요금이 오르는 단조증가 구조로 설계해 "다음으로 저렴한 대안" 비교가 직관적으로 읽히게 했다). 배송일: 5–7일 / 2–3일 / 익일.

4. **"상품"과 가격/할인 데이터** — 브리프가 요구한 match%/컨디션 그레이드/인증/할인 배지를 채우기 위해 가상의 리세일 상품 4종(피코트/데님 재킷/캐시미어 스웨터/크로스바디백)과 가격·정가·매치율·그레이드·판매자 통계를 직접 만들어 `lib/delivery.ts`의 `LISTINGS`에 고정값으로 넣었다. 전부 결정론적 상수이며 `Math.random`/`Date`는 쓰지 않음.

5. **"다음으로 저렴한" 정의** — 브리프가 "2개의 next-best 대안을 비용 기준으로"라고만 했지 정확한 정렬 기준을 주지 않아서, "선택된 셀과의 총액 차이 절댓값이 가장 작은 2개"로 해석했다(최저가 2개가 아니라 선택 지점에서 가장 가까운 이웃). 근거: 브리프의 "선택에 따라 동적으로 달라져야 한다"는 요구를 가장 강하게 만족하는 해석이고, 단순 "전체 최저가 2개"는 선택을 바꿔도 거의 안 바뀌는 경우가 많아 "동적 재계산"이라는 요구를 약하게 충족하기 때문.

6. **이미지 소스** — Unsplash의 `images.unsplash.com/photo-<id>` 고정 ID 4개(의류/가방 사진)를 직접 골라 썼다. 랜덤 서비스가 아니라 특정 ID를 고정 지정한 것이며, `next.config.ts`에 이미 `images.unsplash.com`이 허용 도메인으로 등록되어 있어 별도 설정 변경은 하지 않았다.

7. **글꼴 두께 3종 확정** — 브리프는 "정확히 3종"만 요구해서, 400(본문 기본, 명시적 클래스 없이 떨어지는 기본값)·600(`font-semibold`, 라벨/버튼/배지)·800(`font-extrabold`, 모든 헤딩)으로 직접 배분했다. 500/700은 전혀 쓰지 않았다(그리드 비교 스트립의 델타 텍스트에만 `font-normal`을 명시적으로 걸어 400을 확정시켰다).

8. **브랜드명 "RELOOP"** — 브리프에 브랜드명이 없어 리세일 마켓플레이스 느낌의 중립적인 가상 이름을 만들었다. 실제 서비스명을 사칭하지 않기 위한 placeholder.

9. **포커스 아웃라인 색/두께** — 브리프는 "실제로 보이는 outline이어야 한다"는 제약만 두고 구체 값은 안 줘서, `outline-2 outline-offset-2 outline-violet-300`(위 계산대로 10.64:1)으로 직접 정했다. `ring-2`/`ring-offset`나 `outline-none`은 전혀 쓰지 않음(Tailwind v4에서 투명 렌더/자기상쇄 위험이 있다는 지침을 따름).
