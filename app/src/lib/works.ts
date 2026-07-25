// app/src/lib/works.ts — 전 작품 메타 단일 출처 (통합 갤러리 + 개별 갤러리 공용)
export type Work = {
  id: string;
  route: string;
  brand: string;
  desc: { en: string; ko: string }; // 카드 태그라인(이중언어)
  previewH?: number; // 카드 미리보기 높이(px), 기본 300
  status?: "winner" | "dropped" | "pending";
  round?: string;
  target?: "dash" | "landing" | "native";
  date?: string;
  image?: string; // 정적 스크린샷 경로(native 등 이미지 미리보기 work). 있으면 WorkCard가 iframe 대신 <img> 렌더
  category?: "dashboard" | "landing" | "free" | "native"; // 갤러리 필터/태그(page.tsx 조립 시 태깅)
};

export const LAST_UPDATED = "2026-07-25"; // 결정론 규칙: 동적 Date 호출 금지, 갱신 시 수동 수정

export const NATIVE_WORKS: Work[] = [
  {
    id: "n1",
    route: "/native/notification-center.png",
    brand: "알림센터",
    desc: { ko: "알림 피드 · 날짜 그룹핑 · 미읽음 단일 액센트 (자동 native 라운드 auto-native-r1 승자)", en: "Notification feed · grouped by date, a single accent for unread (auto native round auto-native-r1 winner)" },
    target: "native",
    image: "/native/notification-center.png",
    status: "winner",
    round: "auto-native-r1",
    previewH: 420,
  },
];

// Ⅰ 랜딩 — 챔피언 + 진화 계보 v1~v5. (/lab 은 자체가 인덱스 페이지라 작품 아님 — 제외)
export const LANDING_WORKS: Work[] = [
  { id: "v0", route: "/", brand: "V0 — Champion", desc: { ko: "현재 프로덕션 랜딩 · 에디토리얼 스플릿 히어로 + 제품 쇼케이스 (자동 라운드 R7 계보 승자)", en: "Live production landing · editorial split hero + product showcase (auto-round R7 lineage winner)" }, previewH: 340 },
  { id: "v1", route: "/v1", brand: "V1 시네마틱", desc: { ko: "전면 이미지 몰입형 · 시네마틱 무드", en: "Full-bleed immersive imagery · cinematic mood" }, previewH: 340 },
  { id: "v2", route: "/v2", brand: "V2 벤토", desc: { ko: "벤토 그리드 · 제품 중심 구성", en: "Bento grid · product-centric composition" }, previewH: 340 },
  { id: "v3", route: "/v3", brand: "V3 매거진", desc: { ko: "에디토리얼 매거진 · 롱폼 그리드", en: "Editorial magazine · long-form grid" }, previewH: 340 },
  { id: "v4", route: "/v4", brand: "V4 대화형", desc: { ko: "히어로 3문항 퀴즈 — 사용자 입력이 콘텐츠·전환장치가 되는 인터랙티브 우선", en: "Hero built around a 3-question quiz — interactive-first, where user input becomes both content and conversion device" }, previewH: 340 },
  { id: "v5", route: "/v5", brand: "V5 미니멀", desc: { ko: "미니멀 타이포 중심 · '적을수록 프리미엄', 헤어라인 그리드", en: "Minimal, typography-led · 'less is premium', hairline grid" }, previewH: 340 },
  { id: "v6", route: "/v6", brand: "V6 리빌", desc: { ko: "비포/애프터 드래그 리빌 히어로 · 실제 제품사진 슬라이더(role=slider)·스프링 물리, 감각 축 차별 (자동 landing r2 승자)", en: "Before/after drag-to-reveal hero · a real product-photo slider (role=slider) with spring physics, differentiating on tactile feel (auto landing r2 winner)" }, previewH: 340 },
  { id: "v7", route: "/v7", brand: "V7 대조표", desc: { ko: "AI 매칭 대조표 히어로 · 실 table+탭+아코디언 비교 위젯, 폼 계열 최초 표 기반 (자동 landing r4 승자)", en: "AI-match comparison-table hero · a real table + tabs + accordion widget, the form lineage's first table-based entry (auto landing r4 winner)" }, previewH: 340 },
  { id: "v8", route: "/v8", brand: "V8 다이얼", desc: { ko: "매칭 정확도 다이얼 히어로 · 원형 SVG 게이지 결과 시각화, 형태 신규성 (자동 landing r5 승자)", en: "Match-accuracy dial hero · a circular SVG gauge visualizes the result, a formal novelty (auto landing r5 winner)" }, previewH: 340 },
];

// Ⅱ SaaS 대시보드 — /dash 갤러리 16종(d7~d32, 아래 Step 2에서 원본 이전) + 기준작/제품
export const DASH_LAB_WORKS: Work[] = [
  { id: "d7", route: "/dash/d7", brand: "CASSANDRA", desc: { ko: "예측시장 확률 터미널 · 켜진 CRT 기기 프레이밍(베젤·스캔라인), 오실로스코프·캘리브레이션", en: "Prediction-market probability terminal · framed as a powered-on CRT instrument (bezel, scanlines), oscilloscope and calibration motifs" } },
  { id: "d9", route: "/dash/d9", brand: "STELE", desc: { ko: "소멸위기 언어 아카이빙 콘솔 · 거대 활자 KPI, 타이포그래픽 퍼널, 스위스 인터내셔널", en: "Endangered-language archiving console · oversized type for KPIs, a typographic funnel, Swiss International style" } },
  { id: "d12", route: "/dash/d12", brand: "QUARTERDECK", desc: { ko: "라이브서비스 게임 라이브옵스 · 서버탭 연동 갱신, 32섹터 헥스 영토전, 사이버펑크 아케이드", en: "Live-service game live-ops · server-tab-linked refresh, a 32-sector hex territory war, cyberpunk arcade" } },
  { id: "d16", route: "/dash/d16", brand: "LINEAGE", desc: { ko: "희귀 원예종 온실·교배 계보 · 번호매긴 도감 플레이트, SVG 교배 계보도, 식물학 세밀화", en: "Rare-cultivar greenhouse and breeding lineage · numbered field-guide plates, an SVG breeding pedigree, botanical illustration" } },
  { id: "d20", route: "/dash/d20", brand: "DAILIES", desc: { ko: "VFX 렌더팜·샷 파이프라인 · NLE 편집 타임라인 플레이헤드, 필터→컷 디밍 동기화, 시네마틱 다크", en: "VFX render-farm and shot pipeline · an NLE-style edit-timeline playhead, filter-to-cut dimming sync, cinematic dark" } },
  { id: "d22", route: "/dash/d22", brand: "HADAL", desc: { ko: "심해 ROV 플릿 관제 · 수심 단면+소나 스윕 히어로, 다이브 선택→7모듈 동기화, 다크 발광", en: "Deep-sea ROV fleet control · depth cross-section + sonar-sweep hero, dive selection syncs 7 modules, dark and luminous" } },
  { id: "d23", route: "/dash/d23", brand: "DATUM", desc: { ko: "건축 시공 관제 · 도면 시트 프레이밍(타이틀블록·REV), 클릭형 조닝 플랜+해칭 공정 단면, 라이트 제도판", en: "Construction-site control · framed as a drawing sheet (title block, revisions), a clickable zoning plan with hatched progress sections, a light drafting-table feel" } },
  { id: "d24", route: "/dash/d24", brand: "ASPECT", desc: { ko: "철도 CTC 관제 · 선로 계통도+시간-거리 운행선도, 신호현시 램프 발광, 다크 계전기 패널", en: "Rail CTC control · track schematic + time-distance train diagram, glowing signal-aspect lamps, a dark relay-panel look" } },
  { id: "d25", route: "/dash/d25", brand: "ROSTRUM", desc: { ko: "미술품 경매 세일플로어 · 추정가 밴드×낙찰가 스프레드, 티켓 스텁 로트 보드, 라이트 카탈로그", en: "Art-auction sale floor · estimate band vs. hammer-price spread, a ticket-stub lot board, light catalogue styling" } },
  { id: "d26", route: "/dash/d26", brand: "60HZ", desc: { ko: "전력 계통 급전 콘솔 · 단선 결선도+급전 스택+오리곡선, 통전 도체만 앰버 글로우, 다크 미믹보드", en: "Power-grid dispatch console · single-line diagram + dispatch stack + duck curve, amber glow only on live conductors, a dark mimic board" } },
  { id: "d27", route: "/dash/d27", brand: "AS-RUN", desc: { ko: "방송 편성 트래픽 로그 · EPG 테이블 자체가 히어로, 카본카피 로그 시트 프레이밍, 라이트 서식", en: "Broadcast traffic log · the EPG table is the hero itself, framed like a carbon-copy log sheet, light paper-form styling" } },
  { id: "d28", route: "/dash/d28", brand: "HOLDFIRE", desc: { ko: "로켓 발사 관제 · T-타임라인+Go/No-Go 롤콜 보드, 제논 서치라이트 빛 문법, 다크 홀드 스냅샷", en: "Rocket-launch control · T-minus timeline + Go/No-Go roll-call board, a xenon-searchlight lighting language, dark hold-status snapshot" } },
  { id: "d29", route: "/dash/d29", brand: "Waypoint", desc: { ko: "프로젝트 협업(Asana급) · 순백 라이트, 프로젝트 필터→전 위젯 동기화, 정렬 테이블·간트·워크로드·⌘K", en: "Project collaboration (Asana-grade) · pure-white light, project filter → all-widget sync, sortable table · gantt · workload · ⌘K" } },
  { id: "d30", route: "/dash/d30", brand: "Slotted", desc: { ko: "예약·미팅 스케줄링(Calendly급) · 순백 라이트, 이벤트타입 선택→히트맵·미팅목록 동기화, ⌘K·정렬 테이블", en: "Booking and meeting scheduling (Calendly-grade) · pure-white light, event-type selection syncs heatmap and meeting list, ⌘K and sortable tables" } },
  { id: "d31", route: "/dash/d31", brand: "Conduit", desc: { ko: "워크플로 자동화(n8n급) · 프로덕트 다크, 크로스헤어 차트·상태 필터→테이블·로그 동기화, 에러 급증 알림", en: "Workflow automation (n8n-grade) · product dark, crosshair chart and status filter sync table and log, error-spike alerts" } },
  { id: "d32", route: "/dash/d32", brand: "Meridian", desc: { ko: "자산 포트폴리오(Coinbase급) · 프로덕트 다크, 기간 토글 가격 차트·자산 선택→차트·상세 동기화, 배분 도넛", en: "Asset portfolio (Coinbase-grade) · product dark, period-toggle price chart, asset selection syncs chart and detail, allocation donut" } },
  { id: "d33", route: "/dash/d33", brand: "Keel", desc: { ko: "협업 칸반 파이프라인 · 뷰포트락 보드+컬럼 내부 스크롤, 딜 카드 드래그, 예측 차트 (자동 dash r1 승자)", en: "Collaborative kanban pipeline · viewport-locked board with per-column scroll, draggable deal cards, forecast chart (auto dash r1 winner)" } },
  { id: "d34", route: "/dash/d34", brand: "Pulse", desc: { ko: "SLA 라이브옵스 콘솔 · 다크 히어로+벤토, 레일 없는 밀도형 (자동 dash r2 승자)", en: "SLA live-ops console · dark hero + bento layout, a rail-free, high-density build (auto dash r2 winner)" } },
  { id: "d35", route: "/dash/d35", brand: "Tessera", desc: { ko: "자산배분 트리맵 콕핏 · 중첩 사각 비중 시각화, 즉시 가독 (자동 dash r7 승자)", en: "Asset-allocation treemap cockpit · nested rectangles visualize weighting, instantly legible (auto dash r7 winner)" } },
  { id: "d36", route: "/dash/d36", brand: "Chute", desc: { ko: "전환 퍼널 전용 페이지 · 트라페조이드 퍼널이 페이지 축, 단계 드롭오프 (자동 dash r8 승자)", en: "A page built around the conversion funnel · a trapezoid funnel forms the page's spine, stage-by-stage drop-off (auto dash r8 winner)" } },
  { id: "d37", route: "/dash/d37", brand: "Currents", desc: { ko: "수익귀속 생키 흐름도 · 흐름보존 다단 리본 콘솔 (자동 dash r9 승자)", en: "Revenue-attribution Sankey diagram · a flow-conserving, multi-stage ribbon console (auto dash r9 winner)" } },
  { id: "d38", route: "/dash/d38", brand: "Wavelength", desc: { ko: "온콜 로테이션 콘솔 · 24h 레이디얼 다이얼 지배 시각화, 인시던트 대응 (자동 dash r10 승자)", en: "On-call rotation console · dominated by a 24h radial-dial visualization, built for incident response (auto dash r10 winner)" } },
];

export const DASH_WORKS: Work[] = [
  ...DASH_LAB_WORKS,
  { id: "rg", route: "/dash-rg", brand: "Ridge", desc: { ko: "레퍼런스급 금융 대시보드 · 앱 셸·컴포넌트 시스템·⌘K — 서비스급 문법의 검증 기준작", en: "Reference-grade financial dashboard · app shell, component system, ⌘K — the benchmark for service-grade craft" } },
  { id: "app", route: "/dashboard", brand: "App — Dashboard", desc: { ko: "제품 대시보드 · 브랜드 다크 사이드바/헤더", en: "Product dashboard · brand-dark sidebar and header" } },
];

// Ⅲ 자유 창작 — /free 인덱스 27종 (아래 Step 2에서 원본 이전)
export const FREE_WORKS: Work[] = [
  { id: "f1", route: "/free/f1", brand: "여운 (YEOUN)", desc: { ko: "성층권에서 편지를 태우는 애도 의식 · ritual-tech, 웜블랙+앰버골드", en: "A mourning ritual that burns letters into the stratosphere · ritual-tech, warm black and amber gold" } },
  { id: "f2", route: "/free/f2", brand: "PIGMENT RIOT", desc: { ko: "매번 다시 섞는 무규칙 안료 랩 · 네온 색블록 맥시멀 카오스", en: "A pigment lab that remixes its own rules every batch · neon color-block maximalism" } },
  { id: "f3", route: "/free/f3", brand: "타래 (Tarae)", desc: { ko: "목소리를 실 무늬로 짜는 방직 스튜디오 · 종이·공예·손글씨", en: "A weaving studio that turns voices into thread patterns · paper, craft, handwriting" } },
  { id: "f4", route: "/free/f4", brand: "LUCID//OS", desc: { ko: "꿈에서 스킬을 컴파일하는 수면 OS · 레트로퓨처, 셸 로그 카피", en: "A sleep OS that compiles skills inside your dreams · retro-futurist, shell-log copy" } },
  { id: "f5", route: "/free/f5", brand: "TIMBRE", desc: { ko: "목소리 지문 향수 아틀리에 · 하이엔드 매거진, 삭선 검열 카피", en: "A perfume atelier built on your voiceprint · high-end magazine feel, strikethrough-censored copy" } },
  { id: "f6", route: "/free/f6", brand: "날것", desc: { ko: "정리 없이 그냥 쏟아내는 날것 기록 · 브루탈리즘 anti-design", en: "Raw, unedited outpouring with zero cleanup · brutalist anti-design" } },
  { id: "f7", route: "/free/f7", brand: "SPORE", desc: { ko: "90일 후 퇴비화되는 반그로스 오디오 소셜 · 유기체·블롭", en: "An anti-growth audio social network that composts itself after 90 days · organic, blob forms" } },
  { id: "f9", route: "/free/f9", brand: "VOLATILE", desc: { ko: "향수를 휘발 곡선 데이터로 만드는 계측 조향 · 사진 0장", en: "Instrument-led perfumery that renders scent as a volatility curve · zero photography" } },
  { id: "f10", route: "/free/f10", brand: "결 GYEOL", desc: { ko: "소리를 만지는 공감각 웨어러블 · 감각 번역", en: "A synesthetic wearable that lets you touch sound · sensory translation" } },
  { id: "f11", route: "/free/f11", brand: "KINETYPE", desc: { ko: "글자에 물리엔진을 이식하는 카이네틱 타이포 엔진 · 움직이는 타입", en: "A kinetic type engine that implants a physics engine into letterforms · type in motion" } },
  { id: "f12", route: "/free/f12", brand: "덕지 DEOKJI", desc: { ko: "콜라주 재료를 실물 배송하는 아날로그 다이어리 구독 · 맥시멀 자인", en: "An analog diary subscription that ships physical collage materials · maximalist zine design" } },
  { id: "f13", route: "/free/f13", brand: "VANISH.", desc: { ko: "당신의 실종을 영화처럼 기획하는 프로덕션 · 필름 누아르", en: "A production house that scripts your disappearance like a film · film noir" } },
  { id: "f14", route: "/free/f14", brand: "VERTEX", desc: { ko: "소리에 3D 좌표를 부여하는 공간 오디오 이어폰 · 진짜 3D·아나글리프", en: "Spatial-audio earphones that give sound 3D coordinates · true 3D, anaglyph styling" } },
  { id: "f15", route: "/free/f15", brand: "MAISON LACUNE", desc: { ko: "가격이 안 나오는 초프레스티지 향수 하우스 · 침묵의 사치", en: "An ultra-prestige perfume house with no listed price · the luxury of silence" } },
  { id: "f16", route: "/free/f16", brand: "몽상은행", desc: { ko: "잠·백일몽을 예치하면 몽상이자를 주는 가상 저축은행 · 파스텔 초현실", en: "A virtual savings bank that pays daydream interest on deposited sleep · pastel surrealism" } },
  { id: "f17", route: "/free/f17", brand: "QUARTER WASH", desc: { ko: "코인 빨래방을 오락실로 재발명 · CSS 픽셀아트·8비트", en: "Reinventing the coin laundromat as an arcade · CSS pixel art, 8-bit" } },
  { id: "f18", route: "/free/f18", brand: "새김 SAEGIM", desc: { ko: "한 문장을 화강암에 새겨 340m 지하에 1000년 봉인 · 모뉴멘탈·제의", en: "Carves one sentence into granite and seals it 340m underground for 1,000 years · monumental, ritualistic" } },
  { id: "f19", route: "/free/f19", brand: "BITROT", desc: { ko: "완벽한 사진을 의도적으로 부수는 데이터 부식 스튜디오 · 글리치·디지털붕괴", en: "A data-decay studio that deliberately corrupts perfect photos · glitch, digital collapse" } },
  { id: "f20", route: "/free/f20", brand: "FLORA CODEX", desc: { ko: "식물 표본을 채집·기록하고 향을 눌러 담는 허바리움 향수 구독 · 19세기 식물도감", en: "A herbarium perfume subscription that collects, records, and presses botanical scent · 19th-century field-guide aesthetic" } },
  { id: "f21", route: "/free/f21", brand: "SURGE", desc: { ko: "스프린트·점프의 폭발력을 와트로 측정하는 파워 트래커 · 스포츠 다이나믹", en: "A power tracker that measures sprint and jump explosiveness in watts · dynamic sports energy" } },
  { id: "f22", route: "/free/f22", brand: "DOSSIER.", desc: { ko: "커핑 노트로 원산지를 추리하는 미제사건 커피 구독 · 느와르·수사파일", en: "A cold-case coffee subscription where you deduce origin from cupping notes · noir case-file styling" } },
  { id: "f23", route: "/free/f23", brand: "PARALLAX", desc: { ko: "향의 강도를 천문학적 거리로 재는 향수 · 코스믹 럭셔리", en: "A perfume that measures scent intensity in astronomical distance · cosmic luxury" } },
  { id: "f24", route: "/free/f24", brand: "극미클럽 GEUKMI", desc: { ko: "뜯기 전까진 모르는 블라인드 극한맛 구독 · 맥시멀 미식 카오스", en: "A blind extreme-flavor subscription you can't identify until you tear it open · maximalist gourmet chaos" } },
  { id: "f25", route: "/free/f25", brand: "몬스터파킹", desc: { ko: "침대 밑 괴물을 그려 '주차'시키는 잠자리 의식 · 키즈 그림책 위트", en: "A bedtime ritual where you draw the monster under the bed and 'park' it · kids'-picture-book wit" } },
  { id: "f26", route: "/free/f26", brand: "여백 YEOBAEK", desc: { ko: "침묵 명상 타이머 + 실물 세트 · 젠 미니멀, 3초 롱프레스 CTA", en: "A silent-meditation timer paired with a physical object set · zen minimalism, 3-second long-press CTA" } },
  { id: "f28", route: "/free/f28", brand: "REMNANT", desc: { ko: "목소리는 사라지지 않는다 · 호러·언캐니", en: "Your voice never disappears · horror, uncanny" } },
  { id: "f30", route: "/free/f30", brand: "호외 Hoveh", desc: { ko: "매칭=취재·요금제=광고단수인 신문형 데이팅 앱 · 타블로이드", en: "A newspaper-styled dating app where matching is reporting and pricing is ad rates · tabloid design" } },
];
// 인벤토리 제외 기록: /lab(랜딩 인덱스), app/src/app/pages/(main에 부재 — evolve 브랜치 잔재)
