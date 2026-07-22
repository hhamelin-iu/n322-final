import { ActivityIndicator, Animated, Platform, Pressable, StyleSheet, Text } from "react-native";
import { useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { usePalette } from "../styles/theme";

export default function PrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
}) {
  const palette = usePalette();
  const isDisabled = disabled || loading;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [hovered, setHovered] = useState(false);

  const onPressIn = () => {
    if (isDisabled) return;
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: Platform.OS !== "web",
      speed: 60,
      bounciness: 10,
      overshootClamping: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: Platform.OS !== "web",
      speed: 30,
      bounciness: 10,
      overshootClamping: true,
    }).start();
  };

  const ghostStyle = {
    backgroundColor: palette.surfaceSecondary,
    borderWidth: 1,
    borderColor: palette.border,
  };

  const dangerStyle = {
    backgroundColor: `${palette.danger}20`,
    borderWidth: 1,
    borderColor: `${palette.danger}40`,
  };

  return (
    <Animated.View
      style={[
        styles.wrapper,
        hovered && !isDisabled && styles.wrapperHovered,
        isDisabled && styles.disabled,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, busy: loading }}
      >
        {variant === "primary" ? (
          <LinearGradient
            colors={palette.accentGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.text} selectable={false}>{title}</Text>
            )}
          </LinearGradient>
        ) : (
          <Animated.View
            style={[
              styles.ghost,
              variant === "ghost" ? ghostStyle : dangerStyle,
            ]}
          >
            {loading ? (
              <ActivityIndicator
                color={variant === "danger" ? palette.danger : palette.muted}
              />
            ) : (
              <Text
                style={[
                  styles.text,
                  { color: variant === "danger" ? palette.danger : palette.muted },
                ]}
                selectable={false}
              >
                {title}
              </Text>
            )}
          </Animated.View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#0ea5e9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  wrapperHovered: {
    shadowOpacity: 0.35,
    shadowRadius: 14,
  },
  gradient: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },
  ghost: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },
  text: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 17,
    letterSpacing: 0.3,
    userSelect: "none",
  },
  disabled: {
    opacity: 0.55,
  },
});
