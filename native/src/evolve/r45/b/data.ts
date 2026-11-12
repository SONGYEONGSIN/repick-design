// native/src/evolve/r45/b/data.ts
//
// Deterministic dummy data for the Local Meetup Events screen.
//
// Domain: a public, many-to-many events feed — nearby seller-hosted
// pop-up/meetup trading events that any number of users can browse and
// RSVP to. This is NOT the existing `meetup-time` screen (a single
// negotiated 1:1 handoff time for one already-agreed trade): there is no
// counterparty negotiation here, no agreed trade behind any row, and any
// number of users can attend the same event.
//
// No Math.random / Date.now / bare `new Date()` anywhere below — every
// date and time is a fixed literal. `dateKey` uses a sortable "YYYY-MM-DD"
// form purely so events can be grouped/ordered without any date parsing;
// the array below is already listed in chronological order, which the
// screen relies on directly instead of re-deriving it at runtime.

export interface MeetupEvent {
  id: string;
  title: string;
  location: string;
  neighborhood: string;
  /** Sortable literal, e.g. "2026-11-14". Used only as a grouping key. */
  dateKey: string;
  /** Human-facing date heading, e.g. "Sat, Nov 14". */
  dateLabel: string;
  /** Human-facing time range, e.g. "10:00 AM – 1:00 PM". */
  timeLabel: string;
  hostName: string;
  /** Attendees already going, not counting the viewer's own RSVP. */
  attendeeCount: number;
  tag: string;
}

// Listed in chronological order by (dateKey, start time) — the screen
// depends on this ordering to find "the next upcoming event you're
// attending" without doing any date math.
export const MEETUP_EVENTS: MeetupEvent[] = [
  {
    id: "evt-sneaker-swap",
    title: "Saturday Sneaker Swap — Downtown Plaza",
    location: "Downtown Plaza, Fountain Court",
    neighborhood: "Downtown",
    dateKey: "2026-11-14",
    dateLabel: "Sat, Nov 14",
    timeLabel: "10:00 AM – 1:00 PM",
    hostName: "Marcus T.",
    attendeeCount: 18,
    tag: "Sneakers",
  },
  {
    id: "evt-denim-popup",
    title: "Vintage Denim Pop-Up",
    location: "Riverside Market, Stall 7",
    neighborhood: "Riverside",
    dateKey: "2026-11-14",
    dateLabel: "Sat, Nov 14",
    timeLabel: "2:00 PM – 5:00 PM",
    hostName: "Priya K.",
    attendeeCount: 9,
    tag: "Streetwear",
  },
  {
    id: "evt-card-table",
    title: "Trading Card Table Meetup",
    location: "Maple Park, East Pavilion",
    neighborhood: "Maple Park",
    dateKey: "2026-11-15",
    dateLabel: "Sun, Nov 15",
    timeLabel: "11:00 AM – 2:00 PM",
    hostName: "Devon R.",
    attendeeCount: 24,
    tag: "Collectibles",
  },
  {
    id: "evt-camera-swap",
    title: "Camera Gear Swap Meet",
    location: "Union Hall, Lower Level",
    neighborhood: "Union Hall",
    dateKey: "2026-11-15",
    dateLabel: "Sun, Nov 15",
    timeLabel: "3:00 PM – 6:00 PM",
    hostName: "Elena S.",
    attendeeCount: 6,
    tag: "Electronics",
  },
  {
    id: "evt-kids-trade",
    title: "Kids Gear & Toy Trade Morning",
    location: "Willow Community Center",
    neighborhood: "Willow",
    dateKey: "2026-11-21",
    dateLabel: "Sat, Nov 21",
    timeLabel: "9:00 AM – 11:30 AM",
    hostName: "Fatima N.",
    attendeeCount: 12,
    tag: "Family",
  },
  {
    id: "evt-craft-meetup",
    title: "Handmade & Craft Supplies Meetup",
    location: "Birchwood Library Annex",
    neighborhood: "Birchwood",
    dateKey: "2026-11-21",
    dateLabel: "Sat, Nov 21",
    timeLabel: "1:00 PM – 4:00 PM",
    hostName: "Oscar V.",
    attendeeCount: 5,
    tag: "Crafts",
  },
];

export interface EventAgendaSection {
  dateKey: string;
  dateLabel: string;
  data: MeetupEvent[];
}

/**
 * Groups the (already chronologically ordered) flat event list into
 * date-headed sections for a SectionList agenda. Pure function, no
 * hidden state — adjacent events sharing a dateKey fold into one section.
 */
export function groupEventsByDate(
  events: MeetupEvent[],
): EventAgendaSection[] {
  const sections: EventAgendaSection[] = [];
  for (const event of events) {
    const current = sections[sections.length - 1];
    if (current && current.dateKey === event.dateKey) {
      current.data.push(event);
    } else {
      sections.push({
        dateKey: event.dateKey,
        dateLabel: event.dateLabel,
        data: [event],
      });
    }
  }
  return sections;
}
