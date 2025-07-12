import { useState } from "react";
import {
  Popup,
  Marker,
  TileLayer,
  MapContainer,
  useMapEvents,
} from "react-leaflet";
import type { LatLng, LatLngExpression } from "leaflet";

interface MapSelectProps {
  onLocationSelect?: (latlng: LatLng) => void;
  initialPosition?: LatLngExpression;
}

const MapSelect = ({ onLocationSelect, initialPosition }: MapSelectProps) => {
  const defaultPosition: LatLngExpression = initialPosition || [
    27.7172, 85.324,
  ];
  return (
    <MapContainer
      center={defaultPosition}
      zoom={13}
      style={{ height: "50vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker onLocationSelect={onLocationSelect} />
    </MapContainer>
  );
};

export default MapSelect;

const LocationMarker = ({
  onLocationSelect,
}: {
  onLocationSelect?: (latlng: LatLng) => void;
}) => {
  const [position, setPosition] = useState<LatLng | null>(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      if (onLocationSelect) {
        onLocationSelect(e.latlng);
      }
    },
  });

  return position ? (
    <Marker position={position}>
      <Popup>Selected Location</Popup>
    </Marker>
  ) : null;
};
