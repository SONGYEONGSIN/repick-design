const INK = "#171123";

type Tier = {
  name: string;
  price: string;
  unit: string;
  tagline: string;
  features: string[];
  cta: string;
  bg: string;
  accent: string;
  popular?: boolean;
};

const TIERS: Tier[] = [
  {
    name: "Free",
    price: "₩0",
    unit: "평생 무료",
    tagline: "가볍게 시작하는 AI 큐레이션",
    features: [
      "주간 AI 추천 리스트",
      "찜 목록 기본 제공",
      "기본 가격 비교",
      "커뮤니티 리뷰 열람",
    ],
    cta: "무료로 시작하기",
    bg: "#DFFCFB",
    accent: INK,
  },
  {
    name: "Pro",
    price: "₩9,900",
    unit: "/ 월",
    tagline: "무제한 매칭과 실시간 알림",
    features: [
      "실시간 무제한 매칭",
      "가격 하락 즉시 알림",
      "판매자 신뢰도 상세 리포트",
      "전 카테고리 우선 추천",
      "광고 없는 깔끔한 경험",
    ],
    cta: "Pro 시작하기",
    bg: "#FFDE59",
    accent: "#FF3EA8",
    popular: true,
  },
  {
    name: "Business",
    price: "문의",
    unit: "맞춤 견적",
    tagline: "팀과 셀러를 위한 API · 대시보드",
    features: [
      "팀 시트 무제한",
      "셀러 전용 대시보드",
      "API 연동 지원",
      "전담 매니저 배정",
      "SLA 보장",
    ],
    cta: "영업팀에 문의하기",
    bg: "#F4E3FF",
    accent: INK,
  },
];

const COMPARE_ROWS: { label: string; free: string; pro: string; business: string }[] = [
  { label: "AI 추천 빈도", free: "주 1회", pro: "실시간 무제한", business: "실시간 무제한" },
  { label: "가격 하락 알림", free: "–", pro: "✓", business: "✓" },
  { label: "판매자 신뢰도 리포트", free: "기본", pro: "상세", business: "상세 + 커스텀" },
  { label: "팀 시트", free: "–", pro: "1인", business: "무제한" },
  { label: "API 연동", free: "–", pro: "–", business: "✓" },
  { label: "전담 매니저", free: "–", pro: "–", business: "✓" },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "언제든 해지할 수 있나요?",
    a: "네, Pro 요금제는 언제든 해지할 수 있어요. 해지 후에도 결제 주기가 끝날 때까지는 계속 이용하실 수 있습니다.",
  },
  {
    q: "Free에서 Pro로 업그레이드하면 데이터가 유지되나요?",
    a: "그럼요. 찜 목록과 취향 학습 데이터는 그대로 이어져서 업그레이드 즉시 더 정교한 추천을 받아보실 수 있어요.",
  },
  {
    q: "Business 요금제는 어떻게 산정되나요?",
    a: "팀 규모와 필요한 API 호출량에 따라 맞춤 견적을 제공해요. 아래 문의하기 버튼으로 요청해주시면 담당자가 안내드려요.",
  },
];

function Blob({
  className = "",
  color,
  size = 64,
}: {
  className?: string;
  color: string;
  size?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className={`absolute border-4 border-[#171123] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] ${className}`}
      style={{ backgroundColor: color, width: size, height: size }}
    />
  );
}

function Triangle({
  className = "",
  color,
  size = 40,
  rotate = 0,
}: {
  className?: string;
  color: string;
  size?: number;
  rotate?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className={`absolute [clip-path:polygon(50%_0%,0%_100%,100%_100%)] ${className}`}
      style={{
        backgroundColor: color,
        width: size,
        height: size,
        transform: `rotate(${rotate}deg)`,
      }}
    />
  );
}

function Star({
  className = "",
  color,
  size = 28,
}: {
  className?: string;
  color: string;
  size?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className={`absolute [clip-path:polygon(50%_0%,61%_35%,98%_35%,68%_57%,79%_91%,50%_70%,21%_91%,32%_57%,2%_35%,39%_35%)] ${className}`}
      style={{ backgroundColor: color, width: size, height: size }}
    />
  );
}

function Zigzag({ color = INK, className = "" }: { color?: string; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 20"
      preserveAspectRatio="none"
      className={`h-4 w-full ${className}`}
    >
      <polyline
        points="0,20 20,0 40,20 60,0 80,20 100,0 120,20 140,0 160,20 180,0 200,20"
        fill="none"
        stroke={color}
        strokeWidth="4"
      />
    </svg>
  );
}

function Squiggle({ color = INK, className = "" }: { color?: string; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 20" fill="none" className={className}>
      <path
        d="M0 10 Q 15 0 30 10 T 60 10 T 90 10 T 120 10"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckBullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span
        aria-hidden="true"
        className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border-2 border-[#171123] bg-white text-[10px] font-black"
      >
        ✓
      </span>
      <span>{children}</span>
    </li>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FFF7ED] font-sans text-[#171123]">
      {/* dotted confetti field, decorative */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.12]"
        style={{
          backgroundImage: `radial-gradient(circle, ${INK} 1.5px, transparent 1.5px)`,
          backgroundSize: "22px 22px",
        }}
      />

      <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-10">
        <a
          href="#top"
          className="flex items-center gap-2 rounded-md text-xl font-black tracking-tight focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#171123] focus-visible:ring-offset-2"
        >
          <span
            aria-hidden="true"
            className="inline-block h-6 w-6 rotate-12 rounded-md border-4 border-[#171123] bg-[#FF3EA8]"
          />
          repick
        </a>
        <a
          href="#cards"
          className="rounded-full border-4 border-[#171123] bg-[#FFDE59] px-5 py-2 text-sm font-extrabold shadow-[4px_4px_0_0_#171123] transition-transform hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#171123] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#171123] focus-visible:ring-offset-2"
        >
          요금제 보기 ↓
        </a>
      </header>

      <main>
        {/* Hero */}
        <section
          id="top"
          className="relative overflow-hidden px-6 pb-16 pt-8 text-center md:px-10 md:pb-24 md:pt-12"
        >
          <Blob className="left-[3%] top-2 hidden md:block" color="#9BFFC7" size={80} />
          <Triangle
            className="right-[6%] top-8 hidden md:block"
            color="#4DE8E0"
            size={44}
            rotate={12}
          />
          <Star className="left-[12%] top-32 hidden md:block" color="#FF6B4A" size={26} />
          <Squiggle
            className="right-[10%] top-28 hidden w-24 md:block"
            color="#8B5CF6"
          />
          <Blob className="right-[2%] bottom-0 hidden md:block" color="#FFDE59" size={70} />

          <p className="relative z-10 mx-auto mb-5 inline-block -rotate-2 rounded-full border-4 border-[#171123] bg-white px-4 py-1 text-xs font-black uppercase tracking-widest shadow-[3px_3px_0_0_#171123]">
            ✦ pricing ✦
          </p>
          <h1 className="relative z-10 mx-auto max-w-3xl text-4xl font-black leading-[1.15] tracking-tight sm:text-5xl md:text-6xl">
            당신 취향에 맞는
            <br />
            <span className="relative inline-block px-1">
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-1 -z-0 h-4 -rotate-1 bg-[#FF3EA8]"
              />
              <span className="relative z-10">가격표</span>
            </span>
            를 골라보세요
          </h1>
          <p className="relative z-10 mx-auto mt-5 max-w-xl text-base text-[#171123]/80 md:text-lg">
            AI가 찾아주는 득템, 지금 무료로 시작하고 필요할 때 업그레이드하세요.
          </p>
        </section>

        {/* Pricing cards */}
        <section id="cards" className="relative px-6 pb-20 md:px-10">
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3 md:items-start md:gap-6">
            {TIERS.map((tier, i) => (
              <article
                key={tier.name}
                className={`relative flex flex-col rounded-3xl border-4 border-[#171123] p-6 shadow-[8px_8px_0_0_var(--tier-accent)] ${
                  i === 0 ? "md:rotate-[-1.5deg]" : i === 2 ? "md:rotate-[1.5deg]" : ""
                } ${tier.popular ? "md:-translate-y-3 md:scale-[1.04]" : ""}`}
                style={{
                  backgroundColor: tier.bg,
                  ["--tier-accent" as string]: tier.accent,
                }}
              >
                {tier.popular ? (
                  <span
                    className="absolute -top-4 right-6 rotate-3 rounded-full border-4 border-[#171123] bg-[#FF3EA8] px-4 py-1 text-xs font-black uppercase tracking-widest text-white shadow-[3px_3px_0_0_#171123]"
                  >
                    가장 인기
                  </span>
                ) : null}
                <Triangle
                  className="right-4 top-4 opacity-70"
                  color={tier.accent}
                  size={18}
                  rotate={i * 20}
                />

                <h2 className="text-sm font-black uppercase tracking-widest">{tier.name}</h2>
                <p className="mt-3 text-4xl font-black leading-none">{tier.price}</p>
                <p className="mt-1 text-sm text-[#171123]/70">{tier.unit}</p>
                <p className="mt-3 text-sm leading-relaxed">{tier.tagline}</p>

                <Zigzag color={tier.accent} className="my-5" />

                <ul className="flex flex-1 flex-col gap-3 text-sm">
                  {tier.features.map((f) => (
                    <CheckBullet key={f}>{f}</CheckBullet>
                  ))}
                </ul>

                <a
                  href="#faq"
                  className="mt-8 inline-block rounded-full border-4 border-[#171123] bg-white px-5 py-3 text-center text-sm font-black shadow-[4px_4px_0_0_#171123] transition-transform hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#171123] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#171123] focus-visible:ring-offset-2"
                >
                  {tier.cta}
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* Comparison table */}
        <section className="px-6 pb-20 md:px-10">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-6 text-center text-2xl font-black md:text-3xl">
              한눈에 보는{" "}
              <span className="inline-block rotate-1 rounded-md bg-[#4DE8E0] px-2">
                기능 비교
              </span>
            </h2>
            <div className="overflow-x-auto rounded-3xl border-4 border-[#171123] bg-white shadow-[8px_8px_0_0_#171123]">
              <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b-4 border-[#171123]">
                    <th scope="col" className="p-4 text-base font-black">
                      기능
                    </th>
                    <th scope="col" className="p-4 text-base font-black">
                      Free
                    </th>
                    <th scope="col" className="p-4 text-base font-black">
                      Pro
                    </th>
                    <th scope="col" className="p-4 text-base font-black">
                      Business
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row, idx) => (
                    <tr
                      key={row.label}
                      className={`border-b-2 border-dashed border-[#171123]/30 ${
                        idx % 2 === 1 ? "bg-[#FFF7ED]" : "bg-white"
                      }`}
                    >
                      <th scope="row" className="p-4 font-bold">
                        {row.label}
                      </th>
                      <td className="p-4">{row.free}</td>
                      <td className="p-4 font-bold">{row.pro}</td>
                      <td className="p-4">{row.business}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="px-6 pb-20 md:px-10">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-6 text-center text-2xl font-black md:text-3xl">
              자주 묻는 질문
            </h2>
            <div className="flex flex-col gap-4">
              {FAQS.map((item, idx) => {
                const bg = idx === 0 ? "#DFFCFB" : idx === 1 ? "#FFE1F3" : "#F4E3FF";
                return (
                  <details
                    key={item.q}
                    className="group rounded-2xl border-4 border-[#171123] p-5 shadow-[6px_6px_0_0_#171123] [&::-webkit-details-marker]:hidden"
                    style={{ backgroundColor: bg }}
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-md text-base font-extrabold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#171123] focus-visible:ring-offset-2">
                      {item.q}
                      <span
                        aria-hidden="true"
                        className="flex h-8 w-8 flex-none items-center justify-center rounded-full border-2 border-[#171123] bg-white text-lg font-black transition-transform group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-[#171123]/80">{item.a}</p>
                  </details>
                );
              })}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative mx-4 mb-16 overflow-hidden rounded-[2.5rem] border-4 border-[#171123] bg-[#171123] px-6 py-16 text-center text-white shadow-[10px_10px_0_0_#FF3EA8] md:mx-10 md:py-20">
          <Blob className="left-[4%] top-6 hidden md:block" color="#9BFFC7" size={60} />
          <Triangle className="right-[8%] top-10 hidden md:block" color="#FFDE59" size={36} rotate={-10} />
          <Star className="right-[16%] bottom-10 hidden md:block" color="#4DE8E0" size={24} />

          <h2 className="relative z-10 mx-auto max-w-2xl text-3xl font-black leading-tight md:text-4xl">
            지금 시작하고
            <br className="md:hidden" /> AI가 찾아주는 득템을 경험하세요
          </h2>
          <p className="relative z-10 mx-auto mt-4 max-w-md text-white/70">
            카드 등록 없이 무료로 시작할 수 있어요.
          </p>
          <a
            href="#cards"
            className="relative z-10 mt-8 inline-block rounded-full border-4 border-white bg-[#FFDE59] px-8 py-3 text-base font-black text-[#171123] shadow-[6px_6px_0_0_#fff] transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#171123]"
          >
            무료로 시작하기
          </a>
        </section>
      </main>

      <footer className="px-6 pb-10 text-center text-xs text-[#171123]/50 md:px-10">
        © 2026 repick. 취향을 아는 AI 리커머스.
      </footer>
    </div>
  );
}
