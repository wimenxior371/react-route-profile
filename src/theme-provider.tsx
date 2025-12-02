import { createContext, type ReactNode, useContext, useMemo } from "react";
import { theme as defaultTheme, PartialTheme, type Theme } from "./theme";

const ThemeContext = createContext<Theme>(defaultTheme);

const mergeTheme = (override?: PartialTheme): Theme => ({
  colors: {
    ...defaultTheme.colors,
    ...(override?.colors ?? {}),
  },
  marker: {
    ...defaultTheme.marker,
    ...(override?.marker ?? {}),
  },
  dots: {
    ...defaultTheme.dots,
    ...(override?.dots ?? {}),
  },
  map: {
    ...defaultTheme.map,
    ...(override?.map ?? {}),
  },
  chart: {
    ...defaultTheme.chart,
    ...(override?.chart ?? {}),
  },
  tooltip: {
    ...defaultTheme.tooltip,
    ...(override?.tooltip ?? {}),
  },
  markerShape: {
    ...defaultTheme.markerShape,
    ...(override?.markerShape ?? {}),
    text: {
      ...defaultTheme.markerShape.text,
      ...(override?.markerShape?.text ?? {}),
    },
  },
});

export const ThemeProvider = ({
  theme,
  children,
}: {
  theme?: PartialTheme;
  children: ReactNode;
}) => {
  const mergedTheme = useMemo(() => mergeTheme(theme), [theme]);
  return (
    <ThemeContext.Provider value={mergedTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
