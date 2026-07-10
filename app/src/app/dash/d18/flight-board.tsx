import { PlaneTakeoff } from "lucide-react";
import { FlapText } from "./flap";
import type { Flight, FlightStatus } from "./data";

export type StatusFilter = "ALL" | FlightStatus;

// 실제 스플릿플랩 안내판 관례대로 상태 플랩은 영문 대문자 코드로 표기한다
// (한글은 셀 폭을 넘어서는 전각 문자라 플랩 셀 안에서 잘릴 수 있어 제외).
const STATUS_META: Record<
  FlightStatus,
  { label: string; koLabel: string; tone: "amber" | "red" | "green" | "white" }
> = {
  BOARDING: { label: "BOARDING", koLabel: "탑승중", tone: "amber" },
  DELAYED: { label: "DELAYED", koLabel: "지연", tone: "red" },
  DEPARTED: { label: "DEPARTED", koLabel: "출발완료", tone: "green" },
  SCHEDULED: { label: "ON TIME", koLabel: "예정", tone: "white" },
};

const FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "전체" },
  { value: "BOARDING", label: "탑승중" },
  { value: "DELAYED", label: "지연" },
  { value: "DEPARTED", label: "출발완료" },
  { value: "SCHEDULED", label: "예정" },
];

export function FlightBoard({
  flights,
  filter,
  onFilterChange,
  terminal,
}: {
  flights: Flight[];
  filter: StatusFilter;
  onFilterChange: (value: StatusFilter) => void;
  terminal: string;
}) {
  return (
    <section
      id="board"
      aria-labelledby="board-heading"
      className="scroll-mt-24 rounded-lg border border-amber-500/10 bg-neutral-950"
    >
      <div className="flex flex-col gap-4 border-b border-amber-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">
        <h2
          id="board-heading"
          className="font-mono text-sm font-bold tracking-[0.15em] text-neutral-200"
        >
          출발 관제판 · {terminal}
        </h2>
        <fieldset className="flex flex-wrap gap-1.5">
          <legend className="sr-only">상태 필터</legend>
          {FILTER_OPTIONS.map((opt) => (
            <label key={opt.value} className="cursor-pointer">
              <input
                type="radio"
                name="status-filter"
                value={opt.value}
                checked={filter === opt.value}
                onChange={() => onFilterChange(opt.value)}
                className="peer sr-only"
              />
              <span className="inline-flex min-h-[36px] items-center rounded-md border border-neutral-800 px-3 text-xs font-medium tracking-wide text-neutral-400 transition-colors peer-checked:border-amber-500/60 peer-checked:bg-amber-500/10 peer-checked:text-amber-300 peer-hover:text-neutral-200 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-amber-400">
                {opt.label}
              </span>
            </label>
          ))}
        </fieldset>
      </div>

      <p aria-live="polite" className="sr-only">
        {flights.length}편이 표시되고 있습니다.
      </p>

      {flights.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-4 py-16 text-center">
          <PlaneTakeoff aria-hidden className="h-8 w-8 text-neutral-700" />
          <p className="text-sm text-neutral-500">
            선택한 조건에 해당하는 항공편이 없습니다. 다른 필터를 선택해
            보세요.
          </p>
        </div>
      ) : (
        <div
          tabIndex={0}
          role="region"
          aria-label="출발 항공편 표, 가로 스크롤 가능"
          className="overflow-x-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-400"
        >
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-amber-500/10 text-[11px] tracking-[0.15em] text-neutral-500">
                <th scope="col" className="px-4 py-2 font-medium">
                  STD
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  편명
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  목적지
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  게이트
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  기종
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  상태
                </th>
              </tr>
            </thead>
            <tbody>
              {flights.map((f) => {
                const meta = STATUS_META[f.status];
                return (
                  <tr
                    key={f.flt}
                    className="border-b border-neutral-900 last:border-b-0"
                  >
                    <td className="px-4 py-2.5">
                      <FlapText value={f.std} length={5} tone="white" />
                    </td>
                    <td className="px-4 py-2.5">
                      <FlapText value={f.flt} length={6} tone="amber" />
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="flex items-center gap-2">
                        <FlapText
                          value={f.destCode}
                          length={3}
                          tone="white"
                        />
                        <span className="text-xs text-neutral-500">
                          {f.destName}
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <FlapText value={f.gate} length={3} tone="white" />
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs text-neutral-500">
                      {f.aircraft}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <FlapText
                          value={meta.label}
                          length={8}
                          tone={meta.tone}
                          ariaLabel={meta.koLabel}
                        />
                        {f.status === "DELAYED" && (
                          <span className="text-xs text-red-400">
                            +{f.delayMin}분
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
