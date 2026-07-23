// app/src/lib/works.ts — 전 작품 메타 단일 출처 (통합 갤러리 + 개별 갤러리 공용)
export type Work = {
  id: string;
  route: string;
  brand: string;
  desc: string;
  previewH?: number; // 카드 미리보기 높이(px), 기본 300
  status?: "winner" | "dropped" | "pending";
  round?: string;
  target?: "dash" | "landing" | "native";
  date?: string;
  image?: string; // 정적 스크린샷 경로(native 등 이미지 미리보기 work). 있으면 WorkCard가 iframe 대신 <img> 렌더
};

export const LAST_UPDATED = "2026-07-23"; // 결정론 규칙: 동적 Date 호출 금지, 갱신 시 수동 수정

export const NATIVE_WORKS: Work[] = [
  {
    id: "n1",
    route: "/native/notification-center.png",
    brand: "알림센터",
    desc: "알림 피드 · 날짜 그룹핑 · 미읽음 단일 액센트 (자동 native 라운드 auto-native-r1 승자)",
    target: "native",
    image: "/native/notification-center.png",
    status: "winner",
    round: "auto-native-r1",
    previewH: 420,
  },
];

// Ⅰ 랜딩 — 챔피언 + 진화 계보 v1~v5. (/lab 은 자체가 인덱스 페이지라 작품 아님 — 제외)
export const LANDING_WORKS: Work[] = [
  { id: "v0", route: "/", brand: "RE:픽 — 챔피언", desc: "현재 프로덕션 랜딩 · 에디토리얼 스플릿 히어로 + 제품 쇼케이스 (자동 라운드 R7 계보 승자)", previewH: 340 },
  { id: "v1", route: "/v1", brand: "V1 시네마틱", desc: "전면 이미지 몰입형 · 시네마틱 무드", previewH: 340 },
  { id: "v2", route: "/v2", brand: "V2 벤토", desc: "벤토 그리드 · 제품 중심 구성", previewH: 340 },
  { id: "v3", route: "/v3", brand: "V3 매거진", desc: "에디토리얼 매거진 · 롱폼 그리드", previewH: 340 },
  { id: "v4", route: "/v4", brand: "V4 대화형", desc: "히어로 3문항 퀴즈 — 사용자 입력이 콘텐츠·전환장치가 되는 인터랙티브 우선", previewH: 340 },
  { id: "v5", route: "/v5", brand: "V5 미니멀", desc: "미니멀 타이포 중심 · '적을수록 프리미엄', 헤어라인 그리드", previewH: 340 },
];

// Ⅱ SaaS 대시보드 — /dash 갤러리 16종(d7~d32, 아래 Step 2에서 원본 이전) + 기준작/제품
export const DASH_LAB_WORKS: Work[] = [
  { id: "d7", route: "/dash/d7", brand: "CASSANDRA", desc: "예측시장 확률 터미널 · 켜진 CRT 기기 프레이밍(베젤·스캔라인), 오실로스코프·캘리브레이션" },
  { id: "d9", route: "/dash/d9", brand: "STELE", desc: "소멸위기 언어 아카이빙 콘솔 · 거대 활자 KPI, 타이포그래픽 퍼널, 스위스 인터내셔널" },
  { id: "d12", route: "/dash/d12", brand: "QUARTERDECK", desc: "라이브서비스 게임 라이브옵스 · 서버탭 연동 갱신, 32섹터 헥스 영토전, 사이버펑크 아케이드" },
  { id: "d16", route: "/dash/d16", brand: "LINEAGE", desc: "희귀 원예종 온실·교배 계보 · 번호매긴 도감 플레이트, SVG 교배 계보도, 식물학 세밀화" },
  { id: "d20", route: "/dash/d20", brand: "DAILIES", desc: "VFX 렌더팜·샷 파이프라인 · NLE 편집 타임라인 플레이헤드, 필터→컷 디밍 동기화, 시네마틱 다크" },
  { id: "d22", route: "/dash/d22", brand: "HADAL", desc: "심해 ROV 플릿 관제 · 수심 단면+소나 스윕 히어로, 다이브 선택→7모듈 동기화, 다크 발광" },
  { id: "d23", route: "/dash/d23", brand: "DATUM", desc: "건축 시공 관제 · 도면 시트 프레이밍(타이틀블록·REV), 클릭형 조닝 플랜+해칭 공정 단면, 라이트 제도판" },
  { id: "d24", route: "/dash/d24", brand: "ASPECT", desc: "철도 CTC 관제 · 선로 계통도+시간-거리 운행선도, 신호현시 램프 발광, 다크 계전기 패널" },
  { id: "d25", route: "/dash/d25", brand: "ROSTRUM", desc: "미술품 경매 세일플로어 · 추정가 밴드×낙찰가 스프레드, 티켓 스텁 로트 보드, 라이트 카탈로그" },
  { id: "d26", route: "/dash/d26", brand: "60HZ", desc: "전력 계통 급전 콘솔 · 단선 결선도+급전 스택+오리곡선, 통전 도체만 앰버 글로우, 다크 미믹보드" },
  { id: "d27", route: "/dash/d27", brand: "AS-RUN", desc: "방송 편성 트래픽 로그 · EPG 테이블 자체가 히어로, 카본카피 로그 시트 프레이밍, 라이트 서식" },
  { id: "d28", route: "/dash/d28", brand: "HOLDFIRE", desc: "로켓 발사 관제 · T-타임라인+Go/No-Go 롤콜 보드, 제논 서치라이트 빛 문법, 다크 홀드 스냅샷" },
  { id: "d29", route: "/dash/d29", brand: "Waypoint", desc: "프로젝트 협업(Asana급) · 순백 라이트, 프로젝트 필터→전 위젯 동기화, 정렬 테이블·간트·워크로드·⌘K" },
  { id: "d30", route: "/dash/d30", brand: "Slotted", desc: "예약·미팅 스케줄링(Calendly급) · 순백 라이트, 이벤트타입 선택→히트맵·미팅목록 동기화, ⌘K·정렬 테이블" },
  { id: "d31", route: "/dash/d31", brand: "Conduit", desc: "워크플로 자동화(n8n급) · 프로덕트 다크, 크로스헤어 차트·상태 필터→테이블·로그 동기화, 에러 급증 알림" },
  { id: "d32", route: "/dash/d32", brand: "Meridian", desc: "자산 포트폴리오(Coinbase급) · 프로덕트 다크, 기간 토글 가격 차트·자산 선택→차트·상세 동기화, 배분 도넛" },
];

export const DASH_WORKS: Work[] = [
  ...DASH_LAB_WORKS,
  { id: "rg", route: "/dash-rg", brand: "Ridge", desc: "레퍼런스급 금융 대시보드 · 앱 셸·컴포넌트 시스템·⌘K — 서비스급 문법의 검증 기준작" },
  { id: "app", route: "/dashboard", brand: "RE:픽 대시보드", desc: "RE:픽 제품 대시보드 · 브랜드 다크 사이드바/헤더" },
];

// Ⅲ 자유 창작 — /free 인덱스 27종 (아래 Step 2에서 원본 이전)
export const FREE_WORKS: Work[] = [
  { id: "f1", route: "/free/f1", brand: "여운 (YEOUN)", desc: "성층권에서 편지를 태우는 애도 의식 · ritual-tech, 웜블랙+앰버골드" },
  { id: "f2", route: "/free/f2", brand: "PIGMENT RIOT", desc: "매번 다시 섞는 무규칙 안료 랩 · 네온 색블록 맥시멀 카오스" },
  { id: "f3", route: "/free/f3", brand: "타래 (Tarae)", desc: "목소리를 실 무늬로 짜는 방직 스튜디오 · 종이·공예·손글씨" },
  { id: "f4", route: "/free/f4", brand: "LUCID//OS", desc: "꿈에서 스킬을 컴파일하는 수면 OS · 레트로퓨처, 셸 로그 카피" },
  { id: "f5", route: "/free/f5", brand: "TIMBRE", desc: "목소리 지문 향수 아틀리에 · 하이엔드 매거진, 삭선 검열 카피" },
  { id: "f6", route: "/free/f6", brand: "날것", desc: "정리 없이 그냥 쏟아내는 날것 기록 · 브루탈리즘 anti-design" },
  { id: "f7", route: "/free/f7", brand: "SPORE", desc: "90일 후 퇴비화되는 반그로스 오디오 소셜 · 유기체·블롭" },
  { id: "f9", route: "/free/f9", brand: "VOLATILE", desc: "향수를 휘발 곡선 데이터로 만드는 계측 조향 · 사진 0장" },
  { id: "f10", route: "/free/f10", brand: "결 GYEOL", desc: "소리를 만지는 공감각 웨어러블 · 감각 번역" },
  { id: "f11", route: "/free/f11", brand: "KINETYPE", desc: "글자에 물리엔진을 이식하는 카이네틱 타이포 엔진 · 움직이는 타입" },
  { id: "f12", route: "/free/f12", brand: "덕지 DEOKJI", desc: "콜라주 재료를 실물 배송하는 아날로그 다이어리 구독 · 맥시멀 자인" },
  { id: "f13", route: "/free/f13", brand: "VANISH.", desc: "당신의 실종을 영화처럼 기획하는 프로덕션 · 필름 누아르" },
  { id: "f14", route: "/free/f14", brand: "VERTEX", desc: "소리에 3D 좌표를 부여하는 공간 오디오 이어폰 · 진짜 3D·아나글리프" },
  { id: "f15", route: "/free/f15", brand: "MAISON LACUNE", desc: "가격이 안 나오는 초프레스티지 향수 하우스 · 침묵의 사치" },
  { id: "f16", route: "/free/f16", brand: "몽상은행", desc: "잠·백일몽을 예치하면 몽상이자를 주는 가상 저축은행 · 파스텔 초현실" },
  { id: "f17", route: "/free/f17", brand: "QUARTER WASH", desc: "코인 빨래방을 오락실로 재발명 · CSS 픽셀아트·8비트" },
  { id: "f18", route: "/free/f18", brand: "새김 SAEGIM", desc: "한 문장을 화강암에 새겨 340m 지하에 1000년 봉인 · 모뉴멘탈·제의" },
  { id: "f19", route: "/free/f19", brand: "BITROT", desc: "완벽한 사진을 의도적으로 부수는 데이터 부식 스튜디오 · 글리치·디지털붕괴" },
  { id: "f20", route: "/free/f20", brand: "FLORA CODEX", desc: "식물 표본을 채집·기록하고 향을 눌러 담는 허바리움 향수 구독 · 19세기 식물도감" },
  { id: "f21", route: "/free/f21", brand: "SURGE", desc: "스프린트·점프의 폭발력을 와트로 측정하는 파워 트래커 · 스포츠 다이나믹" },
  { id: "f22", route: "/free/f22", brand: "DOSSIER.", desc: "커핑 노트로 원산지를 추리하는 미제사건 커피 구독 · 느와르·수사파일" },
  { id: "f23", route: "/free/f23", brand: "PARALLAX", desc: "향의 강도를 천문학적 거리로 재는 향수 · 코스믹 럭셔리" },
  { id: "f24", route: "/free/f24", brand: "극미클럽 GEUKMI", desc: "뜯기 전까진 모르는 블라인드 극한맛 구독 · 맥시멀 미식 카오스" },
  { id: "f25", route: "/free/f25", brand: "몬스터파킹", desc: "침대 밑 괴물을 그려 '주차'시키는 잠자리 의식 · 키즈 그림책 위트" },
  { id: "f26", route: "/free/f26", brand: "여백 YEOBAEK", desc: "침묵 명상 타이머 + 실물 세트 · 젠 미니멀, 3초 롱프레스 CTA" },
  { id: "f28", route: "/free/f28", brand: "REMNANT", desc: "목소리는 사라지지 않는다 · 호러·언캐니" },
  { id: "f30", route: "/free/f30", brand: "호외 Hoveh", desc: "매칭=취재·요금제=광고단수인 신문형 데이팅 앱 · 타블로이드" },
];
// 인벤토리 제외 기록: /lab(랜딩 인덱스), app/src/app/pages/(main에 부재 — evolve 브랜치 잔재)
