import { Txt } from "@/components/ui/Txt";
import { COLORS } from "@/constants";
import { useWorkoutContext } from "@/context/WorkoutContext";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function OfflineBanner() {
  const { isOffline } = useWorkoutContext();
  const insets = useSafeAreaInsets();

  if (!isOffline) return null;

  return (
    <View
      pointerEvents="none"
      className="absolute left-0 right-0 z-50 items-center"
      style={{ top: insets.top + 6 }}
    >
      <View className="flex-row items-center gap-1.5 rounded-full border border-border bg-elevated px-3 py-1.5">
        <Ionicons name="cloud-offline-outline" size={14} color={COLORS.textMuted} />
        <Txt weight="semibold" className="text-xs text-muted">
          Offline — changes sync when reconnected
        </Txt>
      </View>
    </View>
  );
}
