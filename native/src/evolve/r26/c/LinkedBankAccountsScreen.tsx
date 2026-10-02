// native/src/evolve/r26/c/LinkedBankAccountsScreen.tsx — auto-native-r26 candidate c
//
// Linked Bank Accounts: a seller's list of payout destinations for money the marketplace
// owes them — distinct from a buyer's stored payment cards (that's a different screen,
// different direction of money flow). Each row is a fully independent settings entry: it
// carries its own "Set as default" (non-destructive, immediate) and "Unlink" (destructive)
// actions, and nothing on this screen is blocked or in-progress, so there is no fixed
// bottom band of any kind — no state-machine band, no persistent action bar, no selection
// dock. The meaningful actions live entirely inside each row.
//
// Band form (GENERATION.md §3): "no fixed chrome" is the legitimate choice here — but the
// destructive path still needs the row-swap pattern from the same section. Pressing
// "Unlink" never opens a native Alert. It converts that ONE row's lower half into an
// inline Cancel/Confirm pair, inside a container that already carries
// accessibilityLiveRegion="polite", and the confirmation sentence itself is what gets
// announced. Confirmation state is tracked per account id in a Set
// (`rowsAwaitingUnlink`), not a single nullable id — so two different rows can be mid
// confirmation at once without either one's Cancel/Confirm state leaking into or
// clobbering the other's.
//
// Real derived state, not a shallow toggle:
//  - A seller can never unlink their only remaining account, and can never unlink the
//    account currently marked default without reassigning default first
//    (`unlinkBlockReason`, data.ts). The Unlink control is visibly disabled with the
//    reason spelled out in text, not just dimmed.
//  - "Set as default" reassigns the default flag across the whole list in one update
//    (moving the "Default" tag and re-enabling Unlink on the account that lost it) and
//    announces the change through a separate, screen-level live region — never the same
//    live region a row's own Unlink-confirmation uses, so one press never writes into two
//    live regions at once.
import React, { useState } from "react";
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
  SEED_PAYOUT_ACCOUNTS,
  accountKindLabel,
  bankInitial,
  countNoun,
  maskedAccountNumber,
  unlinkBlockReason,
  type PayoutAccount,
} from "./data";

const TAP_PAD = { top: 10, bottom: 10, left: 10, right: 10 };

function AccountRow({
  account,
  totalAccounts,
  awaitingUnlink,
  onRequestUnlink,
  onAbortUnlink,
  onFinishUnlink,
  onMakeDefault,
}: {
  account: PayoutAccount;
  totalAccounts: number;
  awaitingUnlink: boolean;
  onRequestUnlink: (id: string) => void;
  onAbortUnlink: (id: string) => void;
  onFinishUnlink: (id: string) => void;
  onMakeDefault: (id: string) => void;
}) {
  const blockReason = unlinkBlockReason(account, totalAccounts);
  const unlinkAllowed = blockReason === null;

  return (
    <View style={styles.accountCard}>
      <View style={styles.cardTopRow}>
        <View style={styles.bankBadge}>
          <Text style={styles.bankBadgeText}>{bankInitial(account.bankName)}</Text>
        </View>
        <View style={styles.cardTopText}>
          <Text style={styles.bankNameText} numberOfLines={1}>
            {account.bankName}
          </Text>
          <Text style={styles.accountNumberText}>
            {maskedAccountNumber(account.last4)}
          </Text>
        </View>
        {account.isDefault ? (
          <View style={styles.defaultTag}>
            <Text style={styles.defaultTagText}>Default</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>
          {accountKindLabel(account.kind)} · {account.holderName}
        </Text>
        {account.isVerified ? (
          <Text style={styles.verifiedText}>{"✓ Verified"}</Text>
        ) : (
          <Text style={styles.pendingText}>{"● Verification pending"}</Text>
        )}
      </View>
      <Text style={styles.linkedOnText}>{account.linkedOnLabel}</Text>

      {awaitingUnlink ? (
        <View
          style={styles.confirmZone}
          accessibilityLiveRegion="polite"
        >
          <Text style={styles.confirmSentence} accessibilityRole="alert">
            {`Unlink ${account.bankName} ${maskedAccountNumber(account.last4)}? Payouts will stop going to this account.`}
          </Text>
          <View style={styles.confirmButtonsRow}>
            <Pressable
              onPress={() => onAbortUnlink(account.id)}
              hitSlop={TAP_PAD}
              accessibilityRole="button"
              accessibilityLabel={`Cancel unlinking ${account.bankName}`}
              style={({ pressed }) => [
                styles.confirmCancelBtn,
                pressed && styles.pressedDim,
              ]}
            >
              <Text style={styles.confirmCancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => onFinishUnlink(account.id)}
              hitSlop={TAP_PAD}
              accessibilityRole="button"
              accessibilityLabel={`Confirm unlinking ${account.bankName} ${maskedAccountNumber(account.last4)}`}
              style={({ pressed }) => [
                styles.confirmDangerBtn,
                pressed && styles.pressedDim,
              ]}
            >
              <Text style={styles.confirmDangerText}>Confirm</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.actionRow}>
          {!account.isDefault ? (
            <Pressable
              onPress={() => onMakeDefault(account.id)}
              accessibilityRole="button"
              accessibilityLabel={`Set ${account.bankName} as default payout account`}
              style={({ pressed }) => [
                styles.setDefaultBtn,
                pressed && styles.pressedDim,
              ]}
            >
              <Text style={styles.setDefaultBtnText}>Set as default</Text>
            </Pressable>
          ) : (
            <View style={styles.setDefaultSpacer} />
          )}

          <Pressable
            onPress={() => onRequestUnlink(account.id)}
            disabled={!unlinkAllowed}
            hitSlop={TAP_PAD}
            accessibilityRole="button"
            accessibilityState={{ disabled: !unlinkAllowed }}
            accessibilityLabel={
              unlinkAllowed
                ? `Unlink ${account.bankName}`
                : `Unlink unavailable for ${account.bankName}. ${blockReason}`
            }
            style={({ pressed }) => [
              styles.unlinkBtn,
              !unlinkAllowed && styles.unlinkBtnDisabled,
              pressed && unlinkAllowed && styles.pressedDim,
            ]}
          >
            <Text
              style={[
                styles.unlinkBtnText,
                !unlinkAllowed && styles.unlinkBtnTextDisabled,
              ]}
            >
              Unlink
            </Text>
          </Pressable>
        </View>
      )}

      {!unlinkAllowed && !awaitingUnlink ? (
        <Text style={styles.blockNote}>{blockReason}</Text>
      ) : null}
    </View>
  );
}

export function LinkedBankAccountsScreen() {
  const [accounts, setAccounts] = useState<PayoutAccount[]>(SEED_PAYOUT_ACCOUNTS);
  const [rowsAwaitingUnlink, setRowsAwaitingUnlink] = useState<Set<string>>(new Set());
  const [statusLine, setStatusLine] = useState<string>("");

  const defaultAccount = accounts.find((a) => a.isDefault);

  const requestUnlink = (id: string) => {
    setRowsAwaitingUnlink((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const abortUnlink = (id: string) => {
    setRowsAwaitingUnlink((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const finishUnlink = (id: string) => {
    const target = accounts.find((a) => a.id === id);
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    setRowsAwaitingUnlink((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    if (target) {
      setStatusLine(
        `${target.bankName} ${maskedAccountNumber(target.last4)} unlinked. It will no longer receive payouts.`,
      );
    }
  };

  const makeDefault = (id: string) => {
    const target = accounts.find((a) => a.id === id);
    setAccounts((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    if (target) {
      setStatusLine(`${target.bankName} is now your default payout account.`);
    }
  };

  const header = (
    <View style={styles.screenHeader}>
      <Text style={styles.headingText} accessibilityRole="header">
        Linked Bank Accounts
      </Text>
      <Text style={styles.subheadText}>
        {countNoun(accounts.length, "account")} linked
        {defaultAccount ? ` · ${defaultAccount.bankName} is your default` : ""}
      </Text>
      <View style={styles.announceBox} accessibilityLiveRegion="polite">
        {statusLine ? (
          <Text style={styles.announceLine} accessibilityRole="alert">
            {statusLine}
          </Text>
        ) : null}
      </View>
    </View>
  );

  const footer = (
    <Pressable
      onPress={() => {}}
      accessibilityRole="button"
      accessibilityLabel="Link a new bank account"
      style={({ pressed }) => [styles.addAccountRow, pressed && styles.pressedDim]}
    >
      <Text style={styles.addAccountText}>{"+ Link a new bank account"}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.screenSafe}>
      <FlatList
        data={accounts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AccountRow
            account={item}
            totalAccounts={accounts.length}
            awaitingUnlink={rowsAwaitingUnlink.has(item.id)}
            onRequestUnlink={requestUnlink}
            onAbortUnlink={abortUnlink}
            onFinishUnlink={finishUnlink}
            onMakeDefault={makeDefault}
          />
        )}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        contentContainerStyle={styles.listBody}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

export default LinkedBankAccountsScreen;

const styles = StyleSheet.create({
  screenSafe: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  listBody: {
    paddingHorizontal: tokens.space(5),
    paddingBottom: tokens.space(10),
  },

  screenHeader: {
    paddingTop: tokens.space(6),
    paddingBottom: tokens.space(2),
  },
  headingText: {
    fontSize: 28,
    fontWeight: "800",
    color: tokens.color.ink,
    letterSpacing: -0.5,
  },
  subheadText: {
    marginTop: tokens.space(1),
    fontSize: 13,
    color: tokens.color.faint,
  },
  announceBox: { marginTop: tokens.space(2) },
  announceLine: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.accent,
  },

  accountCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    marginTop: tokens.space(3),
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
  },
  bankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: tokens.color.ink2,
    alignItems: "center",
    justifyContent: "center",
  },
  bankBadgeText: {
    color: tokens.color.onInk,
    fontSize: 16,
    fontWeight: "800",
  },
  cardTopText: { flex: 1, gap: 2 },
  bankNameText: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  accountNumberText: {
    fontSize: 13,
    color: tokens.color.muted,
    fontVariant: ["tabular-nums"],
  },
  defaultTag: {
    backgroundColor: tokens.color.accentBg,
    borderWidth: 1,
    borderColor: tokens.color.accent,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(2),
    paddingVertical: 3,
  },
  defaultTagText: {
    color: tokens.color.accent,
    fontSize: 11,
    fontWeight: "700",
  },

  metaRow: {
    marginTop: tokens.space(3),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.space(2),
  },
  metaText: { fontSize: 12, color: tokens.color.muted, flexShrink: 1 },
  verifiedText: { fontSize: 12, fontWeight: "700", color: tokens.color.success },
  pendingText: { fontSize: 12, fontWeight: "700", color: tokens.color.warning },
  linkedOnText: { marginTop: 2, fontSize: 11, color: tokens.color.faint },

  actionRow: {
    marginTop: tokens.space(4),
    flexDirection: "row",
    gap: tokens.space(2),
  },
  setDefaultBtn: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(2),
  },
  setDefaultBtnText: {
    color: tokens.color.ink2,
    fontSize: 13,
    fontWeight: "700",
  },
  setDefaultSpacer: { flex: 1 },
  unlinkBtn: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.dangerBorder,
    backgroundColor: tokens.color.dangerBg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(2),
  },
  unlinkBtnDisabled: {
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  unlinkBtnText: {
    color: tokens.color.danger,
    fontSize: 13,
    fontWeight: "700",
  },
  unlinkBtnTextDisabled: { color: tokens.color.faint },

  blockNote: {
    marginTop: tokens.space(2),
    fontSize: 11,
    color: tokens.color.faint,
  },

  confirmZone: {
    marginTop: tokens.space(4),
    borderTopWidth: 1,
    borderTopColor: tokens.color.dangerBorder,
    paddingTop: tokens.space(3),
  },
  confirmSentence: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.danger,
    lineHeight: 18,
  },
  confirmButtonsRow: {
    marginTop: tokens.space(3),
    flexDirection: "row",
    gap: tokens.space(2),
  },
  confirmCancelBtn: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmCancelText: {
    color: tokens.color.ink2,
    fontSize: 14,
    fontWeight: "700",
  },
  confirmDangerBtn: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmDangerText: {
    color: tokens.color.onAccent,
    fontSize: 14,
    fontWeight: "700",
  },

  pressedDim: { opacity: 0.8 },

  addAccountRow: {
    marginTop: tokens.space(5),
    minHeight: 44,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  addAccountText: {
    color: tokens.color.accent,
    fontSize: 14,
    fontWeight: "700",
  },
});
