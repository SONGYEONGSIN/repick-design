// native/src/offer-thread/OfferThread.tsx — auto-native-r1 candidate b.
// Buyer↔seller negotiation thread: a time-ordered stream (messages · structured offer cards ·
// system events) under a pinned live-offer strip, over a persistent action bar.
// The proof this screen exists to give — what is on the table and what lands in the account —
// is a static default: it is on screen before any interaction, and interaction only sharpens it
// (a counter re-computes the payout in place and adds the delta against the offer it answers).
import { useRef, useState } from "react";
import { View, Text, Pressable, FlatList, SafeAreaView, StyleSheet } from "react-native";
import {
  COUNTER,
  FEE_PCT_LABEL,
  LISTING,
  PRESETS,
  STANDING,
  boundHint,
  clampCounter,
  feeFor,
  formatKRW,
  partyLabel,
  payoutFor,
  pinnedState,
  signedKRW,
  statusLabel,
  threadFor,
  type EventEntry,
  type MessageEntry,
  type OfferEntry,
  type Outcome,
  type ThreadEntry,
} from "./data";
import { tokens } from "../tokens";

// Every commitment is two-tap — choose, then confirm — and lands in a settled state that the
// thread and the pinned strip both show. One value carries the whole machine.
type Mode =
  | { k: "review" }
  | { k: "counter" }
  | { k: "confirm"; intent: "accept" | "decline" | "counter" }
  | { k: "settled"; outcome: Outcome };

/* ───────── thread entries ───────── */

function DaySeparator({ label }: { label: string }) {
  return (
    <View style={styles.dayRow} accessible accessibilityLabel={label}>
      <View style={styles.dayLine} />
      <Text style={styles.dayLabel}>{label}</Text>
      <View style={styles.dayLine} />
    </View>
  );
}

function MessageBubble({ entry }: { entry: MessageEntry }) {
  const mine = entry.from === "seller";
  return (
    <View style={[styles.entryRow, mine ? styles.alignEnd : styles.alignStart]}>
      <Text style={[styles.byline, mine ? styles.textRight : styles.textLeft]}>
        {partyLabel(entry.from)} · {entry.at}
      </Text>
      <View
        style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}
        accessible
        accessibilityLabel={`${partyLabel(entry.from)}, ${entry.at}. ${entry.text}`}
      >
        <Text style={[styles.bubbleText, mine ? styles.bubbleTextMine : styles.bubbleTextTheirs]}>
          {entry.text}
        </Text>
      </View>
    </View>
  );
}

// A structured offer sitting inside the conversation. The round that is still valid keeps the
// single accent; superseded rounds are struck through and labelled, so state never rides on color.
function OfferCard({ entry }: { entry: OfferEntry }) {
  const mine = entry.from === "seller";
  const live = entry.status === "live";
  return (
    <View style={[styles.entryRow, mine ? styles.alignEnd : styles.alignStart]}>
      <Text style={[styles.byline, mine ? styles.textRight : styles.textLeft]}>
        {partyLabel(entry.from)} · {entry.at}
      </Text>
      <View
        style={[styles.offerCard, live ? styles.offerCardLive : styles.offerCardPast]}
        accessible
        accessibilityLabel={`Offer number ${entry.round} from ${partyLabel(entry.from)}, ${formatKRW(entry.amount)}, ${statusLabel(entry.status)}. ${entry.note}`}
      >
        <View style={styles.offerHead}>
          <Text style={styles.offerRound}>Offer #{entry.round}</Text>
          <View style={[styles.pill, live ? styles.pillAccent : styles.pillQuiet]}>
            <Text style={[styles.pillText, live ? styles.pillTextOn : styles.pillTextQuiet]}>
              {statusLabel(entry.status)}
            </Text>
          </View>
        </View>
        <Text style={[styles.offerAmount, live ? styles.offerAmountLive : styles.offerAmountPast]}>
          {formatKRW(entry.amount)}
        </Text>
        <Text style={styles.offerNote}>{entry.note}</Text>
      </View>
    </View>
  );
}

function EventLine({ entry }: { entry: EventEntry }) {
  return (
    <View style={styles.eventRow} accessible accessibilityLabel={`${entry.text}, ${entry.at}`}>
      <View style={styles.eventDot} />
      <Text style={styles.eventText}>
        {entry.text} · {entry.at}
      </Text>
    </View>
  );
}

function ThreadEntryView({ entry }: { entry: ThreadEntry }) {
  if (entry.kind === "day") return <DaySeparator label={entry.label} />;
  if (entry.kind === "message") return <MessageBubble entry={entry} />;
  if (entry.kind === "offer") return <OfferCard entry={entry} />;
  return <EventLine entry={entry} />;
}

/* ───────── action bar pieces ───────── */

// Mounted in every mode. `amount` is whatever is being decided right now, so stepping a counter
// moves these numbers in place instead of hiding them behind a sheet.
function PayoutSummary({
  headline,
  refLabel,
  amount,
  compareTo,
}: {
  headline: string;
  refLabel: string;
  amount: number;
  compareTo: number | null;
}) {
  const fee = feeFor(amount);
  const payout = payoutFor(amount);
  const delta = compareTo === null ? null : payout - payoutFor(compareTo);
  return (
    <View
      style={styles.summary}
      accessible
      accessibilityLiveRegion="polite"
      accessibilityLabel={`${headline}: you receive ${formatKRW(payout)}. Offer ${formatKRW(amount)}, platform fee ${FEE_PCT_LABEL} ${formatKRW(fee)}.${
        delta === null ? "" : ` ${signedKRW(delta)} against offer number ${STANDING.round}.`
      }`}
    >
      <View style={styles.summaryHead}>
        <Text style={styles.summaryLabel}>{headline}</Text>
        <Text style={styles.summaryRef}>{refLabel}</Text>
      </View>
      <Text style={styles.payout}>{formatKRW(payout)}</Text>
      <Text style={styles.payoutCaption}>lands in your account</Text>
      <View style={styles.breakRow}>
        <Text style={styles.breakLabel}>Offer on the table</Text>
        <Text style={styles.breakValue}>{formatKRW(amount)}</Text>
      </View>
      <View style={styles.breakRow}>
        <Text style={styles.breakLabel}>Platform fee {FEE_PCT_LABEL}</Text>
        <Text style={styles.breakValue}>−{formatKRW(fee)}</Text>
      </View>
      {delta !== null && (
        <Text style={styles.deltaText}>
          {signedKRW(delta)} against offer #{STANDING.round} ({formatKRW(payoutFor(STANDING.amount))})
        </Text>
      )}
    </View>
  );
}

function StepButton({
  glyph,
  label,
  disabled,
  onPress,
}: {
  glyph: string;
  label: string;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
      style={({ pressed }) => [styles.step, disabled && styles.stepDisabled, pressed && !disabled && styles.pressed]}
    >
      <Text style={styles.stepGlyph}>{glyph}</Text>
    </Pressable>
  );
}

// Two lines: the amount, and what that amount means next to the offer already on the table.
function PresetChip({
  amount,
  tag,
  selected,
  onPress,
}: {
  amount: number;
  tag: string | null;
  selected: boolean;
  onPress: () => void;
}) {
  const over = amount - STANDING.amount;
  const caption = tag === null ? `${signedKRW(over)} over` : tag;
  const spoken =
    tag === null
      ? `Set the counter to ${formatKRW(amount)}, ${signedKRW(over)} over offer number ${STANDING.round}`
      : `Set the counter to ${formatKRW(amount)}, your asking price`;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={spoken}
      style={({ pressed }) => [styles.chip, selected && styles.chipSelected, pressed && styles.pressed]}
    >
      <Text style={[styles.chipAmount, selected && styles.chipAmountSelected]} numberOfLines={1}>
        {formatKRW(amount)}
      </Text>
      <Text style={styles.chipCaption} numberOfLines={1}>
        {caption}
      </Text>
    </Pressable>
  );
}

function CounterComposer({ amount, onChange }: { amount: number; onChange: (next: number) => void }) {
  const atMin = amount <= COUNTER.min;
  const atMax = amount >= COUNTER.max;
  return (
    <View style={styles.composer}>
      <View style={styles.composerHead}>
        <Text style={styles.composerLabel}>Your counter</Text>
        <Text style={styles.composerStep}>Steps of {formatKRW(COUNTER.step)}</Text>
      </View>
      <View style={styles.stepRow}>
        <StepButton
          glyph="−"
          label={`Lower the counter by ${formatKRW(COUNTER.step)}`}
          disabled={atMin}
          onPress={() => onChange(clampCounter(amount - COUNTER.step))}
        />
        <Text style={styles.counterAmount} accessibilityLabel={`Counter amount ${formatKRW(amount)}`}>
          {formatKRW(amount)}
        </Text>
        <StepButton
          glyph="+"
          label={`Raise the counter by ${formatKRW(COUNTER.step)}`}
          disabled={atMax}
          onPress={() => onChange(clampCounter(amount + COUNTER.step))}
        />
      </View>
      <View style={styles.chipRow}>
        <PresetChip
          amount={PRESETS[0].amount}
          tag={PRESETS[0].tag}
          selected={amount === PRESETS[0].amount}
          onPress={() => onChange(clampCounter(PRESETS[0].amount))}
        />
        <PresetChip
          amount={PRESETS[1].amount}
          tag={PRESETS[1].tag}
          selected={amount === PRESETS[1].amount}
          onPress={() => onChange(clampCounter(PRESETS[1].amount))}
        />
        <PresetChip
          amount={PRESETS[2].amount}
          tag={PRESETS[2].tag}
          selected={amount === PRESETS[2].amount}
          onPress={() => onChange(clampCounter(PRESETS[2].amount))}
        />
      </View>
      <Text style={styles.hint} numberOfLines={2}>
        {boundHint(amount)}
      </Text>
    </View>
  );
}

function ActionButton({
  label,
  kind,
  wide,
  onPress,
}: {
  label: string;
  kind: "primary" | "strong" | "ghost";
  wide?: boolean;
  onPress: () => void;
}) {
  const fill = kind === "primary" ? styles.btnPrimary : kind === "strong" ? styles.btnStrong : styles.btnGhost;
  const text = kind === "ghost" ? styles.btnLabelGhost : styles.btnLabelOn;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.btn, fill, wide && styles.btnWide, pressed && styles.pressed]}
    >
      <Text style={[styles.btnLabel, text]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

/* ───────── screen ───────── */

export function OfferThread() {
  const [mode, setMode] = useState<Mode>({ k: "review" });
  const [counter, setCounter] = useState(COUNTER.initial);
  const listRef = useRef<FlatList<ThreadEntry> | null>(null);

  // A negotiation is read from its newest state, not from its history: anchor on mount, and again
  // whenever an action adds an entry. Nothing else changes the content size, so this never fights
  // a reader who has scrolled back.
  const anchorToLatest = () => {
    listRef.current?.scrollToEnd({ animated: false });
  };

  const settled = mode.k === "settled" ? mode.outcome : null;
  const deciding = mode.k === "confirm" ? mode.intent : null;
  const composing = mode.k === "counter" || deciding === "counter" || settled === "countered";

  const headline = composing
    ? settled === "countered"
      ? "Waiting on the buyer"
      : "If they take your counter"
    : settled === "accepted"
      ? "Accepted · payout scheduled"
      : settled === "declined" || deciding === "decline"
        ? "What you turned down"
        : "If you accept";

  const refLabel = composing
    ? `Round ${STANDING.round + 1} · your counter`
    : settled === "accepted"
      ? `Offer #${STANDING.round} · accepted just now`
      : settled === "declined"
        ? `Offer #${STANDING.round} · declined just now`
        : `Offer #${STANDING.round} · ${STANDING.at}`;

  const note =
    deciding === "accept"
      ? `Accepting locks offer #${STANDING.round} at ${formatKRW(STANDING.amount)}. Payout is released once the buyer collects.`
      : deciding === "decline"
        ? `Declining closes offer #${STANDING.round}. The buyer can still open a new round.`
        : deciding === "counter"
          ? `Sending replaces offer #${STANDING.round} and starts round ${STANDING.round + 1}. The buyer has 12h to answer.`
          : settled === "accepted"
            ? "The buyer collects tomorrow at 9am. Payout is released after collection."
            : settled === "declined"
              ? `Offer #${STANDING.round} is closed. The buyer can still open a new round.`
              : settled === "countered"
                ? "Sent just now. The buyer has 12h to answer before it expires."
                : null;

  const pinned = pinnedState(settled, counter);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.h1} accessibilityRole="header">
          Offer Thread
        </Text>
        <Text style={styles.item} numberOfLines={1}>
          {LISTING.title}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          Asking {formatKRW(LISTING.asking)} · Grade {LISTING.grade} · {LISTING.counterparty}
        </Text>

        {/* Pinned: which round is valid right now, and how much of its window is left. */}
        <View
          style={styles.standing}
          accessible
          accessibilityLiveRegion="polite"
          accessibilityLabel={`${pinned.pill}, ${formatKRW(pinned.amount)}. ${pinned.left}. ${pinned.right}`}
        >
          <View style={styles.standingRow}>
            <View style={[styles.pill, pinned.tone === "accent" ? styles.pillAccent : styles.pillQuiet]}>
              <Text style={[styles.pillText, pinned.tone === "accent" ? styles.pillTextOn : styles.pillTextQuiet]}>
                {pinned.pill}
              </Text>
            </View>
            <Text style={[styles.standingAmount, pinned.struck && styles.standingAmountStruck]}>
              {formatKRW(pinned.amount)}
            </Text>
          </View>
          <View style={styles.standingRow}>
            <Text style={styles.standingMeta} numberOfLines={1}>
              {pinned.left}
            </Text>
            <Text style={styles.standingExpiry} numberOfLines={1}>
              {pinned.right}
            </Text>
          </View>
          {pinned.elapsed !== null && (
            <View style={styles.expiryTrack}>
              <View style={[styles.expiryFill, { width: pinned.elapsed }]} />
            </View>
          )}
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={threadFor(settled, counter)}
        keyExtractor={(entry) => entry.id}
        renderItem={({ item }) => <ThreadEntryView entry={item} />}
        onContentSizeChange={anchorToLatest}
        style={styles.thread}
        contentContainerStyle={styles.threadContent}
      />

      <View style={styles.bar}>
        <PayoutSummary
          headline={headline}
          refLabel={refLabel}
          amount={composing ? counter : STANDING.amount}
          compareTo={composing ? STANDING.amount : null}
        />

        {mode.k === "counter" && <CounterComposer amount={counter} onChange={setCounter} />}

        {note !== null && (
          <Text style={styles.note} accessibilityLiveRegion="polite">
            {note}
          </Text>
        )}

        {mode.k === "review" && (
          <View style={styles.actions}>
            <ActionButton
              label={`Accept ${formatKRW(STANDING.amount)}`}
              kind="primary"
              onPress={() => setMode({ k: "confirm", intent: "accept" })}
            />
            <View style={styles.actionRow}>
              <ActionButton label="Counter offer" kind="ghost" wide onPress={() => setMode({ k: "counter" })} />
              <ActionButton
                label="Decline"
                kind="ghost"
                wide
                onPress={() => setMode({ k: "confirm", intent: "decline" })}
              />
            </View>
          </View>
        )}

        {mode.k === "counter" && (
          <View style={styles.actions}>
            <ActionButton
              label={`Send counter ${formatKRW(counter)}`}
              kind="primary"
              onPress={() => setMode({ k: "confirm", intent: "counter" })}
            />
            <View style={styles.actionRow}>
              <ActionButton label="Cancel counter" kind="ghost" wide onPress={() => setMode({ k: "review" })} />
            </View>
          </View>
        )}

        {mode.k === "confirm" && (
          <View style={styles.actions}>
            <ActionButton
              label={
                mode.intent === "accept"
                  ? `Confirm — accept ${formatKRW(STANDING.amount)}`
                  : mode.intent === "counter"
                    ? `Confirm — send ${formatKRW(counter)}`
                    : `Confirm — decline offer #${STANDING.round}`
              }
              kind={mode.intent === "decline" ? "strong" : "primary"}
              onPress={() =>
                setMode({
                  k: "settled",
                  outcome:
                    mode.intent === "accept" ? "accepted" : mode.intent === "decline" ? "declined" : "countered",
                })
              }
            />
            <View style={styles.actionRow}>
              <ActionButton
                label={
                  mode.intent === "counter"
                    ? "Back to editing"
                    : mode.intent === "decline"
                      ? "Keep negotiating"
                      : "Not yet"
                }
                kind="ghost"
                wide
                onPress={() => setMode(mode.intent === "counter" ? { k: "counter" } : { k: "review" })}
              />
            </View>
          </View>
        )}

        {/* A sent counter is the one settled state that is still yours to take back. */}
        {settled === "countered" && (
          <View style={styles.actions}>
            <View style={styles.actionRow}>
              <ActionButton label="Withdraw counter" kind="ghost" wide onPress={() => setMode({ k: "review" })} />
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: tokens.color.bg },

  /* header — title, listing, pinned offer state */
  // Shorter top inset than the sibling screens on purpose: this screen also carries a persistent
  // bottom bar, and the thread is what should get the remaining height.
  header: { paddingHorizontal: tokens.space(5), paddingTop: tokens.space(10), paddingBottom: tokens.space(3) },
  h1: { fontSize: 28, fontWeight: "800", color: tokens.color.ink, letterSpacing: -0.5 },
  item: { marginTop: 6, fontSize: 15, fontWeight: "600", color: tokens.color.ink2, lineHeight: 21 },
  meta: { marginTop: 2, fontSize: 13, color: tokens.color.faint },

  standing: {
    marginTop: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(3),
    gap: 6,
  },
  standingRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: tokens.space(2) },
  standingAmount: { fontSize: 20, fontWeight: "800", color: tokens.color.ink, fontVariant: ["tabular-nums"] },
  standingAmountStruck: { color: tokens.color.muted, textDecorationLine: "line-through" },
  standingMeta: { flexShrink: 1, fontSize: 12, color: tokens.color.muted },
  standingExpiry: { fontSize: 12, fontWeight: "700", color: tokens.color.ink2, fontVariant: ["tabular-nums"] },
  expiryTrack: { height: 3, borderRadius: tokens.radius.sm, backgroundColor: tokens.color.border, overflow: "hidden" },
  expiryFill: { height: 3, borderRadius: tokens.radius.sm, backgroundColor: tokens.color.accent },

  /* thread */
  thread: { flex: 1 },
  threadContent: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(2),
    paddingBottom: tokens.space(4),
    gap: tokens.space(3),
  },
  entryRow: { width: "100%" },
  alignStart: { alignItems: "flex-start" },
  alignEnd: { alignItems: "flex-end" },
  textLeft: { textAlign: "left" },
  textRight: { textAlign: "right" },
  byline: { fontSize: 11, color: tokens.color.faint, marginBottom: 4 },

  bubble: {
    maxWidth: "86%",
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(2),
  },
  bubbleTheirs: { backgroundColor: tokens.color.border },
  bubbleMine: { backgroundColor: tokens.color.ink2 },
  bubbleText: { fontSize: 16, lineHeight: 22 },
  bubbleTextTheirs: { color: tokens.color.ink },
  bubbleTextMine: { color: tokens.color.onAccent },

  /* offer card inside the thread */
  offerCard: {
    minWidth: "68%",
    maxWidth: "88%",
    borderWidth: 1,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  offerCardLive: { borderColor: tokens.color.accent },
  offerCardPast: { borderColor: tokens.color.border },
  offerHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: tokens.space(2) },
  offerRound: {
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.muted,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  offerAmount: { marginTop: 6, fontSize: 22, fontWeight: "800", fontVariant: ["tabular-nums"] },
  offerAmountLive: { color: tokens.color.ink },
  offerAmountPast: { color: tokens.color.muted, textDecorationLine: "line-through" },
  offerNote: { marginTop: 4, fontSize: 12, color: tokens.color.muted },

  /* status pill — the label carries the state, color only reinforces it */
  pill: { paddingHorizontal: tokens.space(2), paddingVertical: 3, borderRadius: tokens.radius.sm },
  pillAccent: { backgroundColor: tokens.color.accent },
  pillQuiet: { borderWidth: 1, borderColor: tokens.color.border },
  pillText: { fontSize: 11, fontWeight: "700", letterSpacing: 0.2 },
  pillTextOn: { color: tokens.color.onAccent },
  pillTextQuiet: { color: tokens.color.muted },

  /* system event line */
  eventRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: tokens.space(2) },
  eventDot: { width: 5, height: 5, borderRadius: tokens.radius.sm, backgroundColor: tokens.color.border },
  eventText: { flexShrink: 1, fontSize: 12, color: tokens.color.faint },

  /* day separator */
  dayRow: { flexDirection: "row", alignItems: "center", gap: tokens.space(3), paddingVertical: tokens.space(1) },
  dayLine: { flex: 1, height: 1, backgroundColor: tokens.color.border },
  dayLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.faint,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },

  /* persistent action bar */
  bar: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
    gap: tokens.space(3),
  },

  summary: { gap: 2 },
  summaryHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: tokens.space(2) },
  summaryLabel: {
    flexShrink: 1,
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.muted,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  summaryRef: { fontSize: 11, color: tokens.color.faint, fontVariant: ["tabular-nums"] },
  payout: { marginTop: 4, fontSize: 26, fontWeight: "800", color: tokens.color.ink, fontVariant: ["tabular-nums"] },
  payoutCaption: { fontSize: 12, color: tokens.color.faint, marginBottom: 6 },
  breakRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: tokens.space(2) },
  breakLabel: { fontSize: 13, color: tokens.color.muted },
  breakValue: { fontSize: 13, fontWeight: "600", color: tokens.color.ink2, fontVariant: ["tabular-nums"] },
  deltaText: { marginTop: 6, fontSize: 12, fontWeight: "700", color: tokens.color.accent, fontVariant: ["tabular-nums"] },

  /* counter composer */
  composer: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    gap: tokens.space(2),
  },
  composerHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: tokens.space(2) },
  composerLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.muted,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  composerStep: { fontSize: 11, color: tokens.color.faint, fontVariant: ["tabular-nums"] },
  stepRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: tokens.space(2) },
  step: {
    width: 44,
    height: 44,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stepDisabled: { opacity: 0.4 },
  stepGlyph: { fontSize: 20, fontWeight: "700", color: tokens.color.ink2, lineHeight: 22 },
  counterAmount: {
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "800",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },

  chipRow: { flexDirection: "row", alignItems: "center", gap: tokens.space(2), flexWrap: "wrap", rowGap: tokens.space(2) },
  chip: {
    minHeight: 44,
    flexGrow: 1,
    flexBasis: 0,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    paddingHorizontal: tokens.space(1),
    paddingVertical: tokens.space(1),
    alignItems: "center",
    justifyContent: "center",
  },
  chipSelected: { borderColor: tokens.color.accent },
  chipAmount: { fontSize: 13, fontWeight: "700", color: tokens.color.ink2, fontVariant: ["tabular-nums"] },
  chipAmountSelected: { color: tokens.color.accent },
  chipCaption: { marginTop: 1, fontSize: 10, color: tokens.color.muted, fontVariant: ["tabular-nums"] },
  hint: { fontSize: 12, color: tokens.color.muted, lineHeight: 17 },

  note: { fontSize: 13, color: tokens.color.ink2, lineHeight: 19 },

  /* actions — primary full width, secondaries beneath */
  actions: { gap: tokens.space(2) },
  actionRow: { flexDirection: "row", gap: tokens.space(2) },
  btn: {
    minHeight: 48,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(4),
    alignItems: "center",
    justifyContent: "center",
  },
  btnWide: { flexGrow: 1, flexBasis: 0 },
  btnPrimary: { backgroundColor: tokens.color.accent },
  btnStrong: { backgroundColor: tokens.color.ink2 },
  btnGhost: { borderWidth: 1, borderColor: tokens.color.border, backgroundColor: tokens.color.bg },
  btnLabel: { fontSize: 15, fontWeight: "700" },
  btnLabelOn: { color: tokens.color.onAccent },
  btnLabelGhost: { color: tokens.color.ink2 },
  pressed: { opacity: 0.85 },
});
