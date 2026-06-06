import { COLLECTIONS } from "@/constants";
import { db } from "@/services/firebase";
import type { NewWorkout, User, Workout } from "@/types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

function workoutsRef(uid: string) {
  return collection(db, COLLECTIONS.users, uid, COLLECTIONS.workouts);
}

export async function addWorkout(
  uid: string,
  workout: NewWorkout,
): Promise<string> {
  const ref = await addDoc(workoutsRef(uid), {
    ...workout,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function deleteWorkout(
  uid: string,
  workoutId: string,
): Promise<void> {
  await deleteDoc(
    doc(db, COLLECTIONS.users, uid, COLLECTIONS.workouts, workoutId),
  );
}

export async function getWorkout(
  uid: string,
  workoutId: string,
): Promise<Workout | null> {
  const snap = await getDoc(
    doc(db, COLLECTIONS.users, uid, COLLECTIONS.workouts, workoutId),
  );
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<Workout, "id">) };
}

export function subscribeToWorkouts(
  uid: string,
  onChange: (workouts: Workout[], fromCache: boolean) => void,
  onError?: (error: Error) => void,
): () => void {
  const q = query(workoutsRef(uid), orderBy("date", "desc"));
  return onSnapshot(
    q,
    { includeMetadataChanges: true },
    (snapshot) => {
      const workouts = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Workout, "id">),
      }));
      onChange(workouts, snapshot.metadata.fromCache);
    },
    (error) => onError?.(error),
  );
}

export async function upsertUserProfile(user: User): Promise<void> {
  await setDoc(doc(db, COLLECTIONS.users, user.uid), user, { merge: true });
}

export async function getUserProfile(uid: string): Promise<User | null> {
  const snap = await getDoc(doc(db, COLLECTIONS.users, uid));
  if (!snap.exists()) return null;
  return snap.data() as User;
}
