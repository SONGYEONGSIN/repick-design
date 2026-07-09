import type { Metadata } from "next";

export const metadata: Metadata = { title: "자유 창작 랜딩 랩" };

const works = [
  { id: "f1", route: "/free/f1", brand: "여운 (YEOUN)", desc: "성층권에서 편지를 태우는 애도 의식 · ritual-tech, 웜블랙+앰버골드" },
  { id: "f2", route: "/free/f2", brand: "PIGMENT RIOT", desc: "매번 다시 섞는 무규칙 안료 랩 · 네온 색블록 맥시멀 카오스" },
  { id: "f3", route: "/free/f3", brand: "타래 (Tarae)", desc: "목소리를 실 무늬로 짜는 방직 스튜디오 · 종이·공예·손글씨" },
  { id: "f4", route: "/free/f4", brand: "LUCID//OS", desc: "꿈에서 스킬을 컴파일하는 수면 OS · 레트로퓨처, 셸 로그 카피" },
  { id: "f5", route: "/free/f5", brand: "TIMBRE", desc: "목소리 지문 향수 아틀리에 · 하이엔드 매거진, 삭선 검열 카피" },
];

function Card({ route, id, brand, desc }: { route: string; id: string; brand: string; desc: string }) {
  return (
    <a
      href={route}
      className="group block overflow-hidden rounded-xl border border-neutral-200 transition-colors hover:border-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
    >
      <div className="relative h-[300px] w-full overflow-hidden bg-white">
        <iframe
          src={route}
          loading="lazy"
          title={brand}
          tabIndex={-1}
          scrolling="no"
          className="pointer-events-none absolute left-0 top-0 origin-top-left"
          style={{ width: "1440px", height: "1000px", transform: "scale(0.315)", border: 0 }}
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

export default function FreeLab() {
  return (
    <div className="min-h-screen bg-white px-6 py-12 text-neutral-900">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
          Free Creative Mode
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">자유 창작 랜딩 랩</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-500">
          제품·브랜드·디자인·폼을 전부 백지에서 발명한 랜딩페이지들. 각자 완전히 다른 세계관 —
          RE:픽 브랜드/DNA 제약 없이 창의적이고 파괴적으로 생성. 클릭하면 원본이 열립니다.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {works.map((w) => (
            <Card key={w.id} {...w} />
          ))}
        </div>
      </div>
    </div>
  );
}
