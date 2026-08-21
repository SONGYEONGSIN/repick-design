// native/src/chat/ChatInbox.tsx — auto-native-r10 winner (promoted).
// Screen type: Chat Inbox — a list of conversation threads (repick buyer↔seller messaging).
// Distinct from the catalog's `offer-thread` (a single negotiation's structured, time-ordered
// detail view): this screen is the index in front of it — one row per counterpart, no offer
// cards, no negotiation state. Like `notifications` (a browse screen with no terminal action),
// there is no fixed bottom band: title, tabs, and every row scroll away together inside one
// FlatList, and every action (archive, unarchive, open) applies in place.
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
  type PanResponderGestureState,
} from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import {
  activeThreads,
  archivedThreads,
  avatarStyleFor,
  INITIAL_THREADS,
  unreadThreadCount,
  type AvatarStyleKey,
  type ConversationThread,
  type ThreadMessage,
  type ThreadStatus,
} from "./data";
import { tokens } from "../tokens";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
const ROW_HEIGHT = 88;
const SWIPE_REVEAL = 88; // how far the row parks open, exposing the backdrop action
const SWIPE_OPEN_THRESHOLD = 44; // past this on release, snap open instead of closing
const SWIPE_COMMIT_THRESHOLD = 132; // past this on release, archive immediately
const SWIPE_MIN = -(SWIPE_COMMIT_THRESHOLD + 40);

type TabKey = "active" | "archived";

function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

/* ───────── vector icons (react-native-svg — no emoji, tokens only) ───────── */

function BackIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 5L8 12L15 19"
        stroke={tokens.color.ink2}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function MoreIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24">
      <Circle cx="12" cy="5" r="1.8" fill={tokens.color.faint} />
      <Circle cx="12" cy="12" r="1.8" fill={tokens.color.faint} />
      <Circle cx="12" cy="19" r="1.8" fill={tokens.color.faint} />
    </Svg>
  );
}

// One glyph for both directions: `down` = archive (box receiving), `up` = unarchive (box giving
// back). Sharing one shape keeps the visual vocabulary for "move this conversation" consistent.
function ArchiveIcon({ direction, color }: { direction: "down" | "up"; color: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="4" width="18" height="4" rx="1" stroke={color} strokeWidth={2} />
      <Path d="M5 8V18a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" stroke={color} strokeWidth={2} strokeLinejoin="round" />
      {direction === "down" ? (
        <Path
          d="M9.5 13.5L12 16l2.5-2.5M12 16v-5"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <Path
          d="M9.5 15.5L12 13l2.5 2.5M12 13v5"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </Svg>
  );
}

/* ───────── avatar — initials monogram, no photos ─────────
 * The DNA keeps a near-monochrome palette with a single accent, so "deterministically derived
 * from the palette" here means cycling a small, fixed set of token *combinations* (fill vs.
 * outline, accent vs. ink2) keyed by a pure hash of the name — not picking a hue that doesn't
 * exist in tokens.ts. */
const AVATAR_FILL: Record<AvatarStyleKey, { bg: string; fg: string; border?: string }> = {
  accent: { bg: tokens.color.accent, fg: tokens.color.onAccent },
  ink: { bg: tokens.color.ink2, fg: tokens.color.onInk },
  outline: { bg: tokens.color.bg, fg: tokens.color.ink2, border: tokens.color.border },
};

function Avatar({ name, initials }: { name: string; initials: string }) {
  const fill = AVATAR_FILL[avatarStyleFor(name)];
  return (
    <View
      style={[styles.avatar, { backgroundColor: fill.bg }, fill.border ? { borderWidth: 1, borderColor: fill.border } : null]}
      accessible={false}
      importantForAccessibility="no"
    >
      <Text style={[styles.avatarText, { color: fill.fg }]}>{initials}</Text>
    </View>
  );
}

// Unread is never color alone: bold weight + a numeral badge + a dot are three independent
// signals, so it still reads correctly in grayscale or to a color-blind reader.
function UnreadBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <View style={styles.unreadBadge} accessible={false} importantForAccessibility="no">
      <Text style={styles.unreadBadgeText}>{count > 9 ? "9+" : String(count)}</Text>
    </View>
  );
}

/* ───────── conversation row ─────────
 * Two independent ways to archive:
 *  1. Swipe left — a real PanResponder + Animated drag (react-native-web renders this fine; no
 *     gesture-handler/reanimated dependency is installed in this project, so this stays on RN
 *     core). It reveals a labelled action behind the row as the visual hint the catalog asks for.
 *  2. The always-visible "More" button — a plain press, no timing or drag required. This is the
 *     guaranteed-accessible path: the swipe backdrop is hidden from the accessibility tree
 *     (screen reader / switch control users would otherwise land on a control that isn't visibly
 *     revealed), so the More button carries that responsibility alone. */
function ConversationRow({
  thread,
  sheetOpen,
  onToggleSheet,
  onOpen,
  onArchiveToggle,
  archiveLabel,
}: {
  thread: ConversationThread;
  sheetOpen: boolean;
  onToggleSheet: () => void;
  onOpen: () => void;
  onArchiveToggle: () => void;
  archiveLabel: string;
}) {
  const translateX = useRef(new Animated.Value(0)).current;
  const currentX = useRef(0);
  const dragStart = useRef(0);

  useEffect(() => {
    const id = translateX.addListener(({ value }) => {
      currentX.current = value;
    });
    return () => translateX.removeListener(id);
  }, [translateX]);

  const springTo = (toValue: number) => {
    Animated.spring(translateX, { toValue, useNativeDriver: true, bounciness: 6 }).start();
  };

  const commitArchive = () => {
    Animated.timing(translateX, { toValue: -420, duration: 180, useNativeDriver: true }).start(() => {
      onArchiveToggle();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_evt: GestureResponderEvent, g: PanResponderGestureState) =>
        Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
      onPanResponderGrant: () => {
        dragStart.current = currentX.current;
      },
      onPanResponderMove: (_evt: GestureResponderEvent, g: PanResponderGestureState) => {
        translateX.setValue(clamp(dragStart.current + g.dx, SWIPE_MIN, 0));
      },
      onPanResponderRelease: (_evt: GestureResponderEvent, g: PanResponderGestureState) => {
        const end = clamp(dragStart.current + g.dx, SWIPE_MIN, 0);
        if (end <= -SWIPE_COMMIT_THRESHOLD) commitArchive();
        else if (end <= -SWIPE_OPEN_THRESHOLD) springTo(-SWIPE_REVEAL);
        else springTo(0);
      },
      onPanResponderTerminate: () => springTo(0),
    })
  ).current;

  const handleRowPress = () => {
    // A row parked open from a swipe closes on tap instead of opening the conversation — the
    // exposed action stays a deliberate second tap, never a stray one.
    if (currentX.current !== 0) {
      springTo(0);
      return;
    }
    onOpen();
  };

  const unread = thread.unread > 0;
  const spoken = `${thread.name}, ${unread ? `${thread.unread} unread` : "read"}. ${thread.itemTitle}. ${thread.preview} ${thread.time}. Double tap to open conversation.`;

  return (
    <View style={styles.rowWrapper}>
      <View
        style={styles.swipeBackdrop}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <Pressable onPress={commitArchive} style={styles.swipeAction}>
          <ArchiveIcon direction={thread.status === "active" ? "down" : "up"} color={tokens.color.onInk} />
          <Text style={styles.swipeActionText}>{archiveLabel}</Text>
        </Pressable>
      </View>

      <Animated.View style={[styles.rowForeground, { transform: [{ translateX }] }]} {...panResponder.panHandlers}>
        <Pressable
          onPress={handleRowPress}
          accessibilityRole="button"
          accessibilityLabel={spoken}
          accessibilityState={{ selected: unread }}
          style={({ pressed }) => [styles.rowMain, pressed && styles.pressed]}
        >
          <Avatar name={thread.name} initials={thread.initials} />
          <View style={styles.rowBody}>
            <View style={styles.rowTopLine}>
              {unread ? <View style={styles.unreadDot} /> : null}
              <Text style={[styles.name, unread ? styles.nameUnread : styles.nameRead]} numberOfLines={1}>
                {thread.name}
              </Text>
            </View>
            <Text style={styles.itemTitle} numberOfLines={1}>
              {thread.itemTitle}
            </Text>
            <Text style={[styles.preview, unread ? styles.previewUnread : styles.previewRead]} numberOfLines={1}>
              {thread.preview}
            </Text>
          </View>
        </Pressable>

        <View style={styles.rowSide}>
          <Text style={styles.time}>{thread.time}</Text>
          <UnreadBadge count={thread.unread} />
          <Pressable
            onPress={onToggleSheet}
            hitSlop={HIT_SLOP}
            accessibilityRole="button"
            accessibilityLabel={`More actions for conversation with ${thread.name}`}
            accessibilityState={{ expanded: sheetOpen }}
            style={({ pressed }) => [styles.moreBtn, pressed && styles.pressed]}
          >
            <MoreIcon />
          </Pressable>
        </View>
      </Animated.View>

      {sheetOpen && (
        <View style={styles.sheet}>
          <Pressable
            onPress={onArchiveToggle}
            accessibilityRole="button"
            accessibilityLabel={`${archiveLabel} conversation with ${thread.name}`}
            style={({ pressed }) => [styles.sheetBtnPrimary, pressed && styles.pressed]}
          >
            <ArchiveIcon direction={thread.status === "active" ? "down" : "up"} color={tokens.color.onInk} />
            <Text style={styles.sheetBtnPrimaryText}>{archiveLabel}</Text>
          </Pressable>
          <Pressable
            onPress={onToggleSheet}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
            style={({ pressed }) => [styles.sheetBtnGhost, pressed && styles.pressed]}
          >
            <Text style={styles.sheetBtnGhostText}>Cancel</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

/* ───────── header: title, unread/tab summary, Active/Archived tabs ───────── */

function ScreenHeader({
  unread,
  count,
  tab,
  onTabChange,
  statusMessage,
}: {
  unread: number;
  count: number;
  tab: TabKey;
  onTabChange: (t: TabKey) => void;
  statusMessage: string | null;
}) {
  const subtitle =
    tab === "active"
      ? `${unread} unread · ${count} conversation${count === 1 ? "" : "s"}`
      : `${count} archived conversation${count === 1 ? "" : "s"}`;

  return (
    <View style={styles.header}>
      <Text style={styles.h1} accessibilityRole="header">
        Messages
      </Text>
      <Text style={styles.sub}>{subtitle}</Text>

      <View style={styles.tabs} accessibilityRole="tablist" accessibilityLabel="Filter conversations">
        {(["active", "archived"] as const).map((key) => {
          const label = key === "active" ? "Active" : "Archived";
          const selected = tab === key;
          return (
            <Pressable
              key={key}
              onPress={() => onTabChange(key)}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              style={({ pressed }) => [styles.tab, selected && styles.tabOn, pressed && styles.pressed]}
            >
              <Text style={[styles.tabLabel, selected && styles.tabLabelOn]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Success feedback for archive/unarchive. `polite`, not `alert` — this screen has no
          terminal/gate action (GENERATION.md §3–4), so the stronger role stays reserved for
          screens where a transition changes what the user can do next. */}
      <View style={styles.statusWrap} accessible={statusMessage !== null} accessibilityLiveRegion="polite">
        {statusMessage !== null ? <Text style={styles.statusText}>{statusMessage}</Text> : null}
      </View>
    </View>
  );
}

/* ───────── empty state ───────── */

function EmptyState({ tab }: { tab: TabKey }) {
  const title = tab === "active" ? "No conversations" : "Nothing archived yet";
  const body =
    tab === "active"
      ? "New messages from buyers and sellers will show up here."
      : "Swipe a conversation left, or use its More menu, to archive it.";
  return (
    <View style={styles.empty} accessible accessibilityLabel={`${title}. ${body}`}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyBody}>{body}</Text>
    </View>
  );
}

/* ───────── thread preview (a light, generic peek — not the offer-thread screen) ───────── */

function PreviewBubble({ message }: { message: ThreadMessage }) {
  const mine = message.from === "me";
  return (
    <View style={[styles.bubbleRow, mine ? styles.alignEnd : styles.alignStart]}>
      <Text style={[styles.bubbleAt, mine ? styles.textRight : styles.textLeft]}>{message.at}</Text>
      <View
        style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}
        accessible
        accessibilityLabel={`${mine ? "You" : message.from}, ${message.at}. ${message.text}`}
      >
        <Text style={[styles.bubbleText, mine ? styles.bubbleTextMine : styles.bubbleTextTheirs]}>{message.text}</Text>
      </View>
    </View>
  );
}

function ThreadPreview({ thread, onBack }: { thread: ConversationThread; onBack: () => void }) {
  return (
    <View style={styles.root}>
      <View style={styles.previewHeader}>
        <Pressable
          onPress={onBack}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel="Back to Messages"
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
        >
          <BackIcon />
          <Text style={styles.backLabel}>Messages</Text>
        </Pressable>
        <View style={styles.previewIdentity}>
          <Avatar name={thread.name} initials={thread.initials} />
          <View style={styles.previewIdentityText}>
            <Text style={styles.previewName} accessibilityRole="header" numberOfLines={1}>
              {thread.name}
            </Text>
            <Text style={styles.previewItem} numberOfLines={1}>
              {thread.itemTitle}
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={thread.messages}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => <PreviewBubble message={item} />}
        contentContainerStyle={styles.previewList}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.previewFootnote}>
        <Text style={styles.previewFootnoteText}>Recent messages in this conversation.</Text>
      </View>
    </View>
  );
}

/* ───────── screen ───────── */

export function ChatInboxScreen() {
  const [threads, setThreads] = useState<ConversationThread[]>(INITIAL_THREADS);
  const [tab, setTab] = useState<TabKey>("active");
  const [openThreadId, setOpenThreadId] = useState<string | null>(null);
  const [openSheetId, setOpenSheetId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const setThreadStatus = (id: string, status: ThreadStatus) => {
    setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  const archiveThread = (id: string) => {
    const target = threads.find((t) => t.id === id);
    setThreadStatus(id, "archived");
    setOpenSheetId((cur) => (cur === id ? null : cur));
    if (target) setStatusMessage(`Archived conversation with ${target.name}.`);
  };

  const unarchiveThread = (id: string) => {
    const target = threads.find((t) => t.id === id);
    setThreadStatus(id, "active");
    setOpenSheetId((cur) => (cur === id ? null : cur));
    if (target) setStatusMessage(`Moved conversation with ${target.name} back to Messages.`);
  };

  const openThread = (id: string) => {
    setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, unread: 0 } : t)));
    setOpenThreadId(id);
    setOpenSheetId(null);
  };

  const toggleSheet = (id: string) => {
    setOpenSheetId((cur) => (cur === id ? null : id));
  };

  const list = tab === "active" ? activeThreads(threads) : archivedThreads(threads);
  const unread = unreadThreadCount(threads);
  const opened = openThreadId ? (threads.find((t) => t.id === openThreadId) ?? null) : null;

  if (opened) {
    return <ThreadPreview thread={opened} onBack={() => setOpenThreadId(null)} />;
  }

  return (
    <View style={styles.root}>
      <FlatList
        data={list}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => (
          <ConversationRow
            thread={item}
            sheetOpen={openSheetId === item.id}
            onToggleSheet={() => toggleSheet(item.id)}
            onOpen={() => openThread(item.id)}
            onArchiveToggle={() => (item.status === "active" ? archiveThread(item.id) : unarchiveThread(item.id))}
            archiveLabel={item.status === "active" ? "Archive" : "Unarchive"}
          />
        )}
        ListHeaderComponent={
          <ScreenHeader unread={unread} count={list.length} tab={tab} onTabChange={setTab} statusMessage={statusMessage} />
        }
        ListEmptyComponent={<EmptyState tab={tab} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: tokens.color.bg },
  list: { paddingHorizontal: tokens.space(5), paddingBottom: tokens.space(10) },

  /* header — scrolls with the list, no fixed chrome (no terminal action on this screen) */
  header: { paddingTop: tokens.space(10), paddingBottom: tokens.space(4) },
  h1: { fontSize: 28, fontWeight: "800", color: tokens.color.ink, letterSpacing: -0.5 },
  sub: { marginTop: 6, fontSize: 13, color: tokens.color.faint },

  tabs: { flexDirection: "row", gap: tokens.space(2), marginTop: tokens.space(5) },
  tab: {
    minHeight: 44,
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  tabOn: { backgroundColor: tokens.color.accent, borderColor: tokens.color.accent },
  tabLabel: { fontSize: 13, fontWeight: "700", color: tokens.color.muted },
  tabLabelOn: { color: tokens.color.onAccent },

  statusWrap: { minHeight: 0 },
  statusText: { marginTop: tokens.space(3), fontSize: 12, fontWeight: "600", color: tokens.color.accent },

  /* conversation row */
  separator: { height: tokens.space(3) },
  rowWrapper: {
    position: "relative",
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    overflow: "hidden",
  },

  swipeBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: ROW_HEIGHT,
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: tokens.color.ink2,
  },
  swipeAction: {
    width: SWIPE_REVEAL + 40,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  swipeActionText: { fontSize: 11, fontWeight: "700", color: tokens.color.onInk },

  rowForeground: {
    minHeight: ROW_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(3),
    gap: tokens.space(2),
  },
  rowMain: { flex: 1, flexDirection: "row", alignItems: "center", gap: tokens.space(3), minHeight: 44 },
  pressed: { opacity: 0.85 },

  avatar: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 15, fontWeight: "800", letterSpacing: 0.3 },

  rowBody: { flex: 1, gap: 3 },
  rowTopLine: { flexDirection: "row", alignItems: "center", gap: 6 },
  unreadDot: { width: 7, height: 7, borderRadius: tokens.radius.sm, backgroundColor: tokens.color.accent },
  name: { fontSize: 15, flexShrink: 1 },
  nameUnread: { fontWeight: "800", color: tokens.color.ink },
  nameRead: { fontWeight: "600", color: tokens.color.ink2 },
  itemTitle: { fontSize: 12, color: tokens.color.faint },
  preview: { fontSize: 13, lineHeight: 18 },
  previewUnread: { fontWeight: "700", color: tokens.color.ink2 },
  previewRead: { fontWeight: "400", color: tokens.color.muted },

  rowSide: { alignItems: "flex-end", gap: 6, minWidth: 44 },
  time: { fontSize: 11, color: tokens.color.faint, fontVariant: ["tabular-nums"] },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: 10,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadBadgeText: { fontSize: 11, fontWeight: "800", color: tokens.color.onAccent, fontVariant: ["tabular-nums"] },
  moreBtn: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },

  /* inline action sheet — the guaranteed non-gesture archive path */
  sheet: {
    flexDirection: "row",
    gap: tokens.space(2),
    paddingHorizontal: tokens.space(3),
    paddingBottom: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  sheetBtnPrimary: {
    flexGrow: 1,
    flexBasis: 0,
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.ink2,
  },
  sheetBtnPrimaryText: { fontSize: 13, fontWeight: "700", color: tokens.color.onInk },
  sheetBtnGhost: {
    flexGrow: 1,
    flexBasis: 0,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  sheetBtnGhostText: { fontSize: 13, fontWeight: "700", color: tokens.color.ink2 },

  /* empty state */
  empty: { paddingVertical: tokens.space(14), alignItems: "center", gap: tokens.space(2) },
  emptyTitle: { fontSize: 15, fontWeight: "700", color: tokens.color.ink2 },
  emptyBody: { fontSize: 13, color: tokens.color.faint, textAlign: "center", paddingHorizontal: tokens.space(8) },

  /* thread preview (fake-navigation state, not the offer-thread screen) */
  previewHeader: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(10),
    paddingBottom: tokens.space(4),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
    gap: tokens.space(3),
  },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 4, minHeight: 44, alignSelf: "flex-start" },
  backLabel: { fontSize: 15, fontWeight: "600", color: tokens.color.ink2 },
  previewIdentity: { flexDirection: "row", alignItems: "center", gap: tokens.space(3) },
  previewIdentityText: { flex: 1, gap: 2 },
  previewName: { fontSize: 20, fontWeight: "800", color: tokens.color.ink },
  previewItem: { fontSize: 13, color: tokens.color.muted },

  previewList: { paddingHorizontal: tokens.space(5), paddingTop: tokens.space(4), paddingBottom: tokens.space(4), gap: tokens.space(3) },
  bubbleRow: { width: "100%" },
  alignStart: { alignItems: "flex-start" },
  alignEnd: { alignItems: "flex-end" },
  textLeft: { textAlign: "left" },
  textRight: { textAlign: "right" },
  bubbleAt: { fontSize: 11, color: tokens.color.faint, marginBottom: 4 },
  bubble: { maxWidth: "84%", borderRadius: tokens.radius.md, paddingHorizontal: tokens.space(3), paddingVertical: tokens.space(2) },
  bubbleTheirs: { backgroundColor: tokens.color.border },
  bubbleMine: { backgroundColor: tokens.color.ink2 },
  bubbleText: { fontSize: 15, lineHeight: 21 },
  bubbleTextTheirs: { color: tokens.color.ink },
  bubbleTextMine: { color: tokens.color.onInk },

  previewFootnote: { paddingHorizontal: tokens.space(5), paddingBottom: tokens.space(6), paddingTop: tokens.space(2) },
  previewFootnoteText: { fontSize: 12, color: tokens.color.faint, textAlign: "center" },
});
