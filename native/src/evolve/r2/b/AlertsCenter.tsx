// native/src/evolve/r2/b/AlertsCenter.tsx — auto-native-r2 candidate b.
// A triage inbox: notifications from three sources (price drops, AI matches, offer-thread
// updates) grouped by date, filterable by category. The core interaction is classifying each
// item in place — mark it read or dismiss it — not opening it into a separate conversation
// (that screen already exists as offer-thread) and not just scrolling a flat feed (that screen
// already exists as watchlist/match). Unread counts are the proof this screen exists to give,
// so they sit in the header and on every tab before any tap, and stay live as items are triaged.
import { useState } from "react";
import { View, Text, Pressable, SectionList, SafeAreaView, StyleSheet } from "react-native";
import {
  ALERTS,
  CATEGORY_GLYPH,
  CATEGORY_LABEL,
  GROUP_ORDER,
  activeCount,
  unreadCount,
  type AlertItem,
  type Category,
  type DateGroup,
  type Filter,
} from "./data";
import { tokens } from "../../../tokens";

type Section = { title: DateGroup; data: AlertItem[] };

const TOUCH_SLOP = { top: 4, bottom: 4, left: 4, right: 4 };

function TabChip({
  label,
  count,
  selected,
  onPress,
}: {
  label: string;
  count: number;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${label}, ${count} unread`}
      style={({ pressed }) => [styles.tab, selected && styles.tabSelected, pressed && styles.pressed]}
    >
      <Text style={[styles.tabLabel, selected && styles.tabLabelSelected]} numberOfLines={1}>
        {label}
      </Text>
      {count > 0 && (
        <View style={[styles.tabBadge, selected && styles.tabBadgeSelected]}>
          <Text style={[styles.tabBadgeText, selected && styles.tabBadgeTextSelected]}>{count}</Text>
        </View>
      )}
    </Pressable>
  );
}

function AlertRow({
  item,
  read,
  onToggleRead,
  onDismiss,
}: {
  item: AlertItem;
  read: boolean;
  onToggleRead: () => void;
  onDismiss: () => void;
}) {
  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={`${read ? "Read" : "Unread"}. ${CATEGORY_LABEL[item.category]} notification. ${item.title}. ${item.time}. ${item.body}`}
    >
      <View style={styles.rowTop}>
        <View style={[styles.glyphWrap, !read && styles.glyphWrapUnread]}>
          <Text style={[styles.glyph, !read && styles.glyphUnread]}>{CATEGORY_GLYPH[item.category]}</Text>
        </View>
        <View style={styles.rowBody}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, !read && styles.titleUnread]} numberOfLines={2}>
              {item.title}
            </Text>
            {!read && (
              <View style={styles.newPill}>
                <Text style={styles.newPillText}>New</Text>
              </View>
            )}
          </View>
          <Text style={styles.body} numberOfLines={2}>
            {item.body}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.meta} numberOfLines={1}>
              {item.meta}
            </Text>
            <Text style={styles.time} numberOfLines={1}>
              {item.time}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.actionRow}>
        <Pressable
          onPress={onToggleRead}
          accessibilityRole="button"
          accessibilityLabel={read ? `Mark ${item.title} as unread` : `Mark ${item.title} as read`}
          hitSlop={TOUCH_SLOP}
          style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
        >
          <Text style={styles.actionBtnText}>{read ? "Mark unread" : "Mark read"}</Text>
        </Pressable>
        <Pressable
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel={`Dismiss ${item.title}`}
          hitSlop={TOUCH_SLOP}
          style={({ pressed }) => [styles.actionBtn, styles.actionBtnStrong, pressed && styles.pressed]}
        >
          <Text style={[styles.actionBtnText, styles.actionBtnStrongText]}>Dismiss</Text>
        </Pressable>
      </View>
    </View>
  );
}

const TABS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "price-drop", label: "Price Drops" },
  { key: "match", label: "Matches" },
  { key: "offer", label: "Offers" },
];

export function AlertsCenter() {
  const [filter, setFilter] = useState<Filter>("all");
  const [readIds, setReadIds] = useState<Set<string>>(
    () => new Set(ALERTS.filter((a) => a.initialRead).map((a) => a.id)),
  );
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(() => new Set());
  const [undoId, setUndoId] = useState<string | null>(null);

  const changeFilter = (next: Filter) => {
    setFilter(next);
    setUndoId(null);
  };

  const toggleRead = (id: string) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const dismiss = (id: string) => {
    setDismissedIds((prev) => new Set(prev).add(id));
    setUndoId(id);
  };

  const undoDismiss = () => {
    if (undoId === null) return;
    setDismissedIds((prev) => {
      const next = new Set(prev);
      next.delete(undoId);
      return next;
    });
    setUndoId(null);
  };

  const markSectionRead = (section: Section) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      for (const a of section.data) next.add(a.id);
      return next;
    });
  };

  const visible = ALERTS.filter((a) => (filter === "all" || a.category === filter) && !dismissedIds.has(a.id));
  const sections: Section[] = GROUP_ORDER.map((g) => ({
    title: g,
    data: visible.filter((a) => a.dateGroup === g),
  })).filter((s) => s.data.length > 0);

  const totalUnread = unreadCount("all", readIds, dismissedIds);
  const totalActive = activeCount("all", dismissedIds);
  const undoTarget = undoId === null ? null : ALERTS.find((a) => a.id === undoId) ?? null;
  const activeLabel = filter === "all" ? "notification" : CATEGORY_LABEL[filter as Category].toLowerCase();

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.h1} accessibilityRole="header">
          Alerts Center
        </Text>
        <Text style={styles.sub} accessibilityLiveRegion="polite">
          {totalUnread} unread of {totalActive} notifications
        </Text>
      </View>

      <View style={styles.tabRow}>
        <TabChip
          label={TABS[0].label}
          count={unreadCount(TABS[0].key, readIds, dismissedIds)}
          selected={filter === TABS[0].key}
          onPress={() => changeFilter(TABS[0].key)}
        />
        <TabChip
          label={TABS[1].label}
          count={unreadCount(TABS[1].key, readIds, dismissedIds)}
          selected={filter === TABS[1].key}
          onPress={() => changeFilter(TABS[1].key)}
        />
        <TabChip
          label={TABS[2].label}
          count={unreadCount(TABS[2].key, readIds, dismissedIds)}
          selected={filter === TABS[2].key}
          onPress={() => changeFilter(TABS[2].key)}
        />
        <TabChip
          label={TABS[3].label}
          count={unreadCount(TABS[3].key, readIds, dismissedIds)}
          selected={filter === TABS[3].key}
          onPress={() => changeFilter(TABS[3].key)}
        />
      </View>

      {undoTarget !== null && (
        <View style={styles.undoBar} accessible accessibilityLiveRegion="polite">
          <Text style={styles.undoText} numberOfLines={1}>
            Dismissed "{undoTarget.title}"
          </Text>
          <Pressable
            onPress={undoDismiss}
            accessibilityRole="button"
            accessibilityLabel={`Undo dismiss of ${undoTarget.title}`}
            hitSlop={TOUCH_SLOP}
            style={({ pressed }) => [styles.undoAction, pressed && styles.pressed]}
          >
            <Text style={styles.undoActionText}>Undo</Text>
          </Pressable>
        </View>
      )}

      {sections.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle} accessibilityRole="header">
            All caught up
          </Text>
          <Text style={styles.emptyBody}>
            You've triaged every {activeLabel} notification here. New alerts will show up in this
            list as they arrive.
          </Text>
          {filter !== "all" && (
            <Pressable
              onPress={() => changeFilter("all")}
              accessibilityRole="button"
              accessibilityLabel="View all notifications"
              style={({ pressed }) => [styles.emptyAction, pressed && styles.pressed]}
            >
              <Text style={styles.emptyActionText}>View all notifications</Text>
            </Pressable>
          )}
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AlertRow
              item={item}
              read={readIds.has(item.id)}
              onToggleRead={() => toggleRead(item.id)}
              onDismiss={() => dismiss(item.id)}
            />
          )}
          renderSectionHeader={({ section }) => {
            const sectionUnread = section.data.some((a) => !readIds.has(a.id));
            return (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText} accessibilityRole="header">
                  {section.title}
                </Text>
                {sectionUnread && (
                  <Pressable
                    onPress={() => markSectionRead(section)}
                    accessibilityRole="button"
                    accessibilityLabel={`Mark all ${section.title} notifications as read`}
                    hitSlop={TOUCH_SLOP}
                    style={({ pressed }) => [styles.sectionAction, pressed && styles.pressed]}
                  >
                    <Text style={styles.sectionActionText}>Mark all read</Text>
                  </Pressable>
                )}
              </View>
            );
          }}
          stickySectionHeadersEnabled
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: tokens.color.bg },

  header: { paddingHorizontal: tokens.space(5), paddingTop: tokens.space(10), paddingBottom: tokens.space(2) },
  h1: { fontSize: 28, fontWeight: "800", color: tokens.color.ink, letterSpacing: -0.5 },
  sub: { marginTop: 6, fontSize: 13, color: tokens.color.faint },

  /* category filter row — plain unbordered chips, not a bounded "card" */
  tabRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: tokens.space(2),
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(3),
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: 36,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  tabSelected: { borderColor: tokens.color.accent, backgroundColor: tokens.color.accent },
  tabLabel: { fontSize: 13, fontWeight: "600", color: tokens.color.ink2 },
  tabLabelSelected: { color: tokens.color.onAccent },
  tabBadge: {
    minWidth: 18,
    paddingHorizontal: 5,
    height: 18,
    borderRadius: tokens.radius.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.color.border,
  },
  tabBadgeSelected: { backgroundColor: tokens.color.onAccent },
  tabBadgeText: { fontSize: 11, fontWeight: "700", color: tokens.color.ink2, fontVariant: ["tabular-nums"] },
  tabBadgeTextSelected: { color: tokens.color.accent },

  /* transient undo notice — bordered card, not accent-filled, not pinned to the screen edge */
  undoBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.space(3),
    marginHorizontal: tokens.space(5),
    marginBottom: tokens.space(2),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(2),
  },
  undoText: { flex: 1, fontSize: 13, color: tokens.color.ink2 },
  undoAction: { minHeight: 32, paddingHorizontal: tokens.space(2), alignItems: "center", justifyContent: "center" },
  undoActionText: { fontSize: 13, fontWeight: "700", color: tokens.color.accent },

  /* grouped date sections */
  listContent: { paddingHorizontal: tokens.space(5), paddingBottom: tokens.space(6) },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: tokens.color.bg,
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(2),
  },
  sectionHeaderText: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.faint,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  sectionAction: { minHeight: 32, paddingHorizontal: tokens.space(2), alignItems: "center", justifyContent: "center" },
  sectionActionText: { fontSize: 12, fontWeight: "700", color: tokens.color.accent },

  /* row — static content block, only the two action buttons are pressable */
  row: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    marginBottom: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  rowTop: { flexDirection: "row", gap: tokens.space(3) },
  glyphWrap: {
    width: 32,
    height: 32,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  glyphWrapUnread: { borderColor: tokens.color.accent },
  glyph: { fontSize: 13, color: tokens.color.faint },
  glyphUnread: { color: tokens.color.accent },
  rowBody: { flex: 1 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: tokens.space(2) },
  title: { flexShrink: 1, fontSize: 15, fontWeight: "600", color: tokens.color.ink2, lineHeight: 21 },
  titleUnread: { fontWeight: "800", color: tokens.color.ink },
  newPill: { backgroundColor: tokens.color.accent, borderRadius: tokens.radius.sm, paddingHorizontal: 6, paddingVertical: 2 },
  newPillText: { fontSize: 10, fontWeight: "700", color: tokens.color.onAccent, letterSpacing: 0.3 },
  body: { marginTop: 4, fontSize: 13, color: tokens.color.muted, lineHeight: 18 },
  metaRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8, gap: tokens.space(2) },
  meta: { flexShrink: 1, fontSize: 12, fontWeight: "600", color: tokens.color.ink2, fontVariant: ["tabular-nums"] },
  time: { fontSize: 11, color: tokens.color.faint, fontVariant: ["tabular-nums"] },

  /* per-row quick actions */
  actionRow: { flexDirection: "row", gap: tokens.space(2), marginTop: tokens.space(3) },
  actionBtn: {
    minHeight: 36,
    flexGrow: 1,
    flexBasis: 0,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(2),
  },
  actionBtnStrong: { borderColor: tokens.color.ink2, backgroundColor: tokens.color.ink2 },
  actionBtnText: { fontSize: 12, fontWeight: "700", color: tokens.color.ink2 },
  actionBtnStrongText: { color: tokens.color.onAccent },

  /* empty state — copy + explicit way back to a non-empty view */
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(6),
    gap: tokens.space(2),
  },
  emptyTitle: { fontSize: 17, fontWeight: "800", color: tokens.color.ink },
  emptyBody: { fontSize: 13, color: tokens.color.muted, lineHeight: 19, textAlign: "center" },
  emptyAction: {
    marginTop: tokens.space(2),
    minHeight: 44,
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyActionText: { fontSize: 13, fontWeight: "700", color: tokens.color.accent },

  pressed: { opacity: 0.85 },
});
