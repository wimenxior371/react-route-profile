import { useMeasure } from "@uidotdev/usehooks";
import type { RefCallback } from "react";

export const useMapHeader = (): {
  refHeader: RefCallback<Element>;
  isHeaderReady: boolean;
  headerHeight: number | null;
  mapHeight: string;
} => {
  const [refHeader, { height: headerHeight }] = useMeasure();

  const isHeaderReady = Boolean(headerHeight);
  const mapHeight = isHeaderReady
    ? `calc(100dvh - ${headerHeight}px)`
    : "0px";

  return {
    refHeader,
    isHeaderReady,
    headerHeight,
    mapHeight,
  };
};
