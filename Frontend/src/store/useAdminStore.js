import { create } from "zustand";
import { getAISummary } from "../services/aiService";
import { adminRoutes, enrichRoute } from "../utils/adminMock";

const enrichedRoutes = adminRoutes.map(enrichRoute);

export const useAdminStore = create((set, get) => ({
  adminInfo: null,
  routes: enrichedRoutes,
  selectedRoute: null,
  aiSummary: "",
  isLoadingInsight: false,
  login: ({ adminId }) => set({ adminInfo: { adminId } }),
  logout: () =>
    set({
      adminInfo: null,
      selectedRoute: null,
      aiSummary: "",
      isLoadingInsight: false,
    }),
  selectRoute: (routeId) => {
    const selectedRoute = get().routes.find((route) => route.id === routeId) || null;
    set({ selectedRoute, aiSummary: "" });
  },
  generateInsight: async () => {
    const route = get().selectedRoute;

    if (!route) {
      return;
    }

    set({ isLoadingInsight: true, aiSummary: "" });

    try {
      const aiSummary = await getAISummary(route);
      set({ aiSummary, isLoadingInsight: false });
    } catch {
      set({
        aiSummary: "Could not generate AI insight right now.",
        isLoadingInsight: false,
      });
    }
  },
}));
