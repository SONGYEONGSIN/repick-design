# Candidate c — 챔피언 정련 (baseline)

## 방향
현재 챔피언(2026-07-06-landing c → R2 a → R3 a → R4 c → R5 b로 이어진 다크 에디토리얼 계보)을 그대로 계승하고, 방향 전환 없이 디테일만 정련했다. R5까지 principle이 "수렴 도달"을 선언했으므로 이번 라운드는 회귀 여지가 있는 지점(타블렛 공백, 카피 중복, 트랜지션 타이밍 불일치, 스탯 정렬)만 좁게 손질했다.

## 참조
새 레퍼런스 참조 없음 — 현재 챔피언(`app/src/app/page.tsx`)과 `vault/00-principles/design-principles.md`를 유일한 기준으로 삼아 표면 정련만 수행(레퍼런스 재검토는 방향 전환에 해당하므로 생략).

## 핵심 결정
1. **카피 중복 제거**: 가치 섹션 서브카피가 카드1 설명과 "찜, 클릭, 구매 이력"을 그대로 반복하던 것을 "관심 표현부터 실제 구매, 판매자 신뢰도까지"로 재서술 — 의미는 유지하되 문구 재사용 제거.
2. **타블렛(768px) 구간 보강**: 기존엔 `lg:`(1024px) 이전까지 모든 그리드가 완전 스택되어 iPad류 폭(768~1023px)에서 밀도가 급격히 빈약해지는 지점이 있었다. Hero(eyebrow/h1/subhead+CTA/이미지 그리드), Value 3-split(2단+전체폭 스태거 예고), Proof(인용 7 : 스탯 5), CTA(번호 2 : 헤드라인 10)에 `md:` 컬럼 스팬을 추가해 태블릿에서도 비대칭 그리드가 조기 작동하도록 했다. 단, 초대형 헤드라인의 `clamp` 텍스트 스케일 전환점은 R5에서 승격된 오버플로 방지 요건이므로 `lg:` 그대로 보존(컬럼 배치와 텍스트 스케일 브레이크포인트를 분리).
3. **마이크로 인터랙션 일관성**: 산발적이던 `transition-colors`/`transition-opacity`에 전부 `duration-200`을 명시해 hover 타이밍을 통일. 히어로 미니 그리드 셀에도 `transition-colors duration-200`을 추가해 accent 셀 강조가 부드럽게 이어지도록 정리.
4. **스탯/캡션 정렬 미세조정**: 스탯 숫자에 `tabular-nums`를 추가해 "12,400+ / 98% / 4.8/5 / 32%" 자릿수 폭이 달라도 좌측 정렬 축이 흔들리지 않게 했고, 값-라벨 간격을 `mt-1`→`mt-2`로 살짝 넓혀 캡션 트래킹(0.12em)과의 시각적 리듬을 통일.

## Font Weight (3종, 원칙 준수)
- `font-extrabold` (800) — 헤드라인, ghost 넘버, 스탯 값
- `font-semibold` (600) — 서브헤딩(h3), nav 강조, 라운드 필 버튼
- `font-normal` (400) — 본문, 캡션, 눈썹(eyebrow 제외 — eyebrow는 semibold)

## 색상 Hex
| 역할 | 값 |
|---|---|
| bg | `#0B0B0F` |
| fg | `#FFFFFF` |
| muted | `#A1A1AA` |
| accent | `#6E56CF` |

방향 전환 없음 — dark 유지, accent 극소량(CTA·강조 단어·quote bar·hero grid 1셀), near-monochrome 위계.
