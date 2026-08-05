import { CalendarDays, CircleDot, MapPin } from "lucide-react";
import { PROFILE } from "./data";

export default function IntroSection() {
  return (
    <section aria-labelledby="about-heading" className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-emerald-700">{PROFILE.practice}</p>
          <h2 id="about-heading" className="mt-1 text-lg font-semibold text-zinc-900">
            About
          </h2>
          <p className="mt-2 text-sm font-normal leading-relaxed text-zinc-700">{PROFILE.bio}</p>

          <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            <div className="flex items-center gap-1.5">
              <dt className="flex items-center text-zinc-600">
                <MapPin aria-hidden="true" className="h-4 w-4 shrink-0" />
                <span className="sr-only">Location</span>
              </dt>
              <dd className="text-sm font-normal text-zinc-700">
                {PROFILE.location} &middot; {PROFILE.remoteNote}
              </dd>
            </div>
            <div className="flex items-center gap-1.5">
              <dt className="flex items-center text-zinc-600">
                <CalendarDays aria-hidden="true" className="h-4 w-4 shrink-0" />
                <span className="sr-only">Practicing since</span>
              </dt>
              <dd className="text-sm font-normal text-zinc-700">Practicing since {PROFILE.memberSince}</dd>
            </div>
          </dl>
        </div>

        <div className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-sm font-medium text-emerald-800">
          <CircleDot aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
          {PROFILE.availability}
        </div>
      </div>
    </section>
  );
}
