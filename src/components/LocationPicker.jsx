import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { IoSearchOutline } from 'react-icons/io5';
import { searchPlace } from '../lib/geocode';
import styles from './LocationPicker.module.css';

const NIGERIA_CENTER = { lat: 9.082, lng: 8.6753 };
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png';
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

const pinIcon = L.divIcon({
  className: styles.pinIconWrapper,
  html: `<span class="${styles.pin}"></span>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    }
  });
  return null;
}

function RecenterOnChange({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], Math.max(map.getZoom(), 12), { duration: 0.6 });
    }
  }, [position?.lat, position?.lng]);
  return null;
}

export default function LocationPicker({ latitude, longitude, defaultCenter, onChange }) {
  const position = latitude != null && longitude != null ? { lat: latitude, lng: longitude } : null;
  const center = position || defaultCenter || NIGERIA_CENTER;

  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      onChange({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchError('');
    setSearching(true);
    try {
      const results = await searchPlace(query);
      if (results.length === 0) {
        setSearchError('No matches found.');
      } else {
        onChange({ lat: results[0].lat, lng: results[0].lng });
      }
    } catch (err) {
      setSearchError(err.message);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className={styles.wrap}>
      <form className={styles.search} onSubmit={handleSearch}>
        <IoSearchOutline size={16} color="var(--color-muted)" />
        <input
          placeholder="Search for your address or building"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn btn-ghost" disabled={searching}>
          {searching ? 'Searching...' : 'Search'}
        </button>
      </form>
      {searchError && <p className="error-text">{searchError}</p>}

      <div className={styles.mapWrap}>
        <MapContainer center={[center.lat, center.lng]} zoom={position ? 13 : 6} className={styles.map}>
          <TileLayer attribution={TILE_ATTRIBUTION} url={TILE_URL} subdomains="abcd" />
          <ClickHandler onPick={onChange} />
          <RecenterOnChange position={position} />
          {position && <Marker position={[position.lat, position.lng]} icon={pinIcon} />}
        </MapContainer>
      </div>

      <div className={styles.actions}>
        <button type="button" className="btn btn-ghost" onClick={useCurrentLocation}>
          Use my current location
        </button>
        <span className={styles.hint}>
          {position ? 'Pinned — click the map to move it' : 'Click the map to drop a pin'}
        </span>
      </div>
    </div>
  );
}