import markerSvg from "./assets/icons/marker.svg";
import markerFinishSvg from "./assets/icons/markerFinish.svg";
import markerStartSvg from "./assets/icons/markerStart.svg";


export const DEFAULT_CENTER = { lat: 48.9325937, lng: 20.3452306 };
export const DEFAULT_ZOOM_HORIZONTAL = 13;
export const DEFAULT_ZOOM_VERTICAL = 12;

export const markers = {
  default: markerSvg,
  start: markerStartSvg,
  finish: markerFinishSvg,
}
