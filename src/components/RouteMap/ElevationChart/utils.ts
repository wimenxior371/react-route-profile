import type { ElevationPoint, Marker } from "./types";

export const getMaxDistance = (points: ElevationPoint[]) =>
  points.length ? points[points.length - 1].distance : 0;

export const getTicksForDistance = (maxDistance: number, step: number = 2000) => {
  const ticks: number[] = [];
  for (let d = 0; d <= maxDistance; d += step) {
    ticks.push(d);
  }
  if (ticks[ticks.length - 1] < maxDistance) {
    ticks.push(maxDistance);
  }
  return ticks;
}

export const getPointsWithElevation = (route: any): ElevationPoint[] => {
  const geo = route.geoJson as any;
  const line = geo?.features?.find(
    (f: any) =>
      f?.geometry?.type === "LineString" &&
      f?.properties?.elevationProfile?.points
  );
  const raw = line?.properties?.elevationProfile?.points || [];
  return [...raw].sort(
    (a: ElevationPoint, b: ElevationPoint) => (a?.distance ?? 0) - (b?.distance ?? 0)
  );
};

export const getAllPoints = (route: any): [number, number][] => {
    const geo = route.geoJson as any;
    const points = geo?.features?.find(
    (f: any) =>
      f?.geometry?.type === "LineString" &&
      f?.geometry?.coordinates
    );
    return points.geometry.coordinates
}

export const computeMinMax = (points: Array<{ elevation: number }>) => {
  if (!points.length) return [0, 0] as const;
  const elevations = points.map((p) => p.elevation);
  const min = Math.min(...elevations);
  const max = Math.max(...elevations);
  const pad = Math.max(10, (max - min) * 0.05);
  return [Math.floor(min - pad), Math.ceil(max + pad)];
};

export const computeRoundedDomainAndTicks = (
  minMax: [number, number],
  shouldOffset: boolean = false
) => {
  const [min, max] = minMax;
  const paddedRange = (max - min) * 1.2;
  const step = Math.max(10, Math.round(paddedRange / 6 / 10) * 10 || 50);
  const offset = shouldOffset ? -20 : 0;
  const graphMin =
    Math.floor((min - (paddedRange - (max - min)) / 2) / step) * step +
    offset;
  const graphMax =
    Math.ceil((max + (paddedRange - (max - min)) / 2) / step) * step +
    offset;
  const ticks: number[] = [];
  for (let v = graphMin; v <= graphMax + step / 2; v += step) {
    ticks.push(v);
  }

  return [graphMin, graphMax, ticks] as const;
};

export const computeMarkerPoints = (
  elevationPoints: ElevationPoint[],
  geoJson: any
) => {
  if (!elevationPoints?.length) return [];
  const features = geoJson?.features ?? [];
  const pointFeatures = features.filter(
    (f: any) => f?.geometry?.type === "Point"
  );

  const markers: Array<Marker> = [];

  pointFeatures.forEach((f: any) => {
    const coords = f?.geometry?.coordinates;
    if (!Array.isArray(coords) || coords.length < 2) return;
    const [lng, lat] = coords;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    const nearest = elevationPoints.reduce<{
      point: ElevationPoint | null;
      dist: number;
    }>(
      (acc, p) => {
        const d = Math.pow(p.lat - lat, 2) + Math.pow(p.lng - lng, 2);
        if (d < acc.dist) {
          return { point: p, dist: d };
        }
        return acc;
      },
      { point: null, dist: Number.POSITIVE_INFINITY }
    );
    if (nearest.point) {
      // Skip if this marker matches the very first elevation point (start of route)
      if (nearest.point.distance === 0) {
        return;
      }
      markers.push({
        distance: nearest.point.distance,
        elevation: nearest.point.elevation,
        name: f?.properties?.name,
      });
    }
  });

  return markers.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
};

export const findNearestPointByCoordinates = (
  points: [number, number][],
  target: { lat: number; lng: number }
): ElevationPoint | null => {
  if (!points.length) return null;
  let closest: ElevationPoint | null = null;
  let minDist = Number.POSITIVE_INFINITY;
  points.forEach(([lng, lat]) => {
    const d = ((lat - target.lat) ** 2) + ((lng - target.lng) ** 2);
    if (d < minDist) {
      minDist = d;
      closest = { lat, lng } as ElevationPoint;
    }
  });
  return closest;
};

export const findNearestPoint = (
  points: ElevationPoint[],
  target: [number, number]
): ElevationPoint | null => {
  if (!points.length) return null;
  let closest: ElevationPoint | null = null;
  let minDist = Number.POSITIVE_INFINITY;
  points.forEach((p) => {
    const d = ((p.lat - target[0]) ** 2) + ((p.lng - target[1]) ** 2);
    if (d < minDist) {
      minDist = d;
      closest = p;
    }
  });
  return closest;
};

const DISTANCE_THRESHOLD = 1000; // meters

export const isCloseCheck = (
  marker1: Marker,
  marker2?: Marker,
  threshold: number = DISTANCE_THRESHOLD
) => {
  return (
    marker2 &&
    Math.abs((marker2.distance ?? 0) - (marker1.distance ?? 0)) < threshold
  );
};
