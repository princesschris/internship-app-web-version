const EARTH_RADIUS_KM = 6371;

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

export function haversineDistanceKm(from, to) {
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(from.lat)) *
      Math.cos(toRadians(to.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

export function formatDistance(km) {
  if (km < 1) return 'Under 1 km away';
  return `${Math.round(km)} km away`;
}

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function jitterCoordinates(baseCoords, seed) {
  const hash = hashString(seed);
  const angle = (hash % 360) * (Math.PI / 180);
  const radiusKm = 3 + (hash % 12);
  const latOffset = (radiusKm / 111) * Math.cos(angle);
  const lngOffset = (radiusKm / 111) * Math.sin(angle);
  return {
    lat: baseCoords.lat + latOffset,
    lng: baseCoords.lng + lngOffset
  };
}