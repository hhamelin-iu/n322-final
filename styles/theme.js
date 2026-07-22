import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const palettes = {
  dark: {
    background: "#0f172a",
    surface: "#1e293b",
    surfaceSecondary: "#1a2744",
    card: "#1a2540",
    cardHover: "#1e2d4e",
    border: "#2a3a5c",
    borderHover: "#38bdf8",
    accent: "#38bdf8",
    accentDark: "#0284c7",
    text: "#f8fafc",
    muted: "#94a3b8",
    textLight: "#64748b",
    danger: "#f87171",
    badgeBg: "rgba(56, 189, 248, 0.15)",
    badgeBorder: "rgba(56, 189, 248, 0.35)",
    badgeText: "#38bdf8",
    shadow: "rgba(0, 0, 0, 0.5)",
    // Gradient tokens
    gradientStart: "#0f172a",
    gradientMid: "#0d1f3a",
    gradientEnd: "#0a0f2e",
    heroGradient: ["#0f2454", "#0a1628"],
    accentGradient: ["#38bdf8", "#0ea5e9", "#0284c7"],
    // Glassmorphism
    glassBg: "rgba(26, 37, 64, 0.7)",
    glassBorder: "rgba(56, 189, 248, 0.2)",
    navBg: "rgba(15, 23, 42, 0.85)",
  },
  light: {
    background: "#f0f4ff",
    surface: "#ffffff",
    surfaceSecondary: "#e8eef8",
    card: "#ffffff",
    cardHover: "#f8faff",
    border: "#d4dff0",
    borderHover: "#0284c7",
    accent: "#0284c7",
    accentDark: "#0369a1",
    text: "#0f1c2e",
    muted: "#5a6a82",
    textLight: "#9ca3af",
    danger: "#dc2626",
    badgeBg: "#e0f2fe",
    badgeBorder: "#bae6fd",
    badgeText: "#0369a1",
    shadow: "rgba(0, 0, 0, 0.10)",
    // Gradient tokens
    gradientStart: "#e8eef8",
    gradientMid: "#dde8f7",
    gradientEnd: "#cfe0f5",
    heroGradient: ["#1a4fa8", "#0369a1"],
    accentGradient: ["#38bdf8", "#0ea5e9", "#0284c7"],
    // Glassmorphism
    glassBg: "rgba(255, 255, 255, 0.7)",
    glassBorder: "rgba(2, 132, 199, 0.2)",
    navBg: "rgba(240, 244, 255, 0.9)",
  },
};

const ThemeContext = createContext({
  palette: palettes.dark,
  mode: "dark",
  isDark: true,
  toggleTheme: () => {},
  styles: {},
});

const THEME_STORAGE_KEY = "n322_theme_mode";

const buildStyles = (palette) =>
  StyleSheet.create({
    screen: {
      backgroundColor: palette.background,
      padding: 20,
      gap: 20,
      maxWidth: 1280,
      width: "100%",
      marginHorizontal: "auto",
    },
    card: {
      backgroundColor: palette.card,
      borderRadius: 16,
      padding: 20,
      gap: 12,
      borderWidth: 1,
      borderColor: palette.border,
      shadowColor: palette.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 2,
    },
    heading: {
      color: palette.text,
      fontSize: 26,
      fontWeight: "800",
      letterSpacing: -0.5,
      fontFamily: "LexendZetta_400Regular",
    },
    subheading: {
      color: palette.muted,
      fontSize: 15,
      lineHeight: 22,
      fontFamily: "NotoSans_400Regular",
    },
    input: {
      backgroundColor: palette.surface,
      borderColor: palette.border,
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      color: palette.text,
      fontSize: 16,
    },
    button: {
      backgroundColor: palette.accent,
      paddingVertical: 14,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      color: "#ffffff",
      fontWeight: "700",
      fontSize: 17,
      letterSpacing: 0.3,
    },
    link: {
      color: palette.accent,
      fontWeight: "700",
    },
    muted: {
      color: palette.muted,
    },
  });

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState("dark");

  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (saved === "dark" || saved === "light") {
          setMode(saved);
        }
      } catch (e) {
        // Fallback to dark
      }
    };
    loadSavedTheme();
  }, []);

  const toggleTheme = async () => {
    const nextMode = mode === "dark" ? "light" : "dark";
    setMode(nextMode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, nextMode);
    } catch (e) {
      // Ignore write errors
    }
  };

  const palette = mode === "dark" ? palettes.dark : palettes.light;
  const isDark = mode === "dark";
  const styles = useMemo(() => buildStyles(palette), [palette]);

  const value = useMemo(
    () => ({ palette, mode, isDark, toggleTheme, styles }),
    [palette, mode, isDark, styles]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function usePalette() {
  return useContext(ThemeContext).palette;
}

export function useTheme() {
  return useContext(ThemeContext).styles;
}

export function useThemeToggle() {
  return useContext(ThemeContext).toggleTheme;
}

export function useIsDark() {
  return useContext(ThemeContext).isDark;
}

// Default export for compatibility (uses dark palette).
export const palette = palettes.dark;
