import type { TooltipProps } from "recharts";

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
  if (!active || !payload?.length) return null;

  const point = payload[0]?.payload;
  const marker = markers.find(
    (m) =>
      Math.abs((m?.distance ?? -1) - (point?.distance ?? 0)) <=
      MARKER_DISTANCE_TOLERANCE_MATCH
  );

  return (
    <div
      style={{
        background: "rgba(15,23,42,0.9)",
        border: "none",
        color: "#e2e8f0",
        padding: "6px 8px",
        borderRadius: 6,
      }}
    >
      <div style={{ fontWeight: 600, color: primary }}>
        {Math.round((label as number) / 1000)} km
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
