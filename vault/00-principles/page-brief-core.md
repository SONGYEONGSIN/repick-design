---
tags: [principles, brief]
---

# 페이지 브리프 공통 코어 — 모든 페이지 타입에 적용

> 페이지 타입(대시보드·랜딩·로그인·404·카탈로그…)과 무관하게 **전 후보에 강제되는 규칙**.
> 타입별 판단 기준(컴포넌트 체크리스트·인터랙션 최소 수·아키타입 목록·페이지 구조)은 각 타입 프로파일에 둔다.
> 소비자: [[dash-brief-v3]](dashboard·settings 프로파일) · [[design-principles]](landing 프로파일) · 이후 추가되는 타입 프로파일.
>
> **복사 금지** — 프로파일은 이 문서를 `[[page-brief-core]]`로 참조만 하고 내용을 옮겨 적지 않는다([[curation-criteria]] 조직 원칙).

## 1. 언어

- **카피 언어: 영문 전용** — 모든 UI 텍스트·헤딩·브랜드·라벨·더미 데이터는 영어. 한글·혼합 금지(글로벌 벤치마크 정합). 한 페이지 내 한/영 혼용은 그 자체로 결함이다.

## 2. 기계 검증되는 규칙 (`scripts/gate.mjs --target web`)

아래는 판단이 아니라 **게이트가 기계로 잡는다**. 후보가 여기서 걸리면 judge 단계에 가지 못한다.

| 규칙 | 검사 주체 | 실패 시 |
|---|---|---|
| `Math.random(` · `Date.now(` · `new Date()` 금지 (결정론 데이터·하이드레이션) | static `no-random` | 하드페일 |
| 원시 `<img>` 금지 → `next/image` | static `no-raw-img` | 하드페일 |
| `unoptimized` 금지 (LCP·CLS 이점 상실) | static `no-next-image-unopt` | 하드페일 |
| 이모지 금지 → lucide-react 아이콘 | static `no-emoji` | 하드페일 |
| `next/font` 추가 import 금지 (Pretendard 전역 단일) | static `no-next-font` | 하드페일 |
| 세리프·장식 폰트(`font-serif`) 금지 | static `no-font-serif` | 하드페일 |
| 전 폭 페이지·테이블 오버플로 0 (1280/1440/1920 + 모바일 390) | sweep | 하드페일 |
| Lighthouse 접근성 **95 이상** | a11y | 하드페일 |
| Lighthouse 성능 | perf | 기록만(탈락 미적용) |

## 3. 접근성·견고성 (judge 렌즈1이 대조)

- 단일 `h1`, 헤딩 레벨 스킵 금지, 시맨틱 테이블(`caption`/`scope`/`aria-sort`)
- 포커스 가시(`outline-none` 단독 금지 — 반드시 `focus-visible` 링과 함께)
- 대비 AA, **색만으로 의미 전달 금지**(색 + 텍스트/아이콘 병행)
- 키보드 전 경로 도달, `prefers-reduced-motion` 게이팅(진입 `opacity:0` 잔존 금지)
- **상태 분기 대비** — 정적·Lighthouse 게이트는 기본 렌더 뷰만 스캔한다. 필터·토글로만 도달하는 보조 상태의 텍스트도 대비 규칙을 동일 적용한다. 하한은 **표면 톤 조건부**다: 다크 보조텍스트 zinc-400 미만 금지 · 라이트는 **순백/거의 순백(zinc-50 이하) 표면에서 zinc-500 하한, muted 톤 표면(zinc-100 이상 — 세그먼트·탭 트랙·필 등)에서 zinc-600 하한**. zinc-500은 순백 위에서만 안전한 값이다(실측: `neutral-500` on `neutral-100` = 4.34:1로 하드게이트 미달 → `neutral-600` 7.18:1). 근거는 [[curation-criteria]] "Q10 판정".
- **sr-only 앵커** — `position:absolute` 기반 sr-only가 `overflow-x-auto` 클리핑 컨테이너(가로 스크롤 테이블, 그 `<td>` 셀 포함) 안에 있으면, 자기 자신이나 가장 가까운 감싸는 요소에 `position:relative`가 있어야 한다. 없으면 containing block이 클리핑 컨테이너를 건너뛰어 스크롤되지 않은 좌표로 페인트되고 `document.scrollWidth`를 오염시킨다 — 모바일 390px에서만 터진다. 상세: [[dash-brief-v3]] §그리드 크래프트 룰.

## 4. 타이포·이미지 규율

- **폰트 웨이트 정확히 3종**. 위계는 크기·자간·색으로 만든다.
- 숫자(카운트·통화·시간·퍼센트)는 `tabular-nums`로 정렬한다.
- 이미지 컨테이너는 **고정 aspect-ratio + 배경색을 예약**한다 — 원격 이미지 로드 실패·지연 시 레이아웃이 무너지지 않게. 배지·라벨은 사진 위 절대배치 오버레이로 두지 말고 분리된 행이나 스크림에 배치한다(깨진 이미지의 alt 텍스트와 겹쳐 판독 불가가 된다). 근거: [[design-principles]] §Landing 구조 기본형.
- SVG 삼각함수 좌표는 소수 2자리 반올림(하이드레이션 불일치 방지).

## 5. 폭 검증 (전 타입 공통)

- **단일 폭 검증 금지.** 1280/1366/1440/1600/1920 + 모바일 390px 전 구간에서 확인하고, 여유폭 **16px 미만의 "딱 맞음"은 실패**로 간주한다(클래식 스크롤바·임의 창 폭).
- 데스크톱 테이블 가로 스크롤바 금지 — `min-w` 강제 대신 `table-fixed` + % 열 배분. 로컬 가로 스크롤은 모바일 전용.
- 그리드 아이템은 `min-w-0`(모바일 가로 오버플로 방지).

## 6. 산출물·환경

- Next.js 16 App Router · Tailwind v4 · TS. 배정 경로의 `page.tsx`(+ client 컴포넌트 분리), default export.
- `cd app && npx next build` 통과. **자기 폴더만** 작업한다.
- 반환은 간결히: 제품/브랜드 + 구성 + 적용한 인터랙션 목록 + 폰트/타이포 통일 확인 + 완성도 포인트.

## 타입 프로파일 목록

| 타입 | 프로파일 | 인터랙션 최소 | 스크롤 연출 |
|---|---|---|---|
| `dashboard` · `settings` | [[dash-brief-v3]] | 4종 | 금지(서비스급 절제) |
| `landing` | [[design-principles]] | 4종 | 허용 |
| `login` | [[brief-login]] | 2종 | 금지 (한 화면 완결) |
| `404` | [[brief-404]] | 1종 | 금지 (한 화면 완결) |
| `catalog` | [[brief-catalog]] | 3종 | **허용** (§5 제약 준수) |
| `scene` | [[brief-scene]] | 2종 (장면 자체가 주 인터랙션) | **필수** — 장면이 페이지의 축 |

새 타입을 추가할 때는 이 표에 행을 더하고, 프로파일에는 **타입 고유 기준만** 쓴다 — 코어 내용을 옮겨 적으면 다음 개정에서 갈라진다.

## 관련

- 정제 기준: [[curation-criteria]] · 질문 큐: [[questions-queue]]
