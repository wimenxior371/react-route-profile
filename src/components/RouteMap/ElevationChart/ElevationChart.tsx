import { useEffect, useMemo } from "react";
import {
  CartesianGrid,
  ComposedChart,
  Customized,
  Line,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "../../../theme-provider";
import type { RouteConfig } from "../../../types";
import { HoverStateChangeSource, useHover } from "../HoverContext";
import { DistanceTick } from "./DistanceTick";
import { ElevationDot } from "./ElevationDot";
import { ElevationTick } from "./ElevationTick";
import { ElevationTooltip } from "./ElevationTooltip";
import { MarkerShape } from "./MarkerShape";
import { SurfaceStrip } from "./SurfaceStrip";
import { useTriggerByXValue } from "./useTriggerByXValue";
import {
  computeMarkerPoints,
  computeMinMax,
  computeRoundedDomainAndTicks,
  findNearestPoint,
  getMaxDistance,
  getPointsWithElevation,
  getTicksForDistance,
  isCloseCheck,
} from "./utils";

interface ElevationChartProps {
  route: RouteConfig;
}

export const ElevationChart = ({ route }: ElevationChartProps) => {
  const { hover, setHover } = useHover();
  const theme = useTheme();
  const points = useMemo(() => getPointsWithElevation(route), [route]);
  const markers = useMemo(
    () => computeMarkerPoints(points, route.geoJson),
    [points, route.geoJson]
  );
  const maxDistance = getMaxDistance(points);
  const ticks = getTicksForDistance(maxDistance);
  const [min, max] = computeMinMax(points);
  const [minY, maxY, tickVals] = useMemo(
    () => computeRoundedDomainAndTicks([min, max], !!route.surface?.length),
    [min, max, route.surface?.length]
  );

  const { activeIndex, activePoint, triggerByXValue, clearActiveIndex } =
    useTriggerByXValue(points);

  useEffect(() => {
    if (
      hover.source === HoverStateChangeSource.Chart ||
      !hover.lat ||
      !hover.lng
    )
      return;
    const nearestPoint = findNearestPoint(points, [hover.lat, hover.lng]);
    if (nearestPoint) {
      triggerByXValue(nearestPoint.distance);
    }
  }, [hover, points, triggerByXValue]);

  if (!points.length) {
    return null;
  }

  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      style={{ userSelect: "none" }}
    >
      <ComposedChart
        data={points}
        margin={theme.chart.margin}
        onMouseMove={({ activePayload }) => {
          activeIndex && clearActiveIndex();
          const activePayloadItem = activePayload?.[0];
          if (!activePayloadItem) {
            return;
          }
          const { lat, lng } = activePayloadItem.payload;
          setHover({ lat, lng, source: HoverStateChangeSource.Chart });
        }}
        onMouseEnter={() => clearActiveIndex()}
      >
        <defs>
          <linearGradient id="elevationGradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor={theme.colors.primary}
              stopOpacity={theme.chart.gradientStartOpacity}
            />
            <stop
              offset="100%"
              stopColor={theme.colors.primaryMuted}
              stopOpacity={theme.chart.gradientEndOpacity}
            />
          </linearGradient>
        </defs>

        <CartesianGrid
          stroke={theme.chart.gridStroke}
          strokeDasharray={theme.chart.gridDasharray}
        />
        <Customized
          component={<SurfaceStrip route={route} maxDistance={maxDistance} />}
        />
        <XAxis
          dataKey="distance"
          type="number"
          domain={[0, maxDistance]}
          ticks={ticks}
          tick={<DistanceTick />}
          stroke={theme.chart.axisStroke}
        />
        <YAxis
          dataKey="elevation"
          tick={<ElevationTick />}
          domain={[minY, maxY]}
          ticks={tickVals}
          stroke={theme.chart.axisStroke}
          width={theme.chart.yAxisWidth}
        />

        <Tooltip
          cursor={{
            stroke: theme.chart.cursorStroke,
            strokeWidth: theme.chart.cursorStrokeWidth,
          }}
          content={
            <ElevationTooltip
              accent={theme.colors.accent}
              primary={theme.colors.primary}
              markers={markers}
              surfaces={route.surface}
            />
          }
        />

        <Line
          type="monotone"
          dataKey="elevation"
          stroke={theme.colors.primary}
          strokeWidth={theme.chart.lineStrokeWidth}
          dot={(props) => {
            const { cx, cy, index } = props;
            const isActive = index === activeIndex;
            if (!isActive || !activePoint) {
              // no dot for inactive points (or use small one if you prefer)
              return <></>;
            }
            return <ElevationDot cx={cx} cy={cy} />;
          }}
          activeDot={{
            r: theme.chart.activeDotRadius,
            fill: theme.dots.chartActive,
            strokeWidth: 0,
          }}
          fill="url(#elevationGradient)"
          isAnimationActive={false}
        />

        {markers.length > 0 &&
          markers.map((m, idx) => {
            const tooClose = isCloseCheck(markers[idx], markers[idx + 1]);
            return (
              <ReferenceDot
                key={`${m.distance}-${idx}`}
                x={m.distance}
                y={m.elevation}
                r={theme.chart.referenceDotRadius}
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

        {/* Vertical line at active X (same as hover cursor) */}
        {activePoint && (
          <ReferenceLine
            x={activePoint.distance}
            opacity={theme.chart.referenceLineOpacity}
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
};
