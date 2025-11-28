export const theme = {
  colors: {
    primary: "#0EA5E9",
    primaryMuted: "rgba(14, 165, 233, 0.7)",
    accent: "#84CC16",
    surface: "#f8fafc",
  },
  shadows: {
    map: "0 10px 30px rgba(15, 23, 42, 0.16)",
  },
} as const;

export type Theme = typeof theme;
