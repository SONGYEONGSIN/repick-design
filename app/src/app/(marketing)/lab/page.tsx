import type { Metadata } from "next";

export const metadata: Metadata = { title: "랜딩 랩 — RE:픽" };

const forms = [
  { id: "v0", route: "/", label: "에디토리얼 스플릿 히어로", note: "기준선 · 제품 쇼케이스 중심" },
  { id: "v1", route: "/v1", label: "전면 이미지 몰입형", note: "시네마틱 · 스크롤 연동 Ken-Burns" },
];

function Thumb({ route, id, label, note }: { route: string; id: string; label: string; note: string }) {
  return (
    <a
      href={route}
      className="group block overflow-hidden rounded-xl border border-stone-200 transition-colors hover:border-stone-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700"
    >
      <div className="relative h-[280px] w-full overflow-hidden bg-white">
        <iframe
          src={route}
          loading="lazy"
          title={label}
          tabIndex={-1}
          scrolling="no"
          className="pointer-events-none absolute left-0 top-0 origin-top-left"
          style={{ width: "1440px", height: "1000px", transform: "scale(0.315)", border: 0 }}
        />
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-stone-200 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-stone-900">{label}</p>
          <p className="truncate text-xs text-stone-500">{note}</p>
        </div>
        <span className="shrink-0 rounded-md bg-stone-100 px-2 py-1 font-[family-name:var(--font-geist-mono)] text-xs font-semibold text-stone-600">
          {id}
        </span>
      </div>
    </a>
  );
}

export default function LandingLab() {
  return (
    <div className="min-h-screen bg-white px-6 py-12 text-stone-900">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-orange-700 px-2 py-0.5 font-[family-name:var(--font-geist-mono)] text-sm font-semibold text-white">
            RE:
          </span>
          <span className="text-lg font-bold tracking-tight">픽 · 랜딩 랩</span>
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">랜딩 폼 진화</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-500">
          레퍼런스급 랜딩을 서로 다른 폼으로 생성하며 학습을 볼트에 축적합니다. 클릭하면 원본이
          열립니다. 학습 로그: <code className="rounded bg-stone-100 px-1">vault/30-ledger/landing-forms.jsonl</code>
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {forms.map((f) => (
            <Thumb key={f.id} {...f} />
          ))}
        </div>
      </div>
    </div>
  );
}
