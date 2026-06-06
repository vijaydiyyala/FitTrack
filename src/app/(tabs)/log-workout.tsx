import { ExerciseSearchBar } from "@/components/ExerciseSearchBar";
import { Button } from "@/components/ui/Button";
import { ExerciseListSkeleton } from "@/components/ui/Skeletons";
import { Txt } from "@/components/ui/Txt";
import { BODY_PARTS } from "@/constants";
import { useDialog } from "@/context/DialogContext";
import { useWorkoutContext } from "@/context/WorkoutContext";
import { useExerciseSearch } from "@/hooks/useExerciseSearch";
import { exerciseGifSource } from "@/services/exerciseApi";
import type { Exercise, WorkoutSet } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, ScrollView, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LogWorkoutScreen() {
  const [term, setTerm] = useState("");
  const [bodyPart, setBodyPart] = useState<string | undefined>(undefined);
  const [selected, setSelected] = useState<Exercise | null>(null);

  const { results, loading, error } = useExerciseSearch(term, bodyPart);

  if (selected) {
    return (
      <WorkoutBuilder exercise={selected} onBack={() => setSelected(null)} />
    );
  }

  return (
    <View className="flex-1 bg-bg">
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <View className="gap-3 p-4">
          <Txt weight="extrabold" className="text-3xl">
            Log a workout
          </Txt>
          <ExerciseSearchBar value={term} onChangeText={setTerm} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingVertical: 2 }}
          >
            {BODY_PARTS.map((part) => {
              const active = bodyPart === part;
              return (
                <Pressable
                  key={part}
                  onPress={() => setBodyPart(active ? undefined : part)}
                  className={`rounded-full border px-3.5 py-2 ${
                    active
                      ? "border-accent bg-accent"
                      : "border-border bg-surface"
                  }`}
                >
                  <Txt
                    weight={active ? "semibold" : "regular"}
                    className={`text-[13px] capitalize ${
                      active ? "text-accent-fg" : "text-muted"
                    }`}
                  >
                    {part}
                  </Txt>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {error ? (
          <Txt className="px-4 text-sm text-danger">{error}</Txt>
        ) : null}

        {loading ? (
          <ExerciseListSkeleton />
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 24,
              gap: 10,
            }}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <Txt className="mt-10 text-center text-sm text-muted">
                {term || bodyPart
                  ? "No exercises found."
                  : "Search by name or pick a body part to begin."}
              </Txt>
            }
            renderItem={({ item }) => (
              <Pressable
                onPress={() => setSelected(item)}
                className="flex-row items-center gap-3 rounded-2xl border border-border bg-surface p-3 active:opacity-70"
              >
                <Image
                  source={exerciseGifSource(item.gifUrl)}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 10,
                    backgroundColor: "#0A0C0B",
                  }}
                  contentFit="cover"
                  transition={150}
                />
                <View className="flex-1 gap-0.5">
                  <Txt
                    weight="semibold"
                    className="text-base capitalize"
                    numberOfLines={1}
                  >
                    {item.name}
                  </Txt>
                  <Txt className="text-[13px] capitalize text-muted">
                    {item.bodyPart} · {item.target}
                  </Txt>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6B7270" />
              </Pressable>
            )}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

function WorkoutBuilder({
  exercise,
  onBack,
}: {
  exercise: Exercise;
  onBack: () => void;
}) {
  const { addWorkout } = useWorkoutContext();
  const dialog = useDialog();
  const router = useRouter();
  const [sets, setSets] = useState<WorkoutSet[]>([{ reps: 10, weight: 0 }]);
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  function updateSet(index: number, field: keyof WorkoutSet, value: string) {
    const num = Number(value.replace(/[^0-9.]/g, "")) || 0;
    setSets((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: num } : s)),
    );
  }

  function addSet() {
    setSets((prev) => [
      ...prev,
      { ...(prev[prev.length - 1] ?? { reps: 10, weight: 0 }) },
    ]);
  }

  function removeSet(index: number) {
    setSets((prev) =>
      prev.length > 1 ? prev.filter((_, i) => i !== index) : prev,
    );
  }

  async function handleSave() {
    setSaving(true);
    try {
      await addWorkout({
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        bodyPart: exercise.bodyPart,
        target: exercise.target,
        gifUrl: exercise.gifUrl,
        sets,
        durationMin: duration ? Number(duration) : undefined,
        notes: notes.trim() || undefined,
        date: new Date().toISOString(),
      });
      router.replace("/(tabs)");
    } catch (err) {
      await dialog.alert({
        title: "Save failed",
        message: err instanceof Error ? err.message : "Try again.",
      });
      setSaving(false);
    }
  }

  return (
    <View className="flex-1 bg-bg">
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <KeyboardAwareScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 48, gap: 12 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bottomOffset={24}
        >
          <Pressable
            onPress={onBack}
            hitSlop={8}
            className="flex-row items-center gap-1 self-start active:opacity-60"
          >
            <Ionicons name="chevron-back" size={18} color="#A3E635" />
            <Txt weight="semibold" className="text-[15px] text-accent">
              Back to search
            </Txt>
          </Pressable>

          <Image
            source={exerciseGifSource(exercise.gifUrl)}
            style={{
              width: "100%",
              height: 200,
              borderRadius: 16,
              backgroundColor: "#14181A",
            }}
            contentFit="cover"
          />
          <Txt weight="extrabold" className="text-2xl capitalize">
            {exercise.name}
          </Txt>
          <Txt className="text-sm capitalize text-muted">
            {exercise.bodyPart} · {exercise.target} · {exercise.equipment}
          </Txt>

          <Txt weight="bold" className="mt-2 text-[15px]">
            Sets
          </Txt>
          {sets.map((set, i) => (
            <View key={i} className="flex-row items-end gap-2.5">
              <Txt
                weight="bold"
                className="h-11 w-6 text-center text-muted"
                style={{ lineHeight: 44 }}
              >
                {i + 1}
              </Txt>
              <View className="flex-1 gap-1">
                <Txt className="text-xs text-muted">Reps</Txt>
                <TextInput
                  className="h-11 rounded-xl border border-border bg-elevated px-3 text-base text-fg font-jakarta-medium"
                  keyboardType="number-pad"
                  value={String(set.reps)}
                  onChangeText={(v) => updateSet(i, "reps", v)}
                />
              </View>
              <View className="flex-1 gap-1">
                <Txt className="text-xs text-muted">Weight (kg)</Txt>
                <TextInput
                  className="h-11 rounded-xl border border-border bg-elevated px-3 text-base text-fg font-jakarta-medium"
                  keyboardType="decimal-pad"
                  value={String(set.weight)}
                  onChangeText={(v) => updateSet(i, "weight", v)}
                />
              </View>
              <Pressable
                onPress={() => removeSet(i)}
                hitSlop={8}
                className="h-11 w-8 items-center justify-center active:opacity-60"
              >
                <Ionicons name="close" size={18} color="#F87171" />
              </Pressable>
            </View>
          ))}

          <Pressable
            onPress={addSet}
            className="self-start rounded-xl border border-dashed border-accent px-3.5 py-2 active:opacity-70"
          >
            <Txt weight="semibold" className="text-accent">
              + Add set
            </Txt>
          </Pressable>

          <Txt weight="bold" className="mt-2 text-[15px]">
            Duration (min)
          </Txt>
          <TextInput
            className="h-12 rounded-xl border border-border bg-elevated px-3 text-base text-fg font-jakarta-medium"
            keyboardType="number-pad"
            placeholder="Optional"
            placeholderTextColor="#6B7270"
            value={duration}
            onChangeText={setDuration}
          />

          <Txt weight="bold" className="mt-2 text-[15px]">
            Notes
          </Txt>
          <TextInput
            className="min-h-[80px] rounded-xl border border-border bg-elevated px-3 py-3 text-base text-fg font-jakarta-medium"
            placeholder="Optional"
            placeholderTextColor="#6B7270"
            value={notes}
            onChangeText={setNotes}
            multiline
            textAlignVertical="top"
          />

          <Button
            label={saving ? "Saving…" : "Save workout"}
            onPress={handleSave}
            loading={saving}
            className="mt-4"
          />
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </View>
  );
}
