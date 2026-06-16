import { create } from "zustand";
import { busRoutes, gurgaonCenter, mockLocations, mockTransportOptions } from "../utils/mockData";

const initialSource = mockLocations[0];
const defaultLocation = gurgaonCenter;

export const useTransportStore = create((set, get) => ({
  userLocation: defaultLocation,
  source: initialSource,
  destination: "",
  selectedTransport: "",
  transportOptions: [],
  busList: [],
  activeRoute: null,
  error: "",
  setUserLocation: (userLocation) => set({ userLocation }),
  setSource: (source) => set({ source }),
  setDestination: (destination) => set({ destination }),
  setSelectedTransport: (selectedTransport) => set({ selectedTransport }),
  resetUserTrip: () =>
    set({
      source: mockLocations[0],
      destination: "",
      selectedTransport: "",
      transportOptions: [],
      busList: [],
      activeRoute: null,
      error: "",
    }),
  searchUserTransport: () => {
    const { source, destination } = get();

    if (!source.trim() || !destination.trim()) {
      set({ error: "Enter source and destination to search." });
      return;
    }

    set({
      selectedTransport: "auto",
      transportOptions: [mockTransportOptions.auto, mockTransportOptions.bus, mockTransportOptions.train],
      busList: busRoutes.map((route) => ({
        ...route,
        eta: `${calculateRouteEta(route.etaBase)} mins`,
        crowd: route.crowd,
      })),
      activeRoute: null,
      error: "",
    });
  },
  startUserBusTracking: (routeId) => {
    const selectedRoute = busRoutes.find((route) => route.id === routeId) || busRoutes[0];
    set({ activeRoute: selectedRoute, selectedTransport: "bus", error: "" });
  },
}));

const calculateRouteEta = (baseMinutes) => baseMinutes + 4;
