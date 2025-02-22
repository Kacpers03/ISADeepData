// components/map/MapComponent.tsx
import React, { useState } from "react";
import Map, { NavigationControl } from "react-map-gl";
import maplibregl from "maplibre-gl";

export default function MapComponent() {
  const [viewState, setViewState] = useState({
    longitude: 10.7522,  // Eksempel: Oslo
    latitude: 59.9139,
    zoom: 12,
  });

  return (
    <div style={{ width: "100%", height: "600px" }}>
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100%", height: "100%" }}
        mapLib={maplibregl}
        // Gratis Carto-bakgrunn
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      >
        <NavigationControl position="top-left" />
      </Map>
    </div>
  );
}
