"use client";

import { useFilter } from "../context/FilterContext";

export function ProjectFilterBar() {
  const { allProjects, selectedProjectId, setSelectedProjectId, selectedProject, kpis } = useFilter();

  return (
    <div>
      <div
        role="group"
        aria-label="Project filter"
        className="flex flex-wrap items-center gap-2 overflow-x-auto"
      >
        <FilterChip
          active={selectedProjectId === "all"}
          onClick={() => setSelectedProjectId("all")}
        >
          All Projects
        </FilterChip>
        {allProjects.map((p) => (
          <FilterChip
            key={p.id}
            active={selectedProjectId === p.id}
            onClick={() => setSelectedProjectId(p.id)}
          >
            {p.name}
          </FilterChip>
        ))}
      </div>
      <p aria-live="polite" className="sr-only">
        Filtered by {selectedProject ? selectedProject.name : "All Projects"} · Showing{" "}
        {kpis.activeProjects} projects, {kpis.dueSoonCount} due soon
      </p>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex h-10 shrink-0 items-center rounded-full border px-3.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:outline-none ${
        active
          ? "border-indigo-600 bg-indigo-600 text-white"
          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
      }`}
    >
      {children}
    </button>
  );
}
