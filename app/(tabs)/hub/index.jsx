import { useEffect } from "react";
import { Platform, ScrollView, Text, View, useWindowDimensions } from "react-native";
import { Asset } from "expo-asset";
import { SvgUri } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import TapScale from "../../../components/TapScale";
import Card from "../../../components/Card";
import { useAuth } from "../../../src/auth/AuthContext";
import { usePalette, useTheme } from "../../../styles/theme";

const TOOLS = [
  {
    id: "notes",
    title: "Notes",
    description: "Capture ideas, jot down thoughts, and search your entries instantly.",
    icon: require("../../../assets/hub-notes.svg"),
    route: "/hub/notes",
    gradient: ["#0ea5e9", "#38bdf8"],
    glowColor: "#38bdf8",
  },
  {
    id: "mood",
    title: "Mood Journal",
    description: "Track your daily emotional patterns with emoji-driven mood logging.",
    icon: require("../../../assets/hub-journal.svg"),
    route: "/hub/mood-journal",
    gradient: ["#9333ea", "#c084fc"],
    glowColor: "#a855f7",
  },
  {
    id: "tasks",
    title: "Tasks",
    description: "Stay on top of your to-do list with completion tracking and filters.",
    icon: require("../../../assets/hub-tasks.svg"),
    route: "/hub/tasks",
    gradient: ["#16a34a", "#4ade80"],
    glowColor: "#22c55e",
  },
];

function chunkArray(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

function ToolCard({ tool, palette, router, cardWidth }) {
  const iconUri = Asset.fromModule(tool.icon).uri;
  return (
    <TapScale
      onPress={() => router.push(tool.route)}
      style={{ width: cardWidth }}
    >
      <Card
        glow
        style={{
          gap: 0,
          padding: 0,
          overflow: "hidden",
          borderColor: `${tool.glowColor}30`,
          flex: 1,
        }}
      >
        <LinearGradient
          colors={tool.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={cardStyles.iconHeader}
        >
          <View
            style={[cardStyles.orb, { backgroundColor: "rgba(255,255,255,0.15)" }]}
          />
          <SvgUri width={52} height={52} uri={iconUri} style={{ zIndex: 1 }} />
        </LinearGradient>

        <View style={cardStyles.body}>
          <Text style={[cardStyles.title, { color: palette.text }]}>{tool.title}</Text>
          <Text style={[cardStyles.desc, { color: palette.muted }]}>{tool.description}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
            <Text style={{ color: tool.glowColor, fontWeight: "700", fontSize: 13 }}>Open</Text>
            <Ionicons name="arrow-forward" size={13} color={tool.glowColor} />
          </View>
        </View>
      </Card>
    </TapScale>
  );
}

export default function HubScreen() {
  const theme = useTheme();
  const palette = usePalette();
  const router = useRouter();
  const { user, loading } = useAuth();
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  // Content area width accounts for screen padding (20px each side)
  const contentWidth = Math.min(1024, width) - 40;
  const GAP = 14;
  const numCols = contentWidth >= 640 ? 3 : contentWidth >= 400 ? 2 : 1;
  // Each card width = (total width - gaps between columns) / numCols
  const cardWidth = (contentWidth - GAP * (numCols - 1)) / numCols;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: palette.background }}
      contentContainerStyle={[
        theme.screen,
        { paddingTop: Platform.OS === "web" ? 28 : 20, paddingBottom: 40 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={{ gap: 6, marginBottom: 8 }}>
        <Text style={[theme.heading, { fontSize: 30 }]}>Workspace Hub</Text>
        <Text style={theme.subheading}>
          All your productivity tools in one place. Tap a card to dive in.
        </Text>
      </View>

      {/* Tool grid */}
      <View style={{ gap: GAP, alignItems: "center" }}>
        {numCols === 1 ? (
          TOOLS.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              palette={palette}
              router={router}
              cardWidth={cardWidth}
            />
          ))
        ) : (
          chunkArray(TOOLS, numCols).map((row, rowIdx) => (
            <View key={rowIdx} style={{ flexDirection: "row", gap: GAP, justifyContent: "center" }}>
              {row.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  palette={palette}
                  router={router}
                  cardWidth={cardWidth}
                />
              ))}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const cardStyles = {
  iconHeader: {
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },
  orb: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    bottom: -30,
    right: -20,
  },
  body: {
    padding: 18,
    gap: 8,
  },
  title: {
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  desc: {
    fontSize: 13,
    lineHeight: 19,
  },
};
