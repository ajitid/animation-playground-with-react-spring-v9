// inspiration: https://twitter.com/GK3/status/1545071311029805057
// replicated:
// - https://twitter.com/ralex1993/status/1545192456920059904
// - https://twitter.com/aashudubey_ad/status/1571250425772544000 | permalink: https://github.com/Aashu-Dubey/react-native-animation-samples/blob/7ed8c6f76526317b029feb7d848070321368d0e3/src/samples/rope_physics/RopeViewSvg.tsx#L93
import { forwardRef, useRef, useEffect } from "react";
import { FC, WC } from "@/shared/types";
import { distance } from "@/uff/distance";
import {} from "@heroicons/react/24/outline";
import useMeasure from "react-use-measure";
import { a, config, SpringConfig } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import cn from "clsx";

import { DefaultLayout } from "@/default-layout";
import { useSpring } from "@react-spring/web";
import { Point } from "@/uff/types";

const SOCKET_WIDTH = 32;
const socketDimensionClassName = `w-[32px] h-[32px]`;

const debug = false;

const ropeSpringConfig = {
  frequency: 0.4,
  damping: 0.4,
};

export const WireAndSockets = () => {
  const [topLeftSocketMeasureRefFn, topLeftSocketMeasure] = useMeasure();
  const [bottomRightSocketMeasureRefFn, bottomRightSocketMeasure] = useMeasure();
  const slackLength = distance(
    { x: topLeftSocketMeasure.x, y: topLeftSocketMeasure.y },
    { x: bottomRightSocketMeasure.x, y: bottomRightSocketMeasure.y }
  );

  const handlePosRef = useRef([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ]);
  const leftHandleRef = useRef<HTMLDivElement>(null);
  useDrag(
    ({ offset: [x, y] }) => {
      updatePos(0, [x, y]);
    },
    {
      target: leftHandleRef,
      from: () => [handlePosRef.current[0].x, handlePosRef.current[0].y],
    }
  );
  const rightHandleRef = useRef<HTMLDivElement>(null);
  useDrag(
    ({ offset: [x, y] }) => {
      updatePos(1, [x, y]);
    },
    {
      target: rightHandleRef,
      from: () => [handlePosRef.current[1].x, handlePosRef.current[1].y],
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
        `M ${handlePosRef.current[0].x + SOCKET_WIDTH / 2} ${
          handlePosRef.current[0].y + SOCKET_WIDTH / 2
        } Q ${v.value.x} ${v.value.y} ${handlePosRef.current[1].x + SOCKET_WIDTH / 2} ${
          handlePosRef.current[1].y + SOCKET_WIDTH / 2
        }`
      );
    },
    config: ropeSpringConfig,
  }));

  // for debugging: control point (the point determines what curve would be drawn) TODO remove
  const cirleRef = useRef<SVGCircleElement>(null);

  function updatePos(idx: 0 | 1 /* left or right socket */, [x, y]: [number, number]) {
    const pos = handlePosRef.current[idx];
    let handleEl = idx === 0 ? leftHandleRef.current : rightHandleRef.current;
    if (!handleEl) return;

    pos.x = x;
    pos.y = y;
    // Both translate3d and translate with Z-axis invoke GPU anim, ref: https://discord.com/channels/341919693348536320/716908973713784904/1049619845471273011
    handleEl.style.setProperty("transform", `translate3d(${x}px, ${y}px, 0px)`);

    // spring
    const decline = slackDecline(
      {
        x: handlePosRef.current[0].x + SOCKET_WIDTH / 2,
        y: handlePosRef.current[0].y + SOCKET_WIDTH / 2,
      },
      {
        x: handlePosRef.current[1].x + SOCKET_WIDTH / 2,
        y: handlePosRef.current[1].y + SOCKET_WIDTH / 2,
      },
      slackLength
    );

    const midpointX =
      (handlePosRef.current[0].x + handlePosRef.current[1].x) / 2 + SOCKET_WIDTH / 2;
    const midpointY =
      (handlePosRef.current[0].y + handlePosRef.current[1].y) / 2 + decline + SOCKET_WIDTH / 2;
    anim.start({
      x: midpointX,
      y: midpointY,
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

  useEffect(() => {
    const leftHandleEl = leftHandleRef.current;
    const rightHandleEl = rightHandleRef.current;
    if (!(leftHandleEl && rightHandleEl)) return;

    updatePos(0, [topLeftSocketMeasure.x, topLeftSocketMeasure.y]);
    updatePos(1, [bottomRightSocketMeasure.x, bottomRightSocketMeasure.y]);
  }, [slackLength]);

  return (
    <DefaultLayout>
      <div
        className={cn(
          "min-h-screen grid place-items-center pb-32 bg-slate-800",
          // TODO not working
          slackLength === 0 && "invisible"
        )}
      >
        <div className="w-[540px] grid grid-cols-2 rounded bg-slate-400 gap-28">
          <ul>
            <Item>
              <span className="mr-3 flex-1">all audio</span>
              <Socket ref={topLeftSocketMeasureRefFn} />
            </Item>
            <Item>
              <span className="mr-3 flex-1">this app</span>
              <Socket />
            </Item>
            <Item>
              <span className="mr-3 flex-1">calls</span>
              <Socket />
            </Item>
          </ul>
          <ul>
            <Item>
              <span className="mr-3 flex-1">iPhone speaker</span>
              <Socket />
            </Item>
            <Item>
              <span className="mr-3 flex-1">george's AirPods</span>
              <Socket />
            </Item>
            <Item>
              <span className="mr-3 flex-1">kitchen</span>
              <Socket />
            </Item>
            <Item>
              <span className="mr-3 flex-1">other devices</span>
              <Socket ref={bottomRightSocketMeasureRefFn} />
            </Item>
          </ul>
        </div>
      </div>
      <div
        data-id="handle-left"
        ref={leftHandleRef}
        className={`${socketDimensionClassName} bg-pink-300 rounded-full fixed z-20 top-0 left-0 touch-none`}
      ></div>
      <div
        data-id="handle-right"
        ref={rightHandleRef}
        className={`${socketDimensionClassName} bg-violet-300 rounded-full fixed z-20 top-0 left-0 touch-none`}
      ></div>
      <svg className="fixed top-0 left-0 z-10 w-full h-full bg-black">
        <path
          ref={ropeRef}
          d={`M 
          ${handlePosRef.current[0].x + SOCKET_WIDTH / 2} 
          ${handlePosRef.current[0].y + SOCKET_WIDTH / 2} 
          Q 
          ${(handlePosRef.current[0].x + handlePosRef.current[1].x) / 2 + SOCKET_WIDTH / 2} 
          ${
            (handlePosRef.current[0].y + handlePosRef.current[1].y) / 2 + SOCKET_WIDTH / 2
            /*  no need to add decline here as this would be overwritten anyway */
          }
          ${handlePosRef.current[1].x + SOCKET_WIDTH / 2}
          ${handlePosRef.current[1].y + SOCKET_WIDTH / 2}`}
          stroke="red"
          strokeWidth={5}
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
    <li ref={ref} className="px-4 py-3 flex items-center">
      {props.children}
    </li>
  );
});

const Socket = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div className="shrink-0 p-1 bg-slate-500 grid place-items-center rounded-full">
      <div
        ref={ref}
        className={`${socketDimensionClassName} rounded-full shadow-lg bg-slate-100`}
      />
    </div>
  );
});

const slackDecline = (point1: Point, point2: Point, slackLength: number) => {
  const distance = slackLength - Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
  return Math.max(Math.min(slackLength, distance), 0);
};
