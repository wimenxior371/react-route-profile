import { createContext, type ReactNode, useContext, useMemo } from "react";
import { theme as defaultTheme, PartialTheme, type Theme } from "./theme";

const ThemeContext = createContext<Theme>(defaultTheme);

const mergeTheme = (override?: PartialTheme): Theme => ({
  colors: {
    ...defaultTheme.colors,
    ...(override?.colors ?? {}),
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
