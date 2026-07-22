import React, { useRef, useState } from "react";
import { Animated, Platform, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { usePalette } from "../styles/theme";

export default function Card({
  children,
  style,
  onPress,
  hoverable = true,
  glow = false,
  gradient = false,
  ...props
}) {
  const palette = usePalette();
  const [isHovered, setIsHovered] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;
  const borderOpacity = useRef(new Animated.Value(0)).current;

  const handleHoverIn = () => {
    if (Platform.OS !== "web" || !hoverable) return;
    setIsHovered(true);
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -5,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(borderOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleHoverOut = () => {
    if (Platform.OS !== "web" || !hoverable) return;
    setIsHovered(false);
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(borderOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const animatedBorderColor = borderOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [palette.border, palette.borderHover],
  });

  const baseStyle = [
    styles.card,
    {
      backgroundColor: palette.card,
      shadowColor: isHovered && glow ? palette.accent : palette.shadow,
      shadowOpacity: isHovered && glow ? 0.35 : 0.15,
      shadowRadius: isHovered ? 24 : 14,
    },
    style,
  ];

  const inner = gradient ? (
    <LinearGradient
      colors={[palette.glassBg, palette.card]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1, gap: 12 }}
    >
      {children}
    </LinearGradient>
  ) : (
    children
  );

  const sharedProps = {
    onHoverIn: handleHoverIn,
    onHoverOut: handleHoverOut,
    ...props,
  };

  if (onPress) {
    return (
      <Pressable onPress={onPress} {...sharedProps}>
        <Animated.View
          style={[
            ...baseStyle,
            { borderColor: animatedBorderColor, transform: [{ translateY }] },
          ]}
        >
          {inner}
        </Animated.View>
      </Pressable>
    );
  }

  return (
    <Animated.View
      style={[
        ...baseStyle,
        { borderColor: animatedBorderColor, transform: [{ translateY }] },
      ]}
      {...sharedProps}
    >
      {inner}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 3,
  },
});
