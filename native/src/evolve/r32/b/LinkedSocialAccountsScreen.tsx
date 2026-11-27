import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
} from "react-native";
import { tokens } from "../../../tokens";
import { initialLinkedAccounts, LinkedAccount } from "./data";
import { AccountRow, AccountRowState } from "./AccountRow";

export default function LinkedSocialAccountsScreen() {
  const [accounts, setAccounts] = useState<LinkedAccount[]>(
    initialLinkedAccounts
  );
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [liveMessage, setLiveMessage] = useState<string>("");

  function rowStateFor(account: LinkedAccount): AccountRowState {
    if (account.isPrimary) return "locked";
    if (account.id === confirmingId) return "confirming";
    return "normal";
  }

  function handleUnlinkPress(account: LinkedAccount) {
    const hadOtherConfirming =
      confirmingId !== null && confirmingId !== account.id;
    const otherAccount = hadOtherConfirming
      ? accounts.find((a) => a.id === confirmingId)
      : undefined;

    setConfirmingId(account.id);

    if (otherAccount) {
      setLiveMessage(
        `${otherAccount.platform} unlink was cancelled. Confirm unlinking ${account.platform}: choose Confirm unlink to remove it, or Cancel to keep it linked.`
      );
    } else {
      setLiveMessage(
        `Confirm unlinking ${account.platform}: choose Confirm unlink to remove it, or Cancel to keep it linked.`
      );
    }
  }

  function handleCancelPress(account: LinkedAccount) {
    setConfirmingId(null);
    setLiveMessage(`Unlink cancelled. ${account.platform} remains linked.`);
  }

  function handleConfirmPress(account: LinkedAccount) {
    setAccounts((prev) => prev.filter((a) => a.id !== account.id));
    setConfirmingId(null);
    setLiveMessage(`${account.platform} has been unlinked.`);
  }

  function handleMakePrimaryPress(account: LinkedAccount) {
    setAccounts((prev) =>
      prev.map((a) => ({ ...a, isPrimary: a.id === account.id }))
    );
    setLiveMessage(`${account.platform} is now your primary storefront link.`);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.title}>
          Linked Social Accounts
        </Text>
        <Text style={styles.subtitle}>
          Connect accounts to cross-post listings. Exactly one account is
          marked primary and anchors your storefront link.
        </Text>
      </View>

      <View
        accessibilityLiveRegion="polite"
        style={styles.liveRegion}
      >
        <Text
          accessibilityRole={liveMessage ? "alert" : undefined}
          style={styles.liveRegionText}
        >
          {liveMessage || "Account status is up to date."}
        </Text>
      </View>

      <FlatList
        data={accounts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <AccountRow
            account={item}
            rowState={rowStateFor(item)}
            onUnlinkPress={handleUnlinkPress}
            onCancelPress={handleCancelPress}
            onConfirmPress={handleConfirmPress}
            onMakePrimaryPress={handleMakePrimaryPress}
          />
        )}
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
    gap: tokens.space(1),
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subtitle: {
    fontSize: 13,
    color: tokens.color.muted,
    lineHeight: 18,
  },
  liveRegion: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(2),
  },
  liveRegionText: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  listContent: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(6),
  },
  separator: {
    height: tokens.space(3),
  },
});
