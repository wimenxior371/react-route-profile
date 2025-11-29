export interface Theme {
  colors: ThemeColors
}

export interface ThemeColors {
  primary: string;
  primaryMuted: string;
  accent: string;
  surface: string;
}

export interface ThemeShadows {
  map: string;
}

export const theme: Theme = {
  colors: {
    primary: "rgba(14, 165, 233, 1)",
    primaryMuted: "rgba(14, 165, 233, 0.7)",
    accent: "rgba(132, 204, 22, 1)",
    surface: "rgba(248, 250, 252, 1)",
  },
};

export interface PartialTheme {
  colors: Partial<ThemeColors>
}