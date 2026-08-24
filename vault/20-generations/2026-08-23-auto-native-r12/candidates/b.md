# auto-native-r12 · candidate b — Saved Search Alerts

한 줄 컨셉: 저장된 검색어(쿼리) 목록을 관리하는 화면 — 각 카드에 가격 상한·필터 칩, 항상 보이는
알림 빈도(Instant/Daily/Off) 세그먼트 컨트롤, 인라인 편집(가격 스테퍼·필터 칩 제거)과 2단계 확인
삭제가 붙어 있고, 모든 변경은 즉시 반영된다. 고정 하단 바 없음 — 상단에 항상 보이는 카운터
("N active alerts · M paused")로 상태를 대체 (r9 교훈 적용).

## 브리프에 없던 것

① 알림 빈도 조작 방식 (토글 vs 세그먼트 vs 순환 버튼)
② 3-옵션 세그먼트 컨트롤(Instant/Daily/Off)로 결정, 셋 다 항상 노출·직접 탭 선택
③ 브리프가 "toggle 하나로 즉시 반영"이라 했지만 실제 옵션이 3개(instant/daily/off)라 boolean
   토글로는 표현 불가. `account/Preferences.tsx`의 SegmentedRowView 패턴을 재사용해 "항상 보이는
   상태, press 없이도 현재값 확인 가능" 요구를 그대로 만족시켰다.

① "Edit" 액션이 실제로 무엇을 편집하게 할지 (다른 화면으로 이동 vs 인라인)
② 인라인 아코디언 패널로 결정 — 가격 상한 스테퍼(±step) + 개별 필터 칩 제거(× 버튼)
③ 이 라운드 카탈로그엔 "검색 결과/쿼리 편집" 화면이 따로 없어 Edit가 어디로도 갈 곳이 없다 —
   Judging note의 "no dead-end buttons" 요구 때문에, 갈 곳 없는 라우팅 대신 편집을 화면 자체 안에서
   완결시켰다. `account/Preferences.tsx`의 스테퍼(±버튼, min/max 표시) 패턴을 그대로 가져왔다.

① 삭제 확인 흐름
② 2단계 인라인 확인(Delete 탭 → "Delete "X"? / Confirm / Cancel" 카드 내 치환) — 별도 모달/알럿 없음
③ `account/Preferences.tsx`의 SignOutRowView가 이미 이 패턴("파괴적 작업 전 확인, 결과가 인라인으로
   즉시 보임")을 정본으로 세워둔 상태라 그대로 따름. 삭제 확정 시 목록에서 항목이 실제로 사라지고
   상단 카운터도 즉시 갱신되어 "dead-end 없음"을 만족.

① 필터가 전부 삭제되면 (배열 길이 0) 어떻게 보여줄지
② "No extra filters — matches every listing under the price ceiling." 안내 텍스트로 대체
③ 브리프에 없는 엣지케이스지만 Edit 패널에서 칩을 전부 지울 수 있는 이상 빈 상태를 방치하면
   레이아웃이 깨지거나 의미가 불분명해짐 — 임의로 결정.

① 전체 목록이 비었을 때(모든 저장 검색 삭제) 화면 처리
② `ListEmptyComponent`로 "No saved searches left" 안내 카드 표시
③ 브리프는 "management screen listing…"만 명시하고 빈 리스트를 다루지 않음 — 프로덕션 품질
   (judge lens 2, "no dead-end")을 위해 임의로 추가.

① 스크린리더 라이브 리전을 실제로 쓸지, 쓴다면 무엇을 알릴지
② 사용 — 헤더 아래 한 곳에만 `accessibilityLiveRegion="polite"` 컨테이너 + 그 안의
   `accessibilityRole="alert"` 문장 하나로, 빈도 변경/삭제 시에만 갱신
③ 브리프가 "optional, use your judgment"라 명시했고, 두 종류의 상태 변화(빈도 변경·삭제)가
   화면을 다시 스캔하지 않고는 알기 어려운 변화라 판단해 추가. 브리프의 "정확히 하나의 라이브
   리전만" 규칙을 그대로 따름 (컨테이너 1개 + alert 문장 1개, row마다 중복 배치하지 않음).

① 가격 상한 스테퍼의 min/max/step 값
② min ₩ 50,000 / max ₩ 3,000,000 / step ₩ 50,000 (`data.ts`의 `PRICE_MIN/MAX/STEP`)
③ 브리프에 수치 지정 없음 — `account/Preferences.tsx`의 스테퍼가 쓰던 것과 같은 스타일(고정
   min/max, disabled 상태로 한계 표시)을 새 도메인(원화 상한액)에 맞게 임의로 정함.

① "새 저장 검색 추가" 버튼을 넣을지
② 넣지 않음 — 이 화면은 기존 저장 검색을 "관리"하는 화면으로 한정
③ 브리프 본문이 "management screen listing... quick actions to edit or delete"까지만 명시하고
   생성 진입점은 언급하지 않음. 저장은 보통 검색 결과 화면에서 시작되는데 이번 라운드 카탈로그엔
   그 화면이 없어, 갈 곳 없는 CTA를 만드느니 범위를 좁히는 쪽을 선택 (judge lens 2 dead-end 회피).

① 통화 표기 규칙 적용 방식 (₩ 뒤 공백 vs "KRW" 접두사)
② "₩ 600,000" (₩ + 일반 공백 + 콤마 구분 숫자) 선택
③ 브리프가 둘 다 허용한다고 명시 — 기존 화면들(`watchlist`)이 ₩ 기호를 계속 써온 시각적 일관성을
   우선해 KRW 접두사 대신 공백 버전을 택함.
