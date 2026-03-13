import type { CSSProperties } from "react";
import { useI18n } from "../i18n";
import { useTheme } from "../theme-provider";
import styles from "./Loader.module.css";

interface LoaderProps {
  message?: string;
  height?: number | string;
}

const Loader = ({
  message,
  height = "100dvh",
}: LoaderProps) => {
  const theme = useTheme();
  const { loader } = useI18n();

  const style: CSSProperties = {
    height,
    background: theme.colors.surface,
    color: theme.colors.primary,
  };

  return (
    <div className={styles.rrpLoader} style={style}>
      {message ?? loader.loadingMap}
    </div>
  );
};

export default Loader;
