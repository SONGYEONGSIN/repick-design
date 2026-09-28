// native/src/evolve/r26/a/WarrantyClaimScreen.tsx
import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  type LayoutChangeEvent,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  DEFECT_OPTIONS,
  DefectCode,
  DefectOption,
  EVIDENCE_POOL,
  MAX_EVIDENCE_SHOTS,
  RemedyCode,
  REMEDY_INFO,
  CLAIM_ITEM,
  warrantyDaysRemaining,
  computeRefundKrw,
  formatKrw,
  buildClaimReference,
} from "./data";

type CheckpointKey = "defect" | "evidence" | "remedy";

interface EvidenceShot {
  id: string;
  caption: string;
  swatch: 1 | 2 | 3;
}

export function WarrantyClaimScreen() {
  const [activeDefect, setActiveDefect] = useState<DefectCode | null>(null);
  const [shots, setShots] = useState<EvidenceShot[]>([]);
  const [remedyChoice, setRemedyChoice] = useState<RemedyCode | null>(null);
  const [claimStage, setClaimStage] = useState<"open" | "filed">("open");
  const [claimNumber, setClaimNumber] = useState<string | null>(null);

  const checkpointY = useRef<Partial<Record<CheckpointKey, number>>>({});
  const paperTrail = useRef<ScrollView>(null);

  const selectedDefectOption: DefectOption | null = useMemo(
    () => DEFECT_OPTIONS.find((d) => d.code === activeDefect) ?? null,
    [activeDefect],
  );

  const remedyUnlocked = !!activeDefect && shots.length >= 1;

  const refundValueKrw = useMemo(() => computeRefundKrw(), []);

  const nextCheckpoint: CheckpointKey | null = useMemo(() => {
    if (!activeDefect) return "defect";
    if (shots.length < 1) return "evidence";
    if (!remedyChoice) return "remedy";
    return null;
  }, [activeDefect, shots.length, remedyChoice]);

  function retractIfFiled() {
    if (claimStage === "filed") {
      setClaimStage("open");
      setClaimNumber(null);
    }
  }

  function handleSelectDefect(code: DefectCode) {
    retractIfFiled();
    setActiveDefect(code);
    const option = DEFECT_OPTIONS.find((d) => d.code === code);
    if (remedyChoice === "refund" && option && !option.refundReady) {
      setRemedyChoice(null);
    }
  }

  function handleAddShot() {
    retractIfFiled();
    if (shots.length >= MAX_EVIDENCE_SHOTS) return;
    const next = EVIDENCE_POOL[shots.length % EVIDENCE_POOL.length];
    setShots((prev) => [
      ...prev,
      { id: `shot-${prev.length + 1}`, caption: next.caption, swatch: next.swatch },
    ]);
  }

  function handleRemoveShot(id: string) {
    retractIfFiled();
    setShots((prev) => prev.filter((s) => s.id !== id));
  }

  function handleChooseRemedy(code: RemedyCode) {
    if (!remedyUnlocked) return;
    if (code === "refund" && selectedDefectOption && !selectedDefectOption.refundReady) return;
    retractIfFiled();
    setRemedyChoice(code);
  }

  function fileClaim() {
    const defect = activeDefect;
    const remedy = remedyChoice;
    if (nextCheckpoint || !defect || !remedy) return;
    setClaimNumber(buildClaimReference(defect, remedy));
    setClaimStage("filed");
  }

  function handleEditClaim() {
    setClaimStage("open");
    setClaimNumber(null);
  }

  function steerToCheckpoint(step: CheckpointKey) {
    const y = checkpointY.current[step];
    if (typeof y === "number") {
      paperTrail.current?.scrollTo({ y: Math.max(y - tokens.space(4), 0), animated: true });
    }
  }

  function handleRailPress() {
    if (claimStage === "filed") {
      handleEditClaim();
      return;
    }
    if (nextCheckpoint) {
      steerToCheckpoint(nextCheckpoint);
      return;
    }
    fileClaim();
  }

  function railMessage(): string {
    if (claimStage === "filed" && claimNumber) {
      return `Claim ${claimNumber} submitted. Repick will respond within 2 business days.`;
    }
    switch (nextCheckpoint) {
      case "defect":
        return "Select what's wrong with the camera to start your claim.";
      case "evidence":
        return "Add at least one photo showing the defect before you continue.";
      case "remedy":
        return "Choose how you'd like this resolved to finish your claim.";
      default:
        return "Everything looks good. Review the summary below, then submit.";
    }
  }

  function railActionLabel(): string {
    if (claimStage === "filed") return "Edit claim";
    switch (nextCheckpoint) {
      case "defect":
        return "Go to defect category";
      case "evidence":
        return "Go to evidence photos";
      case "remedy":
        return "Go to remedy";
      default:
        return "Submit claim";
    }
  }

  function describeRemedy(code: RemedyCode): string {
    if (code === "repair") {
      return selectedDefectOption
        ? `Estimated ${selectedDefectOption.repairBusinessDays} business days`
        : "Select a defect to see turnaround";
    }
    if (code === "replace") {
      return `${CLAIM_ITEM.replacementUnitsAvailable} refurbished unit(s) ready to ship`;
    }
    if (selectedDefectOption && !selectedDefectOption.refundReady) {
      return "Needs a physical inspection first";
    }
    return `KRW ${formatKrw(refundValueKrw)} to your original payment method`;
  }

  const coveragePct = Math.round((warrantyDaysRemaining() / CLAIM_ITEM.warrantyTotalDays) * 100);

  const registerCheckpoint = (key: CheckpointKey) => (event: LayoutChangeEvent) => {
    checkpointY.current[key] = event.nativeEvent.layout.y;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        ref={paperTrail}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.headerBlock}>
          <Text accessibilityRole="header" style={styles.heading}>
            File a Warranty Claim
          </Text>
          <Text style={styles.subheading}>
            Camera defect coverage for items bought through repick
          </Text>
        </View>

        <View style={styles.itemCard}>
          <Text style={styles.itemName}>{CLAIM_ITEM.name}</Text>
          <Text style={styles.itemMeta}>
            Order {CLAIM_ITEM.orderId} · Purchased {CLAIM_ITEM.purchaseDateLabel}
          </Text>
          <View style={styles.coverageTrack}>
            <View style={[styles.coverageFill, { width: `${coveragePct}%` }]} />
          </View>
          <Text style={styles.coverageLabel}>
            {warrantyDaysRemaining()} of {CLAIM_ITEM.warrantyTotalDays} coverage days left
          </Text>
        </View>

        <View style={styles.section} onLayout={registerCheckpoint("defect")}>
          <Text accessibilityRole="header" style={styles.sectionTitle}>
            1. What's the defect?
          </Text>
          <FlatList
            data={DEFECT_OPTIONS}
            keyExtractor={(item) => item.code}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.defectRow}
            renderItem={({ item }) => {
              const active = item.code === activeDefect;
              return (
                <Pressable
                  onPress={() => handleSelectDefect(item.code)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={`${item.title}. ${item.helper}`}
                  hitSlop={6}
                  style={({ pressed }) => [
                    styles.defectTile,
                    active && styles.defectTileActive,
                    pressed && styles.tilePressed,
                  ]}
                >
                  <Text style={[styles.defectTitle, active && styles.defectTitleActive]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.defectHelper, active && styles.defectHelperActive]}>
                    {item.helper}
                  </Text>
                </Pressable>
              );
            }}
          />
        </View>

        <View style={styles.section} onLayout={registerCheckpoint("evidence")}>
          <Text accessibilityRole="header" style={styles.sectionTitle}>
            2. Evidence photos
          </Text>
          <Text style={styles.sectionHint}>
            Attach at least 1 photo clearly showing the defect (up to {MAX_EVIDENCE_SHOTS}).
          </Text>
          {shots.length > 0 && (
            <FlatList
              data={shots}
              keyExtractor={(item) => item.id}
              numColumns={3}
              scrollEnabled={false}
              columnWrapperStyle={styles.evidenceRow}
              renderItem={({ item }) => (
                <View style={styles.evidenceTile}>
                  <View
                    style={[
                      styles.evidenceSwatch,
                      item.swatch === 1
                        ? styles.swatchOne
                        : item.swatch === 2
                          ? styles.swatchTwo
                          : styles.swatchThree,
                    ]}
                  />
                  <Text style={styles.evidenceCaption} numberOfLines={1}>
                    {item.caption}
                  </Text>
                  <Pressable
                    onPress={() => handleRemoveShot(item.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`Remove photo: ${item.caption}`}
                    hitSlop={10}
                    style={styles.evidenceRemove}
                  >
                    <Text style={styles.evidenceRemoveMark}>Remove</Text>
                  </Pressable>
                </View>
              )}
            />
          )}
          {shots.length < MAX_EVIDENCE_SHOTS ? (
            <Pressable
              onPress={handleAddShot}
              accessibilityRole="button"
              accessibilityLabel="Add an evidence photo"
              style={({ pressed }) => [styles.addShotButton, pressed && styles.tilePressed]}
            >
              <Text style={styles.addShotMark}>+</Text>
              <Text style={styles.addShotLabel}>Add photo</Text>
            </Pressable>
          ) : (
            <Text style={styles.sectionHint}>Maximum {MAX_EVIDENCE_SHOTS} photos attached.</Text>
          )}
        </View>

        <View style={styles.section} onLayout={registerCheckpoint("remedy")}>
          <Text accessibilityRole="header" style={styles.sectionTitle}>
            3. Choose your remedy
          </Text>
          {!remedyUnlocked && (
            <Text style={styles.sectionHint}>
              Complete the sections above to unlock remedy options.
            </Text>
          )}
          <FlatList
            data={REMEDY_INFO}
            keyExtractor={(item) => item.code}
            scrollEnabled={false}
            renderItem={({ item }) => {
              const isRefundBlocked =
                item.code === "refund" &&
                !!selectedDefectOption &&
                !selectedDefectOption.refundReady;
              const disabledCard = !remedyUnlocked || isRefundBlocked;
              const active = remedyChoice === item.code;
              return (
                <Pressable
                  disabled={disabledCard}
                  onPress={() => handleChooseRemedy(item.code)}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: disabledCard, selected: active }}
                  accessibilityLabel={`${item.title}. ${describeRemedy(item.code)}`}
                  style={({ pressed }) => [
                    styles.remedyCard,
                    active && styles.remedyCardActive,
                    disabledCard && styles.remedyCardDisabled,
                    pressed && !disabledCard && styles.tilePressed,
                  ]}
                >
                  <Text style={[styles.remedyTitle, disabledCard && styles.remedyTextDisabled]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.remedyDetail, disabledCard && styles.remedyTextDisabled]}>
                    {describeRemedy(item.code)}
                  </Text>
                </Pressable>
              );
            }}
          />
        </View>

        <View style={styles.section}>
          <Text accessibilityRole="header" style={styles.sectionTitle}>
            4. Review
          </Text>
          {nextCheckpoint ? (
            <Text style={styles.sectionHint}>
              Finish the steps above to see your claim summary.
            </Text>
          ) : (
            <View
              style={[styles.summaryCard, claimStage === "filed" && styles.summaryCardFiled]}
            >
              <Text style={styles.summaryLine}>Defect: {selectedDefectOption?.title}</Text>
              <Text style={styles.summaryLine}>
                Evidence: {shots.length} photo{shots.length === 1 ? "" : "s"} attached
              </Text>
              <Text style={styles.summaryLine}>
                Remedy: {REMEDY_INFO.find((r) => r.code === remedyChoice)?.title} —{" "}
                {remedyChoice ? describeRemedy(remedyChoice) : ""}
              </Text>
              {claimStage === "filed" && claimNumber && (
                <Text style={styles.summaryRef}>Reference {claimNumber}</Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <View accessibilityLiveRegion="polite" style={styles.railWrap}>
        <Text accessibilityRole="alert" style={styles.railMessage}>
          {railMessage()}
        </Text>
        <Pressable
          onPress={handleRailPress}
          accessibilityRole="button"
          accessibilityLabel={railActionLabel()}
          hitSlop={4}
          style={({ pressed }) => [styles.railButton, pressed && styles.railButtonPressed]}
        >
          <Text style={styles.railButtonText}>{railActionLabel()}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export default WarrantyClaimScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(36),
  },
  headerBlock: {
    marginBottom: tokens.space(4),
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subheading: {
    marginTop: tokens.space(1),
    fontSize: 14,
    color: tokens.color.muted,
  },
  itemCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    marginBottom: tokens.space(5),
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  itemMeta: {
    marginTop: tokens.space(1),
    fontSize: 13,
    color: tokens.color.faint,
  },
  coverageTrack: {
    marginTop: tokens.space(3),
    height: 6,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.border,
    overflow: "hidden",
  },
  coverageFill: {
    height: 6,
    backgroundColor: tokens.color.accent,
  },
  coverageLabel: {
    marginTop: tokens.space(2),
    fontSize: 12,
    color: tokens.color.muted,
  },
  section: {
    marginBottom: tokens.space(6),
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
    marginBottom: tokens.space(2),
  },
  sectionHint: {
    fontSize: 13,
    color: tokens.color.faint,
    marginBottom: tokens.space(2),
  },
  defectRow: {
    gap: tokens.space(2),
    marginBottom: tokens.space(2),
  },
  defectTile: {
    flex: 1,
    minHeight: 44,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  defectTileActive: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accentBg,
  },
  tilePressed: {
    opacity: 0.7,
  },
  defectTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  defectTitleActive: {
    color: tokens.color.accent,
  },
  defectHelper: {
    marginTop: tokens.space(1),
    fontSize: 11,
    color: tokens.color.faint,
  },
  defectHelperActive: {
    color: tokens.color.accent,
  },
  evidenceRow: {
    gap: tokens.space(2),
    marginBottom: tokens.space(2),
  },
  evidenceTile: {
    flex: 1,
    alignItems: "center",
  },
  evidenceSwatch: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: tokens.radius.sm,
  },
  swatchOne: {
    backgroundColor: tokens.color.swatch1,
  },
  swatchTwo: {
    backgroundColor: tokens.color.swatch2,
  },
  swatchThree: {
    backgroundColor: tokens.color.swatch3,
  },
  evidenceCaption: {
    marginTop: tokens.space(1),
    fontSize: 10,
    color: tokens.color.muted,
    textAlign: "center",
  },
  evidenceRemove: {
    marginTop: tokens.space(1),
    minHeight: 44,
    justifyContent: "center",
  },
  evidenceRemoveMark: {
    fontSize: 11,
    color: tokens.color.danger,
    fontWeight: "600",
  },
  addShotButton: {
    minHeight: 44,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: tokens.space(2),
    paddingVertical: tokens.space(3),
  },
  addShotMark: {
    fontSize: 16,
    color: tokens.color.accent,
    fontWeight: "700",
  },
  addShotLabel: {
    fontSize: 13,
    color: tokens.color.accent,
    fontWeight: "600",
  },
  remedyCard: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    marginBottom: tokens.space(2),
    backgroundColor: tokens.color.bg,
  },
  remedyCardActive: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accentBg,
  },
  remedyCardDisabled: {
    backgroundColor: tokens.color.bg,
    borderColor: tokens.color.border,
    opacity: 0.5,
  },
  remedyTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  remedyDetail: {
    marginTop: tokens.space(1),
    fontSize: 12,
    color: tokens.color.muted,
  },
  remedyTextDisabled: {
    color: tokens.color.faint,
  },
  summaryCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    gap: tokens.space(1),
  },
  summaryCardFiled: {
    borderColor: tokens.color.successBorder,
    backgroundColor: tokens.color.successBg,
  },
  summaryLine: {
    fontSize: 13,
    color: tokens.color.ink2,
  },
  summaryRef: {
    marginTop: tokens.space(2),
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.success,
  },
  railWrap: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
  },
  railMessage: {
    fontSize: 13,
    color: tokens.color.ink2,
    marginBottom: tokens.space(3),
  },
  railButton: {
    minHeight: 44,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  railButtonPressed: {
    opacity: 0.85,
  },
  railButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
});
