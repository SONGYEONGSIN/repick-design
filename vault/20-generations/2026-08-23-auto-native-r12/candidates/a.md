# auto-native-r12 후보 a — Return & refund request intake

**한 줄 컨셉**: 필드 3~4개짜리 단발 제출 폼이지만, 하단 고정 밴드는 항상 "지금 왜 못 내는지"를 문장으로 말하고 눌리면 그 미해결 섹션으로 실제 스크롤+하이라이트한다 — 다 채워지면 같은 버튼이 "Submit return request"로 바뀌어 그 자리에서 종결(인라인 확인 카드)까지 간다. 위저드도, disputes의 진행형 스레드도 아닌 **한 화면짜리 상태기계**.

## 브리프에 없던 것

**① 반품 사유 5종의 정확한 문구** — ② "Item not as described / Defective or damaged / Wrong item received / Missing parts or accessories / Changed my mind" 각각에 한 줄 helper 텍스트 부여 ③ 브리프는 "고정된 사유 집합"만 요구했고 구체 항목은 위임됐다. 한국 중고거래 앱에서 실제 반품 사유로 흔한 축(설명불일치·파손·오배송·부속누락·단순변심)을 영문 카피로 옮김. **관행 (임의 문구는 그 관행 안에서 선택)**

**② 사유별 증거사진 필수 여부 분기** — ② "Changed my mind"만 사진 선택, 나머지 4개는 최소 1장 필수로 게이팅 ③ 브리프가 경고한 "가짜 진행형 상태기계"를 피하려면 하단 밴드가 가리키는 미해결 지점이 실제로 데이터에 의존해야 한다고 판단 — 증거 섹션이 조건 없이 상시 통과라면 밴드의 게이팅 로직 자체가 장식이 된다. **논증 정합**

**③ 사진 슬롯의 탭 동작** — ② "decorative/static, no real upload"라는 브리프 문구를, 탭하면 empty↔attached 로컬 상태가 토글되는 것으로 구현(카메라도, 업로드 진행률도 없음. 진짜 파일 I/O는 전혀 없음) ③ 완전히 비활성(눌러도 아무 반응 없음)으로 두면 렌즈2("모든 버튼이 실제 결과로 귀결")가 요구하는 "죽은 CTA 없음"에 걸린다고 판단 — 업로드를 흉내내지 않으면서도 누르면 실제로 뭔가 바뀌는 절충. **논증 정합 (브리프 두 조항의 충돌 해소)**

**④ 환불 수단 2종과 스토어 크레딧 +5% 보너스** — ② "Original payment method (카드 xxxx4821)" vs "Store credit (+5% bonus, 즉시)" ③ 브리프는 "환불 방법 선택"만 요구. 실제 이커머스에서 스토어 크레딧에 소폭 인센티브를 붙이는 패턴이 흔해 참고했다. **관행**

**⑤ 제출 후 상태 — 밴드에서 버튼을 완전히 제거** — ② `submitted` 시 밴드에는 확인 문장만 남고 Pressable은 사라짐(비활성 버튼으로 남기지 않음). 폼 위에는 요청ID·사유·환불수단을 보여주는 인라인 확인 카드 추가, "Dispute Center에서 추적 가능"이라는 안내 문장만 두고 실제 내비게이션 버튼은 만들지 않음 ③ disputes(DisputeCenterScreen)로 가는 진짜 라우팅이 이 폴더 범위 밖이라, 갈 곳 없는 CTA를 두면 렌즈2에 걸린다. 문장으로만 안내하고 버튼을 아예 안 두는 쪽을 택함. **논증 정합**

**⑥ 라이브 리전 1개를 밴드 컨테이너에만** — ② `accessibilityLiveRegion="polite"`는 밴드 View 하나에만, 전환마다 바뀌는 상태 문장(Text)에만 `accessibilityRole="alert"` — 진입 전/완료 전환/제출 후 3단계 전부 같은 컨테이너·같은 Text 노드가 재사용됨 ③ GENERATION.md §4가 "라이브 리전 2개 이상 두지 말 것"을 명시. r9/c·r11/a가 검증한 조합(컨테이너 polite 1개 + 전환 문장 alert)을 그대로 재사용. **정본 컨벤션 재사용**

**⑦ 사유/환불 행에 `accessibilityRole="radio"` + `accessibilityState.checked`** — ② 사진 슬롯은 `role="button"`(토글 액션)로 구분, 사유·환불 행은 단일 선택 리스트라 `role="radio"` ③ 브리프는 역할 매핑 예시(`role="button"`→`accessibilityRole="button"`)만 주고 라디오류는 언급이 없었음. RN 표준 accessibilityRole 어휘에 radio/checkbox가 존재해 단일선택엔 radio, 토글엔 button으로 나눔. **RN 표준 어휘 참조**
