import { useEffect, useState } from "react";

const getViewport = () => ({
  width: typeof window === "undefined" ? 1440 : window.innerWidth,
  height: typeof window === "undefined" ? 900 : window.innerHeight,
});

export const useViewport = (pause = false) => {
  const [viewport, setViewport] = useState(getViewport);

  useEffect(() => {
    if (pause) {
      return;
    }

    const handleResize = () => setViewport(getViewport());

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [pause]);

  useEffect(() => {
    if (!pause) {
      setViewport(getViewport());
    }
  }, [pause]);

  return viewport;
};
