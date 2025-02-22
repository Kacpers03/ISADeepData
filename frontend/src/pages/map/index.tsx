// pages/map/index.tsx
import dynamic from "next/dynamic";
import React from "react";

// Importer MapComponent dynamisk, med SSR avskrudd
const MapComponent = dynamic(() => import("../../components/map/mapComponent"), {
  ssr: false,
});

export default function MapPage() {
  return (
    <div>
      <h1>Map</h1>
      {/* Bruk den dynamiske importerte komponenten */}
      <MapComponent />
    </div>
  );
}
