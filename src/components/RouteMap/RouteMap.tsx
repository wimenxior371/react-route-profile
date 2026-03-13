import { Status, Wrapper } from "@googlemaps/react-wrapper";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import type { CSSProperties } from "react";
import { useOrientation } from "../../hooks/useOrientation";
import { theme as defaultTheme } from "../../theme";
import { ThemeProvider } from "../../theme-provider";
import Loader from "../Loader";
import { ElevationChart } from "./ElevationChart";
import { GoogleMapCanvas } from "./GoogleMapCanvas";
import { HoverProvider } from "./HoverContext";
import { useChartFullscreen } from "./hooks/useChartFullscreen";
import { useResponsiveRouteMapTheme } from "./hooks/useResponsiveRouteMapTheme";
import { useViewport } from "./hooks/useViewport";
import styles from "./RouteMap.module.css";
import type { RouteMapProps } from "./types";

export type { RouteMapProps } from "./types";

const messages = {
  apiKey: "Oops! Cannot display the map: Google Maps API key missing",
  [Status.FAILURE]:
    "Unable to load Google Maps API. Check your API key or network.",
  [Status.LOADING]: undefined,
  [Status.SUCCESS]: undefined,
};

const RenderLoader = ({
  type,
  height,
}: {
  type: keyof typeof messages;
  height?: number | string;
}) => (
  <div style={{ height }}>
    <Loader message={messages[type]} height={height} />
  </div>
);

const render = (status: Status, height?: number | string) => (
  <RenderLoader type={status} height={height} />
);

export const RouteMap = ({
  apiKey,
  route,
  height = "100dvh",
  className,
  style,
  theme = defaultTheme,
}: RouteMapProps) => {
  const { isHorizontal } = useOrientation();
  const { isChartExpanded, toggleChartExpanded } = useChartFullscreen();
  const viewport = useViewport();
  const responsiveTheme = useResponsiveRouteMapTheme({
    isHorizontal,
    theme,
    width: viewport.width,
    height: viewport.height,
  });

  if (!apiKey) {
    return (
      <ThemeProvider theme={responsiveTheme}>
        <RenderLoader type="apiKey" height={height} />
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
        <div className={`${styles.rrpRoot} ${className ?? ""}`.trim()} style={containerStyle}>
          <Wrapper apiKey={apiKey} render={(status) => render(status, height)}>
            <GoogleMapCanvas route={route} height={height} isHorizontal={isHorizontal} />
          </Wrapper>
          <div
            className={[
              styles.rrpChartLayer,
              isChartExpanded ? styles.rrpChartLayerExpanded : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className={styles.rrpToolbar}>
              <div />
              <button
                type="button"
                className={styles.rrpIconButton}
                onClick={toggleChartExpanded}
                aria-label={
                  isChartExpanded ? "Minimize route profile" : "Expand route profile"
                }
                title={isChartExpanded ? "Minimize route profile" : "Expand route profile"}
              >
                {isChartExpanded ? (
                  <MdFullscreenExit className={styles.rrpIcon} />
                ) : (
                  <MdFullscreen className={styles.rrpIcon} />
                )}
              </button>
            </div>
            <div className={styles.rrpChartBody}>
              <ElevationChart route={route} />
            </div>
          </div>
        </div>
      </HoverProvider>
    </ThemeProvider>
  );
};
