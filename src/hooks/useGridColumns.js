import { useEffect, useState } from "react";

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
};

function useGridColumns({ breakpoint = "sm", minCol = 1, maxCol = 3 }) {
  const [cols, setCols] = useState(minCol);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const bp = BREAKPOINTS[breakpoint];

    const update = () => {
      const width = window.innerWidth;

      if (width <= bp) {
        setCols(minCol);
      } else {
        setCols(maxCol);
      }
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [breakpoint, minCol, maxCol]);

  return cols;
}

export default useGridColumns;
