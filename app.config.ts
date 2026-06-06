import { ConfigContext, ExpoConfig } from "expo/config";

/**
 * Dynamic Expo config. Everything static lives in app.json; this file layers in
 * values that must come from the environment at build time — namely the native
 * Google Maps SDK key used by react-native-maps on Android and iOS.
 *
 * Set EXPO_PUBLIC_GOOGLE_MAPS_API_KEY in your .env (see .env.example).
 */
export default ({ config }: ConfigContext): ExpoConfig => {
  const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  return {
    ...config,
    name: config.name ?? "FitTrack",
    slug: config.slug ?? "FitTrackApp",
    ios: {
      ...config.ios,
      config: {
        ...config.ios?.config,
        googleMapsApiKey,
      },
    },
    android: {
      ...config.android,
      config: {
        ...config.android?.config,
        googleMaps: {
          apiKey: googleMapsApiKey,
        },
      },
    },
  };
};
