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
import type { FrameValue, SpringUpdate } from "@react-spring/web";
import { addFluidObserver, removeFluidObserver } from "@react-spring/shared";

import { useRafInfo } from "./use-raf-info";

export const useVelocity = <T>(springValue: FrameValue<T>, springProps?: SpringUpdate<number>) => {
  const rafInfo = useRafInfo();

  const velocity = useSpringValue<number>(0, springProps);

  useEffect(() => {
    let previousValue = springValue.get();

    const updateVelocity = (ev: FrameValue.Event<T>) => {
      if (ev.type !== "change" && ev.type !== "idle") return;

      const value = springValue.get();

      /*
        react-spring:
        - for spring.start()
          - plays ev.type = change with ev.idle = false
          - and on end of anim runs ev.type = idle once
        - for spring.set() 
          - runs ev.type = change with ev.idle = true once 
        We are inferring if `spring.set()` is used using used this way.
      */
      const isSetUsed = ev.type === "change" && ev.idle;

      if (typeof value !== "number" || typeof previousValue !== "number" || isSetUsed) {
        previousValue = value;
        velocity.set(0);
        return;
      }

      let newVelocity = (value - previousValue) / rafInfo.timeDelta;
      previousValue = value;
      // These cases should never happen but just in case:
      // - Checking w/ Infinity in case time difference equated to zero
      // - Checking w/ NaN in case one of the value is undefined
      if (Math.abs(newVelocity) === Infinity || isNaN(newVelocity)) {
        newVelocity = 0;
      }
      velocity.set(newVelocity * 1000); // ×1000 to get velocity per second
    };

    addFluidObserver(springValue, updateVelocity);
    return () => {
      removeFluidObserver(springValue, updateVelocity);
      velocity.set(0);
    };
  }, [springValue, velocity]);

  return velocity;
};
