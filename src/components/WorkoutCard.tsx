import { Txt } from "@/components/ui/Txt";
import { exerciseGifSource } from "@/services/exerciseApi";
import type { Workout } from "@/types";
import { Image } from "expo-image";
import { Pressable, View } from "react-native";

interface WorkoutCardProps {
  workout: Workout;
  onPress?: () => void;
  onDelete?: () => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function setsSummary(workout: Workout): string {
  const setCount = workout.sets.length;
  const totalReps = workout.sets.reduce((sum, s) => sum + s.reps, 0);
  return `${setCount} set${setCount === 1 ? "" : "s"} · ${totalReps} reps`;
}

export function WorkoutCard({ workout, onPress, onDelete }: WorkoutCardProps) {
  return (
    <Pressable
      className="flex-row items-center gap-3 rounded-2xl border border-border bg-surface p-3 active:opacity-70"
      onPress={onPress}
    >
      {workout.gifUrl ? (
        <Image
          source={exerciseGifSource(workout.gifUrl)}
          style={{ width: 56, height: 56, borderRadius: 10, backgroundColor: "#0A0C0B" }}
          contentFit="cover"
          transition={150}
        />
      ) : (
        <View className="h-14 w-14 items-center justify-center rounded-[10px] bg-bg">
          <Txt weight="bold" className="text-[22px] text-accent">
            {workout.exerciseName.charAt(0).toUpperCase()}
          </Txt>
        </View>
      )}

      <View className="flex-1 gap-0.5">
        <Txt weight="semibold" className="text-base capitalize" numberOfLines={1}>
          {workout.exerciseName}
        </Txt>
        <Txt className="text-[13px] text-muted">{setsSummary(workout)}</Txt>
        <Txt className="text-xs text-muted">{formatDate(workout.date)}</Txt>
      </View>

      {onDelete ? (
        <Pressable
          className="h-8 w-8 items-center justify-center rounded-full bg-bg"
          onPress={onDelete}
          hitSlop={8}
          accessibilityLabel={`Delete ${workout.exerciseName}`}
        >
          <Txt weight="bold" className="text-sm text-danger">
            ✕
          </Txt>
        </Pressable>
      ) : null}
    </Pressable>
  );
}
