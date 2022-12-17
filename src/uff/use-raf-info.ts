import { raf } from "@react-spring/shared";

import { clamp } from "./clamp";

let lastT = Math.round(raf.now());
const info = {
  timeDelta: 0,
};

raf(() => {
  const now = Math.round(raf.now());
  // Framer Motion clamps timedelta for safe measure. I've done it for the same reason
  // ref. https://github.com/framer/motion/blob/bb7ee043bff53c2a817c599805d6d3e71308b640/packages/framer-motion/src/frameloop/index.ts#L50
  info.timeDelta = clamp(1, 40, now - lastT);
  lastT = now;
  return true;
});

/**
 * @returns An object containing `timeDelta`.
 * Always do `info.timeDelta` and not destructure it.
 */
export const useRafInfo = () => {
  return info;
};
