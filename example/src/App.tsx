import ReactDOM from "react-dom/client";
import { RouteMap, useMapHeader } from "react-route-profile";
import styles from "./App.module.css";
import { route01 } from "./data/01-info";
import { Usage } from "./Usage";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

function App() {
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
          <h3 className={styles.scrollDown}>
            <a href=" ">Scroll down for Usage</a>
          </h3>
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
        <RouteMap apiKey={apiKey} route={route01} height={mapHeight} />
      </div>

      <Usage />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
