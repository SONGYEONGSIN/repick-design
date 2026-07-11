import type { Metadata } from "next";

export const metadata: Metadata = { title: "자유 창작 SaaS 대시보드 랩" };

const works = [
  { id: "d7", route: "/dash/d7", brand: "CASSANDRA", desc: "예측시장 확률 터미널 · 켜진 CRT 기기 프레이밍(베젤·스캔라인), 오실로스코프·캘리브레이션" },
  { id: "d9", route: "/dash/d9", brand: "STELE", desc: "소멸위기 언어 아카이빙 콘솔 · 거대 활자 KPI, 타이포그래픽 퍼널, 스위스 인터내셔널" },
  { id: "d12", route: "/dash/d12", brand: "QUARTERDECK", desc: "라이브서비스 게임 라이브옵스 · 서버탭 연동 갱신, 32섹터 헥스 영토전, 사이버펑크 아케이드" },
  { id: "d16", route: "/dash/d16", brand: "LINEAGE", desc: "희귀 원예종 온실·교배 계보 · 번호매긴 도감 플레이트, SVG 교배 계보도, 식물학 세밀화" },
  { id: "d20", route: "/dash/d20", brand: "DAILIES", desc: "VFX 렌더팜·샷 파이프라인 · NLE 편집 타임라인 플레이헤드, 필터→컷 디밍 동기화, 시네마틱 다크" },
  { id: "d21", route: "/dash/d21", brand: "FORME", desc: "신문 편집국 조판 데스크 · 1면 지면 배치도(플랫플랜) 히어로, 논-리프로 블루 가이드·재단선, 라이트 지면" },
  { id: "d22", route: "/dash/d22", brand: "HADAL", desc: "심해 ROV 플릿 관제 · 수심 단면+소나 스윕 히어로, 다이브 선택→7모듈 동기화, 다크 발광" },
  { id: "d23", route: "/dash/d23", brand: "DATUM", desc: "건축 시공 관제 · 도면 시트 프레이밍(타이틀블록·REV), 클릭형 조닝 플랜+해칭 공정 단면, 라이트 제도판" },
  { id: "d24", route: "/dash/d24", brand: "ASPECT", desc: "철도 CTC 관제 · 선로 계통도+시간-거리 운행선도, 신호현시 램프 발광, 다크 계전기 패널" },
  { id: "d25", route: "/dash/d25", brand: "ROSTRUM", desc: "미술품 경매 세일플로어 · 추정가 밴드×낙찰가 스프레드, 티켓 스텁 로트 보드, 라이트 카탈로그" },
  { id: "d26", route: "/dash/d26", brand: "60HZ", desc: "전력 계통 급전 콘솔 · 단선 결선도+급전 스택+오리곡선, 통전 도체만 앰버 글로우, 다크 미믹보드" },
  { id: "d27", route: "/dash/d27", brand: "AS-RUN", desc: "방송 편성 트래픽 로그 · EPG 테이블 자체가 히어로, 카본카피 로그 시트 프레이밍, 라이트 서식" },
  { id: "d28", route: "/dash/d28", brand: "HOLDFIRE", desc: "로켓 발사 관제 · T-타임라인+Go/No-Go 롤콜 보드, 제논 서치라이트 빛 문법, 다크 홀드 스냅샷" },
  { id: "d30", route: "/dash/d30", brand: "Slotted", desc: "예약·미팅 스케줄링(Calendly급) · 순백 라이트, 이벤트타입 선택→히트맵·미팅목록 동기화, ⌘K·정렬 테이블" },
];

function Card({ route, id, brand, desc }: { route: string; id: string; brand: string; desc: string }) {
  return (
    <a
      href={route}
      className="group block overflow-hidden rounded-xl border border-neutral-200 transition-colors hover:border-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
    >
      <div className="relative h-[320px] w-full overflow-hidden bg-white">
        <iframe
          src={route}
          loading="lazy"
          title={brand}
          tabIndex={-1}
          scrolling="no"
          className="pointer-events-none absolute left-0 top-0 origin-top-left"
          style={{ width: "1440px", height: "1100px", transform: "scale(0.34)", border: 0 }}
        />
      </div>
      <div className="flex items-start justify-between gap-3 border-t border-neutral-200 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-neutral-900">{brand}</p>
          <p className="mt-0.5 line-clamp-2 text-xs text-neutral-500">{desc}</p>
        </div>
        <span className="shrink-0 rounded-md bg-neutral-100 px-2 py-1 font-mono text-xs font-semibold text-neutral-600">
          {id}
        </span>
      </div>
    </a>
  );
}

export default function DashLab() {
  return (
    <div className="min-h-screen bg-white px-6 py-12 text-neutral-900">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
          Free Creative Mode · SaaS Dashboards
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">자유 창작 SaaS 대시보드 랩</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-500">
          제품·브랜드·디자인을 전부 백지에서 발명한 로그인 후 앱 대시보드들. 각자 다른 도메인·미학이되,
          기능하는 대시보드(네비·차트·테이블·실 인터랙션). 클릭하면 원본이 열립니다. 랜딩 컬렉션은{" "}
          <code className="rounded bg-neutral-100 px-1">/free</code>.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {works.map((w) => (
            <Card key={w.id} {...w} />
          ))}
        </div>
      </div>
    </div>
  );
}
