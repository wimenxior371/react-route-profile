import { type RefObject, useEffect, useState } from "react";

const isRootInFullscreen = (
  root: HTMLElement | null,
  fullscreenElement: Element | null
) => {
  if (!root || !fullscreenElement) {
    return false;
  }

  return root === fullscreenElement || root.contains(fullscreenElement);
};

export const useRouteMapFullscreen = (rootRef: RefObject<HTMLElement | null>) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const updateFullscreen = () => {
      setIsFullscreen(
        isRootInFullscreen(rootRef.current, document.fullscreenElement)
      );
    };

    updateFullscreen();
    document.addEventListener("fullscreenchange", updateFullscreen);

    return () => {
      document.removeEventListener("fullscreenchange", updateFullscreen);
    };
  }, [rootRef]);

  return isFullscreen;
};
