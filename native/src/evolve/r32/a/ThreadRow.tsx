import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import { ConversationThread, formatWon, getArchiveLockReason } from "./data";

interface ThreadRowProps {
  thread: ConversationThread;
  isPicked: boolean;
  onTogglePick: (id: string) => void;
}

export default function ThreadRow({ thread, isPicked, onTogglePick }: ThreadRowProps) {
  const lockReason = getArchiveLockReason(thread);
  const isLocked = lockReason !== null;

  const handlePress = () => {
    if (isLocked) return;
    onTogglePick(thread.id);
  };

  const a11yLabel = isLocked
    ? `${thread.counterpartName}, ${thread.itemTitle}. Can't be archived yet: ${lockReason}.`
    : `${thread.counterpartName}, ${thread.itemTitle}. ${isPicked ? "Picked for archiving" : "Not picked"}.`;

  return (
    <Pressable
      onPress={handlePress}
      disabled={isLocked}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      accessibilityState={{ selected: isPicked, disabled: isLocked }}
      style={({ pressed }) => [
        styles.row,
        isPicked && styles.rowPicked,
        isLocked && styles.rowLocked,
        pressed && !isLocked && styles.rowPressed,
      ]}
    >
      <View style={styles.marker}>
        {isLocked ? (
          <View style={styles.lockGlyph}>
            <Text style={styles.lockGlyphText}>i</Text>
          </View>
        ) : (
          <View style={[styles.checkbox, isPicked && styles.checkboxFilled]}>
            {isPicked ? <Text style={styles.checkboxMark}>✓</Text> : null}
          </View>
        )}
      </View>

      <View style={styles.body}>
        <View style={styles.topLine}>
          <Text style={styles.counterpart} numberOfLines={1}>
            {thread.counterpartName}
          </Text>
          <Text style={styles.date}>{thread.dateLabel}</Text>
        </View>
        <Text style={styles.item} numberOfLines={1}>
          {thread.itemTitle}
        </Text>
        <Text style={styles.preview} numberOfLines={1}>
          {thread.lastMessagePreview}
        </Text>
        {thread.hasOpenOffer && thread.offerAmountWon !== undefined ? (
          <Text style={styles.offer}>Open offer: {formatWon(thread.offerAmountWon)}</Text>
        ) : null}
        {isLocked ? (
          <View style={styles.lockBadge}>
            <Text style={styles.lockBadgeText}>Can't archive yet — {lockReason}</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingVertical: tokens.space(3),
    paddingHorizontal: tokens.space(4),
    minHeight: 44 + tokens.space(4),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    alignItems: "flex-start",
  },
  rowPicked: {
    backgroundColor: tokens.color.accentBg,
  },
  rowLocked: {
    opacity: 0.72,
  },
  rowPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  marker: {
    width: 28,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: tokens.space(1),
    marginRight: tokens.space(2),
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: tokens.radius.sm,
    borderWidth: 2,
    borderColor: tokens.color.faint,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.color.bg,
  },
  checkboxFilled: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  checkboxMark: {
    color: tokens.color.onAccent,
    fontSize: 13,
    fontWeight: "700",
  },
  lockGlyph: {
    width: 22,
    height: 22,
    borderRadius: tokens.radius.sm,
    borderWidth: 2,
    borderColor: tokens.color.warningBorder,
    backgroundColor: tokens.color.warningBg,
    alignItems: "center",
    justifyContent: "center",
  },
  lockGlyphText: {
    color: tokens.color.warning,
    fontSize: 13,
    fontWeight: "700",
  },
  body: {
    flex: 1,
  },
  topLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  counterpart: {
    flexShrink: 1,
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  date: {
    fontSize: 12,
    color: tokens.color.faint,
    marginLeft: tokens.space(2),
  },
  item: {
    fontSize: 13,
    color: tokens.color.ink2,
    marginTop: tokens.space(1) / 2,
  },
  preview: {
    fontSize: 13,
    color: tokens.color.muted,
    marginTop: tokens.space(1) / 2,
  },
  offer: {
    fontSize: 12,
    color: tokens.color.ink2,
    fontWeight: "600",
    marginTop: tokens.space(1),
  },
  lockBadge: {
    alignSelf: "flex-start",
    marginTop: tokens.space(2),
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.warningBorder,
    backgroundColor: tokens.color.warningBg,
  },
  lockBadgeText: {
    fontSize: 11,
    color: tokens.color.warning,
    fontWeight: "600",
  },
});
