import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = ({ shouldScroll = null }) => {
  const { pathname } = useLocation();
  const scroll = shouldScroll ? shouldScroll : pathname;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [scroll]);

  return null;
};

export default ScrollToTop;
