import type { LatLngExpression } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

interface Coordinates {
  lat: number;
  lng: number;
}

interface MapViewProps {
  position: Coordinates;
}

const MapView = ({ position }: MapViewProps) => {
  const center: LatLngExpression = [position.lat, position.lng];
  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "50vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <Marker position={center}>
        <Popup>
          This item was found here.
          <br />
          Latitude: {position.lat.toFixed(5)}
          <br />
          Longitude: {position.lng.toFixed(5)}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapView;
