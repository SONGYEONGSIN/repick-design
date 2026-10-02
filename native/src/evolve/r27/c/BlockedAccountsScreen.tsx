// native/src/evolve/r27/c/BlockedAccountsScreen.tsx
//
// Blocked Accounts — a settings-style list of buyers/sellers this account has
// blocked. There is no single screen-level gate or terminal action here (the
// list itself is the whole screen), so per the assigned bottom-band form this
// screen carries NO fixed bottom chrome at all. Each row is independently,
// destructively actionable: tapping "Unblock" converts that row in place into
// a Cancel / Confirm unblock pair (never a native Alert). Exclusivity is
// enforced structurally — `confirmingId` is a single piece of state, so at
// most one row can ever be in the confirming shape at a time; requesting a
// second row's confirm silently resolves the first back to normal.
//
// Non-destructive business rule (so this isn't purely a delete-list): blocks
// applied by repick Trust & Safety ("platform" blocks, e.g. confirmed fraud)
// are not removable from this screen at all. `canUnblock` is a computed
// eligibility flag per row, not a toggle every row shares.

import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import { BlockedAccount, INITIAL_BLOCKED_ACCOUNTS } from "./data";

function canUnblock(account: BlockedAccount): boolean {
  return account.blockedBy === "user";
}

export default function BlockedAccountsScreen() {
  const [accounts, setAccounts] = useState<BlockedAccount[]>(
    INITIAL_BLOCKED_ACCOUNTS
  );
  // The single source of truth for which row (if any) is showing the
  // Cancel/Confirm pair. Because this is one value, not a Set, two rows can
  // never be confirming at once by construction.
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  // The screen's one live region. Every state transition that changes what
  // the user can do writes here, and only here — never into a second region.
  const [statusMessage, setStatusMessage] = useState<string>("");

  const lockedCount = useMemo(
    () => accounts.filter((a) => !canUnblock(a)).length,
    [accounts]
  );

  const requestUnblock = useCallback((account: BlockedAccount) => {
    setConfirmingId(account.id);
    setStatusMessage(
      `Confirm unblocking ${account.name}. Two options: cancel, or confirm unblock.`
    );
  }, []);

  const cancelUnblock = useCallback((account: BlockedAccount) => {
    setConfirmingId(null);
    setStatusMessage(`Unblock cancelled. ${account.name} is still blocked.`);
  }, []);

  const confirmUnblock = useCallback((account: BlockedAccount) => {
    setAccounts((prev) => prev.filter((a) => a.id !== account.id));
    setConfirmingId(null);
    setStatusMessage(`${account.name} was unblocked and removed from this list.`);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: BlockedAccount }) => {
      const isConfirming = confirmingId === item.id;
      const unblockable = canUnblock(item);

      return (
        <View
          style={[styles.card, isConfirming && styles.cardConfirming]}
        >
          <View style={styles.row}>
            <View style={styles.avatar} accessible={false}>
              <Text style={styles.avatarText}>{item.initials}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>
                {item.role} · {item.reason}
              </Text>
              <Text style={styles.date}>{item.blockedOnLabel}</Text>
            </View>
          </View>

          {isConfirming ? (
            <View style={styles.confirmArea}>
              <Text style={styles.confirmQuestion}>
                {`Unblock ${item.name}? They'll be able to message you and view your listings again.`}
              </Text>
              <View style={styles.confirmActions}>
                <Pressable
                  onPress={() => cancelUnblock(item)}
                  accessibilityRole="button"
                  accessibilityLabel={`Cancel unblocking ${item.name}`}
                  style={({ pressed }) => [
                    styles.cancelButton,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={() => confirmUnblock(item)}
                  accessibilityRole="button"
                  accessibilityLabel={`Confirm unblocking ${item.name}`}
                  accessibilityHint="Removes this account from your blocked list."
                  style={({ pressed }) => [
                    styles.confirmButton,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <Text style={styles.confirmButtonText}>Confirm unblock</Text>
                </Pressable>
              </View>
            </View>
          ) : unblockable ? (
            <Pressable
              onPress={() => requestUnblock(item)}
              accessibilityRole="button"
              accessibilityLabel={`Unblock ${item.name}`}
              accessibilityHint="Shows a confirmation before restoring contact."
              style={({ pressed }) => [
                styles.unblockButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.unblockButtonText}>Unblock</Text>
            </Pressable>
          ) : (
            <View style={styles.lockedArea}>
              <View style={styles.lockedBadge}>
                <Text style={styles.lockedBadgeText}>Locked · T&S</Text>
              </View>
              <Text style={styles.lockedNote}>
                Blocked by repick Trust & Safety for account security.
                Contact support to appeal — it can't be removed here.
              </Text>
            </View>
          )}
        </View>
      );
    },
    [confirmingId, requestUnblock, cancelUnblock, confirmUnblock]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.title}>
          Blocked Accounts
        </Text>
        <Text style={styles.subtitle}>
          People and sellers you've blocked can't message you or view your
          listings.
        </Text>
        <Text style={styles.summary}>
          {accounts.length} blocked
          {lockedCount > 0
            ? ` · ${lockedCount} locked by Trust & Safety and can't be removed here`
            : ""}
        </Text>
      </View>

      {/* The screen's single live region. The container stays mounted so
          assistive tech always has it; the alert-role text inside is the
          only thing any handler ever writes an announcement into. */}
      <View style={styles.statusRegion} accessibilityLiveRegion="polite">
        {statusMessage ? (
          <Text style={styles.statusText} accessibilityRole="alert">
            {statusMessage}
          </Text>
        ) : null}
      </View>

      <FlatList
        data={accounts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              You have no blocked accounts.
            </Text>
          </View>
        }
      />
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
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(2),
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subtitle: {
    marginTop: tokens.space(1),
    fontSize: 14,
    color: tokens.color.muted,
    lineHeight: 20,
  },
  summary: {
    marginTop: tokens.space(2),
    fontSize: 13,
    color: tokens.color.faint,
  },
  statusRegion: {
    minHeight: 0,
  },
  statusText: {
    marginHorizontal: tokens.space(4),
    marginBottom: tokens.space(2),
    paddingVertical: tokens.space(2),
    paddingHorizontal: tokens.space(3),
    borderRadius: tokens.radius.sm,
    borderLeftWidth: 3,
    borderLeftColor: tokens.color.accent,
    backgroundColor: tokens.color.bg,
    color: tokens.color.ink2,
    fontSize: 13,
  },
  listContent: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(6),
  },
  card: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    marginBottom: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  cardConfirming: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accentBg,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: tokens.color.swatch1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: tokens.space(3),
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  meta: {
    marginTop: 2,
    fontSize: 13,
    color: tokens.color.muted,
    lineHeight: 18,
  },
  date: {
    marginTop: 4,
    fontSize: 12,
    color: tokens.color.faint,
  },
  unblockButton: {
    marginTop: tokens.space(3),
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    paddingVertical: tokens.space(2),
    paddingHorizontal: tokens.space(4),
  },
  unblockButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  lockedArea: {
    marginTop: tokens.space(3),
  },
  lockedBadge: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: tokens.color.warningBorder,
    backgroundColor: tokens.color.warningBg,
    borderRadius: tokens.radius.sm,
    paddingVertical: 4,
    paddingHorizontal: tokens.space(2),
  },
  lockedBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.warning,
  },
  lockedNote: {
    marginTop: tokens.space(2),
    fontSize: 12,
    color: tokens.color.faint,
    lineHeight: 17,
  },
  confirmArea: {
    marginTop: tokens.space(3),
  },
  confirmQuestion: {
    fontSize: 13,
    color: tokens.color.ink2,
    lineHeight: 18,
  },
  confirmActions: {
    flexDirection: "row",
    marginTop: tokens.space(3),
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    paddingVertical: tokens.space(2),
    paddingHorizontal: tokens.space(4),
    marginRight: tokens.space(2),
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  confirmButton: {
    borderWidth: 1,
    borderColor: tokens.color.dangerBorder,
    backgroundColor: tokens.color.dangerBg,
    borderRadius: tokens.radius.sm,
    paddingVertical: tokens.space(2),
    paddingHorizontal: tokens.space(4),
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.danger,
  },
  buttonPressed: {
    opacity: 0.6,
  },
  emptyState: {
    paddingTop: tokens.space(8),
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: tokens.color.muted,
  },
});
