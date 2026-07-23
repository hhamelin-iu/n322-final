import React, { useEffect } from "react";
import { Platform, View } from "react-native";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { LexendZetta_400Regular } from "@expo-google-fonts/lexend-zetta";
import { NotoSans_400Regular } from "@expo-google-fonts/noto-sans";
import * as SplashScreen from "expo-splash-screen";
import { AuthProvider } from "../src/auth/AuthContext";
import { ThemeProvider, usePalette, useIsDark } from "../styles/theme";
import WebTopNav from "../components/WebTopNav";
import Footer from "../components/Footer";
import PortfolioReturnBanner from "../components/PortfolioReturnBanner";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    LexendZetta_400Regular,
    NotoSans_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <ThemeProvider>
        <AppStack />
      </ThemeProvider>
    </AuthProvider>
  );
}

function AppStack() {
  const palette = usePalette();
  const isDark = useIsDark();
  const isWeb = Platform.OS === "web";

  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      {/* Ambient background blobs — matching portfolio atmospheric radial gradients */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        <View
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: 300,
            top: -150,
            left: "-10%",
            backgroundColor: isDark ? "rgba(99,102,241,0.07)" : "rgba(56,189,248,0.07)",
          }}
        />
        <View
          style={{
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: 250,
            bottom: "10%",
            right: "-5%",
            backgroundColor: isDark ? "rgba(168,85,247,0.06)" : "rgba(139,92,246,0.05)",
          }}
        />
      </View>

      <View style={{ flex: 1, zIndex: 1 }}>
        <PortfolioReturnBanner />
        {isWeb && <WebTopNav />}
      <Stack
        screenOptions={{
          headerShown: !isWeb,
          headerStyle: { backgroundColor: palette.background, height: 48 },
          contentStyle: { backgroundColor: palette.background },
          headerTintColor: palette.text,
          headerTitleStyle: {
            fontFamily: "LexendZetta_400Regular",
            fontSize: 18,
            paddingBottom: 6,
          },
          headerTitleContainerStyle: { justifyContent: "flex-end" },
          headerRightContainerStyle: { alignItems: "flex-end", paddingBottom: 6 },
          headerBackTitleVisible: false,
          headerShadowVisible: false,
          statusBarStyle: isDark ? "light" : "dark",
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: "fade" }} />
        <Stack.Screen name="login" options={{ title: "Login", headerShown: !isWeb }} />
        <Stack.Screen name="register" options={{ title: "Register", headerShown: !isWeb }} />
      </Stack>
      {isWeb && <Footer />}
      </View>
    </View>
  );
}
