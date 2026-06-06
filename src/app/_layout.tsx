import "../global.css";

import { AnimatedSplash } from "@/components/AnimatedSplash";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { OfflineBanner } from "@/components/OfflineBanner";
import { COLORS } from "@/constants";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { DialogProvider } from "@/context/DialogContext";
import { WorkoutProvider } from "@/context/WorkoutContext";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { user, initializing } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (initializing) return;
    const inAuthGroup = segments[0] === "(auth)";
    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [user, initializing, segments, router]);

  if (initializing) {
    return <LoadingSpinner label="Loading FitTrack…" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="workout/[id]"
        options={{
          headerShown: true,
          title: "Workout",
          headerStyle: { backgroundColor: COLORS.surface },
          headerTintColor: COLORS.primary,
          headerTitleStyle: {
            color: COLORS.text,
            fontFamily: "PlusJakartaSans_700Bold",
          },
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [splashDone, setSplashDone] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: COLORS.background }}
    >
      <KeyboardProvider>
        <AuthProvider>
          <WorkoutProvider>
            <DialogProvider>
              <StatusBar style="light" />
              <RootNavigator />
              <OfflineBanner />
            </DialogProvider>
          </WorkoutProvider>
        </AuthProvider>
        {!splashDone ? (
          <AnimatedSplash onFinish={() => setSplashDone(true)} />
        ) : null}
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
