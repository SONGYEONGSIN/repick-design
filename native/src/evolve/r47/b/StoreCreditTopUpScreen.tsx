// native/src/evolve/r47/b/StoreCreditTopUpScreen.tsx
//
// Domain: Store Credit Top-Up — the buyer PREPAYS into their own in-app
// balance by buying a fixed package (e.g. $10 / $25 / $50 / $100), to spend
// later on purchases in this marketplace. Money moves IN, as a prepaid
// credit the buyer owns ahead of any specific purchase. This is deliberately
// NOT the wallet/transaction-history screen (no ledger of past activity is
// shown here, only the current balance as context for the top-up math) and
// NOT a payout/withdraw screen (those move money OUT to a seller's bank or
// card; nothing here ever leaves the app).
//
// Band mechanic assigned to this round: a single-selection-derived band.
// Exactly one package tile can be selected at a time (tapping a different
// tile swaps the selection, it never adds to it), and the bottom band's
// presence is read straight off that selection on every render:
//
//   const selectedPackage = findCreditPackage(selectedPackageId);
//   ...
//   {selectedPackage && <View style={styles.creditBand} ...>}
//
// There is no separate `showBand` flag anywhere that gets imperatively
// flipped — `selectedPackage` IS `null` until a tile is tapped, so the band
// simply has nothing to render until then. This is the single-nullable-id
// shape of the family (as opposed to a selection-COUNT-derived bar for a
// multi-select list elsewhere in this codebase).
//
// Tapping the band advances a local `step` from "select" to "confirm" — the
// band itself swaps its sentence and its buttons for the confirm step,
// reusing the same single live-region container rather than mounting a
// second one, so there is exactly one accessibilityLiveRegion on screen at
// any moment (the two step contents are mutually exclusive, never both
// mounted together).
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
  CREDIT_PACKAGES,
  CURRENT_BALANCE_CENTS,
  CreditPackage,
  CreditPackageId,
  findCreditPackage,
  bonusCents,
  formatUsd,
} from "./data";

type TopUpStep = "select" | "confirm";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

export default function StoreCreditTopUpScreen() {
  const [selectedPackageId, setSelectedPackageId] = useState<CreditPackageId | null>(
    null
  );
  const [step, setStep] = useState<TopUpStep>("select");

  const selectedPackage = findCreditPackage(selectedPackageId);

  function handleSelectPackage(id: CreditPackageId) {
    setSelectedPackageId(id);
  }

  function handleProceedToConfirm() {
    setStep("confirm");
  }

  function handleChangePackage() {
    setStep("select");
  }

  function handleConfirmPurchase() {
    // This demo screen has no payment backend wired up yet, so confirming
    // intentionally does nothing further — no receipt or balance update is
    // produced. No accessibilityHint promising one is attached below.
  }

  const newBalanceCents = selectedPackage
    ? CURRENT_BALANCE_CENTS + selectedPackage.creditCents
    : CURRENT_BALANCE_CENTS;

  const bandSentence = selectedPackage
    ? step === "select"
      ? `${formatUsd(selectedPackage.priceCents)} package selected — ${formatUsd(
          selectedPackage.creditCents
        )} store credit`
      : `Confirm purchase: pay ${formatUsd(
          selectedPackage.priceCents
        )} for ${formatUsd(selectedPackage.creditCents)} store credit`
    : "";

  return (
    <SafeAreaView style={styles.safe}>
      {step === "select" ? (
        <FlatList
          data={CREDIT_PACKAGES}
          keyExtractor={(pkg) => pkg.id}
          numColumns={2}
          columnWrapperStyle={styles.tileRow}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
              <Text accessibilityRole="header" style={styles.title}>
                Top Up Store Credit
              </Text>
              <Text style={styles.subtitle}>
                Buy a package now and spend the Store Credit on any purchase
                later. Pick one package below.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <CreditPackageTile
              pkg={item}
              selected={item.id === selectedPackageId}
              onSelect={() => handleSelectPackage(item.id)}
            />
          )}
        />
      ) : (
        <View style={styles.confirmArea}>
          <Text accessibilityRole="header" style={styles.title}>
            Confirm Store Credit Purchase
          </Text>
          <Text style={styles.subtitle}>
            Review this package before you buy. You can still change it.
          </Text>
          {selectedPackage && (
            <View style={styles.confirmCard}>
              <ConfirmRow label="Package" value={formatUsd(selectedPackage.priceCents)} />
              <ConfirmRow
                label="You pay"
                value={formatUsd(selectedPackage.priceCents)}
              />
              {bonusCents(selectedPackage) > 0 && (
                <ConfirmRow
                  label="Bonus credit"
                  value={`+${formatUsd(bonusCents(selectedPackage))}`}
                  emphasis="success"
                />
              )}
              <ConfirmRow
                label="Credit added"
                value={formatUsd(selectedPackage.creditCents)}
                emphasis="accent"
              />
              <View style={styles.confirmDivider} />
              <ConfirmRow
                label="Current balance"
                value={formatUsd(CURRENT_BALANCE_CENTS)}
              />
              <ConfirmRow
                label="New balance"
                value={formatUsd(newBalanceCents)}
                emphasis="accent"
              />
            </View>
          )}
        </View>
      )}

      {selectedPackage && (
        <View style={styles.creditBand} accessibilityLiveRegion="polite">
          <Text accessibilityRole="alert" style={styles.creditBandSentence}>
            {bandSentence}
          </Text>
          {step === "select" ? (
            <Pressable
              onPress={handleProceedToConfirm}
              accessibilityRole="button"
              accessibilityLabel={`Continue with the ${formatUsd(
                selectedPackage.priceCents
              )} package`}
              hitSlop={HIT_SLOP}
              style={({ pressed }) => [
                styles.proceedButton,
                pressed && styles.proceedButtonPressed,
              ]}
            >
              <Text style={styles.proceedButtonText}>Continue</Text>
            </Pressable>
          ) : (
            <View style={styles.confirmButtonRow}>
              <Pressable
                onPress={handleChangePackage}
                accessibilityRole="button"
                accessibilityLabel="Change package"
                accessibilityHint="Returns to the package selection step"
                hitSlop={HIT_SLOP}
                style={({ pressed }) => [
                  styles.changeButton,
                  pressed && styles.changeButtonPressed,
                ]}
              >
                <Text style={styles.changeButtonText}>Change package</Text>
              </Pressable>
              <Pressable
                onPress={handleConfirmPurchase}
                accessibilityRole="button"
                accessibilityLabel="Confirm and buy store credit"
                hitSlop={HIT_SLOP}
                style={({ pressed }) => [
                  styles.proceedButton,
                  styles.confirmButtonGrow,
                  pressed && styles.proceedButtonPressed,
                ]}
              >
                <Text style={styles.proceedButtonText}>Confirm &amp; Buy</Text>
              </Pressable>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

function CreditPackageTile({
  pkg,
  selected,
  onSelect,
}: {
  pkg: CreditPackage;
  selected: boolean;
  onSelect: () => void;
}) {
  const bonus = bonusCents(pkg);
  const accessibilityLabel =
    bonus > 0
      ? `${formatUsd(pkg.priceCents)} package. Get ${formatUsd(
          pkg.creditCents
        )} in store credit, including a ${formatUsd(bonus)} bonus.`
      : `${formatUsd(pkg.priceCents)} package. Get ${formatUsd(
          pkg.creditCents
        )} in store credit.`;

  return (
    <Pressable
      onPress={onSelect}
      accessibilityRole="radio"
      accessibilityState={{ selected, checked: selected }}
      accessibilityLabel={accessibilityLabel}
      style={[styles.tile, selected && styles.tileSelected]}
    >
      <Text style={[styles.tilePrice, selected && styles.tilePriceSelected]}>
        {formatUsd(pkg.priceCents)}
      </Text>
      <Text style={[styles.tileCredit, selected && styles.tileCreditSelected]}>
        Get {formatUsd(pkg.creditCents)} credit
      </Text>
      {bonus > 0 && (
        <Text style={styles.tileBonus}>+{formatUsd(bonus)} bonus</Text>
      )}
    </Pressable>
  );
}

function ConfirmRow({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: "accent" | "success";
}) {
  const valueStyle =
    emphasis === "accent"
      ? styles.confirmRowValueAccent
      : emphasis === "success"
      ? styles.confirmRowValueSuccess
      : styles.confirmRowValue;

  return (
    <View style={styles.confirmRow}>
      <Text style={styles.confirmRowLabel}>{label}</Text>
      <Text style={valueStyle}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  listContent: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(32),
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subtitle: {
    fontSize: 13,
    color: tokens.color.muted,
    marginTop: tokens.space(1),
    marginBottom: tokens.space(5),
  },
  tileRow: {
    gap: tokens.space(3),
    marginBottom: tokens.space(3),
  },
  tile: {
    flex: 1,
    minHeight: 104,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.bg,
    paddingVertical: tokens.space(4),
    paddingHorizontal: tokens.space(3),
    justifyContent: "center",
  },
  tileSelected: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accentBg,
  },
  tilePrice: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
    marginBottom: tokens.space(1),
  },
  tilePriceSelected: {
    color: tokens.color.accent,
  },
  tileCredit: {
    fontSize: 12,
    color: tokens.color.muted,
    fontVariant: ["tabular-nums"],
  },
  tileCreditSelected: {
    color: tokens.color.ink2,
  },
  tileBonus: {
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.success,
    marginTop: tokens.space(1),
    fontVariant: ["tabular-nums"],
  },
  confirmArea: {
    flex: 1,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(4),
  },
  confirmCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    marginTop: tokens.space(2),
  },
  confirmRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: tokens.space(2),
  },
  confirmRowLabel: {
    fontSize: 13,
    color: tokens.color.muted,
  },
  confirmRowValue: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  confirmRowValueAccent: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.accent,
    fontVariant: ["tabular-nums"],
  },
  confirmRowValueSuccess: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.success,
    fontVariant: ["tabular-nums"],
  },
  confirmDivider: {
    height: 1,
    backgroundColor: tokens.color.border,
    marginVertical: tokens.space(2),
  },
  creditBand: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
  },
  creditBandSentence: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
    marginBottom: tokens.space(2),
    fontVariant: ["tabular-nums"],
  },
  proceedButton: {
    backgroundColor: tokens.color.accent,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(3),
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  proceedButtonPressed: {
    opacity: 0.85,
  },
  proceedButtonText: {
    color: tokens.color.onAccent,
    fontSize: 15,
    fontWeight: "700",
  },
  confirmButtonRow: {
    flexDirection: "row",
    gap: tokens.space(3),
  },
  confirmButtonGrow: {
    flex: 1,
  },
  changeButton: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(3),
    paddingHorizontal: tokens.space(4),
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  changeButtonPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  changeButtonText: {
    color: tokens.color.ink2,
    fontSize: 14,
    fontWeight: "600",
  },
});
