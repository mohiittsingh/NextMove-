import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDriverStore } from "../store/useDriverStore";
import { driverDefaults, driverRoutes } from "../utils/driverMock";

export default function DriverAuth() {
  const navigate = useNavigate();
  const startDuty = useDriverStore((state) => state.startDuty);
  const setLocationError = useDriverStore((state) => state.setLocationError);
  const [name, setName] = useState("");
  const [numberPlate, setNumberPlate] = useState("");
  const [driverId, setDriverId] = useState("");
  const [routeId, setRouteId] = useState("");
  const [formError, setFormError] = useState("");

  const canSubmit = useMemo(
    () => name.trim() && numberPlate.trim() && driverId.trim() && routeId.trim(),
    [name, numberPlate, driverId, routeId]
  );

  const handleSubmit = () => {
    if (!routeId.trim()) {
      setFormError("Select a route before starting duty.");
      return;
    }

    const selectedRoute = driverRoutes.find((route) => route.id === routeId);
    const fallbackLocation = selectedRoute?.path[0] || driverDefaults.mapCenter;

    const completeStart = (initialLocation, locationError = "") => {
      const result = startDuty({
        name: name.trim(),
        numberPlate: numberPlate.trim().toUpperCase(),
        driverId: driverId.trim().toUpperCase(),
        routeId,
        initialLocation,
      });

      if (!result.ok) {
        setFormError(result.error);
        return;
      }

      setLocationError(locationError);
      navigate("/driver/dashboard");
    };

    if (!navigator.geolocation) {
      completeStart(fallbackLocation, driverDefaults.fallbackLocationMessage);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        completeStart([position.coords.longitude, position.coords.latitude]);
      },
      () => {
        completeStart(fallbackLocation, driverDefaults.fallbackLocationMessage);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
  };

  return (
    <motion.main
      className="min-h-screen bg-[#0b0b0b] px-5 py-8 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1fr_440px]">
        <motion.div
          className="hidden lg:block"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
        >
          <p className="text-sm font-black uppercase tracking-[0.18em] text-yellow-400">NextMove Driver</p>
          <h1 className="mt-4 max-w-xl text-6xl font-black leading-[0.95] tracking-normal">
            Start duty with the route, vehicle, and stops all in one place.
          </h1>
          <p className="mt-5 max-w-lg text-base font-semibold leading-7 text-white/64">
            Built for bus drivers who need a clear flow from login to final stop without extra clutter.
          </p>
        </motion.div>

        <motion.section
          className="mx-auto w-full max-w-md rounded-[28px] border border-white/10 bg-[#151515] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.46)] sm:p-8"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-sm font-bold text-white/60 transition hover:text-white"
          >
            Back
          </button>

          <p className="mt-7 text-sm font-black uppercase tracking-[0.18em] text-yellow-400">Driver Login</p>
          <h2 className="mt-3 text-4xl font-black tracking-normal">Start Duty</h2>
          <p className="mt-3 text-sm font-semibold leading-6 text-white/60">
            Enter your identity, bus details, and assigned route to continue.
          </p>

          <div className="mt-7 space-y-4">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Driver Name / ID"
              className="w-full rounded-lg bg-gray-100 px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              value={numberPlate}
              onChange={(event) => setNumberPlate(event.target.value)}
              placeholder="Bus Number Plate"
              className="w-full rounded-lg bg-gray-100 px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              value={driverId}
              onChange={(event) => setDriverId(event.target.value)}
              placeholder="Unique Driver ID"
              className="w-full rounded-lg bg-gray-100 px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <select
              value={routeId}
              onChange={(event) => setRouteId(event.target.value)}
              className="w-full rounded-lg bg-gray-100 px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Select Route</option>
              {driverRoutes.map((route) => (
                <option key={route.id} value={route.id}>
                  {route.label}
                </option>
              ))}
            </select>
          </div>

          {formError && <p className="mt-4 rounded-lg bg-red-500/12 px-4 py-3 text-sm font-bold text-red-200">{formError}</p>}

          <motion.button
            type="button"
            whileHover={{ scale: canSubmit ? 1.02 : 1 }}
            whileTap={{ scale: 0.98 }}
            disabled={!canSubmit}
            onClick={handleSubmit}
            className="mt-6 h-14 w-full rounded-xl bg-yellow-400 text-base font-black text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/38"
          >
            Start Duty
          </motion.button>

          <p className="mt-4 text-sm font-semibold text-white/46">Mock auth only. Real backend auth is still pending.</p>
        </motion.section>
      </section>
    </motion.main>
  );
}
