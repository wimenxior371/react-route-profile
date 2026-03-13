import type { CSSProperties } from "react";
import type { PartialTheme } from "../../theme";
import type { RouteConfig } from "../../types";

export interface RouteMapProps {
  apiKey: string;
  route: RouteConfig;
  height?: number | string;
  className?: string;
  style?: CSSProperties;
  theme?: PartialTheme;
}
