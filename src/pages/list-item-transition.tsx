import { useState } from "react";
import { a, useTransition } from "@react-spring/web";
import { nanoid } from "nanoid";

import { DefaultLayout } from "@/default-layout";

type Item = { id: string; text: string };

export const ListItemTransition = () => {
  const [slowdown, setSlowdown] = useState(false);

  const [items, setItems] = useState<Item[]>([]);
  const addItem = () => {
    setItems((prevItems) => {
      // generate random text
      const num = prevItems.length + 1;
      let text = "";
      for (let i = 0; i <= 12; i++) {
        text += num + " ";
      }

      const insertionIdx = Math.round(Math.random() * prevItems.length);

      return [
        ...prevItems.slice(0, insertionIdx),
        { id: nanoid(), text },
        ...prevItems.slice(insertionIdx),
      ];
    });
  };
  const removeItem = (idx: number) => {
    setItems((prevItems) => {
      const items = [...prevItems];
      items.splice(idx, 1);
      return items;
    });
  };

  // better than useMemo, won't be evicted if memory goes low
  const [itemToElMap] = useState(() => new WeakMap<Item, HTMLDivElement | null>());

  const transition = useTransition(items, {
    from: { opacity: 0.2, scale: 0.8, height: 0 },
    /*
      Taken from the comment https://github.com/pmndrs/react-spring/issues/521#issuecomment-467644794
      in which Paul Henschel mentions this https://github.com/pmndrs/react-spring-examples/blob/HEAD@%7B2019-02-26T22:40:56Z%7D/demos/hooks/notification-hub/index.js
      New version: https://codesandbox.io/s/spring-notification-hub-md4cj?file=/src/App.tsx
      For how async update works, see Alec Larson's https://youtu.be/5QCYBiANRYs?t=987 and https://aleclarson.github.io/react-spring/v9/
    */
    enter: (item) => async (set) => {
      let height: number | string = "auto";
      const el = itemToElMap.get(item);
      if (el) {
        const style = getComputedStyle(el);
        height =
          parseFloat(style.height.replace("px", "")) +
          parseFloat(style.marginTop.replace("px", "")) +
          parseFloat(style.marginBottom.replace("px", ""));
      }

      await set({
        opacity: 1,
        scale: 1,
        height: height,
      });
    },
    leave: { opacity: 0.2, scale: 0.8, height: 0 },
    keys: (v) => v.id,
    config: {
      frequency: slowdown ? 2 : undefined,
    },
  });

  return (
    <DefaultLayout>
      <div className="px-3 py-2">
        <div>
          <button className="mr-3 px-3 py-1 bg-emerald-700 text-white rounded" onClick={addItem}>
            Add a message
          </button>
          <label className="mr-3">
            <input type="checkbox" checked={slowdown} onChange={() => setSlowdown((v) => !v)} />{" "}
            Slow down
          </label>
          <span className="text-gray-700">Click on a message to remove</span>
        </div>
        <div className="mt-2">
          {transition((style, item, _, idx) => (
            /*
                This is written in the same vein as
                src/bb10-text-transition.tsx: measure with inner div and apply
                style on outer div.

                Using padding instead of margin and/or pulling styles into a
                direct children isn't unique to react-spring though, here's
                Framer Motion: 
                https://github.com/framer/motion/issues/368
                https://youtu.be/QTptUftCIdA?t=overfl143 
                FLIP, tricks like the above, makes UI animation on the web feel
                hacky and they are.
              */
            <a.div style={style} className="overflow-hidden origin-left">
              <div
                ref={(el) => {
                  itemToElMap.set(item, el);
                }}
                className="my-0.5 inline-block"
              >
                <button
                  className="bg-slate-200 rounded-full py-2 px-4 inline-block w-full text-left"
                  onClick={() => removeItem(idx)}
                >
                  {item.text}
                </button>
              </div>
            </a.div>
          ))}
        </div>
      </div>
    </DefaultLayout>
  );
};
