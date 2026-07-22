import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { usePalette } from "../styles/theme";

export default function Badge({ label, type = "default", style, textStyle }) {
  const palette = usePalette();

  const getColors = () => {
    switch (type) {
      case "success":
      case "completed":
        return {
          bg: palette.background === "#0f172a" ? "rgba(34, 197, 94, 0.15)" : "#dcfce7",
          border: palette.background === "#0f172a" ? "rgba(34, 197, 94, 0.35)" : "#86efac",
          text: palette.background === "#0f172a" ? "#4ade80" : "#15803d",
        };
      case "warning":
      case "pending":
        return {
          bg: palette.background === "#0f172a" ? "rgba(245, 158, 11, 0.15)" : "#fef3c7",
          border: palette.background === "#0f172a" ? "rgba(245, 158, 11, 0.35)" : "#fde047",
          text: palette.background === "#0f172a" ? "#fbbf24" : "#b45309",
        };
      case "danger":
      case "high":
        return {
          bg: palette.background === "#0f172a" ? "rgba(248, 113, 113, 0.15)" : "#fee2e2",
          border: palette.background === "#0f172a" ? "rgba(248, 113, 113, 0.35)" : "#fca5a5",
          text: palette.danger,
        };
      case "info":
      case "accent":
        return {
          bg: palette.badgeBg,
          border: palette.badgeBorder,
          text: palette.badgeText,
        };
      default:
        return {
          bg: palette.surfaceSecondary,
          border: palette.border,
          text: palette.muted,
        };
    }
  };

  const colors = getColors();

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: colors.bg, borderColor: colors.border },
        style,
      ]}
    >
      <Text style={[styles.text, { color: colors.text }, textStyle]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
