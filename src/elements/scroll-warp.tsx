// ref. https://twitter.com/austin_malerba/status/1539985492652990464
// and https://twitter.com/austin_malerba/status/1598051841111371776

import { useRef } from "react";
import { a, useSpring, to, SpringValue } from "@react-spring/web";
import { useId } from "react";

const springConfig = {
  mass: 0.5,
  damping: 40,
  stiffness: 250,
};

interface ScrollWarpProps extends React.HTMLProps<HTMLDivElement> {
  direction?: "x" | "y";
  velocity: SpringValue;
}

export const ScrollWarp = ({
  children,
  direction = "y",
  velocity,
  ...otherProps
}: ScrollWarpProps) => {
  const id = useId();

  /*
    We need to remember what the last scroll direction is. Otherwise we would
    see a jitter on the end of animation of +v → 0. This would happen because we
    are suddenly changing the `transformOrigin` at 0 and not waiting for the
    scale animation to finish. 
  */
  const lastScrollDirection = useRef(1);
  const transformOrigin = velocity.to((v) => {
    if (v !== 0) {
      lastScrollDirection.current = v > 0 ? 1 : -1;
    } else {
      v = lastScrollDirection.current;
    }

    if (direction === "y") {
      return v > 0 ? "bottom center" : "top center";
    } else {
      return v > 0 ? "center right" : "center left";
    }
  });

  const spring = useSpring({
    scale: velocity.to((v) => 1 + Math.abs(v) / 40),
    topCurve: velocity.to((v) => -v / 20),
    bottomCurve: velocity.to((v) => 1 - v / 20),
    config: springConfig,
  });

  const dy = to(
    [spring.topCurve, spring.bottomCurve],
    (topCurve, bottomCurve) => `M 0 0 Q 0.5 ${topCurve} 1 0 L 1 1 Q 0.5 ${bottomCurve} 0 1 L 0 1`
  );
  const dx = to(
    [spring.topCurve, spring.bottomCurve],
    (topCurve, bottomCurve) => `M 0 0 L 1 0 Q ${bottomCurve} 0.5 1 1 L 0 1 Q ${topCurve} 0.5 0 0`
  );

  return (
    <div
      {...otherProps}
      style={{
        ...otherProps.style,
        clipPath: `url(#${id})`,
        willChange: "contents",
      }}
    >
      <svg width="0" height="0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id={id} clipPathUnits="objectBoundingBox">
            <a.path d={direction === "y" ? dy : dx}></a.path>
          </clipPath>
        </defs>
      </svg>
      <a.div
        style={{
          width: "100%",
          height: "100%",
          scale: spring.scale,
          transformOrigin,
        }}
      >
        {children}
      </a.div>
    </div>
  );
};
