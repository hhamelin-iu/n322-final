import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePalette, useThemeToggle, useIsDark } from "../styles/theme";

export default function ThemeToggleButton({ style }) {
  const palette = usePalette();
  const toggle = useThemeToggle();
  const isDark = useIsDark();

  return (
    <Pressable
      onPress={toggle}
      style={[{ paddingHorizontal: 8, paddingVertical: 4 }, style]}
      accessibilityRole="button"
      accessibilityLabel={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Ionicons
        name={isDark ? "sunny" : "moon"}
        color={palette.text}
        size={22}
      />
    </Pressable>
  );
}
