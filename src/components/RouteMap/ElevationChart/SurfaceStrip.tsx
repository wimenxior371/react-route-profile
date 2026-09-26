import { usePlotArea, useXAxisScale } from "recharts";
import surfaceAsphalt from "../../../assets/surface/surface_asphalt.png";
import surfaceCompacted from "../../../assets/surface/surface_compacted.png";
import surfaceConcrete from "../../../assets/surface/surface_concrete.png";
import surfaceNatural from "../../../assets/surface/surface_natural.png";
import surfacePenetrated from "../../../assets/surface/surface_penetrated.png";
import type { RouteConfig } from "../../../types";
import { SurfaceType } from "../../../types";

export const SURFACE_STRIP_HEIGHT = 16;

export const SURFACE_TEXTURES: Record<
  SurfaceType,
  {
    file: string;
    size: { width: number; height: number };
  }
> = {
  [SurfaceType.Asphalt]: {
    file: surfaceAsphalt,
    size: { width: 30, height: 22 },
  },
  [SurfaceType.Compacted]: {
    file: surfaceCompacted,
    size: { width: 375, height: 16 },
  },
  [SurfaceType.Concrete]: {
    file: surfaceConcrete,
    size: { width: 30, height: 22 },
  },
  [SurfaceType.Natural]: {
    file: surfaceNatural,
    size: { width: 30, height: 22 },
  },
  [SurfaceType.Penetrated]: {
    file: surfacePenetrated,
    size: { width: 30, height: 22 },
  },
};

type SurfaceStripProps = {
  route: RouteConfig;
  maxDistance: number;
  height?: number;
};

export const SurfaceStrip = ({
  route,
  maxDistance,
}: SurfaceStripProps) => {
  const plotArea = usePlotArea();
  const scale = useXAxisScale();
  const surfaces = route.surface ?? [];
  if (!surfaces.length) {
    return null;
  }

  if (!scale || !plotArea || plotArea.width <= 0) {
    return null;
  }

  const chartLeft = plotArea.x;
  const chartWidth = plotArea.width;
  const axisY = plotArea.y + plotArea.height;
  const height = SURFACE_STRIP_HEIGHT;
  const stripY = axisY - height;

  return (
    <>
      <defs>
        {Object.entries(SURFACE_TEXTURES).map(
          ([surfaceType, { file, size }]) => {
            const patternWidth = size.width;
            const patternHeight = SURFACE_STRIP_HEIGHT;
            const imageY = patternHeight - size.height;

            return (
              <pattern
                key={`pattern-${surfaceType}`}
                id={`surface-${surfaceType}`}
                patternUnits="userSpaceOnUse"
                patternContentUnits="userSpaceOnUse"
                width={patternWidth}
                height={patternHeight}
                y={stripY}
                overflow="hidden"
              >
                <image
                  href={file}
                  x="0"
                  y={imageY}
                  width={patternWidth}
                  height={size.height}
                />
              </pattern>
            );
          }
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
          if (startX == null || endX == null) return null;
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
