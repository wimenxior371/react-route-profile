import { Status, Wrapper } from "@googlemaps/react-wrapper";
import { type CSSProperties, useMemo, useRef } from "react";
import { useOrientation } from "../../hooks/useOrientation";
import { I18nProvider, useI18n } from "../../i18n";
import { theme as defaultTheme } from "../../theme";
import { ThemeProvider } from "../../theme-provider";
import Loader from "../Loader";
import { getMaxDistance, getPointsWithElevation } from "./ElevationChart/utils";
import { GoogleMapCanvas } from "./GoogleMapCanvas";
import { useChartFullscreen } from "./hooks/useChartFullscreen";
import { useRouteMapFullscreen } from "./hooks/useRouteMapFullscreen";
import { useResponsiveRouteMapTheme } from "./hooks/useResponsiveRouteMapTheme";
import { useViewport } from "./hooks/useViewport";
import { HoverProvider } from "./HoverContext";
import { RouteMapChartLayer } from "./RouteMapChartLayer";
import styles from "./RouteMap.module.css";
import type { RouteMapProps } from "./types";

export type { RouteMapProps } from "./types";

const RenderLoader = ({
  message,
  height,
}: {
  message?: string;
  height?: number | string;
}) => (
  <div style={{ height }}>
    <Loader message={message} height={height} />
  </div>
);

export const RouteMap = ({
  apiKey,
  route,
  height = "100dvh",
  className,
  style,
  theme = defaultTheme,
  lang = "en",
}: RouteMapProps) => {
  return (
    <I18nProvider lang={lang}>
      <RouteMapContent
        apiKey={apiKey}
        route={route}
        height={height}
        className={className}
        style={style}
        theme={theme}
      />
    </I18nProvider>
  );
};

const RouteMapContent = ({
  apiKey,
  route,
  height = "100dvh",
  className,
  style,
  theme = defaultTheme,
}: Omit<RouteMapProps, "lang">) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const isMapFullscreen = useRouteMapFullscreen(rootRef);
  const { isHorizontal } = useOrientation(isMapFullscreen);
  const { routeMap } = useI18n();
  const { isChartExpanded, toggleChartExpanded } = useChartFullscreen();
  const viewport = useViewport(isMapFullscreen);
  const responsiveTheme = useResponsiveRouteMapTheme({
    isHorizontal,
    theme,
    width: viewport.width,
    height: viewport.height,
  });
  const elevationPoints = useMemo(() => getPointsWithElevation(route), [route]);
  const maxDistance = useMemo(() => getMaxDistance(elevationPoints), [elevationPoints]);
  const pointFeatureCount = useMemo(() => {
    const geoJson = route.geoJson as { features?: Array<{ geometry?: { type?: string } }> };
    return (
      geoJson.features?.filter((feature) => feature.geometry?.type === "Point").length ?? 0
    );
  }, [route.geoJson]);
  const isSmallVerticalScreen = !isHorizontal && viewport.width <= 767;
  const isScrollableChartExpanded =
    isChartExpanded &&
    isSmallVerticalScreen &&
    maxDistance >= 30000 &&
    pointFeatureCount > 10;

  if (!apiKey) {
    return (
      <ThemeProvider theme={responsiveTheme}>
        <RenderLoader message={routeMap.apiKeyMissing} height={height} />
      </ThemeProvider>
    );
  }

  const containerStyle: CSSProperties = {
    height,
    width: "100%",
    ...style,
  };

  return (
    <ThemeProvider theme={responsiveTheme}>
      <HoverProvider>
        <div
          ref={rootRef}
          className={`${styles.rrpRoot} ${className ?? ""}`.trim()}
          style={containerStyle}
        >
          <Wrapper
            apiKey={apiKey}
            render={(status) => (
              <RenderLoader
                message={status === Status.FAILURE ? routeMap.googleMapsFailure : undefined}
                height={height}
              />
            )}
          >
            <GoogleMapCanvas route={route} height={height} isHorizontal={isHorizontal} />
          </Wrapper>
          <RouteMapChartLayer
            route={route}
            isChartExpanded={isChartExpanded}
            isScrollableChartExpanded={isScrollableChartExpanded}
            onToggleChartExpanded={toggleChartExpanded}
          />
        </div>
      </HoverProvider>
    </ThemeProvider>
  );
};
