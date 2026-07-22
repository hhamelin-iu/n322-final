import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePalette } from "../styles/theme";
import PrimaryButton from "./PrimaryButton";

export default function EmptyState({
  iconName = "document-text-outline",
  title = "No items found",
  description = "Get started by adding a new entry.",
  actionTitle,
  onAction,
  style,
}) {
  const palette = usePalette();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: palette.card, borderColor: palette.border },
        style,
      ]}
    >
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: palette.surfaceSecondary, borderColor: palette.border },
        ]}
      >
        <Ionicons name={iconName} size={36} color={palette.accent} />
      </View>
      <Text style={[styles.title, { color: palette.text }]}>{title}</Text>
      <Text style={[styles.description, { color: palette.muted }]}>
        {description}
      </Text>
      {actionTitle && onAction && (
        <View style={styles.actionWrapper}>
          <PrimaryButton title={actionTitle} onPress={onAction} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 32,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
    gap: 12,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 280,
  },
  actionWrapper: {
    marginTop: 8,
    width: "100%",
    maxWidth: 200,
  },
});
