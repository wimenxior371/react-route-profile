import { useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import { useMapHeader } from "react-route-profile";
import { Element } from "react-scroll";
import type { PartialTheme } from "../../src/theme";
import { ExampleHeader } from "./ExampleHeader";
import { ExampleMap } from "./ExampleMap";
import { Usage } from "./Usage";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

const themes: Record<string, PartialTheme> = {
  default: {
    colors: {
      primary: "rgba(14, 165, 233, 1)",
      primaryMuted: "rgba(14, 165, 233, 0.7)",
      accent: "rgba(132, 204, 22, 1)",
      surface: "rgba(248, 250, 252, 1)",
    },
  },
  neon: {
    colors: {
      primary: "rgba(59, 130, 246, 1)",
      primaryMuted: "rgba(59, 130, 246, 0.6)",
      accent: "rgba(252, 211, 77, 1)",
    },
    marker: {
      outer: "rgba(252, 211, 77, 1)",
    },
    dots: {
      mapActive: "rgba(239, 68, 68, 1)",
      chart: "rgba(239, 68, 68, 1)",
      chartActive: "rgba(239, 68, 68, 1)",
    },
  },
  magma: {
    colors: {
      primary: "rgba(239, 68, 68, 1)",
      primaryMuted: "rgba(239, 68, 68, 0.6)",
      accent: "rgba(239, 68, 68, 1)",
    },
    marker: {
      outer: "rgba(239, 68, 68, 0.6)",
    },
  },
};

function App() {
  const [themeKey, setThemeKey] = useState<keyof typeof themes>("default");
  const theme = useMemo(() => themes[themeKey], [themeKey]);

  const { isHeaderReady, mapHeight, refHeader } = useMapHeader();

  return (
    <>
      <ExampleHeader
        refHeader={refHeader}
        themeKey={themeKey}
        themeKeys={Object.keys(themes)}
        onThemeChange={(key) => setThemeKey(key as keyof typeof themes)}
      />

      {isHeaderReady ? (
        <ExampleMap apiKey={apiKey} mapHeight={mapHeight} theme={theme} />
      ) : null}

      <Element name="usage">
        <Usage />
      </Element>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
