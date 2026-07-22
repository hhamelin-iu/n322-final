import React from "react";
import { Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useRouter, useSegments } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { usePalette, useIsDark, useThemeToggle } from "../styles/theme";

const NAV_LINKS = [
  { label: "Dashboard", icon: "home-outline", route: "/" },
  { label: "Hub", icon: "grid-outline", route: "/hub" },
];

export default function WebTopNav() {
  const { width } = useWindowDimensions();
  const palette = usePalette();
  const isDark = useIsDark();
  const toggleTheme = useThemeToggle();
  const router = useRouter();
  const segments = useSegments();

  if (Platform.OS !== "web") return null;
  if (width < 768) return null;

  const isActive = (route) => {
    if (route === "/" && (segments.length === 0 || (segments.length === 1 && segments[0] === "(tabs)"))) return true;
    if (route === "/hub" && segments.includes("hub")) return true;
    return false;
  };

  return (
    <View
      style={[
        styles.nav,
        {
          backgroundColor: palette.navBg,
          borderBottomColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
          // Web-only blur is applied via CSS injection below
        },
      ]}
    >
      <View style={[styles.inner, { maxWidth: 1280 }]}>
        {/* Brand — left */}
        <Pressable
          onPress={() => router.push("/")}
          style={({ hovered }) => [styles.brand, hovered && { opacity: 0.8 }]}
        >
          <View style={[styles.brandDot, { backgroundColor: palette.accent }]} />
          <Text style={[styles.brandText, { color: palette.text }]}>
            MY{" "}
            <Text style={{ color: palette.accent }}>WORKSPACE</Text>
          </Text>
        </Pressable>

        {/* Nav links — absolutely centered */}
        <View style={styles.linksCenter}>
          <View style={styles.links}>
            {NAV_LINKS.map((link) => {
              const active = isActive(link.route);
              return (
                <Pressable
                  key={link.label}
                  onPress={() => router.push(link.route)}
                  style={({ hovered }) => [
                    styles.link,
                    active && { backgroundColor: palette.badgeBg },
                    hovered && !active && { backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" },
                  ]}
                >
                  <Text
                    style={[
                      styles.linkText,
                      { color: active ? palette.badgeText : palette.muted },
                    ]}
                  >
                    {link.label.toUpperCase()}
                  </Text>
                  {active && (
                    <View style={[styles.activeLine, { backgroundColor: palette.accent }]} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Theme toggle — right */}
        <Pressable
          onPress={toggleTheme}
          style={({ hovered }) => [
            styles.iconBtn,
            {
              backgroundColor: hovered
                ? isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"
                : "transparent",
              borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          <Ionicons
            name={isDark ? "sunny-outline" : "moon-outline"}
            size={18}
            color={palette.muted}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    width: "100%",
    borderBottomWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 0,
    minHeight: 60,
    justifyContent: "center",
    // Note: backdrop-filter blur is a web-only CSS property.
    // Expo web renders this via the browser's CSS engine when style is passed as web style.
    // The navBg color already has alpha to achieve the frosted appearance.
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: "auto",
    width: "100%",
    height: 60,
  },
  linksCenter: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    pointerEvents: "box-none",
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brandDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  brandText: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1.5,
    fontFamily: "LexendZetta_400Regular",
    userSelect: "none",
  },
  links: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 2,
    height: 60,
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 6,
    position: "relative",
    height: "100%",
    borderRadius: 0,
  },
  linkText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    userSelect: "none",
  },
  activeLine: {
    position: "absolute",
    bottom: 0,
    left: 16,
    right: 16,
    height: 2,
    borderRadius: 2,
  },
  iconBtn: {
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
});
