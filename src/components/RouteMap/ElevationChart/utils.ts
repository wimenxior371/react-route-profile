export const computeMinMax = (points: Array<{ elevation: number }>) => {
  if (!points.length) return [0, 0] as const;
  const elevations = points.map((p) => p.elevation);
  const min = Math.min(...elevations);
  const max = Math.max(...elevations);
  const pad = Math.max(10, (max - min) * 0.05);
  return [Math.floor(min - pad), Math.ceil(max + pad)];
};

export const computeRoundedDomainAndTicks = (
  minMax: [number, number]
) => {
  const [min, max] = minMax;
  const paddedRange = (max - min) * 1.2;
  const step = Math.max(10, Math.round(paddedRange / 6 / 10) * 10 || 50);
  const graphMin = Math.floor((min - (paddedRange - (max - min)) / 2) / step) * step;
  const graphMax = Math.ceil((max + (paddedRange - (max - min)) / 2) / step) * step;
  const ticks: number[] = [];
  for (let v = graphMin; v <= graphMax + step / 2; v += step) {
    ticks.push(v);
  }

  return [graphMin, graphMax, ticks] as const;
};

type ElevationPoint = {
  lat: number;
  lng: number;
  distance: number;
  elevation: number;
};

export const computeMarkerPoints = (
  elevationPoints: ElevationPoint[],
  geoJson: any
) => {
  if (!elevationPoints?.length) return [];
  const features = geoJson?.features ?? [];
  const pointFeatures = features.filter((f: any) => f?.geometry?.type === "Point");

  const markers: Array<{
    distance: number;
    elevation: number;
    name?: string;
  }> = [];

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
        const d =
          Math.pow(p.lat - lat, 2) +
          Math.pow(p.lng - lng, 2);
        if (d < acc.dist) {
          return { point: p, dist: d };
        }
        return acc;
      },
      { point: null, dist: Number.POSITIVE_INFINITY }
    );
    if (nearest.point) {
      markers.push({
        distance: nearest.point.distance,
        elevation: nearest.point.elevation,
        name: f?.properties?.name,
      });
    }
  });

  return markers;
};
