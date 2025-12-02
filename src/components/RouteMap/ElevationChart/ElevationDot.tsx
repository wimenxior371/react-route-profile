import { useTheme } from "../../../theme-provider";

const Dot = (props: any) => {
  const { cx, cy, fill } = props;
  const theme = useTheme();
  if (cx === undefined || cy === undefined) return null;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={theme.chart.dotRadius}
      fill={fill}
      opacity={theme.chart.dotOpacity}
    />
  );
};

export const ElevationDot = (props: any) => {
  const theme = useTheme();
  return <Dot {...props} fill={theme.dots.chart} />;
};

export const MapDot = (props: any) => {
  const theme = useTheme();
  return <Dot {...props} fill={theme.dots.mapActive} />;
};
