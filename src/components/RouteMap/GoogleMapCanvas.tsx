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
import "./index.css";

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
  const moveListenerRef = useRef<google.maps.MapsEventListener | null>(null);
  const points = useMemo(() => getAllPoints(route), [route]);
  const markerIcons = useMemo(
    () => ({
      default: buildMarkerIcon(theme.marker.outer, theme.marker.inner),
      start: buildMarkerIcon(theme.marker.outer, theme.marker.startInner),
      finish: buildMarkerIcon(theme.marker.outer, theme.marker.finishInner),
    }),
    [theme.marker]
  );
  const center = route.center || DEFAULT_CENTER;
  const zoom =
    (isHorizontal && (route.zoomHorizontal || DEFAULT_ZOOM_HORIZONTAL)) ||
    route.zoomVertical ||
    DEFAULT_ZOOM_VERTICAL;

  // biome-ignore lint/correctness/useExhaustiveDependencies: we do not want to reinitiate the map on center, zoom update
  useEffect(() => {
    if (!ref.current || !window.google?.maps) {
      return;
    }

    mapRef.current = new window.google.maps.Map(ref.current, {
      center,
      zoom,
      mapTypeId: window.google.maps.MapTypeId.SATELLITE,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: window.google.maps.ControlPosition.TOP_LEFT,
      },
      fullscreenControl: true,
      streetViewControl: false,
    });
  }, []);

  useEffect(() => {
    return () => {
      moveListenerRef.current?.remove();
      moveListenerRef.current = null;
      highlightMarkerRef.current?.setMap(null);
      highlightMarkerRef.current = null;
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !window.google?.maps) {
      return;
    }

    map.setOptions({
      center,
      zoom,
    });
  }, [center, zoom]);

  useEffect(() => {
    if (!ref.current || !window.google?.maps) {
      return;
    }

    const map = mapRef.current;
    if (!map) {
      return;
    }

    const syncMapViewport = () => {
      window.google.maps.event.trigger(map, "resize");
      map.setCenter(center);
      map.setZoom(zoom);
    };

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(syncMapViewport);
    });

    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [center, zoom]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !window.google?.maps) {
      return;
    }

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
  }, [markerIcons, theme]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    map.data.forEach((feature: google.maps.Data.Feature) => {
      map.data.remove(feature);
    });

    map.data.addGeoJson(route.geoJson);
  }, [route.geoJson]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    moveListenerRef.current?.remove();
    moveListenerRef.current = map.addListener(
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
      moveListenerRef.current?.remove();
      moveListenerRef.current = null;
    };
  }, [points, setHover]);

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
