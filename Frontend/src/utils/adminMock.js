export const adminRoutes = [
  {
    id: "route-1",
    name: "Route 1",
    label: "Cyber City -> Huda City Centre",
    completedTrips: 14,
    onTimeRate: 92,
    routeData: {
      stops: [
        { name: "Cyber City", crowd: 80, drop: 20 },
        { name: "MG Road", crowd: 120, drop: 60 },
        { name: "IFFCO Chowk", crowd: 150, drop: 90 },
        { name: "Huda City Centre", crowd: 60, drop: 140 },
      ],
      delays: [
        { time: "8 AM", delay: 5 },
        { time: "9 AM", delay: 12 },
        { time: "10 AM", delay: 8 },
      ],
    },
  },
  {
    id: "route-2",
    name: "Route 2",
    label: "MG Road -> IFFCO Chowk",
    completedTrips: 11,
    onTimeRate: 76,
    routeData: {
      stops: [
        { name: "MG Road", crowd: 110, drop: 35 },
        { name: "Sikanderpur", crowd: 90, drop: 45 },
        { name: "DLF Phase 2", crowd: 135, drop: 70 },
        { name: "IFFCO Chowk", crowd: 95, drop: 130 },
      ],
      delays: [
        { time: "8 AM", delay: 4 },
        { time: "9 AM", delay: 7 },
        { time: "10 AM", delay: 9 },
      ],
    },
  },
  {
    id: "route-3",
    name: "Route 3",
    label: "Sector 29 -> Delhi Border",
    completedTrips: 7,
    onTimeRate: 54,
    routeData: {
      stops: [
        { name: "Sector 29", crowd: 70, drop: 18 },
        { name: "IFFCO Chowk", crowd: 145, drop: 50 },
        { name: "Guru Dronacharya", crowd: 160, drop: 75 },
        { name: "Delhi Border", crowd: 85, drop: 155 },
      ],
      delays: [
        { time: "8 AM", delay: 9 },
        { time: "9 AM", delay: 12 },
        { time: "10 AM", delay: 14 },
      ],
    },
  },
];

export const getAverageDelay = (delays = []) => {
  if (!delays.length) return 0;
  return delays.reduce((sum, item) => sum + item.delay, 0) / delays.length;
};

export const getRouteHealth = (delay) => {
  if (delay < 5) {
    return { tone: "good", label: "Good", color: "#22c55e" };
  }

  if (delay < 10) {
    return { tone: "warning", label: "Moderate", color: "#f59e0b" };
  }

  return { tone: "critical", label: "Critical", color: "#ef4444" };
};

export const enrichRoute = (route) => {
  const delays = route.routeData?.delays || [];
  const stops = route.routeData?.stops || [];
  const averageDelay = getAverageDelay(delays);
  const peakCrowdStop = stops.reduce((best, stop) => (stop.crowd > best.crowd ? stop : best), stops[0] || null);
  const highestDropStop = stops.reduce((best, stop) => (stop.drop > best.drop ? stop : best), stops[0] || null);
  const peakDelayPoint = delays.reduce((best, point) => (point.delay > best.delay ? point : best), delays[0] || null);
  const totalBoarding = stops.reduce((sum, stop) => sum + stop.crowd, 0);
  const totalDrop = stops.reduce((sum, stop) => sum + stop.drop, 0);

  return {
    ...route,
    delay: Number(averageDelay.toFixed(1)),
    statusText: getRouteHealth(averageDelay).label,
    delayTrend: delays,
    crowdData: [
      { level: "Low", passengers: stops.filter((stop) => stop.crowd < 90).reduce((sum, stop) => sum + stop.crowd, 0) },
      {
        level: "Medium",
        passengers: stops.filter((stop) => stop.crowd >= 90 && stop.crowd < 140).reduce((sum, stop) => sum + stop.crowd, 0),
      },
      { level: "High", passengers: stops.filter((stop) => stop.crowd >= 140).reduce((sum, stop) => sum + stop.crowd, 0) },
    ],
    insights: {
      peakCrowdStop,
      highestDropStop,
      peakDelayPoint,
      totalBoarding,
      totalDrop,
      averageDelay: Number(averageDelay.toFixed(1)),
    },
  };
};
