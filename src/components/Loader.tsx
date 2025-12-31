import type { CSSProperties } from "react";
import { useTheme } from "../theme-provider";
import styles from "./Loader.module.css";

interface LoaderProps {
  message?: string;
  height?: number | string;
}

const Loader = ({
  message = "Loading map...",
  height = "100dvh",
}: LoaderProps) => {
  const theme = useTheme();

  const style: CSSProperties = {
    height,
    background: theme.colors.surface,
    color: theme.colors.primary,
  };

  return (
    <div className={styles.rrpLoader} style={style}>
      {message}
    </div>
  );
};

export default Loader;
