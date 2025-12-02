import { useId, useMemo } from "react";
import { useTheme } from "../../../theme-provider";
import { buildMarkerIcon } from "../../icons/buildMarkerIcon";
import { MapDot } from "./ElevationDot";

export const MarkerShape = (props: any) => {
  const { cx, cy, fill, name } = props;
  const theme = useTheme();
  const layout = theme.markerShape;
  const size = layout.size;

  const iconHref = useMemo(
    () => buildMarkerIcon(theme.marker.outer, theme.marker.inner),
    [theme.marker.inner, theme.marker.outer]
  );

  if (cx === undefined || cy === undefined) return null;

  const words =
    typeof name === "string"
      ? name
          .split(/\s+/)
          .map((w) => w.trim())
          .filter(Boolean)
      : [];
  return (
    <g>
      <MapDot cx={cx} cy={cy} />
      <image
        x={cx - size / 2}
        y={cy - size / 2 - layout.lift}
        width={size}
        height={size}
        href={iconHref}
      />
      {name ? <Text words={words} cx={cx} cy={cy} fill={fill} /> : null}
    </g>
  );
};

const Text = ({
  words,
  cx,
  cy,
  fill,
}: {
  words: string[];
  cx: number;
  cy: number;
  fill?: string;
}) => {
  const theme = useTheme();
  const text = theme.markerShape.text;

  return (
    <text
      y={cy - words.length * text.startLiftPerWord}
      fill={fill || "#fff"}
      fontSize={text.fontSize}
      fontWeight={text.fontWeight}
      letterSpacing={text.letterSpacing}
    >
      {words.map((word, index) => (
        <Word key={word} word={word} index={index} cx={cx} />
      ))}
    </text>
  );
};

const Word = ({
  word,
  index,
  cx,
}: {
  word: string;
  index: number;
  cx: number;
}) => {
  const theme = useTheme();
  const text = theme.markerShape.text;
  const id = useId();
  return (
    <tspan
      key={id}
      x={cx + text.xOffset}
      dy={index === 0 ? 0 : text.lineHeight}
    >
      {word}
    </tspan>
  );
};
