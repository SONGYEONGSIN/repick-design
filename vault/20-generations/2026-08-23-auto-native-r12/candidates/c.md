# auto-native-r12 후보 c — Item Authentication Certificate

**한 줄 컨셉**: 아이템 진위 검증이 **끝난 뒤의 결과 기록**을 인증서 형태로 보여주는 화면 — 참조 사진, 5개 체크포인트(각 판정·검사 노트·타임스탬프)와 하나의 총괄 판정(Authentic)을 세로로 쌓고, 하단은 상태기계가 아니라 언제나 눌리는 "Share certificate / Download as proof" 액션 바로 마무리한다. `verification`(사람·다단계·차단 상태기계)과 구조적으로 갈라서기 위해, 이 화면에는 진행 중 단계도 없고 막힌 곳도 없다 — 전부 이미 결정된 값을 읽는 화면이다.

## 브리프에 없던 것

**① 체크포인트 항목·수·실제 판정값** — ② Hardware/Stitching/Material/Serial match(모두 pass) + Interior lining(note, advisory) 총 5개, 각각 검사 노트·타임스탬프 리터럴 부여 ③ 브리프가 예시로 든 4개("Hardware, Stitching, Material, Serial match")에 5번째를 더해 "advisory인데 verdict는 안 바뀜"이라는 상태를 하나 넣었다. 전부 pass면 상태 분화를 시연할 수 없고, 하나라도 실제 fail을 넣으면 총괄 판정이 Authentic인 것과 논리적으로 충돌한다. **임의(관찰 가능성 + 현실성 절충)**

**② pass/note 두 상태만 쓰고 fail 상태는 타입에서 아예 뺀 것** — ② `CheckpointStatus = "pass" | "note"`, "fail"은 정의하지 않음 ③ 진짜 감정사가 fail 항목이 있는 아이템에 인증서를 발급하지는 않는다 — 인증서 화면 자체가 "발급됐다"는 전제이므로 fail은 이 화면의 도메인 밖이라고 판단했다. 상태 차별화(모양·굵기·글리프로 색 없이 구분)는 pass vs note 두 상태로도 충분히 시연된다. **정본 해석**

**③ 하단 고정 밴드를 상태기계가 아닌 상시 액션 바로 만든 것** — ② `Share certificate`(눌러서 3개 목적지 패널 오픈) + `Download as proof`(즉시 실행), 둘 다 결과를 단일 라이브 리전 문장으로 피드백 ③ 브리프 §DNA가 명시적으로 "이 화면은 완료된 결과를 보여주는 read 화면이라 상태기계가 안 맞을 수 있다"고 힌트를 줬고, 실제로 막힌 것이 없어 "왜 못 가는지" 문장을 쓸 근거가 없었다. `verification`의 4상태 밴드(blocked/ready/done)를 그대로 재사용하지 않기 위한 의도적 이탈이기도 하다. **정본 해석 — judge 판단 지점**

**④ Share 패널의 목적지 3종과 각각의 피드백 문구** — ② `Message to buyer` / `Copy certificate link` / `Save as image`, Download은 별도로 `PDF로 저장됨` ③ "실제 OS 공유 통합은 필요 없고 눌렀을 때 눈에 보이는 결과만 있으면 된다"는 브리프 조건을 만족시키되, 완전한 no-op을 피하려고 각 목적지가 서로 다른 확정 문장을 반환하게 만들었다. **브리프 재진술 + 임의**

**⑤ 라이브 리전을 밴드 컨테이너 하나에만 걸고 alert role은 피드백 문장에만 조건부로 준 것** — ② `<View style={styles.band} accessibilityLiveRegion="polite">` 상시 마운트, 내부의 `bandLead`(기본 안내문)와 `bandFeedback`(액션 후 확정문)을 삼항으로 교체, `alert`는 `bandFeedback`에만 ③ 브리프가 "정확히 라이브 리전 1개, 두 개 쌓지 말 것"이라고 못박았고, `SellerVerificationScreen`/`PayoutStatementScreen` 두 선례 모두 밴드 전체에 `polite`를 걸고 상태별로 다른 문장 컴포넌트를 교체하는 동일 패턴을 썼다. **선례 답습**

**⑥ 인증서 스캔 프레임 장식 요소** — ② 44×44 테두리 박스 안에 유니코드 글리프 `▦`, `accessibilityElementsHidden` + `importantForAccessibility="no-hide-descendants"`로 스크린리더에서 완전히 숨김 ③ 인증서라는 문서 느낌을 강화하는 순수 장식이고 정보는 이미 `certId`/`issued` 텍스트로 노출돼 있어 중복 낭독을 막기 위해 숨겼다. 이모지 대신 타이포그래피 글리프를 쓰라는 DNA 조항의 연장. **DNA 해석**

**⑦ 아이템 사진 placeholder를 실제 이미지 없이 텍스트 박스로 처리** — ② 104×104 테두리 박스에 "Photo on file" + 캡처 날짜 캡션, `accessible` + `accessibilityRole="image"`로 단일 노드 묶음 ③ 실제 이미지 자산이 없는 상태에서 점선 테두리(`borderStyle:"dashed"`)는 RN에서 플랫폼별로 렌더링이 일관되지 않아 피했고, 대신 실선 + 캡션으로 "사진이 있다"는 사실만 명확히 전달했다. **RN 플랫폼 제약 회피**
