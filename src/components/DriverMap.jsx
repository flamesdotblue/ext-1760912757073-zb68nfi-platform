import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo, useState } from 'react';

// Fix default marker icon paths for Leaflet in Vite
const icon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function DriverMap({ userPosition }) {
  const center = useMemo(() => ([userPosition.lat, userPosition.lng]), [userPosition]);
  const [driver, setDriver] = useState({ lat: userPosition.lat + 0.01, lng: userPosition.lng + 0.01, speed: 30 });
  const [eta, setEta] = useState(10);

  useEffect(() => {
    const id = setInterval(() => {
      // Move driver towards user a bit
      setDriver(d => {
        const lat = d.lat + (userPosition.lat - d.lat) * 0.15;
        const lng = d.lng + (userPosition.lng - d.lng) * 0.15;
        return { ...d, lat, lng };
      });
      // Simple ETA decay
      setEta(e => Math.max(2, Math.round(e - 0.5)));
    }, 3000);
    return () => clearInterval(id);
  }, [userPosition.lat, userPosition.lng]);

  return (
    <section aria-labelledby="map-heading" className="rounded-2xl overflow-hidden border border-orange-200">
      <div className="flex items-center justify-between px-3 py-2 bg-orange-50 border-b border-orange-200">
        <h3 id="map-heading" className="text-sm font-semibold text-orange-900">Live delivery tracking</h3>
        <div className="text-xs text-orange-700" aria-live="polite">ETA ~ {eta} min</div>
      </div>
      <div className="h-64 w-full">
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }} aria-label="Delivery map">
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[userPosition.lat, userPosition.lng]} icon={icon}>
            <Popup>You are here</Popup>
          </Marker>
          <Marker position={[driver.lat, driver.lng]} icon={icon}>
            <Popup>Driver en route</Popup>
          </Marker>
          {userPosition.accuracy && (
            <Circle center={[userPosition.lat, userPosition.lng]} radius={userPosition.accuracy} pathOptions={{ color: '#f97316' }} />
          )}
        </MapContainer>
      </div>
    </section>
  );
}
