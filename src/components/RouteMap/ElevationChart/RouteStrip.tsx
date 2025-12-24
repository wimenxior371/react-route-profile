import type { RouteConfig } from "../../../types";

export const ROUTE_STRIP_HEIGHT = 16;

type RouteStripProps = {
  route: RouteConfig;
  maxDistance: number;
  belowHeight?: number;
  xAxisMap?: Record<
    string,
    {
      scale?: (value: number) => number;
      x?: number;
      y?: number;
      width?: number;
    }
  >;
  offset?: { left?: number; top?: number; width?: number; height?: number };
};

export const RouteStrip = ({
  route,
  maxDistance,
  belowHeight = 0,
  xAxisMap,
  offset,
}: RouteStripProps) => {
  const routes = route.routes ?? [];
  if (!routes.length) {
    return null;
  }

  const xAxis = xAxisMap ? Object.values(xAxisMap)[0] : undefined;
  const scale = xAxis?.scale;
  const chartLeft = xAxis?.x ?? offset?.left ?? 0;
  const chartWidth = xAxis?.width ?? offset?.width ?? 0;
  const axisY = xAxis?.y ?? (offset?.top ?? 0) + (offset?.height ?? 0);
  const height = ROUTE_STRIP_HEIGHT;
  const stripY = axisY - belowHeight - height;

  if (!scale || chartWidth <= 0) {
    return null;
  }

  return (
    <g>
      <rect x={chartLeft} y={stripY} width={chartWidth} height={height} />
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
