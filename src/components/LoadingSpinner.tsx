import { Txt } from "@/components/ui/Txt";
import { COLORS } from "@/constants";
import { ActivityIndicator, View } from "react-native";

interface LoadingSpinnerProps {
  label?: string;
  fullscreen?: boolean;
}

export function LoadingSpinner({ label, fullscreen = true }: LoadingSpinnerProps) {
  return (
    <View
      className={`items-center justify-center gap-3 p-6 ${
        fullscreen ? "flex-1 bg-bg" : ""
      }`}
    >
      <ActivityIndicator size="large" color={COLORS.primary} />
      {label ? (
        <Txt className="text-sm text-muted">{label}</Txt>
      ) : null}
    </View>
  );
}
