import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "../../theme-provider";
import type { RouteConfig } from "../../types";

interface ElevationChartProps {
  route: RouteConfig;
}

export const ElevationChart = ({ route }: ElevationChartProps) => {
  const theme = useTheme();
  const points = useMemo(
    () => (route.geoJson as any)?.properties?.elevationProfile?.points || [],
    [route.geoJson]
  );
  const hasData = points.length > 1;

  if (!hasData) {
    return;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
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
          tickFormatter={(v) => `${Math.round(v / 1000)} km`}
          stroke="rgba(226, 232, 240, 0.7)"
        />
        <YAxis
          dataKey="elevation"
          tickFormatter={(v) => `${Math.round(v)} m`}
          stroke="rgba(226, 232, 240, 0.7)"
          width={60}
        />
        <Tooltip
          contentStyle={{ background: "rgba(15,23,42,0.9)", border: "none" }}
          labelStyle={{ color: "#e2e8f0" }}
          formatter={(value: any, name) => {
            if (name === "elevation") {
              return [`${Math.round(value as number)} m`, "Elevation"];
            }
            return value;
          }}
          labelFormatter={(label) =>
            `${Math.round((label as number) / 1000)} km`
          }
        />
        <Line
          type="monotone"
          dataKey="elevation"
          stroke={theme.colors.primary}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 3, fill: theme.colors.accent }}
          fill="url(#elevationGradient)"
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
