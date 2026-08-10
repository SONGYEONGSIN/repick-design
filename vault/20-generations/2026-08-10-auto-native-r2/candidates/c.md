# c — Account & Preferences (Preferences)

**한 줄**: 알림·가격 알림 임계값·계정 설정을 그룹핑한 환경설정 화면. 모든 행이 즉시 적용되고(라이브), 하단에 별도 저장 바가 없다 — 두 개의 실시간 조정 가능한 수치 임계값(가격 하락 %, 가격 상한 KRW)이 항상 노출된 상태로 스텝퍼로 조정된다.

- 배정 화면유형: **설정/환경설정 구성 화면** — 차별 축 "선호도/임계값 구성"
- 기존 4화면(리스트 2 + 상세 1 + 협상 스레드 1)이 전부 브라우즈/판정/협상인 데 대한 대비 — "값을 조작해 시스템의 지속적 동작을 바꾼다"는 신규 인터랙션 동사
- 매크로 골격: 헤더(H1 + 서브카피) → 프로필 요약 카드 → 그룹 섹션(Notifications / Price Alert Thresholds / Account) 각각 라벨+컨트롤 행 → 섹션 푸터 캡션. **전부 하나의 SectionList로 연속 스크롤**(고정 헤더 없음·`stickySectionHeadersEnabled={false}`, 고정 하단 액션바 없음) — r1 delta가 지적한 "고정 헤더 + 핀 카드 / 스크롤 / 하단 accent 풀폭 액션바" 3밴드 실루엣과 다른 골격.

## 브리프에 없던 것

1. ① destructive(로그아웃) 행의 시각 처리 톤을 뭘로 할지
   ② 별도 위험색(red) 없이 `tokens.color.ink2`(짙은 무채색) 배경의 2탭 confirm으로 처리
   ③ 근거: tokens.ts에 danger/red 토큰이 존재하지 않음(단일 액센트 DNA) + r1 승자 OfferThread의 "Decline" 버튼이 이미 같은 `ink2` "strong" 톤을 씀(`OfferThread.tsx` btnStrong) — 그 관례를 그대로 따름.

2. ① 파괴적 액션(로그아웃)의 확인 흐름을 몇 단계로 만들지
   ② idle → confirm(인라인 Cancel/Confirm 버튼) → done(터미널 상태, 재탭 불가) 3단계 상태머신
   ③ 근거: 카탈로그 "확인 다이얼로그" Do 규칙 + r1 승자 OfferThread가 이미 검증한 2탭 confirm 패턴(Accept/Decline/Counter 전부 confirm 모드를 거침)을 재사용.

3. ① "하단 저장바 금지, 행별 라이브 적용" 요구를 어떤 시각 신호로 구현할지
   ② 각 조작 가능한 행 옆에 작은 accent색 텍스트 태그("Applied"/"Updated")를 상호작용 이후 계속 노출
   ③ 근거: 브리프가 명시한 "toast/inline confirmation"의 한 형태로 임의 선택 — 타이머로 사라지는 토스트 대신 영속 태그를 택한 이유는 결정론적 렌더(스크린샷 타이밍에 의존하지 않음)를 보장하기 위함.

4. ① 그룹 설정 행들을 시각적으로 어떻게 묶을지(카드/구분선/모서리)
   ② 섹션당 하나의 테두리 상자 + 행 사이 구분선(첫/끝 행만 라운드 코너) — iOS/Android 네이티브 Settings 앱의 grouped table 관례
   ③ 근거: GENERATION.md/tokens.ts에 그룹 리스트 컴포넌트 규칙이 없어 실제 네이티브 OS 설정 앱 관례를 참조 + 기존 화면(WatchList/MatchList 카드)이 이미 쓰는 `tokens.radius.md` + `tokens.color.border` 어휘를 재사용.

5. ① 두 임계값 스텝퍼의 범위·스텝 값(가격 하락 %, 가격 상한 KRW)
   ② 5–50%(5% 단위, 초기 20%) / ₩50,000–₩500,000(₩25,000 단위, 초기 ₩150,000)
   ③ 근거: 브리프·토큰 어디에도 지정 없음 — 리세일 가격 알림 도메인에서 그럴듯한 값으로 임의 결정(watchlist 데이터의 가격대 스케일과 정합하도록만 맞춤).

6. ① 그룹 리스트를 어떤 RN 컴포넌트로 렌더링할지(FlatList vs SectionList vs plain map)
   ② `SectionList`를 채택하고 `stickySectionHeadersEnabled={false}`로 명시 오버라이드
   ③ 근거: GENERATION.md §1이 리스트에 FlatList류를 요구하며 SectionList가 "그룹 섹션 + 행"에 가장 정확히 대응하는 RN 관용구 + iOS 기본값(sticky section header)을 끄지 않으면 스크롤 중 고정 헤더가 생겨 r1 delta가 지목한 "고정 헤더" 실루엣을 부분적으로 재현할 위험이 있어 명시적으로 차단.

7. ① "알림 빈도" 세그먼트 컨트롤을 RN에 없는 위젯인데 어떻게 구현·접근성 매핑할지
   ② `Pressable` 3개 + `accessibilityRole="radiogroup"`(그룹) / `"radio"`(옵션) + `accessibilityState={{selected, checked}}`
   ③ 근거: 브리프가 "세그먼트 선택"을 명시했지만 컴포넌트를 지정하지 않음 — RN `AccessibilityRole` 타입에 `radio`/`radiogroup`이 정식 값으로 존재해(`ViewAccessibility.d.ts`) 그 매핑을 채택.

8. ① 프로필 요약 카드의 더미 값(이름·가입일·저장 수·감시 수·회원 ID)
   ② "Jordan Lee" / "Member since Mar 2024" / Saved 18 / Watching 6 / "RPK-208441" — 전부 고정값
   ③ 근거: GENERATION.md §5 결정론 규칙만 있고 구체 값은 미지정 — 기존 `watchlist/data.ts`·`MatchList`의 고정 더미 데이터 관례(하드코딩된 배열, 계산 가능한 파생값)를 그대로 따름.
