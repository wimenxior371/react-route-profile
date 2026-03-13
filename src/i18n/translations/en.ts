import { SurfaceType } from "../../types";
import type { Translations } from "../types";

export const en: Translations = {
  loader: {
    loadingMap: "Loading map...",
  },
  routeMap: {
    apiKeyMissing: "Oops! Cannot display the map: Google Maps API key missing",
    googleMapsFailure: "Unable to load Google Maps API. Check your API key or network.",
    expandRouteProfile: "Expand route profile",
    minimizeRouteProfile: "Minimize route profile",
    scrollToExplore: "Scroll to explore",
    scrollableRouteProfile: "Scrollable route profile",
  },
  tooltip: {
    elevation: "Elevation",
  },
  surface: {
    [SurfaceType.Asphalt]: "Asphalt",
    [SurfaceType.Compacted]: "Compacted",
    [SurfaceType.Concrete]: "Concrete",
    [SurfaceType.Natural]: "Natural",
    [SurfaceType.Penetrated]: "Penetrated",
  },
};
