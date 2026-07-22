import { Platform } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { usePalette } from "../../styles/theme";

export default function TabsLayout() {
  const palette = usePalette();
  const isWeb = Platform.OS === "web";

  return (
    <Tabs
      sceneContainerStyle={{ backgroundColor: palette.background }}
      screenOptions={{
        tabBarActiveTintColor: palette.accent,
        tabBarInactiveTintColor: palette.muted,
        tabBarStyle: isWeb
          ? { display: "none" }
          : {
              backgroundColor: palette.surface,
              borderTopColor: palette.border,
              borderTopWidth: 1,
              paddingTop: 4,
              paddingBottom: 4,
              height: 58,
            },
        headerShown: false,
        popToTopOnBlur: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="hub"
        options={{
          title: "Hub",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
