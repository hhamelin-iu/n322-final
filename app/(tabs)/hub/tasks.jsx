import { useEffect, useMemo, useState } from "react";
import { Alert, FlatList, Platform, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../src/auth/AuthContext";
import {
  subscribeToTasks,
  toggleTaskCompleted,
  deleteTask,
} from "../../../src/services/tasksService";
import PrimaryButton from "../../../components/PrimaryButton";
import StatusMessage from "../../../components/StatusMessage";
import TapScale from "../../../components/TapScale";
import Card from "../../../components/Card";
import Badge from "../../../components/Badge";
import EmptyState from "../../../components/EmptyState";
import { usePalette, useTheme } from "../../../styles/theme";

export default function TaskListScreen() {
  const theme = useTheme();
  const router = useRouter();
  const palette = usePalette();
  const { user, loading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all"); // 'all', 'pending', 'completed'
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingTasks, setLoadingTasks] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    setLoadingTasks(true);
    const unsubscribe = subscribeToTasks(
      user.uid,
      (rows) => {
        setTasks(rows);
        setError("");
        setLoadingTasks(false);
      },
      (err) => {
        setError(err.message || "Could not load tasks.");
        setTasks([]);
        setLoadingTasks(false);
      }
    );
    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(""), 2600);
    return () => clearTimeout(timer);
  }, [success]);

  const handleToggle = async (task) => {
    try {
      await toggleTaskCompleted(task.id, task.completed);
      setSuccess(task.completed ? "Task marked pending" : "Task completed! 🎉");
    } catch (e) {
      setError("Could not update task status.");
    }
  };

  const handleDelete = async (taskId) => {
    const doDelete = async () => {
      try {
        await deleteTask(taskId);
        setSuccess("Task deleted");
      } catch (e) {
        setError(e.message || "Could not delete task.");
      }
    };

    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.confirm("Delete this task permanently?")) {
        doDelete();
      }
      return;
    }

    Alert.alert("Delete task", "Remove this task permanently?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: doDelete },
    ]);
  };

  const filteredTasks = useMemo(() => {
    if (filter === "completed") return tasks.filter((t) => t.completed);
    if (filter === "pending") return tasks.filter((t) => !t.completed);
    return tasks;
  }, [tasks, filter]);

  const header = useMemo(
    () => (
      <View style={{ gap: 12, marginBottom: 16 }}>
        <Text style={theme.heading}>Your tasks</Text>
        <Text style={theme.subheading}>
          Organize your tasks, check off completed items, and track your progress.
        </Text>
        {!!success && <StatusMessage message={success} type="success" />}
        {!!error && <StatusMessage message={error} type="error" />}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          <View style={{ flexDirection: "row", gap: 8 }}>
            {["all", "pending", "completed"].map((tab) => {
              const active = filter === tab;
              return (
                <Pressable
                  key={tab}
                  onPress={() => setFilter(tab)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 20,
                    backgroundColor: active
                      ? palette.badgeBg
                      : palette.surfaceSecondary,
                    borderWidth: 1,
                    borderColor: active ? palette.badgeBorder : palette.border,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "700",
                      color: active ? palette.badgeText : palette.muted,
                      textTransform: "capitalize",
                    }}
                  >
                    {tab}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <PrimaryButton
            title="+ Add task"
            onPress={() => router.push("/hub/item-form")}
          />
        </View>
      </View>
    ),
    [error, filter, palette, router, success, theme]
  );

  const renderItem = ({ item }) => {
    const titleText = item.name || item.title || "Untitled Task";
    const isCompleted = !!item.completed;

    return (
      <Card style={{ gap: 12 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <Pressable
            onPress={() => handleToggle(item)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              flex: 1,
            }}
          >
            <Ionicons
              name={isCompleted ? "checkmark-circle" : "ellipse-outline"}
              size={24}
              color={isCompleted ? "#22c55e" : palette.muted}
            />
            <Text
              style={[
                theme.heading,
                { fontSize: 18 },
                isCompleted && {
                  textDecorationLine: "line-through",
                  color: palette.muted,
                },
              ]}
            >
              {titleText}
            </Text>
          </Pressable>

          <Badge
            label={isCompleted ? "Completed" : "Pending"}
            type={isCompleted ? "success" : "pending"}
          />
        </View>

        {!!item.details && (
          <Text style={[theme.subheading, { fontSize: 14 }]}>
            {item.details}
          </Text>
        )}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 12,
            marginTop: 4,
            borderTopWidth: 1,
            borderTopColor: palette.border,
            paddingTop: 10,
          }}
        >
          <Pressable
            onPress={() =>
              router.push({ pathname: "/hub/item-form", params: { id: item.id } })
            }
          >
            <Text style={{ color: palette.accent, fontWeight: "700", fontSize: 14 }}>
              Edit
            </Text>
          </Pressable>

          <Pressable onPress={() => handleDelete(item.id)}>
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
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          !loadingTasks ? (
            <EmptyState
              iconName="checkbox-outline"
              title={
                filter === "all"
                  ? "No tasks yet"
                  : `No ${filter} tasks`
              }
              description="Keep track of your to-dos by creating your first task."
              actionTitle="Add a task"
              onAction={() => router.push("/hub/item-form")}
            />
          ) : (
            <Text style={theme.subheading}>Loading tasks...</Text>
          )
        }
      />
    </View>
  );
}
