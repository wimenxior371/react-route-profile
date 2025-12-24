import surfaceAsphalt from "../../../assets/surface/surface_asphalt.png";
import surfaceCompacted from "../../../assets/surface/surface_compacted.png";
import surfaceConcrete from "../../../assets/surface/surface_concrete.png";
import surfaceNatural from "../../../assets/surface/surface_natural.png";
import surfacePenetrated from "../../../assets/surface/surface_penetrated.png";
import type { RouteConfig } from "../../../types";
import { SurfaceType } from "../../../types";

const SURFACE_STRIP_WIDTH = 30;
export const SURFACE_STRIP_HEIGHT = 22;

export const SURFACE_TEXTURES: Record<
  SurfaceType,
  { file: string; width?: number; height?: number }
> = {
  [SurfaceType.Asphalt]: {
    file: surfaceAsphalt,
  },
  [SurfaceType.Compacted]: {
    file: surfaceCompacted,
    width: 300,
  },
  [SurfaceType.Concrete]: {
    file: surfaceConcrete,
  },
  [SurfaceType.Natural]: {
    file: surfaceNatural,
  },
  [SurfaceType.Penetrated]: {
    file: surfacePenetrated,
  },
};

type SurfaceStripProps = {
  route: RouteConfig;
  maxDistance: number;
  height?: number;
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

export const SurfaceStrip = ({
  route,
  maxDistance,
  xAxisMap,
  offset,
}: SurfaceStripProps) => {
  const surfaces = route.surface ?? [];
  if (!surfaces.length) {
    return null;
  }

  const xAxis = xAxisMap ? Object.values(xAxisMap)[0] : undefined;
  const scale = xAxis?.scale;
  const chartLeft = xAxis?.x ?? offset?.left ?? 0;
  const chartWidth = xAxis?.width ?? offset?.width ?? 0;
  const axisY = xAxis?.y ?? (offset?.top ?? 0) + (offset?.height ?? 0);
  const height = SURFACE_STRIP_HEIGHT;
  const stripY = axisY - height;

  if (!scale || chartWidth <= 0) {
    return null;
  }

  return (
    <>
      <defs>
        {Object.entries(SURFACE_TEXTURES).map(
          ([surfaceType, { file, width, height }]) => (
            <pattern
              key={surfaceType}
              id={`surface-${surfaceType}`}
              patternUnits={
                surfaceType === SurfaceType.Compacted
                  ? undefined
                  : "userSpaceOnUse"
              }
              width={width ?? SURFACE_STRIP_WIDTH}
              height={height ?? SURFACE_STRIP_HEIGHT}
            >
              <image
                href={file}
                x="0"
                y="0"
                width={width ?? SURFACE_STRIP_WIDTH}
                height={height ?? SURFACE_STRIP_HEIGHT}
              />
            </pattern>
          )
        )}
      </defs>
      <g>
        <rect
          x={chartLeft}
          y={stripY}
          width={chartWidth}
          height={height}
          fill="none"
        />
        {surfaces.map((surface, index) => {
          const [rawStart, rawEnd] = surface.segment;
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
            <rect
              key={`${surface.type}-${index}`}
              x={x}
              y={stripY}
              width={width}
              height={height}
              fill={`url(#surface-${surface.type})`}
            />
          );
        })}
      </g>
    </>
  );
};
