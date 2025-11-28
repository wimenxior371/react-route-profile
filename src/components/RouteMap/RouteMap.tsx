import { Status, Wrapper } from "@googlemaps/react-wrapper";
import { type CSSProperties } from "react";
import { useOrientation } from "../../hooks/useOrientation";
import type { RouteDetail } from "../../types";
import Loader from "../Loader";
import { GoogleMapCanvas } from "./GoogleMapCanvas";

export interface RouteMapProps {
  apiKey: string;
  route: RouteDetail;
  height?: number | string;
  className?: string;
  style?: CSSProperties;
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
  height = "100vh",
  className,
  style,
}: RouteMapProps) => {
  const { isHorizontal } = useOrientation();

  if (!apiKey) {
    return <RenderLoader type="apiKey" height={height} />;
  }

  const containerStyle: CSSProperties = {
    height,
    width: "100%",
    ...style,
  };

  return (
    <div className={className} style={containerStyle}>
      <Wrapper apiKey={apiKey} render={(status) => render(status, height)}>
        <GoogleMapCanvas
          route={route}
          height={height}
          isHorizontal={isHorizontal}
        />
      </Wrapper>
    </div>
  );
};
