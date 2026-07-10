/**
 * AS-RUN — 방송 편성 트래픽 로그 더미 데이터
 *
 * 전부 결정론적으로 생성한다 (Math.random / Date.now 금지 — hydration 안전).
 * 시각은 "방송일(broadcast day)" 관례를 따라 06:00을 기준(0분)으로 삼고,
 * 자정 이후 편성은 24:00~26:00 표기로 이어간다 (예: 01:30 → 25:30).
 */

export type Genre =
  | "뉴스"
  | "드라마"
  | "예능"
  | "영화"
  | "스포츠"
  | "다큐"
  | "키즈"
  | "뮤직"
  | "시사교양";

export type ReviewStatus = "approved" | "pending" | "rejected" | "exempt";
export type ReviewKind = "정기심의" | "재심의" | "사전심의" | "긴급점검";
export type SlotStatus = "sold" | "hold" | "open";

export interface Channel {
  id: string;
  no: number;
  call: string;
  name: string;
  focus: Genre;
}

export interface ProgramSlot {
  id: string;
  channelId: string;
  dayIndex: number;
  slotIndex: number;
  startRaw: number;
  endRaw: number;
  duration: number;
  genre: Genre;
  title: string;
  rerun: boolean;
  live: boolean;
  preempted?: { reason: string };
  reviewStatus: ReviewStatus;
  reviewNote?: string;
  rating: number;
  adRevenue: number;
  pd: string;
  synopsis: string;
}

export interface DaySchedule {
  dayIndex: number;
  isWeekend: boolean;
  durations: number[];
  rows: { channel: Channel; programs: ProgramSlot[] }[];
}

export interface DaySummary {
  dayIndex: number;
  label: string;
  dateLabel: string;
  totalAdRevenue: number;
  avgRating: number;
  reviewFlags: number;
  preemptedCount: number;
  liveCount: number;
  rerunCount: number;
}

export interface ReviewItem {
  id: string;
  programId: string;
  dayIndex: number;
  channelName: string;
  title: string;
  startRaw: number;
  endRaw: number;
  reviewStatus: ReviewStatus;
  reviewNote?: string;
  deadlineRaw: number;
  kind: ReviewKind;
}

export interface RatingPoint {
  minute: number;
  value: number;
}

export interface AdSlot {
  index: number;
  breakIndex: number;
  status: SlotStatus;
  advertiser?: string;
  price: number;
}

/* ------------------------------------------------------------------ */
/* 결정론적 해시 (FNV-1a 변형) — 서버/클라 항상 동일 결과              */
/* ------------------------------------------------------------------ */

function seedHash(...nums: number[]): number {
  let h = 2166136261;
  for (const n of nums) {
    h ^= n;
    h = Math.imul(h, 16777619);
    h ^= h >>> 13;
  }
  return ((h >>> 0) % 100000) / 100000;
}

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return h;
}

/* ------------------------------------------------------------------ */
/* 상수                                                                */
/* ------------------------------------------------------------------ */

export const DAYS = ["월", "화", "수", "목", "금", "토", "일"] as const;
export const DATE_LABELS = [
  "07.06",
  "07.07",
  "07.08",
  "07.09",
  "07.10",
  "07.11",
  "07.12",
];
export const WEEK_LABEL = "2026 · 28주차";
export const STATION_NAME = "아우로라방송";
export const FORM_CODE = "FORM AS-RUN-07";
export const NOW_DAY_INDEX = 2;
export const NOW_RAW = 20 * 60 + 35; // 20:35

export const CHANNELS: Channel[] = [
  { id: "a1", no: 1, call: "AURORA 1", name: "아우로라 1", focus: "시사교양" },
  { id: "a2", no: 2, call: "AURORA DRAMA", name: "아우로라 드라마", focus: "드라마" },
  { id: "a3", no: 3, call: "AURORA MOVIE", name: "아우로라 무비", focus: "영화" },
  { id: "a4", no: 4, call: "AURORA SPORTS", name: "아우로라 스포츠", focus: "스포츠" },
  { id: "a5", no: 5, call: "AURORA NEWS", name: "아우로라 뉴스", focus: "뉴스" },
  { id: "a6", no: 6, call: "AURORA KIDS", name: "아우로라 키즈", focus: "키즈" },
  { id: "a7", no: 7, call: "AURORA MUSIC", name: "아우로라 뮤직", focus: "뮤직" },
  { id: "a8", no: 8, call: "AURORA DOCS", name: "아우로라 다큐", focus: "다큐" },
];

export const WEEKDAY_DURATIONS = [
  30, 90, 60, 90, 90, 30, 60, 90, 90, 60, 60, 90, 90, 60, 60, 90, 60,
];
export const WEEKEND_DURATIONS = [
  120, 90, 90, 60, 90, 90, 60, 90, 120, 90, 90, 90, 120,
];

export const WEEKDAY_PRIME_INDEX = 12; // 20:00-21:30
export const WEEKEND_PRIME_INDEX = 10; // 21:00-22:30

const GENRE_BASE_RATING: Record<Genre, number> = {
  드라마: 4.2,
  예능: 3.4,
  뉴스: 3.6,
  영화: 3.8,
  스포츠: 3.2,
  다큐: 2.1,
  키즈: 2.0,
  뮤직: 2.0,
  시사교양: 2.4,
};

const AD_RATE_BASE: Record<Genre, number> = {
  드라마: 520,
  예능: 430,
  뉴스: 610,
  영화: 380,
  스포츠: 560,
  다큐: 190,
  키즈: 240,
  뮤직: 210,
  시사교양: 230,
};

const SYNOPSIS: Record<Genre, string> = {
  드라마: "얽힌 인연과 선택이 만들어내는 이번 화의 이야기.",
  예능: "출연진이 예측불가 미션에 도전하는 리얼리티 구성.",
  뉴스: "오늘의 주요 이슈를 현장 중계와 함께 정리해 전달합니다.",
  영화: "엄선된 화제작을 광고 없이 편성해 만나보는 특선 상영.",
  스포츠: "현장의 긴장감을 그대로 전하는 생중계 및 하이라이트.",
  다큐: "취재와 기록으로 완성한 심층 관찰 다큐멘터리.",
  키즈: "상상력을 자극하는 어린이 눈높이 이야기 구성.",
  뮤직: "다양한 무대와 아티스트를 소개하는 음악 프로그램.",
  시사교양: "생활 속 이슈를 풀어내는 정보 교양 프로그램.",
};

const PD_NAMES = ["강지현", "오태윤", "박서인", "문가을", "유재민", "송하나"];
const ADVERTISERS = [
  "한빛전자", "다솜생명", "청연식품", "블루카드", "원모어몰", "그린모빌리티",
  "포레스트커피", "스카이텔레콤", "에코마트", "라온뷰티", "바른치과", "국민여행사",
];
const REVIEW_NOTES = [
  "방송자막 오류 검수 필요",
  "선정성 표현 확인 요청",
  "간접광고 노출시간 재검토",
  "재난문자 자막 오버랩 확인",
  "저작권 음원 사용 확인",
  "수위 장면 편집 확인 요청",
];

/* ------------------------------------------------------------------ */
/* 채널별 평일 템플릿 (17슬롯, WEEKDAY_DURATIONS와 1:1)                */
/* ------------------------------------------------------------------ */

interface Tmpl {
  genre: Genre;
  title: string;
  rerun?: boolean;
  live?: boolean;
}

const WEEKDAY_TEMPLATES: Record<string, Tmpl[]> = {
  a1: [
    { genre: "뉴스", title: "모닝브리핑" },
    { genre: "예능", title: "굿모닝 아우로라" },
    { genre: "드라마", title: "아침드라마 벚꽃엔딩", rerun: true },
    { genre: "시사교양", title: "여유만만 토크" },
    { genre: "예능", title: "아침마당 스페셜" },
    { genre: "뉴스", title: "정오종합뉴스" },
    { genre: "드라마", title: "오후의 정원" },
    { genre: "드라마", title: "특선드라마 붉은 정원", rerun: true },
    { genre: "다큐", title: "다큐인사이트" },
    { genre: "시사교양", title: "세상만사" },
    { genre: "뉴스", title: "저녁종합뉴스" },
    { genre: "드라마", title: "일일드라마 청춘기록" },
    { genre: "드라마", title: "월화드라마 붉은 정원" },
    { genre: "시사교양", title: "그것을 알고싶다" },
    { genre: "뉴스", title: "심야뉴스데스크" },
    { genre: "다큐", title: "다큐인사이트", rerun: true },
    { genre: "시사교양", title: "클로징 나이트" },
  ],
  a2: [
    { genre: "드라마", title: "새벽 하이라이트" },
    { genre: "드라마", title: "아침드라마 스페셜", rerun: true },
    { genre: "드라마", title: "오전드라마 벨" },
    { genre: "드라마", title: "트렌디로맨스", rerun: true },
    { genre: "드라마", title: "점심드라마극장" },
    { genre: "드라마", title: "드라마 하이라이트" },
    { genre: "드라마", title: "옛날드라마 명작선", rerun: true },
    { genre: "드라마", title: "오후드라마 첫사랑" },
    { genre: "드라마", title: "인기절정 시대극", rerun: true },
    { genre: "드라마", title: "트렌디로맨스 스페셜" },
    { genre: "드라마", title: "저녁 하이라이트" },
    { genre: "드라마", title: "일일드라마 붉은실" },
    { genre: "드라마", title: "수목드라마 야상곡" },
    { genre: "드라마", title: "미니시리즈 이별의 온도" },
    { genre: "드라마", title: "심야로맨스극장", rerun: true },
    { genre: "드라마", title: "미드나잇시네마" },
    { genre: "드라마", title: "새벽 재방송", rerun: true },
  ],
  a3: [
    { genre: "영화", title: "새벽영화 하이라이트" },
    { genre: "영화", title: "명작극장 시네마천국", rerun: true },
    { genre: "영화", title: "오전특선 로맨틱코미디" },
    { genre: "영화", title: "가족영화관" },
    { genre: "영화", title: "액션 더블피처 PART.1" },
    { genre: "영화", title: "영화뉴스 브리핑" },
    { genre: "영화", title: "액션 더블피처 PART.2" },
    { genre: "영화", title: "SF특선 은하의 끝" },
    { genre: "영화", title: "명감독전 회고전" },
    { genre: "영화", title: "애니메이션 극장판" },
    { genre: "영화", title: "저녁특선 스릴러" },
    { genre: "영화", title: "블록버스터 위크 프리뷰" },
    { genre: "영화", title: "주말특선 대작영화" },
    { genre: "영화", title: "심야스릴러극장" },
    { genre: "영화", title: "컬트클래식 명작선" },
    { genre: "영화", title: "심야 더블피처" },
    { genre: "영화", title: "새벽 재방영화", rerun: true },
  ],
  a4: [
    { genre: "스포츠", title: "스포츠뉴스 새벽판" },
    { genre: "스포츠", title: "해외축구 하이라이트", rerun: true },
    { genre: "스포츠", title: "어제의 명장면", rerun: true },
    { genre: "스포츠", title: "야구매거진" },
    { genre: "스포츠", title: "농구클래식", rerun: true },
    { genre: "스포츠", title: "스포츠 정오뉴스" },
    { genre: "스포츠", title: "e스포츠 리그 프리뷰" },
    { genre: "스포츠", title: "격투기 명승부 스페셜" },
    { genre: "스포츠", title: "골프 라운드 다시보기", rerun: true },
    { genre: "스포츠", title: "경기분석 라운지" },
    { genre: "스포츠", title: "스포츠 저녁뉴스" },
    { genre: "스포츠", title: "프로야구 라이브", live: true },
    { genre: "스포츠", title: "프로야구 라이브 연장", live: true },
    { genre: "스포츠", title: "승부의 순간 하이라이트" },
    { genre: "스포츠", title: "심야 격투기 스페셜" },
    { genre: "스포츠", title: "해외스포츠 매거진" },
    { genre: "스포츠", title: "스포츠 재방 모음", rerun: true },
  ],
  a5: [
    { genre: "뉴스", title: "새벽뉴스" },
    { genre: "뉴스", title: "굿모닝뉴스" },
    { genre: "뉴스", title: "경제브리핑" },
    { genre: "뉴스", title: "930뉴스와이드" },
    { genre: "뉴스", title: "정오뉴스 스페셜" },
    { genre: "뉴스", title: "속보센터" },
    { genre: "뉴스", title: "오후뉴스 라이브", live: true },
    { genre: "뉴스", title: "심층리포트 탐사" },
    { genre: "뉴스", title: "국제뉴스 브리핑" },
    { genre: "뉴스", title: "생활경제뉴스" },
    { genre: "뉴스", title: "메인뉴스데스크", live: true },
    { genre: "뉴스", title: "이슈앤이슈 토론" },
    { genre: "뉴스", title: "저녁종합뉴스9", live: true },
    { genre: "뉴스", title: "뉴스포커스 인터뷰" },
    { genre: "뉴스", title: "심야뉴스라인", live: true },
    { genre: "뉴스", title: "국제시사 다큐" },
    { genre: "뉴스", title: "새벽뉴스 재방", rerun: true },
  ],
  a6: [
    { genre: "키즈", title: "아침 동요나라" },
    { genre: "키즈", title: "꼬마탐정단" },
    { genre: "키즈", title: "공룡친구들" },
    { genre: "키즈", title: "숫자놀이 팡팡" },
    { genre: "키즈", title: "동화나라극장" },
    { genre: "키즈", title: "키즈뉴스" },
    { genre: "키즈", title: "로봇전대 파워큐브" },
    { genre: "키즈", title: "마법소녀 스텔라" },
    { genre: "키즈", title: "과학탐험대" },
    { genre: "키즈", title: "요리조리 키친" },
    { genre: "키즈", title: "저녁동화시간" },
    { genre: "키즈", title: "가족극장 애니메이션" },
    { genre: "키즈", title: "인기애니 총집편" },
    { genre: "키즈", title: "잠자리동화" },
    { genre: "키즈", title: "야간재방 꼬마탐정단", rerun: true },
    { genre: "키즈", title: "심야 키즈뮤직" },
    { genre: "키즈", title: "새벽 재방송", rerun: true },
  ],
  a7: [
    { genre: "뮤직", title: "새벽 감성 플레이리스트" },
    { genre: "뮤직", title: "모닝뮤직박스" },
    { genre: "뮤직", title: "이주의 차트" },
    { genre: "뮤직", title: "라이브클립 모음" },
    { genre: "뮤직", title: "뮤직다큐 비하인드" },
    { genre: "뮤직", title: "정오 인기가요" },
    { genre: "뮤직", title: "버스커즈 로드뮤직" },
    { genre: "뮤직", title: "콘서트실황 스페셜" },
    { genre: "뮤직", title: "인디음악관" },
    { genre: "뮤직", title: "뮤직토크 라운지" },
    { genre: "뮤직", title: "저녁 인기차트" },
    { genre: "뮤직", title: "뮤직뱅크 프리뷰" },
    { genre: "뮤직", title: "생방송 뮤직스테이지", live: true },
    { genre: "뮤직", title: "차트무대 다시보기", rerun: true },
    { genre: "뮤직", title: "심야 발라드 라디오" },
    { genre: "뮤직", title: "올나잇 뮤직마라톤" },
    { genre: "뮤직", title: "새벽 재방송", rerun: true },
  ],
  a8: [
    { genre: "다큐", title: "새벽 자연다큐", rerun: true },
    { genre: "다큐", title: "지구의 아침" },
    { genre: "다큐", title: "역사탐구 그날" },
    { genre: "다큐", title: "다큐 인문학기행" },
    { genre: "다큐", title: "세계문화탐방" },
    { genre: "다큐", title: "다큐브리핑" },
    { genre: "다큐", title: "야생의 사계" },
    { genre: "다큐", title: "심층다큐 3부작 1부" },
    { genre: "다큐", title: "심층다큐 3부작 2부" },
    { genre: "다큐", title: "환경리포트" },
    { genre: "다큐", title: "저녁교양 스페셜" },
    { genre: "다큐", title: "다큐프리미엄 예고편" },
    { genre: "다큐", title: "특별기획 다큐멘터리" },
    { genre: "다큐", title: "인문교양 강연" },
    { genre: "다큐", title: "심야 우주다큐" },
    { genre: "다큐", title: "심야 다큐극장" },
    { genre: "다큐", title: "새벽 재방송", rerun: true },
  ],
};

/* ------------------------------------------------------------------ */
/* 채널별 주말 템플릿 (13슬롯, WEEKEND_DURATIONS와 1:1)                */
/* ------------------------------------------------------------------ */

interface WTmpl extends Tmpl {
  altSunTitle?: string;
}

const WEEKEND_TEMPLATES: Record<string, WTmpl[]> = {
  a1: [
    { genre: "시사교양", title: "주말 아침브리핑" },
    { genre: "예능", title: "해피 위켄드" },
    { genre: "예능", title: "가족오락관" },
    { genre: "뉴스", title: "정오종합뉴스" },
    { genre: "다큐", title: "주말 다큐극장" },
    { genre: "예능", title: "전국노래자랑", altSunTitle: "동네한바퀴" },
    { genre: "시사교양", title: "이슈 브런치" },
    { genre: "다큐", title: "세계는 지금" },
    { genre: "예능", title: "주말 버라이어티 빅쇼" },
    { genre: "예능", title: "토요일은 즐거워", altSunTitle: "일요일이 좋다" },
    { genre: "예능", title: "주말 저녁 예능 PRIME" },
    { genre: "시사교양", title: "심야토론" },
    { genre: "뉴스", title: "심야뉴스와 다큐", rerun: true },
  ],
  a2: [
    { genre: "드라마", title: "새벽 정주행 특선", rerun: true },
    { genre: "드라마", title: "주말 특별편성 시즌1" },
    { genre: "드라마", title: "인기 시즌 몰아보기" },
    { genre: "드라마", title: "브런치 드라마" },
    { genre: "드라마", title: "정주행 드라마관" },
    { genre: "드라마", title: "주말의 명작" },
    { genre: "드라마", title: "가족드라마 스페셜" },
    { genre: "드라마", title: "저녁 프리뷰 극장" },
    { genre: "드라마", title: "주말특별기획 2부작 1부" },
    { genre: "드라마", title: "주말특별기획 2부작 2부" },
    { genre: "드라마", title: "토일드라마 별의 항로" },
    { genre: "드라마", title: "화제의 미니시리즈 정주행" },
    { genre: "드라마", title: "심야 몰아보기 마라톤" },
  ],
  a3: [
    { genre: "영화", title: "주말 아침영화" },
    { genre: "영화", title: "가족영화 스페셜" },
    { genre: "영화", title: "인기시리즈 정주행" },
    { genre: "영화", title: "영화매거진 위켄드" },
    { genre: "영화", title: "액션 트리플 PART.1" },
    { genre: "영화", title: "액션 트리플 PART.2" },
    { genre: "영화", title: "애니메이션 극장판 스페셜" },
    { genre: "영화", title: "명작 리마스터" },
    { genre: "영화", title: "주말 블록버스터 특선", altSunTitle: "일요명화극장" },
    { genre: "영화", title: "화제작 프리미어" },
    { genre: "영화", title: "주말특선 대작영화" },
    { genre: "영화", title: "심야 컬트무비" },
    { genre: "영화", title: "올나잇 시네마" },
  ],
  a4: [
    { genre: "스포츠", title: "위켄드 스포츠 브리핑" },
    { genre: "스포츠", title: "해외축구 위클리" },
    { genre: "스포츠", title: "명승부 재조명", rerun: true },
    { genre: "스포츠", title: "스포츠 매거진" },
    { genre: "스포츠", title: "격투기 명장면" },
    { genre: "스포츠", title: "골프 라이브", live: true },
    { genre: "스포츠", title: "골프 라이브 연장", live: true },
    { genre: "스포츠", title: "e스포츠 위켄드 리그" },
    { genre: "스포츠", title: "축구 슈퍼매치 라이브", altSunTitle: "프로야구 정규시즌 라이브", live: true },
    { genre: "스포츠", title: "경기분석 스페셜" },
    { genre: "스포츠", title: "주말 프라임리그 라이브", altSunTitle: "일요 빅매치 라이브", live: true },
    { genre: "스포츠", title: "승부의 순간 총정리" },
    { genre: "스포츠", title: "심야 스포츠 하이라이트" },
  ],
  a5: [
    { genre: "뉴스", title: "주말 아침뉴스" },
    { genre: "뉴스", title: "위켄드 뉴스와이드" },
    { genre: "뉴스", title: "시사토크 아침마당" },
    { genre: "뉴스", title: "정오뉴스" },
    { genre: "뉴스", title: "탐사보도 심층" },
    { genre: "뉴스", title: "국제뉴스 위클리" },
    { genre: "뉴스", title: "생활정보 브리핑" },
    { genre: "뉴스", title: "이슈앤토크" },
    { genre: "뉴스", title: "저녁뉴스 라이브", live: true },
    { genre: "뉴스", title: "시사기획 창" },
    { genre: "뉴스", title: "주말종합뉴스", live: true },
    { genre: "뉴스", title: "심층토론" },
    { genre: "뉴스", title: "심야뉴스라인", live: true },
  ],
  a6: [
    { genre: "키즈", title: "주말 동요나라" },
    { genre: "키즈", title: "꼬마탐정단 스페셜" },
    { genre: "키즈", title: "공룡친구들 극장판" },
    { genre: "키즈", title: "숫자놀이 팡팡 위켄드" },
    { genre: "키즈", title: "동화나라 극장" },
    { genre: "키즈", title: "로봇전대 파워큐브 스페셜" },
    { genre: "키즈", title: "마법소녀 스텔라 극장판" },
    { genre: "키즈", title: "과학탐험대 위켄드" },
    { genre: "키즈", title: "가족극장 애니메이션 더블" },
    { genre: "키즈", title: "인기애니 총집편" },
    { genre: "키즈", title: "주말 애니메이션 PRIME" },
    { genre: "키즈", title: "잠자리동화 스페셜" },
    { genre: "키즈", title: "심야 키즈 마라톤" },
  ],
  a7: [
    { genre: "뮤직", title: "주말 모닝뮤직" },
    { genre: "뮤직", title: "차트 위클리" },
    { genre: "뮤직", title: "라이브클립 스페셜" },
    { genre: "뮤직", title: "뮤직다큐 위켄드" },
    { genre: "뮤직", title: "버스커즈 로드뮤직 스페셜" },
    { genre: "뮤직", title: "콘서트실황 위켄드" },
    { genre: "뮤직", title: "인디음악관 스페셜" },
    { genre: "뮤직", title: "뮤직토크 라운지 위켄드" },
    { genre: "뮤직", title: "뮤직뱅크 위켄드 특집" },
    { genre: "뮤직", title: "차트무대 다시보기", rerun: true },
    { genre: "뮤직", title: "생방송 뮤직스테이지", live: true },
    { genre: "뮤직", title: "심야 발라드 라디오" },
    { genre: "뮤직", title: "올나잇 뮤직마라톤" },
  ],
  a8: [
    { genre: "다큐", title: "주말 자연다큐" },
    { genre: "다큐", title: "지구의 아침 스페셜" },
    { genre: "다큐", title: "역사탐구 위켄드" },
    { genre: "다큐", title: "인문학기행 스페셜" },
    { genre: "다큐", title: "세계문화탐방 위켄드" },
    { genre: "다큐", title: "야생의 사계 스페셜" },
    { genre: "다큐", title: "환경리포트 위켄드" },
    { genre: "다큐", title: "심층다큐 2부작 1부" },
    { genre: "다큐", title: "심층다큐 2부작 2부" },
    { genre: "다큐", title: "다큐프리미엄" },
    { genre: "다큐", title: "특별기획 다큐멘터리" },
    { genre: "다큐", title: "인문교양 강연 스페셜" },
    { genre: "다큐", title: "심야 우주다큐" },
  ],
};

/* ------------------------------------------------------------------ */
/* 생성 로직                                                           */
/* ------------------------------------------------------------------ */

function toStarts(durations: number[]): number[] {
  const starts: number[] = [];
  let acc = 0;
  for (const d of durations) {
    starts.push(acc);
    acc += d;
  }
  return starts;
}

function computeRating(genre: Genre, isPrime: boolean, live: boolean, h: number): number {
  const base = GENRE_BASE_RATING[genre];
  const primeBonus = isPrime ? 2.6 : 0;
  const liveBonus = live ? 0.7 : 0;
  const variance = (h - 0.5) * 1.8;
  const value = Math.max(0.3, base + primeBonus + liveBonus + variance);
  return Math.round(value * 10) / 10;
}

function computeAdRevenue(genre: Genre, duration: number, rating: number): number {
  const factor = 0.7 + rating / 10;
  const value = (duration / 30) * AD_RATE_BASE[genre] * factor;
  return Math.round(value) * 10000;
}

function computeReview(
  genre: Genre,
  live: boolean,
  h: number,
  noteH: number,
): { reviewStatus: ReviewStatus; reviewNote?: string } {
  if (live && genre === "뉴스") return { reviewStatus: "exempt" };
  if (h < 0.86) return { reviewStatus: "approved" };
  const note = REVIEW_NOTES[Math.floor(noteH * REVIEW_NOTES.length)];
  if (h < 0.97) return { reviewStatus: "pending", reviewNote: note };
  return { reviewStatus: "rejected", reviewNote: note };
}

export function buildDaySchedule(dayIndex: number): DaySchedule {
  const isWeekend = dayIndex >= 5;
  const durations = isWeekend ? WEEKEND_DURATIONS : WEEKDAY_DURATIONS;
  const starts = toStarts(durations);
  const primeIndex = isWeekend ? WEEKEND_PRIME_INDEX : WEEKDAY_PRIME_INDEX;
  const isSun = dayIndex === 6;

  const rows = CHANNELS.map((channel, chIdx) => {
    const templates = isWeekend ? WEEKEND_TEMPLATES[channel.id] : WEEKDAY_TEMPLATES[channel.id];
    const programs: ProgramSlot[] = templates.map((tmpl, slotIndex) => {
      const duration = durations[slotIndex];
      const startRaw = 360 + starts[slotIndex];
      const endRaw = startRaw + duration;
      const id = `${channel.id}-d${dayIndex}-s${slotIndex}`;

      const ratingH = seedHash(dayIndex, chIdx, slotIndex, 11);
      const reviewH = seedHash(dayIndex, chIdx, slotIndex, 29);
      const noteH = seedHash(dayIndex, chIdx, slotIndex, 41);
      const pdH = seedHash(dayIndex, chIdx, slotIndex, 97);

      const isPrime = slotIndex === primeIndex;
      const live = !!tmpl.live;
      const rating = computeRating(tmpl.genre, isPrime, live, ratingH);
      const adRevenue = computeAdRevenue(tmpl.genre, duration, rating);
      const review = computeReview(tmpl.genre, live, reviewH, noteH);

      let title = isSun && "altSunTitle" in tmpl && (tmpl as WTmpl).altSunTitle
        ? (tmpl as WTmpl).altSunTitle!
        : tmpl.title;
      let rerun = !!tmpl.rerun;
      let preempted: { reason: string } | undefined;
      let liveFinal = live;

      if (dayIndex === 3 && channel.id === "a4" && slotIndex === 11) {
        preempted = { reason: "우천취소" };
        title = "긴급 재방송 — 어제의 명장면";
        rerun = true;
        liveFinal = false;
      }

      return {
        id,
        channelId: channel.id,
        dayIndex,
        slotIndex,
        startRaw,
        endRaw,
        duration,
        genre: tmpl.genre,
        title,
        rerun,
        live: liveFinal,
        preempted,
        reviewStatus: preempted ? "exempt" : review.reviewStatus,
        reviewNote: preempted ? undefined : review.reviewNote,
        rating,
        adRevenue,
        pd: PD_NAMES[Math.floor(pdH * PD_NAMES.length)],
        synopsis: SYNOPSIS[tmpl.genre],
      };
    });
    return { channel, programs };
  });

  return { dayIndex, isWeekend, durations, rows };
}

export function buildWeek(): DaySchedule[] {
  return DAYS.map((_, i) => buildDaySchedule(i));
}

export function findProgram(week: DaySchedule[], id: string | null): ProgramSlot | null {
  if (!id) return null;
  for (const day of week) {
    for (const row of day.rows) {
      const found = row.programs.find((p) => p.id === id);
      if (found) return found;
    }
  }
  return null;
}

export function channelOf(id: string): Channel | undefined {
  return CHANNELS.find((c) => c.id === id);
}

export function summarizeWeek(week: DaySchedule[]): DaySummary[] {
  return week.map((day) => {
    const all = day.rows.flatMap((r) => r.programs);
    const totalAdRevenue = all.reduce((s, p) => s + p.adRevenue, 0);
    const avgRating = all.reduce((s, p) => s + p.rating, 0) / all.length;
    const reviewFlags = all.filter((p) => p.reviewStatus === "pending" || p.reviewStatus === "rejected").length;
    const preemptedCount = all.filter((p) => p.preempted).length;
    const liveCount = all.filter((p) => p.live).length;
    const rerunCount = all.filter((p) => p.rerun).length;
    return {
      dayIndex: day.dayIndex,
      label: DAYS[day.dayIndex],
      dateLabel: DATE_LABELS[day.dayIndex],
      totalAdRevenue,
      avgRating: Math.round(avgRating * 10) / 10,
      reviewFlags,
      preemptedCount,
      liveCount,
      rerunCount,
    };
  });
}

export function buildReviewQueue(week: DaySchedule[]): ReviewItem[] {
  const perDay: ReviewItem[][] = week.map((day) => {
    const flagged: ReviewItem[] = [];
    for (const row of day.rows) {
      for (const p of row.programs) {
        if (p.preempted) {
          flagged.push({
            id: `rq-${p.id}`,
            programId: p.id,
            dayIndex: day.dayIndex,
            channelName: row.channel.name,
            title: p.title,
            startRaw: p.startRaw,
            endRaw: p.endRaw,
            reviewStatus: "exempt",
            reviewNote: p.preempted.reason,
            deadlineRaw: Math.max(360, p.startRaw - 120),
            kind: "긴급점검",
          });
        } else if (p.reviewStatus === "rejected") {
          flagged.push({
            id: `rq-${p.id}`,
            programId: p.id,
            dayIndex: day.dayIndex,
            channelName: row.channel.name,
            title: p.title,
            startRaw: p.startRaw,
            endRaw: p.endRaw,
            reviewStatus: p.reviewStatus,
            reviewNote: p.reviewNote,
            deadlineRaw: Math.max(360, p.startRaw - 240),
            kind: "재심의",
          });
        } else if (p.reviewStatus === "pending") {
          const kindH = seedHash(day.dayIndex, row.channel.no, p.slotIndex, 83);
          flagged.push({
            id: `rq-${p.id}`,
            programId: p.id,
            dayIndex: day.dayIndex,
            channelName: row.channel.name,
            title: p.title,
            startRaw: p.startRaw,
            endRaw: p.endRaw,
            reviewStatus: p.reviewStatus,
            reviewNote: p.reviewNote,
            deadlineRaw: Math.max(360, p.startRaw - 240),
            kind: kindH < 0.5 ? "정기심의" : "사전심의",
          });
        }
      }
    }
    flagged.sort((a, b) => a.startRaw - b.startRaw);
    const urgent = flagged.find((f) => f.kind === "긴급점검");
    const contested = flagged.find((f) => f.kind === "재심의");
    const routine = flagged.find((f) => f.kind === "정기심의" || f.kind === "사전심의");
    return [urgent, contested, routine].filter((f): f is ReviewItem => Boolean(f)).slice(0, 2);
  });

  const interleaved: ReviewItem[] = [];
  for (let round = 0; round < 2; round++) {
    for (const dayItems of perDay) {
      if (dayItems[round]) interleaved.push(dayItems[round]);
    }
  }
  return interleaved.slice(0, 10);
}

export function ratingTrace(program: ProgramSlot): RatingPoint[] {
  const points = Math.max(4, Math.round(program.duration / 10));
  const base = hashStr(program.id);
  const arr: RatingPoint[] = [];
  for (let i = 0; i < points; i++) {
    const t = points === 1 ? 0 : i / (points - 1);
    const curve = Math.sin(t * Math.PI);
    const h = seedHash(base, i, 7);
    const raw = program.rating * (0.5 + 0.55 * curve) + (h - 0.5) * 1.1;
    arr.push({ minute: i * 10, value: Math.max(0.1, Math.round(raw * 10) / 10) });
  }
  return arr;
}

function breaksFor(duration: number): number[] {
  if (duration <= 30) return [3];
  if (duration <= 60) return [4, 4];
  if (duration <= 90) return [4, 5, 4];
  return [5, 6, 5, 5];
}

export function adSlotMap(program: ProgramSlot): AdSlot[] {
  const breaks = breaksFor(program.duration);
  const totalSpots = breaks.reduce((a, b) => a + b, 0);
  const pricePerSpot = Math.max(300000, Math.round(program.adRevenue / totalSpots / 10000) * 10000);
  const base = hashStr(program.id);
  const slots: AdSlot[] = [];
  let idx = 0;
  breaks.forEach((count, breakIndex) => {
    for (let i = 0; i < count; i++) {
      const h = seedHash(base, breakIndex, i, 53);
      let status: SlotStatus = "open";
      if (h < 0.58) status = "sold";
      else if (h < 0.8) status = "hold";
      const advH = seedHash(base, breakIndex, i, 61);
      const advertiser = status === "sold" ? ADVERTISERS[Math.floor(advH * ADVERTISERS.length)] : undefined;
      slots.push({ index: idx, breakIndex, status, advertiser, price: pricePerSpot });
      idx++;
    }
  });
  return slots;
}

/* ------------------------------------------------------------------ */
/* 포맷 유틸                                                           */
/* ------------------------------------------------------------------ */

export function formatBroadcastTime(rawMin: number): string {
  const h = Math.floor(rawMin / 60);
  const m = rawMin % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function formatKRW(value: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatKRWCompact(value: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${new Intl.NumberFormat("ko-KR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value)}%`;
}

/* ------------------------------------------------------------------ */
/* 모듈 스코프 사전 계산 (요청마다 동일 — 순수 함수)                    */
/* ------------------------------------------------------------------ */

export const WEEK = buildWeek();
export const WEEKLY_SUMMARY = summarizeWeek(WEEK);
export const REVIEW_QUEUE = buildReviewQueue(WEEK);
export const DEFAULT_PROGRAM_ID = `a1-d${NOW_DAY_INDEX}-s${WEEKDAY_PRIME_INDEX}`;
