export const formatCoordinates = ([longitude, latitude]) =>
  `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;

export const getPlaceNameFromCoordinates = async (coordinates, mapboxToken) => {
  // TODO: Replace with backend API later if location lookups should be proxied.
  if (!mapboxToken || mapboxToken === "YOUR_MAPBOX_API_KEY_HERE") {
    return `GPS: ${formatCoordinates(coordinates)}`;
  }

  const [longitude, latitude] = coordinates;
  const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxToken}&limit=1`;

  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error("Reverse geocoding failed.");
    }

    const data = await response.json();
    return data.features?.[0]?.place_name || `GPS: ${formatCoordinates(coordinates)}`;
  } catch {
    return `GPS: ${formatCoordinates(coordinates)}`;
  }
};
