import { create } from "zustand";
import { driverRoutes } from "../utils/driverMock";

const getRouteById = (routeId) => driverRoutes.find((route) => route.id === routeId) || null;

export const useDriverStore = create((set, get) => ({
  driverInfo: null,
  route: null,
  stops: [],
  currentStopIndex: 0,
  busLocation: null,
  currentPathIndex: 0,
  dutyStatus: "idle",
  arrivalStopId: "",
  tripCompleted: false,
  locationError: "",
  startDuty: ({ name, numberPlate, driverId, routeId, initialLocation }) => {
    const route = getRouteById(routeId);

    if (!route) {
      return { ok: false, error: "Select a route before starting duty." };
    }

    set({
      driverInfo: { name, numberPlate, driverId, routeId },
      route,
      stops: route.stops.map((stop, index) => ({
        ...stop,
        isCompleted: index === 0,
      })),
      currentStopIndex: route.stops.length > 1 ? 1 : 0,
      busLocation: initialLocation || route.path[0],
      currentPathIndex: 0,
      dutyStatus: "active",
      arrivalStopId: "",
      tripCompleted: false,
      locationError: "",
    });

    return { ok: true };
  },
  setLocationError: (locationError) => set({ locationError }),
  clearArrival: () => set({ arrivalStopId: "" }),
  advanceLocation: () => {
    const { route, currentPathIndex, dutyStatus } = get();

    if (!route || dutyStatus !== "active") {
      return { moved: false };
    }

    const nextPathIndex = Math.min(currentPathIndex + 1, route.path.length - 1);
    const nextLocation = route.path[nextPathIndex];
    const arrivalStop = route.stops.find((stop) => stop.coordinateIndex === nextPathIndex);

    set({
      currentPathIndex: nextPathIndex,
      busLocation: nextLocation,
      arrivalStopId: arrivalStop?.id || "",
    });

    return {
      moved: nextPathIndex !== currentPathIndex,
      location: nextLocation,
      pathIndex: nextPathIndex,
      arrivalStop,
      tripEnded: nextPathIndex === route.path.length - 1,
    };
  },
  markStopComplete: () => {
    const { stops, currentStopIndex, arrivalStopId } = get();
    const stopToComplete = stops[currentStopIndex];

    if (!stopToComplete || stopToComplete.id !== arrivalStopId) {
      return { ok: false, error: "Reach the highlighted stop before marking it complete." };
    }

    const updatedStops = stops.map((stop, index) =>
      index === currentStopIndex
        ? {
            ...stop,
            isCompleted: true,
          }
        : stop
    );

    const nextStopIndex = Math.min(currentStopIndex + 1, updatedStops.length - 1);
    const allCompleted = updatedStops.every((stop) => stop.isCompleted);

    set({
      stops: updatedStops,
      currentStopIndex: allCompleted ? currentStopIndex : nextStopIndex,
      arrivalStopId: "",
      tripCompleted: allCompleted,
      dutyStatus: allCompleted ? "completed" : "active",
    });

    return { ok: true, completed: allCompleted };
  },
  endDuty: () =>
    set({
      driverInfo: null,
      route: null,
      stops: [],
      currentStopIndex: 0,
      busLocation: null,
      currentPathIndex: 0,
      dutyStatus: "idle",
      arrivalStopId: "",
      tripCompleted: false,
      locationError: "",
    }),
}));
