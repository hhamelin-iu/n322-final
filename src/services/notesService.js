// Firestore CRUD service for user-scoped notes
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export function subscribeToNotes(userId, onUpdate, onError) {
  if (!userId) return () => {};

  const q = query(
    collection(db, "notes"),
    where("userId", "==", userId),
    orderBy("updatedAt", "desc")
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

export async function saveNote(userId, { id, title, body }) {
  if (!userId) throw new Error("User required");
  if (!title || !title.trim()) throw new Error("Title is required");

  if (id) {
    const ref = doc(db, "notes", id);
    await updateDoc(ref, {
      title: title.trim(),
      body: (body || "").trim(),
      updatedAt: serverTimestamp(),
    });
    return id;
  }

  const docRef = await addDoc(collection(db, "notes"), {
    userId,
    title: title.trim(),
    body: (body || "").trim(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function deleteNote(noteId) {
  if (!noteId) return;
  await deleteDoc(doc(db, "notes", noteId));
}
