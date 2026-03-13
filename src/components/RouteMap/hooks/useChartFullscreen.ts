import { useEffect, useState } from "react";

export const useChartFullscreen = () => {
  const [isChartExpanded, setIsChartExpanded] = useState(false);

  useEffect(() => {
    if (!isChartExpanded) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsChartExpanded(false);
      }
    };
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isChartExpanded]);

  return {
    isChartExpanded,
    toggleChartExpanded: () => setIsChartExpanded((value) => !value),
  };
};
