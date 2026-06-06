import { DashboardSkeleton } from "@/components/ui/Skeletons";
import { StatCard } from "@/components/StatCard";
import { Txt } from "@/components/ui/Txt";
import { WorkoutCard } from "@/components/WorkoutCard";
import { useAuth } from "@/context/AuthContext";
import { useWorkouts } from "@/hooks/useWorkouts";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { user } = useAuth();
  const { workouts, today, total, loading } = useWorkouts();
  const router = useRouter();

  const setsToday = useMemo(
    () => today.reduce((sum, w) => sum + w.sets.length, 0),
    [today],
  );
  const recent = useMemo(() => workouts.slice(0, 5), [workouts]);
  const firstName = (user?.displayName ?? "Athlete").split(" ")[0];

  if (loading) {
    return (
      <View className="flex-1 bg-bg">
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
          <DashboardSkeleton />
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-bg">
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
          <Txt weight="extrabold" className="text-3xl">
            Hi, {firstName} 👋
          </Txt>
          <Txt className="mb-2 text-base text-muted">
            Here&apos;s your training summary.
          </Txt>

          <View className="flex-row gap-3">
            <StatCard label="Workouts today" value={today.length} />
            <StatCard label="Sets today" value={setsToday} />
          </View>
          <View className="flex-row gap-3">
            <StatCard label="Total logged" value={total} />
            <StatCard
              label="Last session"
              value={workouts[0] ? formatRelative(workouts[0].date) : "—"}
            />
          </View>

          <View className="mt-4">
            <Txt weight="bold" className="text-lg">
              Recent workouts
            </Txt>
          </View>

          {recent.length === 0 ? (
            <View className="rounded-2xl border border-border bg-surface p-6">
              <Txt className="text-center text-sm text-muted">
                No workouts yet. Tap the Log tab to add your first one.
              </Txt>
            </View>
          ) : (
            <View className="gap-2.5">
              {recent.map((w) => (
                <WorkoutCard
                  key={w.id}
                  workout={w}
                  onPress={() => router.push(`/workout/${w.id}`)}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "1d ago";
  return `${days}d ago`;
}
