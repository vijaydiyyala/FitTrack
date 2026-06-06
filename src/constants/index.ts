export const EXERCISEDB = {
  baseUrl: "https://exercisedb.p.rapidapi.com",
  apiKey: process.env.EXPO_PUBLIC_EXERCISEDB_API_KEY ?? "",
  apiHost:
    process.env.EXPO_PUBLIC_EXERCISEDB_API_HOST ?? "exercisedb.p.rapidapi.com",
} as const;

export const GOOGLE_PLACES = {
  nearbyUrl:
    "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
  apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
  radiusMeters: 5000,
} as const;

export const COLLECTIONS = {
  users: "users",
  workouts: "workouts",
} as const;

export const MAP_CONFIG = {
  defaultRegion: {
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  },
  zoomedDelta: 0.02,
} as const;

export const COLORS = {
  primary: "#A3E635",
  primaryDark: "#8BC72E",
  onPrimary: "#0B0D10",
  background: "#0B0D10",
  surface: "#14171D",
  elevated: "#1C2027",
  text: "#F4F6F8",
  textMuted: "#99A1AE",
  faint: "#686F7C",
  border: "#292E38",
  danger: "#FB7185",
  success: "#4ADE80",
} as const;

export const BODY_PARTS = [
  "back",
  "cardio",
  "chest",
  "lower arms",
  "lower legs",
  "neck",
  "shoulders",
  "upper arms",
  "upper legs",
  "waist",
] as const;
