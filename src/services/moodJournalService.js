// Firestore CRUD service for user-scoped mood journal entries
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export function subscribeToMoodEntries(userId, onUpdate, onError) {
  if (!userId) return () => {};

  const q = query(
    collection(db, "moodEntries"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    q,
    (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      onUpdate(rows);
    },
    (err) => {
      if (onError) onError(err);
    }
  );
}

export async function saveMoodEntry(userId, { mood, note }) {
  if (!userId) throw new Error("User required");
  if (!mood) throw new Error("Mood selection is required");

  const docRef = await addDoc(collection(db, "moodEntries"), {
    userId,
    mood,
    note: (note || "").trim(),
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function deleteMoodEntry(entryId) {
  if (!entryId) return;
  await deleteDoc(doc(db, "moodEntries", entryId));
}
