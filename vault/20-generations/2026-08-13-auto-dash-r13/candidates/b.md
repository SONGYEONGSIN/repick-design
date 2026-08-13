Trestle — a deployment operations console whose spine is a live build/deploy activity stream (each event an expandable card with status, commit, diff, and log excerpt), flanked by a compact environment-health rail and an active-alerts/on-call panel, with cyan as the single dark-mode accent.

## 브리프에 없던 것

① 브랜드명·도메인·페르소나를 정해야 했다.
② "Trestle"(트레슬 — 철로를 받치는 다리 구조물, 파이프라인/인프라 은유)와 trestle.dev, 가상의 인물 Marisol Kade(Release Engineering Lead, marisol.kade@trestle.dev)로 정했다.
③ 세션 컨텍스트의 실제 이메일과 절대 겹치지 않도록 임의 발명(auto-dash-r3 델타가 이 함정을 명시 경고). 브랜드명은 도메인 은유에서 임의 선택.

① 환경 목록을 몇 개, 무엇으로 할지 브리프는 "e.g. production/staging/canary"만 제시했다.
② production/staging/canary에 preview(ephemeral per-PR)를 4번째로 추가했다.
③ Vercel/Netlify류 상용 서비스의 관용 패턴(브랜치 프리뷰 환경) 참조 — 좌 패널에 4개 행이 3개보다 스파크라인·상태 다양성을 보여주기 좋다는 판단(임의).

① 이벤트의 상태·종류 분류 체계(빌드 vs 배포, success/failed/running/rolled_back)가 브리프에 없었다.
② kind는 build|deploy 2종, status는 success|failed|running|rolled_back 4종으로 고정했다.
③ GitHub Actions/CircleCI 등 상용 CI 상태 관용구를 참조 — rolled_back을 failed와 분리한 것은 "자동 롤백은 배포 파이프라인이 스스로 복구한 것"이라는 도메인 의미 차이를 표현하려는 임의 설계.

① 시맨틱 톤(성공/실패/경고 등)과 cyan 단일 액센트가 색상 축에서 충돌하지 않게 배분해야 했다.
② emerald(success)·rose(failed)·amber(running/warning)·violet(rolled_back)로 시맨틱 톤을 cyan과 완전히 분리했다.
③ colors.catalog의 "단일 액센트 원칙"을 "액센트=선택/인터랙션 신호, 시맨틱 톤=상태 신호"로 임의 해석 — 두 신호가 같은 색이면 "이 항목이 선택됨"과 "이 배포가 실패함"이 구분 안 될 위험을 피하기 위함.

① 상대 시각("4 minutes ago") 표기 방식이 브리프엔 없었다(다만 "Intl 포맷" 요구는 있었다).
② Intl.RelativeTimeFormat + 고정 NOW 기준시각으로 결정론적으로 계산했다(문자열을 손으로 하드코딩하지 않음).
③ d31/d40(Conduit/Cadence)이 이미 쓰던 NOW 앵커 패턴을 그대로 채택 — 관용구 재사용. 상대시각 계산 자체를 함수화한 것은 총합·부분합 정합 요구를 시간 축에도 동일 적용한 임의 확장.

① 3-페인(레일+피드+레일) 셸을 뷰포트 락(h-dvh+내부 스크롤)으로 할지 일반 페이지 스크롤로 할지가 브리프에 없었다.
② Cadence(d40) 패턴을 따라 h-dvh 락 + main 하나만 overflow-y-auto로 스크롤하는 단일 스크롤 셸을 택했다(패널별 독립 스크롤은 안 씀).
③ 델타(auto-dash-r5/r8 이중 스크롤바·페인 불균형 결함들)를 피하려면 스크롤 축을 하나로 좁히는 편이 안전하다는 재현된 학습을 그대로 적용.

① 모바일에서 3개 패널(환경/피드/알림)의 세로 배치 순서가 브리프에 없었다.
② flex order 유틸리티로 모바일은 피드가 최상단(order-1), 데스크톱은 좌-중-우 순서(lg:order-1/2/3)로 분기했다.
③ "피드가 페이지의 through-line"이라는 브리프 문장을 모바일에서도 최우선 노출로 해석한 임의 설계 — Gmail/Linear류 모바일 리스트 우선 관용구 참조.

① 필터·기간 토글이 바뀌어도 선택된 피드 항목(사이드 패널 동기화 대상)을 계속 유지할지, 안 보이면 해제할지가 브리프에 없었다.
② 선택은 필터/기간과 독립적으로 유지된다(EVENT_BY_ID 전체 목록 기준으로 동기화 계산) — 항목을 다시 클릭하면 토글 해제.
③ 상태 처리 단순성과 예측 가능성 우선(필터가 선택을 몰래 지우면 "왜 사이드 패널 하이라이트가 사라졌지"라는 혼란을 유발할 것으로 판단) — 임의 결정.

① ⌘K 팔레트의 정확한 동작 범위(무엇을 검색·점프하게 할지)가 브리프엔 "여력 시" 보너스로만 언급됐다.
② 환경으로 점프(해당 환경으로 피드 필터 전환)와 활동으로 점프(해당 카드 선택+펼침) 두 갈래로 구현했다.
③ Cadence(d40)의 CommandPalette 구조(서비스 점프/딜로이 점프)를 도메인에 맞게 재해석 — 기존 레포 관용구 재사용.

① 아바타 이미지의 구체적 Unsplash 사진 ID가 브리프엔 없었다(정책만: "실존 ID 소량").
② 기존 라운드(d35~d40)에서 이미 검증되어 쓰인 ID 풀에서만 재사용했다(신규 미검증 ID를 추가하지 않음).
③ page-brief-core의 "무작위 이미지 서비스 금지·내용 통제" 취지를 확장 해석 — 이미 이 레포에서 로드 성공이 확인된 ID만 쓰는 편이 결정론·안정성 리스크가 낮다는 임의 판단.
