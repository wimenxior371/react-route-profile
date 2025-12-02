import type { TooltipProps } from "recharts";
import { useTheme } from "../../../theme-provider";

interface ElevationTooltipProps extends TooltipProps<number, string> {
  accent: string;
  primary: string;
  markers: Array<{ distance: number; name?: string }>;
}

const MARKER_DISTANCE_TOLERANCE_MATCH = 300; // meters

export const ElevationTooltip = ({
  active,
  payload,
  label,
  accent,
  primary,
  markers,
}: ElevationTooltipProps) => {
  const { tooltip } = useTheme();

  if (!active || !payload?.length) return null;

  const point = payload[0]?.payload;
  const marker = markers.find(
    (m) =>
      Math.abs((m?.distance ?? -1) - (point?.distance ?? 0)) <=
      MARKER_DISTANCE_TOLERANCE_MATCH
  );

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
      {marker?.name ? (
        <div style={{ color: accent, fontWeight: 600 }}>{marker.name}</div>
      ) : null}
    </div>
  );
};
