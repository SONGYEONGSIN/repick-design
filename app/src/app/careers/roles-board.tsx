"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownAZ,
  Briefcase,
  Check,
  ChevronRight,
  Clock,
  MapPin,
  Users2,
  X,
} from "lucide-react";
import { BENEFITS, FOCUS_RING, LOCATIONS, ROLES, TEAMS, type Location, type Role, type Team } from "./data";

type TeamFilter = Team | "All";
type LocationFilter = Location | "All";
type SortMode = "newest" | "az";

const CHIP_BASE =
  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-normal transition-colors";
const CHIP_ACTIVE = "border-blue-400 bg-blue-500/15 text-blue-200";
const CHIP_INACTIVE = "border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100";

function Chip({
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
      aria-pressed={active}
      onClick={onClick}
      className={`${CHIP_BASE} ${active ? CHIP_ACTIVE : CHIP_INACTIVE} ${FOCUS_RING}`}
    >
      {active ? <Check aria-hidden="true" className="h-3.5 w-3.5" /> : null}
      {children}
    </button>
  );
}

export default function RolesBoard() {
  const [team, setTeam] = useState<TeamFilter>("All");
  const [location, setLocation] = useState<LocationFilter>("All");
  const [sort, setSort] = useState<SortMode>("newest");
  const [openId, setOpenId] = useState<string | null>(null);

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const filtered = useMemo(
    () =>
      ROLES.filter(
        (r) => (team === "All" || r.team === team) && (location === "All" || r.location === location)
      ),
    [team, location]
  );

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => (sort === "az" ? a.title.localeCompare(b.title) : a.postedRank - b.postedRank));
    return copy;
  }, [filtered, sort]);

  const openRole: Role | null = openId ? ROLES.find((r) => r.id === openId) ?? null : null;

  function openDrawer(role: Role, trigger: HTMLButtonElement) {
    triggerRef.current = trigger;
    setOpenId(role.id);
  }

  function closeDrawer() {
    setOpenId(null);
    triggerRef.current?.focus();
  }

  function clearFilters() {
    setTeam("All");
    setLocation("All");
  }

  useEffect(() => {
    if (!openRole) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeDrawer();
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [openRole]);

  return (
    <>
      <style>{`
        @keyframes fathom-drawer-in { from { transform: translateX(24px); opacity: 0; } }
        @keyframes fathom-backdrop-in { from { opacity: 0; } }
      `}</style>

      {/* Filters */}
      <div className="flex flex-col gap-4 border-b border-zinc-800 pb-6">
        <div role="group" aria-label="Filter by team" className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">Team</span>
          <Chip active={team === "All"} onClick={() => setTeam("All")}>
            All teams
          </Chip>
          {TEAMS.map((t) => (
            <Chip key={t} active={team === t} onClick={() => setTeam(t)}>
              {t}
            </Chip>
          ))}
        </div>
        <div role="group" aria-label="Filter by location" className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">Location</span>
          <Chip active={location === "All"} onClick={() => setLocation("All")}>
            All locations
          </Chip>
          {LOCATIONS.map((l) => (
            <Chip key={l} active={location === l} onClick={() => setLocation(l)}>
              {l}
            </Chip>
          ))}
        </div>
      </div>

      {/* Count + sort */}
      <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" className="text-sm font-normal text-zinc-400">
          Showing <span className="tabular-nums font-semibold text-zinc-100">{sorted.length}</span> of{" "}
          <span className="tabular-nums font-semibold text-zinc-100">{ROLES.length}</span> open roles
        </p>
        <div role="group" aria-label="Sort roles" className="flex items-center gap-2">
          <ArrowDownAZ aria-hidden="true" className="h-4 w-4 text-zinc-500" />
          <div className="flex overflow-hidden rounded-full border border-zinc-700">
            <button
              type="button"
              aria-pressed={sort === "newest"}
              onClick={() => setSort("newest")}
              className={`px-3.5 py-1.5 text-sm font-normal transition-colors ${FOCUS_RING} ${
                sort === "newest" ? "bg-blue-500/15 text-blue-200" : "text-zinc-300 hover:text-zinc-100"
              }`}
            >
              Newest
            </button>
            <button
              type="button"
              aria-pressed={sort === "az"}
              onClick={() => setSort("az")}
              className={`border-l border-zinc-700 px-3.5 py-1.5 text-sm font-normal transition-colors ${FOCUS_RING} ${
                sort === "az" ? "bg-blue-500/15 text-blue-200" : "text-zinc-300 hover:text-zinc-100"
              }`}
            >
              Title A–Z
            </button>
          </div>
        </div>
      </div>

      {/* Role list */}
      {sorted.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-700 px-6 py-12 text-center">
          <p className="text-base font-normal text-zinc-300">No roles match these filters right now.</p>
          <button
            type="button"
            onClick={clearFilters}
            className={`mt-4 inline-flex items-center rounded-full border border-zinc-600 px-4 py-2 text-sm font-semibold text-zinc-100 hover:border-zinc-400 ${FOCUS_RING}`}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <ul className="divide-y divide-zinc-800 rounded-2xl border border-zinc-800">
          {sorted.map((role) => {
            const isOpen = openId === role.id;
            return (
              <li key={role.id}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-haspopup="dialog"
                  onClick={(e) => openDrawer(role, e.currentTarget)}
                  className={`grid w-full grid-cols-1 items-center gap-x-6 gap-y-1.5 px-5 py-4 text-left transition-colors hover:bg-zinc-900/70 sm:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.7fr)_1.5rem] sm:px-6 ${FOCUS_RING} ${
                    isOpen ? "bg-zinc-900/70" : ""
                  }`}
                >
                  <span className="truncate text-base font-semibold text-zinc-50">{role.title}</span>
                  <span className="truncate text-sm font-normal text-zinc-400">{role.team}</span>
                  <span className="truncate text-sm font-normal text-zinc-400">{role.location}</span>
                  <span className="truncate text-sm font-normal text-zinc-400">{role.type}</span>
                  <ChevronRight
                    aria-hidden="true"
                    className={`hidden h-5 w-5 shrink-0 text-blue-400 transition-transform sm:block ${
                      isOpen ? "rotate-90" : ""
                    }`}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* Benefits strip */}
      <div className="mt-14 rounded-2xl border border-zinc-800 bg-zinc-900/40 px-6 py-8 sm:px-8">
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-300">
          What comes with the role
        </h3>
        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3">
          {BENEFITS.map((b) => (
            <div key={b.label}>
              <dt className="tabular-nums text-2xl font-black leading-none text-zinc-50">{b.label}</dt>
              <dd className="mt-2 text-sm font-normal leading-snug text-zinc-400">{b.detail}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Drawer */}
      {openRole ? (
        <div className="fixed inset-0 z-50">
          <div
            onClick={closeDrawer}
            aria-hidden="true"
            className="absolute inset-0 bg-black/70 motion-safe:animate-[fathom-backdrop-in_220ms_ease-out]"
          />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="role-drawer-heading"
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-0 flex h-full w-full max-w-lg flex-col overflow-y-auto border-l border-zinc-800 bg-zinc-950 px-6 py-6 shadow-2xl motion-safe:animate-[fathom-drawer-in_220ms_ease-out] sm:px-8 sm:py-8"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-300">Open role</p>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={closeDrawer}
                aria-label="Close role details"
                className={`rounded-full border border-zinc-700 p-1.5 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100 ${FOCUS_RING}`}
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>

            <h2 id="role-drawer-heading" className="mt-4 text-2xl font-black leading-tight text-zinc-50">
              {openRole.title}
            </h2>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-normal text-zinc-400">
              <span className="inline-flex items-center gap-1.5">
                <Users2 aria-hidden="true" className="h-4 w-4 text-zinc-500" />
                {openRole.team}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin aria-hidden="true" className="h-4 w-4 text-zinc-500" />
                {openRole.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Briefcase aria-hidden="true" className="h-4 w-4 text-zinc-500" />
                {openRole.type}
              </span>
            </div>

            <p className="mt-6 text-base font-normal leading-relaxed text-zinc-300">{openRole.summary}</p>

            <h3 className="mt-7 text-sm font-semibold uppercase tracking-[0.1em] text-zinc-100">
              What you&apos;ll do
            </h3>
            <ul className="mt-3 space-y-2">
              {openRole.responsibilities.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm font-normal leading-relaxed text-zinc-400">
                  <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-blue-400" />
                  {item}
                </li>
              ))}
            </ul>

            <h3 className="mt-7 text-sm font-semibold uppercase tracking-[0.1em] text-zinc-100">
              What we&apos;re looking for
            </h3>
            <ul className="mt-3 space-y-2">
              {openRole.requirements.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm font-normal leading-relaxed text-zinc-400">
                  <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-blue-400" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 border-t border-zinc-800 pt-6">
              <a
                href={`mailto:careers@fathomlabs.io?subject=${encodeURIComponent(
                  `Application: ${openRole.title}`
                )}`}
                className={`inline-flex items-center justify-center gap-2 rounded-full bg-blue-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-blue-400 ${FOCUS_RING}`}
              >
                Apply for this role
              </a>
              <p className="flex items-center gap-1.5 text-xs font-normal text-zinc-400">
                <Clock aria-hidden="true" className="h-3.5 w-3.5" />
                We reply to every application within five business days.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
