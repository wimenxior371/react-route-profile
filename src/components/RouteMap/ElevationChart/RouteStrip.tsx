import { usePlotArea, useXAxisScale } from "recharts";
import type { RouteConfig } from "../../../types";

export const ROUTE_STRIP_HEIGHT = 16;

type RouteStripProps = {
  route: RouteConfig;
  maxDistance: number;
  belowHeight?: number;
};

export const RouteStrip = ({
  route,
  maxDistance,
  belowHeight = 0,
}: RouteStripProps) => {
  const plotArea = usePlotArea();
  const scale = useXAxisScale();
  const routes = route.routes ?? [];
  if (!routes.length) {
    return null;
  }

  if (!scale || !plotArea || plotArea.width <= 0) {
    return null;
  }

  const chartLeft = plotArea.x;
  const chartWidth = plotArea.width;
  const axisY = plotArea.y + plotArea.height;
  const height = ROUTE_STRIP_HEIGHT;
  const stripY = axisY - belowHeight - height;

  return (
    <g>
      <rect
        x={chartLeft}
        y={stripY}
        width={chartWidth}
        height={height}
        fill="none"
      />
      {routes.map((routeSegment, index) => {
        const [rawStart, rawEnd] = routeSegment.segment;
        const clampedStart = Math.max(0, Math.min(rawStart, maxDistance));
        const clampedEnd = Math.max(0, Math.min(rawEnd, maxDistance));
        const segStart = Math.min(clampedStart, clampedEnd);
        const segEnd = Math.max(clampedStart, clampedEnd);
        if (segEnd <= segStart) {
          return null;
        }

        const startX = scale(segStart);
        const endX = scale(segEnd);
        if (startX == null || endX == null) return null;
        const x = Math.min(startX, endX);
        const width = Math.max(0, Math.abs(endX - startX));
        if (width <= 0) {
          return null;
        }

        return (
          <g key={`${routeSegment.id}-${index}`}>
            <rect
              x={x}
              y={stripY}
              width={width}
              height={height}
              fill={routeSegment.color}
            />
            <text
              x={x + width / 2}
              y={stripY + height / 2}
              fill="#000000"
              fontSize={10}
              fontWeight={600}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {routeSegment.id}
            </text>
          </g>
        );
      })}
    </g>
  );
};
