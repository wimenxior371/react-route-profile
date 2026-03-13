import { SurfaceType } from "../../types";
import type { Translations } from "../types";

export const de: Translations = {
  loader: {
    loadingMap: "Karte wird geladen...",
  },
  routeMap: {
    apiKeyMissing: "Die Karte kann nicht angezeigt werden: Der Google Maps API-Schlüssel fehlt",
    googleMapsFailure:
      "Die Google Maps API konnte nicht geladen werden. Prüfen Sie Ihren API-Schlüssel oder die Netzwerkverbindung.",
    expandRouteProfile: "Routenprofil erweitern",
    minimizeRouteProfile: "Routenprofil minimieren",
    scrollToExplore: "Zum Erkunden scrollen",
    scrollableRouteProfile: "Scrollbares Routenprofil",
  },
  tooltip: {
    elevation: "Höhenmeter",
  },
  surface: {
    [SurfaceType.Asphalt]: "Asphalt",
    [SurfaceType.Compacted]: "Verdichteter Belag",
    [SurfaceType.Concrete]: "Beton",
    [SurfaceType.Natural]: "Naturbelag",
    [SurfaceType.Penetrated]: "Penetrierter Belag",
  },
};
