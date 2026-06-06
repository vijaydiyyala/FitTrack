import { GOOGLE_PLACES } from "@/constants";
import type { GymPlace } from "@/types";

interface PlacesResult {
  place_id: string;
  name: string;
  geometry: { location: { lat: number; lng: number } };
  vicinity?: string;
  rating?: number;
  opening_hours?: { open_now?: boolean };
}

interface PlacesResponse {
  status: string;
  results: PlacesResult[];
  error_message?: string;
}

async function nearby(
  latitude: number,
  longitude: number,
  type: "gym" | "park",
): Promise<GymPlace[]> {
  if (!GOOGLE_PLACES.apiKey) {
    throw new Error(
      "Google Maps API key missing. Set EXPO_PUBLIC_GOOGLE_MAPS_API_KEY in your .env.",
    );
  }
  const url = new URL(GOOGLE_PLACES.nearbyUrl);
  url.searchParams.set("location", `${latitude},${longitude}`);
  url.searchParams.set("radius", String(GOOGLE_PLACES.radiusMeters));
  url.searchParams.set("type", type);
  url.searchParams.set("key", GOOGLE_PLACES.apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Places request failed (${res.status})`);
  }
  const data = (await res.json()) as PlacesResponse;
  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    throw new Error(data.error_message ?? `Places error: ${data.status}`);
  }
  return data.results.map((r) => ({
    id: r.place_id,
    name: r.name,
    type,
    latitude: r.geometry.location.lat,
    longitude: r.geometry.location.lng,
    address: r.vicinity,
    rating: r.rating,
    openNow: r.opening_hours?.open_now,
  }));
}

export async function fetchNearbyPlaces(
  latitude: number,
  longitude: number,
): Promise<GymPlace[]> {
  const [gyms, parks] = await Promise.all([
    nearby(latitude, longitude, "gym"),
    nearby(latitude, longitude, "park"),
  ]);
  return [...gyms, ...parks];
}
