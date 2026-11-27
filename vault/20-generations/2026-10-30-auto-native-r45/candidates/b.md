Check string: "Local Meetup Events"

# Candidate b — Local Meetup Events

`native/src/evolve/r45/b/LocalMeetupEventsScreen.tsx` + `data.ts`.

## Concept

A public, date-grouped agenda feed of nearby seller-hosted pop-up/meetup
trading events ("Saturday Sneaker Swap — Downtown Plaza") that any number
of users can browse and RSVP to, distinct from `meetup-time` (a single
negotiated 1:1 handoff time for one already-agreed trade): there is no
counterparty negotiation and no single agreed trade behind a row — the
same event can have any number of attendees. Macro layout is a single
flat `FlatList` mixing date-header rows and event rows (flattened once
from the chronologically-ordered dummy data), so the bottom band's "jump"
action reuses the catalog's proven flat-index `scrollToIndex` +
`AccessibilityInfo.setAccessibilityFocus` mechanism
(`evolve/r34/a/IdentityReverificationScreen.tsx`) rather than
`SectionList`'s separate section/item addressing.

Band mechanic: a new member of the established selection-count-derived
bottom-band family (first seen as a destructive multi-select action bar,
e.g. `evolve/r27/b/BlockedUsersScreen`), carried into a non-destructive
opt-in-count domain. State/helper names are domain-specific —
`rsvpedEventIds` (a `Set<string>`), `attendingCount` (its `.size`),
`showAttendingBand` (`attendingCount > 0`), `nextAttendingEvent`,
`jumpToNextAttendingEvent` — not copied verbatim from any prior
implementation. The band is entirely absent at `attendingCount === 0` and
its one action does a real `scrollToIndex` to the soonest RSVP'd event
plus moves accessibility focus onto that row.

Export: default export `LocalMeetupEventsScreen` from
`LocalMeetupEventsScreen.tsx`.

## Brief gaps

① What "jump to the next upcoming one you're attending" means when there
is no live clock in a deterministic-data screen (no `Date.now()`/`new
Date()` allowed) — "upcoming" can't be computed by comparing to "now".
② Defined it as: the dummy data array (`MEETUP_EVENTS`) is already listed
in chronological order, and "next upcoming attending event" = the first
event in that array whose id is in `rsvpedEventIds`.
③ This sidesteps date math entirely (determinism rule forbids
`Date.now()`/bare `new Date()`), mirrors how other evolve screens treat
a pre-sorted dummy array as ground truth for ordering (e.g.
`SellerBadgeTrackerScreen`'s `TIERS.sort(...)` done once over static data,
not live time), and is the only interpretation that doesn't require
inventing an arbitrary "today" constant with no visible meaning on screen.

① Whether to build this as a `SectionList` (natively suited to a
date-grouped agenda, per the brief's own suggestion) or a flat `FlatList`
with header rows mixed in.
② Chose a flat `FlatList` with `{kind: "header"} | {kind: "event"}` rows
built once via a pure `buildAgendaRows()` helper.
③ `SectionList.scrollToLocation`'s `sectionIndex`/`itemIndex` addressing
has a well-known offset footgun (header rows interacting with
`itemIndex` counting) that's easy to get subtly wrong without a way to
run the app and verify; a flat list's `scrollToIndex` is the exact,
already-proven mechanism this catalog uses for the "jump band"
interaction (`IdentityReverificationScreen`), so reusing it trades a
theoretically tidier primitive for one with a verified-correct precedent
in this repo.

① How much attendee-count detail to show per row — the brief only says a
row should show "title/location/time and an RSVP Pressable", not whether
to surface how many others are going.
② Added a small "`N people going`" line per row, incrementing by 1 when
the viewer RSVPs.
③ Arbitrary addition in service of the domain feeling real (a public
RSVP feed's main social signal is attendance count) — kept inside the
existing near-monochrome + single-accent palette (no new color), so it
doesn't add any DNA risk.

① Whether the fixed top header (title + subtitle) should scroll away with
the list or stay pinned.
② Made it a fixed `View` outside the `FlatList` (never scrolls).
③ Matches the plainest existing precedent in the catalog
(`BlockedUsersScreen`'s fixed header block above its list) for a screen
with no multi-stage prerequisite chain that would need a sticky
summary card.
