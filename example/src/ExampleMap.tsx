import { RouteMap } from "react-route-profile";
import type { PartialTheme } from "../../src/theme";
import styles from "./App.module.css";
import { route01 } from "./data/01-info";

interface ExampleMapProps {
  apiKey: string;
  mapHeight: string;
  theme: PartialTheme;
}

export const ExampleMap = ({ apiKey, mapHeight, theme }: ExampleMapProps) => {
  return (
    <section className={styles.mapSection}>
      <RouteMap apiKey={apiKey} route={route01} height={mapHeight} theme={theme} />
    </section>
  );
};
