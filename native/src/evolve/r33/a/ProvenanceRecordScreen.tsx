// ProvenanceRecordScreen — a READ-ONLY RECORD screen (not a gated workflow).
// Per native/GENERATION.md §3: already-complete historical views don't get the
// blocked/ready/done state-machine band. The bottom bar here is a persistently
// mounted action surface where every button is already fully actionable —
// nothing is disabled "waiting" on an unresolved step.
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Share,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  ITEM,
  INITIAL_EVENTS,
  REFERENCE_NOW,
  ProvenanceEvent,
  daysBetween,
  humanizeKind,
  formatDate,
} from "./data";
import EventRow from "./EventRow";

const ANNOUNCEMENT_LIFETIME_MS = 5000;

type FilterMode = "all" | "verifiedOnly";

function plural(count: number, word: string): string {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

function ordinal(n: number): string {
  const rem100 = n % 100;
  if (rem100 >= 11 && rem100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

export default function ProvenanceRecordScreen() {
  const [events, setEvents] = useState<ProvenanceEvent[]>(INITIAL_EVENTS);
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [liveMessage, setLiveMessage] = useState<string>("");

  const announceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listRef = useRef<FlatList<ProvenanceEvent>>(null);

  const announce = useCallback((message: string) => {
    if (announceTimerRef.current) {
      clearTimeout(announceTimerRef.current);
    }
    setLiveMessage(message);
    announceTimerRef.current = setTimeout(() => {
      setLiveMessage((current) => (current === message ? "" : current));
    }, ANNOUNCEMENT_LIFETIME_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (announceTimerRef.current) clearTimeout(announceTimerRef.current);
    };
  }, []);

  // Every number here is recomputed from the same `events` state that the
  // per-row flag action mutates, rather than tracked as a separate counter.
  const stats = useMemo(() => {
    let ownerCount = 0;
    let verifiedCount = 0;
    let flaggedCount = 0;
    for (const event of events) {
      if (event.ownerIndex && event.ownerIndex > ownerCount) {
        ownerCount = event.ownerIndex;
      }
      if (event.verified) verifiedCount += 1;
      if (event.flagged) flaggedCount += 1;
    }
    return { ownerCount, verifiedCount, flaggedCount };
  }, [events]);

  const visibleEvents = useMemo(
    () => (filterMode === "verifiedOnly" ? events.filter((e) => e.verified) : events),
    [events, filterMode]
  );

  const trackedDays = useMemo(
    () => daysBetween(ITEM.listedOnRepickISO, REFERENCE_NOW),
    []
  );

  const toggleFlag = useCallback(
    (id: string) => {
      setEvents((current) => {
        const next = current.map((event) =>
          event.id === id ? { ...event, flagged: !event.flagged } : event
        );
        const target = next.find((event) => event.id === id);
        if (target) {
          announce(
            target.flagged
              ? `Flagged the ${humanizeKind(target.kind)} entry from ${formatDate(target.dateISO)} for review.`
              : `Removed the flag from the ${humanizeKind(target.kind)} entry.`
          );
        }
        return next;
      });
    },
    [announce]
  );

  const setFilter = useCallback((mode: FilterMode) => {
    setFilterMode(mode);
  }, []);

  const handleShare = useCallback(() => {
    const message =
      `Provenance record for ${ITEM.name} (${ITEM.referenceCode}): ` +
      `${ordinal(stats.ownerCount)} confirmed owner, ${plural(stats.verifiedCount, "verified checkpoint")} ` +
      `across ${plural(events.length, "recorded event")}.`;
    Share.share({ message }).catch(() => {
      // User dismissed the share sheet or the platform has no share target
      // configured — nothing further to do from this screen.
    });
  }, [stats, events.length]);

  const handleJumpToLatest = useCallback(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, []);

  const renderItem = useCallback(
    ({ item, index }: { item: ProvenanceEvent; index: number }) => (
      <EventRow
        event={item}
        isLast={index === visibleEvents.length - 1}
        onToggleFlag={toggleFlag}
      />
    ),
    [visibleEvents.length, toggleFlag]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.title}>
          Provenance Record
        </Text>
        <Text style={styles.itemName}>{ITEM.name}</Text>
        <Text style={styles.itemMeta}>
          {ITEM.referenceCode} · {ITEM.category}
        </Text>
        <Text style={styles.trackedLine}>
          Tracked on repick for {trackedDays.toLocaleString("en-US")} days
        </Text>
      </View>

      <View style={styles.statRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{ordinal(stats.ownerCount)}</Text>
          <Text style={styles.statLabel}>confirmed owner</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.verifiedCount}</Text>
          <Text style={styles.statLabel}>verified checkpoints</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.flaggedCount}</Text>
          <Text style={styles.statLabel}>flagged for review</Text>
        </View>
      </View>

      {/* Single live region for the whole screen — per-row flag toggles are
          the only state change worth announcing on a read-only record. */}
      <Text
        style={styles.srOnly}
        accessibilityLiveRegion="polite"
        accessibilityRole={liveMessage ? "alert" : undefined}
      >
        {liveMessage}
      </Text>

      <View style={styles.filterRow}>
        <Pressable
          onPress={() => setFilter("all")}
          accessibilityRole="button"
          accessibilityLabel="Show all recorded events"
          hitSlop={6}
          style={[styles.filterChip, filterMode === "all" ? styles.filterChipActive : null]}
        >
          <Text
            style={[
              styles.filterChipText,
              filterMode === "all" ? styles.filterChipTextActive : null,
            ]}
          >
            All events
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setFilter("verifiedOnly")}
          accessibilityRole="button"
          accessibilityLabel="Show only verified checkpoints"
          hitSlop={6}
          style={[
            styles.filterChip,
            filterMode === "verifiedOnly" ? styles.filterChipActive : null,
          ]}
        >
          <Text
            style={[
              styles.filterChipText,
              filterMode === "verifiedOnly" ? styles.filterChipTextActive : null,
            ]}
          >
            Verified only
          </Text>
        </Pressable>
      </View>

      <FlatList
        ref={listRef}
        data={visibleEvents}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        extraData={events}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
          <Text style={styles.footerNote}>
            End of record. Anything before manufacture isn't tracked by repick.
          </Text>
        }
      />

      <View style={styles.actionBar}>
        <Pressable
          onPress={handleShare}
          accessibilityRole="button"
          accessibilityLabel="Share this provenance record"
          style={({ pressed }) => [
            styles.actionButton,
            styles.actionButtonSecondary,
            pressed ? styles.actionButtonPressed : null,
          ]}
        >
          <Text style={styles.actionButtonSecondaryText}>Share record</Text>
        </Pressable>
        <Pressable
          onPress={handleJumpToLatest}
          accessibilityRole="button"
          accessibilityLabel="Jump to the latest recorded event"
          style={({ pressed }) => [
            styles.actionButton,
            styles.actionButtonPrimary,
            pressed ? styles.actionButtonPressed : null,
          ]}
        >
          <Text style={styles.actionButtonPrimaryText}>Jump to latest</Text>
        </Pressable>
      </View>
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
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.accent,
    letterSpacing: 0.5,
  },
  itemName: {
    fontSize: 21,
    fontWeight: "700",
    color: tokens.color.ink,
    marginTop: tokens.space(1),
  },
  itemMeta: {
    fontSize: 13,
    color: tokens.color.muted,
    marginTop: tokens.space(1) / 2,
  },
  trackedLine: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: tokens.space(2),
    fontVariant: ["tabular-nums"],
  },
  statRow: {
    flexDirection: "row",
    marginHorizontal: tokens.space(4),
    marginTop: tokens.space(4),
    paddingVertical: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: tokens.color.border,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  statLabel: {
    fontSize: 11,
    color: tokens.color.faint,
    marginTop: tokens.space(1) / 2,
    textAlign: "center",
  },
  srOnly: {
    position: "absolute",
    width: 1,
    height: 1,
    overflow: "hidden",
    opacity: 0,
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: tokens.space(4),
    marginTop: tokens.space(4),
    marginBottom: tokens.space(1),
  },
  filterChip: {
    minHeight: 36,
    paddingHorizontal: tokens.space(3),
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    marginRight: tokens.space(2),
  },
  filterChipActive: {
    backgroundColor: tokens.color.accentBg,
    borderColor: tokens.color.accent,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.muted,
  },
  filterChipTextActive: {
    color: tokens.color.accent,
  },
  listContent: {
    paddingTop: tokens.space(2),
    paddingBottom: tokens.space(8),
  },
  footerNote: {
    fontSize: 12,
    color: tokens.color.faint,
    textAlign: "center",
    paddingHorizontal: tokens.space(8),
    paddingTop: tokens.space(2),
    paddingBottom: tokens.space(6),
  },
  actionBar: {
    flexDirection: "row",
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(3),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  actionButton: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
  },
  actionButtonPressed: {
    opacity: 0.85,
  },
  actionButtonSecondary: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    marginRight: tokens.space(3),
  },
  actionButtonSecondaryText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  actionButtonPrimary: {
    backgroundColor: tokens.color.accent,
  },
  actionButtonPrimaryText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
});
