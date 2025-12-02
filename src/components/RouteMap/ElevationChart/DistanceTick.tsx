import { useTheme } from "../../../theme-provider";

export const DistanceTick = (props: any) => {
  const { x, y, payload } = props;
  const theme = useTheme();
  const km = Math.round((payload?.value ?? 0) / 1000);
  return (
    <text
      x={x}
      y={y}
      fill={theme.chart.axisStroke}
      fontSize={theme.chart.xTickFontSize}
      textAnchor="middle"
      dy={theme.chart.xTickDy}
    >
      <tspan>{km}</tspan>
      <tspan
        fontSize={theme.chart.xTickUnitFontSize}
        dx={theme.chart.xTickUnitDx}
      >
        km
      </tspan>
    </text>
  );
};
