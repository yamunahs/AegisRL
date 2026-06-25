import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

function AttackMap() {
  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={2}
      style={{
        height: "400px",
        width: "100%"
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[37.7749, -122.4194]}>
        <Popup>
          🇺🇸 USA Attack Source
        </Popup>
      </Marker>

      <Marker position={[28.6139, 77.209]}>
        <Popup>
          🇮🇳 India Attack Source
        </Popup>
      </Marker>

      <Marker position={[51.5074, -0.1278]}>
        <Popup>
          🇬🇧 UK Attack Source
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default AttackMap;