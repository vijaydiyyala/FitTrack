import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";

export interface Coords {
  latitude: number;
  longitude: number;
}

interface UseLocationResult {
  location: Coords | null;
  loading: boolean;
  error: string | null;
  granted: boolean;
}

export function useLocation(): UseLocationResult {
  const [location, setLocation] = useState<Coords | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [granted, setGranted] = useState(false);
  const subscription = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (cancelled) return;
        if (status !== "granted") {
          setError("Location permission was denied.");
          setLoading(false);
          return;
        }
        setGranted(true);

        const initial = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (cancelled) return;
        setLocation({
          latitude: initial.coords.latitude,
          longitude: initial.coords.longitude,
        });
        setLoading(false);

        subscription.current = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.Balanced, distanceInterval: 25 },
          (next) => {
            setLocation({
              latitude: next.coords.latitude,
              longitude: next.coords.longitude,
            });
          },
        );
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to get location.");
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      subscription.current?.remove();
      subscription.current = null;
    };
  }, []);

  return { location, loading, error, granted };
}
