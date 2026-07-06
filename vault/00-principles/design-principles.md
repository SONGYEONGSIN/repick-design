# Design Principles — repick 랜딩 (v0)

> 이 문서가 "현재의 우리 디자인 DNA"다. LEARN 단계가 여기를 surgical하게 갱신한다.

## Voice / Tone
- 한 줄로: 신뢰감 있는 미니멀 — 과장 없이 정보 위계로 승부
- 방향성(1회차 C 승리): **에디토리얼 타이포 위계 우선** — 색은 near-monochrome(무채색 위계 + accent 극소량)로 절제하고, 크기·굵기·자간으로 리듬을 만든다. 그라데이션 장식보다 타이포 스케일 대비로 임팩트를 낸다.

## Color Tokens
| 역할 | 값 |
|---|---|
| bg | #0B0B0F |
| fg | #FFFFFF |
| muted | #A1A1AA |
| accent | #6E56CF |

## Typography
- 헤딩: Inter / 700 / letter-spacing -0.02em
- 본문: Inter / 400 / line-height 1.6

## Spacing
- 섹션 상하 패딩 최소 96px (데스크톱)
- 컨텐츠 최대폭 1120px

## Landing 구조 기본형
1. Hero (헤드라인 + 서브 + 단일 CTA)
2. 가치 3분할
3. 소셜프루프
4. 마무리 CTA

## 금지 (anti-slop)
- 의미 없는 그라데이션 남발 X
- 3개 초과 폰트 웨이트 X
  - ⚠️ 다음 회차 정리 대상(1회차): 승자 C가 4종(light/400/semibold/bold) 사용. 타이포 위계는 살리되 웨이트는 3종으로 좁혀 재현할 것 — "타이포 위계 우선 ≠ 웨이트 남발".
