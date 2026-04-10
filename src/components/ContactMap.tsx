import { useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { MapPin } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const customIcon = new L.Icon({
  iconUrl: '/logo.webp',
  iconSize: [60, 60],
  iconAnchor: [30, 60],
  popupAnchor: [0, -60],
  className: 'rounded-full border-2 border-white shadow-lg bg-white object-contain p-1'
});

const position: [number, number] = [-30.892359, -55.474898];

function MapResizer({ position }: { position: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    const handleResize = () => {
      map.invalidateSize();
      map.setView(position);
    };

    window.addEventListener('resize', handleResize);
    setTimeout(() => handleResize(), 100);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [map, position]);

  return null;
}

export interface ContactMapRef {
  centerMap: () => void;
}

const ContactMap = forwardRef<ContactMapRef>((_, ref) => {
  const mapRef = useRef<L.Map>(null);
  const markerRef = useRef<L.Marker>(null);

  useImperativeHandle(ref, () => ({
    centerMap: () => {
      if (mapRef.current && markerRef.current) {
        mapRef.current.setView(position, 15);
        markerRef.current.openPopup();
      }
    }
  }));

  return (
    <MapContainer center={position} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }} ref={mapRef}>
      <MapResizer position={position} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={customIcon} ref={markerRef}>
        <Popup>
          <div className="text-center font-sans flex flex-col items-center">
            <strong className="font-serif text-primary text-lg block mb-1">Rancho Branco</strong>
            <span className="text-sm text-on-surface-variant mb-3 block">R. Jose Fernandes Mendes, 2330<br/>Armour, Sant'Ana do Livramento - RS</span>
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${position[0]},${position[1]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors inline-flex items-center gap-2 mt-1 shadow-md"
            >
              <MapPin className="w-4 h-4" />
              Como chegar no Google Maps
            </a>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
});

ContactMap.displayName = 'ContactMap';

export default ContactMap;
