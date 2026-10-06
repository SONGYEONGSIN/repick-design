import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  CONVERSATION_THREADS,
  ConversationThread,
  ORIGINAL_ORDER,
  getArchiveLockReason,
} from "./data";
import ThreadRow from "./ThreadRow";

const UNDO_WINDOW_SECONDS = 8;
const ANNOUNCEMENT_LIFETIME_MS = 5000;

function plural(count: number, word: string): string {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

export default function ArchiveConversationsScreen() {
  const [threads, setThreads] = useState<ConversationThread[]>(CONVERSATION_THREADS);
  const [pickedIds, setPickedIds] = useState<Set<string>>(new Set());
  const [undoBatch, setUndoBatch] = useState<{
    threads: ConversationThread[];
    secondsLeft: number;
  } | null>(null);
  const [liveMessage, setLiveMessage] = useState<string>("");

  const announceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Posts a message to the single live region, then lets it fade back to the
  // silent/idle state once a screen reader has had time to pick it up — so
  // accessibilityRole="alert" never lingers on content that is no longer new.
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
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const startUndoCountdown = useCallback(() => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setUndoBatch((current) => {
        if (!current) return current;
        if (current.secondsLeft <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          return null;
        }
        return { ...current, secondsLeft: current.secondsLeft - 1 };
      });
    }, 1000);
  }, []);

  const togglePick = useCallback(
    (id: string) => {
      setPickedIds((current) => {
        const next = new Set(current);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        const count = next.size;
        announce(
          count > 0
            ? `${plural(count, "conversation")} picked for archiving.`
            : "Nothing picked for archiving."
        );
        return next;
      });
    },
    [announce]
  );

  const clearPicks = useCallback(() => {
    setPickedIds(new Set());
    announce("Picks cleared.");
  }, [announce]);

  const handleArchivePicked = useCallback(() => {
    const archivedBatch = threads.filter((t) => pickedIds.has(t.id));
    if (archivedBatch.length === 0) return;
    const remaining = threads.filter((t) => !pickedIds.has(t.id));
    setThreads(remaining);
    setPickedIds(new Set());
    setUndoBatch({ threads: archivedBatch, secondsLeft: UNDO_WINDOW_SECONDS });
    startUndoCountdown();
    announce(
      `${plural(archivedBatch.length, "conversation")} archived. Undo available for ${UNDO_WINDOW_SECONDS} seconds.`
    );
  }, [threads, pickedIds, announce, startUndoCountdown]);

  const handleUndo = useCallback(() => {
    if (!undoBatch) return;
    if (countdownRef.current) clearInterval(countdownRef.current);
    const restoredCount = undoBatch.threads.length;
    setThreads((current) => {
      const merged = [...current, ...undoBatch.threads];
      return merged.sort((a, b) => ORIGINAL_ORDER[a.id] - ORIGINAL_ORDER[b.id]);
    });
    setUndoBatch(null);
    announce(`${plural(restoredCount, "conversation")} restored to the inbox.`);
  }, [undoBatch, announce]);

  const lockedCount = threads.filter((t) => getArchiveLockReason(t) !== null).length;
  const pickedCount = pickedIds.size;
  const showBar = pickedCount > 0 && !undoBatch;
  const showUndo = !!undoBatch;

  const renderItem = useCallback(
    ({ item }: { item: ConversationThread }) => (
      <ThreadRow thread={item} isPicked={pickedIds.has(item.id)} onTogglePick={togglePick} />
    ),
    [pickedIds, togglePick]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.title}>
          Archive Conversations
        </Text>
        <Text style={styles.subtitle}>
          Pick finished threads to move them out of your main inbox.
        </Text>
        {lockedCount > 0 ? (
          <Text style={styles.infoLine}>
            {plural(lockedCount, "conversation")} can't be archived yet — they have an unread
            reply or an open offer waiting.
          </Text>
        ) : null}
      </View>

      {/* Single live region for the whole screen: running pick count and the
          post-archive restore confirmation both route through this one node. */}
      <Text
        style={styles.srOnly}
        accessibilityLiveRegion="polite"
        accessibilityRole={liveMessage ? "alert" : undefined}
      >
        {liveMessage}
      </Text>

      <FlatList
        data={threads}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        extraData={pickedIds}
        contentContainerStyle={showBar || showUndo ? styles.listContentWithBar : undefined}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Your inbox is all caught up.</Text>
          </View>
        }
      />

      {showBar ? (
        <View style={styles.bar}>
          <Text style={styles.barCount}>{plural(pickedCount, "conversation")} picked</Text>
          <View style={styles.barActions}>
            <Pressable
              onPress={clearPicks}
              accessibilityRole="button"
              accessibilityLabel="Clear all picks"
              hitSlop={8}
              style={styles.barSecondaryButton}
            >
              <Text style={styles.barSecondaryButtonText}>Clear</Text>
            </Pressable>
            <Pressable
              onPress={handleArchivePicked}
              accessibilityRole="button"
              accessibilityLabel={`Archive ${plural(pickedCount, "conversation")}`}
              style={styles.barPrimaryButton}
            >
              <Text style={styles.barPrimaryButtonText}>Archive {pickedCount}</Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      {showUndo && undoBatch ? (
        <View style={styles.undoBar}>
          <Text style={styles.undoText}>
            {plural(undoBatch.threads.length, "conversation")} archived ({undoBatch.secondsLeft}s
            left to undo)
          </Text>
          <Pressable
            onPress={handleUndo}
            accessibilityRole="button"
            accessibilityLabel="Undo archiving"
            hitSlop={8}
            style={styles.undoButton}
          >
            <Text style={styles.undoButtonText}>Undo</Text>
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
    paddingBottom: tokens.space(2),
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subtitle: {
    fontSize: 13,
    color: tokens.color.muted,
    marginTop: tokens.space(1),
  },
  infoLine: {
    fontSize: 12,
    color: tokens.color.warning,
    marginTop: tokens.space(2),
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1),
    backgroundColor: tokens.color.warningBg,
    borderWidth: 1,
    borderColor: tokens.color.warningBorder,
    borderRadius: tokens.radius.sm,
    alignSelf: "flex-start",
  },
  srOnly: {
    position: "absolute",
    width: 1,
    height: 1,
    overflow: "hidden",
    opacity: 0,
  },
  listContentWithBar: {
    paddingBottom: tokens.space(20),
  },
  emptyState: {
    paddingTop: tokens.space(10),
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: tokens.color.faint,
  },
  bar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    backgroundColor: tokens.color.ink,
    borderTopLeftRadius: tokens.radius.md,
    borderTopRightRadius: tokens.radius.md,
  },
  barCount: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.onInk,
  },
  barActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  barSecondaryButton: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: tokens.space(3),
    alignItems: "center",
    justifyContent: "center",
  },
  barSecondaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.onInkMuted,
  },
  barPrimaryButton: {
    minHeight: 44,
    paddingHorizontal: tokens.space(4),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.color.accent,
    borderRadius: tokens.radius.sm,
    marginLeft: tokens.space(2),
  },
  barPrimaryButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  undoBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    backgroundColor: tokens.color.successBg,
    borderTopWidth: 1,
    borderTopColor: tokens.color.successBorder,
  },
  undoText: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.success,
    flexShrink: 1,
    marginRight: tokens.space(3),
  },
  undoButton: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: tokens.space(3),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: tokens.color.successBorder,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.bg,
  },
  undoButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.success,
  },
});
