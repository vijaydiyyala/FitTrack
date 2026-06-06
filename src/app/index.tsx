import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";

export default function Index() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return <LoadingSpinner label="Loading FitTrack…" />;
  }

  return <Redirect href={user ? "/(tabs)" : "/(auth)/login"} />;
}
