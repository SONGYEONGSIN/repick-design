import { FOCUS_RING, PEOPLE } from "./data";

/**
 * Second wired interaction (two mechanisms, no client JS needed for either): a letter-jump nav of
 * real in-page anchor links, and a native <details>/<summary> per row for the individual bio. Names
 * and roles for all 12 people are unconditionally visible — the People section's core content
 * contract — the <details> only ever hides the longer bio paragraph, never the name or title.
 */
export default function PeopleIndex() {
  const sorted = [...PEOPLE].sort((a, b) => a.name.localeCompare(b.name));
  const letters = [...new Set(sorted.map((p) => p.name.charAt(0).toUpperCase()))];

  return (
    <div>
      <nav aria-label="Jump to letter" className="flex flex-wrap gap-1.5 border-b border-zinc-200 pb-4">
        {letters.map((letter) => (
          <a
            key={letter}
            href={`#person-letter-${letter}`}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 text-sm font-semibold text-zinc-700 hover:border-lime-700 hover:text-lime-800 ${FOCUS_RING}`}
          >
            {letter}
          </a>
        ))}
      </nav>

      <ul className="mt-2 divide-y divide-zinc-200">
        {sorted.map((person, i) => {
          const letter = person.name.charAt(0).toUpperCase();
          const isFirstOfLetter = i === 0 || sorted[i - 1].name.charAt(0).toUpperCase() !== letter;
          return (
            <li key={person.name} id={isFirstOfLetter ? `person-letter-${letter}` : undefined} className="scroll-mt-24 py-4">
              <details>
                <summary
                  className={`flex cursor-pointer list-none items-center gap-4 rounded-md ${FOCUS_RING}`}
                >
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 flex-none items-center justify-center rounded-full text-sm font-semibold text-white"
                    style={{ backgroundColor: person.accent }}
                  >
                    {person.initials}
                  </span>
                  <span>
                    <span className="block text-base font-semibold text-zinc-900">{person.name}</span>
                    <span className="block text-sm font-normal text-zinc-600">{person.role}</span>
                  </span>
                </summary>
                <p className="ml-14 mt-3 max-w-2xl text-sm font-normal leading-relaxed text-zinc-700">{person.bio}</p>
              </details>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
