import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  AVAILABLE_BALANCE_WON,
  PENDING_CLEARANCE_WON,
  PENDING_CLEARANCE_ARRIVAL,
  MIN_WITHDRAWAL_WON,
  BANK_ACCOUNT,
  PRESET_AMOUNTS,
  ARRIVAL_ESTIMATE,
  PAYOUT_ID,
  PROCESSING_DELAY_MS,
  formatWon,
} from "./data";

type Stage = "form" | "confirm" | "processing" | "done";

export function PayoutScreen() {
  const [balance, setBalance] = useState(AVAILABLE_BALANCE_WON);
  const [amountText, setAmountText] = useState("");
  const [stage, setStage] = useState<Stage>("form");
  const [confirmedAmount, setConfirmedAmount] = useState(0);
  const inputRef = useRef<TextInput>(null);

  const amount = Number(amountText) || 0;
  const editable = stage === "form";

  useEffect(() => {
    if (stage !== "processing") return;
    const t = setTimeout(() => {
      setBalance((b) => b - confirmedAmount);
      setStage("done");
    }, PROCESSING_DELAY_MS);
    return () => clearTimeout(t);
  }, [stage, confirmedAmount]);

  function statusText(): string {
    if (stage === "done") {
      return `Withdrawal requested — arrives in ${ARRIVAL_ESTIMATE}.`;
    }
    if (stage === "processing") {
      return "Processing your withdrawal…";
    }
    if (stage === "confirm") {
      return `Confirm ${formatWon(confirmedAmount)} to ${BANK_ACCOUNT.bankName} ····${BANK_ACCOUNT.accountLast4}? This can't be undone.`;
    }
    if (amount <= 0) {
      return "Enter an amount to withdraw.";
    }
    if (amount < MIN_WITHDRAWAL_WON) {
      return `Minimum withdrawal is ${formatWon(MIN_WITHDRAWAL_WON)}.`;
    }
    if (amount > balance) {
      return `You only have ${formatWon(balance)} available — lower the amount to continue.`;
    }
    return `Ready to withdraw ${formatWon(amount)}.`;
  }

  const ready = amount > 0 && amount >= MIN_WITHDRAWAL_WON && amount <= balance;

  function handleChangeAmount(text: string) {
    const digits = text.replace(/[^0-9]/g, "").slice(0, 9);
    setAmountText(digits);
  }

  function applyPreset(presetAmount: number) {
    if (!editable) return;
    setAmountText(String(presetAmount));
  }

  function handlePrimaryPress() {
    if (stage === "form") {
      if (!ready) {
        inputRef.current?.focus();
        return;
      }
      setConfirmedAmount(amount);
      setStage("confirm");
    }
  }

  function handleConfirm() {
    setStage("processing");
  }

  function handleCancel() {
    setStage("form");
  }

  const isSelectedPreset = (presetAmount: number) =>
    editable && amountText !== "" && amount === presetAmount;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading} accessibilityRole="header">
          Withdraw funds
        </Text>
        <Text style={styles.subheading}>
          Move your available balance to your bank account.
        </Text>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available to withdraw</Text>
          <Text style={styles.balanceAmount}>{formatWon(balance)}</Text>
          <Text style={styles.balancePending}>
            {formatWon(PENDING_CLEARANCE_WON)} pending clearance · available{" "}
            {PENDING_CLEARANCE_ARRIVAL}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle} accessibilityRole="header">
            Amount
          </Text>

          <View style={styles.presetRow}>
            {PRESET_AMOUNTS.map((preset) => {
              const selected = isSelectedPreset(preset.amountWon);
              const label = preset.displayLabel ?? formatWon(preset.amountWon);
              return (
                <Pressable
                  key={preset.id}
                  onPress={() => applyPreset(preset.amountWon)}
                  disabled={!editable}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  accessibilityRole="button"
                  accessibilityLabel={`Set amount to ${label}`}
                  accessibilityState={{ selected, disabled: !editable }}
                  style={({ pressed }) => [
                    styles.chip,
                    selected && styles.chipSelected,
                    pressed && editable && styles.chipPressed,
                    !editable && styles.chipDisabled,
                  ]}
                >
                  <Text
                    style={[styles.chipText, selected && styles.chipTextSelected]}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.fieldLabel}>Or enter a custom amount</Text>
          <View
            style={[
              styles.amountInputRow,
              !editable && styles.amountInputRowDisabled,
            ]}
          >
            <Text style={styles.amountInputPrefix}>₩</Text>
            <TextInput
              ref={inputRef}
              value={amountText}
              onChangeText={handleChangeAmount}
              editable={editable}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={tokens.color.faint}
              accessibilityLabel="Withdrawal amount in Korean won"
              style={styles.amountInput}
            />
          </View>

          <Text style={styles.feeLine}>
            No transfer fee · Estimated arrival {ARRIVAL_ESTIMATE}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle} accessibilityRole="header">
            Withdraw to
          </Text>
          <View style={styles.bankCard}>
            <View style={styles.bankIcon}>
              <Text style={styles.bankIconText}>KB</Text>
            </View>
            <View style={styles.bankInfo}>
              <Text style={styles.bankName}>{BANK_ACCOUNT.bankName}</Text>
              <Text style={styles.bankMeta}>
                Account ····{BANK_ACCOUNT.accountLast4} · {BANK_ACCOUNT.holderName}
              </Text>
              <View style={styles.verifiedRow}>
                <Text style={styles.verifiedCheck}>✓</Text>
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            </View>
          </View>
        </View>

        {stage === "done" && (
          <View style={styles.confirmCard}>
            <Text style={styles.confirmTitle}>Withdrawal on file</Text>
            <Text style={styles.confirmLine}>Payout ID {PAYOUT_ID}</Text>
            <Text style={styles.confirmLine}>
              Amount: {formatWon(confirmedAmount)}
            </Text>
            <Text style={styles.confirmLine}>
              To: {BANK_ACCOUNT.bankName} ····{BANK_ACCOUNT.accountLast4}
            </Text>
            <Text style={styles.confirmHelper}>
              Funds typically arrive within {ARRIVAL_ESTIMATE}. Your available
              balance is now {formatWon(balance)}.
            </Text>
          </View>
        )}

        <View style={styles.bandSpacer} />
      </ScrollView>

      <View style={styles.band} accessibilityLiveRegion="polite">
        <Text
          style={[
            styles.bandStatus,
            (stage === "confirm" || (stage === "form" && ready)) &&
              styles.bandStatusReady,
            stage === "done" && styles.bandStatusReady,
          ]}
          accessibilityRole="alert"
        >
          {statusText()}
        </Text>

        {stage === "form" && (
          <Pressable
            onPress={handlePrimaryPress}
            accessibilityRole="button"
            accessibilityLabel={
              ready
                ? `Withdraw ${formatWon(amount)} to ${BANK_ACCOUNT.bankName} ending ${BANK_ACCOUNT.accountLast4}`
                : "Continue to amount entry"
            }
            style={({ pressed }) => [
              styles.bandButton,
              ready ? styles.bandButtonReady : styles.bandButtonWaiting,
              pressed && styles.bandButtonPressed,
            ]}
          >
            <Text
              style={[
                styles.bandButtonText,
                ready ? styles.bandButtonTextReady : styles.bandButtonTextWaiting,
              ]}
            >
              {ready ? `Withdraw ${formatWon(amount)}` : "Continue"}
            </Text>
          </Pressable>
        )}

        {stage === "confirm" && (
          <View style={styles.bandButtonRow}>
            <Pressable
              onPress={handleCancel}
              accessibilityRole="button"
              accessibilityLabel="Cancel withdrawal"
              style={({ pressed }) => [
                styles.bandButton,
                styles.bandButtonOutline,
                styles.bandButtonFlex,
                pressed && styles.bandButtonPressed,
              ]}
            >
              <Text style={styles.bandButtonTextOutline}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleConfirm}
              accessibilityRole="button"
              accessibilityLabel={`Confirm withdrawal of ${formatWon(confirmedAmount)}`}
              style={({ pressed }) => [
                styles.bandButton,
                styles.bandButtonReady,
                styles.bandButtonFlex,
                pressed && styles.bandButtonPressed,
              ]}
            >
              <Text style={[styles.bandButtonText, styles.bandButtonTextReady]}>
                Confirm withdrawal
              </Text>
            </Pressable>
          </View>
        )}

        {stage === "processing" && (
          <View
            style={[styles.bandButton, styles.bandButtonWaiting]}
            accessibilityRole="button"
            accessibilityState={{ disabled: true, busy: true }}
            accessibilityLabel="Processing withdrawal"
          >
            <Text style={[styles.bandButtonText, styles.bandButtonTextWaiting]}>
              Processing…
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: tokens.color.bg },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(5),
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subheading: {
    fontSize: 14,
    color: tokens.color.muted,
    marginTop: tokens.space(2),
    lineHeight: 20,
  },
  balanceCard: {
    marginTop: tokens.space(5),
    padding: tokens.space(5),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
  },
  balanceLabel: {
    fontSize: 13,
    color: tokens.color.muted,
  },
  balanceAmount: {
    fontSize: 34,
    fontWeight: "800",
    color: tokens.color.ink,
    marginTop: tokens.space(1),
    fontVariant: ["tabular-nums"],
  },
  balancePending: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: tokens.space(2),
    fontVariant: ["tabular-nums"],
  },
  section: {
    marginTop: tokens.space(7),
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(3),
  },
  presetRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: tokens.space(2),
  },
  chip: {
    minHeight: 44,
    paddingHorizontal: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.color.bg,
  },
  chipSelected: {
    borderColor: tokens.color.accent,
    borderWidth: 2,
    paddingHorizontal: tokens.space(4) - 1,
  },
  chipPressed: {
    backgroundColor: tokens.color.border,
  },
  chipDisabled: {
    opacity: 0.55,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink2,
    fontVariant: ["tabular-nums"],
  },
  chipTextSelected: {
    color: tokens.color.accent,
  },
  fieldLabel: {
    fontSize: 13,
    color: tokens.color.muted,
    marginTop: tokens.space(4),
    marginBottom: tokens.space(2),
  },
  amountInputRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 48,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(4),
    gap: tokens.space(2),
  },
  amountInputRowDisabled: {
    opacity: 0.6,
  },
  amountInputPrefix: {
    fontSize: 18,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: tokens.color.ink,
    paddingVertical: tokens.space(2),
    fontVariant: ["tabular-nums"],
  },
  feeLine: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: tokens.space(3),
  },
  bankCard: {
    flexDirection: "row",
    padding: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    gap: tokens.space(4),
  },
  bankIcon: {
    width: 44,
    height: 44,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  bankIconText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.onInk,
  },
  bankInfo: { flex: 1, gap: tokens.space(1) },
  bankName: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  bankMeta: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(1),
    marginTop: tokens.space(1),
  },
  verifiedCheck: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.accent,
  },
  confirmCard: {
    marginTop: tokens.space(7),
    padding: tokens.space(4),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.bg,
    gap: tokens.space(1),
  },
  confirmTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(1),
  },
  confirmLine: {
    fontSize: 13,
    color: tokens.color.ink2,
    fontVariant: ["tabular-nums"],
  },
  confirmHelper: {
    fontSize: 12,
    color: tokens.color.muted,
    marginTop: tokens.space(2),
    lineHeight: 17,
  },
  bandSpacer: { height: tokens.space(10) },
  band: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(5),
    gap: tokens.space(3),
  },
  bandStatus: {
    fontSize: 13,
    color: tokens.color.muted,
  },
  bandStatusReady: {
    color: tokens.color.accent,
    fontWeight: "600",
  },
  bandButtonRow: {
    flexDirection: "row",
    gap: tokens.space(3),
  },
  bandButtonFlex: {
    flex: 1,
  },
  bandButton: {
    minHeight: 48,
    borderRadius: tokens.radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  bandButtonReady: {
    backgroundColor: tokens.color.accent,
  },
  bandButtonWaiting: {
    backgroundColor: tokens.color.ink,
  },
  bandButtonOutline: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  bandButtonPressed: {
    opacity: 0.85,
  },
  bandButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
  bandButtonTextReady: {
    color: tokens.color.onAccent,
  },
  bandButtonTextWaiting: {
    color: tokens.color.onInk,
  },
  bandButtonTextOutline: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
});
