# /gallery 시스템 정합 재설계 — 설계

- 날짜: 2026-07-19
- 상태: 사용자 승인 완료 (구현 계획 수립 전)
- 선행: `2026-07-17-gallery-hub-design.md`(전작 도록 /gallery) + `2026-07-19-assets-rich-interaction-design.md`(에셋·인터랙션 상향). 갤러리를 새로 세운 시스템 기준(에셋·정제 인터랙션·이미지 하드게이트·a11y)에 정합시키고, 자율 루프 후보를 승자/탈락/대기로 실무 구분한다.

## 1. 목표

`/gallery`가 ① 새 시스템 기준을 스스로 체현(에셋 활용·정제된 인터랙션·시스템 하드게이트 통과 = 도그푸딩)하고 ② Ⅳ 자율 루프 후보 탭에 승패 상태(승자 배지·라운드 그룹핑)를 주입한다. 도록(전시 카탈로그) 미학은 유지 — dash와 같은 서비스급 절제선.

## 2. 확정된 결정

| 결정 | 선택 |
|---|---|
| 변경 범위 | 갤러리 자체를 시스템 기준으로 재설계 (Ⅳ 탭 + 표지 마크 + 게이트 정합) |
| 미학 수위 | 도록 절제 + 정제된 인터랙션 (dash-like restraint, landing식 표현 아님) |
| 상태 깊이 | 승자 배지 + 라운드 그룹핑 (judge 근거·DECISION 파싱은 비범위) |

## 3. 데이터 계층 — evolve 탭에 승패 주입

- `page.tsx`의 `evolveWorks()`가 fs 스캔에 더해 **`vault/30-ledger/auto-ledger.jsonl`을 읽어** 각 후보에 status를 부착.
- **status 판정**:
  - `winner` — 해당 라운드 ledger entry의 `winner` variant.
  - `dropped` — 승자가 있는 라운드(`no_winner=false`)의 비승자 variant.
  - `pending` — no-winner 라운드(`no_winner=true`)의 후보, 또는 ledger에 아직 entry 없는 라운드의 후보.
- **round 매칭**: 후보 경로 `<target>-evolve/r<N>/<v>` ↔ ledger `round: "auto-<target>-r<N>"`. 레거시 entry(구 `auto-dash-r*`, target 필드 없음)는 round id에서 target·번호 유추(확립된 규칙).
- `Work` 타입에 optional `status?: "winner"|"dropped"|"pending"`, `round?: string`, `target?: "dash"|"landing"` 추가. ledger 파일 부재 시(main 등) evolve 탭 자체가 없으므로 status 로직 미실행 — 기존 3탭 유지.

## 4. UI — 도록 절제 + 정제 인터랙션

### 4.1 Ⅳ 탭 라운드 그룹핑
- 후보를 라운드별 그룹으로 묶어 렌더: 그룹 헤더 = `DASH R7 · 2026-07-19` (타깃·번호·날짜, tabular). 그룹 내 후보 카드 나열.
- 그룹 정렬: 타깃별·번호 숫자순(기존 evolveWorks의 숫자 정렬 계승).

### 4.2 status 배지 (work-card)
- `winner` — 잉크 채움 배지 "채택"(zinc-900 배경·white).
- `dropped` — 헤어라인 배지 "탈락"(zinc-200 보더·zinc-500).
- `pending` — 점선/연한 배지 "심사 대기".
- Ⅰ~Ⅲ 탭 카드는 status 없음(배지 미표시) — 기존과 동일.

### 4.3 정제된 인터랙션 (도록 톤 — dash 절제선)
- ① **승자 필터 토글**: Ⅳ 탭 상단에 "전체 / 승자만" 세그먼트 컨트롤(role=group, 키보드). 클릭 시 dropped·pending 카드 숨김.
- ② 탭 전환 크로스페이드(기존 gallery-fade keyframe) 유지.
- ③ 카드 hover 캡션 확장(기존) 유지.
- ④ 키보드 내비(기존 tablist ←/→/Home/End) + 필터 세그먼트 접근성.
- framer-motion 남용 없이 CSS·기존 패턴 위주 — 연극적 연출 금지(도록·서비스급 절제).

### 4.4 생성형 SVG 표지 마크 (에셋 체현)
- 신규 `collection-mark.tsx`: 도록 표지 헤더에 **결정론적 생성형 SVG** 1점 — 카테고리별 작품 수를 나타내는 미니 도트/막대 스트립(레지스트리 배열 길이에서 산출, 난수 없음, 삼각함수 좌표 소수 2자리). 외부 파일 0. "에셋 적극 활용"을 도록 절제에 맞게 체현.

## 5. 시스템 게이트 도그푸딩 (핵심)

재설계된 갤러리 자체가 우리가 만든 하드게이트를 통과해야 한다 — 이것이 "시스템 체계에 맞춘다"의 실질:
- `dash-static-check`(이미지 규칙 3종 포함) → 갤러리 파일 위반 0. 갤러리가 이미지를 쓰면 next/image·alt·비-unoptimized 준수(현재 iframe 미리보기라 이미지 규칙 대상 없을 수 있음 — 그래도 게이트는 통과해야).
- `dash-sweep --routes /gallery` → 390~1920 전 폭 오버플로 0.
- Lighthouse a11y ≥95.
- `wiki-lint` 무관(코드 변경).

## 6. 파일

| 파일 | 변경 |
|---|---|
| `app/src/lib/works.ts` | `Work`에 `status`·`round`·`target` optional 필드 추가 |
| `app/src/app/gallery/page.tsx` | evolveWorks가 auto-ledger 읽어 status 부착 |
| `app/src/app/gallery/gallery-client.tsx` | Ⅳ 탭 라운드 그룹핑 + 승자 필터 토글 세그먼트 |
| `app/src/app/gallery/work-card.tsx` | status 배지 |
| `app/src/app/gallery/collection-mark.tsx` (신규) | 생성형 SVG 표지 마크 |

## 7. 검증

1. `node scripts/dash-static-check.mjs app/src/app/gallery/*.tsx app/src/lib/works.ts` → `[]` (이미지 규칙 포함).
2. `node scripts/dash-sweep.mjs --base http://localhost:3100 --routes /gallery` → pass (전 폭 오버플로 0).
3. `cd app && npx next build` 통과.
4. Lighthouse `/gallery` a11y ≥95.
5. **evolve/dash 체크아웃 실측**: Ⅳ 탭에 라운드 그룹(DASH R1~R7·LANDING R1~R2) + 승자 카드 배지 "채택" + 탈락 카드 "탈락" + 승자 필터 토글 동작. ledger 승자와 배지 일치 대조.
6. **main(프로덕션) 회귀**: evolve 디렉토리·ledger 부재 → Ⅳ 탭 미노출, 기존 3탭 정상, `/dash`·`/free` 카드 수 불변.

## 8. 비범위

- judge 렌즈별 투표·DECISION.md 요약·하드게이트 점수 표기(승자/탈락/대기 배지까지만).
- Ⅰ~Ⅲ 탭(랜딩·대시·자유 창작)의 시각 재설계 — evolve 탭 + 표지 마크 + 게이트 정합만.
- 챔피언(`/`) 자동 교체.
- 갤러리를 진화 루프의 타깃으로 편입(자율 생성 대상 아님 — 인덱스 유지).
