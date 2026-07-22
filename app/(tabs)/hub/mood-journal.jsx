import { useEffect, useMemo, useState } from "react";
import { Alert, FlatList, Platform, Pressable, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { SvgUri } from "react-native-svg";
import { Asset } from "expo-asset";
import { useAuth } from "../../../src/auth/AuthContext";
import {
  subscribeToMoodEntries,
  saveMoodEntry,
  deleteMoodEntry,
} from "../../../src/services/moodJournalService";
import PrimaryButton from "../../../components/PrimaryButton";
import StatusMessage from "../../../components/StatusMessage";
import TapScale from "../../../components/TapScale";
import Card from "../../../components/Card";
import EmptyState from "../../../components/EmptyState";
import { usePalette, useTheme } from "../../../styles/theme";

const moodOptions = [
  { id: "terrible", label: "Terrible", icon: require("../../../assets/emotion-1.svg"), color: "#ef4444" },
  { id: "bad", label: "Bad", icon: require("../../../assets/emotion-2.svg"), color: "#f97316" },
  { id: "okay", label: "Okay", icon: require("../../../assets/emotion-3.svg"), color: "#eab308" },
  { id: "good", label: "Good", icon: require("../../../assets/emotion-4.svg"), color: "#22c55e" },
  { id: "great", label: "Great", icon: require("../../../assets/emotion-5.svg"), color: "#3b82f6" },
];

export default function MoodJournalScreen() {
  const theme = useTheme();
  const palette = usePalette();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [entries, setEntries] = useState([]);
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingEntries, setLoadingEntries] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    setLoadingEntries(true);
    const unsubscribe = subscribeToMoodEntries(
      user.uid,
      (rows) => {
        setEntries(rows);
        setError("");
        setLoadingEntries(false);
      },
      (err) => {
        setError(err.message || "Could not load mood entries.");
        setEntries([]);
        setLoadingEntries(false);
      }
    );
    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(""), 2600);
    return () => clearTimeout(timer);
  }, [success]);

  const resetForm = () => {
    setMood("");
    setNote("");
  };

  const onSave = async () => {
    if (!user || saving) return;
    if (!mood.trim()) {
      setError("Please select how you're feeling before saving.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await saveMoodEntry(user.uid, { mood, note });
      setSuccess("Mood log saved");
      resetForm();
    } catch (e) {
      setError(e.message || "Could not save mood entry.");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = (id) => {
    const doDelete = async () => {
      try {
        await deleteMoodEntry(id);
        setSuccess("Mood entry deleted");
      } catch (e) {
        setError(e.message || "Could not delete mood entry.");
      }
    };

    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.confirm("Delete this mood log permanently?")) {
        doDelete();
      }
      return;
    }

    Alert.alert("Delete entry", "Remove this mood entry permanently?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: doDelete },
    ]);
  };

  const header = useMemo(
    () => (
      <View style={{ gap: 12, marginBottom: 16 }}>
        <Text style={theme.heading}>Mood Journal</Text>
        <Text style={theme.subheading}>
          Log how you're feeling and add reflections over time.
        </Text>
        {!!success && <StatusMessage message={success} type="success" />}
        {!!error && <StatusMessage message={error} type="error" />}

        <Card style={{ gap: 14 }}>
          <Text style={[theme.heading, { fontSize: 18 }]}>How are you feeling today?</Text>

          <View style={{ flexDirection: "row", gap: 12, justifyContent: "space-between" }}>
            {moodOptions.map((option) => {
              const active = mood === option.id;
              const uri = Asset.fromModule(option.icon).uri;
              return (
                <View key={option.id} style={{ alignItems: "center", flex: 1 }}>
                  <TapScale
                    onPress={() => setMood(option.id)}
                    style={{
                      padding: 10,
                      borderRadius: 16,
                      borderWidth: 2,
                      borderColor: active ? option.color : palette.border,
                      backgroundColor: active ? `${option.color}25` : "transparent",
                    }}
                  >
                    <SvgUri
                      width={32}
                      height={32}
                      uri={uri}
                      fill={option.color}
                      stroke="none"
                    />
                  </TapScale>
                  <Text
                    style={{
                      marginTop: 6,
                      fontSize: 12,
                      color: active ? option.color : palette.text,
                      fontWeight: "700",
                      textTransform: "capitalize",
                    }}
                  >
                    {option.label}
                  </Text>
                </View>
              );
            })}
          </View>

          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Add an optional reflection note..."
            placeholderTextColor={palette.muted}
            style={[theme.input, { minHeight: 80, textAlignVertical: "top" }]}
            multiline
            numberOfLines={3}
          />

          <PrimaryButton
            title={saving ? "Saving..." : "Log Mood"}
            onPress={onSave}
            loading={saving}
          />
        </Card>
      </View>
    ),
    [error, mood, note, palette, saving, success, theme]
  );

  const renderItem = ({ item }) => {
    const match = moodOptions.find((m) => m.id === item.mood);
    const dateFormatted = item.createdAt
      ? new Date(item.createdAt.seconds * 1000).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Just now";

    return (
      <Card style={{ gap: 10 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            {match && (
              <SvgUri
                width={28}
                height={28}
                uri={Asset.fromModule(match.icon).uri}
                fill={match.color}
                stroke="none"
              />
            )}
            <Text
              style={[
                theme.heading,
                { fontSize: 18, textTransform: "capitalize", color: match ? match.color : palette.text },
              ]}
            >
              {match ? match.label : item.mood}
            </Text>
          </View>

          <Text style={{ fontSize: 12, color: palette.muted }}>{dateFormatted}</Text>
        </View>

        {!!item.note && (
          <Text style={[theme.subheading, { fontSize: 14, lineHeight: 20 }]}>
            {item.note}
          </Text>
        )}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            marginTop: 4,
            borderTopWidth: 1,
            borderTopColor: palette.border,
            paddingTop: 8,
          }}
        >
          <Pressable onPress={() => onDelete(item.id)}>
            <Text style={{ color: palette.danger, fontWeight: "700", fontSize: 14 }}>
              Delete
            </Text>
          </Pressable>
        </View>
      </Card>
    );
  };

  return (
    <View style={theme.screen}>
      {header}
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          !loadingEntries ? (
            <EmptyState
              iconName="heart-outline"
              title="No mood logs yet"
              description="Track your daily emotions and reflections by logging your mood above."
            />
          ) : (
            <Text style={theme.subheading}>Loading mood journal...</Text>
          )
        }
      />
    </View>
  );
}
