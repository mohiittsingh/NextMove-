export const getMapboxToken = () => {
  const rawToken = import.meta.env.VITE_MAPBOX_TOKEN || "";
  const token = rawToken.trim().replace(/^["']|["']$/g, "");

  if (!token || token === "YOUR_MAPBOX_API_KEY_HERE" || token.includes("YOUR_MAPBOX_API_KEY_HERE")) {
    return "";
  }

  return token;
};
