import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { IoLocationOutline, IoNavigateOutline, IoSearchOutline } from 'react-icons/io5';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { STATE_COORDINATES } from '../data/nigeriaStateCoordinates';
import { haversineDistanceKm, formatDistance, jitterCoordinates } from '../lib/geo';
import { searchPlace } from '../lib/geocode';
import styles from './OrganizationsMap.module.css';

const NIGERIA_CENTER = { lat: 9.082, lng: 8.6753 };
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png';
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

function buildPinIcon(color) {
  return L.divIcon({
    className: styles.pinIconWrapper,
    html: `<span style="background:${color}" class="${styles.pin}"></span>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });
}

const orgIcon = buildPinIcon('#4b2dff');
const youIcon = buildPinIcon('#c8ff4d');
const placeIcon = buildPinIcon('#d64545');

export default function OrganizationsMap() {
  const { profile } = useAuth();
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [locationSource, setLocationSource] = useState(null);
  const [search, setSearch] = useState('');
  const [placeQuery, setPlaceQuery] = useState('');
  const [placeResult, setPlaceResult] = useState(null);
  const [placeSearching, setPlaceSearching] = useState(false);
  const [placeError, setPlaceError] = useState('');
  const mapRef = useRef(null);

  useEffect(() => {
    loadOrganizations();
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      fallbackToProfileLocation();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocationSource('gps');
      },
      () => fallbackToProfileLocation(),
      { timeout: 8000 }
    );
  }, [profile]);

  const fallbackToProfileLocation = () => {
    if (profile?.state && STATE_COORDINATES[profile.state]) {
      setUserLocation(STATE_COORDINATES[profile.state]);
      setLocationSource('profile');
    }
  };

  const loadOrganizations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, organization_name, state, local_government, address, latitude, longitude')
      .eq('role', 'organization');
    if (!error) setOrganizations(data);
    setLoading(false);
  };

  const orgsWithPosition = useMemo(() => {
    return organizations
      .filter((org) => (org.latitude != null && org.longitude != null) || (org.state && STATE_COORDINATES[org.state]))
      .map((org) => {
        const isPrecise = org.latitude != null && org.longitude != null;
        const position = isPrecise
          ? { lat: org.latitude, lng: org.longitude }
          : jitterCoordinates(STATE_COORDINATES[org.state], org.id);
        const distanceKm = userLocation ? haversineDistanceKm(userLocation, position) : null;
        return { ...org, position, distanceKm, isPrecise };
      })
      .sort((a, b) => {
        if (a.distanceKm == null) return 1;
        if (b.distanceKm == null) return -1;
        return a.distanceKm - b.distanceKm;
      });
  }, [organizations, userLocation]);

  const filteredOrgs = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return orgsWithPosition;
    return orgsWithPosition.filter(
      (org) =>
        org.organization_name.toLowerCase().includes(query) ||
        org.state.toLowerCase().includes(query) ||
        (org.local_government || '').toLowerCase().includes(query) ||
        (org.address || '').toLowerCase().includes(query)
    );
  }, [orgsWithPosition, search]);

  const focusOrganization = (org) => {
    if (mapRef.current) {
      const zoom = org.isPrecise ? 17 : 13;
      mapRef.current.flyTo([org.position.lat, org.position.lng], zoom, { duration: 0.6 });
    }
  };

  const handlePlaceSearch = async (e) => {
    e.preventDefault();
    if (!placeQuery.trim()) return;
    setPlaceError('');
    setPlaceSearching(true);
    try {
      const results = await searchPlace(placeQuery);
      if (results.length === 0) {
        setPlaceError('No matches found.');
        setPlaceResult(null);
      } else {
        const top = results[0];
        setPlaceResult(top);
        if (mapRef.current) {
          mapRef.current.flyTo([top.lat, top.lng], 16, { duration: 0.8 });
        }
      }
    } catch (err) {
      setPlaceError(err.message);
    } finally {
      setPlaceSearching(false);
    }
  };

  return (
    <div className="page">
      <h1 className={styles.heading}>Organizations near you</h1>
      <p className={styles.sub}>
        Organizations that have pinned their exact location show precisely — others are placed by their registered state as an approximation.
      </p>

      <form className={styles.placeSearch} onSubmit={handlePlaceSearch}>
        <IoSearchOutline size={18} color="var(--color-muted)" />
        <input
          placeholder="Search any place in Nigeria, e.g. NNPC Towers, Abuja"
          value={placeQuery}
          onChange={(e) => setPlaceQuery(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" disabled={placeSearching}>
          {placeSearching ? 'Searching...' : 'Search'}
        </button>
      </form>
      {placeError && <p className={`error-text ${styles.placeError}`}>{placeError}</p>}

      <div className={styles.layout}>
        <div className={styles.mapWrap}>
          <MapContainer
            center={userLocation || NIGERIA_CENTER}
            zoom={userLocation ? 8 : 6}
            className={styles.map}
            ref={mapRef}
          >
            <TileLayer attribution={TILE_ATTRIBUTION} url={TILE_URL} subdomains="abcd" />

            {placeResult && (
              <Marker position={[placeResult.lat, placeResult.lng]} icon={placeIcon}>
                <Popup>{placeResult.label}</Popup>
              </Marker>
            )}

            {userLocation && (
              <Marker position={[userLocation.lat, userLocation.lng]} icon={youIcon}>
                <Popup>
                  You {locationSource === 'gps' ? '(current location)' : "(approx. from your state)"}
                </Popup>
              </Marker>
            )}

            {filteredOrgs.map((org) => (
              <Marker key={org.id} position={[org.position.lat, org.position.lng]} icon={orgIcon}>
                <Popup>
                  <strong>{org.organization_name}</strong>
                  <br />
                  {org.address && (
                    <>
                      {org.address}
                      <br />
                    </>
                  )}
                  {org.local_government}, {org.state}
                  <br />
                  {org.isPrecise ? 'Exact location' : 'Approximate — state level'}
                  {org.distanceKm != null && (
                    <>
                      <br />
                      {formatDistance(org.distanceKm)}
                    </>
                  )}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.searchBox}>
            <IoSearchOutline size={16} color="var(--color-muted)" />
            <input
              placeholder="Search organization, state or LGA"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {!userLocation && (
            <div className={styles.locationNotice}>
              <IoNavigateOutline size={18} />
              Enable location access, or add your state in your profile, to see distances.
            </div>
          )}

          {loading ? (
            <p className={styles.empty}>Loading organizations...</p>
          ) : filteredOrgs.length === 0 ? (
            <p className={styles.empty}>
              {search ? 'No organizations match your search.' : 'No organizations registered yet.'}
            </p>
          ) : (
            <div className={styles.orgList}>
              {filteredOrgs.map((org) => (
                <button key={org.id} className={`card ${styles.orgRow}`} onClick={() => focusOrganization(org)}>
                  <div>
                    <p className={styles.orgName}>{org.organization_name}</p>
                    <p className={styles.orgLocation}>
                      <IoLocationOutline size={15} />
                      {org.local_government}, {org.state}
                      {!org.isPrecise && <span className={styles.approxTag}>approx.</span>}
                    </p>
                  </div>
                  {org.distanceKm != null && (
                    <span className={styles.distance}>{formatDistance(org.distanceKm)}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}