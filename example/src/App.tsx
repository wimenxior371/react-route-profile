import { useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import { RouteMap, useMapHeader } from "react-route-profile";
import { Element, Link } from "react-scroll";
import { PartialTheme } from "../../src/theme";
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
  sunset: {
    colors: {
      primary: "rgba(244, 114, 182, 1)",
      primaryMuted: "rgba(244, 114, 182, 0.7)",
      accent: "rgba(249, 115, 22, 1)",
      surface: "rgba(255, 247, 237, 1)",
    },
  },
  forest: {
    colors: {
      primary: "rgba(52, 211, 153, 1)",
      primaryMuted: "rgba(52, 211, 153, 0.7)",
      accent: "rgba(74, 222, 128, 1)",
      surface: "rgba(240, 253, 244, 1)",
    },
  },
};

function App() {
  const [themeKey, setThemeKey] = useState<keyof typeof themes>("default");
  const theme = useMemo(() => themes[themeKey], [themeKey]);

  const {
    targetHeaderFraction,
    effectiveHeaderHeight,
    mapHeight,
    refHeader,
    refMapContainer,
  } = useMapHeader();

  return (
    <div className={styles.container}>
      <header
        ref={refHeader}
        style={{
          position: "sticky",
          top: 0,
          height: `${targetHeaderFraction * 100}vh`,
        }}
        className={styles.header}
      >
        <div>
          <h1 className={styles.title}>react-route-profile</h1>
          <h2 className={styles.subtitle}>
            A React component to alternate map + route profile, similar to
            Trailforks, Outdooractive, Komoot, or Bikemap.
          </h2>
          <div className={styles.actions}>
            <h3 className={styles.scrollDown}>
              <Link to="usage" smooth duration={1000}>
                Scroll down for Usage
              </Link>
            </h3>
            <div className={styles.themeSwitcher}>
              {Object.keys(themes).map((key) => (
                <button
                  type="button"
                  key={key}
                  className={`${styles.themeButton} ${
                    key === themeKey ? styles.themeButtonActive : ""
                  }`}
                  style={{
                    background:
                      key === themeKey
                        ? themes[key].colors?.primary
                        : themes[key].colors?.primaryMuted,
                    borderColor: themes[key].colors?.primary,
                  }}
                  onClick={() => setThemeKey(key as keyof typeof themes)}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div
        ref={refMapContainer}
        style={{
          flex: "0 0 auto",
          height: `calc(100vh - ${effectiveHeaderHeight}px)`,
          maxHeight: `calc(100vh - ${effectiveHeaderHeight}px)`,
          overflow: "hidden",
        }}
        className={styles.mapWrapper}
      >
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
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
