import type { Metadata } from "next";
import { DASH_LAB_WORKS } from "@/lib/works";

export const metadata: Metadata = { title: "자유 창작 SaaS 대시보드 랩" };

function Card({ route, id, brand, desc }: { route: string; id: string; brand: string; desc: { en: string; ko: string } }) {
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
          <p className="mt-0.5 line-clamp-2 text-xs text-neutral-500">{desc.ko}</p>
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
          {DASH_LAB_WORKS.map((w) => (
            <Card key={w.id} {...w} />
          ))}
        </div>
      </div>
    </div>
  );
}
