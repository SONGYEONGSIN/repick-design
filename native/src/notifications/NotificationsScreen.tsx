// native/src/NotificationsScreen.tsx — auto-native-r4 candidate b.
// Screen type: Notifications / Activity feed — a browse screen with no terminal/completion
// action (there is nothing here to "finish"). Per accumulated native deltas, that calls for
// zero fixed header/footer chrome: everything — title, filters, mark-all-as-read — scrolls
// away with the list inside a single FlatList's ListHeaderComponent, and every change (marking
// a row read, narrowing the filter) applies immediately in place.
import { useMemo, useState } from "react";
import { View, Text, Pressable, FlatList, SafeAreaView, StyleSheet } from "react-native";
import {
  CATEGORY_FILTERS,
  INITIAL_NOTIFICATIONS,
  TYPE_META,
  unreadCount,
  type AppNotification,
  type NotificationType,
} from "./data";
import { tokens } from "../tokens";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
type CategoryKey = NotificationType | "all";

/* ───────── type monogram badge — distinguishes event type by label/shape, not hue ───────── */

function TypeBadge({ type }: { type: NotificationType }) {
  const meta = TYPE_META[type];
  return (
    <View style={styles.badge} accessible={false}>
      <Text style={styles.badgeText}>{meta.monogram}</Text>
    </View>
  );
}

/* ───────── one notification row ───────── */

function NotificationRow({
  item,
  onPress,
}: {
  item: AppNotification;
  onPress: (id: string) => void;
}) {
  const meta = TYPE_META[item.type];
  const spoken = `${meta.label} notification, ${item.read ? "read" : "unread"}. ${item.title}. ${item.body} ${item.time}. Double tap to open.`;
  return (
    <Pressable
      onPress={() => onPress(item.id)}
      accessibilityRole="button"
      accessibilityLabel={spoken}
      accessibilityState={{ selected: !item.read }}
      style={({ pressed }) => [
        styles.row,
        item.read ? styles.rowRead : styles.rowUnread,
        pressed && styles.pressed,
      ]}
    >
      <TypeBadge type={item.type} />
      <View style={styles.rowBody}>
        <View style={styles.rowTopLine}>
          <Text style={styles.typeLabel}>{meta.label}</Text>
          <View style={styles.rowTopRight}>
            {!item.read && (
              <View style={styles.newTagRow}>
                <View style={styles.unreadDot} />
                <Text style={styles.newTag}>New</Text>
              </View>
            )}
            <Text style={styles.time}>{item.time}</Text>
          </View>
        </View>
        <Text style={[styles.title, item.read ? styles.titleRead : styles.titleUnread]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.body} numberOfLines={2}>
          {item.body}
        </Text>
        <Text style={styles.source}>{item.source}</Text>
      </View>
      <Text style={styles.chevron} accessibilityElementsHidden importantForAccessibility="no">
        {"›"}
      </Text>
    </Pressable>
  );
}

/* ───────── header: title, mark-all-as-read, category chips, unread-only toggle ───────── */

function CategoryChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={`Filter: ${label}${active ? ", selected" : ""}`}
      hitSlop={HIT_SLOP}
      style={({ pressed }) => [styles.chip, active && styles.chipOn, pressed && styles.pressed]}
    >
      <Text style={[styles.chipLabel, active && styles.chipLabelOn]}>{label}</Text>
    </Pressable>
  );
}

function ScreenHeader({
  total,
  unread,
  category,
  onCategoryChange,
  unreadOnly,
  onToggleUnreadOnly,
  onMarkAllRead,
}: {
  total: number;
  unread: number;
  category: CategoryKey;
  onCategoryChange: (c: CategoryKey) => void;
  unreadOnly: boolean;
  onToggleUnreadOnly: () => void;
  onMarkAllRead: () => void;
}) {
  const allCaughtUp = unread === 0;
  return (
    <View style={styles.header}>
      <View style={styles.headTopRow}>
        <View style={styles.headTitleCol}>
          <Text style={styles.h1} accessibilityRole="header">
            Notifications
          </Text>
          <Text style={styles.sub}>
            {unread} unread of {total}
          </Text>
        </View>
        <Pressable
          onPress={onMarkAllRead}
          disabled={allCaughtUp}
          accessibilityRole="button"
          accessibilityLabel={allCaughtUp ? "All caught up, nothing left to mark read" : `Mark all ${unread} as read`}
          accessibilityState={{ disabled: allCaughtUp }}
          hitSlop={HIT_SLOP}
          style={({ pressed }) => [
            styles.markAllBtn,
            allCaughtUp && styles.markAllBtnDisabled,
            pressed && !allCaughtUp && styles.pressed,
          ]}
        >
          <Text style={[styles.markAllLabel, allCaughtUp && styles.markAllLabelDisabled]}>
            {allCaughtUp ? "All caught up" : "Mark all read"}
          </Text>
        </Pressable>
      </View>

      <Text style={styles.filterHeading}>Category</Text>
      <View style={styles.chipRow} accessibilityRole="radiogroup" accessibilityLabel="Filter by category">
        {CATEGORY_FILTERS.map((f) => (
          <CategoryChip key={f.key} label={f.label} active={category === f.key} onPress={() => onCategoryChange(f.key)} />
        ))}
      </View>

      <Pressable
        onPress={onToggleUnreadOnly}
        accessibilityRole="switch"
        accessibilityState={{ checked: unreadOnly }}
        accessibilityLabel={`Unread only, ${unreadOnly ? "on" : "off"}`}
        hitSlop={HIT_SLOP}
        style={({ pressed }) => [styles.unreadToggleRow, pressed && styles.pressed]}
      >
        <View style={[styles.track, unreadOnly ? styles.trackOn : styles.trackOff]}>
          <View style={[styles.thumb, unreadOnly ? styles.thumbOn : styles.thumbOff]} />
        </View>
        <Text style={styles.unreadToggleLabel}>Unread only</Text>
      </Pressable>
    </View>
  );
}

/* ───────── empty state ───────── */

function EmptyState() {
  return (
    <View style={styles.empty} accessible accessibilityLabel="No notifications match this filter">
      <Text style={styles.emptyTitle}>No notifications here</Text>
      <Text style={styles.emptyBody}>Try a different category, or turn off “Unread only”.</Text>
    </View>
  );
}

/* ───────── screen ───────── */

export function NotificationsScreen() {
  const [items, setItems] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [category, setCategory] = useState<CategoryKey>("all");
  const [unreadOnly, setUnreadOnly] = useState(false);

  const markRead = (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const filtered = useMemo(() => {
    return items.filter((n) => {
      if (category !== "all" && n.type !== category) return false;
      if (unreadOnly && n.read) return false;
      return true;
    });
  }, [items, category, unreadOnly]);

  const unread = unreadCount(items);

  return (
    <SafeAreaView style={styles.root}>
      <FlatList
        data={filtered}
        keyExtractor={(n) => n.id}
        renderItem={({ item }) => <NotificationRow item={item} onPress={markRead} />}
        ListHeaderComponent={
          <ScreenHeader
            total={items.length}
            unread={unread}
            category={category}
            onCategoryChange={setCategory}
            unreadOnly={unreadOnly}
            onToggleUnreadOnly={() => setUnreadOnly((v) => !v)}
            onMarkAllRead={markAllRead}
          />
        }
        ListEmptyComponent={EmptyState}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: tokens.color.bg },
  list: { paddingHorizontal: tokens.space(5), paddingBottom: tokens.space(10) },

  /* header — scrolls with the list, nothing pinned (no terminal action on this screen) */
  header: { paddingTop: tokens.space(10), paddingBottom: tokens.space(4) },
  headTopRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  headTitleCol: { flex: 1, paddingRight: tokens.space(3) },
  h1: { fontSize: 28, fontWeight: "800", color: tokens.color.ink, letterSpacing: -0.5 },
  sub: { marginTop: 6, fontSize: 13, color: tokens.color.faint },

  markAllBtn: {
    minHeight: 44,
    paddingHorizontal: tokens.space(3),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  markAllBtnDisabled: { borderColor: tokens.color.border },
  markAllLabel: { fontSize: 12, fontWeight: "700", color: tokens.color.accent },
  markAllLabelDisabled: { color: tokens.color.faint },

  filterHeading: {
    marginTop: tokens.space(6),
    marginBottom: tokens.space(2),
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.muted,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: tokens.space(2) },
  chip: {
    minHeight: 44,
    paddingHorizontal: tokens.space(3),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  chipOn: { backgroundColor: tokens.color.accent, borderColor: tokens.color.accent },
  chipLabel: { fontSize: 13, fontWeight: "600", color: tokens.color.muted },
  chipLabelOn: { color: tokens.color.onAccent },

  unreadToggleRow: {
    marginTop: tokens.space(5),
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    minHeight: 44,
  },
  unreadToggleLabel: { fontSize: 14, fontWeight: "600", color: tokens.color.ink2 },
  track: {
    width: 40,
    height: 24,
    borderRadius: tokens.radius.md,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: tokens.space(1),
  },
  trackOn: { backgroundColor: tokens.color.accent, justifyContent: "flex-end" },
  trackOff: {
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.border,
    justifyContent: "flex-start",
  },
  thumb: { width: 12, height: 12, borderRadius: tokens.radius.sm },
  thumbOn: { backgroundColor: tokens.color.onAccent },
  thumbOff: { backgroundColor: tokens.color.faint },

  /* notification row */
  separator: { height: tokens.space(3) },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: tokens.space(3),
    borderWidth: 1,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    minHeight: 44,
  },
  rowRead: { borderColor: tokens.color.border, backgroundColor: tokens.color.bg },
  rowUnread: { borderColor: tokens.color.accent, backgroundColor: tokens.color.bg, borderLeftWidth: 4 },
  pressed: { opacity: 0.85 },

  badge: {
    width: 36,
    height: 36,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { fontSize: 11, fontWeight: "800", color: tokens.color.ink2, letterSpacing: 0.5 },

  rowBody: { flex: 1, gap: 4 },
  rowTopLine: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  typeLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.faint,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  rowTopRight: { flexDirection: "row", alignItems: "center", gap: tokens.space(2) },
  newTagRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  unreadDot: { width: 6, height: 6, borderRadius: tokens.radius.sm, backgroundColor: tokens.color.accent },
  newTag: { fontSize: 11, fontWeight: "800", color: tokens.color.accent },
  time: { fontSize: 11, color: tokens.color.faint, fontVariant: ["tabular-nums"] },

  title: { fontSize: 15, lineHeight: 20 },
  titleUnread: { fontWeight: "800", color: tokens.color.ink },
  titleRead: { fontWeight: "600", color: tokens.color.ink2 },
  body: { fontSize: 13, color: tokens.color.muted, lineHeight: 18 },
  source: { marginTop: 2, fontSize: 11, color: tokens.color.faint },

  chevron: { fontSize: 20, color: tokens.color.faint, alignSelf: "center" },

  /* empty state */
  empty: { paddingVertical: tokens.space(14), alignItems: "center", gap: tokens.space(2) },
  emptyTitle: { fontSize: 15, fontWeight: "700", color: tokens.color.ink2 },
  emptyBody: { fontSize: 13, color: tokens.color.faint, textAlign: "center", paddingHorizontal: tokens.space(8) },
});
