/**
@file

Derive velocity so you can compute acceleration too. This computed velocity
would always be different from what react-spring gives because react-spring
computes from spring config rather relying on raf

@example

```js
const x = useSpringValue(0) // or `const {x} = useSpring({x: 0})` 
const xVelocity = useVelocity(x)
const xAcceleration = useVelocity(xVelocity)
// or anything I guess https://qr.ae/prIsxa https://en.wikipedia.org/wiki/Jerk_(physics)
```

@see

Inspo.: framer-motion
https://www.framer.com/docs/use-velocity/#:~:text=(x)-,const%20xAcceleration%20%3D%20useVelocity(xVelocity),-COPY
*/

import { useEffect } from "react";
import { useSpringValue } from "@react-spring/web";
import type { FrameValue } from "@react-spring/web";
import { addFluidObserver, removeFluidObserver, raf } from "@react-spring/shared";

export const useVelocity = <T>(springValue: FrameValue<T>) => {
  const velocity = useSpringValue<number>(0);

  useEffect(() => {
    let previousValue = springValue.get();
    let previousTime = Math.round(raf.now());

    const updateVelocity = (ev: FrameValue.Event<T>) => {
      const value = springValue.get();
      const time = Math.round(raf.now());

      switch (ev.type) {
        case "change": {
          if (typeof value !== "number" || typeof previousValue !== "number") {
            previousValue = value;
            previousTime = time;
            velocity.set(0);
            break;
          }

          let newVelocity = (value - previousValue) / (time - previousTime);
          previousValue = value;
          previousTime = time;
          // These cases should never happen but just in case:
          // - Checking w/ Infinity in case time difference equated to zero
          // - Checking w/ NaN in case one of the value is undefined
          if (Math.abs(newVelocity) === Infinity || isNaN(newVelocity)) {
            newVelocity = 0;
          }
          velocity.set(newVelocity * 1000); // ×1000 to get velocity per second
          break;
        }
        case "idle":
        case "priority":
          break;
        default: {
          // type exhaustion
          const _: never = ev;
        }
      }
    };

    addFluidObserver(springValue, updateVelocity);
    return () => {
      removeFluidObserver(springValue, updateVelocity);
      velocity.set(0);
    };
  }, [springValue, velocity]);

  return velocity;
};
