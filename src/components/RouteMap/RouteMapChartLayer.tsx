import {
  MdFullscreen,
  MdFullscreenExit,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdPanToolAlt,
} from "react-icons/md";
import { useI18n } from "../../i18n";
import type { RouteConfig } from "../../types";
import { ElevationChart } from "./ElevationChart";
import styles from "./RouteMap.module.css";

type RouteMapChartLayerProps = {
  route: RouteConfig;
  isChartExpanded: boolean;
  isScrollableChartExpanded: boolean;
  onToggleChartExpanded: () => void;
};

export const RouteMapChartLayer = ({
  route,
  isChartExpanded,
  isScrollableChartExpanded,
  onToggleChartExpanded,
}: RouteMapChartLayerProps) => {
  const { routeMap } = useI18n();

  return (
    <div
      className={[
        styles.rrpChartLayer,
        isChartExpanded ? styles.rrpChartLayerExpanded : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.rrpToolbar}>
        <div className={styles.rrpToolbarSide} />
        {isScrollableChartExpanded ? (
          <div className={styles.rrpScrollHint} aria-hidden="true">
            <MdKeyboardDoubleArrowLeft className={styles.rrpScrollHintIcon} />
            <MdPanToolAlt className={styles.rrpScrollHintHand} />
            <span className={styles.rrpScrollHintText}>{routeMap.scrollToExplore}</span>
            <MdKeyboardDoubleArrowRight className={styles.rrpScrollHintIcon} />
          </div>
        ) : (
          <div className={styles.rrpToolbarCenter} />
        )}
        <button
          type="button"
          className={styles.rrpIconButton}
          onClick={onToggleChartExpanded}
          title={
            isChartExpanded
              ? routeMap.minimizeRouteProfile
              : routeMap.expandRouteProfile
          }
        >
          {isChartExpanded ? (
            <MdFullscreenExit className={styles.rrpIcon} />
          ) : (
            <MdFullscreen className={styles.rrpIcon} />
          )}
        </button>
      </div>
      <div
        className={[
          styles.rrpChartBody,
          isScrollableChartExpanded ? styles.rrpChartBodyScrollable : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {isScrollableChartExpanded ? (
          <div className={styles.rrpChartScrollViewport}>
            <div className={styles.rrpChartScrollContent}>
              <div className={styles.rrpChartCanvas}>
                <ElevationChart route={route} />
              </div>
            </div>
          </div>
        ) : (
          <ElevationChart route={route} />
        )}
      </div>
    </div>
  );
};
