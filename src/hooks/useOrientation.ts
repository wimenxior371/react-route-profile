import { useEffect, useState } from "react";

const getIsLandscape = () => {
  if (typeof window === "undefined") return true;
  return window.innerWidth >= window.innerHeight;
};

export const useOrientation = () => {
  const [isHorizontal, setIsHorizontal] = useState<boolean>(getIsLandscape);

  useEffect(() => {
    const handleResize = () => setIsHorizontal(getIsLandscape());

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { isHorizontal, isVertical: !isHorizontal };
};
