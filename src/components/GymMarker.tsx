import { Txt } from "@/components/ui/Txt";
import { COLORS } from "@/constants";
import type { GymPlace } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Linking, Platform, View } from "react-native";
import { Callout, Marker } from "react-native-maps";

interface GymMarkerProps {
  place: GymPlace;
}

function openInMaps(place: GymPlace) {
  const { latitude, longitude, name } = place;
  const label = encodeURIComponent(name);
  const web = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  const url =
    Platform.select({
      ios: `maps://?q=${label}&ll=${latitude},${longitude}`,
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${label})`,
    }) ?? web;
  Linking.openURL(url).catch(() => Linking.openURL(web));
}

export function GymMarker({ place }: GymMarkerProps) {
  const isGym = place.type === "gym";
  return (
    <Marker
      coordinate={{ latitude: place.latitude, longitude: place.longitude }}
      pinColor={isGym ? COLORS.primary : COLORS.success}
      onCalloutPress={() => openInMaps(place)}
    >
      <View
        className="h-[34px] w-[34px] items-center justify-center rounded-full border-2 border-surface"
        style={{ backgroundColor: isGym ? COLORS.primary : COLORS.success }}
      >
        <Txt className="text-base">{isGym ? "🏋️" : "🌳"}</Txt>
      </View>
      <Callout tooltip>
        <View className="w-[210px] gap-0.5 rounded-2xl border border-border bg-surface p-3">
          <Txt weight="bold" className="text-[15px]" numberOfLines={1}>
            {place.name}
          </Txt>
          <Txt className="mb-0.5 text-xs text-muted">{isGym ? "Gym" : "Park"}</Txt>
          {place.rating != null ? (
            <Txt className="text-xs text-muted">★ {place.rating.toFixed(1)}</Txt>
          ) : null}
          {place.address ? (
            <Txt className="text-xs text-muted" numberOfLines={2}>
              {place.address}
            </Txt>
          ) : null}
          {place.openNow != null ? (
            <Txt
              className={`text-xs ${place.openNow ? "text-success" : "text-danger"}`}
            >
              {place.openNow ? "Open now" : "Closed"}
            </Txt>
          ) : null}
          <View className="mt-2 flex-row items-center gap-1 border-t border-border pt-2">
            <Ionicons name="navigate" size={13} color={COLORS.primary} />
            <Txt weight="semibold" className="text-xs text-accent">
              Open in Maps
            </Txt>
          </View>
        </View>
      </Callout>
    </Marker>
  );
}
