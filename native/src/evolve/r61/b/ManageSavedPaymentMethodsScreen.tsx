// native/src/evolve/r61/b/ManageSavedPaymentMethodsScreen.tsx
//
// Concept: "Manage Saved Payment Methods" — a buyer-facing settings screen
// listing the 4 payment methods saved to this account (2 cards, 1 bank
// account, 1 repick Wallet balance) in a single FlatList, exactly one of
// which carries the "Default" indicator at any time.
//
// Band-form choice: this screen has NO persistent bottom band of any kind —
// not a blocked-workflow state machine, not a selection-derived contextual
// bar, not a status action bar. Per GENERATION.md §4's banded→row
// generalization, the destructive-confirmation surface lives in the row
// itself: pressing "Remove" converts that row in place into a Cancel /
// Confirm pair, never a native Alert and never a separate modal. The list
// simply ends after the last row.
//
// Live-region singularity: `confirmingId` is the ONE piece of state that
// decides which row (if any) is mid-confirmation, so at most one row's
// container ever carries accessibilityLiveRegion="polite" at a time.
// Requesting removal on a second row while a first is still confirming does
// not stack a second live region — it reassigns the single `confirmingId`,
// which silently reverts the first row to its normal display state and
// activates the live region on the new row instead. This is a deliberate
// choice to keep "at most one row confirming" rather than allowing several
// rows to confirm concurrently (see GENERATION.md §4's "never two live
// regions at once" rule).
//
// Default-removal policy: removing the current default method does not
// require picking a replacement first and does not block the action. The
// confirmation sentence itself names which remaining method will become the
// new default (the next one in seed/list order), and pressing Confirm
// actually performs that promotion in the same state update that removes
// the row — the prose never promises something the handler doesn't do. The
// one case that IS blocked is removing the very last saved method: when
// only one row remains, its "Remove" control is not rendered at all and is
// replaced by a plain static explanation, so there is no disabled button
// sitting on screen for a user to have to guess the reason for.
//
// State reachability: Confirm calls setMethods with a real filter (and,
// when applicable, a real promotion of the next row to isDefault: true) —
// the row is actually gone afterward, not just visually hidden. Cancel
// calls setConfirmingId(null), which is the exact piece of state that put
// the row into its confirming view, so the row provably reverts.

import { useCallback } from "react";
import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import { INITIAL_PAYMENT_METHODS, type PaymentMethod } from "./data";

const { color, space, radius } = tokens;

// Composes the exact sentence the live region will read aloud. Kept as a
// pure function of (method, current list) so the screen and the row always
// agree on what Confirm is about to do — there is only one source of truth
// for "what happens next," not a duplicated copy baked into the row.
function buildConfirmMessage(
  method: PaymentMethod,
  methods: PaymentMethod[],
): string {
  if (!method.isDefault) {
    return `Remove ${method.title} from your saved payment methods?`;
  }
  const next = methods.find((m) => m.id !== method.id);
  if (!next) {
    // Not reachable from the UI: the last remaining method never renders a
    // Remove control in the first place (see isOnlyMethod below).
    return `Remove ${method.title}? No other saved method is available.`;
  }
  return `Remove ${method.title}? It's your default method, so ${next.title} will become your new default.`;
}

export default function ManageSavedPaymentMethodsScreen() {
  const [methods, setMethods] = useState<PaymentMethod[]>(
    INITIAL_PAYMENT_METHODS,
  );
  // The single source of truth for which row (if any) is mid-confirmation.
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const requestRemove = useCallback((id: string) => {
    setConfirmingId(id);
  }, []);

  const cancelRemove = useCallback(() => {
    setConfirmingId(null);
  }, []);

  const confirmRemove = useCallback((id: string) => {
    setMethods((prev) => {
      const target = prev.find((m) => m.id === id);
      if (!target) return prev;
      const rest = prev.filter((m) => m.id !== id);
      if (target.isDefault && rest.length > 0) {
        // Promote the first remaining row (seed order) to default — this is
        // exactly the promotion the confirmation sentence named.
        return rest.map((m, i) =>
          i === 0 ? { ...m, isDefault: true } : { ...m, isDefault: false },
        );
      }
      return rest;
    });
    setConfirmingId(null);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={methods}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PaymentRow
            method={item}
            isOnlyMethod={methods.length === 1}
            isConfirming={confirmingId === item.id}
            confirmMessage={buildConfirmMessage(item, methods)}
            onRequestRemove={requestRemove}
            onCancelRemove={cancelRemove}
            onConfirmRemove={confirmRemove}
          />
        )}
        ListHeaderComponent={
          <View style={styles.headerArea}>
            <Text accessibilityRole="header" style={styles.title}>
              Saved Payment Methods
            </Text>
            <Text style={styles.subtitle}>
              Manage the cards, bank account, and wallet balance saved to
              your repick account. Exactly one method is your default for
              checkout.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              You have no saved payment methods. Add one from Checkout to see
              it listed here.
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

type PaymentRowProps = {
  method: PaymentMethod;
  isOnlyMethod: boolean;
  isConfirming: boolean;
  confirmMessage: string;
  onRequestRemove: (id: string) => void;
  onCancelRemove: () => void;
  onConfirmRemove: (id: string) => void;
};

function PaymentRow({
  method,
  isOnlyMethod,
  isConfirming,
  confirmMessage,
  onRequestRemove,
  onCancelRemove,
  onConfirmRemove,
}: PaymentRowProps) {
  return (
    <View
      style={[styles.entry, isConfirming && styles.entryConfirming]}
      accessibilityLiveRegion={isConfirming ? "polite" : undefined}
    >
      <View style={styles.entryHeadRow}>
        <View style={styles.typeChip}>
          <Text style={styles.typeChipText}>{method.kindLabel}</Text>
        </View>
        {method.isDefault ? (
          <View style={styles.defaultChip}>
            <Text style={styles.defaultChipText}>Default</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.entryTitle}>{method.title}</Text>

      {method.balance ? (
        <View style={styles.balanceLine}>
          <Text style={styles.balanceLabel}>{method.meta}</Text>
          <Text style={[styles.balanceValue, styles.tabularNums]}>
            {method.balance}
          </Text>
        </View>
      ) : (
        <Text style={styles.entryMeta}>{method.meta}</Text>
      )}

      {isConfirming ? (
        <View style={styles.confirmPanel}>
          <Text accessibilityRole="alert" style={styles.confirmMessage}>
            {confirmMessage}
          </Text>
          <View style={styles.confirmButtons}>
            <Pressable
              onPress={onCancelRemove}
              accessibilityRole="button"
              accessibilityLabel={`Cancel removing ${method.title}`}
              accessibilityHint="Keeps this payment method saved and closes this confirmation."
              style={({ pressed }) => [
                styles.btnBase,
                styles.btnCancel,
                pressed && styles.btnPressed,
              ]}
            >
              <Text style={styles.btnCancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => onConfirmRemove(method.id)}
              accessibilityRole="button"
              accessibilityLabel={`Confirm removing ${method.title}`}
              accessibilityHint="Permanently removes this payment method from your account."
              style={({ pressed }) => [
                styles.btnBase,
                styles.btnConfirm,
                pressed && styles.btnPressed,
              ]}
            >
              <Text style={styles.btnConfirmText}>Confirm</Text>
            </Pressable>
          </View>
        </View>
      ) : isOnlyMethod ? (
        <View style={styles.lastMethodNote}>
          <Text style={styles.lastMethodNoteText}>
            This is your only saved payment method. Add another before you
            can remove it.
          </Text>
        </View>
      ) : (
        <Pressable
          onPress={() => onRequestRemove(method.id)}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${method.title}`}
          accessibilityHint="Opens a confirmation before removing this payment method."
          style={({ pressed }) => [
            styles.removeAffordance,
            pressed && styles.btnPressed,
          ]}
        >
          <Text style={styles.removeAffordanceText}>Remove</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: color.bg,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: space(5),
    paddingBottom: space(8),
  },
  headerArea: {
    paddingTop: space(4),
    paddingBottom: space(3),
    gap: space(2),
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: color.ink,
  },
  subtitle: {
    fontSize: 14,
    color: color.muted,
    lineHeight: 20,
  },
  emptyState: {
    paddingVertical: space(8),
  },
  emptyText: {
    fontSize: 14,
    color: color.muted,
    lineHeight: 20,
  },
  entry: {
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.md,
    padding: space(4),
    marginBottom: space(3),
    backgroundColor: color.bg,
  },
  entryConfirming: {
    borderColor: color.dangerBorder,
    backgroundColor: color.dangerBg,
  },
  entryHeadRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space(2),
    marginBottom: space(2),
  },
  typeChip: {
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.sm,
    paddingHorizontal: space(2),
    paddingVertical: space(1),
  },
  typeChipText: {
    fontSize: 11,
    fontWeight: "600",
    color: color.muted,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  defaultChip: {
    backgroundColor: color.accent,
    borderRadius: radius.sm,
    paddingHorizontal: space(2),
    paddingVertical: space(1),
  },
  defaultChipText: {
    fontSize: 11,
    fontWeight: "700",
    color: color.onAccent,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: color.ink,
    marginBottom: space(1),
  },
  entryMeta: {
    fontSize: 13,
    color: color.muted,
    marginBottom: space(3),
  },
  balanceLine: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: space(3),
  },
  balanceLabel: {
    fontSize: 13,
    color: color.muted,
  },
  balanceValue: {
    fontSize: 15,
    fontWeight: "700",
    color: color.ink,
  },
  tabularNums: {
    fontVariant: ["tabular-nums"],
  },
  removeAffordance: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: color.dangerBorder,
    backgroundColor: color.dangerBg,
    borderRadius: radius.sm,
    paddingHorizontal: space(3),
    paddingVertical: space(2),
  },
  removeAffordanceText: {
    fontSize: 13,
    fontWeight: "600",
    color: color.danger,
  },
  lastMethodNote: {
    borderTopWidth: 1,
    borderTopColor: color.border,
    paddingTop: space(3),
  },
  lastMethodNoteText: {
    fontSize: 12,
    color: color.faint,
    lineHeight: 17,
  },
  confirmPanel: {
    borderTopWidth: 1,
    borderTopColor: color.dangerBorder,
    paddingTop: space(3),
  },
  confirmMessage: {
    fontSize: 13,
    color: color.ink,
    lineHeight: 18,
    marginBottom: space(3),
  },
  confirmButtons: {
    flexDirection: "row",
    gap: space(2),
  },
  btnBase: {
    borderRadius: radius.sm,
    paddingHorizontal: space(3),
    paddingVertical: space(2),
    borderWidth: 1,
  },
  btnCancel: {
    borderColor: color.border,
    backgroundColor: color.bg,
  },
  btnCancelText: {
    fontSize: 13,
    fontWeight: "600",
    color: color.ink2,
  },
  btnConfirm: {
    borderColor: color.danger,
    backgroundColor: color.danger,
  },
  btnConfirmText: {
    fontSize: 13,
    fontWeight: "700",
    color: color.onAccent,
  },
  btnPressed: {
    opacity: 0.6,
  },
});
