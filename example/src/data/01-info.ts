import type { RouteConfig } from "react-route-profile";
import { SurfaceType } from "../../../src/types";
import geoJson from "./01-gpx.json";

export const route01: RouteConfig = {
  id: "01",
  name: "Small Loop into Slovak Paradise",
  center: { lat: 48.9378005, lng: 20.516344004276277 },
  zoomHorizontal: 14,
  zoomVertical: 13,
  geoJson,
  surface: [
    { segment: [0, 2700], type: SurfaceType.Asphalt },
    { segment: [2700, 4200], type: SurfaceType.Compacted },
    { segment: [4200, 8500], type: SurfaceType.Penetrated },
    { segment: [8500, 11000], type: SurfaceType.Compacted },
    { segment: [11000, 14100], type: SurfaceType.Asphalt },
    { segment: [14100, 17000], type: SurfaceType.Natural },
    { segment: [17000, 18800], type: SurfaceType.Asphalt },
  ]
};
