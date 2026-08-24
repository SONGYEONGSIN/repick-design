import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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
  BIO_MIN_LENGTH,
  CATEGORY_OPTIONS,
  HANDLING_TIME_OPTIONS,
  MAX_CATEGORY_SELECTION,
  PAYOUT_MOCK,
  SHIPPING_METHOD_OPTIONS,
  STEPS,
  STORE_NAME_MIN_LENGTH,
  type StepDef,
  type StepKey,
} from "./data";

type StepStatus = "completed" | "active" | "locked";
type PayoutStatus = "idle" | "connecting" | "connected";
type ActivationStatus = "idle" | "submitting" | "success";
type BandTone = "blocked" | "ready" | "loading" | "done";

type BandState = {
  tone: BandTone;
  message: string;
  ctaLabel: string;
};

export function SellerOnboardingSetupScreen() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [storeName, setStoreName] = useState("");
  const [bio, setBio] = useState("");
  const [storeNameTouched, setStoreNameTouched] = useState(false);
  const [bioTouched, setBioTouched] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [shippingMethod, setShippingMethod] = useState<string | null>(null);
  const [handlingTime, setHandlingTime] = useState<string | null>(null);

  const [payoutStatus, setPayoutStatus] = useState<PayoutStatus>("idle");
  const [activationStatus, setActivationStatus] = useState<ActivationStatus>("idle");

  const [highlightKey, setHighlightKey] = useState<StepKey | null>(null);

  const flatListRef = useRef<FlatList<StepDef>>(null);
  const stepOffsets = useRef<Partial<Record<StepKey, number>>>({});
  const storeNameRef = useRef<TextInput>(null);
  const bioRef = useRef<TextInput>(null);
  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const focusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const payoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (highlightTimer.current) clearTimeout(highlightTimer.current);
      if (focusTimer.current) clearTimeout(focusTimer.current);
      if (payoutTimer.current) clearTimeout(payoutTimer.current);
      if (activateTimer.current) clearTimeout(activateTimer.current);
    };
  }, []);

  const isProfileComplete =
    storeName.trim().length >= STORE_NAME_MIN_LENGTH && bio.trim().length >= BIO_MIN_LENGTH;
  const isCategoriesComplete = selectedCategories.length >= 1;
  const isShippingComplete = shippingMethod !== null && handlingTime !== null;
  const isPayoutComplete = payoutStatus === "connected";

  function getStepStatus(index: number): StepStatus {
    if (index < currentStepIndex) return "completed";
    if (index === currentStepIndex) return "active";
    return "locked";
  }

  function scrollToStep(key: StepKey) {
    const offset = stepOffsets.current[key];
    if (offset !== undefined) {
      flatListRef.current?.scrollToOffset({ offset: Math.max(offset - 12, 0), animated: true });
    }
  }

  function triggerHighlight(key: StepKey) {
    if (highlightTimer.current) clearTimeout(highlightTimer.current);
    setHighlightKey(key);
    highlightTimer.current = setTimeout(() => setHighlightKey(null), 900);
  }

  useEffect(() => {
    scrollToStep(STEPS[currentStepIndex].key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepIndex]);

  function toggleCategory(id: string) {
    setSelectedCategories((prev) => {
      if (prev.includes(id)) return prev.filter((c) => c !== id);
      if (prev.length >= MAX_CATEGORY_SELECTION) return prev;
      return [...prev, id];
    });
  }

  function handleConnectPayout() {
    setPayoutStatus("connecting");
    if (payoutTimer.current) clearTimeout(payoutTimer.current);
    payoutTimer.current = setTimeout(() => setPayoutStatus("connected"), 600);
  }

  function handleEditStep(index: number) {
    setCurrentStepIndex(index);
  }

  function handleActivate() {
    setActivationStatus("submitting");
    if (activateTimer.current) clearTimeout(activateTimer.current);
    activateTimer.current = setTimeout(() => setActivationStatus("success"), 900);
  }

  function focusMissingField() {
    const step = STEPS[currentStepIndex];
    if (step.key !== "profile") return;
    if (focusTimer.current) clearTimeout(focusTimer.current);
    if (storeName.trim().length < STORE_NAME_MIN_LENGTH) {
      focusTimer.current = setTimeout(() => storeNameRef.current?.focus(), 350);
    } else if (bio.trim().length < BIO_MIN_LENGTH) {
      focusTimer.current = setTimeout(() => bioRef.current?.focus(), 350);
    }
  }

  function computeBand(): BandState {
    if (activationStatus === "success") {
      return {
        tone: "done",
        message: "Store activated. You can publish your first listing now.",
        ctaLabel: "Activated",
      };
    }
    if (activationStatus === "submitting") {
      return { tone: "loading", message: "Activating your store…", ctaLabel: "Activating" };
    }

    const step = STEPS[currentStepIndex];

    if (step.key === "profile") {
      if (storeName.trim().length < STORE_NAME_MIN_LENGTH) {
        return {
          tone: "blocked",
          message: `Enter a store name (at least ${STORE_NAME_MIN_LENGTH} characters) to continue.`,
          ctaLabel: "Go to store name",
        };
      }
      if (bio.trim().length < BIO_MIN_LENGTH) {
        return {
          tone: "blocked",
          message: `Add a short shop bio (at least ${BIO_MIN_LENGTH} characters) to continue.`,
          ctaLabel: "Go to shop bio",
        };
      }
      return { tone: "ready", message: "Store profile looks good.", ctaLabel: "Continue to Category Focus" };
    }

    if (step.key === "categories") {
      if (!isCategoriesComplete) {
        return {
          tone: "blocked",
          message: "Select at least 1 category you plan to sell in.",
          ctaLabel: "Go to categories",
        };
      }
      const count = selectedCategories.length;
      return {
        tone: "ready",
        message: `${count} categor${count === 1 ? "y" : "ies"} selected.`,
        ctaLabel: "Continue to Shipping Setup",
      };
    }

    if (step.key === "shipping") {
      if (!shippingMethod) {
        return {
          tone: "blocked",
          message: "Choose how you'll ship orders to continue.",
          ctaLabel: "Go to shipping method",
        };
      }
      if (!handlingTime) {
        return {
          tone: "blocked",
          message: "Choose a typical handling time to continue.",
          ctaLabel: "Go to handling time",
        };
      }
      return { tone: "ready", message: "Shipping preferences saved.", ctaLabel: "Continue to Payout Account" };
    }

    if (step.key === "payout") {
      if (!isPayoutComplete) {
        return {
          tone: "blocked",
          message: "Connect a payout account to receive funds from sales.",
          ctaLabel: "Go to payout account",
        };
      }
      return { tone: "ready", message: "Payout account connected.", ctaLabel: "Continue to Review" };
    }

    // review
    return {
      tone: "ready",
      message: "Everything above is saved. Activate your store to start selling.",
      ctaLabel: "Activate store",
    };
  }

  function handleBandPress() {
    const band = computeBand();
    if (band.tone === "loading" || band.tone === "done") return;

    if (band.tone === "blocked") {
      scrollToStep(STEPS[currentStepIndex].key);
      triggerHighlight(STEPS[currentStepIndex].key);
      focusMissingField();
      return;
    }

    if (STEPS[currentStepIndex].key === "review") {
      handleActivate();
      return;
    }

    setCurrentStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function renderCompletedSummary(key: StepKey): string {
    switch (key) {
      case "profile": {
        const name = storeName.trim().length > 0 ? storeName : "Untitled store";
        const bioExcerpt = bio.length > 60 ? `${bio.slice(0, 60)}…` : bio;
        return `${name} — ${bioExcerpt}`;
      }
      case "categories":
        return selectedCategories
          .map((id) => CATEGORY_OPTIONS.find((c) => c.id === id)?.label)
          .filter(Boolean)
          .join(", ");
      case "shipping": {
        const m = SHIPPING_METHOD_OPTIONS.find((s) => s.id === shippingMethod)?.label ?? "";
        const h = HANDLING_TIME_OPTIONS.find((h) => h.id === handlingTime)?.label ?? "";
        return `${m} · ${h}`;
      }
      case "payout":
        return `${PAYOUT_MOCK.bankName}, account ending ${PAYOUT_MOCK.accountLast4}`;
      case "review":
        return "";
    }
  }

  function renderActiveForm(key: StepKey) {
    if (key === "profile") {
      const nameInvalid = storeNameTouched && storeName.trim().length < STORE_NAME_MIN_LENGTH;
      const bioInvalid = bioTouched && bio.trim().length < BIO_MIN_LENGTH;
      return (
        <View>
          <Text style={styles.fieldLabel}>
            Store name<Text style={styles.required}> *</Text>
          </Text>
          <TextInput
            ref={storeNameRef}
            value={storeName}
            onChangeText={setStoreName}
            onBlur={() => setStoreNameTouched(true)}
            placeholder="e.g. Maple Closet"
            placeholderTextColor={tokens.color.faint}
            style={styles.textInput}
            accessibilityLabel="Store name"
          />
          {nameInvalid ? (
            <Text style={styles.errorText}>Required — at least {STORE_NAME_MIN_LENGTH} characters.</Text>
          ) : null}

          <Text style={[styles.fieldLabel, styles.fieldLabelSpaced]}>
            Shop bio<Text style={styles.required}> *</Text>
          </Text>
          <TextInput
            ref={bioRef}
            value={bio}
            onChangeText={setBio}
            onBlur={() => setBioTouched(true)}
            placeholder="Tell buyers what your store is about"
            placeholderTextColor={tokens.color.faint}
            style={[styles.textInput, styles.textArea]}
            multiline
            numberOfLines={3}
            accessibilityLabel="Shop bio"
          />
          {bioInvalid ? (
            <Text style={styles.errorText}>Required — at least {BIO_MIN_LENGTH} characters.</Text>
          ) : (
            <Text style={styles.helperText}>
              {bio.trim().length}/{BIO_MIN_LENGTH} characters minimum
            </Text>
          )}
        </View>
      );
    }

    if (key === "categories") {
      return (
        <View>
          <Text style={styles.fieldLabel}>
            Pick up to {MAX_CATEGORY_SELECTION} categories<Text style={styles.required}> *</Text>
          </Text>
          <View style={styles.chipRow}>
            {CATEGORY_OPTIONS.map((opt) => {
              const selected = selectedCategories.includes(opt.id);
              return (
                <Pressable
                  key={opt.id}
                  onPress={() => toggleCategory(opt.id)}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={`${opt.label}${selected ? ", selected" : ""}`}
                  style={[styles.chip, selected && styles.chipSelected]}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {selected ? "✓ " : ""}
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={styles.helperText}>
            Selected {selectedCategories.length}/{MAX_CATEGORY_SELECTION}
          </Text>
        </View>
      );
    }

    if (key === "shipping") {
      return (
        <View>
          <Text style={styles.fieldLabel}>
            Shipping method<Text style={styles.required}> *</Text>
          </Text>
          {SHIPPING_METHOD_OPTIONS.map((opt) => {
            const selected = shippingMethod === opt.id;
            return (
              <Pressable
                key={opt.id}
                onPress={() => setShippingMethod(opt.id)}
                hitSlop={8}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                accessibilityLabel={opt.label}
                style={[styles.radioRow, selected && styles.radioRowSelected]}
              >
                <View style={[styles.radioDot, selected && styles.radioDotSelected]} />
                <View style={styles.radioTextWrap}>
                  <Text style={styles.radioLabel}>{opt.label}</Text>
                  <Text style={styles.radioHelper}>{opt.helper}</Text>
                </View>
              </Pressable>
            );
          })}

          <Text style={[styles.fieldLabel, styles.fieldLabelSpaced]}>
            Typical handling time<Text style={styles.required}> *</Text>
          </Text>
          <View style={styles.segmentRow}>
            {HANDLING_TIME_OPTIONS.map((opt) => {
              const selected = handlingTime === opt.id;
              return (
                <Pressable
                  key={opt.id}
                  onPress={() => setHandlingTime(opt.id)}
                  hitSlop={8}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  accessibilityLabel={opt.label}
                  style={[styles.segmentItem, selected && styles.segmentItemSelected]}
                >
                  <Text style={[styles.segmentText, selected && styles.segmentTextSelected]}>{opt.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      );
    }

    if (key === "payout") {
      return (
        <View>
          <Text style={styles.fieldLabel}>Payout account</Text>
          {payoutStatus === "idle" ? (
            <View>
              <Text style={styles.helperText}>No payout account connected yet.</Text>
              <Pressable
                onPress={handleConnectPayout}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Connect payout account"
                style={styles.connectButton}
              >
                <Text style={styles.connectButtonText}>Connect payout account</Text>
              </Pressable>
            </View>
          ) : payoutStatus === "connecting" ? (
            <View style={styles.connectingRow}>
              <ActivityIndicator color={tokens.color.accent} />
              <Text style={styles.connectingText}>Connecting to {PAYOUT_MOCK.bankName}…</Text>
            </View>
          ) : (
            <View>
              <Text style={styles.payoutConnectedText}>
                Connected — {PAYOUT_MOCK.bankName}, account ending {PAYOUT_MOCK.accountLast4}
              </Text>
              <Pressable
                onPress={() => setPayoutStatus("idle")}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Use a different payout account"
                style={styles.linkButton}
              >
                <Text style={styles.linkButtonText}>Use a different account</Text>
              </Pressable>
            </View>
          )}
        </View>
      );
    }

    // review
    return (
      <View>
        <Text style={styles.helperText}>
          Everything above is saved. Activate your store below to start selling on repick.
        </Text>
      </View>
    );
  }

  function renderStepCard({ item, index }: { item: StepDef; index: number }) {
    const status = getStepStatus(index);
    const highlighted = highlightKey === item.key;

    return (
      <View
        onLayout={(e) => {
          stepOffsets.current[item.key] = e.nativeEvent.layout.y;
        }}
        style={[
          styles.stepCard,
          status === "active" && styles.stepCardActive,
          highlighted && styles.stepCardHighlight,
        ]}
      >
        <View style={styles.stepHeaderRow}>
          <View
            style={[
              styles.stepBadge,
              status === "completed" && styles.stepBadgeDone,
              status === "locked" && styles.stepBadgeLocked,
            ]}
          >
            <Text style={styles.stepBadgeText}>{status === "completed" ? "✓" : String(index + 1)}</Text>
          </View>
          <View style={styles.stepHeaderTextWrap}>
            <Text style={styles.stepTitle}>{item.title}</Text>
            <Text style={styles.stepStatusLabel}>
              {status === "completed" ? "Completed" : status === "active" ? "In progress" : "Not yet available"}
            </Text>
          </View>
          {status === "completed" ? (
            <Pressable
              onPress={() => handleEditStep(index)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={`Edit ${item.title}`}
              style={styles.editButton}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </Pressable>
          ) : null}
        </View>

        {status === "completed" ? (
          <Text style={styles.summaryText}>{renderCompletedSummary(item.key)}</Text>
        ) : status === "locked" ? (
          <Text style={styles.lockedText}>Locked — finish the steps above first.</Text>
        ) : (
          <View style={styles.stepFormWrap}>{renderActiveForm(item.key)}</View>
        )}
      </View>
    );
  }

  const band = computeBand();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.progressHeader}>
          <Text style={styles.screenTitle} accessibilityRole="header">
            Set Up Your Store
          </Text>
          <Text style={styles.progressCount}>
            Step {currentStepIndex + 1} of {STEPS.length} — {STEPS[currentStepIndex].title}
          </Text>
          <View
            style={styles.progressTrack}
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: STEPS.length, now: currentStepIndex + (activationStatus === "success" ? 1 : 0) }}
          >
            {STEPS.map((s, i) => {
              const done = i < currentStepIndex || (i === currentStepIndex && activationStatus === "success");
              const active = i === currentStepIndex && activationStatus !== "success";
              return (
                <View
                  key={s.key}
                  style={[
                    styles.progressSegment,
                    done && styles.progressSegmentDone,
                    active && styles.progressSegmentActive,
                  ]}
                />
              );
            })}
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          data={STEPS}
          keyExtractor={(item) => item.key}
          renderItem={renderStepCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.band} accessibilityLiveRegion="polite">
          <Text style={styles.bandMessage} accessibilityRole="alert">
            {band.message}
          </Text>
          {band.tone === "done" ? null : (
            <Pressable
              onPress={handleBandPress}
              disabled={band.tone === "loading"}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={band.ctaLabel}
              accessibilityState={{ disabled: band.tone === "loading" }}
              style={[styles.bandButton, band.tone === "loading" && styles.bandButtonDisabled]}
            >
              {band.tone === "loading" ? (
                <ActivityIndicator color={tokens.color.onAccent} />
              ) : (
                <Text style={styles.bandButtonText}>{band.ctaLabel}</Text>
              )}
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  container: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  progressHeader: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(3),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(1),
  },
  progressCount: {
    fontSize: 13,
    color: tokens.color.muted,
    marginBottom: tokens.space(3),
  },
  progressTrack: {
    flexDirection: "row",
    gap: tokens.space(1),
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.border,
  },
  progressSegmentDone: {
    backgroundColor: tokens.color.accent,
  },
  progressSegmentActive: {
    backgroundColor: tokens.color.accent,
    opacity: 0.5,
  },
  listContent: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(6),
    gap: tokens.space(3),
  },
  stepCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    backgroundColor: tokens.color.bg,
  },
  stepCardActive: {
    borderColor: tokens.color.accent,
  },
  stepCardHighlight: {
    borderColor: tokens.color.accent,
    borderWidth: 2,
  },
  stepHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: tokens.color.ink2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: tokens.space(3),
  },
  stepBadgeDone: {
    backgroundColor: tokens.color.accent,
  },
  stepBadgeLocked: {
    backgroundColor: tokens.color.border,
  },
  stepBadgeText: {
    color: tokens.color.onInk,
    fontSize: 13,
    fontWeight: "700",
  },
  stepHeaderTextWrap: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  stepStatusLabel: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: 2,
  },
  editButton: {
    minHeight: 44,
    minWidth: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(3),
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.accent,
  },
  summaryText: {
    fontSize: 14,
    color: tokens.color.muted,
    marginTop: tokens.space(3),
    lineHeight: 20,
  },
  lockedText: {
    fontSize: 14,
    color: tokens.color.faint,
    marginTop: tokens.space(3),
  },
  stepFormWrap: {
    marginTop: tokens.space(4),
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
    marginBottom: tokens.space(2),
  },
  fieldLabelSpaced: {
    marginTop: tokens.space(4),
  },
  required: {
    color: tokens.color.accent,
  },
  textInput: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(3),
    fontSize: 15,
    color: tokens.color.ink,
    backgroundColor: tokens.color.bg,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  helperText: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: tokens.space(2),
  },
  errorText: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.ink,
    marginTop: tokens.space(2),
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: tokens.space(2),
  },
  chip: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(3),
    justifyContent: "center",
  },
  chipSelected: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  chipText: {
    fontSize: 13,
    color: tokens.color.ink2,
    fontWeight: "600",
  },
  chipTextSelected: {
    color: tokens.color.onAccent,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(3),
    marginBottom: tokens.space(2),
  },
  radioRowSelected: {
    borderColor: tokens.color.accent,
  },
  radioDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: tokens.color.border,
    marginRight: tokens.space(3),
  },
  radioDotSelected: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  radioTextWrap: {
    flex: 1,
  },
  radioLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  radioHelper: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: 2,
  },
  segmentRow: {
    flexDirection: "row",
    gap: tokens.space(2),
  },
  segmentItem: {
    flex: 1,
    minHeight: 44,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(2),
  },
  segmentItemSelected: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.ink2,
    textAlign: "center",
  },
  segmentTextSelected: {
    color: tokens.color.onAccent,
  },
  connectButton: {
    minHeight: 44,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
    marginTop: tokens.space(3),
  },
  connectButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  connectingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(2),
    marginTop: tokens.space(2),
  },
  connectingText: {
    fontSize: 13,
    color: tokens.color.muted,
  },
  payoutConnectedText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  linkButton: {
    minHeight: 44,
    justifyContent: "center",
    marginTop: tokens.space(1),
  },
  linkButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.accent,
  },
  band: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
    backgroundColor: tokens.color.bg,
  },
  bandMessage: {
    fontSize: 13,
    color: tokens.color.ink2,
    marginBottom: tokens.space(3),
    lineHeight: 18,
  },
  bandButton: {
    minHeight: 44,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  bandButtonDisabled: {
    opacity: 0.6,
  },
  bandButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
});
