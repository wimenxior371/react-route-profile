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
import { ElevationTooltip } from "./ElevationTooltip";
import { MarkerShape } from "./MarkerShape";
import {
  computeMarkerPoints,
  computeMinMax,
  computeRoundedDomainAndTicks,
  getMaxDistance,
  getPoints,
} from "./utils";

interface ElevationChartProps {
  route: RouteConfig;
}

export const ElevationChart = ({ route }: ElevationChartProps) => {
  const theme = useTheme();
  const points = useMemo(() => getPoints(route), [route]);
  const markers = useMemo(
    () => computeMarkerPoints(points, route.geoJson),
    [points, route.geoJson]
  );
  const maxDistance = getMaxDistance(points);
  const [min, max] = computeMinMax(points);
  const [minY, maxY, tickVals] = useMemo(
    () => computeRoundedDomainAndTicks([min, max]),
    [min, max]
  );

  if (!points.length) {
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
          tickCount={20}
          stroke="rgba(226, 232, 240, 0.7)"
        />
        <YAxis
          dataKey="elevation"
          tick={<ElevationTick />}
          domain={[minY, maxY]}
          ticks={tickVals}
          stroke="rgba(226, 232, 240, 0.7)"
          width={60}
        />
        <Tooltip
          cursor={{ stroke: "rgba(226,232,240,0.4)", strokeWidth: 1 }}
          content={
            <ElevationTooltip
              accent={theme.colors.accent}
              primary={theme.colors.primary}
              markers={markers}
            />
          }
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
          markers.map((m, idx) => {
            const next = markers[idx + 1];
            const nextDistance =
              next && Math.abs((next.distance ?? 0) - (m.distance ?? 0));

            const tooClose = nextDistance < 1000;
            return (
              <ReferenceDot
                key={`${m.distance}-${idx}`}
                x={m.distance}
                y={m.elevation}
                r={7}
                shape={(props) => (
                  <MarkerShape
                    {...props}
                    name={tooClose ? undefined : m.name}
                    fill={theme.colors.accent}
                  />
                )}
              />
            );
          })}
      </ComposedChart>
    </ResponsiveContainer>
  );
};
