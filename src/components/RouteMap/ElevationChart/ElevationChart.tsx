import { useMemo } from "react";
import {
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "../../../theme-provider";
import type { RouteConfig } from "../../../types";
import { DistanceTick } from "./DistanceTick";
import { ElevationTick } from "./ElevationTick";
import { MarkerShape } from "./MarkerShape";
import {
  computeMarkerPoints,
  computeMinMax,
  computeRoundedDomainAndTicks,
} from "./utils";

interface ElevationChartProps {
  route: RouteConfig;
}

export const ElevationChart = ({ route }: ElevationChartProps) => {
  const theme = useTheme();
  const points = useMemo(() => {
    const raw =
      (route.geoJson as any)?.properties?.elevationProfile?.points || [];
    return [...raw].sort(
      (a: any, b: any) => (a?.distance ?? 0) - (b?.distance ?? 0)
    );
  }, [route.geoJson]);
  const markers = useMemo(
    () => computeMarkerPoints(points, route.geoJson),
    [points, route.geoJson]
  );
  const maxDistance = points.length ? points[points.length - 1].distance : 0;
  const hasData = points.length > 1;

  const [min, max] = computeMinMax(points);
  const [minY, maxY, tickVals] = useMemo(
    () => computeRoundedDomainAndTicks([min, max]),
    [min, max]
  );

  if (!hasData) {
    return null;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={points}
        margin={{ top: 4, right: 8, bottom: 4, left: 8 }}
      >
        <defs>
          <linearGradient id="elevationGradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor={theme.colors.primary}
              stopOpacity={0.6}
            />
            <stop
              offset="100%"
              stopColor={theme.colors.primaryMuted}
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
        <XAxis
          dataKey="distance"
          type="number"
          domain={[0, maxDistance]}
          tick={<DistanceTick />}
          stroke="rgba(226, 232, 240, 0.7)"
        />
        <YAxis
          dataKey="elevation"
          tick={<ElevationTick />}
          domain={[minY, maxY] as any}
          ticks={tickVals as any}
          stroke="rgba(226, 232, 240, 0.7)"
          width={60}
        />
        <Tooltip
          contentStyle={{ background: "rgba(15,23,42,0.9)", border: "none" }}
          labelStyle={{ color: "#e2e8f0" }}
          cursor={{ stroke: "rgba(226,232,240,0.4)", strokeWidth: 1 }}
          formatter={(value: any, name, props) => {
            if (name === "elevation") {
              const markerName = (props?.payload as any)?.name;

              return [
                `${Math.round(value as number)} m${
                  markerName ? ` • ${markerName}` : ""
                }`,
                "Elevation",
              ];
            }
            return value;
          }}
          labelFormatter={(label) =>
            `${Math.round((label as number) / 1000)} km`
          }
          itemStyle={{ color: theme.colors.accent }}
        />
        <Line
          type="monotone"
          dataKey="elevation"
          stroke={theme.colors.primary}
          strokeWidth={1}
          dot={false}
          activeDot={{ r: 3, fill: theme.colors.accent, strokeWidth: 0 }}
          fill="url(#elevationGradient)"
          isAnimationActive={false}
        />
        {markers.length > 0 &&
          markers.map((m, idx) => (
            <ReferenceDot
              key={`${m.distance}-${idx}`}
              x={m.distance}
              y={m.elevation}
              r={7}
              shape={(props) => (
                <MarkerShape
                  {...props}
                  name={m.name}
                  fill={theme.colors.accent}
                />
              )}
            />
          ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
};
