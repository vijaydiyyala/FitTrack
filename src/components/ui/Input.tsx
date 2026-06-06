import { Ionicons } from "@expo/vector-icons";
import { forwardRef, useState } from "react";
import { Pressable, TextInput, View, type TextInputProps } from "react-native";
import { Txt } from "./Txt";

interface InputProps extends Omit<TextInputProps, "secureTextEntry"> {
  label?: string;
  password?: boolean;
  error?: string | null;
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  { label, password = false, error, className, ...rest },
  ref,
) {
  const [hidden, setHidden] = useState(true);
  const secure = password && hidden;

  return (
    <View className="gap-2">
      {label ? (
        <Txt weight="semibold" className="text-sm text-muted">
          {label}
        </Txt>
      ) : null}

      <View
        className={`h-14 flex-row items-center rounded-2xl border bg-elevated px-4 ${
          error ? "border-danger" : "border-border"
        }`}
      >
        <TextInput
          ref={ref}
          secureTextEntry={secure}
          placeholderTextColor="#6B7270"
          className={`flex-1 text-base text-fg ${className ?? ""}`}
          style={{ fontFamily: "PlusJakartaSans_500Medium" }}
          {...rest}
        />
        {password ? (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            hitSlop={10}
            className="pl-3 active:opacity-60"
            accessibilityRole="button"
            accessibilityLabel={hidden ? "Show password" : "Hide password"}
          >
            <Ionicons
              name={hidden ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#9AA3A1"
            />
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <Txt weight="medium" className="text-sm text-danger">
          {error}
        </Txt>
      ) : null}
    </View>
  );
});
