import type { ReactNode } from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

export function AuthScreen({ children }: { children: ReactNode }) {
  return (
    <View className="flex-1 bg-bg">
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            padding: 24,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bottomOffset={24}
        >
          {children}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </View>
  );
}
