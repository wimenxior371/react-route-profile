import { useEffect, useRef } from "react";
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM_HORIZONTAL,
  DEFAULT_ZOOM_VERTICAL,
  markers,
} from "../../constants";
import type { RouteDetail } from "../../types";
import "./GoogleMapCanvas.css";

interface GoogleMapCanvasProps {
  route: RouteDetail;
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

    map.data.setStyle((feature: any) => {
      const name = feature.getProperty("name") as string;
      const isFirst = feature.getProperty("first") as boolean;
      const isLast = feature.getProperty("last") as boolean;

      return {
        strokeColor: "rgba(14, 165, 233, 0.7)",
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
          className: "rrp-marker-label",
          color: "#84CC16",
          fontSize: "20px",
          fontWeight: "bold",
          text: name,
        },
      };
    });

    map.data.addGeoJson(route.geoJson as any);

    return () => {
      map.data.forEach((feature: any) => {
        map.data.remove(feature);
      });
    };
  }, [route, isHorizontal]);

  return (
    <div
      ref={ref}
      style={{
        height,
        width: "100%",
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.16)",
      }}
    />
  );
};
