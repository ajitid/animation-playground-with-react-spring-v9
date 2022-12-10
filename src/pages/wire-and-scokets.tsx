// inspiration: https://twitter.com/GK3/status/1545071311029805057
// replicated:
// - https://twitter.com/ralex1993/status/1545192456920059904
// - https://twitter.com/aashudubey_ad/status/1571250425772544000 | permalink: https://github.com/Aashu-Dubey/react-native-animation-samples/blob/7ed8c6f76526317b029feb7d848070321368d0e3/src/samples/rope_physics/RopeViewSvg.tsx#L93
import { forwardRef, useRef, useEffect, useState } from "react";
import { FC, WC } from "@/shared/types";
import { distance } from "@/uff/distance";
import { FaceSmileIcon } from "@heroicons/react/24/outline";
import useMeasure from "react-use-measure";
import { a, config, SpringConfig } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import cn from "clsx";

import { DefaultLayout } from "@/default-layout";
import { useSpring } from "@react-spring/web";
import { Point2D } from "@/uff/types";
import { clamp2D } from "@/uff/clamp2d";

const SOCKET_WIDTH = 32;
const socketDimensionClassName = `w-[32px] h-[32px]`;

const ALLOWED_BOUND_Y = 15;
const ALLOWED_BOUND_X = 20;

const debug = false;

const ropeSpringConfig = {
  frequency: 0.4,
  damping: 0.4,
};

const handleSpringConfig = {
  frequency: 0.3,
  damping: 1,
};

const leftSockets = ["all audio", "this app", "calls"];
const rightSockets = ["iPhone speaker", "george's AirPods", "kitchen", "other devices"];

export const WireAndSockets = () => {
  const leftSocketRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rightSocketRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [topLeftSocketMeasureRefFn, topLeftSocketMeasure] = useMeasure();
  const [bottomRightSocketMeasureRefFn, bottomRightSocketMeasure] = useMeasure();
  const slackLength = distance(
    { x: topLeftSocketMeasure.left, y: topLeftSocketMeasure.top },
    { x: bottomRightSocketMeasure.left, y: bottomRightSocketMeasure.top }
  );

  const lastValidCoord = useRef<Point2D>({ x: 0, y: 0 });

  const [leftHandleStyle, leftHandleAnim] = useSpring(() => ({
    x: 0,
    y: 0,
    config: handleSpringConfig,
  }));
  const [rightHandleStyle, rightHandleAnim] = useSpring(() => ({
    x: 0,
    y: 0,
    config: handleSpringConfig,
  }));

  const leftHandleRef = useRef<HTMLDivElement>(null);
  useDrag(
    ({ offset: [x, y], last, first }) => {
      if (first) {
        lastValidCoord.current = { x: leftHandleStyle.x.get(), y: leftHandleStyle.y.get() };
      }

      updatePos(0, [x, y]);

      if (last) {
        let foundNewValidCoords = false;

        for (const el of leftSocketRefs.current) {
          if (!el) continue;

          const { left, top } = el?.getBoundingClientRect();
          if (
            x > left - ALLOWED_BOUND_X &&
            x < left + ALLOWED_BOUND_X &&
            y > top - ALLOWED_BOUND_Y &&
            y < top + ALLOWED_BOUND_Y
          ) {
            updatePos(0, [left, top], "no-and-animate-handle");
            foundNewValidCoords = true;
            break;
          }
        }

        if (!foundNewValidCoords) {
          updatePos(
            0,
            [lastValidCoord.current.x, lastValidCoord.current.y],
            "no-and-animate-handle"
          );
        }
      }
    },
    {
      target: leftHandleRef,
      from: () => [leftHandleStyle.x.get(), leftHandleStyle.y.get()],
    }
  );
  const rightHandleRef = useRef<HTMLDivElement>(null);
  useDrag(
    ({ offset: [x, y], first, last }) => {
      if (first) {
        lastValidCoord.current = { x: rightHandleStyle.x.get(), y: rightHandleStyle.y.get() };
      }

      updatePos(1, [x, y]);

      if (last) {
        let foundNewValidCoords = false;

        for (const el of rightSocketRefs.current) {
          if (!el) continue;

          const { left, top } = el?.getBoundingClientRect();
          if (
            x > left - ALLOWED_BOUND_X &&
            x < left + ALLOWED_BOUND_X &&
            y > top - ALLOWED_BOUND_Y &&
            y < top + ALLOWED_BOUND_Y
          ) {
            updatePos(1, [left, top], "no-and-animate-handle");
            break;
          }

          if (!foundNewValidCoords) {
            updatePos(
              1,
              [lastValidCoord.current.x, lastValidCoord.current.y],
              "no-and-animate-handle"
            );
          }
        }
      }
    },
    {
      target: rightHandleRef,
      from: () => [rightHandleStyle.x.get(), rightHandleStyle.y.get()],
    }
  );

  const ropeRef = useRef<SVGPathElement>(null);
  const [, anim] = useSpring(() => ({
    x: 0,
    y: 0,
    onChange(v) {
      const ropeEl = ropeRef.current;
      if (!ropeEl) return;

      ropeRef.current.setAttribute(
        "d",
        `M ${leftHandleStyle.x.get() + SOCKET_WIDTH / 2} ${
          leftHandleStyle.y.get() + SOCKET_WIDTH / 2
        } Q ${v.value.x} ${v.value.y} ${rightHandleStyle.x.get() + SOCKET_WIDTH / 2} ${
          rightHandleStyle.y.get() + SOCKET_WIDTH / 2
        }`
      );
    },
    config: ropeSpringConfig,
  }));

  // for debugging: control point (the point determines what curve would be drawn) TODO remove
  const cirleRef = useRef<SVGCircleElement>(null);

  function calculateDecline(immediate = false) {
    const decline = slackDecline(
      {
        x: leftHandleStyle.x.get() + SOCKET_WIDTH / 2,
        y: leftHandleStyle.y.get() + SOCKET_WIDTH / 2,
      },
      {
        x: rightHandleStyle.x.get() + SOCKET_WIDTH / 2,
        y: rightHandleStyle.y.get() + SOCKET_WIDTH / 2,
      },
      slackLength
    );

    const midpointX = (leftHandleStyle.x.get() + rightHandleStyle.x.get()) / 2 + SOCKET_WIDTH / 2;
    const midpointY =
      (leftHandleStyle.y.get() + rightHandleStyle.y.get()) / 2 + decline + SOCKET_WIDTH / 2;
    anim.start({
      x: midpointX,
      y: midpointY,
      immediate: immediate,
      // TODO if decline is 0 make a stiff anim, ref. https://codesandbox.io/s/framer-motion-imperative-animation-controls-44mgz?file=/src/index.tsx:532-707
      // you would need a functon in `config` for stiff because you'd only need
      // stiff anim along y-axis as it has the decline, not x
      // config: decline === 0 ? stiffSpringConfig : ropeSpringConfig,
    });

    if (debug && cirleRef.current) {
      cirleRef.current.setAttribute("cx", midpointX + "");
      cirleRef.current.setAttribute("cy", midpointY + "");
    }
  }

  function updatePos(
    idx: 0 | 1 /* left or right socket */,
    [x, y]: [number, number],
    immediate: "yes" | "no-and-animate-handle" | "no" = "no"
  ) {
    let pos =
      immediate === "yes"
        ? { x, y }
        : clamp2D(
            slackLength,
            { x, y },
            idx === 0
              ? { x: rightHandleStyle.x.get(), y: rightHandleStyle.y.get() }
              : { x: leftHandleStyle.x.get(), y: leftHandleStyle.y.get() }
          );

    (idx === 0 ? leftHandleAnim : rightHandleAnim).start({
      x: pos.x,
      y: pos.y,
      immediate: immediate !== "no-and-animate-handle",
      onChange() {
        calculateDecline(immediate === "yes");
      },
    });
  }

  useEffect(() => {
    const leftHandleEl = leftHandleRef.current;
    const rightHandleEl = rightHandleRef.current;
    if (!(leftHandleEl && rightHandleEl)) return;
    if (slackLength === 0) return;

    const leftSocketMeasure = leftSocketRefs.current[1]?.getBoundingClientRect();
    const rightSocketMeasure = rightSocketRefs.current[2]?.getBoundingClientRect();
    if (!(leftSocketMeasure && rightSocketMeasure)) {
      throw new Error(
        "Failed during initialisation. Check if the sockets to put on initially are available."
      );
    }

    updatePos(0, [leftSocketMeasure.left, leftSocketMeasure.top], "yes");
    updatePos(1, [rightSocketMeasure.left, rightSocketMeasure.top], "yes");
  }, [slackLength]);

  return (
    <DefaultLayout className="cursor-touch select-none">
      <div
        className={cn(
          "min-h-screen grid place-items-center pb-32 bg-slate-800",
          // TODO not working
          slackLength === 0 && "invisible"
        )}
      >
        <div className="w-[540px] grid grid-cols-2 rounded bg-slate-400 gap-28">
          <ul>
            {leftSockets.map((socket, i) => (
              <Item key={i}>
                <span className="mr-3 flex-1">{socket}</span>
                <Socket
                  ref={(el) => {
                    leftSocketRefs.current[i] = el;
                    if (i === 0) topLeftSocketMeasureRefFn(el);
                  }}
                />
              </Item>
            ))}
          </ul>
          <ul>
            {rightSockets.map((socket, i) => (
              <Item key={i}>
                <span className="mr-3 flex-1">{socket}</span>
                <Socket
                  ref={(el) => {
                    rightSocketRefs.current[i] = el;
                    if (i === rightSockets.length - 1) bottomRightSocketMeasureRefFn(el);
                  }}
                />
              </Item>
            ))}
          </ul>
        </div>
      </div>
      <a.div
        data-id="handle-left"
        ref={leftHandleRef}
        style={leftHandleStyle}
        className={`${socketDimensionClassName} bg-pink-300 rounded-full fixed z-20 top-0 left-0 touch-none`}
      />
      <a.div
        data-id="handle-right"
        ref={rightHandleRef}
        style={rightHandleStyle}
        className={`${socketDimensionClassName} bg-violet-300 rounded-full fixed z-20 top-0 left-0 touch-none`}
      />
      <svg className="fixed top-0 left-0 z-10 w-full h-full">
        <path
          ref={ropeRef}
          d={`M 
          ${leftHandleStyle.x.get() + SOCKET_WIDTH / 2} 
          ${leftHandleStyle.y.get() + SOCKET_WIDTH / 2} 
          Q 
          ${(leftHandleStyle.x.get() + rightHandleStyle.x.get()) / 2 + SOCKET_WIDTH / 2} 
          ${
            (leftHandleStyle.y.get() + rightHandleStyle.y.get()) / 2 + SOCKET_WIDTH / 2
            /*  no need to add decline here as this would be overwritten anyway */
          }
          ${rightHandleStyle.x.get() + SOCKET_WIDTH / 2}
          ${rightHandleStyle.y.get() + SOCKET_WIDTH / 2}`}
          strokeWidth={5}
          fill="none"
          className={cn("transition-colors ease-in-out stroke-gray-500", true && "stroke-pink-600")}
        />
        {/* control point  TODO remove */}
        <circle
          className={cn(!debug && "hidden")}
          ref={cirleRef}
          cx="50"
          cy="50"
          r="5"
          fill="magenta"
        />
      </svg>
    </DefaultLayout>
  );
};

const Item = forwardRef<HTMLLIElement, WC>((props, ref) => {
  return (
    <li ref={ref} className="px-4 py-2 flex items-center">
      {props.children}
    </li>
  );
});

const Socket = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div className="shrink-0 p-1 bg-slate-500 grid place-items-center rounded-full">
      <div ref={ref} className={`${socketDimensionClassName} rounded-full bg-slate-100`} />
    </div>
  );
});

const slackDecline = (point1: Point2D, point2: Point2D, slackLength: number) => {
  const d = slackLength - distance(point1, point2);
  return Math.max(Math.min(slackLength, d), 0);
};
