import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import { ProvenanceEvent, formatDate, humanizeKind } from "./data";

interface Props {
  event: ProvenanceEvent;
  isLast: boolean;
  onToggleFlag: (id: string) => void;
}

export default function EventRow({ event, isLast, onToggleFlag }: Props) {
  const isGap = event.kind === "gap";

  return (
    <View style={styles.row}>
      <View style={styles.rail}>
        <View style={[styles.railDot, isGap ? styles.railDotGap : null]} />
        {!isLast ? <View style={styles.railLine} /> : null}
      </View>

      <View style={styles.card}>
        <View style={styles.cardTopLine}>
          <Text style={styles.kindLabel}>{humanizeKind(event.kind)}</Text>
          <Text style={styles.dateLabel}>{formatDate(event.dateISO)}</Text>
        </View>

        <Text style={styles.actorLabel}>{event.actorLabel}</Text>
        <Text style={styles.detailText}>{event.detail}</Text>
        {event.locationLabel ? (
          <Text style={styles.locationText}>{event.locationLabel}</Text>
        ) : null}

        <View style={styles.cardBottomLine}>
          {event.verified ? (
            <View style={styles.verifiedTag}>
              <Text style={styles.verifiedTagText}>✓ Verified</Text>
            </View>
          ) : (
            <View style={styles.unverifiedTag}>
              <Text style={styles.unverifiedTagText}>Unverified</Text>
            </View>
          )}

          {event.flaggable ? (
            <Pressable
              onPress={() => onToggleFlag(event.id)}
              accessibilityRole="button"
              accessibilityLabel={
                event.flagged
                  ? `Remove flag from the ${humanizeKind(event.kind)} entry`
                  : `Flag the ${humanizeKind(event.kind)} entry for review`
              }
              hitSlop={10}
              style={({ pressed }) => [
                styles.flagButton,
                event.flagged ? styles.flagButtonActive : null,
                pressed ? styles.flagButtonPressed : null,
              ]}
            >
              <Text
                style={[
                  styles.flagButtonText,
                  event.flagged ? styles.flagButtonTextActive : null,
                ]}
              >
                {event.flagged ? "Flagged" : "Flag"}
              </Text>
            </Pressable>
          ) : (
            <View style={styles.noteBadge}>
              <Text style={styles.noteBadgeText}>Not tracked by repick</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingHorizontal: tokens.space(4),
  },
  rail: {
    width: tokens.space(5),
    alignItems: "center",
  },
  railDot: {
    width: tokens.space(2),
    height: tokens.space(2),
    borderRadius: tokens.space(1),
    backgroundColor: tokens.color.accent,
    marginTop: tokens.space(5),
  },
  railDotGap: {
    backgroundColor: tokens.color.faint,
  },
  railLine: {
    flex: 1,
    width: 1,
    backgroundColor: tokens.color.border,
    marginTop: tokens.space(1),
    marginBottom: tokens.space(1),
  },
  card: {
    flex: 1,
    paddingVertical: tokens.space(3),
    paddingBottom: tokens.space(5),
    marginLeft: tokens.space(2),
  },
  cardTopLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  kindLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  dateLabel: {
    fontSize: 12,
    color: tokens.color.faint,
    fontVariant: ["tabular-nums"],
  },
  actorLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
    marginTop: tokens.space(1),
  },
  detailText: {
    fontSize: 13,
    color: tokens.color.muted,
    marginTop: tokens.space(1),
    lineHeight: 18,
  },
  locationText: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: tokens.space(1),
  },
  cardBottomLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: tokens.space(3),
  },
  verifiedTag: {
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1) / 2,
    backgroundColor: tokens.color.successBg,
    borderWidth: 1,
    borderColor: tokens.color.successBorder,
    borderRadius: tokens.radius.sm,
  },
  verifiedTagText: {
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.success,
  },
  unverifiedTag: {
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1) / 2,
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
  },
  unverifiedTagText: {
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.faint,
  },
  noteBadge: {
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1),
  },
  noteBadgeText: {
    fontSize: 12,
    fontStyle: "italic",
    color: tokens.color.faint,
  },
  flagButton: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: tokens.space(3),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
  },
  flagButtonActive: {
    backgroundColor: tokens.color.accentBg,
    borderColor: tokens.color.accent,
  },
  flagButtonPressed: {
    opacity: 0.6,
  },
  flagButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.muted,
  },
  flagButtonTextActive: {
    color: tokens.color.accent,
  },
});
