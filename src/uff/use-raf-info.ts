import { raf } from "@react-spring/shared";

let lastT = Math.round(raf.now());
const info = {
  timeDelta: 0,
};

raf(() => {
  const now = Math.round(raf.now());
  info.timeDelta = now - lastT;
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
