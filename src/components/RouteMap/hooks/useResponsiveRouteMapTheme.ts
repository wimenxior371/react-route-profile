import { useMemo } from "react";
import { theme as defaultTheme, type PartialTheme } from "../../../theme";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const getLabelScale = ({
  isHorizontal,
  width,
  height,
}: {
  isHorizontal: boolean;
  width: number;
  height: number;
}) => {
  const widthScale = clamp((width - 360) / (1440 - 360), 0, 1);
  const heightScale = clamp((height - 540) / (900 - 540), 0, 1);
  const responsiveScale = 0.68 + widthScale * 0.22 + heightScale * 0.1;
  const orientationScale = isHorizontal ? 1 : 0.88;
  return Math.min(1, clamp(responsiveScale * orientationScale, 0.62, 1));
};

export const useResponsiveRouteMapTheme = ({
  isHorizontal,
  theme,
  width,
  height,
}: {
  isHorizontal: boolean;
  theme: PartialTheme;
  width: number;
  height: number;
}) =>
  useMemo(() => {
    const labelScale = getLabelScale({
      isHorizontal,
      width,
      height,
    });
    const mapTheme = {
      ...defaultTheme.map,
      ...(theme.map ?? {}),
    };
    const chartTheme = {
      ...defaultTheme.chart,
      ...(theme.chart ?? {}),
    };
    const markerShapeTheme = {
      ...defaultTheme.markerShape,
      ...(theme.markerShape ?? {}),
      text: {
        ...defaultTheme.markerShape.text,
        ...(theme.markerShape?.text ?? {}),
      },
    };

    return {
      ...theme,
      map: {
        ...mapTheme,
        markerLabelFontSize: Math.max(
          12,
          Math.round(mapTheme.markerLabelFontSize * labelScale)
        ),
        markerLabelFontWeight:
          isHorizontal && width >= 768 ? mapTheme.markerLabelFontWeight : "400",
      },
      chart: {
        ...chartTheme,
        xTickFontSize: Math.max(10, Math.round(chartTheme.xTickFontSize * labelScale)),
        xTickUnitFontSize: Math.max(
          9,
          Math.round(chartTheme.xTickUnitFontSize * labelScale)
        ),
        yTickFontSize: Math.max(10, Math.round(chartTheme.yTickFontSize * labelScale)),
        yTickUnitFontSize: Math.max(
          9,
          Math.round(chartTheme.yTickUnitFontSize * labelScale)
        ),
        yAxisWidth: Math.max(48, Math.round(chartTheme.yAxisWidth * labelScale)),
      },
      markerShape: {
        ...markerShapeTheme,
        text: {
          ...markerShapeTheme.text,
          fontSize: Math.max(
            10,
            Math.round(markerShapeTheme.text.fontSize * labelScale)
          ),
          lineHeight: Math.max(
            10,
            Math.round(markerShapeTheme.text.lineHeight * labelScale)
          ),
          xOffset: Math.max(
            12,
            Math.round(markerShapeTheme.text.xOffset * labelScale)
          ),
          startLiftPerWord: Math.max(
            8,
            Math.round(markerShapeTheme.text.startLiftPerWord * labelScale)
          ),
        },
      },
    };
  }, [height, isHorizontal, theme, width]);
