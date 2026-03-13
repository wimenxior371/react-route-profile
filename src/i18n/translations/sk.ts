import { SurfaceType } from "../../types";
import type { Translations } from "../types";

export const sk: Translations = {
  loader: {
    loadingMap: "Načítavam mapu...",
  },
  routeMap: {
    apiKeyMissing: "Ups! Mapu nie je možné zobraziť: chýba Google Maps API kľúč",
    googleMapsFailure: "Google Maps API sa nepodarilo načítať. Skontrolujte API kľúč alebo sieť.",
    expandRouteProfile: "Rozbaliť profil trasy",
    minimizeRouteProfile: "Zbaliť profil trasy",
    scrollToExplore: "Posunutím zobrazíte viac",
    scrollableRouteProfile: "Posuvný profil trasy",
  },
  tooltip: {
    elevation: "Prevýšenie",
  },
  surface: {
    [SurfaceType.Asphalt]: "Asfalt",
    [SurfaceType.Compacted]: "Spevnený povrch",
    [SurfaceType.Concrete]: "Betón",
    [SurfaceType.Natural]: "Prírodný povrch",
    [SurfaceType.Penetrated]: "Penetračný povrch",
  },
};
