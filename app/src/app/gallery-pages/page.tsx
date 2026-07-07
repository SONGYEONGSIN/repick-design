function names(list: string[]) {
  return ["a", "b", "c", "d", "e", "f"].map((v, i) => ({ v, name: list[i] }));
}

// 완료된 페이지만 등록 (자율 로테이션 진행에 따라 추가)
const pages = [
  {
    key: "pricing",
    label: "Pricing (요금제)",
    div: names(["Memphis", "스위스펑크", "콜라주", "잡지브루탈", "클레이모피즘", "모노타이포"]),
    crea: names(["절약 계산기", "before/after 서사", "플랜 추천 문답", "게임화 레벨업", "여정 타임라인", "지표 대시보드"]),
  },
  {
    key: "features",
    label: "Features (기능 소개)",
    div: names(["Bauhaus", "구성주의", "아르데코", "사이버펑크 HUD", "리소그래프", "웹1.0"]),
    crea: names(["만져보는 데모", "AI 파이프라인", "수동 vs AI 분할", "라이브 매칭 피드", "상품 여정 스토리", "고민 Q&A"]),
  },
  {
    key: "dashboard",
    label: "Dashboard (앱 화면)",
    div: names(["브루탈 데이터", "네오모피즘", "다크 프로", "컬러 맥시멀", "TUI 터미널", "신문 1면"]),
    crea: names(["아침 브리핑", "채팅형 AI", "취향 별자리", "SNS 피드", "위젯 조립", "게임 던전"]),
  },
];

function Thumb({ path, name, kind }: { path: string; name: string; kind: "div" | "crea" }) {
  return (
    <a
      href={path}
      className="group block overflow-hidden rounded-lg border border-white/10 transition-colors hover:border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF]"
    >
      <div className="relative h-[220px] w-full overflow-hidden bg-white">
        <iframe
          src={path}
          loading="lazy"
          title={name}
          tabIndex={-1}
          scrolling="no"
          className="pointer-events-none absolute left-0 top-0 origin-top-left"
          style={{ width: "1280px", height: "1000px", transform: "scale(0.3)", border: 0 }}
        />
      </div>
      <div className="flex items-center justify-between border-t border-white/10 bg-[#0B0B0F] px-3 py-2 text-xs">
        <span className="font-semibold tracking-[-0.01em] text-white">{name}</span>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            kind === "div" ? "bg-[#6E56CF] text-white" : "border border-white/25 text-[#A1A1AA]"
          }`}
        >
          {kind === "div" ? "발산" : "창의"}
        </span>
      </div>
    </a>
  );
}

export default function GalleryPages() {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white antialiased">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0B0B0F]/85 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#A1A1AA]">
              SaaS Pages
            </p>
            <h1 className="mt-1 text-lg font-extrabold tracking-[-0.02em]">
              페이지별 발산 + 창의 갤러리
            </h1>
          </div>
          <a
            href="/gallery"
            className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white transition-colors hover:border-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF]"
          >
            ← 랜딩 갤러리
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-6 py-10">
        <p className="mb-10 max-w-[62ch] text-sm leading-[1.6] text-[#A1A1AA]">
          각 페이지마다 <span className="text-white">발산 6</span>(극단 스타일) +{" "}
          <span className="text-white">창의 6</span>(참신한 발상) = 12개를 생성합니다. 승자
          선택·수렴 없음 — 다양성이 목적. 카드를 클릭하면 원본이 열립니다.
        </p>

        <div className="space-y-16">
          {pages.map((pg) => (
            <section key={pg.key}>
              <h2 className="mb-6 text-2xl font-extrabold tracking-[-0.02em]">{pg.label}</h2>

              <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#6E56CF]">
                발산 (극단 스타일)
              </h3>
              <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {pg.div.map((it) => (
                  <div key={it.v}>
                    <Thumb path={`/pages/${pg.key}/div/${it.v}`} name={it.name} kind="div" />
                  </div>
                ))}
              </div>

              <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#A1A1AA]">
                창의 (참신한 발상)
              </h3>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {pg.crea.map((it) => (
                  <div key={it.v}>
                    <Thumb path={`/pages/${pg.key}/crea/${it.v}`} name={it.name} kind="crea" />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-16 border-t border-white/10 pt-8 text-xs text-[#A1A1AA]">
          로테이션: Pricing → Features → Dashboard → Business. 진행 로그:
          vault/30-ledger/NEW-PAGES-LOG.md
        </footer>
      </main>
    </div>
  );
}
