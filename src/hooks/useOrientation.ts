import { useEffect, useState } from "react";

const getIsLandscape = () => {
  if (typeof window === "undefined") return true;
  return window.innerWidth >= window.innerHeight;
};

export const useOrientation = (pause = false) => {
  const [isHorizontal, setIsHorizontal] = useState<boolean>(getIsLandscape);

  useEffect(() => {
    if (pause) {
      return;
    }

    const handleResize = () => setIsHorizontal(getIsLandscape());

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [pause]);

  useEffect(() => {
    if (!pause) {
      setIsHorizontal(getIsLandscape());
    }
  }, [pause]);

  return { isHorizontal, isVertical: !isHorizontal };
};
