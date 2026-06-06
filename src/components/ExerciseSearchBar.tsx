import { TextInput, View } from "react-native";

interface ExerciseSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function ExerciseSearchBar({
  value,
  onChangeText,
  placeholder = "Search exercises…",
}: ExerciseSearchBarProps) {
  return (
    <View className="rounded-2xl border border-border bg-surface px-4">
      <TextInput
        className="h-[46px] text-base text-fg"
        style={{ fontFamily: "PlusJakartaSans_500Medium" }}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9AA3A1"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
    </View>
  );
}
