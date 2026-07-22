import { useEffect, useMemo, useState } from "react";
import { Platform, Pressable, ScrollView, Text, View, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import PrimaryButton from "../../components/PrimaryButton";
import ThemeToggleButton from "../../components/ThemeToggleButton";
import Card from "../../components/Card";
import TapScale from "../../components/TapScale";
import { useAuth } from "../../src/auth/AuthContext";
import { db } from "../../src/firebase/firebaseConfig";
import { usePalette, useTheme } from "../../styles/theme";

const QUICK_ACTIONS = [
  {
    id: "task",
    label: "New Task",
    icon: "checkbox-outline",
    color: "#22c55e",
    route: "/hub/item-form",
  },
  {
    id: "note",
    label: "Quick Note",
    icon: "create-outline",
    color: "#38bdf8",
    route: "/hub/notes",
  },
  {
    id: "mood",
    label: "Log Mood",
    icon: "heart-outline",
    color: "#a855f7",
    route: "/hub/mood-journal",
  },
];

export default function DashboardScreen() {
  const theme = useTheme();
  const palette = usePalette();
  const router = useRouter();
  const { user, loading } = useAuth();
  const { width } = useWindowDimensions();
  const [counts, setCounts] = useState({ notes: 0, tasks: 0, moods: 0, completedTasks: 0 });
  const [loadingTiles, setLoadingTiles] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    const fetchCounts = async () => {
      if (!user) return;
      try {
        const [notesSnap, tasksSnap, moodSnap] = await Promise.all([
          getDocs(query(collection(db, "notes"), where("userId", "==", user.uid), limit(50))),
          getDocs(query(collection(db, "tasks"), where("userId", "==", user.uid), limit(50))),
          getDocs(query(collection(db, "moodEntries"), where("userId", "==", user.uid), limit(50))),
        ]);
        const completedTasks = tasksSnap.docs.filter((d) => d.data().completed).length;
        setCounts({
          notes: notesSnap.size,
          tasks: tasksSnap.size,
          moods: moodSnap.size,
          completedTasks,
        });
      } catch (e) {
        // Graceful fallback
      } finally {
        setLoadingTiles(false);
      }
    };
    fetchCounts();
  }, [user]);

  const name = useMemo(() => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split("@")[0];
    return "there";
  }, [user]);

  const taskProgress = counts.tasks > 0 ? counts.completedTasks / counts.tasks : 0;

  const tiles = useMemo(
    () => [
      {
        id: "notes",
        title: "Notes",
        count: counts.notes,
        icon: "document-text",
        color: "#38bdf8",
        route: "/hub/notes",
        cta: "Open notes",
      },
      {
        id: "mood",
        title: "Mood Logs",
        count: counts.moods,
        icon: "heart",
        color: "#a855f7",
        route: "/hub/mood-journal",
        cta: "View entries",
      },
      {
        id: "tasks",
        title: "Tasks",
        count: counts.tasks,
        icon: "checkbox",
        color: "#22c55e",
        route: "/hub/tasks",
        cta: "Go to tasks",
      },
    ],
    [counts]
  );

  const isCompact = width < 600;
  const isWeb = Platform.OS === "web";

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: palette.background }}
      contentContainerStyle={[
        theme.screen,
        { paddingTop: isWeb ? 28 : 20, paddingBottom: 40 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Banner */}
      <LinearGradient
        colors={palette.heroGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={heroStyles.hero}
      >
        {/* Decorative circles */}
        <View style={[heroStyles.orb, heroStyles.orb1, { backgroundColor: palette.accent }]} />
        <View style={[heroStyles.orb, heroStyles.orb2, { backgroundColor: "#a855f7" }]} />

        <View style={{ zIndex: 1, gap: 6 }}>
          <Text style={heroStyles.greeting}>Welcome back,</Text>
          <Text style={heroStyles.name}>{name} 👋</Text>
          <Text style={heroStyles.sub}>
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>

        {/* Quick actions */}
        <View style={heroStyles.quickActions}>
          {QUICK_ACTIONS.map((action) => (
            <Pressable
              key={action.id}
              onPress={() => router.push(action.route)}
              style={({ pressed, hovered }) => [
                heroStyles.quickBtn,
                {
                  backgroundColor: `${action.color}25`,
                  borderColor: `${action.color}60`,
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: hovered ? 1.05 : 1 }],
                },
              ]}
            >
              <Ionicons name={action.icon} size={18} color={action.color} />
              <Text style={[heroStyles.quickBtnText, { color: action.color }]}>
                {action.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Mobile theme toggle */}
        {!isWeb && (
          <View style={{ position: "absolute", top: 16, right: 16, zIndex: 2 }}>
            <ThemeToggleButton />
          </View>
        )}
      </LinearGradient>

      {/* Task progress bar */}
      {counts.tasks > 0 && (
        <Card style={{ gap: 10 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ color: palette.text, fontWeight: "700", fontSize: 15 }}>
              Task Progress
            </Text>
            <Text style={{ color: palette.muted, fontSize: 14 }}>
              {counts.completedTasks} / {counts.tasks} completed
            </Text>
          </View>
          <View
            style={{
              height: 8,
              backgroundColor: palette.surfaceSecondary,
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <LinearGradient
              colors={["#22c55e", "#16a34a"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                height: "100%",
                width: `${Math.round(taskProgress * 100)}%`,
                borderRadius: 8,
              }}
            />
          </View>
        </Card>
      )}

      {/* Stat Tiles */}
      <View style={{ flexDirection: isCompact ? "column" : "row", gap: 12 }}>
        {tiles.map((tile) => (
          <TapScale
            key={tile.id}
            onPress={() => router.push(tile.route)}
            style={{ flex: isCompact ? undefined : 1 }}
          >
            <Card
              glow
              style={{
                minHeight: 130,
                justifyContent: "space-between",
                borderColor: `${tile.color}30`,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: `${tile.color}20`,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name={tile.icon} size={20} color={tile.color} />
                </View>
                <Ionicons name="arrow-forward" size={16} color={palette.muted} />
              </View>
              <View style={{ gap: 2 }}>
                <Text
                  style={{
                    fontSize: 32,
                    fontWeight: "800",
                    color: palette.text,
                    letterSpacing: -1,
                  }}
                >
                  {loadingTiles ? "—" : tile.count}
                </Text>
                <Text style={{ color: palette.muted, fontWeight: "600", fontSize: 13 }}>
                  {tile.title}
                </Text>
              </View>
            </Card>
          </TapScale>
        ))}
      </View>

      {/* Hub shortcut */}
      <Card gradient style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            backgroundColor: palette.badgeBg,
            borderWidth: 1,
            borderColor: palette.badgeBorder,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="grid" size={22} color={palette.accent} />
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={{ color: palette.text, fontWeight: "700", fontSize: 16 }}>
            Workspace Hub
          </Text>
          <Text style={{ color: palette.muted, fontSize: 13 }}>
            Access all your tools from one place.
          </Text>
        </View>
        <PrimaryButton title="Open" onPress={() => router.push("/hub")} />
      </Card>
    </ScrollView>
  );
}

const heroStyles = {
  hero: {
    borderRadius: 22,
    padding: 28,
    gap: 20,
    overflow: "hidden",
    position: "relative",
  },
  greeting: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 15,
    fontWeight: "500",
  },
  name: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  sub: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 13,
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    zIndex: 1,
  },
  quickBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
  },
  quickBtnText: {
    fontSize: 13,
    fontWeight: "700",
  },
  orb: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.08,
  },
  orb1: {
    width: 180,
    height: 180,
    top: -60,
    right: -40,
  },
  orb2: {
    width: 120,
    height: 120,
    bottom: -30,
    left: "40%",
  },
};
