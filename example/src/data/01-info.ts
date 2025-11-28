import type { RouteConfig } from "react-route-profile";
import geoJson from "./01-gpx.json";

export const route01: RouteConfig = {
  id: "01",
  name: "Small Loop into Slovak Paradise",
  center: { lat: 48.9378005, lng: 20.516344004276277 },
  zoomHorizontal: 14,
  zoomVertical: 13,
  geoJson,
};
