import type { Metadata } from "next";

export const metadata: Metadata = { title: "자유 창작 SaaS 대시보드 랩" };

const works = [
  { id: "d1", route: "/dash/d1", brand: "OBELISK — Capital OS", desc: "자산 리스크 관제 센터 · 방사형 레이더가 중심(범례=필터), 프라이빗 뱅크 다크" },
  { id: "d2", route: "/dash/d2", brand: "Comet", desc: "멀티 SNS 크리에이터 성장 OS · 혜성 궤적 모티프, 컬러풀 벤토" },
  { id: "d3", route: "/dash/d3", brand: "MANIFEST — Ops Control", desc: "물류 관제탑 · SVG 허브 네트워크 스키매틱, 레트로퓨처 관제실" },
  { id: "d4", route: "/dash/d4", brand: "solace", desc: "바이오리듬 웰니스 · 24시간 원형 링에 하루를 엮음, 오가닉 소프트" },
  { id: "d5", route: "/dash/d5", brand: "CALDERA/OS", desc: "활화산 관제 콘솔 · 관측소 탭=스파크라인 상태카드, 항공 색상코드 반원 게이지, 브루탈 관제실" },
  { id: "d6", route: "/dash/d6", brand: "결 GYEOL", desc: "감정·관계 저널 · 해바라기 씨앗 나선(phyllotaxis)으로 무드 시각화, 소프트 오가닉 에디토리얼" },
  { id: "d7", route: "/dash/d7", brand: "CASSANDRA", desc: "예측시장 확률 터미널 · 켜진 CRT 기기 프레이밍(베젤·스캔라인), 오실로스코프·캘리브레이션" },
  { id: "d8", route: "/dash/d8", brand: "BEEACON", desc: "도시 루프탑 양봉 관제 · 벌집 지그재그 육각 그리드, 채집방향 나침반, 맥시멀 플레이풀" },
  { id: "d9", route: "/dash/d9", brand: "STELE", desc: "소멸위기 언어 아카이빙 콘솔 · 거대 활자 KPI, 타이포그래픽 퍼널, 스위스 인터내셔널" },
  { id: "d10", route: "/dash/d10", brand: "VELA", desc: "딥스페이스 안테나망 관제 · 궤도 레이더 크로스싱크, 글래스모피즘 HUD, 딥인디고" },
  { id: "d11", route: "/dash/d11", brand: "옹기 ONGGI", desc: "장독 발효 배양 관제 · 회전 바늘 아날로그 계기판, 밀랍 스탬프 KPI, 빈티지 웜 레시피북" },
  { id: "d12", route: "/dash/d12", brand: "QUARTERDECK", desc: "라이브서비스 게임 라이브옵스 · 서버탭 연동 갱신, 32섹터 헥스 영토전, 사이버펑크 아케이드" },
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
