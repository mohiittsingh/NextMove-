const rushHourStart = 8;
const rushHourEnd = 10;

export const gurgaonCenter = [77.0565, 28.4595];

export const mockLocations = [
  "Cyber City Gurgaon",
  "MG Road Gurgaon",
  "Huda City Centre",
  "Sector 29 Gurgaon",
  "IFFCO Chowk",
];

export const isRushHour = (date = new Date()) => {
  const hour = date.getHours();
  return hour >= rushHourStart && hour < rushHourEnd;
};

export const calculateEta = (baseMinutes, date = new Date()) => {
  const trafficDelay = isRushHour(date) ? 12 : 4;
  return baseMinutes + trafficDelay;
};

export const getCrowdLevel = (date = new Date()) => (isRushHour(date) ? "High" : "Low");

export const autoPricing = {
  baseFare: 30,
  currency: "\u20b9",
  timeEstimate: "4 mins away",
};

export const busRoutes = [
  {
    id: "bus-42",
    name: "Gurgaon Rapid 42",
    etaBase: 7,
    route: "Cyber City Gurgaon -> MG Road Gurgaon -> IFFCO Chowk",
    offlineHint: "Slight delay near Cyber Hub during rush hour",
    crowd: "Medium",
    isLive: true,
    coordinates: [
      [77.056, 28.459],
      [77.0568, 28.4593],
      [77.0576, 28.4597],
      [77.0585, 28.4603],
      [77.0594, 28.4608],
      [77.0603, 28.4614],
      [77.0612, 28.4621],
      [77.0621, 28.4626],
      [77.063, 28.4631],
      [77.0639, 28.4636],
      [77.0648, 28.4639],
      [77.0657, 28.4644],
      [77.0667, 28.465],
      [77.0678, 28.4658],
      [77.0691, 28.4668],
      [77.0704, 28.4682],
    ],
  },
  {
    id: "bus-18",
    name: "Metro Connector 18",
    etaBase: 11,
    route: "Huda City Centre -> Sector 29 Gurgaon -> IFFCO Chowk",
    offlineHint: "Moderate delay near Leisure Valley on weekdays",
    crowd: "Low",
    isLive: true,
    coordinates: [
      [77.0721, 28.4598],
      [77.0716, 28.4603],
      [77.071, 28.4609],
      [77.0702, 28.462],
      [77.0695, 28.4629],
      [77.0689, 28.4637],
      [77.0684, 28.4644],
      [77.0678, 28.4652],
      [77.0673, 28.4661],
      [77.0667, 28.4671],
      [77.0655, 28.4682],
      [77.0642, 28.4692],
      [77.0628, 28.4701],
      [77.0615, 28.4708],
    ],
  },
];

export const trainOptions = [
  {
    id: "train-green",
    name: "Delhi Metro Yellow Line",
    info: "Coming soon",
    route: "Huda City Centre -> Sikandarpur -> Delhi",
  },
];

export const nearbyVehicles = [
  { id: "nearby-bus-1", type: "bus", coordinates: [77.0538, 28.4587] },
  { id: "nearby-bus-2", type: "bus", coordinates: [77.0601, 28.4632] },
  { id: "nearby-bus-3", type: "bus", coordinates: [77.0669, 28.467] },
];

export const mockTransportOptions = {
  auto: {
    id: "auto",
    title: "Auto",
    fare: `${autoPricing.currency}${autoPricing.baseFare}`,
    timeEstimate: autoPricing.timeEstimate,
  },
  bus: {
    id: "bus",
    title: "Bus",
    routes: busRoutes,
  },
  train: {
    id: "train",
    title: "Train",
    status: "Coming soon",
    options: trainOptions,
  },
};

export const buildTransportOptions = () => {
  const crowd = getCrowdLevel();
  const autoAvailability = isRushHour() ? "High" : "Low";

  return [
    {
      id: "auto",
      type: "AUTO",
      title: "Auto",
      fare: `${autoPricing.currency}${autoPricing.baseFare}`,
      availability: autoAvailability,
      note: autoAvailability === "High" ? "More drivers near transit hubs" : "Fewer autos nearby right now",
      image: "/assets/auto.png",
    },
    {
      id: "bus",
      type: "BUS",
      title: "Bus",
      eta: `${calculateEta(busRoutes[0].etaBase)} mins`,
      crowd,
      route: busRoutes[0].route,
      offlineHint: busRoutes[0].offlineHint,
      image: "/assets/bus.png",
    },
    {
      id: "train",
      type: "TRAIN",
      title: "Train",
      info: trainOptions[0].info,
      route: trainOptions[0].route,
      image: "/assets/train.png",
    },
  ];
};
