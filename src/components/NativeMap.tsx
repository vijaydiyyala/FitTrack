import { GymMarker } from "@/components/GymMarker";
import type { GymPlace } from "@/types";
import { forwardRef } from "react";
import { StyleSheet } from "react-native";
import MapView, { type Region } from "react-native-maps";

export interface NativeMapProps {
  region: Region;
  places: GymPlace[];
  showsUserLocation?: boolean;
}

const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#0f1413" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0f1413" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#9aa3a1" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#2a3133" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#b6bdbb" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0a1f1a" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#142a1c" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b7270" }],
  },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
];

export const NativeMap = forwardRef<MapView, NativeMapProps>(function NativeMap(
  { region, places, showsUserLocation = true },
  ref,
) {
  return (
    <MapView
      ref={ref}
      style={StyleSheet.absoluteFill}
      initialRegion={region}
      customMapStyle={DARK_MAP_STYLE}
      showsUserLocation={showsUserLocation}
      showsMyLocationButton={false}
      showsCompass={false}
    >
      {places.map((place) => (
        <GymMarker key={place.id} place={place} />
      ))}
    </MapView>
  );
});
