import { useMeasure } from "@uidotdev/usehooks";

export const useMapHeader = () => {
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
