// native/src/evolve/r45/b/LocalMeetupEventsScreen.tsx
//
// Local Meetup Events — a public, date-grouped agenda of nearby
// seller-hosted pop-up/meetup trading events ("Saturday Sneaker Swap —
// Downtown Plaza") that any number of users can browse and RSVP to.
//
// Distinct from `meetup-time` (schedules a single negotiated 1:1 handoff
// time for one already-agreed trade): there is no counterparty here, no
// single agreed trade behind a row, and the same event can have any
// number of attendees. This screen is a browse-and-opt-in feed, not a
// negotiation.
//
// Macro layout: a single flat FlatList mixing date-header rows and event
// rows (built once from the chronologically-ordered dummy data via
// `groupEventsByDate`), so jumping to a specific row can reuse the
// catalog's proven flat-index `scrollToIndex` + focus mechanism rather
// than SectionList's separate section/item-index addressing.
//
// Band mechanic: this is a new member of the established
// selection-count-derived bottom-band family (first seen as a destructive
// multi-select action bar, e.g. `evolve/r27/b/BlockedUsersScreen`), carried
// into a non-destructive opt-in-count domain. The band is derived from
// `attendingCount` (the size of `rsvpedEventIds`), not a boolean, and is
// entirely unmounted at `attendingCount === 0`. Its one action
// (`jumpToNextAttendingEvent`) does a real `scrollToIndex` to the soonest
// event the viewer has RSVP'd to, then moves accessibility focus onto that
// row — not a decorative label.
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
  AccessibilityInfo,
  findNodeHandle,
  type ListRenderItem,
} from "react-native";
import { tokens } from "../../../tokens";
import { MEETUP_EVENTS, groupEventsByDate, type MeetupEvent } from "./data";

const HIGHLIGHT_DURATION_MS = 1600;
const FOCUS_SETTLE_DELAY_MS = 350;

type AgendaRow =
  | { kind: "header"; id: string; dateLabel: string }
  | { kind: "event"; id: string; event: MeetupEvent };

function buildAgendaRows(events: MeetupEvent[]): AgendaRow[] {
  const sections = groupEventsByDate(events);
  const rows: AgendaRow[] = [];
  for (const section of sections) {
    rows.push({
      kind: "header",
      id: `header-${section.dateKey}`,
      dateLabel: section.dateLabel,
    });
    for (const event of section.data) {
      rows.push({ kind: "event", id: event.id, event });
    }
  }
  return rows;
}

function pluralize(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

export default function LocalMeetupEventsScreen() {
  const [rsvpedEventIds, setRsvpedEventIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [highlightedEventId, setHighlightedEventId] = useState<string | null>(
    null,
  );

  const listRef = useRef<FlatList<AgendaRow>>(null);
  const eventNodeRefs = useRef(new Map<string, View | null>());
  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const focusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRetryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (highlightTimer.current) clearTimeout(highlightTimer.current);
      if (focusTimer.current) clearTimeout(focusTimer.current);
      if (scrollRetryTimer.current) clearTimeout(scrollRetryTimer.current);
    };
  }, []);

  const agendaRows = useMemo(() => buildAgendaRows(MEETUP_EVENTS), []);

  const eventRowIndexById = useMemo(() => {
    const map = new Map<string, number>();
    agendaRows.forEach((row, index) => {
      if (row.kind === "event") map.set(row.id, index);
    });
    return map;
  }, [agendaRows]);

  // MEETUP_EVENTS is already in chronological order, so the first RSVP'd
  // event found here is the soonest one the viewer is attending — no date
  // parsing required.
  const nextAttendingEvent = useMemo<MeetupEvent | null>(() => {
    return MEETUP_EVENTS.find((event) => rsvpedEventIds.has(event.id)) ?? null;
  }, [rsvpedEventIds]);

  const attendingCount = rsvpedEventIds.size;
  const showAttendingBand = attendingCount > 0;

  function toggleRsvp(eventId: string) {
    setRsvpedEventIds((prev) => {
      const next = new Set(prev);
      if (next.has(eventId)) next.delete(eventId);
      else next.add(eventId);
      return next;
    });
  }

  function jumpToNextAttendingEvent() {
    if (!nextAttendingEvent) return;
    const index = eventRowIndexById.get(nextAttendingEvent.id);
    if (index === undefined) return;

    listRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.15,
    });

    setHighlightedEventId(nextAttendingEvent.id);
    if (highlightTimer.current) clearTimeout(highlightTimer.current);
    highlightTimer.current = setTimeout(
      () => setHighlightedEventId(null),
      HIGHLIGHT_DURATION_MS,
    );

    if (focusTimer.current) clearTimeout(focusTimer.current);
    focusTimer.current = setTimeout(() => {
      const node = eventNodeRefs.current.get(nextAttendingEvent.id);
      const handle = node ? findNodeHandle(node) : null;
      if (handle) {
        AccessibilityInfo.setAccessibilityFocus(handle);
      }
    }, FOCUS_SETTLE_DELAY_MS);
  }

  const renderRow: ListRenderItem<AgendaRow> = ({ item }) => {
    if (item.kind === "header") {
      return (
        <Text accessibilityRole="header" style={styles.dateHeader}>
          {item.dateLabel}
        </Text>
      );
    }

    const event = item.event;
    const rsvped = rsvpedEventIds.has(event.id);
    const isHighlighted = highlightedEventId === event.id;
    const displayAttendeeCount = event.attendeeCount + (rsvped ? 1 : 0);

    return (
      <View
        ref={(node) => {
          eventNodeRefs.current.set(event.id, node);
        }}
        style={[styles.eventCard, isHighlighted && styles.eventCardHighlighted]}
      >
        <View style={styles.eventBody}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventMeta}>
            {event.location} {"·"} {event.timeLabel}
          </Text>
          <View style={styles.eventSubRow}>
            <View style={styles.tagChip}>
              <Text style={styles.tagChipText}>{event.tag}</Text>
            </View>
            <Text style={styles.eventSubMeta}>
              {`Hosted by ${event.hostName}`}
            </Text>
          </View>
          <Text style={[styles.attendeeText, styles.tabularNums]}>
            {pluralize(displayAttendeeCount, "person going")}
          </Text>
        </View>

        <Pressable
          onPress={() => toggleRsvp(event.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={({ pressed }) => [
            styles.rsvpButton,
            rsvped ? styles.rsvpButtonActive : styles.rsvpButtonInactive,
            pressed && styles.rsvpButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityState={{ selected: rsvped }}
          accessibilityLabel={
            rsvped
              ? `Cancel RSVP for ${event.title}`
              : `RSVP to ${event.title}`
          }
          accessibilityHint={
            rsvped
              ? "Removes your RSVP from this event."
              : "Adds you to the attendee list for this event."
          }
        >
          <Text
            style={
              rsvped ? styles.rsvpButtonTextActive : styles.rsvpButtonText
            }
          >
            {rsvped ? "✓ Going" : "RSVP"}
          </Text>
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.title}>
          Local Meetup Events
        </Text>
        <Text style={styles.subtitle}>
          Browse nearby pop-up trading meetups and RSVP to the ones you want
          to attend.
        </Text>
      </View>

      <FlatList
        ref={listRef}
        data={agendaRows}
        keyExtractor={(row) => row.id}
        renderItem={renderRow}
        contentContainerStyle={[
          styles.listContent,
          showAttendingBand && styles.listContentWithBand,
        ]}
        onScrollToIndexFailed={(info) => {
          listRef.current?.scrollToOffset({
            offset: info.averageItemLength * info.index,
            animated: false,
          });
          if (scrollRetryTimer.current) clearTimeout(scrollRetryTimer.current);
          scrollRetryTimer.current = setTimeout(() => {
            listRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
              viewPosition: 0.15,
            });
          }, 50);
        }}
      />

      {showAttendingBand ? (
        <View style={styles.attendingBand} accessibilityLiveRegion="polite">
          <View style={styles.attendingBandTextGroup}>
            <Text style={styles.attendingBandSummary} accessibilityRole="alert">
              {`Attending ${pluralize(attendingCount, "event")}`}
            </Text>
            {nextAttendingEvent ? (
              <Text style={styles.attendingBandDetail} numberOfLines={1}>
                {`Next up: ${nextAttendingEvent.dateLabel} · ${nextAttendingEvent.title}`}
              </Text>
            ) : null}
          </View>
          <Pressable
            onPress={jumpToNextAttendingEvent}
            style={({ pressed }) => [
              styles.jumpButton,
              pressed && styles.jumpButtonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Jump to your next event"
            accessibilityHint="Scrolls the list to the soonest event you've RSVP'd to and moves focus there."
          >
            <Text style={styles.jumpButtonText}>Jump</Text>
          </Pressable>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  header: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(3),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subtitle: {
    marginTop: tokens.space(1),
    fontSize: 14,
    color: tokens.color.muted,
  },
  listContent: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(6),
  },
  listContentWithBand: {
    paddingBottom: tokens.space(2),
  },
  dateHeader: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink2,
    marginTop: tokens.space(4),
    marginBottom: tokens.space(2),
    paddingBottom: tokens.space(1),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  eventCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: tokens.space(3),
    marginBottom: tokens.space(2),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  eventCardHighlighted: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accentBg,
  },
  eventBody: {
    flex: 1,
    marginRight: tokens.space(3),
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  eventMeta: {
    marginTop: tokens.space(1),
    fontSize: 13,
    color: tokens.color.muted,
  },
  eventSubRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: tokens.space(2),
    gap: tokens.space(2),
  },
  tagChip: {
    paddingHorizontal: tokens.space(2),
    paddingVertical: 3,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accentBg,
  },
  tagChipText: {
    fontSize: 11,
    fontWeight: "600",
    color: tokens.color.accent,
  },
  eventSubMeta: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  attendeeText: {
    marginTop: tokens.space(2),
    fontSize: 12,
    color: tokens.color.faint,
  },
  tabularNums: {
    fontVariant: ["tabular-nums"],
  },
  rsvpButton: {
    minWidth: 76,
    minHeight: 44,
    paddingHorizontal: tokens.space(3),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  rsvpButtonInactive: {
    backgroundColor: tokens.color.bg,
    borderColor: tokens.color.accent,
  },
  rsvpButtonActive: {
    backgroundColor: tokens.color.accent,
    borderColor: tokens.color.accent,
  },
  rsvpButtonPressed: {
    opacity: 0.85,
  },
  rsvpButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  rsvpButtonTextActive: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  attendingBand: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
  },
  attendingBandTextGroup: {
    flex: 1,
    marginRight: tokens.space(3),
  },
  attendingBandSummary: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  attendingBandDetail: {
    marginTop: 2,
    fontSize: 12,
    color: tokens.color.muted,
  },
  jumpButton: {
    minHeight: 44,
    minWidth: 64,
    paddingHorizontal: tokens.space(3),
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  jumpButtonPressed: {
    opacity: 0.85,
  },
  jumpButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
});
