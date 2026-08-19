# auto-landing-r11 — 하드게이트

**소스 해시(판정 대상, 1-fix 후 동결)**: `30d9eb223a3be2d65a2352795790c3292998c608`
1-fix 이전 해시: `e0712415eb6cef9d6e6f91f97c55dce0799bd60b`

**명령**: `node scripts/gate.mjs --target web --routes /landing-evolve/r11/<v>`

| 후보 | route | types | static | lint | weights | sweep | focus | console | a11y | perf | 결과 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **a** Redline diff | ✓ | ✓ | ✓ | ✓ | 3종 | 0 | 0 누락 | 0 | **100** | 75 | **1차 생존** |
| **b** Cutline | ✓ | ✓ | ✓ | ✓ | 3종 | 0 | 0 누락 | 0 | 96→**100** | 75 | **1-fix 후 생존** |
| **c** Running Ledger | ✓ | ✓ | ✓ | ✓ | 3종 | 0 | 0 누락 | 0 | **100** | 75 | **1차 생존** |

## b 의 1-fix — 고스트 넘버는 진짜 고스트로 칠할 수 없다

**위반(Lighthouse 실측)**: 숏리스트 카드 4장의 고스트 넘버가 `text-zinc-200`(`#e4e4e7`) on `#ffffff` = **1.26:1**. 24px bold 라 대형 기준 3:1 적용, 미달.

```
selector: li > article.flex > div.flex > span.text-2xl
snippet : <span aria-hidden="true" style="font-family:var(--font-display-wide)" class="text-2xl font-extrabold … text-zinc-200 …">
```

**`aria-hidden="true"` 는 axe 의 `color-contrast` 규칙에서 면제가 아니다.** 눈에 보이는 텍스트 노드면 스크린리더에서 숨겨도 대비를 잰다.

**수정**: `text-2xl tracking-[-0.02em] text-zinc-200` → `text-base tracking-[0.12em] text-zinc-500`(**4.84:1**). 색으로 죽이던 위계를 **크기·자간**으로 되돌렸다 — 자간 `0.12em` 은 정본 트래킹 3단 스케일의 스탯 단계라 새 값이 아니다.

## ★ 같은 함정을 후보 a 는 미리 알고 피했다

후보 a 의 `## 브리프에 없던 것` ②:

> folio `#85818B`(3.62:1) — **"고스트 넘버"를 진짜 고스트로 칠하면 `color-contrast` 하드페일**이라 3:1 위로 끌어올렸다. `aria-hidden` 은 axe 의 contrast 규칙에서 신뢰할 수 있는 면제가 아니다.

**같은 라운드에서 한 후보는 예측해 피하고 다른 후보는 밟았다.** 정본에 이 조항이 없다 — a 는 스스로 도달했고 b 는 도달하지 못했다. 정본에 적을 값어치가 있다([[questions-queue]] Q24 판정의 "후보가 규칙 없이 도달한 답은 규칙으로 적을 값어치가 있다"와 같은 논거).

## ★★ 게이트가 못 본 두 번째 위반 — 스크롤 리빌이 axe 를 가린다

b 가 1-fix 를 하면서 **게이트가 통과시킨 같은 종류의 위반을 하나 더 찾았다**:

> "Three things a filter cannot tell you" 3분할의 `01/02/03` 도 같은 `text-zinc-200` 이 `bg-zinc-50` 위 **1.23:1** 인데, `Reveal` 의 `initial opacity:0` 때문에 **axe 가 건너뛴 잠복 실패**였다.

**a11y 관문은 스크롤 리빌로 숨겨진 요소를 못 잰다.** Lighthouse 는 기본 렌더 뷰를 보고, `opacity:0` 인 요소는 axe 의 대비 검사 대상에서 빠진다. 즉 **`whileInView` 를 쓴 랜딩은 폴드 아래 전부가 a11y 사각지대**다.

이것은 이미 열려 있는 **Q31/Q33**(상태 분기의 대비를 누가 재나)과 같은 축이되 **새 갈래**다 — Q31·Q33 은 "필터·토글로만 닿는 상태"를 다루는데, 이건 조작이 아니라 **스크롤 위치**가 가리는 경우다. 랜딩 타깃은 스크롤 연출이 권장이므로 이 사각은 landing 에서 구조적이다. §6 질문으로 올린다.

## 후보들이 게이트를 역산한 흔적 (판정 전 기록)

`focus` 관문이 **처음으로 세 후보 전원을 1차 통과**시켰다. 프롬프트에 죽은 관용구 2종을 명시했더니 셋이 각자 다르게 대응했다:

- **c** — `outline` 과 `box-shadow` 를 **이중으로** 걸었다. *"둘 중 하나가 엔진에서 죽어도 나머지가 픽셀을 그리도록 — 소스 리뷰로 안 보이는 결함이라 중복이 정당하다"*
- **b** — 임의 hex 대신 명명 색 유틸을 쓰고, **핸들·점을 `overflow-hidden` 레이어 바깥에 형제로 배치**해 아웃라인 클리핑을 막았다
- **a** — `outline-none` 을 전 파일에서 미사용

같은 방식으로 **승격된 a11y 감사들도 설계를 바꿨다**:

- **a** — `verified` 모드에서 삭제 마크의 버튼을 렌더하지 않는다. *"빈 버튼은 `button-name` 에 직행하고, `aria-label` 을 붙이면 `label-content-name-mismatch` 로 옮겨간다"* — 승격한 두 감사를 **같은 함정의 양쪽 끝**으로 파악했다
- **a** — 문장 속 inline 버튼의 히트박스가 20px 라 `target-size` 미달인데 `inline-block` 은 줄바꿈이 안 되는 문제를, *"inline 요소의 패딩은 보더박스를 키우면서 줄상자 높이는 안 바꾼다"* 로 풀고 `leading-[2.05]` 를 거기서 역산
- **b** — 24개 점을 `aria-hidden` 장식으로 두고 동일 정보를 ledger·카드에서 키보드 접근하게 했다. *"12px 점 24개를 포커스 가능하게 두면 390px 에서 `target-size` 가 확실히 깨진다"*
- **c** — sticky 바 배경을 반투명+blur 가 아니라 **완전 불투명**으로. *"반투명 배경 위 텍스트는 axe 가 실배경을 확정 못 해 incomplete/fail 로 갈릴 수 있다"*

**승격한 감사들이 판정이 아니라 설계를 바꾸기 시작했다는 첫 관측이다.**
