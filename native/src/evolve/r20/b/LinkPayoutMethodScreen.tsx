// native/src/evolve/r20/b/LinkPayoutMethodScreen.tsx — auto-native-r20 candidate b.
//
// Concept: "Link a payout method" — the one-time bank-linking + micro-deposit-verification setup
// a seller completes BEFORE either wallet or payout can do anything. It is the antecedent step to
// both, not a variant of either:
//   - `wallet/WalletLedgerScreen.tsx` is a read-only ledger of past transactions — this screen has
//     no transaction history at all, only a single account being linked.
//   - `payout/PayoutScreen.tsx` withdraws funds that are already available — this screen never
//     touches an available balance; nothing here can be withdrawn, only linked and verified.
// Scope is deliberately narrow per the brief: routing number, account number, one authorization
// checkbox, a submit action, then a fixed pending-verification timeline. No ledger, no withdraw
// action, no card-linking branch (see candidate note, brief-gap #1).
//
// Band-form choice: this screen has a genuine blocking condition (routing number must pass a
// real ABA checksum — not just a length check — account number must fall in a real valid digit
// range, and the authorization checkbox must be checked), so per GENERATION.md §3 this earns the
// "blocked-workflow" fixed-bottom-band doctrine already used by `verification`/`disputes`/
// `authentication`/`condition`/`pickup`. What must NOT be reused is those screens' literal style
// keys and copy, so this file invents its own vocabulary from scratch:
//   - container/states are named `linkStrip` / `linkStripUnresolved` / `linkStripArmed` /
//     `linkStripConfirmed` (never `band`/`bandBlocked`/`bandReady`/`bandDone`)
//   - the reason text is `linkStripUnresolvedReason`, the action cue is
//     `linkStripUnresolvedCue` reading "Opens that field below" (never "Tap to go there")
//   - jumping to the unresolved field scrolls the list to top and focuses the actual
//     `TextInput` (routing/account) or flashes an accent ring on the checkbox row
//     (`highlightField === "authorize"`) — a real, working state machine, not a re-skinned copy.
// Once submitted, the strip becomes a static, non-interactive confirmation
// (`linkStripConfirmed`) and the scroll body swaps the editable form for a locked summary plus
// the real (non-decorative) 4-stop verification timeline from data.ts — this is the "read-only
// result" half of DNA §3's band-form guidance, reached only after the state-machine half resolves.
//
// A11y: exactly one live region. The scroll-strip container carries
// accessibilityLiveRegion="polite"; whichever single headline text is currently rendered inside
// it (the unresolved reason, the armed "Link account" title, or the confirmed title) carries
// accessibilityRole="alert" — that headline is exactly the point where "can this proceed" flips,
// and only one of the three ever renders at a time.
import { useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  ACCOUNT_MAX_LENGTH,
  ACCOUNT_MIN_LENGTH,
  ROUTING_LENGTH,
  VERIFICATION_TIMELINE,
  VERIFICATION_WINDOW_LABEL,
  bankNameForRouting,
  computeLinkStripState,
  isValidAccountNumber,
  isValidRoutingNumber,
  maskAccountNumber,
  type FieldId,
  type TimelineStep,
} from "./data";

const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

function TimelineStepCard({ step }: { step: TimelineStep }) {
  const isDone = step.status === "done";
  const isPending = step.status === "pending";
  const statusText = isDone ? "Complete" : isPending ? "In progress" : "Not started yet";
  return (
    <View
      style={[
        styles.stepCard,
        isDone && styles.stepCardDone,
        isPending && styles.stepCardPending,
      ]}
      accessible
      accessibilityLabel={`${step.dayLabel}. ${step.title}. ${statusText}. ${step.detail}`}
    >
      <View style={styles.stepTopRow}>
        <Text style={styles.stepDayTag}>{step.dayLabel}</Text>
        <View
          style={[
            styles.stepStatusPill,
            isDone && styles.stepStatusPillDone,
            isPending && styles.stepStatusPillPending,
          ]}
        >
          <Text
            style={[
              styles.stepStatusPillText,
              isDone && styles.stepStatusPillTextDone,
            ]}
          >
            {statusText}
          </Text>
        </View>
      </View>
      <Text style={styles.stepTitle}>{step.title}</Text>
      <Text style={styles.stepDetail}>{step.detail}</Text>
    </View>
  );
}

export function LinkPayoutMethodScreen() {
  const [routing, setRouting] = useState("");
  const [account, setAccount] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [highlightField, setHighlightField] = useState<FieldId | null>(null);

  const listRef = useRef<FlatList<TimelineStep>>(null);
  const routingInputRef = useRef<TextInput>(null);
  const accountInputRef = useRef<TextInput>(null);

  const routingValid = isValidRoutingNumber(routing);
  const accountValid = isValidAccountNumber(account);
  const stripState = computeLinkStripState(routingValid, accountValid, authorized, submitted);

  const onChangeRouting = (text: string) => {
    setRouting(text.replace(/[^0-9]/g, "").slice(0, ROUTING_LENGTH));
  };
  const onChangeAccount = (text: string) => {
    setAccount(text.replace(/[^0-9]/g, "").slice(0, ACCOUNT_MAX_LENGTH));
  };
  const toggleAuthorized = () => {
    setAuthorized((prev) => !prev);
    setHighlightField(null);
  };

  const jumpToField = (field: FieldId) => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
    if (field === "routing") {
      setHighlightField(null);
      requestAnimationFrame(() => routingInputRef.current?.focus());
    } else if (field === "account") {
      setHighlightField(null);
      requestAnimationFrame(() => accountInputRef.current?.focus());
    } else {
      setHighlightField("authorize");
    }
  };

  const handleStripPress = () => {
    if (stripState.kind === "unresolved") {
      jumpToField(stripState.field);
    } else if (stripState.kind === "armed") {
      setSubmitted(true);
    }
  };

  const routingHint = routingValid
    ? `Recognized: ${bankNameForRouting(routing)}`
    : routing.length === 0
      ? `${ROUTING_LENGTH} digits, no dashes`
      : `${routing.length} of ${ROUTING_LENGTH} digits`;

  const accountHint =
    account.length === 0
      ? `${ACCOUNT_MIN_LENGTH}–${ACCOUNT_MAX_LENGTH} digits`
      : accountValid
        ? `${account.length} digits — looks right`
        : `${account.length} digits (needs ${ACCOUNT_MIN_LENGTH}–${ACCOUNT_MAX_LENGTH})`;

  const formHeader = (
    <View style={styles.introBlock}>
      <Text style={styles.introKicker}>REPICK PAYOUTS SETUP</Text>
      <Text style={styles.introTitle} accessibilityRole="header">
        Link a payout method
      </Text>
      <Text style={styles.introLede}>
        One bank account, linked once. We confirm it&apos;s yours with two small deposits before
        any payout can be sent to it.
      </Text>
    </View>
  );

  const lockedSummary = (
    <View style={styles.lockedCard}>
      <Text style={styles.lockedCardTitle}>Linked account</Text>
      <View style={styles.lockedRow}>
        <Text style={styles.lockedLabel}>Bank</Text>
        <Text style={styles.lockedValue}>{bankNameForRouting(routing)}</Text>
      </View>
      <View style={styles.lockedRow}>
        <Text style={styles.lockedLabel}>Routing number</Text>
        <Text style={styles.lockedValue}>{routing}</Text>
      </View>
      <View style={[styles.lockedRow, styles.lockedRowLast]}>
        <Text style={styles.lockedLabel}>Account number</Text>
        <Text style={styles.lockedValue}>{maskAccountNumber(account)}</Text>
      </View>
      <Text style={styles.lockedNote}>
        These details are locked while verification is in progress.
      </Text>
    </View>
  );

  const editableForm = (
    <View style={styles.formStack}>
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Routing number</Text>
        <TextInput
          ref={routingInputRef}
          style={[styles.fieldInput, routing.length > 0 && !routingValid && styles.fieldInputError]}
          value={routing}
          onChangeText={onChangeRouting}
          keyboardType="number-pad"
          maxLength={ROUTING_LENGTH}
          placeholder="9 digits"
          placeholderTextColor={tokens.color.faint}
          accessibilityLabel="Routing number"
          accessibilityHint={`Enter a ${ROUTING_LENGTH} digit routing number`}
        />
        <Text style={[styles.fieldHint, routingValid && styles.fieldHintOk]}>{routingHint}</Text>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Account number</Text>
        <TextInput
          ref={accountInputRef}
          style={[styles.fieldInput, account.length > 0 && !accountValid && styles.fieldInputError]}
          value={account}
          onChangeText={onChangeAccount}
          keyboardType="number-pad"
          maxLength={ACCOUNT_MAX_LENGTH}
          placeholder={`${ACCOUNT_MIN_LENGTH}–${ACCOUNT_MAX_LENGTH} digits`}
          placeholderTextColor={tokens.color.faint}
          accessibilityLabel="Account number"
          accessibilityHint={`Enter between ${ACCOUNT_MIN_LENGTH} and ${ACCOUNT_MAX_LENGTH} digits`}
        />
        <Text style={[styles.fieldHint, accountValid && styles.fieldHintOk]}>{accountHint}</Text>
      </View>

      <Pressable
        onPress={toggleAuthorized}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: authorized }}
        accessibilityLabel="Authorize micro-deposit verification"
        accessibilityHint="Required before this account can be linked"
        hitSlop={HIT_SLOP}
        style={({ pressed }) => [
          styles.authRow,
          highlightField === "authorize" && styles.authRowFlagged,
          pressed && styles.authRowPressed,
        ]}
      >
        <View style={[styles.authBox, authorized && styles.authBoxChecked]}>
          {authorized ? <Text style={styles.authBoxGlyph}>✓</Text> : null}
        </View>
        <View style={styles.authTextCol}>
          <Text style={styles.authTextTitle}>Authorize micro-deposit verification</Text>
          <Text style={styles.authTextBody}>
            I authorize repick to send two small deposits to confirm I own this account, and to
            debit the same amount back once confirmed.
          </Text>
        </View>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.screenRoot}>
      <FlatList<TimelineStep>
        ref={listRef}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={submitted ? (VERIFICATION_TIMELINE as TimelineStep[]) : []}
        keyExtractor={(step) => step.id}
        renderItem={({ item }) => <TimelineStepCard step={item} />}
        ListHeaderComponent={
          <View>
            {formHeader}
            {submitted ? lockedSummary : editableForm}
            {submitted ? (
              <View style={styles.timelineHeadRow}>
                <Text style={styles.timelineHeading} accessibilityRole="header">
                  Verification timeline
                </Text>
                <Text style={styles.timelineWindow}>{VERIFICATION_WINDOW_LABEL}</Text>
              </View>
            ) : null}
          </View>
        }
        ListFooterComponent={
          !submitted ? (
            <Text style={styles.footerNote}>
              You can link one payout method at a time. Adding a debit card instead isn&apos;t
              part of this step.
            </Text>
          ) : (
            <Text style={styles.footerNote}>
              Nothing else is needed from you until day 2 — come back then to confirm the two
              amounts.
            </Text>
          )
        }
      />

      <View style={styles.linkStrip} accessibilityLiveRegion="polite">
        {stripState.kind === "unresolved" ? (
          <Pressable
            onPress={handleStripPress}
            accessibilityRole="button"
            accessibilityLabel={`${stripState.reason}. Opens that field below.`}
            style={({ pressed }) => [styles.linkStripUnresolved, pressed && styles.linkStripPressed]}
          >
            <Text style={styles.linkStripUnresolvedReason} accessibilityRole="alert">
              {stripState.reason}
            </Text>
            <Text style={styles.linkStripUnresolvedCue}>Opens that field below</Text>
          </Pressable>
        ) : stripState.kind === "armed" ? (
          <Pressable
            onPress={handleStripPress}
            accessibilityRole="button"
            accessibilityLabel="Link account and start verification"
            style={({ pressed }) => [styles.linkStripArmed, pressed && styles.linkStripPressed]}
          >
            <Text style={styles.linkStripArmedTitle} accessibilityRole="alert">
              Link account
            </Text>
            <Text style={styles.linkStripArmedMeta}>Starts micro-deposit verification</Text>
          </Pressable>
        ) : (
          <View style={styles.linkStripConfirmed}>
            <Text style={styles.linkStripConfirmedTitle} accessibilityRole="alert">
              Verification started
            </Text>
            <Text style={styles.linkStripConfirmedMeta}>
              Deposits typically arrive within {VERIFICATION_WINDOW_LABEL}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

export default LinkPayoutMethodScreen;

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: tokens.space(5),
    paddingBottom: tokens.space(6),
  },

  introBlock: {
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(2),
  },
  introKicker: {
    fontSize: 11,
    letterSpacing: 1.6,
    fontWeight: "700",
    color: tokens.color.faint,
  },
  introTitle: {
    marginTop: tokens.space(2),
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.4,
    color: tokens.color.ink,
  },
  introLede: {
    marginTop: tokens.space(1),
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
  },

  formStack: {
    marginTop: tokens.space(4),
    gap: tokens.space(5),
  },
  fieldGroup: {
    gap: tokens.space(1),
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  fieldInput: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(3),
    fontSize: 16,
    fontWeight: "600",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  fieldInputError: {
    borderColor: tokens.color.ink2,
  },
  fieldHint: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  fieldHintOk: {
    color: tokens.color.accent,
    fontWeight: "600",
  },

  authRow: {
    flexDirection: "row",
    gap: tokens.space(3),
    borderWidth: 1.5,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    minHeight: 44,
  },
  authRowFlagged: {
    borderColor: tokens.color.accent,
  },
  authRowPressed: {
    opacity: 0.8,
  },
  authBox: {
    width: 22,
    height: 22,
    marginTop: 2,
    borderRadius: tokens.radius.sm,
    borderWidth: 1.5,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  authBoxChecked: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  authBoxGlyph: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  authTextCol: {
    flex: 1,
    gap: 2,
  },
  authTextTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  authTextBody: {
    fontSize: 12,
    lineHeight: 17,
    color: tokens.color.muted,
  },

  lockedCard: {
    marginTop: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
  },
  lockedCardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.faint,
    marginBottom: tokens.space(1),
  },
  lockedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: tokens.space(3),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    gap: tokens.space(3),
  },
  lockedRowLast: {
    borderBottomWidth: 0,
  },
  lockedLabel: {
    fontSize: 13,
    color: tokens.color.faint,
  },
  lockedValue: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  lockedNote: {
    marginTop: tokens.space(1),
    marginBottom: tokens.space(3),
    fontSize: 11,
    lineHeight: 16,
    color: tokens.color.faint,
  },

  timelineHeadRow: {
    marginTop: tokens.space(6),
    marginBottom: tokens.space(1),
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  timelineHeading: {
    fontSize: 18,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  timelineWindow: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.accent,
  },

  stepCard: {
    marginTop: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderLeftWidth: 3,
    borderLeftColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    gap: 3,
  },
  stepCardDone: {
    borderLeftColor: tokens.color.accent,
  },
  stepCardPending: {
    borderLeftColor: tokens.color.ink2,
  },
  stepTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepDayTag: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
    color: tokens.color.faint,
  },
  stepStatusPill: {
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    paddingHorizontal: tokens.space(2),
    paddingVertical: 2,
  },
  stepStatusPillDone: {
    backgroundColor: tokens.color.accent,
    borderColor: tokens.color.accent,
  },
  stepStatusPillPending: {
    borderColor: tokens.color.ink2,
  },
  stepStatusPillText: {
    fontSize: 10,
    fontWeight: "700",
    color: tokens.color.muted,
  },
  stepStatusPillTextDone: {
    color: tokens.color.onAccent,
  },
  stepTitle: {
    marginTop: 2,
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  stepDetail: {
    fontSize: 12,
    lineHeight: 17,
    color: tokens.color.muted,
  },

  footerNote: {
    marginTop: tokens.space(4),
    fontSize: 12,
    lineHeight: 18,
    color: tokens.color.faint,
  },

  // Fixed bottom band — original vocabulary for this screen only (see header comment).
  linkStrip: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(3),
  },
  linkStripPressed: {
    opacity: 0.85,
  },
  linkStripUnresolved: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    borderWidth: 1.5,
    borderColor: tokens.color.ink2,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 2,
  },
  linkStripUnresolvedReason: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  linkStripUnresolvedCue: {
    fontSize: 12,
    color: tokens.color.muted,
  },
  linkStripArmed: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 2,
  },
  linkStripArmedTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  linkStripArmedMeta: {
    fontSize: 12,
    color: tokens.color.onAccent,
  },
  linkStripConfirmed: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    borderWidth: 1.5,
    borderColor: tokens.color.accent,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 2,
  },
  linkStripConfirmedTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  linkStripConfirmedMeta: {
    fontSize: 12,
    color: tokens.color.muted,
  },
});
