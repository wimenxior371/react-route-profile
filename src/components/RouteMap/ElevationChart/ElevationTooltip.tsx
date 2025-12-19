import type { TooltipProps } from "recharts";
import { useTheme } from "../../../theme-provider";
import type { RouteConfig, SurfaceType } from "../../../types";
import { SURFACE_TEXTURES } from "./SurfaceStrip";

interface ElevationTooltipProps extends TooltipProps<number, string> {
  accent: string;
  primary: string;
  markers: Array<{ distance: number; name?: string }>;
  surfaces?: RouteConfig["surface"];
}

const MARKER_DISTANCE_TOLERANCE_MATCH = 300; // meters

const getSurfaceForDistance = (
  surfaces: RouteConfig["surface"],
  distance: number
) => {
  if (!surfaces?.length) return null;
  return (
    surfaces.find((surface) => {
      const [start, end] = surface.segment;
      const segStart = Math.min(start, end);
      const segEnd = Math.max(start, end);
      return distance >= segStart && distance <= segEnd;
    }) ?? null
  );
};

const formatSurfaceLabel = (surface: SurfaceType) =>
  surface.charAt(0).toUpperCase() + surface.slice(1);

export const ElevationTooltip = ({
  active,
  payload,
  label,
  accent,
  primary,
  markers,
  surfaces,
}: ElevationTooltipProps) => {
  const { tooltip } = useTheme();

  if (!active || !payload?.length) return null;

  const point = payload[0]?.payload;
  const distance = (point?.distance as number | undefined) ?? (label as number);
  const marker = markers.find(
    (m) =>
      Math.abs((m?.distance ?? -1) - (point?.distance ?? 0)) <=
      MARKER_DISTANCE_TOLERANCE_MATCH
  );
  const surface = getSurfaceForDistance(surfaces, distance);
  const surfaceTexture = surface?.type ? SURFACE_TEXTURES[surface.type] : null;

  const km = Math.trunc((label as number) / 1000);
  const m = Math.round((label as number) % 1000);

  return (
    <div
      style={{
        background: tooltip.background,
        border: "none",
        color: tooltip.textColor,
        padding: tooltip.padding,
        borderRadius: tooltip.borderRadius,
      }}
    >
      <div style={{ fontWeight: 600, color: primary }}>
        {km} km {m} m
      </div>
      <div>
        Elevation: <strong>{Math.round(point?.elevation ?? 0)} m</strong>
      </div>
      {surface?.type ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            lineHeight: 2,
          }}
        >
          <svg
            width="30"
            height="22"
            aria-hidden="true"
            style={{ display: "block" }}
          >
            {surfaceTexture ? (
              <image
                href={surfaceTexture.file}
                x="0"
                y="0"
                width="30"
                height="22"
                preserveAspectRatio="xMidYMid slice"
              />
            ) : (
              <rect width="30" height="22" fill={tooltip.textColor} />
            )}
          </svg>
          <strong>{formatSurfaceLabel(surface.type)}</strong>
        </div>
      ) : null}
      {marker?.name ? (
        <div style={{ color: accent, fontWeight: 600 }}>{marker.name}</div>
      ) : null}
    </div>
  );
};
