import { useEffect } from "react";
import { useState } from "react";

export const useScreen = () => {
  const getSize = () => {
    if (typeof window === "undefined") return "desktop";

    if (window.innerWidth < 768) return "mobile";
    if (window.innerWidth < 1024) return "tablet";
    return "desktop";
  };

  const [screen, setScreen] = useState(getSize);

  useEffect(() => {
    const handler = () => setScreen(getSize());
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return { screen, isMobile: screen === "mobile" };
};
