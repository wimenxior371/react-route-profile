import { useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import { RouteMap, useMapHeader } from "react-route-profile";
import { Element, Link } from "react-scroll";
import type { PartialTheme } from "../../src/theme";
import styles from "./App.module.css";
import { route01 } from "./data/01-info";
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

  const { mapHeight, refHeader } = useMapHeader();

  return (
    <>
      <div className={styles.container}>
        <header ref={refHeader} className={styles.header}>
          <div>
            <h1 className={styles.title}>react-route-profile</h1>
            <h2 className={styles.subtitle}>
              A React component to alternate map + route profile, similar to
              Trailforks, Outdooractive, Komoot, or Bikemap.
            </h2>
            <div className={styles.actions}>
              <div className={styles.scrollDown}>
                <Link to="usage" smooth duration={1000}>
                  Scroll down for Usage
                </Link>
              </div>

              <div className={styles.themeSwitcher}>
                <label className={styles.themeLabel} htmlFor="theme-select">
                  Theme
                </label>
                <select
                  id="theme-select"
                  className={styles.themeSelect}
                  value={themeKey}
                  onChange={(e) =>
                    setThemeKey(e.target.value as keyof typeof themes)
                  }
                >
                  {Object.keys(themes).map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </header>

        <RouteMap
          apiKey={apiKey}
          route={route01}
          height={mapHeight}
          theme={theme}
        />
      </div>

      <Element name="usage">
        <Usage />
      </Element>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
