import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { gurgaonCenter, mockLocations, nearbyVehicles } from "../utils/mockData";
import { getMapboxToken } from "../utils/mapboxToken";
import { buildRouteSegments, densifyRoute, getPointAlongRoute } from "../utils/routeMotion";
import { useTransportStore } from "../store/useTransportStore";

const mapboxToken = getMapboxToken();
mapboxgl.accessToken = mapboxToken;

const defaultLocation = gurgaonCenter;
const fallbackSource = mockLocations[0];
const createUserMarker = () => {
  const marker = document.createElement("div");
  marker.className = "nextmove-user-marker";
  return marker;
};

const createBusMarker = (isLive = false) => {
  const marker = document.createElement("div");
  marker.className = isLive ? "nextmove-bus-marker nextmove-bus-marker-live" : "nextmove-bus-marker";
  marker.innerHTML = '<img src="/assets/bus.png" alt="" />';
  return marker;
};

export default function UserHome() {
  const mapContainerRef = useRef(null);
  const mapShellRef = useRef(null);
  const mapRef = useRef(null);
  const userMarkerRef = useRef(null);
  const nearbyMarkersRef = useRef([]);
  const liveBusMarkerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState("");
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [notification, setNotification] = useState("");

  const {
    userLocation,
    source,
    destination,
    selectedTransport,
    transportOptions,
    busList,
    activeRoute,
    error,
    setUserLocation,
    setSource,
    setDestination,
    setSelectedTransport,
    resetUserTrip,
    searchUserTransport,
    startUserBusTracking,
  } = useTransportStore();

  const resetRouteLayer = () => {
    if (!mapRef.current) return;

    if (mapRef.current.getLayer("user-route-line")) {
      mapRef.current.removeLayer("user-route-line");
    }

    if (mapRef.current.getSource("user-route")) {
      mapRef.current.removeSource("user-route");
    }
  };

  const resetTrackingMarker = () => {
    window.cancelAnimationFrame(animationFrameRef.current);
    liveBusMarkerRef.current?.remove();
    liveBusMarkerRef.current = null;
  };

  useEffect(() => {
    if (!mapContainerRef.current) return undefined;

    if (!mapboxToken) {
      setMapError("Map failed to load. Check API key.");
      setSource(fallbackSource);
      setUserLocation(defaultLocation);
      return undefined;
    }

    try {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: defaultLocation,
        zoom: 13,
      });

      mapRef.current.on("load", () => {
        setMapLoaded(true);

        userMarkerRef.current = new mapboxgl.Marker(createUserMarker()).setLngLat(defaultLocation).addTo(mapRef.current);

        nearbyMarkersRef.current = nearbyVehicles.map((vehicle) =>
          new mapboxgl.Marker(createBusMarker()).setLngLat(vehicle.coordinates).addTo(mapRef.current)
        );

        if (!navigator.geolocation) {
          setSource(fallbackSource);
          setUserLocation(defaultLocation);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coordinates = [position.coords.longitude, position.coords.latitude];
            setUserLocation(coordinates);
            setSource("Current location");
            userMarkerRef.current?.setLngLat(coordinates);
            mapRef.current?.flyTo({ center: coordinates, zoom: 14, speed: 0.8 });
          },
          () => {
            setUserLocation(defaultLocation);
            setSource(fallbackSource);
            userMarkerRef.current?.setLngLat(defaultLocation);
          },
          { enableHighAccuracy: true, maximumAge: 0, timeout: 12000 }
        );
      });

      mapRef.current.on("error", () => {
        setMapError("Map failed to load. Check API key.");
      });
    } catch {
      setMapError("Map failed to load. Check API key.");
    }

    return () => {
      resetTrackingMarker();
      nearbyMarkersRef.current.forEach((marker) => marker.remove());
      userMarkerRef.current?.remove();
      mapRef.current?.remove();
    };
  }, [setSource, setUserLocation]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setIsMapExpanded(false);
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    window.setTimeout(() => mapRef.current?.resize(), 180);
  }, [isMapExpanded]);

  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    resetTrackingMarker();
    resetRouteLayer();

    if (!activeRoute) {
      return;
    }

    const routeCoordinates = densifyRoute(activeRoute.coordinates, 24);
    mapRef.current.addSource("user-route", {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: routeCoordinates,
        },
      },
    });

    mapRef.current.addLayer({
      id: "user-route-line",
      type: "line",
      source: "user-route",
      paint: {
        "line-color": "#FFC107",
        "line-width": 7,
        "line-opacity": 0.92,
      },
    });

    const bounds = routeCoordinates.reduce(
      (currentBounds, coordinate) => currentBounds.extend(coordinate),
      new mapboxgl.LngLatBounds(routeCoordinates[0], routeCoordinates[0])
    );
    mapRef.current.fitBounds(bounds, { padding: 80, duration: 900 });

    liveBusMarkerRef.current = new mapboxgl.Marker({
      element: createBusMarker(true),
      rotationAlignment: "map",
    })
      .setLngLat(routeCoordinates[0])
      .addTo(mapRef.current);

    const routeSegments = buildRouteSegments(routeCoordinates);
    const totalDistance = routeSegments.reduce((sum, segment) => sum + segment.distance, 0);

    if (!routeSegments.length || totalDistance === 0) {
      liveBusMarkerRef.current?.setLngLat(routeCoordinates[0]);
      return;
    }

    const baseSpeedMetersPerSecond = 10.5;
    let lastTimestamp = performance.now();
    let travelledDistance = 0;
    let lastCameraUpdate = 0;

    const animateBus = (timestamp) => {
      const deltaSeconds = Math.min((timestamp - lastTimestamp) / 1000, 0.05);
      lastTimestamp = timestamp;
      travelledDistance = Math.min(
        travelledDistance + baseSpeedMetersPerSecond * deltaSeconds,
        totalDistance
      );

      const { coordinate, bearing, completed } = getPointAlongRoute(
        routeSegments,
        travelledDistance
      );

      if (!coordinate) {
        return;
      }

      liveBusMarkerRef.current?.setLngLat(coordinate);
      liveBusMarkerRef.current?.setRotation(bearing);

      if (timestamp - lastCameraUpdate > 1400) {
        mapRef.current?.easeTo({ center: coordinate, duration: 1100, zoom: 13.8 });
        lastCameraUpdate = timestamp;
      }

      if (completed) {
        return;
      }

      animationFrameRef.current = window.requestAnimationFrame(animateBus);
    };

    animationFrameRef.current = window.requestAnimationFrame(animateBus);
  }, [activeRoute, mapLoaded]);

  const handleSearch = () => {
    setNotification("");
    searchUserTransport();
  };

  const handleLogoClick = () => {
    resetTrackingMarker();
    resetRouteLayer();
    resetUserTrip();
    setNotification("");
    mapRef.current?.flyTo({ center: userLocation || defaultLocation, zoom: 13, speed: 0.8 });
  };

  const toggleFullscreen = async () => {
    if (!mapShellRef.current) return;

    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await mapShellRef.current.requestFullscreen();
    }

    window.setTimeout(() => mapRef.current?.resize(), 220);
  };

  return (
    <motion.main
      className="min-h-screen overflow-hidden bg-[#f7f7f5] text-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex h-screen flex-col lg:flex-row">
        <aside className={`${isMapExpanded ? "hidden" : "flex"} w-full flex-col bg-white lg:h-screen lg:w-[420px]`}>
          <div className="border-b border-black/6 px-5 py-4">
            <button type="button" onClick={handleLogoClick} className="flex items-center gap-3">
              <img src="/assets/logo.png" alt="NextMove" className="h-10 w-10 rounded-xl object-contain" />
              <span className="text-xl font-black tracking-normal">NextMove</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-6">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <h1 className="text-3xl font-black leading-tight tracking-normal">Go anywhere with NextMove!</h1>
              <p className="mt-2 text-sm font-semibold leading-6 text-black/56">
                Compare autos, buses, and trains without clutter.
              </p>
            </motion.div>

            <div className="mt-7 space-y-3">
              <label className="flex h-14 items-center gap-3 rounded-2xl bg-[#f2f2ef] px-4">
                <span className="h-3 w-3 rounded-full bg-[#00a86b]" />
                <input
                  value={source}
                  onChange={(event) => setSource(event.target.value)}
                  placeholder="Source"
                  className="h-full flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-black/38"
                />
              </label>

              <label className="flex h-14 items-center gap-3 rounded-2xl bg-[#f2f2ef] px-4">
                <span className="h-3 w-3 rounded-full bg-black" />
                <input
                  value={destination}
                  onChange={(event) => setDestination(event.target.value)}
                  placeholder="Destination"
                  className="h-full flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-black/38"
                />
              </label>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSearch}
                className="h-14 w-full rounded-2xl bg-[#FFC107] text-base font-black text-black shadow-[0_16px_36px_rgba(255,193,7,0.24)] transition hover:bg-[#f4b400]"
              >
                Search
              </motion.button>
              {error && <p className="text-sm font-bold text-red-600">{error}</p>}
            </div>

            <AnimatePresence>
              {transportOptions.length > 0 && (
                <motion.section
                  className="mt-7"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 18 }}
                >
                  <div className="grid grid-cols-3 gap-2">
                    {["auto", "bus", "train"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSelectedTransport(type)}
                        className={`h-11 rounded-xl text-sm font-black capitalize transition ${
                          selectedTransport === type ? "bg-black text-white" : "bg-black/5 text-black/62 hover:bg-black/8"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  {selectedTransport === "auto" && (
                    <motion.div
                      className="mt-4 rounded-3xl border border-black/5 bg-white p-5 shadow-[0_14px_34px_rgba(0,0,0,0.06)]"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-black">Auto</h2>
                          <p className="mt-1 text-sm font-semibold text-black/56">Quick pickup nearby</p>
                        </div>
                        <img src="/assets/auto.png" alt="" className="h-12 w-12 object-contain" />
                      </div>
                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl bg-[#f7f7f5] p-4">
                          <p className="text-xs font-black uppercase tracking-[0.12em] text-black/42">Fare</p>
                          <p className="mt-1 text-2xl font-black">{"\u20b9"}30</p>
                        </div>
                        <div className="rounded-2xl bg-[#f7f7f5] p-4">
                          <p className="text-xs font-black uppercase tracking-[0.12em] text-black/42">Time</p>
                          <p className="mt-1 text-2xl font-black">5 min</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {selectedTransport === "bus" && (
                    <div className="mt-4 space-y-3">
                      {busList.map((route) => (
                        <motion.article
                          key={route.id}
                          className="relative rounded-3xl border border-black/5 bg-white p-5 shadow-[0_14px_34px_rgba(0,0,0,0.06)]"
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ y: -4 }}
                        >
                          {route.isLive && (
                            <span className="absolute right-5 top-5 rounded-full bg-[#00a86b] px-3 py-1 text-xs font-black text-white">
                              Live
                            </span>
                          )}
                          <h2 className="pr-16 text-xl font-black">{route.name}</h2>
                          <p className="mt-2 text-sm font-semibold text-black/56">{route.route}</p>
                          <div className="mt-4 flex gap-3">
                            <span className="rounded-full bg-[#FFC107]/20 px-3 py-2 text-xs font-black text-[#9a6b00]">
                              ETA {route.eta}
                            </span>
                            <span className="rounded-full bg-black/5 px-3 py-2 text-xs font-black text-black/62">
                              Crowd {route.crowd}
                            </span>
                          </div>
                          <motion.button
                            type="button"
                            whileTap={{ scale: 0.97 }}
                            onClick={() => {
                              startUserBusTracking(route.id);
                              setNotification("Bus has started from origin");
                            }}
                            className="mt-5 h-11 w-full rounded-xl bg-black text-sm font-black text-white transition hover:bg-[#242424]"
                          >
                            Track Live
                          </motion.button>
                        </motion.article>
                      ))}
                    </div>
                  )}

                  {selectedTransport === "train" && (
                    <motion.div
                      className="mt-4 rounded-3xl border border-black/5 bg-white p-5 shadow-[0_14px_34px_rgba(0,0,0,0.06)]"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-black">Train</h2>
                          <p className="mt-1 text-sm font-semibold text-black/56">Coming soon</p>
                        </div>
                        <img src="/assets/train.png" alt="" className="h-12 w-12 object-contain" />
                      </div>
                    </motion.div>
                  )}
                </motion.section>
              )}
            </AnimatePresence>
          </div>
        </aside>

        <section
          ref={mapShellRef}
          className={`relative flex-1 bg-[#ece8df] ${
            isMapExpanded ? "fixed inset-0 z-50 h-screen w-screen" : "min-h-[46vh] lg:h-screen"
          }`}
        >
          <div ref={mapContainerRef} className="h-full w-full" />

          {!mapLoaded && !mapError && (
            <div className="absolute inset-0 grid place-items-center bg-[#ece8df] text-sm font-black text-black/58">
              Loading map...
            </div>
          )}

          {mapError && (
            <div className="absolute inset-0 grid place-items-center bg-[#ece8df]/94 px-5">
              <div className="rounded-2xl bg-white px-5 py-4 text-center text-sm font-bold text-black shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
                {mapError}
              </div>
            </div>
          )}

          <div className="absolute right-4 top-4 z-10 flex gap-2">
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMapExpanded((value) => !value)}
              className="h-11 rounded-xl bg-white px-4 text-sm font-black text-black shadow-[0_12px_30px_rgba(0,0,0,0.12)]"
            >
              {isMapExpanded ? "Minimize" : "Expand"}
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={toggleFullscreen}
              className="h-11 rounded-xl bg-[#FFC107] px-4 text-sm font-black text-black shadow-[0_12px_30px_rgba(255,193,7,0.22)]"
            >
              Fullscreen
            </motion.button>
          </div>

          <AnimatePresence>
            {notification && (
              <motion.div
                className="absolute left-4 right-4 top-20 z-10 rounded-2xl bg-black px-4 py-3 text-sm font-black text-white shadow-[0_18px_45px_rgba(0,0,0,0.22)] sm:left-auto sm:right-4 sm:w-80"
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
              >
                {notification}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </motion.main>
  );
}
