---
tags: [principles, brief]
---

# 페이지 브리프 공통 코어 — 모든 페이지 타입에 적용

> 페이지 타입(대시보드·랜딩·로그인·404·카탈로그…)과 무관하게 **전 후보에 강제되는 규칙**.
> 타입별 판단 기준(컴포넌트 체크리스트·인터랙션 최소 수·아키타입 목록·페이지 구조)은 각 타입 프로파일에 둔다.
> 소비자: [[dash-brief-v3]](dashboard·settings 프로파일) · [[design-principles]](landing 프로파일) · 이후 추가되는 타입 프로파일.
>
> **복사 금지** — 프로파일은 이 문서를 `[[page-brief-core]]`로 참조만 하고 내용을 옮겨 적지 않는다([[curation-criteria]] 조직 원칙).
>
> **이 문서는 어느 레포에서나 참인 것만 담는다.** 언어 정책·폰트 변수명·빌드 명령·경로 레이아웃처럼 **이 레포에 묶인 값**은 [[page-brief-repo]]에 있다. `page-commission` 플러그인이 볼트 없는 레포에서 이 문서를 읽기 때문이다 — 코어에 이 레포의 값이 섞이면 남의 레포에서 거짓이 된다.

## 1. 기계 검증되는 규칙

아래는 판단이 아니라 **기계가 잡는다**. 후보가 여기서 걸리면 judge 단계에 가지 못한다.
`static` 행은 의존성 없이(`node:fs`만) 어디서나 돌고, 나머지는 실행 환경을 요구한다 — 어느 관문이 무엇을 필요로 하는지는 [[page-brief-repo]] §5.

| 규칙 | 검사 주체 | 실패 시 |
|---|---|---|
| `Math.random(` · `Date.now(` · `new Date()` 금지 (결정론 데이터·하이드레이션) | static `no-random` | 하드페일 |
| ESLint 위반 0 (error·warning 모두) — `any` 단언·무력화된 훅 의존성 등 | `lint` (레포 flat config) | 하드페일 |
| 타입 에러 0 (`tsc --noEmit`, 스코프 파일 귀속) | `types` | 하드페일 |
| 라우트가 2xx로 응답 | `route` | 하드페일 |
| 원시 `<img>` 금지 → `next/image` | static `no-raw-img` | 하드페일 |
| `unoptimized` 금지 (LCP·CLS 이점 상실) | static `no-next-image-unopt` | 하드페일 |
| 이모지 금지 → lucide-react 아이콘 | static `no-emoji` | 하드페일 |
| `next/font` 추가 import 금지 | static `no-next-font` | 하드페일 |
| 허용 목록 밖 폰트 지정 금지 (목록은 레포마다 다르다 — [[page-brief-repo]] §2) | static `no-unlisted-font` | 하드페일 |
| 세리프·장식 폰트(`font-serif`) 금지 | static `no-font-serif` | 하드페일 |
| 폰트 웨이트 개수 (라우트 단위) | gate `weights` | **기록만** — 임계 미정, 아래 참조 |
| 다크 보조텍스트 `dark:text-*-500/600` 금지 (하한 zinc-400) | static `no-dark-dim-text` | 하드페일 |
| 무작위 이미지 서비스 금지 (picsum·loremflickr·source.unsplash 등) | static `no-random-image-host` | 하드페일 |
| 전 폭 페이지·테이블 오버플로 0 (1280/1440/1920 + 모바일 390) | sweep | 하드페일 |
| Lighthouse 접근성 **95 이상** | a11y | 하드페일 |
| Lighthouse 성능 | perf | 기록만(탈락 미적용) |

## 2. 접근성·견고성 (judge 렌즈1이 대조)

- 단일 `h1`, 헤딩 레벨 스킵 금지, 시맨틱 테이블(`caption`/`scope`/`aria-sort`)
- 포커스 가시(`outline-none` 단독 금지 — 반드시 `focus-visible` 링과 함께)
- 대비 AA, **색만으로 의미 전달 금지**(색 + 텍스트/아이콘 병행)
- 키보드 전 경로 도달, `prefers-reduced-motion` 게이팅(진입 `opacity:0` 잔존 금지)
- **상태 분기 대비** — 정적·Lighthouse 게이트는 기본 렌더 뷰만 스캔한다. 필터·토글로만 도달하는 보조 상태의 텍스트도 대비 규칙을 동일 적용한다. 하한은 **표면 톤 조건부**다: 다크 보조텍스트 zinc-400 미만 금지 · 라이트는 **순백/거의 순백(zinc-50 이하) 표면에서 zinc-500 하한, muted 톤 표면(zinc-100 이상 — 세그먼트·탭 트랙·필 등)에서 zinc-600 하한**. zinc-500은 순백 위에서만 안전한 값이다(실측: `neutral-500` on `neutral-100` = 4.34:1로 하드게이트 미달 → `neutral-600` 7.18:1). 근거는 [[curation-criteria]] "Q10 판정". **다크 쪽 하한은 정적 규칙 `no-dark-dim-text`가 토큰 수준에서 강제한다** — Lighthouse는 호스트가 렌더한 스킴만 감사하므로 `dark:text-*-500`은 측정 시점에 따라 통과/실패가 갈린다(`auto-login-r1`이 라운드에서 100, 재측정에서 96 — [[curation-criteria]] "Q11 판정").
- **sr-only 앵커** — `position:absolute` 기반 sr-only가 `overflow-x-auto` 클리핑 컨테이너(가로 스크롤 테이블, 그 `<td>` 셀 포함) 안에 있으면, 자기 자신이나 가장 가까운 감싸는 요소에 `position:relative`가 있어야 한다. 없으면 containing block이 클리핑 컨테이너를 건너뛰어 스크롤되지 않은 좌표로 페인트되고 `document.scrollWidth`를 오염시킨다 — 모바일 390px에서만 터진다. 상세: [[dash-brief-v3]] §그리드 크래프트 룰.

## 3. 타이포·이미지 규율

- **폰트 웨이트 정확히 3종**. 위계는 크기·자간·색으로 만든다.
- 숫자(카운트·통화·시간·퍼센트)는 `tabular-nums`로 정렬한다.
- 이미지 컨테이너는 **고정 aspect-ratio + 배경색을 예약**한다 — 원격 이미지 로드 실패·지연 시 레이아웃이 무너지지 않게. 배지·라벨은 사진 위 절대배치 오버레이로 두지 말고 분리된 행이나 스크림에 배치한다(깨진 이미지의 alt 텍스트와 겹쳐 판독 불가가 된다). 근거: [[design-principles]] §Landing 구조 기본형.
- **무작위 이미지 서비스 금지** — `picsum.photos/seed/<x>` 계열은 시드가 고정이어도 **주제가 통제되지 않는다**. CRM 동기화 카드에 이끼 사진이, 복식부기에 나무판자가 붙는다(2026-08-02 `auto-catalog-r1` 승격본). 로드 실패 시 위 aspect-ratio 예약이 박스는 지켜도 **내용은 못 지킨다** — 390px에서 alt 텍스트가 컨테이너를 넘어 옆 헤드라인으로 번진 사례가 있다(2026-08-05 `auto-blog-r1/c`). 생성형(SVG)이나 **내용이 정해진** 고정 이미지를 쓴다.
  금지 대상은 원격 호스트가 아니라 **무작위성**이다. `images.unsplash.com/photo-<고정ID>`처럼 사람이 고른 사진은 허용된다 — 전수 소급에서 랜딩 전편과 대시보드 12종이 이 방식을 쓰고 있고, 그건 통제된 내용이다.
- SVG 삼각함수 좌표는 소수 2자리 반올림(하이드레이션 불일치 방지).

## 4. 폭 검증 (전 타입 공통)

- **단일 폭 검증 금지.** 1280/1366/1440/1600/1920 + 모바일 390px 전 구간에서 확인하고, 여유폭 **16px 미만의 "딱 맞음"은 실패**로 간주한다(클래식 스크롤바·임의 창 폭).
- 데스크톱 테이블 가로 스크롤바 금지 — `min-w` 강제 대신 `table-fixed` + % 열 배분. 로컬 가로 스크롤은 모바일 전용.
- 그리드 아이템은 `min-w-0`(모바일 가로 오버플로 방지).

## 타입 프로파일 목록

> 아래 표는 **프로파일 문서가 있는 타입**이다. 프로파일이 없는 타입은 이 코어만으로 생성한다. 이 레포에서 타입 목록의 정본이 어디인지는 [[page-brief-repo]] §4.

| 타입 | 프로파일 | 인터랙션 최소 | 스크롤 연출 |
|---|---|---|---|
| `dashboard` · `settings` | [[dash-brief-v3]] | 4종 | 금지(서비스급 절제) |
| `landing` | [[design-principles]] | 4종 | 허용 |
| `login` | [[brief-login]] | 2종 | 금지 (한 화면 완결) |
| `404` | [[brief-404]] | 1종 | 금지 (한 화면 완결) |
| `catalog` | [[brief-catalog]] | 3종 | **허용** (§4 제약 준수) |
| `scene` | [[brief-scene]] | 2종 (장면 자체가 주 인터랙션) | **필수** — 장면이 페이지의 축 |
| `product-detail` | [[brief-product-detail]] | 3종 | 허용 (§4 제약 준수) |
| `paywall` | [[brief-paywall]] | 3종 | 허용하나 권장하지 않음 |
| `profile` | [[brief-profile]] | 3종 | 허용 (§4 제약 준수) |
| `careers` | [[brief-careers]] | 3종 | 허용 (§4 제약 준수) |

새 타입을 추가할 때는 이 표에 행을 더하고, 프로파일에는 **타입 고유 기준만** 쓴다 — 코어 내용을 옮겨 적으면 다음 개정에서 갈라진다.

## 관련

- 정제 기준: [[curation-criteria]] · 질문 큐: [[questions-queue]]
