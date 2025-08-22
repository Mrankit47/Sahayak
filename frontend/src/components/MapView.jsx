import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Box } from '@chakra-ui/react';

const defaultIcon = new L.Icon({
	iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
	shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
});

export default function MapView({ tasks = [], center = [28.6139, 77.2090], zoom = 12 }) {
	return (
		<Box borderWidth="1px" borderRadius="md" overflow="hidden" height="400px">
			<MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution="&copy; OpenStreetMap contributors"
				/>
				{tasks.map((t) => {
					const coords = t.location?.coordinates;
					if (!coords) return null;
					const [lng, lat] = coords;
					return (
						<Marker key={t._id} position={[lat, lng]} icon={defaultIcon}>
							<Popup>
								<strong>{t.title}</strong>
								<div>{t.category || 'General'}</div>
							</Popup>
						</Marker>
					);
				})}
			</MapContainer>
		</Box>
	);
} 