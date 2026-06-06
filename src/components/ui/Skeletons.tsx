import { Skeleton } from "@/components/ui/Skeleton";
import { View } from "react-native";

function WorkoutRowSkeleton() {
  return (
    <View className="flex-row items-center gap-3 rounded-2xl border border-border bg-surface p-3">
      <Skeleton width={56} height={56} radius={14} />
      <View className="flex-1 gap-2">
        <Skeleton width="60%" height={15} />
        <Skeleton width="40%" height={12} />
      </View>
    </View>
  );
}

export function DashboardSkeleton() {
  return (
    <View className="flex-1 bg-bg p-4" style={{ gap: 12 }}>
      <Skeleton width="55%" height={28} />
      <Skeleton width="75%" height={16} />

      <View className="mt-2 flex-row gap-3">
        <Skeleton height={92} radius={18} style={{ flex: 1 }} />
        <Skeleton height={92} radius={18} style={{ flex: 1 }} />
      </View>
      <View className="flex-row gap-3">
        <Skeleton height={92} radius={18} style={{ flex: 1 }} />
        <Skeleton height={92} radius={18} style={{ flex: 1 }} />
      </View>

      <Skeleton width="45%" height={20} style={{ marginTop: 16 }} />
      <View style={{ gap: 10 }}>
        <WorkoutRowSkeleton />
        <WorkoutRowSkeleton />
        <WorkoutRowSkeleton />
      </View>
    </View>
  );
}

export function ExerciseListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <View style={{ gap: 10 }} className="px-4 pt-2">
      {Array.from({ length: rows }).map((_, i) => (
        <View
          key={i}
          className="flex-row items-center gap-3 rounded-2xl border border-border bg-surface p-3"
        >
          <Skeleton width={64} height={64} radius={14} />
          <View className="flex-1 gap-2">
            <Skeleton width="70%" height={15} />
            <Skeleton width="45%" height={12} />
          </View>
        </View>
      ))}
    </View>
  );
}
