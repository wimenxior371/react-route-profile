import { useTheme } from "../../../theme-provider";

export const ElevationTick = (props: any) => {
  const { x, y, payload } = props;
  const theme = useTheme();
  const m = Math.round(payload?.value ?? 0);
  return (
    <text
      x={x}
      y={y}
      fill={theme.chart.axisStroke}
      fontSize={theme.chart.yTickFontSize}
      textAnchor="end"
      dy={theme.chart.yTickDy}
    >
      <tspan>{m}</tspan>
      <tspan
        fontSize={theme.chart.yTickUnitFontSize}
        dx={theme.chart.yTickUnitDx}
      >
        m
      </tspan>
    </text>
  );
};
