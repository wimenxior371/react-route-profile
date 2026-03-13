import type { SurfaceType } from "../types";

export type RouteMapLang = "de" | "en" | "sk";

export type Translations = {
  loader: {
    loadingMap: string;
  };
  routeMap: {
    apiKeyMissing: string;
    googleMapsFailure: string;
    expandRouteProfile: string;
    minimizeRouteProfile: string;
    scrollToExplore: string;
    scrollableRouteProfile: string;
  };
  tooltip: {
    elevation: string;
  };
  surface: Record<SurfaceType, string>;
};
