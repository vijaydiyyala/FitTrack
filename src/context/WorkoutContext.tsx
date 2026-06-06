import { useAuth } from "@/context/AuthContext";
import {
  addWorkout as addWorkoutDoc,
  deleteWorkout as deleteWorkoutDoc,
  subscribeToWorkouts,
} from "@/services/firestoreService";
import type { NewWorkout, Workout } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface WorkoutContextValue {
  workouts: Workout[];
  loading: boolean;
  error: string | null;
  isOffline: boolean;
  addWorkout: (workout: Omit<NewWorkout, "userId">) => Promise<void>;
  deleteWorkout: (workoutId: string) => Promise<void>;
}

const WorkoutContext = createContext<WorkoutContextValue | undefined>(undefined);

const cacheKey = (uid: string) => `@fittrack/workouts/${uid}`;

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (!user) {
      setWorkouts([]);
      setLoading(false);
      setIsOffline(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);

    AsyncStorage.getItem(cacheKey(user.uid)).then((raw) => {
      if (cancelled || !raw) return;
      try {
        const cached = JSON.parse(raw) as Workout[];
        setWorkouts((current) => (current.length ? current : cached));
        setLoading(false);
      } catch {
      }
    });

    const unsubscribe = subscribeToWorkouts(
      user.uid,
      (next, fromCache) => {
        if (cancelled) return;
        setWorkouts(next);
        setLoading(false);
        setIsOffline(fromCache);
        AsyncStorage.setItem(cacheKey(user.uid), JSON.stringify(next)).catch(
          () => {},
        );
      },
      (err) => {
        if (cancelled) return;
        setError(err.message);
        setLoading(false);
      },
    );

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [user]);

  const value = useMemo<WorkoutContextValue>(
    () => ({
      workouts,
      loading,
      error,
      isOffline,
      addWorkout: async (workout) => {
        if (!user) throw new Error("Must be signed in to log a workout.");
        await addWorkoutDoc(user.uid, { ...workout, userId: user.uid });
      },
      deleteWorkout: async (workoutId) => {
        if (!user) throw new Error("Must be signed in.");
        await deleteWorkoutDoc(user.uid, workoutId);
      },
    }),
    [workouts, loading, error, isOffline, user],
  );

  return (
    <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>
  );
}

export function useWorkoutContext(): WorkoutContextValue {
  const ctx = useContext(WorkoutContext);
  if (!ctx) {
    throw new Error("useWorkoutContext must be used within a WorkoutProvider");
  }
  return ctx;
}
