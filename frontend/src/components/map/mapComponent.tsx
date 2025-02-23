import React, { useState } from "react";
import Map, { NavigationControl } from "react-map-gl";
import maplibregl from "maplibre-gl";
import styles from "../../styles/map/map.module.css"; // hvis du bruker CSS Modules

export default function MapComponent() {
  const [viewState, setViewState] = useState({
    longitude: 0,    // Nullmeridianen
    latitude: 20,    // Litt nord for ekvator
    zoom: 1,         // Zoom ut for å se mer av kloden
  });

  return (
    <div className={styles.mapContainer}>
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100%", height: "100%" }}
        mapLib={maplibregl}
        mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
        attributionControl={false}
      >
        <NavigationControl position="top-right" showCompass={false} />
      </Map>
    </div>
  );
}
