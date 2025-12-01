import { useMeasure } from "@uidotdev/usehooks";
import { RATIO_HEADER_DESKTOP, RATIO_HEADER_MOBILE } from "../constants";
import { useOrientation } from "./useOrientation";

const HEADER_FALLBACK_PX = 100;

export const useMapHeader = () => {
  const { isVertical } = useOrientation();

  const [refHeader, { height: headerHeight }] = useMeasure();
  const [refMapContainer, { height: mapContainerHeight }] = useMeasure();

  const targetHeaderFraction = isVertical ? RATIO_HEADER_MOBILE : RATIO_HEADER_DESKTOP;
  const viewportHeight = typeof window !== "undefined" ? window.innerHeight : HEADER_FALLBACK_PX / targetHeaderFraction;
  const fallbackHeaderHeightPx = viewportHeight * targetHeaderFraction || HEADER_FALLBACK_PX;
  const effectiveHeaderHeight = headerHeight || fallbackHeaderHeightPx;
  const mapHeightStyle = `calc(100dvh - ${effectiveHeaderHeight}px)`;
  const mapHeight = mapContainerHeight || mapHeightStyle;

  return {
    refHeader,
    refMapContainer,
    targetHeaderFraction,
    effectiveHeaderHeight,
    mapHeight,
  };
};
