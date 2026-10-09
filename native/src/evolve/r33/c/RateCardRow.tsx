import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import { RateCard } from "./data";

interface RateCardRowProps {
  card: RateCard;
  onToggleStatus: (id: string) => void;
  onRemove: (id: string) => void;
  onAnnounce: (message: string) => void;
}

export function RateCardRow({ card, onToggleStatus, onRemove, onAnnounce }: RateCardRowProps) {
  const [confirming, setConfirming] = useState(false);

  function handleRemovePress() {
    setConfirming(true);
    onAnnounce(`${card.name}: confirm to remove it, or cancel to keep it as-is.`);
  }

  function handleCancel() {
    setConfirming(false);
    onAnnounce(`Kept ${card.name}. Nothing was removed.`);
  }

  function handleConfirm() {
    setConfirming(false);
    onRemove(card.id);
    onAnnounce(`${card.name} removed. New listings will skip it from now on.`);
  }

  function handleToggle() {
    const next = card.status === "active" ? "inactive" : "active";
    onToggleStatus(card.id);
    onAnnounce(`${card.name} switched to ${next}.`);
  }

  const isActive = card.status === "active";

  return (
    <View style={styles.card}>
      <View style={styles.infoBlock}>
        <View style={styles.titleLine}>
          <Text style={styles.name} numberOfLines={2}>
            {card.name}
          </Text>
          {card.locked ? (
            <View style={styles.lockedPill}>
              <Text style={styles.lockedPillText}>Default</Text>
            </View>
          ) : (
            <View style={[styles.statusPill, isActive ? styles.statusPillOn : styles.statusPillOff]}>
              <Text style={[styles.statusPillText, isActive ? styles.statusPillTextOn : styles.statusPillTextOff]}>
                {isActive ? "Active" : "Inactive"}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.meta}>
          {card.carrierLabel} — {card.serviceLabel}
        </Text>
        <Text style={styles.fee}>{card.feeLabel}</Text>
        <Text style={styles.coverage}>{card.coverageLabel}</Text>
      </View>

      {card.locked ? (
        <View style={styles.lockedNote} accessible={false}>
          <Text style={styles.lockedNoteText}>{card.lockedNote}</Text>
        </View>
      ) : confirming ? (
        <View style={styles.confirmBlock}>
          <Text style={styles.confirmPrompt}>
            Remove this rate card? You'll need to recreate it to use it again.
          </Text>
          <View style={styles.confirmButtons}>
            <Pressable
              onPress={handleCancel}
              style={styles.cancelButton}
              accessibilityRole="button"
              accessibilityLabel={`Cancel removing ${card.name}`}
              hitSlop={8}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleConfirm}
              style={styles.confirmButton}
              accessibilityRole="button"
              accessibilityLabel={`Confirm removing ${card.name}`}
              hitSlop={8}
            >
              <Text style={styles.confirmButtonText}>Confirm removal</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.actionRow}>
          <Pressable
            onPress={handleToggle}
            style={styles.toggleButton}
            accessibilityRole="button"
            accessibilityLabel={`Mark ${card.name} as ${isActive ? "inactive" : "active"}`}
            hitSlop={8}
          >
            <Text style={styles.toggleButtonText}>{isActive ? "Deactivate" : "Activate"}</Text>
          </Pressable>
          <Pressable
            onPress={handleRemovePress}
            style={styles.removeButton}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${card.name} from your rate cards`}
            hitSlop={8}
          >
            <Text style={styles.removeButtonText}>Remove</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    marginHorizontal: tokens.space(4),
    marginBottom: tokens.space(3),
  },
  infoBlock: {
    marginBottom: tokens.space(3),
  },
  titleLine: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
    flex: 1,
    marginRight: tokens.space(2),
  },
  lockedPill: {
    paddingHorizontal: tokens.space(2),
    paddingVertical: 3,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accentBg,
  },
  lockedPillText: {
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  statusPill: {
    paddingHorizontal: tokens.space(2),
    paddingVertical: 3,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
  },
  statusPillOn: {
    backgroundColor: tokens.color.successBg,
    borderColor: tokens.color.successBorder,
  },
  statusPillOff: {
    backgroundColor: tokens.color.bg,
    borderColor: tokens.color.border,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: "700",
  },
  statusPillTextOn: {
    color: tokens.color.success,
  },
  statusPillTextOff: {
    color: tokens.color.faint,
  },
  meta: {
    fontSize: 13,
    color: tokens.color.muted,
    marginTop: tokens.space(2),
  },
  fee: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink2,
    marginTop: tokens.space(1),
    fontVariant: ["tabular-nums"],
  },
  coverage: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: tokens.space(1),
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: tokens.space(2),
  },
  toggleButton: {
    minHeight: 44,
    paddingHorizontal: tokens.space(3),
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  toggleButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.muted,
  },
  removeButton: {
    minHeight: 44,
    paddingHorizontal: tokens.space(3),
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.dangerBorder,
    backgroundColor: tokens.color.dangerBg,
  },
  removeButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.danger,
  },
  confirmBlock: {
    paddingTop: tokens.space(1),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
  },
  confirmPrompt: {
    fontSize: 13,
    color: tokens.color.ink2,
    marginBottom: tokens.space(3),
    marginTop: tokens.space(2),
  },
  confirmButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: tokens.space(2),
  },
  cancelButton: {
    minHeight: 44,
    paddingHorizontal: tokens.space(4),
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  cancelButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  confirmButton: {
    minHeight: 44,
    paddingHorizontal: tokens.space(4),
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.danger,
  },
  confirmButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  lockedNote: {
    paddingTop: tokens.space(2),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
  },
  lockedNoteText: {
    fontSize: 12,
    color: tokens.color.faint,
    lineHeight: 17,
  },
});
