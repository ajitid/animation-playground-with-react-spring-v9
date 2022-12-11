import { useState, useLayoutEffect, useRef, useEffect } from "react";
import { useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import useMeasure from "react-use-measure";

import { project } from "./project";
import { DecelerationRate } from "./deceleration-rate";

export type Position = { x: "left" | "right"; y: "top" | "bottom" };

/**
 * NOT READY YET - see bottom for todos
 */
export const useFlickInBounds = (initialPosition: Position = { x: "right", y: "bottom" }) => {
  const [isGrabbing, setIsGrabbing] = useState(false);

  const [elRef, elBounds] = useMeasure();
  const [containerRef, containerBounds] = useMeasure();

  const [position, setPosition] = useState<Position>(initialPosition);

  const bounds = {
    left: 0,
    right: containerBounds.width - elBounds.width < 0 ? 0 : containerBounds.width - elBounds.width,
    top: 0,
    bottom:
      containerBounds.height - elBounds.height < 0 ? 0 : containerBounds.height - elBounds.height,
  };

  const [{ x, y }, set] = useSpring(() => ({
    x: 0,
    y: 0,
    config: {
      frequency: 0.5,
      damping: 0.8,
    },
  }));

  useEffect(() => {
    set({
      x: position.x === "right" ? bounds.right : 0,
      y: position.y === "bottom" ? bounds.bottom : 0,
    });
  }, [bounds.bottom, bounds.right, position, set]);

  const [, setForceRerender] = useState({});
  const hasRanOnceRef = useRef(false);
  useLayoutEffect(() => {
    const { right, bottom } = bounds;

    if (right === 0 && bottom === 0) return;
    if (hasRanOnceRef.current) return;

    hasRanOnceRef.current = true;
    const x = initialPosition.x === "right" ? bounds.right : 0;
    const y = initialPosition.y === "bottom" ? bounds.bottom : 0;
    set({
      from: { x, y },
      x,
      y,
    });
    setForceRerender({});
  }, [bounds, initialPosition.x, initialPosition.y, set]);

  const bindDrag = useDrag(
    ({ movement: [mx, my], first, down, last, velocity: [vx, vy] }) => {
      if (first) {
        setIsGrabbing(true);
      }

      if (down) {
        set({ x: mx, y: my });
      }

      if (last) {
        setIsGrabbing(false);

        const x =
          mx + project(vx, DecelerationRate.Normal) > ((bounds.right ?? 0) - (bounds.left ?? 0)) / 2
            ? "right"
            : "left";

        const y =
          my + project(vy, DecelerationRate.Normal) > ((bounds.bottom ?? 0) - (bounds.top ?? 0)) / 2
            ? "bottom"
            : "top";

        setPosition({ x, y });
      }
    },
    {
      from: () => [x.get(), 0],
      filterTaps: true,
      bounds,
      // TODO we have https://use-gesture.netlify.app/docs/utilities/#rubberbandifoutofbounds
      // check how we can use either above or below
      // rubberband: true
      // also, here's mention about down, read it https://github.com/pmndrs/use-gesture/issues/249
      // TODO this was using vxvy in usedrag callback, not velocity earlier, see what could've changed
      // TODO we are using hasRanOnceRef here. Check how it works with react 18
    }
  );

  return { bindDrag, pos: { x, y }, refs: { elRef, containerRef }, position, isGrabbing };
};
