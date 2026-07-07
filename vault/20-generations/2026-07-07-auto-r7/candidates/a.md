---
run: 2026-07-07-auto-r7
variant: a
direction: 제품 프리뷰 섹션 리치화
---

## 방향
챔피언(R6 b 계보)의 "제품 프리뷰" 섹션만 surgical하게 강화. 구조·타이포·색 토큰은 design-principles.md 그대로 유지하고, 상품 카드의 설득력만 4가지 요소로 보강: ① 정적 카테고리 탭(전체/아우터/가구/전자기기/오디오, `role="tablist"` + `aria-selected`로 첫 항목만 활성 스타일) ② AI 매칭 근거 태그(찜/구매/클릭 이력 기반 매칭, 판매자 인증 점수 등 2개 칩 + 등급 배지) ③ before/after 가격에 할인율 배지(`{discount}%↓`, accent 보더+텍스트만, 채움 없음) 추가로 대비 강화 ④ 신뢰 배지("✓ 판매자 인증 완료" — 유니코드 체크마크, 외부 아이콘/이미지 없이 CSS-only) 카드 하단에 추가.

## 고른 참조
- 별도 외부 레퍼런스 참조 없음 — 기존 챔피언(`app/src/app/page.tsx`)과 `vault/00-principles/design-principles.md`의 누적 원칙(에디토리얼 밀도, accent 극소량, 3웨이트 제한)을 그대로 소스로 삼아 프리뷰 섹션만 확장.

## 핵심 결정
- 카테고리 탭은 실제 인터랙션 없는 정적 랜딩이므로 `<span role="tab">`으로 시각만 구현, 첫 항목(전체)에 `bg-white/10 border-white/20` 활성 스타일 부여.
- accent(#6E56CF)는 기존 사용처(매칭%, 헤드라인 강조어, quote bar)에 더해 할인율 배지·체크마크에만 추가 — 배지는 fill 없이 보더+텍스트로 근소하게 존재감만 부여해 "근소량 accent" 원칙 유지.
- 등급 배지(S/A/B)와 매칭 근거 칩은 border-white/10~15 + text-[#A1A1AA]로 near-mono 유지, 정보량만 늘리고 색 팔레트는 확장하지 않음.
- 폰트 웨이트는 기존과 동일하게 3종만 사용(추가 웨이트 도입 없음).

## 사용 font-weight
- font-normal (400) — 본문, 캡션, 태그, 배지 텍스트
- font-semibold (600) — 라벨, 상품명, CTA, 탭 텍스트, 등급 배지, 할인율 배지
- font-extrabold (800) — 헤드라인, 가격, 통계 수치, ghost 넘버

## 색 hex
- 배경: #0B0B0F
- 전경: #FFFFFF
- 뮤트: #A1A1AA
- accent: #6E56CF (기존 용도 + 할인율 배지 보더/텍스트, 체크마크 글리프)
