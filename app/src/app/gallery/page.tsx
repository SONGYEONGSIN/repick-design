const rounds = [
  { r: "R1", tag: "수동", run: "2026-07-06-landing", winner: "c", note: "타이포·모노 확립" },
  { r: "R2", tag: "자율", run: "2026-07-07-auto-r2", winner: "a", note: "Hero 비대칭 초대형" },
  { r: "R3", tag: "자율", run: "2026-07-07-auto-r3", winner: "a", note: "에디토리얼 밀도" },
  { r: "R4", tag: "자율", run: "2026-07-07-auto-r4", winner: "c", note: "구조>테마 (라이트 유효)" },
  { r: "R5", tag: "자율", run: "2026-07-07-auto-r5", winner: "b", note: "수렴·접근성 요건" },
  { r: "R6", tag: "자율", run: "2026-07-07-auto-r6", winner: "b", note: "제품 프리뷰 섹션 편입" },
  { r: "R7", tag: "자율", run: "2026-07-07-auto-r7", winner: "a", note: "프리뷰 리치화 (현 챔피언)" },
];
const variants = ["a", "b", "c"];

const dirLabel: Record<string, string> = {
  a: "A", b: "B", c: "C",
};

function Thumb({ run, v, win }: { run: string; v: string; win: boolean }) {
  return (
    <a
      href={`/candidates/${run}/${v}`}
      className={`group relative block overflow-hidden rounded-lg border transition-colors ${
        win ? "border-[#6E56CF]" : "border-white/10 hover:border-white/30"
      }`}
    >
      <div className="relative h-[220px] w-full overflow-hidden bg-[#0B0B0F]">
        <iframe
          src={`/candidates/${run}/${v}`}
          loading="lazy"
          title={`${run}-${v}`}
          tabIndex={-1}
          scrolling="no"
          className="pointer-events-none absolute left-0 top-0 origin-top-left"
          style={{ width: "1280px", height: "1000px", transform: "scale(0.3)", border: 0 }}
        />
      </div>
      <div className="flex items-center justify-between border-t border-white/10 px-3 py-2 text-xs">
        <span className="font-semibold tracking-[-0.01em]">
          {dirLabel[v]}
        </span>
        {win ? (
          <span className="rounded-full bg-[#6E56CF] px-2 py-0.5 text-[10px] font-semibold text-white">
            ★ 승자
          </span>
        ) : (
          <span className="text-[#A1A1AA]">후보</span>
        )}
      </div>
    </a>
  );
}

export default function Gallery() {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white antialiased">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0B0B0F]/85 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#A1A1AA]">
              Design Evolution
            </p>
            <h1 className="mt-1 text-lg font-extrabold tracking-[-0.02em]">
              전체 라운드 갤러리 — 7라운드 · 21후보
            </h1>
          </div>
          <a
            href="/"
            className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white transition-colors hover:border-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF]"
          >
            현재 챔피언 →
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-6 py-10">
        <p className="mb-10 max-w-[60ch] text-sm leading-[1.6] text-[#A1A1AA]">
          각 라운드마다 3개 후보를 생성 → 자동 채점 + AI 심사로 승자(★)를 선택 → 학습을
          볼트에 되돌립니다. 카드를 클릭하면 원본 랜딩이 열립니다. 승자만 이어보면 디자인이
          어떻게 진화했는지 보입니다.
        </p>

        <div className="space-y-14">
          {rounds.map((rd) => (
            <section key={rd.run}>
              <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-white/10 pb-3">
                <span className="text-2xl font-extrabold tracking-[-0.02em]">{rd.r}</span>
                <span className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#A1A1AA]">
                  {rd.tag}
                </span>
                <span className="text-sm font-normal text-[#A1A1AA]">{rd.note}</span>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {variants.map((v) => (
                  <Thumb key={v} run={rd.run} v={v} win={rd.winner === v} />
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-16 border-t border-white/10 pt-8 text-xs text-[#A1A1AA]">
          승자 사슬: R1 C → R2 A → R3 A → R4 C → R5 B → R6 B → R7 A (현 챔피언). 전체 학습
          이력은 vault/30-ledger/AUTO-RUN-LOG.md 참조.
        </footer>
      </main>
    </div>
  );
}
