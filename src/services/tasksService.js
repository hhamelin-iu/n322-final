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

export function subscribeToTasks(userId, onUpdate, onError) {
  if (!userId) return () => {};

  const q = query(
    collection(db, "tasks"),
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

export async function saveTask(userId, { id, name, details, dueDate, priority }) {
  if (!userId) throw new Error("User required");
  if (!name || !name.trim()) throw new Error("Task name is required");

  const taskData = {
    name: name.trim(),
    details: (details || "").trim(),
    dueDate: dueDate || "",
    priority: priority || "medium",
    updatedAt: serverTimestamp(),
  };

  if (id) {
    const ref = doc(db, "tasks", id);
    await updateDoc(ref, taskData);
    return id;
  }

  const docRef = await addDoc(collection(db, "tasks"), {
    userId,
    ...taskData,
    completed: false,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function toggleTaskCompleted(taskId, currentStatus) {
  if (!taskId) return;
  const ref = doc(db, "tasks", taskId);
  await updateDoc(ref, {
    completed: !currentStatus,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteTask(taskId) {
  if (!taskId) return;
  await deleteDoc(doc(db, "tasks", taskId));
}
