// native/src/evolve/r40/b/CanvasPin.tsx
//
// One pressable marker on the schematic drop-off canvas. Position comes from
// fixed per-site percentages (data-driven, deterministic — never computed
// from randomness), applied as an inline style object because each pin's
// placement is genuinely per-item data, not a hardcoded design constant.
import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import type { DropoffSite } from "./data";

type CanvasPinProps = {
  site: DropoffSite;
  isSelected: boolean;
  onPress: () => void;
};

export function CanvasPin({ site, isSelected, onPress }: CanvasPinProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={`${site.name}, ${site.kind}, ${site.distanceMiles.toFixed(1)} miles away`}
      accessibilityState={{ selected: isSelected }}
      style={[
        styles.pin,
        { top: `${site.pinTopPct}%`, left: `${site.pinLeftPct}%` },
        isSelected && styles.pinSelected,
      ]}
    >
      <Text style={[styles.pinGlyph, isSelected && styles.pinGlyphSelected]}>{site.markerGlyph}</Text>
    </Pressable>
  );
}

export default CanvasPin;

const styles = StyleSheet.create({
  pin: {
    position: "absolute",
    width: 44,
    height: 44,
    marginTop: -22,
    marginLeft: -22,
    borderRadius: 22,
    backgroundColor: tokens.color.bg,
    borderWidth: 2,
    borderColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  pinSelected: {
    backgroundColor: tokens.color.accent,
  },
  pinGlyph: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  pinGlyphSelected: {
    color: tokens.color.onAccent,
  },
});
