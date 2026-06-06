import { ActivityIndicator, Pressable, View } from "react-native";
import { Txt } from "./Txt";

interface ButtonProps {
  label: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "ghost";
  className?: string;
}

export function Button({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  className,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const primary = variant === "primary";

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`h-14 flex-row items-center justify-center rounded-2xl px-5 active:opacity-80 ${
        primary ? "bg-accent" : "border border-border bg-elevated"
      } ${isDisabled ? "opacity-50" : ""} ${className ?? ""}`}
    >
      {loading ? (
        <ActivityIndicator color={primary ? "#0A0C0B" : "#A3E635"} />
      ) : (
        <View className="flex-row items-center gap-2">
          <Txt
            weight="bold"
            className={`text-base ${primary ? "text-accent-fg" : "text-fg"}`}
          >
            {label}
          </Txt>
        </View>
      )}
    </Pressable>
  );
}
