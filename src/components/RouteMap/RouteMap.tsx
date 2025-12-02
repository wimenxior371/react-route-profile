import { Status, Wrapper } from "@googlemaps/react-wrapper";
import type { CSSProperties } from "react";
import { useOrientation } from "../../hooks/useOrientation";
import { theme as defaultTheme, type PartialTheme } from "../../theme";
import { ThemeProvider } from "../../theme-provider";
import type { RouteConfig } from "../../types";
import Loader from "../Loader";
import { ElevationChart } from "./ElevationChart";
import { GoogleMapCanvas } from "./GoogleMapCanvas";
import { HoverProvider } from "./HoverContext";
import styles from "./RouteMap.module.css";

export interface RouteMapProps {
  apiKey: string;
  route: RouteConfig;
  height?: number | string;
  className?: string;
  style?: CSSProperties;
  theme?: PartialTheme;
}

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

  if (!apiKey) {
    return (
      <ThemeProvider theme={theme}>
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
    <ThemeProvider theme={theme}>
      <HoverProvider>
        <div className={className} style={containerStyle}>
          <Wrapper apiKey={apiKey} render={(status) => render(status, height)}>
            <GoogleMapCanvas
              route={route}
              height={height}
              isHorizontal={isHorizontal}
            />
          </Wrapper>
          <div className={styles.chartLayer}>
            <div className={styles.chartBody}>
              <ElevationChart route={route} />
            </div>
          </div>
        </div>
      </HoverProvider>
    </ThemeProvider>
  );
};
