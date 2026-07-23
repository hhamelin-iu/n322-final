import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import * as Linking from "expo-linking";
import { Ionicons } from "@expo/vector-icons";
import { usePalette } from "../styles/theme";

export default function Footer() {
  if (Platform.OS !== "web") return null;

  const palette = usePalette();
  const year = new Date().getFullYear();

  const handleOpenSource = () => {
    Linking.openURL("https://github.com/hhamelin-iu/n322-final");
  };

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
        <View style={[styles.pip, { backgroundColor: palette.accent }]} />
        <Pressable
          onPress={handleOpenSource}
          accessibilityRole="link"
          accessibilityLabel="View source code on GitHub"
          href="https://github.com/hhamelin-iu/n322-final"
          hrefAttrs={{ target: "_blank", rel: "noopener noreferrer" }}
          style={({ hovered }) => [
            styles.linkBtn,
            hovered && { opacity: 0.75 },
          ]}
        >
          <Ionicons name="logo-github" size={14} color={palette.textLight} style={{ marginRight: 4 }} />
          <Text style={[styles.text, styles.linkText, { color: palette.textLight }]}>
            Source Code
          </Text>
        </Pressable>
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
    flexWrap: "wrap",
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
  linkBtn: {
    flexDirection: "row",
    alignItems: "center",
    cursor: "pointer",
  },
  linkText: {
    textDecorationLine: "underline",
  },
});
