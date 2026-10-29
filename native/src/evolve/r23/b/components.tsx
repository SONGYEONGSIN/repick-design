// native/src/evolve/r23/b/components.tsx — row subcomponent for Saved Payment Methods
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import type { PaymentMethod } from "./data";

const { color, space, radius } = tokens;

function kindLabel(kind: PaymentMethod["kind"]): string {
  return kind === "card" ? "Card" : "Bank account";
}

type Props = {
  method: PaymentMethod;
  isConfirming: boolean;
  onRequestRemove: (id: string) => void;
  onCancelRemove: () => void;
  onConfirmRemove: (id: string) => void;
  onSetDefault: (id: string) => void;
};

export function PaymentMethodRow({
  method,
  isConfirming,
  onRequestRemove,
  onCancelRemove,
  onConfirmRemove,
  onSetDefault,
}: Props) {
  return (
    <View
      style={[styles.row, isConfirming && styles.rowConfirming]}
      accessibilityLiveRegion={isConfirming ? "polite" : undefined}
    >
      <View style={styles.rowTop}>
        <View style={styles.kindPill}>
          <Text style={styles.kindPillText}>{kindLabel(method.kind)}</Text>
        </View>
        {method.isDefault ? (
          <View style={styles.defaultPill}>
            <Text style={styles.defaultPillText}>Default</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.label}>{method.label}</Text>
      <Text style={styles.detail}>{method.detail}</Text>
      <Text style={styles.lastUsed}>{method.lastUsedNote}</Text>

      {isConfirming ? (
        <View style={styles.confirmBlock}>
          <Text
            accessibilityRole="alert"
            style={styles.confirmPrompt}
          >
            Remove {method.label} from your saved payment methods?
          </Text>
          <View style={styles.confirmActions}>
            <Pressable
              onPress={onCancelRemove}
              accessibilityRole="button"
              accessibilityLabel={`Cancel removing ${method.label}`}
              style={({ pressed }) => [
                styles.confirmActionBtn,
                styles.cancelBtn,
                pressed && styles.btnPressed,
              ]}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => onConfirmRemove(method.id)}
              accessibilityRole="button"
              accessibilityLabel={`Confirm removing ${method.label}`}
              style={({ pressed }) => [
                styles.confirmActionBtn,
                styles.confirmBtn,
                pressed && styles.btnPressed,
              ]}
            >
              <Text style={styles.confirmBtnText}>Confirm remove</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.actions}>
          {method.isDefault ? null : (
            <Pressable
              onPress={() => onSetDefault(method.id)}
              accessibilityRole="button"
              accessibilityLabel={`Set ${method.label} as default`}
              style={({ pressed }) => [
                styles.actionBtn,
                pressed && styles.btnPressed,
              ]}
            >
              <Text style={styles.actionBtnText}>Set as default</Text>
            </Pressable>
          )}
          <Pressable
            onPress={() => onRequestRemove(method.id)}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${method.label}`}
            style={({ pressed }) => [
              styles.actionBtn,
              styles.removeBtn,
              pressed && styles.btnPressed,
            ]}
          >
            <Text style={styles.removeBtnText}>Remove</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.md,
    padding: space(4),
    marginBottom: space(3),
    backgroundColor: color.bg,
  },
  rowConfirming: {
    borderColor: color.dangerBorder,
    backgroundColor: color.dangerBg,
  },
  rowTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: space(2),
  },
  kindPill: {
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.sm,
    paddingHorizontal: space(2),
    paddingVertical: space(1),
    marginRight: space(2),
  },
  kindPillText: {
    fontSize: 11,
    fontWeight: "600",
    color: color.muted,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  defaultPill: {
    backgroundColor: color.accent,
    borderRadius: radius.sm,
    paddingHorizontal: space(2),
    paddingVertical: space(1),
  },
  defaultPillText: {
    fontSize: 11,
    fontWeight: "700",
    color: color.onAccent,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: color.ink,
    marginBottom: space(1),
  },
  detail: {
    fontSize: 13,
    color: color.muted,
    marginBottom: space(1),
  },
  lastUsed: {
    fontSize: 12,
    color: color.faint,
    marginBottom: space(3),
    fontVariant: ["tabular-nums"],
  },
  actions: {
    flexDirection: "row",
  },
  actionBtn: {
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.sm,
    paddingHorizontal: space(3),
    paddingVertical: space(2),
    marginRight: space(2),
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: color.ink2,
  },
  removeBtn: {
    borderColor: color.dangerBorder,
    backgroundColor: color.dangerBg,
  },
  removeBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: color.danger,
  },
  confirmBlock: {
    marginTop: space(1),
  },
  confirmPrompt: {
    fontSize: 13,
    color: color.ink,
    marginBottom: space(3),
    lineHeight: 18,
  },
  confirmActions: {
    flexDirection: "row",
  },
  confirmActionBtn: {
    borderRadius: radius.sm,
    paddingHorizontal: space(3),
    paddingVertical: space(2),
    marginRight: space(2),
    borderWidth: 1,
  },
  cancelBtn: {
    borderColor: color.border,
    backgroundColor: color.bg,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: color.ink2,
  },
  confirmBtn: {
    borderColor: color.danger,
    backgroundColor: color.danger,
  },
  confirmBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: color.onAccent,
  },
  btnPressed: {
    opacity: 0.6,
  },
});
