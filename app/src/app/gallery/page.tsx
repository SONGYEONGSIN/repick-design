// ── 데이터 ───────────────────────────────────────────────
function names(list: string[]) {
  return ["a", "b", "c", "d", "e", "f"].map((v, i) => ({ v, name: list[i] }));
}

const finalists = [
  { label: "랜딩", path: "/", name: "다크 에디토리얼 + 제품 프리뷰", note: "R7 챔피언 (수렴)" },
  { label: "Pricing", path: "/pages/pricing/crea/a", name: "ROI 계산기", note: "숫자로 증명" },
  { label: "Features", path: "/pages/features/crea/c", name: "수동 vs AI 드래그 비교", note: "3시간→3초 체험" },
  { label: "Dashboard", path: "/pages/dashboard/div/c", name: "다크 프로 SaaS", note: "실전 앱 완성도" },
  { label: "Business", path: "/pages/business/crea/c", name: "인터랙티브 제품 투어", note: "제품 화면으로 증명" },
];

const saasPages = [
  {
    key: "pricing", label: "Pricing (요금제)", finalist: "crea/a",
    div: names(["Memphis", "스위스펑크", "콜라주", "잡지브루탈", "클레이모피즘", "모노타이포"]),
    crea: names(["ROI 계산기", "before/after 서사", "플랜 추천 문답", "게임화 레벨업", "여정 타임라인", "지표 대시보드"]),
  },
  {
    key: "features", label: "Features (기능 소개)", finalist: "crea/c",
    div: names(["Bauhaus", "구성주의", "아르데코", "사이버펑크 HUD", "리소그래프", "웹1.0"]),
    crea: names(["만져보는 데모", "AI 파이프라인", "수동 vs AI 분할", "라이브 매칭 피드", "상품 여정 스토리", "고민 Q&A"]),
  },
  {
    key: "dashboard", label: "Dashboard (앱 화면)", finalist: "div/c",
    div: names(["브루탈 데이터", "네오모피즘", "다크 프로", "컬러 맥시멀", "TUI 터미널", "신문 1면"]),
    crea: names(["아침 브리핑", "채팅형 AI", "취향 별자리", "SNS 피드", "위젯 조립", "게임 던전"]),
  },
  {
    key: "business", label: "Business (B2B 랜딩)", finalist: "crea/c",
    div: names(["블루프린트", "다크 럭셔리", "브루탈 코퍼레이트", "그라디언트 SaaS", "스칸디 미니멀", "인포그래픽"]),
    crea: names(["ROI 계산기", "케이스 스터디", "제품 투어", "vs 비교 슬라이더", "라이브 지표", "온보딩 여정"]),
  },
];

const landingConverge = [
  { r: "R1", run: "2026-07-06-landing", v: "c" },
  { r: "R2", run: "2026-07-07-auto-r2", v: "a" },
  { r: "R3", run: "2026-07-07-auto-r3", v: "a" },
  { r: "R4", run: "2026-07-07-auto-r4", v: "c" },
  { r: "R5", run: "2026-07-07-auto-r5", v: "b" },
  { r: "R6", run: "2026-07-07-auto-r6", v: "b" },
  { r: "R7", run: "2026-07-07-auto-r7", v: "a" },
];
const landingDivergent = names(["네오브루탈리즘", "Y2K 레트로", "터미널 CLI", "소프트 오가닉", "하이패션 세리프", "바이퍼웨이브"]);

// ── 썸네일 ───────────────────────────────────────────────
function Thumb({ path, name, tag, star, big }: { path: string; name: string; tag?: string; star?: boolean; big?: boolean }) {
  return (
    <a
      href={path}
      className={`group block overflow-hidden rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] ${
        star ? "border-[#6E56CF]" : "border-white/10 hover:border-white/40"
      }`}
    >
      <div className={`relative w-full overflow-hidden bg-white ${big ? "h-[300px]" : "h-[210px]"}`}>
        <iframe
          src={path} loading="lazy" title={name} tabIndex={-1} scrolling="no"
          className="pointer-events-none absolute left-0 top-0 origin-top-left"
          style={{ width: "1280px", height: "1000px", transform: big ? "scale(0.36)" : "scale(0.3)", border: 0 }}
        />
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-white/10 bg-[#0B0B0F] px-3 py-2">
        <span className="truncate text-xs font-semibold tracking-[-0.01em] text-white">{name}</span>
        {star ? (
          <span className="shrink-0 rounded-full bg-[#6E56CF] px-2 py-0.5 text-[10px] font-semibold text-white">⭐ finalist</span>
        ) : tag ? (
          <span className="shrink-0 rounded-full border border-white/20 px-2 py-0.5 text-[10px] font-semibold text-[#A1A1AA]">{tag}</span>
        ) : null}
      </div>
    </a>
  );
}

// ── 페이지 ───────────────────────────────────────────────
export default function Gallery() {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white antialiased">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0B0B0F]/85 backdrop-blur">
        <div className="mx-auto max-w-[1400px] px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#A1A1AA]">repick · Design Evolution</p>
          <h1 className="mt-1 text-lg font-extrabold tracking-[-0.02em]">전체 갤러리 — finalist · SaaS 페이지 · 랜딩 탐색</h1>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-6 py-10 space-y-16">
        {/* ⭐ Finalists */}
        <section>
          <div className="mb-1 flex items-baseline gap-3 border-b border-[#6E56CF]/40 pb-3">
            <h2 className="text-2xl font-extrabold tracking-[-0.02em]">⭐ Finalists</h2>
            <span className="text-sm text-[#A1A1AA]">페이지별 선정 대표 — 폴리시 파이프라인 적용 대상</span>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {finalists.map((f) => (
              <div key={f.path}>
                <div className="mb-1.5 flex items-baseline gap-2">
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#6E56CF]">{f.label}</span>
                  <span className="text-[11px] text-[#71717A]">{f.note}</span>
                </div>
                <Thumb path={f.path} name={f.name} star big />
              </div>
            ))}
          </div>
        </section>

        {/* 📄 SaaS 페이지 */}
        <section>
          <h2 className="mb-6 border-b border-white/10 pb-3 text-2xl font-extrabold tracking-[-0.02em]">
            📄 SaaS 페이지 <span className="text-sm font-normal text-[#A1A1AA]">— 각 12개 (발산 6 + 창의 6)</span>
          </h2>
          <div className="space-y-10">
            {saasPages.map((pg) => {
              const all = [
                ...pg.div.map((it) => ({ ...it, kind: "div" as const, tag: "발산" })),
                ...pg.crea.map((it) => ({ ...it, kind: "crea" as const, tag: "창의" })),
              ];
              const finalist = all.find((it) => `${it.kind}/${it.v}` === pg.finalist)!;
              const rest = all.filter((it) => `${it.kind}/${it.v}` !== pg.finalist);
              return (
                <div key={pg.key}>
                  <h3 className="mb-4 text-lg font-bold tracking-[-0.01em]">{pg.label}</h3>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <Thumb path={`/pages/${pg.key}/${finalist.kind}/${finalist.v}`} name={finalist.name} star />
                  </div>
                  <details className="mt-4 group">
                    <summary className="cursor-pointer select-none text-sm font-semibold text-[#A1A1AA] transition-colors hover:text-white">
                      나머지 11개 보기 ▸
                    </summary>
                    <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {rest.map((it) => (
                        <Thumb key={`${it.kind}/${it.v}`} path={`/pages/${pg.key}/${it.kind}/${it.v}`} name={it.name} tag={it.tag} />
                      ))}
                    </div>
                  </details>
                </div>
              );
            })}
          </div>
        </section>

        {/* 🎨 랜딩 탐색 */}
        <section>
          <h2 className="mb-6 border-b border-white/10 pb-3 text-2xl font-extrabold tracking-[-0.02em]">
            🎨 랜딩 탐색 <span className="text-sm font-normal text-[#A1A1AA]">— 수렴 진화 R1~R7 + 발산 6</span>
          </h2>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#A1A1AA]">수렴 승자 사슬 (R1 → R7 챔피언)</h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {landingConverge.map((l) => (
              <Thumb key={l.r} path={`/candidates/${l.run}/${l.v}`} name={`${l.r} 승자`} tag={l.r === "R7" ? "챔피언" : "승자"} star={l.r === "R7"} />
            ))}
          </div>
          <details className="mt-6 group">
            <summary className="cursor-pointer select-none text-sm font-semibold text-[#A1A1AA] transition-colors hover:text-white">
              랜딩 발산 6개 보기 ▸ <span className="text-[#71717A]">(네오브루탈 / Y2K / 터미널 / 오가닉 / 세리프 / 바이퍼웨이브)</span>
            </summary>
            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {landingDivergent.map((it) => (
                <Thumb key={it.v} path={`/candidates/2026-07-07-divergent-r1/${it.v}`} name={it.name} tag="발산" />
              ))}
            </div>
          </details>
        </section>

        <footer className="border-t border-white/10 pt-8 text-xs text-[#A1A1AA]">
          전체 진화·생성 로그: vault/30-ledger/ (AUTO-RUN-LOG.md · NEW-PAGES-LOG.md · design-ledger.jsonl)
        </footer>
      </main>
    </div>
  );
}
