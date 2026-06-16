import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDriverStore } from "../store/useDriverStore";
import { driverDefaults } from "../utils/driverMock";
import { getMapboxToken } from "../utils/mapboxToken";
import { buildRouteSegments } from "../utils/routeMotion";

const mapboxToken = getMapboxToken();
mapboxgl.accessToken = mapboxToken;

const hasMapboxToken = Boolean(mapboxToken);

const createDriverMarker = () => {
  const marker = document.createElement("div");
  marker.className = "nextmove-bus-marker nextmove-bus-marker-live";
  marker.innerHTML = '<img src="/assets/bus.png" alt="" />';
  return marker;
};

const createStopMarker = (isNextStop = false) => {
  const marker = document.createElement("div");
  marker.className = isNextStop ? "driver-stop-marker driver-stop-marker-active" : "driver-stop-marker";
  return marker;
};

const formatKm = (value) => `${value.toFixed(1)} km`;
const formatMins = (value) => `${Math.max(1, Math.round(value))} mins`;

export default function DriverDashboard() {
  const navigate = useNavigate();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const stopMarkersRef = useRef([]);
  const animationFrameRef = useRef(null);
  const previousBusLocationRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [completionModalOpen, setCompletionModalOpen] = useState(false);

  const {
    driverInfo,
    route,
    stops,
    currentStopIndex,
    busLocation,
    currentPathIndex,
    arrivalStopId,
    tripCompleted,
    locationError,
    advanceLocation,
    clearArrival,
    markStopComplete,
    endDuty,
  } = useDriverStore();

  useEffect(() => {
    if (!driverInfo || !route) {
      navigate("/driver/auth", { replace: true });
    }
  }, [driverInfo, navigate, route]);

  const nextStop = stops[currentStopIndex] || stops[stops.length - 1];

  const stopSummaries = useMemo(() => {
    if (!route || busLocation == null) return [];

    return stops.map((stop, index) => {
      const stopLocation = route.path[stop.coordinateIndex];
      const dx = stopLocation[0] - busLocation[0];
      const dy = stopLocation[1] - busLocation[1];
      const distanceKm = Math.hypot(dx, dy) * 111;
      const etaMinutes = distanceKm / 0.45;

      return {
        ...stop,
        distanceKm,
        etaMinutes,
        isNext: index === currentStopIndex && !stop.isCompleted,
      };
    });
  }, [busLocation, currentStopIndex, route, stops]);

  useEffect(() => {
    if (!route || !mapContainerRef.current || !driverInfo) return undefined;

    if (!hasMapboxToken) {
      setMapError("Map failed to load. Check API key.");
      setMapLoaded(true);
      return undefined;
    }

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: busLocation || route.path[0] || driverDefaults.mapCenter,
      zoom: 13.2,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

    mapRef.current.on("load", () => {
      setMapLoaded(true);

      mapRef.current.addSource("driver-route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: route.path,
          },
        },
      });

      mapRef.current.addLayer({
        id: "driver-route-line",
        type: "line",
        source: "driver-route",
        paint: {
          "line-color": route.lineColor,
          "line-width": 7,
          "line-opacity": 0.95,
        },
      });

      driverMarkerRef.current = new mapboxgl.Marker({
        element: createDriverMarker(),
        rotationAlignment: "map",
      })
        .setLngLat(busLocation || route.path[0])
        .addTo(mapRef.current);
      previousBusLocationRef.current = busLocation || route.path[0];

      stopMarkersRef.current = route.stops.map((stop, index) =>
        new mapboxgl.Marker(createStopMarker(index === currentStopIndex && !stops[index]?.isCompleted))
          .setLngLat(route.path[stop.coordinateIndex])
          .addTo(mapRef.current)
      );

      const bounds = route.path.reduce(
        (accumulator, coordinate) => accumulator.extend(coordinate),
        new mapboxgl.LngLatBounds(route.path[0], route.path[0])
      );

      mapRef.current.fitBounds(bounds, { padding: 80, duration: 900 });
    });

    mapRef.current.on("error", () => {
      setMapError("Map failed to load. Check API key.");
      setMapLoaded(true);
    });

    return () => {
      window.cancelAnimationFrame(animationFrameRef.current);
      stopMarkersRef.current.forEach((marker) => marker.remove());
      stopMarkersRef.current = [];
      driverMarkerRef.current?.remove();
      driverMarkerRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [driverInfo, route]);

  useEffect(() => {
    if (!mapRef.current || !route || !driverMarkerRef.current || busLocation == null) return;
    if (!previousBusLocationRef.current) {
      previousBusLocationRef.current = busLocation;
      driverMarkerRef.current.setLngLat(busLocation);
      return;
    }

    const from = previousBusLocationRef.current;
    const to = busLocation;
    const [transition] = buildRouteSegments([from, to]);
    const start = performance.now();
    const duration = Math.min(1800, Math.max(320, (transition?.distance || 0) * 55));

    const step = (timestamp) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      const lng = from[0] + (to[0] - from[0]) * progress;
      const lat = from[1] + (to[1] - from[1]) * progress;
      driverMarkerRef.current?.setLngLat([lng, lat]);
      if (transition) {
        driverMarkerRef.current?.setRotation(transition.bearing);
      }

      if (progress < 1) {
        animationFrameRef.current = window.requestAnimationFrame(step);
        return;
      }

      previousBusLocationRef.current = to;
    };

    window.cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = window.requestAnimationFrame(step);
    mapRef.current.easeTo({ center: to, duration, zoom: 13.4 });
  }, [busLocation, route]);

  useEffect(() => {
    if (!route || !stopMarkersRef.current.length) return;

    stopMarkersRef.current.forEach((marker, index) => {
      const element = marker.getElement();
      const isNext = index === currentStopIndex && !stops[index]?.isCompleted;
      element.className = isNext ? "driver-stop-marker driver-stop-marker-active" : "driver-stop-marker";
    });
  }, [currentStopIndex, route, stops]);

  useEffect(() => {
    if (!arrivalStopId) return;
    const arrivedStop = stops.find((stop) => stop.id === arrivalStopId);
    if (arrivedStop) {
      setStatusMessage(`Arrived at ${arrivedStop.name}`);
    }
  }, [arrivalStopId, stops]);

  useEffect(() => {
    if (tripCompleted) {
      setCompletionModalOpen(true);
    }
  }, [tripCompleted]);

  const handleUpdateLocation = () => {
    const result = advanceLocation();

    if (!result.moved) {
      setStatusMessage("Bus is already at the end of the route.");
      return;
    }

    if (result.arrivalStop) {
      setStatusMessage(`Arrived at ${result.arrivalStop.name}`);
    } else {
      setStatusMessage("Location updated on route.");
    }
  };

  const handleMarkStopComplete = () => {
    const result = markStopComplete();
    if (!result.ok) {
      setStatusMessage(result.error);
      return;
    }

    setStatusMessage(result.completed ? "Final stop completed." : "Stop marked complete.");
    clearArrival();
  };

  const handleEndDuty = () => {
    endDuty();
    navigate("/driver/auth", { replace: true });
  };

  if (!driverInfo || !route) {
    return null;
  }

  return (
    <motion.main
      className="relative min-h-screen overflow-hidden bg-[#060606] text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div ref={mapContainerRef} className="absolute inset-0" />

      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 grid place-items-center bg-[#060606] text-sm font-black text-white/64">
          Loading driver map...
        </div>
      )}

      {mapError && (
        <div className="absolute inset-0 grid place-items-center bg-[#060606] px-5">
          <div className="rounded-2xl bg-[#151515] px-5 py-4 text-center text-sm font-bold text-white shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
            {mapError}
          </div>
        </div>
      )}

      <header className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/60 px-4 py-3 backdrop-blur-sm">
          <img src="/assets/logo.png" alt="NextMove" className="h-10 w-10 rounded-xl object-contain" />
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-400">NextMove</p>
            <p className="text-sm font-semibold text-white/70">Driver Interface</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/60 px-4 py-3 backdrop-blur-sm">
          <div className="text-right">
            <p className="text-sm font-black">{driverInfo.name}</p>
            <p className="text-xs font-semibold text-white/58">
              {driverInfo.numberPlate} • {driverInfo.driverId}
            </p>
          </div>
          <button
            type="button"
            onClick={handleEndDuty}
            className="rounded-xl bg-yellow-400 px-4 py-3 text-sm font-black text-black transition hover:bg-yellow-300"
          >
            End Duty
          </button>
        </div>
      </header>

      <div className="absolute left-4 top-24 z-20 max-w-sm space-y-3 sm:left-6">
        <div className="rounded-2xl border border-white/10 bg-black/65 px-4 py-4 backdrop-blur-sm">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-400">{route.name}</p>
          <h1 className="mt-2 text-2xl font-black">
            {route.startLabel} to {route.endLabel}
          </h1>
          <p className="mt-2 text-sm font-semibold text-white/60">
            {nextStop ? `Next Stop: ${nextStop.name}` : "Route complete"}
          </p>
        </div>

        {locationError && (
          <div className="rounded-2xl border border-yellow-400/25 bg-yellow-400/10 px-4 py-3 text-sm font-semibold text-yellow-100">
            {locationError}
          </div>
        )}

        {statusMessage && (
          <motion.div
            key={statusMessage}
            className="rounded-2xl border border-white/10 bg-black/65 px-4 py-3 text-sm font-black text-white backdrop-blur-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {statusMessage}
          </motion.div>
        )}
      </div>

      <motion.section
        className="absolute inset-x-0 bottom-0 z-20 mx-auto max-w-6xl rounded-t-[28px] border border-white/10 bg-[#0f0f0f]/94 px-4 pb-5 pt-4 shadow-[0_-24px_60px_rgba(0,0,0,0.36)] backdrop-blur-sm sm:left-6 sm:right-6 sm:rounded-[28px]"
        initial={{ y: 120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 110, damping: 18 }}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-400">Stops</p>
                <h2 className="mt-1 text-2xl font-black">Route progress</h2>
              </div>
              <div className="rounded-xl bg-white/6 px-3 py-2 text-right">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-white/44">Progress</p>
                <p className="mt-1 text-sm font-black">
                  {Math.min(currentPathIndex + 1, route.path.length)} / {route.path.length}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {stopSummaries.map((stop) => (
                <motion.article
                  key={stop.id}
                  className={`rounded-2xl border px-4 py-4 ${
                    stop.isNext
                      ? "border-yellow-400 bg-yellow-400/10"
                      : stop.isCompleted
                        ? "border-emerald-400/30 bg-emerald-400/8"
                        : "border-white/8 bg-white/4"
                  }`}
                  animate={stop.isNext ? { scale: [1, 1.01, 1] } : { scale: 1 }}
                  transition={{ duration: 1.2, repeat: stop.isNext ? Infinity : 0 }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-black">{stop.name}</p>
                      <p className="mt-1 text-sm font-semibold text-white/58">
                        {stop.isNext ? "Next Stop" : stop.isCompleted ? "Completed" : "Upcoming"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black">{formatKm(stop.distanceKm)}</p>
                      <p className="mt-1 text-xs font-semibold text-white/52">{formatMins(stop.etaMinutes)}</p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          <div className="w-full lg:max-w-[280px]">
            <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-400">Controls</p>
              <div className="mt-4 space-y-3">
                <button
                  type="button"
                  onClick={handleUpdateLocation}
                  className="h-12 w-full rounded-xl bg-yellow-400 text-sm font-black text-black transition hover:bg-yellow-300"
                >
                  Update Location
                </button>
                <button
                  type="button"
                  onClick={handleMarkStopComplete}
                  disabled={!arrivalStopId}
                  className="h-12 w-full rounded-xl bg-white/10 text-sm font-black text-white transition hover:bg-white/14 disabled:cursor-not-allowed disabled:bg-white/5 disabled:text-white/30"
                >
                  Mark Stop Complete
                </button>
              </div>

              <div className="mt-4 rounded-xl bg-black/35 px-3 py-3 text-sm font-semibold text-white/60">
                {arrivalStopId ? "Bus is at a stop. Confirm completion when boarding is done." : "Move along the route to reach the next stop."}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <AnimatePresence>
        {completionModalOpen && (
          <motion.div
            className="absolute inset-0 z-30 grid place-items-center bg-black/72 px-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#141414] p-6 text-white shadow-[0_28px_90px_rgba(0,0,0,0.44)]"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
            >
              <p className="text-sm font-black uppercase tracking-[0.18em] text-yellow-400">Journey Completed</p>
              <h2 className="mt-3 text-3xl font-black">Thanks for your service today.</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-white/62">
                This trip has ended. You can finish duty now or log out and return to driver login.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleEndDuty}
                  className="h-12 rounded-xl bg-yellow-400 text-sm font-black text-black transition hover:bg-yellow-300"
                >
                  End Duty
                </button>
                <button
                  type="button"
                  onClick={handleEndDuty}
                  className="h-12 rounded-xl border border-white/10 bg-white/6 text-sm font-black text-white transition hover:bg-white/10"
                >
                  Logout
                </button>
              </div>

              <div className="mt-6 rounded-xl bg-white/4 px-4 py-3 text-sm font-semibold text-white/54">
                TODO: Replace mock routes with backend, add real-time tracking with Socket.IO, and wire proper authentication.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
