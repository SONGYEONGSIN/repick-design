import React, { useMemo, useState } from "react";
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
  ITEM,
  GRADES,
  GRADE_LABEL,
  INCLUDED_ITEMS,
  MAX_EXTRA_BATTERIES,
  PHOTO_SLOTS,
  estimateFor,
  type Comparable,
  type GradeId,
} from "./data";

const money = (value: number) => `$${value}`;

export function SellPriceGuide() {
  const [grade, setGrade] = useState<GradeId | null>(null);
  const [included, setIncluded] = useState<string[]>([]);
  const [includedTouched, setIncludedTouched] = useState(false);
  const [extras, setExtras] = useState(0);
  const [extrasTouched, setExtrasTouched] = useState(false);

  const est = useMemo(
    () =>
      estimateFor({
        grade,
        included,
        includedTouched,
        extras,
        extrasTouched,
      }),
    [grade, included, includedTouched, extras, extrasTouched],
  );

  const toggleIncluded = (id: string) => {
    setIncludedTouched(true);
    setIncluded((prev) =>
      prev.includes(id) ? prev.filter((entry) => entry !== id) : [...prev, id],
    );
  };

  const stepExtras = (delta: number) => {
    setExtrasTouched(true);
    setExtras((prev) =>
      Math.min(MAX_EXTRA_BATTERIES, Math.max(0, prev + delta)),
    );
  };

  const segments = [
    { key: "Grade", done: grade !== null },
    { key: "Included", done: includedTouched },
    { key: "Extras", done: extrasTouched },
  ];

  const renderComparable = ({ item }: { item: Comparable }) => (
    <View
      style={styles.compRow}
      accessible
      accessibilityLabel={`${item.title}, ${GRADE_LABEL[item.grade]} condition, sold for ${money(
        item.price,
      )}, ${item.soldDaysAgo} days ago. ${item.note}`}
    >
      <View style={styles.compMain}>
        <Text style={styles.compTitle}>{item.title}</Text>
        <Text style={styles.compMeta}>
          {`${GRADE_LABEL[item.grade]} - sold ${item.soldDaysAgo} days ago`}
        </Text>
        <Text style={styles.compNote}>{item.note}</Text>
      </View>
      <View style={styles.compPriceCol}>
        <Text style={styles.compPrice}>{money(item.price)}</Text>
        {grade === item.grade ? (
          <Text style={styles.compMatch}>Grade match</Text>
        ) : null}
      </View>
    </View>
  );

  const header = (
    <View>
      <Text style={styles.eyebrow}>Selling</Text>
      <Text style={styles.heading} accessibilityRole="header">
        Your price sharpens as you describe it
      </Text>
      <Text style={styles.itemTitle}>{ITEM.title}</Text>
      <Text style={styles.itemSub}>{ITEM.subtitle}</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel} accessibilityRole="header">
          Suggested asking range
        </Text>
        <Text style={styles.price}>
          {`${money(est.low)} - ${money(est.high)}`}
        </Text>
        <View style={styles.track}>
          <View
            style={[
              styles.fill,
              { left: `${est.leftPct}%`, width: `${est.widthPct}%` },
            ]}
          />
        </View>
        <View style={styles.trackScale}>
          <Text style={styles.scaleText}>{money(ITEM.marketFloor)}</Text>
          <Text style={styles.scaleText}>{money(ITEM.marketCeiling)}</Text>
        </View>
        <Text style={styles.cardCaption}>
          {`Spread ${money(est.spread)} inside the ${money(ITEM.marketFloor)} to ${money(
            ITEM.marketCeiling,
          )} market band for this model.`}
        </Text>
        <Text style={styles.cardCaption}>
          {`${est.confidence} estimate - built from ${est.matchedCount} sold listings in the last 60 days.`}
        </Text>
        <View style={styles.nextRow}>
          <Text style={styles.nextTag}>Next</Text>
          <Text style={styles.nextText}>{est.nextStep}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle} accessibilityRole="header">
        What moves this range
      </Text>
      {est.factors.length === 0 ? (
        <Text style={styles.emptyFactor}>
          No condition details yet, so the range still covers every grade from
          heavily used to near mint.
        </Text>
      ) : (
        est.factors.map((factor) => (
          <View key={factor.id} style={styles.factorRow}>
            <Text style={styles.factorLabel}>{factor.label}</Text>
            <Text
              style={
                factor.direction === "up"
                  ? styles.factorUp
                  : styles.factorDown
              }
            >
              {`${factor.direction === "up" ? "raises" : "lowers"} ${money(
                Math.abs(factor.amount),
              )}`}
            </Text>
          </View>
        ))
      )}

      <Text style={styles.sectionTitle} accessibilityRole="header">
        Condition grade
      </Text>
      <Text style={styles.sectionHint}>
        One tap. This is the single biggest cut to the spread.
      </Text>
      <View style={styles.chipRow}>
        {GRADES.map((option) => {
          const selected = grade === option.id;
          return (
            <Pressable
              key={option.id}
              onPress={() => setGrade(selected ? null : option.id)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`${option.label} condition. ${option.blurb}`}
              style={({ pressed }) => [
                styles.chip,
                selected && styles.chipSelected,
                pressed && styles.pressed,
              ]}
            >
              <Text
                style={[styles.chipLabel, selected && styles.chipLabelSelected]}
              >
                {selected ? `${option.label} - selected` : option.label}
              </Text>
              <Text
                style={[styles.chipBlurb, selected && styles.chipBlurbSelected]}
              >
                {option.blurb}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.sectionTitle} accessibilityRole="header">
        What ships in the box
      </Text>
      <Text style={styles.sectionHint}>
        Tap every part you still have. Each one moves the range on its own.
      </Text>
      {INCLUDED_ITEMS.map((entry) => {
        const checked = included.includes(entry.id);
        return (
          <Pressable
            key={entry.id}
            onPress={() => toggleIncluded(entry.id)}
            hitSlop={6}
            accessibilityRole="checkbox"
            accessibilityState={{ checked }}
            accessibilityLabel={`${entry.label}, worth ${money(entry.value)}. ${entry.hint}`}
            style={({ pressed }) => [styles.checkRow, pressed && styles.pressed]}
          >
            <View style={[styles.box, checked && styles.boxChecked]}>
              {checked ? <View style={styles.boxMark} /> : null}
            </View>
            <View style={styles.checkMain}>
              <Text style={styles.checkLabel}>{entry.label}</Text>
              <Text style={styles.checkHint}>{entry.hint}</Text>
            </View>
            <Text style={checked ? styles.checkValueOn : styles.checkValue}>
              {checked ? `added ${money(entry.value)}` : `+${money(entry.value)}`}
            </Text>
          </Pressable>
        );
      })}

      <Text style={styles.sectionTitle} accessibilityRole="header">
        Spare batteries
      </Text>
      <Text style={styles.sectionHint}>
        Buyers of this body almost always ask. Zero is a valid answer.
      </Text>
      <View style={styles.stepper}>
        <Pressable
          onPress={() => stepExtras(-1)}
          disabled={extras === 0}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Remove one spare battery"
          accessibilityState={{ disabled: extras === 0 }}
          style={({ pressed }) => [
            styles.stepBtn,
            extras === 0 && styles.stepBtnOff,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.stepGlyph}>Less</Text>
        </Pressable>
        <View style={styles.stepValueWrap}>
          <Text style={styles.stepValue}>{`${extras}`}</Text>
          <Text style={styles.stepUnit}>
            {extras === 1 ? "battery" : "batteries"}
          </Text>
        </View>
        <Pressable
          onPress={() => stepExtras(1)}
          disabled={extras === MAX_EXTRA_BATTERIES}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Add one spare battery"
          accessibilityState={{ disabled: extras === MAX_EXTRA_BATTERIES }}
          style={({ pressed }) => [
            styles.stepBtn,
            extras === MAX_EXTRA_BATTERIES && styles.stepBtnOff,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.stepGlyph}>More</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle} accessibilityRole="header">
        Photos
      </Text>
      <Text style={styles.sectionHint}>
        Optional here. Photos build buyer trust but never change the estimate.
      </Text>
      <View style={styles.photoRow}>
        {PHOTO_SLOTS.map((slot, index) => (
          <Pressable
            key={slot.id}
            hitSlop={4}
            accessibilityRole="button"
            accessibilityLabel={`Add ${slot.label}, photo ${index + 1} of ${PHOTO_SLOTS.length}`}
            style={({ pressed }) => [styles.photoSlot, pressed && styles.pressed]}
          >
            <Text style={styles.photoIndex}>{`${index + 1}`}</Text>
            <Text style={styles.photoLabel}>{slot.label}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle} accessibilityRole="header">
        Comparable sales
      </Text>
      <Text style={styles.sectionHint}>
        {`Showing ${est.comparables.length} of ${est.matchedCount} matching sales${
          grade ? ` at ${GRADE_LABEL[grade]} grade` : " across all grades"
        }.`}
      </Text>
    </View>
  );

  const footer = (
    <View style={styles.footer}>
      <Text style={styles.footerNote}>{est.nextStep}</Text>
      <Pressable
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`Review listing at ${money(est.low)} to ${money(est.high)}`}
        style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
      >
        <Text style={styles.ctaLabel}>
          {`Review listing at ${money(est.low)} - ${money(est.high)}`}
        </Text>
      </Pressable>
      <Text style={styles.footerFine}>
        Nothing is published yet. You can edit every answer after review.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.band}>
        <View style={styles.bandTop}>
          <Text style={styles.bandTitle}>Listing draft</Text>
          <Text style={styles.bandCount}>
            {`${est.signals} of 3 details set`}
          </Text>
        </View>
        <View style={styles.segRow}>
          {segments.map((segment) => (
            <View key={segment.key} style={styles.segCol}>
              <View
                style={[styles.segBar, segment.done && styles.segBarDone]}
              />
              <Text style={styles.segLabel}>
                {`${segment.key} ${segment.done ? "set" : "open"}`}
              </Text>
            </View>
          ))}
        </View>
        <View
          style={styles.bandRange}
          accessible
          accessibilityLabel={`Current suggested range, ${est.low} to ${est.high} dollars, spread ${est.spread} dollars, ${est.confidence} confidence`}
        >
          <Text style={styles.bandPrice}>
            {`${money(est.low)} - ${money(est.high)}`}
          </Text>
          <Text style={styles.bandSpread}>
            {`spread ${money(est.spread)} - ${est.confidence}`}
          </Text>
        </View>
      </View>

      <FlatList
        data={est.comparables}
        keyExtractor={(item) => item.id}
        renderItem={renderComparable}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  band: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(3),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  bandTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bandTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink,
    letterSpacing: 0.2,
  },
  bandCount: {
    fontSize: 12,
    color: tokens.color.muted,
  },
  segRow: {
    flexDirection: "row",
    marginTop: tokens.space(2),
  },
  segCol: {
    flex: 1,
    marginRight: tokens.space(2),
  },
  segBar: {
    height: 4,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.border,
  },
  segBarDone: {
    backgroundColor: tokens.color.accent,
  },
  segLabel: {
    marginTop: tokens.space(1),
    fontSize: 11,
    color: tokens.color.faint,
  },
  bandRange: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginTop: tokens.space(3),
  },
  bandPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  bandSpread: {
    fontSize: 12,
    color: tokens.color.muted,
  },
  listContent: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(5),
    paddingBottom: tokens.space(10),
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: tokens.color.accent,
    fontWeight: "700",
  },
  heading: {
    marginTop: tokens.space(2),
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  itemTitle: {
    marginTop: tokens.space(4),
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  itemSub: {
    marginTop: tokens.space(1),
    fontSize: 13,
    color: tokens.color.faint,
  },
  card: {
    marginTop: tokens.space(4),
    padding: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.bg,
  },
  cardLabel: {
    fontSize: 12,
    color: tokens.color.muted,
    fontWeight: "600",
  },
  price: {
    marginTop: tokens.space(1),
    fontSize: 34,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  track: {
    marginTop: tokens.space(3),
    height: 10,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.border,
    overflow: "hidden",
  },
  fill: {
    position: "absolute",
    top: 0,
    bottom: 0,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
  },
  trackScale: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: tokens.space(1),
  },
  scaleText: {
    fontSize: 11,
    color: tokens.color.faint,
  },
  cardCaption: {
    marginTop: tokens.space(2),
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
  },
  nextRow: {
    marginTop: tokens.space(3),
    paddingTop: tokens.space(3),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  nextTag: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: tokens.color.accent,
    marginRight: tokens.space(2),
    marginTop: 1,
  },
  nextText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.ink2,
  },
  sectionTitle: {
    marginTop: tokens.space(7),
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  sectionHint: {
    marginTop: tokens.space(1),
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
  },
  emptyFactor: {
    marginTop: tokens.space(2),
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
  },
  factorRow: {
    marginTop: tokens.space(2),
    paddingBottom: tokens.space(2),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  factorLabel: {
    flex: 1,
    fontSize: 14,
    color: tokens.color.ink2,
  },
  factorUp: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.accent,
  },
  factorDown: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.faint,
  },
  chipRow: {
    marginTop: tokens.space(3),
  },
  chip: {
    minHeight: 44,
    paddingVertical: tokens.space(3),
    paddingHorizontal: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    marginBottom: tokens.space(2),
    justifyContent: "center",
  },
  chipSelected: {
    backgroundColor: tokens.color.accent,
    borderColor: tokens.color.accent,
  },
  chipLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  chipLabelSelected: {
    color: tokens.color.onAccent,
  },
  chipBlurb: {
    marginTop: 2,
    fontSize: 12,
    color: tokens.color.muted,
  },
  chipBlurbSelected: {
    color: tokens.color.onAccent,
  },
  checkRow: {
    minHeight: 44,
    marginTop: tokens.space(2),
    paddingVertical: tokens.space(2),
    flexDirection: "row",
    alignItems: "center",
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.faint,
    alignItems: "center",
    justifyContent: "center",
  },
  boxChecked: {
    backgroundColor: tokens.color.accent,
    borderColor: tokens.color.accent,
  },
  boxMark: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: tokens.color.onAccent,
  },
  checkMain: {
    flex: 1,
    paddingHorizontal: tokens.space(3),
  },
  checkLabel: {
    fontSize: 15,
    color: tokens.color.ink,
  },
  checkHint: {
    marginTop: 2,
    fontSize: 12,
    color: tokens.color.faint,
  },
  checkValue: {
    fontSize: 13,
    color: tokens.color.muted,
  },
  checkValueOn: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.accent,
  },
  stepper: {
    marginTop: tokens.space(3),
    flexDirection: "row",
    alignItems: "center",
  },
  stepBtn: {
    minWidth: 72,
    minHeight: 44,
    paddingHorizontal: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  stepBtnOff: {
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.border,
  },
  stepGlyph: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  stepValueWrap: {
    flex: 1,
    alignItems: "center",
  },
  stepValue: {
    fontSize: 24,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  stepUnit: {
    fontSize: 12,
    color: tokens.color.muted,
  },
  photoRow: {
    marginTop: tokens.space(3),
    flexDirection: "row",
  },
  photoSlot: {
    flex: 1,
    height: 80,
    marginRight: tokens.space(2),
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  photoIndex: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.faint,
  },
  photoLabel: {
    marginTop: 2,
    fontSize: 11,
    color: tokens.color.faint,
  },
  compRow: {
    marginTop: tokens.space(3),
    paddingBottom: tokens.space(3),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  compMain: {
    flex: 1,
    paddingRight: tokens.space(3),
  },
  compTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  compMeta: {
    marginTop: 2,
    fontSize: 12,
    color: tokens.color.muted,
  },
  compNote: {
    marginTop: 2,
    fontSize: 12,
    color: tokens.color.faint,
  },
  compPriceCol: {
    alignItems: "flex-end",
  },
  compPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  compMatch: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: "600",
    color: tokens.color.accent,
  },
  footer: {
    marginTop: tokens.space(6),
  },
  footerNote: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.ink2,
  },
  cta: {
    marginTop: tokens.space(3),
    minHeight: 48,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
  },
  ctaPressed: {
    opacity: 0.82,
  },
  ctaLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  footerFine: {
    marginTop: tokens.space(2),
    fontSize: 12,
    color: tokens.color.faint,
  },
  pressed: {
    opacity: 0.72,
  },
});
