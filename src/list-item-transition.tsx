import { useState } from "react";

import { DefaultLayout } from "./default-layout";

export const ListItemTransition = () => {
  const [items, setItems] = useState<string[]>([]);
  const addItem = () => {
    setItems((prevItems) => {
      const num = prevItems.length + 1;
      let text = "";
      for (let i = 0; i <= 12; i++) {
        text += num + " ";
      }
      return [...prevItems, text];
    });
  };
  const removeItem = () => {
    setItems((prevItems) => {
      return prevItems.slice(0, prevItems.length - 1);
    });
  };

  return (
    <DefaultLayout>
      <div className="px-3 py-2">
        <div>
          <button className="mr-2" onClick={addItem}>
            add
          </button>
          <button onClick={removeItem}>remove</button>
        </div>
        <div>
          {items.map((item) => (
            <div key={item} className="p-2 bg-slate-100 my-2">
              {item}
            </div>
          ))}
        </div>
      </div>
    </DefaultLayout>
  );
};
