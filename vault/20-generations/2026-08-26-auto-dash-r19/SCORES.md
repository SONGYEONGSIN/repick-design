# SCORES — auto-dash-r19

후보: a=Corridor(캘린더/보드, 워크플레이스 예약) · b=Cadence(로드맵/간트, 생산라인 스케줄) · c=Threshold(히어로 단일지표+보조지표, 지원 SLA)
소스 해시(freeze, GENERATE 종료 시점): `20e422b377b3b14565afdd8eb4836571d5a37c20`

## 하드게이트 1차 (`node scripts/gate.mjs --target web --routes /dash-evolve/r19/<v>`, 후보별 개별 실행)

| 후보 | route | types | static | lint | weights | sweep | focus | console | a11y | perf |
|---|---|---|---|---|---|---|---|---|---|---|
| a | ✅ | ❌ TS2459×3, TS2345×1 | ✅ | ❌ react-hooks/immutability | ✅ 3종 | ✅ | ❌ 38건 누락 | ✅ | ❌ 96 (color-contrast) | ✅ 51 |
| b | ✅ | ✅ | ✅ | ❌ no-unused-vars | ✅ 3종 | ✅ | ✅ | ✅ | ❌ 96 (color-contrast) | ✅ 54 |
| c | ✅ | ✅ | ✅ | ✅ | ✅ 3종 | ✅ | ✅ | ✅ | ✅ 100 | ✅ 60 |

c는 1차부터 10/10 통과. a·b는 1-fix 대상.

## 1-fix (각 designer에 위반 상세 전달, 1회 수정)
- **a**: `data.ts`에 `BookingStatus` export 누락 → export 추가. `Sidebar.tsx` useState 유니온 타입 미지정 → 명시. `CommandPalette.tsx` 렌더 중 `flatIndex` 재할당 → `useMemo` 룩업으로 대체. 공유 `FOCUS` 토큰의 `outline-none`이 뒤의 `focus-visible:outline`을 취소(page-brief-core §2 죽은 관용구) → `outline-none` 제거.
- **b**: `CommandPalette.tsx`의 미사용 `SURFACE_INSET` import 제거. `TEXT_AUX`(zinc-500)가 `SURFACE_INSET` 틴트 배경 위에서 4.52:1로 하한(4.5) 근접 미달 → `TEXT_MUTED`(zinc-600, 7.25:1)로 교체(6개 파일). 다크테마에서 복붙된 `placeholder:text-zinc-400`(순백에서 2.6:1)도 함께 발견해 수정.

## 하드게이트 2차 (1-fix 후 재게이트)

| 후보 | 결과 |
|---|---|
| a | ❌ **재실패** — types/lint/focus/weights 등은 전부 해소됐으나 **a11y color-contrast 하드페일이 재발**(96점, 실패 감사 동일). 1-fix 기회 소진 → **탈락**. |
| b | ✅ **10/10 통과** — 생존. |
| c | (1차부터 통과, 재게이트 불요) |

## 결론
생존 후보: **b, c** (2개) → §4 JUDGE는 2개 후보로 진행. a는 탈락하되 route는 유지(주간 반증에서 일괄 드롭 — 스킬 §no-winner 처리 규약과 동일하게 산출물 보존).
