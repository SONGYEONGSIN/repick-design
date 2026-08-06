// Deterministic inline SVG panels — no photos, no remote hosts, no trigonometry, so there is
// nothing here that can render differently between server and client.

interface Panel {
  id: string;
  title: string;
  caption: string;
}

const PANELS: Panel[] = [
  {
    id: "remote-first",
    title: "Remote-first, sync when it matters",
    caption: "Most of the day is async. Teams pick two overlapping hours for anything live.",
  },
  {
    id: "home-port",
    title: "Home Port, twice a year",
    caption: "Everyone flies in for a week — one team ships, one team plans, everyone eats.",
  },
  {
    id: "freight-days",
    title: "Freight Days hack week",
    caption: "One week a quarter with no roadmap. Past builds have shipped as real features.",
  },
  {
    id: "dockside",
    title: "Dockside standups",
    caption: "Ops and support sit with the carriers they support at least once a quarter.",
  },
];

function PanelArt({ id }: { id: string }) {
  switch (id) {
    case "remote-first":
      return (
        <svg viewBox="0 0 200 150" width="100%" height="100%" aria-hidden="true">
          <rect x="40" y="30" width="120" height="80" rx="8" fill="#fff" stroke="#e4e4e7" strokeWidth="2" />
          <rect x="52" y="42" width="96" height="56" rx="4" fill="#fff7ed" />
          <rect x="64" y="58" width="40" height="6" rx="3" fill="#fdba74" />
          <rect x="64" y="72" width="60" height="6" rx="3" fill="#fed7aa" />
          <rect x="64" y="86" width="28" height="6" rx="3" fill="#fdba74" />
          <rect x="30" y="110" width="140" height="10" rx="5" fill="#e4e4e7" />
          <circle cx="150" cy="46" r="6" fill="#ea580c" />
        </svg>
      );
    case "home-port":
      return (
        <svg viewBox="0 0 200 150" width="100%" height="100%" aria-hidden="true">
          <path
            d="M100 25 C140 25 160 55 155 85 C150 115 120 130 100 130 C80 130 50 115 45 85 C40 55 60 25 100 25 Z"
            fill="#fff7ed"
            stroke="#fed7aa"
            strokeWidth="2"
          />
          <path d="M70 60 L70 45 C70 40 78 40 78 45 L78 60 C78 66 70 66 70 60 Z" fill="#ea580c" />
          <path d="M118 95 L118 80 C118 75 126 75 126 80 L126 95 C126 101 118 101 118 95 Z" fill="#ea580c" />
          <path d="M95 105 L95 90 C95 85 103 85 103 90 L103 105 C103 111 95 111 95 105 Z" fill="#c2410c" />
          <line x1="74" y1="60" x2="122" y2="95" stroke="#fdba74" strokeWidth="1.5" strokeDasharray="4 3" />
          <line x1="122" y1="95" x2="99" y2="105" stroke="#fdba74" strokeWidth="1.5" strokeDasharray="4 3" />
        </svg>
      );
    case "freight-days":
      return (
        <svg viewBox="0 0 200 150" width="100%" height="100%" aria-hidden="true">
          <rect x="45" y="35" width="90" height="80" rx="6" fill="#fff" stroke="#e4e4e7" strokeWidth="2" />
          <rect x="45" y="35" width="90" height="18" rx="6" fill="#ea580c" />
          <line x1="45" y1="65" x2="135" y2="65" stroke="#e4e4e7" strokeWidth="1.5" />
          <line x1="45" y1="90" x2="135" y2="90" stroke="#e4e4e7" strokeWidth="1.5" />
          <line x1="75" y1="53" x2="75" y2="115" stroke="#e4e4e7" strokeWidth="1.5" />
          <line x1="105" y1="53" x2="105" y2="115" stroke="#e4e4e7" strokeWidth="1.5" />
          <rect x="106" y="91" width="28" height="23" fill="#fed7aa" />
          <circle cx="150" cy="100" r="18" fill="#fff7ed" stroke="#fdba74" strokeWidth="2" />
          <circle cx="150" cy="100" r="6" fill="#ea580c" />
          <line x1="150" y1="82" x2="150" y2="88" stroke="#fdba74" strokeWidth="3" strokeLinecap="round" />
          <line x1="150" y1="112" x2="150" y2="118" stroke="#fdba74" strokeWidth="3" strokeLinecap="round" />
          <line x1="132" y1="100" x2="138" y2="100" stroke="#fdba74" strokeWidth="3" strokeLinecap="round" />
          <line x1="162" y1="100" x2="168" y2="100" stroke="#fdba74" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "dockside":
    default:
      return (
        <svg viewBox="0 0 200 150" width="100%" height="100%" aria-hidden="true">
          <rect x="35" y="60" width="70" height="50" fill="#fff" stroke="#e4e4e7" strokeWidth="2" />
          <path d="M30 60 L70 35 L110 60 Z" fill="#fed7aa" stroke="#fdba74" strokeWidth="2" />
          <rect x="50" y="80" width="16" height="30" fill="#f4f4f5" />
          <rect x="75" y="75" width="14" height="14" fill="#fff7ed" stroke="#fdba74" strokeWidth="1.5" />
          <rect x="115" y="85" width="45" height="25" rx="3" fill="#ea580c" />
          <rect x="150" y="90" width="14" height="16" rx="2" fill="#c2410c" />
          <circle cx="126" cy="112" r="7" fill="#3f3f46" />
          <circle cx="150" cy="112" r="7" fill="#3f3f46" />
          <circle cx="126" cy="112" r="2.5" fill="#e4e4e7" />
          <circle cx="150" cy="112" r="2.5" fill="#e4e4e7" />
          <line x1="20" y1="115" x2="180" y2="115" stroke="#e4e4e7" strokeWidth="2" />
        </svg>
      );
  }
}

export function LifeStrip() {
  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {PANELS.map((panel) => (
        <li key={panel.id} className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-5">
          <div
            className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl bg-orange-50"
            style={{ backgroundColor: "#fff7ed" }}
          >
            <PanelArt id={panel.id} />
          </div>
          <h3 className="mt-4 font-bold text-zinc-900">{panel.title}</h3>
          <p className="mt-1.5 text-sm font-normal leading-relaxed text-zinc-600">
            {panel.caption}
          </p>
        </li>
      ))}
    </ul>
  );
}
