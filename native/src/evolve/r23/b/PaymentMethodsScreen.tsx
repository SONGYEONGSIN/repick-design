// native/src/evolve/r23/b/PaymentMethodsScreen.tsx
// Saved Payment Methods — settings surface for the buyer's saved cards and
// linked payout bank account. Row-scoped destructive-confirm: tapping
// "Remove" converts that row in place into a Cancel / Confirm pair instead
// of popping a native Alert. Only one row may be mid-confirmation at a time.
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import { PAYMENT_METHODS, PaymentMethod } from "./data";
import { PaymentMethodRow } from "./components";

const { color, space, radius } = tokens;

export default function PaymentMethodsScreen() {
  const [methods, setMethods] = useState<PaymentMethod[]>(PAYMENT_METHODS);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  // Single-active-row exclusivity: setting confirmingId to a new row id
  // implicitly cancels whichever row was previously confirming, since only
  // one row's isConfirming can ever be true at once (derived from this id).
  const handleRequestRemove = useCallback((id: string) => {
    setConfirmingId(id);
  }, []);

  const handleCancelRemove = useCallback(() => {
    setConfirmingId(null);
  }, []);

  const handleConfirmRemove = useCallback((id: string) => {
    setMethods((prev) => prev.filter((m) => m.id !== id));
    setConfirmingId(null);
  }, []);

  const handleSetDefault = useCallback((id: string) => {
    setMethods((prev) =>
      prev.map((m) => ({ ...m, isDefault: m.id === id }))
    );
  }, []);

  const hasDefault = methods.some((m) => m.isDefault);
  const payoutMethod = methods.find((m) => m.usableForPayout);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.heading}>
          Payment Methods
        </Text>
        <Text style={styles.subheading}>
          Manage the cards and bank accounts used for buying and for
          receiving payouts.
        </Text>
      </View>

      {!hasDefault && methods.length > 0 ? (
        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            No default payment method is set. Choose one below for faster
            checkout.
          </Text>
        </View>
      ) : null}

      <FlatList
        data={methods}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PaymentMethodRow
            method={item}
            isConfirming={confirmingId === item.id}
            onRequestRemove={handleRequestRemove}
            onCancelRemove={handleCancelRemove}
            onConfirmRemove={handleConfirmRemove}
            onSetDefault={handleSetDefault}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              You have no saved payment methods yet.
            </Text>
          </View>
        }
        ListFooterComponent={
          <View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add new card"
              style={({ pressed }) => [
                styles.addRow,
                pressed && styles.addRowPressed,
              ]}
            >
              <Text style={styles.addRowText}>+ Add new card</Text>
            </Pressable>

            {payoutMethod ? (
              <View style={styles.payoutNote}>
                <Text style={styles.payoutNoteText}>
                  Payouts are sent to {payoutMethod.label}.
                </Text>
              </View>
            ) : (
              <View style={styles.payoutNote}>
                <Text style={styles.payoutNoteText}>
                  No bank account is linked for payouts.
                </Text>
              </View>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: color.bg,
  },
  header: {
    paddingHorizontal: space(5),
    paddingTop: space(4),
    paddingBottom: space(3),
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: color.ink,
    marginBottom: space(1),
  },
  subheading: {
    fontSize: 13,
    color: color.muted,
    lineHeight: 18,
  },
  notice: {
    marginHorizontal: space(5),
    marginBottom: space(3),
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.sm,
    backgroundColor: color.bg,
    paddingHorizontal: space(3),
    paddingVertical: space(2),
  },
  noticeText: {
    fontSize: 12,
    color: color.muted,
  },
  listContent: {
    paddingHorizontal: space(5),
    paddingBottom: space(8),
  },
  empty: {
    paddingVertical: space(8),
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: color.faint,
  },
  addRow: {
    borderWidth: 1,
    borderColor: color.border,
    borderStyle: "dashed",
    borderRadius: radius.md,
    paddingVertical: space(4),
    alignItems: "center",
    marginBottom: space(3),
  },
  addRowPressed: {
    opacity: 0.6,
  },
  addRowText: {
    fontSize: 14,
    fontWeight: "600",
    color: color.accent,
  },
  payoutNote: {
    paddingHorizontal: space(1),
  },
  payoutNoteText: {
    fontSize: 12,
    color: color.faint,
  },
});
