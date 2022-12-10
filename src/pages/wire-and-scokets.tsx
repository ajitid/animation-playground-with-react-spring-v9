// inspiration: https://twitter.com/GK3/status/1545071311029805057
// replicated:
// - https://twitter.com/ralex1993/status/1545192456920059904
// - https://twitter.com/aashudubey_ad/status/1571250425772544000 | permalink: https://github.com/Aashu-Dubey/react-native-animation-samples/blob/7ed8c6f76526317b029feb7d848070321368d0e3/src/samples/rope_physics/RopeViewSvg.tsx#L93
// More inspo. which I didn't implemented:
// - Rope cutting: https://twitter.com/geordiemhall/status/1551105123501604864?s=20&t=e9bk14ER6VXDslvx6-i6LQ
import { forwardRef, useRef, useEffect, useState } from "react";
import { WC } from "@/shared/types";
import { distance } from "@/uff/distance";
import useMeasure from "react-use-measure";
import { a } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import cn from "clsx";

import { DefaultLayout } from "@/default-layout";
import { useSpring } from "@react-spring/web";
import { Point2D } from "@/uff/types";
import { clamp2D } from "@/uff/clamp2d";

/*
  TODO
  - When initiailised, rope and handles are at top left. Doing `slackLength ===
    0 && "invisible"` on DefaultLayout is not enough. Need to find a way.
  - In `calculateDecline` when I do `anim.start`, if decline is 0 (i.e. rope is
    at full length) I need to make a stiff animation, ref.
    https://codesandbox.io/s/framer-motion-imperative-animation-controls-44mgz?file=/src/index.tsx:532-707
    and I would need a functon in `config` for stiff because I'd only need stiff
    anim along y-axis as it has the decline, and not on x-axis
  - We need to render shadow of the rope which suppposed has slightly larger
    decline. Refer to
    https://twitter.com/aashudubey_ad/status/1571250425772544000
  - Better handle styling
    https://twitter.com/GK3/status/1545073404289552384?s=20&t=GaFMgw7-_phqSgkwUmvu7Q
    Have a png/svg/div of some sort to denote it is a handle. Like 3 hamburger lines on the handle to denote it has grip,
    or one plus alert slider has pattern on it, do that  
  - scale up handle while dragging
  - Add instruction that they can drag both handles
*/

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
  const [isConnected, setIsConnected] = useState(true);

  const leftSocketRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rightSocketRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [topLeftSocketMeasureRefFn, topLeftSocketMeasure] = useMeasure();
  const [bottomRightSocketMeasureRefFn, bottomRightSocketMeasure] = useMeasure();
  const slackLength = distance(
    { x: topLeftSocketMeasure.left, y: topLeftSocketMeasure.top },
    { x: bottomRightSocketMeasure.left, y: bottomRightSocketMeasure.top }
  );

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

  const lastValidCoord = useRef<Point2D>({ x: 0, y: 0 });

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

      if (first) {
        setIsConnected(false);
      } else if (last) {
        setIsConnected(true);
      }
    },
    {
      target: leftHandleRef,
      from: () => [leftHandleStyle.x.get(), leftHandleStyle.y.get()],
      filterTaps: true,
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

      if (first) {
        setIsConnected(false);
      } else if (last) {
        setIsConnected(true);
      }
    },
    {
      target: rightHandleRef,
      from: () => [rightHandleStyle.x.get(), rightHandleStyle.y.get()],
      filterTaps: true,
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

  // for debugging: control point (the point that determines what curve would be drawn)
  const cirleRef = useRef<SVGCircleElement>(null);

  const getSlackDecline = () =>
    _getSlackDecline(
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
  const getMidpointX = () =>
    (leftHandleStyle.x.get() + rightHandleStyle.x.get()) / 2 + SOCKET_WIDTH / 2;
  const getMidpointY = () =>
    (leftHandleStyle.y.get() + rightHandleStyle.y.get()) / 2 + getSlackDecline() + SOCKET_WIDTH / 2;

  function calculateDecline(immediate = false) {
    const midpointX = getMidpointX();
    const midpointY = getMidpointY();
    anim.start({
      x: midpointX,
      y: midpointY,
      immediate: immediate,
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
    <DefaultLayout className={cn("cursor-touch select-none")}>
      <div className="min-h-screen grid place-items-center pb-32 bg-slate-800">
        <div className="w-[520px] grid grid-cols-2 rounded bg-slate-400 gap-24 py-2">
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
        className={`${socketDimensionClassName} bg-slate-800 p-1 rounded-full fixed z-20 top-0 left-0 touch-none`}
      >
        <div className={`w-full h-full bg-slate-600 rounded-full`} />
      </a.div>
      <a.div
        data-id="handle-right"
        ref={rightHandleRef}
        style={rightHandleStyle}
        className={`${socketDimensionClassName} bg-slate-800 p-1 rounded-full fixed z-20 top-0 left-0 touch-none`}
      >
        <div className={`w-full h-full bg-slate-600 rounded-full`} />
      </a.div>
      <svg className="fixed top-0 left-0 z-10 w-full h-full">
        <path
          ref={ropeRef}
          d={`M 
          ${leftHandleStyle.x.get() + SOCKET_WIDTH / 2} 
          ${leftHandleStyle.y.get() + SOCKET_WIDTH / 2} 
          Q 
          ${getMidpointX()} ${getMidpointY()}
          ${rightHandleStyle.x.get() + SOCKET_WIDTH / 2}
          ${rightHandleStyle.y.get() + SOCKET_WIDTH / 2}`}
          strokeWidth={5}
          fill="none"
          className={cn(
            "transition-colors ease-in-out stroke-gray-500",
            isConnected && "stroke-sky-900"
          )}
        />
        {/* for debugging: control point (the point that determines what curve would be drawn) */}
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
    <div ref={ref} className={`${socketDimensionClassName} shrink-0 rounded-full bg-slate-100`} />
  );
});

const _getSlackDecline = (point1: Point2D, point2: Point2D, slackLength: number) => {
  const d = slackLength - distance(point1, point2);
  return Math.max(Math.min(slackLength, d), 0);
};
