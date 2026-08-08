export async function searchPlace(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&countrycodes=ng&q=${encodeURIComponent(query)}`;
  const response = await fetch(url, {
    headers: { 'Accept-Language': 'en' }
  });
  if (!response.ok) throw new Error('Search failed, try again.');
  const results = await response.json();
  return results.map((result) => ({
    label: result.display_name,
    lat: parseFloat(result.lat),
    lng: parseFloat(result.lon)
  }));
}