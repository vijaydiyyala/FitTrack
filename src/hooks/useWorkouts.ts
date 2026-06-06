import { useWorkoutContext } from "@/context/WorkoutContext";
import type { Workout } from "@/types";
import { useMemo } from "react";

export interface UseWorkoutsResult {
  workouts: Workout[];
  loading: boolean;
  error: string | null;
  today: Workout[];
  total: number;
}

function isToday(isoDate: string): boolean {
  const d = new Date(isoDate);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export function useWorkouts(): UseWorkoutsResult {
  const { workouts, loading, error } = useWorkoutContext();

  const today = useMemo(
    () => workouts.filter((w) => isToday(w.date)),
    [workouts],
  );

  return {
    workouts,
    loading,
    error,
    today,
    total: workouts.length,
  };
}
