// native/src/evolve/r30/b/LinkedMarketplacesSync.tsx
//
// Linked Marketplaces Sync — a seller-facing screen listing the external
// marketplace accounts a seller's inventory syncs with.
//
// Row-level destructive-confirm doctrine (per GENERATION.md):
//   - Each disconnectable row is its own three-way state machine:
//       idle -> confirming -> (idle again, now shown as disconnected)
//   - Tapping "Disconnect" turns THAT row into a Cancel / Confirm pair,
//     inline, in place. No native Alert anywhere on this screen.
//   - The primary row is a genuinely different, third case: it never shows
//     a Disconnect control at all, only an explanatory note. It is not a
//     disabled button — there is no button.
//   - Exactly one live region for the whole screen: a single, persistently
//     mounted status line under the header that every row's handler writes
//     its announcement into (option "b" from the brief, not one-per-row).

import * as React from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import { marketplaceRows, type MarketplaceRow } from "./data";

type RowPhase = "idle" | "confirming";

const TOUCH_HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

export default function LinkedMarketplacesSync() {
  // Per-row UI phase. Rows not present in this map are "idle". The primary
  // row never enters this map — it has no phase, it's a fixed third case.
  const [rowPhase, setRowPhase] = React.useState<Record<string, RowPhase>>({});
  // Rows the seller has confirmed disconnecting, tracked locally so the row
  // can switch to its disconnected presentation without leaving the list.
  const [disconnectedIds, setDisconnectedIds] = React.useState<
    Record<string, true>
  >({});
  // The single screen-level live region's current announcement text.
  const [announcement, setAnnouncement] = React.useState("");

  const beginConfirm = React.useCallback((row: MarketplaceRow) => {
    setRowPhase((prev) => ({ ...prev, [row.id]: "confirming" }));
    setAnnouncement(
      `${row.name}: disconnect requires confirmation. Cancel or confirm below.`,
    );
  }, []);

  const cancelConfirm = React.useCallback((row: MarketplaceRow) => {
    setRowPhase((prev) => ({ ...prev, [row.id]: "idle" }));
    setAnnouncement(`${row.name}: disconnect cancelled, connection kept.`);
  }, []);

  const finishDisconnect = React.useCallback((row: MarketplaceRow) => {
    setRowPhase((prev) => ({ ...prev, [row.id]: "idle" }));
    setDisconnectedIds((prev) => ({ ...prev, [row.id]: true }));
    setAnnouncement(`${row.name} disconnected. It is no longer linked.`);
  }, []);

  const renderRow = React.useCallback(
    ({ item }: { item: MarketplaceRow }) => {
      if (item.isPrimary) {
        return <PrimaryRow row={item} />;
      }
      const phase = rowPhase[item.id] ?? "idle";
      const isDisconnected = Boolean(disconnectedIds[item.id]);
      return (
        <StandardRow
          row={item}
          phase={phase}
          isDisconnected={isDisconnected}
          onDisconnectPress={() => beginConfirm(item)}
          onCancelPress={() => cancelConfirm(item)}
          onConfirmPress={() => finishDisconnect(item)}
        />
      );
    },
    [rowPhase, disconnectedIds, beginConfirm, cancelConfirm, finishDisconnect],
  );

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.headerBlock}>
        <Text accessibilityRole="header" style={styles.title}>
          Linked Marketplaces
        </Text>
        <Text style={styles.subtitle}>
          Accounts your inventory syncs with. Disconnect any one except your
          primary source.
        </Text>
      </View>

      {/* Single, persistently-mounted live region for the whole screen. */}
      <View
        style={styles.liveRegion}
        accessibilityLiveRegion="polite"
        importantForAccessibility="yes"
      >
        <Text
          style={styles.liveRegionText}
          accessibilityRole={announcement ? "alert" : undefined}
        >
          {announcement}
        </Text>
      </View>

      <FlatList
        data={marketplaceRows}
        keyExtractor={(row) => row.id}
        renderItem={renderRow}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

function HealthChip({ row }: { row: MarketplaceRow }) {
  if (row.syncHealth === "attention") {
    return (
      <View style={styles.chipAttention}>
        <Text style={styles.chipAttentionText}>Needs attention</Text>
      </View>
    );
  }
  return (
    <View style={styles.chipActive}>
      <Text style={styles.chipActiveText}>Syncing</Text>
    </View>
  );
}

function RowFacts({ row }: { row: MarketplaceRow }) {
  return (
    <View style={styles.factsLine}>
      <Text style={styles.factsText}>Last synced {row.lastSyncedLabel}</Text>
      <Text style={styles.factsDot}>·</Text>
      <Text style={[styles.factsText, styles.factsNumber]}>
        {row.itemsSynced} items
      </Text>
    </View>
  );
}

function PrimaryRow({ row }: { row: MarketplaceRow }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTopLine}>
        <View style={styles.identityCol}>
          <Text style={styles.name}>{row.name}</Text>
          <Text style={styles.handle}>{row.handle}</Text>
        </View>
        <View style={styles.chipLocked}>
          <Text style={styles.chipLockedText}>Primary</Text>
        </View>
      </View>

      <RowFacts row={row} />

      <Text style={styles.lockedNote}>{row.lockedNote}</Text>
    </View>
  );
}

function StandardRow({
  row,
  phase,
  isDisconnected,
  onDisconnectPress,
  onCancelPress,
  onConfirmPress,
}: {
  row: MarketplaceRow;
  phase: RowPhase;
  isDisconnected: boolean;
  onDisconnectPress: () => void;
  onCancelPress: () => void;
  onConfirmPress: () => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTopLine}>
        <View style={styles.identityCol}>
          <Text style={styles.name}>{row.name}</Text>
          <Text style={styles.handle}>{row.handle}</Text>
        </View>
        {isDisconnected ? (
          <View style={styles.chipDisconnected}>
            <Text style={styles.chipDisconnectedText}>Disconnected</Text>
          </View>
        ) : (
          <HealthChip row={row} />
        )}
      </View>

      {!isDisconnected && <RowFacts row={row} />}

      {!isDisconnected && row.syncHealth === "attention" && (
        <Text style={styles.attentionNote}>{row.attentionNote}</Text>
      )}

      {isDisconnected && (
        <Text style={styles.disconnectedNote}>
          No longer linked. It won't appear in future sync runs.
        </Text>
      )}

      {!isDisconnected && phase === "idle" && (
        <View style={styles.actionLine}>
          <Pressable
            onPress={onDisconnectPress}
            hitSlop={TOUCH_HIT_SLOP}
            accessibilityRole="button"
            accessibilityLabel={`Disconnect ${row.name}`}
            style={({ pressed }) => [
              styles.disconnectButton,
              pressed && styles.disconnectButtonPressed,
            ]}
          >
            <Text style={styles.disconnectButtonText}>Disconnect</Text>
          </Pressable>
        </View>
      )}

      {!isDisconnected && phase === "confirming" && (
        <View style={styles.confirmBlock}>
          <Text style={styles.confirmPrompt}>
            Disconnect {row.name}? This marketplace will stop syncing with
            your inventory.
          </Text>
          <View style={styles.actionLine}>
            <Pressable
              onPress={onCancelPress}
              hitSlop={TOUCH_HIT_SLOP}
              accessibilityRole="button"
              accessibilityLabel={`Cancel disconnecting ${row.name}`}
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.cancelButtonPressed,
              ]}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={onConfirmPress}
              hitSlop={TOUCH_HIT_SLOP}
              accessibilityRole="button"
              accessibilityLabel={`Confirm disconnecting ${row.name}`}
              style={({ pressed }) => [
                styles.confirmButton,
                pressed && styles.confirmButtonPressed,
              ]}
            >
              <Text style={styles.confirmButtonText}>Confirm disconnect</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  headerBlock: {
    paddingHorizontal: tokens.space(5),
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
    fontSize: 13,
    lineHeight: 18,
    color: tokens.color.muted,
  },
  liveRegion: {
    paddingHorizontal: tokens.space(5),
    minHeight: tokens.space(7),
    justifyContent: "center",
  },
  liveRegionText: {
    fontSize: 12,
    color: tokens.color.accent,
  },
  listContent: {
    paddingHorizontal: tokens.space(5),
    paddingBottom: tokens.space(8),
  },
  separator: {
    height: tokens.space(3),
  },
  card: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
  },
  cardTopLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  identityCol: {
    flexShrink: 1,
    paddingRight: tokens.space(3),
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  handle: {
    marginTop: 2,
    fontSize: 12,
    color: tokens.color.faint,
  },
  factsLine: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: tokens.space(3),
  },
  factsText: {
    fontSize: 12,
    color: tokens.color.muted,
  },
  factsNumber: {
    fontVariant: ["tabular-nums"],
  },
  factsDot: {
    marginHorizontal: tokens.space(1) + 2,
    fontSize: 12,
    color: tokens.color.faint,
  },
  chipActive: {
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.successBorder,
    backgroundColor: tokens.color.successBg,
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1),
  },
  chipActiveText: {
    fontSize: 11,
    fontWeight: "600",
    color: tokens.color.success,
  },
  chipAttention: {
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.warningBorder,
    backgroundColor: tokens.color.warningBg,
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1),
  },
  chipAttentionText: {
    fontSize: 11,
    fontWeight: "600",
    color: tokens.color.warning,
  },
  chipDisconnected: {
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1),
  },
  chipDisconnectedText: {
    fontSize: 11,
    fontWeight: "600",
    color: tokens.color.faint,
  },
  chipLocked: {
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accentBg,
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1),
  },
  chipLockedText: {
    fontSize: 11,
    fontWeight: "600",
    color: tokens.color.accent,
  },
  lockedNote: {
    marginTop: tokens.space(3),
    fontSize: 12,
    lineHeight: 17,
    color: tokens.color.faint,
  },
  attentionNote: {
    marginTop: tokens.space(2),
    fontSize: 12,
    lineHeight: 17,
    color: tokens.color.warning,
  },
  disconnectedNote: {
    marginTop: tokens.space(3),
    fontSize: 12,
    lineHeight: 17,
    color: tokens.color.faint,
  },
  actionLine: {
    flexDirection: "row",
    marginTop: tokens.space(4),
  },
  disconnectButton: {
    minHeight: 44,
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  disconnectButtonPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  disconnectButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  confirmBlock: {
    marginTop: tokens.space(1),
  },
  confirmPrompt: {
    marginTop: tokens.space(3),
    fontSize: 13,
    lineHeight: 18,
    color: tokens.color.ink2,
  },
  cancelButton: {
    minHeight: 44,
    flexGrow: 1,
    marginRight: tokens.space(2),
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  cancelButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  confirmButton: {
    minHeight: 44,
    flexGrow: 1,
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.dangerBorder,
    backgroundColor: tokens.color.dangerBg,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonPressed: {
    borderColor: tokens.color.danger,
  },
  confirmButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.danger,
  },
});
