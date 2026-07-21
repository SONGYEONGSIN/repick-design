---
tags: [catalog, colors]
source: ui-ux-pro-max (github.com/nextlevelbuilder/ui-ux-pro-max-skill)
license: MIT
attribution: Next Level Builder
fetched: 2026-07-21
note: 원본 193 팔레트 중 repick DNA(near-monochrome·단일 액센트·진짜 라이트) 정합 12종만 큐레이션. 비비드·네온·크림 제외.
---

# Colors — AA 검증 토큰 팔레트 뱅크

> 소비자: [[dash-brief-v3]] — dash 루프가 테마 토큰을 고를 때 읽는 뱅크. 원본이 **WCAG 대비로 이미 보정**된 값(3:1/4.5:1)이라 하드게이트 대비 게이트에 유리.
> 층위: 정량 결정 규칙. 정제 기준 [[curation-criteria]].

## 토큰 스키마 (shadcn 18슬롯 — repick 스택 정합)
Tailwind v4 + shadcn류 CSS 변수와 1:1 대응. 각 팔레트는 아래 슬롯을 채운다.

`primary` / `on-primary` · `secondary` / `on-secondary` · `accent` / `on-accent` · `background` · `foreground` · `card` / `card-foreground` · `muted` / `muted-foreground` · `border` · `destructive` / `on-destructive` · `ring`

- `on-*`는 별도 표기 없으면 **#FFFFFF**(예외는 Notes에 명시 — gold/green accent는 어두운 텍스트).
- `ring` ≈ `primary`, `secondary` ≈ primary의 명도 변주.

## repick 적응 규칙 (원본과 다른 점 — 반드시 적용)
- **단일 액센트 원칙**: 원본은 primary+secondary+accent 3색이지만 repick DNA는 "무채색 위계 + 극소량 단일 액센트". → 실질 액센트는 `accent` **1개만** 강조로 쓰고, secondary는 표면/보더 변주로만.
- **"진짜 라이트" 게이트**: 브리프가 크림·페이퍼(#F4EFE6류)를 가짜 라이트로 금지. 아래 표에서 **틴트 배경(⚠️)** 팔레트는 `background`를 `#FFFFFF`/`#F8FAFC`(zinc-50)로 교체해 쓴다.
- **제외된 것(anti-slop)**: Cybersecurity의 네온 매트릭스 그린(#00FF41)·Notes 앱의 크림 배경(#FFFBEB) 등은 "연극적 발광/가짜 라이트"라 큐레이션에서 뺐다.
- **대비 재검증**: 값을 커스텀 조정하면 AA(본문 4.5:1, 대형·UI 3:1)를 다시 확인 — 원본 보정이 깨질 수 있음.

## 라이트 팔레트 (순백 기반)

| 유형 | primary | accent | background | foreground | card | muted / muted-fg | border | destructive | Notes |
|---|---|---|---|---|---|---|---|---|---|
| SaaS (General) | `#2563EB` | `#EA580C` | `#F8FAFC` | `#1E293B` | `#FFFFFF` | `#E9EFF8` / `#64748B` | `#E2E8F0` | `#DC2626` | Trust blue + orange CTA. accent 3:1 보정 |
| B2B Service | `#0F172A` | `#0369A1` | `#F8FAFC` | `#020617` | `#FFFFFF` | `#E8ECF1` / `#64748B` | `#E2E8F0` | `#DC2626` | Navy 모노크롬 + blue CTA |
| Analytics Dashboard | `#1E40AF` | `#D97706` | `#F8FAFC` | `#1E3A8A` | `#FFFFFF` | `#E9EEF6` / `#64748B` | `#DBEAFE` | `#DC2626` | Blue 데이터 + amber 하이라이트(3:1 보정) |
| CRM & Client | `#2563EB` | `#059669` | `#F8FAFC` | `#0F172A` | `#FFFFFF` | `#F1F5FD` / `#64748B` | `#E4ECFC` | `#DC2626` | Blue + deal green |
| Changelog / Release | `#475569` | `#059669` | `#F8FAFC` | `#1E293B` | `#FFFFFF` | `#EAEFF3` / `#64748B` | `#E2E8F0` | `#DC2626` | Slate 모노크롬 + feature green |
| Banking / Finance | `#0F172A` | `#A16207` | `#F8FAFC` | `#020617` | `#FFFFFF` | `#E8ECF1` / `#64748B` | `#E2E8F0` | `#DC2626` | Navy + premium gold. on-accent `#FFFFFF`(gold 어둡게 보정) |
| AI / Chatbot ⚠️ | `#7C3AED` | `#0891B2` | `#FAF5FF`→순백 | `#1E1B4B` | `#FFFFFF` | `#ECEEF9` / `#64748B` | `#DDD6FE` | `#DC2626` | Purple(=repick 액센트 계열) + cyan. bg 틴트→순백 권장 |
| Productivity Tool ⚠️ | `#0D9488` | `#EA580C` | `#F0FDFA`→순백 | `#134E4A` | `#FFFFFF` | `#E8F1F4` / `#64748B` | `#99F6E4` | `#DC2626` | Teal + action orange(3:1 보정). bg 틴트→순백 권장 |

## 다크 팔레트 (정제된 프로덕트 다크)

| 유형 | primary | accent | background | foreground | card | muted / muted-fg | border | destructive | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Financial Dashboard | `#0F172A` | `#22C55E` | `#020617` | `#F8FAFC` | `#0E1223` | `#1A1E2F` / `#94A3B8` | `#334155` | `#EF4444` | 다크 + green 상승 지표. on-accent `#0F172A` |
| Developer Tool / IDE | `#1E293B` | `#22C55E` | `#0F172A` | `#F8FAFC` | `#1B2336` | `#272F42` / `#94A3B8` | `#475569` | `#EF4444` | Code dark + run green. on-accent `#0F172A` |
| Personal Finance | `#1E40AF` | `#059669` | `#0F172A` | `#FFFFFF` | `#192134` | `#101A34` / `#94A3B8` | `rgba(255,255,255,.08)` | `#DC2626` | Trust blue + profit green |
| Fintech / Crypto | `#F59E0B` | `#8B5CF6` | `#0F172A` | `#F8FAFC` | `#222735` | `#272F42` / `#94A3B8` | `#334155` | `#EF4444` | Gold + purple tech. on-primary `#0F172A`(gold 위 어두운 텍스트) |

## 관련
- [[dash-brief-v3]] · [[charts.catalog]] · [[ux-guidelines.catalog]] · [[design-principles]](랜딩 DNA 토큰) · [[curation-criteria]]
