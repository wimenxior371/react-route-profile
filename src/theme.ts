export interface ThemeColors {
  primary: string;
  primaryMuted: string;
  accent: string;
  surface: string;
}

export interface ThemeMarker {
  outer: string;
  inner: string;
  startInner: string;
  finishInner: string;
}

export interface ThemeDots {
  mapActive: string;
  chart: string;
  chartActive: string;
}

export interface ThemeMap {
  strokeWeight: number;
  markerSize: number;
  markerLabelFontSize: number;
  markerLabelFontWeight: string;
  hoverMarkerScale: number;
}

export interface ThemeChart {
  margin: { top: number; right: number; bottom: number; left: number };
  gridStroke: string;
  gridDasharray: string;
  axisStroke: string;
  cursorStroke: string;
  cursorStrokeWidth: number;
  yAxisWidth: number;
  lineStrokeWidth: number;
  dotRadius: number;
  dotOpacity: number;
  activeDotRadius: number;
  referenceDotRadius: number;
  referenceLineOpacity: number;
  gradientStartOpacity: number;
  gradientEndOpacity: number;
  xTickFontSize: number;
  xTickDy: number;
  xTickUnitFontSize: number;
  xTickUnitDx: number;
  yTickFontSize: number;
  yTickDy: number;
  yTickUnitFontSize: number;
  yTickUnitDx: number;
}

export interface ThemeTooltip {
  background: string;
  textColor: string;
  padding: string;
  borderRadius: number;
}

export interface ThemeMarkerShape {
  size: number;
  lift: number;
  text: {
    fontSize: number;
    fontWeight: number;
    letterSpacing: number;
    xOffset: number;
    lineHeight: number;
    startLiftPerWord: number;
  };
}

export interface ThemeShadows {
  map: string;
}

export interface Theme {
  colors: ThemeColors;
  marker: ThemeMarker;
  dots: ThemeDots;
  map: ThemeMap;
  chart: ThemeChart;
  tooltip: ThemeTooltip;
  markerShape: ThemeMarkerShape & {
    text: ThemeMarkerShape["text"];
  };
}

export interface PartialTheme {
  colors?: Partial<ThemeColors>;
  marker?: Partial<ThemeMarker>;
  dots?: Partial<ThemeDots>;
  map?: Partial<ThemeMap>;
  chart?: Partial<ThemeChart>;
  tooltip?: Partial<ThemeTooltip>;
  markerShape?: Partial<ThemeMarkerShape> & {
    text?: Partial<ThemeMarkerShape["text"]>;
  };
}

export const theme: Theme = {
  colors: {
    primary: "rgba(14, 165, 233, 1)",
    primaryMuted: "rgba(14, 165, 233, 0.7)",
    accent: "rgba(132, 204, 22, 1)",
    surface: "rgba(248, 250, 252, 1)",
  },
  marker: {
    outer: "rgba(132, 204, 22, 1)",
    inner: "rgba(248, 250, 252, 1)",
    startInner: "rgba(34, 197, 94, 1)",
    finishInner: "rgba(239, 68, 68, 1)",
  },
  dots: {
    mapActive: "rgba(132, 204, 22, 1)",
    chart: "rgba(132, 204, 22, 1)",
    chartActive: "rgba(132, 204, 22, 1)",
  },
  map: {
    strokeWeight: 10,
    markerSize: 50,
    markerLabelFontSize: 20,
    markerLabelFontWeight: "bold",
    hoverMarkerScale: 6,
  },
  chart: {
    margin: { top: 4, right: 8, bottom: 4, left: 8 },
    gridStroke: "rgba(255,255,255,0.08)",
    gridDasharray: "3 3",
    axisStroke: "rgba(226, 232, 240, 0.7)",
    cursorStroke: "rgba(226,232,240,0.4)",
    cursorStrokeWidth: 1,
    yAxisWidth: 60,
    lineStrokeWidth: 1,
    dotRadius: 3,
    dotOpacity: 0.9,
    activeDotRadius: 3,
    referenceDotRadius: 7,
    referenceLineOpacity: 0.5,
    gradientStartOpacity: 0.6,
    gradientEndOpacity: 0.1,
    xTickFontSize: 12,
    xTickDy: 12,
    xTickUnitFontSize: 10,
    xTickUnitDx: 2,
    yTickFontSize: 12,
    yTickDy: 4,
    yTickUnitFontSize: 10,
    yTickUnitDx: 2,
  },
  tooltip: {
    background: "rgba(15,23,42,0.9)",
    textColor: "#e2e8f0",
    padding: "6px 8px",
    borderRadius: 6,
  },
  markerShape: {
    size: 33,
    lift: 20,
    text: {
      fontSize: 12,
      fontWeight: 300,
      letterSpacing: 2,
      xOffset: 15,
      lineHeight: 12,
      startLiftPerWord: 10,
    },
  },
};
