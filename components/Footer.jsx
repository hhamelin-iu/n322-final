import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { usePalette } from "../styles/theme";

export default function Footer() {
  if (Platform.OS !== "web") return null;

  const palette = usePalette();
  const year = new Date().getFullYear();

  return (
    <View
      style={[
        styles.footer,
        {
          backgroundColor: palette.navBg,
          borderTopColor: palette.glassBorder,
        },
      ]}
    >
      <View style={[styles.inner]}>
        <Text style={[styles.text, { color: palette.textLight }]}>
          © {year} My Workspace · Built with Expo
        </Text>
        <View style={[styles.pip, { backgroundColor: palette.accent }]} />
        <Text style={[styles.text, { color: palette.textLight }]}>
          All data synced with Firebase
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    width: "100%",
    borderTopWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    maxWidth: 1200,
    marginHorizontal: "auto",
  },
  text: {
    fontSize: 13,
  },
  pip: {
    width: 4,
    height: 4,
    borderRadius: 2,
    opacity: 0.5,
  },
});
