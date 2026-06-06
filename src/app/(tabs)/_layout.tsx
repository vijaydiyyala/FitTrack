import { COLORS } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import type { ColorValue } from "react-native";

type IoniconName = keyof typeof Ionicons.glyphMap;

function icon(base: string) {
  return ({ color, focused }: { color: ColorValue; focused: boolean; size: number }) => (
    <Ionicons
      name={(focused ? base : `${base}-outline`) as IoniconName}
      size={24}
      color={color as string}
    />
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.faint,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          elevation: 0,
          height: 84,
          paddingTop: 8,
        },
        tabBarItemStyle: { paddingTop: 2 },
        tabBarLabelStyle: {
          fontFamily: "PlusJakartaSans_600SemiBold",
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Home", tabBarIcon: icon("home") }}
      />
      <Tabs.Screen
        name="log-workout"
        options={{ title: "Log", tabBarIcon: icon("add-circle") }}
      />
      <Tabs.Screen
        name="map"
        options={{ title: "Map", tabBarIcon: icon("location") }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile", tabBarIcon: icon("person") }}
      />
    </Tabs>
  );
}
