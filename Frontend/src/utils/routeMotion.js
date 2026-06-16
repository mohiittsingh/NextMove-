const EARTH_RADIUS_METERS = 6371000;

const toRadians = (value) => (value * Math.PI) / 180;
const toDegrees = (value) => (value * 180) / Math.PI;

export const getDistanceMeters = (from, to) => {
  if (!from || !to) return 0;

  const [fromLng, fromLat] = from;
  const [toLng, toLat] = to;
  const deltaLat = toRadians(toLat - fromLat);
  const deltaLng = toRadians(toLng - fromLng);
  const startLat = toRadians(fromLat);
  const endLat = toRadians(toLat);

  const sinLat = Math.sin(deltaLat / 2);
  const sinLng = Math.sin(deltaLng / 2);
  const haversine =
    sinLat * sinLat + Math.cos(startLat) * Math.cos(endLat) * sinLng * sinLng;

  return 2 * EARTH_RADIUS_METERS * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
};

export const interpolateCoordinate = (from, to, progress) => [
  from[0] + (to[0] - from[0]) * progress,
  from[1] + (to[1] - from[1]) * progress,
];

export const getBearing = (from, to) => {
  if (!from || !to) return 0;

  const [fromLng, fromLat] = from;
  const [toLng, toLat] = to;
  const startLat = toRadians(fromLat);
  const endLat = toRadians(toLat);
  const deltaLng = toRadians(toLng - fromLng);

  const y = Math.sin(deltaLng) * Math.cos(endLat);
  const x =
    Math.cos(startLat) * Math.sin(endLat) -
    Math.sin(startLat) * Math.cos(endLat) * Math.cos(deltaLng);

  return (toDegrees(Math.atan2(y, x)) + 360) % 360;
};

export const buildRouteSegments = (coordinates = []) => {
  if (coordinates.length < 2) return [];

  const segments = [];
  let cumulativeDistance = 0;

  for (let index = 0; index < coordinates.length - 1; index += 1) {
    const start = coordinates[index];
    const end = coordinates[index + 1];
    const distance = getDistanceMeters(start, end);

    segments.push({
      start,
      end,
      distance,
      bearing: getBearing(start, end),
      cumulativeDistance,
    });

    cumulativeDistance += distance;
  }

  return segments;
};

export const densifyRoute = (coordinates = [], maxSegmentLengthMeters = 28) => {
  if (coordinates.length < 2) return coordinates;

  const denseCoordinates = [coordinates[0]];

  for (let index = 0; index < coordinates.length - 1; index += 1) {
    const start = coordinates[index];
    const end = coordinates[index + 1];
    const distance = getDistanceMeters(start, end);
    const steps = Math.max(1, Math.ceil(distance / maxSegmentLengthMeters));

    for (let step = 1; step <= steps; step += 1) {
      denseCoordinates.push(interpolateCoordinate(start, end, step / steps));
    }
  }

  return denseCoordinates;
};

export const getPointAlongRoute = (segments, distanceTravelled) => {
  if (!segments.length) {
    return { coordinate: null, bearing: 0, completed: true };
  }

  const totalDistance = segments[segments.length - 1].cumulativeDistance + segments[segments.length - 1].distance;
  const clampedDistance = Math.min(Math.max(distanceTravelled, 0), totalDistance);

  for (const segment of segments) {
    const segmentEndDistance = segment.cumulativeDistance + segment.distance;

    if (clampedDistance <= segmentEndDistance) {
      const segmentDistance = clampedDistance - segment.cumulativeDistance;
      const progress = segment.distance === 0 ? 0 : segmentDistance / segment.distance;

      return {
        coordinate: interpolateCoordinate(segment.start, segment.end, progress),
        bearing: segment.bearing,
        completed: clampedDistance >= totalDistance,
      };
    }
  }

  const finalSegment = segments[segments.length - 1];
  return {
    coordinate: finalSegment.end,
    bearing: finalSegment.bearing,
    completed: true,
  };
};
