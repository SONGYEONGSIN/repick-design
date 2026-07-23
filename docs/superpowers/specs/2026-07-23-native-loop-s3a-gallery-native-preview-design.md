# 멀티플랫폼 진화 루프 — S3a: 갤러리 native 표시 (정적 스크린샷)

- 날짜: 2026-07-23
- 상태: 사용자 승인 완료 (구현 계획 수립 전)
- 상위 프로그램: 자율 진화 루프 멀티플랫폼 재설계. 선행 = S0·S1·S2·S4a·S4b·S4c 전부 ✅ 병합(native = run+learn 완비 1급 타깃). 이 문서는 **S3a**만 다룬다.

## 0. 상위 프로그램 맥락

| # | 하위 프로젝트 | 상태 |
|---|---|---|
| S0~S2·S4a~S4c | native 타깃 실행·학습 완비 | ✅ 병합 |
| **S3a** | **갤러리 native 표시 (정적 스크린샷)** | ← 이 문서 |
| S3b | falsify native 킵/드롭 자동 승격 | 후속 |
| S5 | 카탈로그 192색·98UX 전수 수용 | 후속 |

> S3를 S3a(갤러리 표시 — 스크린샷·수동 seed)와 S3b(falsify 자동 승격 — git mv·이미지 복사·등재)로 분할.

## 1. 목표

야간 루프가 만드는 native 후보/승자를 `/gallery`에 **정적 스크린샷**으로 노출한다. 웹 후보는 Next 라우트 iframe이지만 native는 Expo Web 정적 export라 프로덕션(Vercel)에 서버가 없다 — 따라서 judge가 이미 생성한 스크린샷을 정적 이미지로 표시한다. S4b 스모크 승자 a(auto-native-r1)를 seed해 첫 native 작품을 실증. **falsify 자동 승격은 S3b.**

## 2. 확정된 결정

| 결정 | 선택 |
|---|---|
| native 미리보기 | **정적 스크린샷 이미지** (Expo 서버 불요, judge shots 재사용) |
| 이미지 컴포넌트 | next/image (프로젝트 관례 — Next 16 API는 `node_modules/next/dist/docs` 확인) |
| S3a 범위 | 갤러리 표시 + 스모크 승자 1개 seed. **falsify 자동 승격 = S3b** |
| 카테고리 | native = permanent 카테고리 Ⅳ (landing Ⅰ·dash Ⅱ·free Ⅲ·native Ⅳ·evolve Ⅴ조건부) |

## 3. Work 타입 확장

`app/src/lib/works.ts`의 `Work`에 `image?: string`(스크린샷 정적 경로) 추가. 웹 work는 미설정 → 기존 iframe 경로 유지(무변경). native work는 `image` 설정 → WorkCard가 이미지 렌더.

## 4. WorkCard native 분기

`app/src/app/gallery/work-card.tsx`:
- `work.image`가 있으면 프리뷰 영역에 iframe 대신 **스크린샷 이미지**(next/image)를 모바일 세로 프레임에 `object-contain`으로 렌더. 프리뷰 래퍼는 기존대로 `aria-hidden`, 이미지 `alt=""`(장식 — 정보는 메타 행).
- `work.image`가 없으면 기존 iframe(웹) 경로 그대로 — **웹 카드 무변경**.
- `href={work.route}` 공용(native는 route=이미지 경로 → 클릭 시 전체 스크린샷 보기). 메타 행(brand/desc)·StatusBadge(채택/탈락/심사 대기) 공용.

## 5. works.ts NATIVE_WORKS + seed

`app/src/lib/works.ts`에 `NATIVE_WORKS: Work[]` 신설. seed = S4b 스모크 승자 a:
```ts
export const NATIVE_WORKS: Work[] = [
  { id: "n1", route: "/native/notification-center.png", brand: "알림센터",
    desc: "알림 피드 · 날짜 그룹핑 · 미읽음 단일 액센트 (자동 native 라운드 auto-native-r1 승자)",
    target: "native", image: "/native/notification-center.png",
    status: "winner", round: "auto-native-r1", previewH: 420 },
];
```
`LAST_UPDATED`를 오늘 날짜(문자열)로 갱신.

## 6. page.tsx 카테고리 + seed 이미지

- `app/src/app/gallery/page.tsx`: categories에 native 추가 —
  `{ key: "native", numeral: "Ⅳ", label: "네이티브", works: NATIVE_WORKS }` (free 다음, evolve는 Ⅴ로 이동). NATIVE_WORKS import.
- **seed 이미지**: `smoke/native-r1` 브랜치의 `vault/20-generations/2026-07-22-auto-native-r1/shots/a-390.png`를 `app/public/native/notification-center.png`로 복사(`git show smoke/native-r1:<경로> > app/public/native/notification-center.png`). 실제 gate 통과·3렌즈 judge 선정 승자라 정당한 콘텐츠.

## 7. 검증

1. **빌드·렌더**: `cd app && npx next build` 성공 → 로컬 `/gallery`에 "네이티브" 카테고리 탭 + 알림센터 카드(스크린샷 렌더) 노출. next/image가 `app/public/native/notification-center.png`를 로드.
2. **웹 회귀 없음**: `image` 없는 기존 work(landing/dash/free)는 iframe 그대로 — 카드 렌더 불변.
3. **a11y**: 프리뷰 `aria-hidden` 유지, 이미지 `alt=""`. Lighthouse a11y ≥95(갤러리 도그푸딩 유지).
4. **비회귀**: `npm test` 44/44 불변. `scripts/gate.mjs`·SKILL·native 정본 diff 0. 변경 = `works.ts`·`work-card.tsx`·`page.tsx` + `app/public/native/notification-center.png`(신규).
5. **프로덕션**: 병합·배포 후 `curl https://repick-design.vercel.app/gallery` 200 + 네이티브 카테고리 노출.

## 8. 비범위

- **falsify native 킵/드롭 자동 승격**(승자 화면 → permanent native 화면 git mv + main screens 등재 + 스크린샷 복사 + NATIVE_WORKS append) → **S3b**.
- 인터랙티브 native 미리보기(Expo Web 번들 iframe) → 보류.
- native 후보(승자 아닌 탈락/대기) 다수 표시 → S3b(자동 등재 후 자연 축적).
- gate.mjs·SKILL 수정 → 불요.
