import { ArrowRight, Mail } from "lucide-react";
import { RoleSearch } from "./role-search";
import { BenefitsTable } from "./benefits-table";
import { LifeStrip } from "./life-strip";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

export default function CareersPage() {
  return (
    <main className="min-h-dvh bg-white">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-16 sm:px-6 sm:pt-24 lg:px-8">
        <p className="text-sm font-medium tracking-wide text-orange-700">Careers at Portside</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight text-zinc-900 sm:text-5xl">
          Freight shouldn&rsquo;t wait on a phone call.
        </h1>
        <p className="mt-5 max-w-2xl text-lg font-normal leading-relaxed text-zinc-700">
          Portside matches open trailer capacity with shippers who need it, in real time. We are{" "}
          <span className="tabular-nums font-medium text-zinc-900">126</span> people across four
          hubs, moving freight that used to sit on hold.
        </p>
      </section>

      {/* Role search */}
      <section
        aria-labelledby="roles-heading"
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
      >
        <h2 id="roles-heading" className="text-2xl font-bold text-zinc-900">
          Find your role
        </h2>
        <p className="mt-2 max-w-2xl text-base font-normal leading-relaxed text-zinc-700">
          {`${10} open roles`} across Engineering, Design, Data, Sales, Support, and Operations.
        </p>
        <div className="mt-8 max-w-3xl">
          <RoleSearch />
        </div>
      </section>

      {/* Benefits */}
      <section
        aria-labelledby="benefits-heading"
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
      >
        <h2 id="benefits-heading" className="text-2xl font-bold text-zinc-900">
          Benefits by employment type
        </h2>
        <p className="mt-2 max-w-2xl text-base font-normal leading-relaxed text-zinc-700">
          Coverage differs a little between a US full-time offer, an international or remote
          full-time offer, and a contract engagement. Sort any column to compare.
        </p>
        <div className="mt-8">
          <BenefitsTable />
        </div>
      </section>

      {/* Life at Portside */}
      <section
        aria-labelledby="life-heading"
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
      >
        <h2 id="life-heading" className="text-2xl font-bold text-zinc-900">
          Life at Portside
        </h2>
        <p className="mt-2 max-w-2xl text-base font-normal leading-relaxed text-zinc-700">
          A distributed team that still makes a point of being in the same room, and on the
          same dock, on purpose.
        </p>
        <div className="mt-8">
          <LifeStrip />
        </div>
      </section>

      {/* Footer / contact */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-zinc-200 bg-zinc-50 px-6 py-12 text-center sm:px-12">
          <h2 className="text-2xl font-bold text-zinc-900">Don&rsquo;t see the right role?</h2>
          <p className="mx-auto mt-3 max-w-xl text-base font-normal leading-relaxed text-zinc-700">
            We keep this list current, but we still want to hear from people who move freight
            or build the software that moves it. Send us a note.
          </p>
          <a
            href="mailto:careers@portside.io?subject=General%20application"
            className={`mt-6 inline-flex items-center gap-2 rounded-full bg-orange-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-orange-700 ${FOCUS_RING}`}
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            careers@portside.io
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </section>
    </main>
  );
}
