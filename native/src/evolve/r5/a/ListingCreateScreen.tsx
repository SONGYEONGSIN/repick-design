// native/src/evolve/r5/a/ListingCreateScreen.tsx — auto-native-r5 candidate a.
//
// Listing creation / upload flow: a 4-step wizard (Photos -> Details -> Price -> Review) with a
// terminal Publish action. Distinct macro bucket from the avoided screens — it is a multi-step
// creation wizard with a small fixed step tracker + a scrollable per-step body + a fixed bottom
// action band, not a chronological thread, not a single always-scrolling settings list, not a
// checklist-with-band (Handoff's shape), not a browse/detail/feed screen.
//
// r3 lesson applied: the fixed bottom band is a small state machine wired to real step validity.
// While anything blocks publish it names the exact blocker and tapping it jumps straight to the
// step that needs attention; once every step is valid it flips to an enabled "Publish listing"
// action.
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  type ListRenderItem,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  CATEGORIES,
  CONDITIONS,
  DETAILS_ROWS,
  PHOTO_SLOT_COUNT,
  PHOTO_SLOT_IDS,
  PRICE_PRESETS,
  PRICE_REFERENCE,
  PRICE_STEP,
  STEPS,
  formatWon,
  formatWonDigits,
  type DetailsRow,
  type PricePreset,
} from "./data";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

type Blocking = { step: number; message: string } | null;

/** Splits a won amount into a plain "₩" Text and a separate digits Text. Applying
 * fontVariant: tabular-nums to a Text node that also contains the ₩ glyph has been observed to
 * render a stray line-through-looking artifact in this environment, so the symbol and the
 * numeral run always live in sibling Text nodes, and tabular-nums is only ever applied to the
 * digits side. */
function WonText({
  amount,
  symbolStyle,
  digitsStyle,
}: {
  amount: number;
  symbolStyle?: StyleProp<TextStyle>;
  digitsStyle?: StyleProp<TextStyle>;
}) {
  return (
    <View style={styles.wonRow}>
      <Text style={[styles.wonSymbol, symbolStyle]}>₩</Text>
      <Text style={[styles.wonDigits, digitsStyle]}>{formatWonDigits(amount)}</Text>
    </View>
  );
}

export function ListingCreateScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [photos, setPhotos] = useState<boolean[]>(() => Array(PHOTO_SLOT_COUNT).fill(false));
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [conditionId, setConditionId] = useState<string | null>(null);
  const [priceWon, setPriceWon] = useState<number | null>(null);
  const [published, setPublished] = useState(false);

  const filledPhotoCount = photos.filter(Boolean).length;
  const photosValid = filledPhotoCount > 0;
  const categoryValid = categoryId !== null;
  const conditionValid = conditionId !== null;
  const priceValid = priceWon !== null && priceWon > 0;

  const blocking: Blocking = useMemo(() => {
    if (!photosValid) return { step: 0, message: "Add at least 1 photo" };
    if (!categoryValid) return { step: 1, message: "Choose a category" };
    if (!conditionValid) return { step: 1, message: "Choose a condition" };
    if (!priceValid) return { step: 2, message: "Set a price" };
    return null;
  }, [photosValid, categoryValid, conditionValid, priceValid]);

  const selectedCategory = CATEGORIES.find((c) => c.id === categoryId) ?? null;
  const selectedCondition = CONDITIONS.find((c) => c.id === conditionId) ?? null;

  const markEdited = () => {
    if (published) setPublished(false);
  };

  const togglePhoto = (index: number) => {
    markEdited();
    setPhotos((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const selectCategory = (id: string) => {
    markEdited();
    setCategoryId((prev) => (prev === id ? null : id));
  };

  const selectCondition = (id: string) => {
    markEdited();
    setConditionId((prev) => (prev === id ? null : id));
  };

  const adjustPrice = (delta: number) => {
    markEdited();
    setPriceWon((prev) => Math.max(0, (prev ?? 0) + delta));
  };

  const applyPreset = (value: number) => {
    markEdited();
    setPriceWon(value);
  };

  const onChangePriceText = (text: string) => {
    markEdited();
    const digits = text.replace(/[^0-9]/g, "");
    setPriceWon(digits === "" ? null : Number(digits));
  };

  const handlePublish = () => {
    if (blocking) {
      setCurrentStep(blocking.step);
      return;
    }
    setPublished(true);
  };

  const jumpTo = (step: number) => setCurrentStep(step);

  const renderPhotoItem: ListRenderItem<string> = ({ item, index }) => {
    const filled = photos[index];
    return (
      <Pressable
        onPress={() => togglePhoto(index)}
        accessibilityRole="button"
        accessibilityLabel={filled ? `Photo ${index + 1}, added. Double tap to remove.` : `Empty photo slot ${index + 1}. Double tap to add a photo.`}
        accessibilityState={{ selected: filled }}
        hitSlop={HIT_SLOP}
        style={({ pressed }) => [
          styles.photoSlot,
          filled && styles.photoSlotFilled,
          pressed && styles.photoSlotPressed,
        ]}
      >
        {filled ? (
          <>
            <View style={styles.photoThumb} />
            <Text style={styles.photoSlotLabel}>Photo {index + 1}</Text>
          </>
        ) : (
          <>
            <Text style={styles.photoPlus}>+</Text>
            <Text style={styles.photoSlotLabel}>Add</Text>
          </>
        )}
      </Pressable>
    );
  };

  const renderDetailsItem: ListRenderItem<DetailsRow> = ({ item }) => {
    if (item.kind === "header") {
      return (
        <View style={styles.detailsHeader}>
          <Text style={styles.sectionTitle} accessibilityRole="header">
            {item.label}
          </Text>
          <Text style={styles.sectionHint}>{item.hint}</Text>
        </View>
      );
    }
    if (item.kind === "category") {
      const selected = item.category.id === categoryId;
      return (
        <Pressable
          onPress={() => selectCategory(item.category.id)}
          accessibilityRole="button"
          accessibilityState={{ selected }}
          accessibilityLabel={`Category ${item.category.label}${selected ? ", selected" : ""}`}
          accessibilityHint="Press again to clear this selection"
          hitSlop={HIT_SLOP}
          style={({ pressed }) => [
            styles.optionRow,
            selected && styles.optionRowSelected,
            pressed && styles.optionRowPressed,
          ]}
        >
          <View style={[styles.optionMarker, selected && styles.optionMarkerSelected]}>
            {selected ? <Text style={styles.optionMarkerCheck}>✓</Text> : null}
          </View>
          <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
            {item.category.label}
          </Text>
        </Pressable>
      );
    }
    const selected = item.condition.id === conditionId;
    return (
      <Pressable
        onPress={() => selectCondition(item.condition.id)}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        accessibilityLabel={`Condition ${item.condition.label}${selected ? ", selected" : ""}`}
        accessibilityHint="Press again to clear this selection"
        hitSlop={HIT_SLOP}
        style={({ pressed }) => [
          styles.optionRow,
          selected && styles.optionRowSelected,
          pressed && styles.optionRowPressed,
        ]}
      >
        <View style={[styles.optionMarker, selected && styles.optionMarkerSelected]}>
          {selected ? <Text style={styles.optionMarkerCheck}>✓</Text> : null}
        </View>
        <View style={styles.optionBody}>
          <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
            {item.condition.label}
          </Text>
          <Text style={styles.optionDescription}>{item.condition.description}</Text>
        </View>
      </Pressable>
    );
  };

  const renderPresetItem: ListRenderItem<PricePreset> = ({ item }) => {
    const selected = priceWon === item.value;
    return (
      <Pressable
        onPress={() => applyPreset(item.value)}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        accessibilityLabel={`${item.label}, ${formatWon(item.value)}`}
        hitSlop={HIT_SLOP}
        style={({ pressed }) => [
          styles.presetRow,
          selected && styles.presetRowSelected,
          pressed && styles.presetRowPressed,
        ]}
      >
        <Text style={[styles.presetLabel, selected && styles.presetLabelSelected]}>
          {item.label}
        </Text>
        <WonText
          amount={item.value}
          digitsStyle={selected ? styles.presetValueSelected : styles.presetValue}
          symbolStyle={selected ? styles.presetValueSelected : styles.presetValue}
        />
      </Pressable>
    );
  };

  const checklist = [
    { id: "photos", label: "At least 1 photo added", done: photosValid, step: 0 },
    { id: "category", label: "Category selected", done: categoryValid, step: 1 },
    { id: "condition", label: "Condition selected", done: conditionValid, step: 1 },
    { id: "price", label: "Price set", done: priceValid, step: 2 },
  ];

  const renderChecklistItem: ListRenderItem<(typeof checklist)[number]> = ({ item }) => (
    <Pressable
      onPress={() => jumpTo(item.step)}
      accessibilityRole="button"
      accessibilityLabel={`${item.label}, ${item.done ? "complete" : "incomplete"}`}
      accessibilityHint={item.done ? undefined : "Opens the step that resolves this"}
      hitSlop={HIT_SLOP}
      style={({ pressed }) => [styles.checkRow, pressed && styles.checkRowPressed]}
    >
      <View style={[styles.checkMarker, item.done && styles.checkMarkerDone]}>
        {item.done ? <Text style={styles.checkMarkerGlyph}>✓</Text> : null}
      </View>
      <Text style={[styles.checkLabel, item.done && styles.checkLabelDone]}>{item.label}</Text>
    </Pressable>
  );

  const priceLine = priceValid ? formatWon(priceWon as number) : "no price yet";

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.kicker}>REPICK SELLER</Text>
        <Text style={styles.title} accessibilityRole="header">
          Create listing
        </Text>
        <Text style={styles.lede}>
          Photos, category and condition, then a price. Four short steps.
        </Text>
      </View>

      <FlatList
        horizontal
        data={STEPS as unknown as { id: string; label: string }[]}
        keyExtractor={(step) => step.id}
        scrollEnabled={false}
        style={styles.stepBar}
        contentContainerStyle={styles.stepBarContent}
        renderItem={({ item, index }) => {
          const done =
            (index === 0 && photosValid) ||
            (index === 1 && categoryValid && conditionValid) ||
            (index === 2 && priceValid) ||
            (index === 3 && published);
          const current = index === currentStep;
          return (
            <Pressable
              onPress={() => jumpTo(index)}
              accessibilityRole="tab"
              accessibilityState={{ selected: current }}
              accessibilityLabel={`Step ${index + 1} of ${STEPS.length}, ${item.label}${done ? ", complete" : ""}`}
              hitSlop={HIT_SLOP}
              style={styles.stepPip}
            >
              <View style={[styles.stepDot, current && styles.stepDotCurrent, done && styles.stepDotDone]}>
                {done ? (
                  <Text style={styles.stepDotCheck}>✓</Text>
                ) : (
                  <Text style={[styles.stepDotNum, current && styles.stepDotNumCurrent]}>{index + 1}</Text>
                )}
              </View>
              <Text style={[styles.stepPipLabel, current && styles.stepPipLabelCurrent]}>
                {item.label}
              </Text>
            </Pressable>
          );
        }}
      />

      {currentStep === 0 ? (
        <FlatList
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          data={PHOTO_SLOT_IDS as string[]}
          keyExtractor={(id) => id}
          numColumns={3}
          columnWrapperStyle={styles.photoRow}
          renderItem={renderPhotoItem}
          ListHeaderComponent={
            <View style={styles.stepIntro}>
              <Text style={styles.stepKicker}>Step 1 of 4</Text>
              <Text style={styles.stepTitle} accessibilityRole="header">
                Add photos
              </Text>
              <Text style={styles.stepLede}>
                Tap a slot to add a mock photo. Tap again to remove it.
              </Text>
            </View>
          }
          ListFooterComponent={
            <Text style={styles.footerNote}>
              {filledPhotoCount} of {PHOTO_SLOT_COUNT} photos added. At least 1 is required to
              publish.
            </Text>
          }
        />
      ) : null}

      {currentStep === 1 ? (
        <FlatList
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          data={DETAILS_ROWS as DetailsRow[]}
          keyExtractor={(row) => row.id}
          renderItem={renderDetailsItem}
          ListHeaderComponent={
            <View style={styles.stepIntro}>
              <Text style={styles.stepKicker}>Step 2 of 4</Text>
              <Text style={styles.stepTitle} accessibilityRole="header">
                Category and condition
              </Text>
              <Text style={styles.stepLede}>One of each — both are required to publish.</Text>
            </View>
          }
        />
      ) : null}

      {currentStep === 2 ? (
        <FlatList
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          data={PRICE_PRESETS as PricePreset[]}
          keyExtractor={(preset) => preset.id}
          renderItem={renderPresetItem}
          ListHeaderComponent={
            <View>
              <View style={styles.stepIntro}>
                <Text style={styles.stepKicker}>Step 3 of 4</Text>
                <Text style={styles.stepTitle} accessibilityRole="header">
                  Set your price
                </Text>
                <Text style={styles.stepLede}>
                  Buyers compare this to similar sold listings before they message you.
                </Text>
              </View>

              <View style={styles.refCard}>
                <Text style={styles.refCardTitle}>{PRICE_REFERENCE.itemHint}</Text>
                <Text style={styles.refCardMeta}>
                  {PRICE_REFERENCE.soldCount} sales in the last {PRICE_REFERENCE.windowDays} days
                </Text>
                <View style={styles.refRow}>
                  <View style={styles.refCol}>
                    <Text style={styles.refColLabel}>Low</Text>
                    <WonText
                      amount={PRICE_REFERENCE.low}
                      digitsStyle={styles.refColValue}
                      symbolStyle={styles.refColValue}
                    />
                  </View>
                  <View style={styles.refCol}>
                    <Text style={styles.refColLabel}>Typical</Text>
                    <WonText
                      amount={PRICE_REFERENCE.typical}
                      digitsStyle={styles.refColValueTypical}
                      symbolStyle={styles.refColValueTypical}
                    />
                  </View>
                  <View style={styles.refCol}>
                    <Text style={styles.refColLabel}>High</Text>
                    <WonText
                      amount={PRICE_REFERENCE.high}
                      digitsStyle={styles.refColValue}
                      symbolStyle={styles.refColValue}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.priceField}>
                <Text style={styles.fieldLabel}>Your price</Text>
                <View style={styles.priceCurrent}>
                  <WonText
                    amount={priceWon ?? 0}
                    digitsStyle={styles.priceCurrentDigits}
                    symbolStyle={styles.priceCurrentSymbol}
                  />
                </View>
                {!priceValid ? (
                  <Text style={styles.fieldError} accessibilityRole="alert">
                    Set a price above ₩0 to continue.
                  </Text>
                ) : null}
                <View style={styles.stepperRow}>
                  <Pressable
                    onPress={() => adjustPrice(-PRICE_STEP)}
                    disabled={!priceWon || priceWon <= 0}
                    accessibilityRole="button"
                    accessibilityLabel={`Decrease price by ${formatWon(PRICE_STEP)}`}
                    hitSlop={HIT_SLOP}
                    style={({ pressed }) => [
                      styles.stepperBtn,
                      (!priceWon || priceWon <= 0) && styles.stepperBtnDisabled,
                      pressed && styles.stepperBtnPressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.stepperBtnText,
                        (!priceWon || priceWon <= 0) && styles.stepperBtnTextDisabled,
                      ]}
                    >
                      −
                    </Text>
                  </Pressable>
                  <TextInput
                    style={styles.priceInput}
                    value={priceWon === null ? "" : String(priceWon)}
                    onChangeText={onChangePriceText}
                    keyboardType="number-pad"
                    placeholder="0"
                    placeholderTextColor={tokens.color.faint}
                    accessibilityLabel="Listing price in won"
                    accessibilityHint="Enter digits only"
                  />
                  <Pressable
                    onPress={() => adjustPrice(PRICE_STEP)}
                    accessibilityRole="button"
                    accessibilityLabel={`Increase price by ${formatWon(PRICE_STEP)}`}
                    hitSlop={HIT_SLOP}
                    style={({ pressed }) => [styles.stepperBtn, pressed && styles.stepperBtnPressed]}
                  >
                    <Text style={styles.stepperBtnText}>+</Text>
                  </Pressable>
                </View>
              </View>

              <Text style={styles.sectionTitle} accessibilityRole="header">
                Quick presets
              </Text>
            </View>
          }
        />
      ) : null}

      {currentStep === 3 ? (
        <FlatList
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          data={checklist}
          keyExtractor={(row) => row.id}
          renderItem={renderChecklistItem}
          ListHeaderComponent={
            <View>
              <View style={styles.stepIntro}>
                <Text style={styles.stepKicker}>Step 4 of 4</Text>
                <Text style={styles.stepTitle} accessibilityRole="header">
                  Review and publish
                </Text>
                <Text style={styles.stepLede}>
                  Check every field below, then publish from the bar at the bottom.
                </Text>
              </View>

              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Photos</Text>
                  <View style={styles.summaryRight}>
                    <Text style={styles.summaryValue}>
                      {filledPhotoCount} of {PHOTO_SLOT_COUNT} added
                    </Text>
                    <Pressable onPress={() => jumpTo(0)} hitSlop={HIT_SLOP} accessibilityRole="button" accessibilityLabel="Edit photos">
                      <Text style={styles.summaryEdit}>Edit</Text>
                    </Pressable>
                  </View>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Category</Text>
                  <View style={styles.summaryRight}>
                    <Text style={styles.summaryValue}>
                      {selectedCategory ? selectedCategory.label : "Not selected"}
                    </Text>
                    <Pressable onPress={() => jumpTo(1)} hitSlop={HIT_SLOP} accessibilityRole="button" accessibilityLabel="Edit category">
                      <Text style={styles.summaryEdit}>Edit</Text>
                    </Pressable>
                  </View>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Condition</Text>
                  <View style={styles.summaryRight}>
                    <Text style={styles.summaryValue}>
                      {selectedCondition ? selectedCondition.label : "Not selected"}
                    </Text>
                    <Pressable onPress={() => jumpTo(1)} hitSlop={HIT_SLOP} accessibilityRole="button" accessibilityLabel="Edit condition">
                      <Text style={styles.summaryEdit}>Edit</Text>
                    </Pressable>
                  </View>
                </View>
                <View style={[styles.summaryRow, styles.summaryRowLast]}>
                  <Text style={styles.summaryLabel}>Price</Text>
                  <View style={styles.summaryRight}>
                    {priceValid ? (
                      <WonText
                        amount={priceWon as number}
                        digitsStyle={styles.summaryPriceDigits}
                        symbolStyle={styles.summaryPriceDigits}
                      />
                    ) : (
                      <Text style={styles.summaryValue}>Not set</Text>
                    )}
                    <Pressable onPress={() => jumpTo(2)} hitSlop={HIT_SLOP} accessibilityRole="button" accessibilityLabel="Edit price">
                      <Text style={styles.summaryEdit}>Edit</Text>
                    </Pressable>
                  </View>
                </View>
              </View>

              <Text style={styles.sectionTitle} accessibilityRole="header">
                Before you publish
              </Text>
            </View>
          }
          ListFooterComponent={
            published ? (
              <View style={styles.publishedNote}>
                <Text style={styles.publishedNoteText}>
                  This listing is live at {formatWon(priceWon ?? 0)}. Buyers can see it now.
                </Text>
              </View>
            ) : (
              <Text style={styles.footerNote}>
                Publishing makes this listing visible to buyers immediately. You can edit it
                anytime afterward.
              </Text>
            )
          }
        />
      ) : null}

      <View style={styles.band} accessibilityLiveRegion="polite">
        {blocking ? (
          <Pressable
            onPress={() => jumpTo(blocking.step)}
            accessibilityRole="button"
            accessibilityLabel={`${blocking.message}. Tap to go to that step.`}
            style={({ pressed }) => [styles.bandBlocked, pressed && styles.bandPressed]}
          >
            <Text style={styles.bandBlockedTitle} accessibilityRole="alert">
              {blocking.message}
            </Text>
            <Text style={styles.bandBlockedHint}>Tap to go there</Text>
          </Pressable>
        ) : published ? (
          <View style={styles.bandDone}>
            <Text style={styles.bandDoneTitle}>Listing published</Text>
            <Text style={styles.bandDoneHint}>Visible to buyers now, at {priceLine}</Text>
          </View>
        ) : (
          <Pressable
            onPress={handlePublish}
            accessibilityRole="button"
            accessibilityLabel={`Publish listing at ${priceLine}`}
            style={({ pressed }) => [styles.bandReady, pressed && styles.bandPressed]}
          >
            <Text style={styles.bandReadyTitle}>Publish listing</Text>
            <Text style={styles.bandReadyHint}>{priceLine} · visible to buyers immediately</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  header: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(2),
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
    marginTop: tokens.space(1),
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
  },

  stepBar: {
    flexGrow: 0,
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  stepBarContent: {
    paddingHorizontal: tokens.space(5),
    paddingBottom: tokens.space(3),
    gap: tokens.space(4),
  },
  stepPip: {
    alignItems: "center",
    gap: tokens.space(1),
    minWidth: 56,
  },
  stepDot: {
    width: 26,
    height: 26,
    borderRadius: tokens.radius.sm,
    borderWidth: 1.5,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotCurrent: {
    borderColor: tokens.color.accent,
  },
  stepDotDone: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  stepDotNum: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.faint,
  },
  stepDotNumCurrent: {
    color: tokens.color.accent,
  },
  stepDotCheck: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  stepPipLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: tokens.color.faint,
  },
  stepPipLabelCurrent: {
    color: tokens.color.ink,
  },

  body: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: tokens.space(5),
    paddingBottom: tokens.space(6),
  },

  stepIntro: {
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(3),
  },
  stepKicker: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: tokens.color.faint,
  },
  stepTitle: {
    marginTop: tokens.space(1),
    fontSize: 20,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  stepLede: {
    marginTop: tokens.space(1),
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
  },

  footerNote: {
    marginTop: tokens.space(3),
    fontSize: 12,
    lineHeight: 18,
    color: tokens.color.faint,
  },

  // Photos step
  photoRow: {
    gap: tokens.space(3),
    marginBottom: tokens.space(3),
  },
  photoSlot: {
    flex: 1,
    aspectRatio: 1,
    minHeight: 44,
    borderRadius: tokens.radius.md,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    alignItems: "center",
    justifyContent: "center",
    gap: tokens.space(1),
  },
  photoSlotFilled: {
    borderStyle: "solid",
    borderColor: tokens.color.accent,
  },
  photoSlotPressed: {
    opacity: 0.75,
  },
  photoThumb: {
    width: "60%",
    height: "40%",
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
  },
  photoPlus: {
    fontSize: 22,
    fontWeight: "300",
    color: tokens.color.faint,
  },
  photoSlotLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: tokens.color.muted,
  },

  // Details step
  detailsHeader: {
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(2),
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  sectionHint: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 18,
    color: tokens.color.muted,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    minHeight: 44,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(3),
    marginBottom: tokens.space(2),
    backgroundColor: tokens.color.bg,
  },
  optionRowSelected: {
    borderColor: tokens.color.accent,
  },
  optionRowPressed: {
    opacity: 0.75,
  },
  optionMarker: {
    width: 22,
    height: 22,
    borderRadius: tokens.radius.sm,
    borderWidth: 1.5,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  optionMarkerSelected: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  optionMarkerCheck: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  optionBody: {
    flex: 1,
    gap: 2,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  optionLabelSelected: {
    color: tokens.color.ink,
  },
  optionDescription: {
    fontSize: 12,
    lineHeight: 17,
    color: tokens.color.faint,
  },

  // Price step
  refCard: {
    marginTop: tokens.space(2),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    gap: tokens.space(2),
  },
  refCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  refCardMeta: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  refRow: {
    flexDirection: "row",
    marginTop: tokens.space(1),
    gap: tokens.space(3),
  },
  refCol: {
    flex: 1,
    gap: 2,
  },
  refColLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: tokens.color.faint,
  },
  refColValue: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
  refColValueTypical: {
    fontSize: 14,
    fontWeight: "800",
    color: tokens.color.accent,
  },

  priceField: {
    marginTop: tokens.space(5),
    gap: tokens.space(2),
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  priceCurrent: {
    marginTop: tokens.space(1),
  },
  priceCurrentSymbol: {
    fontSize: 22,
    fontWeight: "800",
    color: tokens.color.ink,
  },
  priceCurrentDigits: {
    fontSize: 30,
    fontWeight: "800",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  fieldError: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(2),
    marginTop: tokens.space(1),
  },
  stepperBtn: {
    width: 44,
    height: 44,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.color.bg,
  },
  stepperBtnDisabled: {
    opacity: 0.4,
  },
  stepperBtnPressed: {
    opacity: 0.7,
  },
  stepperBtnText: {
    fontSize: 20,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  stepperBtnTextDisabled: {
    color: tokens.color.faint,
  },
  priceInput: {
    flex: 1,
    minHeight: 44,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(3),
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
  },

  presetRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 44,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(3),
    marginBottom: tokens.space(2),
    backgroundColor: tokens.color.bg,
  },
  presetRowSelected: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  presetRowPressed: {
    opacity: 0.8,
  },
  presetLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  presetLabelSelected: {
    color: tokens.color.onAccent,
  },
  presetValue: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  presetValueSelected: {
    color: tokens.color.onAccent,
  },

  // Review step
  summaryCard: {
    marginTop: tokens.space(2),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(4),
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.space(3),
    paddingVertical: tokens.space(3),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  summaryRowLast: {
    borderBottomWidth: 0,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.faint,
  },
  summaryRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  summaryPriceDigits: {
    fontSize: 16,
    fontWeight: "800",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  summaryEdit: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.accent,
    minHeight: 44,
    textAlignVertical: "center",
  },

  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    minHeight: 44,
    paddingVertical: tokens.space(2),
  },
  checkRowPressed: {
    opacity: 0.7,
  },
  checkMarker: {
    width: 22,
    height: 22,
    borderRadius: tokens.radius.sm,
    borderWidth: 1.5,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkMarkerDone: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  checkMarkerGlyph: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  checkLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.muted,
  },
  checkLabelDone: {
    color: tokens.color.ink,
  },

  publishedNote: {
    marginTop: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.accent,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
  },
  publishedNoteText: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.ink,
  },

  // Won helper
  wonRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  wonSymbol: {
    color: tokens.color.ink,
  },
  wonDigits: {
    color: tokens.color.ink,
  },

  // Bottom fixed band (state machine)
  band: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(3),
  },
  bandPressed: {
    opacity: 0.85,
  },
  bandBlocked: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    borderWidth: 1.5,
    borderColor: tokens.color.ink2,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 2,
  },
  bandBlockedTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  bandBlockedHint: {
    fontSize: 12,
    color: tokens.color.muted,
  },
  bandReady: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 2,
  },
  bandReadyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  bandReadyHint: {
    fontSize: 12,
    color: tokens.color.onAccent,
  },
  bandDone: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    borderWidth: 1.5,
    borderColor: tokens.color.accent,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 2,
  },
  bandDoneTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  bandDoneHint: {
    fontSize: 12,
    color: tokens.color.muted,
  },
});
