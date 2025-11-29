#!/usr/bin/env node
/**
 * Fetch elevation samples for a LineString in a GeoJSON file and persist them
 * into the GeoJSON (properties.elevationProfile).
 *
 * Usage:
 *   fetch-elevation --in path/to/route.geojson --out path/to/out.geojson --samples 128 --key YOUR_GOOGLE_API_KEY
 *
 * - --in: input GeoJSON file containing a FeatureCollection with a LineString route
 * - --out: output path (defaults to input path with ".elevation.json" suffix)
 * - --samples: number of samples along the path (default 128)
 * - --key: Google Maps API key (or set GOOGLE_MAPS_API_KEY env var)
 */

import fs from "fs/promises";
import path from "path";
import process from "process";

const toRad = (deg) => (deg * Math.PI) / 180;

const haversineMeters = (a, b) => {
  const R = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const la1 = toRad(a.lat);
  const la2 = toRad(b.lat);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h =
    sinDLat * sinDLat +
    Math.cos(la1) * Math.cos(la2) * sinDLng * sinDLng;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
};

const parseArgs = () => {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i];
    const val = args[i + 1];
    if (!key?.startsWith("--")) continue;
    out[key.slice(2)] = val;
    if (val === undefined) i -= 1;
  }
  return out;
};

const extractPath = (geoJson) => {
  const features = geoJson?.features ?? [];
  const line = features.find(
    (f) =>
      f?.geometry?.type === "LineString" &&
      Array.isArray(f.geometry.coordinates)
  );
  if (!line) {
    throw new Error("No LineString geometry found in GeoJSON");
  }
  return (line.geometry?.coordinates || [])
    .map((c) => ({ lng: c[0], lat: c[1] }))
    .filter((c) => Number.isFinite(c.lat) && Number.isFinite(c.lng));
};

const downsamplePath = (points, maxPoints = 250) => {
  if (points.length <= maxPoints) return points;
  const stride = Math.ceil(points.length / maxPoints);
  return points.filter((_, idx) => idx % stride === 0 || idx === points.length - 1);
};

const buildUrl = (apiKey, pathPoints, samples) => {
  const pathParam = pathPoints.map((p) => `${p.lat},${p.lng}`).join("|");
  const encodedPath = encodeURIComponent(pathParam);
  return `https://maps.googleapis.com/maps/api/elevation/json?path=${encodedPath}&samples=${samples}&key=${apiKey}`;
};

const toElevationPoints = (results) => {
  const points = [];
  let cumulative = 0;
  results.forEach((r, idx) => {
    if (!r?.location) return;
    if (idx > 0) {
      const prev = results[idx - 1];
      cumulative += haversineMeters(
        { lat: prev.location.lat, lng: prev.location.lng },
        { lat: r.location.lat, lng: r.location.lng }
      );
    }
    points.push({
      lat: r.location.lat,
      lng: r.location.lng,
      distance: Math.round(cumulative),
      elevation: r.elevation,
    });
  });
  return points;
};

const main = async () => {
  const args = parseArgs();
  const inputPath = args.in || args.input;
  if (!inputPath) {
    console.error("Missing --in <path/to/geojson>");
    process.exit(1);
  }
  const outputPath = args.out || inputPath;
  const samples = Number(args.samples) || 128;
  const apiKey = args.key || process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error("Missing API key. Pass --key or set GOOGLE_MAPS_API_KEY.");
    process.exit(1);
  }

  const raw = await fs.readFile(inputPath, "utf8");
  const geoJson = JSON.parse(raw);
  const rawPath = extractPath(geoJson);
  const pathPoints = downsamplePath(rawPath);
  if (rawPath.length !== pathPoints.length) {
    console.log(`Downsampled path from ${rawPath.length} to ${pathPoints.length} points.`);
  }
  if (pathPoints.length < 2) {
    throw new Error("Not enough coordinates to sample elevation");
  }

  const url = buildUrl(apiKey, pathPoints, samples);
  console.log(`Requesting elevation (${samples} samples)...`);
  const res = await fetch(url);
  let json;
  try {
    json = await res.json();
  } catch {
    /* ignore */
  }
  if (!res.ok) {
    throw new Error(
      `Elevation API failed: ${res.status} ${res.statusText}${
        json?.status ? ` (${json.status})` : ""
      }`
    );
  }
  if (json?.status !== "OK") {
    throw new Error(`Elevation API error: ${json?.status || "Unknown error"}`);
  }

  const points = toElevationPoints(json.results || []);
  const output = {
    ...geoJson,
    properties: {
      ...(geoJson.properties || {}),
      elevationProfile: {
        samples,
        points,
        source: "google-elevation",
      },
    },
  };

  await fs.writeFile(outputPath, JSON.stringify(output, null, 2), "utf8");
  const totalDistance =
    points.length > 0 ? points[points.length - 1].distance : 0;
  const elevations = points.map((p) => p.elevation);
  const min = elevations.length ? Math.min(...elevations) : 0;
  const max = elevations.length ? Math.max(...elevations) : 0;

  console.log(
    `Saved ${points.length} elevation points to ${path.resolve(outputPath)}`
  );
  console.log(
    `Distance ~${Math.round(totalDistance / 1000)} km | Elevation range ${Math.round(
      min
    )}m – ${Math.round(max)}m`
  );
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
