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
  ],
  routes: [
    {
      id: "8854", color: "#ffed00", segment: [0, 900]
    },
    {
      id: "2711", color: "#009fe2", segment: [900, 5100]
    },
    {
      id: "5705", color: "#009640", segment: [5100, 12200]
    },
    {
      id: "014", color: "#e30212", segment: [12200, 17900]
    },
    {
      id: "2711", color: "#009fe2", segment: [17900, 18800]
    }
  ]
};