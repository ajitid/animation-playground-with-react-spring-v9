// Inspiration: https://twitter.com/jmtrivedi/status/1521190109617410048
// Draggable list code taken from here: https://codesandbox.io/s/github/pmndrs/react-spring/tree/master/demo/src/sandboxes/draggable-list?file=/src/App.tsx:877-1033

/*
  TODO This doesn't replicates sombrero properly. Ref. https://twitter.com/ajitid/status/1601826603742351361?s=20&t=gQ0VGxLJEX1TrWWcd3Ws8g
  Also, use this:
  import { useControls } from "leva";
  ^ do note that out of focus is needed when using text input
*/

import { DefaultLayout } from "@/default-layout";
import { noop } from "@/shared/utils";
import { clamp } from "@/uff/clamp";
import { moveArrayItem } from "@/uff/move-array-item";
import { useSprings, a } from "@react-spring/web";
import type { useSpring } from "@react-spring/web";
import { raf } from "@react-spring/rafz";
import { useDrag } from "@use-gesture/react";
import { useEffect, useRef } from "react";
import { to } from "@/uff/to";

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
  - better sombrero https://twitter.com/_chenglou/status/1521230129019588608?s=20&t=2Jk69IYFKO6DH_sZf62-QA
*/

const ITEM_HEIGHT = 24 + /* padding */ 12 * 2 + /* border */ 2 * 2;

export const FluidSombreroList = () => {
  const { bind, springs } = useDraggable(items);

  return (
    <DefaultLayout className="pb-6 grid place-items-center bg-sky-50 cursor-touch select-none">
      <div className="w-[400px] h-[650px] border rounded-md bg-white drop-shadow-xl py-3 px-4 overflow-hidden">
        <h1 className="mb-1 text-2xl">To-Do List</h1>
        <p className="mb-2 text-gray-600 text-sm">
          Drag and drop an item to see a ripple (sombrero) effect.
        </p>
        <ul className="relative">
          {springs.map(({ zIndex, y, scale }, i) => {
            return (
              <a.li
                {...bind(i)}
                key={i}
                // add backdrop opacity
                className="py-3 px-2 select-none absolute touch-none w-full rounded-md transition-colors active:bg-blue-200 border-2 border-transparent active:border-sky-600"
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
            if (Math.abs(order.indexOf(index) * ITEM_HEIGHT - v.value.y) < 8 && !isDoneFired) {
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
    let startTime: number | null = null; // this exists, otherwise would've used performance.now()

    const T = 600;
    raf(() => {
      const now = raf.now();
      if (startTime === null) {
        // doing this is better than manually subtract framerate at `t`
        // see https://twitter.com/_chenglou/status/1592801426090389505
        // and https://twitter.com/_chenglou/status/1588050903868637184
        startTime = now;
      }
      const t = Math.round(now - startTime);

      const originCurIndex = order.current.indexOf(originOriginalIndex);
      api.start((orginalIndex) => {
        const curIndex = order.current.indexOf(orginalIndex);
        const farIndex = Math.abs(curIndex - originCurIndex);

        const osc = Math.min(t / T, 1) * Math.PI;
        const v =
          // constant offset:
          // skip the (first) peak graph of the hat for all indices
          Math.PI +
          // variable offset:
          // Set start pos. of each item on the basis of how far it is from the item dropped
          // The farther it is, the less pronounced scale effect for it will be.
          // We want this to be a multiplier of 2 (ie. farIndex * Math.PI * 2n),
          // so that all the items move in conherence (all scale down at same time or scale up at same time).
          farIndex * Math.PI * 2 +
          // wave progress:
          // tells how many ripples (crest or trough) it should animate withing the duration specified
          osc * 2;
        // you'd need https://www.desmos.com/calculator to visualize all this
        const intensity = Math.sin(v) / v;

        const deviationCoeff =
          // play with this to adjust how pronounced the effect you want to be
          // esp. on the item which has been dragged and dropped
          0.66 +
          /*
          That farther we go the less discernable the effect is, so we slightly amp it up for those ends. 
          This make the animation feel more lively.
         */
          farIndex * 0.33;
        const x = 1;
        // ^ This `1` could've been 9000, it wouldn't have mattered.
        const scale = to([-x, x], [1 - x * deviationCoeff, 1 + x * deviationCoeff], intensity);
        // ^ scale: 1 is what we want at the end of anim, that's why `1` has been used here

        return {
          scale,
          delay: 42 * farIndex,
          immediate: false,
        };
      });

      return now - startTime < T;
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
