import type { Ref } from "react";
import { Link } from "react-scroll";
import styles from "./App.module.css";

interface ExampleHeaderProps {
  refHeader: Ref<HTMLElement>;
  themeKey: string;
  themeKeys: string[];
  onThemeChange: (themeKey: string) => void;
}

export const ExampleHeader = ({
  refHeader,
  themeKey,
  themeKeys,
  onThemeChange,
}: ExampleHeaderProps) => {
  return (
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
              onChange={(e) => onThemeChange(e.target.value)}
            >
              {themeKeys.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
