import { useEffect, useMemo, useRef } from "react";
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM_HORIZONTAL,
  DEFAULT_ZOOM_VERTICAL,
} from "../../constants";
import { useTheme } from "../../theme-provider";
import type { RouteConfig } from "../../types";
import { buildMarkerIcon } from "../icons/buildMarkerIcon";
import {
  findNearestPointByCoordinates,
  getAllPoints,
} from "./ElevationChart/utils";
import styles from "./GoogleMapCanvas.module.css";
import { HoverStateChangeSource, useHover } from "./HoverContext";

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
  const theme = useTheme();
  const { hover, setHover } = useHover();
  const ref = useRef<HTMLDivElement | null>(null);
  const highlightMarkerRef = useRef<google.maps.Marker | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const points = useMemo(() => getAllPoints(route), [route]);
  const markerIcons = useMemo(
    () => ({
      default: buildMarkerIcon(theme.marker.outer, theme.marker.inner),
      start: buildMarkerIcon(theme.marker.outer, theme.marker.startInner),
      finish: buildMarkerIcon(theme.marker.outer, theme.marker.finishInner),
    }),
    [theme.marker]
  );

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
    mapRef.current = map;

    map.data.setStyle((feature: google.maps.Data.Feature) => {
      const name = feature.getProperty("name") as string;
      const isFirst = feature.getProperty("first") as boolean;
      const isLast = feature.getProperty("last") as boolean;

      return {
        strokeColor: theme.colors.primaryMuted,
        strokeWeight: theme.map.strokeWeight,
        icon: {
          url: isFirst
            ? markerIcons.start
            : isLast
            ? markerIcons.finish
            : markerIcons.default,
          scaledSize: new window.google.maps.Size(
            theme.map.markerSize,
            theme.map.markerSize
          ),
          optimized: false,
          zIndex: isFirst || isLast ? 100 : 10,
          collisionBehavior:
            window.google?.maps?.CollisionBehavior?.REQUIRED_AND_HIDES_OPTIONAL,
        },
        label: {
          className: "rrpMarkerLabel",
          fontSize: `${theme.map.markerLabelFontSize}px`,
          fontWeight: theme.map.markerLabelFontWeight,
          color: theme.colors.accent,
          text: name,
        },
      };
    });

    map.data.addGeoJson(route.geoJson);

    const moveListener = map.addListener(
      "mousemove",
      (e: google.maps.MapMouseEvent) => {
        const latLng = e.latLng;
        if (!latLng) return;
        const nearest = findNearestPointByCoordinates(points, {
          lat: latLng.lat(),
          lng: latLng.lng(),
        });
        if (nearest) {
          setHover({
            lat: nearest.lat,
            lng: nearest.lng,
            source: HoverStateChangeSource.Map,
          });
        }
      }
    );

    return () => {
      moveListener.remove();
      map.data.forEach((feature: google.maps.Data.Feature) => {
        map.data.remove(feature);
      });
      mapRef.current = null;
    };
  }, [route, isHorizontal, theme, points, setHover, markerIcons]);

  useEffect(() => {
    if (!ref.current || !window.google?.maps) return;
    const mapInstance = mapRef.current;
    if (!mapInstance) return;
    if (!hover.lat || !hover.lng) {
      if (highlightMarkerRef.current) {
        highlightMarkerRef.current.setMap(null);
        highlightMarkerRef.current = null;
      }
      return;
    }
    const icon = {
      path: window.google.maps.SymbolPath.CIRCLE,
      scale: theme.map.hoverMarkerScale,
      fillColor: theme.dots.mapActive,
      fillOpacity: 1,
      strokeWeight: 0,
    };
    if (!highlightMarkerRef.current) {
      highlightMarkerRef.current = new window.google.maps.Marker({
        map: mapInstance,
        icon,
      });
    } else {
      highlightMarkerRef.current.setIcon(icon);
    }
    highlightMarkerRef.current.setPosition({ lat: hover.lat, lng: hover.lng });
    highlightMarkerRef.current.setMap(mapInstance);
  }, [hover, theme]);

  return (
    <div
      ref={ref}
      className={styles.rrpMapCanvas}
      style={{
        height,
      }}
    />
  );
};
