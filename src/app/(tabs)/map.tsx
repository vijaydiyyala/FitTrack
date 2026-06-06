import { LoadingSpinner } from "@/components/LoadingSpinner";
import { NativeMap } from "@/components/NativeMap";
import { Txt } from "@/components/ui/Txt";
import { MAP_CONFIG } from "@/constants";
import { useLocation } from "@/hooks/useLocation";
import { fetchNearbyPlaces } from "@/services/mapsService";
import type { GymPlace } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, View } from "react-native";
import type MapView from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MapScreen() {
  const { location, loading: locating, error: locationError } = useLocation();
  const [places, setPlaces] = useState<GymPlace[]>([]);
  const [placesError, setPlacesError] = useState<string | null>(null);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (!location) return;
    let cancelled = false;
    setLoadingPlaces(true);
    setPlacesError(null);
    fetchNearbyPlaces(location.latitude, location.longitude)
      .then((results) => {
        if (!cancelled) setPlaces(results);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setPlacesError(err instanceof Error ? err.message : "Failed to load places.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingPlaces(false);
      });
    return () => {
      cancelled = true;
    };
  }, [location]);

  const region = useMemo(
    () =>
      location
        ? {
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: MAP_CONFIG.zoomedDelta,
            longitudeDelta: MAP_CONFIG.zoomedDelta,
          }
        : MAP_CONFIG.defaultRegion,
    [location],
  );

  function recenter() {
    mapRef.current?.animateToRegion(region, 600);
  }

  if (locating) {
    return <LoadingSpinner label="Finding your location…" />;
  }

  if (locationError) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center gap-2 bg-bg p-6">
        <Ionicons name="location-outline" size={48} color="#9AA3A1" />
        <Txt weight="bold" className="text-lg">
          Location unavailable
        </Txt>
        <Txt weight="medium" className="text-center text-sm text-muted">
          {locationError}
        </Txt>
      </SafeAreaView>
    );
  }

  const gymCount = places.filter((p) => p.type === "gym").length;
  const parkCount = places.filter((p) => p.type === "park").length;

  return (
    <View className="flex-1 bg-bg">
      <NativeMap ref={mapRef} region={region} places={places} />

      <SafeAreaView
        style={{ position: "absolute", top: 0, left: 0, right: 0 }}
        pointerEvents="box-none"
        edges={["top"]}
      >
        <View className="mx-4 mt-2 flex-row items-center gap-3 rounded-2xl border border-border bg-surface/95 px-4 py-3">
          <View className="h-9 w-9 items-center justify-center rounded-xl bg-accent">
            <Ionicons name="navigate" size={18} color="#0A0C0B" />
          </View>
          <View className="flex-1">
            <Txt weight="bold" className="text-base">
              Nearby
            </Txt>
            {loadingPlaces ? (
              <Txt weight="medium" className="text-sm text-muted">
                Loading places…
              </Txt>
            ) : placesError ? (
              <Txt weight="medium" className="text-sm text-danger" numberOfLines={1}>
                {placesError}
              </Txt>
            ) : (
              <Txt weight="medium" className="text-sm text-muted">
                🏋️ {gymCount} gyms · 🌳 {parkCount} parks
              </Txt>
            )}
          </View>
        </View>
      </SafeAreaView>

      <Pressable
        onPress={recenter}
        accessibilityRole="button"
        accessibilityLabel="Recenter on my location"
        className="absolute bottom-6 right-4 h-14 w-14 items-center justify-center rounded-full border border-border bg-surface active:opacity-80"
        style={{
          shadowColor: "#000",
          shadowOpacity: 0.4,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 3 },
          elevation: 6,
        }}
      >
        <Ionicons name="locate" size={26} color="#A3E635" />
      </Pressable>
    </View>
  );
}
