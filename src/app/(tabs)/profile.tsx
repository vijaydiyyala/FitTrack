import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Txt } from "@/components/ui/Txt";
import { WorkoutCard } from "@/components/WorkoutCard";
import { useAuth } from "@/context/AuthContext";
import { useDialog } from "@/context/DialogContext";
import { useWorkoutContext } from "@/context/WorkoutContext";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { workouts, loading, deleteWorkout } = useWorkoutContext();
  const dialog = useDialog();
  const router = useRouter();

  const totalSets = useMemo(
    () => workouts.reduce((sum, w) => sum + w.sets.length, 0),
    [workouts],
  );

  const memberSince = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString(undefined, {
        month: "short",
        year: "numeric",
      })
    : "—";

  async function confirmDelete(id: string, name: string) {
    const ok = await dialog.confirm({
      title: "Delete workout",
      message: `Remove "${name}" from your history? This can't be undone.`,
      confirmText: "Delete",
      destructive: true,
      icon: "trash-outline",
    });
    if (!ok) return;
    try {
      await deleteWorkout(id);
    } catch (err) {
      await dialog.alert({
        title: "Couldn't delete",
        message: err instanceof Error ? err.message : "Failed.",
      });
    }
  }

  async function confirmSignOut() {
    const ok = await dialog.confirm({
      title: "Sign out",
      message: "Are you sure you want to sign out?",
      confirmText: "Sign out",
      destructive: true,
      icon: "log-out-outline",
    });
    if (ok) signOut();
  }

  const initial = (user?.displayName ?? user?.email ?? "?").charAt(0).toUpperCase();

  return (
    <View className="flex-1 bg-bg">
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
          <View className="items-center gap-1.5 py-3">
            {user?.photoURL ? (
              <Image
                source={{ uri: user.photoURL }}
                style={{ width: 88, height: 88, borderRadius: 44 }}
                className="bg-surface"
              />
            ) : (
              <View className="h-[88px] w-[88px] items-center justify-center rounded-full bg-accent">
                <Txt weight="extrabold" className="text-4xl text-accent-fg">
                  {initial}
                </Txt>
              </View>
            )}
            <Txt weight="extrabold" className="text-2xl">
              {user?.displayName ?? "Athlete"}
            </Txt>
            <Txt className="text-sm text-muted">{user?.email}</Txt>
          </View>

          <View className="flex-row rounded-2xl border border-border bg-surface py-4">
            <Stat label="Workouts" value={workouts.length} />
            <Stat label="Total sets" value={totalSets} />
            <Stat label="Member since" value={memberSince} />
          </View>

          <Txt weight="bold" className="text-lg">
            Workout history
          </Txt>

          {loading ? (
            <LoadingSpinner label="Loading history…" fullscreen={false} />
          ) : workouts.length === 0 ? (
            <Txt className="text-sm text-muted">No workouts logged yet.</Txt>
          ) : (
            <View className="gap-2.5">
              {workouts.map((w) => (
                <WorkoutCard
                  key={w.id}
                  workout={w}
                  onPress={() => router.push(`/workout/${w.id}`)}
                  onDelete={() => confirmDelete(w.id, w.exerciseName)}
                />
              ))}
            </View>
          )}

          <Pressable
            className="mt-2 h-[50px] items-center justify-center rounded-xl border border-danger active:opacity-70"
            onPress={confirmSignOut}
          >
            <Txt weight="bold" className="text-base text-danger">
              Sign out
            </Txt>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <View className="flex-1 items-center gap-0.5">
      <Txt weight="extrabold" className="text-xl">
        {value}
      </Txt>
      <Txt className="text-xs text-muted">{label}</Txt>
    </View>
  );
}
