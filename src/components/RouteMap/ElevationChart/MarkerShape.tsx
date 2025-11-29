import { useId } from "react";
import { markers } from "../../../constants";

export const MarkerShape = (props: any) => {
  const { cx, cy, fill, name } = props;
  const size = 33;
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
      <circle cx={cx} cy={cy} r={3} fill={fill} opacity={0.9} />
      <image
        x={cx - size / 2}
        y={cy - size / 2 - 20}
        width={size}
        height={size}
        href={markers.default}
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
  return (
    <text
      y={cy - words.length * 10}
      fill={fill || "#fff"}
      fontSize={12}
      fontWeight={300}
      letterSpacing={2}
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
  const id = useId();
  return (
    <tspan key={id} x={cx + 15} dy={index === 0 ? 0 : 12}>
      {word}
    </tspan>
  );
};
