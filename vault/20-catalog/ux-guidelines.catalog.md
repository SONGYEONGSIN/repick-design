---
tags: [catalog, ux-guidelines]
source: ui-ux-pro-max (github.com/nextlevelbuilder/ui-ux-pro-max-skill)
license: MIT
attribution: Next Level Builder
fetched: 2026-07-21
note: 원본 99 가이드라인 중 Web/All 항목을 repick(대시보드+랜딩)에 맞게 선별한 체크리스트. Touch·VisionOS 등 모바일/공간 전용 제외.
---

# UX Guidelines — Web do/don't 체크리스트

> 소비자: [[dash-brief-v3]] 완성도 기준 · 하드게이트 a11y sweep이 참조하는 체크리스트 소스.
> 심각도: 🔴 High · 🟡 Medium · ⚪ Low. **[브리프 기존]** = [[dash-brief-v3]]/[[design-principles]]가 이미 요구 — 여기선 재확인용.

## Accessibility (a11y — 하드게이트 핵심)
| 항목 | Do → / Don't ✗ | 좋은 예 | Sev |
|---|---|---|:--:|
| 색 대비 **[브리프 기존]** | 본문 최소 4.5:1 / ✗ 저대비 텍스트 | `#333` on white(7:1) | 🔴 |
| 색만으로 전달 금지 **[브리프 기존]** | 색+아이콘/텍스트 병행 / ✗ 빨강·초록만으로 에러·성공 | 빨강 텍스트 + 에러 아이콘 | 🔴 |
| Alt 텍스트 | 의미 이미지에 서술형 alt / ✗ 빈·누락 alt | `alt='공원에서 노는 강아지'` | 🔴 |
| 헤딩 위계 **[브리프 기존]** | h1~h6 순차 / ✗ 레벨 스킵·스타일 목적 오용 | h1→h2→h3 | 🟡 |
| ARIA 라벨 | 아이콘 버튼에 aria-label / ✗ 라벨 없는 아이콘 버튼 | `aria-label='메뉴 닫기'` | 🔴 |
| 키보드 내비 **[브리프 기존]** | 시각 순서=탭 순서 / ✗ 키보드 트랩·비논리 탭 | 커스텀 순서는 tabIndex | 🔴 |
| 스크린리더 | 시맨틱 HTML+ARIA / ✗ div 수프 | `<nav><main><article>` | 🟡 |
| 폼 라벨 | label[for] 또는 래핑 / ✗ placeholder만 | `<label for='email'>` | 🔴 |
| 에러 메시지 낭독 | `role=alert`/`aria-live` / ✗ 시각만 | `role='alert'` | 🔴 |
| 스킵 링크 | 본문 바로가기 제공 / ✗ nav 많은데 스킵 없음 | Skip to main content | 🟡 |
| 포커스 상태 **[브리프 기존]** | 가시 포커스 링 / ✗ outline 제거 후 무대체 | `focus:ring-2 focus:ring-blue-500` | 🔴 |
| 모션 민감 **[브리프 기존]** | prefers-reduced-motion 존중 / ✗ 스크롤재킹 강제 | `@media (prefers-reduced-motion)` | 🔴 |

## Animation / Motion
| 항목 | Do → / Don't ✗ | 좋은 예 | Sev |
|---|---|---|:--:|
| 과도한 모션 | 뷰당 핵심 1–2개만 / ✗ 움직이는 것 다 애니 | 히어로 단일 애니 | 🔴 |
| 지속시간 | 마이크로 150–300ms / ✗ UI에 500ms 초과 | `duration-200` | 🟡 |
| reduced-motion | 미디어쿼리 확인 / ✗ 접근성 설정 무시 | `prefers-reduced-motion: reduce` | 🔴 |
| 로딩 상태 | 스켈레톤/스피너 / ✗ 얼어붙은 UI | `animate-pulse` 스켈레톤 | 🔴 |
| transform 성능 | transform·opacity만 애니 / ✗ width/height/top/left | `transform: translateY()` | 🟡 |
| 이징 | ease-out 진입 / ease-in 이탈 / ✗ linear UI 전환 | `ease-out` | ⚪ |

## Layout
| 항목 | Do → / Don't ✗ | 좋은 예 | Sev |
|---|---|---|:--:|
| z-index 관리 | 스케일 시스템(10/20/30/50) / ✗ 임의 큰 값 | `z-10 z-20 z-50` (✗ `z-[9999]`) | 🔴 |
| 콘텐츠 점프(CLS) | async 공간 예약 / ✗ 이미지가 레이아웃 밀기 | `aspect-ratio` 또는 고정 높이 | 🔴 |
| 뷰포트 단위 | `dvh` 사용 / ✗ 모바일 100vh | `min-h-dvh` | 🟡 |
| 컨테이너 폭 | 본문 65–75ch 제한 / ✗ 뷰포트 전폭 텍스트 | `max-w-prose` | 🟡 |
| overflow | 콘텐츠 수납 확인 / ✗ 무분별 overflow-hidden 클립 | `overflow-auto` | 🟡 |

## Interaction / Feedback
| 항목 | Do → / Don't ✗ | 좋은 예 | Sev |
|---|---|---|:--:|
| 로딩 버튼 | 비활성+로딩 표시 / ✗ 처리 중 다중 클릭 | `disabled={loading}` + 스피너 | 🔴 |
| 에러 피드백 | 문제 근처 명확한 메시지 / ✗ 무음 실패 | 빨강 보더 + 에러 메시지 | 🔴 |
| 확인 다이얼로그 | 파괴적 행동 전 확인 / ✗ 즉시 삭제 | "정말요?" 모달 | 🔴 |
| 비활성 상태 | opacity↓ + 커서 변경 / ✗ 정상과 혼동 | `opacity-50 cursor-not-allowed` | 🟡 |
| 액티브 상태 | 눌림 즉시 피드백 / ✗ 무반응 | `active:scale-95` | 🟡 |
| 성공 피드백 | 토스트/체크 / ✗ 무음 완료 | 토스트 알림 | 🟡 |
| 빈 상태 | 안내+액션 / ✗ 백지 화면 | "아직 없어요. 만들기" | 🟡 |
| 에러 복구 | 다음 단계 제시 / ✗ 복구 경로 없는 에러 | 다시 시도 버튼 + 도움말 | 🟡 |

## Forms
| 항목 | Do → / Don't ✗ | 좋은 예 | Sev |
|---|---|---|:--:|
| 입력 라벨 | 항상 가시 라벨 / ✗ placeholder만 | `<label>이메일</label>` | 🔴 |
| 제출 피드백 | 로딩→성공/에러 / ✗ 무반응 | Loading→성공 메시지 | 🔴 |
| 에러 위치 | 관련 입력 아래 / ✗ 폼 상단 단일 | 필드별 에러 | 🟡 |
| 인라인 검증 | blur 시 검증 / ✗ 제출만 검증 | `onBlur` 검증 | 🟡 |
| 입력 타입 | email/tel/number 등 / ✗ 전부 text | `type='email'` | 🟡 |
| 필수 표시 | 별표/(필수) / ✗ 표시 없음 | `* 필수` | 🟡 |

## Typography **[상당수 브리프 기존]**
| 항목 | Do → / Don't ✗ | 좋은 예 | Sev |
|---|---|---|:--:|
| 대비 가독성 | 밝은 배경엔 어두운 텍스트 / ✗ 회색 위 회색 | `text-gray-900` on white | 🔴 |
| 줄 높이 | 본문 1.5–1.75 / ✗ 답답·과도 | `leading-relaxed` | 🟡 |
| 줄 길이 | 65–75자 제한 / ✗ 전폭 텍스트 | `max-w-prose` | 🟡 |
| 타입 스케일 | 일관 모듈러 스케일 / ✗ 임의 크기 | 12/14/16/18/24/32 | 🟡 |
| 헤딩 명료 | 크기·웨이트 확실히 차이 / ✗ 본문과 유사 | Bold + 큰 크기 | 🟡 |

## Responsive / Performance / Navigation / Content
| 항목 | Do → / Don't ✗ | 좋은 예 | Sev |
|---|---|---|:--:|
| 가로 스크롤 금지 | 뷰포트 폭 수납 / ✗ 뷰포트보다 넓게 | `max-w-full overflow-x-hidden` | 🔴 |
| 모바일 본문 크기 | 최소 16px / ✗ 작은 텍스트 | `text-base` 이상 | 🔴 |
| 이미지 스케일 | `max-w-full h-auto` / ✗ 고정폭 오버플로 | `max-w-full h-auto` | 🟡 |
| 테이블 처리 | 가로 스크롤 래퍼/카드 / ✗ 전폭 깨짐 | `overflow-x-auto` 래퍼 | 🟡 |
| 이미지 최적화 | 적정 크기·WebP / ✗ 원본 그대로 | `srcset` 다중 크기 | 🔴 |
| 지연 로딩 | 폴드 아래 lazy / ✗ 전부 즉시 | `loading='lazy'` | 🟡 |
| 폰트 로딩 | `font-display: swap` / ✗ FOIT | fallback + swap | 🟡 |
| 활성 내비 | 현재 위치 표시 / ✗ 피드백 없음 | `text-primary border-b-2` | 🟡 |
| 부드러운 스크롤 | `scroll-behavior: smooth` | anchor 스무스 스크롤 | 🟡 |
| 숫자 포맷 | 천단위 구분/약어 / ✗ 미포맷 | `1,234` / `1.2K` | ⚪ |
| 날짜 포맷 | 로케일/상대시간 / ✗ 모호 포맷 | "2시간 전" | ⚪ |
| 자동재생 비디오 | 클릭 재생/오프스크린 정지 / ✗ 고해상 루프 | `preload='none'` | 🟡 |

## AI Interaction (repick 제품 맥락 — AI 매칭 근거 노출)
| 항목 | Do → / Don't ✗ | 좋은 예 | Sev |
|---|---|---|:--:|
| AI 고지 | AI 생성물 명확 라벨 / ✗ 사람인 척 | "AI 어시스턴트" 라벨 | 🔴 |
| 스트리밍 | 토큰 단위 스트림 / ✗ 10s+ 스피너 | 타이프라이터 효과 | 🟡 |

## 관련
- [[dash-brief-v3]] · [[design-principles]] · [[charts.catalog]] · [[colors.catalog]] · [[curation-criteria]]
