// Inspiration: https://twitter.com/jmtrivedi/status/1521190109617410048
// Draggable list code taken from here: https://codesandbox.io/s/github/pmndrs/react-spring/tree/master/demo/src/sandboxes/draggable-list?file=/src/App.tsx:877-1033

import { DefaultLayout } from "@/default-layout";
import { noop } from "@/shared/utils";
import { clamp } from "@/uff/clamp";
import { moveArrayItem } from "@/uff/moveArrayItem";
import { useSprings, a } from "@react-spring/web";
import type { useSpring } from "@react-spring/web";
import { raf } from "@react-spring/rafz";
import { useDrag } from "@use-gesture/react";
import { useEffect, useRef } from "react";
import { to } from "@/uff/to";
import { useControls } from "leva";

const items = [
  "🥝 Groceries",
  "🍿 Netflix Watchlist",
  "👉 Follow-ups",
  "⏲️ Reminders",
  "🌟 Design Inspirations",
  "🧢 < 10 mins tasks",
  "📨 Work stuff",
  "🦦 Past time",
];

/*
  TODO
  - fix somrero name in filenames and in code
  - flick anim (project/deceleration rate)
  - better sombero https://twitter.com/_chenglou/status/1521230129019588608?s=20&t=2Jk69IYFKO6DH_sZf62-QA
*/

const ITEM_HEIGHT = 24 + /* padding */ 12 * 2;

export const FluidSomberoList = () => {
  const { bind, springs } = useDraggable(items);

  return (
    <DefaultLayout className="pb-6 grid place-items-center bg-sky-50 cursor-touch">
      <div className="w-[400px] h-[650px] border rounded-md bg-white drop-shadow-xl py-3 px-4 overflow-hidden">
        <h1 className="mb-1 text-2xl">To-Do List</h1>
        <p className="mb-2 text-gray-600 text-sm">
          Drag and drop an item to see a ripple (sombero) effect.
        </p>
        <ul className="relative">
          {springs.map(({ zIndex, y, scale }, i) => {
            return (
              <a.li
                {...bind(i)}
                key={i}
                // add backdrop opacity
                className="py-3 px-2 select-none absolute touch-none w-full rounded-md transition-colors active:bg-blue-200 active:border-2 active:border-sky-600"
                style={{
                  zIndex,
                  y,
                  scale,
                }}
                children={items[i]}
              />
            );
          })}
        </ul>
      </div>
    </DefaultLayout>
  );
};

const updateSpring =
  (
    order: number[],
    active = false,
    originalIndex = 0,
    curIndex = 0,
    y = 0,
    last = false,
    done: (originalIndex: number) => void = noop
  ) =>
  (index: number): Parameters<typeof useSpring>[0] => {
    let isDoneFired = false;

    return active && index === originalIndex
      ? {
          y: curIndex * ITEM_HEIGHT + y,
          scale: 1.04,
          zIndex: 1,
          immediate: (key) => key === "y" || key === "zIndex",
        }
      : !active && last && index === originalIndex
      ? {
          y: order.indexOf(index) * ITEM_HEIGHT,
          scale: 1,
          zIndex: 0,
          immediate: false,
          onChange(v) {
            if (Math.abs(order.indexOf(index) * ITEM_HEIGHT - v.value.y) < 5 && !isDoneFired) {
              isDoneFired = true;
              done(index);
            }
          },
        }
      : {
          y: order.indexOf(index) * ITEM_HEIGHT,
          scale: 1,
          zIndex: 0,
          immediate: false,
        };
  };

const useDraggable = (items: string[]) => {
  const order = useRef(items.map((_, index) => index)); // Store indicies as a local ref, this represents the item order
  const [springs, api] = useSprings(items.length, updateSpring(order.current)); // Create springs, each corresponds to an item, controlling its transform, scale, etc.

  // sombrero
  const done = (originOriginalIndex: number) => {
    const startTime = raf.now(); // this exists, otherwise would've used performance.now()

    const T = 400;

    raf(() => {
      const now = raf.now();
      const t = Math.round(now - startTime);
      const originCurIndex = order.current.indexOf(originOriginalIndex);

      api.start((orginalIndex) => {
        const curIndex = order.current.indexOf(orginalIndex);
        const farCount = Math.abs(curIndex - originCurIndex);

        // you'd need https://www.desmos.com/calculator to visualize all this
        //
        // TL;DR 2.5 is chosen because at 3 sombrero stars touching x-axis
        // and farCount coeff. (the constant to which farCount is multiplied below) is small
        // because that moves the whole graph towards neg. x-axis i.e. increasing it would make
        //  the effect between the items more pronounced but would also reduce the spread of the effect through items.
        // Also try playing with interpolated `out` range `const scale = to(...`
        const v = (t / T) * 2.5 + farCount * 0.7;
        const intensity = Math.sin(v) / v;

        const scale = to([0, 1], [0.94, 0.82], clamp(0, 1, intensity));

        return {
          scale,
        };
      });

      if (now - startTime < T) {
        return true;
      } else {
        api.start(() => ({ scale: 1 }));
      }
    });
  };

  const bind = useDrag(
    ({ args: [originalIndex], active, movement: [, y], last }) => {
      const curIndex = order.current.indexOf(originalIndex);
      const curRow = clamp(
        0,
        items.length - 1,
        Math.round((curIndex * ITEM_HEIGHT + y) / ITEM_HEIGHT)
      );
      const newOrder = moveArrayItem(order.current, curIndex, curRow);
      api.start(updateSpring(newOrder, active, originalIndex, curIndex, y, last, done)); // Feed springs new style data, they'll animate the view without causing a single render
      if (!active) order.current = newOrder;
    },
    { filterTaps: true }
  );

  return { springs, bind };
};
