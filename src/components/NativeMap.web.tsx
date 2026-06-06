import { Txt } from "@/components/ui/Txt";
import type { GymPlace } from "@/types";
import { forwardRef } from "react";
import { View } from "react-native";

export interface NativeMapProps {
  region: { latitude: number; longitude: number };
  places: GymPlace[];
  showsUserLocation?: boolean;
}

export const NativeMap = forwardRef<unknown, NativeMapProps>(function NativeMap(
  { places },
  _ref,
) {
  return (
    <View className="absolute inset-0 items-center justify-center gap-2 bg-bg p-6">
      <Txt className="text-5xl">🗺️</Txt>
      <Txt weight="semibold" className="text-center text-base">
        Map view is available on iOS and Android
      </Txt>
      <Txt className="text-sm text-muted">
        {places.length} nearby place{places.length === 1 ? "" : "s"} found
      </Txt>
    </View>
  );
});
