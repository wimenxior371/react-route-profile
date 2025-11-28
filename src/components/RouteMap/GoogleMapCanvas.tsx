import { useEffect, useRef } from "react";
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM_HORIZONTAL,
  DEFAULT_ZOOM_VERTICAL,
  markers,
} from "../../constants";
import { theme } from "../../theme";
import type { RouteConfig } from "../../types";
import styles from "./GoogleMapCanvas.module.css";

interface GoogleMapCanvasProps {
  route: RouteConfig;
  height: number | string;
  isHorizontal: boolean;
}

export const GoogleMapCanvas = ({
  route,
  height,
  isHorizontal,
}: GoogleMapCanvasProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current || !window.google?.maps) {
      return;
    }

    const zoom =
      (isHorizontal && (route.zoomHorizontal || DEFAULT_ZOOM_HORIZONTAL)) ||
      route.zoomVertical ||
      DEFAULT_ZOOM_VERTICAL;

    const map = new window.google.maps.Map(ref.current, {
      center: route.center || DEFAULT_CENTER,
      zoom,
      mapTypeId: window.google.maps.MapTypeId.SATELLITE,
      streetViewControl: false,
    });

    map.data.setStyle((feature: google.maps.Data.Feature) => {
      const name = feature.getProperty("name") as string;
      const isFirst = feature.getProperty("first") as boolean;
      const isLast = feature.getProperty("last") as boolean;

      return {
        strokeColor: theme.colors.primaryMuted,
        strokeWeight: 10,
        icon: {
          url: isFirst
            ? markers.start
            : isLast
            ? markers.finish
            : markers.default,
          scaledSize: new window.google.maps.Size(50, 50),
          optimized: false,
          zIndex: isFirst || isLast ? 100 : 10,
          collisionBehavior:
            window.google?.maps?.CollisionBehavior?.REQUIRED_AND_HIDES_OPTIONAL,
        },
        label: {
          className: styles.markerLabel,
          fontSize: "20px",
          fontWeight: "bold",
          color: theme.colors.accent,
          text: name,
        },
      };
    });

    map.data.addGeoJson(route.geoJson);

    return () => {
      map.data.forEach((feature: google.maps.Data.Feature) => {
        map.data.remove(feature);
      });
    };
  }, [route, isHorizontal]);

  return (
    <div
      ref={ref}
      className={styles.mapCanvas}
      style={{
        height,
      }}
    />
  );
};
