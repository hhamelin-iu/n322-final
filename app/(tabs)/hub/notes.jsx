import { useEffect, useMemo, useState } from "react";
import { Alert, FlatList, Platform, Pressable, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../src/auth/AuthContext";
import {
  subscribeToNotes,
  saveNote,
  deleteNote,
} from "../../../src/services/notesService";
import PrimaryButton from "../../../components/PrimaryButton";
import StatusMessage from "../../../components/StatusMessage";
import Card from "../../../components/Card";
import EmptyState from "../../../components/EmptyState";
import { usePalette, useTheme } from "../../../styles/theme";

export default function NotesScreen() {
  const theme = useTheme();
  const palette = usePalette();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    setLoadingNotes(true);
    const unsubscribe = subscribeToNotes(
      user.uid,
      (rows) => {
        setNotes(rows);
        setError("");
        setLoadingNotes(false);
      },
      (err) => {
        setError(err.message || "Could not load notes.");
        setNotes([]);
        setLoadingNotes(false);
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
    setTitle("");
    setBody("");
    setEditingId(null);
  };

  const onSave = async () => {
    if (!user || saving) return;
    if (!title.trim()) {
      setError("Give your note a title.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await saveNote(user.uid, { id: editingId, title, body });
      setSuccess(editingId ? "Note updated" : "Note saved");
      resetForm();
    } catch (e) {
      setError(e.message || "Could not save note.");
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (note) => {
    setTitle(note.title || "");
    setBody(note.body || "");
    setEditingId(note.id);
  };

  const onDelete = async (noteId) => {
    const doDelete = async () => {
      try {
        await deleteNote(noteId);
        if (editingId === noteId) resetForm();
        setSuccess("Note removed");
      } catch (e) {
        setError(e.message || "Could not remove note.");
      }
    };

    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.confirm("Delete this note permanently?")) {
        doDelete();
      }
      return;
    }

    Alert.alert("Delete note", "Remove this note permanently?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: doDelete },
    ]);
  };

  const filteredNotes = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return notes;
    return notes.filter(
      (n) =>
        (n.title && n.title.toLowerCase().includes(q)) ||
        (n.body && n.body.toLowerCase().includes(q))
    );
  }, [notes, searchQuery]);

  const header = useMemo(
    () => (
      <View style={{ gap: 12, marginBottom: 16 }}>
        <Text style={theme.heading}>Notes</Text>
        <Text style={theme.subheading}>
          Write quick ideas, store snippets, and keep track of your thoughts.
        </Text>
        {!!success && <StatusMessage message={success} type="success" />}
        {!!error && <StatusMessage message={error} type="error" />}

        <Card style={{ gap: 12 }}>
          <Text style={[theme.heading, { fontSize: 18 }]}>
            {editingId ? "Edit Note" : "Create Note"}
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Note title..."
            placeholderTextColor={palette.muted}
            style={theme.input}
          />
          <TextInput
            value={body}
            onChangeText={setBody}
            placeholder="Write your note body here..."
            placeholderTextColor={palette.muted}
            style={[theme.input, { minHeight: 80, textAlignVertical: "top" }]}
            multiline
            numberOfLines={3}
          />
          <View style={{ flexDirection: "row", gap: 8, justifyContent: "flex-end" }}>
            {editingId && (
              <Pressable
                onPress={resetForm}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  backgroundColor: palette.surfaceSecondary,
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: palette.muted, fontWeight: "700" }}>Cancel</Text>
              </Pressable>
            )}
            <PrimaryButton
              title={saving ? "Saving..." : editingId ? "Update Note" : "Save Note"}
              onPress={onSave}
              loading={saving}
            />
          </View>
        </Card>

        {notes.length > 0 && (
          <View style={{ marginTop: 8 }}>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search notes..."
              placeholderTextColor={palette.muted}
              style={[theme.input, { paddingLeft: 14 }]}
            />
          </View>
        )}
      </View>
    ),
    [body, editingId, error, notes.length, palette, saving, searchQuery, success, theme, title]
  );

  const renderItem = ({ item }) => (
    <Card style={{ gap: 8 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={[theme.heading, { fontSize: 18, flex: 1 }]}>{item.title}</Text>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Pressable onPress={() => onEdit(item)}>
            <Text style={{ color: palette.accent, fontWeight: "700" }}>Edit</Text>
          </Pressable>
          <Pressable onPress={() => onDelete(item.id)}>
            <Text style={{ color: palette.danger, fontWeight: "700" }}>Delete</Text>
          </Pressable>
        </View>
      </View>
      {!!item.body && (
        <Text style={[theme.subheading, { fontSize: 14, lineHeight: 20 }]}>
          {item.body}
        </Text>
      )}
    </Card>
  );

  return (
    <View style={theme.screen}>
      {header}
      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          !loadingNotes ? (
            <EmptyState
              iconName="create-outline"
              title={searchQuery ? "No matching notes" : "No notes yet"}
              description={
                searchQuery
                  ? "Try searching for a different keyword."
                  : "Write your first note above to get started."
              }
            />
          ) : (
            <Text style={theme.subheading}>Loading notes...</Text>
          )
        }
      />
    </View>
  );
}
