import dynamic from "next/dynamic";
import React from "react";

// Dynamisk import av MapComponent, uten SSR
const MapComponent = dynamic(() => import("../../components/map/mapComponent"), {
  ssr: false,
});

export default function MapPage() {
  return (
    <>
      <h1>Map</h1>
      {/* Her rendres kartet i main-delen av layouten */}
      <MapComponent />
    </>
  );
}
