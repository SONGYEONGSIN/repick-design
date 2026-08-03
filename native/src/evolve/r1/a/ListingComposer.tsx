// native/src/evolve/r1/a/ListingComposer.tsx — auto-native-r1/a: a three-step seller intake form.
// The screen type is "write", not "read": every control feeds one pure quote (data.ts#buildQuote) whose
// result — asking price and payout — is pinned above the step body and never scrolls out of view.
import { useState } from "react";
import { View, Text, Pressable, FlatList, TextInput, StyleSheet } from "react-native";
import {
  BreakdownRow,
  Category,
  Extra,
  Grade,
  Quote,
  Step,
  CATEGORIES,
  DEFAULT_CATEGORY_ID,
  DEFAULT_EXTRA_IDS,
  DEFAULT_GRADE_ID,
  EXTRAS,
  GRADES,
  PRICE_STEP,
  SHIPPING_FEE,
  STEPS,
  TITLE_MAX,
  bandLabel,
  breakdownRows,
  buildQuote,
  deltaLabel,
  formatWon,
  gradeValue,
  stepPrice,
  suggestedTitle,
} from "./data";
import { tokens } from "../../../tokens";

/* ───────── Step rail ───────── */

function StepPill({
  step,
  index,
  current,
  onPress,
}: {
  step: Step;
  index: number;
  current: number;
  onPress: () => void;
}) {
  const done = index < current;
  const active = index === current;
  const reachable = index <= current;
  return (
    <Pressable
      onPress={onPress}
      disabled={!reachable}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityState={{ selected: active, disabled: !reachable }}
      accessibilityLabel={`Step ${index + 1} of ${STEPS.length}, ${step.label}${done ? ", completed" : ""}`}
      style={({ pressed }) => [styles.pill, pressed && styles.pressed]}
    >
      <View style={[styles.pillMark, active && styles.pillMarkOn, done && styles.pillMarkDone]}>
        <Text style={[styles.pillNum, active && styles.pillNumOn, !reachable && styles.quietText]}>{index + 1}</Text>
      </View>
      <Text style={[styles.pillLabel, !reachable && styles.quietText]} numberOfLines={1}>
        {step.label}
      </Text>
    </Pressable>
  );
}

/* ───────── Always-visible quote card ───────── */

function StepperButton({ sign, label, onPress }: { sign: "minus" | "plus"; label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.stepperBtn, pressed && styles.pressed]}
    >
      <Text style={styles.stepperGlyph}>{sign === "minus" ? "−" : "+"}</Text>
    </Pressable>
  );
}

function QuoteCard({
  quote,
  title,
  published,
  onStepPrice,
}: {
  quote: Quote;
  title: string;
  published: boolean;
  onStepPrice: (direction: 1 | -1) => void;
}) {
  const named = title.trim().length > 0 ? title.trim() : "Untitled listing";
  return (
    <View style={styles.card}>
      <View style={styles.cardHead}>
        <Text style={styles.overline}>{published ? "LISTING PUBLISHED" : "LISTING DRAFT"}</Text>
        <Text style={styles.cardGrade}>{`Grade ${quote.grade.id}`}</Text>
      </View>
      <Text style={styles.cardTitle} numberOfLines={1}>
        {named}
      </Text>

      <View style={styles.priceRow}>
        <StepperButton
          sign="minus"
          label={`Lower the asking price by ${formatWon(PRICE_STEP)}`}
          onPress={() => onStepPrice(-1)}
        />
        <View style={styles.priceBox}>
          <Text style={styles.price} numberOfLines={1}>
            {formatWon(quote.price)}
          </Text>
          <Text style={styles.priceCap}>asking price</Text>
        </View>
        <StepperButton
          sign="plus"
          label={`Raise the asking price by ${formatWon(PRICE_STEP)}`}
          onPress={() => onStepPrice(1)}
        />
      </View>

      <View
        style={styles.payoutRow}
        accessible
        accessibilityLiveRegion="polite"
        accessibilityLabel={`You receive ${formatWon(quote.payout)} after fees`}
      >
        <Text style={styles.payoutLabel}>You receive</Text>
        <Text style={styles.payoutValue}>{formatWon(quote.payout)}</Text>
      </View>

      <View style={styles.cardFoot}>
        <Text style={styles.cardFootText} numberOfLines={1}>
          {`Suggested ${formatWon(quote.low)}–${formatWon(quote.high)}`}
        </Text>
        <View style={[styles.bandTag, quote.band !== "in" && styles.bandTagAlert]}>
          <Text style={[styles.bandText, quote.band !== "in" && styles.bandTextAlert]}>{bandLabel(quote.band)}</Text>
        </View>
      </View>
    </View>
  );
}

/* ───────── Shared bits ───────── */

function SectionHead({ step }: { step: Step }) {
  return (
    <View style={styles.sectionHead}>
      <Text style={styles.h2} accessibilityRole="header">
        {step.title}
      </Text>
      <Text style={styles.sectionHint}>{step.hint}</Text>
    </View>
  );
}

function Mark({ selected }: { selected: boolean }) {
  return <View style={[styles.mark, selected && styles.markOn]}>{selected ? <View style={styles.markDot} /> : null}</View>;
}

/* ───────── Step 1 — item ───────── */

function ItemHeader({
  step,
  title,
  invalid,
  onChangeTitle,
}: {
  step: Step;
  title: string;
  invalid: boolean;
  onChangeTitle: (next: string) => void;
}) {
  return (
    <View>
      <SectionHead step={step} />
      <View style={styles.field}>
        <View style={styles.fieldHead}>
          <Text style={styles.fieldLabel}>Listing title</Text>
          <Text style={styles.fieldReq}>Required</Text>
        </View>
        <TextInput
          value={title}
          onChangeText={onChangeTitle}
          style={[styles.input, invalid && styles.inputInvalid]}
          placeholder="Model name, colour, storage"
          placeholderTextColor={tokens.color.faint}
          selectionColor={tokens.color.accent}
          maxLength={TITLE_MAX}
          returnKeyType="done"
          accessibilityLabel="Listing title, required"
        />
        {invalid ? (
          <Text style={styles.fieldError} accessibilityRole="alert" accessibilityLiveRegion="polite">
            Add a title before continuing
          </Text>
        ) : (
          <Text style={styles.fieldHint}>Buyers search by model name — keep it specific.</Text>
        )}
      </View>
      <Text style={styles.listLabel}>Category</Text>
    </View>
  );
}

function CategoryRow({ item, selected, onPress }: { item: Category; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      // selected + checked together: iOS reads the selected trait, Android/web read aria-checked.
      accessibilityState={{ selected, checked: selected }}
      accessibilityLabel={`${item.label}, ${item.model}, market average ${formatWon(item.base)}`}
      style={({ pressed }) => [styles.optionRow, selected && styles.optionRowOn, pressed && styles.pressed]}
    >
      <Mark selected={selected} />
      <View style={styles.optionText}>
        <Text style={styles.optionLabel} numberOfLines={1}>
          {item.label}
        </Text>
        <Text style={styles.optionNote} numberOfLines={1}>
          {item.model}
        </Text>
      </View>
      <View style={styles.optionTrail}>
        <Text style={styles.optionValue}>{formatWon(item.base)}</Text>
        <Text style={styles.optionTrailCap}>market avg</Text>
      </View>
    </Pressable>
  );
}

/* ───────── Step 2 — condition ───────── */

function GradeRow({
  item,
  value,
  selected,
  onPress,
}: {
  item: Grade;
  value: number;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected, checked: selected }}
      accessibilityLabel={`Grade ${item.id}, ${item.label}, ${item.note}, estimated ${formatWon(value)}`}
      style={({ pressed }) => [styles.optionRow, selected && styles.optionRowOn, pressed && styles.pressed]}
    >
      <Mark selected={selected} />
      <View style={styles.optionText}>
        <Text style={styles.optionLabel} numberOfLines={1}>
          {`${item.id} · ${item.label}`}
        </Text>
        <Text style={styles.optionNote} numberOfLines={1}>
          {item.note}
        </Text>
      </View>
      <View style={styles.optionTrail}>
        <Text style={styles.optionValue}>{formatWon(value)}</Text>
        <Text style={styles.optionTrailCap}>estimate</Text>
      </View>
    </Pressable>
  );
}

function ExtraChip({ item, on, onPress }: { item: Extra; on: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="switch"
      accessibilityState={{ checked: on }}
      accessibilityLabel={`${item.label}, ${deltaLabel(item.delta)} on the estimate`}
      style={({ pressed }) => [styles.chip, on && styles.chipOn, pressed && styles.pressed]}
    >
      <Text style={[styles.chipLabel, on && styles.chipLabelOn]}>{item.label}</Text>
      <Text style={[styles.chipDelta, on && styles.chipLabelOn]}>{deltaLabel(item.delta)}</Text>
    </Pressable>
  );
}

function ExtrasFooter({ extraIds, onToggle }: { extraIds: readonly string[]; onToggle: (id: string) => void }) {
  return (
    <View style={styles.extras}>
      <Text style={styles.listLabel}>Extras and flaws</Text>
      <FlatList
        data={EXTRAS}
        horizontal
        keyExtractor={(extra) => extra.id}
        renderItem={({ item }) => (
          <ExtraChip item={item} on={extraIds.includes(item.id)} onPress={() => onToggle(item.id)} />
        )}
        contentContainerStyle={styles.chipRow}
        showsHorizontalScrollIndicator={false}
      />
      <Text style={styles.fieldHint}>Every toggle re-prices all four grades above.</Text>
    </View>
  );
}

/* ───────── Step 3 — review ───────── */

function SegmentButton({ label, note, on, onPress }: { label: string; note: string; on: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected: on, checked: on }}
      accessibilityLabel={`${label}, ${note}`}
      style={({ pressed }) => [styles.segment, on && styles.segmentOn, pressed && styles.pressed]}
    >
      <Text style={[styles.segmentLabel, on && styles.segmentLabelOn]}>{label}</Text>
      <Text style={[styles.segmentNote, on && styles.segmentLabelOn]}>{note}</Text>
    </Pressable>
  );
}

function ReviewHeader({
  step,
  quote,
  sellerPays,
  onShipping,
  onReset,
}: {
  step: Step;
  quote: Quote;
  sellerPays: boolean;
  onShipping: (next: boolean) => void;
  onReset: () => void;
}) {
  return (
    <View>
      <SectionHead step={step} />
      <Text style={styles.listLabel}>Who pays shipping</Text>
      <View
        style={styles.segmentRow}
        accessibilityRole="radiogroup"
        accessibilityLabel="Who pays shipping"
      >
        <SegmentButton label="I pay" note={formatWon(SHIPPING_FEE)} on={sellerPays} onPress={() => onShipping(true)} />
        <SegmentButton label="Buyer pays" note="No deduction" on={!sellerPays} onPress={() => onShipping(false)} />
      </View>
      {quote.overridden ? (
        <Pressable
          onPress={onReset}
          accessibilityRole="button"
          accessibilityLabel={`Reset the asking price to the suggested ${formatWon(quote.value)}`}
          style={({ pressed }) => [styles.resetRow, pressed && styles.pressed]}
        >
          <Text style={styles.resetLabel}>{`Reset to suggested ${formatWon(quote.value)}`}</Text>
        </Pressable>
      ) : null}
      <Text style={styles.listLabel}>Breakdown</Text>
    </View>
  );
}

function BreakdownRowView({ row }: { row: BreakdownRow }) {
  return (
    <View style={[styles.breakRow, row.total && styles.breakRowTotal]}>
      <View style={styles.optionText}>
        <Text style={[styles.breakLabel, row.total && styles.breakLabelTotal]}>{row.label}</Text>
        <Text style={styles.optionNote} numberOfLines={1}>
          {row.note}
        </Text>
      </View>
      <Text style={[styles.breakAmount, row.total && styles.breakAmountTotal]}>{row.amount}</Text>
    </View>
  );
}

/* ───────── Screen ───────── */

export function ListingComposer() {
  const [stepIndex, setStepIndex] = useState(0);
  const [categoryId, setCategoryId] = useState(DEFAULT_CATEGORY_ID);
  const [title, setTitle] = useState(suggestedTitle(DEFAULT_CATEGORY_ID));
  const [titleEdited, setTitleEdited] = useState(false);
  const [gradeId, setGradeId] = useState(DEFAULT_GRADE_ID);
  const [extraIds, setExtraIds] = useState<readonly string[]>(DEFAULT_EXTRA_IDS);
  const [priceOverride, setPriceOverride] = useState<number | null>(null);
  const [sellerPaysShipping, setSellerPaysShipping] = useState(true);
  const [published, setPublished] = useState(false);

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;
  const quote = buildQuote({ categoryId, gradeId, extraIds, priceOverride, sellerPaysShipping });
  const titleMissing = title.trim().length === 0;

  // Editing anything re-opens the draft, so the card can never claim "published" while the numbers move.
  const edit = (change: () => void) => {
    change();
    setPublished(false);
  };

  const pickCategory = (next: string) =>
    edit(() => {
      setCategoryId(next);
      if (!titleEdited) setTitle(suggestedTitle(next));
    });

  const changeTitle = (next: string) =>
    edit(() => {
      setTitle(next);
      setTitleEdited(true);
    });

  const toggleExtra = (id: string) =>
    edit(() => setExtraIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])));

  // The stepper always starts from the number on screen, so the first tap nudges the live estimate.
  const nudgePrice = (direction: 1 | -1) =>
    edit(() => setPriceOverride(stepPrice(quote.price, direction, quote.category.base)));

  const body =
    step.id === "item" ? (
      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        extraData={categoryId}
        renderItem={({ item }) => (
          <CategoryRow item={item} selected={item.id === categoryId} onPress={() => pickCategory(item.id)} />
        )}
        ListHeaderComponent={
          <ItemHeader step={step} title={title} invalid={titleMissing} onChangeTitle={changeTitle} />
        }
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        accessibilityRole="radiogroup"
        accessibilityLabel="Category"
      />
    ) : step.id === "condition" ? (
      <FlatList
        data={GRADES}
        keyExtractor={(item) => item.id}
        extraData={`${gradeId}/${extraIds.join(",")}/${categoryId}`}
        renderItem={({ item }) => (
          <GradeRow
            item={item}
            value={gradeValue(quote.category.base, item, quote.extraPct)}
            selected={item.id === gradeId}
            onPress={() => edit(() => setGradeId(item.id))}
          />
        )}
        ListHeaderComponent={<SectionHead step={step} />}
        ListFooterComponent={<ExtrasFooter extraIds={extraIds} onToggle={toggleExtra} />}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        accessibilityRole="radiogroup"
        accessibilityLabel="Condition grade"
      />
    ) : (
      <FlatList
        data={breakdownRows(quote, sellerPaysShipping)}
        keyExtractor={(row) => row.id}
        renderItem={({ item }) => <BreakdownRowView row={item} />}
        ListHeaderComponent={
          <ReviewHeader
            step={step}
            quote={quote}
            sellerPays={sellerPaysShipping}
            onShipping={(next) => edit(() => setSellerPaysShipping(next))}
            onReset={() => edit(() => setPriceOverride(null))}
          />
        }
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      />
    );

  return (
    <View style={styles.root}>
      <Text style={styles.h1} accessibilityRole="header">
        List an Item
      </Text>
      <Text style={styles.sub}>{`Step ${stepIndex + 1} of ${STEPS.length} · ${step.label}`}</Text>

      <View style={styles.rail}>
        <StepPill step={STEPS[0]} index={0} current={stepIndex} onPress={() => setStepIndex(0)} />
        <View style={[styles.railLink, stepIndex > 0 && styles.railLinkOn]} />
        <StepPill step={STEPS[1]} index={1} current={stepIndex} onPress={() => setStepIndex(1)} />
        <View style={[styles.railLink, stepIndex > 1 && styles.railLinkOn]} />
        <StepPill step={STEPS[2]} index={2} current={stepIndex} onPress={() => setStepIndex(2)} />
      </View>

      <QuoteCard quote={quote} title={title} published={published} onStepPrice={nudgePrice} />

      {body}

      {published ? (
        <View style={styles.doneBar} accessibilityLiveRegion="polite">
          <View style={styles.optionText}>
            <Text style={styles.doneTitle}>Listing published</Text>
            <Text style={styles.optionNote}>{`Buyers see it now · you receive ${formatWon(quote.payout)}`}</Text>
          </View>
          <Pressable
            onPress={() => setPublished(false)}
            accessibilityRole="button"
            accessibilityLabel="Edit the published listing"
            style={({ pressed }) => [styles.ghostBtn, pressed && styles.pressed]}
          >
            <Text style={styles.ghostLabel}>Edit</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.navBar}>
          <Pressable
            onPress={() => setStepIndex((i) => Math.max(i - 1, 0))}
            disabled={stepIndex === 0}
            accessibilityRole="button"
            accessibilityState={{ disabled: stepIndex === 0 }}
            accessibilityLabel="Back to the previous step"
            style={({ pressed }) => [styles.ghostBtn, stepIndex === 0 && styles.disabled, pressed && styles.pressed]}
          >
            <Text style={styles.ghostLabel}>Back</Text>
          </Pressable>
          <Pressable
            onPress={() => (isLast ? setPublished(true) : setStepIndex((i) => Math.min(i + 1, STEPS.length - 1)))}
            disabled={titleMissing}
            accessibilityRole="button"
            accessibilityState={{ disabled: titleMissing }}
            accessibilityLabel={isLast ? `Publish listing at ${formatWon(quote.price)}` : `Continue to ${STEPS[stepIndex + 1].label}`}
            style={({ pressed }) => [styles.primaryBtn, titleMissing && styles.disabled, pressed && styles.pressed]}
          >
            <Text style={styles.primaryLabel}>{isLast ? "Publish listing" : "Next"}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: tokens.color.bg, paddingHorizontal: tokens.space(5), paddingTop: tokens.space(14) },
  h1: { fontSize: 28, fontWeight: "800", color: tokens.color.ink, letterSpacing: -0.5 },
  sub: { marginTop: 6, fontSize: 13, color: tokens.color.faint },
  quietText: { color: tokens.color.faint },
  pressed: { opacity: 0.6 },
  disabled: { opacity: 0.4 },

  // Step rail — numbered pills joined by a rule that fills in as the seller advances.
  rail: { flexDirection: "row", alignItems: "center", marginTop: tokens.space(4) },
  pill: { flexDirection: "row", alignItems: "center", gap: tokens.space(2), height: 44 },
  pillMark: {
    width: 26,
    height: 26,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  pillMarkOn: { backgroundColor: tokens.color.accent, borderColor: tokens.color.accent },
  pillMarkDone: { borderColor: tokens.color.accent },
  pillNum: { fontSize: 12, fontWeight: "700", color: tokens.color.ink2, fontVariant: ["tabular-nums"] },
  pillNumOn: { color: tokens.color.onAccent },
  pillLabel: { fontSize: 13, fontWeight: "600", color: tokens.color.ink2 },
  railLink: { flex: 1, height: 1, marginHorizontal: tokens.space(2), backgroundColor: tokens.color.border },
  railLinkOn: { backgroundColor: tokens.color.accent },

  // Quote card — the proof. Pinned above the step body on every step, and adjustable in place.
  card: {
    marginTop: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  cardHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  overline: { fontSize: 10, fontWeight: "700", color: tokens.color.faint, letterSpacing: 0.8 },
  cardGrade: { fontSize: 11, fontWeight: "700", color: tokens.color.muted, letterSpacing: 0.4 },
  cardTitle: { marginTop: 4, fontSize: 15, fontWeight: "600", color: tokens.color.ink2 },

  priceRow: { flexDirection: "row", alignItems: "center", marginTop: tokens.space(2) },
  stepperBtn: {
    width: 44,
    height: 44,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperGlyph: { fontSize: 20, fontWeight: "600", color: tokens.color.ink2, lineHeight: 22 },
  priceBox: { flex: 1, alignItems: "center", paddingHorizontal: tokens.space(2) },
  price: { fontSize: 26, fontWeight: "800", color: tokens.color.ink, fontVariant: ["tabular-nums"], letterSpacing: -0.5 },
  priceCap: { marginTop: 1, fontSize: 11, color: tokens.color.faint },

  payoutRow: {
    marginTop: tokens.space(2),
    paddingTop: tokens.space(2),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  payoutLabel: { fontSize: 13, fontWeight: "600", color: tokens.color.muted },
  payoutValue: { fontSize: 20, fontWeight: "800", color: tokens.color.accent, fontVariant: ["tabular-nums"] },

  cardFoot: { marginTop: tokens.space(2), flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: tokens.space(2) },
  cardFootText: { flexShrink: 1, fontSize: 12, color: tokens.color.faint, fontVariant: ["tabular-nums"] },
  bandTag: { borderWidth: 1, borderColor: tokens.color.border, borderRadius: tokens.radius.sm, paddingHorizontal: tokens.space(2), paddingVertical: 2 },
  bandTagAlert: { borderColor: tokens.color.accent },
  bandText: { fontSize: 11, fontWeight: "700", color: tokens.color.muted },
  bandTextAlert: { color: tokens.color.accent },

  // Step body
  body: { paddingTop: tokens.space(4), paddingBottom: tokens.space(4), gap: tokens.space(2) },
  sectionHead: { marginBottom: tokens.space(2) },
  h2: { fontSize: 17, fontWeight: "700", color: tokens.color.ink, letterSpacing: -0.2 },
  sectionHint: { marginTop: 2, fontSize: 12, color: tokens.color.faint, lineHeight: 18 },
  listLabel: {
    marginTop: tokens.space(2),
    marginBottom: tokens.space(1),
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.faint,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },

  // Text field
  field: { marginTop: tokens.space(1) },
  fieldHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  fieldLabel: { fontSize: 13, fontWeight: "600", color: tokens.color.ink2 },
  fieldReq: { fontSize: 11, fontWeight: "600", color: tokens.color.muted },
  input: {
    marginTop: 6,
    height: 46,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(3),
    fontSize: 15,
    color: tokens.color.ink,
    backgroundColor: tokens.color.bg,
  },
  inputInvalid: { borderColor: tokens.color.accent },
  fieldHint: { marginTop: 6, fontSize: 12, color: tokens.color.faint, lineHeight: 17 },
  fieldError: { marginTop: 6, fontSize: 12, fontWeight: "600", color: tokens.color.accent },

  // Selectable rows (categories + grades share one anatomy: mark · text · trailing number)
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    minHeight: 56,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(2),
    backgroundColor: tokens.color.bg,
  },
  optionRowOn: { borderColor: tokens.color.accent },
  mark: {
    width: 20,
    height: 20,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  markOn: { borderColor: tokens.color.accent, backgroundColor: tokens.color.accent },
  markDot: { width: 8, height: 8, borderRadius: 2, backgroundColor: tokens.color.onAccent },
  optionText: { flex: 1 },
  optionLabel: { fontSize: 15, fontWeight: "600", color: tokens.color.ink2 },
  optionNote: { marginTop: 2, fontSize: 12, color: tokens.color.faint },
  optionTrail: { alignItems: "flex-end" },
  optionValue: { fontSize: 14, fontWeight: "700", color: tokens.color.ink, fontVariant: ["tabular-nums"] },
  optionTrailCap: { marginTop: 1, fontSize: 10, color: tokens.color.faint },

  // Extras — horizontal toggle chips
  extras: { marginTop: tokens.space(1) },
  chipRow: { gap: tokens.space(2), paddingVertical: 2 },
  chip: {
    height: 44,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(3),
  },
  chipOn: { borderColor: tokens.color.accent, backgroundColor: tokens.color.accent },
  chipLabel: { fontSize: 13, fontWeight: "600", color: tokens.color.ink2 },
  chipLabelOn: { color: tokens.color.onAccent },
  chipDelta: { marginTop: 1, fontSize: 11, fontWeight: "700", color: tokens.color.muted, fontVariant: ["tabular-nums"] },

  // Shipping segmented control
  segmentRow: { flexDirection: "row", gap: tokens.space(2) },
  segment: {
    flex: 1,
    minHeight: 52,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(3),
  },
  segmentOn: { borderColor: tokens.color.accent, backgroundColor: tokens.color.accent },
  segmentLabel: { fontSize: 14, fontWeight: "700", color: tokens.color.ink2 },
  segmentNote: { marginTop: 1, fontSize: 11, color: tokens.color.faint, fontVariant: ["tabular-nums"] },
  segmentLabelOn: { color: tokens.color.onAccent },

  resetRow: { marginTop: tokens.space(2), height: 44, justifyContent: "center" },
  resetLabel: { fontSize: 13, fontWeight: "700", color: tokens.color.accent, fontVariant: ["tabular-nums"] },

  // Breakdown rows
  breakRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    minHeight: 52,
    paddingVertical: tokens.space(2),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  breakRowTotal: { borderBottomWidth: 0, borderTopWidth: 1, borderTopColor: tokens.color.ink, marginTop: tokens.space(1) },
  breakLabel: { fontSize: 14, fontWeight: "600", color: tokens.color.ink2 },
  breakLabelTotal: { fontSize: 15, fontWeight: "800", color: tokens.color.ink },
  breakAmount: { fontSize: 15, fontWeight: "700", color: tokens.color.ink2, fontVariant: ["tabular-nums"] },
  breakAmountTotal: { fontSize: 19, fontWeight: "800", color: tokens.color.accent, fontVariant: ["tabular-nums"] },

  // Footer — navigation, or the published confirmation that replaces it
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
  },
  ghostBtn: {
    minHeight: 48,
    minWidth: 96,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(4),
  },
  ghostLabel: { fontSize: 15, fontWeight: "700", color: tokens.color.ink2 },
  primaryBtn: {
    flex: 1,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    paddingHorizontal: tokens.space(4),
  },
  primaryLabel: { fontSize: 15, fontWeight: "700", color: tokens.color.onAccent },
  doneBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
    borderTopWidth: 1,
    borderTopColor: tokens.color.ink,
  },
  doneTitle: { fontSize: 15, fontWeight: "800", color: tokens.color.ink },
});
