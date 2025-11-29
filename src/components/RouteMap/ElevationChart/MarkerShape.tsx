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
      {name ? (
        <text
          y={cy - words.length * 10}
          fill={fill || "#fff"}
          fontSize={12}
          fontWeight={300}
          letterSpacing={2}
        >
          {words.map((word, idx) => (
            <tspan key={`${word}-${idx}`} x={cx + 15} dy={idx === 0 ? 0 : 12}>
              {word}
            </tspan>
          ))}
        </text>
      ) : null}
    </g>
  );
};
