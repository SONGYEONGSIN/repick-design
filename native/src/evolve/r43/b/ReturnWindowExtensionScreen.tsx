// native/src/evolve/r43/b/ReturnWindowExtensionScreen.tsx — auto-native-r43 candidate b.
//
// Return Window Extension Request: a buyer who bought something and hasn't
// tried it on yet (traveling, gift held for later, etc.) asks for a few more
// days before their return-eligibility deadline closes. This is NOT the
// drop-off/label/inspection family already in the catalog (return-dropoff,
// return-shipping-label, return-inspection-decision) — those happen *after*
// a return is already approved and in motion. This screen is about the
// eligibility deadline itself, before any return has been opened.
//
// Macro layout is a single-focus detail/form page, not a roster: one
// dominant countdown-to-deadline card (large remaining-time readout + the
// actual deadline date) sits above a short reason form. There is no
// FlatList here — nothing on this screen is a scrollable collection of
// records, so a plain ScrollView is the honest container (the few
// extension-length options are a 4-item chip row, not a list to virtualize).
//
// Bottom band reuses this project's proven blocked/ready/done state-machine
// shape (GENERATION.md §3), but — per this round's brief — the block
// condition is driven by a date threshold, not just field validity, and it
// has two genuinely different blocked sentences:
//   1. "closed"     — the ORIGINAL deadline has already passed. Terminal:
//                      no amount of filling the form fixes this.
//   2. "incomplete" — deadline hasn't passed, but the reason field is still
//                      under the minimum length.
// Style keys for the band are freshly named (deadlineDock*) — not the
// bandBlocked/bandReady/bandDone* names used verbatim elsewhere in this
// catalog (e.g. disputes/DisputeCenterScreen.tsx) — per GENERATION.md's
// "form choice can be right but code-surface copying still loses" rule.
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  addDays,
  computeRemaining,
  DEFAULT_EXTENSION_DAYS,
  EXTENSION_OPTIONS,
  formatDateLabel,
  formatTimeLabel,
  MIN_REASON_LENGTH,
  NOW_TS,
  ORDER,
  ORIGINAL_DEADLINE_TS,
  RETURN_WINDOW_DAYS,
  type ExtensionDays,
} from "./data";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
const TRANSITION_ANNOUNCE_MS = 3000;

type Phase = "closed" | "incomplete" | "primed" | "granted";

export function ReturnWindowExtensionScreen() {
  const [reason, setReason] = useState("");
  const [extensionDays, setExtensionDays] = useState<ExtensionDays>(DEFAULT_EXTENSION_DAYS);
  const [submitted, setSubmitted] = useState(false);
  const [grantedDays, setGrantedDays] = useState<ExtensionDays | null>(null);

  const scrollRef = useRef<ScrollView>(null);
  const reasonInputRef = useRef<TextInput>(null);
  const [reasonFieldY, setReasonFieldY] = useState(0);

  const remaining = useMemo(() => computeRemaining(NOW_TS, ORIGINAL_DEADLINE_TS), []);
  const reasonTrimmed = reason.trim();
  const reasonValid = reasonTrimmed.length >= MIN_REASON_LENGTH;
  const reasonCharsLeft = Math.max(0, MIN_REASON_LENGTH - reasonTrimmed.length);

  const previewDeadlineTs = addDays(ORIGINAL_DEADLINE_TS, extensionDays);
  const grantedDeadlineTs =
    grantedDays !== null ? addDays(ORIGINAL_DEADLINE_TS, grantedDays) : previewDeadlineTs;

  const phase: Phase = useMemo(() => {
    if (submitted) return "granted";
    if (remaining.passed) return "closed";
    if (!reasonValid) return "incomplete";
    return "primed";
  }, [submitted, remaining.passed, reasonValid]);

  // Announce only the MOMENT a transition happens, not every render and not
  // on first mount — accessibilityRole="alert" is applied conditionally via
  // `justChanged`, which this effect flips on for a few seconds and then
  // clears (with a cleanup on unmount so no stray timer fires after this
  // screen is gone).
  const [justChanged, setJustChanged] = useState(false);
  const prevPhaseRef = useRef<Phase | null>(null);
  const announceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (prevPhaseRef.current === null) {
      prevPhaseRef.current = phase;
      return;
    }
    if (prevPhaseRef.current !== phase) {
      prevPhaseRef.current = phase;
      setJustChanged(true);
      if (announceTimerRef.current) clearTimeout(announceTimerRef.current);
      announceTimerRef.current = setTimeout(() => {
        setJustChanged(false);
      }, TRANSITION_ANNOUNCE_MS);
    }
  }, [phase]);

  useEffect(() => {
    return () => {
      if (announceTimerRef.current) clearTimeout(announceTimerRef.current);
    };
  }, []);

  const jumpToReason = () => {
    scrollRef.current?.scrollTo({ y: Math.max(reasonFieldY - 24, 0), animated: true });
    reasonInputRef.current?.focus();
  };

  const jumpToCountdown = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleSubmit = () => {
    if (phase !== "primed") return;
    setGrantedDays(extensionDays);
    setSubmitted(true);
  };

  const handleDockPress = () => {
    if (phase === "closed") {
      jumpToCountdown();
    } else if (phase === "incomplete") {
      jumpToReason();
    } else if (phase === "primed") {
      handleSubmit();
    }
  };

  const remainingTierStyle =
    remaining.passed || remaining.days < 1
      ? styles.countdownChipDanger
      : remaining.days < 4
        ? styles.countdownChipWarning
        : styles.countdownChipSuccess;
  const remainingTierText =
    remaining.passed || remaining.days < 1
      ? styles.countdownChipTextDanger
      : remaining.days < 4
        ? styles.countdownChipTextWarning
        : styles.countdownChipTextSuccess;
  const remainingTierLabel = remaining.passed
    ? "Window closed"
    : remaining.days < 1
      ? "Last day"
      : remaining.days < 4
        ? "Closing soon"
        : "Within window";

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.kicker}>RETURN ELIGIBILITY</Text>
        <Text style={styles.title} accessibilityRole="header">
          Request more time
        </Text>
        <Text style={styles.lede}>
          Ask for extra days on {ORDER.itemTitle} ({ORDER.id}) before its return
          window closes.
        </Text>

        <View style={styles.countdownCard}>
          <Text style={styles.countdownKicker}>
            {ORDER.itemTitle} · {ORDER.price}
          </Text>
          <Text
            style={styles.countdownReadout}
            accessibilityLabel={
              remaining.passed
                ? "Return window already closed"
                : `${remaining.days} days, ${remaining.hours} hours remaining`
            }
          >
            {remaining.passed
              ? "0d 0h"
              : `${remaining.days}d ${remaining.hours}h`}
          </Text>
          <Text style={styles.countdownSub}>
            {remaining.passed ? "left before this deadline passed" : "left to request more time"}
          </Text>

          <View style={styles.countdownDivider} />

          <View style={styles.countdownDeadlineRow}>
            <View>
              <Text style={styles.countdownDeadlineLabel}>Current deadline</Text>
              <Text style={styles.countdownDeadlineValue}>
                {formatDateLabel(ORIGINAL_DEADLINE_TS)}
              </Text>
              <Text style={styles.countdownDeadlineTime}>
                at {formatTimeLabel(ORIGINAL_DEADLINE_TS)}
              </Text>
            </View>
            <View style={[styles.countdownChip, remainingTierStyle]}>
              <Text style={[styles.countdownChipText, remainingTierText]}>
                {remainingTierLabel}
              </Text>
            </View>
          </View>

          <Text style={styles.countdownFootnote}>
            {RETURN_WINDOW_DAYS}-day return window from delivery on{" "}
            {formatDateLabel(ORDER.purchasedTs)}
          </Text>
        </View>

        <View style={styles.formSection}>
          <View
            onLayout={(e) => setReasonFieldY(e.nativeEvent.layout.y)}
            style={[styles.field, phase === "incomplete" && styles.fieldHighlighted]}
          >
            <Text style={styles.fieldLabel}>Why do you need more time?</Text>
            <TextInput
              ref={reasonInputRef}
              value={reason}
              onChangeText={setReason}
              editable={!submitted && !remaining.passed}
              placeholder="e.g. I'm traveling until next week and haven't been able to try it on"
              placeholderTextColor={tokens.color.faint}
              multiline
              numberOfLines={4}
              maxLength={280}
              accessibilityLabel="Why you need more time"
              accessibilityHint={`Minimum ${MIN_REASON_LENGTH} characters`}
              style={styles.textInput}
            />
            <Text style={styles.charCount}>
              {reasonValid
                ? `${reasonTrimmed.length} characters`
                : `${reasonCharsLeft} more character${reasonCharsLeft === 1 ? "" : "s"} needed`}
            </Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>How many extra days?</Text>
            <View
              style={styles.chipGroup}
              accessibilityRole="radiogroup"
              accessibilityLabel="How many extra days"
            >
              {EXTENSION_OPTIONS.map((option) => {
                const selected = extensionDays === option;
                return (
                  <Pressable
                    key={option}
                    onPress={() => setExtensionDays(option)}
                    disabled={submitted || remaining.passed}
                    accessibilityRole="radio"
                    accessibilityState={{ selected, checked: selected, disabled: submitted || remaining.passed }}
                    accessibilityLabel={`${option} extra days`}
                    hitSlop={HIT_SLOP}
                    style={({ pressed }) => [
                      styles.chip,
                      selected && styles.chipOn,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text style={[styles.chipText, selected && styles.chipTextOn]}>
                      +{option} days
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <Text style={styles.previewNote}>
              New deadline would be {formatDateLabel(previewDeadlineTs)}
            </Text>
          </View>

          <Text style={styles.footerNote}>
            Extensions aren&apos;t automatic — Repick reviews each request
            against the seller&apos;s return policy and replies by email.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.deadlineDock} accessibilityLiveRegion="polite">
        {phase === "granted" ? (
          <View style={styles.deadlineDockGranted}>
            <Text
              style={styles.deadlineDockGrantedTitle}
              accessibilityRole={justChanged ? "alert" : undefined}
            >
              Extension requested — new deadline {formatDateLabel(grantedDeadlineTs)}
            </Text>
            <Text style={styles.deadlineDockGrantedHint}>
              We&apos;ll confirm by email before {formatDateLabel(ORIGINAL_DEADLINE_TS)}.
            </Text>
          </View>
        ) : phase === "closed" ? (
          <Pressable
            onPress={handleDockPress}
            accessibilityRole="button"
            accessibilityLabel={`This return window closed on ${formatDateLabel(ORIGINAL_DEADLINE_TS)}. Extensions can only be requested before the deadline. Tap to review.`}
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [
              styles.deadlineDockClosed,
              pressed && styles.deadlineDockPressed,
            ]}
          >
            <Text
              style={styles.deadlineDockClosedTitle}
              accessibilityRole={justChanged ? "alert" : undefined}
            >
              This window closed on {formatDateLabel(ORIGINAL_DEADLINE_TS)}
            </Text>
            <Text style={styles.deadlineDockClosedHint}>
              Extensions must be requested before the deadline — tap to review
            </Text>
          </Pressable>
        ) : phase === "incomplete" ? (
          <Pressable
            onPress={handleDockPress}
            accessibilityRole="button"
            accessibilityLabel={`Add ${reasonCharsLeft} more character${reasonCharsLeft === 1 ? "" : "s"} to your reason before you can request more time. Tap to jump to the reason field.`}
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [
              styles.deadlineDockIncomplete,
              pressed && styles.deadlineDockPressed,
            ]}
          >
            <Text
              style={styles.deadlineDockIncompleteTitle}
              accessibilityRole={justChanged ? "alert" : undefined}
            >
              Add a reason before you can request more time
            </Text>
            <Text style={styles.deadlineDockIncompleteHint}>
              {reasonCharsLeft} more character{reasonCharsLeft === 1 ? "" : "s"} needed · tap to
              jump there
            </Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={handleDockPress}
            accessibilityRole="button"
            accessibilityLabel={`Request ${extensionDays} extra days. New deadline would be ${formatDateLabel(previewDeadlineTs)}.`}
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [
              styles.deadlineDockPrimed,
              pressed && styles.deadlineDockPressed,
            ]}
          >
            <Text
              style={styles.deadlineDockPrimedTitle}
              accessibilityRole={justChanged ? "alert" : undefined}
            >
              Request {extensionDays} extra days
            </Text>
            <Text style={styles.deadlineDockPrimedHint}>
              New deadline: {formatDateLabel(previewDeadlineTs)}
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

export default ReturnWindowExtensionScreen;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: tokens.color.bg },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(8),
  },

  kicker: {
    fontSize: 11,
    letterSpacing: 1.6,
    fontWeight: "700",
    color: tokens.color.faint,
  },
  title: {
    marginTop: tokens.space(2),
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.4,
    color: tokens.color.ink,
  },
  lede: {
    marginTop: tokens.space(2),
    fontSize: 14,
    lineHeight: 20,
    color: tokens.color.muted,
  },

  countdownCard: {
    marginTop: tokens.space(5),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(5),
    gap: tokens.space(1),
    backgroundColor: tokens.color.bg,
  },
  countdownKicker: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.muted,
  },
  countdownReadout: {
    marginTop: tokens.space(2),
    fontSize: 52,
    fontWeight: "800",
    letterSpacing: -1,
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  countdownSub: {
    fontSize: 13,
    color: tokens.color.muted,
  },
  countdownDivider: {
    height: 1,
    backgroundColor: tokens.color.border,
    marginVertical: tokens.space(4),
  },
  countdownDeadlineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  countdownDeadlineLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.faint,
  },
  countdownDeadlineValue: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  countdownDeadlineTime: {
    fontSize: 12,
    color: tokens.color.muted,
  },
  countdownChip: {
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(1) + 2,
    borderWidth: 1,
  },
  countdownChipSuccess: {
    backgroundColor: tokens.color.successBg,
    borderColor: tokens.color.successBorder,
  },
  countdownChipWarning: {
    backgroundColor: tokens.color.warningBg,
    borderColor: tokens.color.warningBorder,
  },
  countdownChipDanger: {
    backgroundColor: tokens.color.dangerBg,
    borderColor: tokens.color.dangerBorder,
  },
  countdownChipText: {
    fontSize: 12,
    fontWeight: "700",
  },
  countdownChipTextSuccess: { color: tokens.color.success },
  countdownChipTextWarning: { color: tokens.color.warning },
  countdownChipTextDanger: { color: tokens.color.danger },
  countdownFootnote: {
    marginTop: tokens.space(4),
    fontSize: 12,
    color: tokens.color.faint,
  },

  formSection: {
    marginTop: tokens.space(6),
    gap: tokens.space(5),
  },
  field: {
    gap: tokens.space(2),
    borderRadius: tokens.radius.md,
    padding: tokens.space(1),
  },
  fieldHighlighted: {
    borderWidth: 1.5,
    borderColor: tokens.color.accent,
    padding: tokens.space(1) - 0.5,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  textInput: {
    minHeight: 92,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    fontSize: 14,
    lineHeight: 20,
    color: tokens.color.ink,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: 11,
    color: tokens.color.faint,
  },

  chipGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: tokens.space(2),
  },
  chip: {
    minHeight: 44,
    minWidth: 44,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    paddingHorizontal: tokens.space(3),
    alignItems: "center",
    justifyContent: "center",
  },
  chipOn: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  chipTextOn: { color: tokens.color.onAccent },
  pressed: { opacity: 0.8 },

  previewNote: {
    fontSize: 12,
    color: tokens.color.muted,
  },

  footerNote: {
    fontSize: 12,
    lineHeight: 18,
    color: tokens.color.faint,
  },

  deadlineDock: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(3),
  },
  deadlineDockPressed: { opacity: 0.85 },

  deadlineDockClosed: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    borderWidth: 1.5,
    borderColor: tokens.color.danger,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 2,
  },
  deadlineDockClosedTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.danger,
  },
  deadlineDockClosedHint: {
    fontSize: 12,
    color: tokens.color.muted,
  },

  deadlineDockIncomplete: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    borderWidth: 1.5,
    borderColor: tokens.color.ink2,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 2,
  },
  deadlineDockIncompleteTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  deadlineDockIncompleteHint: {
    fontSize: 12,
    color: tokens.color.muted,
  },

  deadlineDockPrimed: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 2,
  },
  deadlineDockPrimedTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  deadlineDockPrimedHint: {
    fontSize: 12,
    color: tokens.color.onAccent,
  },

  deadlineDockGranted: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    borderWidth: 1.5,
    borderColor: tokens.color.accent,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 2,
  },
  deadlineDockGrantedTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  deadlineDockGrantedHint: {
    fontSize: 12,
    color: tokens.color.muted,
  },
});
