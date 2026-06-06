import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Txt } from "@/components/ui/Txt";
import { useAuth } from "@/context/AuthContext";
import { useWorkoutContext } from "@/context/WorkoutContext";
import { exerciseGifSource } from "@/services/exerciseApi";
import { getWorkout } from "@/services/firestoreService";
import type { Workout } from "@/types";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { workouts } = useWorkoutContext();
  const fromContext = useMemo(
    () => workouts.find((w) => w.id === id) ?? null,
    [workouts, id],
  );
  const [workout, setWorkout] = useState<Workout | null>(fromContext);
  const [loading, setLoading] = useState(!fromContext);

  useEffect(() => {
    if (fromContext) {
      setWorkout(fromContext);
      setLoading(false);
      return;
    }
    if (!user || !id) return;
    let cancelled = false;
    setLoading(true);
    getWorkout(user.uid, id)
      .then((w) => !cancelled && setWorkout(w))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [fromContext, user, id]);

  if (loading) {
    return <LoadingSpinner label="Loading workout…" />;
  }

  if (!workout) {
    return (
      <View className="flex-1 items-center justify-center bg-bg">
        <Txt className="text-base text-muted">Workout not found.</Txt>
      </View>
    );
  }

  const totalReps = workout.sets.reduce((sum, s) => sum + s.reps, 0);
  const totalVolume = workout.sets.reduce(
    (sum, s) => sum + s.reps * s.weight,
    0,
  );

  function capitaliseEveryWord(text: string): string {
    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }
  return (
    <ScrollView
      className="flex-1 bg-bg"
      contentContainerStyle={{ padding: 16, gap: 8 }}
    >
      <Stack.Screen
        options={{ title: capitaliseEveryWord(workout.exerciseName) }}
      />

      {workout.gifUrl ? (
        <Image
          source={exerciseGifSource(workout.gifUrl)}
          style={{
            width: "100%",
            height: 220,
            borderRadius: 16,
            backgroundColor: "#14181A",
          }}
          contentFit="cover"
        />
      ) : null}

      <Txt weight="extrabold" className="mt-1 text-2xl capitalize">
        {workout.exerciseName}
      </Txt>
      {workout.bodyPart ? (
        <Txt className="text-sm capitalize text-muted">
          {workout.bodyPart}
          {workout.target ? ` · ${workout.target}` : ""}
        </Txt>
      ) : null}
      <Txt className="text-sm text-muted">
        {new Date(workout.date).toLocaleDateString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </Txt>

      <View className="mt-2 flex-row flex-wrap gap-3 rounded-2xl border border-border bg-surface p-4">
        <Summary label="Sets" value={workout.sets.length} />
        <Summary label="Total reps" value={totalReps} />
        <Summary label="Volume" value={`${totalVolume} kg`} />
        {workout.durationMin ? (
          <Summary label="Duration" value={`${workout.durationMin} min`} />
        ) : null}
      </View>

      <Txt weight="bold" className="mt-3 text-lg">
        Sets
      </Txt>
      <View className="overflow-hidden rounded-2xl border border-border bg-surface">
        <View className="flex-row bg-bg px-4 py-3">
          <Txt weight="bold" className="flex-[0.4] text-[13px] text-muted">
            #
          </Txt>
          <Txt weight="bold" className="flex-1 text-[13px] text-muted">
            Reps
          </Txt>
          <Txt weight="bold" className="flex-1 text-[13px] text-muted">
            Weight
          </Txt>
        </View>
        {workout.sets.map((set, i) => (
          <View key={i} className="flex-row border-t border-border px-4 py-3">
            <Txt className="flex-[0.4] text-[15px]">{i + 1}</Txt>
            <Txt className="flex-1 text-[15px]">{set.reps}</Txt>
            <Txt className="flex-1 text-[15px]">{set.weight} kg</Txt>
          </View>
        ))}
      </View>

      {workout.notes ? (
        <>
          <Txt weight="bold" className="mt-3 text-lg">
            Notes
          </Txt>
          <Txt className="rounded-2xl border border-border bg-surface p-4 text-[15px] leading-[22px]">
            {workout.notes}
          </Txt>
        </>
      ) : null}
    </ScrollView>
  );
}

function Summary({ label, value }: { label: string; value: string | number }) {
  return (
    <View className="min-w-[70px] gap-0.5">
      <Txt weight="extrabold" className="text-lg">
        {value}
      </Txt>
      <Txt className="text-xs text-muted">{label}</Txt>
    </View>
  );
}
